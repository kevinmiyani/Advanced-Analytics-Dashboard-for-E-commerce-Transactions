from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import datetime

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load models for quantity and date predictions
quantity_model = joblib.load('quantity_prediction_model.pkl')
date_model = joblib.load('date_prediction_model.pkl')

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    predictions = []
    for features in data:
        model_features = [features['quantity'], features['day_of_week'], features['month'], features['day_of_month']]
        
        predicted_quantity = quantity_model.predict([model_features])[0]
        predicted_days_until_next_transaction = date_model.predict([model_features])[0]
        
        current_date = datetime.datetime(2025, 1, 1)  # Using a fixed date in 2025
        predicted_date = current_date + datetime.timedelta(days=predicted_days_until_next_transaction)
        
        predictions.append({
            'productId': features['productId'],
            'predicted_quantity': predicted_quantity,
            'predicted_date': predicted_date.strftime('%Y-%m-%d'),

        })
    
    return jsonify(predictions)

if __name__ == '__main__':
    app.run(debug=True, port=5000)

