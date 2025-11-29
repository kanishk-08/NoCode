import React from 'react';

interface LandingPageProps {
  onGetStarted: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen flex flex-col font-sans overflow-hidden relative">
      
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[20%] w-96 h-96 bg-purple-300/30 dark:bg-purple-900/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-70 animate-blob"></div>
          <div className="absolute top-[20%] right-[10%] w-96 h-96 bg-blue-300/30 dark:bg-blue-900/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-[20%] left-[30%] w-96 h-96 bg-pink-300/30 dark:bg-pink-900/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 glass bg-white/70 dark:bg-black/70 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-apple-blue rounded-lg flex items-center justify-center text-white font-bold">T</div>
              <span className="text-xl font-semibold tracking-tight">TrackIt</span>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={onGetStarted}
                className="text-sm font-medium hover:text-apple-blue transition-colors"
              >
                Log in
              </button>
              <button 
                onClick={onGetStarted}
                className="bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Sign up
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-grow pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-block px-4 py-1.5 rounded-full border border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm mb-8 animate-fade-in-up">
              <span className="text-sm font-medium bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
                  ✨ Now with Gemini AI Insights
              </span>
          </div>

          <h1 className="text-5xl md:text-8xl font-bold tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-b from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 pb-2 leading-tight">
            Master your money.<br />Effortlessly.
          </h1>
          <p className="text-xl md:text-2xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Track expenses, set smart budgets, and get AI-powered financial advice. All in an interface designed for clarity.
          </p>
          
          <div className="flex justify-center gap-4 mb-24">
             <button 
                onClick={onGetStarted}
                className="bg-apple-blue text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/30 hover:scale-105 active:scale-95"
              >
                Get Started Free
              </button>
              <button className="text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 px-8 py-4 rounded-full text-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-all flex items-center gap-2">
                Watch Demo
              </button>
          </div>

          {/* Detailed Dashboard Mockup with Floating Elements */}
          <div className="relative mx-auto max-w-5xl mt-12 mb-24">
            
            {/* Floating Element: Glass Credit Card */}
            <div className="hidden lg:block absolute -left-16 top-20 z-20 animate-float perspective-1000">
                <div className="w-64 h-40 bg-gradient-to-br from-gray-900 to-gray-700 rounded-2xl shadow-2xl p-6 text-white flex flex-col justify-between transform -rotate-12 border-t border-white/20 backdrop-blur-md">
                    <div className="flex justify-between items-start">
                        <div className="w-10 h-6 bg-yellow-500/80 rounded-md"></div>
                        <span className="font-mono text-xs opacity-70">TrackIt Card</span>
                    </div>
                    <div>
                        <div className="font-mono text-lg tracking-widest mb-1">•••• •••• 4289</div>
                        <div className="text-xs opacity-70">JANE DOE</div>
                    </div>
                </div>
            </div>

            {/* Floating Element: Success Notification */}
            <div className="hidden lg:block absolute -right-10 top-40 z-20 animate-float-delayed">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 flex items-center gap-4 transform rotate-6 max-w-xs">
                    <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center text-green-600 text-xl">
                        🎯
                    </div>
                    <div>
                        <div className="text-sm font-bold dark:text-white">Goal Reached!</div>
                        <div className="text-xs text-gray-500">You saved $500 this month.</div>
                    </div>
                </div>
            </div>

            {/* Floating Element: AI Bubble */}
            <div className="hidden lg:block absolute -right-4 -top-12 z-20 animate-float">
                <div className="bg-white dark:bg-gray-800 p-3 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 flex items-center gap-2">
                     <span className="text-lg">✨</span>
                     <span className="text-xs font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">Gemini Powered</span>
                </div>
            </div>


            {/* Main Mockup */}
            <div className="absolute inset-0 bg-gradient-to-t from-apple-gray dark:from-black via-transparent to-transparent z-10 h-full w-full pointer-events-none bottom-0"></div>
            
            <div className="rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 transform rotate-x-6 perspective-1000 mx-4 md:mx-0">
               {/* Mock Window Controls */}
               <div className="h-12 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center px-4 gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  <div className="ml-4 w-64 h-6 bg-gray-200 dark:bg-gray-700 rounded-md opacity-50"></div>
               </div>
               
               {/* Detailed Mock Content */}
               <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                  {/* Sidebar / Nav area simulation */}
                  <div className="hidden md:flex flex-col gap-4 text-gray-500 text-sm">
                      <div className="font-semibold text-gray-900 dark:text-white mb-4">Overview</div>
                      <div className="bg-gray-100 dark:bg-gray-800 text-apple-blue px-3 py-2 rounded-lg font-medium">Dashboard</div>
                      <div className="px-3 hover:text-gray-900 dark:hover:text-white cursor-pointer transition-colors">Expenses</div>
                      <div className="px-3 hover:text-gray-900 dark:hover:text-white cursor-pointer transition-colors">Budget</div>
                      <div className="px-3 hover:text-gray-900 dark:hover:text-white cursor-pointer transition-colors">Settings</div>
                      
