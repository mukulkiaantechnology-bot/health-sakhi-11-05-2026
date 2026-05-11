import React, { useState } from 'react';
import { Calendar, Clock, Save, RefreshCw, ChevronLeft, ChevronRight, Plus } from 'lucide-react';

const SlotManagementScreen = () => {
  const [selectedDay, setSelectedDay] = useState('Monday');
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  const [slots, setSlots] = useState({
    Monday: ['10:00 AM', '10:30 AM', '11:00 AM', '04:00 PM', '04:30 PM'],
    Tuesday: ['09:00 AM', '09:30 AM', '01:00 PM', '01:30 PM'],
    Wednesday: ['10:00 AM', '11:00 AM', '02:00 PM'],
    Thursday: ['10:00 AM', '10:30 AM', '04:00 PM', '05:00 PM'],
    Friday: ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM'],
    Saturday: [],
    Sunday: []
  });

  const allSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', 
    '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM',
    '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM'
  ];

  const toggleSlot = (time) => {
    const currentDaySlots = slots[selectedDay];
    if (currentDaySlots.includes(time)) {
      setSlots({ ...slots, [selectedDay]: currentDaySlots.filter(t => t !== time) });
    } else {
      setSlots({ ...slots, [selectedDay]: [...currentDaySlots, time].sort() });
    }
  };

  return (
    <div className="space-y-4 font-sans pb-14">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Availability Master</h1>
          <p className="text-slate-500 text-xs font-medium">Configure your active consultation hours for the upcoming week.</p>
        </div>
        <button className="px-4 py-2 bg-slate-900 text-white font-black rounded-2xl text-[10px] uppercase tracking-[0.2em] flex items-center gap-2 shadow-sm hover:bg-black transition-all">
           <Save size={16} /> Save Master Schedule
        </button>
      </div>

      <div className="bg-white rounded-[1.5rem] border border-black/5 shadow-sm overflow-hidden flex flex-col lg:flex-row min-h-[440px]">
        {/* Sidebar: Day Selector */}
        <div className="w-full lg:w-64 border-r border-black/5 bg-slate-50/50 p-4 space-y-2">
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Weekly Rotation</p>
           {days.map(day => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-bold transition-all ${
                  selectedDay === day 
                    ? 'bg-health-green text-white shadow-lg shadow-health-green/15' 
                    : 'text-slate-500 hover:bg-white hover:text-slate-800'
                }`}
              >
                <span className="text-sm">{day}</span>
                <span className="text-[9px] opacity-70">{slots[day].length}</span>
              </button>
           ))}
           <div className="mt-5 p-4 bg-slate-900 text-white rounded-[1.5rem] space-y-2">
              <RefreshCw size={18} className="text-health-green mb-1" />
              <p className="text-[11px] font-bold leading-relaxed">Quick Sync with Google Calendar is coming in Phase 2.</p>
           </div>
        </div>

        {/* Main: Slot Grid */}
        <div className="flex-1 p-4 space-y-5">
           <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                 <div className="w-8 h-8 bg-health-soft rounded-2xl flex items-center justify-center text-health-dark">
                    <Calendar size={16} />
                 </div>
                 <div>
                    <h2 className="text-lg font-black text-slate-800 tracking-tight">{selectedDay} Slots</h2>
                    <p className="text-[11px] font-bold text-slate-500">{slots[selectedDay].length} working slots</p>
                 </div>
              </div>
              <div className="flex gap-2">
                 <button className="p-2 bg-slate-50 text-slate-400 rounded-xl hover:text-slate-800 transition-colors"><ChevronLeft size={16} /></button>
                 <button className="p-2 bg-slate-50 text-slate-400 rounded-xl hover:text-slate-800 transition-colors"><ChevronRight size={16} /></button>
              </div>
           </div>

           <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-2">
              {allSlots.map(time => {
                const isActive = slots[selectedDay].includes(time);
                return (
                  <button
                    key={time}
                    onClick={() => toggleSlot(time)}
                    className={`group relative p-3 rounded-[1.5rem] border transition-all flex flex-col items-center gap-1.5 ${
                      isActive 
                        ? 'bg-white border-health-green shadow-sm shadow-health-green/10' 
                        : 'bg-slate-50/50 border-transparent hover:border-slate-200'
                    }`}
                  >
                    <Clock size={14} className={isActive ? 'text-health-green' : 'text-slate-300'} />
                    <span className={`text-[12px] font-black ${isActive ? 'text-slate-800' : 'text-slate-400'}`}>{time}</span>
                    {isActive && (
                       <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-health-green rounded-full"></div>
                    )}
                  </button>
                );
              })}
              <button className="p-3 rounded-[1.5rem] border-2 border-dashed border-slate-200 hover:border-health-green hover:bg-health-green/5 transition-all flex flex-col items-center justify-center gap-1.5 group">
                 <div className="w-7 h-7 rounded-full bg-slate-100 group-hover:bg-health-green group-hover:text-white flex items-center justify-center transition-all">
                    <Plus size={14} />
                 </div>
                 <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest group-hover:text-health-green">Quick Add</span>
              </button>
           </div>

           <div className="p-4 bg-slate-50 rounded-[1.75rem] border border-black/5 flex flex-col md:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                 <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm text-health-dark">
                    <RefreshCw size={14} />
                 </div>
                 <p className="text-sm font-bold text-slate-600">Need to block vacation dates?</p>
              </div>
              <button className="px-4 py-2 bg-white border border-black/10 text-slate-800 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all">
                 Configure Exceptions
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default SlotManagementScreen;
