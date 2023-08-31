import express from 'express';
import Transaction from '../model/transaction.js';
import * as tf from '@tensorflow/tfjs-node';
import fs from 'fs';

// Define the model and threshold loading function
async function loadModelAndThreshold() {
  const modelPath = 'C:/Users/pc/Desktop/ST-BE/autoencoder_model.h5';
  const loadedModel = await tf.loadLayersModel(`file://${modelPath}`);

  const thresholdFilePath = 'C:/Users/pc/Desktop/ST-BE/threshold.txt';
  const threshold = parseFloat(fs.readFileSync(thresholdFilePath, 'utf-8'));

  return { model: loadedModel, threshold };
}

const router = express.Router();

router.post('/fraud', async (req, res) => {
  try {
    console.log('Received Request Body:', req.body); // Log the received body

    const { model, threshold } = await loadModelAndThreshold();

    // Use feature values directly from the request body
    const features = [
      req.body.cardType,
      req.body.channel,
      req.body.transactionType,
      req.body.transactionTypeGroup,
      req.body.entryMode,
      req.body.outletId,
      req.body.merchantCountry,
      req.body.merchantActivity,
      req.body.clientCode,
      req.body.amountUSD,
      // ... Add more feature values here ...
    ];

    // Prepare input data as tensor
    const inputData = tf.tensor2d([features]);
    // Perform prediction
    const prediction = model.predict(inputData);
    const predictionValue = prediction.dataSync()[0]; // Get prediction value

    const isFraudulent = predictionValue > threshold; res.json({ isFraudulent });
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
