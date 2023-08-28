import express from 'express';
import Transaction from '../model/transaction.js';
import * as tf from '@tensorflow/tfjs-node';
import fs from 'fs';

// Load the model using TensorFlow.js
const modelPath = 'C:/Users/pc/Desktop/ST-BE/autoencoder_model.h5';
const loadedModel = await tf.loadLayersModel(`file://${modelPath}`);

// Read the threshold value from the file
const thresholdFilePath = 'C:/Users/pc/Desktop/ST-BE/threshold.txt';
const threshold = parseFloat(fs.readFileSync(thresholdFilePath, 'utf-8'));

const router = express.Router();

// API endpoint to predict fraud for a transaction
router.post('/predict-fraud', async (req, res) => {
  try {
    const inputTransaction = new Transaction(req.body);
    const prediction = loadedModel.predict(inputTransaction);
    const isFraudulent = prediction > threshold;

    res.json({ isFraudulent });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Create a new transaction
router.post('/', async (req, res) => {
  try {
    const transaction = new Transaction(req.body);
    const savedTransaction = await transaction.save();
    res.json(savedTransaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});




// Get all transactions
router.get('/', async (req, res) => {
  try {
    const transactions = await Transaction.find();
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
