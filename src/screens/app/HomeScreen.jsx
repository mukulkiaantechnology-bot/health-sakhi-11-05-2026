import React, { useState } from 'react';
import { 
  Sparkles, Play, BookOpen, Clock, ChevronRight, Heart, 
  Calendar, Star, ArrowRight, Activity, Smile, Frown, 
  Moon, Zap, Battery, Home, User, PlusCircle, MessageCircle,
  Apple, Droplets, Wind, ChevronLeft, CheckCircle2 as CheckIcon,
  Users, Trophy, X, Send, GraduationCap, Bell
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const HomeScreen = () => {
  const navigate = useNavigate();
  const [selectedMood, setSelectedMood] = useState(null);
  const [showMoodModal, setShowMoodModal] = useState(false);
  const [moodNotes, setMoodNotes] = useState('');
  const [isSubmittingMood, setIsSubmittingMood] = useState(false);
  
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [catStartIndex, setCatStartIndex] = useState(0);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  
  const [isBridging, setIsBridging] = useState(false);
  const [bridgeStep, setBridgeStep] = useState(0);

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const moods = [
    { icon: Smile, label: 'Happy',      color: '#CCAA3D', bg: '#FFF9EE', question: "What made you smile today, Meri Sakhi? ✨", suggestions: ['Achievement', 'Good Food', 'Nature', 'Friends'] },
    { icon: Frown, label: 'Sad',        color: '#9079C1', bg: '#F5F1FE', question: "I'm here for you. Want to talk about what's bothering you? 🌸", suggestions: ['Loneliness', 'Conflict', 'Unknown', 'Health'] },
    { icon: Moon,  label: 'Tired',      color: '#64748B', bg: '#F1F5F9', question: "You've worked hard. What drained your energy today? 🌙", suggestions: ['Work', 'Lack of Sleep', 'Socializing', 'Physical'] },
    { icon: Zap,   label: 'Stressed',   color: '#D17B88', bg: '#FDEEF1', question: "Let's breathe together. What's weighing on your mind? 🌿", suggestions: ['Deadlines', 'Family', 'Finance', 'Overthinking'] },
    { icon: Heart, label: 'Grateful',   color: '#059669', bg: '#ECFDF5', question: "The universe is kind. What are you thankful for? 🙏", suggestions: ['Support', 'Small Wins', 'Self Love', 'Life'] },
    { icon: Battery, label: 'Low Energy', color: '#D97706', bg: '#FFF7ED', question: "Your light is just dim, not gone. How are you feeling? 🔋", suggestions: ['Body Pain', 'Emotional', 'Recovery', 'Hunger'] },
  ];

  const categories = [
    { name: 'Women Health', icon: User, color: '#ff69b4', bg: '#FFF1F2' },
    { name: 'Heart Care', icon: Heart, color: '#ef4444', bg: '#FEF2F2' },
    { name: 'Mental Healing', icon: Sparkles, color: '#8b5cf6', bg: '#F5F3FF' },
    { name: 'Relationships', icon: MessageCircle, color: '#ec4899', bg: '#FDF2F8' },
    { name: 'Cravings', icon: Apple, color: '#10b981', bg: '#ECFDF5' },
  ];

  const [continueItems, setContinueItems] = useState([
    { title: 'The Mystery of Hunger', type: 'Video', progress: 65, duration: '15 min' },
    { title: 'Inner Healing Guide',   type: 'Book',  progress: 30, duration: '45 pgs' },
  ]);

  React.useEffect(() => {
    const userProgress = JSON.parse(localStorage.getItem('userProgress') || '{}');
    const completedBooks = JSON.parse(localStorage.getItem('completedBooks') || '[]');
    
    // Book titles mapping
    const bookTitles = {
      1: 'Hunger Mystery: Inner Healing',
      2: 'The Hormonal Roadmap',
      3: 'Mindful Sakhi: Peace Within',
      4: 'Heart-to-Heart Bonds',
      5: 'Digital Detox Guide'
    };

    const dynamicItems = [];
    
    // Add real book progress
    Object.entries(userProgress).forEach(([id, data]) => {
      if (bookTitles[id]) {
        const progress = parseInt(data.percent);
        dynamicItems.push({
          title: bookTitles[id],
          type: 'Book',
          progress: isNaN(progress) ? 0 : progress,
          duration: 'Interactive'
        });
      }
    });

    // If no progress found, keep some defaults but marked appropriately
    if (dynamicItems.length > 0) {
      // Add a default video if no real video progress tracking yet
      dynamicItems.push({ title: 'The Mystery of Hunger', type: 'Video', progress: 65, duration: '15 min' });
      setContinueItems(dynamicItems.slice(0, 3)); // Show top 3
    }
  }, []);

  const [mySessions, setMySessions] = useState([]);

  React.useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('hs_booked_sessions') || '[]');
    setMySessions(saved);
  }, []);

  const [customVideos, setCustomVideos] = useState([]);

  React.useEffect(() => {
    const loadCustom = () => {
      const saved = localStorage.getItem('hs_custom_content');
      if (saved) {
        const custom = JSON.parse(saved).filter(item => item.type === 'Video' && item.status === 'Published');
        // Map to match the dashboard format
        setCustomVideos(custom.map(v => ({
          title: v.title,
          duration: 'Custom',
          tag: v.cat,
          views: 'New',
          mediaUrl: v.mediaUrl,
          isCustom: true
        })));
      }
    };

    loadCustom();
    window.addEventListener('storage', loadCustom);
    return () => window.removeEventListener('storage', loadCustom);
  }, []);

  const allVideos = [
    ...customVideos,
    { title: 'PCOD & Hormones: Understanding Your Cycle', duration: '18 min', tag: 'Women Health', views: '12.4k' },
    { title: 'Heart Health: Daily Habits for a Stronger You', duration: '25 min', tag: 'Heart Care', views: '5.1k' },
    { title: 'Anxiety Relief: 10 Min Meditation', duration: '10 min', tag: 'Mental Healing', views: '20.2k' },
    { title: 'Building Healthy Boundaries in Love', duration: '15 min', tag: 'Relationships', views: '9.3k' },
    { title: 'Emotional Eating — Heal From Within', duration: '22 min', tag: 'Cravings', views: '8.2k' },
    { title: 'Pregnancy Care: First Trimester Guide', duration: '30 min', tag: 'Women Health', views: '14.8k' },
    { title: 'Stress Management: The Breathing Technique', duration: '12 min', tag: 'Mental Healing', views: '15.1k' },
  ];

  const featuredVideos = selectedCategory 
    ? allVideos.filter(v => v.tag === selectedCategory)
    : allVideos;

  const handleMoodClick = (mood) => {
    setSelectedMood(mood);
    setShowMoodModal(true);
  };

  const submitMoodPulse = () => {
    setIsSubmittingMood(true);
    setTimeout(() => {
      setIsSubmittingMood(false);
      setShowMoodModal(false);
      setMoodNotes('');
      if (selectedMood) {
        navigate(`/app/mood/${selectedMood.label.toLowerCase()}`);
      }
    }, 1500);
  };

  const handleOpenBridge = () => {
    setIsBridging(true);
    setBridgeStep(0);
    
    setTimeout(() => setBridgeStep(1), 1000); // Syncing Wellness Nodes...
    setTimeout(() => setBridgeStep(2), 2200); // Establishing Neural Link...
    setTimeout(() => setBridgeStep(3), 3200); // Bridge Connected 🌸
    setTimeout(() => {
      setIsBridging(false);
      navigate('/app/ai-sakhi');
    }, 4200);
  };

  const handleVideoClick = (video) => {
    setSelectedVideo(video);
    setShowVideoModal(true);
    
    // Sync with Deep Processing (Continue Journey)
    const newItem = { 
      title: video.title, 
      type: 'Video', 
      progress: 5, // Start with 5%
      duration: video.duration 
    };

    setContinueItems(prev => {
      const exists = prev.find(p => p.title === video.title);
      if (exists) return prev;
      return [newItem, ...prev].slice(0, 3);
    });

    // Save to localStorage
    const userProgress = JSON.parse(localStorage.getItem('userProgress') || '{}');
    userProgress[video.title] = { percent: 5, type: 'Video' };
    localStorage.setItem('userProgress', JSON.stringify(userProgress));
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="min-h-screen bg-[#F0F7FF] pb-24"
    >
      {/* Header */}
      <header className="pt-8 px-6 flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-black text-[#15192c] tracking-tight">Namaste, Priya <span className="text-[#ff69b4]">🌸</span></h1>
          <p className="text-xs font-bold text-[#C4A0AC] uppercase tracking-widest mt-1">Your Wellness Journey</p>
        </div>
        <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-[#15192c] border border-rose-50 hover:bg-rose-50 transition-colors">
          <Bell size={18} />
        </button>
      </header>

      {/* Daily Affirmation */}
      <motion.div variants={item} className="px-6 mb-8">
        <div className="bg-gradient-to-r from-[#15192c] to-[#2a3052] rounded-[2rem] p-6 relative overflow-hidden shadow-lg">
          <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
          <div className="relative z-10 flex flex-col gap-3">
             <div className="flex items-center gap-2 text-[#ff69b4]">
               <Sparkles size={16} />
               <span className="text-[10px] font-black uppercase tracking-widest">Daily Affirmation</span>
             </div>
             <p className="text-white font-serif italic text-lg leading-snug">"I am listening to my body, honoring its needs, and nurturing my soul today."</p>
          </div>
        </div>
      </motion.div>

      {/* Mood Check-in */}
      <motion.div variants={item} className="mb-8">
        <div className="px-6 flex items-center justify-between mb-4">
          <h3 className="text-sm font-black text-[#15192c] uppercase tracking-widest">How are you feeling?</h3>
        </div>
        <div className="flex overflow-x-auto no-scrollbar px-6 gap-4 pb-4">
          {moods.map((mood, idx) => (
            <motion.button 
              key={idx}
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleMoodClick(mood)}
              className="flex flex-col items-center gap-3 shrink-0"
            >
              <div 
                className="w-16 h-16 rounded-[1.5rem] flex items-center justify-center shadow-sm border border-white/50"
                style={{ background: mood.bg }}
              >
                <mood.icon size={28} style={{ color: mood.color }} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#9A8A8E]">{mood.label}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Continue Your Journey */}
      {continueItems.length > 0 && (
        <motion.div variants={item} className="px-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-black text-[#15192c] uppercase tracking-widest">Continue Journey</h3>
            <button onClick={() => navigate('/app/learning')} className="text-[10px] font-black text-[#ff69b4] uppercase tracking-widest">View All</button>
          </div>
          <div className="bg-white rounded-[2rem] p-5 shadow-sm border border-rose-50 flex items-center gap-4 cursor-pointer hover:shadow-md transition-all group" onClick={() => navigate('/app/books')}>
             <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center shrink-0 text-[#ff69b4]">
               {continueItems[0].type === 'Video' ? <Play size={20} fill="currentColor" /> : <BookOpen size={20} />}
             </div>
             <div className="flex-1">
               <span className="text-[9px] font-black uppercase tracking-widest text-[#C4A0AC] mb-1 block">{continueItems[0].type} • {continueItems[0].duration}</span>
               <h4 className="text-[#15192c] font-black text-sm group-hover:text-[#ff69b4] transition-colors">{continueItems[0].title}</h4>
               <div className="mt-3 h-1.5 bg-rose-50 rounded-full overflow-hidden">
                 <div className="h-full bg-[#ff69b4] rounded-full" style={{ width: `${continueItems[0].progress}%` }} />
               </div>
             </div>
          </div>
        </motion.div>
      )}

      {/* AI Sakhi Ecosystem */}
      <motion.div variants={item} className="px-6 mb-8">
         <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-black text-[#15192c] uppercase tracking-widest">Your AI Sakhis</h3>
            <button className="text-[10px] font-black text-[#C4A0AC] uppercase tracking-widest">Explore All</button>
         </div>
         <div className="grid grid-cols-2 gap-4">
            {[
              { name: 'Food Sakhi', icon: Apple, color: '#10b981', bg: '#ECFDF5', path: '/app/todo' },
              { name: 'Mental Health', icon: Sparkles, color: '#8b5cf6', bg: '#F5F3FF', path: '/app/mental-health' },
              { name: 'Relationships', icon: MessageCircle, color: '#ec4899', bg: '#FDF2F8', path: '/app/relationship' },
              { name: 'Sleep Sakhi', icon: Moon, color: '#6366f1', bg: '#EEF2FF', path: '/app/todo' }
            ].map((sakhi, i) => (
               <motion.div 
                 key={i}
                 whileHover={{ scale: 1.02 }}
                 whileTap={{ scale: 0.98 }}
                 onClick={() => navigate(sakhi.path)}
                 className="bg-white rounded-[2rem] p-5 shadow-sm border border-rose-50 cursor-pointer flex flex-col items-center text-center gap-3 group"
               >
                 <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: sakhi.bg }}>
                   <sakhi.icon size={20} style={{ color: sakhi.color }} />
                 </div>
                 <h4 className="text-xs font-black text-[#15192c] group-hover:text-[#ff69b4] transition-colors">{sakhi.name}</h4>
               </motion.div>
            ))}
         </div>
      </motion.div>

      {/* Quick Action / Upcoming Session (Floating) */}
      <div className="fixed bottom-6 left-6 right-6 z-40 max-w-md mx-auto">
        <div className="bg-[#15192c] rounded-[2rem] p-4 flex items-center justify-between shadow-2xl border border-white/10 backdrop-blur-md cursor-pointer hover:-translate-y-1 transition-transform" onClick={() => navigate('/app/sessions')}>
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#ff69b4]/20 rounded-2xl flex items-center justify-center text-[#ff69b4]">
                 <Calendar size={20} />
              </div>
              <div>
                 <span className="text-[9px] font-black uppercase tracking-widest text-[#ff69b4]">Upcoming Session</span>
                 <h4 className="text-white font-black text-sm">Consultation with Dr. Ananya</h4>
                 <p className="text-[10px] text-white/60 font-bold mt-0.5">Today, 4:00 PM</p>
              </div>
           </div>
           <button className="w-10 h-10 bg-[#ff69b4] text-white rounded-2xl flex items-center justify-center shadow-lg shadow-[#ff69b4]/30 shrink-0">
              <ChevronRight size={20} />
           </button>
        </div>
      </div>

      {/* ── Mood Interaction Modal ── */}
      <AnimatePresence>
        {showMoodModal && selectedMood && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowMoodModal(false)} className="absolute inset-0 bg-[#15192c]/40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} className="w-full max-w-lg bg-white rounded-[3rem] p-10 relative z-10 shadow-2xl overflow-hidden text-center">
              <div className="absolute top-0 right-0 w-32 h-32 bg-rose-50 rounded-full blur-3xl -mr-16 -mt-16" />
              
              <button onClick={() => setShowMoodModal(false)} className="absolute top-8 right-8 text-[#C4A0AC] hover:text-[#15192c] transition-colors"><X size={20} /></button>
              
              <div className="relative z-10 space-y-8">
                <div className="space-y-4">
                  <div 
                    className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto shadow-inner"
                    style={{ background: selectedMood.bg }}
                  >
                    <selectedMood.icon size={40} style={{ color: selectedMood.color }} />
                  </div>
                  <h3 className="text-2xl font-black text-[#15192c] tracking-tight">{selectedMood.question}</h3>
                </div>

                <div className="flex flex-wrap justify-center gap-3">
                  {selectedMood.suggestions.map(s => (
                    <button 
                      key={s} 
                      onClick={() => setMoodNotes(prev => prev ? prev + ', ' + s : s)}
                      className="px-6 py-3 bg-rose-50/50 border border-rose-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-[#15192c] hover:bg-[#ff69b4] hover:text-white transition-all shadow-sm"
                    >
                      {s}
                    </button>
                  ))}
                </div>

                <div className="relative">
                  <textarea 
                    value={moodNotes}
                    onChange={(e) => setMoodNotes(e.target.value)}
                    placeholder="Tell Sakhi more..." 
                    className="w-full h-32 p-6 bg-rose-50/30 border border-rose-100 rounded-3xl text-sm font-medium outline-none focus:border-[#ff69b4] transition-all resize-none"
                  />
                </div>

                <button 
                  onClick={submitMoodPulse}
                  disabled={isSubmittingMood}
                  className="w-full py-5 bg-[#ff69b4] text-white rounded-[1.5rem] font-black uppercase tracking-widest text-[10px] shadow-xl shadow-rose-100/50 flex items-center justify-center gap-2"
                >
                  {isSubmittingMood ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>Log Mood Pulse <Send size={14} /></>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      {/* ── AI Bridge Modal ── */}
      <AnimatePresence>
        {isBridging && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-[#15192c]/80 backdrop-blur-xl" 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }} 
              className="relative z-10 flex flex-col items-center justify-center text-center max-w-md w-full"
            >
              <div className="relative w-40 h-40 mb-12 flex items-center justify-center">
                 {/* Outer rings */}
                 <motion.div 
                   animate={{ rotate: 360, scale: [1, 1.1, 1] }} 
                   transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                   className="absolute inset-0 rounded-full border border-[#ff69b4]/30 border-t-[#ff69b4] border-b-[#ff69b4]" 
                 />
                 <motion.div 
                   animate={{ rotate: -360, scale: [1, 1.2, 1] }} 
                   transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                   className="absolute inset-4 rounded-full border border-white/20 border-l-white border-r-white" 
                 />
                 
                 {/* Core glow */}
                 <motion.div 
                   animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.5, 1, 0.5] }} 
                   transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                   className="absolute inset-10 bg-[#ff69b4] rounded-full blur-xl" 
                 />
                 
                 {/* Icon */}
                 <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center relative z-10 shadow-[0_0_40px_rgba(255,105,180,0.8)]">
                    <Sparkles size={32} className="text-[#ff69b4]" />
                 </div>
              </div>

              <div className="h-20 flex items-center justify-center">
                 <AnimatePresence mode="wait">
                    {bridgeStep === 0 && (
                      <motion.h2 key="step0" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="text-2xl md:text-3xl font-black text-white tracking-tight drop-shadow-lg">Initiating AI Bridge...</motion.h2>
                    )}
                    {bridgeStep === 1 && (
                      <motion.div key="step1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="text-center">
                        <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight drop-shadow-lg">Syncing Wellness Nodes</h2>
                        <span className="text-[#ff69b4] animate-pulse block text-[10px] md:text-xs font-black uppercase tracking-[0.3em] mt-3 drop-shadow-md">Connecting to Health Core</span>
                      </motion.div>
                    )}
                    {bridgeStep === 2 && (
                      <motion.h2 key="step2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="text-2xl md:text-3xl font-black text-[#ff69b4] tracking-tight drop-shadow-lg">Establishing Neural Link...</motion.h2>
                    )}
                    {bridgeStep === 3 && (
                      <motion.h2 key="step3" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.1 }} className="text-3xl md:text-4xl font-black text-white tracking-tight drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">Bridge Connected 🌸</motion.h2>
                    )}
                 </AnimatePresence>
              </div>

              {/* Progress Bar */}
              <div className="w-full max-w-[240px] h-1 bg-white/10 rounded-full mt-12 overflow-hidden mx-auto relative">
                 <motion.div 
                   initial={{ width: '0%' }}
                   animate={{ width: bridgeStep === 0 ? '25%' : bridgeStep === 1 ? '50%' : bridgeStep === 2 ? '85%' : '100%' }}
                   transition={{ duration: 0.8, ease: "easeInOut" }}
                   className="absolute top-0 left-0 h-full bg-[#ff69b4] rounded-full shadow-[0_0_10px_#ff69b4]"
                 />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      {/* ── Video Player Modal ── */}
      <AnimatePresence>
        {showVideoModal && selectedVideo && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-12">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowVideoModal(false)} className="absolute inset-0 bg-[#15192c]/60 backdrop-blur-md" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="w-full max-w-5xl bg-white rounded-[2.5rem] md:rounded-[3rem] overflow-hidden relative z-10 shadow-2xl flex flex-col md:flex-row max-h-[90vh]">
              
              {/* Video Player Area */}
              <div className="flex-[1.5] bg-black relative group min-h-[300px] md:min-h-0">
                <video 
                  key={selectedVideo.title}
                  className="w-full h-full object-cover"
                  autoPlay 
                  muted 
                  loop 
                  playsInline
                  controls
                >
                  <source src={selectedVideo.mediaUrl || "https://vjs.zencdn.net/v/oceans.mp4"} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                {/* Visual Backdrop for Video Info Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-8 left-8 text-white z-10">
                   <span className="px-3 py-1 bg-[#ff69b4] rounded-lg text-[9px] font-black uppercase tracking-widest mb-2 inline-block shadow-lg">{selectedVideo.tag}</span>
                   <h3 className="text-xl md:text-2xl font-black drop-shadow-md">{selectedVideo.title}</h3>
                </div>
              </div>

              {/* Sidebar Info */}
              <div className="w-full md:w-96 bg-white p-6 md:p-10 flex flex-col justify-between border-l border-rose-50 overflow-y-auto custom-scrollbar">
                 <div className="space-y-6 md:space-y-8">
                    <div className="flex items-center justify-between">
                       <h4 className="text-[10px] font-black uppercase tracking-widest text-[#C4A0AC]">Content Detail</h4>
                       <button onClick={() => setShowVideoModal(false)} className="text-[#C4A0AC] hover:text-[#15192c] transition-colors"><X size={20} /></button>
                    </div>
                    
                    <div className="space-y-4">
                       <p className="text-xs font-bold text-[#15192c] leading-relaxed italic">"Sakhi, this session is designed to help you align with your body's natural rhythm."</p>
                       <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-3 text-[#C4A0AC]">
                             <Clock size={14} />
                             <span className="text-[10px] font-bold uppercase tracking-widest">{selectedVideo.duration} Session</span>
                          </div>
                          <div className="flex items-center gap-3 text-[#ff69b4]">
                             <Sparkles size={14} />
                             <span className="text-[10px] font-bold uppercase tracking-widest">+50 Potential Coins</span>
                          </div>
                       </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-100">
                       <p className="text-[10px] font-bold text-[#15192c] mb-2 uppercase tracking-widest">Key Takeaways</p>
                       <ul className="space-y-2">
                          {['Mindful Breathing', 'Hormonal Balance', 'Self-Awareness'].map(t => (
                            <li key={t} className="flex items-center gap-2 text-[9px] font-bold text-[#9A8A8E]">
                               <div className="w-1 h-1 rounded-full bg-[#ff69b4]" /> {t}
                            </li>
                          ))}
                       </ul>
                    </div>
                 </div>

                 <button 
                   onClick={() => setShowVideoModal(false)}
                   className="w-full py-4 bg-[#15192c] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#ff69b4] transition-all shadow-xl mt-8"
                 >
                    Mark as Completed
                 </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default HomeScreen;
