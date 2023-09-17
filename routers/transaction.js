import express from 'express';
import Transaction from '../model/transaction.js';
import * as tf from '@tensorflow/tfjs-node';
import fs from 'fs';
import pickle from 'node-pickle'; // Use node-pickle to load pickle (.pkl) files

// Define the model and threshold loading function
async function loadModelAndThreshold() {
  // Load the autoencoder model
  const modelPath = 'C:/Users/pc/Desktop/ST-BE/autoencoder_model.h5';
  const loadedModel = await tf.loadLayersModel(`file://${modelPath}`);
  
  // Load the threshold value
  const thresholdFilePath = 'C:/Users/pc/Desktop/ST-BE/threshold.txt';
  const threshold = parseFloat(fs.readFileSync(thresholdFilePath, 'utf-8'));
  
  return { model: loadedModel, threshold };
}

// Load scaler configuration from a pickle (.pkl) file
function loadScalerConfig() {
  const scalerConfigPath = 'C:/Users/pc/Desktop/ST-BE/scaler.pkl'; // Update with the correct path
  const scalerConfig = pickle.load(scalerConfigPath);
  return scalerConfig;
}

// Load label encoder from a pickle (.pkl) file
function loadLabelEncoder() {
  const labelEncoderPath = 'C:/Users/pc/Desktop/ST-BE/loaded_encoder.pkl'; // Update with the correct path
  const labelEncoder = pickle.load(labelEncoderPath);
  return labelEncoder;
}

const router = express.Router();
router.post('/fraud', async (req, res) => {
  try {
    console.log('Received Request Body:', req.body);

    const { model, threshold } = await loadModelAndThreshold();
    const scalerConfig = loadScalerConfig();
    const labelEncoder = loadLabelEncoder();

    // Initialize an empty object to store encoded and scaled features
    const processedFeatures = {};

    // Loop through the request body's properties and apply label encoding and scaling
    for (const feature in req.body) {
      if (labelEncoder[feature]) {
        // Apply label encoding to categorical features
        const labelEncodedValue = labelEncoder[feature].transform([req.body[feature]])[0];
        processedFeatures[feature] = labelEncodedValue;
      } else if (scalerConfig[feature]) {
        // Scale numerical features using the scaler configuration
        const featureValue = req.body[feature];
        const scalingParameters = scalerConfig[feature];
        const scaledValue = (featureValue - scalingParameters.mean) / scalingParameters.std;
        processedFeatures[feature] = scaledValue;
      } else {
        // For non-categorical and non-numeric features, include them as-is
        processedFeatures[feature] = req.body[feature];
      }
    }

    // Prepare input data as tensor
    const inputData = tf.tensor2d(Object.values(processedFeatures));

    // Perform prediction
    const prediction = model.predict(inputData);
    const predictionValue = prediction.dataSync()[0]; // Get prediction value

    // Check if the prediction value is greater than the threshold
    const isFraudulent = predictionValue > threshold;

    res.json({ isFraudulent });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
