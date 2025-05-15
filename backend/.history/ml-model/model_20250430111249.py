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

from datetime import datetime, date, timedelta

# import dataset
df = pd.read_csv('https://github.com/kholl28/data/raw/refs/heads/main/final_df.csv')

X_train = df[['Cycle_1', 'Cycle_2', 'Age', 'BMI']] # denote all predictos with uppercase X
y_train = df['Cycle_3'] # denote target (outcome variable) with lowercase Y

'''
# THIS MODEL SECTION WILL EVENTUALLY BE CHANGED TO WHICHEVER MODEL IS FOUND TO BE BEST DURING MACHINE LEARNING FINAL PROJECT
# '''

# # create the pipeline
pipeline = Pipeline([
    ('bmi_calc', BMICalculator()),
    ("scaler", StandardScaler()),
    ('imputer', SimpleImputer(strategy = 'mean')),
    ('xgb', xgb.XGBRegressor())
])

model = RandomForestRegressor(random_state = 42) # final model 
model.fit(X_train, y_train) # fitting the model

pickle.dump(model, open('model.pkl', 'wb')) # save the model

# print(model.predict(features))