                      <div className="mt-8 font-semibold text-gray-900 dark:text-white mb-4">Categories</div>
                      <div className="px-3 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-400"></div> Food</div>
                      <div className="px-3 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-400"></div> Transport</div>
                      <div className="px-3 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-yellow-400"></div> Shopping</div>
                  </div>

                  {/* Main Content Area */}
                  <div className="col-span-2 space-y-6">
                      {/* Stats Row */}
                      <div className="grid grid-cols-2 gap-4">
                          <div className="bg-blue-500 text-white p-5 rounded-2xl shadow-lg shadow-blue-500/20">
                              <div className="text-blue-100 text-xs font-medium uppercase tracking-wide">Total Spent</div>
                              <div className="text-2xl font-bold mt-1">$2,450.00</div>
                              <div className="text-xs text-blue-100 mt-2 bg-blue-600/50 inline-block px-2 py-1 rounded">+12% vs last month</div>
                          </div>
                          <div className="bg-gray-50 dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700">
                              <div className="text-gray-500 text-xs font-medium uppercase tracking-wide">Monthly Budget</div>
                              <div className="text-2xl font-bold mt-1 dark:text-white">$3,000.00</div>
                              <div className="w-full bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full mt-4 overflow-hidden">
                                  <div className="bg-green-500 h-1.5 rounded-full" style={{width: '81%'}}></div>
                              </div>
                              <div className="text-xs text-gray-400 mt-2 text-right">81% utilized</div>
                          </div>
                      </div>

                      {/* Gemini Insight Mock */}
                      <div className="bg-purple-50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-900/30 p-4 rounded-2xl flex gap-3 items-start">
                          <div className="bg-purple-100 dark:bg-purple-900/50 p-2 rounded-lg text-lg">✨</div>
                          <div>
                               <div className="text-sm font-semibold text-purple-900 dark:text-purple-100">Smart Insight</div>
                               <div className="text-xs text-purple-800 dark:text-purple-200 mt-1">You've reached 80% of your Dining budget. Try cooking at home this weekend to stay on track!</div>
                          </div>
                      </div>

                      {/* Chart & List Row */}
                      <div className="grid grid-cols-2 gap-4">
                          {/* Simple Bar Chart Mock */}
                          <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700">
                               <div className="text-xs font-medium text-gray-500 mb-4">Weekly Activity</div>
                               <div className="flex items-end justify-between h-24 gap-2 px-1">
                                   <div className="w-full bg-blue-100 dark:bg-blue-900/30 rounded-t-sm h-[40%]"></div>
                                   <div className="w-full bg-blue-100 dark:bg-blue-900/30 rounded-t-sm h-[70%]"></div>
                                   <div className="w-full bg-apple-blue rounded-t-sm h-[55%]"></div>
                                   <div className="w-full bg-blue-100 dark:bg-blue-900/30 rounded-t-sm h-[30%]"></div>
                                   <div className="w-full bg-blue-100 dark:bg-blue-900/30 rounded-t-sm h-[85%]"></div>
                               </div>
                          </div>
                          
