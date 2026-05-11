import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Heart, MessageSquare, ShieldCheck, Sparkles, ArrowRight, Star, Clock, X, Calendar, MapPin, ChevronRight, Brain, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { appendAdvisorMessage, getAdvisorThreads, getCurrentMemberProfile, markThreadRead, upsertAdvisorThread } from '../../data/advisorFlow';

// ── Doctor Profile Modal ─────────────────────────────────────────────────────
const DoctorModal = ({ onClose, onBook, onChat, advisorName }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 flex items-center justify-center bg-[#15192c]/70 backdrop-blur-md p-4">
    <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
      className="bg-white rounded-[3rem] p-10 w-full max-w-md shadow-2xl relative">
      <button onClick={onClose}
        className="absolute top-6 right-6 w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-[#C4A0AC] hover:bg-rose-100 transition-all">
        <X size={18} />
      </button>
      <div className="flex items-center gap-6 mb-8">
        <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(advisorName)}&background=D17B88&color=fff&size=200`}
          alt={advisorName} className="w-20 h-20 rounded-[1.5rem] object-cover shadow-lg border-4 border-white" />
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-[#ff69b4]">Lead Consultant</p>
          <h3 className="text-2xl font-black text-[#15192c]">{advisorName}</h3>
          <div className="flex gap-0.5 text-amber-400 mt-1">
            {[1,2,3,4,5].map(i => <Star key={i} size={10} fill="currentColor" />)}
          </div>
        </div>
      </div>
      <div className="space-y-4 mb-8">
        {[
          { label: 'Specialization', value: 'Emotional Boundaries, Intimacy Healing, Self-Love' },
          { label: 'Experience', value: '12 Years • 2,400+ Sessions' },
          { label: 'Languages', value: 'Hindi, English, Marathi' },
          { label: 'Session Type', value: 'Online • 45 min / 90 min' },
        ].map((d, i) => (
          <div key={i} className="flex justify-between items-start py-3 border-b border-rose-50">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#C4A0AC]">{d.label}</span>
            <span className="text-xs font-bold text-[#15192c] text-right max-w-[55%]">{d.value}</span>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <button onClick={onChat}
          className="py-4 bg-rose-50 rounded-2xl text-[10px] font-black uppercase tracking-widest text-[#ff69b4] hover:bg-[#ff69b4] hover:text-white transition-all">
          Chat Now
        </button>
        <button onClick={onBook}
          className="py-4 bg-[#15192c] rounded-2xl text-[10px] font-black uppercase tracking-widest text-white hover:brightness-110 transition-all shadow-lg">
          Book Session
        </button>
      </div>
    </motion.div>
  </motion.div>
);

// ── Private Message Modal (Two-Way Thread Simulation) ──────────────────────
const ExpertMessageModal = ({ onClose, advisorName }) => {
  const currentMember = getCurrentMemberProfile();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [threadId, setThreadId] = useState(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    const thread = upsertAdvisorThread({
      memberName: currentMember.name,
      memberEmail: currentMember.email,
      advisor: advisorName
    });
    setThreadId(thread.id);
    setMessages(thread.messages || []);
    markThreadRead(thread.id);

    const sync = () => {
      const threads = getAdvisorThreads();
      const latest = threads.find((t) => t.id === thread.id);
      if (latest) setMessages(latest.messages || []);
    };
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || !threadId) return;
    const updated = appendAdvisorMessage({
      threadId,
      senderType: 'member',
      senderName: currentMember.name,
      text: input.trim()
    });
    if (updated) setMessages(updated.messages || []);
    setInput('');
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-start justify-center bg-[#15192c]/80 backdrop-blur-md px-4 pt-36 pb-6 overflow-y-auto">
      <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
        className="bg-white rounded-[3rem] w-full max-w-md h-[600px] shadow-2xl relative overflow-hidden flex flex-col">
        
        {/* Chat Header */}
        <div className="p-8 border-b border-rose-50 flex items-center justify-between bg-white sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(advisorName)}&background=D17B88&color=fff&size=100`} 
                className="w-12 h-12 rounded-2xl object-cover border-2 border-rose-100" alt="" />
            </div>
            <div>
              <h3 className="text-lg font-black text-[#15192c] leading-tight">{advisorName}</h3>
              <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Online Now</p>
            </div>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-[#C4A0AC] hover:bg-rose-100 transition-all">
            <X size={18} />
          </button>
        </div>

        {/* Chat Body */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6 no-scrollbar bg-[#FFF7F8]/30">
          {messages.map((m) => {
            const isMemberMessage = m.senderType === 'member' || m.sender === currentMember.name;
            const isSystemMessage = m.senderType === 'system';
            return (
            <motion.div key={m.id} initial={{ opacity: 0, x: isMemberMessage ? 20 : -20 }} animate={{ opacity: 1, x: 0 }}
              className={`flex ${isMemberMessage ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-5 rounded-[2rem] text-sm font-medium leading-relaxed shadow-sm ${
                isSystemMessage
                  ? 'bg-amber-50 text-[#7a5a1f] border border-amber-100'
                  : isMemberMessage
                  ? 'bg-[#15192c] text-white rounded-tr-none' 
                  : 'bg-white text-[#15192c] border border-rose-50 rounded-tl-none'
              }`}>
                {m.text}
                <p className={`text-[9px] mt-2 font-bold uppercase tracking-widest ${isMemberMessage ? 'text-white/40' : 'text-[#C4A0AC]'}`}>
                  {m.time}
                </p>
              </div>
            </motion.div>
            );
          })}
          <div ref={scrollRef} />
        </div>

        {/* Chat Input */}
        <div className="p-8 bg-white border-t border-rose-50">
          <div className="flex gap-4">
            <input 
              type="text" value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Type your message..."
              className="flex-1 px-6 py-4 rounded-2xl bg-rose-50/50 border-2 border-transparent focus:border-[#ff69b4] focus:bg-white outline-none text-sm font-medium text-[#15192c] transition-all"
            />
            <button 
              onClick={handleSend}
              disabled={!input.trim()}
              className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-lg ${input.trim() ? 'bg-[#ff69b4] text-white hover:brightness-110 shadow-rose-200' : 'bg-rose-100 text-[#C4A0AC] cursor-not-allowed'}`}>
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ── Event Detail Modal ───────────────────────────────────────────────────────
const EventModal = ({ event, onClose, onRegister }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 flex items-center justify-center bg-[#15192c]/70 backdrop-blur-md p-4">
    <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
      className="bg-white rounded-[3rem] p-10 w-full max-w-sm shadow-2xl relative">
      <button onClick={onClose}
        className="absolute top-6 right-6 w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-[#C4A0AC] hover:bg-rose-100 transition-all">
        <X size={18} />
      </button>
      <div className="w-14 h-14 rounded-2xl bg-rose-50 flex items-center justify-center text-[#ff69b4] mb-6">
        <Calendar size={26} />
      </div>
      <p className="text-[10px] font-black uppercase tracking-widest text-[#ff69b4] mb-2">Upcoming Event</p>
      <h3 className="text-2xl font-black text-[#15192c] mb-4 leading-tight">{event.title}</h3>
      <p className="text-sm text-[#9A8A8E] leading-relaxed mb-6">{event.desc}</p>
      <div className="space-y-3 mb-8">
        <div className="flex items-center gap-3">
          <Clock size={14} className="text-[#ff69b4]" />
          <span className="text-xs font-bold text-[#15192c]">{event.time}</span>
        </div>
        <div className="flex items-center gap-3">
          <MapPin size={14} className="text-[#ff69b4]" />
          <span className="text-xs font-bold text-[#15192c]">Online • Zoom Link Sent After Registration</span>
        </div>
      </div>
      <button onClick={onRegister}
        className="w-full py-4 bg-[#ff69b4] text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:brightness-110 transition-all shadow-lg">
        Register for Free ✨
      </button>
    </motion.div>
  </motion.div>
);

// ── Main Screen ──────────────────────────────────────────────────────────────
const RelationshipScreen = () => {
  const navigate = useNavigate();
  const currentMember = getCurrentMemberProfile();
  const [showDoctorModal, setShowDoctorModal] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [activeAdvisor, setActiveAdvisor] = useState('Dr. Sakshi Sharma');

  useEffect(() => {
    const syncAdvisor = () => {
      try {
        const sessions = JSON.parse(localStorage.getItem('hs_booked_sessions') || '[]');
        const latestMemberSession = sessions.find(
          (session) => (session.memberEmail || '').toLowerCase() === currentMember.email.toLowerCase()
        );
        if (latestMemberSession?.advisor) {
          setActiveAdvisor(latestMemberSession.advisor);
          return;
        }
      } catch (error) {
        // ignore and fallback
      }

      const threads = getAdvisorThreads();
      const memberThread = threads.find((thread) => thread.memberEmail?.toLowerCase() === currentMember.email.toLowerCase());
      if (memberThread?.advisor) {
        setActiveAdvisor(memberThread.advisor);
      }
    };

    syncAdvisor();
    window.addEventListener('storage', syncAdvisor);
    return () => window.removeEventListener('storage', syncAdvisor);
  }, [currentMember.email]);

  const advisorAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(activeAdvisor)}&background=D17B88&color=fff&size=200`;

  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

  const handleRegister = (eventTitle) => {
    setRegisteredEvents(prev => [...prev, eventTitle]);
    setSelectedEvent(null);
  };

  const learningTracks = [
    { title: 'The Art of Boundaries', desc: 'How to say no without guilt and maintain your energy.', icon: ShieldCheck, color: '#FDEEF1', text: '#D17B88' },
    { title: 'Healing from Heartbreak', desc: 'A gentle 21-day program to reclaim your joy.', icon: Heart, color: '#F5F1FE', text: '#9079C1' },
    { title: 'Conscious Communication', desc: 'Techniques for deeper connection and less conflict.', icon: MessageSquare, color: '#FFF9EE', text: '#CCAA3D' },
    { title: 'Radiant Self-Love', desc: 'The foundation for all other healthy relationships.', icon: Sparkles, color: '#FDEEF1', text: '#D17B88' },
  ];

  const upcomingEvents = [
    { title: 'The Power of Vulnerability', time: 'Tomorrow, 5 PM', desc: 'A live session on how opening up builds deeper, more meaningful connections with the people you love.', icon: <Heart size={14} /> },
    { title: 'Parenting Pod Workshop', time: 'Sunday, 11 AM', desc: 'A safe circle for mothers navigating the joys and challenges of raising children while maintaining their own identity.', icon: <Users size={14} /> },
    { title: 'Healing Your Attachment Style', time: 'Next Monday, 7 PM', desc: 'Understand anxious, avoidant, and secure attachment patterns and learn how to rewire them for healthier bonds.', icon: <Brain size={14} /> },
  ];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="w-full pb-20 px-4 pt-10">

      <AnimatePresence>
        {showDoctorModal && (
          <DoctorModal
            advisorName={activeAdvisor}
            onClose={() => setShowDoctorModal(false)}
            onBook={() => { setShowDoctorModal(false); navigate('/app/sessions'); }}
            onChat={() => { setShowDoctorModal(false); setShowChat(true); }}
          />
        )}
        {showChat && (
          <ExpertMessageModal advisorName={activeAdvisor} onClose={() => setShowChat(false)} />
        )}
        {selectedEvent && (
          <EventModal
            event={selectedEvent}
            onClose={() => setSelectedEvent(null)}
            onRegister={() => handleRegister(selectedEvent.title)}
          />
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.section variants={item} className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="space-y-1">
          <h2 className="text-4xl font-black tracking-tight text-[#15192c]">Relationship Sakhi 💞</h2>
          <span className="text-[11px] font-black uppercase tracking-[0.3em] text-[#C4A0AC]">Nurturing Beautiful Bonds</span>
        </div>
        <motion.button
          whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/app/sessions')}
          className="px-8 py-4 bg-[#15192c] text-white rounded-[2rem] text-xs font-black uppercase tracking-widest shadow-xl hover:bg-black transition-all">
          Book Counseling
        </motion.button>
      </motion.section>

      <main className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column */}
        <div className="lg:col-span-8 space-y-12">

          {/* Expert Highlight */}
          <motion.div variants={item}
            className="bg-gradient-to-br from-[#FDEEF1] to-[#FFF7F8] rounded-[3rem] p-10 md:p-14 border border-[#F5E6EA] relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#ff69b4]/5 rounded-full blur-[80px] -mr-32 -mt-32" />
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
              <div className="w-40 h-40 rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white shrink-0">
                <img
                  src={advisorAvatar}
                  alt={activeAdvisor}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#ff69b4]">Lead Consultant</span>
                  <div className="flex gap-0.5 text-amber-400">
                    {[1,2,3,4,5].map(i => <Star key={i} size={10} fill="currentColor" />)}
                  </div>
                </div>
                <h3 className="text-3xl font-black mb-4 tracking-tight text-[#15192c]">{activeAdvisor}</h3>
                <p className="text-sm text-[#6B5E63] mb-6 max-w-md font-medium leading-relaxed">
                  Your currently booked advisor for support sessions. Continue your conversation and follow-up directly from here.
                </p>
                <div className="flex gap-4 flex-wrap">
                  <motion.button
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={() => setShowChat(true)}
                    className="px-6 py-3 bg-[#ff69b4] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:brightness-110 transition-all">
                    Chat Now
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={() => setShowDoctorModal(true)}
                    className="px-6 py-3 bg-white border border-[#F5E6EA] text-[#15192c] rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-50 transition-all">
                    View Profile
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Learning Tracks */}
          <motion.section variants={item}>
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] mb-8 text-[#C4A0AC]">Growth Pathways</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {learningTracks.map((track, i) => (
                <motion.div key={i} whileHover={{ y: -6 }}
                  onClick={() => navigate('/app/learning')}
                  className="bg-white p-8 rounded-[2.5rem] border border-[#F5E6EA] shadow-sm hover:shadow-xl transition-all group cursor-pointer">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform"
                    style={{ backgroundColor: track.color, color: track.text }}>
                    <track.icon size={22} />
                  </div>
                  <h4 className="text-lg font-black mb-2 text-[#15192c]">{track.title}</h4>
                  <p className="text-xs font-bold leading-relaxed opacity-60 mb-6">{track.desc}</p>
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#ff69b4] flex items-center gap-1 group-hover:gap-2 transition-all">
                    Start Learning <ArrowRight size={12} />
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.section>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-4 space-y-10">

          {/* Community Card */}
          <motion.div variants={item}
            className="bg-[#15192c] rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden group cursor-pointer"
            onClick={() => navigate('/app/community')}
            whileHover={{ scale: 1.02 }}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#ff69b4]/10 rounded-full blur-3xl -mr-16 -mt-16" />
            <Users size={32} className="text-[#ff69b4] mb-6" />
            <h3 className="text-xl font-black mb-4 tracking-tight leading-tight">Join the Sakhi Support Group.</h3>
            <p className="text-[13px] text-white/50 mb-8 leading-relaxed">
              Connect with other women in a safe, moderated space to share experiences and find collective healing.
            </p>
            <button className="w-full py-4 bg-white/10 backdrop-blur rounded-2xl text-[9px] font-black uppercase tracking-widest border border-white/20 hover:bg-white/20 transition-all">
              Enter Community
            </button>
          </motion.div>

          {/* Upcoming Sessions */}
          <motion.div variants={item} className="bg-white rounded-[3rem] p-8 border border-[#F5E6EA] shadow-sm">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#C4A0AC] mb-6">Upcoming Events</h3>
            <div className="space-y-5">
              {upcomingEvents.map((event, i) => (
                <motion.div key={i} whileHover={{ x: 4 }}
                  onClick={() => setSelectedEvent(event)}
                  className="flex gap-4 group cursor-pointer">
                  <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-[#ff69b4] shrink-0">
                    {event.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-[13px] font-black text-[#15192c] group-hover:text-[#ff69b4] transition-colors leading-tight">
                      {event.title}
                    </h4>
                    <span className="text-[10px] font-bold text-[#C4A0AC]">{event.time}</span>
                    {registeredEvents.includes(event.title) && (
                      <span className="ml-2 text-[9px] font-black text-emerald-500 uppercase tracking-widest">✓ Registered</span>
                    )}
                  </div>
                  <ChevronRight size={14} className="text-[#C4A0AC] group-hover:text-[#ff69b4] transition-colors shrink-0 mt-1" />
                </motion.div>
              ))}
            </div>
            <button onClick={() => navigate('/app/sessions')}
              className="w-full mt-6 py-3 rounded-2xl border border-rose-100 text-[10px] font-black uppercase tracking-widest text-[#ff69b4] hover:bg-rose-50 transition-all">
              View All Sessions →
            </button>
          </motion.div>

          {/* Quick Tip */}
          <motion.div variants={item}
            className="p-6 bg-gradient-to-br from-rose-50 to-purple-50 rounded-[2.5rem] border border-rose-100">
            <p className="text-[9px] font-black uppercase tracking-widest text-[#ff69b4] mb-2">💡 Sakhi's Daily Tip</p>
            <p className="text-sm font-bold text-[#15192c] leading-relaxed">
              "Healthy relationships start with the one you have with yourself. Protect your peace first."
            </p>
          </motion.div>

        </div>
      </main>
    </motion.div>
  );
};

export default RelationshipScreen;
