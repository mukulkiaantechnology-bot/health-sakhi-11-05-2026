import React, { useState, useRef, useEffect } from 'react';
import { Plus, Search, Filter, MoreVertical, Video, BookOpen, Share2, Eye, Edit3, Trash2, X, UploadCloud, CheckCircle, Clock, Tag, FileText, PlayCircle, ChevronDown, Rocket, Layers, Ghost } from 'lucide-react';

// ── Sample Content Data ───────────────────────────────────────────────────────
const INITIAL_CONTENT = [
  { id: 1, title: 'The Puberty Roadmap', type: 'Video', cat: 'Women Health', status: 'Published', date: '2 days ago', desc: 'A comprehensive guide for young women navigating physical and emotional changes.', mediaUrl: 'https://vjs.zencdn.net/v/oceans.mp4' },
  { id: 2, title: 'PCOD Masterclass', type: 'Video', cat: 'Women Health', status: 'Draft', date: '5 hours ago', desc: 'Advanced strategies for managing PCOD through diet and lifestyle.', mediaUrl: 'https://vjs.zencdn.net/v/oceans.mp4' },
  { id: 3, title: 'Inner Healing Guide', type: 'Book', cat: 'Mental Health', status: 'Published', date: '1 week ago', desc: 'Reflective practices and meditations for inner peace and mental clarity.', mediaUrl: null },
  { id: 4, title: 'Decoding Hunger', type: 'Book', cat: 'Food & Lifestyle', status: 'Published', date: '10 days ago', desc: 'Understanding biological vs emotional hunger signals.', mediaUrl: null },
  { id: 5, title: 'Heart Wellness Intro', type: 'Video', cat: 'Heart Care', status: 'Archived', date: '1 month ago', desc: 'Introduction to cardiovascular health for sisters above 40.', mediaUrl: 'https://vjs.zencdn.net/v/oceans.mp4' },
];

// ── Color Mappings ───────────────────────────────────────────────────────────
const CAT_COLORS = {
  'Women Health': 'bg-purple-50 text-purple-600 border-purple-100',
  'Mental Healing': 'bg-blue-50 text-blue-600 border-blue-100',
  'Heart Care': 'bg-rose-50 text-rose-600 border-rose-100',
  'Relationships': 'bg-rose-50 text-rose-600 border-rose-100',
  'Cravings': 'bg-amber-50 text-amber-600 border-amber-100',
  'Food & Lifestyle': 'bg-amber-50 text-amber-600 border-amber-100',
  'Default': 'bg-slate-50 text-slate-600 border-slate-100'
};

const TYPE_COLORS = {
  'Video': 'bg-blue-50 text-blue-600 border-blue-100',
  'Book': 'bg-indigo-50 text-indigo-600 border-indigo-100',
  'Default': 'bg-slate-50 text-slate-600 border-slate-100'
};

// ── Premium Form Dropdown ─────────────────────────────────────────────────────
const FormDropdown = ({ label, value, options, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative space-y-2" ref={dropdownRef}>
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</label>
      <button 
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full h-12 px-4 flex items-center justify-between bg-slate-50 border rounded-xl transition-all font-bold text-sm ${isOpen ? 'border-[#15192c] ring-2 ring-indigo-900/5' : 'border-black/5 hover:border-slate-200'}`}
      >
        <span className="text-slate-700">{value}</span>
        <ChevronDown size={16} className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="absolute top-[74px] left-0 w-full bg-white border border-black/5 rounded-xl shadow-xl z-50 p-1.5 animate-in slide-in-from-top-2 duration-200 overflow-hidden">
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => { onChange(opt); setIsOpen(false); }}
              className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${value === opt ? 'bg-[#15192c] text-white' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ── Custom Filter Dropdown Component ──────────────────────────────────────────
const StyledDropdown = ({ label, value, options, onChange, icon: Icon }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={() => setIsOpen(!isOpen)} className={`h-10 px-4 rounded-2xl border transition-all flex items-center gap-3 font-black text-[9px] uppercase tracking-widest min-w-[150px] justify-between ${isOpen ? 'bg-white border-[#15192c] ring-4 ring-indigo-900/5' : 'bg-white border-black/5 hover:border-slate-200'}`}>
        <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-lg ${isOpen ? 'bg-[#15192c] text-white' : 'bg-slate-50 text-slate-400'}`}><Icon size={14} /></div>
            <span className={isOpen ? 'text-[#15192c]' : 'text-slate-500'}>{value}</span>
        </div>
        <ChevronDown size={16} className={`transition-transform duration-300 text-slate-300 ${isOpen ? 'rotate-180 text-[#15192c]' : ''}`} />
      </button>
      {isOpen && (
        <div className="absolute top-16 left-0 w-full bg-white rounded-2xl shadow-2xl border border-black/5 p-2 z-30 animate-in zoom-in-95 duration-200">
           <p className="px-4 py-2 text-[8px] font-black text-slate-300 uppercase tracking-widest">{label}</p>
           {options.map(opt => (
               <button key={opt} onClick={() => { onChange(opt); setIsOpen(false); }} className={`w-full text-left px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${value === opt ? 'bg-indigo-50 text-[#15192c]' : 'text-slate-500 hover:bg-slate-50'}`}>{opt}</button>
           ))}
        </div>
      )}
    </div>
  );
};

