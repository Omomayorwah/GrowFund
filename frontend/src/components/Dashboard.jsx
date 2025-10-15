import React, { useState, useEffect } from 'react';
import { Wallet, Award, TrendingUp, Calendar, Zap, Target, DollarSign } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const Dashboard = () => {
  const { user, updateUser } = useAuth();
  const [dashboardData, setDashboardData] = useState({
    transactions: [],
    activeLoans: [],
    availableLoans: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('/api/user/dashboard');
      setDashboardData({
        transactions: response.data.transactions || [],
        activeLoans: response.data.activeLoans || [],
        availableLoans: response.data.availableLoans || []
      });
      updateUser(response.data.user);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="grid md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gray-200 h-32 rounded-xl"></div>
            ))}
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-200 h-64 rounded-xl"></div>
            <div className="bg-gray-200 h-64 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  const nextPaymentDate = user?.nextPaymentDate ? 
    new Date(user.nextPaymentDate).toLocaleDateString() : 'Not set';

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
        <p className="text-gray-600">Here's your financial progress</p>
      </div>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Total Saved"
          value={`₦${user?.totalSaved?.toLocaleString() || '0'}`}
          icon={Wallet}
          bgColor="from-green-500 to-green-600"
          iconColor="text-green-200"
          textColor="text-green-100"
        />
        
        <MetricCard
          title="Savings Streak"
          value={`${user?.savingsStreak || 0} ${user?.savingsPlan?.type === 'weekly' ? 'weeks' : 'months'}`}
          icon={Award}
          bgColor="from-blue-500 to-blue-600"
          iconColor="text-blue-200"
          textColor="text-blue-100"
        />
        
        <MetricCard
          title="GrowFund Score"
          value={user?.growFundScore || 450}
          icon={TrendingUp}
          bgColor="from-purple-500 to-purple-600"
          iconColor="text-purple-200"
          textColor="text-purple-100"
        />
        
        <MetricCard
          title="Next Payment"
          value={nextPaymentDate}
          icon={Calendar}
          bgColor="from-orange-500 to-orange-600"
          iconColor="text-orange-200"
          textColor="text-orange-100"
        />
      </div>

      {/* Available Loans */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {dashboardData.availableLoans.length > 0 ? (
          dashboardData.availableLoans.map((loan) => (
            <LoanCard key={loan.type} loan={loan} />
          ))
        ) : (
          <div className="md:col-span-2 bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
            <Target className="w-12 h-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Start Your Savings Journey</h3>
            <p className="text-blue-700 mb-4">
              Begin saving consistently to unlock loan products. After just 4 saves, you'll access Boost Loans!
            </p>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Set Up Savings Plan
            </button>
          </div>
        )}
      </div>

      {/* Savings Progress */}
      <div className="bg-white rounded-xl border p-6 mb-8">
        <h3 className="text-xl font-semibold mb-4">Your Savings Journey</h3>
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex-1 bg-gray-200 rounded-full h-3">
            <div 
              className="bg-green-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${Math.min((user?.savingsStreak / 12) * 100, 100)}%` }}
            ></div>
          </div>
          <span className="text-sm font-medium text-gray-600">
            {user?.savingsStreak || 0}/12 consistent saves
          </span>
        </div>
        <p className="text-sm text-gray-600">
          {user?.savingsStreak >= 12 
            ? "🎉 Congratulations! You've unlocked Ascend Capital!" 
            : `${12 - (user?.savingsStreak || 0)} more consistent saves to unlock Ascend Capital`
          }
        </p>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl border p-6">
        <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
        {dashboardData.transactions.length > 0 ? (
          <div className="space-y-3">
            {dashboardData.transactions.slice(0, 5).map((transaction, index) => (
              <TransactionItem key={index} transaction={transaction} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <DollarSign className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>No transactions yet. Start saving to see your activity here!</p>
          </div>
        )}
      </div>
    </div>
  );
};

const MetricCard = ({ title, value, icon: Icon, bgColor, iconColor, textColor }) => (
  <div className={`bg-gradient-to-r ${bgColor} text-white p-6 rounded-xl`}>
    <div className="flex items-center justify-between">
      <div>
        <p className={textColor}>{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
      <Icon className={`w-8 h-8 ${iconColor}`} />
    </div>
  </div>
);

const LoanCard = ({ loan }) => (
  <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-xl font-semibold">{loan.name}</h3>
      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
        Available
      </span>
    </div>
    
    <p className="text-gray-600 mb-4">{loan.description}</p>
    
    <div className="space-y-2 mb-4">
      <div className="flex justify-between">
        <span className="text-gray-600">Amount Available:</span>
        <span className="font-semibold">₦{loan.amount?.toLocaleString()}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">Processing Fee:</span>
        <span className="font-semibold">From {loan.fees?.['one-time']?.fee}%</span>
      </div>
    </div>
    
    <button className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center">
      Apply Now
      <Zap className="w-4 h-4 ml-2" />
    </button>
  </div>
);

const TransactionItem = ({ transaction }) => (
  <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
    <div className="flex items-center space-x-3">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
        transaction.type === 'savings' ? 'bg-green-100' : 'bg-blue-100'
      }`}>
        {transaction.type === 'savings' ? (
          <Wallet className="w-5 h-5 text-green-600" />
        ) : (
          <TrendingUp className="w-5 h-5 text-blue-600" />
        )}
      </div>
      <div>
        <p className="font-medium text-gray-900 capitalize">
          {transaction.description || `${transaction.type} Transaction`}
        </p>
        <p className="text-sm text-gray-500">
          {new Date(transaction.createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>
    <div className="text-right">
      <p className={`font-semibold ${
        transaction.type === 'savings' ? 'text-green-600' : 'text-blue-600'
      }`}>
        {transaction.type === 'savings' ? '+' : ''}₦{transaction.amount?.toLocaleString()}
      </p>
      <p className={`text-xs capitalize ${
        transaction.status === 'completed' ? 'text-green-500' : 'text-yellow-500'
      }`}>
        {transaction.status}
      </p>
    </div>
  </div>
);

export default Dashboard;
