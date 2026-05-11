import React, { useState, useEffect } from 'react';
import { BookOpen, Search, Sparkles, ChevronRight, PlayCircle, Clock, CheckCircle, Headphones, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BookReaderModal from '../../components/BookReaderModal';

const INITIAL_BOOKS = [
  { 
    id: 1, 
    title: 'Hunger Mystery: Inner Healing', 
    author: 'Dr. Sakshi', 
    category: 'Food & Nutrition', 
    reads: '1.2k', 
    desc: 'Understand the difference between emotional and physical hunger with Sakhi.',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=400'
  },
  { 
    id: 2, 
    title: 'The Hormonal Roadmap', 
    author: 'Dr. Meera', 
    category: 'Women Health', 
    reads: '2.5k', 
    desc: 'A complete guide to balancing hormones naturally at every stage of life.',
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=400'
  },
  { 
    id: 3, 
    title: 'Mindful Sakhi: Peace Within', 
    author: 'Ananya Rao', 
    category: 'Mental Wellness', 
    reads: '980', 
    desc: 'Daily mindfulness practices for the busy modern woman.',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=400'
  },
  { 
    id: 4, 
    title: 'Heart-to-Heart Bonds', 
    author: 'Sana Khan', 
    category: 'Yoga & Lifestyle', 
    reads: '1.5k', 
    desc: 'Building healthy relationships and emotional boundaries with loved ones.',
    image: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=600'
  },
  { 
    id: 5, 
    title: 'Digital Detox Guide', 
    author: 'Dr. Alok', 
    category: 'General Health', 
    reads: '3.2k', 
    desc: 'How to break free from screen addiction and reclaim your mental space.',
    image: 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?auto=format&fit=crop&q=80&w=400'
  },
];

const CATEGORIES = ['All', 'Women Health', 'Mental Wellness', 'General Health', 'Food & Nutrition', 'Yoga & Lifestyle'];

const BookLibraryScreen = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showWelcome, setShowWelcome] = useState(false);
  const [customBooks, setCustomBooks] = useState([]);
  const [readBook, setReadBook] = useState(null);
  const navigate = useNavigate();

  // Get progress from localStorage
  const completedBooks = JSON.parse(localStorage.getItem('completedBooks') || '[]');

  useEffect(() => {
    const saved = localStorage.getItem('hs_custom_books');
    if (saved) setCustomBooks(JSON.parse(saved));
    const handleStorage = () => {
      const updated = localStorage.getItem('hs_custom_books');
      if (updated) setCustomBooks(JSON.parse(updated));
    };
    window.addEventListener('storage', handleStorage);

    const hasVisited = localStorage.getItem('hasVisitedBooks');
    if (!hasVisited) {
      setShowWelcome(true);
      localStorage.setItem('hasVisitedBooks', 'true');
    }
    
    // Seed Demo Progress for "The Hormonal Roadmap" (ID 2)
    if (!localStorage.getItem('progress_book_2')) {
      localStorage.setItem('progress_book_2', JSON.stringify({ page: 12, total: 20 }));
      
      const userProgress = JSON.parse(localStorage.getItem('userProgress') || '{}');
      if (!userProgress[2]) {
        userProgress[2] = {
          percent: 60,
          lastRead: new Date().toISOString(),
          time: 300
        };
        localStorage.setItem('userProgress', JSON.stringify(userProgress));
      }
    }
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const validCustom = customBooks.filter(cb => cb.title && (cb.image || cb.coverUrl) && cb.status === 'Published');
  const allBooks = [...validCustom, ...INITIAL_BOOKS];

  const filteredBooks = allBooks.filter(book => {
    const matchesCategory = activeCategory === 'All' || book.category === activeCategory;
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         book.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20 relative text-left">

      {/* Welcome Modal */}
      {showWelcome && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[3rem] p-10 max-w-sm w-full text-center shadow-2xl border border-black/5 animate-in zoom-in-95 duration-500">
            <div className="w-20 h-20 bg-health-green/10 rounded-full flex items-center justify-center mx-auto mb-6 text-health-green">
              <Sparkles size={40} />
            </div>
            <h2 className="text-2xl font-black text-slate-800 mb-2">Welcome, Sakhi!</h2>
            <p className="text-slate-500 font-medium mb-8">Ready to start your healing journey through knowledge?</p>
            <button
              onClick={() => setShowWelcome(false)}
              className="w-full h-14 bg-health-green text-white font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-health-green/20 transition-all hover:scale-105 active:scale-95"
            >
              Let's Start
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-1">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] bg-health-green/10 text-health-green">
            <Sparkles size={10} className="sm:w-3 sm:h-3" /> Member Exclusive
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-800 tracking-tight leading-none">The Sakhi Library</h1>
          <p className="text-slate-500 text-xs sm:text-sm font-medium max-w-md">Curated knowledge for your wellness journey.</p>
        </div>

        <div className="relative group w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-health-green transition-colors" size={18} />
          <input
            type="text"
            placeholder="Search titles, authors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 sm:h-14 pl-12 pr-4 bg-white border border-slate-200 rounded-2xl outline-none focus:border-health-green focus:ring-4 focus:ring-health-green/5 transition-all font-bold text-xs sm:text-sm shadow-sm"
          />
        </div>
      </div>

      {/* Progress Dashboard - Optimized for Mobile */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 px-1">
         <div className="bg-white p-3 sm:p-4 rounded-2xl sm:rounded-3xl border border-slate-100 shadow-sm flex items-center gap-3 sm:gap-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-slate-50 rounded-xl sm:rounded-2xl flex items-center justify-center text-slate-400"><BookOpen size={16} className="sm:w-5 sm:h-5" /></div>
            <div>
               <p className="text-[7px] sm:text-[9px] font-black text-slate-400 uppercase tracking-widest">Total Volumes</p>
               <p className="text-base sm:text-xl font-black text-slate-800">{INITIAL_BOOKS.length}</p>
            </div>
         </div>
         <div className="bg-health-green/[0.03] p-3 sm:p-4 rounded-2xl sm:rounded-3xl border border-health-green/10 shadow-sm flex items-center gap-3 sm:gap-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-health-green/10 rounded-xl sm:rounded-2xl flex items-center justify-center text-health-green"><CheckCircle size={16} className="sm:w-5 sm:h-5" /></div>
            <div>
               <p className="text-[7px] sm:text-[9px] font-black text-health-green uppercase tracking-widest">Completed</p>
               <p className="text-base sm:text-xl font-black text-health-green">{completedBooks.length}</p>
            </div>
         </div>
         <div className="bg-rose-50 p-3 sm:p-4 rounded-2xl sm:rounded-3xl border border-rose-100 shadow-sm flex items-center gap-3 sm:gap-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-rose-100 rounded-xl sm:rounded-2xl flex items-center justify-center text-rose-500"><Headphones size={16} className="sm:w-5 sm:h-5" /></div>
            <div>
               <p className="text-[7px] sm:text-[9px] font-black text-rose-400 uppercase tracking-widest">Books Read</p>
               <p className="text-base sm:text-xl font-black text-rose-500">{completedBooks.length}</p>
            </div>
         </div>
         <div className="bg-slate-900 p-3 sm:p-4 rounded-2xl sm:rounded-3xl shadow-lg flex items-center gap-3 sm:gap-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/10 rounded-xl sm:rounded-2xl flex items-center justify-center text-health-green"><Trophy size={16} className="sm:w-5 sm:h-5" /></div>
            <div>
               <p className="text-[7px] sm:text-[9px] font-black text-slate-400 uppercase tracking-widest">Academy Rank</p>
               <p className="text-sm sm:text-lg font-black text-white truncate">{completedBooks.length > 3 ? 'Elite' : 'Beginner'}</p>
            </div>
         </div>
      </div>

      {/* Category Chips - Improved Scroll */}
      <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar pb-2 px-1 -mx-1">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-full text-[8px] sm:text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${
              activeCategory === cat
                ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20'
                : 'bg-white border border-slate-200 text-slate-500 hover:border-slate-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 px-1">
        {filteredBooks.map((book) => {
          const isCompleted = completedBooks.includes(book.id);
          
          // Calculate Progress from localStorage
          const savedProgress = JSON.parse(localStorage.getItem(`progress_book_${book.id}`) || 'null');
          const audioProgress = parseFloat(localStorage.getItem(`audio_progress_${book.id}`) || '0');
          
          let progressPercent = 0;
          let progressText = 'Not Started';

          if (isCompleted) {
            progressPercent = 100;
            progressText = 'Completed';
          } else if (savedProgress) {
            const total = parseInt(savedProgress.total) || 30;
            const page = parseInt(savedProgress.page) || 0;
            progressPercent = Math.round((page / total) * 100);
            if (isNaN(progressPercent)) progressPercent = 0;
            progressText = `${page} Pages Read`;
          } else if (audioProgress > 0) {
            progressPercent = 15;
            progressText = 'Audio Started';
          }

          return (
            <div
              key={book.id}
              onClick={() => {
                if (book.isNew && book.bookFile) {
                  setReadBook(book);
                } else {
                  navigate(`/app/books/${book.id}`);
                }
              }}
              className={`group bg-white rounded-3xl sm:rounded-[2.5rem] border p-3 sm:p-4 transition-all cursor-pointer flex flex-col ${isCompleted ? 'border-health-green/30 bg-health-green/[0.02]' : 'border-slate-100 hover:border-health-green/20 hover:shadow-2xl'}`}
            >
              {/* Cover Image */}
              <div className="relative aspect-[16/10] rounded-xl sm:rounded-2xl overflow-hidden mb-3 sm:mb-4 bg-slate-100">
                <img
                  src={book.image || book.coverUrl || 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=400'}
                  alt={book.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-2 left-2 px-2 py-1 bg-black/50 backdrop-blur-sm rounded-lg text-[7px] sm:text-[8px] font-black text-white uppercase tracking-widest z-10">
                  {book.category}
                </div>
                {book.isNew && (
                  <div className="absolute top-2 right-2 px-2 py-1 bg-[#BA7517] text-white rounded-full text-[7px] sm:text-[8px] font-black uppercase tracking-widest shadow-lg flex items-center gap-1 z-10 animate-pulse">
                    NEW ✨
                  </div>
                )}
                {isCompleted && !book.isNew && (
                  <div className="absolute top-2 right-2 px-2 sm:px-3 py-1 bg-health-green text-white rounded-full text-[7px] sm:text-[8px] font-black uppercase tracking-widest shadow-lg flex items-center gap-1 z-10">
                    <CheckCircle size={10} /> Completed
                  </div>
                )}
                {/* Progress Overlay */}
                {!isCompleted && progressPercent > 0 && (
                   <div className="absolute inset-x-0 bottom-0 p-2 sm:p-3 bg-gradient-to-t from-black/80 to-transparent z-10">
                      <div className="flex items-center justify-between mb-1 sm:mb-1.5">
                         <span className="text-[7px] sm:text-[8px] font-black text-white uppercase tracking-widest">{progressText}</span>
                         <span className="text-[7px] sm:text-[8px] font-black text-health-green uppercase tracking-widest">{progressPercent}%</span>
                      </div>
                      <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                         <div className="h-full bg-health-green transition-all duration-1000" style={{ width: `${progressPercent}%` }} />
                      </div>
                   </div>
                )}
              </div>

              {/* Info */}
              <div className="px-1 flex-1 space-y-1 sm:space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[7px] sm:text-[8px] font-black text-slate-400 uppercase tracking-widest">
                    <PlayCircle size={10} className="text-health-green" /> {book.reads} Reads
                  </div>
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Sparkles key={i} size={8} className="text-amber-400" />
                    ))}
                  </div>
                </div>

                <h3 className="text-sm sm:text-base font-black text-slate-800 leading-tight group-hover:text-[#ff69b4] transition-colors line-clamp-1 text-left">
                  {book.title}
                </h3>
                <p className="text-[8px] sm:text-[9px] font-bold text-slate-400 uppercase tracking-widest text-left">By {book.author}</p>
              </div>

              {/* Footer */}
              <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-slate-50 flex items-center justify-between">
                <div className="flex-1 mr-3 sm:mr-4">
                   {!isCompleted && progressPercent > 0 && (
                      <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                         <div className="h-full bg-[#ff69b4]" style={{ width: `${progressPercent}%` }} />
                      </div>
                   )}
                </div>
                <button className={`text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-1 group-hover:gap-2 transition-all ${isCompleted ? 'text-slate-400' : 'text-[#ff69b4]'}`}>
                  {isCompleted ? 'Done' : progressPercent > 0 ? 'Resume' : 'Read'} <ChevronRight size={10} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredBooks.length === 0 && (
        <div className="py-20 text-center space-y-4">
          <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-200">
            <BookOpen size={48} />
          </div>
          <p className="text-xl font-black text-slate-400 uppercase tracking-widest">No books found</p>
        </div>
      )}

      {/* Book Reader Modal */}
      {readBook && (
        <BookReaderModal
          isOpen={!!readBook}
          onClose={() => setReadBook(null)}
          book={readBook}
        />
      )}
    </div>
  );
};

export default BookLibraryScreen;
