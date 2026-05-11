import React from 'react';
import { 
  Users, DollarSign, TrendingUp, Video, BookOpen, Clock, 
  PlusCircle, UserCheck, AlertCircle, Sparkles, ArrowRight,
  ShieldCheck, MessageSquare, Briefcase
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, change, icon: Icon, color, onClick }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    onClick={onClick}
    className="bg-white p-6 rounded-[2rem] border shadow-sm cursor-pointer group" 
    style={{ borderColor: '#F5E6EA' }}
  >
    <div className="flex items-center justify-between mb-4">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform`} style={{ background: color }}>
        <Icon size={22} />
      </div>
      <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${change.startsWith('+') ? 'bg-[#FDEEF1] text-[#ff69b4]' : 'bg-red-50 text-red-500'}`}>{change}</span>
    </div>
    <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-2" style={{ color: '#C4A0AC' }}>{title}</h3>
    <p className="text-2xl font-black tracking-tight" style={{ color: '#15192c' }}>{value}</p>
  </motion.div>
);

const AdminDashboard = () => {
  const navigate = useNavigate();

  // ── Charts Logic ────────────────────────────────────────────────────────────
  const barData = [
    { month: 'Jan', users: 3200 }, { month: 'Feb', users: 4100 }, { month: 'Mar', users: 3800 },
    { month: 'Apr', users: 6200 }, { month: 'May', users: 5400 }, { month: 'Jun', users: 7100 },
    { month: 'Jul', users: 5900 }, { month: 'Aug', users: 8300 }, { month: 'Sep', users: 9100 },
    { month: 'Oct', users: 10400 }, { month: 'Nov', users: 9700 }, { month: 'Dec', users: 12482 },
  ];
  const maxUsers = Math.max(...barData.map(d => d.users));

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20">

      {/* ── Quick Action Header ── */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-6">
         <div>
            <h1 className="text-3xl font-black tracking-tight text-[#15192c]">Admin Command Center</h1>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C4A0AC] mt-1">Managing the HealthSakhi Ecosystem</p>
         </div>
         <div className="flex gap-4">
            <button onClick={() => navigate('/admin/content')} className="px-6 py-4 bg-[#15192c] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center gap-2 hover:bg-[#ff69b4] transition-all">
               <PlusCircle size={16} /> New Content
            </button>
            <button onClick={() => navigate('/admin/advisors')} className="px-6 py-4 bg-white border border-[#F5E6EA] text-[#15192c] rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-sm flex items-center gap-2 hover:border-[#ff69b4] transition-all">
               <UserCheck size={16} /> Verify Advisors
            </button>
         </div>
      </section>

      {/* ── Core Stats ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard onClick={() => navigate('/admin/users')} title="Total Users" value="12,482" change="+12.5%" icon={Users} color="#15192c" />
        <StatCard onClick={() => navigate('/admin/analytics')} title="Paid Users" value="4,215" change="+8.2%" icon={TrendingUp} color="#ff69b4" />
        <StatCard onClick={() => navigate('/admin/payments')} title="Total Revenue" value="₹3,79,250" change="+15.3%" icon={DollarSign} color="#ff69b4" />
        <StatCard onClick={() => navigate('/admin/analytics')} title="Active Now" value="156" change="-2.1%" icon={Clock} color="#C4A0AC" />
      </div>

      {/* ── Middle Layer: Growth & Advisor Status ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* User Growth Bar Chart */}
        <div className="lg:col-span-8 bg-white p-10 rounded-[3rem] border border-[#F5E6EA] shadow-sm relative overflow-hidden">
           <div className="flex items-center justify-between mb-12 relative z-10">
              <div>
                <h3 className="text-2xl font-black tracking-tight text-[#15192c]">User Growth</h3>
                <p className="text-[10px] font-bold uppercase tracking-widest mt-1 text-[#C4A0AC]">2026 Registration Velocity</p>
              </div>
              <select className="bg-rose-50/50 border-none rounded-xl px-4 py-2 text-[9px] font-black uppercase outline-none text-[#ff69b4] cursor-pointer">
                 <option>Last 12 Months</option>
                 <option>Last 30 Days</option>
              </select>
           </div>
           
           <div className="relative h-[250px] w-full">
              {/* Subtle Horizontal Grid Lines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-50">
                 {[1, 2, 3, 4, 5].map(i => (
                   <div key={i} className="w-full border-t border-rose-50/80 h-0" />
                 ))}
              </div>

              {/* Bars Container */}
              <div className="absolute inset-0 flex items-end justify-between px-2 gap-3 md:gap-5">
                {barData.map((d, i) => {
                  const heightPct = (d.users / maxUsers) * 100;
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center h-full group relative">
                       <div className="w-full h-full flex items-end">
                          <motion.div 
                            initial={{ height: 0 }}
                            animate={{ height: `${heightPct}%` }}
                            transition={{ duration: 1, delay: i * 0.05 }}
                            className="w-full bg-[#ff69b4] rounded-t-lg group-hover:brightness-105 transition-all cursor-pointer relative shadow-sm"
                          >
                             {/* Tooltip on Hover */}
                             <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-[#15192c] text-white text-[8px] font-bold px-1.5 py-0.5 rounded pointer-events-none whitespace-nowrap z-20">
                                {d.users.toLocaleString()} users
                             </div>
                          </motion.div>
                       </div>
                       <span className="text-[9px] font-black uppercase text-[#C4A0AC] mt-3 group-hover:text-[#ff69b4] transition-colors">{d.month.charAt(0)}</span>
                    </div>
                  );
                })}
              </div>
           </div>
        </div>

        {/* Advisor Status */}
        <div className="lg:col-span-4 space-y-8">
           <div className="bg-[#15192c] p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#ff69b4]/10 rounded-full blur-2xl -mr-12 -mt-12" />
              <div className="flex items-center justify-between mb-6">
                 <h3 className="text-[10px] font-black uppercase tracking-widest text-[#ff69b4]">Advisor Pulse</h3>
                 <div className="flex items-center gap-1.5 text-[8px] font-bold text-emerald-400">
                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                    Online
                 </div>
              </div>
              <div className="space-y-6 relative z-10">
                 <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-white/60">Active Doctors</span>
                    <span className="text-lg font-black">24</span>
                 </div>
                 <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-white/60">Pending Approvals</span>
                    <span className="text-lg font-black text-[#ff69b4]">08</span>
                 </div>
                 <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-white/60">Avg. Response Time</span>
                    <span className="text-lg font-black">12m</span>
                 </div>
              </div>
              <button onClick={() => navigate('/admin/advisors')} className="w-full mt-8 py-4 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all">Manage Roles</button>
           </div>

           <div className="bg-white p-8 rounded-[3rem] border border-[#F5E6EA] shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                 <ShieldCheck size={18} className="text-[#ff69b4]" />
                 <h3 className="text-[10px] font-black uppercase tracking-widest text-[#15192c]">System Health</h3>
              </div>
              <div className="space-y-4">
                 <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#C4A0AC]">API Latency</span>
                    <span className="text-[10px] font-black text-emerald-600">45ms</span>
                 </div>
                 <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#C4A0AC]">Storage Flow</span>
                    <span className="text-[10px] font-black text-[#15192c]">65%</span>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* ── Lower Layer ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         <div className="lg:col-span-7 bg-white p-8 rounded-[3rem] border border-[#F5E6EA] shadow-sm">
            <h3 className="text-xl font-black tracking-tight text-[#15192c] mb-8">Engagement Nodes</h3>
            <div className="space-y-5">
               {[
                 { label: 'Hormonal Mastery', type: 'Video', views: '2.5k', color: '#ff69b4', pct: 95 },
                 { label: 'PCOD Bible Vol 1', type: 'Book', views: '1.8k', color: '#C4A0AC', pct: 70 },
                 { label: 'Sakhi Chatbot Usage', type: 'System', views: '1.2k', color: '#15192c', pct: 45 }
               ].map((item, i) => (
                 <div key={i} className="p-5 bg-rose-50/20 rounded-2xl border border-[#F5E6EA] flex items-center gap-6 group hover:shadow-md transition-all">
                    <div className="w-12 h-12 rounded-xl bg-white border border-[#F5E6EA] flex items-center justify-center text-[#ff69b4] shadow-sm">
                       {item.type === 'Video' ? <Video size={18} /> : item.type === 'Book' ? <BookOpen size={18} /> : <Sparkles size={18} />}
                    </div>
                    <div className="flex-1">
                       <div className="flex justify-between items-center mb-2">
                          <p className="text-sm font-black text-[#15192c]">{item.label}</p>
                          <span className="text-[9px] font-black uppercase text-[#C4A0AC]">{item.views} Interactions</span>
                       </div>
                       <div className="h-1.5 w-full bg-white rounded-full border border-[#F5E6EA] overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${item.pct}%` }} className="h-full rounded-full" style={{ background: item.color }} />
                       </div>
                    </div>
                 </div>
               ))}
            </div>
         </div>

         <div className="lg:col-span-5 bg-white p-8 rounded-[3rem] border border-[#F5E6EA] shadow-sm flex flex-col">
            <div className="flex items-center gap-3 mb-8">
               <div className="w-10 h-10 rounded-2xl bg-rose-50 flex items-center justify-center text-[#ff69b4]"><Sparkles size={20} /></div>
               <h3 className="text-xl font-black tracking-tight text-[#15192c]">Sakhi Pulse Monitor</h3>
            </div>
            <div className="space-y-4 flex-1">
               {[
                 { q: "How to handle PCOD stress?", count: 156 },
                 { q: "Best yoga for period pain?", count: 89 },
                 { q: "Understanding ovulation cycle", count: 42 }
               ].map((item, i) => (
                 <div key={i} className="flex items-center justify-between p-4 bg-rose-50/10 rounded-2xl">
                    <div className="flex items-center gap-3">
                       <MessageSquare size={14} className="text-[#C4A0AC]" />
                       <span className="text-xs font-bold text-[#15192c]">{item.q}</span>
                    </div>
                    <span className="text-[10px] font-black text-[#ff69b4]">{item.count}</span>
                 </div>
               ))}
            </div>
            <button onClick={() => navigate('/admin/sakhi-cms')} className="w-full mt-6 py-4 bg-white border border-[#F5E6EA] rounded-2xl text-[9px] font-black uppercase tracking-widest text-[#C4A0AC] hover:text-[#ff69b4] hover:border-[#ff69b4] transition-all flex items-center justify-center gap-2">
               Full Training Data <ArrowRight size={14} />
            </button>
         </div>
      </div>

    </div>
  );
};

export default AdminDashboard;
