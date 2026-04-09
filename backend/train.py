import os
import pickle
import pandas as pd
from datetime import timedelta
from preprocessing import load_and_clean_data
from feature_engineering import create_training_dataset
from clustering import perform_clustering
from models import train_and_evaluate_models

import json

def run_training_pipeline():
    data_path = 'data/online_retail_II.xlsx'
    
    if not os.path.exists(data_path):
        print(f"File not found: {data_path}")
        return
        
    df = load_and_clean_data(data_path)
    
    # We take cutoff as 30 days before the max invoice date
    max_date = df['InvoiceDate'].max()
    cutoff_date = max_date - timedelta(days=30)
    
    features = create_training_dataset(df, cutoff_date)
    
    features, scaler, kmeans, inertias = perform_clustering(features)
    
    best_model, best_model_name, metrics = train_and_evaluate_models(features)
    
    # Save artifacts
    os.makedirs('artifacts', exist_ok=True)
    features.to_csv('artifacts/features.csv')
    
    with open('artifacts/scaler.pkl', 'wb') as f:
        pickle.dump(scaler, f)
        
    with open('artifacts/kmeans.pkl', 'wb') as f:
        pickle.dump(kmeans, f)
        
    with open('artifacts/best_model.pkl', 'wb') as f:
        pickle.dump({'name': best_model_name, 'model': best_model}, f)
        
    with open('artifacts/metrics.json', 'w') as f:
        json.dump(metrics, f, indent=4)
        
    # Also save dataset summary for frontend overview
    summary = {
        'total_customers': int(df['CustomerID'].nunique()),
        'total_revenue': float(df['TotalPrice'].sum()),
        'total_transactions': int(df['Invoice'].nunique()),
        'date_range': f"{df['InvoiceDate'].min().date()} to {df['InvoiceDate'].max().date()}"
    }
    with open('artifacts/summary.json', 'w') as f:
        json.dump(summary, f, indent=4)
        
    print("Pipeline finished successfully. Models and metrics saved.")
    return metrics

if __name__ == '__main__':
    run_training_pipeline()
