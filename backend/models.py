import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix

def train_and_evaluate_models(features: pd.DataFrame):
    print("Training Predictive Models...")
    
    # Models will learn to classify future purchase viability dropping explicit identifiers.
    drop_cols = ['Cluster', 'Segment', 'Will_Purchase_Again', 'CustomerID']
    X = features.drop(columns=[col for col in drop_cols if col in features.columns])
    y = features['Will_Purchase_Again']
    
    # Stratified Train-Test Split to maintain label proportions
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    
    # Initialize models with optimized hyperparameters to improve accuracy
    models = {
        'Logistic Regression': LogisticRegression(
            max_iter=2000, 
            random_state=42, 
            class_weight='balanced'
        ),
        'Random Forest': RandomForestClassifier(
            n_estimators=200, 
            max_depth=10,
            min_samples_split=5,
            class_weight='balanced',
            random_state=42,
            n_jobs=-1
        ),
        'Gradient Boosting': GradientBoostingClassifier(
            n_estimators=150, 
            learning_rate=0.05,
            max_depth=4,
            random_state=42
        )
    }
    
    results = {}
    best_f1 = -1
    best_model_name = ""
    best_model = None
    
    for name, model in models.items():
        print(f"Training {name}...")
        model.fit(X_train, y_train)
        preds = model.predict(X_test)
        
        acc = accuracy_score(y_test, preds)
        prec = precision_score(y_test, preds, zero_division=0)
        rec = recall_score(y_test, preds, zero_division=0)
        f1 = f1_score(y_test, preds, zero_division=0)
        cm = confusion_matrix(y_test, preds).tolist()
        
        # Track feature importance and sort it for better insights
        feat_importance = {}
        if hasattr(model, 'feature_importances_'):
            imp_tuples = zip(X.columns, model.feature_importances_)
            feat_importance = {k: v for k, v in sorted(imp_tuples, key=lambda item: item[1], reverse=True)}
        elif hasattr(model, 'coef_'):
            imp_tuples = zip(X.columns, abs(model.coef_[0]))
            feat_importance = {k: v for k, v in sorted(imp_tuples, key=lambda item: item[1], reverse=True)}
            
        results[name] = {
            'accuracy': acc,
            'precision': prec,
            'recall': rec,
            'f1_score': f1,
            'confusion_matrix': cm,
            'feature_importance': feat_importance
        }
        
        # Optimize model selection prioritizing F1 score due to likely class imbalance
        if f1 > best_f1:
            best_f1 = f1
            best_model_name = name
            best_model = model
            
    print(f"Best Model Selected: {best_model_name} with F1-Score: {best_f1:.4f}")
    
    return best_model, best_model_name, results
