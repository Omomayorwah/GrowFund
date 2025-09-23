import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet, TrendingUp, Target, CreditCard, BookOpen, LogOut, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Header = ({ activeTab, setActiveTab }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleNavigation = (tab, route) => {
    setActiveTab(tab);
    navigate(route);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: TrendingUp, route: '/dashboard' },
    { id: 'savings', label: 'Savings Plan', icon: Target, route: '/savings' },
    { id: 'credit', label: 'Credit', icon: CreditCard, route: '/credit' },
    { id: 'hub', label: 'GrowFund Hub', icon: BookOpen, route: '/hub' }
  ];

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
            <Wallet className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">GrowFund</h1>
            <p className="text-xs text-gray-500 hidden sm:block">Financial Resilience for Africa's Traders</p>
          </div>
        </div>
        
        <nav className="hidden md:flex space-x-6">
          {navItems.map(({ id, label, icon: Icon, route }) => (
            <button
              key={id}
              onClick={() => handleNavigation(id, route)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                activeTab === id 
                  ? 'bg-green-100 text-green-700' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-2">
            <User className="w-5 h-5 text-gray-400" />
            <span className="text-sm text-gray-600">{user?.name}</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="hidden md:block">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
