# SegPredict ML – Customer Analytics Dashboard
**Complete Project Documentation & Viva Preparation Guide**

---

## 1. PROJECT OVERVIEW

### What is this project?
SegPredict ML is an intelligent Customer Analytics Dashboard. It takes historical data about customer purchases and uses Artificial Intelligence (AI) to automatically group them into different categories (like "High Value" or "At Risk") and predict whether they will buy from the store again in the next 30 days.

### Problem Statement
Retail stores often struggle to know which customers are loyal and which ones are leaving. Traditional methods require staring at spreadsheets for hours. Businesses need a fast, automated way to track customer behavior and predict future actions so they can take action (like sending discount emails before a customer leaves forever).

### Why it is important in the real world
By predicting customer behavior, businesses can:
- **Save Money:** Focus marketing budgets on customers most likely to buy.
- **Save Customers:** Identify "At-Risk" customers and send targeted interventions to keep them.
- **Maximize Profit:** Upsell efficiently to "High Value" customers.

---

## 2. DATASET EXPLANATION

### Dataset Name
**Online Retail Dataset** (Typically an e-commerce transactional dataset containing Invoices, StockCodes, Quantity, Price, and CustomerIDs).

### Key Features (The inputs to our models)
To understand a customer, we calculate three incredibly important numbers known as **RFM**:

- **Recency:** *How recently did the customer make a purchase?* (Measured in days. Lower is better. A customer who bought yesterday is much more engaged than one who bought 300 days ago.)
- **Frequency:** *How often do they purchase?* (Measured by the number of unique invoices/orders. Higher is better.)
- **Monetary:** *How much total money have they spent?* (Measured in dollars. Higher is better.)

### Why RFM is important
RFM strips away all the messy details (like what exact sweater they bought) and boils a customer's loyalty down to pure numbers. If someone has a Recency of 2 days, Frequency of 50, and Monetary of $5,000—you instantly know they are a VIP. 

---

## 3. MACHINE LEARNING BASICS (BEGINNER FRIENDLY)

### What is Machine Learning?
Machine Learning (ML) is teaching a computer to recognize patterns by showing it examples, rather than writing thousands of lines of strict rules. 
*Analogy:* Instead of giving a child a dictionary to memorize what a "dog" is, you just show them 100 pictures of dogs until they naturally understand what a dog looks like. 

### Supervised vs Unsupervised Learning
- **Supervised Learning:** The data has direct "Answers" (Labels) attached to it. We train the computer to predict the answer. *(Example: Showing the computer housing data alongside the exact prices of those houses).*
- **Unsupervised Learning:** The data has NO answers. The computer explores the data freely to find hidden patterns. *(Example: Handing the computer a list of millions of customers and telling it to group them into 3 distinct behavioral buckets).*

### Classification vs Clustering
- **Classification (Supervised):** Sorting data into predefined categories. *(Example: Is this email "Spam" or "Not Spam"?)*
- **Clustering (Unsupervised):** Grouping similar unlabelled data together based on their relationships. *(Example: Grouping customers by similar spending habits without knowing their identities).*

### Training vs Testing
- **Training:** Feeding 80% of our data into the model so it can learn the rules and patterns.
- **Testing:** Hiding the remaining 20% from the model during training, and then using it like an exam to test how accurate the model really is on data it has never seen before.

### Overfitting vs Underfitting
- **Overfitting:** When the model memorizes the training data perfectly, like a student who memorizes an exact practice test but fails the real exam because they didn't learn the actual concepts.
- **Underfitting:** When the model is too simple and fails to learn the patterns at all. 

---

## 4. ALGORITHMS USED

