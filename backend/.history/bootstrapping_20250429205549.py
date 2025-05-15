# ==================
# uncertainty model
# ==================

import pandas as pd
import matplotlib.pyplot as plt
from datetime import datetime, timedelta

# features
 # -------------
# replace prediction with X_test with prediction on the new user input
# user_input as a dictionary
input = {
    'cycle_1': cycle_1,
    'cycle_2': cycle_2,
    'Age': Age,
    'height_inches': height_inches,
    'weight_num': weight_num,
    'bmi': bmi
}

# convert user input to DataFrame
# ensure that the input is formatted as a pd DataFrame that matches the training data structure
user_input = pd.DataFrame([input])[X_train.columns]

# boostrapping
 # -------------
n_iterations = 100  # number of bootstrapped models
predictions = []

for i in range(n_iterations):
    # create a bootstrapped dataset
    indices = np.random.choice(len(X_train), len(X_train), replace=True)
    # use .iloc[] to access rows by index
    X_resampled, y_resampled = X_train.iloc[indices], y_train.iloc[indices] 
    
    # Train an XGBoost model
    model = xgb.XGBRegressor(colsample_bytree=0.8, learning_rate=0.1, max_depth=3, 
                             n_estimators=50, subsample=0.8)
    model.fit(X_resampled, y_resampled)
    
    # predict on test data
    preds = model.predict(user_input)
    predictions.append(preds)

# Convert predictions to a NumPy array
predictions = np.array(predictions)

# calculate the mean and standard deviation of the predictions
mean_preds = np.mean(predictions, axis=0)
std_preds = np.std(predictions, axis=0)

# confidence intervals
lower_bound = mean_preds - 1.96 * std_preds
upper_bound = mean_preds + 1.96 * std_preds

# Visualization
 # -------------

# Example: CI ±3 days
ci_lower = prediction - timedelta(days=3)
ci_upper = prediction + timedelta(days=3)

# Plot
fig, ax = plt.subplots(figsize=(8, 2))

# Plot prediction
ax.axvline(prediction, color='blue', linestyle='--', label='Predicted Start Date')

# Plot CI
ax.axvspan(ci_lower, ci_upper, color='skyblue', alpha=0.5, label='95% Confidence Interval')

# Format
ax.set_title("Predicted Menstrual Cycle Start Date with Confidence Interval")
ax.set_xlim(ci_lower - timedelta(days=1), ci_upper + timedelta(days=1))
ax.set_xlabel("Date")
ax.get_yaxis().set_visible(False)
ax.legend()

plt.tight_layout()
plt.show()