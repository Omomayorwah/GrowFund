export function calculateGrowFundScore (user, savingsHistory, loanHistory) {
  let score = 450; // Base score

  // Savings consistency bonus
  score += user.savingsStreak * 5;

  // Total savings bonus
  score += Math.floor(user.totalSaved / 10000) * 2;

  // Loan repayment history
  const completedLoans = loanHistory.filter(loan => loan.status === 'completed');
  score += completedLoans.length * 25;

  // Cap at 850
  return Math.min(score, 850);
};

export function calculateAvailableLoans(user) {
  const loans = [];
  
  // Boost Loan - Available after 4 consistent saves
  if (user.savingsStreak >= 4) {
    const multiplier = user.savingsPlan.type === 'weekly' ? 2.5 : 2.0;
    const scoreMultiplier = user.growFundScore / 450; // Base score adjustment
    
    loans.push({
      type: 'boost',
      name: 'Boost Loan',
      amount: Math.floor(user.totalSaved * multiplier * scoreMultiplier),
      available: true,
      description: 'Emergency capital for immediate business needs',
      fees: {
        'one-time': { fee: 10, ear: 43 },
        'two-part': { fee: 15, ear: 63 },
        'installmental': { fee: 20, ear: 82 }
      }
    });
  }

  // Ascend Capital - Available after 12 consistent saves
  if (user.savingsStreak >= 12) {
    const multiplier = 3.2;
    const scoreMultiplier = user.growFundScore / 450;
    
    loans.push({
      type: 'ascend',
      name: 'Ascend Capital',
      amount: Math.floor(user.totalSaved * multiplier * scoreMultiplier),
      available: true,
      description: 'Long-term growth funding for business expansion',
      fees: {
        'one-time': { fee: 8, ear: 25 },
        'two-part': { fee: 12, ear: 35 },
        'installmental': { fee: 18, ear: 55 }
      }
    });
  }

  return loans;
};

