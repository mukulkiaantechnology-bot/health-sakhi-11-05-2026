import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Plus, Search, Filter, Edit2, Trash2, Download, Eye, UploadCloud, X, ChevronDown, CheckCircle, Clock, Tag, FileText, User, Layers, Info, Sparkles, Trophy } from 'lucide-react';

// ── Sample Books Data ──────────────────────────────────────────────────────────
const INITIAL_BOOKS = [
  { 
    id: 1, 
    title: 'Hunger Mystery: Inner Healing', 
    author: 'Dr. Sakshi', 
    category: 'Food & Nutrition', 
    reads: '1.2k', 
    status: 'Published', 
    date: '2 days ago', 
    desc: 'Understand the difference between emotional and physical hunger with Sakhi.'
  },
  { 
    id: 2, 
    title: 'The Hormonal Roadmap', 
    author: 'Dr. Meera', 
    category: 'Women Health', 
    reads: '2.5k', 
    status: 'Published', 
    date: '5 days ago', 
    desc: 'A complete guide to balancing hormones naturally at every stage of life.'
  },
  { 
    id: 3, 
    title: 'Mindful Sakhi: Peace Within', 
    author: 'Ananya Rao', 
    category: 'Mental Wellness', 
    reads: '980', 
    status: 'Published', 
    date: '1 week ago', 
    desc: 'Daily mindfulness practices for the busy modern woman.'
  },
  { 
    id: 4, 
    title: 'Heart-to-Heart Bonds', 
    author: 'Sana Khan', 
    category: 'Yoga & Lifestyle', 
    reads: '1.5k', 
    status: 'Published', 
    date: '3 days ago', 
    desc: 'Building healthy relationships and emotional boundaries with loved ones.'
  },
  { 
    id: 5, 
    title: 'Digital Detox Guide', 
    author: 'Dr. Alok', 
    category: 'General Health', 
    reads: '3.2k', 
    status: 'Published', 
    date: 'New', 
    desc: 'How to break free from screen addiction and reclaim your mental space.'
  },
];

