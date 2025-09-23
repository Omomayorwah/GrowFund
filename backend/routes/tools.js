import express from 'express';
import User  from '../models/User.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Create Invoice
router.post('/create-invoice', authenticateToken, async (req, res) => {
  try {
    const { clientName, clientEmail, items, dueDate } = req.body;
    
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Calculate total
    const total = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    
    // Generate invoice number
    const invoiceNumber = `GF-${Date.now()}`;

    const invoice = {
      invoiceNumber,
      clientName,
      clientEmail,
      items,
      total,
      dueDate,
      status: 'pending',
      createdAt: new Date(),
      businessName: user.business || user.name,
      businessEmail: user.email,
      businessPhone: user.phone
    };

    // In a real app, you'd save this to an Invoice collection
    // For this MVP, we'll just return the invoice data
    
    res.json({ 
      message: 'Invoice created successfully',
      invoice 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
