import os
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
import os
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from datetime import datetime, timedelta
import numpy as np
import pandas as pd
import xgboost as xgb
import pickle
import traceback

# import from model.py
from model import BMICalculator, X, y

static_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'frontend', 'out')

app = Flask(__name__, static_folder=static_path, static_url_path='')
CORS(app, resources={r"/*": {"origins": "*", "methods": ["GET", "POST", "OPTIONS"], "allow_headers": ["Content-Type"]}})

# Load the machine learning model
model = pickle.load(open('./model.pkl', 'rb'))

# Add a root endpoint for health checks
@app.route("/")
def serve_index():
    return send_from_directory(app.static_folder, "index.html")

@app.route('/<path:path>')
def serve_static(path):
    if os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, "index.html")

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get the JSON data from the request
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        # Log the received data for debugging
        print("Received data:", data)

        # Check if all required fields are present
        required_fields = ["thirdDate", "cycle_1", "cycle_2", "Age", "Feet", "Inches, ]
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing required field: {field}"}), 400
        
        # # Check for weight with case insensitivity
        # weight_value = data.get("Weight") if "Weight" in data else data.get("Weight")
        # if weight_value is None:
        #     return jsonify({"error": "Missing required field: Weight"}), 400

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
            
        # Get demographic information with better error handling
        try:
            Age = int(data.get("Age", 0))
            if Age <= 0:
                return jsonify({"error": "Age must be a positive number"}), 400
                
            Feet = int(data.get("Feet", 0))
            if Feet <= 0:
                return jsonify({"error": "Feet must be a positive number"}), 400
                
            Inches = int(data.get("Inches", 0))
            if Inches < 0 or Inches > 11:
                return jsonify({"error": "Inches must be between 0 and 11"}), 400
            
            Weight = float(data.get("Weight", 0))
            if Weight <= 0:
                return jsonify({"error": "Weight must be a positive number"}), 400
        except (ValueError, TypeError) as e:
            return jsonify({"error": f"Invalid demographic data format: {str(e)}"}), 400
            
        # Calculate height in inches and BMI
        height_inches = height_converter(Feet, Inches)
        if height_inches <= 0:
            return jsonify({"error": "Height calculation resulted in an invalid value"}), 400
            
        BMI = round((Weight / (height_inches ** 2) * 703), 2)
        if BMI <= 0:
            return jsonify({"error": "BMI calculation resulted in an invalid value"}), 400

        # Format input for model - create DataFrame with exact column names
        input_data = {
            "Cycle_1": [float(cycle_1)],
            "Cycle_2": [float(cycle_2)],
            "Age": [float(Age)],
            "Height": [float(height_inches)],
            "Weight": [float(Weight)],
            "BMI": [float(BMI)]
        }
            
        # Create DataFrame directly with the columns in the right order
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

        # Log the dates being generated
        print(f"Generated prediction dates - main: {predicted_date}, lower: {lower_bound_date}, upper: {upper_bound_date}")
        
        # Create the result object
        result = {
            "predictionDate": predicted_date.strftime("%Y-%m-%d"),
            "lowerBound": lower_bound_date.strftime("%Y-%m-%d"),
            "upperBound": upper_bound_date.strftime("%Y-%m-%d"),
            "main_pred": float(main_pred),
            "ci_lower": float(ci_lower),
            "ci_upper": float(ci_upper)
        }
        # Log the final result being returned
        print("Returning prediction result:", result)
        
        return jsonify(result)
        
    except Exception as e:
        print("Error in prediction:", str(e))
        print(traceback.format_exc())
        return jsonify({"error": str(e), "trace": traceback.format_exc()}), 500

# Run the app
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
