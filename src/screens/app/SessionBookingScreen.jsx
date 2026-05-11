import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, Video, Star, Shield, ChevronRight, CheckCircle2, Sparkles, X, CheckCircle, ArrowLeft, User, MessageSquare } from 'lucide-react';
import { appendAdvisorMessage, logCallEvent, markThreadRead, upsertAdvisorThread } from '../../data/advisorFlow';

const SESSION_STORAGE_KEY = 'hs_booked_sessions';

const getBookedSessions = () => {
  try { return JSON.parse(localStorage.getItem(SESSION_STORAGE_KEY)) || []; }
  catch { return []; }
};

const saveSession = (session) => {
  const current = getBookedSessions();
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify([session, ...current]));
};

const DUMMY_SESSIONS = [
  {
    id: 'HS-742189',
    advisor: 'Dr. Sakshi Sharma',
    advisorImg: 'https://ui-avatars.com/api/?name=Dr+Sakshi&background=FDEEF1&color=C4607A&bold=true',
    date: 'Tomorrow, 28 Apr',
    slot: '10:00 AM',
    duration: '15 min',
    topic: 'Hormonal Health',
    isDummy: true
  }
];

const advisors = [
  {
    id: 1, name: 'Dr. Sakshi Sharma', role: 'Clinical Wellness Lead',
    bio: 'MBBS with 12+ years of experience in hormonal health and lifestyle medicine for women.',
    rating: 4.9, reviews: 840,
    image: 'https://ui-avatars.com/api/?name=Dr+Sakshi&background=FDEEF1&color=C4607A&bold=true',
    tags: ['PCOD Specialist', 'Thyroid', 'Pregnancy'],
    slots: { 0: ['9:00 AM','10:00 AM','12:00 PM','3:00 PM','5:00 PM'], 1: ['10:00 AM','11:00 AM','2:00 PM','4:00 PM'], 2: ['9:00 AM','11:00 AM','1:00 PM','6:00 PM'], 3: ['10:00 AM','3:00 PM','5:00 PM'], 4: ['9:00 AM','12:00 PM','2:00 PM','4:00 PM'], 5: ['11:00 AM','1:00 PM'], 6: ['10:00 AM','3:00 PM','5:00 PM'] }
  },
  {
    id: 2, name: 'Advisor HealthSakhi', role: 'Diet & Cravings Expert',
    bio: 'Specializing in Indian diets, food relationship healing, and sustainable weight management.',
    rating: 4.8, reviews: 520,
    image: 'https://ui-avatars.com/api/?name=HealthSakhi&background=FDEEF1&color=C4607A&bold=true',
    tags: ['Gut Health', 'Diabetes', 'Weight Loss'],
    slots: { 0: ['9:30 AM','11:00 AM','1:00 PM','4:30 PM'], 1: ['9:00 AM','10:30 AM','3:00 PM','5:00 PM'], 2: ['10:00 AM','12:00 PM','2:00 PM','5:30 PM'], 3: ['9:00 AM','11:00 AM','4:00 PM'], 4: ['10:00 AM','1:00 PM','3:00 PM','5:00 PM'], 5: ['10:00 AM','12:00 PM'], 6: ['9:30 AM','11:00 AM','2:00 PM'] }
  },
  {
    id: 3, name: 'Dr. Priya Menon', role: 'Mental Wellness Expert',
    bio: 'Psychologist specializing in anxiety, burnout recovery, and women\'s emotional health.',
    rating: 4.9, reviews: 1120,
    image: 'https://ui-avatars.com/api/?name=Dr+Priya&background=F5F1FE&color=9079C1&bold=true',
    tags: ['Anxiety', 'Burnout', 'Self-Esteem'],
    slots: { 0: ['10:00 AM','11:30 AM','2:00 PM','5:00 PM'], 1: ['9:00 AM','12:00 PM','3:30 PM'], 2: ['10:00 AM','1:00 PM','4:00 PM','6:00 PM'], 3: ['9:00 AM','11:00 AM','3:00 PM'], 4: ['10:30 AM','2:00 PM','5:00 PM'], 5: ['11:00 AM','1:00 PM','3:00 PM'], 6: ['10:00 AM','2:00 PM'] }
  },
];

const topics = ['Hormonal Health', 'Emotional Wellness', 'Diet & Nutrition', 'Relationship Issues', 'Sleep Problems', 'Stress & Anxiety', 'PCOD / PCOS', 'Other'];
const durations = [{ label: '15 min', price: 'Free', sub: 'Quick Consult' }, { label: '30 min', price: '₹299', sub: 'Deep Dive' }, { label: '60 min', price: '₹499', sub: 'Full Session' }];

