import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, DollarSign, PieChart, ArrowDownRight, ArrowUpRight, Plus, ShoppingCart, Home, Zap, ShieldCheck, ArrowRight, X, Sparkles, Wallet, Calendar, Trash2, Pencil } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const FinanceScreen = () => {
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [transactionType, setTransactionType] = useState('expense');
   const [amount, setAmount] = useState('');
   const [category, setCategory] = useState('');
   const [note, setNote] = useState('');
   const [isGenerating, setIsGenerating] = useState(false);
   const [showSuccess, setShowSuccess] = useState(false);
   const [showAll, setShowAll] = useState(false);
   const [editingId, setEditingId] = useState(null);
   const [isReportOpen, setIsReportOpen] = useState(false);
   const [isTipsOpen, setIsTipsOpen] = useState(false);
   const [isDownloading, setIsDownloading] = useState(false);
   const [activeFilter, setActiveFilter] = useState('all');

   const budgetLimit = 40000;

   const budgetTips = [
      { id: 1, title: "The 50/30/20 Strategy", desc: "For a balanced life, sweetie, use 50% of income for needs (rent, bills), 30% for wants (dining, fun), and save 20% immediately for your bright future! 🌸", icon: PieChart, color: '#FDEEF1', text: '#D17B88' },
      { id: 2, title: "Automate Monthly Savings", desc: "Don't wait to save what's left! Set up a small automatic transfer on payday. Even 500-1000 rupees a month builds a beautiful habit over time. ✨", icon: Zap, color: '#F5F1FE', text: '#9079C1' },
      { id: 3, title: "Build an Emergency Fund", desc: "Life is full of surprises! Aim to keep 3 to 6 months of basic expenses in a 'Sakhi Fund'. It's your financial safety net for healthcare or sudden needs. 🏥", icon: Wallet, color: '#FFF9EE', text: '#CCAA3D' },
      { id: 4, title: "The 24-Hour Purchase Rule", desc: "Seen something pretty online? Wait 24 hours before buying! If you still want it tomorrow, it's a choice, not an impulse. Your bank balance will thank you! 🛍️", icon: CreditCard, color: '#FDEEF1', text: '#D17B88' }
   ];

   const [transactions, setTransactions] = useState(() => {
      try {
         const saved = localStorage.getItem('sakhiTransactions');
         if (saved) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed)) return parsed;
         }
      } catch (e) {
         console.error('SakhiTransactions Error:', e);
      }
      return [
         { id: 1, title: 'Grocery & Essentials', amount: 4200, date: 'Oct 15', type: 'expense', categoryId: 'food' },
         { id: 2, title: 'Rent & Utilities', amount: 15000, date: 'Oct 12', type: 'expense', categoryId: 'home' },
         { id: 3, title: 'Electricity Bill', amount: 1500, date: 'Oct 10', type: 'expense', categoryId: 'utility' },
         { id: 4, title: 'Insurance Premium', amount: 2500, date: 'Oct 08', type: 'expense', categoryId: 'health' },
      ];
   });

   useEffect(() => {
      localStorage.setItem('sakhiTransactions', JSON.stringify(transactions));
   }, [transactions]);

   const expenseCategories = [
      { id: 'food', label: 'Food & Dining', icon: ShoppingCart, color: '#FDEEF1', text: '#D17B88' },
      { id: 'home', label: 'Home & Rent', icon: Home, color: '#F5F1FE', text: '#9079C1' },
      { id: 'utility', label: 'Bills & Utilities', icon: Zap, color: '#FFF9EE', text: '#CCAA3D' },
      { id: 'health', label: 'Health & Wellness', icon: ShieldCheck, color: '#EBF7F2', text: '#3E8E75' },
      { id: 'others', label: 'Other Expenses', icon: Wallet, color: '#F8F9FA', text: '#6C757D' }
   ];

   const incomeCategories = [
      { id: 'salary', label: 'Monthly Salary', icon: Wallet, color: '#EBF7F2', text: '#3E8E75' },
      { id: 'bonus', label: 'Bonus / Gift', icon: Sparkles, color: '#FFF9EE', text: '#CCAA3D' },
      { id: 'other_income', label: 'Other Income', icon: Plus, color: '#F5F1FE', text: '#9079C1' }
   ];

   const categories = [...expenseCategories, ...incomeCategories];
   const currentCategories = transactionType === 'expense' ? expenseCategories : incomeCategories;

   const categoryMap = categories.reduce((acc, cat) => ({ ...acc, [cat.id]: cat }), {});

   const stats = React.useMemo(() => {
      const expenses = transactions.filter(t => t.type === 'expense');
      const totalExpenses = expenses.reduce((acc, t) => acc + t.amount, 0);
      const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
      const spentPercentage = Math.min(100, Math.round((totalExpenses / budgetLimit) * 100));
      const remaining = Math.max(0, budgetLimit - totalExpenses);
      
      const categorySpending = expenses.reduce((acc, curr) => {
         acc[curr.categoryId] = (acc[curr.categoryId] || 0) + curr.amount;
         return acc;
      }, {});

      return { totalExpenses, totalIncome, spentPercentage, remaining, categorySpending };
   }, [transactions]);

   const handleAddTransaction = (e) => {
      e.preventDefault();
      if (!amount || !category) return;

      if (editingId) {
         setTransactions(prev => prev.map(t => t.id === editingId ? {
            ...t,
            title: note || categoryMap[category].label,
            amount: parseFloat(amount),
            type: transactionType,
            categoryId: category
         } : t));
      } else {
         const newTransaction = {
            id: Date.now(),
            title: note || categoryMap[category].label,
            amount: parseFloat(amount),
            date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
            type: transactionType,
            categoryId: category
         };
         setTransactions(prev => [newTransaction, ...prev]);
      }

      setIsModalOpen(false);
      setEditingId(null);
      setAmount('');
      setCategory('');
      setNote('');
   };

   const openEditModal = (t) => {
      setTransactionType(t.type);
      setAmount(t.amount.toString());
      setCategory(t.categoryId);
      setNote(t.title === categoryMap[t.categoryId]?.label ? '' : t.title);
      setEditingId(t.id);
      setIsModalOpen(true);
   };

   const deleteTransaction = (id) => {
      setTransactions(prev => prev.filter(t => t.id !== id));
   };

   const handleGenerateReport = () => {
      setIsGenerating(true);
      setTimeout(() => {
         setIsGenerating(false);
         setIsReportOpen(true);
      }, 2000);
   };

   const handleDownloadPDF = () => {
      setIsDownloading(true);
      
      setTimeout(() => {
         try {
            const doc = new jsPDF();
            const timestamp = new Date().toLocaleString();

            // Header
            doc.setFontSize(22);
            doc.setTextColor(45, 21, 32); // #15192c
            doc.text("Home Budget Sakhi - Financial Report", 14, 22);
            
            doc.setFontSize(10);
            doc.setTextColor(196, 160, 172); // #C4A0AC
            doc.text(`Generated on: ${timestamp}`, 14, 30);

            // Summary Section
            doc.setFontSize(14);
            doc.setTextColor(45, 21, 32);
            doc.text("Executive Summary", 14, 45);

            const summaryData = [
               ["Monthly Budget", `INR ${budgetLimit.toLocaleString()}`],
               ["Total Expenses", `INR ${stats.totalExpenses.toLocaleString()}`],
               ["Total Income", `INR ${stats.totalIncome.toLocaleString()}`],
               ["Net Savings", `INR ${(stats.totalIncome - stats.totalExpenses).toLocaleString()}`],
               ["Budget Usage", `${stats.spentPercentage}%`]
            ];

            autoTable(doc, {
               startY: 50,
               head: [['Metric', 'Value']],
               body: summaryData,
               theme: 'striped',
               headStyles: { fillColor: [255, 105, 180] } // Hotpink
            });

            // Breakdown Section
            doc.text("Category Breakdown", 14, doc.lastAutoTable.finalY + 15);

            const categoryData = expenseCategories.map(cat => [
               cat.label,
               `INR ${(stats.categorySpending[cat.id] || 0).toLocaleString()}`
            ]);

            autoTable(doc, {
               startY: doc.lastAutoTable.finalY + 20,
               head: [['Category', 'Amount Spent']],
               body: categoryData,
               theme: 'grid',
               headStyles: { fillColor: [144, 121, 193] } // Lavender
            });

            // Recent Transactions
            doc.text("Recent Activity", 14, doc.lastAutoTable.finalY + 15);

            const transactionData = transactions.map(t => [
               t.date,
               t.title,
               categoryMap[t.categoryId]?.label || 'Other',
               t.type === 'expense' ? `-${t.amount}` : `+${t.amount}`
            ]);

            autoTable(doc, {
               startY: doc.lastAutoTable.finalY + 20,
               head: [['Date', 'Description', 'Category', 'Amount (INR)']],
               body: transactionData,
               theme: 'plain',
               headStyles: { fillColor: [45, 21, 32], textColor: [255, 255, 255] }
            });

            // Footer
            doc.setFontSize(8);
            doc.setTextColor(150);
            doc.text("A smart companion for your financial wellness. Powered by Health Sakhi.", 14, doc.internal.pageSize.height - 10);

            doc.save("Sakhi_Financial_Report.pdf");
            setIsDownloading(false);
         } catch (error) {
            console.error("PDF Export failed:", error);
            alert("Sorry! Failed to generate PDF. Check console for details.");
            setIsDownloading(false);
         }
      }, 1500);
   };

   const container = {
      hidden: { opacity: 0 },
      show: { opacity: 1, transition: { staggerChildren: 0.1 } }
   };

   const item = {
      hidden: { opacity: 0, y: 20 },
      show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
   };

   return (
      <>
         <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="w-full pb-20 px-4 pt-8"
         >
            <motion.section variants={item} className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
               <div className="space-y-1">
                  <h2 className="text-4xl font-black tracking-tight" style={{ color: '#15192c' }}>Home Budget Sakhi 🏠</h2>
                  <span className="text-[11px] font-black uppercase tracking-[0.3em]" style={{ color: '#C4A0AC' }}>Smart Financial Companion</span>
               </div>
               <button 
                  onClick={() => setIsModalOpen(true)}
                  className="px-8 py-4 bg-[#ff69b4] text-white rounded-[2rem] text-xs font-black uppercase tracking-widest shadow-xl flex items-center gap-3 hover:scale-105 transition-all group"
               >
                  <Sparkles size={18} className="group-hover:rotate-12 transition-transform" /> Add with Sakhi
               </button>
            </motion.section>

            <main className="grid grid-cols-1 lg:grid-cols-12 gap-10">
               <div className="lg:col-span-8 space-y-10">
                  {/* Budget Overview */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                     <motion.div variants={item} className="p-10 rounded-[3rem] bg-[#15192c] text-white relative overflow-hidden group shadow-2xl">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#ff69b4]/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#ff69b4] mb-4">Monthly Budget</p>
                        <h3 className="text-3xl font-black mb-10 tracking-tight">₹{budgetLimit.toLocaleString()}</h3>
                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden mb-4">
                           <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${stats.spentPercentage}%` }}
                              className="h-full bg-[#ff69b4] rounded-full"
                           ></motion.div>
                        </div>
                        <div className="flex justify-between text-[9px] font-black uppercase text-white/40">
                           <span>{stats.spentPercentage}% Spent</span>
                           <span>Remaining: ₹{stats.remaining.toLocaleString()}</span>
                        </div>
                     </motion.div>

                     <motion.div variants={item} className="p-10 rounded-[3rem] bg-white border border-[#F5E6EA] shadow-sm flex flex-col justify-between">
                        <div>
                           <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#C4A0AC] mb-4">Total Savings</p>
                           <h3 className="text-3xl font-black tracking-tight" style={{ color: '#15192c' }}>₹{(stats.totalIncome - stats.totalExpenses).toLocaleString()}</h3>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-black text-emerald-500 mt-6">
                           <ArrowUpRight size={16} /> Track your journey
                        </div>
                     </motion.div>
                  </div>

                  {/* Expense Categories */}
                  <motion.section variants={item}>
                     <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em]" style={{ color: '#C4A0AC' }}>Household Activity</h3>
                        <div className="flex bg-rose-50/50 p-1 rounded-full border border-rose-100">
                           {['all', 'expense', 'income'].map((f) => (
                              <button
                                 key={f}
                                 onClick={() => setActiveFilter(f)}
                                 className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${activeFilter === f ? 'bg-[#ff69b4] text-white shadow-md' : 'text-[#D17B88] hover:bg-rose-100/50'}`}
                              >
                                 {f}
                              </button>
                           ))}
                        </div>
                     </div>
                     <div className="bg-white rounded-[3rem] border border-[#F5E6EA] overflow-hidden shadow-sm">
                        <div className="p-8 space-y-2">
                           <AnimatePresence mode="popLayout">
                              {transactions
                                 .filter(t => activeFilter === 'all' || t.type === activeFilter)
                                 .slice(0, showAll ? transactions.length : 4)
                                 .map((t) => {
                                 const cat = categoryMap[t.categoryId] || categories[0];
                                 return (
                                    <motion.div 
                                       layout
                                       initial={{ opacity: 0, x: -10 }}
                                       animate={{ opacity: 1, x: 0 }}
                                       key={t.id} 
                                       className="flex items-center justify-between group cursor-pointer hover:bg-rose-50/30 p-4 rounded-2xl transition-all"
                                    >
                                       <div className="flex items-center gap-5">
                                          <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm" style={{ backgroundColor: cat.color, color: cat.text }}>
                                             <cat.icon size={22} />
                                          </div>
                                          <div>
                                             <h4 className="text-[13px] font-black" style={{ color: '#15192c' }}>{t.title}</h4>
                                             <span className="text-[9px] font-bold text-[#C4A0AC] uppercase">{t.date}</span>
                                          </div>
                                       </div>
                                       <div className="flex items-center gap-4">
                                          <div className="text-right">
                                             <p className={`text-sm font-black ${t.type === 'expense' ? 'text-rose-500' : 'text-emerald-500'}`}>
                                                {t.type === 'expense' ? '-' : '+'}₹{t.amount.toLocaleString()}
                                             </p>
                                             <span className="text-[8px] font-black uppercase text-[#C4A0AC]">{cat.label}</span>
                                          </div>
                                          <div className="flex items-center gap-2 transition-opacity">
                                             <button 
                                                onClick={(e) => { e.stopPropagation(); openEditModal(t); }} 
                                                className="p-2 bg-rose-50 text-rose-400 hover:bg-rose-500 hover:text-white rounded-full transition-colors"
                                             >
                                                <Pencil size={14} />
                                             </button>
                                             <button 
                                                onClick={(e) => { e.stopPropagation(); deleteTransaction(t.id); }} 
                                                className="p-2 bg-rose-50 text-rose-400 hover:bg-rose-500 hover:text-white rounded-full transition-colors"
                                             >
                                                <Trash2 size={14} />
                                             </button>
                                          </div>
                                       </div>
                                    </motion.div>
                                 );
                              })}
                           </AnimatePresence>
                        </div>
                        <div className="bg-rose-50/50 p-6 border-t border-[#F5E6EA] text-center">
                           <button 
                              onClick={() => setShowAll(!showAll)}
                              className="text-[10px] font-black uppercase tracking-widest text-[#ff69b4] hover:underline"
                           >
                              {showAll ? 'Show Recent Only' : 'View All Transactions'}
                           </button>
                        </div>
                     </div>
                  </motion.section>
               </div>

               <div className="lg:col-span-4 space-y-10">
                  {/* Insight Card */}
                  <motion.div variants={item} className="p-8 bg-white rounded-[3rem] border border-[#F5E6EA] shadow-sm">
                     <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#C4A0AC] mb-6">Spending Analysis</h3>
                     <div className="space-y-6">
                        {expenseCategories.map((cat, i) => {
                           const spent = stats.categorySpending[cat.id] || 0;
                           const percent = stats.totalExpenses > 0 ? Math.round((spent / stats.totalExpenses) * 100) : 0;
                           return (
                              <div key={i}>
                                 <div className="flex justify-between text-[11px] font-black mb-1">
                                    <span style={{ color: '#6B5E63' }}>{cat.label}</span>
                                    <span style={{ color: '#15192c' }}>₹{spent.toLocaleString()}</span>
                                 </div>
                                 <div className="h-1.5 w-full bg-rose-50 rounded-full overflow-hidden">
                                    <motion.div 
                                       initial={{ width: 0 }}
                                       animate={{ width: `${percent}%` }}
                                       className="h-full rounded-full" 
                                       style={{ backgroundColor: cat.text }}
                                    ></motion.div>
                                 </div>
                              </div>
                           );
                        })}
                     </div>
                     <button 
                        onClick={handleGenerateReport}
                        disabled={isGenerating}
                        className={`w-full py-4 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all mt-8 ${showSuccess ? 'bg-emerald-50 text-emerald-600' : 'bg-[#FDEEF1] text-[#D17B88] hover:brightness-95'}`}
                     >
                        {isGenerating ? (
                           <span className="flex items-center justify-center gap-2">
                              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                                 <Sparkles size={14} />
                               </motion.div>
                               Analyzing Data...
                           </span>
                        ) : showSuccess ? 'Report Generated! ✨' : 'Generate Monthly Report'}
                     </button>
                  </motion.div>

                  {/* Tip Card */}
                  <motion.div variants={item} className="p-10 rounded-[3.5rem] bg-gradient-to-br from-[#15192c] to-[#4A2535] text-white shadow-2xl relative overflow-hidden">
                     <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
                     <CreditCard size={32} className="text-[#ff69b4] mb-6" />
                     <h3 className="text-xl font-black mb-4 tracking-tight leading-tight">Save intelligently, spend mindfully.</h3>
                     <p className="text-[13px] text-white/50 mb-8 leading-relaxed font-medium italic">
                        "A small leak will sink a great ship. Track your small expenses."
                     </p>
                      <button 
                         onClick={() => setIsTipsOpen(true)}
                         className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#ff69b4] hover:brightness-110 transition-all"
                      >
                         Home Budget Tips <ArrowRight size={14} />
                      </button>
                  </motion.div>
               </div>
            </main>
         </motion.div>

         <AnimatePresence>
            {isModalOpen && (
               <div className="fixed inset-0 z-[200] flex items-start justify-center p-4 pt-24 overflow-y-auto no-scrollbar">
                  <motion.div
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     exit={{ opacity: 0 }}
                     onClick={() => setIsModalOpen(false)}
                     className="absolute inset-0 bg-[#15192c]/60 backdrop-blur-md"
                  />
                  <motion.div
                     initial={{ opacity: 0, scale: 0.9, y: 20 }}
                     animate={{ opacity: 1, scale: 1, y: 0 }}
                     exit={{ opacity: 0, scale: 0.9, y: 20 }}
                     className="relative w-full max-w-lg bg-white rounded-[3.5rem] shadow-2xl overflow-y-auto max-h-[95vh] no-scrollbar"
                  >
                     <div className="p-8 md:p-12">
                        <div className="flex items-center justify-between mb-10">
                           <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-2xl bg-[#FDEEF1] flex items-center justify-center text-[#ff69b4]">
                                 <Sparkles size={24} />
                              </div>
                              <h3 className="text-2xl font-black" style={{ color: '#15192c' }}>{editingId ? 'Update Transaction' : 'Log with Sakhi'}</h3>
                           </div>
                           <button 
                              onClick={() => {
                                 setIsModalOpen(false);
                                 setEditingId(null);
                                 setAmount('');
                                 setCategory('');
                                 setNote('');
                              }} 
                              className="w-10 h-10 rounded-full border border-[#F5E6EA] flex items-center justify-center text-[#C4A0AC] hover:bg-[#FDEEF1] hover:text-[#ff69b4] transition-all"
                           >
                              <X size={20} />
                           </button>
                        </div>

                        <form onSubmit={handleAddTransaction} className="space-y-8">
                           {/* Type Selector */}
                           <div className="flex bg-[#FDEEF1] p-1.5 rounded-[2rem]">
                              <button 
                                 type="button"
                                 onClick={() => setTransactionType('expense')}
                                 className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-[1.5rem] transition-all ${transactionType === 'expense' ? 'bg-white text-[#ff69b4] shadow-sm' : 'text-[#D17B88]'}`}
                              >
                                 Expense
                              </button>
                              <button 
                                 type="button"
                                 onClick={() => setTransactionType('income')}
                                 className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-[1.5rem] transition-all ${transactionType === 'income' ? 'bg-white text-[#ff69b4] shadow-sm' : 'text-[#D17B88]'}`}
                              >
                                 Income
                              </button>
                           </div>

                           {/* Amount Input */}
                           <div className="space-y-3">
                              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#C4A0AC] px-4">Amount (₹)</label>
                              <div className="relative">
                                 <div className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-black text-[#15192c]">₹</div>
                                 <input 
                                    autoFocus
                                    type="number" 
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="0,00"
                                    className="w-full bg-[#F5E6EA]/30 border-2 border-transparent focus:border-[#ff69b4]/20 rounded-[2rem] py-6 pl-12 pr-8 text-3xl font-black outline-none transition-all placeholder:opacity-20"
                                 />
                              </div>
                           </div>

                           {/* Category Selector */}
                           <div className="space-y-4">
                              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#C4A0AC] px-4">
                                 {transactionType === 'expense' ? 'Category' : 'Source'}
                              </label>
                              <div className="grid grid-cols-2 gap-4">
                                 {currentCategories.map((cat) => (
                                    <button 
                                       key={cat.id}
                                       type="button"
                                       onClick={() => setCategory(cat.id)}
                                       className={`p-4 rounded-2xl border-2 flex items-center gap-4 transition-all ${category === cat.id ? 'border-[#ff69b4] bg-[#ff69b4]/5' : 'border-[#F5E6EA] hover:border-[#ff69b4]/30'}`}
                                    >
                                       <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: cat.color, color: cat.text }}>
                                          <cat.icon size={18} />
                                       </div>
                                       <span className="text-[10px] font-black uppercase tracking-widest text-[#15192c]">{cat.label}</span>
                                    </button>
                                 ))}
                              </div>
                           </div>

                           {/* Note Input */}
                           <div className="space-y-3">
                              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#C4A0AC] px-4">Note (Optional)</label>
                              <input 
                                 type="text" 
                                 value={note}
                                 onChange={(e) => setNote(e.target.value)}
                                 placeholder="What was this for?"
                                 className="w-full bg-[#F5E6EA]/30 border-2 border-transparent focus:border-[#ff69b4]/20 rounded-[1.5rem] py-4 px-6 text-[12px] font-black outline-none transition-all"
                              />
                           </div>

                           {/* Submit Button */}
                           <button
                              type="submit"
                              disabled={!amount || !category}
                              className="w-full h-14 bg-gradient-to-r from-[#ff69b4] to-[#ff1493] text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:shadow-xl hover:shadow-rose-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:shadow-none"
                           >
                              {editingId ? 'Update' : 'Confirm'} Journey Item
                           </button>
                        </form>
                     </div>
                  </motion.div>
               </div>
            )}
         </AnimatePresence>

         {/* Monthly Report Modal */}
         <AnimatePresence>
            {isReportOpen && (
               <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                  <motion.div
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     exit={{ opacity: 0 }}
                     onClick={() => setIsReportOpen(false)}
                     className="absolute inset-0 bg-[#15192c]/80 backdrop-blur-xl"
                  />
                  <motion.div
                     initial={{ opacity: 0, scale: 0.9, y: 30 }}
                     animate={{ opacity: 1, scale: 1, y: 0 }}
                     exit={{ opacity: 0, scale: 0.9, y: 30 }}
                     className="relative w-full max-w-2xl bg-white rounded-[4rem] shadow-2xl overflow-y-auto max-h-[90vh] no-scrollbar overflow-hidden"
                  >
                     <div className="p-10 md:p-14">
                        <div className="flex items-center justify-between mb-12">
                           <div>
                              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#ff69b4] mb-2">Analysis Complete</p>
                              <h3 className="text-3xl font-black" style={{ color: '#15192c' }}>Monthly Report</h3>
                           </div>
                           <button 
                              onClick={() => setIsReportOpen(false)}
                              className="w-12 h-12 rounded-full border border-[#F5E6EA] flex items-center justify-center text-[#C4A0AC] hover:bg-[#FDEEF1] hover:text-[#ff69b4] transition-all"
                           >
                              <X size={24} />
                           </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                           <div className="p-8 rounded-[2.5rem] bg-[#FDEEF1] border border-white/50">
                              <p className="text-[9px] font-black uppercase tracking-widest text-[#D17B88] mb-4">Net Savings</p>
                              <h4 className="text-4xl font-black mb-2" style={{ color: '#15192c' }}>₹{(stats.totalIncome - stats.totalExpenses).toLocaleString()}</h4>
                              <p className="text-[11px] font-bold text-[#D17B88]">For October 2026</p>
                           </div>
                           <div className="p-8 rounded-[2.5rem] bg-[#F5F1FE] border border-white/50">
                              <p className="text-[9px] font-black uppercase tracking-widest text-[#9079C1] mb-4">Expenses</p>
                              <h4 className="text-4xl font-black mb-2" style={{ color: '#15192c' }}>₹{stats.totalExpenses.toLocaleString()}</h4>
                              <p className="text-[11px] font-bold text-[#9079C1]">{stats.spentPercentage}% of Budget used</p>
                           </div>
                        </div>

                        <div className="space-y-8 mb-12">
                           <h5 className="text-[10px] font-black uppercase tracking-widest text-[#C4A0AC]">Detailed Breakdown</h5>
                           <div className="space-y-6">
                              {expenseCategories.map((cat) => {
                                 const spent = stats.categorySpending[cat.id] || 0;
                                 const percent = stats.totalExpenses > 0 ? Math.round((spent / stats.totalExpenses) * 100) : 0;
                                 return (
                                    <div key={cat.id} className="flex items-center gap-6">
                                       <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0" style={{ backgroundColor: cat.color, color: cat.text }}>
                                          <cat.icon size={22} />
                                       </div>
                                       <div className="flex-1">
                                          <div className="flex justify-between text-xs font-black mb-2">
                                             <span style={{ color: '#15192c' }}>{cat.label}</span>
                                             <span style={{ color: '#6B5E63' }}>₹{spent.toLocaleString()} ({percent}%)</span>
                                          </div>
                                          <div className="h-2 w-full bg-rose-50 rounded-full overflow-hidden">
                                             <motion.div 
                                                initial={{ width: 0 }}
                                                animate={{ width: `${percent}%` }}
                                                className="h-full rounded-full" 
                                                style={{ backgroundColor: cat.text }}
                                             />
                                          </div>
                                       </div>
                                    </div>
                                 );
                              })}
                           </div>
                        </div>

                        <div className="p-10 rounded-[3rem] bg-[#15192c] text-white relative overflow-hidden">
                           <div className="absolute top-0 right-0 w-32 h-32 bg-[#ff69b4]/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
                           <div className="flex items-start gap-5 relative z-10">
                              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
                                 <Sparkles className="text-[#ff69b4]" size={24} />
                              </div>
                              <div>
                                 <p className="text-[10px] font-black uppercase tracking-widest text-[#ff69b4] mb-2">Sakhi's Insight</p>
                                 <p className="text-sm font-medium leading-relaxed opacity-80">
                                    {stats.spentPercentage > 80 
                                       ? "You've used most of your budget, sweetie. Let's try to focus on essential spending for the rest of the month! 🌸" 
                                       : "You're managing your budget wonderfully! You have plenty of room for your savings goals. Keep it up! ✨"}
                                 </p>
                              </div>
                           </div>
                        </div>

                        <button 
                           onClick={handleDownloadPDF}
                           disabled={isDownloading}
                           className="w-full py-6 bg-rose-50 text-[#ff69b4] rounded-[2rem] text-xs font-bold uppercase tracking-widest mt-10 hover:bg-rose-100 transition-all flex items-center justify-center gap-3"
                        >
                           {isDownloading ? (
                              <>
                                 <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                                    <Sparkles size={16} />
                                 </motion.div>
                                 Preparing PDF...
                              </>
                           ) : (
                              'Download PDF Report'
                           )}
                        </button>
                     </div>
                  </motion.div>
               </div>
            )}
         </AnimatePresence>

         {/* Home Budget Tips Modal */}
         <AnimatePresence>
            {isTipsOpen && (
               <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                  <motion.div
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     exit={{ opacity: 0 }}
                     onClick={() => setIsTipsOpen(false)}
                     className="absolute inset-0 bg-[#15192c]/80 backdrop-blur-xl"
                  />
                  <motion.div
                     initial={{ opacity: 0, scale: 0.9, y: 30 }}
                     animate={{ opacity: 1, scale: 1, y: 0 }}
                     exit={{ opacity: 0, scale: 0.9, y: 30 }}
                     className="relative w-full max-w-lg bg-white rounded-[4rem] shadow-2xl overflow-y-auto max-h-[90vh] no-scrollbar"
                  >
                     <div className="p-10 md:p-14">
                        <div className="flex items-center justify-between mb-10">
                           <div>
                              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#ff69b4] mb-2">Smart Habits</p>
                              <h3 className="text-3xl font-black" style={{ color: '#15192c' }}>Sakhi's Budget Tips</h3>
                           </div>
                           <button 
                              onClick={() => setIsTipsOpen(false)}
                              className="w-12 h-12 rounded-full border border-[#F5E6EA] flex items-center justify-center text-[#C4A0AC] hover:bg-[#FDEEF1] hover:text-[#ff69b4] transition-all"
                           >
                              <X size={24} />
                           </button>
                        </div>

                        <div className="space-y-6">
                           {budgetTips.map((tip) => (
                              <motion.div 
                                 key={tip.id}
                                 whileHover={{ x: 5 }}
                                 className="flex items-start gap-5 p-6 rounded-3xl bg-rose-50/30 border border-transparent hover:border-plum-border transition-all"
                              >
                                 <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0" style={{ backgroundColor: tip.color, color: tip.text }}>
                                    <tip.icon size={22} />
                                 </div>
                                 <div>
                                    <h4 className="text-sm font-black mb-1" style={{ color: '#15192c' }}>{tip.title}</h4>
                                    <p className="text-[12px] leading-relaxed text-[#6B5E63] font-medium opacity-80">{tip.desc}</p>
                                 </div>
                              </motion.div>
                           ))}
                        </div>

                        <button 
                           onClick={() => setIsTipsOpen(false)}
                           className="w-full py-6 bg-[#15192c] text-white rounded-[2rem] text-xs font-black uppercase tracking-[0.3em] shadow-2xl mt-10 hover:brightness-110 transition-all"
                        >
                           Got it, Sakhi! 💖
                        </button>
                     </div>
                  </motion.div>
               </div>
            )}
         </AnimatePresence>
      </>
   );
};

export default FinanceScreen;
