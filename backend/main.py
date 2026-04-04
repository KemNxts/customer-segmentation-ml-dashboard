import os
import json
import pickle
import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from recommendation import generate_recommendations

app = FastAPI(title="Customer Segmentation API")

# Enable CORS for frontend
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