const getNext7Days = () => {
  const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() + i);
    return { label: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : days[d.getDay()], date: `${d.getDate()} ${months[d.getMonth()]}`, idx: i };
  });
};

// ── Success Card ─────────────────────────────────────────────────────────────
const SuccessScreen = ({ booking, onReset }) => (
  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
    className="max-w-md mx-auto text-center py-10">
    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
      className="w-24 h-24 rounded-full bg-emerald-50 border-4 border-emerald-100 flex items-center justify-center mx-auto mb-8">
      <CheckCircle size={48} className="text-emerald-500" />
    </motion.div>
    <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-2">Booking Confirmed!</p>
    <h2 className="text-3xl font-black text-[#15192c] mb-2">See you soon! 🎉</h2>
    <p className="text-sm text-[#9A8A8E] mb-8">Your session has been booked. A confirmation will be sent to your registered email.</p>
    <div className="bg-white rounded-[2.5rem] p-8 border border-rose-50 shadow-sm text-left space-y-4 mb-8">
      {[
        { label: 'Advisor', value: booking.advisor },
        { label: 'Date', value: booking.date },
        { label: 'Time', value: booking.slot },
        { label: 'Duration', value: booking.duration },
        { label: 'Topic', value: booking.topic },
        { label: 'Session ID', value: `HS-${Math.floor(100000 + Math.random() * 900000)}` },
      ].map((r, i) => (
        <div key={i} className="flex justify-between items-center py-2 border-b border-rose-50 last:border-0">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#C4A0AC]">{r.label}</span>
          <span className="text-xs font-bold text-[#15192c]">{r.value}</span>
        </div>
      ))}
    </div>
    <button onClick={onReset}
      className="w-full py-4 bg-[#ff69b4] text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:brightness-110 transition-all shadow-lg">
      Book Another Session
    </button>
  </motion.div>
);

