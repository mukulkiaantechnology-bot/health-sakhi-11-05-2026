import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, PlayCircle, Clock, Sparkles, ChevronLeft, Heart, Shield, Star, Users, Utensils, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const ContentScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedModule, setExpandedModule] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [completedVideos, setCompletedVideos] = useState([]);
  const [customContent, setCustomContent] = useState([]);

  useEffect(() => {
    const loadCustom = () => {
        const saved = localStorage.getItem('hs_custom_content');
        if (saved) setCustomContent(JSON.parse(saved).filter(item => item.type === 'Video' && item.status === 'Published'));
    };
    loadCustom();
    window.addEventListener('storage', loadCustom);
    return () => window.removeEventListener('storage', loadCustom);
  }, []);

  useEffect(() => {
    // Load completed videos from localStorage
    const userProgress = JSON.parse(localStorage.getItem('userProgress') || '{}');
    const completed = Object.entries(userProgress)
      .filter(([_, data]) => data.percent >= 100)
      .map(([title, _]) => title);
    setCompletedVideos(completed);

    // Deep link from Home screen category
    if (location.state?.category) {
      const match = modules.find(m => m.title.toLowerCase().includes(location.state.category.toLowerCase()));
      if (match) setExpandedModule(match.id);
    }
  }, [location.state]);

  // ── Realistic Content Data ──────────────────────────────────────────────────
  const modules = React.useMemo(() => {
    const baseModules = [
        {
          id: 0,
          title: 'Women Health Foundations',
          description: 'Understanding hormones, cycles, and biological transitions.',
          icon: Heart,
          color: '#ff69b4',
          bg: 'bg-rose-50/50',
          cat: 'Women Health',
          subcategories: [
            {
              title: 'Hormonal Mastery',
              playlists: [
                {
                  title: 'The Endocrine System',
                  videos: [
                    { title: 'Estrogen & Progesterone 101', duration: '15:20' },
                    { title: 'Thyroid Health in Women', duration: '12:45' },
                  ]
                }
              ]
            },
            {
              title: 'Menstrual Wellness',
              playlists: [
                {
                  title: 'Cycle Tracking',
                  videos: [
                    { title: 'The Four Phases Explained', duration: '18:10' },
                    { title: 'Natural PMS Relief', duration: '10:30' },
                  ]
                }
              ]
            }
          ]
        },
        {
          id: 1,
          title: 'Heart & Lifestyle',
          description: 'Strengthening your cardiovascular health through daily habits.',
          icon: Shield,
          color: '#f59e0b',
          bg: 'bg-orange-50/50',
          cat: 'Heart Care',
          subcategories: [
            {
              title: 'Cardio Vitality',
              playlists: [
                {
                  title: 'Heart Healthy Living',
                  videos: [
                    { title: 'Managing BP Naturally', duration: '14:20' },
                    { title: 'The Heart-Brain Connection', duration: '09:15' },
                  ]
                }
              ]
            }
          ]
        },
        {
          id: 2,
          title: 'Mental Healing & Peace',
          description: 'Techniques for emotional resilience and inner resonance.',
          icon: Star,
          color: '#8b5cf6',
          bg: 'bg-purple-50/50',
          cat: 'Mental Healing',
          subcategories: [
            {
              title: 'Anxiety & Focus',
              playlists: [
                {
                  title: 'Calming the Mind',
                  videos: [
                    { title: '5-Minute SOS Breathwork', duration: '05:00' },
                    { title: 'Overcoming Overthinking', duration: '22:30' },
                  ]
                }
              ]
            }
          ]
        },
        {
          id: 3,
          title: 'Relationship Resonance',
          description: 'Building healthy boundaries and emotional connections.',
          icon: Users,
          color: '#10b981',
          bg: 'bg-emerald-50/50',
          cat: 'Relationships',
          subcategories: [
            {
              title: 'Social Wellness',
              playlists: [
                {
                  title: 'Healthy Boundaries',
                  videos: [
                    { title: 'How to Say No', duration: '12:00' },
                    { title: 'Navigating Conflict', duration: '25:45' },
                  ]
                }
              ]
            }
          ]
        },
        {
          id: 4,
          title: 'Cravings & Nutrition',
          description: 'Healing your relationship with food and emotional eating.',
          icon: Utensils,
          color: '#ef4444',
          bg: 'bg-red-50/50',
          cat: 'Cravings',
          subcategories: [
            {
              title: 'Mindful Eating',
              playlists: [
                {
                  title: 'Understanding Cravings',
                  videos: [
                    { title: 'Hormonal Hunger vs Emotional Hunger', duration: '16:20' },
                    { title: 'The Sugar Cycle', duration: '14:10' },
                  ]
                }
              ]
            }
          ]
        }
    ];

    // Inject Custom Content
    return baseModules.map(module => {
        const matchingCustom = customContent.filter(c => c.cat === module.cat);
        if (matchingCustom.length > 0) {
            return {
                ...module,
                subcategories: [
                    {
                        title: 'Admin Curated Assets',
                        playlists: [
                            {
                                title: 'Recent Uploads',
                                videos: matchingCustom.map(c => ({
                                    title: c.title,
                                    duration: 'Custom',
                                    mediaUrl: c.mediaUrl,
                                    isCustom: true
                                }))
                            }
                        ]
                    },
                    ...module.subcategories
                ]
            };
        }
        return module;
    });
  }, [customContent]);

  const filteredModules = modules.filter(module => {
    const searchLower = searchQuery.toLowerCase();
    const hasMatchInModule = module.title.toLowerCase().includes(searchLower) || 
                           module.description.toLowerCase().includes(searchLower);
    
    const hasMatchInVideos = module.subcategories.some(sub => 
      sub.title.toLowerCase().includes(searchLower) || 
      sub.playlists.some(pl => 
        pl.title.toLowerCase().includes(searchLower) || 
        pl.videos.some(v => v.title.toLowerCase().includes(searchLower))
      )
    );
    
    return hasMatchInModule || hasMatchInVideos;
  });

  const handleVideoClick = (video) => {
    setSelectedVideo({ ...video, tag: 'Knowledge' });
    setShowVideoModal(true);
    
    // Sync with Progress
    const userProgress = JSON.parse(localStorage.getItem('userProgress') || '{}');
    if (!userProgress[video.title]) {
      userProgress[video.title] = { percent: 5, type: 'Video' };
      localStorage.setItem('userProgress', JSON.stringify(userProgress));
    }
  };

  const markAsCompleted = () => {
    if (!selectedVideo) return;
    const userProgress = JSON.parse(localStorage.getItem('userProgress') || '{}');
    userProgress[selectedVideo.title] = { percent: 100, type: 'Video' };
    localStorage.setItem('userProgress', JSON.stringify(userProgress));
    setCompletedVideos([...completedVideos, selectedVideo.title]);
    setShowVideoModal(false);
  };

  return (
    <div className="relative min-h-screen pb-20 overflow-x-hidden">
      {/* ── Background Mesh ── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[#ff69b4]/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#FFF1F2] blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 pt-10 space-y-12">
        
        {/* ── Header ── */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
           <div className="flex items-center gap-6">
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => navigate('/app')}
                className="w-12 h-12 rounded-2xl bg-white border border-rose-100 flex items-center justify-center text-[#15192c] shadow-sm hover:shadow-md transition-all"
              >
                <ChevronLeft size={20} />
              </motion.button>
              <div>
                <h1 className="text-4xl font-black tracking-tight text-[#15192c]">Wellness Library</h1>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C4A0AC] mt-1">Specific knowledge for your needs</p>
              </div>
           </div>
           
           <div className="relative w-full md:w-80 group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[#C4A0AC] group-focus-within:text-[#ff69b4] transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-14 pl-14 pr-6 rounded-2xl bg-white/60 backdrop-blur-md border border-rose-100 outline-none focus:ring-2 focus:ring-rose-200 transition-all text-sm font-bold placeholder:text-[#C4A0AC]"
              />
           </div>
        </header>

        {/* ── Filtered Modules Grid ── */}
        <div className="grid grid-cols-1 gap-8">
           {filteredModules.map((module, idx) => (
             <motion.div 
               key={module.id}
               layout
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: idx * 0.1 }}
               className={`group bg-white/40 backdrop-blur-xl rounded-[3rem] border border-white/60 shadow-xl shadow-rose-100/20 overflow-hidden transition-all duration-500 ${expandedModule === module.id ? 'ring-2 ring-[#ff69b4]/20' : ''}`}
             >
                <button 
                  onClick={() => setExpandedModule(expandedModule === module.id ? -1 : module.id)}
                  className="w-full text-left p-8 md:p-10 flex items-center justify-between"
                >
                   <div className="flex items-center gap-6">
                      <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-500 ${module.bg}`}>
                         <module.icon size={28} style={{ color: module.color }} />
                      </div>
                      <div>
                         <div className="flex items-center gap-2 mb-1.5">
                            <Sparkles size={12} className="text-[#ff69b4]" />
                            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-[#C4A0AC]">Verified Content</span>
                         </div>
                         <h3 className="text-2xl font-black text-[#15192c] tracking-tight">{module.title}</h3>
                         <p className="text-xs font-medium text-[#9A8A8E] mt-1 max-w-md leading-relaxed">{module.description}</p>
                      </div>
                   </div>
                   <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${expandedModule === module.id ? 'bg-[#15192c] text-white rotate-180' : 'bg-rose-50 text-[#C4A0AC]'}`}>
                      <ChevronDown size={20} />
                   </div>
                </button>

                <AnimatePresence>
                   {expandedModule === module.id && (
                     <motion.div 
                       initial={{ height: 0, opacity: 0 }}
                       animate={{ height: 'auto', opacity: 1 }}
                       exit={{ height: 0, opacity: 0 }}
                       transition={{ duration: 0.5, ease: 'easeInOut' }}
                       className="px-8 md:px-10 pb-10"
                     >
                        <div className="h-px w-full bg-rose-50 mb-8" />
                        
                        <div className="space-y-10">
                           {module.subcategories.map((sub, sIdx) => (
                             <div key={sIdx} className="space-y-6">
                                <h4 className="text-[9px] font-black uppercase tracking-[0.4em] text-[#ff69b4] flex items-center gap-3">
                                   <div className="w-6 h-px bg-rose-200" />
                                   {sub.title}
                                </h4>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                   {sub.playlists.map((playlist, pIdx) => (
                                     <div key={pIdx} className="bg-white/80 rounded-[2.25rem] p-6 border border-rose-50 shadow-sm hover:shadow-md transition-all group/card">
                                        <div className="flex items-center justify-between mb-6">
                                           <h5 className="text-base font-black text-[#15192c]">{playlist.title}</h5>
                                           <span className="px-2.5 py-1 bg-rose-50 text-[8px] font-black uppercase text-[#ff69b4] rounded-lg tracking-widest">{playlist.videos.length} Units</span>
                                        </div>
                                        <div className="space-y-2">
                                          {playlist.videos.map((video, vIdx) => {
                                            const isDone = completedVideos.includes(video.title);
                                            return (
                                              <motion.button 
                                                whileHover={{ x: 5 }}
                                                key={vIdx} 
                                                onClick={() => handleVideoClick(video)}
                                                className={`w-full flex items-center justify-between p-3.5 rounded-xl border transition-all group/item shadow-sm ${isDone ? 'bg-rose-50/30 border-rose-100' : 'bg-white border-rose-50 hover:border-[#ff69b4]'}`}
                                              >
                                                 <div className="flex items-center gap-3">
                                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${isDone ? 'bg-[#ff69b4] text-white' : 'bg-rose-50 text-[#ff69b4] group-hover/item:bg-[#ff69b4] group-hover/item:text-white'}`}>
                                                       {isDone ? <Sparkles size={16} fill="white"/> : <PlayCircle size={16} fill="transparent" />}
                                                    </div>
                                                    <span className={`text-xs font-bold ${isDone ? 'text-[#ff69b4]' : 'text-[#15192c]'}`}>{video.title}</span>
                                                 </div>
                                                 <div className="flex items-center gap-1.5 text-[8px] font-black text-[#C4A0AC]">
                                                    {isDone ? (
                                                      <span className="text-[#ff69b4] uppercase tracking-widest">Completed</span>
                                                    ) : (
                                                      <><Clock size={10} /> {video.duration}</>
                                                    )}
                                                 </div>
                                              </motion.button>
                                            );
                                          })}
                                        </div>
                                     </div>
                                   ))}
                                </div>
                             </div>
                           ))}
                        </div>
                     </motion.div>
                   )}
                </AnimatePresence>
             </motion.div>
           ))}
        </div>
      </div>

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
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-8 left-8 text-white z-10">
                   <span className="px-3 py-1 bg-[#ff69b4] rounded-lg text-[9px] font-black uppercase tracking-widest mb-2 inline-block shadow-lg">{selectedVideo.tag || 'Knowledge'}</span>
                   <h3 className="text-xl md:text-2xl font-black drop-shadow-md">{selectedVideo.title}</h3>
                </div>
              </div>

              {/* Sidebar Info */}
              <div className="w-full md:w-96 bg-white p-6 md:p-10 flex flex-col justify-between border-l border-rose-50 overflow-y-auto custom-scrollbar">
                 <div className="space-y-6 md:space-y-8">
                    <div className="flex items-center justify-between">
                       <h4 className="text-[10px] font-black uppercase tracking-widest text-[#C4A0AC]">Knowledge Unit</h4>
                       <button onClick={() => setShowVideoModal(false)} className="text-[#C4A0AC] hover:text-[#15192c] transition-colors"><X size={20} /></button>
                    </div>
                    
                    <div className="space-y-4">
                       <p className="text-xs font-bold text-[#15192c] leading-relaxed italic">"Sakhi, understanding this will empower you to take better care of your unique body."</p>
                       <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-3 text-[#C4A0AC]">
                             <Clock size={14} />
                             <span className="text-[10px] font-bold uppercase tracking-widest">{selectedVideo.duration || 'Full Session'}</span>
                          </div>
                          <div className="flex items-center gap-3 text-[#ff69b4]">
                             <Sparkles size={14} />
                             <span className="text-[10px] font-bold uppercase tracking-widest">+100 Potential Coins</span>
                          </div>
                       </div>
                    </div>
                 </div>

                 <button 
                   onClick={markAsCompleted}
                   className="w-full py-4 bg-[#15192c] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#ff69b4] transition-all shadow-xl mt-8"
                 >
                    Mark as Completed
                 </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ContentScreen;
