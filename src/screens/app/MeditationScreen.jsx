import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Clock, 
  Heart, 
  Sparkles, 
  ArrowRight, 
  Activity, 
  Zap, 
  Pause, 
  X, 
  ChevronLeft,
  Volume2,
  Wind,
  Moon,
  Sun,
  Coffee,
  Brain,
  ShieldCheck,
  CheckCircle2,
  Forward,
  Rewind,
  VolumeX,
  Share2,
  MessageSquareQuote,
  Stethoscope,
  Volume1,
  Waves
} from 'lucide-react';

// --- Global Data with Videos for Every Session ---
const CATEGORIES = [
  { id: 'all', label: 'All', icon: Sparkles },
  { id: 'health', label: 'Health', icon: Stethoscope },
  { id: 'relax', label: 'Relax', icon: Wind },
  { id: 'sleep', label: 'Sleep', icon: Moon },
  { id: 'focus', label: 'Focus', icon: Brain },
  { id: 'stress', label: 'Stress', icon: Activity },
];

const MED_SESSIONS = [
  { 
    id: 1,
    title: 'Morning Zenith', 
    duration: 10, 
    category: 'focus',
    color: '#0EA5E9', 
    icon: Sun,
    image: 'https://images.pexels.com/photos/3759657/pexels-photo-3759657.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    video: 'https://player.vimeo.com/external/494291848.sd.mp4?s=9106090e5436671a53c3065b93e4d9c7923485&profile_id=164',
    description: 'A morning journey to align your vision and focus your energy.',
    technique: 'Visual Alignment',
    guidePhases: [
      { trigger: 0, text: "Welcome to your morning clarity session.", phase: "Introduction" },
      { trigger: 10, text: "Inhale the golden light. Feel it filling your body.", phase: "Breathing" },
      { trigger: 30, text: "Focus your mind on one single point of success.", phase: "Intention" },
    ]
  },
  { 
    id: 2,
    title: 'Deep Forest Rest', 
    duration: 25, 
    category: 'sleep',
    color: '#6366F1', 
    icon: Moon,
    image: 'https://images.pexels.com/photos/15286/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    video: 'https://player.vimeo.com/external/517729232.sd.mp4?s=d6e4dfdf9a8d9bfd7e98d9a8e8f8a8f8a8f8a&profile_id=164',
    description: 'Drift away into a deep, misty forest for restorative sleep.',
    technique: 'PNS Activation',
    guidePhases: [
      { trigger: 0, text: "Allow your body to sink deeply into your bed.", phase: "Relaxation" },
      { trigger: 15, text: "Imagine walking on a path of soft, green moss.", phase: "Journey" },
      { trigger: 45, text: "Total peace is now yours. Drift into dreams.", phase: "Sleep" },
    ]
  },
  { 
    id: 3,
    title: 'Anxiety Release', 
    duration: 15, 
    category: 'stress',
    color: '#EC4899', 
    icon: Activity,
    image: 'https://images.pexels.com/photos/312839/pexels-photo-312839.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    video: 'https://player.vimeo.com/external/371433846.sd.mp4?s=23118cf23337909307730e206085a6a6f1d3c05&profile_id=164',
    description: 'Cool your mind using the rhythm of water and stones.',
    technique: 'Box Breathing',
    guidePhases: [
      { trigger: 0, text: "You are safe. Everything is as it should be.", phase: "Grounding" },
      { trigger: 5, text: "Inhale for four counts. One, two, three, four.", phase: "Inhale" },
      { trigger: 9, text: "Hold for four. Feel the stillness within.", phase: "Hold" },
    ]
  },
  { 
    id: 4,
    title: 'Immune System Boost', 
    duration: 12, 
    category: 'health',
    color: '#10B981', 
    icon: Stethoscope,
    image: 'https://images.pexels.com/photos/1051838/pexels-photo-1051838.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    video: 'https://player.vimeo.com/external/432042777.sd.mp4?s=734568686d04fc49f50f24e390c50ceb1a9e3e7f&profile_id=164',
    description: 'Visualize cellular energy repairing and protecting your body.',
    technique: 'Neural Scan',
    guidePhases: [
      { trigger: 0, text: "Initiating biological visualization sequence.", phase: "Start" },
      { trigger: 10, text: "See a healing light scanning your entire system.", phase: "Healing" },
      { trigger: 30, text: "Your natural defenses are reaching peak power.", phase: "Immunity" },
    ]
  },
  { 
    id: 5,
    title: 'Rainforest Calm', 
    duration: 20, 
    category: 'relax',
    color: '#10B981', 
    icon: Wind,
    image: 'https://images.pexels.com/photos/4419742/pexels-photo-4419742.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    video: 'https://player.vimeo.com/external/354722511.sd.mp4?s=4a3d4679780097788448ec6f43702a0a2333b28b&profile_id=164',
    description: 'A deep sensory journey through a lush tropical landscape.',
    technique: 'Sensory Immersion',
    guidePhases: [
      { trigger: 0, text: "Take a deep breath of fresh, forest air.", phase: "Immersion" },
      { trigger: 20, text: "Listen to the distant sounds of rain and life.", phase: "Sensory" },
    ]
  },
  { 
    id: 6,
    title: 'Zen Workspace', 
    duration: 5, 
    category: 'focus',
    color: '#F59E0B', 
    icon: Coffee,
    image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=2000',
    video: null, 
    description: 'A quick reset to bring total clarity back to your work.',
    technique: 'Neural Hub Reset',
    guidePhases: [
      { trigger: 0, text: "Focus your eyes on the still image before you.", phase: "Focus" },
      { trigger: 10, text: "Allow your thoughts to become as steady as the photo.", phase: "Stability" },
    ]
  },
  { 
    id: 7,
    title: 'Tidal Relaxation', 
    duration: 15, 
    category: 'relax',
    color: '#0EA5E9', 
    icon: Waves,
    image: 'https://images.pexels.com/photos/1001633/pexels-photo-1001633.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    video: 'https://player.vimeo.com/external/394467389.sd.mp4?s=4a3d4679780097788448ec6f43702a0a2333b28b&profile_id=164',
    description: 'Let the rhythm of the ocean tides wash away your fatigue.',
    technique: 'Oceanic Flow',
    guidePhases: [
      { trigger: 0, text: "Watch the waves. Breathe in as they come in.", phase: "Sync" },
      { trigger: 20, text: "Breathe out as they pull back into the sea.", phase: "Tidal" },
    ]
  },
  { 
    id: 8,
    title: 'Heart Awakening', 
    duration: 12, 
    category: 'relax',
    color: '#EC4899', 
    icon: Heart,
    image: 'https://images.pexels.com/photos/2549229/pexels-photo-2549229.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    video: 'https://player.vimeo.com/external/403780362.sd.mp4?s=d01072979268681283d72605f6c8d17b186b86e8&profile_id=164',
    description: 'Invite unconditional peace into your heart through light.',
    technique: 'Compassion Bloom',
    guidePhases: [
      { trigger: 0, text: "Soften your chest. Feel your heart-rate slowing.", phase: "Opening" },
      { trigger: 15, text: "Imagine a warm lotus opening in your heart.", phase: "Bloom" },
    ]
  }
];