### Logistic Regression
- **What it is:** A basic algorithm using math to draw a straight boundary line between two classes (e.g., Will Buy vs. Won't Buy). It outputs a probability between 0 and 100%. 
- **Why used:** It's incredibly fast and easy to interpret.
- **Pros/Cons:** Pro: Simple and fast. Con: Struggles if the relationships in the data are highly complex (not a straight line).
- **Analogy:** Drawing a straight line across a room comparing height and weight to separate adults from children.

### Random Forest
- **What it is:** A massive collection of many smaller "Decision Trees". Each tree makes a vote, and the majority vote wins.
- **Why used:** It doesn't overfit easily and captures highly complex, non-linear patterns.
- **Analogy:** Instead of asking one doctor for a diagnosis, you ask 100 doctors and go with whatever the majority concludes.

### Gradient Boosting
- **What it is:** Similar to Random Forest, but instead of trees voting independently, they learn sequentially. Tree #2 specifically tries to fix the mistakes made by Tree #1. 
- **Why used:** Often provides the highest possible accuracy for tabular statistics.
- **Analogy:** Taking a test, grading it, and then taking a second test specifically focusing on the questions you got wrong the first time until you are perfect.

### K-Means Clustering
- **What it is:** An Unsupervised model that groups data points into 'K' number of clusters based on distance.
- **When to use:** Used in our project to group users into segments (e.g., "Loyal Customer" vs "At Risk").
- **Analogy:** Dropping 5 magnets onto a metal-shaving dusted table. The shavings will naturally clump around whichever magnet they are closest to. 

---

## 5. MODEL WORKFLOW

Step-by-step logic of the system:
1. **Data Collection:** Importing raw `online_retail.csv` e-commerce invoices.
2. **Data Preprocessing:** Cleaning the data. Removing negative prices, dropping duplicate rows, and extracting the valid dates.
3. **Feature Engineering:** Doing the math to convert raw invoices into powerful custom variables specifically per-customer: *Recency, Frequency, Monetary, Average Order Value, Tenure.* 
4. **Model Training:** Splitting the data into History vs Future (30-day cutoff). Teaching the model how historical variables resulted in future outcomes. 
5. **Prediction:** Sending a brand new customer's statistics into the trained model to guess their future action.
6. **Evaluation:** Checking the score of our model (Accuracy, F1-Score) to ensure it isn't making bad guesses.

---

## 6. MODEL EVALUATION METRICS

- **Accuracy:** Out of all predictions, how many were perfectly correct? *(Example: 90/100 correct = 90% accuracy).*
- **Precision:** Out of all the people we *predicted* would buy, how many *actually* bought? *(Useful when the cost of a "False Positive" is high).*
- **Recall:** Out of all the people who *actually* bought, how many did our model successfully catch? *(Useful when missing a positive case is terrible, like detecting cancer).*
- **F1 Score (Very Important):** The harmonic average between Precision and Recall. It is the best metric to look at when the data is imbalanced (e.g., 90% of customers don't buy, 10% do). 

---

## 7. FEATURE IMPORTANCE

- **What is it?** A score showing which input variables (features) the model relied on the heaviest to make its decisions.
- **Why it matters:** It provides transparency. If we know `Recency` is the ultimate driving factor for whether someone purchases, a business can focus entirely on campaigns targeting Recency.
- **Project Example:** In SegPredict, we visualize this ranking. If `Recency` ranks at 45% and `AvgOrderValue` ranks at 2%, we mathematically prove that recent engagement matters more than bulk spending for future loyalty.

---

## 8. PREDICTION SYSTEM 

**Flow:** User (You) → Input Form (Frontend) → API (FastAPI) → Model Execution → Response Data → Output visually on the UI.

- **INPUT:** You manually type in the Recency, Frequency, Monetary, Average Order Value, and Purchase Frequency Per Month. 
- **OUTPUT GENERATED:**
  - **Customer Type Segment:** (e.g., High Value, Low Engagement).
  - **Confidence Score:** (e.g., 84.5% probability they will purchase again).
  - **Recommended Action:** (e.g., "Send VIP early access email" or "Send aggressive 20% discount").

---

## 9. DATA VISUALIZATION

- **Model Comparison Table:** Lists our different algorithms (Logistic Regression vs Random Forest) comparing their exact Accuracy and F1 scores. *Useful to prove we didn't just guess which model was best.*
- **Feature Importance Chart:** A horizontal bar chart showing which data inputs hold the most weight. *Useful for marketing teams to know what behaviors to target.*
- **2D Scatter Plot (Segmentation Space):** Maps Recency vs Frequency, coloring the dots based on customer archetype. *Visually proves that High Value customers cluster together with high frequencies.*
- **Confusion Matrix:** A 4-square grid (True Positive, True Negative, False Positive, False Negative). *Shows exactly where and how our model makes its mistakes.*

---

## 10. SYSTEM ARCHITECTURE

- **Frontend (React + Tailwind):** The visual interface. It is smooth, reactive, and takes inputs without refreshing the page. It makes HTTP requests to the backend.
- **Backend (FastAPI):** An ultra-fast Python web server. It listens for requests, scales data, formats it, and feeds it into the ML models.
- **ML Model (SciKit-Learn):** The pickled `.pkl` brains of the operation that execute mathematical predictions natively on the server.

---

## 11. VIVA QUESTIONS & ANSWERS 

1. **Q: What is the main objective of this project?**
   **A:** To use Machine Learning to segment customers based on purchasing behavior and predict their likelihood of buying again in the next 30 days.

2. **Q: What does RFM stand for and why use it?**
   **A:** Recency, Frequency, Monetary. It simplifies raw invoice data into three highly predictive behavioral pillars of customer loyalty.

3. **Q: Did you use Supervised or Unsupervised learning?**
   **A:** Both! K-Means Clustering for unsupervised customer segmentation, and Random Forest/Gradient Boosting for supervised purchase prediction. 

4. **Q: What is the target variable (Label) the model is trying to predict?**
   **A:** `PurchasedNext30Days` — a binary yes/no (1/0) indicating if they interacted with the store in the final 30 calendar days of our dataset.

5. **Q: What algorithm did you use for Clustering?**
   **A:** K-Means algorithm, as it is the industry standard for creating distinct groups bounded by distance.

6. **Q: How did you select the number of clusters (K) for K-Means?**
   **A:** Ideally through the "Elbow Method," where we plot the Within-Cluster Sum of Squares to find the drop-off point where adding more clusters no longer heavily improves variance. 

7. **Q: Explain how Logistic Regression works in one sentence.**
   **A:** It applies a math equation to input features and uses a sigmoid curve to compress the result into a probability score between 0% and 100%.

8. **Q: How is Random Forest different from a single Decision Tree?**
   **A:** A single tree can easily overfit and memorize noise. A Random Forest uses hundreds of trees taking a majority vote to stabilize and generalize the predictions.

9. **Q: What is the difference between Random Forest and Gradient Boosting?**
  **A:** Random Forest trains trees independently in parallel. Gradient Boosting trains trees sequentially, with each new tree trying to fix the residual errors of the previous one. 

10. **Q: Why is F1-Score more important than Accuracy here?**
    **A:** Because customer purchase data is highly imbalanced (e.g., 85% of people won't buy). A model guessing "Won't Buy" every time will score 85% Accuracy but be totally useless. F1-Score balances Precision and Recall to punish blind guessing.

11. **Q: What is Data Leakage in Machine Learning?**
    **A:** When the model accidentally has access to the "answer" during training because a feature was engineered using the target's timeline, allowing it to "cheat."

12. **Q: How did you fix Data Leakage in this project?**
    **A:** By implementing a strict 30-day temporal cutoff. We calculated all RFM features using data *only before* the cutoff, and calculated the answers *only after* the cutoff.

13. **Q: What is Multicollinearity, and how did you handle it?**
    **A:** Multicollinearity is when two features represent the exact same thing (e.g., Total Invoices vs Total Carts). I generated a correlation matrix and automatically dropped features that shared > 0.85 absolute correlation.

14. **Q: Why did you scale your features?**
    **A:** Algorithms like Logistic Regression strictly rely on distance mathematics. If Monetary is in the thousands and Recency is in the tens, the model overly biases toward Monetary. `StandardScaler` equalizes their distributions.

15. **Q: Which framework powers your backend, and why?**
    **A:** FastAPI. It is modern, incredibly fast due to asynchronous support, and automatically generates API documentation. 

16. **Q: What does Pickle (`.pkl`) do?**
    **A:** It serializes (saves) our trained Python machine learning structure into a hard file, so we can instantly load it on the backend without retraining for 5 minutes every time the server starts.

17. **Q: What does the Confusion Matrix show on your dashboard?**
    **A:** A grid comparing "Predicted" vs "Actual" values, allowing us to see exactly how many False Positives vs False Negatives our designated model triggers.

18. **Q: What does True Positive (TP) mean in your project?**
    **A:** The model predicted a customer would buy, and the customer actually DID buy.

19. **Q: What is Feature Importance?**
    **A:** A percentage breakdown of which input variables influenced the algorithm's decisions the strongest (e.g., showing Recency is a 40% driver).

20. **Q: What happens when the user clicks 'Predict' on the frontend?**
    **A:** The React app formats a JSON payload, sends an HTTP POST request to the FastAPI backend, the API scales the data using the loaded `StandardScaler`, runs `.predict()`, and returns the prediction JSON. 

21. **Q: Why did you use React for the frontend?**
    **A:** React breaks complex dashboards into modular, reusable components and updates the User Interface instantly without refreshing the entire browser page.

22. **Q: How are you managing styling on the frontend?**
    **A:** Tailwind CSS. It uses utility classes allowing for advanced "glassmorphism" UI designs right perfectly aligned inside the HTML code.

23. **Q: If I wanted to add a new model like Support Vector Machine (SVM), how hard is that?**
    **A:** Extremely easy. The backend is modular. We simply import SVM from `sklearn`, add it to our dictionary of models in `models.py`, and the pipeline handles the rest dynamically.

24. **Q: Can this project be used in real life?**
    **A:** Yes! E-commerce stores can pipe their Shopify/WooCommerce CSV exports directly into this pipeline to immediately flag churn-risk customers and map out automated email interventions. 

25. **Q: What was the hardest part of this project?**
    **A:** Transitioning the data from raw invoice ledgers into grouped, mathematical behavioral statistics per customer, while enforcing strict time-cutoffs to prevent data leakage. 

---

## 12. HOW TO EXPLAIN THE PROJECT IN VIVA

### The 1-Minute Pitch:
"My project, SegPredict, is an intelligent Customer Analytics Dashboard. It acts as an automated brain for retail businesses. On the backend, we use Python and algorithms like Gradient Boosting to ingest raw transactional data, group customers by their spending behavior, and predict if they will return to the store in the next 30 days. The React frontend presents these insights dynamically, allowing marketing teams to easily intervene before a customer churns."

### The 3-Minute Explanation:
"SegPredict bridges the gap between raw e-commerce databases and actionable marketing. We started with the Online Retail Dataset. First, we engineered features based on RFM: Recency, Frequency, and Monetary value. We built a robust backend pipeline using FastAPI that handles pre-processing, temporal splitting, and scaling to prevent data leakage. 

I deployed K-Means clustering to discover hidden segments like 'High Value' or 'At Risk' users entirely unsupervised. Separately, I trained a suite of classifiers—including Random Forest and Logistic Regression—to supervise the timeline and predict a binary outcome: Will they purchase in the next 30 days? 

All of this links to a modular React and Tailwind frontend. Users can view robust graphical components—such as a Recharts Scatter Plot and a custom HTML confusion matrix. More importantly, they can manually input mock customer data from a browser and our deployed backend instantly calculates their risk profile using our best saved `.pkl` model."

### Key Points to always remember:
- Mention **RFM** instantly. Instructors love knowing you understand the business logic, not just code. 
- Emphasize the difference between K-Means (Unsupervised Segmentation) and Gradient Boosting/Random Forest (Supervised Prediction). 
- Always bring answers back to real-world value (Saving marketing budgets, rescuing customers before they leave forever).

---

## 13. COMMON MISTAKES & HOW YOU FIXED THEM

### 1. The Data Leakage (Feature Dominance) Bug 
**Problem:** Initially, the model showed that `PurchaseFreqPerDay` and `Recency` accounted for 99% of the decision logic, and accuracy was absurdly 99.9%. The model was "cheating". The backend was using Recency mathematically to determine the output Label itself!
**How we fixed it:** I enforced a strict "30-Day Temporal Cutoff". Features are calculated matching behavior *before* December, and the target asks "Did they buy *in* December?". This cleanly separated past behavior from future truths.

### 2. High Multicollinearity
**Problem:** Variables like `TotalItems` and `AvgItemsPerOrder` essentially measured the exact same overarching concepts, which can confuse or overly bias Linear models like Logistic Regression.
**How we fixed it:** I built a dynamic correlation function in `models.py` that utilizes a `.corr()` matrix to automatically seek out features that correlate at `> 0.85` and drops one of them structurally before model training.

### 3. Scaling Biases
**Problem:** Because `Monetary` measures thousands of dollars but `Frequency` measures 1 to 5 invoices, mathematical distance algorithms were accidentally ranking monetary amounts as the only important factor.
**How we fixed it:** Passed all numeric data arrays through SciKit's `StandardScaler`, ensuring every feature has a mean of 0 and perfectly unified variance before the algorithms study them.

---

## 14. CONCLUSION

### What the project achieves
SegPredict successfully packages highly sophisticated ML methodologies (Temporal target isolation, Unsupervised K-Means clustering alongside Supervised Tree models, Feature distribution scaling) inside a sleek, production-ready, glassmorphism UI. It proves that predictive analytics can be cleanly served to non-technical end-users in real-time.

### Future Improvements
To expand the project, one could:
- **Connect a live SQL Database** in FastAPI rather than loading local CSV files.
- Enable **Time-Series Analysis (ARIMA or LSTMs)** to predict overall exact sales volumes on a given day.
- Integrate **Authentication/Login systems** in React so marketing teams can securely save high-risk lists to their user profiles.
