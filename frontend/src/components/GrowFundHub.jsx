import React, { useState } from 'react';
import { BookOpen, Users, Settings, Award, TrendingUp, FileText, Calculator } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const GrowFundHub = () => {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState('learning');

  const sections = [
    { id: 'learning', label: 'Financial Learning', icon: BookOpen },
    { id: 'community', label: 'Success Stories', icon: Users },
    { id: 'tools', label: 'Business Tools', icon: Settings },
    { id: 'challenges', label: 'Challenges', icon: Award }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">GrowFund Hub</h2>
        <p className="text-gray-600">Learn, grow, and connect with fellow entrepreneurs</p>
      </div>

      {/* Section Navigation */}
      <div className="flex flex-wrap gap-2 mb-8">
        {sections.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveSection(id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              activeSection === id
                ? 'bg-green-100 text-green-700'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* Content Sections */}
      {activeSection === 'learning' && <FinancialLearning />}
      {activeSection === 'community' && <SuccessStories />}
      {activeSection === 'tools' && <BusinessTools />}
      {activeSection === 'challenges' && <CommunityChallenges />}
    </div>
  );
};

const FinancialLearning = () => (
  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[
      {
        title: "Cash Flow Management for MSMEs",
        description: "Learn how to predict and manage your business cash flow effectively",
        category: "Business Finance",
        readTime: "8 min read",
        difficulty: "Beginner"
      },
      {
        title: "Building Your Credit Score",
        description: "Understanding how your GrowFund Score works and tips to improve it",
        category: "Credit Building",
        readTime: "5 min read",
        difficulty: "Beginner"
      },
      {
        title: "Emergency Fund Strategies",
        description: "Why every business needs an emergency fund and how to build one",
        category: "Financial Planning",
        readTime: "6 min read",
        difficulty: "Intermediate"
      },
      {
        title: "Smart Borrowing for Growth",
        description: "When and how to use loans effectively for business expansion",
        category: "Growth Strategy",
        readTime: "10 min read",
        difficulty: "Intermediate"
      },
      {
        title: "Tax Planning for Small Business",
        description: "Essential tax strategies every Nigerian entrepreneur should know",
        category: "Tax Planning",
        readTime: "12 min read",
        difficulty: "Advanced"
      },
      {
        title: "Investment Basics for Entrepreneurs",
        description: "How to invest business profits for long-term wealth building",
        category: "Investment",
        readTime: "15 min read",
        difficulty: "Advanced"
      }
    ].map((article, index) => (
      <div key={index} className="bg-white border rounded-xl p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between mb-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            article.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
            article.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {article.difficulty}
          </span>
          <span className="text-xs text-gray-500">{article.readTime}</span>
        </div>
        
        <h3 className="font-semibold text-lg mb-2">{article.title}</h3>
        <p className="text-gray-600 text-sm mb-3">{article.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-blue-600 font-medium">{article.category}</span>
          <button className="text-green-600 hover:text-green-700 font-medium text-sm">
            Read Article
          </button>
        </div>
      </div>
    ))}
  </div>
);

const SuccessStories = () => (
  <div className="space-y-6">
    {[
      {
        name: "Kemi Adebayo",
        business: "Fashion Accessories",
        achievement: "From ₦50k to ₦500k monthly revenue",
        story: "Started with a small savings plan of ₦15,000 weekly. After 8 weeks, I accessed my first Boost Loan to purchase inventory for the festive season. The disciplined savings habit helped me manage cash flow better, and the emergency loan came through when I needed to restock quickly. Now I save ₦40,000 monthly and have grown my customer base by 300%.",
        duration: "8 months with GrowFund",
        avatar: "KA"
      },
      {
        name: "Tunde Okonkwo",
        business: "Electronics Repair",
        achievement: "Expanded to 3 locations",
        story: "My repair shop was doing okay, but I couldn't expand because banks wouldn't give me loans without collateral. GrowFund's savings-first approach made sense. I saved ₦25,000 weekly for 6 months, then used Ascend Capital to open my second location. The steady savings discipline taught me financial planning I never had before.",
        duration: "14 months with GrowFund",
        avatar: "TO"
      },
      {
        name: "Blessing Okoro",
        business: "Catering Services",
        achievement: "Survived COVID-19 downturn",
        story: "When COVID hit and events stopped, my savings with GrowFund became a lifeline. I had built up ₦180,000 in savings over 6 months. The emergency fund kept my business alive when there was no income for 3 months. Now I'm back stronger with a food delivery service too.",
        duration: "2 years with GrowFund",
        avatar: "BO"
      }
    ].map((story, index) => (
      <div key={index} className="bg-white border rounded-xl p-6">
        <div className="flex items-start space-x-4">
          <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
            {story.avatar}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="font-semibold text-lg">{story.name}</h3>
                <p className="text-sm text-gray-600">{story.business}</p>
              </div>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                {story.duration}
              </span>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
              <p className="font-medium text-green-900">{story.achievement}</p>
            </div>
            
            <p className="text-gray-700 text-sm leading-relaxed">{story.story}</p>
          </div>
        </div>
      </div>
    ))}
    
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
      <Users className="w-12 h-12 text-blue-500 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-blue-900 mb-2">Share Your Story</h3>
      <p className="text-blue-700 mb-4">
        Have GrowFund helped transform your business? Share your success story and inspire others!
      </p>
      <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
        Submit My Story
      </button>
    </div>
  </div>
);

const BusinessTools = () => (
  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[
      {
        name: "Invoice Generator",
        description: "Create professional invoices for your clients",
        icon: FileText,
        features: ["Custom business branding", "Payment tracking", "Automatic reminders"],
        status: "Available"
      },
      {
        name: "Expense Tracker",
        description: "Track and categorize your business expenses",
        icon: Calculator,
        features: ["Receipt scanning", "Category management", "Monthly reports"],
        status: "Available"
      },
      {
        name: "Cash Flow Predictor",
        description: "Forecast your business cash flow",
        icon: TrendingUp,
        features: ["Revenue forecasting", "Expense planning", "Seasonal analysis"],
        status: "Coming Soon"
      },
      {
        name: "Inventory Manager",
        description: "Keep track of your stock and inventory",
        icon: Settings,
        features: ["Stock alerts", "Supplier management", "Cost tracking"],
        status: "Coming Soon"
      },
      {
        name: "Business Analytics",
        description: "Get insights into your business performance",
        icon: TrendingUp,
        features: ["Sales analytics", "Growth metrics", "Trend analysis"],
        status: "Premium"
      },
      {
        name: "Tax Calculator",
        description: "Calculate your business tax obligations",
        icon: Calculator,
        features: ["VAT calculations", "Income tax estimates", "Deduction tracking"],
        status: "Premium"
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
          {tool.status === 'Available' ? 'Use Tool' : 
           tool.status === 'Premium' ? 'Upgrade to Access' : 'Coming Soon'}
        </button>
      </div>
    ))}
  </div>
);

