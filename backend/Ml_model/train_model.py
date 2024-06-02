import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error
import joblib

# Example data (replace with your actual data source)
data = {
    'productId': [1, 1, 2, 2, 3, 3],
    'quantity': [10, 15, 8, 12, 5, 6],
    'totalPrice': [100, 150, 80, 120, 50, 60],
    'transactiondate': pd.to_datetime(['2022-01-01', '2022-01-05', '2022-01-03', '2022-01-10', '2022-01-07', '2022-01-15'])
}
df = pd.DataFrame(data)

# Feature engineering
df['day_of_week'] = df['transactiondate'].dt.dayofweek
df['month'] = df['transactiondate'].dt.month
df['day_of_month'] = df['transactiondate'].dt.day

# Generate the target variable for date prediction (days until next transaction)
df = df.sort_values(['productId', 'transactiondate'])
df['next_transaction_date'] = df.groupby('productId')['transactiondate'].shift(-1)
df['days_until_next_transaction'] = (df['next_transaction_date'] - df['transactiondate']).dt.days

# Remove the last entry for each productId since it has no next transaction date
df = df.dropna(subset=['days_until_next_transaction'])

# Select features and target variables
features = ['quantity', 'day_of_week', 'month', 'day_of_month']
X = df[features]
y_quantity = df['quantity']
y_date = df['days_until_next_transaction']

# Train models
# Quantity model
X_train, X_test, y_train, y_test = train_test_split(X, y_quantity, test_size=0.2, random_state=42)
quantity_model = RandomForestRegressor(n_estimators=100, random_state=42)
quantity_model.fit(X_train, y_train)
quantity_predictions = quantity_model.predict(X_test)
quantity_mae = mean_absolute_error(y_test, quantity_predictions)
print(f'Mean Absolute Error (Quantity): {quantity_mae}')

# Date model
X_train, X_test, y_train, y_test = train_test_split(X, y_date, test_size=0.2, random_state=42)
date_model = RandomForestRegressor(n_estimators=100, random_state=42)
date_model.fit(X_train, y_train)
date_predictions = date_model.predict(X_test)
date_mae = mean_absolute_error(y_test, date_predictions)
print(f'Mean Absolute Error (Date): {date_mae}')

# Save the models
joblib.dump(quantity_model, 'quantity_prediction_model.pkl')
joblib.dump(date_model, 'date_prediction_model.pkl')