                          {/* Transaction List Mock */}
                          <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 flex flex-col justify-center gap-4">
                               <div className="flex justify-between items-center text-xs">
                                   <div className="flex items-center gap-2">
                                       <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-base">☕</div>
                                       <div>
                                          <div className="font-medium dark:text-gray-200">Starbucks</div>
                                          <div className="text-[10px] text-gray-400">Today</div>
                                       </div>
                                   </div>
                                   <span className="font-semibold dark:text-white">-$5.40</span>
                               </div>
                               <div className="flex justify-between items-center text-xs">
                                   <div className="flex items-center gap-2">
                                       <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-base">🚗</div>
                                       <div>
                                          <div className="font-medium dark:text-gray-200">Uber</div>
                                          <div className="text-[10px] text-gray-400">Yesterday</div>
                                       </div>
                                   </div>
                                   <span className="font-semibold dark:text-white">-$24.50</span>
                               </div>
                          </div>
                      </div>
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* Feature Grid - Bento Style */}
        <div className="bg-gray-50 dark:bg-black py-24 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
               <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
                 More than just a tracker.
               </h2>
               <p className="text-xl text-gray-500 dark:text-gray-400">
                 Powerful tools to help you understand your financial habits and reach your goals faster.
               </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {/* Feature 1: Analytics (Span 2) */}
               <div className="md:col-span-2 bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 md:p-12 overflow-hidden relative border border-gray-100 dark:border-gray-800 hover:shadow-2xl transition-all duration-500 group">
                  <div className="relative z-10">
                     <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-apple-blue mb-6">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                     </div>
                     <h3 className="text-2xl font-bold mb-2 dark:text-white">Real-time Analytics</h3>
                     <p className="text-gray-500 dark:text-gray-400 max-w-sm leading-relaxed">
                        Interactive charts that visualize your spending patterns instantly. See exactly where every penny goes.
                     </p>
                  </div>
                  {/* Decorative Graph */}
                  <div className="absolute bottom-0 right-0 w-64 h-48 translate-y-8 translate-x-8 opacity-90 group-hover:translate-y-2 transition-transform duration-500">
                      <div className="flex items-end justify-between h-full gap-2 p-4 bg-gray-50 dark:bg-gray-800 rounded-tl-2xl border border-gray-100 dark:border-gray-700 shadow-lg">
                          <div className="w-8 bg-blue-200 dark:bg-blue-900/40 h-[40%] rounded-t-md"></div>
                          <div className="w-8 bg-blue-300 dark:bg-blue-800/40 h-[70%] rounded-t-md"></div>
                          <div className="w-8 bg-apple-blue h-[55%] rounded-t-md shadow-lg shadow-blue-500/20"></div>
                          <div className="w-8 bg-blue-400 dark:bg-blue-600/40 h-[85%] rounded-t-md"></div>
                      </div>
                  </div>
               </div>

               {/* Feature 2: Budgeting (Span 1) */}
               <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 md:p-12 overflow-hidden relative border border-gray-100 dark:border-gray-800 hover:shadow-2xl transition-all duration-500 group">
                   <div className="relative z-10">
                       <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center text-green-600 mb-6">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                       </div>
                       <h3 className="text-2xl font-bold mb-2 dark:text-white">Smart Budgets</h3>
                       <p className="text-gray-500 dark:text-gray-400">
                          Set limits and get notified before you overspend.
                       </p>
                   </div>
                   {/* Decorative Budget Bars */}
                   <div className="mt-8 relative group-hover:-translate-y-2 transition-transform duration-500">
                       <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
                          <div className="flex justify-between text-xs mb-2">
                             <span className="font-semibold dark:text-gray-300">Food & Dining</span>
                             <span className="text-red-500 font-medium">$450 / $500</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                             <div className="bg-red-500 h-full w-[90%]"></div>
                          </div>
                       </div>
                       <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 mt-3 opacity-60 scale-95 origin-top">
                           <div className="flex justify-between text-xs mb-2">
                             <span className="font-semibold dark:text-gray-300">Transport</span>
                           </div>
                           <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                             <div className="bg-green-500 h-full w-[40%]"></div>
                          </div>
                       </div>
                   </div>
               </div>

               {/* Feature 3: Gemini (Span 3 - Full Width) */}
               <div className="md:col-span-3 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[2.5rem] p-8 md:p-12 overflow-hidden relative text-white shadow-2xl shadow-indigo-500/20 group">
                    <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
                        <div>
                           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-medium mb-6">
                              <span className="animate-pulse">✨</span> Gemini Powered
                           </div>
                           <h3 className="text-3xl md:text-4xl font-bold mb-4">Personalized Financial Advisor</h3>
                           <p className="text-indigo-100 text-lg leading-relaxed max-w-xl">
                              TrackIt uses Google's Gemini to analyze your spending habits. It identifies trends, suggests savings, and helps you make smarter financial decisions every day.
                           </p>
                        </div>
                        
                        {/* Mock Chat Interface */}
                        <div className="relative transform group-hover:scale-[1.02] transition-transform duration-500">
                             <div className="absolute inset-0 bg-indigo-500/30 blur-3xl rounded-full"></div>
                             <div className="relative bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-2xl">
                                 <div className="flex items-start gap-4 mb-4">
                                     <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-lg shadow-lg">✨</div>
                                     <div className="bg-white/90 text-indigo-900 rounded-2xl rounded-tl-none p-4 text-sm font-medium shadow-md">
                                        I noticed you spent 15% less on dining out this week. Great job! 🍔
                                     </div>
                                 </div>
                                 <div className="flex items-start gap-4 justify-end">
                                     <div className="bg-indigo-600 text-white rounded-2xl rounded-tr-none p-4 text-sm font-medium shadow-md">
                                        Thanks! How much can I save if I keep this up?
                                     </div>
                                      <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold border border-white/30">
                                         JD
                                      </div>
                                 </div>
                                 <div className="mt-4 flex items-center gap-2 text-xs text-indigo-200 justify-center">
                                      <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span> Gemini is analyzing...
                                 </div>
                             </div>
                        </div>
                    </div>
               </div>
            </div>
          </div>
        </div>
      </main>

       <footer className="bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800 py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} TrackIt. Designed with precision.</p>
        </div>
      </footer>
    </div>
  );
};