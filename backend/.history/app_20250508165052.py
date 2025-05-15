"""
# Menstrual Cycle Prediction Tool Using Age and BMI as Secondary Predictor Variables

Original file is located at
    https://colab.research.google.com/drive/1XzNtAuAQfjH2hHFO-thXkM5xemfYrSF_

The present analysis' primary goal is to create a menstrual cycle tracker that can be used to predict the day a user's next period will start based on information from their last three menstrual cycles.

The User's self-reported age and BMI will also be used as secondary predictor variables that will adjust the final prediction outputted by the model.

Previous research has indicated that age and BMI has a statistically significant relationship with menstrual cycle length, in that women in different age groups and BMI categories experience significant differences in cycle length. Thus, the model will adjust its final prediction based on this User-inputted information.

This will be achieved through the use of a machine learning model that will be trained using data from a study which collected the menstrual cycle and demographic information of a large nationally-representative sample of women.

User-inputted information will be piped into the final machine learning model in order to provide the user with a predicted start date of their next period.
"""

# IMPORTING REQUIRED PACKAGES
# ==================
from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime, timedelta
import numpy as np
import pandas as pd
import xgboost as xgb
import pickle

# import from model.py
from model import BMICalculator, X_train, y_train

app = Flask(__name__)
CORS(app)

model = pickle.load(open('./model.pkl', 'rb')) # load in machine learning model

# @app.route('/')
# def hello():
#     return "<p>Hello, World!</p>"

@app.route('/predict', methods=['POST'])
def predict():
    def height_converter(Feet, Inches):
        return (Feet * 12) + Inches

data = request.get_json()

# Parse dates and input features
cycle2_start = datetime.strptime(data.get("thirdDate"), "%Y-%m-%d").date()
cycle_1 = int(data.get("cycle_1").split(' ')[0]) - 1
cycle_2 = int(data.get("cycle_2").split(' ')[0]) - 1
Age = int(data.get("Age"))
Feet = int(data.get("Feet"))
Inches = int(data.get("Inches"))
height_inches = height_converter(Feet, Inches)
weight = float(data.get("weight"))
BMI = round((weight / (height_inches ** 2) * 703), 2)

# Format input for model - create DataFrame with exact column names
input_data = {
    "Cycle_1": [float(cycle_1)],
    "Cycle_2": [float(cycle_2)],
    "Age": [float(Age)],
    "Height": [float(height_inches)],
    "Weight": [float(weight)],
    "BMI": [float(BMI)]
    }
    
# create DataFrame directly with the columns in the right order
user_input = pd.DataFrame(input_data)
# Ensure all columns are float type
user_input = user_input.astype(float)
    
# Bootstrap predictions
n_iterations = 100
preds = []
for _ in range(n_iterations):
    # Check if X_train is a DataFrame or ndarray and handle accordingly
    if hasattr(X_train, 'iloc'):  # It's a DataFrame
        idx = np.random.choice(len(X_train), len(X_train), replace=True)
        X_resampled = X_train.iloc[idx].astype(float)
        y_resampled = y_train.iloc[idx].astype(float)
    else:  # It's a NumPy array
        idx = np.random.choice(len(X_train), len(X_train), replace=True)
        X_resampled = X_train[idx].astype(float)
        y_resampled = y_train[idx].astype(float) if isinstance(y_train, np.ndarray) else y_train.iloc[idx].astype(float)

model.fit(X_resampled, y_resampled)
pred = model.predict(user_input)[0]
preds.append(pred)

preds = np.array(preds)
mean = np.mean(preds)
std = np.std(preds)
ci_multiplier = 1.44  # 85% confidence interval

    main_pred = float(preds[0])
    ci_lower = mean - ci_multiplier * std
    ci_upper = mean + ci_multiplier * std
    
    # Convert ci_lower to a float
    ci_lower = float(ci_lower)
    ci_upper = float(ci_upper)

    predicted_date = cycle2_start + timedelta(days=main_pred) + timedelta(days=1)
    lower_bound_date = cycle2_start + timedelta(days=ci_lower)
    upper_bound_date = cycle2_start + timedelta(days=ci_upper)

# *****************************
# WHICH TO USE, PREDICTED LENGTH OR PREDICTED DATE?
# *****************************

    result = {
        "predictionDate": predicted_date.strftime("%m-%d"),
        "lowerBound": lower_bound_date.strftime("%m-%d"),
        "upperBound": upper_bound_date.strftime("%m-%d"),
        "main_pred": main_pred,
        "ci_lower": ci_lower,
        "ci_upper": ci_upper
    }
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)
