import React, { useState } from 'react';
import { Target, Award, Zap, TrendingUp, Check, ArrowRight, Calendar, DollarSign } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const SavingsPlans = () => {
  const { user, updateUser } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState('weekly');
  const [amount, setAmount] = useState(10000);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const plans = [
    { 
      type: 'weekly', 
      min: 5000, 
      max: 50000, 
      frequency: 'Weekly',
      description: 'Perfect for consistent cash flow businesses',
      benefits: ['Quick loan access after 4 saves', 'Higher loan multipliers', 'Weekly habit building']
    },
    { 
      type: 'monthly', 
      min: 20000, 
      max: 200000, 
      frequency: 'Monthly',
      description: 'Ideal for businesses with monthly revenue cycles',
      benefits: ['Larger saving amounts', 'Lower frequency commitment', 'Monthly planning alignment']
    }
  ];

  const handleCreatePlan = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.post('/api/savings/create-plan', {
        type: selectedPlan,
        amount: amount
      });

      setSuccess('Savings plan created successfully!');
      updateUser({
        savingsPlan: response.data.savingsPlan,
        nextPaymentDate: response.data.nextPaymentDate
      });
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to create savings plan');
    } finally {
      setLoading(false);
    }
  };

  const selectedPlanData = plans.find(p => p.type === selectedPlan);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Savings Plans</h2>
        <p className="text-gray-600">Choose a plan that fits your business cash flow</p>
      </div>

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
          {success}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Current Plan Display */}
      {user?.savingsPlan?.isActive && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
          <h3 className="text-xl font-semibold text-blue-900 mb-2">Your Current Plan</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center">
              <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-blue-900 font-semibold capitalize">{user.savingsPlan.type} Plan</p>
              <p className="text-blue-700">₦{user.savingsPlan.amount?.toLocaleString()}</p>
            </div>
            <div className="text-center">
              <Target className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-blue-900 font-semibold">Total Saved</p>
              <p className="text-blue-700">₦{user.totalSaved?.toLocaleString()}</p>
            </div>
            <div className="text-center">
              <Award className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-blue-900 font-semibold">Streak</p>
              <p className="text-blue-700">{user.savingsStreak} {user.savingsPlan.type === 'weekly' ? 'weeks' : 'months'}</p>
            </div>
          </div>
        </div>
      )}

      {/* Plan Selection */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {plans.map((plan) => (
          <div 
            key={plan.type}
            className={`border-2 rounded-xl p-6 cursor-pointer transition-all ${
              selectedPlan === plan.type 
                ? 'border-green-500 bg-green-50' 
                : 'border-gray-200 hover:border-green-300'
            }`}
            onClick={() => setSelectedPlan(plan.type)}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">{plan.frequency} Plan</h3>
              {selectedPlan === plan.type && <Check className="w-6 h-6 text-green-500" />}
            </div>
            
            <p className="text-gray-600 mb-4">{plan.description}</p>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Range:</span>
                <span className="font-medium">₦{plan.min.toLocaleString()} - ₦{plan.max.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Frequency:</span>
                <span className="font-medium">{plan.frequency}</span>
              </div>
            </div>

            <div className="space-y-1">
              {plan.benefits.map((benefit, index) => (
                <div key={index} className="flex items-center text-sm text-gray-600">
                  <Check className="w-4 h-4 text-green-500 mr-2" />
                  {benefit}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Amount Customization */}
      <div className="bg-white rounded-xl border p-6 mb-6">
        <h4 className="font-semibold mb-4">Customize Your Amount</h4>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <span className="text-gray-600 font-medium">₦</span>
            <input 
              type="number"
              value={amount}
              onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
              className="flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              min={selectedPlanData?.min}
              max={selectedPlanData?.max}
              step={selectedPlan === 'weekly' ? 1000 : 5000}
            />
            <span className="text-gray-600 font-medium">{selectedPlan}</span>
          </div>
          
          <div className="flex justify-between text-sm text-gray-600">
            <span>Min: ₦{selectedPlanData?.min.toLocaleString()}</span>
            <span>Max: ₦{selectedPlanData?.max.toLocaleString()}</span>
          </div>

          {/* Amount slider for better UX */}
          <input
            type="range"
            min={selectedPlanData?.min}
            max={selectedPlanData?.max}
            value={amount}
            onChange={(e) => setAmount(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            step={selectedPlan === 'weekly' ? 1000 : 5000}
          />
        </div>
      </div>

      {/* What You Unlock */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
        <h4 className="font-semibold text-blue-900 mb-4">What You'll Unlock:</h4>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center text-blue-800">
              <Zap className="w-5 h-5 mr-3" />
              <div>
                <p className="font-medium">Boost Loan</p>
                <p className="text-sm text-blue-600">
                  Up to ₦{(amount * (selectedPlan === 'weekly' ? 2.5 : 2.0)).toLocaleString()} after {selectedPlan === 'weekly' ? '4 saves' : '3 saves'}
                </p>
              </div>
            </div>
            <div className="flex items-center text-blue-800">
              <TrendingUp className="w-5 h-5 mr-3" />
              <div>
                <p className="font-medium">Ascend Capital</p>
                <p className="text-sm text-blue-600">
                  Available after 12 consistent saves
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center text-blue-800">
              <Award className="w-5 h-5 mr-3" />
              <div>
                <p className="font-medium">Interest Earnings</p>
                <p className="text-sm text-blue-600">
                  10% p.a. base + up to 5% loyalty bonus
                </p>
              </div>
            </div>
            <div className="flex items-center text-blue-800">
              <Target className="w-5 h-5 mr-3" />
              <div>
                <p className="font-medium">GrowFund Score</p>
                <p className="text-sm text-blue-600">
                  Improve with each successful save
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interest Calculator */}
      <div className="bg-white rounded-xl border p-6 mb-6">
        <h4 className="font-semibold mb-4">Interest Earnings Calculator</h4>
        <div className="grid md:grid-cols-3 gap-4 text-center">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-2xl font-bold text-green-600">
              ₦{Math.round(amount * 0.10 * (selectedPlan === 'weekly' ? 52 : 12) / 12).toLocaleString()}
            </p>
            <p className="text-sm text-gray-600">Monthly Interest (10% p.a.)</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">
              ₦{Math.round(amount * 0.15 * (selectedPlan === 'weekly' ? 52 : 12) / 12).toLocaleString()}
            </p>
            <p className="text-sm text-gray-600">With Loyalty Bonus (15% p.a.)</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-2xl font-bold text-purple-600">
              ₦{Math.round(amount * (selectedPlan === 'weekly' ? 52 : 12) * 0.15).toLocaleString()}
            </p>
            <p className="text-sm text-gray-600">Annual Potential</p>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={handleCreatePlan}
        disabled={loading || (user?.savingsPlan?.isActive)}
        className="w-full bg-green-600 text-white py-4 px-6 rounded-xl font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
      >
        {loading ? (
          'Creating Plan...'
        ) : user?.savingsPlan?.isActive ? (
          'Plan Already Active'
        ) : (
          <>
            Start My Savings Journey
            <ArrowRight className="w-5 h-5 ml-2" />
          </>
        )}
      </button>

      {/* Payment Methods Info */}
      <div className="mt-8 bg-gray-50 rounded-xl p-6">
        <h4 className="font-semibold mb-4">Automated Payment Options</h4>
        <div className="grid md:grid-cols-3 gap-4 text-center">
          <div className="bg-white p-4 rounded-lg">
            <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <h5 className="font-medium">Bank Transfer</h5>
            <p className="text-sm text-gray-600">Direct debit from your account</p>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <DollarSign className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <h5 className="font-medium">Card Payment</h5>
            <p className="text-sm text-gray-600">Automatic card charges</p>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <DollarSign className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <h5 className="font-medium">USSD/Mobile</h5>
            <p className="text-sm text-gray-600">Quick mobile payments</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SavingsPlans;
