import React from 'react';
import { DollarSign, ArrowUpRight, TrendingUp, Calendar, ArrowRight, CreditCard, Download, Activity } from 'lucide-react';

const AdvisorEarningsScreen = () => {
  const transactions = [
    { id: 'TXN-001', date: 'Oct 12, 2023', user: 'Ananya Iyer', amount: '₹750', status: 'Settled' },
    { id: 'TXN-002', date: 'Oct 11, 2023', user: 'Sneha Patel', amount: '₹750', status: 'Settled' },
    { id: 'TXN-003', date: 'Oct 10, 2023', user: 'Ritu Verma', amount: '₹1200', status: 'Pending' },
    { id: 'TXN-004', date: 'Oct 09, 2023', user: 'Kavita Singh', amount: '₹750', status: 'Settled' },
  ];

  return (
    <div className="space-y-6 font-sans pb-16">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Financial Hub</h1>
          <p className="text-slate-500 text-sm font-medium">Tracking your impact and consultation rewards.</p>
        </div>
        <div className="flex gap-2">
           <button className="px-5 py-2.5 bg-white border border-black/5 text-slate-700 font-bold rounded-xl text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-sm">
             <Download size={16} /> Statements
           </button>
           <button className="px-5 py-2.5 bg-health-dark text-white font-black rounded-xl text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-xl shadow-slate-900/20">
             Request Payout
           </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Unpaid Balance', val: '₹14,200', icon: CreditCard, color: 'text-blue-500', bg: 'bg-blue-50' },
          { label: 'Total Earned', val: '₹1,54,800', icon: DollarSign, color: 'text-health-green', bg: 'bg-green-50' },
          { label: 'This Month', val: '₹22,400', icon: TrendingUp, color: 'text-orange-500', bg: 'bg-orange-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-[1.75rem] border border-black/5 shadow-sm relative overflow-hidden group">
            <div className={`w-11 h-11 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 duration-500`}>
               <stat.icon size={22} />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="text-2xl font-black text-slate-900 tracking-tight">{stat.val}</p>
            <div className="mt-3 flex items-center gap-2 text-green-500 text-[10px] font-bold uppercase tracking-widest">
               <ArrowUpRight size={14} /> +15.5% growth
            </div>
            {/* Background pattern */}
            <Activity className="absolute -bottom-4 -right-4 size-24 opacity-[0.03] -rotate-12" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Table */}
        <div className="lg:col-span-2 space-y-4">
           <div className="flex items-center justify-between px-2">
              <h2 className="text-lg font-black text-slate-800 tracking-tight">Recent Sessions</h2>
              <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                 <Calendar size={14} /> Last 30 Days
              </div>
           </div>
           
           <div className="bg-white rounded-[2rem] border border-black/5 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-black tracking-widest border-b border-black/5">
                       <tr>
                          <th className="px-4 py-4">Session Details</th>
                          <th className="px-4 py-4">User</th>
                          <th className="px-4 py-4">Amount</th>
                          <th className="px-4 py-4">Status</th>
                          <th className="px-4 py-4"></th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-black/5 text-sm">
                       {transactions.map(txn => (
                          <tr key={txn.id} className="hover:bg-slate-50/50 transition-colors group">
                             <td className="px-4 py-4">
                                <p className="font-bold text-slate-800">{txn.id}</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{txn.date}</p>
                             </td>
                             <td className="px-4 py-4">
                                <div className="flex items-center gap-3">
                                   <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400">AI</div>
                                   <span className="font-bold text-slate-600 tracking-tight">{txn.user}</span>
                                </div>
                             </td>
                             <td className="px-4 py-4">
                                <span className="font-black text-slate-900">{txn.amount}</span>
                             </td>
                             <td className="px-4 py-4">
                                <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                   txn.status === 'Settled' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
                                }`}>
                                   {txn.status}
                                </span>
                             </td>
                             <td className="px-4 py-4 text-right">
                                <button className="p-2 text-slate-300 group-hover:text-health-green transition-colors">
                                   <ArrowRight size={18} />
                                </button>
                             </td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>
        </div>

        {/* Sidebar Goal Tracking */}
        <div className="space-y-4">
           <h2 className="text-base font-black text-slate-800 tracking-tight px-2">Rewards Progress</h2>
           <div className="bg-slate-900 text-white rounded-[1.75rem] p-5 relative overflow-hidden shadow-2xl shadow-slate-900/40">
              <div className="relative z-10 space-y-4">
                 <div className="space-y-2">
                    <p className="text-[10px] font-black text-health-green uppercase tracking-widest">Monthly Bonus Goal</p>
                    <h3 className="text-lg font-black tracking-tight leading-tight">₹14,200 <span className="text-white/40 text-sm font-bold">/ ₹20,000</span></h3>
                 </div>
                 <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-health-green shadow-[0_0_15px_rgba(107,203,119,0.5)]" style={{ width: '71%' }}></div>
                 </div>
                 <p className="text-xs text-white/50 leading-relaxed font-medium">
                    You're only 8 sessions away from unlocking your <span className="text-health-green font-bold">Performance Milestone Bonus</span> for October. Keep it up, Doctor!
                 </p>
                 <button className="w-full py-3 bg-white/10 border border-white/10 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-white/20 transition-all">
                    View Bonus Rules
                 </button>
              </div>
              {/* Background Glow */}
              <div className="absolute top-0 right-0 w-28 h-28 bg-health-green/10 rounded-full blur-[60px] translate-x-1/2 -translate-y-1/2"></div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdvisorEarningsScreen;
