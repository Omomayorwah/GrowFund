import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';

// Import database connection
import connectDB from './config/database.js';

// Import routes
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import savingsRoutes from './routes/savings.js';
import loanRoutes from './routes/loans.js';
import toolsRoutes from './routes/tools.js';

// Load environment variables
dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Set security middleware
app.use(helmet());
app.use(compression());

// CORS configuration
const allowedOrigins = [
    'http://localhost:3000',
    'https://grow-fund-puce.vercel.app'
];

app.use(cors({
    origin: (origin, cb) => {
        // Allow Postman/curl which send no origin
        if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
        cb(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: 'GET, POST, PUT, DELETE',
}));

// Middleware
app.use(express.json());

// Logging middleware - FIXED: Removed undefined logger reference
app.use(morgan('combined'));

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ 
        success: true,
        message: 'GrowFund API Server is running!',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
    });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/savings', savingsRoutes);
app.use('/api/loans', loanRoutes);
app.use('/api/tools', toolsRoutes);

// Catch 404 errors
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

// Global error handler - FIXED: Use console.error instead of undefined logger
app.use((error, req, res, next) => {
    console.error(`Error: ${error.message}`);
    res.status(error.status || 500).json({
        success: false,
        message: error.message || 'Internal Server Error',
        stack: process.env.NODE_ENV === 'production' ? null : error.stack,
    });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`GrowFund API Server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('SIGINT received. Shutting down gracefully...');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...'); 
    process.exit(0);
});

export default app;