const CommunityChallenges = () => (
  <div className="space-y-6">
    <div className="bg-gradient-to-r from-orange-400 to-pink-500 text-white rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold">30-Day Savings Challenge</h3>
          <p className="text-orange-100">Save consistently for 30 days straight</p>
        </div>
        <Award className="w-12 h-12 text-orange-200" />
      </div>
      
      <div className="grid md:grid-cols-3 gap-4 mb-4">
        <div className="bg-white bg-opacity-20 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold">847</p>
          <p className="text-sm text-orange-100">Participants</p>
        </div>
        <div className="bg-white bg-opacity-20 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold">23</p>
          <p className="text-sm text-orange-100">Days Left</p>
        </div>
        <div className="bg-white bg-opacity-20 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold">₦5K</p>
          <p className="text-sm text-orange-100">Winner Bonus</p>
        </div>
      </div>
      
      <button className="bg-white text-orange-600 px-6 py-2 rounded-lg font-semibold hover:bg-orange-50 transition-colors">
        Join Challenge
      </button>
    </div>

    {[
      {
        title: "Business Growth Sprint",
        description: "12-week challenge to implement one growth strategy weekly",
        participants: 234,
        reward: "Free business consultation",
        status: "Starting Soon",
        color: "from-blue-400 to-purple-500"
      },
      {
        title: "Emergency Fund Builder",
        description: "Build 6 months of business expenses as emergency fund",
        participants: 156,
        reward: "Premium tools access",
        status: "Active",
        color: "from-green-400 to-blue-500"
      },
      {
        title: "Credit Score Booster",
        description: "Improve your GrowFund Score by 100 points in 3 months",
        participants: 89,
        reward: "Lower loan interest rates",
        status: "Active",
        color: "from-purple-400 to-pink-500"
      }
    ].map((challenge, index) => (
      <div key={index} className={`bg-gradient-to-r ${challenge.color} text-white rounded-xl p-6`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold">{challenge.title}</h3>
            <p className="text-white text-opacity-90 text-sm">{challenge.description}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            challenge.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
          }`}>
            {challenge.status}
          </span>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div className="bg-white bg-opacity-20 rounded-lg p-3">
            <p className="text-sm opacity-90">Participants</p>
            <p className="text-xl font-bold">{challenge.participants}</p>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-3">
            <p className="text-sm opacity-90">Reward</p>
            <p className="font-semibold">{challenge.reward}</p>
          </div>
        </div>
        
        <button className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-6 py-2 rounded-lg font-semibold transition-colors">
          {challenge.status === 'Active' ? 'Join Now' : 'Get Notified'}
        </button>
      </div>
    ))}
  </div>
);

export default GrowFundHub;
