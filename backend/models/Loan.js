import mongoose from 'mongoose';

const loanSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  loanType: { type: String, enum: ['boost', 'ascend'], required: true },
  amount: { type: Number, required: true },
  fee: { type: Number, required: true },
  totalRepayment: { type: Number, required: true },
  repaymentMethod: { type: String, enum: ['one-time', 'two-part', 'installmental'], required: true },
  status: { type: String, enum: ['pending', 'approved', 'disbursed', 'active', 'completed', 'defaulted'], default: 'pending' },
  applicationDate: { type: Date, default: Date.now },
  approvalDate: Date,
  disbursementDate: Date,
  dueDate: Date,
  repayments: [{
    amount: Number,
    dueDate: Date,
    paidDate: Date,
    status: { type: String, enum: ['pending', 'paid', 'overdue'], default: 'pending' }
  }]
});

export default mongoose.model('Loan', loanSchema);
