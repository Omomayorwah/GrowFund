import express from 'express';
import  User from '../models/User.js';
import SavingsTransaction from '../models/SavingsTransaction.js'
import Loan from '../models/Loan.js'
import { authenticateToken }  from '../middleware/auth.js';
import { calculateGrowFundScore, calculateAvailableLoans } from '../utils/loanCalculator.js';

const router = express.Router();

// User Dashboard
router.get('/dashboard', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get recent transactions
    const transactions = await SavingsTransaction
      .find({ userId: user._id })
      .sort({ createdAt: -1 })
      .limit(10);

    // Get active loans
    const activeLoans = await Loan
      .find({ userId: user._id, status: { $in: ['approved', 'disbursed', 'active'] } });

    // Calculate available loans
    const availableLoans = calculateAvailableLoans(user);

    // Update GrowFund Score
    const loanHistory = await Loan.find({ userId: user._id });
    user.growFundScore = calculateGrowFundScore(user, transactions, loanHistory);
    await user.save();

    res.json({
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        business: user.business,
        growFundScore: user.growFundScore,
        totalSaved: user.totalSaved,
        savingsStreak: user.savingsStreak,
        savingsPlan: user.savingsPlan,
        nextPaymentDate: user.nextPaymentDate
      },
      transactions,
      activeLoans,
      availableLoans
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
