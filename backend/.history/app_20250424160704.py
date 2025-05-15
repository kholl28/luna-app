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
    
    dates_1 = data.get("duration1")
    dates_1 = dates_1.split(' ')
    dates_1 = int(dates_1[0])
    
    dates_2 = data.get("duration2")
    dates_2 = dates_2.split(' ')
    dates_2 = int(dates_2[0])
    
    # split to get number
# convert to integer
# - 1
    
    
    cycle_1 = data.get("cycle_1")
    cycle_1 = cycle_1.split(' ')
    cycle_1 = int(cycle_1[0])
    cycle_1 = cycle_1 - 1
    
    cycle_2 = data.get()

    
    Age = data.get('Age')
    Age = int(Age)
    Feet = data.get('Feet')
    Inches = data.get('Inches')
    weight = data.get('weight')
    Inches = int(Inches)
    Feet = int(Feet)
    height_inches = height_converter(Feet, Inches)  # Convert height to total inches
    weight_num = float(weight)  # Convert weight to a float
    bmi = round((weight_num / (height_inches ** 2) * 703), 2)
    
    print("Dates 1: ", dates_1)
    print("Dates 2: ", dates_2)
    print("Dates 3: ", dates_3)
    

     # ==================
    # port user inputs to model
    # ==================
    # giving inputs to the machine learning model
    # -------------
    features = [[cycle_1, cycle_2, age, bmi]]
    features = np.array(features)

    # using inputs to predict the output
    # -------------
    prediction = model.predict(features)
    
    # convert prediction to integer
    # -------------
    prediction = prediction[0].astype(float)

    # convert prediction from cycle length to next cycle start date
    # -------------
    cycle_3 = third_cycle.date() + timedelta(days = prediction) + timedelta(days = 1)

    # format the datetime object to mm/dd/yyyy
    # -------------
    predicted_date = cycle_3.strftime("%m/%d")

    # return render_template('index.html', prediction_text=f"The predicted day that your next period will begin on is: {predicted_date}")

    
    return {"predicted_date": predicted_date}
    


# # convert cycle dates to datetime objects
# -------------




# extract number of days as integer
# -------------
# cycle_1 = user_cycle1.days
# cycle_2 = user_cycle2.days

        
    # ==================
    # model inputs
    # ==================
    # cycles
    # -------------
    # first start date (3 months ago):
    # first_cycle = datetime.strptime(user_1, date_format)
    # first_cycle = myDatePicker.getFullDate(user_1)

    # second start date (two months ago):
    # second_cycle = myDatePicker.getFullDate(user_2)

    # first start date (*most recent*):
    # third_cycle = myDatePicker.getFullDate(user_3)

    # ==================
    # conversion
    # ==================
    # convert cycle dates to datetime objects 
    # -------------
    date_format = "%m/%d/%y"
    
    third_cycle = datetime.strptime(user_3, date_format)
    second_cycle = datetime.strptime(user_2, date_format)
    first_cycle = datetime.strptime(user_1, date_format)


    # convert user-inputted height in feet and inches to inches only
    # -------------
    def height_converter(height):
        feet, inches = map(int, height.split("'"))
        total_inches = (feet * 12) + inches
        return total_inches

    # create BMI variable from user-inputted height & weight
    # -------------
    height_inches = height_converter(height)  # Convert height to total inches
    weight_num = float(weight)  # Convert weight to a float

    bmi = round((weight_num / (height_inches ** 2) * 703), 2)

    # ==================
    # port user inputs to model
    # ==================
    # giving inputs to the machine learning model
    # -------------
    features = [[cycle_1, cycle_2, int(age), bmi]]
    features = np.array(features)

    # using inputs to predict the output
    # -------------
    prediction = model.predict(features)

    # convert prediction to integer
    # -------------
    prediction = prediction[0].astype(float)

    # convert prediction from cycle length to next cycle start date
    # -------------
    cycle_3 = third_cycle.date() + timedelta(days = prediction)

    # format the datetime object to mm/dd/yyyy
    # -------------
    predicted_date = cycle_3.strftime("%m/%d/%y")

    return render_template('index.html', prediction_text=f"The predicted day that your next period will begin on is: {predicted_date}")


    # print("\nThe predicted day that your next period will begin is: {}".format(predicted_date))
    # print("\n\nThank you for using my menstrual cycle predictor tool! Goodbye!\n")
    
if __name__ == '__main__':
    # serve(app, host = "0.0.0.0", port = 8080)
    # app.run(host = "0.0.0.0", port = 8080)
    app.run()
    # app.run(debug=True)

