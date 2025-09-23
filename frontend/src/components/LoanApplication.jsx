import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calculator, AlertTriangle, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const LoanApplication = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [loanType, setLoanType] = useState(location.state?.loanType || 'boost');
  const [amount, setAmount] = useState(50000);
  const [repaymentMethod, setRepaymentMethod] = useState('one-time');
  const [availableLoans, setAvailableLoans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAvailableLoans();
  }, []);

  const fetchAvailableLoans = async () => {
    try {
      const response = await axios.get('/api/user/dashboard');
      setAvailableLoans(response.data.availableLoans || []);
    } catch (error) {
      console.error('Error fetching available loans:', error);
    }
  };

  const selectedLoan = availableLoans.find(loan => loan.type === loanType);

  const calculateLoanDetails = () => {
    if (!selectedLoan || !selectedLoan.fees || !selectedLoan.fees[repaymentMethod]) {
      return { fee: 0, totalRepayment: amount, ear: 0 };
    }

    const feePercentage = selectedLoan.fees[repaymentMethod].fee;
    const fee = (amount * feePercentage) / 100;
    const totalRepayment = amount + fee;
    const ear = selectedLoan.fees[repaymentMethod].ear;

    return { fee, totalRepayment, ear };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.post('/api/loans/apply', {
        loanType,
        amount,
        repaymentMethod
      });

      setSuccess('Loan application submitted successfully! You will receive approval notification within 24 hours.');
      
      setTimeout(() => {
        navigate('/credit');
      }, 3000);
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to submit loan application');
    } finally {
      setLoading(false);
    }
  };

  const loanDetails = calculateLoanDetails();

  if (!selectedLoan) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="text-center py-12">
          <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Loans Available</h2>
          <p className="text-gray-600 mb-6">You need to save consistently to access loan products.</p>
          <button
            onClick={() => navigate('/savings')}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
          >
            Start Saving
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <button
          onClick={() => navigate('/credit')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Credit Products
        </button>
        <h2 className="text-3xl font-bold text-gray-900">Apply for {selectedLoan.name}</h2>
        <p className="text-gray-600">{selectedLoan.description}</p>
      </div>

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 flex items-center">
          <CheckCircle className="w-5 h-5 mr-2" />
          {success}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Loan Amount */}
        <div className="bg-white border rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Loan Amount</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount (₦)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
                max={selectedLoan.amount}
                min={10000}
                step={5000}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>
            
            <div className="flex justify-between text-sm text-gray-600">
              <span>Minimum: ₦10,000</span>
              <span>Maximum: ₦{selectedLoan.amount.toLocaleString()}</span>
            </div>

            <input
              type="range"
              min={10000}
              max={selectedLoan.amount}
              value={amount}
              onChange={(e) => setAmount(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              step={5000}
            />
          </div>
        </div>

        {/* Repayment Method */}
        <div className="bg-white border rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Repayment Method</h3>
          <div className="space-y-3">
            {Object.entries(selectedLoan.fees).map(([method, details]) => (
              <label
                key={method}
                className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors ${
                  repaymentMethod === method
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-green-300'
                }`}
              >
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="repaymentMethod"
                    value={method}
                    checked={repaymentMethod === method}
                    onChange={(e) => setRepaymentMethod(e.target.value)}
                    className="mr-3"
                  />
                  <div>
                    <p className="font-medium capitalize">
                      {method.replace('-', ' ')} Payment
                    </p>
                    <p className="text-sm text-gray-600">
                      {method === 'one-time' && 'Pay back everything at once'}
                      {method === 'two-part' && 'Split into two payments'}
                      {method === 'installmental' && 'Monthly installments'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{details.fee}% fee</p>
                  <p className="text-sm text-gray-600">{details.ear}% EAR</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Loan Summary */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
            <Calculator className="w-5 h-5 mr-2" />
            Loan Summary
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-blue-800">Loan Amount:</span>
              <span className="font-semibold text-blue-900">₦{amount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-800">Processing Fee ({selectedLoan.fees[repaymentMethod]?.fee}%):</span>
              <span className="font-semibold text-blue-900">₦{loanDetails.fee.toLocaleString()}</span>
            </div>
            <div className="flex justify-between border-t border-blue-200 pt-3">
              <span className="text-blue-800 font-medium">Total Repayment:</span>
              <span className="font-bold text-blue-900 text-lg">₦{loanDetails.totalRepayment.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-800">Effective Annual Rate:</span>
              <span className="font-semibold text-blue-900">{loanDetails.ear}%</span>
            </div>
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="bg-white border rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Terms & Conditions</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <label className="flex items-start">
              <input type="checkbox" required className="mt-1 mr-3" />
              <span>I understand the loan terms, fees, and repayment schedule</span>
            </label>
            <label className="flex items-start">
              <input type="checkbox" required className="mt-1 mr-3" />
              <span>I agree to automatic deduction from my linked account for repayments</span>
            </label>
            <label className="flex items-start">
              <input type="checkbox" required className="mt-1 mr-3" />
              <span>I understand that defaulting will affect my GrowFund Score and future loan eligibility</span>
            </label>
            <label className="flex items-start">
              <input type="checkbox" required className="mt-1 mr-3" />
              <span>I agree to GrowFund's terms of service and privacy policy</span>
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-4 px-6 rounded-xl font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Submitting Application...' : `Apply for ₦${amount.toLocaleString()}`}
        </button>
      </form>
    </div>
  );
};

export default LoanApplication;
