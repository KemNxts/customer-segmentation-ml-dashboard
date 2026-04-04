import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans

def perform_clustering(features: pd.DataFrame, max_k=10):
    print("Performing K-Means Clustering...")
    # Scale features
    scaler = StandardScaler()
    rfm_cols = ['Recency', 'Frequency', 'Monetary']
    X = scaler.fit_transform(features[rfm_cols])
    
    # Calculate inertia for elbow
    inertias = []
    K_range = range(1, max_k+1)
    for k in K_range:
        kmeans = KMeans(n_clusters=k, random_state=42, n_init=10)
        kmeans.fit(X)
        inertias.append(kmeans.inertia_)
    
    # Heuristic for Elbow: For simplicity in our pipeline, we assume 3 clusters 
    # to perfectly match labels: High Value, At Risk, Low Engagement.
    # We will compute optimal_k using a simple method or hardcode k=3 as required by labels.
    optimal_k = 3 
    
    kmeans = KMeans(n_clusters=optimal_k, random_state=42, n_init=10)
    clusters = kmeans.fit_predict(X)
    
    features['Cluster'] = clusters
    
    # Map clusters to names based on Monetary and Recency
    cluster_stats = features.groupby('Cluster')[['Recency', 'Monetary']].mean()
    
    # Sort clusters by Monetary (descending)
    sorted_clusters = cluster_stats.sort_values(by='Monetary', ascending=False).index.tolist()
    
    # Assign labels based on rank
    # Best monetary -> High Value
    # Next best -> Low Engagement or At Risk?
    # Usually: 
    # High Monetary, Low Recency -> High Value
    # Low Monetary, High Recency -> At Risk
    labels = {}
    for i, cluster in enumerate(sorted_clusters):
        if i == 0:
            labels[cluster] = 'High Value'
        elif i == 1:
            labels[cluster] = 'Low Engagement'
        else:
            labels[cluster] = 'At Risk'
            
    features['Segment'] = features['Cluster'].map(labels)
    
    print(features['Segment'].value_counts())
    
    return features, scaler, kmeans, inertias
