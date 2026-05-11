import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Droplets, Heart, Sparkles, Activity, Plus, X, CheckCircle2, Shield, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PeriodTrackerScreen = () => {
  const navigate = useNavigate();
  
  // Real Logic States
  const [cycleDay, setCycleDay] = useState(14);
  const [nextPeriodIn, setNextPeriodIn] = useState(6);
  const [fertilityStatus, setFertilityStatus] = useState("High Window");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Custom Date Selection State
  const [selectionType, setSelectionType] = useState('start'); 
  const [startDate, setStartDate] = useState(1);
  const [endDate, setEndDate] = useState(5);

  const handleLogPeriod = () => {
    setIsSaving(true);
    
    // Simulate real calculation flow
    setTimeout(() => {
      setIsSaving(false);
      setIsModalOpen(false);
      
      // Update data based on log (Mock logic for flow demonstration)
      const newCycleDay = new Date().getDate() - startDate + 1;
      setCycleDay(newCycleDay > 0 ? newCycleDay : 1);
      setNextPeriodIn(28 - newCycleDay);
      setFertilityStatus(newCycleDay >= 12 && newCycleDay <= 16 ? "High Window" : "Low Window");
      
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1500);
  };

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen w-full bg-[#FFF7F8] relative overflow-x-hidden font-sans text-[#15192c]">
      
      {/* ── Subtle Mesh Background ── */}
      <style>
        {`
          @keyframes meshFlow {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .mesh-bg {
            background: linear-gradient(-45deg, #FFF7F8, #FFE4E8, #FFD1D9, #F5B4BC);
            background-size: 400% 400%;
            animation: meshFlow 25s ease infinite;
          }
        `}
      </style>
      <div className="absolute inset-0 mesh-bg opacity-30 pointer-events-none" />

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 w-full px-6 md:px-12 py-8"
      >
        <div className="space-y-8">
          
          {/* Header */}
          <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4 md:gap-5">
              <button 
                onClick={() => navigate('/app')}
                className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-white border border-rose-100 flex items-center justify-center text-[#15192c] hover:bg-[#ff69b4] hover:text-white transition-all shadow-sm shrink-0"
              >
                <ChevronLeft size={18} />
              </button>
              <div>
                 <h1 className="text-2xl md:text-3xl font-black tracking-tight text-[#15192c]">Period Tracker</h1>
                 <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] text-[#C4A0AC]">Wellness Sanctuary</p>
              </div>
            </div>
            
            <motion.button 
              whileHover={{ scale: 1.02 }}
              onClick={() => setIsModalOpen(true)}
              className="w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 bg-[#ff69b4] text-white rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-widest shadow-lg shadow-rose-100/50 hover:brightness-105 transition-all flex items-center justify-center gap-2"
            >
               <Plus size={16} /> Log Period
            </motion.button>
          </header>

          {/* Real-time Stats Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
             <motion.div variants={item} className="bg-white/80 backdrop-blur-md p-5 md:p-6 rounded-2xl md:rounded-3xl border border-white shadow-sm flex items-center gap-4 md:gap-5">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-rose-50 rounded-xl md:rounded-2xl flex items-center justify-center text-[#ff69b4] shrink-0"><CalendarIcon size={18}/></div>
                <div>
                   <p className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-[#C4A0AC]">Cycle Day</p>
                   <h3 className="text-lg md:text-xl font-black text-[#15192c]">{cycleDay}</h3>
                </div>
             </motion.div>

             <motion.div variants={item} className="bg-white/80 backdrop-blur-md p-5 md:p-6 rounded-2xl md:rounded-3xl border border-white shadow-sm flex items-center gap-4 md:gap-5">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-rose-50 rounded-xl md:rounded-2xl flex items-center justify-center text-[#ff69b4] shrink-0"><Zap size={18}/></div>
                <div>
                   <p className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-[#C4A0AC]">Next Period</p>
                   <h3 className="text-lg md:text-xl font-black text-[#15192c]">{nextPeriodIn} Days</h3>
                </div>
             </motion.div>

             <motion.div variants={item} className="bg-white/80 backdrop-blur-md p-5 md:p-6 rounded-2xl md:rounded-3xl border border-white shadow-sm flex items-center gap-4 md:gap-5">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-rose-50 rounded-xl md:rounded-2xl flex items-center justify-center text-[#ff69b4] shrink-0"><Sparkles size={18}/></div>
                <div>
                   <p className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-[#C4A0AC]">Fertility</p>
                   <h3 className={`text-lg md:text-xl font-black ${fertilityStatus === 'High Window' ? 'text-[#ff69b4]' : 'text-[#8b5cf6]'}`}>{fertilityStatus}</h3>
                </div>
             </motion.div>

             <motion.div variants={item} className="bg-[#15192c] p-5 md:p-6 rounded-2xl md:rounded-3xl shadow-lg flex items-center gap-4 md:gap-5 text-white">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-[#ff69b4]/20 rounded-xl md:rounded-2xl flex items-center justify-center text-[#ff69b4] shrink-0"><Heart size={18}/></div>
                <p className="text-[9px] md:text-[10px] font-bold text-white/90 leading-tight">Your cycle is healthy, Sakhi! 💖</p>
             </motion.div>
          </div>

          {/* Calendar View */}
          <motion.div variants={item} className="bg-white/90 backdrop-blur-xl rounded-[2rem] md:rounded-[3rem] p-5 md:p-10 border border-white shadow-xl shadow-rose-100/20">
             <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 md:mb-10">
                <div>
                   <h3 className="text-xl md:text-2xl font-black text-[#15192c]">April 2024</h3>
                   <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-[#C4A0AC]">Track your natural rhythm</p>
                </div>
                <div className="flex gap-2 md:gap-3 self-end sm:self-auto">
                   <button className="w-8 h-8 md:w-9 md:h-9 rounded-xl bg-white border border-rose-50 flex items-center justify-center text-[#C4A0AC] hover:text-[#ff69b4] transition-all"><ChevronLeft size={18}/></button>
                   <button className="w-8 h-8 md:w-9 md:h-9 rounded-xl bg-white border border-rose-50 flex items-center justify-center text-[#C4A0AC] hover:text-[#ff69b4] transition-all"><ChevronRight size={18}/></button>
                </div>
             </div>
             
             <div className="grid grid-cols-7 gap-3 md:gap-4">
               {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(d => (
                 <div key={d} className="text-center text-[8px] md:text-[9px] font-black text-[#C4A0AC] tracking-widest py-2">{d}</div>
               ))}
               {Array.from({ length: 30 }).map((_, i) => {
                 const day = i + 1;
                 const isPeriod = day >= startDate && day <= endDate;
                 const isFertile = day >= 12 && day <= 16;
                 const isToday = day === new Date().getDate();

                 return (
                   <motion.button 
                     key={i}
                     whileHover={{ scale: 1.05 }}
                     className={`h-11 sm:h-14 md:h-20 rounded-xl md:rounded-3xl flex flex-col items-center justify-center transition-all relative ${
                       isToday ? 'bg-[#15192c] text-white shadow-2xl z-10' : 
                       isPeriod ? 'bg-[#ff69b4]/10 text-[#ff69b4] border border-[#ff69b4]/20' : 
                       isFertile ? 'bg-[#8b5cf6]/10 text-[#8b5cf6] border border-[#8b5cf6]/20' :
                       'bg-white/40 hover:bg-white text-[#15192c] border border-transparent hover:border-rose-50'
                     }`}
                   >
                     <span className="text-[10px] sm:text-xs md:text-sm font-black">{day}</span>
                     {isPeriod && <div className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-[#ff69b4] mt-0.5 md:mt-1" />}
                     {isFertile && <div className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-[#8b5cf6] mt-0.5 md:mt-1" />}
                   </motion.button>
                 );
               })}
             </div>
          </motion.div>

        </div>
      </motion.div>

      {/* ── Custom Premium Log Period Modal ── */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-[#15192c]/40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} className="w-full max-w-md bg-white rounded-[3rem] p-10 relative z-10 shadow-2xl overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-rose-50 rounded-full blur-3xl -mr-16 -mt-16" />
              
              <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 text-[#C4A0AC] hover:text-[#15192c] transition-colors"><X size={20} /></button>
              
              <div className="relative z-10 space-y-8">
                <div className="text-center space-y-2">
                  <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center text-[#ff69b4] mx-auto shadow-inner mb-2"><Droplets size={28} /></div>
                  <h3 className="text-2xl font-black text-[#15192c]">Log Cycle 🌸</h3>
                  <p className="text-[10px] font-bold text-[#C4A0AC] uppercase tracking-widest">Select your dates below</p>
                </div>

                <div className="flex bg-rose-50/50 p-1 rounded-2xl">
                   <button onClick={() => setSelectionType('start')} className={`flex-1 py-3 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all ${selectionType === 'start' ? 'bg-white text-[#ff69b4] shadow-sm' : 'text-[#C4A0AC]'}`}>Start Date ({startDate})</button>
                   <button onClick={() => setSelectionType('end')} className={`flex-1 py-3 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all ${selectionType === 'end' ? 'bg-white text-[#ff69b4] shadow-sm' : 'text-[#C4A0AC]'}`}>End Date ({endDate})</button>
                </div>

                <div className="grid grid-cols-7 gap-2">
                   {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                     <div key={d} className="text-center text-[8px] font-black text-[#C4A0AC]">{d}</div>
                   ))}
                   {Array.from({ length: 30 }).map((_, i) => {
                     const d = i + 1;
                     const isStart = d === startDate;
                     const isEnd = d === endDate;
                     const inRange = d > startDate && d < endDate;
                     return (
                       <button 
                        key={i} 
                        onClick={() => {
                          if (selectionType === 'start') { setStartDate(d); setSelectionType('end'); }
                          else { setEndDate(d); }
                        }}
                        className={`h-10 rounded-xl text-[10px] font-black transition-all ${
                         isStart || isEnd ? 'bg-[#ff69b4] text-white shadow-lg shadow-rose-200' :
                         inRange ? 'bg-rose-50 text-[#ff69b4]' :
                         'hover:bg-rose-50 text-[#15192c]'
                        }`}
                       >
                         {d}
                       </button>
                     );
                   })}
                </div>

                <div className="space-y-4 pt-4">
                  <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                     <span className="text-[#C4A0AC]">Total Duration:</span>
                     <span className="text-[#ff69b4]">{endDate - startDate + 1} Days</span>
                  </div>
                  <button 
                    onClick={handleLogPeriod} 
                    disabled={isSaving}
                    className="w-full py-5 bg-[#ff69b4] text-white rounded-[1.5rem] font-black uppercase tracking-widest text-[10px] shadow-xl shadow-rose-100/50 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                  >
                    {isSaving ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : 'Save to Health Card'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Success Toast ── */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[110] bg-[#15192c] text-white px-8 py-5 rounded-[2rem] shadow-2xl flex items-center gap-4 border border-white/10">
            <CheckCircle2 size={20} className="text-[#ff69b4]" />
            <span className="text-[10px] font-black uppercase tracking-widest">Digital Health Card Updated! ✨</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PeriodTrackerScreen;
