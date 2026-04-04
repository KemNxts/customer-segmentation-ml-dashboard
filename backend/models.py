import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix

def train_and_evaluate_models(features: pd.DataFrame):
    print("Training Predictive Models...")
    
    # Features & Target
    # We exclude CustomerID (index), Cluster, Segment, and Target
    drop_cols = ['PurchasedNext30Days', 'Cluster', 'Segment']
    X = features.drop(columns=[col for col in drop_cols if col in features.columns])
    y = features['PurchasedNext30Days']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    
    models = {
        'Logistic Regression': LogisticRegression(max_iter=1000, random_state=42),
        'Random Forest': RandomForestClassifier(n_estimators=100, random_state=42),
        'Gradient Boosting': GradientBoostingClassifier(n_estimators=100, random_state=42)
    }
    
    results = {}
    best_f1 = -1
    best_model_name = ""
    best_model = None
    
    for name, model in models.items():
        model.fit(X_train, y_train)
        preds = model.predict(X_test)
        
        acc = accuracy_score(y_test, preds)
        prec = precision_score(y_test, preds, zero_division=0)
        rec = recall_score(y_test, preds, zero_division=0)
        f1 = f1_score(y_test, preds, zero_division=0)
        cm = confusion_matrix(y_test, preds).tolist()
        
        feat_importance = []
        if hasattr(model, 'feature_importances_'):
            feat_importance = dict(zip(X.columns, model.feature_importances_))
            
        results[name] = {
            'accuracy': acc,
            'precision': prec,
            'recall': rec,
            'f1_score': f1,
            'confusion_matrix': cm,
            'feature_importance': feat_importance
        }
        
        if f1 > best_f1:
            best_f1 = f1
            best_model_name = name
            best_model = model
            
    print(f"Best Model: {best_model_name} with F1: {best_f1:.4f}")
    
    return best_model, best_model_name, results
