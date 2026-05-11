import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowLeft, ChevronLeft, ChevronRight, Trophy, 
  CheckCircle, XCircle, Clock, Sparkles, 
  ZoomIn, ZoomOut, Maximize, BookOpen, Headphones, PlayCircle, MessageSquare
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import RewardModal from '../../components/RewardModal';

// ── Mock Data ────────────────────────────────────────────────────────────────
const BOOKS_DATA = {
  1: {
    id: 1,
    title: 'Hunger Mystery: Inner Healing',
    author: 'Dr. Sakshi',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=600',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    category: 'Food & Nutrition',
    reads: '1.2k',
    desc: 'Understand the difference between emotional and physical hunger. This guide takes you through the hormonal signals and emotional triggers to break free from unhealthy eating patterns.',
    chapters: ['The Silent Signals', 'Decoding Your Hunger', 'The Hormonal Connection', 'Healing from Within', 'The Sakhi Way'],
    pageContent: [
      "Physical hunger comes on gradually and can be satisfied with many types of food. Emotional hunger comes on suddenly and creates a craving for specific 'comfort' foods.",
      "Your stomach is roughly the size of your fist. When you eat, it sends signals to your brain through the Vagus nerve, but these signals take about 20 minutes to arrive.",
      "Ghrelin is known as the 'hunger hormone'. It is produced in your stomach and sends signals to your brain to let it know that you are hungry.",
      "Leptin is the 'satiety hormone' that helps inhibit hunger and regulate energy balance. Sleep deprivation can lower leptin levels, making you feel hungrier.",
      "Mindful eating is the practice of being fully present during your meal. It involves noticing the colors, smells, textures, and flavors of your food without judgment.",
      "Emotional eating often masks underlying feelings like stress, loneliness, or boredom. Identifying these triggers is the first step towards a healthier relationship with food."
    ],
    questions: [
      { question: 'What is the "hunger hormone" called?', options: ['Leptin', 'Ghrelin', 'Insulin', 'Cortisol'], correct: 1 },
      { question: 'How long does it take for fullness signals to reach the brain?', options: ['5 mins', '10 mins', '20 mins', '1 hour'], correct: 2 },
      { question: 'Emotional hunger usually targets...', options: ['Healthy salads', 'Specific comfort foods', 'Water', 'Any food available'], correct: 1 },
      { question: 'Which nerve connects the stomach to the brain?', options: ['Optic nerve', 'Vagus nerve', 'Sciatic nerve', 'Phrenic nerve'], correct: 1 },
      { question: 'What does Leptin do?', options: ['Increases hunger', 'Helps you sleep', 'Inhibits hunger', 'Builds muscle'], correct: 2 }
    ]
  },
  2: {
    id: 2,
    title: 'The Hormonal Roadmap',
    author: 'Dr. Meera',
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=600',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    category: 'Women Health',
    reads: '2.5k',
    desc: 'A complete guide to balancing hormones naturally at every stage of life. Navigate PCOD, menopause, and stress with confidence.',
    chapters: ['Understanding Your Cycle', 'The Stress-Hormone Loop', 'Nutrition for Balance', 'Sleep & Recovery'],
    pageContent: [
       "Hormones are chemical messengers that travel through your bloodstream to tissues or organs. They work slowly, over time, and affect many different processes.",
       "The endocrine system is a network of glands that produce and release hormones that help control many important body functions.",
       "Cortisol is your body's main stress hormone. It works with certain parts of your brain to control your mood, motivation, and fear.",
       "Thyroid hormones affect every cell and all the organs in your body. They regulate the rate at which your body uses energy.",
       "Insulin is a hormone made by the pancreas that allows your body to use sugar (glucose) from carbohydrates in the food that you eat.",
       "Progesterone and Estrogen are the primary female sex hormones. Balancing them is key to reproductive and emotional health."
    ],
    questions: [
      { question: 'What is the main stress hormone?', options: ['Insulin', 'Melatonin', 'Cortisol', 'Thyroid'], correct: 2 },
      { question: 'Which organ produces Insulin?', options: ['Liver', 'Pancreas', 'Kidney', 'Heart'], correct: 1 },
      { question: 'Hormones travel through...', options: ['Nerves', 'Muscles', 'Bloodstream', 'Bones'], correct: 2 },
      { question: 'The rate of energy use is regulated by...', options: ['Thyroid', 'Adrenal', 'Pituitary', 'Skin'], correct: 0 },
      { question: 'Estrogen is a...', options: ['Vitamin', 'Hormone', 'Mineral', 'Protein'], correct: 1 }
    ]
  },
  3: {
    id: 3,
    title: 'Mindful Sakhi: Peace Within',
    author: 'Ananya Rao',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=600',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    category: 'Mental Wellness',
    reads: '980',
    desc: 'Daily mindfulness practices for the busy modern woman. Discover how small intentional moments can transform your mental landscape.',
    chapters: ['The Power of Now', 'Breath as Medicine', 'Creating Sacred Space'],
    pageContent: [
      "Mindfulness is the basic human ability to be fully present, aware of where we are and what we're doing, and not overly reactive or overwhelmed by what's going on around us.",
      "The breath is the bridge between the body and the mind. By consciously regulating your breathing, you can directly influence your nervous system and induce a state of calm.",
      "Creating a sacred space in your home doesn't require much—just a dedicated corner where you can sit in silence and reconnect with your inner self.",
      "Journaling is a powerful tool for self-discovery. It allows you to externalize your thoughts and feelings, gaining perspective and emotional clarity.",
      "Body scanning is a mindfulness technique that involves mentally scanning your body for areas of tension and consciously releasing them.",
      "Gratitude is not just an emotion; it's a practice. By focusing on what you are thankful for, you shift your brain's bias from negativity to possibility."
    ],
    questions: [
      { question: 'What is the bridge between body and mind?', options: ['Sleep', 'Breath', 'Exercise', 'Food'], correct: 1 },
      { question: 'Mindfulness helps you be...', options: ['Productive', 'Fully Present', 'Rich', 'Famous'], correct: 1 },
      { question: 'Which practice shifts brain bias?', options: ['Yoga', 'Gratitude', 'Running', 'Cooking'], correct: 1 },
      { question: 'Sacred space should be...', options: ['Large', 'Dedicated corner', 'In the kitchen', 'Public'], correct: 1 },
      { question: 'Journaling helps with...', options: ['Math', 'Emotional clarity', 'Vision', 'Speed'], correct: 1 }
    ]
  },
  4: {
    id: 4,
    title: 'Heart-to-Heart Bonds',
    author: 'Sana Khan',
    image: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=600',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    category: 'Yoga & Lifestyle',
    reads: '1.5k',
    desc: 'Building healthy relationships and emotional boundaries with loved ones.',
    chapters: ['Know Your Attachment Style', 'The Art of Boundaries', 'Communication That Heals', 'Forgiving to Flow'],
    pageContent: [
      "Healthy relationships are built on a foundation of mutual respect, trust, and open communication. They require effort and understanding from both sides.",
      "Boundaries are not walls; they are gates. They define what is acceptable and what is not, allowing you to protect your energy and wellbeing.",
      "Active listening involves fully concentrating on what is being said rather than just passively 'hearing' the message of the speaker.",
      "Forgiveness is a gift you give yourself. It allows you to release the burden of past hurts and move forward with a lighter heart.",
      "Empathy is the ability to understand and share the feelings of another. It is the cornerstone of deep and meaningful connections.",
      "Conflict is natural in any relationship. The key is to manage it constructively through 'I' statements and focus on resolution rather than blame."
    ],
    questions: [
      { question: 'Healthy relationships need...', options: ['Money', 'Trust', 'Secrecy', 'Control'], correct: 1 },
      { question: 'Boundaries are like...', options: ['Walls', 'Gates', 'Cliffs', 'Pits'], correct: 1 },
      { question: 'Active listening is...', options: ['Hearing noise', 'Concentrating', 'Talking over', 'Ignoring'], correct: 1 },
      { question: 'Forgiveness is a gift for...', options: ['Others', 'Yourself', 'The past', 'Nobody'], correct: 1 },
      { question: 'Empathy means...', options: ['Judging', 'Sharing feelings', 'Sympathy only', 'Fixing'], correct: 1 }
    ]
  },
  5: {
    id: 5,
    title: 'Digital Detox Guide',
    author: 'Dr. Alok',
    image: 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?auto=format&fit=crop&q=80&w=600',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    category: 'General Health',
    reads: '3.2k',
    desc: 'How to break free from screen addiction and reclaim your mental space.',
    chapters: ['The Dopamine Trap', 'Audit Your Screen Life', 'Creating Tech-Free Rituals', 'Reclaim Your Attention'],
    pageContent: [
      "Screens are designed to be addictive. Notifications trigger dopamine release, keeping you hooked on the endless scroll.",
      "A digital detox is a period of time when a person refrains from using electronic devices such as smartphones or computers.",
      "Blue light from screens can interfere with your circadian rhythm and make it harder to fall asleep at night.",
      "The 'phantom vibration syndrome' is the perception that one's mobile phone is vibrating or ringing when it is not.",
      "Try the 20-20-20 rule: every 20 minutes, look at something 20 feet away for at least 20 seconds to reduce eye strain.",
      "Intentional technology use means using devices as tools to serve your goals, rather than letting them control your attention."
    ],
    questions: [
      { question: 'Which chemical causes addiction?', options: ['Serotonin', 'Dopamine', 'Melatonin', 'Adrenaline'], correct: 1 },
      { question: 'Blue light affects...', options: ['Vision only', 'Sleep rhythm', 'Digestion', 'Muscle'], correct: 1 },
      { question: '20-20-20 rule helps...', options: ['Weight', 'Eye strain', 'Hearing', 'Posture'], correct: 1 },
      { question: 'Screens are tools for...', options: ['Distraction', 'Intentional use', 'Addiction', 'Everything'], correct: 1 },
      { question: 'Notifications trigger...', options: ['Fear', 'Dopamine', 'Sadness', 'Anger'], correct: 1 }
    ]
  },
};