const MeditationScreen = () => {
  const [activeView, setActiveView] = useState('browse'); 
  const [selectedSession, setSelectedSession] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [totalMinutesToday, setTotalMinutesToday] = useState(124);
  const [isMuted, setIsMuted] = useState(false);
  const [customSessions, setCustomSessions] = useState([]);
  const videoRef = useRef(null);

  // --- Real-time Sync with Admin Hub ---
  const fetchCustomContent = useCallback(() => {
    const saved = localStorage.getItem('hs_sakhi_content');
    if (saved) {
      const allContent = JSON.parse(saved);
      const meditationContent = allContent
        .filter(item => item.tab === 'meditation' && item.status === 'Published')
        .map(item => ({
          ...item,
          id: `custom-${item.id}`,
          image: item.mediaUrl || 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=2000',
          video: item.mediaUrl, // If it's a video file
          color: '#15192c',
          icon: Sparkles,
          technique: item.category || 'Guided Session',
          guidePhases: [
            { trigger: 0, text: `Welcome to this ${item.title} session.`, phase: "Introduction" },
            { trigger: 10, text: item.description, phase: "Guidance" }
          ]
        }));
      setCustomSessions(meditationContent);
    }
  }, []);

  useEffect(() => {
    fetchCustomContent();
    window.addEventListener('storage', fetchCustomContent);
    return () => window.removeEventListener('storage', fetchCustomContent);
  }, [fetchCustomContent]);

  const allSessions = useMemo(() => {
    return [...customSessions, ...MED_SESSIONS];
  }, [customSessions]);

  const filteredSessions = useMemo(() => {
    if (activeCategory === 'all') return allSessions;
    return allSessions.filter(s => s.category?.toLowerCase() === activeCategory.toLowerCase());
  }, [activeCategory, allSessions]);

  const activePhase = useMemo(() => {
    if (!selectedSession || !selectedSession.guidePhases) return { text: "Focusing...", phase: "Normal" };
    const elapsed = (selectedSession.duration * 60) - timeRemaining;
    const active = [...selectedSession.guidePhases].reverse().find(p => elapsed >= p.trigger);
    return active || selectedSession.guidePhases[0];
  }, [selectedSession, timeRemaining]);

  // --- Voice (TTS) Logic ---
  useEffect(() => {
    if (isPlaying && activePhase.text && !isMuted) {
      const utterance = new SpeechSynthesisUtterance(activePhase.text);
      utterance.rate = 0.85;
      utterance.volume = 0.8;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    }
  }, [activePhase.text, isPlaying, isMuted]);

  useEffect(() => {
    let interval;
    if (isPlaying && timeRemaining > 0) {
      interval = setInterval(() => setTimeRemaining(prev => prev - 1), 1000);
      if (videoRef.current) videoRef.current.play().catch(() => {}); 
    } else {
      clearInterval(interval);
      if (videoRef.current) videoRef.current.pause();
    }
    return () => clearInterval(interval);
  }, [isPlaying, timeRemaining]);

  const startSession = (session) => {
    setSelectedSession(session);
    setTimeRemaining(session.duration * 60);
    setActiveView('player');
    setIsPlaying(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closePlayer = () => {
    setIsPlaying(false);
    setActiveView('browse');
    setSelectedSession(null);
    window.speechSynthesis.cancel();
  };

  const skipTime = (seconds) => {
    setTimeRemaining(prev => Math.max(0, Math.min(prev + seconds, selectedSession.duration * 60)));
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full px-4 py-8 min-h-screen bg-[#FDF7F8] font-sans">
      
      {/* Header */}
      <header className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#15192c] rounded-2xl flex items-center justify-center text-white shadow-xl shadow-rose-950/20">
             <Sparkles size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-[#15192c] leading-none mb-1">Health Sakhi</h1>
            <p className="text-[10px] font-black uppercase text-[#C4A0AC] tracking-[0.2em]">Guided Wellness Platform</p>
          </div>
        </div>
        <div className="bg-white border border-[#F5E6EA] py-2 px-6 rounded-2xl flex items-center gap-3">
           <Clock size={16} className="text-rose-500" />
           <span className="text-lg font-black text-[#15192c]">{totalMinutesToday}m Today</span>
        </div>
      </header>

      <AnimatePresence mode="wait">
        
        {/* --- DISCOVERY HUB --- */}
        {activeView === 'browse' && (
          <motion.main key="browse" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-8">
               <nav className="flex items-center gap-2 overflow-x-auto pb-4 no-scrollbar">
                  {(() => {
                    // Combine static and custom categories
                    const customCats = [...new Set(customSessions.map(s => s.category?.toLowerCase()))].filter(Boolean);
                    const allCatIds = [...new Set([...CATEGORIES.map(c => c.id), ...customCats])];
                    
                    return allCatIds.map(catId => {
                      const staticCat = CATEGORIES.find(c => c.id === catId);
                      return (
                        <button
                          key={catId}
                          onClick={() => setActiveCategory(catId)}
                          className={`flex items-center gap-2 px-6 py-4 rounded-full text-[11px] font-black uppercase tracking-widest transition-all ${
                            activeCategory === catId ? 'bg-[#15192c] text-white shadow-xl translate-y-[-2px]' : 'bg-white text-[#C4A0AC] border border-[#F5E6EA] hover:bg-rose-50'
                          }`}
                        >
                          {staticCat?.icon ? <staticCat.icon size={14} /> : <Sparkles size={14} />}
                          {staticCat?.label || catId.charAt(0).toUpperCase() + catId.slice(1)}
                        </button>
                      );
                    });
                  })()}
               </nav>

               <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  {filteredSessions.map((session) => (
                    <motion.div
                      key={session.id}
                      whileHover={{ y: -6 }}
                      onClick={() => startSession(session)}
                      className="bg-white rounded-[40px] border border-[#F5E6EA] cursor-pointer shadow-sm group overflow-hidden"
                    >
                       <div className="h-56 relative overflow-hidden">
                          <img src={session.image} className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-700" alt="" />
                          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
                          <div className="absolute top-6 left-6 p-4 bg-white/20 backdrop-blur-xl rounded-2xl text-white shadow-2xl border border-white/20">
                             <session.icon size={24} />
                          </div>
                          <div className="absolute bottom-6 right-6 flex items-center gap-2 bg-rose-500/90 text-white text-[9px] font-black uppercase px-3 py-1.5 rounded-full shadow-lg">
                             <Volume1 size={14} /> Video Sync
                          </div>
                       </div>
                       <div className="p-9">
                          <h4 className="text-2xl font-black text-[#15192c] mb-1 group-hover:text-rose-500 transition-colors">{session.title}</h4>
                          <p className="text-[10px] font-black uppercase tracking-widest text-[#C4A0AC] mb-8">{session.technique}</p>
                          <div className="flex items-center justify-between pt-6 border-t border-rose-50">
                             <span className="text-[11px] font-black text-rose-500">Master Level Session</span>
                             <div className="w-10 h-10 bg-rose-50 rounded-full flex items-center justify-center text-rose-500 group-hover:bg-rose-500 group-hover:text-white transition-all">
                                <ArrowRight size={20} />
                             </div>
                          </div>
                       </div>
                    </motion.div>
                  ))}
               </div>
            </div>

            <aside className="lg:col-span-4 space-y-8">
               <section className="bg-white rounded-[40px] p-10 border border-[#F5E6EA] shadow-xl">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#C4A0AC] mb-8">System Analytics</h3>
                  <div className="p-6 bg-rose-50 rounded-3xl mb-8 flex items-center gap-4">
                     <Volume2 size={24} className="text-rose-500 animate-pulse" />
                     <p className="text-xs font-bold text-[#15192c]/80">AI Audio Guide is currently active for playback.</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div className="p-5 bg-[#FDF7F8] rounded-[24px] text-center border border-rose-50">
                        <Zap size={24} className="text-rose-400 mx-auto mb-2" />
                        <p className="text-2xl font-black text-[#15192c]">12d</p>
                        <p className="text-[9px] font-black uppercase text-[#C4A0AC]">Streak</p>
                     </div>
                     <div className="p-5 bg-[#FDF7F8] rounded-[24px] text-center border border-rose-50">
                        <Heart size={24} className="text-indigo-400 mx-auto mb-2" />
                        <p className="text-2xl font-black text-[#15192c]">Lvl 4</p>
                        <p className="text-[9px] font-black uppercase text-[#C4A0AC]">Zen</p>
                     </div>
                  </div>
               </section>
               <div className="p-9 bg-white rounded-[40px] text-[#15192c] border border-[#F5E6EA] shadow-xl relative overflow-hidden group">
                  <Sparkles className="absolute top-8 right-8 text-rose-500/5 group-hover:scale-125 transition-transform" size={60} />
                  <p className="text-base font-medium italic mb-4 leading-relaxed">"124 minutes of daily wellness reached. Every video guide completes your journey."</p>
                  <div className="w-10 h-1 bg-rose-500 rounded-full" />
               </div>
            </aside>
          </motion.main>
        )}

        {/* --- SPLIT-PANEL PLAYER WITH VIDEO & VOICE --- */}
        {activeView === 'player' && selectedSession && (
          <motion.main key="player" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="w-full relative z-20">
            <div className="bg-white rounded-[50px] border border-[#F5E6EA] shadow-2xl overflow-hidden flex flex-col lg:flex-row min-h-[600px] relative">
               
               {/* Video Side with Subtitles */}
               <div className="lg:w-[60%] flex flex-col items-center justify-center bg-black relative p-12">
                  <div className="absolute inset-0 overflow-hidden">
                     {selectedSession.video ? (
                        <video ref={videoRef} src={selectedSession.video} autoPlay muted loop playsInline className="w-full h-full object-cover opacity-60" />
                     ) : (
                        <img src={selectedSession.image} className="w-full h-full object-cover opacity-80" alt="" />
                     )}
                     <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
                  </div>

                  <div className="relative z-20 w-full text-center mt-auto">
                     <AnimatePresence mode="wait">
                        <motion.div key={activePhase.text} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="px-8 py-6 bg-black/40 backdrop-blur-2xl rounded-[30px] border border-white/5 shadow-2xl inline-block max-w-[90%]">
                           <p className="text-xl sm:text-2xl font-black text-white leading-tight">{activePhase.text}</p>
                        </motion.div>
                     </AnimatePresence>
                  </div>

                  <div className="absolute bottom-10 inset-x-12 z-20">
                     <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                        <motion.div className="h-full bg-rose-500 shadow-[0_0_10px_#f43f5e]" initial={{ width: "0%" }} animate={{ width: `${(1 - timeRemaining / (selectedSession.duration * 60)) * 100}%` }} />
                     </div>
                  </div>
               </div>

               {/* Info & Controls */}
               <div className="lg:w-[40%] p-10 md:p-14 flex flex-col justify-between bg-white relative">
                  <header className="flex items-center justify-between mb-10">
                     <button onClick={closePlayer} className="flex items-center gap-2 bg-rose-50 text-rose-500 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all shadow-sm"><ChevronLeft size={18} /> Exit Guide</button>
                     <div className="w-9 h-9 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-500 shadow-sm"><Volume2 size={18} /></div>
                  </header>

                  <div className="space-y-12">
                    <div>
                       <p className="text-[10px] font-black uppercase tracking-[0.4em] text-rose-500 mb-2">{selectedSession.category} session</p>
                       <h2 className="text-4xl font-black text-[#15192c] tracking-tight leading-none mb-6">{selectedSession.title}</h2>
                       <div className="flex items-center gap-3">
                          <span className="px-4 py-2 bg-[#FDF7F8] border border-rose-100 text-rose-500 rounded-[14px] text-[10px] font-black uppercase tracking-widest">{activePhase.phase} Engaged</span>
                       </div>
                    </div>

                    <div className="space-y-4">
                       <p className="text-[10px] font-black uppercase text-[#C4A0AC] tracking-widest">Guide Remaining</p>
                       <div className="flex items-baseline gap-2">
                          <span className="text-6xl font-black text-[#15192c] tabular-nums">{formatTime(timeRemaining)}</span>
                       </div>
                    </div>
                  </div>

                  <footer className="space-y-14 mt-12">
                     <div className="flex items-center justify-center gap-10">
                        <button onClick={() => skipTime(-10)} className="text-[#C4A0AC] hover:text-[#15192c] transition-all"><Rewind size={36} /></button>
                        <button onClick={() => setIsPlaying(!isPlaying)} className="w-24 h-24 bg-[#15192c] text-white rounded-full flex items-center justify-center shadow-[0_20px_50px_-10px_rgba(45,21,32,0.4)] hover:scale-105 active:scale-95 transition-all">
                           {isPlaying ? <Pause size={44} fill="currentColor" /> : <Play size={44} fill="currentColor" className="ml-2" />}
                        </button>
                        <button onClick={() => skipTime(10)} className="text-[#C4A0AC] hover:text-[#15192c] transition-all"><Forward size={36} /></button>
                     </div>

                     <div className="bg-[#FDF7F8] p-6 rounded-[32px] border border-rose-50 flex items-center justify-between shadow-inner">
                        <div className="flex items-center gap-4">
                           <div className="p-4 bg-white rounded-2xl text-rose-500 shadow-md">
                              <Volume2 size={24} className={isPlaying ? "animate-pulse" : ""} />
                           </div>
                           <div>
                              <p className="text-[9px] font-black uppercase text-[#C4A0AC] tracking-widest">Coaching Engine</p>
                              <p className="text-[11px] font-black text-[#15192c]">Dynamic AI Voice</p>
                           </div>
                        </div>
                        <button onClick={() => setIsMuted(!isMuted)} className={`transition-all ${isMuted ? 'text-[#C4A0AC]' : 'text-rose-500 scale-110'}`}><VolumeX size={30} /></button>
                     </div>
                  </footer>
               </div>
            </div>
          </motion.main>
        )}

      </AnimatePresence>
    </div>
  );
};

export default MeditationScreen;
