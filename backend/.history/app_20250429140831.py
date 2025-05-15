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
    Age = data.get('Age')
    Age = int(Age)
    
    # height
    Feet = data.get('Feet')
    Feet = int(Feet)
    Inches = data.get('Inches')
    Inches = int(Inches)
    
     # height converter
    height_inches = height_converter(Feet, Inches)  # Convert height to total inches
    
    # weight
    weight = data.get('weight')
    weight_num = float(weight)  # Convert weight to a float
    
    # bmi converter
    bmi = round((weight_num / (height_inches ** 2) * 703), 2)
    
    print("Cycle 1 length: ", cycle_1)
    print("Cycle 2 length: ", cycle_2)

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
    cycle_3 = timedelta(days = cycle_2) + timedelta(days = prediction) + timedelta(days = 1)

    # format the datetime object to mm/dd/yyyy
    # -------------
    prediction = cycle_3.strftime("%m/%d")
    
    result = prediction
    
# ==================
    # uncertainty model
    # ==================
    
    # bootstrapping
    # -------------
    n_iterations = 100  # number of bootstrapped models, should I decrease to 50 or keep at 100?
    bootstrap_predictions = []
    
    for i in range(n_iterations):
    # create a bootstrapped dataset
    indices = np.random.choice(len(features), len(features), replace=True)
    X_resampled, y_resampled = features[indices], prediction[indices]
    
    # Train an XGBoost model
    model = xgb.XGBRegressor()
    model.fit(X_resampled, y_resampled)
    
    # Predict on test data
    preds = model.predict(features)
    bootstrap_predictions.append(preds)
    
    # Convert predictions to a NumPy array
    predictions = np.array(predictions)

# Calculate the mean and standard deviation of the predictions
mean_preds = np.mean(predictions, axis=0)
std_preds = np.std(predictions, axis=0)

# Confidence intervals
lower_bound = mean_preds - 1.96 * std_preds
upper_bound = mean_preds + 1.96 * std_preds
quantiles = [0.05, 0.5, 0.95]
models = {}

for quantile in quantiles:
    model = xgb.XGBRegressor(objective=quantile_loss(quantile))
    model.fit(X_train, y_train)
    models[quantile] = model

# Predicting quantiles
preds_05 = models[0.05].predict(X_test)
preds_50 = models[0.5].predict(X_test)
preds_95 = models[0.95].predict(X_test)

# Lower and upper bounds
lower_bound = preds_05
upper_bound = preds_95
median_prediction = preds_50
    
    
    
    
    
    
    
    
if __name__ == '__main__':
    # serve(app, host = "0.0.0.0", port = 8080)
    # app.run(host = "0.0.0.0", port = 8080)
    app.run()
    # app.run(debug=True)

