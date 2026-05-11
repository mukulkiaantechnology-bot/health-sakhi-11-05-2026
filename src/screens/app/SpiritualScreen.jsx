import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RefreshCw, Quote, ChevronLeft, ChevronRight, Library,
  Brain, DollarSign, Anchor, Sparkles, Heart, Sun,
  HeartPulse, Flower2, BookOpen, HandHelping,
  Search, Moon, Share2, Copy, Volume2, Bookmark,
  Scale, Globe, User, Lightbulb, CheckCircle2, Star
} from 'lucide-react';
import { SPIRITUAL_DATA } from '../../data/spiritualData';

import gita from '../../assets/spiritual/gita.png';
import quran from '../../assets/spiritual/quran.png';
import bible from '../../assets/spiritual/bible.png';
import buddha from '../../assets/spiritual/buddha.png';
import jain from '../../assets/spiritual/jain.png';
import allImg from '../../assets/spiritual/all.png';

const SPIRITUAL_IMAGES = {
  'Bhagavad Gita': gita,
  'Quran': quran,
  'Bible': bible,
  'Sikhism': allImg,
  'Jainism': jain,
  'Buddhism': buddha,
  'All': allImg
};

const CATEGORIES = {
  'Wealth': {
    icon: '💰',
    subcategories: ['Saving Money', 'Earning Ethically', 'Financial Discipline', 'Greed vs Contentment', 'Charity & Donation', 'Detachment from Wealth'],
    accent: '#311021',
    text: 'white'
  },
  'Health': {
    icon: '💪',
    subcategories: ['Mind-Body Connection', 'Healing Energy', 'Wholesome Food', 'Sacred Sleep', 'Vitality', 'Inner Strength'],
    accent: '#311021',
    text: 'white'
  },
  'Mind': {
    icon: '🧠',
    subcategories: ['Control of Senses', 'Conquering Ego', 'Overcoming Anger', 'Anxiety & Worry', 'Clarity of Thought'],
    accent: '#311021',
    text: 'white'
  },
  'Success': {
    icon: '🚀',
    subcategories: ['Noble Ambition', 'Handling Failure', 'Strategic Planning', 'Honest Hardwork', 'Leadership'],
    accent: '#311021',
    text: 'white'
  },
  'Relations': {
    icon: '❤️',
    subcategories: ['Parents & Family', 'Noble Friendship', 'Compassion', 'Divine Love', 'Trust', 'Forgiveness'],
    accent: '#311021',
    text: 'white'
  },
  'Spirituality': {
    icon: '🧘',
    subcategories: ['Self Realization', 'Law of Karma', 'Path of Devotion', 'Meditation', 'Eternal Soul'],
    accent: '#311021',
    text: 'white'
  },
  'Ethics': {
    icon: '⚖️',
    subcategories: ['Truth & Sincerity', 'Non-violence', 'Right Conduct', 'Justice', 'Purity'],
    accent: '#311021',
    text: 'white'
  },
  'Life Wisdom': {
    icon: '🌍',
    subcategories: ['Universal Peace', 'Harmony', 'Service to Humanity', 'Nature & Environment'],
    accent: '#311021',
    text: 'white'
  }
};

const RELIGION_CONFIG = {
  'Bhagavad Gita': { icon: () => <Sun size={20} />, color: '#D97706' },
  'Quran': { icon: () => <Moon size={20} />, color: '#6366F1' },
  'Bible': { icon: () => <Library size={20} />, color: '#A855F7' },
  'Jainism': { icon: () => <HandHelping size={20} />, color: '#EF4444' },
  'Sikhism': { icon: () => <Anchor size={20} />, color: '#D946EF' },
  'Buddhism': { icon: () => <Flower2 size={20} />, color: '#10B981' },
  'All': { icon: () => <Globe size={20} />, color: '#64748B' }
};

const RELIGIONS = ['All', 'Bhagavad Gita', 'Quran', 'Bible', 'Sikhism', 'Jainism', 'Buddhism'];

