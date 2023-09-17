import express from 'express';
import mongoose from 'mongoose';
import transactionsRouter from './routers/transaction.js'; 
import cors from 'cors';

const app = express();
app.use(cors());

app.use(express.json());

const MONGO_URL = 'mongodb://127.0.0.1:27017/safe-transactions';

mongoose.connect(MONGO_URL)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });

app.use('/transaction', transactionsRouter);

const port = 3003;

app.listen(port, () =>
    console.log(`Server running on port ${port}`)
);