const getBook = (id) => BOOKS_DATA[id] || BOOKS_DATA[1];

// ── Single Page Integrated Component ──────────────────────────────────────────
const BookScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const audioRef = useRef(null);
  
  const book = getBook(parseInt(id));
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isAudioComplete, setIsAudioComplete] = useState(false);
  const [userAnswers, setUserAnswers] = useState({});
  const [quizScore, setQuizScore] = useState(null);
  const [isReading, setIsReading] = useState(false);
  const [showReward, setShowReward] = useState(false);

  const totalPages = (book.chapters?.length || 5) * 6;
  const passingScore = Math.ceil(book.questions.length * 0.6);

  // Persistence: Load progress on mount
  useEffect(() => {
    const saved = localStorage.getItem(`progress_book_${book.id}`);
    if (saved) {
      const parsed = JSON.parse(saved);
      const page = parseInt(parsed.page);
      const time = parseFloat(parsed.time);
      
      if (!isNaN(page)) setCurrentPage(page);
      if (audioRef.current && !isNaN(time)) audioRef.current.currentTime = time;
      setIsReading(true);
    }
  }, [book.id]);

  // Persistence: Save progress on change + Time Tracking
  useEffect(() => {
    let startTime = Date.now();
    
    const saveProgress = () => {
      if (isReading) {
        const timeSpentThisSession = Math.floor((Date.now() - startTime) / 1000);
        
        const progress = {
          page: currentPage,
          total: totalPages,
          time: audioRef.current ? audioRef.current.currentTime : 0
        };
        localStorage.setItem(`progress_book_${book.id}`, JSON.stringify(progress));
        
        // Update global user progress for Admin
        const userProgress = JSON.parse(localStorage.getItem('userProgress') || '{}');
        const existingData = userProgress[book.id] || { percent: 0, time: 0 };
        
        userProgress[book.id] = {
          percent: Math.round((currentPage / totalPages) * 100),
          lastRead: new Date().toISOString(),
          time: (existingData.time || 0) + timeSpentThisSession
        };
        localStorage.setItem('userProgress', JSON.stringify(userProgress));
        
        // Reset session start for continuous tracking
        startTime = Date.now();
      }
    };

    const interval = setInterval(saveProgress, 10000); // Auto-save every 10 seconds
    
    return () => {
      saveProgress(); // Final save on unmount
      clearInterval(interval);
    };
  }, [currentPage, isReading, book.id, totalPages]);

  const handleAudioUpdate = (e) => {
    const progress = (e.target.currentTime / e.target.duration) * 100;
    if (progress >= 98) setIsAudioComplete(true);
    
    // Periodically save audio time
    if (Math.floor(e.target.currentTime) % 5 === 0) {
      const saved = JSON.parse(localStorage.getItem(`progress_book_${book.id}`) || '{}');
      localStorage.setItem(`progress_book_${book.id}`, JSON.stringify({ ...saved, time: e.target.currentTime }));
    }
  };

  const handleAnswer = (qIndex, oIndex) => {
    if (quizScore === null) setUserAnswers(prev => ({ ...prev, [qIndex]: oIndex }));
  };

  const calculateScore = () => {
    let score = 0;
    book.questions.forEach((q, i) => {
      if (userAnswers[i] === q.correct) score++;
    });
    setQuizScore(score);

    if (score >= passingScore) {
      const completedBooks = JSON.parse(localStorage.getItem('completedBooks') || '[]');
      if (!completedBooks.includes(book.id)) {
        completedBooks.push(book.id);
        localStorage.setItem('completedBooks', JSON.stringify(completedBooks));
      }
      
      // Update global user progress to 100%
      const userProgress = JSON.parse(localStorage.getItem('userProgress') || '{}');
      userProgress[book.id] = {
        ...(userProgress[book.id] || {}),
        percent: 100,
        lastRead: new Date().toISOString()
      };
      localStorage.setItem('userProgress', JSON.stringify(userProgress));

      // Save reward to hs_book_rewards for Rewards page
      const bookRewards = JSON.parse(localStorage.getItem('hs_book_rewards') || '[]');
      const alreadyRewarded = bookRewards.some(r => r.bookId === book.id);
      if (!alreadyRewarded) {
        bookRewards.push({
          bookId: book.id,
          bookTitle: book.title,
          points: 50,
          earnedAt: new Date().toISOString()
        });
        localStorage.setItem('hs_book_rewards', JSON.stringify(bookRewards));
      }

      // Trigger Reward Animation
      setTimeout(() => {
        setShowReward(true);
      }, 800);
    }
  };

  const isQuizUnlocked = isAudioComplete || currentPage >= totalPages;

  return (
    <div className="flex flex-col h-screen bg-slate-50 overflow-hidden text-left">
      
      {/* Top Header */}
      <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 shadow-sm z-10">
        <button 
          onClick={() => navigate('/app/books')}
          className="flex items-center gap-2 text-slate-400 hover:text-health-green transition-colors font-black text-[10px] uppercase tracking-widest group"
        >
          <div className="p-1.5 rounded-lg group-hover:bg-health-green/10 transition-all"><ArrowLeft size={16} /></div>
          Back to Library
        </button>
        <div className="flex items-center gap-3">
           <div className="w-8 h-8 bg-gradient-to-br from-health-green to-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-health-green/20">
              <BookOpen size={14} />
           </div>
           <span className="text-xs font-black text-slate-800 uppercase tracking-widest">{book.title}</span>
        </div>
        <div className="w-24"></div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* Left Side: Book Details - Optimized Spacing */}
        <aside className="hidden lg:flex w-full lg:w-[380px] bg-white border-r border-slate-200 flex-col shrink-0 overflow-y-auto no-scrollbar">
          <div className="p-6 space-y-6">
            <div className="space-y-4">
              <div className="aspect-[3/4] w-44 mx-auto rounded-[2rem] overflow-hidden shadow-2xl shadow-rose-200/50 border-4 border-white">
                 <img src={book.image} alt={book.title} className="w-full h-full object-cover" />
              </div>
              <div className="text-center">
                 <h1 className="text-lg font-black text-slate-800 leading-tight">{book.title}</h1>
                 <div className="flex items-center justify-center gap-2 mt-1">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">by {book.author}</span>
                    <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                    <span className="text-[9px] font-black text-health-green uppercase tracking-widest">{book.category}</span>
                 </div>
              </div>
            </div>

            <div className="bg-slate-50/50 rounded-3xl p-5 border border-slate-100">
              <h3 className="text-[9px] font-black text-health-green uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                <span className="p-1 bg-health-green/10 rounded-lg"><Sparkles size={12} /></span> Insight Summary
              </h3>
              <p className="text-[12px] text-slate-500 leading-relaxed font-medium">
                {book.desc}
              </p>
            </div>

            <div className="space-y-4">
               <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Table of Contents</h3>
               <div className="grid grid-cols-1 gap-2">
                 {book.chapters.map((ch, i) => (
                   <button 
                     key={i}
                     onClick={() => { setIsReading(true); setCurrentPage(i * 6 + 1); }}
                     className="w-full flex items-center gap-3 p-2.5 rounded-2xl hover:bg-health-green/5 transition-all group text-left border border-transparent hover:border-health-green/10"
                   >
                     <span className="w-7 h-7 rounded-xl bg-slate-100 group-hover:bg-health-green/20 text-[10px] font-black text-slate-400 group-hover:text-health-green flex items-center justify-center shrink-0 transition-all">{i+1}</span>
                     <span className="text-[12px] font-bold text-slate-600 group-hover:text-slate-800 transition-colors line-clamp-1">{ch}</span>
                   </button>
                 ))}
               </div>
            </div>
          </div>
        </aside>

        {/* Right Side: Reader & Quiz */}
        <main className="flex-1 bg-[#F8FAFC] relative flex flex-col overflow-hidden">
          
          {!isReading ? (
            <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-8 text-center">
               <div className="relative mb-6 sm:mb-8">
                  <div className="absolute inset-0 bg-health-green/20 blur-3xl rounded-full scale-150 animate-pulse"></div>
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-2xl sm:rounded-[2rem] shadow-2xl flex items-center justify-center text-health-green">
                     <PlayCircle size={32} className="sm:w-10 sm:h-10" />
                  </div>
               </div>
               <h2 className="text-lg sm:text-xl font-black text-slate-800 mb-2">Begin Your Learning</h2>
               <p className="text-slate-400 text-xs sm:text-sm font-medium mb-6 sm:mb-8 max-w-[240px] sm:max-w-xs">Experience the book with interactive pages and audio guidance.</p>
               <button 
                 onClick={() => setIsReading(true)}
                 className="px-8 sm:px-10 py-3.5 sm:py-4 bg-slate-900 text-white font-black text-[9px] sm:text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.25em] rounded-2xl shadow-2xl shadow-slate-900/20 hover:scale-105 active:scale-95 transition-all"
               >
                 Open Reader
               </button>
            </div>
          ) : (
            <div className="flex-1 flex flex-col overflow-hidden">
              {!showQuiz ? (
                <div className="flex-1 relative flex flex-col items-center justify-center p-3 sm:p-4">
                  {/* Navigation Arrows - Adjusted for mobile */}
                  <button 
                    onClick={() => setCurrentPage(p => Math.max(1, p - (window.innerWidth < 768 ? 1 : (p === 1 ? 1 : 2))))}
                    disabled={currentPage === 1}
                    className="absolute left-2 sm:left-6 z-10 w-9 h-9 sm:w-11 sm:h-11 bg-white/90 backdrop-blur-md rounded-xl sm:rounded-2xl shadow-xl flex items-center justify-center text-slate-400 hover:text-health-green disabled:opacity-10 transition-all border border-slate-50"
                  >
                    <ChevronLeft size={18} className="sm:w-5 sm:h-5" />
                  </button>

                  {/* Responsive Book Container */}
                  <div className={`transition-all duration-700 flex items-center justify-center ${currentPage === 1 ? 'w-full max-w-[320px] sm:w-[420px]' : 'w-full max-w-[95%] sm:max-w-[900px]'} h-[480px] sm:h-[540px] gap-1 relative`}>
                    <AnimatePresence initial={false} mode="wait">
                      {currentPage === 1 ? (
                        /* Front Cover */
                        <motion.div
                          key="cover"
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ x: -100, opacity: 0 }}
                          className="absolute inset-0 bg-white rounded-3xl sm:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col border border-white"
                        >
                          <div className="h-1.5 sm:h-2 bg-gradient-to-r from-health-green to-emerald-400 shrink-0"></div>
                          <div className="flex-1 p-6 sm:p-10 flex flex-col items-center justify-center text-center space-y-6 sm:space-y-8">
                             <img src={book.image} alt="Cover" className="w-32 h-44 sm:w-48 sm:h-64 object-cover rounded-2xl sm:rounded-3xl shadow-2xl border-4 sm:border-8 border-slate-50" />
                             <div>
                                <h3 className="text-lg sm:text-2xl font-black text-slate-800 leading-tight mb-2">{book.title}</h3>
                                <p className="text-[8px] sm:text-[10px] font-black text-health-green uppercase tracking-[0.2em] sm:tracking-[0.3em]">Health Sakhi Academy</p>
                             </div>
                          </div>
                        </motion.div>
                      ) : (
                        /* Spread or Single Page */
                        <motion.div 
                          key={`spread-${currentPage}`}
                          initial={{ opacity: 0, x: 50 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -50 }}
                          className="absolute inset-0 flex w-full h-full gap-0.5 sm:gap-1"
                        >
                          {/* Left Page (Always visible) */}
                          <div className="flex-1 bg-white rounded-2xl sm:rounded-l-[2.5rem] sm:rounded-r-lg shadow-2xl border border-white flex flex-col overflow-hidden">
                             <div className="h-1 sm:h-1.5 bg-slate-100/50"></div>
                             <div className="flex-1 p-5 sm:p-10 flex flex-col overflow-y-auto no-scrollbar">
                                <span className="text-[8px] sm:text-[9px] font-black text-slate-300 uppercase tracking-widest mb-4 sm:mb-6">Page {currentPage}</span>
                                <div className="space-y-3 sm:space-y-4 text-left">
                                   <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-health-green/10 flex items-center justify-center text-health-green"><Sparkles size={14} /></div>
                                   <h4 className="text-[11px] sm:text-sm font-black text-slate-800 uppercase tracking-widest">
                                      {book.chapters[Math.floor((currentPage-1) / 6)] || "Healing Wisdom"}
                                   </h4>
                                   <p className="text-slate-500 text-xs sm:text-[13px] leading-relaxed sm:leading-[1.8] font-medium">
                                      {book.pageContent[Math.floor((currentPage-1) / 6)] || "Continue your journey of wellness and discovery."}
                                   </p>
                                </div>
                             </div>
                          </div>

                          {/* Central Spine - Desktop Only */}
                          <div className="hidden sm:block w-2 bg-gradient-to-r from-slate-200 via-slate-50 to-slate-200 shadow-inner z-10"></div>

                          {/* Right Page - Desktop Only */}
                          <div className="hidden sm:flex flex-1 bg-white rounded-r-[2.5rem] rounded-l-lg shadow-2xl border border-white flex-col overflow-hidden">
                             <div className="h-1.5 bg-slate-100/50"></div>
                             <div className="flex-1 p-10 flex flex-col overflow-y-auto no-scrollbar">
                                <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-6 text-right block">Page {Math.min(totalPages, currentPage + 1)}</span>
                                <div className="space-y-6 text-left">
                                   <p className="text-slate-600 text-[13px] leading-[1.8] font-medium">
                                      {book.pageContent[Math.floor(currentPage / 6)] || "Focus on your body's innate wisdom and follow the path to healing."}
                                   </p>
                                   <div className="p-4 bg-rose-50/50 rounded-2xl border-l-4 border-rose-200">
                                      <p className="text-slate-500 text-[9px] italic font-bold uppercase tracking-widest">
                                         Sakhi Reflection
                                      </p>
                                      <p className="text-slate-400 text-[12px] italic mt-1">
                                         "Self-care is a divine responsibility."
                                      </p>
                                   </div>
                                </div>
                             </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <button 
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + (window.innerWidth < 768 ? 1 : 2)))}
                    disabled={currentPage >= totalPages}
                    className="absolute right-2 sm:right-6 z-10 w-9 h-9 sm:w-11 sm:h-11 bg-white/90 backdrop-blur-md rounded-xl sm:rounded-2xl shadow-xl flex items-center justify-center text-slate-400 hover:text-health-green disabled:opacity-10 transition-all border border-slate-50"
                  >
                    <ChevronRight size={18} className="sm:w-5 sm:h-5" />
                  </button>

                  {/* Compact Quick Access Toolbar */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white/90 backdrop-blur-md px-5 py-2.5 rounded-3xl shadow-2xl border border-white/40">
                     <button 
                       disabled={!isQuizUnlocked}
                       onClick={() => setShowQuiz(true)}
                       className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                         isQuizUnlocked 
                         ? 'bg-health-green text-white shadow-lg shadow-health-green/30 hover:scale-105' 
                         : 'bg-slate-100 text-slate-300 cursor-not-allowed'
                       }`}
                     >
                       <Trophy size={14} /> {isQuizUnlocked ? 'Take Quiz' : 'Locked'}
                     </button>
                     {!isQuizUnlocked && (
                       <div className="px-2 border-l border-slate-200 ml-2">
                          <p className="text-[8px] font-black text-slate-400 uppercase tracking-tighter leading-tight">Complete Audio or<br/>Read all pages</p>
                       </div>
                     )}
                  </div>
                </div>
              ) : (
                /* Compact & Premium Quiz Interface */
                <div className="flex-1 overflow-y-auto p-6 md:p-10 animate-in slide-in-from-bottom-8 duration-700">
                  <div className="max-w-3xl mx-auto space-y-8">
                     <div className="flex items-center justify-between bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100">
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-health-green shadow-xl"><Trophy size={24} /></div>
                           <div className="text-left">
                              <h2 className="text-lg font-black text-slate-800 leading-none mb-1">Knowledge Check</h2>
                              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Required: {passingScore} / {book.questions.length} Correct</p>
                           </div>
                        </div>
                        <button onClick={() => setShowQuiz(false)} className="px-5 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all">Back</button>
                     </div>

                     <div className="grid grid-cols-1 gap-4">
                        {book.questions.map((q, i) => (
                          <div key={i} className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row gap-6">
                             <div className="md:w-1/2 space-y-4">
                                <div className="inline-block px-3 py-1 bg-slate-50 rounded-xl text-[9px] font-black text-slate-400 uppercase tracking-widest">Question 0{i+1}</div>
                                <h4 className="text-base font-bold text-slate-800 leading-tight">{q.question}</h4>
                             </div>
                             <div className="md:w-1/2 grid grid-cols-1 gap-2.5">
                                {q.options.map((opt, oIndex) => {
                                   const isSelected = userAnswers[i] === oIndex;
                                   const isCorrect = quizScore !== null && oIndex === q.correct;
                                   const isWrong = quizScore !== null && isSelected && oIndex !== q.correct;
                                   return (
                                     <button 
                                       key={oIndex}
                                       onClick={() => handleAnswer(i, oIndex)}
                                       className={`p-4 rounded-2xl border text-left font-bold text-[13px] transition-all flex items-center justify-between ${
                                         isCorrect ? 'bg-health-green/10 border-health-green text-health-green' :
                                         isWrong ? 'bg-red-50 border-red-200 text-red-500' :
                                         isSelected ? 'bg-slate-900 border-slate-900 text-white shadow-xl' :
                                         'bg-white border-slate-100 hover:border-slate-300 text-slate-500'
                                       }`}
                                     >
                                       {opt}
                                       {isCorrect && <CheckCircle size={16} />}
                                       {isWrong && <XCircle size={16} />}
                                     </button>
                                   );
                                })}
                             </div>
                          </div>
                        ))}
                     </div>

                     {quizScore === null ? (
                        <button 
                          onClick={calculateScore}
                          disabled={Object.keys(userAnswers).length < book.questions.length}
                          className="w-full py-5 bg-health-green text-white font-black rounded-[2rem] text-[10px] uppercase tracking-[0.3em] hover:scale-[1.02] transition-all shadow-xl shadow-health-green/20 disabled:opacity-30"
                        >
                          Verify My Progress
                        </button>
                     ) : (
                        <div className={`p-8 rounded-[3rem] text-center space-y-6 text-white shadow-2xl animate-in zoom-in-95 ${quizScore >= passingScore ? 'bg-health-green shadow-health-green/20' : 'bg-rose-500 shadow-rose-500/20'}`}>
                           <div className="space-y-1">
                              <h3 className="text-4xl font-black">Score: {quizScore}/{book.questions.length}</h3>
                              <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80">{quizScore >= passingScore ? 'Volume Completed' : 'Incomplete Progress'}</p>
                           </div>
                           
                           <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                             {quizScore < passingScore && (
                               <button 
                                 onClick={() => { setQuizScore(null); setUserAnswers({}); setShowQuiz(false); }} 
                                 className="px-8 py-3.5 bg-white/20 hover:bg-white/30 text-white font-black rounded-2xl text-[9px] uppercase tracking-widest backdrop-blur-md transition-all"
                               >
                                 Try Again
                               </button>
                             )}
                             <button 
                               onClick={() => navigate('/app/books')} 
                               className="px-10 py-3.5 bg-white text-slate-900 font-black rounded-2xl text-[9px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl"
                             >
                               {quizScore >= passingScore ? 'Finish & Claim Badge' : 'Return to Library'}
                             </button>
                           </div>
                        </div>
                     )}
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      <footer className="h-20 bg-white border-t border-slate-200 flex items-center px-8 shrink-0">
        <div className="flex-1 flex items-center gap-6">
           <div className="hidden sm:flex items-center gap-3">
              <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center text-health-green">
                 <Headphones size={20} />
              </div>
              <div className="shrink-0">
                 <p className="text-[10px] font-black text-slate-800 uppercase tracking-widest">{book.title}</p>
                 <p className="text-[9px] font-bold text-slate-400">Listening Session</p>
              </div>
           </div>
           <audio 
             ref={audioRef}
             src={book.audioUrl}
             controls
             onTimeUpdate={handleAudioUpdate}
             className="flex-1 h-10"
           />
           <div className="hidden md:flex items-center gap-3 ml-4">
              <div className="text-right">
                 <p className="text-[9px] font-black text-health-green uppercase tracking-widest">{isAudioComplete ? 'Listen Complete' : 'Listen Progress'}</p>
                 <p className="text-[8px] font-bold text-slate-400">Unlock quiz after 98%</p>
              </div>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isAudioComplete ? 'bg-health-green text-white' : 'bg-slate-100 text-slate-300'}`}>
                 <Trophy size={18} />
              </div>
           </div>
        </div>
      </footer>

      <RewardModal 
        isOpen={showReward} 
        onClose={() => navigate('/app/books')} 
        points={50}
        bookTitle={book.title}
      />
    </div>
  );
};

export default BookScreen;
