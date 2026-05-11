import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, ChevronLeft, Mic, Play, MoreVertical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AISakhiScreen = () => {
  const navigate = useNavigate();
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('hs_ai_sakhi_chat');
    return saved ? JSON.parse(saved) : [
      {
        id: 1,
        role: 'sakhi',
        text: 'Namaste, Meri Sakhi🌸 I\'m here to listen to your heart. Tell me, how are you feeling today, lovely?',
        time: '10:00 AM',
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('hs_ai_sakhi_chat', JSON.stringify(messages));
  }, [messages]);

  const quickReplies = [
    'I feel anxious 😟',
    'Period is late 🌙',
    'Stress support 🌿',
    'Talk to me 💕',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (text = null) => {
    const msgText = text || input.trim();
    if (!msgText) return;
    const newMessage = {
      id: Date.now(),
      role: 'user',
      text: msgText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(prev => [...prev, newMessage]);
    setInput('');
    setIsTyping(true);

    const lowerText = msgText.toLowerCase();
    let aiResponse = 'I hear you, sweetheart 🌸 You are not alone. Let\'s work through this together.';
    let suggestions = [{ icon: 'play', label: 'Healing Music', type: 'video' }];

    if (lowerText.includes('tired') || lowerText.includes('exhausted') || lowerText.includes('sleep') || lowerText.includes('low energy')) {
      aiResponse = 'I sense you are feeling quite tired. It is okay to rest. Would you like to do a quick wind-down session? 🌙';
      suggestions = [{ icon: 'play', label: 'Start Wind-down', type: 'action', route: '/app/mood/tired' }];
    } else if (lowerText.includes('sad') || lowerText.includes('cry') || lowerText.includes('alone') || lowerText.includes('down')) {
      aiResponse = 'Your words feel heavy. I am right here with you. Let\'s process this feeling safely together. 🌸';
      suggestions = [{ icon: 'sparkles', label: 'Comfort Session', type: 'action', route: '/app/mood/sad' }];
    } else if (lowerText.includes('stress') || lowerText.includes('anxious') || lowerText.includes('worry') || lowerText.includes('panic') || lowerText.includes('overwhelm')) {
      aiResponse = 'Take a deep breath. I know things feel overwhelming right now. Let\'s do a quick breathing exercise. 🌿';
      suggestions = [{ icon: 'play', label: 'Breathe Together', type: 'action', route: '/app/mood/stressed' }];
    } else if (lowerText.includes('happy') || lowerText.includes('good') || lowerText.includes('great') || lowerText.includes('smile') || lowerText.includes('joy')) {
      aiResponse = 'That is wonderful to hear! Your energy is glowing. Let\'s celebrate this feeling! ✨';
      suggestions = [{ icon: 'sparkles', label: 'Preserve Joy', type: 'action', route: '/app/mood/happy' }];
    }

    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'sakhi',
        text: aiResponse,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: suggestions,
      }]);
    }, 1800);
  };

  return (
    <div className="h-[calc(100vh-140px)] md:h-[calc(100vh-160px)] w-full flex flex-col relative font-sans text-[#15192c]">
      
      {/* ── No Outer Box: Chat Header ── */}
      <div className="px-4 md:px-8 py-4 md:py-5 flex items-center justify-between flex-shrink-0 relative z-30">
        <div className="flex items-center gap-3 md:gap-5">
          <button 
            onClick={() => navigate('/app')}
            className="w-9 h-9 md:w-10 md:h-10 rounded-full border border-rose-100 flex items-center justify-center text-[#15192c] bg-white shadow-sm hover:bg-rose-50 transition-all shrink-0"
          >
            <ChevronLeft size={18} />
          </button>
          <div className="flex items-center gap-3 md:gap-4">
            <div className="w-10 h-10 md:w-11 md:h-11 rounded-2xl bg-rose-50 flex items-center justify-center shadow-inner shrink-0">
              <Sparkles size={20} className="text-[#ff69b4]" />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-black tracking-tight text-[#15192c]">AI Sakhi</h2>
              <div className="flex items-center gap-1.5 text-[7px] md:text-[8px] font-bold uppercase tracking-[0.2em] text-[#ff69b4]">
                 <div className="w-1 h-1 bg-[#ff69b4] rounded-full animate-pulse" />
                 Listening
              </div>
            </div>
          </div>
        </div>
        <button className="w-9 h-9 md:w-10 md:h-10 rounded-xl border border-rose-100 flex items-center justify-center text-[#C4A0AC] bg-white shadow-sm shrink-0"><MoreVertical size={20}/></button>
      </div>

      {/* ── Internal Scrollable Messages (Direct on Mesh Background) ── */}
      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-4 space-y-6 md:space-y-8 scrollbar-hide custom-scrollbar relative z-20">
        <div className="max-w-4xl mx-auto w-full space-y-8">
          <AnimatePresence mode="popLayout">
            {messages.map((msg) => (
              <motion.div 
                key={msg.id} 
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} items-end gap-4`}
              >
                {msg.role === 'sakhi' && (
                  <div className="w-9 h-9 rounded-xl bg-white border border-rose-50 flex items-center justify-center shadow-sm flex-shrink-0">
                    <Sparkles size={16} className="text-[#ff69b4]" />
                  </div>
                )}
                <div className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} max-w-[85%] md:max-w-[70%]`}>
                  <div className={`px-4 md:px-6 py-3 md:py-4 text-[13px] md:text-sm font-semibold leading-relaxed shadow-xl ${
                    msg.role === 'user' 
                    ? 'bg-[#15192c] text-white rounded-2xl md:rounded-[2rem] rounded-br-none' 
                    : 'bg-white text-[#15192c] rounded-2xl md:rounded-[2rem] rounded-bl-none border border-rose-50'
                  }`}>
                    {msg.text}
                  </div>
                  {msg.suggestions && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {msg.suggestions.map((s, i) => {
                          const IconComp = s.icon === 'play' ? Play : Sparkles;
                          return (
                            <button 
                              key={i} 
                              onClick={() => { if(s.route) navigate(s.route); }}
                              className="px-5 py-3 rounded-2xl bg-white border border-rose-100 text-[10px] font-black uppercase tracking-widest text-[#ff69b4] shadow-sm flex items-center gap-2 hover:bg-rose-50 transition-all"
                            >
                                <IconComp size={14} /> {s.label}
                            </button>
                          );
                        })}
                      </div>
                  )}
                  <span className="mt-2 text-[9px] font-black uppercase tracking-widest text-[#C4A0AC]">{msg.time}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {isTyping && (
            <div className="flex items-center gap-4">
                <div className="w-9 h-9 rounded-xl bg-white border border-rose-50 flex items-center justify-center"><Sparkles size={16} className="text-[#ff69b4]" /></div>
                <div className="px-6 py-4 bg-white/60 backdrop-blur-md rounded-[2rem] rounded-bl-none border border-white flex gap-1 shadow-sm">
                  <div className="w-1.5 h-1.5 bg-[#ff69b4] rounded-full animate-bounce" />
                  <div className="w-1.5 h-1.5 bg-[#ff69b4] rounded-full animate-bounce [animation-delay:0.1s]" />
                  <div className="w-1.5 h-1.5 bg-[#ff69b4] rounded-full animate-bounce [animation-delay:0.2s]" />
                </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* ── Chat Footer (Floating at bottom) ── */}
      <div className="px-8 py-6 flex-shrink-0 relative z-30">
        <div className="max-w-4xl mx-auto w-full space-y-5">
          {/* Quick Replies */}
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {quickReplies.map(r => (
              <button 
                key={r}
                onClick={() => handleSend(r)}
                className="px-6 py-3 bg-white border border-rose-100 rounded-xl text-[9px] font-black uppercase tracking-widest text-[#15192c] whitespace-nowrap shadow-sm hover:border-[#ff69b4] transition-all"
              >
                {r}
              </button>
            ))}
          </div>

          <div className="relative group">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Talk to Sakhi..." 
              className="w-full h-14 md:h-16 pl-6 md:pl-8 pr-28 md:pr-32 bg-white/90 backdrop-blur-md border border-rose-50 rounded-[1.5rem] md:rounded-[2rem] shadow-2xl shadow-rose-100/30 focus:border-[#ff69b4] outline-none transition-all text-sm font-semibold"
            />
            <div className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 flex items-center gap-2 md:gap-3">
              <button className="w-10 h-10 md:w-11 md:h-11 rounded-xl md:rounded-2xl bg-rose-50 text-[#ff69b4] flex items-center justify-center hover:bg-[#ff69b4] hover:text-white transition-all"><Mic size={16}/></button>
              <button onClick={() => handleSend()} className="w-10 h-10 md:w-11 md:h-11 rounded-xl md:rounded-2xl bg-[#ff69b4] text-white flex items-center justify-center shadow-lg shadow-rose-100 hover:scale-105 transition-transform"><Send size={16}/></button>
            </div>
          </div>
          <p className="text-center text-[9px] font-black uppercase tracking-[0.2em] text-[#C4A0AC]">Your private sanctuary with AI Sakhi 🌸</p>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #F5E6EA; border-radius: 10px; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default AISakhiScreen;