// ── Reusable Modal Shell (Premium) ─────────────────────────────────────────────
const CMSModal = ({ open, onClose, title, icon: Icon, iconBg, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
      <style>{`
          .custom-cms-scrollbar::-webkit-scrollbar { width: 4px; }
          .custom-cms-scrollbar::-webkit-scrollbar-track { background: transparent; }
          .custom-cms-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 20px; border: 2px solid transparent; background-clip: content-box; }
      `}</style>
      <div className="bg-white rounded-t-[2.5rem] sm:rounded-[3rem] w-full sm:max-w-2xl shadow-2xl border border-black/5 animate-in slide-in-from-bottom sm:zoom-in-95 duration-500 max-h-[92vh] flex flex-col overflow-hidden relative">
        <div className="p-6 sm:p-8 border-b border-slate-50 flex items-center justify-between flex-shrink-0 bg-slate-50/50">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${iconBg} text-white transition-transform hover:scale-110`}><Icon size={24} /></div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight leading-none">{title}</h2>
          </div>
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center text-slate-400 hover:bg-slate-100 rounded-full transition-all active:scale-90"><X size={24} /></button>
        </div>
        <div className="p-6 sm:p-10 overflow-y-auto bg-white flex-1 custom-cms-scrollbar pr-[14px]">{children}</div>
      </div>
    </div>
  );
};

const ContentCMS = () => {
  const [content, setContent] = useState(INITIAL_CONTENT);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewItem, setViewItem] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All Categories');
  const [activeType, setActiveType] = useState('All Types');

  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [formData, setFormData] = useState({ title: '', type: 'Video Module', cat: 'Women Health', desc: '', status: 'Published' });

  const resetForm = () => {
    setFormData({ title: '', type: 'Video Module', cat: 'Women Health', desc: '', status: 'Published' });
    setSelectedFile(null);
  };

  // Sync with LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem('hs_custom_content');
    if (saved) {
      const customItems = JSON.parse(saved);
      // Merge with initial but keep custom on top
      setContent([...customItems, ...INITIAL_CONTENT.filter(i => !customItems.some(c => c.id === i.id))]);
    }
  }, []);

  const syncToStorage = (newList) => {
    const customOnly = newList.filter(item => item.id > 1000); // Simple logic for custom items
    localStorage.setItem('hs_custom_content', JSON.stringify(customOnly));
    window.dispatchEvent(new Event('storage'));
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    const mediaUrl = selectedFile ? URL.createObjectURL(selectedFile) : (editItem?.mediaUrl || null);
    let newList;
    if (editItem) {
        newList = content.map(item => item.id === editItem.id ? { ...item, ...formData, type: formData.type.includes('Video') ? 'Video' : 'Book', mediaUrl } : item);
        setContent(newList);
        setEditItem(null);
    } else {
        const newItem = { id: Date.now(), ...formData, type: formData.type.includes('Video') ? 'Video' : 'Book', status: 'Published', date: 'Just now', mediaUrl };
        newList = [newItem, ...content];
        setContent(newList);
        setIsModalOpen(false);
    }
    syncToStorage(newList);
    resetForm();
  };

  const handleDelete = () => {
    const newList = content.filter(item => item.id !== deleteId);
    setContent(newList);
    syncToStorage(newList);
    setDeleteId(null);
  };

  const filteredContent = content.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'All Categories' || item.cat === activeCategory;
    const matchesType = activeType === 'All Types' || (activeType === 'Videos' && item.type === 'Video') || (activeType === 'Books' && item.type === 'Book');
    return matchesSearch && matchesCategory && matchesType;
  });

  return (
    <div className="space-y-8 font-sans pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <div className="flex items-center gap-3 mb-2">
                <div className="w-1.5 h-8 bg-#15192c rounded-full shadow-lg shadow-#15192c/20"></div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight leading-none">Content Management</h1>
           </div>
          <p className="text-slate-400 font-medium ml-4 tracking-tight leading-none">Upload and oversee your <span className="text-#15192c font-black">wellness repository.</span></p>
        </div>
        <button 
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="px-4 py-3 bg-slate-900 text-white font-black rounded-xl text-[9px] uppercase tracking-[0.2em] shadow-lg shadow-slate-900/20 hover:scale-105 transition-transform flex items-center justify-center gap-2"
        >
          <Plus size={16} /> Create New Content
        </button>
      </div>

      {/* Filters & Dropdowns */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="flex-1 relative w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by title, category or author..." 
            className="w-full h-10 pl-12 pr-4 rounded-xl border border-black/5 bg-white shadow-sm focus:border-[#15192c] outline-none font-bold text-sm tracking-tight"
          />
        </div>
        <div className="flex gap-4 w-full md:w-auto">
            <StyledDropdown 
                label="Filter Category" 
                value={activeCategory} 
                options={['All Categories', 'Women Health', 'Heart Care', 'Mental Healing', 'Relationships', 'Cravings']} 
                onChange={setActiveCategory}
                icon={Tag}
            />
            <StyledDropdown 
                label="Resource Type" 
                value={activeType} 
                options={['All Types', 'Videos', 'Books']} 
                onChange={setActiveType}
                icon={Layers}
            />
        </div>
      </div>

      {/* Content Table */}
      <div className="bg-white rounded-[2.5rem] border border-black/5 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 text-slate-400 text-[9px] uppercase font-bold tracking-widest border-b border-black/5">
              <tr>
                <th className="px-4 py-3">Content Asset</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-[13px] divide-y divide-black/5">
              {filteredContent.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center transition-all group-hover:scale-110 shadow-sm border border-transparent ${TYPE_COLORS[item.type] || TYPE_COLORS.Default}`}>
                         {item.type === 'Video' ? <Video size={18} /> : <BookOpen size={18} />}
                      </div>
                      <div>
                        <p className="font-extrabold text-slate-800 tracking-tight leading-none mb-1 text-sm">{item.title}</p>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Modified {item.date}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${TYPE_COLORS[item.type] || TYPE_COLORS.Default}`}>
                        {item.type}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${CAT_COLORS[item.cat] || CAT_COLORS.Default}`}>
                        {item.cat}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                     <span className={`inline-flex items-center gap-1.5 font-black text-[9px] uppercase tracking-widest ${
                        item.status === 'Published' ? 'text-green-500' : item.status === 'Draft' ? 'text-amber-500' : 'text-slate-400'
                     }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${item.status === 'Published' ? 'bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-slate-400'}`}></div>
                        {item.status}
                     </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2 transition-all duration-300">
                       <button onClick={() => setViewItem(item)} className="w-8 h-8 flex items-center justify-center bg-white text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all shadow-sm border border-black/5"><Eye size={14} /></button>
                       <button onClick={() => { setEditItem(item); setFormData(item); setSelectedFile(null); }} className="w-8 h-8 flex items-center justify-center bg-white text-slate-400 hover:text-#15192c hover:bg-#15192c/10 rounded-lg transition-all shadow-sm border border-black/5"><Edit3 size={14} /></button>
                       <button onClick={() => setDeleteId(item.id)} className="w-8 h-8 flex items-center justify-center bg-white text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all shadow-sm border border-black/5"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── CREATE / EDIT MODAL ────────────────────────────────────────────────── */}
      {(isModalOpen || editItem) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
           <style>{`
              .fix-scrollbar::-webkit-scrollbar { width: 4px; }
              .fix-scrollbar::-webkit-scrollbar-track { background: transparent; }
              .fix-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 20px; border: 1px solid transparent; background-clip: content-box; }
              .fix-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
           `}</style>
           <div className="bg-white rounded-[2.5rem] w-full max-w-2xl shadow-2xl border border-black/5 animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col overflow-hidden">
              <div className="p-8 border-b border-black/5 flex items-center justify-between flex-shrink-0 bg-white z-10">
                <h2 className="text-xl font-black text-slate-800 tracking-tight">{editItem ? 'Edit Content' : 'Upload New Content'}</h2>
                <button onClick={() => { setIsModalOpen(false); setEditItem(null); }} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto fix-scrollbar pr-[14px]">
                <form className="p-8 space-y-6" onSubmit={handleUpdate}>
                  <input type="file" ref={fileInputRef} onChange={e => setSelectedFile(e.target.files[0])} className="hidden" accept="video/*,application/pdf" />
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2 col-span-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Content Title</label>
                      <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full h-12 px-4 bg-slate-50 border border-black/5 rounded-xl outline-none focus:border-#15192c text-sm font-bold shadow-inner" placeholder="e.g. Understanding PCOS" />
                    </div>
                    
                    <div className="col-span-2 sm:col-span-1">
                        <FormDropdown 
                            label="Content Type" 
                            value={formData.type} 
                            options={['Video Module', 'Interactive Book']} 
                            onChange={val => setFormData({...formData, type: val})} 
                        />
                    </div>

                    <div className="col-span-2 sm:col-span-1">
                        <FormDropdown 
                            label="Category" 
                            value={formData.cat} 
                            options={['Women Health', 'Heart Care', 'Mental Healing', 'Relationships', 'Cravings']} 
                            onChange={val => setFormData({...formData, cat: val})} 
                        />
                    </div>

                    <div className="col-span-2 sm:col-span-1">
                        <FormDropdown 
                            label="Publishing Status" 
                            value={formData.status} 
                            options={['Published', 'Draft']} 
                            onChange={val => setFormData({...formData, status: val})} 
                        />
                    </div>

                    <div className="col-span-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 font-black">Media Payload</label>
                      <div onClick={() => fileInputRef.current.click()} className={`w-full border-2 border-dashed rounded-[2rem] p-10 flex flex-col items-center justify-center gap-4 transition-all cursor-pointer group ${selectedFile ? 'border-[#15192c] bg-indigo-50/30' : 'border-slate-200 hover:border-[#15192c] hover:bg-indigo-50/30'}`}>
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${selectedFile ? 'bg-[#15192c] text-white shadow-xl' : 'bg-slate-50 text-slate-400 group-hover:scale-110'}`}>
                          {selectedFile ? <CheckCircle size={24} /> : <UploadCloud size={24} />}
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-bold text-slate-600">{selectedFile ? selectedFile.name : 'Click to upload or drag & drop module'}</p>
                          <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mt-1">MP4 or PDF (Max. 500MB)</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2 col-span-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Description Summary</label>
                      <textarea value={formData.desc} onChange={e => setFormData({...formData, desc: e.target.value})} className="w-full h-32 p-4 bg-slate-50 border border-black/5 rounded-xl outline-none focus:border-[#15192c] text-sm font-bold resize-none shadow-inner" placeholder="Provide a brief summary for the sisters..."></textarea>
                    </div>
                  </div>
                  <div className="pt-6 border-t border-black/5 flex justify-end gap-3 mt-4">
                    <button type="button" onClick={() => { setIsModalOpen(false); setEditItem(null); }} className="px-6 py-2 text-slate-400 font-black text-[9px] uppercase tracking-widest hover:bg-slate-50 rounded-xl transition-all">Cancel</button>
                    <button type="submit" className="w-full py-4 bg-[#15192c] text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-indigo-200/50 hover:scale-[1.02] active:scale-95 transition-all">{editItem ? 'Update Asset' : 'Commit Asset'}</button>
                  </div>
                </form>
              </div>
           </div>
        </div>
      )}

      {/* ── VIEW MODAL ────────────────────────────────────────────────────────── */}
      <CMSModal open={!!viewItem} onClose={() => setViewItem(null)} title="Asset Preview" icon={Eye} iconBg="bg-blue-500">
        <div className="space-y-8">
           <div className="space-y-2">
              <h3 className="text-3xl font-black text-slate-800 tracking-tight leading-none">{viewItem?.title}</h3>
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <Clock size={12} /> {viewItem?.date}  <span className="mx-1 opacity-30">|</span> <span className="text-#15192c font-black">{viewItem?.status}</span>
              </div>
           </div>
           
           <div className="w-full aspect-video rounded-[2.5rem] bg-slate-900 overflow-hidden shadow-2xl relative group">
               {viewItem?.mediaUrl ? (
                 <video 
                   key={viewItem.mediaUrl}
                   controls 
                   autoPlay 
                   playsInline
                   crossOrigin="anonymous"
                   className="w-full h-full object-cover"
                 >
                   <source src={viewItem.mediaUrl} type="video/mp4" />
                   Your browser does not support the video tag.
                 </video>
               ) : (
                 <div className="flex flex-col items-center justify-center h-full text-white/20 gap-3 group-hover:scale-110 transition-transform">
                   <PlayCircle size={64} />
                   <p className="text-[10px] uppercase tracking-[0.4em] font-black">No Media Stream</p>
                 </div>
               )}
           </div>
           <div className="grid grid-cols-2 gap-4">
              <div className={`p-6 border rounded-[2rem] ${CAT_COLORS[viewItem?.cat] || CAT_COLORS.Default}`}><p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1 flex items-center gap-2"><Tag size={12}/> Category</p><p className="text-sm font-black uppercase tracking-tight leading-none">{viewItem?.cat}</p></div>
              <div className={`p-6 border rounded-[2rem] ${TYPE_COLORS[viewItem?.type] || TYPE_COLORS.Default}`}><p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1 flex items-center gap-2"><FileText size={12}/> Asset Format</p><p className="text-sm font-black uppercase tracking-tight leading-none">{viewItem?.type}</p></div>
           </div>
           <div className="p-8 bg-white border border-slate-100 rounded-[2.5rem] shadow-inner text-sm font-bold text-slate-500 leading-relaxed shadow-slate-100">{viewItem?.desc || 'A premium library module curated for Health Sakhi community.'}</div>
           <div className="flex justify-end pt-2"><button onClick={() => setViewItem(null)} className="px-6 py-2 bg-slate-900 text-white font-black text-[9px] uppercase tracking-widest rounded-2xl hover:bg-black transition-all">Dismiss View</button></div>
        </div>
      </CMSModal>

      {/* ── DELETE MODAL ──────────────────────────────────────────────────────── */}
      <CMSModal open={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Content" icon={Trash2} iconBg="bg-rose-500">
        <div className="p-8 bg-rose-50 border border-rose-100 rounded-[2.5rem] text-rose-800 font-bold mb-8 space-y-2">
            <p className="text-xl font-black">Confirm Deletion?</p>
            <p className="text-sm opacity-80 leading-relaxed">This action is permanent and will remove the module for all sisters across the network.</p>
        </div>
        <div className="flex justify-end gap-3"><button onClick={() => setDeleteId(null)} className="px-6 py-2 bg-slate-100 text-slate-500 font-black text-[9px] uppercase tracking-widest rounded-2xl hover:bg-slate-200 transition-all">Keep Asset</button><button onClick={handleDelete} className="px-8 py-2 bg-rose-500 text-white font-black text-[9px] uppercase tracking-widest rounded-2xl shadow-xl shadow-rose-500/20 active:scale-95 transition-all">Remove Permanently</button></div>
      </CMSModal>

    </div>
  );
};

export default ContentCMS;
