import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Zap, TrendingUp, AlertCircle, Calculator, Info } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const CreditProducts = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [availableLoans, setAvailableLoans] = useState([]);
  const [myLoans, setMyLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCreditData();
  }, []);

  const fetchCreditData = async () => {
    try {
      const [dashboardResponse, loansResponse] = await Promise.all([
        axios.get('/api/user/dashboard'),
        axios.get('/api/loans/my-loans')
      ]);

      setAvailableLoans(dashboardResponse.data.availableLoans || []);
      setMyLoans(loansResponse.data.loans || []);
    } catch (error) {
      console.error('Error fetching credit data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-blue-100 text-blue-800',
      disbursed: 'bg-green-100 text-green-800',
      active: 'bg-green-100 text-green-800',
      completed: 'bg-gray-100 text-gray-800',
      defaulted: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="bg-gray-200 h-64 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Credit Products</h2>
        <p className="text-gray-600">Access capital based on your savings discipline</p>
      </div>

      {/* Available Credit Products */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Available Loans</h3>
        {availableLoans.length > 0 ? (
          <div className="space-y-6">
            {availableLoans.map((loan) => (
              <CreditProductCard key={loan.type} loan={loan} navigate={navigate} />
            ))}
          </div>
        ) : (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-8 text-center">
            <AlertCircle className="w-12 h-12 text-blue-400 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-blue-900 mb-2">No Loans Available Yet</h4>
            <p className="text-blue-700 mb-4">
              Start saving consistently to unlock loan products. Your savings discipline determines your credit access.
            </p>
            <div className="bg-white rounded-lg p-4 mb-4">
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center">
                  <Zap className="w-4 h-4 text-green-500 mr-2" />
                  <span>Boost Loan: After 4 consistent saves</span>
                </div>
                <div className="flex items-center">
                  <TrendingUp className="w-4 h-4 text-purple-500 mr-2" />
                  <span>Ascend Capital: After 12 consistent saves</span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => navigate('/savings')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Set Up Savings Plan
            </button>
          </div>
        )}
      </div>

      {/* My Loans */}
      {myLoans.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">My Loans</h3>
          <div className="space-y-4">
            {myLoans.map((loan) => (
              <LoanCard key={loan._id} loan={loan} />
            ))}
          </div>
        </div>
      )}

      {/* Loan Information */}
      <div className="bg-white rounded-xl border p-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <Info className="w-5 h-5 mr-2" />
          How GrowFund Loans Work
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold mb-2">Eligibility Requirements</h4>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>• Active savings plan with consistent payments</li>
              <li>• Boost Loans: 4 consecutive saves minimum</li>
              <li>• Ascend Capital: 12 consecutive saves minimum</li>
              <li>• Good GrowFund Score (above 450)</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Transparent Pricing</h4>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>• One-time payment: Lowest fees</li>
              <li>• Two-part payment: Moderate fees</li>
              <li>• Installmental: Highest fees, easiest repayment</li>
              <li>• No hidden charges or surprise fees</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

const CreditProductCard = ({ loan, navigate }) => (
  <div className="bg-white border rounded-xl p-6">
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center">
        {loan.type === 'boost' ? (
          <Zap className="w-8 h-8 text-green-500 mr-3" />
        ) : (
          <TrendingUp className="w-8 h-8 text-purple-500 mr-3" />
        )}
        <div>
          <h3 className="text-xl font-semibold">{loan.name}</h3>
          <p className="text-gray-600">{loan.description}</p>
        </div>
      </div>
      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
        Available
      </span>
    </div>

    <div className="grid md:grid-cols-3 gap-4 mb-6">
      <div className="text-center p-4 bg-gray-50 rounded-lg">
        <p className="text-2xl font-bold text-gray-900">₦{loan.amount?.toLocaleString()}</p>
        <p className="text-sm text-gray-600">Maximum Amount</p>
      </div>
      <div className="text-center p-4 bg-gray-50 rounded-lg">
        <p className="text-2xl font-bold text-gray-900">{loan.fees?.['one-time']?.fee}%+</p>
        <p className="text-sm text-gray-600">Processing Fee</p>
      </div>
      <div className="text-center p-4 bg-gray-50 rounded-lg">
        <p className="text-2xl font-bold text-gray-900">{loan.fees?.['one-time']?.ear}%+</p>
        <p className="text-sm text-gray-600">EAR (3 months)</p>
      </div>
    </div>

    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
      <h4 className="font-semibold text-blue-900 mb-2 flex items-center">
        <Calculator className="w-4 h-4 mr-2" />
        Repayment Options:
      </h4>
      <div className="grid md:grid-cols-3 gap-2 text-sm text-blue-800">
        <div className="bg-white p-2 rounded">
          <p className="font-medium">One-Time</p>
          <p>{loan.fees?.['one-time']?.fee}% fee (~{loan.fees?.['one-time']?.ear}% EAR)</p>
        </div>
        <div className="bg-white p-2 rounded">
          <p className="font-medium">Two-Part</p>
          <p>{loan.fees?.['two-part']?.fee}% fee (~{loan.fees?.['two-part']?.ear}% EAR)</p>
        </div>
        <div className="bg-white p-2 rounded">
          <p className="font-medium">Installmental</p>
          <p>{loan.fees?.['installmental']?.fee}% fee (~{loan.fees?.['installmental']?.ear}% EAR)</p>
        </div>
      </div>
    </div>

    <button 
      onClick={() => navigate('/loans/apply', { state: { loanType: loan.type } })}
      className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors"
    >
      Apply for {loan.name}
    </button>
  </div>
);

const LoanCard = ({ loan }) => {
  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-blue-100 text-blue-800',
      disbursed: 'bg-green-100 text-green-800',
      active: 'bg-green-100 text-green-800',
      completed: 'bg-gray-100 text-gray-800',
      defaulted: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white border rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <CreditCard className="w-6 h-6 text-blue-500 mr-3" />
          <div>
            <h4 className="font-semibold capitalize">{loan.loanType} Loan</h4>
            <p className="text-sm text-gray-600">Applied on {new Date(loan.applicationDate).toLocaleDateString()}</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(loan.status)}`}>
          {loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
        </span>
      </div>

      <div className="grid md:grid-cols-4 gap-4 text-center">
        <div>
          <p className="text-lg font-bold text-gray-900">₦{loan.amount?.toLocaleString()}</p>
          <p className="text-xs text-gray-600">Loan Amount</p>
        </div>
        <div>
          <p className="text-lg font-bold text-red-600">₦{loan.fee?.toLocaleString()}</p>
          <p className="text-xs text-gray-600">Processing Fee</p>
        </div>
        <div>
          <p className="text-lg font-bold text-blue-600">₦{loan.totalRepayment?.toLocaleString()}</p>
          <p className="text-xs text-gray-600">Total Repayment</p>
        </div>
        <div>
          <p className="text-lg font-bold text-gray-900">{loan.dueDate ? new Date(loan.dueDate).toLocaleDateString() : 'TBD'}</p>
          <p className="text-xs text-gray-600">Due Date</p>
        </div>
      </div>

      {loan.repayments && loan.repayments.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h5 className="font-medium mb-2">Repayment Schedule</h5>
          <div className="space-y-2">
            {loan.repayments.map((repayment, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <span>Payment {index + 1}</span>
                <div className="flex items-center space-x-2">
                  <span>₦{repayment.amount?.toLocaleString()}</span>
                  <span className="text-gray-500">-</span>
                  <span>{new Date(repayment.dueDate).toLocaleDateString()}</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(repayment.status)}`}>
                    {repayment.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CreditProducts;
