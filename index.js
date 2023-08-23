import express from 'express';
import mongoose from 'mongoose';

const app = express();

app.use(express.json());
const MONGO_URL = 'mongodb://127.0.0.1:27017/safe-transactions';
mongoose.connect(MONGO_URL)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });

const port = 3002;

app.listen(port, () =>
    console.log(`server running on port ${port}`)
);
