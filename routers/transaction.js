
import express from 'express';
import mongoose from 'mongoose';
import Transaction from './transaction.js';
import * as tf from '@tensorflow/tfjs-node';
import fs from 'fs';

const app = express();
app.use(express.json());

async function loadModel() {
  const modelPath = 'C:/Users/pc/Desktop/ST-BE/autoencoder_model.h5';
  const model = await tf.loadLayersModel(`file://${modelPath}`);
  
  const thresholdFilePath = 'C:/Users/pc/Desktop/ST-BE/threshold.txt';
  const threshold = parseFloat(fs.readFileSync(thresholdFilePath, 'utf-8'));
  
  return { model, threshold };
}

app.post('/fraud', async (req, res) => {
  try {
    const { model, threshold } = await loadModel();

    const transactionData = await Transaction.findOne({ _id: req.body.transactionId }); 

    if (!transactionData) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    const inputData = tf.tensor2d([[
      transactionData.cardType,
      transactionData.channel,
      transactionData.transactionType,
      transactionData.transactionTypeGroup,
      transactionData.entryMode,
      transactionData.outletId,
      transactionData.merchantCountry,
      transactionData.merchantActivity,
      transactionData.clientCode,
      transactionData.amountUSD,
    ]]);

    const prediction = model.predict(inputData);
    const predictionValue = prediction.dataSync()[0]; 

    const isFraudulent = predictionValue > threshold;
    res.json({ isFraudulent });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
