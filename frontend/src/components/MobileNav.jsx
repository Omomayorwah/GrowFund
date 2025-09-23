import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Target, CreditCard, BookOpen } from 'lucide-react';

const MobileNav = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate();

  const handleNavigation = (tab, route) => {
    setActiveTab(tab);
    navigate(route);
  };

  const navItems = [
    { id: 'dashboard', icon: TrendingUp, route: '/dashboard', label: 'Dashboard' },
    { id: 'savings', icon: Target, route: '/savings', label: 'Savings' },
    { id: 'credit', icon: CreditCard, route: '/credit', label: 'Credit' },
    { id: 'hub', icon: BookOpen, route: '/hub', label: 'Hub' }
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
      <div className="grid grid-cols-4 py-2">
        {navItems.map(({ id, icon: Icon, route, label }) => (
          <button
            key={id}
            onClick={() => handleNavigation(id, route)}
            className={`flex flex-col items-center py-2 px-3 ${
              activeTab === id ? 'text-green-600' : 'text-gray-400'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-xs mt-1">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MobileNav;
