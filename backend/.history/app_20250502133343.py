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
from sklearn.preprocessing import StandardScaler
from sklearn.impute import SimpleImputer

# import from model.py
from model import BMICalculator, X_train, y_train

app = Flask(__name__)
CORS(app)

model = pickle.load(open('./model.pkl', 'rb')) # load in machine learning model

# Create preprocessing objects
imputer = SimpleImputer(strategy='mean')
scaler = StandardScaler()

# Preprocess X_train
X_train_array = imputer.fit_transform(X_train)
X_train_array = BMICalculator().transform(X_train_array)
X_train_array = scaler.fit_transform(X_train_array)

@app.route('/')
def hello():
    return "<p>Hello, World!</p>"

@app.route('/predict', methods=['POST'])
def predict():
    def height_converter(Feet, Inches):
        return (Feet * 12) + Inches

    data = request.get_json()

    # Parse dates and input features
    try:
        cycle2_start = datetime.strptime(data.get("thirdDate"), "%Y-%m-%d").date()
        cycle_1 = int(data.get("cycle_1").split(' ')[0]) - 1
        cycle_2 = int(data.get("cycle_2").split(' ')[0]) - 1
        Age = int(data.get("Age"))
        Feet = int(data.get("Feet"))
        Inches = int(data.get("Inches"))
        Height = height_converter(Feet, Inches)
        Weight = float(data.get("Weight"))
        BMI = round((Weight / (Height ** 2) * 703), 2)

        # Format input for model
        input_dict = {
            "Cycle_1": cycle_1,
            "Cycle_2": cycle_2,
            "Age": Age,
            "Height": Height,
            "Weight": Weight,
            "BMI": BMI
        }
        
        user_input = pd.DataFrame([input_dict])
        
        # reindex
        # Ensure user_input has the same columns as X_train
        X_train = ['Cycle_1', 'Cycle_2', 'Age', 'Height', 'Weight', 'BMI'] 
        user_input = user_input.reindex(columns=X_train.columns, fill_value=0)
        
        # Ensure user_input has all required columns in the correct order
        required_columns = X_train.columns.tolist()
        
        # Check if any columns are missing and add them with default values
        for col in required_columns:
            if col not in user_input.columns:
                user_input[col] = 0  # Use an appropriate default value
        
        # Reorder columns to match X_train
        user_input = user_input[required_columns]
        
        # Apply the same preprocessing to user_input as was applied to X_train
        user_input_array = imputer.transform(user_input)
        user_input_array = BMICalculator().transform(user_input_array)
        user_input_array = scaler.transform(user_input_array)
        
        # Bootstrap predictions
        n_iterations = 100
        preds = []
        for _ in range(n_iterations):
            try:
                idx = np.random.choice(len(X_train_array), len(X_train_array), replace=True)
                X_resampled = X_train_array[idx]
                y_resampled = y_train.iloc[idx]
                
                model.fit(X_resampled, y_resampled)
                pred = model.predict(user_input_array)[0]
                preds.append(pred)
            except Exception as e:
                # Log the error but continue with other iterations
                print(f"Error in bootstrap iteration: {str(e)}")
                continue

        if not preds:
            return jsonify({"error": "Failed to generate predictions"}), 500

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

        result = {
            "predictionDate": predicted_date.strftime("%m-%d"),
            "lowerBound": lower_bound_date.strftime("%m-%d"),
            "upperBound": upper_bound_date.strftime("%m-%d")
        }
        return jsonify(result)
        
    except KeyError as e:
        return jsonify({"error": f"Missing or invalid key in input data: {str(e)}"}), 400
    except ValueError as e:
        return jsonify({"error": f"Invalid value in input data: {str(e)}"}), 400
    except Exception as e:
        return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True)
