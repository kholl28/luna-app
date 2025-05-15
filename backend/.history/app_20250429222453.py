# IMPORTING REQUIRED PACKAGES
# ==================
from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime, timedelta
import numpy as np
import pandas as pd
import xgboost as xgb
import pickle
from model import X_train, y_train  # Import X_train and y_train from model.py

app = Flask(__name__)
CORS(app)

model = pickle.load(open('ml-model copy/model.pkl', 'rb'))  # load in machine learning model

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
