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

"""
# Menstrual Cycle Prediction Tool Using Age and BMI as Secondary Predictor Variables
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
import traceback

# import from model.py
from model import BMICalculator, X, y

app = Flask(__name__)
CORS(app)

# Load the machine learning model
model = pickle.load(open('./model.pkl', 'rb'))

# Add a root endpoint for health checks
@app.route('/')
def hello():
    return jsonify({"status": "API is running"})

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get the JSON data from the request
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        # Log the received data for debugging
        print("Received data:", data)

        def height_converter(Feet, Inches):
            return (Feet * 12) + Inches

        # Parse dates and input features
        # Handle either string format or Date object from JavaScript
        thirdDate = data.get("thirdDate")
        if isinstance(thirdDate, str):
            try:
                cycle2_start = datetime.strptime(thirdDate, "%Y-%m-%d").date()
            except ValueError:
                return jsonify({"error": f"Invalid date format for thirdDate: {thirdDate}. Expected YYYY-MM-DD"}), 400
        else:
            return jsonify({"error": "thirdDate must be a string in YYYY-MM-DD format"}), 400
            
        # Get cycle lengths and handle format variations
        cycle_1_raw = data.get("cycle_1")
        cycle_2_raw = data.get("cycle_2")
        
        try:
            if isinstance(cycle_1_raw, str) and "days" in cycle_1_raw:
                cycle_1 = int(cycle_1_raw.split(' ')[0]) - 1
            else:
                cycle_1 = int(cycle_1_raw) - 1
                
            if isinstance(cycle_2_raw, str) and "days" in cycle_2_raw:
                cycle_2 = int(cycle_2_raw.split(' ')[0]) - 1
            else:
                cycle_2 = int(cycle_2_raw) - 1
        except (ValueError, TypeError) as e:
            return jsonify({"error": f"Invalid cycle length format: {e}"}), 400
            
        # Get demographic information
        try:
            Age = int(data.get("Age"))
            Feet = int(data.get("Feet"))
            Inches = int(data.get("Inches"))
            
            # Handle different case variations for weight
            weight_value = data.get("weight") or data.get("Weight")
            if weight_value is None:
                return jsonify({"error": "Weight is required"}), 400
                
            weight = float(weight_value)
        except (ValueError, TypeError) as e:
            return jsonify({"error": f"Invalid demographic data: {e}"}), 400
            
        # Calculate height in inches and BMI
        height_inches = height_converter(Feet, Inches)
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
            idx = np.random.choice(len(X), len(X), replace=True)
            X_resampled = X.iloc[idx].astype(float)
            y_resampled = y.iloc[idx].astype(float)

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
        
        # Convert values to float to ensure JSON serialization
        ci_lower = float(ci_lower)
        ci_upper = float(ci_upper)

        predicted_date = cycle2_start + timedelta(days=main_pred) + timedelta(days=1)
        lower_bound_date = cycle2_start + timedelta(days=ci_lower) + timedelta(days=1)
        upper_bound_date = cycle2_start + timedelta(days=ci_upper) + timedelta(days=1)

        # Create the result object
        result = {
            "predictionDate": predicted_date.strftime("%m-%d"),
            "lowerBound": lower_bound_date.strftime("%m-%d"),
            "upperBound": upper_bound_date.strftime("%m-%d"),
            "main_pred": float(main_pred),
            "ci_lower": float(ci_lower),
            "ci_upper": float(ci_upper)
        }
        
        return jsonify(result)
        
    except Exception as e:
        print("Error in prediction:", str(e))
        print(traceback.format_exc())
        return jsonify({"error": str(e), "trace": traceback.format_exc()}), 500

if __name__ == '__main__':
    app.run(debug=True)