import express from 'express';
import Transaction from '../model/transaction.js';
import * as tf from '@tensorflow/tfjs-node';
import fs from 'fs';

// Define the model and threshold loading function
// async function loadModelAndThreshold() {
//   const modelPath = 'C:/Users/pc/Desktop/ST-BE/autoencoder_model.h5';
//   const loadedModel = await tf.loadLayersModel(`file://${modelPath}`);
//   console.log("heloooooooooooooooooo");
  
//   const thresholdFilePath = 'C:/Users/pc/Desktop/ST-BE/threshold.txt';
//   const threshold = parseFloat(fs.readFileSync(thresholdFilePath, 'utf-8'));
  
//   return { model: loadedModel, threshold };
// }
async function loadModel() {
  const modelPath = 'C:/Users/pc/Desktop/ST-BE/autoencoder_model.h5';
  const model = await tf.loadLayersModel(`file://${modelPath}`);
  return model;
}

const router = express.Router();
router.post('/fraud', async (req, res) => {
  try {
    console.log('Received Request Body:', req.body); // Log the received body
    
    const { model, threshold } = await loadModel();
    console.log("test")

    // Use feature values directly from the request body
    const features = {
      "Card Type": req.body.cardType,
      "Channel": req.body.channel,
      "Transaction Type": req.body.transactionType,
      "Transaction Type Group": req.body.transactionTypeGroup,
      "Entry Mode": req.body.entryMode,
      "Outlet ID": req.body.outletId,
      "Merchant Country": req.body.merchantCountry,
      "Merchant Activity": req.body.merchantActivity,
      "Client Code": req.body.clientCode,
      "Amount USD": req.body.amountUSD,
      // ... Add more feature values here ...
    };
    console.log('features:', features); // Log the received body

    // Prepare input data as tensor
    const inputData = tf.tensor2d(features);

    // Perform prediction
    const prediction = model.predict(inputData);
    const predictionValue = prediction.dataSync(); // Get prediction value

    const isFraudulent = predictionValue > threshold; res.json({ isFraudulent });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});





export default router;
