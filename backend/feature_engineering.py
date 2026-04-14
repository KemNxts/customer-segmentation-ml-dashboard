import pandas as pd
import numpy as np

def create_training_dataset(df: pd.DataFrame) -> pd.DataFrame:
    """Creates a robust set of features using the entire dataset."""
    print("Engineering advanced features across all records...")
    
    # We use the entire dataset without time truncation
    max_date = df['InvoiceDate'].max()
    customer_group = df.groupby('CustomerID')
    
    # Initialize features DataFrame
    features = pd.DataFrame(index=df['CustomerID'].unique())
    features.index.name = 'CustomerID'
    
    # Core RFM Features
    features['Recency'] = customer_group['InvoiceDate'].max().apply(lambda x: (max_date - x).days)
    features['Frequency'] = customer_group['Invoice'].nunique()
    features['Monetary'] = customer_group['TotalPrice'].sum()
    
    # Advanced / Derived Features
    features['AvgOrderValue'] = features['Monetary'] / features['Frequency']
    features['TotalItems'] = customer_group['Quantity'].sum()
    features['AvgItemsPerOrder'] = features['TotalItems'] / features['Frequency']
    
    # Order Value Variance (stability of spending)
    order_values = df.groupby(['CustomerID', 'Invoice'])['TotalPrice'].sum().groupby('CustomerID')
    features['OrderValueStd'] = order_values.std().fillna(0)
    features['MaxOrderValue'] = order_values.max()
    features['MinOrderValue'] = order_values.min()
    
    # Lifecycle / Engagement Features
    life_span = customer_group['InvoiceDate'].agg(lambda x: (x.max() - x.min()).days).replace(0, 1)
    features['Tenure'] = customer_group['InvoiceDate'].min().apply(lambda x: (max_date - x).days)
    features['PurchaseFreqPerDay'] = features['Frequency'] / life_span
    
    # Generate predictive target dynamically based on customer's individual purchasing behavior, eliminating global timeframes
    # Logic: Will purchase again if they have bought recently relative to their own average interval.
    features['Will_Purchase_Again'] = (features['Recency'] <= (3.0 / np.maximum(features['PurchaseFreqPerDay'], 0.001))).astype(int)
    
    # Fill any remaining NaNs with 0
    features.fillna(0, inplace=True)
    
    # Reset index to keep CustomerID as a column
    features.reset_index(inplace=True)
    return features
