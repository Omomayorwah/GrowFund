# GrowFund Backend API

A Node.js backend API for GrowFund, a financial platform designed to help small businesses with savings and loan services.

## Features

- **User Authentication**: Registration and login with JWT tokens
- **Savings Management**: Create savings plans and make payments
- **Loan Services**: Apply for Boost and Ascend loans based on savings history
- **Business Tools**: Invoice creation and management
- **GrowFund Score**: Credit scoring system based on savings consistency

## Project Structure

```
GrowFund/
├── config/
│   └── database.js          # MongoDB connection configuration
├── middleware/
│   └── auth.js              # JWT authentication middleware
├── models/
│   ├── User.js              # User schema
│   ├── SavingsTransaction.js # Savings transaction schema
│   ├── Loan.js              # Loan schema
│   └── index.js             # Models export
├── routes/
│   ├── auth.js              # Authentication routes
│   ├── user.js              # User dashboard routes
│   ├── savings.js           # Savings plan routes
│   ├── loans.js             # Loan application routes
│   └── tools.js             # Business tools routes
├── utils/
│   └── loanCalculator.js    # Loan calculation utilities
├── server.js                # Main server file
├── package.json             # Dependencies and scripts
└── README.md                # This file
```

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/growfund
   JWT_SECRET=your_super_secret_jwt_key_here
   ```

4. Start the server:
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### User
- `GET /api/user/dashboard` - Get user dashboard data

### Savings
- `POST /api/savings/create-plan` - Create a savings plan
- `POST /api/savings/make-payment` - Make a savings payment

### Loans
- `POST /api/loans/apply` - Apply for a loan
- `GET /api/loans/my-loans` - Get user's loans

### Business Tools
- `POST /api/tools/create-invoice` - Create an invoice

### Health Check
- `GET /api/health` - Server health check

## Technologies Used

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

## Development

The project uses nodemon for development, which automatically restarts the server when files change.

## License

MIT License
