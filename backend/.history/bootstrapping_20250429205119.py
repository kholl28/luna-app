# ==================
# uncertainty model
# ==================

import matplotlib.pyplot as plt
from datetime import datetime, timedelta

# features
 # -------------
# Convert 'features' to a pandas DataFrame for easier resampling with target
features_df = pd.DataFrame(['cycle_1', 'cycle_2', 'Age', 'height_inches', 'weight_num' 'bmi'])

n_iterations = 100  # Number of bootstrapped models
predictions = []

for i in range(n_iterations):
    # Create a bootstrapped dataset
    indices = np.random.choice(len(X_train), len(X_train), replace=True)
    # Use .iloc[] to access rows by index
    X_resampled, y_resampled = X_train.iloc[indices], y_train.iloc[indices] 
    
    # Train an XGBoost model
    model = xgb.XGBRegressor(colsample_bytree=0.8, learning_rate=0.1, max_depth=3, n_estimators=50, subsample=0.8)
    model.fit(X_resampled, y_resampled)
    
    # Predict on test data
    preds = model.predict(X_test)
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