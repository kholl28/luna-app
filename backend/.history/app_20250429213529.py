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
# import kagglehub
import math
# import matplotlib.pyplot as plt
import numpy as np
import os
# import pandas as pd
# import pip
# import seaborn as sns
# import scipy
# import shutil
# import torch
# import random

# from sklearn.ensemble import RandomForestRegressor
# from sklearn.metrics import root_mean_squared_error, r2_score
# from sklearn.model_selection import train_test_split, GridSearchCV, RandomizedSearchCV, cross_val_score

from datetime import datetime, date, timedelta

# web app packages
from flask import Flask, render_template, request
from flask_cors import CORS

import pickle
# from predict import predict_cycle
# from waitress import serve

# # load_dotenv()

# from flask import Flask, request, jsonify

app = Flask(__name__)
CORS(app)

model = pickle.load(open('ml-model copy/model.pkl', 'rb')) # load in machine learning model

@app.route('/')
def hello():
    return "<p>Hello, World!</p>"
    # return render_template('index.html') # returns an HTML file every time we go to link in the front-end
    

@app.route('/predict', methods = ['POST'])
def predict():
    def height_converter(Feet, Inches):
        total_inches = (Feet * 12) + Inches
        return total_inches
    
    data = request.get_json()
    
    # thirdDate = data.get("thirdDate") # get third date to calculate start time of next period
    thirdDate = datetime.strptime(data.get("thirdDate"), "%Y-%m-%d").date()
    
    # cycles
    cycle_1 = data.get("cycle_1")
    cycle_1 = cycle_1.split(' ')
    cycle_1 = int(cycle_1[0])
    cycle_1 = cycle_1 - 1
    
    cycle_2 = data.get("cycle_2")
    cycle_2 = cycle_2.split(' ')
    cycle_2 = int(cycle_2[0])
    cycle_2 = cycle_2 - 1

    # age
    Age = int(data.get('Age'))
    # height
    Feet = int(data.get('Feet'))
    Inches = int(data.get('Inches'))
     # height converter
    height_inches = height_converter(Feet, Inches)  # Convert height to total inches
    
    # weight
    weight = float(data.get('weight')) # Convert weight to a float
    # bmi converter
    bmi = round((weight_num / (height_inches ** 2) * 703), 2)
    
    # print("Cycle 1 length: ", cycle_1)
    # print("Cycle 2 length: ", cycle_2)

    # ==================
    # port user inputs to model
    # ==================
    # giving inputs to the machine learning model
    # -------------
    features = [[cycle_1, cycle_2, Age, bmi]]
    features = np.array(features)

    # using inputs to predict the output
    # -------------
    prediction = model.predict(features)
    
    # convert prediction to integer
    # -------------
    prediction = prediction[0].astype(int)

    # convert prediction from cycle length to next cycle start date
    # -------------
    # cycle_3 = cycle_2 + timedelta(days = prediction) + timedelta(days = 1)
    prediction = thirdDate[1] + timedelta(days = prediction) + timedelta(days = 1)

    # format the datetime object to mm/dd/yyyy
    # -------------
    prediction = cycle_3.strftime("%m/%d")
    
    result = prediction   
    
if __name__ == '__main__':
    # serve(app, host = "0.0.0.0", port = 8080)
    # app.run(host = "0.0.0.0", port = 8080)
    app.run()
    # app.run(debug=True)

from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime, timedelta
import numpy as np
import pandas as pd
import xgboost as xgb
import pickle

app = Flask(__name__)
CORS(app)

# Load your training data for bootstrapping
X_train = pd.read_csv("X_train.csv")
y_train = pd.read_csv("y_train.csv").squeeze()

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
