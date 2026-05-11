import React, { useState, useEffect } from 'react';
import {
  Play, Sparkles, User, Zap, Plus, Search,
  Filter, MoreVertical, Edit, Trash2, CheckCircle, X, UploadCloud, Video, BookOpen, Clock, Tag, MessageCircle, ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SakhiCMS = () => {
  const [activeTab, setActiveTab] = useState('meditation');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contentList, setContentList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [formData, setFormData] = useState({
    id: null,
    title: '',
    description: '',
    duration: '',
    category: 'All', // Sub-category (e.g. Health, Sleep)
    scripture: 'Bhagavad Gita', // Level 1 (Spiritual)
    focus: 'Wealth', // Level 2 (Spiritual)
    topic: 'Saving Money', // Level 3 (Spiritual)
    author: 'Admin',
    status: 'Published',
    mediaUrl: '',
    type: 'Video Module' // Video, Audio, Text
  });

  const tabs = [
    { id: 'meditation', name: 'Meditation', icon: Play },
    { id: 'affirmations', name: 'Affirmations', icon: Sparkles },
    { id: 'grooming', name: 'Grooming', icon: User },
    { id: 'spiritual', name: 'Gita Wisdom', icon: Zap },
  ];

  const subCategories = {
    meditation: ['All', 'Health', 'Relax', 'Sleep', 'Focus', 'Stress'],
    affirmations: ['Self Love', 'Relationship', 'Couples', 'Meditation', 'Confidence', 'Healing'],
    grooming: ['Skincare', 'Haircare', 'Body', 'Makeup', 'Confidence', 'Routine'],
    spiritual: {
      scriptures: ['Bhagavad Gita', 'Quran', 'Bible', 'Jainism', 'Sikhism', 'Buddhism', 'All'],
      focusAreas: ['Wealth', 'Health', 'Mind', 'Success', 'Relations', 'Spirituality', 'Ethics', 'Life Wisdom'],
      topics: {
        'Wealth': ['Saving Money', 'Earning Ethically', 'Financial Discipline', 'Greed vs Contentment', 'Charity & Donation', 'Detachment from Wealth'],
        'Health': ['Mind-Body Connection', 'Healing Energy', 'Wholesome Food', 'Sacred Sleep', 'Vitality', 'Inner Strength'],
        'Mind': ['Control of Senses', 'Conquering Ego', 'Overcoming Anger', 'Anxiety & Worry', 'Clarity of Thought'],
        'Success': ['Noble Ambition', 'Handling Failure', 'Strategic Planning', 'Honest Hardwork', 'Leadership'],
        'Relations': ['Parents & Family', 'Noble Friendship', 'Compassion', 'Divine Love', 'Trust', 'Forgiveness'],
        'Spirituality': ['Self Realization', 'Law of Karma', 'Path of Devotion', 'Meditation', 'Eternal Soul'],
        'Ethics': ['Truth & Sincerity', 'Non-violence', 'Right Conduct', 'Justice', 'Purity'],
        'Life Wisdom': ['Universal Peace', 'Harmony', 'Service to Humanity', 'Nature & Environment']
      }
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem('hs_sakhi_content');
    if (saved) {
      setContentList(JSON.parse(saved));
    }
  }, []);

  const handleAddContent = (e) => {
    e.preventDefault();
    const newId = formData.id || Date.now();
    const newContent = { 
      ...formData, 
      id: newId, 
      tab: activeTab,
      timestamp: new Date().toISOString()
    };
    
    const updatedList = formData.id 
      ? contentList.map(item => item.id === formData.id ? newContent : item)
      : [newContent, ...contentList];

    setContentList(updatedList);
    localStorage.setItem('hs_sakhi_content', JSON.stringify(updatedList));
    
    // Dispatch event for real-time sync across tabs
    window.dispatchEvent(new Event('storage'));
    
    setIsModalOpen(false);
    resetForm();
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this content?')) {
      const updatedList = contentList.filter(item => item.id !== id);
      setContentList(updatedList);
      localStorage.setItem('hs_sakhi_content', JSON.stringify(updatedList));
      window.dispatchEvent(new Event('storage'));
    }
  };

  const resetForm = () => {
    setFormData({
      id: null,
      title: '',
      description: '',
      duration: '',
      category: 'All',
      scripture: 'Bhagavad Gita',
      focus: 'Wealth',
      topic: 'Saving Money',
      author: 'Admin',
      status: 'Published',
      mediaUrl: '',
      type: 'Video Module'
    });
  };

  const filteredList = contentList.filter(item => 
    item.tab === activeTab && 
    (item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
     item.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getCounts = (tabId) => contentList.filter(item => item.tab === tabId).length;

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-[#15192c]">Sakhi Content Hub</h1>
          <p className="text-[#C4A0AC] font-bold uppercase text-[10px] tracking-[0.2em] mt-1">Unified Wellness Management</p>
        </div>
        <button 
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="flex items-center gap-2 px-8 py-4 bg-[#ff69b4] text-white rounded-2xl font-black text-[12px] uppercase tracking-widest shadow-xl shadow-rose-200 active:scale-95 transition-all"
        >
          <Plus size={18} /> Add New {activeTab} Content
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-rose-100 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-8 py-5 flex items-center gap-3 font-black text-[11px] uppercase tracking-widest transition-all border-b-4 whitespace-nowrap ${activeTab === tab.id
                ? 'border-[#ff69b4] text-[#ff69b4]'
                : 'border-transparent text-[#9A8A8E] hover:text-[#15192c]'
              }`}
          >
            <tab.icon size={18} />
            {tab.name}
            <span className={`text-[10px] px-2.5 py-1 rounded-lg ${activeTab === tab.id ? 'bg-[#ff69b4] text-white' : 'bg-rose-50 text-[#ff69b4]'}`}>
              {getCounts(tab.id)}
            </span>
          </button>
        ))}
      </div>

      {/* Control Bar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[#C4A0AC] group-focus-within:text-[#ff69b4] transition-colors" size={18} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${activeTab} content...`}
            className="w-full pl-14 pr-6 py-4 bg-white border border-rose-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#ff69b4]/5 focus:border-[#ff69b4] transition-all font-bold text-[#15192c]"
          />
        </div>
        <button className="px-8 py-4 bg-white border border-rose-100 rounded-2xl font-black text-[10px] uppercase tracking-widest text-[#15192c] flex items-center gap-2 hover:bg-rose-50 transition-all">
          <Filter size={18} /> Filters
        </button>
      </div>

      {/* Content Table */}
      <div className="bg-white rounded-[2.5rem] border border-rose-100 overflow-hidden shadow-2xl shadow-rose-900/5">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-rose-50/30 border-b border-rose-100">
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-[#C4A0AC]">Title / Author</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-[#C4A0AC]">Mapping</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-[#C4A0AC]">Status</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-[#C4A0AC]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-rose-50/50">
            {filteredList.length > 0 ? filteredList.map((item) => (
              <tr key={item.id} className="hover:bg-rose-50/20 transition-all group">
                <td className="px-8 py-6">
                  <p className="font-black text-[#15192c] text-sm">{item.title}</p>
                  <p className="text-[10px] font-bold text-[#C4A0AC] uppercase tracking-widest mt-0.5">{item.author} • {item.duration || 'N/A'}</p>
                </td>
                <td className="px-8 py-6">
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-rose-50 text-[#ff69b4] rounded-lg text-[9px] font-black uppercase tracking-widest">
                      {item.tab === 'spiritual' ? `${item.scripture} > ${item.focus}` : item.category}
                    </span>
                    {item.topic && (
                      <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[9px] font-black uppercase tracking-widest">
                        {item.topic}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${item.status === 'Published' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                    <CheckCircle size={12} /> {item.status}
                  </span>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => { setFormData(item); setIsModalOpen(true); }}
                      className="p-2.5 hover:bg-[#15192c] hover:text-white rounded-xl transition-all text-[#C4A0AC]"
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(item.id)}
                      className="p-2.5 hover:bg-rose-100 rounded-xl transition-all text-red-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="4" className="px-8 py-20 text-center">
                  <div className="flex flex-col items-center gap-3 opacity-20">
                    <BookOpen size={48} className="text-[#C4A0AC]" />
                    <p className="font-black text-[12px] uppercase tracking-widest text-[#C4A0AC]">No content found in {activeTab}</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Content Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#15192c]/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[3rem] w-full max-w-2xl shadow-2xl border border-rose-100 overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-10 border-b border-rose-50 flex items-center justify-between bg-rose-50/20">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-[#ff69b4] flex items-center justify-center text-white shadow-xl shadow-rose-200">
                    {formData.id ? <Edit size={24} /> : <Plus size={24} />}
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-[#15192c] tracking-tight">
                      {formData.id ? 'Edit' : 'Add New'} Sakhi Content
                    </h2>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#C4A0AC] mt-1 italic">
                      Publishing to {activeTab.toUpperCase()} module
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="w-12 h-12 flex items-center justify-center text-[#C4A0AC] hover:bg-rose-100 rounded-full transition-all"
                >
                  <X size={28} />
                </button>
              </div>

              <div className="p-10 overflow-y-auto no-scrollbar">
                <form onSubmit={handleAddContent} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    
                    {/* Common Header Field */}
                    <div className="col-span-2 space-y-2.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-[#C4A0AC] ml-1">Content Title</label>
                      <input 
                        required
                        type="text" 
                        placeholder="e.g. Deep Breathing 101"
                        className="w-full px-6 py-5 bg-rose-50/30 border border-rose-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#ff69b4]/5 focus:border-[#ff69b4] transition-all font-bold text-[#15192c] placeholder:text-slate-300"
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                      />
                    </div>

                    {/* DYNAMIC SUB-CATEGORY FIELDS */}
                    {activeTab !== 'spiritual' ? (
                      <div className="col-span-2 space-y-2.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-[#C4A0AC] ml-1">
                          {activeTab === 'affirmations' ? 'Focus Area' : 'Tag / Category'}
                        </label>
                        <select 
                          className="w-full px-6 py-5 bg-rose-50/30 border border-rose-100 rounded-2xl font-bold text-[#15192c] focus:ring-4 focus:ring-[#ff69b4]/5 outline-none appearance-none"
                          value={formData.category}
                          onChange={(e) => setFormData({...formData, category: e.target.value})}
                        >
                          {subCategories[activeTab]?.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      </div>
                    ) : (
                      <>
                        <div className="space-y-2.5">
                          <label className="text-[10px] font-black uppercase tracking-widest text-[#C4A0AC] ml-1">Holy Scripture</label>
                          <select 
                            className="w-full px-6 py-5 bg-rose-50/30 border border-rose-100 rounded-2xl font-bold text-[#15192c]"
                            value={formData.scripture}
                            onChange={(e) => setFormData({...formData, scripture: e.target.value})}
                          >
                            {subCategories.spiritual.scriptures.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </div>
                        <div className="space-y-2.5">
                          <label className="text-[10px] font-black uppercase tracking-widest text-[#C4A0AC] ml-1">Wellness Focus</label>
                          <select 
                            className="w-full px-6 py-5 bg-rose-50/30 border border-rose-100 rounded-2xl font-bold text-[#15192c]"
                            value={formData.focus}
                            onChange={(e) => {
                              const newFocus = e.target.value;
                              const newTopic = subCategories.spiritual.topics[newFocus][0];
                              setFormData({...formData, focus: newFocus, topic: newTopic});
                            }}
                          >
                            {subCategories.spiritual.focusAreas.map(f => <option key={f} value={f}>{f}</option>)}
                          </select>
                        </div>
                        {subCategories.spiritual.topics[formData.focus] && (
                           <div className="col-span-2 space-y-2.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-[#C4A0AC] ml-1">Specific Topic</label>
                            <select 
                              className="w-full px-6 py-5 bg-rose-50/30 border border-rose-100 rounded-2xl font-bold text-[#15192c]"
                              value={formData.topic}
                              onChange={(e) => setFormData({...formData, topic: e.target.value})}
                            >
                              {subCategories.spiritual.topics[formData.focus].map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                          </div>
                        )}
                      </>
                    )}

                    <div className="space-y-2.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-[#C4A0AC] ml-1">Duration / Length</label>
                      <input 
                        type="text" placeholder="e.g. 15:00"
                        className="w-full px-6 py-5 bg-rose-50/30 border border-rose-100 rounded-2xl font-bold text-[#15192c]"
                        value={formData.duration}
                        onChange={(e) => setFormData({...formData, duration: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-[#C4A0AC] ml-1">Lead Advisor</label>
                      <input 
                        type="text" placeholder="Dr. Sakshi"
                        className="w-full px-6 py-5 bg-rose-50/30 border border-rose-100 rounded-2xl font-bold text-[#15192c]"
                        value={formData.author}
                        onChange={(e) => setFormData({...formData, author: e.target.value})}
                      />
                    </div>

                    <div className="col-span-2 space-y-2.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-[#C4A0AC] block mb-3 ml-1">
                        Asset Upload (Audio/Video/Image)
                      </label>
                      <div className="w-full border-4 border-dashed border-rose-50 rounded-[2.5rem] p-12 flex flex-col items-center justify-center gap-5 hover:bg-rose-50/50 hover:border-[#ff69b4]/20 transition-all cursor-pointer group relative">
                        <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) setFormData({...formData, mediaUrl: URL.createObjectURL(file)});
                        }} />
                        <div className="w-20 h-20 rounded-[2rem] bg-rose-100 flex items-center justify-center text-[#ff69b4] group-hover:scale-110 transition-transform shadow-inner">
                          <UploadCloud size={36} />
                        </div>
                        <div className="text-center">
                          <p className="text-base font-black text-[#15192c]">Click to upload {activeTab} asset</p>
                          <p className="text-[11px] font-bold text-[#C4A0AC] mt-1 uppercase tracking-widest">MP3, MP4 or High-Res Image (Max 50MB)</p>
                        </div>
                      </div>
                    </div>

                    <div className="col-span-2 space-y-2.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-[#C4A0AC] ml-1">Full Description</label>
                      <textarea 
                        rows="4"
                        placeholder="Provide detailed context for the sisters..."
                        className="w-full px-6 py-5 bg-rose-50/30 border border-rose-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#ff69b4]/5 focus:border-[#ff69b4] transition-all font-bold text-[#15192c] resize-none"
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-5 pt-8 border-t border-rose-50">
                    <button 
                      type="button" 
                      onClick={() => setIsModalOpen(false)}
                      className="px-10 py-5 text-[#C4A0AC] font-black text-[12px] uppercase tracking-[0.2em] hover:bg-rose-50 rounded-2xl transition-all"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      className="px-12 py-5 bg-[#15192c] text-white font-black text-[12px] uppercase tracking-[0.2em] rounded-2xl shadow-2xl shadow-indigo-900/40 hover:scale-105 active:scale-95 transition-all"
                    >
                      {formData.id ? 'Save Changes' : `Publish ${activeTab}`}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SakhiCMS;