const SpiritualScreen = () => {
  const [activeCat, setActiveCat] = useState('Wealth');
  const [activeSubCat, setActiveSubCat] = useState('Saving Money');
  const [religionFilter, setReligionFilter] = useState('Bhagavad Gita');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [customSpiritual, setCustomSpiritual] = useState([]);

  // --- Real-time Sync with Admin Hub ---
  const fetchCustomContent = React.useCallback(() => {
    const saved = localStorage.getItem('hs_sakhi_content');
    if (saved) {
      const allContent = JSON.parse(saved);
      const filtered = allContent
        .filter(item => item.tab === 'spiritual' && item.status === 'Published')
        .map(item => ({
          quote: item.title,
          source: item.scripture,
          reference: item.topic,
          insight: item.description,
          example: "Shared by Sakhi Admin",
          takeaway: "Apply this wisdom today.",
          focus: item.focus,
          topic: item.topic,
          image: item.mediaUrl
        }));
      setCustomSpiritual(filtered);
    }
  }, []);

  React.useEffect(() => {
    fetchCustomContent();
    window.addEventListener('storage', fetchCustomContent);
    return () => window.removeEventListener('storage', fetchCustomContent);
  }, [fetchCustomContent]);

  const getFilteredContent = () => {
    // 1. Get static data
    let combined = SPIRITUAL_DATA[activeCat]?.[activeSubCat] || [];
    
    // 2. Add custom data that matches current Focus and Topic
    const matchedCustom = customSpiritual.filter(item => 
      item.focus === activeCat && item.topic === activeSubCat
    );
    
    combined = [...matchedCustom, ...combined];

    // 3. Filter by Religion (Scripture)
    if (religionFilter === 'All') return combined;
    const filtered = combined.filter(item => item.source === religionFilter);
    
    return filtered.length > 0 ? filtered : combined;
  };

  const filteredItems = getFilteredContent();

  const handleNext = () => {
    if (isFlipping || filteredItems.length <= 1) return;
    setIsFlipping(true);
    setTimeout(() => {
      setCurrentIndex(prev => (prev + 1) % filteredItems.length);
      setIsFlipping(false);
    }, 500);
  };

  const handlePrev = () => {
    if (isFlipping || filteredItems.length <= 1) return;
    setIsFlipping(true);
    setTimeout(() => {
      setCurrentIndex(prev => (prev - 1 + filteredItems.length) % filteredItems.length);
      setIsFlipping(false);
    }, 500);
  };

  const currentItem = filteredItems[currentIndex];

  return (
    <div className="min-h-screen pb-24 bg-[#FDFBF7] relative font-serif w-full overflow-x-hidden">
      
      {/* Header & Religion Selection */}
      <div className="pt-8 w-full flex flex-col lg:flex-row items-center justify-between gap-6 px-4 md:px-12 lg:px-20">
        
        {/* Logo Section */}
        <div className="flex flex-col items-start translate-y-[-10px]">
           <h1 className="text-[26px] font-black text-[#15192c] flex items-center gap-2 font-serif tracking-tight">
              Spiritual Sakhi <span className="text-[#6D28D9] text-3xl">🕉️</span>
           </h1>
           <p className="text-[9px] text-[#A8A29E] uppercase tracking-[0.4em] font-black mt-1">
              Divine Wisdom for the Soul
           </p>
        </div>

        {/* Religion Pill Navigation */}
        <div className="bg-white px-2 py-2 rounded-full shadow-[0_10px_30px_rgba(45,21,32,0.05)] border border-rose-100/50 flex items-center max-w-full overflow-x-auto no-scrollbar">
           <div className="flex items-center">
              {Object.entries(RELIGION_CONFIG).map(([name, config], idx) => (
                <React.Fragment key={name}>
                  <button
                     onClick={() => { setReligionFilter(name); setCurrentIndex(0); }}
                     className={`flex items-center gap-3 px-6 py-3.5 rounded-full transition-all duration-500 whitespace-nowrap ${religionFilter === name 
                       ? 'bg-[#CC8E1F] text-white shadow-lg' 
                       : 'text-[#57534E] hover:bg-stone-50'}`}
                  >
                     <div className={religionFilter === name ? 'text-white' : 'text-stone-400'}>
                        {config.icon()}
                     </div>
                     <span className={`text-[13px] font-bold ${religionFilter === name ? 'tracking-normal' : 'tracking-tight'}`}>
                        {name}
                     </span>
                  </button>
                  {idx < Object.entries(RELIGION_CONFIG).length - 1 && (
                    <div className="w-[1px] h-6 bg-stone-100 mx-1" />
                  )}
                </React.Fragment>
              ))}
           </div>
        </div>

        {/* Action Circles */}
        <div className="flex items-center gap-3">
           {[Search, Heart, Moon].map((Icon, idx) => (
             <button key={idx} className="w-12 h-12 rounded-full bg-white border border-rose-100/50 shadow-sm flex items-center justify-center text-[#57534E] hover:bg-stone-50 hover:shadow-md transition-all">
                <Icon size={20} strokeWidth={2.5} />
             </button>
           ))}
        </div>
      </div>

      {/* Category Ribbon */}
      <div className="mt-8 flex justify-center px-4 md:px-6 lg:px-10">
        <div className="bg-[#FAF9F6] p-2.5 rounded-[3rem] shadow-[0_10px_40px_rgba(45,21,32,0.03)] border border-stone-100 flex gap-2 overflow-x-auto no-scrollbar max-w-full">
          {Object.entries(CATEGORIES).map(([name, cat]) => (
            <button
              key={name}
              onClick={() => { setActiveCat(name); setActiveSubCat(cat.subcategories[0]); setCurrentIndex(0); }}
              className={`flex items-center gap-3 px-8 py-4 rounded-[2.5rem] transition-all duration-500 whitespace-nowrap ${activeCat === name 
                ? 'bg-[#311021] text-white shadow-xl scale-105' 
                : 'text-[#15192c] hover:bg-white hover:shadow-sm font-medium'}`}
            >
              <span className="text-xl">{cat.icon}</span>
              <span className="text-[15px] font-black tracking-tight uppercase">
                 {name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Subcategory Pill Style */}
      <div className="mt-6 flex justify-center px-4 md:px-6 lg:px-10">
        <div className="bg-[#F3F0EC] p-2 rounded-full border border-stone-200/40 flex gap-2 overflow-x-auto no-scrollbar max-w-full">
          {(() => {
            // Combine static and custom topics for the active focus area
            const staticSubs = CATEGORIES[activeCat].subcategories;
            const customSubs = [...new Set(customSpiritual.filter(item => item.focus === activeCat).map(item => item.topic))];
            const allSubs = [...new Set([...staticSubs, ...customSubs])];
            
            return allSubs.map(sub => (
              <button
                key={sub}
                onClick={() => { setActiveSubCat(sub); setCurrentIndex(0); }}
                className={`px-7 py-3 rounded-full text-[13px] font-black uppercase tracking-widest transition-all duration-500 whitespace-nowrap ${activeSubCat === sub 
                  ? 'bg-[#CC8E1F] text-white shadow-lg' 
                  : 'text-[#57534E]/60 hover:text-[#57534E] hover:bg-white/50'}`}
              >
                {sub}
              </button>
            ));
          })()}
          <button className="px-7 py-3 rounded-full text-[13px] font-black uppercase tracking-widest text-[#57534E]/40 hover:text-[#57534E] flex items-center gap-2">
             More <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* The Book View */}
      <div className="mt-10 w-full flex justify-center px-4 md:px-10">
        <div className="relative bg-[#15192c] rounded-[3.5rem] p-5 shadow-[0_50px_120px_-20px_rgba(45,21,32,0.5)] max-w-7xl w-full">
          
          <div className="relative aspect-[16/10] md:aspect-[16/9.5] bg-[#FDFBF7] rounded-[2.5rem] overflow-hidden flex shadow-inner border border-rose-900/10">
            
            {/* Spine Hinges */}
            <div className="absolute left-1/2 top-0 bottom-0 w-[20px] -translate-x-1/2 z-30 flex flex-col justify-around py-20 pointer-events-none">
               {[...Array(5)].map((_, i) => (
                 <div key={i} className="w-[30px] h-[4px] bg-gradient-to-r from-amber-200 via-amber-500 to-amber-200 rounded-full shadow-sm -ml-[5px] border border-amber-900/10" />
               ))}
            </div>

            {/* Left Page */}
            <div className="flex-1 relative overflow-hidden flex flex-col justify-end p-12 md:p-16 border-r border-[#E7E5E4] shadow-[inset_-20px_0_30px_rgba(0,0,0,0.05)] bg-[#1a1a1a]">
               <AnimatePresence mode="wait">
                  <motion.div 
                    key={religionFilter} 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }} 
                    transition={{ duration: 0.8 }}
                    className="absolute inset-0"
                  >
                    <img 
                      src={currentItem?.image || SPIRITUAL_IMAGES[religionFilter] || SPIRITUAL_IMAGES['All']} 
                      className="w-full h-full object-cover" 
                      alt=""
                    />
                    <div className="absolute inset-0 bg-black/40" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  </motion.div>
               </AnimatePresence>
               
               <div className="relative z-10 space-y-6">
                  <div className="text-amber-400 opacity-90">
                     <Quote size={50} fill="currentColor" />
                  </div>
                  <AnimatePresence mode="wait">
                    {currentItem ? (
                      <motion.div key={currentIndex+activeSubCat} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} className="space-y-8">
                         <p className="text-3xl md:text-4xl font-bold text-white leading-tight font-serif drop-shadow-md">
                           {currentItem.quote}
                         </p>
                         <div className="space-y-1">
                            <p className="text-amber-500 font-bold text-lg">
                               — {currentItem.source}
                            </p>
                            <p className="text-white/60 text-[12px] font-medium tracking-wide">{currentItem.reference}</p>
                         </div>
                         <button className="flex items-center gap-2 px-6 py-2 rounded-full border border-white/40 text-white text-[12px] font-medium hover:bg-white/10 transition-all mt-6">
                            <div className="w-5 h-5 rounded-full border border-white/60 flex items-center justify-center text-[10px]">i</div>
                            About This Verse
                         </button>
                      </motion.div>
                    ) : <div className="h-40" />}
                  </AnimatePresence>
               </div>
            </div>

            {/* Right Page */}
            <div className="flex-1 bg-white p-10 md:p-14 flex flex-col relative overflow-hidden shadow-[inset_20px_0_30px_rgba(0,0,0,0.02)]">
               <div className="absolute top-0 right-0 w-48 h-48 bg-rose-50/20 rounded-bl-full -z-0" />
               
               <AnimatePresence mode="wait">
                  {currentItem ? (
                    <motion.div key={currentIndex+activeSubCat} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="h-full flex flex-col relative z-10">
                       
                       <section className="flex gap-4 mb-6 items-start">
                          <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 flex-shrink-0">
                             <Lightbulb size={20} strokeWidth={2.5} />
                          </div>
                          <div className="space-y-2 flex-1">
                             <h4 className="text-[15px] font-bold text-stone-800">Meaning / Insight</h4>
                             <p className="text-[14px] text-stone-600 leading-relaxed">{currentItem.insight}</p>
                             <div className="pt-6 border-b border-dashed border-stone-200" />
                          </div>
                       </section>

                       <section className="flex gap-4 mb-6 items-start">
                          <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 flex-shrink-0">
                             <User size={20} strokeWidth={2.5} />
                          </div>
                          <div className="space-y-2 flex-1">
                             <h4 className="text-[15px] font-bold text-stone-800">Real Life Example</h4>
                             <p className="text-[14px] text-stone-600 leading-relaxed">{currentItem.example}</p>
                             <div className="pt-6 border-b border-dashed border-stone-200" />
                          </div>
                       </section>

                       <section className="flex gap-4 items-start">
                          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 flex-shrink-0">
                             <CheckCircle2 size={20} strokeWidth={2.5} />
                          </div>
                          <div className="space-y-2 flex-1">
                             <h4 className="text-[15px] font-bold text-stone-800">Practical Takeaway</h4>
                             <p className="text-[14px] text-stone-600 leading-relaxed">{currentItem.takeaway}</p>
                          </div>
                       </section>
                       
                       <div className="mt-auto pt-6">
                          <div className="bg-[#FFF9F0] p-4 rounded-full border border-amber-100 flex items-center gap-3 text-amber-900/80 shadow-sm">
                             <Star size={18} fill="#D4A14C" strokeWidth={0} />
                             <p className="text-[14px] font-medium italic">
                                {currentItem.takeaway}
                             </p>
                          </div>
                       </div>
                    </motion.div>
                  ) : (
                    <div className="h-full flex items-center justify-center">
                       <Library size={48} className="text-stone-200 animate-pulse" />
                    </div>
                  )}
               </AnimatePresence>
            </div>
          </div>

          {/* Nav Arrows */}
          <button onClick={handlePrev} className="absolute left-[-28px] top-1/2 -translate-y-1/2 w-16 h-16 bg-[#1a0a13] text-white rounded-full shadow-2xl flex items-center justify-center z-50 border-4 border-white group transition-all hover:scale-110 active:scale-95">
             <ChevronLeft size={28} />
          </button>
          <button onClick={handleNext} className="absolute right-[-28px] top-1/2 -translate-y-1/2 w-16 h-16 bg-[#1a0a13] text-white rounded-full shadow-2xl flex items-center justify-center z-50 border-4 border-white group transition-all hover:scale-110 active:scale-95">
             <ChevronRight size={28} />
          </button>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="mt-8 w-full flex flex-wrap justify-center gap-4 px-4 md:px-12 lg:px-20">
        {[
          { label: 'Next Quote', icon: RefreshCw, color: '#D97706', action: handleNext },
          { label: 'Save Favorite', icon: Bookmark, color: '#F43F5E' },
          { label: 'Share', icon: Share2, color: '#6366F1' },
          { label: 'Copy', icon: Copy, color: '#10B981' },
          { label: 'Listen', icon: Volume2, color: '#8B5CF6' }
        ].map((btn, idx) => (
          <button 
            key={idx} 
            onClick={btn.action}
            className="flex items-center gap-2 px-8 py-3 rounded-2xl bg-white border border-stone-100 shadow-md hover:shadow-lg transition-all"
          >
             <btn.icon size={18} style={{ color: btn.color }} />
             <span className="text-[12px] font-black text-[#57534E] uppercase tracking-widest">{btn.label}</span>
          </button>
        ))}
      </div>

      {/* AI Ask Wisdom Section */}
      <div className="mt-20 w-full px-4 md:px-12 lg:px-20">
        <div className="relative overflow-hidden bg-white rounded-[3rem] p-10 md:p-14 border border-rose-100 shadow-[0_40px_80px_-20px_rgba(45,21,32,0.08)]">
           {/* Background Accents */}
           <div className="absolute top-0 right-0 w-80 h-80 bg-rose-50/40 rounded-full blur-3xl -mr-40 -mt-20" />
           <div className="absolute bottom-0 left-0 w-60 h-60 bg-amber-50/40 rounded-full blur-3xl -ml-30 -mb-10" />

           <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#311021]/5 text-[#311021] text-[10px] font-black uppercase tracking-widest mb-4">
                 <Sparkles size={12} className="text-amber-500" /> AI Spiritual Guide
              </div>
              
              <h2 className="text-4xl md:text-5xl font-black text-[#15192c] tracking-tight leading-tight">
                 Seek Divine Guidance <br/> 
                 <span className="text-[#CC8E1F]">Ask Spiritual Sakhi</span>
              </h2>
              
              <p className="text-stone-500 text-lg max-w-2xl mx-auto font-medium">
                 Type any situation, worry, or question, and let the timeless wisdom of sacred texts light your path.
              </p>

              <div className="mt-10 relative max-w-3xl mx-auto group">
                 <input 
                   type="text" 
                   placeholder="How can I find peace in difficult times?"
                   className="w-full bg-[#FDFBF7] border-2 border-stone-100 rounded-[2.5rem] px-10 py-8 pr-32 text-xl font-medium focus:outline-none focus:border-[#CC8E1F]/30 transition-all shadow-inner placeholder:text-stone-300"
                 />
                 <button className="absolute right-3 top-3 bottom-3 px-8 rounded-[2rem] bg-[#15192c] text-white font-bold flex items-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-lg group">
                    <span>Ask Sakhi</span>
                    <Search size={20} />
                 </button>
              </div>

              <div className="flex flex-wrap justify-center gap-3 pt-6">
                 {["Overcoming anxiety", "Handling loss", "Finding purpose", "Ethical wealth", "Silent mind"].map((tag) => (
                   <button key={tag} className="px-5 py-2.5 rounded-full bg-stone-50 text-stone-600 border border-stone-100 text-[13px] font-bold hover:bg-white hover:shadow-md transition-all">
                      # {tag}
                   </button>
                 ))}
              </div>
           </div>
        </div>
      </div>

      {/* Feature Footer */}
      <div className="mt-20 w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4 md:px-12 lg:px-20 pb-12">
        {[
          { icon: BookOpen, title: 'Authentic Quotes', desc: 'Sourced directly from sacred texts.', color: 'bg-orange-50 text-orange-600' },
          { icon: User, title: 'Practical Examples', desc: 'Real-life applications for daily life.', color: 'bg-amber-50 text-amber-600' },
          { icon: Heart, title: 'Inner Peace', desc: 'Positive living and mental wellness.', color: 'bg-rose-50 text-rose-600' },
          { icon: CheckCircle2, title: 'Universal Wisdom', desc: 'Timeless guidance for everyone.', color: 'bg-emerald-50 text-emerald-600' }
        ].map((feat, idx) => (
          <div key={idx} className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100 flex items-center gap-6 group hover:shadow-md transition-all">
             <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110 ${feat.color}`}>
                <feat.icon size={28} />
             </div>
             <div>
                <h5 className="text-[13px] font-black text-[#1C1917] uppercase tracking-wide mb-1">{feat.title}</h5>
                <p className="text-xs text-[#78716C] leading-relaxed font-medium">{feat.desc}</p>
             </div>
          </div>
        ))}
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #ff69b4; border-radius: 10px; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default SpiritualScreen;
