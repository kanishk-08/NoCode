import React, { useState, useEffect, useMemo } from 'react';
import { User, Expense, Category } from '../types';
import { getFinancialAdvice } from '../services/geminiService';
import { storage } from '../services/storage';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, Legend,
  AreaChart, Area, CartesianGrid
} from 'recharts';

interface DashboardProps {
  user: User;
  onLogout: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  action?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ children, className = "", title, action }) => (
  <div className={`bg-white dark:bg-[rgb(28,28,30)] rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 ${className}`}>
    {(title || action) && (
      <div className="flex justify-between items-center mb-6">
        {title && <h3 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h3>}
        {action && <div>{action}</div>}
      </div>
    )}
    {children}
  </div>
);

export const Dashboard: React.FC<DashboardProps> = ({ user, onLogout, isDarkMode, toggleTheme }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'expenses' | 'settings'>('overview');
  
  // Data State
  const [categories, setCategories] = useState<Category[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  
  // Forms states
  const [newExpense, setNewExpense] = useState({ description: '', amount: '', categoryId: '', date: new Date().toISOString().split('T')[0] });
  const [newCategory, setNewCategory] = useState({ name: '', budget: '' });

  // Advice State
  const [advice, setAdvice] = useState<string | null>(null);
  const [loadingAdvice, setLoadingAdvice] = useState(false);

  // Load Data on Mount
  useEffect(() => {
    const data = storage.getUserData(user.email);
    setCategories(data.categories);
    setExpenses(data.expenses);
    setIsDataLoaded(true);
  }, [user.email]);

  // Save Data on Change (Debounced slightly by React batching or just on every render)
  useEffect(() => {
    if (isDataLoaded) {
        storage.saveUserData(user.email, expenses, categories);
    }
  }, [expenses, categories, user.email, isDataLoaded]);

  // Generate Data for Charts
  const spendingByCategory = useMemo(() => {
    return categories.map(cat => {
      const value = expenses.filter(e => e.categoryId === cat.id).reduce((sum, e) => sum + e.amount, 0);
      return { name: cat.name, value, color: cat.color, budget: cat.budget };
    }).filter(d => d.value > 0);
  }, [categories, expenses]);

  const budgetPerformance = useMemo(() => {
     return categories.map(cat => {
      const spent = expenses.filter(e => e.categoryId === cat.id).reduce((sum, e) => sum + e.amount, 0);
      return { name: cat.name, spent, budget: cat.budget, color: cat.color, percentage: Math.min((spent/cat.budget)*100, 100) };
    }).sort((a, b) => b.percentage - a.percentage); // Sort by highest usage
  }, [categories, expenses]);

  // Aggregate expenses by date for Area Chart (Activity Trend)
  const activityData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toISOString().split('T')[0];
    });

    return last7Days.map(date => {
      const amount = expenses
        .filter(e => e.date === date)
        .reduce((sum, e) => sum + e.amount, 0);
      return { 
        date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }), 
        amount 
      };
    });
  }, [expenses]);

  const recentTransactions = useMemo(() => {
    return [...expenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);
  }, [expenses]);

  const totalSpent = useMemo(() => expenses.reduce((sum, e) => sum + e.amount, 0), [expenses]);
  const totalBudget = useMemo(() => categories.reduce((sum, c) => sum + c.budget, 0), [categories]);
  const budgetUtilization = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpense.description || !newExpense.amount || !newExpense.categoryId) return;
    
    const expense: Expense = {
      id: Date.now().toString(),
      description: newExpense.description,
      amount: parseFloat(newExpense.amount),
      categoryId: newExpense.categoryId,
      date: newExpense.date,
    };
    
    setExpenses([expense, ...expenses]);
    setNewExpense({ description: '', amount: '', categoryId: '', date: new Date().toISOString().split('T')[0] });
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.name || !newCategory.budget) return;

    const category: Category = {
        id: Date.now().toString(),
        name: newCategory.name,
        budget: parseFloat(newCategory.budget),
        color: `#${Math.floor(Math.random()*16777215).toString(16)}`
    };
    setCategories([...categories, category]);
    setNewCategory({ name: '', budget: '' });
  };

  const handleUpdateBudget = (id: string, newBudget: number) => {
    setCategories(categories.map(cat => 
        cat.id === id ? { ...cat, budget: newBudget } : cat
    ));
  };

  const handleDeleteExpense = (id: string) => {
      setExpenses(expenses.filter(e => e.id !== id));
  };

  const fetchAdvice = async () => {
    setLoadingAdvice(true);
    const result = await getFinancialAdvice(expenses, categories, user.name);
    setAdvice(result);
    setLoadingAdvice(false);
  };

  // Render Custom Tooltip for Area Chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-100 dark:border-gray-700 rounded-xl shadow-lg">
          <p className="text-xs text-gray-500 mb-1">{label}</p>
          <p className="text-sm font-bold dark:text-white">${payload[0].value.toFixed(2)}</p>
        </div>
      );
    }
    return null;
  };

  if (!isDataLoaded) {
    return <div className="min-h-screen bg-apple-gray dark:bg-black flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-apple-gray dark:bg-black font-sans transition-colors duration-300 pb-20">
      {/* Top Navbar */}
      <nav className="sticky top-0 z-40 glass bg-white/70 dark:bg-[rgb(28,28,30)]/70 border-b border-gray-200 dark:border-gray-800 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
               <div className="w-8 h-8 bg-apple-blue rounded-lg flex items-center justify-center text-white font-bold text-sm">T</div>
               <span className="text-xl font-semibold tracking-tight dark:text-white">TrackIt</span>
            </div>
            <div className="flex items-center gap-4">
               <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-gray-500 dark:text-gray-400">
                  {isDarkMode ? 
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg> 
                    : 
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                  }
               </button>
               <div className="h-6 w-px bg-gray-200 dark:bg-gray-700"></div>
               <div className="flex items-center gap-2">
                 <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 text-sm font-bold">
                   {user.name.charAt(0).toUpperCase()}
                 </div>
                 <button onClick={onLogout} className="text-sm font-medium text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
                   Sign out
                 </button>
               </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
             <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome back, {user.name.split(' ')[0]}</h1>
             <p className="text-gray-500 dark:text-gray-400 mt-1">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          
          <div className="bg-gray-200 dark:bg-gray-800 p-1 rounded-xl flex gap-1">
             {['overview', 'expenses', 'settings'].map((tab) => (
               <button
                 key={tab}
                 onClick={() => setActiveTab(tab as any)}
                 className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                   activeTab === tab 
                   ? 'bg-white dark:bg-[rgb(44,44,46)] text-black dark:text-white shadow-sm' 
                   : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                 }`}
               >
                 {tab.charAt(0).toUpperCase() + tab.slice(1)}
               </button>
             ))}
          </div>
        </header>

        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-fade-in-up">
             
             {/* Row 1: Key Metrics */}
             
             {/* Total Spent */}
             <Card className="md:col-span-1 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                   <svg className="w-24 h-24 text-apple-blue" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05 1.18 1.91 2.53 1.91 1.29 0 2.13-.72 2.13-1.55 0-1.35-2.11-1.94-3.55-2.43l-.27-.1C8.24 11.77 6.2 10.98 6.2 8.5c0-2.28 1.41-3.83 3.33-4.14V3h2.67v1.88c1.39.23 2.5.99 2.96 2.4l-1.9.53c-.31-.83-1.03-1.32-2.06-1.32-1.27 0-1.94.7-1.94 1.47 0 1.05 1.77 1.63 2.95 2.06l.27.09c1.93.68 4.1 1.68 4.1 4.12 0 2.38-1.52 4.02-3.59 4.38z"/></svg>
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Total Spent</p>
                <h2 className="text-4xl font-bold tracking-tight dark:text-white">${totalSpent.toFixed(2)}</h2>
                <div className="mt-4 flex items-center gap-2">
                   <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-md text-gray-600 dark:text-gray-300">
                     {expenses.length} transactions
                   </span>
                </div>
             </Card>

             {/* Budget Health */}
             <Card className="md:col-span-1">
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Monthly Budget</p>
                <div className="flex items-baseline gap-1">
                   <h2 className="text-2xl font-bold dark:text-white">${totalBudget.toFixed(0)}</h2>
                   <span className="text-sm text-gray-400">limit</span>
                </div>
                
                <div className="mt-4">
                   <div className="flex justify-between text-xs mb-1.5">
                      <span className={budgetUtilization > 100 ? "text-red-500 font-medium" : "text-gray-600 dark:text-gray-300"}>
                        {budgetUtilization.toFixed(0)}% Used
                      </span>
                      <span className="text-gray-400">${Math.max(totalBudget - totalSpent, 0).toFixed(0)} left</span>
                   </div>
                   <div className="w-full bg-gray-100 dark:bg-gray-700 h-3 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ease-out ${budgetUtilization > 100 ? 'bg-red-500' : budgetUtilization > 85 ? 'bg-yellow-500' : 'bg-green-500'}`} 
                        style={{ width: `${Math.min(budgetUtilization, 100)}%` }}
                      ></div>
                   </div>
                </div>
             </Card>

             {/* Gemini Insight */}
             <Card className="md:col-span-2 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-indigo-100 dark:border-indigo-900/30">
                <div className="flex gap-4 h-full">
                   <div className="hidden sm:flex flex-col items-center justify-start pt-1">
                      <div className="w-10 h-10 rounded-xl bg-white dark:bg-white/10 flex items-center justify-center text-xl shadow-sm">
                        ✨
                      </div>
                   </div>
                   <div className="flex-1 flex flex-col justify-between">
                      <div>
                         <h3 className="text-lg font-bold text-indigo-900 dark:text-indigo-100">Financial Insights</h3>
                         <div className="mt-2 text-sm text-indigo-800 dark:text-indigo-200 leading-relaxed min-h-[3rem]">
                           {advice ? advice : "Your AI financial advisor is ready to analyze your spending patterns."}
                         </div>
                      </div>
                      <div className="mt-4 flex justify-end">
                         <button 
                            onClick={fetchAdvice}
                            disabled={loadingAdvice}
                            className="px-4 py-2 bg-white dark:bg-white/10 text-indigo-600 dark:text-indigo-200 text-xs font-bold uppercase tracking-wide rounded-lg hover:bg-indigo-50 dark:hover:bg-white/20 transition-colors shadow-sm disabled:opacity-50"
                         >
                            {loadingAdvice ? 'Analyzing...' : (advice ? 'Refresh' : 'Get Insights')}
                         </button>
                      </div>
                   </div>
                </div>
             </Card>

             {/* Row 2: Charts */}
             
             {/* Activity Area Chart */}
             <Card className="md:col-span-3 min-h-[300px]" title="Daily Activity">
                <div className="h-64 w-full">
                   <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={activityData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#0071E3" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#0071E3" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? "#333" : "#f0f0f0"} />
                        <XAxis 
                           dataKey="date" 
                           axisLine={false} 
                           tickLine={false} 
                           tick={{fill: isDarkMode ? '#888' : '#999', fontSize: 12}} 
                           dy={10}
                        />
                        <YAxis 
                           axisLine={false} 
                           tickLine={false} 
                           tick={{fill: isDarkMode ? '#888' : '#999', fontSize: 12}} 
                        />
                        <RechartsTooltip content={<CustomTooltip />} cursor={{ stroke: '#0071E3', strokeWidth: 1, strokeDasharray: '5 5' }} />
                        <Area 
                           type="monotone" 
                           dataKey="amount" 
                           stroke="#0071E3" 
                           strokeWidth={3}
                           fillOpacity={1} 
                           fill="url(#colorAmount)" 
                        />
                      </AreaChart>
                   </ResponsiveContainer>
                </div>
             </Card>
             
             {/* Categories Radar/Pie */}
             <Card className="md:col-span-1 min-h-[300px]" title="Breakdown">
                <div className="h-48 w-full relative">
                   {spendingByCategory.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={spendingByCategory}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {spendingByCategory.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                          ))}
                        </Pie>
                        <RechartsTooltip 
                           contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', backgroundColor: isDarkMode ? '#1f2937' : '#fff', color: isDarkMode ? '#fff' : '#000' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                   ) : (
                     <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-300 dark:text-gray-600">
                        <div className="w-24 h-24 rounded-full border-4 border-gray-100 dark:border-gray-800"></div>
                        <span className="text-xs mt-2">No data</span>
                     </div>
                   )}
                   {/* Centered Total */}
                   {spendingByCategory.length > 0 && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                         <div className="text-center">
                            <span className="block text-xs text-gray-400 uppercase">Total</span>
                            <span className="block text-lg font-bold dark:text-white">${totalSpent.toFixed(0)}</span>
                         </div>
                      </div>
                   )}
                </div>
                <div className="mt-4 space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
                   {spendingByCategory.map((cat, i) => (
                      <div key={i} className="flex items-center justify-between text-xs">
                         <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }}></div>
                            <span className="text-gray-600 dark:text-gray-400 truncate max-w-[80px]">{cat.name}</span>
                         </div>
                         <span className="font-medium dark:text-gray-300">${cat.value.toFixed(0)}</span>
                      </div>
                   ))}
                </div>
             </Card>

             {/* Row 3: Detail Lists */}
             
             {/* Recent Transactions */}
             <Card 
                className="md:col-span-2" 
                title="Recent Transactions" 
                action={<button onClick={() => setActiveTab('expenses')} className="text-sm text-apple-blue font-medium hover:underline">View All</button>}
             >
                <div className="space-y-0">
                  {recentTransactions.length === 0 ? (
                    <div className="py-8 text-center text-gray-400 text-sm">No recent activity.</div>
                  ) : (
                    recentTransactions.map((expense) => {
                       const category = categories.find(c => c.id === expense.categoryId);
                       return (
                          <div key={expense.id} className="flex items-center justify-between py-3 border-b border-gray-50 dark:border-gray-800 last:border-0">
                             <div className="flex items-center gap-3">
                                <div 
                                  className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-sm"
                                  style={{ backgroundColor: category?.color || '#ccc' }}
                                >
                                   {category?.name.charAt(0) || '?'}
                                </div>
                                <div>
                                   <div className="font-medium text-gray-900 dark:text-gray-200">{expense.description}</div>
                                   <div className="text-xs text-gray-400">{expense.date}</div>
                                </div>
                             </div>
                             <div className="font-semibold dark:text-white">-${expense.amount.toFixed(2)}</div>
                          </div>
                       );
                    })
                  )}
                </div>
             </Card>

             {/* Top Spending Categories (Radar Bars) */}
             <Card className="md:col-span-2" title="Budget Status">
                <div className="space-y-4">
                  {budgetPerformance.slice(0, 4).map((cat) => (
                    <div key={cat.name} className="group">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium dark:text-gray-300">{cat.name}</span>
                        <div className="flex gap-1 text-xs">
                          <span className="font-semibold dark:text-white">${cat.spent.toFixed(0)}</span>
                          <span className="text-gray-400">/ ${cat.budget}</span>
                        </div>
                      </div>
                      <div className="relative w-full h-2.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div 
                           className="absolute top-0 left-0 h-full rounded-full transition-all duration-1000"
                           style={{ 
                             width: `${Math.min(cat.percentage, 100)}%`, 
                             backgroundColor: cat.percentage > 100 ? '#ef4444' : cat.color 
                           }}
                        ></div>
                      </div>
                      {cat.percentage > 90 && (
                         <div className="text-[10px] text-red-500 mt-1 font-medium">Near Limit!</div>
                      )}
                    </div>
                  ))}
                  {budgetPerformance.length === 0 && (
                     <div className="py-8 text-center text-gray-400 text-sm">No budgets set.</div>
                  )}
                </div>
             </Card>

          </div>
        )}

        {activeTab === 'expenses' && (
          <div className="space-y-6 animate-fade-in-up">
            {/* Add Expense Form */}
            <Card>
               <h3 className="text-lg font-bold mb-4 dark:text-white">Add New Expense</h3>
               <form onSubmit={handleAddExpense} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <input
                    type="text"
                    placeholder="Description"
                    value={newExpense.description}
                    onChange={e => setNewExpense({...newExpense, description: e.target.value})}
                    className="p-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-transparent focus:bg-white dark:focus:bg-gray-600 focus:ring-2 focus:ring-apple-blue outline-none transition-all dark:text-white"
                  />
                  <input
                    type="number"
                    placeholder="Amount"
                    value={newExpense.amount}
                    onChange={e => setNewExpense({...newExpense, amount: e.target.value})}
                    className="p-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-transparent focus:bg-white dark:focus:bg-gray-600 focus:ring-2 focus:ring-apple-blue outline-none transition-all dark:text-white"
                  />
                  <select
                    value={newExpense.categoryId}
                    onChange={e => setNewExpense({...newExpense, categoryId: e.target.value})}
                    className="p-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-transparent focus:bg-white dark:focus:bg-gray-600 focus:ring-2 focus:ring-apple-blue outline-none transition-all dark:text-white"
                  >
                    <option value="" disabled>Select Category</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                  <button type="submit" className="bg-apple-blue text-white font-medium rounded-xl hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/20">
                    Add Transaction
                  </button>
               </form>
            </Card>

            {/* Expenses List */}
            <div className="bg-white dark:bg-[rgb(28,28,30)] rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                <div className="overflow-x-auto">
                   <table className="w-full text-left">
                      <thead className="bg-gray-50 dark:bg-black/20 border-b border-gray-100 dark:border-gray-800 text-gray-500 dark:text-gray-400 font-medium text-sm">
                        <tr>
                           <th className="p-5">Description</th>
                           <th className="p-5">Category</th>
                           <th className="p-5">Date</th>
                           <th className="p-5 text-right">Amount</th>
                           <th className="p-5"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {expenses.length === 0 ? (
                           <tr>
                              <td colSpan={5} className="p-8 text-center text-gray-400">No expenses recorded yet.</td>
                           </tr>
                        ) : (
                           expenses.map(expense => {
                             const category = categories.find(c => c.id === expense.categoryId);
                             return (
                               <tr key={expense.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                 <td className="p-5 font-medium dark:text-white">{expense.description}</td>
                                 <td className="p-5">
                                    <span 
                                      className="px-3 py-1 rounded-full text-xs font-medium text-white shadow-sm"
                                      style={{ backgroundColor: category?.color || '#999' }}
                                    >
                                       {category?.name || 'Unknown'}
                                    </span>
                                 </td>
                                 <td className="p-5 text-gray-500 dark:text-gray-400 text-sm">{expense.date}</td>
                                 <td className="p-5 text-right font-semibold dark:text-white">${expense.amount.toFixed(2)}</td>
                                 <td className="p-5 text-right">
                                    <button 
                                      onClick={() => handleDeleteExpense(expense.id)}
                                      className="text-gray-400 hover:text-red-500 transition-colors"
                                    >
                                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    </button>
                                 </td>
                               </tr>
                             );
                           })
                        )}
                      </tbody>
                   </table>
                </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
           <div className="space-y-6 max-w-2xl mx-auto animate-fade-in-up">
              <Card>
                 <h3 className="text-xl font-bold mb-6 dark:text-white">Manage Categories & Budgets</h3>
                 
                 <div className="mb-8 bg-gray-50 dark:bg-gray-900/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
                    <p className="text-sm font-medium text-gray-900 dark:text-white mb-4">Create New Category</p>
                    <form onSubmit={handleAddCategory} className="flex gap-3">
                        <input 
                        type="text" 
                        placeholder="Name (e.g. Gym)" 
                        value={newCategory.name}
                        onChange={e => setNewCategory({...newCategory, name: e.target.value})}
                        className="flex-1 p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 outline-none focus:ring-2 focus:ring-apple-blue dark:text-white shadow-sm"
                        />
                        <input 
                        type="number" 
                        placeholder="Limit ($)" 
                        value={newCategory.budget}
                        onChange={e => setNewCategory({...newCategory, budget: e.target.value})}
                        className="w-28 p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 outline-none focus:ring-2 focus:ring-apple-blue dark:text-white shadow-sm"
                        />
                        <button type="submit" className="p-3 bg-black dark:bg-white text-white dark:text-black rounded-xl font-bold hover:opacity-80 transition-opacity shadow-lg">
                           + Add
                        </button>
                    </form>
                 </div>

                 <div className="space-y-3">
                    <p className="text-xs font-semibold uppercase text-gray-400 mb-2 tracking-wider">Current Budgets</p>
                    {categories.map(cat => (
                       <div key={cat.id} className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
                          <div className="flex items-center gap-3">
                             <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: cat.color }}></div>
                             <span className="font-medium text-gray-900 dark:text-white">{cat.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                             <span className="text-sm text-gray-400">Limit: $</span>
                             <input
                                type="number"
                                className="w-20 p-1 rounded-lg border-b border-gray-200 dark:border-gray-600 bg-transparent text-sm focus:border-apple-blue outline-none dark:text-white text-right font-medium"
                                value={cat.budget}
                                onChange={(e) => handleUpdateBudget(cat.id, parseFloat(e.target.value))}
                             />
                          </div>
                       </div>
                    ))}
                 </div>
              </Card>
           </div>
        )}

      </main>
    </div>
  );
};
