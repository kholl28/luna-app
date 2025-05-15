# Importing required libraries
import pandas as pd
import pickle

from sklearn.ensemble import RandomForestRegressor
import xgboost as xgb # XGB

from sklearn.metrics import root_mean_squared_error, r2_score
from sklearn.model_selection import train_test_split, GridSearchCV, RandomizedSearchCV, cross_val_score

from sklearn.preprocessing import StandardScaler
from sklearn.impute import SimpleImputer
from sklearn.pipeline import Pipeline
from sklearn.base import BaseEstimator, TransformerMixin

from datetime import datetime, date, timedelta

# import dataset
df = pd.read_csv('https://github.com/kholl28/data/raw/refs/heads/main/final_df.csv')

X_train = df[['Cycle_1', 'Cycle_2', 'Age', 'Height', 'Weight', 'BMI']] # denote all predictos with uppercase X
y_train = df['Cycle_3'] # denote target (outcome variable) with lowercase Y

'''
# THIS MODEL SECTION WILL EVENTUALLY BE CHANGED TO WHICHEVER MODEL IS FOUND TO BE BEST DURING MACHINE LEARNING FINAL PROJECT
# '''

# PRE-PROCESSING
# ==================

# BMI missing value calculator
def calculate_missing_bmi(X):
    X = X.copy()
    missing_bmi_mask = X["BMI"].isnull() & X["Weight"].notnull() & X["Height"].notnull()
    X.loc[missing_bmi_mask, "BMI"] = (
        (X.loc[missing_bmi_mask, "Weight"] / (X.loc[missing_bmi_mask, "Height"] ** 2) * 703).round(2)
    )
    return X

 # create imputer object
imputer = SimpleImputer(strategy='mean')

# impute missing values in X_train
X_train = imputer.fit_transform(X_train)

# Apply the function to X_train
X_train = calculate_missing_bmi(X_train)

# scale X_train
scaler = StandardScaler()
X_train = scaler.fit_transform(X_train)

# MODEL
# ==================
class model:
    model = xgb.XGBRegressor(
        objective='reg:squarederror',
        n_estimators=200,
        learning_rate=0.01,
        max_depth=3,
        min_child_weight=1,
        gamma=0.1,
        subsample=0.8,
        colsample_bytree=0.8,
        random_state=42
    )
    model.fit(X_train, y_train) # fitting the model

class model:
model = xgb.XGBRegressor(
    objective='reg:squarederror', # minimise 
    n_estimators=200,
    learning_rate=0.01,
    max_depth=7,
    subsample=0.8,
    colsample_bytree=0.8,
)

model.fit(X_train, y_train) # fitting the model

pickle.dump(model, open('model.pkl', 'wb')) # save the model

# print(model.predict(features))
