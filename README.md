# SegPredict ML Dashboard

![Project Status](https://img.shields.io/badge/Status-Active-success)
![Frontend](https://img.shields.io/badge/Frontend-React_19%20|%20Vite-blue)
![Backend](https://img.shields.io/badge/Backend-FastAPI-green)
![ML](https://img.shields.io/badge/Machine_Learning-Scikit_Learn-orange)

## Overview

SegPredict ML is a production-grade machine learning dashboard and customer segmentation platform. Built with a modern tech stack encompassing a robust **FastAPI backend** and a visually premium, glassmorphism-inspired **React (Vite) frontend**, it provides actionable insights into customer behavior using Recency, Frequency, and Monetary (RFM) analysis.

By blending predictive analytics with real-time dashboard visualizations, SegPredict empowers businesses to segment their customer base dynamically and predict the likelihood of purchases in the next 30 days.

## Key Features

- 📊 **Dynamic Customer Segmentation**: Leverages **K-Means clustering** to logically categorize customers based on RFM metrics.
- 🔮 **Predictive Analytics**: Evaluates individual customer profiles and accurately predicts future purchase likelihood (within 30 days).
- 💡 **Smart Actionable Insights**: Provides dynamic, rule-based recommendations tailored to specific behavioral segments.
- 🔄 **Integrated Model Retraining**: Allows users to seamlessly re-run the training pipeline from the dashboard, visualizing performance metrics and maintaining up-to-date models.
- 🎨 **Premium UI/UX**: Designed using Tailwind CSS with glassmorphism touches, Recharts for dynamic visual representations, and a responsive single-page architecture.

## Tech Stack

### Frontend
- **Framework**: React 19 via Vite
- **Styling**: Tailwind CSS (PostCSS)
- **Data Visualization**: Recharts
- **Icons**: Lucide React
- **Network Routing & API**: React Router DOM, Axios

### Backend
- **Framework**: FastAPI
- **Data Manipulation**: Pandas
- **Machine Learning**: Scikit-learn (K-Means, predictive classifiers)
- **Serialization**: Pickle (Model storage)
- **Server**: Uvicorn

## Project Directory Structure

```text
ML_Projekt/
├── backend/                  # FastAPI Application & Machine Learning Models
│   ├── artifacts/            # Generated models (scaler, kmeans, best_model), features, and metrics
│   ├── data/                 # Raw/Processed dataset directories
│   ├── clustering.py         # K-Means clustering logic
│   ├── feature_engineering.py# Data transformation and feature creation
│   ├── main.py               # Core FastAPI endpoints
│   ├── models.py             # Data models and structures
│   ├── preprocessing.py      # Data cleaning logic
│   ├── recommendation.py     # Rule-based business logic & recommendations
│   └── train.py              # ML retraining pipeline orchestration
└── frontend/                 # React Application (Vite)
    ├── public/               # Static assets
    ├── src/                  # React components, pages, context, and styles
    ├── package.json          # Node.js dependencies and scripts
    ├── tailwind.config.js    # Tailwind specific configuration
    └── vite.config.js        # Vite bundler configuration
```

## Setup & Installation

### Prerequisites
- [Node.js](https://nodejs.org/en/) (v18 or higher)
- [Python](https://www.python.org/downloads/) (3.9 or higher)

### 1. Backend Setup

Open a new terminal and navigate to the project backend:

```bash
cd backend
```

Create a virtual environment:
```bash
# On Windows
python -m venv venv
venv\Scripts\activate

# On Mac/Linux
python3 -m venv venv
source venv/bin/activate
```

Install requirements (ensure you have the appropriate `requirements.txt` or install manually):
```bash
pip install -r requirements.txt
```
*(If `requirements.txt` is missing, you may need: `pip install fastapi uvicorn pandas scikit-learn pydantic`)*

Run the API:
```bash
uvicorn main:app --reload --port 8001
```
*The backend API will be running at `http://127.0.0.1:8000`*

### 2. Frontend Setup

Open a separate terminal and navigate to the project frontend:

```bash
cd frontend
```

Install dependencies:
```bash
npm install
```

Start the development server:
```bash
npm run dev
```
*The frontend will be running at `http://localhost:5173` (or the port specified by Vite).*

## API Endpoints Overview
The backend exposes the following primary endpoints:
- `GET /clusters` - Retrieve current clustering distribution and RFM averages.
- `GET /model-metrics` - View performance metrics of the ML models.
- `GET /predict/{customer_id}` - Fetch purchase prediction and cluster details for a known customer.
- `GET /recommend/{customer_id}` - Receive tailored business recommendations for a specific customer.
- `POST /predict/manual` - Input arbitrary RFM values for on-the-fly predictions.
- `POST /retrain` - Manually trigger the model re-training sequence.

## License

This project is licensed under the MIT License.
