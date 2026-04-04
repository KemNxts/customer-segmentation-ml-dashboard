import pandas as pd
import numpy as np

def load_and_clean_data(filepath: str) -> pd.DataFrame:
    """Loads dataset and performs basic cleaning."""
    print(f"Loading raw dataset from {filepath}...")
    df = pd.read_excel(filepath)
    
    print(f"Initial shape: {df.shape}")
    
    # Rename columns if needed to match expectations
    if 'Customer ID' in df.columns:
        df.rename(columns={'Customer ID': 'CustomerID'}, inplace=True)
        
    # Remove null CustomerID
    df = df.dropna(subset=['CustomerID']).copy()
    
    # Remove negative Quantity / Price
    df = df[(df['Quantity'] > 0) & (df['Price'] > 0)].copy()
    
    # Create TotalPrice
    df['TotalPrice'] = df['Quantity'] * df['Price']
    
    # Convert dates
    df['InvoiceDate'] = pd.to_datetime(df['InvoiceDate'])
    
    print(f"Cleaned shape: {df.shape}")
    return df
