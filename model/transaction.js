import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  transactionDate: { type: String, required: true },
  cardType: { type: String, required: true },
  channel: { type: String, required: true },
  transactionType: { type: String, required: true },
  transactionTypeGroup: { type: String, required: true },
  entryMode: { type: String, required: true },
  transactionStatus: { type: String, required: true },
  outletID: { type: String, required: true },
  merchantCountry: { type: String, required: true },
  merchantActivity: { type: String, required: true },
  clientCode: { type: String, required: true },
  amountUSD: { type: Number, required: true },
});

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;
