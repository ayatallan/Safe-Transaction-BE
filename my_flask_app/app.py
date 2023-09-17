from flask import Flask, request, jsonify
import tensorflow as tf
import pickle
import json

app = Flask(__name__)

# Load the autoencoder model
model_path = 'C:/Users/pc/Desktop/my_flask_app/autoencoder_model.h5'
loaded_model = None

try:
    loaded_model = tf.keras.models.load_model(model_path)
    print("Model loaded successfully!")
except Exception as e:
    print("Error loading the model:", str(e))

# Load the threshold value
threshold_path = 'C:/Users/pc/Desktop/my_flask_app/threshold.txt'  # Update with the correct path
with open(threshold_path, 'r') as threshold_file:
    threshold = float(threshold_file.read())

# Load scaler configuration from a pickle (.pkl) file
scaler_config_path = 'C:/Users/pc/Desktop/my_flask_app/scaler.pkl'  # Update with the correct path
with open(scaler_config_path, 'rb') as scaler_file:
    scaler_config = pickle.load(scaler_file)

# Load label encoder from a pickle (.pkl) file
label_encoder_path = 'C:/Users/pc/Desktop/my_flask_app/loaded_encoder.pkl'  # Update with the correct path
with open(label_encoder_path, 'rb') as label_encoder_file:
    label_encoder = pickle.load(label_encoder_file)

@app.route('/fraud', methods=['POST','GET'])
def predict_fraud():
    # try:
        data = request.get_json()
        print('Received Request Body:', data)
        print('request content-type:',request.content_type )

        # Initialize an empty dictionary to store encoded and scaled features
        processed_features = {}

        # Loop through the request data's properties and apply label encoding and scaling
        for feature, value in data.items():

            print("Processing feature:", feature, "with value:", value)
            
            if feature in label_encoder:
                print("Applying label encoding to feature:", feature)
                label_encoded_value = label_encoder[feature].transform([value])[0]
                processed_features[feature] = label_encoded_value
            elif feature in scaler_config:
                print("Scaling feature:", feature)
                scaling_parameters = scaler_config[feature]
                scaled_value = (value - scaling_parameters['mean']) / scaling_parameters['std']
                processed_features[feature] = scaled_value
            else:
                print("Feature", feature, "not found in label_encoder or scaler_config")

        # Prepare input data as a list
        input_data = [processed_features[feature] for feature in processed_features]

        # Perform prediction
        prediction_value = loaded_model.predict([input_data])[0][0]

        # Check if the prediction value is greater than the threshold
        is_fraudulent = prediction_value > threshold

        return jsonify({'isFraudulent': is_fraudulent})

    # except Exception as e:
        # return jsonify({'message': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
