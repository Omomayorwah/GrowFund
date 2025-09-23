import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import './styles/App.css';

// Import components
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import SavingsPlans from './components/SavingsPlans';
import CreditProducts from './components/CreditProducts';
import GrowFundHub from './components/GrowFundHub';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import LoanApplication from './components/LoanApplication';
import BusinessTools from './components/BusinessTools';
import MobileNav from './components/MobileNav';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { API_BASE_URL } from './utils/constants';

// Configure axios defaults
axios.defaults.baseURL = API_BASE_URL;

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <AppContent />
        </div>
      </Router>
    </AuthProvider>
  );
};

const AppContent = () => {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading GrowFund...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <>
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="pb-20 md:pb-8">
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/savings" element={<SavingsPlans />} />
          <Route path="/credit" element={<CreditProducts />} />
          <Route path="/loans/apply" element={<LoanApplication />} />
          <Route path="/hub" element={<GrowFundHub />} />
          <Route path="/tools" element={<BusinessTools />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>

      <MobileNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </>
  );
};

export default App;
