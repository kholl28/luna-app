# ==================
# uncertainty model
# ==================

import matplotlib.pyplot as plt
from datetime import datetime, timedelta

# bootstrapping
# -------------
n_iterations = 100  # number of bootstrapped models, should I decrease to 50 or keep at 100?
bootstrap_predictions = []
    
for i in range(n_iterations):
    # create a bootstrapped dataset
    indices = np.random.choice(len(features), len(features), replace=True)
    X_resampled, y_resampled = features[indices], prediction[indices]
    
# Train an XGBoost model
model = xgb.XGBRegressor(xgb__colsample_bytree = 0.8, xgb__learning_rate = 0.1, xgb__max_depth = 3, xgb__n_estimators = 50, xgb__subsample = 0.8)
model.fit(X_resampled, y_resampled)
    
# Predict on user data
preds = model.predict(features)
bootstrap_predictions.append(preds)
    
# Convert bootstrap_predictions to a NumPy array
bootstrap_predictions = np.array(bootstrap_predictions)

# Calculate the mean and standard deviation of the boostrap_predictions
mean_preds = np.mean(bootstrap_predictions, axis=0)
std_preds = np.std(bootstrap_predictions, axis=0)

# Confidence intervals
lower_bound = mean_preds - 1.96 * std_preds
upper_bound = mean_preds + 1.96 * std_preds
quantiles = [0.05, 0.5, 0.95]
models = {}

for quantile in quantiles:
    model = xgb.XGBRegressor(objective=quantile_loss(quantile))
    model.fit(features, prediction)
    models[quantile] = model

# Predicting quantiles
preds_05 = models[0.05].predict(features)
preds_50 = models[0.5].predict(features)
preds_95 = models[0.95].predict(features)

# Lower and upper bounds
lower_bound = preds_05
upper_bound = preds_95
median_prediction = preds_50
    
# Visualization
plt.figure(figsize=(10, 6))
plt.plot(median_prediction, label='Median Prediction', color='blue')
plt.fill_between(range(len(median_prediction)), lower_bound, upper_bound, color='gray', alpha=0.5, label='Prediction Interval')
plt.title('Quantile Regression Prediction Interval')
plt.xlabel('Test Data Points')
plt.ylabel('Predictions')
plt.legend()
plt.show()  


# Visualization
 # -------------

# Example: CI ±3 days
ci_lower = prediction - timedelta(days=3)
ci_upper = prediction + timedelta(days=3)

# Plot
fig, ax = plt.subplots(figsize=(8, 2))

# Plot prediction
ax.axvline(predicted_start, color='blue', linestyle='--', label='Predicted Start Date')

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