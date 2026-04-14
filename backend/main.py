import os
import json
import pickle
import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from recommendation import generate_recommendations
from train import run_training_pipeline
from pydantic import BaseModel

class MLFeatures(BaseModel):
    Recency: float
    Frequency: float
    Monetary: float
    AvgOrderValue: float
    PurchaseFreqPerMonth: float

app = FastAPI(title="Customer Segmentation API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load artifacts sequentially at startup
features_df = None
scaler = None
kmeans = None
best_model = None
metrics = None
summary = None

@app.on_event("startup")
def load_artifacts():
    global features_df, scaler, kmeans, best_model, metrics, summary
    try:
        if os.path.exists('artifacts/features.csv'):
            features_df = pd.read_csv('artifacts/features.csv', index_col='CustomerID')
            print("Loaded features")
        if os.path.exists('artifacts/scaler.pkl'):
            with open('artifacts/scaler.pkl', 'rb') as f:
                scaler = pickle.load(f)
        if os.path.exists('artifacts/kmeans.pkl'):
            with open('artifacts/kmeans.pkl', 'rb') as f:
                kmeans = pickle.load(f)
        if os.path.exists('artifacts/best_model.pkl'):
            with open('artifacts/best_model.pkl', 'rb') as f:
                best_model_data = pickle.load(f)
                best_model = best_model_data['model']
        if os.path.exists('artifacts/metrics.json'):
            with open('artifacts/metrics.json', 'r') as f:
                metrics = json.load(f)
        if os.path.exists('artifacts/summary.json'):
            with open('artifacts/summary.json', 'r') as f:
                summary = json.load(f)
    except Exception as e:
        print(f"Error loading artifacts: {e}")

@app.get("/data/summary")
def get_summary():
    if not summary:
        raise HTTPException(status_code=404, detail="Summary not found. Run pipeline first.")
    return summary

@app.get("/clusters")
def get_clusters():
    if features_df is None:
        raise HTTPException(status_code=404, detail="Data not found.")
    
    # Return aggregated data for charts
    dist = features_df['Segment'].value_counts().to_dict()
    
    # Average RFM per segment
    rfm = features_df.groupby('Segment')[['Recency', 'Frequency', 'Monetary']].mean().reset_index()
    
    return {
        "distribution": dist,
        "rfm_averages": rfm.to_dict(orient='records')
    }

@app.get("/model-metrics")
def get_model_metrics():
    if not metrics:
        raise HTTPException(status_code=404, detail="Metrics not found.")
    return metrics

@app.get("/predict/{customer_id}")
def predict_customer(customer_id: float):
    # Customer IDs are float in dataset initially due to NaNs, then int.
    # In CSV they might be kept as float.
    if features_df is None:
        raise HTTPException(status_code=500, detail="Data not loaded.")
        
    if customer_id not in features_df.index:
        # Try matching string or float
        matches = features_df[features_df.index == customer_id]
        if matches.empty:
            raise HTTPException(status_code=404, detail="Customer not found")
        cust_data = matches.iloc[0]
    else:
        cust_data = features_df.loc[customer_id]
        
    drop_cols = ['PurchasedNext30Days', 'Cluster', 'Segment']
    X = cust_data.drop(labels=[col for col in drop_cols if col in cust_data.index]).to_frame().T
    
    predicted = int(best_model.predict(X)[0])
    segment = cust_data['Segment']
    actual = int(cust_data.get('PurchasedNext30Days', -1))
    
    return {
        "customer_id": customer_id,
        "predicted_purchase_next_30_days": bool(predicted),
        "actual_purchase_next_30_days": bool(actual) if actual != -1 else None,
        "segment": segment,
        "rfm": {
            "Recency": cust_data.get("Recency", 0),
            "Frequency": cust_data.get("Frequency", 0),
            "Monetary": cust_data.get("Monetary", 0),
        }
    }

@app.get("/recommend/{customer_id}")
def recommend_for_customer(customer_id: float):
    # Reuse predict logic to get segment and prediction
    pred_res = predict_customer(customer_id)
    
    segment = pred_res["segment"]
    will_purchase = pred_res["predicted_purchase_next_30_days"]
    
    recs = generate_recommendations(segment, will_purchase)
    
    return {
        "customer_id": customer_id,
        "prediction_context": pred_res,
        "recommendations": recs
    }

@app.post("/retrain")
def retrain_models():
    # Store old metrics for comparison
    old_metrics = metrics.copy() if metrics else {}
    
    try:
        # Execute the full training pipeline synchronously
        new_metrics = run_training_pipeline()
        
        # Trigger reload of the newly written artifacts into memory
        load_artifacts()
        
        return {
            "status": "success",
            "message": "Model retrained successfully",
            "metrics": new_metrics,
            "old_metrics": old_metrics
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/predict/manual")
def predict_manual(features: MLFeatures):
    if scaler is None or kmeans is None or best_model is None:
        raise HTTPException(status_code=500, detail="Models not loaded properly.")

    # 1. Cluster mapping
    try:
        # Construct DataFrame to maintain feature names as strictly required by sklearn
        rfm_df = pd.DataFrame([{
            "Recency": max(features.Recency, 1e-5),
            "Frequency": max(features.Frequency, 1e-5),
            "Monetary": max(features.Monetary, 1e-5)
        }])
        
        # Apply the log transformation matching training data exactly
        import numpy as np
        scaled_rfm = scaler.transform(np.log1p(rfm_df))
        cluster_id = int(kmeans.predict(scaled_rfm)[0])
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Clustering error: {str(e)}")
        
    # We must deduce Segment from Cluster using existing logic.
    segment = "Unknown"
    if features_df is not None:
        try:
            sample_segment = features_df[features_df['Cluster'] == cluster_id]['Segment'].iloc[0]
            segment = sample_segment
        except:
            pass

    # 2. Predict Probability and Class
    try:
        # Convert month frequency back to day frequency for the trained model
        purchase_freq_per_day = features.PurchaseFreqPerMonth / 30.0

        # Synthesize the advanced ML features utilizing the 5 base inputs from the UI
        total_items = features.Frequency * (features.Monetary / features.AvgOrderValue if features.AvgOrderValue > 0 else 1)
        avg_items = total_items / features.Frequency if features.Frequency > 0 else 1
        tenure = features.Recency + (features.Frequency / purchase_freq_per_day if purchase_freq_per_day > 0 else 1)

        X_input = pd.DataFrame([{
            "Recency": features.Recency,
            "Frequency": features.Frequency,
            "Monetary": features.Monetary,
            "AvgOrderValue": features.AvgOrderValue,
            "TotalItems": total_items,
            "AvgItemsPerOrder": avg_items,
            "OrderValueStd": features.AvgOrderValue * 0.1,
            "MaxOrderValue": features.AvgOrderValue * 1.2,
            "MinOrderValue": features.AvgOrderValue * 0.8,
            "Tenure": tenure,
            "PurchaseFreqPerDay": purchase_freq_per_day
        }])
        
        prob = best_model.predict_proba(X_input)[0][1]
        pred_class = int(best_model.predict(X_input)[0])
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")
        
    recs = generate_recommendations(segment, pred_class)
    
    return {
        "cluster": cluster_id,
        "segment": segment,
        "probability": float(prob),
        "predicted_purchase": bool(pred_class),
        "recommendations": recs
    }
