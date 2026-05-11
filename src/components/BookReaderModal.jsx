import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Play, Pause, Volume2, ChevronLeft, ChevronRight, BookOpen, Headphones } from 'lucide-react';

const BookReaderModal = ({ isOpen, onClose, book, initialMode }) => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [page, setPage] = useState(1);
  const [toc, setToc] = useState(['Understanding Your Body', 'The Role of Hormones', 'Daily Wellness Rituals', 'Nutrition for Balance', 'Rest and Recovery']);
  
  const utteranceRef = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (isOpen && book) {
      setPage(1);
      if (scrollRef.current) scrollRef.current.scrollLeft = 0;

      if (book.fileUrl) {
        setLoading(true);
        fetch(book.fileUrl)
          .then(res => res.text())
          .then(text => {
             // Dynamic TOC extraction based on short lines (often headers)
             const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
             const extractedToc = [];
             for (let line of lines) {
               // Heuristic for title/chapter headings
               if (line.length > 3 && line.length < 50 && !line.match(/[.!?]$/)) {
                 if (line === line.toUpperCase() || line.split(' ').length <= 6) {
                   if (!extractedToc.includes(line)) extractedToc.push(line);
                 }
               }
               if (extractedToc.length >= 7) break; // Limit TOC length
             }
             if (extractedToc.length > 0) setToc(extractedToc);

             // Basic formatting to ensure it flows nicely in columns
             const formatted = text.split('\n\n').map(p => `<p class="mb-5 text-[#4B1E5A]/80 leading-relaxed text-justify">${p}</p>`).join('');
             setContent(formatted);
             setLoading(false);
             if (initialMode === 'listen') startReading(text);
          })
          .catch(() => {
             setContent('<p>Error loading book content.</p>');
             setLoading(false);
          });
      } else {
        setContent(book.dummyContent || '<p>Content not available.</p>');
        if (initialMode === 'listen') startReading(book.dummyContent || 'Content not available.');
      }
    } else {
      stopReading();
    }
  }, [isOpen, book, initialMode]);

  const stripHtml = (html) => {
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  const startReading = (htmlText) => {
    if (!window.speechSynthesis) return;
    stopReading();
    
    const plainText = stripHtml(htmlText);
    const utterance = new SpeechSynthesisUtterance(plainText);
    utterance.rate = 0.9;
    
    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
    setIsPaused(false);
  };

  const togglePause = () => {
    if (!window.speechSynthesis) return;
    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsPlaying(true);
    } else {
      window.speechSynthesis.pause();
      setIsPaused(true);
      setIsPlaying(false);
    }
  };

  const stopReading = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setIsPaused(false);
    }
  };

  useEffect(() => {
    return () => stopReading();
  }, []);

  const nextPage = () => {
    if (scrollRef.current) {
      // Scroll by exactly one container width since 2 columns + 1 gap = exactly 100% width
      scrollRef.current.scrollBy({ left: scrollRef.current.clientWidth, behavior: 'smooth' });
      setPage(p => p + 2);
    }
  };

  const prevPage = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -scrollRef.current.clientWidth, behavior: 'smooth' });
      setPage(p => Math.max(1, p - 2));
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-[#F7F9F9] flex flex-col font-['Poppins']"
      >
        {/* Top Header */}
        <div className="h-[70px] bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0 shadow-sm z-10">
          <button 
            onClick={() => { stopReading(); onClose(); }}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-800 font-bold text-xs uppercase tracking-widest transition-colors"
          >
            <ArrowLeft size={16} /> Back to Library
          </button>
          
          <div className="flex items-center gap-3 absolute left-1/2 -translate-x-1/2">
            <div className="w-8 h-8 rounded-lg bg-[#10B981] flex items-center justify-center text-white shadow-md">
               <BookOpen size={16} />
            </div>
            <h1 className="font-black text-sm text-[#2D1B3D] uppercase tracking-widest">{book?.title?.toUpperCase()}</h1>
          </div>
          
          <div className="w-[100px]"></div> {/* Spacer for center alignment */}
        </div>

        {/* Main Body */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Left Sidebar */}
          <div className="w-[320px] bg-white border-r border-gray-100 flex flex-col h-full overflow-y-auto no-scrollbar shrink-0 pt-8 px-6 pb-24">
            
            {/* Book Cover */}
            <div className="w-40 aspect-[3/4] mx-auto rounded-2xl overflow-hidden shadow-xl mb-6 border border-gray-50">
              <img src={book?.img} alt="" className="w-full h-full object-cover" />
            </div>

            {/* Book Info */}
            <div className="text-center mb-8">
              <h2 className="font-black text-xl text-[#2D1B3D] leading-tight mb-2">{book?.title}</h2>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                BY DR. PRATAP <span className="mx-2">•</span> <span className="text-[#10B981]">GENERAL HEALTH</span>
              </p>
            </div>

            {/* Insight Summary */}
            <div className="bg-[#ECFDF5] border border-[#D1FAE5] rounded-2xl p-5 mb-8">
              <div className="flex items-center gap-2 text-[#10B981] font-black text-[10px] uppercase tracking-widest mb-2">
                <span className="w-5 h-5 rounded-full bg-[#10B981]/20 flex items-center justify-center text-[10px]">✨</span>
                Insight Summary
              </div>
              <p className="text-xs font-medium text-[#065F46] leading-relaxed">
                {book?.desc || 'Learn essential wellness habits and regain control of your everyday health.'}
              </p>
            </div>

            {/* Table of Contents */}
            <div>
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Table of Contents</h3>
              <div className="space-y-4">
                {toc.map((chapter, i) => (
                  <div key={i} className="flex items-center gap-4 cursor-pointer group">
                    <div className="w-6 h-6 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center text-[10px] font-black group-hover:bg-[#E91E63] group-hover:text-white transition-colors shrink-0">
                      {i + 1}
                    </div>
                    <span className="text-[11px] font-bold text-[#4B1E5A]/70 group-hover:text-[#E91E63] transition-colors leading-tight truncate">{chapter}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Reading Area */}
          <div className="flex-1 bg-[#F7F9F9] relative flex items-center justify-center p-8 pb-32">
            
            {/* Prev Button */}
            <button onClick={prevPage} className="absolute left-8 w-12 h-12 rounded-full bg-white shadow-[0_4px_20px_rgba(0,0,0,0.05)] text-gray-400 flex items-center justify-center hover:scale-105 hover:text-[#E91E63] transition-all z-10 border border-gray-100">
              <ChevronLeft size={24} />
            </button>

            {/* Book Pages Container */}
            <div className="relative w-full max-w-5xl h-[75vh] bg-white rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.06)] border border-gray-100 flex overflow-hidden">
              
              <div className="w-full h-full py-16 px-12 relative overflow-hidden">
                {/* Center Fold Line */}
                <div className="absolute left-1/2 top-10 bottom-10 w-[1px] bg-gradient-to-b from-transparent via-gray-200 to-transparent shadow-[1px_0_2px_rgba(0,0,0,0.02)] z-10" />

                {/* Page Numbers */}
                <div className="absolute top-6 left-12 text-[9px] font-black text-gray-300 uppercase tracking-[0.2em] z-10">Page {page}</div>
                <div className="absolute top-6 right-12 text-[9px] font-black text-gray-300 uppercase tracking-[0.2em] z-10">Page {page + 1}</div>

                {/* CSS Multi-Column Text Container */}
                <div 
                  ref={scrollRef}
                  className="w-full h-full overflow-hidden"
                  style={{ scrollBehavior: 'smooth' }}
                >
                  {loading ? (
                    <div className="h-full flex items-center justify-center">
                      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#E91E63]"></div>
                    </div>
                  ) : (
                    <div 
                      className="h-full"
                      style={{
                        columnWidth: 'calc(50% - 2.5rem)', /* 50% width minus half the gap */
                        columnGap: '5rem', /* Gap between the two columns */
                        columnFill: 'auto'
                      }}
                    >
                      <div dangerouslySetInnerHTML={{ __html: content }} />
                      
                      {/* Simulated Sakhi Reflection Box within text flow */}
                      <div className="bg-[#FFF0F5] border border-[#FCE4EC] rounded-2xl p-6 my-8 break-inside-avoid shadow-sm">
                        <p className="text-[9px] font-black text-[#E91E63] uppercase tracking-widest mb-2">Sakhi Reflection</p>
                        <p className="text-sm font-serif italic font-bold text-[#E91E63]/80">
                          "Self-care is not a luxury, it is a divine responsibility to the body you live in."
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Next Button */}
            <button onClick={nextPage} className="absolute right-8 w-12 h-12 rounded-full bg-white shadow-[0_4px_20px_rgba(0,0,0,0.05)] text-gray-400 flex items-center justify-center hover:scale-105 hover:text-[#E91E63] transition-all z-10 border border-gray-100">
              <ChevronRight size={24} />
            </button>
          </div>
        </div>

        {/* Bottom Audio Player Bar */}
        <div className="h-[80px] bg-white border-t border-gray-200 fixed bottom-0 left-0 right-0 z-50 flex items-center px-8 shadow-[0_-5px_20px_rgba(0,0,0,0.02)]">
          
          <div className="flex items-center gap-4 w-[300px]">
             <div className="w-10 h-10 rounded-full bg-[#ECFDF5] text-[#10B981] flex items-center justify-center">
                <Headphones size={20} />
             </div>
             <div>
               <h4 className="font-black text-xs text-[#2D1B3D] uppercase tracking-widest">{book?.title}</h4>
               <p className="text-[10px] font-bold text-gray-400">Listening Session</p>
             </div>
          </div>

          <div className="flex-1 flex items-center gap-4 px-8">
            <button onClick={togglePause} className="w-8 h-8 flex items-center justify-center text-[#2D1B3D] hover:text-[#E91E63] transition-colors">
              {isPlaying && !isPaused ? <Pause size={20} /> : <Play size={20} className="ml-1" />}
            </button>
            <span className="text-[10px] font-black text-gray-400 font-mono">0:00 / 15:00</span>
            
            {/* Progress Bar */}
            <div className="flex-1 h-1.5 bg-gray-100 rounded-full relative cursor-pointer group">
               <div className="absolute left-0 top-0 bottom-0 w-[15%] bg-[#10B981] rounded-full"></div>
               <div className="absolute left-[15%] top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 border-[#10B981] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            
            <button className="text-gray-400 hover:text-gray-700">
              <Volume2 size={18} />
            </button>
          </div>

          <div className="w-[200px] flex items-center justify-end gap-3 border-l border-gray-100 pl-6">
             <div className="text-right">
                <p className="text-[9px] font-black text-[#10B981] uppercase tracking-widest">Listen Progress</p>
                <p className="text-[8px] font-bold text-gray-400 uppercase">Unlock quiz after 50%</p>
             </div>
             <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-300">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 15V3m0 12l-4-4m4 4l4-4M2 17l.621 2.485A2 2 0 0 0 4.561 21h14.878a2 2 0 0 0 1.94-1.515L22 17"></path></svg>
             </div>
          </div>

        </div>

      </motion.div>
    </AnimatePresence>
  );
};

export default BookReaderModal;
