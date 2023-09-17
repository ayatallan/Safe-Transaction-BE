from flask import Flask, request, jsonify
import tensorflow as tf
import os
from config import MONGODB_URI, MODEL_PATH, THRESHOLD_PATH
from models import Transaction
from models import Transaction
app = Flask(__name__)

def load_model():
    model = tf.keras.models.load_model(MODEL_PATH)

    with open(THRESHOLD_PATH, 'r') as threshold_file:
        threshold = float(threshold_file.read())

    return model, threshold

# Assuming you've defined your model and loaded it already

@app.route('/fraud1', methods=['POST'])
def check_fraud():
    try:
        model, threshold = load_model()

        transaction_id = request.json.get('transactionId')
        if not transaction_id:
            return jsonify({'message': 'Transaction not found'}), 404

        # Assuming you have a Transaction model defined for MongoDB
        # You should adjust this part according to your model
        transaction_data = Transaction.objects.get(id=transaction_id)

        # Ensure all features are cast to float32
        input_data = tf.constant([[
            float(transaction_data.cardType),
            float(transaction_data.channel),
            float(transaction_data.transactionType),
            float(transaction_data.transactionTypeGroup),
            float(transaction_data.entryMode),
            float(transaction_data.outletId),
            float(transaction_data.merchantCountry),
            float(transaction_data.merchantActivity),
            float(transaction_data.clientCode),
            float(transaction_data.amountUSD),
        ]], dtype=tf.float32)

        prediction = model.predict(input_data)
        prediction_value = prediction[0][0]

        is_fraudulent = prediction_value > threshold
        return jsonify({'isFraudulent': is_fraudulent})
    except Exception as error:
        print('Error:', error)
        return jsonify({'error': 'Something went wrong'}), 500

if __name__ == '__main__':
    port = 3000
    app.run(port=port, debug=True)
