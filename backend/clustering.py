import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans

def perform_clustering(features: pd.DataFrame, max_k=10):
    print("Performing K-Means Clustering...")
    # Scale features using log transformation to handle skewness in RFM distributions
    scaler = StandardScaler()
    rfm_cols = ['Recency', 'Frequency', 'Monetary']
    
    # Ensure strict positivity for log transformation
    rfm_data = features[rfm_cols].copy()
    for col in rfm_cols:
        rfm_data[col] = np.maximum(rfm_data[col], 1e-5)
    
    # Log-transform and scale to normalize
    X = scaler.fit_transform(np.log1p(rfm_data))
    
    # Calculate inertia for elbow
    inertias = []
    K_range = range(1, max_k+1)
    for k in K_range:
        kmeans = KMeans(n_clusters=k, random_state=42, n_init=10)
        kmeans.fit(X)
        inertias.append(kmeans.inertia_)
    
    # K=3 perfectly fits the High Value, Low Engagement, At Risk mental model
    optimal_k = 3 
    
    kmeans = KMeans(n_clusters=optimal_k, random_state=42, n_init=10)
    clusters = kmeans.fit_predict(X)
    
    features['Cluster'] = clusters
    
    # Map clusters to names based on Monetary and Recency
    cluster_stats = features.groupby('Cluster')[['Recency', 'Monetary']].mean()
    
    # Sort clusters by Monetary (descending)
    sorted_clusters = cluster_stats.sort_values(by='Monetary', ascending=False).index.tolist()
    
    # Segment Labeling
    labels = {}
    for i, cluster in enumerate(sorted_clusters):
        if i == 0:
            labels[cluster] = 'High Value'
        elif i == 1:
            labels[cluster] = 'Low Engagement' # Moderate spending
        else:
            labels[cluster] = 'At Risk'        # Lowest spending 
            
    features['Segment'] = features['Cluster'].map(labels)
    
    print("Segment distribution:\n", features['Segment'].value_counts())
    
    return features, scaler, kmeans, inertias
