import pandas as pd
import numpy as np
from datetime import timedelta

def engineer_features(df: pd.DataFrame) -> pd.DataFrame:
    """Creates RFM and additional features at the customer level."""
    print("Engineering features...")
    
    # Assuming 'snapshot_date' is 1 day after the max date in the entire dataset
    snapshot_date = df['InvoiceDate'].max() + timedelta(days=1)
    
    # Group by CustomerID
    customer_group = df.groupby('CustomerID')
    
    # Recency: Days since last purchase
    recency = customer_group['InvoiceDate'].max().apply(lambda x: (snapshot_date - x).days)
    
    # Frequency: Number of unique invoices/purchases
    frequency = customer_group['Invoice'].nunique()
    
    # Monetary: Total spend
    monetary = customer_group['TotalPrice'].sum()
    
    # Additional features
    # Total items purchased
    total_items = customer_group['Quantity'].sum()
    
    # Lifetime span in days
    life_span = customer_group['InvoiceDate'].agg(lambda x: (x.max() - x.min()).days)
    # Avoid division by zero
    life_span = life_span.replace(0, 1)
    
    # Purchases per month
    purchase_freq_per_month = frequency / (life_span / 30.0)
    
    # Target: Purchase in the "next 30 days" (Wait, we need a cutoff to train a predictive model).
    # To truly do "Predict next 30 days", we need to split data into:
    # Train Observation Period -> Predict over Next 30 days
    # So let's build a sliding window or simply a single cutoff approach.
    pass

def create_training_dataset(df: pd.DataFrame, cutoff_date) -> pd.DataFrame:
    # observation period
    obs_df = df[df['InvoiceDate'] < cutoff_date]
    # target period (next 30 days)
    target_end = cutoff_date + timedelta(days=30)
    target_df = df[(df['InvoiceDate'] >= cutoff_date) & (df['InvoiceDate'] < target_end)]
    
    snapshot_date = cutoff_date
    customer_group = obs_df.groupby('CustomerID')
    
    features = pd.DataFrame()
    features['CustomerID'] = obs_df['CustomerID'].unique()
    features.set_index('CustomerID', inplace=True)
    
    features['Recency'] = customer_group['InvoiceDate'].max().apply(lambda x: (snapshot_date - x).days)
    features['Frequency'] = customer_group['Invoice'].nunique()
    features['Monetary'] = customer_group['TotalPrice'].sum()
    features['AvgOrderValue'] = features['Monetary'] / features['Frequency']
    
    life_span = customer_group['InvoiceDate'].agg(lambda x: (x.max() - x.min()).days).replace(0, 1)
    features['PurchaseFreqPerMonth'] = features['Frequency'] / (life_span / 30.0)
    
    # Target
    target_customers = target_df['CustomerID'].unique()
    features['PurchasedNext30Days'] = features.index.isin(target_customers).astype(int)
    
    features.fillna(0, inplace=True)
    return features
