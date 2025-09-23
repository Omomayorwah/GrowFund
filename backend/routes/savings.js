import express from 'express';
import  User from '../models/User.js';
import SavingsTransaction from '../models/SavingsTransaction.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Create Savings Plan
router.post('/create-plan', authenticateToken, async (req, res) => {
  try {
    const { type, amount } = req.body;
    
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Validate amount ranges
    const limits = {
      weekly: { min: 5000, max: 50000 },
      monthly: { min: 20000, max: 200000 }
    };

    if (amount < limits[type].min || amount > limits[type].max) {
      return res.status(400).json({ 
        error: `Amount must be between ₦${limits[type].min.toLocaleString()} and ₦${limits[type].max.toLocaleString()} for ${type} plans` 
      });
    }

    // Calculate next payment date
    const nextPaymentDate = new Date();
    if (type === 'weekly') {
      nextPaymentDate.setDate(nextPaymentDate.getDate() + 7);
    } else {
      nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);
    }

    user.savingsPlan = {
      type,
      amount,
      startDate: new Date(),
      isActive: true
    };
    user.nextPaymentDate = nextPaymentDate;

    await user.save();

    res.json({ 
      message: 'Savings plan created successfully',
      savingsPlan: user.savingsPlan,
      nextPaymentDate: user.nextPaymentDate
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Make Savings Payment
router.post('/make-payment', authenticateToken, async (req, res) => {
  try {
    const { amount, paymentMethod, transactionRef } = req.body;
    
    const user = await User.findById(req.user.userId);
    if (!user || !user.savingsPlan.isActive) {
      return res.status(400).json({ error: 'No active savings plan found' });
    }

    // Create transaction record
    const transaction = new SavingsTransaction({
      userId: user._id,
      amount,
      type: 'savings',
      status: 'completed', // In real app, this would be 'pending' until payment confirmation
      paymentMethod,
      transactionRef,
      description: `${user.savingsPlan.type} savings payment`
    });

    await transaction.save();

    // Update user savings
    user.totalSaved += amount;
    user.savingsStreak += 1;
    user.lastPaymentDate = new Date();

    // Calculate next payment date
    const nextPaymentDate = new Date();
    if (user.savingsPlan.type === 'weekly') {
      nextPaymentDate.setDate(nextPaymentDate.getDate() + 7);
    } else {
      nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);
    }
    user.nextPaymentDate = nextPaymentDate;

    await user.save();

    res.json({ 
      message: 'Payment successful',
      transaction,
      totalSaved: user.totalSaved,
      savingsStreak: user.savingsStreak,
      nextPaymentDate: user.nextPaymentDate
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
