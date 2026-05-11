import React from 'react';
import { ArrowLeft, BookOpen, PlayCircle, Star, Users } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

// ── Same mock data as Library ────────────────────────────────────────────────
const BOOKS_DATA = [
  {
    id: 1,
    title: 'Hunger Mystery: Inner Healing',
    author: 'Dr. Sakshi',
    category: 'Food & Nutrition',
    reads: '1.2k',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=600',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    flipBookUrl: '',
    desc: 'Understand the difference between emotional and physical hunger. This deeply insightful guide takes you through the hormonal signals, emotional triggers, and daily rituals that can help you break free from unhealthy eating patterns and reconnect with your body\'s true wisdom.',
    chapters: [
      { title: 'The Silent Signals', pages: 12 },
      { title: 'Decoding Your Hunger', pages: 15 },
      { title: 'The Hormonal Connection', pages: 20 },
      { title: 'Healing from Within', pages: 18 },
      { title: 'The Sakhi Way of Life', pages: 25 },
    ],
  },
  {
    id: 2,
    title: 'The Hormonal Roadmap',
    author: 'Dr. Meera',
    category: 'Women Health',
    reads: '2.5k',
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=600',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    flipBookUrl: '',
    desc: 'A complete guide to balancing hormones naturally at every stage of life. Navigate PCOD, menopause, thyroid, and stress with confidence and clarity using ancient wisdom combined with modern science.',
    chapters: [
      { title: 'Understanding Your Cycle', pages: 14 },
      { title: 'The Stress-Hormone Loop', pages: 18 },
      { title: 'Nutrition for Balance', pages: 22 },
      { title: 'Sleep & Recovery', pages: 16 },
    ],
  },
  {
    id: 3,
    title: 'Mindful Sakhi: Peace Within',
    author: 'Ananya Rao',
    category: 'Mental Wellness',
    reads: '980',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=600',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    flipBookUrl: '',
    desc: 'Daily mindfulness practices for the busy modern woman. From morning rituals to nighttime unwinding, discover how small intentional moments can transform your mental landscape.',
    chapters: [
      { title: 'The Power of Now', pages: 10 },
      { title: 'Breath as Medicine', pages: 14 },
      { title: 'Creating Sacred Space', pages: 12 },
    ],
  },
  {
    id: 4,
    title: 'Heart-to-Heart Bonds',
    author: 'Sana Khan',
    category: 'Yoga & Lifestyle',
    reads: '1.5k',
    image: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=600',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    flipBookUrl: '',
    desc: 'Building healthy relationships and emotional boundaries with loved ones. Learn the language of love, communication styles, and how to foster deeper connections while maintaining your own wellbeing.',
    chapters: [
      { title: 'Know Your Attachment Style', pages: 16 },
      { title: 'The Art of Boundaries', pages: 20 },
      { title: 'Communication That Heals', pages: 18 },
      { title: 'Forgiving to Flow', pages: 14 },
    ],
  },
  {
    id: 5,
    title: 'Digital Detox Guide',
    author: 'Dr. Alok',
    category: 'General Health',
    reads: '3.2k',
    image: 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?auto=format&fit=crop&q=80&w=600',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    flipBookUrl: '',
    desc: 'How to break free from screen addiction and reclaim your mental space. A practical, compassionate guide that helps you audit your digital habits and create healthier boundaries with technology.',
    chapters: [
      { title: 'The Dopamine Trap', pages: 12 },
      { title: 'Audit Your Screen Life', pages: 15 },
      { title: 'Creating Tech-Free Rituals', pages: 18 },
      { title: 'Reclaim Your Attention', pages: 20 },
    ],
  },
];

// ── Flipbook + Audio Reader Modal ─────────────────────────────────────────────
const ReaderModal = ({ book, onClose }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = book.chapters.reduce((sum, c) => sum + c.pages, 0);

  return (
    <div className="fixed inset-0 z-[200] bg-[#1a1a2e] flex flex-col animate-in fade-in duration-300">
      {/* Header */}
      <div className="h-14 bg-[#16213e] flex items-center justify-between px-6 border-b border-white/10 shrink-0">
        <span className="text-white font-bold text-sm truncate">
          📖 {book.title}
        </span>
        <button
          onClick={onClose}
          className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-xl font-bold text-xs hover:bg-red-600 transition-all"
        >
          <X size={14} /> Close
        </button>
      </div>

      {/* Flipbook Area */}
      <div className="flex-1 flex items-center justify-center px-4 py-6 relative">
        {/* Prev Button */}
        <button
          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          disabled={currentPage <= 1}
          className="absolute left-4 z-10 w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-all disabled:opacity-20"
        >
          <ChevronRight size={20} className="rotate-180" />
        </button>

        {/* Book Page Display */}
        <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="relative aspect-[3/4] bg-gradient-to-br from-rose-50 to-pink-100 flex flex-col items-center justify-center p-10 text-center">
            <div className="absolute top-4 left-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
              {currentPage} / {totalPages}
            </div>
            <img
              src={book.image}
              alt={book.title}
              className="w-40 h-48 object-cover rounded-xl shadow-lg mb-6"
            />
            <h2 className="text-xl font-black text-slate-800 mb-2">{book.title}</h2>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">by {book.author}</p>
            <div className="mt-8 h-1 w-24 bg-rose-200 rounded-full mx-auto" />
            <p className="mt-6 text-sm text-slate-500 leading-relaxed max-w-xs">
              {book.desc.substring(0, 120)}...
            </p>
          </div>
        </div>

        {/* Next Button */}
        <button
          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
          disabled={currentPage >= totalPages}
          className="absolute right-4 z-10 w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-all disabled:opacity-20"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Audio Player Footer */}
      <div className="bg-[#16213e] border-t border-white/10 px-6 py-4 shrink-0">
        <div className="flex items-center gap-3 mb-2">
          <Headphones size={16} className="text-rose-400 shrink-0" />
          <span className="text-white/60 text-xs font-bold uppercase tracking-widest">Audio Book</span>
        </div>
        <audio
          src={book.audioUrl}
          controls
          className="w-full"
          style={{ height: '40px' }}
        />
      </div>
    </div>
  );
};

