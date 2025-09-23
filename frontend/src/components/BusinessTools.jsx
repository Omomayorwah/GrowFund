import React, { useState } from 'react';
import { FileText, Calculator, TrendingUp, Settings, Building, Mail, Phone } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const BusinessTools = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleCreateInvoice = async (invoiceData) => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.post('/api/tools/create-invoice', invoiceData);
      setSuccess('Invoice created successfully!');
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to create invoice');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Business Tools</h2>
        <p className="text-gray-600">Essential tools to help manage and grow your business</p>
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

      {/* Available Tools */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {[
          {
            name: "Invoice Generator",
            description: "Create professional invoices for your clients",
            icon: FileText,
            features: ["Custom business branding", "Payment tracking", "Automatic reminders"],
            status: "Available",
            action: "Create Invoice"
          },
          {
            name: "Expense Tracker",
            description: "Track and categorize your business expenses",
            icon: Calculator,
            features: ["Receipt scanning", "Category management", "Monthly reports"],
            status: "Available",
            action: "Track Expenses"
          },
          {
            name: "Cash Flow Predictor",
            description: "Forecast your business cash flow",
            icon: TrendingUp,
            features: ["Revenue forecasting", "Expense planning", "Seasonal analysis"],
            status: "Coming Soon",
            action: "Get Notified"
          },
          {
            name: "Inventory Manager",
            description: "Keep track of your stock and inventory",
            icon: Settings,
            features: ["Stock alerts", "Supplier management", "Cost tracking"],
            status: "Coming Soon",
            action: "Get Notified"
          },
          {
            name: "Business Analytics",
            description: "Get insights into your business performance",
            icon: TrendingUp,
            features: ["Sales analytics", "Growth metrics", "Trend analysis"],
            status: "Premium",
            action: "Upgrade to Access"
          },
          {
            name: "Tax Calculator",
            description: "Calculate your business tax obligations",
            icon: Calculator,
            features: ["VAT calculations", "Income tax estimates", "Deduction tracking"],
            status: "Premium",
            action: "Upgrade to Access"
          }
        ].map((tool, index) => (
          <div key={index} className="bg-white border rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <tool.icon className="w-8 h-8 text-green-500" />
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                tool.status === 'Available' ? 'bg-green-100 text-green-800' :
                tool.status === 'Coming Soon' ? 'bg-yellow-100 text-yellow-800' :
                'bg-purple-100 text-purple-800'
              }`}>
                {tool.status}
              </span>
            </div>
            
            <h3 className="font-semibold text-lg mb-2">{tool.name}</h3>
            <p className="text-gray-600 text-sm mb-4">{tool.description}</p>
            
            <ul className="space-y-1 mb-4">
              {tool.features.map((feature, idx) => (
                <li key={idx} className="text-xs text-gray-600 flex items-center">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                  {feature}
                </li>
              ))}
            </ul>
            
            <button 
              className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                tool.status === 'Available' 
                  ? 'bg-green-600 text-white hover:bg-green-700' 
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
              disabled={tool.status !== 'Available'}
            >
              {tool.action}
            </button>
          </div>
        ))}
      </div>

      {/* Quick Invoice Creation */}
      <div className="bg-white rounded-xl border p-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <FileText className="w-5 h-5 mr-2" />
          Quick Invoice Creation
        </h3>
        <InvoiceForm onSubmit={handleCreateInvoice} loading={loading} />
      </div>
    </div>
  );
};

const InvoiceForm = ({ onSubmit, loading }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    clientName: '',
    clientEmail: '',
    items: [{ description: '', quantity: 1, price: 0 }],
    dueDate: ''
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleItemChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { description: '', quantity: 1, price: 0 }]
    }));
  };

  const removeItem = (index) => {
    if (formData.items.length > 1) {
      setFormData(prev => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== index)
      }));
    }
  };

  const calculateTotal = () => {
    return formData.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Client Name
          </label>
          <input
            type="text"
            name="clientName"
            value={formData.clientName}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Enter client name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Client Email
          </label>
          <input
            type="email"
            name="clientEmail"
            value={formData.clientEmail}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Enter client email"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Due Date
        </label>
        <input
          type="date"
          name="dueDate"
          value={formData.dueDate}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Items
          </label>
          <button
            type="button"
            onClick={addItem}
            className="text-green-600 hover:text-green-700 font-medium text-sm"
          >
            + Add Item
          </button>
        </div>
        
        <div className="space-y-3">
          {formData.items.map((item, index) => (
            <div key={index} className="flex items-center space-x-3">
              <input
                type="text"
                value={item.description}
                onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                placeholder="Item description"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
              <input
                type="number"
                value={item.quantity}
                onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 0)}
                min="1"
                className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
              <input
                type="number"
                value={item.price}
                onChange={(e) => handleItemChange(index, 'price', parseInt(e.target.value) || 0)}
                min="0"
                step="100"
                className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
              {formData.items.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold">Total:</span>
          <span className="text-2xl font-bold text-green-600">₦{calculateTotal().toLocaleString()}</span>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? 'Creating Invoice...' : 'Create Invoice'}
      </button>
    </form>
  );
};

export default BusinessTools;
