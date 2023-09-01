
import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  cardType: String,
  channel: String,
  transactionType: String,
  transactionTypeGroup: String,
  entryMode: String,
  outletId: String,
  merchantCountry: String,
  merchantActivity: String,
  clientCode: String,
  amountUSD: Number,
});

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;
