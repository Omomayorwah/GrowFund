import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import  User  from '../models/User.js';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, business } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      business
    });

    await user.save();

    // Generate token
    const token = jwt.sign(
      { userId: user._id }, 
      process.env.JWT_SECRET || 'fallback_secret', 
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        business: user.business
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id }, 
      process.env.JWT_SECRET || 'fallback_secret', 
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        business: user.business,
        growFundScore: user.growFundScore,
        totalSaved: user.totalSaved,
        savingsStreak: user.savingsStreak,
        savingsPlan: user.savingsPlan
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