// ── Color Mappings ───────────────────────────────────────────────────────────
const CAT_COLORS = {
  'Women Health': 'bg-purple-50 text-purple-600 border-purple-100',
  'Mental Wellness': 'bg-blue-50 text-blue-600 border-blue-100',
  'General Health': 'bg-emerald-50 text-emerald-600 border-emerald-100',
  'Food & Nutrition': 'bg-amber-50 text-amber-600 border-amber-100',
  'Yoga & Lifestyle': 'bg-rose-50 text-rose-600 border-rose-100',
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
      <button type="button" onClick={() => setIsOpen(!isOpen)} className={`w-full h-12 px-4 flex items-center justify-between bg-slate-50 border rounded-2xl transition-all font-bold text-[9px] ${isOpen ? 'border-[#15192c] ring-4 ring-indigo-900/5' : 'border-black/5 hover:border-slate-200'}`}>
        <span className="text-slate-700">{value}</span>
        <ChevronDown size={16} className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="absolute top-[82px] left-0 w-full bg-white border border-black/5 rounded-2xl shadow-xl z-[60] p-1.5 animate-in slide-in-from-top-2 duration-200">
          {options.map((opt) => (
            <button key={opt} type="button" onClick={() => { onChange(opt); setIsOpen(false); }} className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all ${value === opt ? 'bg-[#15192c] text-white' : 'text-slate-600 hover:bg-slate-50'}`}>
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ── Reader Insights (Multi-User Dashboard - Light Theme) ────────────────────────────────────────
const MOCK_USERS = [
  { id: 'u1', name: 'Anjali Sharma', email: 'anjali@example.com', promo: 'ANJ7036', days: 12, score: 88 },
  { id: 'u2', name: 'Priya Verma', email: 'priya@example.com', promo: 'PRI2024', days: 5, score: 72 },
  { id: 'u3', name: 'Kavita Singh', email: 'kavita@example.com', promo: 'KAV9988', days: 30, score: 95 },
  { id: 'u4', name: 'Sana Khan', email: 'sana@example.com', promo: 'SAN1122', days: 2, score: 0 }
];

const ReaderInsights = () => {
  const [selectedUser, setSelectedUser] = useState(MOCK_USERS[0]);
  const [allUserProgress, setAllUserProgress] = useState({});

  useEffect(() => {
    const progress = JSON.parse(localStorage.getItem('userProgress') || '{}');
    setAllUserProgress(progress);
  }, []);

  const getProgressForUser = (userId) => {
    if (userId === 'u3') return { 1: { percent: 100 }, 2: { percent: 100 }, 3: { percent: 100 } };
    if (userId === 'u4') return {};
    return allUserProgress;
  };

  const currentUserProgress = getProgressForUser(selectedUser.id);
  const totalBooks = INITIAL_BOOKS.length;
  const completedCount = Object.values(currentUserProgress).filter(p => p.percent === 100).length;

  // Calculate total time spent
  const totalSeconds = Object.values(currentUserProgress).reduce((sum, p) => sum + (p.time || 0), 0);
  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-20 text-left">
       
       {/* User Sidebar List */}
       <div className="w-full lg:w-80 space-y-4">
          <div className="bg-white rounded-[2.5rem] p-8 border border-[#F5E6EA] shadow-sm">
             <h3 className="text-[10px] font-black text-[#C4A0AC] uppercase tracking-widest mb-6 text-left">Academy Members</h3>
             <div className="space-y-3">
                {MOCK_USERS.map(user => (
                   <button 
                      key={user.id}
                      onClick={() => setSelectedUser(user)}
                      className={`w-full flex items-center gap-4 p-4 rounded-3xl border transition-all text-left ${selectedUser.id === user.id ? 'bg-[#FDEEF1] border-[#ff69b4] shadow-md shadow-pink-100' : 'bg-slate-50/50 border-slate-100 hover:border-slate-200'}`}
                   >
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm ${selectedUser.id === user.id ? 'bg-white text-[#ff69b4]' : 'bg-white text-slate-400 border border-slate-100'}`}>
                         {user.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                         <p className={`text-[12px] font-black truncate ${selectedUser.id === user.id ? 'text-[#15192c]' : 'text-slate-700'}`}>{user.name}</p>
                         <p className="text-[10px] font-bold text-slate-400 truncate uppercase tracking-tighter">{user.email}</p>
                      </div>
                   </button>
                ))}
             </div>
          </div>
       </div>

       {/* User Specific Dashboard - Light Style */}
       <div className="flex-1 space-y-8">
          <div className="bg-white rounded-[3.5rem] p-10 sm:p-14 border border-[#F5E6EA] shadow-xl shadow-pink-50/50 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-80 h-80 bg-[#FDEEF1] blur-[120px] rounded-full -mr-32 -mt-32 opacity-60"></div>
             
             <div className="relative z-10 space-y-10 text-left">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                   <div className="space-y-6">
                      <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#FDEEF1] text-[#ff69b4] rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">
                         <Sparkles size={14} /> 30-Day Challenge
                      </div>
                      <div className="space-y-2">
                         <p className="text-slate-800 text-2xl font-black text-left">{selectedUser.name}</p>
                         <div className="flex flex-col gap-1">
                            <p className="text-slate-500 text-[13px] font-bold text-left">Email: <span className="text-slate-700">{selectedUser.email}</span></p>
                            <p className="text-slate-500 text-[13px] font-bold text-left">Promo Code: <span className="text-[#ff69b4]">{selectedUser.promo}</span></p>
                         </div>
                      </div>
                   </div>
                   <div className="text-right">
                      <p className="text-[10px] font-black text-[#C4A0AC] uppercase tracking-widest mb-1">Status</p>
                      <span className={`px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest ${selectedUser.days >= 30 ? 'bg-indigo-50 text-indigo-600' : 'bg-amber-100 text-amber-600'}`}>
                         {selectedUser.days >= 30 ? 'Graduate' : 'In Training'}
                      </span>
                   </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-4">
                   <div className="flex justify-between items-end">
                      <p className="text-slate-800 text-sm font-black uppercase tracking-widest">Library Completion: {completedCount}/{totalBooks}</p>
                      <span className="text-slate-400 text-xs font-bold">{Math.round((completedCount/totalBooks)*100)}%</span>
                   </div>
                   <div className="h-4 bg-slate-100 rounded-full overflow-hidden p-1 border border-slate-200/50">
                      <div 
                         className="h-full bg-gradient-to-r from-indigo-600 to-blue-400 rounded-full transition-all duration-1000 shadow-lg shadow-indigo-100/50"
                         style={{ width: `${(completedCount / totalBooks) * 100}%` }}
                      />
                   </div>
                </div>
             </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
             {[
                { label: 'Books Read', val: completedCount, icon: BookOpen, color: 'text-amber-500', bg: 'bg-amber-50' },
                { label: 'Avg Test Score', val: completedCount > 0 ? `${selectedUser.score}%` : 'N/A%', icon: Trophy, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                { label: 'Reading Hours', val: formatTime(totalSeconds), icon: Clock, color: 'text-[#ff69b4]', bg: 'bg-[#FDEEF1]' },
                { label: 'Success Rate', val: '92%', icon: CheckCircle, color: 'text-purple-500', bg: 'bg-purple-50' },
                { label: 'Active Streak', val: '08 Days', icon: Sparkles, color: 'text-blue-500', bg: 'bg-blue-50' },
                { label: 'Learning Points', val: '1,250', icon: Trophy, color: 'text-orange-500', bg: 'bg-orange-50' },
             ].map((item, i) => (
                <div key={i} className="bg-white border border-[#F5E6EA] p-8 rounded-[3rem] flex flex-col items-center justify-center text-center group hover:shadow-xl hover:shadow-pink-50 transition-all duration-500">
                   <div className={`w-14 h-14 ${item.bg} rounded-2xl flex items-center justify-center ${item.color} mb-6 shadow-sm`}>
                      <item.icon size={24} />
                   </div>
                   <p className="text-2xl font-black text-slate-800 mb-1">{item.val}</p>
                   <p className="text-[#C4A0AC] text-[10px] font-black uppercase tracking-widest">{item.label}</p>
                </div>
             ))}
          </div>

          {/* Course Material Analytics - Graph Based */}
          <div className="bg-white rounded-[3rem] p-10 border border-[#F5E6EA] shadow-sm text-left">
             <div className="flex items-center justify-between mb-10">
                <div>
                   <h3 className="text-[12px] font-black text-slate-800 uppercase tracking-[0.2em]">Engagement Analytics</h3>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Reading consistency over the last 14 days</p>
                </div>
                <div className="flex items-center gap-4">
                   <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#ff69b4]"></div>
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Active Reading</span>
                   </div>
                   <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-indigo-600"></div>
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Quiz Passed</span>
                   </div>
                </div>
             </div>

             {/* Bar Chart Visualization */}
             <div className="relative h-64 flex items-end justify-between gap-2 px-2">
                {[
                   { day: '08 Apr', val: 40, quiz: 20 },
                   { day: '09 Apr', val: 65, quiz: 40 },
                   { day: '10 Apr', val: 45, quiz: 10 },
                   { day: '11 Apr', val: 90, quiz: 80 },
                   { day: '12 Apr', val: 75, quiz: 50 },
                   { day: '13 Apr', val: 30, quiz: 0 },
                   { day: '14 Apr', val: 55, quiz: 30 },
                   { day: '15 Apr', val: 85, quiz: 70 },
                   { day: '16 Apr', val: 95, quiz: 90 },
                   { day: '17 Apr', val: 40, quiz: 20 },
                   { day: '18 Apr', val: 60, quiz: 40 },
                   { day: '19 Apr', val: 80, quiz: 60 },
                   { day: '20 Apr', val: 100, quiz: 95 },
                   { day: '21 Apr', val: 70, quiz: 50 },
                ].map((d, i) => (
                   <div key={i} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                      {/* Tooltip */}
                      <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] font-black py-1.5 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap z-20 shadow-xl">
                         {d.val}% Read • {d.day}
                      </div>

                      {/* Bars */}
                      <div className="w-full max-w-[12px] bg-slate-100 rounded-full relative overflow-hidden h-full">
                         <div 
                            className="absolute bottom-0 w-full bg-gradient-to-t from-[#ff69b4] to-pink-300 rounded-full transition-all duration-1000 delay-150"
                            style={{ height: `${d.val}%` }}
                         />
                         <div 
                            className="absolute bottom-0 w-full bg-indigo-600/40 rounded-full transition-all duration-1000 delay-300"
                            style={{ height: `${d.quiz}%` }}
                         />
                      </div>
                      <span className="text-[8px] font-black text-slate-300 uppercase tracking-tighter mt-4 rotate-45 origin-left">{d.day}</span>
                   </div>
                ))}
             </div>
             
             {/* Summary Footer */}
             <div className="mt-20 p-6 bg-slate-50/50 rounded-[2rem] border border-slate-100 flex flex-wrap gap-10 items-center justify-center">
                <div className="text-center">
                   <p className="text-2xl font-black text-slate-800">84%</p>
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Avg Completion</p>
                </div>
                <div className="w-px h-10 bg-slate-200"></div>
                <div className="text-center">
                   <p className="text-2xl font-black text-indigo-600">92%</p>
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Quiz Success Rate</p>
                </div>
                <div className="w-px h-10 bg-slate-200"></div>
                <div className="text-center">
                   <p className="text-2xl font-black text-[#ff69b4]">14.2h</p>
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Total Learning Time</p>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
};
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
    <div className="relative flex-1 w-full" ref={dropdownRef}>
      <button onClick={() => setIsOpen(!isOpen)} className={`h-10 px-4 rounded-2xl border transition-all flex items-center gap-2 font-black text-[9px] uppercase tracking-widest w-full justify-between ${isOpen ? 'bg-white border-[#15192c] ring-4 ring-indigo-900/5' : 'bg-white border-black/5 hover:border-slate-200'}`}>
        <div className="flex items-center gap-2 overflow-hidden">
          <div className={`p-1.5 rounded-lg flex-shrink-0 ${isOpen ? 'bg-[#15192c] text-white' : 'bg-slate-50 text-slate-400'}`}><Icon size={14} /></div>
          <span className={`truncate ${isOpen ? 'text-[#15192c]' : 'text-slate-500'}`}>{value}</span>
        </div>
        <ChevronDown size={14} className={`flex-shrink-0 transition-transform duration-300 text-slate-300 ${isOpen ? 'rotate-180 text-[#15192c]' : ''}`} />
      </button>
      {isOpen && (
        <div className="absolute top-14 left-0 w-full bg-white rounded-2xl shadow-2xl border border-black/5 p-2 z-[60] animate-in zoom-in-95 duration-200 min-w-[200px]">
          <p className="px-4 py-2 text-[8px] font-black text-slate-300 uppercase tracking-widest">{label}</p>
          <div className="max-h-[250px] overflow-y-auto custom-book-scrollbar">
            {options.map(opt => (
              <button key={opt} onClick={() => { onChange(opt); setIsOpen(false); }} className={`w-full text-left px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${value === opt ? 'bg-indigo-50 text-[#15192c]' : 'text-slate-500 hover:bg-slate-50'}`}>{opt}</button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ── Reusable Modal Shell (Fixed Scrollbar & Inset) ──────────────────────────────
const CMSModal = ({ open, onClose, title, subtitle, icon: Icon, iconBg, children, footer }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300 font-sans text-left">
      <style>{`
          .custom-book-scrollbar::-webkit-scrollbar { width: 4px; }
          .custom-book-scrollbar::-webkit-scrollbar-track { background: transparent; }
          .custom-book-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 20px; border: 2px solid transparent; background-clip: content-box; }
      `}</style>
      <div className="bg-white rounded-t-[2.5rem] sm:rounded-[3rem] w-full sm:max-w-4xl shadow-2xl border border-black/5 animate-in slide-in-from-bottom sm:zoom-in-95 duration-500 max-h-[95vh] flex flex-col overflow-hidden relative">
        <div className="p-6 sm:p-8 border-b border-black/5 flex items-center justify-between flex-shrink-0 bg-slate-50/30">
          <div className="flex items-center gap-3 text-left">
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shadow-lg ${iconBg} text-white transition-transform hover:scale-110`}>
              <Icon size={20} />
            </div>
            <div className="overflow-hidden">
              <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight leading-none truncate">{title}</h2>
              {subtitle && <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5 truncate max-w-[200px] sm:max-w-md text-left">{subtitle}</p>}
            </div>
          </div>
          <button onClick={onClose} className="w-10 h-10 flex-shrink-0 flex items-center justify-center text-slate-400 hover:bg-slate-100 rounded-full transition-all active:scale-90"><X size={24} /></button>
        </div>
        <div className="p-6 sm:p-10 overflow-y-auto bg-white flex-1 custom-book-scrollbar pr-[18px]">
          {children}
        </div>
        {footer && (
          <div className="p-6 sm:p-8 border-t border-black/5 bg-slate-50/50 flex-shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

const BookCMS = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState(INITIAL_BOOKS);
  const [selectedIds, setSelectedIds] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('details'); // details, media, questions
  const [viewBook, setViewBook] = useState(null);
  const [editBook, setEditBook] = useState(null);
  const [deleteBook, setDeleteBook] = useState(null);

  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('All Categories');
  const [filterStatus, setFilterStatus] = useState('All Status');

  const initialFormData = { 
    title: '', 
    author: '', 
    category: 'Women Health', 
    desc: '', 
    status: 'Published',
    flipBookUrl: '',
    audioBookUrl: '',
    bookFile: null,
    coverUrl: null,
    questions: [
      { question: '', options: ['', '', '', ''], correct: 0, explanation: '' }
    ]
  };

  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    // Load custom books from localStorage and merge with initial ones
    const savedCustom = JSON.parse(localStorage.getItem('hs_custom_books') || '[]');
    if (savedCustom.length > 0) {
      // Filter out duplicates just in case
      const customIds = new Set(savedCustom.map(b => b.id));
      const baseBooks = INITIAL_BOOKS.filter(b => !customIds.has(b.id));
      setBooks([...savedCustom, ...baseBooks]);
    }
  }, []);

  useEffect(() => {
    const draft = localStorage.getItem('book_cms_draft');
    if (draft && !editBook && !isModalOpen) {
      // Option to restore draft could be added here
    }
  }, [editBook, isModalOpen]);

  const resetForm = () => {
    setFormData(initialFormData);
    setActiveTab('details');
  };

  const handleSaveDraft = () => {
    localStorage.setItem('book_cms_draft', JSON.stringify(formData));
    alert('Draft saved to local storage!');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editBook) {
      setBooks(prev => prev.map(b => b.id === editBook.id ? { ...b, ...formData } : b));
      setEditBook(null);
    } else {
      const newBook = { 
        id: Date.now(), 
        ...formData, 
        reads: '0', 
        date: 'Just now',
        isNew: true
      };
      
      setBooks([newBook, ...books]);
      
      // Save to localStorage for global visibility across the app
      const existingCustom = JSON.parse(localStorage.getItem('hs_custom_books') || '[]');
      localStorage.setItem('hs_custom_books', JSON.stringify([newBook, ...existingCustom]));
      window.dispatchEvent(new Event('storage'));
      
      setIsModalOpen(false);
    }
    localStorage.removeItem('book_cms_draft');
    resetForm();
  };

  const handleDelete = (id) => {
    const updatedBooks = books.filter(b => b.id !== id);
    setBooks(updatedBooks);
    
    // Sync with localStorage
    const existingCustom = JSON.parse(localStorage.getItem('hs_custom_books') || '[]');
    const updatedCustom = existingCustom.filter(b => b.id !== id);
    localStorage.setItem('hs_custom_books', JSON.stringify(updatedCustom));
    window.dispatchEvent(new Event('storage'));

    setDeleteBook(null);
    setSelectedIds(prev => prev.filter(sid => sid !== id));
  };

  const toggleSelect = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredBooks.length) setSelectedIds([]);
    else setSelectedIds(filteredBooks.map(b => b.id));
  }

  const handleBulkDelete = () => {
    if (!selectedIds.length) return;
    if (confirm(`Are you sure you want to delete ${selectedIds.length} books?`)) {
      const updatedBooks = books.filter(b => !selectedIds.includes(b.id));
      setBooks(updatedBooks);
      
      // Sync with localStorage
      const existingCustom = JSON.parse(localStorage.getItem('hs_custom_books') || '[]');
      const updatedCustom = existingCustom.filter(b => !selectedIds.includes(b.id));
      localStorage.setItem('hs_custom_books', JSON.stringify(updatedCustom));
      window.dispatchEvent(new Event('storage'));

      setSelectedIds([]);
    }
  }

  const addQuestion = () => {
    if (formData.questions.length < 5) {
      setFormData({
        ...formData,
        questions: [...formData.questions, { question: '', options: ['', '', '', ''], correct: 0, explanation: '' }]
      });
    }
  };

  const updateQuestion = (index, field, value) => {
    const updated = [...formData.questions];
    updated[index][field] = value;
    setFormData({ ...formData, questions: updated });
  };

  const updateOption = (qIndex, oIndex, value) => {
    const updated = [...formData.questions];
    updated[qIndex].options[oIndex] = value;
    setFormData({ ...formData, questions: updated });
  };

  const removeQuestion = (index) => {
    setFormData({
      ...formData,
      questions: formData.questions.filter((_, i) => i !== index)
    });
  };

  const filteredBooks = books.filter(b => {
    const matchesSearch = b.title.toLowerCase().includes(search.toLowerCase()) || b.author.toLowerCase().includes(search.toLowerCase());
    const matchesCat = filterCat === 'All Categories' || b.category === filterCat;
    const matchesStatus = filterStatus === 'All Status' || b.status === filterStatus;
    return matchesSearch && matchesCat && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 text-left font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header & Tab Switcher */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm animate-in fade-in duration-500">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-indigo-400 shadow-xl shadow-slate-900/10">
                <Layers size={24} />
             </div>
             <div>
                <h1 className="text-xl font-black text-slate-800 tracking-tight">Sakhi Academy CMS</h1>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Manage content & track engagement</p>
             </div>
          </div>

          <div className="flex items-center bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
             <button 
               onClick={() => setActiveTab('books')}
               className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'books' ? 'bg-white text-indigo-600 shadow-sm shadow-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
             >
               Manage Books
             </button>
             <button 
               onClick={() => setActiveTab('insights')}
               className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'insights' ? 'bg-white text-indigo-600 shadow-sm shadow-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
             >
               Reader Insights
             </button>
          </div>
          
          {activeTab === 'books' && (
            <button 
              onClick={() => setIsModalOpen(true)}
              className="px-8 py-4 bg-[#15192c] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-3 shadow-xl shadow-indigo-900/20 hover:scale-105 active:scale-95 transition-all"
            >
              <Plus size={18} /> Add New Book
            </button>
          )}
        </div>

        {activeTab === 'insights' ? (
          <ReaderInsights />
        ) : (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 px-1">
        {[{ label: 'Library Total', val: books.length }, { label: 'Total Reads', val: '12.4k' }, { label: 'Category Split', val: '05' }, { label: 'Draft Assets', val: books.filter(b => b.status === 'Draft').length },].map((stat, i) => (
          <div key={i} className="bg-white p-3 sm:p-4 rounded-[1.5rem] sm:rounded-[2rem] border border-black/5 shadow-sm">
            <p className="text-[8px] sm:text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 text-left">{stat.label}</p>
            <p className="text-xl font-black text-slate-800 tracking-tight text-left">{stat.val}</p>
          </div>
        ))}
      </div>

      {/* Control Bar */}
      <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 items-center bg-white p-2.5 rounded-[2rem] sm:rounded-3xl border border-black/5 shadow-sm mx-1">
        <div className="flex-1 relative w-full lg:ml-2">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search title, author or keywords..." className="w-full h-10 pl-12 pr-4 bg-transparent outline-none font-bold text-sm tracking-tight" />
        </div>
        <div className="flex flex-col sm:flex-row w-full lg:w-auto gap-2 lg:pr-2">
          <StyledDropdown label="By Category" value={filterCat} options={['All Categories', 'Women Health', 'Mental Wellness', 'General Health', 'Food & Nutrition', 'Yoga & Lifestyle']} onChange={setFilterCat} icon={Tag} />
          <StyledDropdown label="By Status" value={filterStatus} options={['All Status', 'Published', 'Draft']} onChange={setFilterStatus} icon={Layers} />
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-[2rem] sm:rounded-[3rem] border border-black/5 shadow-sm overflow-hidden animate-in slide-in-from-bottom-6 duration-500 mx-1">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-400 text-[9px] sm:text-[10px] uppercase font-black tracking-widest border-b border-black/5">
              <tr>
                <th className="px-3 sm:px-5 py-3 sm:py-4 w-12"><input type="checkbox" checked={selectedIds.length === filteredBooks.length && filteredBooks.length > 0} onChange={toggleSelectAll} className="w-4 h-4 rounded border-slate-300 accent-[#15192c]" /></th>
                <th className="px-3 sm:px-5 py-3 sm:py-4">Book Identification</th>
                <th className="px-3 sm:px-5 py-3 sm:py-4 hidden sm:table-cell">Category</th>
                <th className="px-3 sm:px-5 py-3 sm:py-4 hidden md:table-cell">Engagement</th>
                <th className="px-3 sm:px-5 py-3 sm:py-4">Status</th>
                <th className="px-3 sm:px-5 py-3 sm:py-4 text-right">Console</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 text-sm">
              {filteredBooks.map((book) => (
                <tr key={book.id} className={`hover:bg-slate-50/50 transition-colors group ${selectedIds.includes(book.id) ? 'bg-indigo-50/[0.02]' : ''}`}>
                  <td className="px-3 sm:px-5 py-3 sm:py-4"><input type="checkbox" checked={selectedIds.includes(book.id)} onChange={() => toggleSelect(book.id)} className="w-4 h-4 rounded border-slate-300 accent-[#15192c]" /></td>
                  <td className="px-3 sm:px-5 py-3 sm:py-4">
                    <div className="flex items-center gap-2 sm:gap-3 font-sans">
                      <div className={`w-9 sm:w-11 h-9 sm:h-11 rounded-xl flex items-center justify-center transition-all border border-black/5 shadow-sm flex-shrink-0 ${CAT_COLORS[book.category] || CAT_COLORS.Default}`}>
                        <BookOpen size={18} />
                      </div>
                      <div className="min-w-0 text-left">
                        <p className="font-black text-slate-800 tracking-tight leading-none mb-1 truncate text-sm text-left">{book.title}</p>
                        <p className="text-[8px] sm:text-[9px] font-black text-slate-400 uppercase tracking-widest truncate text-left">By {book.author}</p>
                        <div className="sm:hidden mt-2"><span className={`px-2 py-0.5 rounded-md text-[7px] font-black uppercase tracking-widest border ${CAT_COLORS[book.category] || CAT_COLORS.Default}`}>{book.category}</span></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 sm:px-5 py-3 sm:py-4 hidden sm:table-cell">
                    <span className={`px-2.5 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border ${CAT_COLORS[book.category] || CAT_COLORS.Default}`}>{book.category}</span>
                  </td>
                  <td className="px-3 sm:px-5 py-3 sm:py-4 font-bold text-slate-700 hidden md:table-cell">
                    <span className="text-slate-800 font-black text-sm">{book.reads}</span> <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest ml-1">Reads</span>
                  </td>
                  <td className="px-3 sm:px-5 py-3 sm:py-4">
                    <span className={`inline-flex items-center gap-1 text-[8px] font-black uppercase tracking-widest ${book.status === 'Published' ? 'text-indigo-600' : 'text-orange-500'}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${book.status === 'Published' ? 'bg-indigo-600 shadow-[0_0_8px_rgba(30,27,75,0.5)]' : 'bg-orange-500 animate-pulse'}`}></div>
                      <span className="hidden xs:inline">{book.status}</span>
                    </span>
                  </td>
                  <td className="px-3 sm:px-5 py-3 sm:py-4 text-right">
                    <div className="flex items-center justify-end gap-1 transition-all duration-300">
                      <button onClick={() => setViewBook(book)} className="p-1.5 sm:p-2 bg-white border border-black/5 text-slate-400 rounded-lg hover:bg-blue-50 hover:text-blue-500 transition-all shadow-sm active:scale-95"><Eye size={14} /></button>
                      <button onClick={() => { setEditBook(book); setFormData(book); }} className="p-1.5 sm:p-2 bg-white border border-black/5 text-slate-400 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-all shadow-sm active:scale-95"><Edit2 size={14} /></button>
                      <button onClick={() => setDeleteBook(book)} className="p-1.5 sm:p-2 bg-white border border-black/5 text-slate-400 rounded-lg hover:bg-red-50 hover:text-red-500 transition-all shadow-sm active:scale-95"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredBooks.length === 0 && (
                <tr><td colSpan={6} className="px-8 py-20 text-center font-black text-slate-300 uppercase tracking-[0.4em]">No matching resources</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── CREATE / EDIT MODAL ────────────────────────────────────────────────── */}
      <CMSModal
        open={isModalOpen || !!editBook}
        onClose={() => { setIsModalOpen(false); setEditBook(null); resetForm(); }}
        title={editBook ? 'Modify Book Access' : 'Add New Book'}
        subtitle="Library Resource Management"
        icon={editBook ? Edit2 : Plus}
        iconBg={editBook ? 'bg-[#15192c]' : 'bg-slate-900'}
        footer={
          <div className="flex items-center justify-between gap-4">
            <button type="button" onClick={() => { setIsModalOpen(false); setEditBook(null); resetForm(); }} className="px-6 sm:px-8 py-3 sm:py-4 text-slate-400 font-black text-[9px] sm:text-[10px] uppercase tracking-widest hover:bg-slate-200/50 rounded-2xl transition-colors">Discard changes</button>
            <div className="flex gap-2 sm:gap-4">
              <button type="button" onClick={handleSaveDraft} className="px-6 sm:px-8 py-3 sm:py-4 text-slate-600 font-black text-[9px] sm:text-[10px] uppercase tracking-widest bg-slate-100 rounded-2xl transition-colors">Save Draft</button>
              {activeTab === 'details' ? (
                <button onClick={() => setActiveTab('media')} className="px-8 sm:px-10 py-3 sm:py-4 bg-slate-900 text-white font-black text-[9px] sm:text-[10px] uppercase tracking-[0.2em] rounded-2xl hover:bg-black transition-all shadow-xl active:scale-95 flex items-center gap-2">Asset Details <ChevronDown size={14} className="-rotate-90" /></button>
              ) : activeTab === 'media' ? (
                <button onClick={() => setActiveTab('questions')} className="px-8 sm:px-10 py-3 sm:py-4 bg-slate-900 text-white font-black text-[9px] sm:text-[10px] uppercase tracking-[0.2em] rounded-2xl hover:bg-black transition-all shadow-xl active:scale-95 flex items-center gap-2">Quiz System <ChevronDown size={14} className="-rotate-90" /></button>
              ) : (
                <button onClick={() => document.getElementById('book-submit-btn').click()} className="px-8 sm:px-10 py-3 sm:py-4 bg-[#15192c] text-white font-black text-[9px] sm:text-[10px] uppercase tracking-[0.2em] rounded-2xl hover:scale-105 transition-all shadow-xl shadow-indigo-900/20">{editBook ? 'Save Modifications' : 'Publish Resource'}</button>
              )}
            </div>
          </div>
        }
      >
        <div className="tab-container mb-6 sm:mb-8 border-b border-black/5 flex gap-6 overflow-x-auto no-scrollbar">
          <button onClick={() => setActiveTab('details')} className={`pb-4 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-2 relative whitespace-nowrap ${activeTab === 'details' ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}>
            <FileText size={14} /> General Data
            {activeTab === 'details' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-slate-900 animate-in slide-in-from-left duration-300"></div>}
          </button>
          <button onClick={() => setActiveTab('media')} className={`pb-4 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-2 relative whitespace-nowrap ${activeTab === 'media' ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}>
            <UploadCloud size={14} /> Cloud Assets
            {activeTab === 'media' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-slate-900 animate-in slide-in-from-right duration-300"></div>}
          </button>
          <button onClick={() => setActiveTab('questions')} className={`pb-4 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-2 relative whitespace-nowrap ${activeTab === 'questions' ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}>
            <Sparkles size={14} /> Quiz System
            {activeTab === 'questions' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-slate-900 animate-in slide-in-from-right duration-300"></div>}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8 text-left">
          {activeTab === 'details' ? (
            <div className="grid grid-cols-2 gap-6 animate-in fade-in slide-in-from-right-4 duration-400 text-left">
              <div className="space-y-2 col-span-2 text-left">
                <label className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Book Title</label>
                <input required type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full h-14 px-5 bg-slate-50 border border-black/5 rounded-2xl outline-none focus:bg-white focus:border-[#15192c] shadow-inner text-sm font-bold text-slate-800 transition-all" placeholder="e.g. Navigating Menopause" />
              </div>
              <div className="space-y-2 col-span-2 sm:col-span-1 text-left">
                <label className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Lead Author</label>
                <input required type="text" value={formData.author} onChange={e => setFormData({ ...formData, author: e.target.value })} className="w-full h-14 px-5 bg-slate-50 border border-black/5 rounded-2xl outline-none focus:bg-white focus:border-[#15192c] shadow-inner text-sm font-bold text-slate-800 transition-all" placeholder="e.g. Dr. Ananya Iyer" />
              </div>
              <div className="col-span-2 sm:col-span-1 text-left">
                <FormDropdown label="Category" value={formData.category} options={['Women Health', 'Mental Wellness', 'General Health', 'Food & Nutrition', 'Yoga & Lifestyle']} onChange={val => setFormData({ ...formData, category: val })} />
              </div>
              <div className="col-span-2 sm:col-span-1 text-left">
                <FormDropdown label="Publishing Status" value={formData.status} options={['Published', 'Draft']} onChange={val => setFormData({ ...formData, status: val })} />
              </div>
              <div className="space-y-2 col-span-2 text-left">
                <label className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Deep Insight Summary</label>
                <textarea value={formData.desc} onChange={e => setFormData({ ...formData, desc: e.target.value })} className="w-full h-32 p-5 bg-slate-50 border border-black/5 rounded-2xl outline-none focus:bg-white focus:border-[#15192c] text-sm font-medium text-slate-600 resize-none shadow-inner leading-relaxed transition-all text-left" placeholder="Write a summary that helps sisters find this book..."></textarea>
              </div>
            </div>
          ) : activeTab === 'media' ? (
            <div className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-left-4 duration-400 text-left">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
                <div className="space-y-2 text-left">
                  <label className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Upload PDF Book</label>
                  <input type="file" accept="application/pdf" onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const url = URL.createObjectURL(file);
                      setFormData({ ...formData, bookFile: url });
                    }
                  }} className="w-full h-14 px-5 bg-slate-50 border border-black/5 rounded-2xl outline-none focus:bg-white focus:border-[#15192c] shadow-inner text-sm font-bold text-slate-800 transition-all pt-4" />
                </div>
                <div className="space-y-2 text-left">
                  <label className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Audio Book Link</label>
                  <input type="url" value={formData.audioBookUrl} onChange={e => setFormData({ ...formData, audioBookUrl: e.target.value })} className="w-full h-14 px-5 bg-slate-50 border border-black/5 rounded-2xl outline-none focus:bg-white focus:border-[#15192c] shadow-inner text-sm font-bold text-slate-800 transition-all" placeholder="https://..." />
                </div>
              </div>
              <div className="upload-box space-y-4 text-left">
                <label className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest block leading-none text-left">High-Res Book Cover</label>
                <label className="w-full h-44 border-2 border-dashed border-slate-100 rounded-[2.5rem] flex flex-col items-center justify-center gap-4 hover:border-[#15192c] hover:bg-indigo-50/50 transition-all cursor-pointer group relative overflow-hidden">
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const url = URL.createObjectURL(file);
                      setFormData({ ...formData, coverUrl: url });
                    }
                  }} />
                  {formData.coverUrl ? (
                    <img src={formData.coverUrl} className="w-full h-full object-cover" alt="Cover Preview" />
                  ) : (
                    <>
                      <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-slate-300 group-hover:text-indigo-600 shadow-md group-hover:scale-110 transition-all"><UploadCloud size={24} /></div>
                      <div className="text-center text-left">
                        <p className="text-sm font-bold text-slate-600">Drop cover graphic here</p>
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mt-2">JPEG, PNG (2MB max)</p>
                      </div>
                    </>
                  )}
                </label>
              </div>
            </div>
          ) : (
            <div className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-400 text-left">
               <div className="flex items-center justify-between text-left">
                  <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest text-left">Knowledge Checkpoints ({formData.questions.length}/5)</h3>
                  <button type="button" onClick={addQuestion} disabled={formData.questions.length >= 5} className="px-4 py-2 bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-black disabled:opacity-50 transition-all flex items-center gap-2"><Plus size={14} /> Add Question</button>
               </div>
               
               <div className="space-y-8 text-left">
                  {formData.questions.map((q, qIndex) => (
                    <div key={qIndex} className="p-6 sm:p-8 bg-slate-50 border border-black/5 rounded-[2rem] space-y-6 relative text-left">
                      <button type="button" onClick={() => removeQuestion(qIndex)} className="absolute top-6 right-6 text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                      <div className="space-y-2 text-left">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest text-left">Question {qIndex + 1}</label>
                        <input required type="text" value={q.question} onChange={e => updateQuestion(qIndex, 'question', e.target.value)} className="w-full h-12 px-4 bg-white border border-black/5 rounded-xl outline-none focus:border-[#15192c] text-sm font-bold text-slate-800 transition-all" placeholder="Type the question here..." />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                        {q.options.map((opt, oIndex) => (
                          <div key={oIndex} className="space-y-1.5 text-left">
                            <label className="text-[8px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-2 text-left">
                              Option {oIndex + 1}
                              <input type="radio" name={`correct-${qIndex}`} checked={q.correct === oIndex} onChange={() => updateQuestion(qIndex, 'correct', oIndex)} className="w-3 h-3 accent-[#15192c]" />
                              <span className="text-[7px] text-indigo-600">Mark Correct</span>
                            </label>
                            <input required type="text" value={opt} onChange={e => updateOption(qIndex, oIndex, e.target.value)} className={`w-full h-11 px-4 bg-white border rounded-xl outline-none focus:border-[#15192c] text-[13px] font-medium text-slate-600 transition-all ${q.correct === oIndex ? 'border-[#15192c] ring-2 ring-indigo-50' : 'border-black/5'}`} placeholder={`Option ${oIndex + 1}`} />
                          </div>
                        ))}
                      </div>
                      <div className="space-y-2 text-left">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest text-left">Answer Explanation</label>
                        <textarea value={q.explanation} onChange={e => updateQuestion(qIndex, 'explanation', e.target.value)} className="w-full h-20 p-4 bg-white border border-black/5 rounded-xl outline-none focus:border-#15192c text-xs font-medium text-slate-500 resize-none transition-all text-left" placeholder="Why is this the correct answer?"></textarea>
                      </div>
                    </div>
                  ))}
               </div>
            </div>
          )}
          <input type="submit" id="book-submit-btn" className="hidden" />
        </form>
      </CMSModal>

      {/* ── VIEW MODAL ────────────────────────────────────────────────────────── */}
      <CMSModal
        open={!!viewBook}
        onClose={() => setViewBook(null)}
        title="Book Insights"
        subtitle={viewBook?.title}
        icon={Eye}
        iconBg="bg-blue-500"
      >
        <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-500 text-left">
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 text-left">
            <div className={`w-full sm:w-44 h-48 sm:h-64 rounded-[2rem] flex-shrink-0 shadow-2xl flex items-center justify-center text-white/50 border border-black/5 animate-in zoom-in-95 duration-700 ${CAT_COLORS[viewBook?.category] || CAT_COLORS.Default}`}>
              <BookOpen size={64} className="opacity-50" />
            </div>
            <div className="space-y-4 sm:space-y-6 flex-1 py-2 sm:py-4 text-left">
              <div className="space-y-2 text-left">
                <h3 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight leading-none text-left">{viewBook?.title}</h3>
                <p className="flex flex-wrap items-center gap-2 text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-left">
                  {viewBook?.author} <span className="text-slate-200 hidden sm:inline">|</span>
                  <span className={`px-2 py-0.5 rounded-md border ${CAT_COLORS[viewBook?.category]?.replace('bg-', 'bg-opacity-50 ')}`}>{viewBook?.category}</span>
                </p>
              </div>
              <div className="flex gap-3 text-left">
                <div className="px-4 py-3 bg-slate-50 rounded-2xl border border-black/5 flex-1 text-center group hover:bg-white transition-all text-left">
                  <p className="text-[8px] sm:text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1 text-center">Total Reads</p>
                  <p className="text-base sm:text-lg font-black text-slate-700 text-center">{viewBook?.reads}</p>
                </div>
                <div className="px-4 py-3 bg-slate-50 rounded-2xl border border-black/5 flex-1 text-center group hover:bg-white transition-all text-left">
                  <p className="text-[8px] sm:text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1 text-center">Status</p>
                  <p className="text-base sm:text-lg font-black text-#15192c uppercase text-[10px] sm:text-xs tracking-widest flex items-center justify-center gap-1.5 text-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-#15192c animate-pulse"></div> {viewBook?.status}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-left">
                <button className="py-3 bg-slate-900 text-white font-black rounded-2xl text-[9px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-xl">
                  <Eye size={14} /> Open Flip
                </button>
                <button className="py-3 bg-#15192c text-white font-black rounded-2xl text-[9px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-#15192c/20">
                  <Download size={14} /> Download PDF
                </button>
              </div>
            </div>
          </div>
          <div className="p-6 sm:p-8 bg-slate-50 border border-black/5 rounded-[2rem] sm:rounded-[2.5rem] shadow-inner font-medium text-slate-600 leading-relaxed italic text-sm sm:text-base text-left">
            "{viewBook?.desc || 'A premium resource curated for the Health Sakhi global community of sisters.'}"
          </div>
          <div className="flex items-center gap-3 p-4 sm:p-6 bg-blue-50/50 rounded-2xl border border-blue-100 text-[9px] sm:text-[10px] font-black uppercase text-blue-500 tracking-widest text-left">
            <Clock size={14} /> Library entry created {viewBook?.date}
          </div>
        </div>
      </CMSModal>

      {/* ── DELETE MODAL ──────────────────────────────────────────────────────── */}
      <CMSModal
        open={!!deleteBook}
        onClose={() => setDeleteBook(null)}
        title="Expunge Resource"
        subtitle={deleteBook?.title}
        icon={Trash2}
        iconBg="bg-rose-500"
        footer={
          <div className="flex justify-end gap-3">
            <button onClick={() => setDeleteBook(null)} className="px-6 py-3 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 rounded-xl transition-all">Cancel</button>
            <button onClick={() => handleDelete(deleteBook.id)} className="px-10 py-3 bg-rose-500 text-white font-black text-[10px] uppercase tracking-widest rounded-xl shadow-xl shadow-rose-500/20 active:scale-95 transition-all">Delete Forever</button>
          </div>
        }
      >
        <div className="p-6 sm:p-8 bg-rose-50 border border-rose-100 rounded-[2rem] sm:rounded-[2.5rem] space-y-3 text-left">
          <p className="text-lg font-black text-rose-800 text-left">Confirm permanent removal?</p>
          <p className="text-sm font-bold text-rose-500 leading-relaxed italic text-left">Once removed, this book will be inaccessible to all members. This action cannot be reversed.</p>
        </div>
      </CMSModal>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookCMS;
