import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scissors, Star, Heart, Sparkles, ArrowRight, Play, CheckCircle2, ShoppingBag, X, Clock, ShieldCheck, Zap, BookOpen } from 'lucide-react';

const GROOMING_TUTORIAL_VIDEO_URL = 'https://ik.imagekit.io/1e6dbfyxy/Zero-Cost%20Skincare%20Hacks%20For%20Glowing%20Skin%20%20DIY%20Beauty%20Secrets%20from%20Your%20Kitchen%20%20BebeautifulIn%20-%20BeBeautiful%20(1080p,%20h264).mp4';

// ── Video Player Modal ──────────────────────────────────────────────────────
const VideoModal = ({ video, onClose }) => {
  const videoRef = useRef(null);

  const handleFullscreen = () => {
    if (!videoRef.current) return;
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[80] flex items-start justify-center bg-[#15192c]/90 backdrop-blur-xl px-3 pb-6 pt-32 md:px-8 md:pb-10 md:pt-36 overflow-y-auto">
      <motion.div initial={{ scale: 0.96, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.96, y: 20 }}
        className="relative w-full max-w-6xl bg-white rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl flex flex-col lg:flex-row lg:gap-3 max-h-[calc(100vh-7.5rem)]">
        <button onClick={onClose} aria-label="Close video modal"
          className="absolute top-5 right-5 z-20 w-10 h-10 rounded-full bg-white/85 border border-rose-100 flex items-center justify-center text-[#15192c] hover:bg-white transition-all shadow-md">
          <X size={20} />
        </button>
        <div className="flex-1 bg-black relative flex items-center justify-center min-h-[260px] md:min-h-[420px]">
          <video ref={videoRef} autoPlay controls className="w-full h-full object-contain">
            <source src={GROOMING_TUTORIAL_VIDEO_URL} type="video/mp4" />
          </video>
        </div>
        <div className="w-full lg:w-80 p-6 pt-9 md:p-8 md:pt-12 flex flex-col border-t lg:border-t-0 lg:border-l-0 gap-6">
          <div className="space-y-6 mt-2 md:mt-4">
            <span className="px-3 py-1 bg-rose-50 text-[#ff69b4] rounded-lg text-[9px] font-black uppercase tracking-widest">{video.type || 'Tutorial'}</span>
            <h3 className="text-2xl font-black text-[#15192c] leading-tight">{video.title}</h3>
            <p className="text-xs font-medium text-[#9A8A8E] leading-relaxed">
              Sakhi, this minimalist routine is perfect for busy mornings. Focus on fresh skin and confident vibes.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-[10px] font-bold text-[#C4A0AC] uppercase tracking-widest">
                <Clock size={14} /> 5 Minute Session
              </div>
              <div className="flex items-center gap-3 text-[10px] font-bold text-[#ff69b4] uppercase tracking-widest">
                <Sparkles size={14} /> +20 Glow Points
              </div>
            </div>
          </div>
          <div className="space-y-3 mt-auto pb-2 md:pb-3">
            <button onClick={handleFullscreen} className="w-full py-3 border border-rose-200 text-[#15192c] rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-50 transition-all">
              Open Fullscreen
            </button>
            <button onClick={onClose} className="w-full py-4 bg-[#15192c] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all">
              Complete Tutorial
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ── Routine Detail Modal ────────────────────────────────────────────────────
const RoutineModal = ({ routine, onClose, onComplete }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    className="fixed inset-0 z-[60] flex items-center justify-center bg-[#15192c]/80 backdrop-blur-md p-4">
    <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
      className="w-full max-w-md bg-white rounded-[3rem] p-10 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-rose-50 rounded-full blur-3xl -mr-16 -mt-16" />
      <button onClick={onClose} className="absolute top-6 right-6 text-[#C4A0AC] hover:text-[#15192c] transition-colors">
        <X size={20} />
      </button>
      <div className="relative z-10 space-y-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 flex items-center justify-center text-[#ff69b4]">
            <Scissors size={28} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-[#ff69b4]">Daily Ritual</p>
            <h3 className="text-2xl font-black text-[#15192c]">{routine.name}</h3>
          </div>
        </div>
        <div className="space-y-4">
           {routine.steps.map((step, idx) => (
             <div key={idx} className="flex items-start gap-4 p-4 rounded-2xl border border-rose-50 bg-rose-50/20">
                <div className="w-6 h-6 rounded-full bg-white border border-rose-100 flex items-center justify-center text-[10px] font-black text-[#ff69b4] flex-shrink-0">
                  {idx + 1}
                </div>
                <p className="text-xs font-bold text-[#15192c] leading-relaxed">{step}</p>
             </div>
           ))}
        </div>
        <button onClick={() => { onComplete(routine.id); onClose(); }}
          className="w-full py-5 bg-[#ff69b4] text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:brightness-110 transition-all shadow-xl shadow-rose-100">
          Mark as Completed ✨
        </button>
      </div>
    </motion.div>
  </motion.div>
);

// ── Guide Content Modal ─────────────────────────────────────────────────────
const GuideModal = ({ guide, onClose }) => {
  const guideVideoRef = useRef(null);

  const handleGuideFullscreen = () => {
    if (!guideVideoRef.current) return;
    if (guideVideoRef.current.requestFullscreen) {
      guideVideoRef.current.requestFullscreen();
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[80] flex items-start justify-center bg-[#15192c]/90 backdrop-blur-md px-3 pb-6 pt-28 md:px-6 md:pb-10 md:pt-32 overflow-y-auto">
      <motion.div initial={{ scale: 0.96, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.96, y: 20 }}
        className="w-full max-w-3xl bg-white rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl relative flex flex-col max-h-[calc(100vh-7.5rem)]">
        <button onClick={onClose} aria-label="Close guide modal"
          className="absolute top-5 right-5 z-10 w-10 h-10 rounded-full bg-white border border-rose-100 text-[#C4A0AC] hover:text-[#ff69b4] transition-colors shadow-md flex items-center justify-center">
          <X size={20} />
        </button>
        <div className="p-6 md:p-10 overflow-y-auto custom-scrollbar">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#ff69b4] mb-4 block">{guide.type}</span>
          <h3 className="text-3xl font-black text-[#15192c] mb-8 leading-tight pr-10">{guide.title}</h3>
          
          {guide.type === 'Video' ? (
            <div className="space-y-4">
              <div className="aspect-video bg-black rounded-3xl overflow-hidden mb-2">
                <video ref={guideVideoRef} autoPlay controls className="w-full h-full object-contain">
                  <source src={GROOMING_TUTORIAL_VIDEO_URL} type="video/mp4" />
                </video>
              </div>
              <button onClick={handleGuideFullscreen} className="px-5 py-2.5 border border-rose-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-[#15192c] hover:bg-rose-50 transition-all">
                Open Fullscreen
              </button>
            </div>
          ) : (
            <div className="space-y-6 text-[#6B5E63] text-sm font-medium leading-relaxed">
              <p>Choosing a signature scent is like finding your second skin, Sakhi. It's an extension of your personality that lingers long after you leave the room.</p>
              <h4 className="font-black text-[#15192c] text-lg mt-8">The Base Notes</h4>
              <p>Start by understanding the fragrance families. Floral, Woody, Oriental, or Fresh? Your mood often dictates what works best.</p>
              <div className="p-6 bg-rose-50 rounded-2xl border border-rose-100 italic">
                "Fragrance is the first garment we put on our skin." — Dr. Aditi Rao
              </div>
              <p>Always test on your pulse points and wait for 20 minutes to let the heart notes emerge before making a decision.</p>
            </div>
          )}
        </div>
        <div className="p-6 md:p-8 bg-rose-50/50 border-t border-rose-100 flex justify-between items-center gap-3">
          <div className="flex items-center gap-2 text-[10px] font-black text-[#C4A0AC] uppercase">
            <BookOpen size={14} /> 4 Min Read
          </div>
          <button onClick={onClose} className="px-8 py-3 bg-[#15192c] text-white rounded-xl text-[10px] font-black uppercase tracking-widest">
            Close Guide
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ── Kit Recommendation Modal ───────────────────────────────────────────────
const KitModal = ({ onClose }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    className="fixed inset-0 z-[60] flex items-center justify-center bg-[#15192c]/80 backdrop-blur-md p-4">
    <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
      className="w-full max-w-lg bg-white rounded-[4rem] p-10 md:p-14 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-48 h-48 bg-[#CCAA3D]/10 rounded-full blur-3xl -mr-24 -mt-24" />
      <button onClick={onClose} className="absolute top-8 right-8 text-[#C4A0AC] hover:text-[#CCAA3D] transition-colors">
        <X size={24} />
      </button>
      
      <div className="text-center mb-10">
         <div className="w-16 h-16 rounded-[2rem] bg-[#CCAA3D]/10 text-[#CCAA3D] flex items-center justify-center shadow-sm mx-auto mb-6">
            <ShoppingBag size={32} />
         </div>
         <h3 className="text-2xl font-black text-[#15192c]">Your Tailored Kit</h3>
         <p className="text-xs font-bold text-[#C4A0AC] uppercase tracking-widest mt-2">Recommended Essentials</p>
      </div>

      <div className="space-y-4 mb-10">
         {[
           { name: 'Hydrating Glow Serum', brand: 'Sakhi Essentials', price: '₹850' },
           { name: 'Mineral Sunscreen SPF 50', brand: 'Skin Shield', price: '₹1,200' },
           { name: 'Rosewater Facial Mist', brand: 'Natural Glow', price: '₹450' }
         ].map((item, i) => (
           <div key={i} className="flex items-center justify-between p-5 bg-stone-50 rounded-3xl border border-stone-100 hover:border-[#CCAA3D]/30 transition-all cursor-pointer group">
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#CCAA3D] font-black text-xs">#{i+1}</div>
                 <div>
                    <h4 className="text-[13px] font-black text-[#15192c]">{item.name}</h4>
                    <p className="text-[10px] font-bold text-[#C4A0AC] uppercase tracking-widest">{item.brand}</p>
                 </div>
              </div>
              <span className="text-[12px] font-black text-[#CCAA3D]">{item.price}</span>
           </div>
         ))}
      </div>

      <button className="w-full py-5 bg-[#CCAA3D] text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-[#CCAA3D]/20 hover:scale-[1.02] transition-all">
         Order Entire Kit
      </button>
    </motion.div>
  </motion.div>
);

const GroomingScreen = () => {
  const [showVideo, setShowVideo] = useState(false);
  const [selectedRoutine, setSelectedRoutine] = useState(null);
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [showKitModal, setShowKitModal] = useState(false);
  const [glowScore, setGlowScore] = useState(74);
  const [customTutorials, setCustomTutorials] = useState([]);
  const [routines, setRoutines] = useState([
    { id: 1, name: 'Morning Glow Routine', duration: '15 min', intensity: 'Gentle', progress: 100, steps: ['Cleanse with lukewarm water', 'Apply Vitamin C serum', 'Moisturize & SPF 50', 'Quick lip tint'] },
    { id: 2, name: 'Hair Care Ritual', duration: '45 min', intensity: 'Deep', progress: 40, steps: ['Detangle gently', 'Scalp massage (3 mins)', 'Leave-in conditioner', 'Natural air dry'] },
    { id: 3, name: 'Evening Recovery', duration: '20 min', intensity: 'Calm', progress: 0, steps: ['Double cleanse', 'Hydrating face mask', 'Night repair cream', 'Hand & foot cream'] },
  ]);

  // --- Real-time Sync with Admin Hub ---
  const fetchCustomContent = React.useCallback(() => {
    const saved = localStorage.getItem('hs_sakhi_content');
    if (saved) {
      const allContent = JSON.parse(saved);
      const groomingContent = allContent
        .filter(item => item.tab === 'grooming' && item.status === 'Published')
        .map(item => ({
          ...item,
          id: `custom-${item.id}`,
          image: item.mediaUrl || 'https://images.unsplash.com/photo-1596462502278-27bfdc4033c8?auto=format&fit=crop&q=80&w=2000',
          video: item.mediaUrl,
          type: item.category || 'Tutorial'
        }));
      setCustomTutorials(groomingContent);
    }
  }, []);

  useEffect(() => {
    fetchCustomContent();
    window.addEventListener('storage', fetchCustomContent);
    return () => window.removeEventListener('storage', fetchCustomContent);
  }, [fetchCustomContent]);

  const handleComplete = (id) => {
    setRoutines(prev => prev.map(r => r.id === id ? { ...r, progress: 100 } : r));
    setGlowScore(prev => Math.min(100, prev + 8));
  };

  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="w-full pb-20 px-4 pt-10">

      <AnimatePresence>
        {showVideo && (
          <VideoModal 
            video={{ title: 'The 5-Minute Minimalist Office Glow' }} 
            onClose={() => { setShowVideo(false); setGlowScore(prev => Math.min(100, prev + 5)); }} 
          />
        )}
        {selectedRoutine && (
          <RoutineModal 
            routine={selectedRoutine} 
            onClose={() => setSelectedRoutine(null)} 
            onComplete={handleComplete} 
          />
        )}
        {selectedGuide && (
          <GuideModal 
            guide={selectedGuide} 
            onClose={() => setSelectedGuide(null)} 
          />
        )}
        {showKitModal && (
          <KitModal 
            onClose={() => setShowKitModal(false)} 
          />
        )}
      </AnimatePresence>

      <motion.section variants={item} className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="space-y-1">
          <h2 className="text-4xl font-black tracking-tight text-[#15192c]">Grooming Sakhi ✨</h2>
          <span className="text-[11px] font-black uppercase tracking-[0.3em] text-[#C4A0AC]">Self-Care & Confidence</span>
        </div>
        <div className="flex gap-4">
           <div className="px-6 py-4 bg-white border border-[#F5E6EA] rounded-3xl shadow-sm text-center">
              <p className="text-[9px] font-black uppercase tracking-widest text-[#C4A0AC] mb-1">Glow Score</p>
              <p className="text-xl font-black text-[#ff69b4]">{glowScore}%</p>
           </div>
        </div>
      </motion.section>

      <main className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-12">
           {/* Admin Curated Tutorials */}
           {customTutorials.length > 0 && (
             <motion.section variants={item}>
               <h3 className="text-[10px] font-black uppercase tracking-[0.3em] mb-8" style={{ color: '#C4A0AC' }}>Admin Curated Tutorials</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {customTutorials.map((tutorial) => (
                   <div key={tutorial.id} onClick={() => { setSelectedGuide(tutorial); }}
                     className="bg-white p-6 rounded-[2.5rem] border border-[#F5E6EA] shadow-sm flex flex-col gap-4 group hover:shadow-xl transition-all cursor-pointer">
                      <div className="h-40 rounded-2xl overflow-hidden relative">
                         <img src={tutorial.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform" alt="" />
                         <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                            <div className="w-10 h-10 rounded-full bg-white/90 text-[#15192c] flex items-center justify-center shadow-lg">
                               <Play size={16} fill="currentColor" />
                            </div>
                         </div>
                      </div>
                      <div>
                         <span className="text-[8px] font-black uppercase text-[#ff69b4] mb-1">{tutorial.type}</span>
                         <h4 className="text-sm font-black text-[#15192c] group-hover:text-[#ff69b4] transition-colors">{tutorial.title}</h4>
                         <p className="text-[10px] font-bold text-[#C4A0AC] mt-1 line-clamp-2">{tutorial.description}</p>
                      </div>
                   </div>
                 ))}
               </div>
             </motion.section>
           )}

           {/* Featured Tutorial */}
           <motion.div variants={item} className="bg-[#15192c] rounded-[3rem] p-10 md:p-14 text-white relative overflow-hidden group shadow-2xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#ff69b4]/10 rounded-full blur-[100px] -mr-32 -mt-32"></div>
              <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                 <div>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#ff69b4] mb-4 block">New Tutorial</span>
                    <h3 className="text-3xl font-black mb-6 tracking-tight">The 5-Minute Minimalist Office Glow</h3>
                    <p className="text-sm text-white/50 mb-8 leading-relaxed font-medium">
                       Learn how to achieve a fresh, professional look in under 5 minutes using just three essential products.
                    </p>
                    <button onClick={() => setShowVideo(true)}
                      className="px-8 py-4 bg-[#ff69b4] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center gap-3 hover:scale-105 transition-all">
                       <Play size={18} fill="currentColor" /> Watch Video
                    </button>
                 </div>
                 <div onClick={() => setShowVideo(true)}
                   className="aspect-video rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-center relative overflow-hidden group cursor-pointer">
                    <img src="/Images/image11.png" alt="Grooming" className="w-full h-full object-cover opacity-50 group-hover:scale-110 transition-all duration-700" />
                    <div className="absolute inset-0 flex items-center justify-center">
                       <div className="w-16 h-16 rounded-full bg-white text-[#15192c] flex items-center justify-center shadow-2xl">
                          <Play size={24} fill="currentColor" className="ml-1" />
                       </div>
                    </div>
                 </div>
              </div>
           </motion.div>

           {/* Self-Care Routines */}
           <motion.section variants={item}>
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] mb-8" style={{ color: '#C4A0AC' }}>Your Daily Routines</h3>
               <div className="space-y-4">
                  {routines.map((routine, i) => (
                    <div key={i} onClick={() => setSelectedRoutine(routine)}
                      className="bg-white p-8 rounded-[2.5rem] border border-[#F5E6EA] shadow-sm flex items-center justify-between group hover:shadow-xl transition-all cursor-pointer">
                       <div className="flex items-center gap-6">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${routine.progress === 100 ? 'bg-emerald-50 text-emerald-500' : 'bg-rose-50 text-[#ff69b4]'}`}>
                             {routine.progress === 100 ? <CheckCircle2 size={24} /> : <Scissors size={24} />}
                          </div>
                          <div>
                             <h4 className="text-lg font-black text-[#15192c]">{routine.name}</h4>
                            <div className="flex items-center gap-3 mt-1">
                               <span className="text-[9px] font-black uppercase text-[#C4A0AC]">{routine.duration}</span>
                               <span className="w-1 h-1 rounded-full bg-[#F5E6EA]"></span>
                               <span className="text-[9px] font-black uppercase text-[#ff69b4]">{routine.intensity}</span>
                            </div>
                         </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                         <div className="h-1.5 w-32 bg-rose-50 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              whileInView={{ width: `${routine.progress}%` }}
                              className="h-full rounded-full" 
                              style={{ backgroundColor: routine.progress === 100 ? '#10b981' : '#ff69b4' }} 
                            />
                         </div>
                         <span className="text-[9px] font-black uppercase text-[#C4A0AC]">{routine.progress}% Complete</span>
                      </div>
                   </div>
                 ))}
              </div>
           </motion.section>
        </div>

        <div className="lg:col-span-4 space-y-10">
           {/* Glow Guide */}
           <motion.div variants={item} className="p-8 bg-white rounded-[3rem] border border-[#F5E6EA] shadow-sm">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#C4A0AC] mb-6">Expert Glow Guides</h3>
              <div className="space-y-6">
                 {[
                   { title: 'Choosing Your Signature Scent', type: 'Article' },
                   { title: 'The Science of Hydration', type: 'Video' },
                   { title: 'Confident Body Language', type: 'Course' },
                 ].map((guide, i) => (
                   <div key={i} onClick={() => setSelectedGuide(guide)}
                     className="flex flex-col group cursor-pointer">
                      <span className="text-[8px] font-black uppercase text-[#ff69b4] mb-1">{guide.type}</span>
                      <h4 className="text-[13px] font-bold text-[#15192c] group-hover:text-[#ff69b4] transition-colors">{guide.title}</h4>
                      <div className="flex items-center gap-2 mt-2 text-[#C4A0AC]">
                         <Star size={10} fill="currentColor" />
                         <span className="text-[9px] font-bold uppercase tracking-widest underline">Read Guide</span>
                      </div>
                   </div>
                 ))}
              </div>
           </motion.div>

           {/* Beauty Kit Card */}
           <motion.div variants={item} className="p-10 rounded-[3.5rem] bg-gradient-to-br from-[#FFF9EE] to-[#FEF9E3] border border-[#F5E6EA] shadow-sm flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-[2rem] bg-white text-[#CCAA3D] flex items-center justify-center shadow-sm mb-6">
                 <ShoppingBag size={28} />
              </div>
              <h3 className="text-xl font-black mb-3" style={{ color: '#15192c' }}>Build Your Kit</h3>
              <p className="text-xs font-bold leading-relaxed opacity-60 mb-8 italic font-medium">
                 "Invest in yourself. It pays the best interest."
              </p>
              <button onClick={() => setShowKitModal(true)}
                className="w-full py-4 bg-[#CCAA3D] text-white rounded-2xl text-[9px] font-black uppercase tracking-widest shadow-lg hover:scale-105 transition-all">
                 Tailored Recommendations
              </button>
           </motion.div>
        </div>
      </main>
    </motion.div>
  );
};

export default GroomingScreen;
