import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, ChevronRight, Users, DollarSign, Clock, TrendingUp, 
  CheckCircle, Video, Phone, Mic, MicOff, VideoOff, PhoneOff, 
  Maximize2, MessageSquare, Signal, Settings, X, Shield, Sparkles,
  Activity, Droplets, Heart, ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getCallEvents } from '../../data/advisorFlow';

const AdvisorDashboard = () => {
   const navigate = useNavigate();
   const [activeTab, setActiveTab] = React.useState('Today');
   const [activeCall, setActiveCall] = React.useState(null);
   const [callTimer, setCallTimer] = React.useState('00:00');
   const [isMuted, setIsMuted] = React.useState(false);
   const [isVideoOff, setIsVideoOff] = React.useState(false);

   const [memberBookings, setMemberBookings] = React.useState([]);
   const [incomingCalls, setIncomingCalls] = React.useState([]);

   React.useEffect(() => {
      const syncData = () => {
         try {
            const parsed = JSON.parse(localStorage.getItem('hs_booked_sessions') || '[]');
            setMemberBookings(Array.isArray(parsed) ? parsed : []);
         } catch (error) {
            setMemberBookings([]);
         }
         setIncomingCalls(getCallEvents().filter((event) => event.status === 'incoming'));
      };

      syncData();
      window.addEventListener('storage', syncData);
      return () => window.removeEventListener('storage', syncData);
   }, []);

   const statsData = {
      'Today': [
         { name: 'Sessions Today', value: '12', icon: CheckCircle, color: '#ff69b4' },
         { name: 'Upcoming Calls', value: String(Math.max(memberBookings.length, incomingCalls.length || 0)), icon: Calendar, color: '#3b82f6' },
         { name: 'Today Earnings', value: '₹4,800', icon: DollarSign, color: '#f59e0b' },
         { name: 'Adherence', value: '94%', icon: TrendingUp, color: '#10b981' },
      ],
      'This Week': [
         { name: 'Sessions Week', value: '142', icon: CheckCircle, color: '#ff69b4' },
         { name: 'Upcoming Calls', value: '28', icon: Calendar, color: '#3b82f6' },
         { name: 'Week Earnings', value: '₹54,200', icon: DollarSign, color: '#f59e0b' },
         { name: 'Advisory Score', value: '4.9', icon: Sparkles, color: '#8b5cf6' },
      ]
   };

   const appointmentsData = {
      'Today': memberBookings.length > 0 ? memberBookings.slice(0, 3).map((booking) => ({
         name: booking.memberName || 'Member User',
         time: booking.slot || booking.time || '10:00 AM',
         topic: booking.topic || 'Wellness Consultation',
         type: 'Video',
         healthStatus: booking.status || 'Pending',
         mood: 'Focused'
      })) : [
         { name: 'Priya Sharma', time: '10:30 AM', topic: 'PCOD Consultation', type: 'Video', healthStatus: 'Day 14 - High Fertility', mood: 'Happy' },
         { name: 'Sonal Patel', time: '02:00 PM', topic: 'Diet Planning', type: 'Audio', healthStatus: 'Day 22 - Luteal Phase', mood: 'Tired' },
         { name: 'Ananya Iyer', time: '04:30 PM', topic: 'Follow-up', type: 'Video', healthStatus: 'Day 5 - Menstruation', mood: 'Sad' },
      ],
      'This Week': [
         { name: 'Priya Sharma', time: 'Today 10:30 AM', topic: 'PCOD Consultation', type: 'Video', healthStatus: 'Day 14', mood: 'Happy' },
         { name: 'Megha Singh', time: 'Tomorrow 09:00 AM', topic: 'Emotional Healing', type: 'Video', healthStatus: 'Day 10', mood: 'Stressed' },
         { name: 'Sonal Verma', time: '12th Oct 11:00 AM', topic: 'Heart Care', type: 'Audio', healthStatus: 'Day 18', mood: 'Grateful' },
         { name: 'Ananya Iyer', time: '13th Oct 04:30 PM', topic: 'Follow-up', type: 'Video', healthStatus: 'Day 5', mood: 'Sad' },
      ]
   };

   const handleJoinCall = (name) => {
      setActiveCall(name);
      let seconds = 0;
      const interval = setInterval(() => {
         seconds++;
         const mins = Math.floor(seconds / 60);
         const secs = seconds % 60;
         setCallTimer(`${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`);
      }, 1000);
      window.callInterval = interval;
   };

   const handleEndCall = () => {
      clearInterval(window.callInterval);
      setActiveCall(null);
      setCallTimer('00:00');
   };

   const stats = statsData[activeTab];

   return (
      <div className="space-y-8 animate-in fade-in duration-500">
         
         {/* Advisor Welcome Header */}
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
               <h1 className="text-3xl font-black tracking-tight text-[#15192c]">Namaste, Dr. Sakhi.</h1>
               <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C4A0AC] mt-1">Your clinical command center for <span className="text-[#ff69b4]">{activeTab}</span></p>
            </div>
            <div className="flex bg-white p-1 rounded-2xl border border-[#F5E6EA] shadow-sm self-start">
               {['Today', 'This Week'].map(tab => (
                  <button 
                    key={tab} 
                    onClick={() => setActiveTab(tab)} 
                    className={`px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-[#15192c] text-white shadow-xl shadow-[#15192c]/20' : 'text-[#C4A0AC] hover:text-[#15192c]'}`}
                  >
                    {tab}
                  </button>
               ))}
            </div>
         </div>

         {/* Stats Row */}
         <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
               <motion.div 
                key={i} 
                whileHover={{ y: -5 }}
                className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-[#F5E6EA] relative overflow-hidden group"
               >
                  <div className="flex items-start justify-between mb-4">
                     <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm" style={{ backgroundColor: `${stat.color}10`, color: stat.color }}>
                        <stat.icon size={18} />
                     </div>
                     <div className="flex items-center gap-1 text-[8px] font-black text-emerald-500">
                        <TrendingUp size={10} /> 12%
                     </div>
                  </div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-[#C4A0AC] mb-1">{stat.name}</p>
                  <h3 className="text-2xl font-black text-[#15192c] tracking-tight">{stat.value}</h3>
               </motion.div>
            ))}
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Live Queue with Health Insights */}
            <div className="lg:col-span-8 bg-white rounded-[3rem] shadow-sm border border-[#F5E6EA] overflow-hidden">
               <div className="p-8 flex items-center justify-between border-b border-[#F5E6EA]">
                  <div>
                     <h2 className="text-xl font-black tracking-tight text-[#15192c]">Upcoming Sessions</h2>
                     <p className="text-[9px] font-black uppercase tracking-widest text-[#C4A0AC] mt-1">Live Tele-Health Queue</p>
                  </div>
                  <button onClick={() => navigate('/advisor/appointments')} className="px-6 py-3 bg-rose-50 text-[9px] font-black uppercase tracking-widest text-[#ff69b4] rounded-xl hover:bg-[#ff69b4] hover:text-white transition-all">View Full Calendar</button>
               </div>
               <div className="divide-y divide-[#F5E6EA]">
                  {appointmentsData[activeTab].map((apt, i) => (
                     <div key={i} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-rose-50/20 transition-all group">
                        <div className="flex items-center gap-5">
                           <div className="w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xs shadow-inner bg-rose-50 text-[#F5B4BC]">
                              {apt.name.split(' ').map(n => n[0]).join('')}
                           </div>
                           <div className="space-y-1">
                              <p className="text-base font-black text-[#15192c]">{apt.name}</p>
                              <div className="flex flex-wrap items-center gap-3">
                                 <span className="text-[9px] font-black uppercase tracking-widest text-[#C4A0AC]">{apt.topic}</span>
                                 <div className="w-1 h-1 rounded-full bg-rose-200" />
                                 <div className="flex items-center gap-1.5 px-3 py-1 bg-white border border-[#F5E6EA] rounded-lg text-[8px] font-black uppercase text-[#ff69b4]">
                                    <Droplets size={10} /> {apt.healthStatus}
                                 </div>
                              </div>
                           </div>
                        </div>
                        <div className="flex items-center gap-6 self-end md:self-auto">
                           <div className="text-right">
                              <p className="text-[9px] font-black uppercase tracking-widest text-[#C4A0AC]">{apt.type} Call</p>
                              <p className="text-sm font-black text-[#15192c]">{apt.time}</p>
                           </div>
                           <button 
                             onClick={() => handleJoinCall(apt.name)} 
                             className="px-8 py-4 bg-[#ff69b4] text-white text-[9px] font-black rounded-2xl uppercase tracking-widest shadow-xl shadow-rose-100 hover:scale-105 transition-all"
                           >
                              Join Session
                           </button>
                        </div>
                     </div>
                  ))}
               </div>
            </div>

            {/* Advisory Snapshot */}
            <div className="lg:col-span-4 space-y-8">
               <div className="bg-[#15192c] p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden h-full">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#ff69b4]/10 rounded-full blur-3xl -mr-16 -mt-16" />
                  <div className="flex items-center gap-3 mb-8">
                     <Sparkles size={18} className="text-[#ff69b4]" />
                     <h2 className="text-[10px] font-black uppercase tracking-widest">Clinical Excellence</h2>
                  </div>
                  <div className="space-y-8 relative z-10">
                     {[
                        { label: 'Patient Satisfaction', val: '98%', color: '#ff69b4' },
                        { label: 'Completion Rate', val: '92%', color: '#F5B4BC' },
                        { label: 'Avg. Rating', val: '4.9/5', color: '#F5E6EA' }
                     ].map((bar, i) => (
                        <div key={i} className="space-y-2.5">
                           <div className="flex justify-between items-end">
                              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40">{bar.label}</span>
                              <span className="text-xs font-black text-white">{bar.val}</span>
                           </div>
                           <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                              <motion.div initial={{ width: 0 }} animate={{ width: bar.val.includes('%') ? bar.val : '95%' }} className="h-full rounded-full" style={{ background: bar.color }} />
                           </div>
                        </div>
                     ))}
                  </div>
                  <div className="mt-12 p-6 bg-white/5 border border-white/10 rounded-3xl text-center">
                     <p className="text-[9px] font-black uppercase tracking-widest text-white/40 mb-1">Total Consultations</p>
                     <p className="text-3xl font-black text-white">1,482</p>
                  </div>
               </div>
            </div>
         </div>

         {/* Navigation Hub */}
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div onClick={() => navigate('/advisor/chat')} className="bg-white p-8 rounded-[3rem] shadow-sm border border-[#F5E6EA] flex items-center justify-between group cursor-pointer hover:shadow-md transition-all">
               <div className="flex items-center gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-rose-50 flex items-center justify-center text-[#ff69b4] shadow-inner group-hover:scale-110 transition-transform">
                     <MessageSquare size={24} />
                  </div>
                  <div>
                     <h3 className="text-xl font-black text-[#15192c]">Communication Hub</h3>
                     <p className="text-xs font-medium text-[#C4A0AC]">Live patient consultations & chat</p>
                  </div>
               </div>
               <ArrowRight size={20} className="text-[#F5E6EA] group-hover:text-[#ff69b4] group-hover:translate-x-2 transition-all" />
            </div>

            <div onClick={() => navigate('/advisor/users')} className="bg-white p-8 rounded-[3rem] shadow-sm border border-[#F5E6EA] flex items-center justify-between group cursor-pointer hover:shadow-md transition-all">
               <div className="flex items-center gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-rose-50 flex items-center justify-center text-[#15192c] shadow-inner group-hover:scale-110 transition-transform">
                     <Users size={24} />
                  </div>
                  <div>
                     <h3 className="text-xl font-black text-[#15192c]">Patient Registry</h3>
                     <p className="text-xs font-medium text-[#C4A0AC]">Review clinical health cards</p>
                  </div>
               </div>
               <ArrowRight size={20} className="text-[#F5E6EA] group-hover:text-[#15192c] group-hover:translate-x-2 transition-all" />
            </div>
         </div>

         {/* Call Overlay */}
         <AnimatePresence>
            {activeCall && (
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-[#15192c] flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#15192c] via-black to-[#15192c] flex items-center justify-center overflow-hidden">
                     <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#ff69b4]/5 rounded-full blur-[120px] -mr-64 -mt-64" />
                     <div className="text-center space-y-8 relative z-10">
                        <div className="w-48 h-48 rounded-[3.5rem] bg-white/5 border border-white/10 flex items-center justify-center mx-auto relative group">
                           <Users size={80} className="text-[#ff69b4] opacity-20 group-hover:scale-110 transition-transform" />
                           <div className="absolute top-2 right-2 w-12 h-12 bg-[#ff69b4] rounded-2xl border-4 border-[#15192c] flex items-center justify-center">
                              <Signal size={16} className="text-white" />
                           </div>
                        </div>
                        <div className="space-y-2">
                           <h2 className="text-4xl font-black text-white tracking-tight">{activeCall}</h2>
                           <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#ff69b4] animate-pulse">Encrypted Clinical Session</p>
                        </div>
                     </div>
                  </div>
                  
                  <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex items-center gap-8 p-6 bg-white/10 backdrop-blur-3xl border border-white/20 rounded-[3rem] shadow-2xl">
                     <button onClick={() => setIsMuted(!isMuted)} className={`w-16 h-16 rounded-3xl flex items-center justify-center transition-all ${isMuted ? 'bg-rose-500 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}>
                        {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
                     </button>
                     <button onClick={() => setIsVideoOff(!isVideoOff)} className={`w-16 h-16 rounded-3xl flex items-center justify-center transition-all ${isVideoOff ? 'bg-rose-500 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}>
                        {isVideoOff ? <VideoOff size={24} /> : <Video size={24} />}
                     </button>
                     <button onClick={handleEndCall} className="w-24 h-16 bg-rose-600 text-white rounded-[1.75rem] flex items-center justify-center hover:bg-rose-700 hover:scale-105 transition-all shadow-2xl shadow-rose-900/50">
                        <PhoneOff size={32} />
                     </button>
                  </div>

                  <div className="absolute top-10 left-10 flex items-center gap-4">
                     <div className="px-8 py-3 bg-rose-600 rounded-2xl text-white text-[11px] font-black uppercase tracking-[0.3em] flex items-center gap-4 shadow-xl shadow-rose-900/40">
                        <div className="w-2 h-2 rounded-full bg-white animate-ping"></div>
                        Live Session: {callTimer}
                     </div>
                  </div>
               </motion.div>
            )}
         </AnimatePresence>
      </div>
   );
};

export default AdvisorDashboard;
