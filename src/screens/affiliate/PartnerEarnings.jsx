import React from 'react';
import { DollarSign, Wallet, ArrowUpRight, Calendar, Download, TrendingUp, CheckCircle2, Clock, X, ShieldCheck, Building, Smartphone, Info, Share2, FileText, Check, Activity } from 'lucide-react';

const PartnerEarnings = () => {
   const [showPayoutModal, setShowPayoutModal] = React.useState(false);
   const [isExporting, setIsExporting] = React.useState(false);
   const [payoutMethod, setPayoutMethod] = React.useState('Bank');
   const [dateRange, setDateRange] = React.useState({ from: '', to: '' });

   const allEarnings = [
      { id: 'PAY-901', date: '2024-01-05', amount: '₹18,200', type: 'Monthly Commission', status: 'Processing' },
      { id: 'PAY-821', date: '2023-10-01', amount: '₹14,800', type: 'Monthly Commission', status: 'Paid' },
      { id: 'PAY-742', date: '2023-09-01', amount: '₹12,400', type: 'Monthly Commission', status: 'Paid' },
      { id: 'PAY-290', date: '2023-08-15', amount: '₹4,200', type: 'Bonus Incentive', status: 'Paid' },
   ];

   const earnings = allEarnings.filter(e => {
      if (!dateRange.from && !dateRange.to) return true;
      const targetDate = new Date(e.date);
      const from = dateRange.from ? new Date(dateRange.from) : null;
      const to = dateRange.to ? new Date(dateRange.to) : null;
      if (from && targetDate < from) return false;
      if (to && targetDate > to) return false;
      return true;
   });

   const handleExport = () => {
      setIsExporting(true);

      // Simulate generation delay
      setTimeout(() => {
         // 1. Create CSV content from current filtered earnings
         const headers = ["Reference ID", "Date", "Amount", "Type", "Status"];
         const rows = earnings.map(e => [e.id, e.date, e.amount.replace('₹', ''), e.type, e.status]);
         const csvContent = [headers, ...rows].map(r => r.join(",")).join("\n");

         // 2. Create Blob and trigger download
         const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
         const url = URL.createObjectURL(blob);
         const link = document.createElement("a");
         const date = new Date().toISOString().split('T')[0];

         link.setAttribute("href", url);
         link.setAttribute("download", `HS_Statement_${date}.csv`);
         link.style.visibility = 'hidden';
         document.body.appendChild(link);
         link.click();
         document.body.removeChild(link);

         setIsExporting(false);
      }, 1500);
   };

   return (
      <div className="space-y-10 font-sans pb-20">
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
               <h1 className="text-2xl font-black text-slate-800 tracking-tight">Earnings Console</h1>
               <p className="text-sm text-slate-500 font-medium">Detailed breakdown of your commission and referral rewards.</p>
            </div>
            <button onClick={handleExport} disabled={isExporting} className="px-6 py-3 bg-slate-900 text-white font-black rounded-xl text-[10px] uppercase tracking-[0.2em] flex items-center gap-2 shadow-2xl shadow-slate-900/20 hover:bg-black transition-all disabled:opacity-50">
               {isExporting ? <Clock size={16} className="animate-spin" /> : <Download size={16} />}
               {isExporting ? 'Generating Statement...' : 'Export Statement'}
            </button>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[
               { label: 'Pending Payout', val: '₹8,420', icon: Clock, color: 'text-orange-500', bg: 'bg-orange-50' },
               { label: 'Total Commission', val: '₹1,42,800', icon: DollarSign, color: 'text-health-green', bg: 'bg-green-50' },
               { label: 'Bonus Rewards', val: '₹12,000', icon: TrendingUp, color: 'text-blue-500', bg: 'bg-blue-50' },
            ].map((stat, i) => (
               <div key={i} className="bg-white p-6 rounded-[2rem] border border-black/5 shadow-sm relative overflow-hidden group">
                  <div className={`w-10 h-10 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
                     <stat.icon size={20} />
                  </div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                  <p className="text-xl font-black text-slate-900 tracking-tight">{stat.val}</p>
                  <div className="mt-3 flex items-center gap-2 text-green-500 text-[10px] font-black uppercase tracking-widest">
                     <ArrowUpRight size={14} /> +8.2% vs last month
                  </div>
               </div>
            ))}
         </div>

         <div className="bg-white rounded-[2.5rem] border border-black/5 shadow-sm overflow-hidden min-h-[300px]">
            <div className="p-6 border-b border-black/5 flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-slate-50/20">
               <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="space-y-1">
                     <h2 className="text-lg font-black text-slate-800 tracking-tight">Commission History</h2>
                     <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        <Activity size={14} className="text-health-green" /> Live Ledger Verification
                     </div>
                  </div>
                  <div className="h-10 w-px bg-black/5 hidden sm:block"></div>
                  <div className="flex flex-wrap items-center gap-3">
                     <div className="relative group">
                        <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-health-green transition-colors" />
                        <input type="date" value={dateRange.from} onChange={e => setDateRange({ ...dateRange, from: e.target.value })} className="h-9 pl-9 pr-3 bg-white border border-black/5 rounded-lg text-[10px] font-black uppercase tracking-widest outline-none focus:border-health-green focus:ring-4 focus:ring-health-green/5 transition-all w-36" />
                     </div>
                     <span className="text-[10px] font-black text-slate-300">TO</span>
                     <div className="relative group">
                        <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-health-green transition-colors" />
                        <input type="date" value={dateRange.to} onChange={e => setDateRange({ ...dateRange, to: e.target.value })} className="h-9 pl-9 pr-3 bg-white border border-black/5 rounded-lg text-[10px] font-black uppercase tracking-widest outline-none focus:border-health-green focus:ring-4 focus:ring-health-green/5 transition-all w-36" />
                     </div>
                     {(dateRange.from || dateRange.to) && (
                        <button onClick={() => setDateRange({ from: '', to: '' })} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-all" title="Reset Filters"><X size={16} /></button>
                     )}
                  </div>
               </div>
            </div>
            <div className="overflow-x-auto">
               <table className="w-full text-left">
                  <thead className="bg-[#fdfdfd] text-slate-400 text-[10px] uppercase font-black tracking-widest border-b border-black/5">
                     <tr>
                        <th className="px-6 py-4">Reference ID</th>
                        <th className="px-6 py-4">Execution Date</th>
                        <th className="px-6 py-4">Revenue Node</th>
                        <th className="px-6 py-4">Allocation Type</th>
                        <th className="px-6 py-4">Transmission Status</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5 text-sm">
                     {earnings.length > 0 ? earnings.map(pay => (
                        <tr key={pay.id} className="hover:bg-slate-50/80 transition-all duration-300 group">
                           <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                 <div className="w-6 h-6 bg-slate-100 rounded-md flex items-center justify-center font-black text-slate-400 text-[10px] group-hover:bg-slate-900 group-hover:text-white transition-colors">{pay.id.substring(4)}</div>
                                 <span className="text-sm font-black text-slate-800 tracking-tight font-mono">{pay.id}</span>
                              </div>
                           </td>
                           <td className="px-6 py-4 text-sm font-bold text-slate-500">{new Date(pay.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                           <td className="px-6 py-4 font-black text-slate-900 text-base">{pay.amount}</td>
                           <td className="px-6 py-4">
                              <span className="px-3 py-1 bg-blue-50 text-blue-500 rounded-md text-[10px] font-black uppercase tracking-widest">{pay.type}</span>
                           </td>
                           <td className="px-6 py-4">
                              <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${pay.status === 'Paid' ? 'bg-emerald-50 text-health-green border-emerald-100' : 'bg-orange-50 text-orange-500 border-orange-100'
                                 }`}>
                                 <div className={`w-1 h-1 rounded-full ${pay.status === 'Paid' ? 'bg-health-green' : 'bg-orange-500 animate-pulse'}`}></div>
                                 {pay.status}
                              </div>
                           </td>
                        </tr>
                     )) : (
                        <tr><td colSpan={5} className="px-6 py-20 text-center text-[10px] font-black text-slate-300 uppercase tracking-widest">No data for selected cycle</td></tr>
                     )}
                  </tbody>
               </table>
            </div>
         </div>

         <div className="bg-health-dark text-white p-8 rounded-[2rem] relative overflow-hidden shadow-2xl shadow-black/20">
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
               <div className="space-y-4">
                  <h2 className="text-2xl font-black tracking-tight leading-tight">Need your funds faster?</h2>
                  <p className="text-sm text-white/60 font-medium leading-relaxed max-w-sm">
                     Set up "Instant Payouts" to receive your commission directly to your bank account within 24 hours of every successful referral.
                  </p>
                  <button onClick={() => setShowPayoutModal(true)} className="px-6 py-3 bg-health-green text-white font-black rounded-xl text-[10px] uppercase tracking-widest shadow-xl shadow-health-green/20 hover:brightness-110 active:scale-95 transition-all">
                     Configure Instant Payout
                  </button>
               </div>
               <div className="flex justify-center md:justify-end">
                  <div className="w-40 h-28 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md relative group">
                     <Wallet size={48} className="text-health-green opacity-40 group-hover:scale-110 transition-transform duration-700" />
                     <div className="absolute top-4 left-4 w-2 h-2 rounded-full bg-health-green animate-pulse"></div>
                  </div>
               </div>
            </div>
            {/* Background pattern */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-health-green/5 rounded-full blur-[80px] translate-x-1/2 -translate-y-1/2"></div>
         </div>
         {/* Payout Configuration Modal */}
         {showPayoutModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300">
               <div className="bg-white rounded-[2rem] w-full max-w-md p-8 relative shadow-2xl animate-in zoom-in-95 duration-500 overflow-hidden">
                  <button onClick={() => setShowPayoutModal(false)} className="absolute top-6 right-6 text-slate-300 hover:text-slate-900 transition-colors"><X size={20} /></button>

                  <div className="flex items-center gap-4 mb-6">
                     <div className="w-12 h-12 bg-health-green text-white rounded-xl flex items-center justify-center shadow-lg shadow-health-green/20"><Wallet size={20} /></div>
                     <div>
                        <h3 className="text-xl font-black text-slate-900 tracking-tight leading-none">Instant Settlement</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Configure your payout engine</p>
                     </div>
                  </div>

                  <div className="space-y-5">
                     <div className="flex gap-2 p-1.5 bg-slate-50 border border-black/5 rounded-2xl">
                        {['Bank', 'UPI'].map(m => (
                           <button key={m} onClick={() => setPayoutMethod(m)} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all font-black text-[10px] uppercase tracking-widest ${payoutMethod === m ? 'bg-white text-slate-900 shadow-md border border-black/5' : 'text-slate-400 hover:text-slate-600'}`}>
                              {m === 'Bank' ? <Building size={14} /> : <Smartphone size={14} />} {m}
                           </button>
                        ))}
                     </div>

                     {payoutMethod === 'Bank' ? (
                        <div className="space-y-4 animate-in slide-in-from-bottom-2 duration-300">
                           <div className="space-y-1.5">
                              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Account Holder Name</label>
                              <input type="text" className="w-full h-11 px-4 bg-slate-50 border border-black/5 rounded-xl font-bold text-xs outline-none focus:bg-white focus:border-health-green" placeholder="e.g. Priya" />
                           </div>
                           <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-1.5">
                                 <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Account Type</label>
                                 <select className="w-full h-11 px-4 bg-slate-50 border border-black/5 rounded-xl font-bold text-xs outline-none appearance-none cursor-pointer">
                                    <option>Savings</option>
                                    <option>Current</option>
                                 </select>
                              </div>
                              <div className="space-y-1.5">
                                 <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">IFSC Code</label>
                                 <input type="text" className="w-full h-11 px-4 bg-slate-50 border border-black/5 rounded-xl font-bold text-xs outline-none focus:bg-white focus:border-health-green" placeholder="HDFC000123" />
                              </div>
                           </div>
                        </div>
                     ) : (
                        <div className="space-y-4 animate-in slide-in-from-bottom-2 duration-300">
                           <div className="space-y-1.5">
                              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Virtual Private Address (UPI ID)</label>
                              <input type="text" className="w-full h-11 px-4 bg-slate-50 border border-black/5 rounded-xl font-bold text-xs outline-none focus:bg-white focus:border-health-green" placeholder="@okhdfcbank" />
                           </div>
                        </div>
                     )}

                     <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100 flex items-start gap-3">
                        <ShieldCheck size={16} className="text-blue-500 flex-shrink-0 mt-0.5" />
                        <p className="text-[9px] font-bold text-blue-600 leading-relaxed uppercase tracking-widest">Payouts are processed instantly. Ensure all node address data is verified to avoid transmission failure.</p>
                     </div>
                  </div>

                  <div className="flex gap-4 mt-6">
                     <button onClick={() => setShowPayoutModal(false)} className="flex-1 py-3.5 bg-slate-900 text-white font-black rounded-xl text-[10px] uppercase tracking-widest hover:bg-black transition-all">Enable Action</button>
                     <button onClick={() => setShowPayoutModal(false)} className="px-6 py-3.5 bg-slate-100 text-slate-400 font-black rounded-xl text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all">Abort</button>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
};

export default PartnerEarnings;