// ── Main Screen ──────────────────────────────────────────────────────────────
const SessionBookingScreen = () => {
  const currentMember = React.useMemo(() => {
    try {
      const sessionUser = JSON.parse(sessionStorage.getItem('hs_current_member') || '{}');
      return {
        name: sessionUser.name || 'Member User',
        email: sessionUser.email || 'member@gmail.com'
      };
    } catch (error) {
      return { name: 'Member User', email: 'member@gmail.com' };
    }
  }, []);
  const [selectedAdvisor, setSelectedAdvisor] = useState(null);
  const [selectedDay, setSelectedDay] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedDuration, setSelectedDuration] = useState(0);
  const [topic, setTopic] = useState('');
  const [name, setName] = useState('');
  const [step, setStep] = useState('list'); // list | confirm | success
  const [booking, setBooking] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const [chatModalSession, setChatModalSession] = useState(null);
  const [chatInput, setChatInput] = useState('');
  const [chatThreadId, setChatThreadId] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [mySessions, setMySessions] = useState(() => {
    const saved = getBookedSessions();
    return saved.length > 0 ? saved : DUMMY_SESSIONS;
  });

  const days = getNext7Days();
  const visibleAdvisors = showAll ? advisors : advisors.slice(0, 2);

  const handleSelectAdvisor = (adv) => {
    setSelectedAdvisor(adv);
    setSelectedSlot(null);
    setTimeout(() => {
      document.getElementById('slot-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleConfirm = () => {
    if (!selectedSlot || !topic || !name) return;
    const newBooking = {
      id: `HS-${Math.floor(100000 + Math.random() * 900000)}`,
      memberName: name || currentMember.name,
      memberEmail: currentMember.email,
      advisor: selectedAdvisor.name,
      advisorImg: selectedAdvisor.image,
      date: days[selectedDay].label + ', ' + days[selectedDay].date,
      slot: selectedSlot,
      duration: durations[selectedDuration].label,
      topic,
      status: 'Pending',
      bookedAt: new Date().toISOString(),
    };
    saveSession(newBooking);
    setMySessions(prev => [newBooking, ...prev]);
    upsertAdvisorThread({
      memberName: newBooking.memberName,
      memberEmail: newBooking.memberEmail,
      advisor: newBooking.advisor
    });
    setBooking(newBooking);
    setStep('success');
  };

  const handleMemberChat = (session) => {
    const thread = upsertAdvisorThread({
      memberName: session.memberName || currentMember.name,
      memberEmail: session.memberEmail || currentMember.email,
      advisor: session.advisor
    });
    markThreadRead(thread.id);
    setChatModalSession(session);
    setChatThreadId(thread.id);
    setChatMessages(thread.messages || []);
    setChatInput('');
  };

  const handleSendModalChat = () => {
    if (!chatModalSession || !chatInput.trim() || !chatThreadId) return;
    const thread = upsertAdvisorThread({
      memberName: chatModalSession.memberName || currentMember.name,
      memberEmail: chatModalSession.memberEmail || currentMember.email,
      advisor: chatModalSession.advisor
    });
    appendAdvisorMessage({
      threadId: chatThreadId,
      senderType: 'member',
      senderName: chatModalSession.memberName || currentMember.name,
      text: chatInput.trim()
    });
    const refreshed = upsertAdvisorThread({
      memberName: chatModalSession.memberName || currentMember.name,
      memberEmail: chatModalSession.memberEmail || currentMember.email,
      advisor: chatModalSession.advisor
    });
    setChatMessages(refreshed.messages || []);
    setChatInput('');
  };

  const handleJoinCall = (session) => {
    logCallEvent({
      memberName: session.memberName || currentMember.name,
      advisor: session.advisor,
      source: 'member-session-card'
    });
    window.alert(`Call request sent to ${session.advisor}. Advisor will see this in dashboard.`);
  };

  const handleCancelSession = (id) => {
    const updated = mySessions.filter(s => s.id !== id);
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(updated));
    setMySessions(updated);
  };

  const handleReset = () => {
    setSelectedAdvisor(null); setSelectedDay(0); setSelectedSlot(null);
    setSelectedDuration(0); setTopic(''); setName(''); setStep('list'); setBooking(null);
  };

  if (step === 'success') return <SuccessScreen booking={booking} onReset={handleReset} />;

  return (
    <div className="max-w-6xl mx-auto pb-20 space-y-12">

      {/* Header Banner */}
      <section className="px-2 lg:px-0">
        <div className="rounded-[3rem] p-10 flex flex-col md:flex-row items-center gap-10 border shadow-sm" style={{ background: '#FFF7F8', borderColor: '#F5E6EA' }}>
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border rounded-full text-[10px] font-bold uppercase tracking-widest" style={{ color: '#ff69b4', borderColor: '#F5E6EA' }}>
              <Sparkles size={12} /> Personalized Guidance
            </div>
            <h1 className="text-4xl font-bold tracking-tight leading-tight text-[#15192c]">
              Book your <span className="text-[#ff69b4]">15-min Sakhi session.</span>
            </h1>
            <p className="text-sm font-medium leading-relaxed max-w-lg text-[#9A8A8E]">
              Talk to our doctor-curated experts about hormonal health, nutrition, or emotional wellness in a safe, judgment-free space.
            </p>
            <div className="flex items-center gap-8 text-[11px] font-bold uppercase tracking-widest text-[#C4A0AC]">
              <div className="flex items-center gap-2"><CheckCircle2 size={16} /> 100% Private</div>
              <div className="flex items-center gap-2"><CheckCircle2 size={16} /> Expert Led</div>
              <div className="flex items-center gap-2"><CheckCircle2 size={16} /> Instant Booking</div>
            </div>
          </div>
          <div className="w-56 h-56 bg-white rounded-[2.5rem] shadow-sm flex items-center justify-center p-8 border" style={{ borderColor: '#F5E6EA' }}>
            <div className="text-center">
              <Video size={40} className="mx-auto mb-4" style={{ color: '#F5B4BC' }} />
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#15192c]">Video Consultation</p>
              <p className="text-[9px] font-bold mt-2 text-[#C4A0AC]">Included in Plus Plan</p>
            </div>
          </div>
        </div>
      </section>

      {/* My Upcoming Sessions */}
      <AnimatePresence>
        {mySessions.length > 0 && (
          <motion.section initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 px-2 lg:px-0">
            <div className="flex items-center justify-between">
               <h2 className="text-xl font-black text-[#15192c] tracking-tight">Your Upcoming Sessions</h2>
               <span className="px-3 py-1 bg-[#ff69b4]/10 text-[#ff69b4] rounded-full text-[10px] font-black uppercase tracking-widest">{mySessions.length} Active</span>
            </div>
            <div className="flex gap-6 overflow-x-auto pb-4 no-scrollbar">
               {mySessions.map((session) => (
                 <motion.div key={session.id} layout
                   className="flex-shrink-0 w-[320px] bg-white rounded-[2.5rem] p-8 border border-rose-50 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
                   <div className="absolute top-0 right-0 w-24 h-24 bg-rose-50/50 rounded-full blur-2xl -mr-12 -mt-12" />
                   <div className="flex items-start gap-4 mb-6 relative z-10">
                      <img src={session.advisorImg} alt={session.advisor} className="w-12 h-12 rounded-2xl object-cover border-2 border-white shadow-sm" />
                      <div>
                         <p className="text-[10px] font-black uppercase tracking-widest text-[#ff69b4] mb-0.5">{session.id}</p>
                         <h3 className="text-sm font-black text-[#15192c] leading-tight">{session.advisor}</h3>
                         <p className="text-[10px] font-bold text-[#C4A0AC]">{session.topic}</p>
                      </div>
                   </div>
                   <div className="space-y-3 mb-6 relative z-10">
                      <div className="flex items-center gap-3 text-xs font-bold text-[#15192c]">
                         <Calendar size={14} className="text-[#ff69b4]" />
                         <span>{session.date}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs font-bold text-[#15192c]">
                         <Clock size={14} className="text-[#ff69b4]" />
                         <span>{session.slot} ({session.duration})</span>
                      </div>
                   </div>
                   <div className="flex gap-3 relative z-10">
                      <button onClick={() => handleJoinCall(session)} className="flex-1 py-3 bg-[#15192c] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:brightness-110 transition-all shadow-lg">
                         Join Call
                      </button>
                      <button onClick={() => handleMemberChat(session)} className="px-4 py-3 bg-white border border-[#F5E6EA] text-[#ff69b4] rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-50 transition-all">
                         Chat
                      </button>
                      <button onClick={() => handleCancelSession(session.id)}
                        className="p-3 bg-rose-50 text-[#ff69b4] rounded-xl hover:bg-rose-100 transition-all">
                         <X size={16} />
                      </button>
                   </div>
                 </motion.div>
               ))}
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Advisor Grid */}
      <section className="space-y-8 px-2 lg:px-0">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-[#15192c]">Our Wellness Advisors</h2>
          <button onClick={() => setShowAll(v => !v)}
            className="text-[10px] font-bold uppercase tracking-widest text-[#ff69b4] hover:underline">
            {showAll ? 'Show Less' : 'See All Experts'}
          </button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {visibleAdvisors.map((adv) => (
            <motion.div key={adv.id} whileHover={{ y: -4 }}
              className={`bg-white rounded-[2.5rem] p-8 border shadow-sm transition-all cursor-pointer ${selectedAdvisor?.id === adv.id ? 'border-[#ff69b4] shadow-rose-100 shadow-lg ring-2 ring-[#ff69b4]/20' : 'border-[#F5E6EA] hover:shadow-md'}`}>
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="w-24 h-24 rounded-3xl overflow-hidden shrink-0 border-4 border-white shadow-sm">
                  <img src={adv.image} alt={adv.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-xl font-bold text-[#15192c]">{adv.name}</h3>
                      <Shield size={14} className="text-blue-400" />
                      {selectedAdvisor?.id === adv.id && <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded-full">Selected ✓</span>}
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#ff69b4]">{adv.role}</p>
                  </div>
                  <p className="text-sm font-medium leading-relaxed text-[#9A8A8E]">{adv.bio}</p>
                  <div className="flex flex-wrap gap-2">
                    {adv.tags.map(tag => (
                      <span key={tag} className="px-3 py-1 bg-rose-50 rounded-lg text-[9px] font-bold text-[#ff69b4]">{tag}</span>
                    ))}
                  </div>
                  <div className="flex items-center gap-6 pt-2">
                    <div className="flex items-center gap-1.5 font-bold text-xs text-[#15192c]">
                      <Star size={16} fill="#FFD700" className="text-transparent" />
                      {adv.rating} <span className="font-medium text-[#C4A0AC]">({adv.reviews})</span>
                    </div>
                    <motion.button whileTap={{ scale: 0.96 }}
                      onClick={() => handleSelectAdvisor(adv)}
                      className="flex-1 py-3.5 rounded-xl font-bold text-[10px] uppercase tracking-widest text-white transition-all shadow-md flex items-center justify-center gap-2"
                      style={{ background: selectedAdvisor?.id === adv.id ? '#15192c' : '#ff69b4' }}>
                      {selectedAdvisor?.id === adv.id ? 'Selected ✓' : 'Select & Book'} <ChevronRight size={14} />
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Slot Section */}
      <section id="slot-section" className="px-2 lg:px-0">
        <AnimatePresence mode="wait">
          {!selectedAdvisor ? (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="bg-white rounded-[3rem] p-10 text-center space-y-6 border shadow-sm border-[#F5E6EA]">
              <div className="w-20 h-20 rounded-[1.5rem] flex items-center justify-center mx-auto bg-[#FFF7F8] border border-[#F5E6EA]">
                <Calendar size={32} className="text-[#F5B4BC]" />
              </div>
              <div className="max-w-md mx-auto space-y-3">
                <h2 className="text-2xl font-bold text-[#15192c]">Select your slot.</h2>
                <p className="text-sm font-medium text-[#9A8A8E]">Choose an expert above to see their available real-time consultation slots.</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto opacity-20 pointer-events-none">
                {[1,2,3,4,5,6,7,8].map(i => (
                  <div key={i} className="py-4 border border-[#F5E6EA] rounded-2xl">
                    <p className="text-[10px] font-bold text-[#C4A0AC]">10:00 AM</p>
                  </div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div key="slots" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[3rem] p-10 border shadow-sm border-[#F5E6EA] space-y-10">

              {/* Advisor Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img src={selectedAdvisor.image} alt={selectedAdvisor.name} className="w-12 h-12 rounded-2xl object-cover border-2 border-white shadow-sm" />
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#ff69b4]">Booking with</p>
                    <h3 className="text-lg font-black text-[#15192c]">{selectedAdvisor.name}</h3>
                  </div>
                </div>
                <button onClick={() => setSelectedAdvisor(null)} className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-[#C4A0AC] hover:bg-rose-100 transition-all">
                  <X size={16} />
                </button>
              </div>

              {/* Duration */}
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-[#C4A0AC] mb-4">Session Duration</p>
                <div className="flex gap-4">
                  {durations.map((d, i) => (
                    <motion.button key={i} whileTap={{ scale: 0.96 }}
                      onClick={() => setSelectedDuration(i)}
                      className={`flex-1 py-4 rounded-2xl border-2 transition-all text-center ${selectedDuration === i ? 'border-[#ff69b4] bg-rose-50' : 'border-[#F5E6EA] hover:border-rose-200'}`}>
                      <p className={`text-lg font-black ${selectedDuration === i ? 'text-[#ff69b4]' : 'text-[#15192c]'}`}>{d.label}</p>
                      <p className="text-[10px] font-bold text-[#ff69b4]">{d.price}</p>
                      <p className="text-[9px] font-bold text-[#C4A0AC]">{d.sub}</p>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Date Tabs */}
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-[#C4A0AC] mb-4">Select Date</p>
                <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                  {days.map((d) => (
                    <motion.button key={d.idx} whileTap={{ scale: 0.95 }}
                      onClick={() => { setSelectedDay(d.idx); setSelectedSlot(null); }}
                      className={`flex-shrink-0 px-5 py-3 rounded-2xl border-2 transition-all text-center min-w-[80px] ${selectedDay === d.idx ? 'bg-[#15192c] border-[#15192c] text-white' : 'border-[#F5E6EA] hover:border-rose-200'}`}>
                      <p className={`text-[10px] font-black uppercase tracking-wide ${selectedDay === d.idx ? 'text-white/60' : 'text-[#C4A0AC]'}`}>{d.label}</p>
                      <p className={`text-sm font-black ${selectedDay === d.idx ? 'text-white' : 'text-[#15192c]'}`}>{d.date}</p>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Time Slots */}
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-[#C4A0AC] mb-4">Available Slots</p>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                  {(selectedAdvisor.slots[selectedDay] || []).map((slot) => (
                    <motion.button key={slot} whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedSlot(slot)}
                      className={`py-3 rounded-2xl border-2 text-xs font-black transition-all ${selectedSlot === slot ? 'bg-[#ff69b4] border-[#ff69b4] text-white shadow-lg shadow-rose-200' : 'border-[#F5E6EA] text-[#15192c] hover:border-[#ff69b4]'}`}>
                      <Clock size={12} className="mx-auto mb-1" />
                      {slot}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Topic & Name */}
              <AnimatePresence>
                {selectedSlot && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                    <div className="h-px bg-rose-50" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#C4A0AC]">Your Details</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="relative">
                        <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C4A0AC]" />
                        <input type="text" placeholder="Your Name"
                          value={name} onChange={e => setName(e.target.value)}
                          className="w-full pl-10 pr-4 py-4 rounded-2xl border-2 border-[#F5E6EA] focus:border-[#ff69b4] outline-none text-sm font-bold text-[#15192c] bg-white transition-all" />
                      </div>
                      <div className="relative">
                        <MessageSquare size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C4A0AC]" />
                        <select value={topic} onChange={e => setTopic(e.target.value)}
                          className="w-full pl-10 pr-4 py-4 rounded-2xl border-2 border-[#F5E6EA] focus:border-[#ff69b4] outline-none text-sm font-bold text-[#15192c] bg-white transition-all appearance-none">
                          <option value="">Session Topic</option>
                          {topics.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                      </div>
                    </div>

                    {/* Summary + Confirm */}
                    <div className="bg-rose-50/50 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                      <div className="space-y-1 text-sm">
                        <p className="font-black text-[#15192c]">{selectedAdvisor.name} • {days[selectedDay].label}, {days[selectedDay].date}</p>
                        <p className="text-[#C4A0AC] font-bold">{selectedSlot} • {durations[selectedDuration].label} • {durations[selectedDuration].price}</p>
                      </div>
                      <motion.button whileTap={{ scale: 0.96 }}
                        onClick={handleConfirm}
                        disabled={!name || !topic}
                        className={`px-10 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] text-white transition-all shadow-lg ${name && topic ? 'bg-[#ff69b4] hover:brightness-110 shadow-rose-200' : 'bg-[#C4A0AC] cursor-not-allowed'}`}>
                        Confirm Booking ✨
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Quick Chat Modal */}
      <AnimatePresence>
        {chatModalSession && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed top-0 left-0 w-screen h-screen z-[80] bg-[#15192c]/80 backdrop-blur-md flex items-start justify-center px-4 pt-36 pb-0 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, y: 12 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 12 }}
              className="w-full max-w-md bg-white rounded-[3rem] border border-[#F5E6EA] shadow-2xl overflow-hidden flex flex-col h-[620px]"
            >
              <div className="p-6 border-b border-[#F5E6EA] flex items-center justify-between bg-white">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-rose-100 flex items-center justify-center text-[#d17b88] font-black text-xl">
                    {chatModalSession.advisor.split(' ').map((part) => part[0]).slice(0, 2).join('')}
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-[#15192c]">{chatModalSession.advisor}</h3>
                    <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Online Now</p>
                  </div>
                </div>
                <button
                  onClick={() => setChatModalSession(null)}
                  className="w-10 h-10 rounded-full bg-rose-50 text-[#C4A0AC] hover:bg-rose-100 transition-all"
                >
                  <X size={16} className="mx-auto" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4 bg-[#FFF7F8]/30">
                {chatMessages.length === 0 ? (
                  <div className="p-4 rounded-2xl bg-white border border-[#F5E6EA] text-xs font-bold text-[#9A8A8E]">
                    Start chat with your advisor.
                  </div>
                ) : (
                  chatMessages.map((msg) => {
                    const isMine = msg.senderType === 'member' || msg.sender === (chatModalSession.memberName || currentMember.name);
                    const isSystem = msg.senderType === 'system';
                    return (
                      <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] p-4 rounded-[1.75rem] text-sm font-bold leading-relaxed ${
                          isSystem ? 'bg-amber-50 border border-amber-100 text-[#7a5a1f]' : isMine ? 'bg-[#15192c] text-white rounded-tr-none' : 'bg-white border border-[#F5E6EA] text-[#15192c] rounded-tl-none'
                        }`}>
                          <p>{msg.text}</p>
                          <p className={`text-[9px] mt-2 uppercase tracking-widest ${isMine ? 'text-white/40' : 'text-[#C4A0AC]'}`}>{msg.time}</p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <div className="p-6 border-t border-[#F5E6EA] bg-white">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendModalChat()}
                    placeholder="Type your message..."
                    className="flex-1 h-12 px-4 rounded-2xl border-2 border-[#F5E6EA] focus:border-[#ff69b4] outline-none text-sm font-bold bg-rose-50/30"
                  />
                  <button
                    onClick={handleSendModalChat}
                    disabled={!chatInput.trim()}
                    className={`w-12 h-12 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${chatInput.trim() ? 'bg-[#ff69b4] text-white hover:brightness-110' : 'bg-rose-100 text-[#C4A0AC] cursor-not-allowed'}`}
                  >
                    →
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`.no-scrollbar::-webkit-scrollbar{display:none}.no-scrollbar{-ms-overflow-style:none;scrollbar-width:none}`}</style>
    </div>
  );
};

export default SessionBookingScreen;