// ── Main Book Detail Screen ────────────────────────────────────────────────────
const BookDetailScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const book = BOOKS_DATA.find(b => b.id === parseInt(id)) || BOOKS_DATA[0];

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in duration-500 pb-20">
        {/* Back Button */}
        <button
          onClick={() => navigate('/app/books')}
          className="flex items-center gap-2 text-slate-400 hover:text-health-green transition-colors font-black text-[10px] uppercase tracking-widest mb-8"
        >
          <ArrowLeft size={14} /> Back to Dashboard
        </button>

        {/* Main Content */}
        <div className="flex flex-col md:flex-row gap-8 lg:gap-12 items-center md:items-start text-center md:text-left">
          {/* Book Cover */}
          <div className="flex-shrink-0 w-full max-w-[260px] sm:max-w-[280px] md:w-72">
            <div className="aspect-[3/4] rounded-3xl sm:rounded-[2.5rem] overflow-hidden shadow-2xl shadow-rose-200 border-4 border-white">
              <img
                src={book.image}
                alt={book.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Book Info */}
          <div className="flex-1 space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em] bg-health-green/10 text-health-green mb-4">
                <BookOpen size={10} /> {book.category}
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-800 leading-tight tracking-tight mb-2 px-2 md:px-0">
                {book.title}
              </h1>
              <p className="text-slate-400 font-bold text-xs sm:text-sm uppercase tracking-widest">
                by {book.author}
              </p>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 sm:gap-6 py-4 border-y border-slate-100">
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={12} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <span className="text-xs sm:text-sm font-bold text-slate-600">4.8</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-500">
                <Users size={14} className="text-health-green" />
                {book.reads} reads
              </div>
              <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-500">
                <BookOpen size={14} className="text-health-green" />
                {book.chapters.length} chapters
              </div>
            </div>

            {/* Progress Bar for Member */}
            {(() => {
               const savedProgress = JSON.parse(localStorage.getItem(`progress_book_${id}`) || 'null');
               const isCompleted = JSON.parse(localStorage.getItem('completedBooks') || '[]').includes(parseInt(id));
               
               let progressPercent = 0;
               let progressLabel = 'Not Started';

               if (isCompleted) {
                  progressPercent = 100;
                  progressLabel = 'Completed';
                } else if (savedProgress) {
                   const total = parseInt(savedProgress.total) || 30;
                   const page = parseInt(savedProgress.page) || 0;
                   progressPercent = Math.round((page / total) * 100);
                   if (isNaN(progressPercent)) progressPercent = 0;
                   progressLabel = `${page} / ${total} Pages Completed`;
                }

               if (progressPercent > 0) {
                  return (
                     <div className="bg-[#FDEEF1] rounded-2xl sm:rounded-[2rem] p-4 sm:p-6 border border-[#F5E6EA] animate-in slide-in-from-top-4 duration-500">
                        <div className="flex items-center justify-between mb-2 sm:mb-3">
                           <p className="text-[9px] sm:text-[10px] font-black text-[#ff69b4] uppercase tracking-widest">{progressLabel}</p>
                           <span className="text-[9px] sm:text-[10px] font-black text-[#ff69b4]">{progressPercent}%</span>
                        </div>
                        <div className="h-1.5 sm:h-2 bg-white rounded-full overflow-hidden p-0.5">
                           <div className="h-full bg-[#ff69b4] rounded-full transition-all duration-1000" style={{ width: `${progressPercent}%` }} />
                        </div>
                     </div>
                  );
               }
               return null;
            })()}

            {/* Summary */}
            <div className="bg-slate-50 rounded-2xl sm:rounded-[2rem] p-6 sm:p-8">
              <h3 className="text-[9px] sm:text-[10px] font-black text-health-green uppercase tracking-widest mb-3 sm:mb-4">Book Summary</h3>
              <p className="text-slate-600 text-[13px] sm:text-sm leading-relaxed font-medium">
                {book.desc}
              </p>
            </div>

            {/* Chapters List */}
            <div className="space-y-3">
              <h3 className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest">Chapters</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1">
                {book.chapters.map((ch, i) => (
                  <div key={i} className="flex items-center justify-between py-2.5 border-b border-slate-100/50">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-lg bg-health-green/10 text-health-green text-[9px] font-black flex items-center justify-center">
                        {i + 1}
                      </span>
                      <span className="text-xs sm:text-[13px] font-bold text-slate-700">{typeof ch === 'string' ? ch : ch.title}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={() => navigate(`/app/books/${id}/read`)}
              className="w-full sm:w-auto flex items-center justify-center gap-3 px-10 sm:px-12 py-4 sm:py-5 bg-slate-900 text-white font-black text-xs sm:text-sm uppercase tracking-widest rounded-xl sm:rounded-2xl shadow-xl shadow-slate-900/20 hover:scale-105 active:scale-95 transition-all"
            >
              <PlayCircle size={20} className="text-health-green" />
              {localStorage.getItem(`progress_book_${id}`) ? 'Resume Journey' : 'Start Reading'}
            </button>
          </div>
        </div>
      </div>
  );
};

export default BookDetailScreen;
