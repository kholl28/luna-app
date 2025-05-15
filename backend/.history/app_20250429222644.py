from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime, timedelta
import numpy as np
import pandas as pd
import xgboost as xgb
import pickle

# Import X_train and y_train from model.py
from ml-model.model import X_train, y_train

app = Flask(__name__)
CORS(app)

model = pickle.load(open('ml-model/model.pkl', 'rb'))  # load in machine learning model
