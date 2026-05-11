import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Zap, Gift, ChevronLeft, ChevronRight, Award, Sparkles, CheckCircle2, Clock, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RewardsScreen = () => {
  const navigate = useNavigate();
  const [unlockedGifts, setUnlockedGifts] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [unlockedBadges, setUnlockedBadges] = useState([1, 2]); // IDs of earned badges

  // Read book rewards from localStorage and calculate dynamic balance
  const bookRewards = JSON.parse(localStorage.getItem('hs_book_rewards') || '[]');
  const bookRewardPoints = bookRewards.reduce((sum, r) => sum + (r.points || 0), 0);
  const BASE_BALANCE = 480;
  const [coins, setCoins] = useState(BASE_BALANCE + bookRewardPoints);

  // Rebuild coins when component mounts (in case rewards were added)
  useEffect(() => {
    const rewards = JSON.parse(localStorage.getItem('hs_book_rewards') || '[]');
    const earned = rewards.reduce((sum, r) => sum + (r.points || 0), 0);
    setCoins(BASE_BALANCE + earned);
  }, []);

  // Build activities: static ones + dynamic book rewards
  const staticActivities = [
    { id: 's1', text: "Daily Login Streak (12 Days)", amount: "+20", time: "2h ago" },
    { id: 's2', text: "Completed Morning Affirmations", amount: "+10", time: "5h ago" },
    { id: 's3', text: "Redeemed 'Wellness Kit'", amount: "-5000", time: "1d ago" },
  ];

  const bookActivities = bookRewards.map((r, i) => {
    const earnedDate = new Date(r.earnedAt);
    const now = new Date();
    const diffMs = now - earnedDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHrs = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHrs / 24);
    let timeAgo = 'Just now';
    if (diffDays > 0) timeAgo = `${diffDays}d ago`;
    else if (diffHrs > 0) timeAgo = `${diffHrs}h ago`;
    else if (diffMins > 0) timeAgo = `${diffMins}m ago`;

    return {
      id: `book_${r.bookId}`,
      text: `📖 Completed: ${r.bookTitle}`,
      amount: `+${r.points}`,
      time: timeAgo,
    };
  });

  const activities = [...bookActivities, ...staticActivities];

  const badges = [
    { id: 1, name: 'Early Bird', icon: Sparkles, color: '#ff69b4', description: 'Log in before 8 AM for 5 days.' },
    { id: 2, name: 'Consistent', icon: Zap, color: '#8b5cf6', description: 'Maintain a 10-day streak.' },
    { id: 3, name: 'Seeker', icon: Star, color: '#f59e0b', description: 'Read 5 books in the library.' },
    { id: 4, name: 'Pillar', icon: Trophy, color: '#0ea5e9', description: 'Help 10 sisters in community.' },
  ];

  const handleUnlock = (gift) => {
    const price = parseInt(gift.price);
    if (coins < price) return;
    setCoins(prev => prev - price);
    setUnlockedGifts([...unlockedGifts, gift.name]);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
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
                 <h1 className="text-2xl md:text-3xl font-black tracking-tight text-[#15192c]">Your Rewards</h1>
                 <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] text-[#C4A0AC]">Celebrate every small win</p>
              </div>
            </div>
            
            {/* Professional Main Balance Card */}
            <motion.div 
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="relative group self-start sm:self-auto min-w-[180px] md:min-w-[220px]"
            >
              {/* Outer Glow */}
              <div className="absolute -inset-1 bg-gradient-to-r from-[#ff69b4] to-[#8b5cf6] rounded-[2rem] blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
              
              <div className="relative bg-[#15192c] text-white px-6 md:px-10 py-4 md:py-6 rounded-[1.8rem] flex items-center gap-5 md:gap-8 shadow-2xl overflow-hidden border border-white/5">
                {/* Decorative Rotating Ring */}
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                  className="absolute -right-8 -top-8 w-32 h-32 border-[20px] border-dashed border-white/5 rounded-full pointer-events-none"
                />
                
                {/* Icon Section with Aura */}
                <div className="relative shrink-0">
                   <motion.div 
                     animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                     transition={{ duration: 4, repeat: Infinity }}
                     className="absolute inset-0 bg-[#ff69b4] blur-xl rounded-full"
                   />
                   <div className="relative w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-[#ff69b4] to-[#e05297] rounded-2xl flex items-center justify-center shadow-[0_10px_20px_-5px_rgba(255,105,180,0.5)] border border-white/20">
                      <Award size={24} className="md:size-28" />
                   </div>
                </div>
                
                {/* Text Content */}
                <div className="relative z-10">
                   <p className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.25em] text-[#ff69b4] mb-1">Total Balance</p>
                   <div className="flex items-center gap-3">
                      <p className="text-2xl md:text-4xl font-black tracking-tight">{coins}</p>
                      <span className="text-xl md:text-2xl animate-bounce" style={{ animationDuration: '3s' }}>🪙</span>
                   </div>
                </div>

                {/* Subtle Mesh Background Overlay */}
                <div className="absolute inset-0 mesh-bg opacity-10 pointer-events-none" />
              </div>
            </motion.div>
          </header>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
             <motion.div variants={item} className="bg-white rounded-3xl md:rounded-[2rem] p-6 md:p-8 border border-rose-50 shadow-sm relative overflow-hidden">
                <div className="flex items-center gap-3 mb-4 md:mb-6">
                   <div className="w-9 h-9 md:w-10 md:h-10 bg-rose-50 rounded-xl flex items-center justify-center text-[#ff69b4] shadow-inner shrink-0"><Zap size={18} /></div>
                   <h4 className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-[#C4A0AC]">Streak</h4>
                </div>
                <h3 className="text-3xl md:text-4xl font-black">12 Days 🔥</h3>
                <div className="mt-4 md:mt-6 h-1.5 w-full bg-rose-50 rounded-full overflow-hidden">
                   <motion.div initial={{ width: 0 }} animate={{ width: '80%' }} className="h-full bg-[#ff69b4] rounded-full" />
                </div>
             </motion.div>

             <motion.div variants={item} className="bg-white rounded-3xl md:rounded-[2rem] p-6 md:p-8 border border-rose-50 shadow-sm">
                <div className="flex items-center gap-3 mb-4 md:mb-6">
                   <div className="w-9 h-9 md:w-10 md:h-10 bg-rose-50 rounded-xl flex items-center justify-center text-[#ff69b4] shadow-inner shrink-0"><Trophy size={18} /></div>
                   <h4 className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-[#C4A0AC]">Badges</h4>
                </div>
                <h3 className="text-3xl md:text-4xl font-black">06 <span className="text-base md:text-lg text-[#C4A0AC]">/ 25</span></h3>
                <p className="text-[9px] md:text-[10px] font-bold text-[#ff69b4] mt-2 uppercase tracking-widest">Master Status at 10</p>
             </motion.div>

             <motion.div variants={item} className="bg-[#15192c] rounded-3xl md:rounded-[2rem] p-6 md:p-8 text-white relative overflow-hidden sm:col-span-2 lg:col-span-1">
                <div className="flex items-center gap-3 mb-4 md:mb-6 relative z-10">
                   <div className="w-9 h-9 md:w-10 md:h-10 bg-[#ff69b4] rounded-xl flex items-center justify-center shadow-lg shrink-0"><Star size={18} /></div>
                   <h4 className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-[#ff69b4]">Next Rank</h4>
                </div>
                <h3 className="text-xl md:text-2xl font-black relative z-10">Wellness Warrior</h3>
                <div className="h-1 w-full bg-white/10 rounded-full mt-4 relative z-10">
                   <motion.div initial={{ width: 0 }} animate={{ width: '65%' }} className="h-full bg-[#ff69b4] rounded-full" />
                </div>
             </motion.div>
          </div>

          {/* Badges Grid */}
          <motion.section variants={item} className="space-y-6">
             <div className="flex items-center justify-between">
                <h3 className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#C4A0AC]">Milestone Badges</h3>
                <span className="text-[9px] font-bold text-[#ff69b4] uppercase tracking-widest">{unlockedBadges.length} / {badges.length} Earned</span>
             </div>
             <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {badges.map((badge) => {
                  const isEarned = unlockedBadges.includes(badge.id);
                  return (
                    <motion.div 
                      key={badge.id} 
                      whileHover={{ scale: isEarned ? 1.02 : 1 }}
                      className={`bg-white rounded-[2rem] p-6 border border-rose-50 text-center flex flex-col items-center group shadow-sm transition-all relative ${!isEarned ? 'opacity-60 grayscale' : ''}`}
                    >
                       {!isEarned && (
                         <div className="absolute top-4 right-4 text-[#C4A0AC]">
                            <Lock size={12} />
                         </div>
                       )}
                       <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-inner transition-transform group-hover:rotate-6" style={{ background: isEarned ? `${badge.color}10` : '#F5F5F5' }}>
                          <badge.icon size={32} style={{ color: isEarned ? badge.color : '#9A8A8E' }} />
                       </div>
                       <h4 className={`text-sm font-black mb-1 ${isEarned ? 'text-[#15192c]' : 'text-[#9A8A8E]'}`}>{badge.name}</h4>
                       <p className="text-[10px] font-medium text-[#C4A0AC] leading-tight">{badge.description}</p>
                    </motion.div>
                  );
                })}
             </div>
          </motion.section>

          {/* Activity Feed */}
          <motion.section variants={item} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
             <div className="bg-white/50 backdrop-blur-md rounded-[2rem] p-8 border border-white shadow-sm flex flex-col gap-6">
                <div className="flex items-center gap-3">
                   <div className="w-9 h-9 bg-rose-50 rounded-xl flex items-center justify-center text-[#ff69b4] shadow-sm"><Clock size={16} /></div>
                   <h3 className="text-[10px] font-black uppercase tracking-widest text-[#15192c]">Recent Activity</h3>
                </div>
                <div className="space-y-4">
                   {activities.map((act) => (
                     <div key={act.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/40 border border-rose-50/50">
                        <div className="space-y-1">
                           <p className="text-[11px] font-bold text-[#15192c]">{act.text}</p>
                           <p className="text-[8px] font-black uppercase tracking-widest text-[#C4A0AC]">{act.time}</p>
                        </div>
                        <span className={`text-xs font-black ${act.amount.startsWith('+') ? 'text-[#ff69b4]' : 'text-[#15192c]'}`}>
                           {act.amount} 🪙
                        </span>
                     </div>
                   ))}
                </div>
             </div>

             <div className="bg-gradient-to-br from-[#15192c] to-[#1a0c13] rounded-[2rem] p-8 text-white flex flex-col justify-between relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-48 h-48 bg-[#ff69b4] rounded-full blur-[80px] opacity-20 -mr-20 -mt-20 group-hover:opacity-30 transition-opacity" />
                <div className="relative z-10">
                   <h3 className="text-xl font-black mb-2">Invite a Sakhi</h3>
                   <p className="text-xs font-medium text-white/60 leading-relaxed mb-6">Spread the light! Invite a friend and earn 100 coins when they join the sisterhood.</p>
                </div>
                <button className="relative z-10 w-full py-4 bg-white text-[#15192c] rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#ff69b4] hover:text-white transition-all shadow-xl">
                   Share Invite Link
                </button>
             </div>
          </motion.section>

          {/* Shop Section */}
          <motion.section variants={item} className="bg-white/80 backdrop-blur-xl rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 border border-white shadow-xl shadow-rose-100/30 relative overflow-hidden">
             <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between relative z-10 mb-8 md:mb-10 gap-4">
                <div className="flex items-center gap-4 md:gap-5">
                   <div className="w-10 h-10 md:w-12 md:h-12 bg-[#15192c] rounded-xl flex items-center justify-center text-white shadow-lg shrink-0"><Gift size={20} md:size={24} /></div>
                   <h3 className="text-xl md:text-2xl font-black">Redeem Shop</h3>
                </div>
                <button className="text-[9px] font-bold uppercase tracking-widest text-[#ff69b4] flex items-center gap-2 group self-end sm:self-auto">
                   View More <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                {[
                  { name: 'Premium Month', price: '1000 🪙', img: '💎' },
                  { name: 'Expert Session', price: '2500 🪙', img: '🧑‍⚕️' },
                  { name: 'Wellness Kit', price: '5000 🪙', img: '🎁' }
                ].map((gift, i) => {
                  const isUnlocked = unlockedGifts.includes(gift.name);
                  return (
                    <motion.div 
                      key={i} 
                      whileHover={{ y: -5 }}
                      className="p-8 rounded-[2rem] bg-white border border-rose-50 flex flex-col items-center gap-4 shadow-sm"
                    >
                       <span className="text-5xl">{gift.img}</span>
                       <div className="text-center">
                          <h4 className="text-sm font-black">{gift.name}</h4>
                          <p className="text-[9px] font-bold text-[#ff69b4] uppercase tracking-widest">{gift.price}</p>
                       </div>
                       <button 
                         onClick={() => handleUnlock(gift)}
                         disabled={isUnlocked || coins < parseInt(gift.price)}
                         className={`w-full py-3.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all shadow-md ${
                           isUnlocked 
                           ? 'bg-rose-50 text-[#ff69b4]' 
                           : coins < parseInt(gift.price)
                             ? 'bg-gray-50 text-gray-400'
                             : 'bg-[#15192c] text-white hover:bg-[#ff69b4]'
                         }`}
                       >
                          {isUnlocked ? 'Unlocked' : 'Unlock Now'}
                       </button>
                    </motion.div>
                  );
                })}
             </div>
          </motion.section>

        </div>
      </motion.div>

      {/* ── Success Toast ── */}
      <AnimatePresence>
        {showToast && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[110] bg-[#15192c] text-white px-6 py-4 rounded-2xl shadow-xl flex items-center gap-3 border border-white/10">
            <CheckCircle2 size={16} className="text-[#ff69b4]" />
            <span className="text-[10px] font-bold uppercase tracking-widest tracking-tight">Reward Unlocked! ✨</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RewardsScreen;
