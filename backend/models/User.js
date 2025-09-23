import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  business: String,
  joinDate: { type: Date, default: Date.now },
  growFundScore: { type: Number, default: 450 },
  isVerified: { type: Boolean, default: false },
  savingsPlan: {
    type: { type: String, enum: ['weekly', 'monthly'] },
    amount: Number,
    startDate: Date,
    isActive: { type: Boolean, default: false }
  },
  totalSaved: { type: Number, default: 0 },
  savingsStreak: { type: Number, default: 0 },
  lastPaymentDate: Date,
  nextPaymentDate: Date
});

export default mongoose.model('User', userSchema);
