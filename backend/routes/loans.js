import express from 'express';
import User from '../models/User.js';
import Loan from '../models/Loan.js';
import { authenticateToken } from '../middleware/auth.js';
import { calculateAvailableLoans } from '../utils/loanCalculator.js';

const router = express.Router();

// Apply for Loan
router.post('/apply', authenticateToken, async (req, res) => {
  try {
    const { loanType, amount, repaymentMethod } = req.body;
    
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check eligibility
    const availableLoans = calculateAvailableLoans(user);
    const eligibleLoan = availableLoans.find(loan => loan.type === loanType);
    
    if (!eligibleLoan || amount > eligibleLoan.amount) {
      return res.status(400).json({ error: 'Loan not available or amount exceeds limit' });
    }

    // Calculate fees
    const feePercentage = eligibleLoan.fees[repaymentMethod].fee;
    const fee = (amount * feePercentage) / 100;
    const totalRepayment = amount + fee;

    // Create loan application
    const loan = new Loan({
      userId: user._id,
      loanType,
      amount,
      fee,
      totalRepayment,
      repaymentMethod,
      status: 'pending'
    });

    // Set due date (default 3 months)
    const dueDate = new Date();
    dueDate.setMonth(dueDate.getMonth() + 3);
    loan.dueDate = dueDate;

    // Create repayment schedule based on method
    if (repaymentMethod === 'one-time') {
      loan.repayments = [{
        amount: totalRepayment,
        dueDate: dueDate,
        status: 'pending'
      }];
    } else if (repaymentMethod === 'two-part') {
      const firstPayment = totalRepayment / 2;
      const midDate = new Date();
      midDate.setMonth(midDate.getMonth() + 1.5);
      
      loan.repayments = [
        { amount: firstPayment, dueDate: midDate, status: 'pending' },
        { amount: firstPayment, dueDate: dueDate, status: 'pending' }
      ];
    } else { // installmental
      const monthlyPayment = totalRepayment / 3;
      for (let i = 1; i <= 3; i++) {
        const paymentDate = new Date();
        paymentDate.setMonth(paymentDate.getMonth() + i);
        loan.repayments.push({
          amount: monthlyPayment,
          dueDate: paymentDate,
          status: 'pending'
        });
      }
    }

    await loan.save();

    res.json({ 
      message: 'Loan application submitted successfully',
      loan: {
        id: loan._id,
        amount: loan.amount,
        fee: loan.fee,
        totalRepayment: loan.totalRepayment,
        repaymentMethod: loan.repaymentMethod,
        status: loan.status,
        dueDate: loan.dueDate
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get User's Loans
router.get('/my-loans', authenticateToken, async (req, res) => {
  try {
    const loans = await Loan.find({ userId: req.user.userId })
      .sort({ applicationDate: -1 });

    res.json({ loans });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
