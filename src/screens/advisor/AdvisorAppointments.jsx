import React from 'react';
import { Calendar as CalendarIcon, Clock, Video, Phone, CheckCircle, XCircle, Search, X, ShieldCheck, MapPin } from 'lucide-react';
import { updateBookedSessionStatus } from '../../data/advisorFlow';

const SESSION_STORAGE_KEY = 'hs_booked_sessions';

const getMemberBookings = () => {
  try {
    const parsed = JSON.parse(localStorage.getItem(SESSION_STORAGE_KEY) || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
};

const AdvisorAppointments = () => {
  const [search, setSearch] = React.useState('');
  const [activeTab, setActiveTab] = React.useState('Upcoming');
  const [showConfirmModal, setShowConfirmModal] = React.useState(null);
  const [tempSchedule, setTempSchedule] = React.useState({ date: '', time: '' });
  const [toast, setToast] = React.useState(null);
  const [appointments, setAppointments] = React.useState(() => {
    const mapped = getMemberBookings().map((booking, idx) => ({
      id: booking.id || idx + 1,
      name: booking.memberName || 'Member User',
      date: booking.date || 'TBD',
      time: booking.slot || booking.time || '10:00',
      duration: booking.duration || '15m',
      type: 'Video',
      topic: booking.topic || 'Wellness Session',
      status: booking.status === 'Completed' ? 'Completed' : booking.status === 'Confirmed' ? 'Confirmed' : 'Pending'
    }));
    if (mapped.length > 0) return mapped;
    return [
    { id: 1, name: 'Priya Sharma', date: '2023-10-14', time: '10:30', duration: '30m', type: 'Video', topic: 'Women Health', status: 'Pending' },
    { id: 2, name: 'Ananya Iyer', date: '2023-10-14', time: '11:30', duration: '15m', type: 'Audio', topic: 'Relationships', status: 'Pending' },
    { id: 3, name: 'Megha Singh', date: '2023-10-12', time: '09:00', duration: '30m', type: 'Video', topic: 'Emotional Healing', status: 'Completed' },
    { id: 4, name: 'Sonal Verma', date: '2023-10-12', time: '11:00', duration: '15m', type: 'Audio', topic: 'Heart Care', status: 'Completed' },
    { id: 5, name: 'Divya Rao', date: '2023-10-13', time: '10:00', duration: '30m', type: 'Video', topic: 'Food & Cravings', status: 'Pending' },
    ];
  });

  React.useEffect(() => {
    const sync = () => {
      const latest = getMemberBookings().map((booking, idx) => ({
        id: booking.id || idx + 1,
        name: booking.memberName || 'Member User',
        date: booking.date || 'TBD',
        time: booking.slot || booking.time || '10:00',
        duration: booking.duration || '15m',
        type: 'Video',
        topic: booking.topic || 'Wellness Session',
        status: booking.status === 'Completed' ? 'Completed' : booking.status === 'Confirmed' ? 'Confirmed' : 'Pending'
      }));
      if (latest.length > 0) setAppointments(latest);
    };
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);

  const initiateConfirm = (apt) => {
    setTempSchedule({ date: apt.date, time: apt.time });
    setShowConfirmModal(apt);
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const finalizeConfirm = () => {
    setAppointments(appointments.map(apt =>
      apt.id === showConfirmModal.id ? { ...apt, status: 'Confirmed', date: tempSchedule.date, time: tempSchedule.time } : apt
    ));
    updateBookedSessionStatus(showConfirmModal.id, 'Confirmed');
    showToast(`Confirmed for ${tempSchedule.date} at ${tempSchedule.time}`);
    setShowConfirmModal(null);
  };

  const filtered = appointments.filter(apt => {
    const matchesSearch = apt.name.toLowerCase().includes(search.toLowerCase()) || 
                          apt.topic.toLowerCase().includes(search.toLowerCase());
    const matchesTab = activeTab === 'Upcoming' ? apt.status !== 'Completed' : apt.status === 'Completed';
    return matchesSearch && matchesTab;
  });

  return (
    <div className="space-y-10 font-sans pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="animate-in slide-in-from-left duration-500">
           <h1 className="text-3xl font-black text-slate-800 tracking-tight leading-none">Schedule<br/>Registry</h1>
           <p className="text-slate-500 font-medium mt-2 text-sm">Manage your consultation pipeline and connect with sisters.</p>
        </div>
        <div className="flex bg-white p-1 rounded-2xl border border-black/5 shadow-sm self-start">
           {['Upcoming', 'Completed'].map(tab => (
               <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] transition-all ${activeTab === tab ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/20' : 'text-slate-400 hover:text-slate-600'}`}>{tab}</button>
           ))}
        </div>
      </div>

      <div className="relative group">
         <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-health-green transition-colors" size={18} />
         <input 
          type="text" 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search patient or topic..." 
          className="w-full h-12 pl-10 pr-5 bg-white border border-black/5 rounded-2xl shadow-sm outline-none focus:border-health-green focus:ring-4 focus:ring-health-green/5 transition-all text-sm font-medium"
         />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((apt) => (
          <div key={apt.id} className="bg-white p-6 rounded-[2rem] border border-black/5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group animate-in zoom-in-95">
             <div className="flex items-center justify-between mb-5">
                <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 ${
                  apt.type === 'Video' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'
                }`}>
                   {apt.type === 'Video' ? <Video size={14} /> : <Phone size={14} />}
                   {apt.type} CALL
                </div>
                {apt.status === 'Confirmed' && <CheckCircle size={18} className="text-health-green" />}
                {apt.status === 'Completed' && <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Archive</span>}
             </div>
             
             <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-[1.5rem] bg-slate-50 flex items-center justify-center font-black text-slate-400 italic shadow-inner text-sm">
                   {apt.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                   <h3 className="text-lg font-black text-slate-800 tracking-tight">{apt.name}</h3>
                   <p className="text-[10px] text-health-green font-black uppercase tracking-[0.2em] mt-1">{apt.topic}</p>
                </div>
             </div>

             <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-[11px] font-bold text-slate-500">
                   <div className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400"><CalendarIcon size={14} /></div>
                   {apt.date} at {apt.time}
                </div>
                <div className="flex items-center gap-3 text-[11px] font-bold text-slate-500">
                   <div className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400"><Clock size={14} /></div>
                   Duration: {apt.duration}
                </div>
             </div>

             {apt.status !== 'Completed' && (
                <button 
                  onClick={() => initiateConfirm(apt)}
                  disabled={apt.status === 'Confirmed'}
                  className={`w-full py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    apt.status === 'Confirmed' 
                    ? 'bg-emerald-50 text-health-green shadow-none border border-emerald-100' 
                    : 'bg-slate-900 text-white hover:bg-black active:scale-95 shadow-slate-900/10'
                  }`}
                >
                  {apt.status === 'Confirmed' ? 'Confirmed & Synced' : 'Review & Confirm'}
                </button>
             )}
          </div>
        ))}
      </div>

      {/* Confirmation & Rescheduling Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300">
           <div className="bg-white rounded-[2rem] w-full max-w-lg p-8 relative shadow-2xl animate-in zoom-in-95 duration-500 overflow-hidden">
             <button onClick={() => setShowConfirmModal(null)} className="absolute top-6 right-6 text-slate-300 hover:text-slate-900 transition-colors"><X size={22}/></button>
             
             <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-xl shadow-slate-900/20"><CalendarIcon size={20}/></div>
                <div>
                   <h3 className="text-xl font-black text-slate-900 tracking-tight leading-none">Confirm Slot</h3>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Verify time before calendar sync</p>
                </div>
             </div>

             <div className="space-y-5">
                <div className="space-y-2">
                   <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Consultation Date</label>
                   <div className="relative group">
                      <CalendarIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-health-green transition-colors" />
                      <input type="text" value={tempSchedule.date} onChange={e => setTempSchedule({...tempSchedule, date: e.target.value})} className="w-full h-12 pl-10 pr-4 bg-slate-50 border border-black/5 rounded-2xl font-bold text-sm text-black outline-none focus:bg-white focus:border-health-green appearance-none" style={{ color: 'black' }} />
                   </div>
                </div>

                <div className="space-y-2">
                   <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Proposed Time</label>
                   <div className="relative group">
                      <Clock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-health-green transition-colors" />
                      <input type="time" value={tempSchedule.time} onChange={e => setTempSchedule({...tempSchedule, time: e.target.value})} className="w-full h-12 pl-10 pr-4 bg-slate-50 border border-black/5 rounded-2xl font-bold text-sm text-black outline-none focus:bg-white focus:border-health-green appearance-none" style={{ color: 'black' }} />
                   </div>
                </div>

                <div className="p-5 bg-emerald-50/50 rounded-3xl border border-emerald-100 flex items-start gap-3">
                   <ShieldCheck size={20} className="text-health-green flex-shrink-0 mt-1" />
                   <p className="text-[10px] font-bold text-health-green leading-relaxed uppercase tracking-widest">Upon confirmation, the sister will be notified via WhatsApp and the slot will be locked in your clinical calendar.</p>
                </div>
             </div>

             <div className="flex gap-3 mt-7">
                <button onClick={finalizeConfirm} className="flex-1 py-3.5 bg-slate-900 text-white font-black rounded-2xl text-[10px] uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-900/10">Confirm & Sync</button>
                <button onClick={() => setShowConfirmModal(null)} className="px-6 py-3.5 bg-slate-100 text-slate-400 font-black rounded-2xl text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all">Cancel</button>
             </div>
          </div>
        </div>
      )}
      {/* Premium Toast Notification */}
      {toast && (
        <div className="fixed bottom-10 right-10 z-[200] animate-in slide-in-from-right-10 duration-500">
           <div className="bg-slate-900/90 backdrop-blur-xl border border-white/10 p-4 rounded-[1.75rem] shadow-2xl flex items-center gap-3 min-w-[280px]">
              <div className="w-10 h-10 bg-emerald-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20 animate-bounce">
                 <CheckCircle size={20} />
              </div>
              <div>
                 <p className="text-[9px] font-black text-emerald-400 uppercase tracking-widest mb-1">Session Synchronized</p>
                 <p className="text-white text-[11px] font-bold leading-tight">{toast}</p>
              </div>
              <button onClick={() => setToast(null)} className="ml-auto text-white/20 hover:text-white transition-colors"><X size={16}/></button>
           </div>
        </div>
      )}
    </div>
  );
};

export default AdvisorAppointments;
