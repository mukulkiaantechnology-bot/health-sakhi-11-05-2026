import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Shield, MessageCircle, Heart, Star, ChevronLeft, Search, Plus, CheckCircle2, X, Send, Edit2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CommunityScreen = () => {
  const navigate = useNavigate();
  const [joinedGroups, setJoinedGroups] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [editingPost, setEditingPost] = useState(null);
  
  const [newPostData, setNewPostData] = useState({ title: '', tag: 'Health', content: '', anonymous: true });

  const [posts, setPosts] = useState([
    { id: 1, title: "Managing stress at work?", tag: "Health", replies: 24, content: "Lately, I've been feeling overwhelmed by back-to-back meetings. How do you all manage your mental peace during work hours?", author: "Anonymous Sakhi" },
    { id: 2, title: "Best recipes for PCOD?", tag: "Food", replies: 18, content: "Looking for anti-inflammatory recipes that actually taste good. Any suggestions for breakfast?", author: "Anonymous Sakhi" },
    { id: 3, title: "Maintain workout streak?", tag: "Goals", replies: 42, content: "I always lose motivation after week 2. Does anyone want to be my accountability partner?", author: "Anonymous Sakhi" }
  ]);

  const groups = [
    { id: 1, name: 'PCOD Support', members: '1.2k', description: 'Discuss PCOD management and healing in a safe space.', icon: Heart, color: '#ff69b4' },
    { id: 2, name: 'Moms Circle', members: '840', description: 'Connecting moms for emotional and physical wellbeing.', icon: Users, color: '#8b5cf6' },
    { id: 3, name: 'Stress Support', members: '2.5k', description: 'Helping each other find calm in daily chaos.', icon: Shield, color: '#0ea5e9' },
    { id: 4, name: 'Confidence', members: '1.1k', description: 'Empowering women to lead with inner strength.', icon: Star, color: '#f59e0b' },
  ];

  const filteredGroups = groups.filter(g => 
    g.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    g.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPosts = posts.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.tag.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleJoin = (id) => {
    if (joinedGroups.includes(id)) return;
    setJoinedGroups([...joinedGroups, id]);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleCreatePost = () => {
    if (!newPostData.title || !newPostData.content) return;
    
    if (editingPost) {
      // Update existing post
      setPosts(posts.map(p => p.id === editingPost.id ? { ...p, ...newPostData } : p));
      setEditingPost(null);
    } else {
      // Create new post
      const post = {
        id: posts.length + 1,
        ...newPostData,
        replies: 0,
        author: newPostData.anonymous ? "Anonymous Sakhi" : "Health Sakhi User",
        isUserPost: true // Mark for local management
      };
      setPosts([post, ...posts]);
    }
    
    setShowCreateModal(false);
    setNewPostData({ title: '', tag: 'Health', content: '', anonymous: true });
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleDeletePost = (id, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this conversation?')) {
      setPosts(posts.filter(p => p.id !== id));
    }
  };

  const startEditPost = (post, e) => {
    e.stopPropagation();
    setEditingPost(post);
    setNewPostData({ title: post.title, tag: post.tag, content: post.content, anonymous: post.anonymous });
    setShowCreateModal(true);
  };

  const openPostDetail = (post) => {
    setSelectedPost(post);
    setShowDetailModal(true);
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
      <div className="absolute inset-0 mesh-bg opacity-30 pointer-events-none" />

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 w-full px-4 md:px-10 py-6 md:py-10"
      >
        <div className="space-y-10">
          
          {/* Header */}
          <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4 md:gap-5">
              <button 
                onClick={() => navigate('/app')}
                className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-white border border-rose-100 flex items-center justify-center text-[#15192c] hover:bg-rose-50 transition-all shadow-sm shrink-0"
              >
                <ChevronLeft size={18} />
              </button>
              <div>
                 <h1 className="text-2xl md:text-3xl font-black tracking-tight text-[#15192c]">Women Community</h1>
                 <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] text-[#C4A0AC]">Your anonymous safe space</p>
              </div>
            </div>
            
            <div className="flex gap-3 w-full sm:w-auto">
               <div className="relative flex-1 sm:flex-none">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C4A0AC]" size={14} />
                  <input 
                    type="text" 
                    placeholder="Search circles or posts..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-11 pr-4 h-11 md:h-12 bg-white/80 backdrop-blur-md border border-rose-50 rounded-2xl text-xs font-semibold focus:outline-none focus:border-[#ff69b4] transition-all w-full sm:w-64 shadow-sm"
                  />
               </div>
               <button 
                 onClick={() => setShowCreateModal(true)}
                 className="w-11 h-11 md:w-12 md:h-12 bg-[#15192c] text-white rounded-2xl flex items-center justify-center hover:bg-[#ff69b4] transition-all shadow-lg shrink-0"
               >
                  <Plus size={20} />
               </button>
            </div>
          </header>

          {/* Privacy Banner */}
          <motion.div variants={item} className="bg-white/50 backdrop-blur-md rounded-3xl md:rounded-[2rem] p-6 md:p-8 border border-white flex flex-col sm:flex-row items-center gap-4 md:gap-6 shadow-sm text-center sm:text-left">
             <div className="w-12 h-12 md:w-14 md:h-14 bg-[#ff69b4] rounded-xl flex items-center justify-center text-white shadow-lg flex-shrink-0">
                <Shield size={24} md:size={28} />
             </div>
             <div>
                <h3 className="text-lg md:text-xl font-black text-[#15192c]">Privacy Promise</h3>
                <p className="text-[11px] md:text-xs font-medium text-[#9A8A8E] leading-relaxed mt-1">Your identity remains private. Support others without judgment in our safe haven.</p>
             </div>
          </motion.div>

          {/* Circles Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
             {filteredGroups.map((group) => (
               <motion.div 
                 key={group.id} 
                 variants={item}
                 whileHover={{ y: -5 }}
                 className="bg-white rounded-3xl md:rounded-[2rem] p-6 md:p-8 border border-rose-50 shadow-sm flex flex-col items-center text-center group transition-all"
               >
                  <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center mb-4 md:mb-6 transition-transform group-hover:scale-105" style={{ background: `${group.color}10` }}>
                     <group.icon size={28} md:size={32} style={{ color: group.color }} />
                  </div>
                  <h3 className="text-base md:text-lg font-black text-[#15192c] mb-2">{group.name}</h3>
                  <p className="text-[10px] md:text-[11px] font-medium text-[#C4A0AC] leading-relaxed mb-4 md:mb-6">{group.description}</p>
                  <div className="text-[8px] md:text-[9px] font-bold uppercase tracking-widest text-[#ff69b4] mb-4">{group.members} Sisters</div>
                  <button 
                    onClick={() => handleJoin(group.id)}
                    className={`w-full py-3 md:py-3.5 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all ${
                      joinedGroups.includes(group.id) 
                      ? 'bg-rose-50 text-[#ff69b4]' 
                      : 'bg-[#15192c] text-white hover:bg-[#ff69b4]'
                    }`}
                  >
                    {joinedGroups.includes(group.id) ? 'Joined' : 'Join Circle'}
                  </button>
               </motion.div>
             ))}
          </div>

          {/* Trending Conversations */}
          <motion.section variants={item} className="space-y-6">
             <div className="flex items-center justify-between">
                <h3 className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#C4A0AC]">Trending Conversations</h3>
                {searchQuery && <span className="text-[9px] font-bold text-[#ff69b4] uppercase tracking-widest">{filteredPosts.length} matches found</span>}
             </div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {filteredPosts.map((post, i) => (
                  <motion.div 
                    key={post.id} 
                    whileHover={{ scale: 1.02 }}
                    onClick={() => openPostDetail(post)}
                    className="bg-white/60 p-6 rounded-2xl border border-rose-50 hover:border-[#ff69b4] transition-all flex flex-col gap-4 group cursor-pointer shadow-sm"
                  >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                           <div className="w-9 h-9 bg-rose-50 rounded-full flex items-center justify-center text-[#ff69b4] group-hover:bg-[#ff69b4] group-hover:text-white transition-all"><MessageCircle size={16} /></div>
                           <div>
                              <h4 className="text-xs font-black text-[#15192c] leading-snug">{post.title}</h4>
                              <span className="text-[8px] font-bold uppercase tracking-widest text-[#C4A0AC] mt-1 block">{post.tag}</span>
                           </div>
                        </div>
                        {post.isUserPost && (
                          <div className="flex gap-1">
                             <button onClick={(e) => startEditPost(post, e)} className="p-1.5 text-[#C4A0AC] hover:text-[#ff69b4] transition-colors"><Edit2 size={14}/></button>
                             <button onClick={(e) => handleDeletePost(post.id, e)} className="p-1.5 text-[#C4A0AC] hover:text-rose-600 transition-colors"><X size={14}/></button>
                          </div>
                        )}
                      </div>
                      <div className="text-[9px] font-bold text-[#ff69b4] uppercase tracking-widest flex items-center justify-between">
                         <span>{post.replies} Replies</span>
                         {post.isUserPost && <span className="text-[7px] bg-rose-50 px-2 py-0.5 rounded-full">My Post</span>}
                      </div>
                  </motion.div>
                ))}
             </div>
          </motion.section>

        </div>
      </motion.div>
      {/* ── Success Toast ── */}
      <AnimatePresence>
        {showToast && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[110] bg-[#15192c] text-white px-6 py-4 rounded-2xl shadow-xl flex items-center gap-3 border border-white/10">
            <CheckCircle2 size={16} className="text-[#ff69b4]" />
            <span className="text-[10px] font-bold uppercase tracking-widest tracking-tight">Joined the sisterhood! 💖</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Create Post Modal ── */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowCreateModal(false)} className="absolute inset-0 bg-[#15192c]/40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="w-full max-w-lg bg-white rounded-[2.5rem] p-8 md:p-10 relative z-10 shadow-2xl space-y-6 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-rose-50 rounded-full blur-3xl -mr-16 -mt-16" />
              <div className="flex items-center justify-between relative z-10">
                 <h2 className="text-xl md:text-2xl font-black text-[#15192c]">{editingPost ? 'Edit Conversation' : 'Start Conversation'}</h2>
                 <button onClick={() => { setShowCreateModal(false); setEditingPost(null); }} className="w-8 h-8 rounded-full flex items-center justify-center text-[#C4A0AC] hover:bg-rose-50 transition-all"><X size={18}/></button>
              </div>

              <div className="space-y-4 relative z-10">
                 <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-[#C4A0AC] ml-1">Topic Title</label>
                    <input 
                      type="text" 
                      placeholder="e.g., How to handle mood swings?"
                      value={newPostData.title}
                      onChange={(e) => setNewPostData({...newPostData, title: e.target.value})}
                      className="w-full px-5 py-4 bg-rose-50/30 border border-rose-100 rounded-2xl text-sm font-semibold outline-none focus:border-[#ff69b4] transition-all"
                    />
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-[9px] font-black uppercase tracking-widest text-[#C4A0AC] ml-1">Category</label>
                       <select 
                         value={newPostData.tag}
                         onChange={(e) => setNewPostData({...newPostData, tag: e.target.value})}
                         className="w-full px-5 py-4 bg-rose-50/30 border border-rose-100 rounded-2xl text-[11px] font-black uppercase tracking-widest outline-none focus:border-[#ff69b4] transition-all appearance-none cursor-pointer"
                       >
                          {['Health', 'Food', 'Goals', 'Support', 'Lifestyle'].map(t => <option key={t} value={t}>{t}</option>)}
                       </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[9px] font-black uppercase tracking-widest text-[#C4A0AC] ml-1">Identity</label>
                       <button 
                         onClick={() => setNewPostData({...newPostData, anonymous: !newPostData.anonymous})}
                         className={`w-full h-full px-5 py-4 border rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all ${newPostData.anonymous ? 'bg-[#ff69b4] border-[#ff69b4] text-white shadow-lg' : 'bg-white border-rose-100 text-[#C4A0AC]'}`}
                       >
                          {newPostData.anonymous ? 'Posting Anonymously' : 'Posting Publicly'}
                       </button>
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-[#C4A0AC] ml-1">Details</label>
                    <textarea 
                      placeholder="Share your heart here..."
                      value={newPostData.content}
                      onChange={(e) => setNewPostData({...newPostData, content: e.target.value})}
                      className="w-full h-32 px-5 py-4 bg-rose-50/30 border border-rose-100 rounded-2xl text-sm font-medium outline-none focus:border-[#ff69b4] transition-all resize-none"
                    />
                 </div>
              </div>

              <button 
                onClick={handleCreatePost}
                className="w-full py-5 bg-[#ff69b4] text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:brightness-110 transition-all flex items-center justify-center gap-3"
              >
                 {editingPost ? 'Update Conversation' : 'Spread the Light'} <Send size={16}/>
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Post Detail Modal ── */}
      <AnimatePresence>
        {showDetailModal && selectedPost && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowDetailModal(false)} className="absolute inset-0 bg-[#15192c]/40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="w-full max-w-lg bg-white rounded-[2.5rem] p-0 relative z-10 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
               {/* Detail Header */}
               <div className="p-8 pb-4 flex items-start justify-between relative">
                  <div className="space-y-1">
                     <span className="px-3 py-1 bg-rose-50 text-[#ff69b4] text-[8px] font-black uppercase tracking-widest rounded-lg">{selectedPost.tag}</span>
                     <h2 className="text-xl md:text-2xl font-black text-[#15192c] tracking-tight pr-8">{selectedPost.title}</h2>
                     <p className="text-[9px] font-bold text-[#C4A0AC] uppercase tracking-widest">Post by {selectedPost.author}</p>
                  </div>
                  <button onClick={() => setShowDetailModal(false)} className="w-8 h-8 rounded-full flex items-center justify-center text-[#C4A0AC] hover:bg-rose-50 transition-all shrink-0"><X size={18}/></button>
               </div>

               {/* Detail Content */}
               <div className="p-8 pt-0 flex-1 overflow-y-auto custom-scrollbar space-y-8">
                  <p className="text-[13px] md:text-sm font-medium text-[#15192c] leading-relaxed italic border-l-4 border-rose-100 pl-4 py-2">
                    "{selectedPost.content}"
                  </p>

                  <div className="space-y-6">
                     <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-[#C4A0AC] flex items-center gap-2">
                        <MessageCircle size={12} /> {selectedPost.replies} Replies from Sisters
                     </h4>

                     <div className="space-y-4">
                        {[1, 2].map(i => (
                          <div key={i} className="p-4 rounded-2xl bg-rose-50/30 border border-rose-50 flex gap-4">
                             <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#ff69b4] shrink-0 border border-rose-100 shadow-sm"><Users size={14}/></div>
                             <div>
                                <p className="text-xs font-bold text-[#15192c] mb-1">Stay strong, Sakhi! Sending you love. ❤️</p>
                                <span className="text-[8px] font-black uppercase tracking-widest text-[#C4A0AC]">Anonymous Sister • 2h ago</span>
                             </div>
                          </div>
                        ))}
                     </div>
                  </div>
               </div>

               {/* Quick Reply Bar */}
               <div className="p-6 bg-white border-t border-rose-50 flex gap-3">
                  <input 
                    type="text" 
                    placeholder="Add a heartful reply..."
                    className="flex-1 px-5 py-4 bg-rose-50/30 border border-rose-100 rounded-2xl text-[12px] font-semibold outline-none focus:border-[#ff69b4] transition-all"
                  />
                  <button className="w-12 h-12 bg-[#ff69b4] text-white rounded-2xl flex items-center justify-center shadow-lg shadow-rose-100 hover:scale-105 transition-all">
                     <Send size={18}/>
                  </button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #F5E6EA; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default CommunityScreen;
