import mongoose from 'mongoose';

const savingsTransactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ['savings', 'withdrawal', 'interest'], required: true },
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  paymentMethod: String,
  transactionRef: String,
  createdAt: { type: Date, default: Date.now },
  description: String
});

export default mongoose.model('SavingsTransaction', savingsTransactionSchema);
