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

app = Flask(__name__)
CORS(app)

model = pickle.load(open('ml-model/model.pkl', 'rb')) # load in machine learning model





# Import X_train and y_train from model.py
# from ml-model.model import X_train, y_train

@app.route('/')
def hello():
    return "<p>Hello, World!</p>"

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

    # Format input for model
    input_dict = {
        "Cycle_1": cycle_1,
        "Cycle_2": cycle_2,
        "Age": Age,
        "Height": height_inches,
        "Weight": weight,
        "BMI": BMI
    }
    user_input = pd.DataFrame([input_dict])[X_train.columns]

    # Bootstrap predictions
    n_iterations = 100
    preds = []
    for _ in range(n_iterations):
        idx = np.random.choice(len(X_train), len(X_train), replace=True)
        X_resampled = X_train.iloc[idx]
        y_resampled = y_train.iloc[idx]

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

    predicted_date = cycle2_start + timedelta(days=main_pred)
    lower_bound_date = cycle2_start + timedelta(days=ci_lower)
    upper_bound_date = cycle2_start + timedelta(days=ci_upper)

    response = {
        "predictionDate": predicted_date.strftime("%m-%d"),
        "lowerBound": lower_bound_date.strftime("%m-%d"),
        "upperBound": upper_bound_date.strftime("%m-%d")
    }
    return jsonify(response)

if __name__ == '__main__':
    app.run(debug=True)
