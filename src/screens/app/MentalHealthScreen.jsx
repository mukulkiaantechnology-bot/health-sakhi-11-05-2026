import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain, Moon, Sun, Activity, Sparkles, ArrowRight, ChevronLeft,
  ShieldCheck, Heart, Star, MessageCircle, X, Wind, CheckCircle,
  AlertTriangle, Smile, TrendingUp, BookOpen, Zap
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// ── Mood Storage Helper ──────────────────────────────────────────────────────
const STORAGE_KEY = 'hs_mood_logs';
const getMoodLogs = () => {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
  catch { return []; }
};
const DUMMY_CHART = [55, 70, 40, 85, 60, 75, 50];
const getWeeklyChart = () => {
  const logs = getMoodLogs();
  const moodScores = { Happy: 90, Grateful: 85, Stressed: 30, Sad: 20, Tired: 40, 'Low Energy': 45 };
  const days = ['SUN','MON','TUE','WED','THU','FRI','SAT'];
  const today = new Date();
  const mapped = days.map((day, i) => {
    const d = new Date(today); d.setDate(today.getDate() - (6 - i));
    const log = logs.find(l => new Date(l.date).toDateString() === d.toDateString());
    return { day, value: log ? (moodScores[log.mood] || 50) : null, hasLog: !!log };
  });
  const hasAnyLog = mapped.some(d => d.hasLog);
  if (!hasAnyLog) {
    return days.map((day, i) => ({ day, value: DUMMY_CHART[i], hasLog: false, isDummy: true }));
  }
  return mapped.map((d, i) => ({ ...d, value: d.value ?? DUMMY_CHART[i] }));
};


// ── Self-Check Quiz Data ─────────────────────────────────────────────────────
const quizQuestions = [
  { q: 'How often have you felt nervous, anxious, or on edge?', opts: ['Not at all','Several days','More than half the days','Nearly every day'] },
  { q: 'How often have you been unable to stop or control worrying?', opts: ['Not at all','Several days','More than half the days','Nearly every day'] },
  { q: 'How often have you felt little interest or pleasure in doing things?', opts: ['Not at all','Several days','More than half the days','Nearly every day'] },
  { q: 'How often have you felt down, depressed, or hopeless?', opts: ['Not at all','Several days','More than half the days','Nearly every day'] },
  { q: 'Overall, how would you rate your emotional wellbeing today?', opts: ['Excellent','Good','Fair','Poor'] },
];
const getResultFromScore = (score) => {
  if (score <= 3) return { label: 'Balanced & Calm', color: 'emerald', icon: Smile, msg: "You're doing beautifully! Keep nurturing your peace.", badgeColor: 'bg-emerald-50 border-emerald-100 text-emerald-700' };
  if (score <= 6) return { label: 'Mildly Stressed', color: 'amber', icon: TrendingUp, msg: "Some tension is building. Small self-care acts can make a big difference.", badgeColor: 'bg-amber-50 border-amber-100 text-amber-700' };
  return { label: 'Needs Support', color: 'rose', icon: AlertTriangle, msg: "It's okay to struggle. Please talk to someone you trust or use our Expert Chat.", badgeColor: 'bg-rose-50 border-rose-100 text-rose-700' };
};

// ── Box Breathing Component ──────────────────────────────────────────────────
const BreathingModal = ({ onClose }) => {
  const phases = [
    { label: 'Inhale', duration: 4, color: '#ff69b4', scale: 1.35 },
    { label: 'Hold', duration: 4, color: '#9079C1', scale: 1.35 },
    { label: 'Exhale', duration: 4, color: '#64B5F6', scale: 0.7 },
    { label: 'Hold', duration: 4, color: '#81C784', scale: 0.7 },
  ];
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [count, setCount] = useState(phases[0].duration);
  const [cycles, setCycles] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!running) return;
    intervalRef.current = setInterval(() => {
      setCount(c => {
        if (c <= 1) {
          setPhaseIdx(p => {
            const next = (p + 1) % phases.length;
            if (next === 0) setCycles(cy => cy + 1);
            setCount(phases[next].duration);
            return next;
          });
          return phases[(phaseIdx + 1) % phases.length].duration;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [running, phaseIdx]);

  const current = phases[phaseIdx];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#15192c]/80 backdrop-blur-md p-4">
      <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
        className="bg-white rounded-[3rem] p-10 w-full max-w-sm text-center shadow-2xl relative">
        <button onClick={onClose} className="absolute top-6 right-6 w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-[#C4A0AC] hover:bg-rose-100 transition-all">
          <X size={18} />
        </button>
        <p className="text-[10px] font-black uppercase tracking-widest text-[#C4A0AC] mb-2">Anxiety SOS</p>
        <h2 className="text-2xl font-black text-[#15192c] mb-1">Box Breathing</h2>
        <p className="text-xs text-[#9A8A8E] mb-8">4-4-4-4 pattern to calm your nervous system</p>

        <div className="relative flex items-center justify-center mb-8 h-48">
          <motion.div animate={{ scale: running ? current.scale : 1, backgroundColor: running ? current.color + '22' : '#FFF1F2' }}
            transition={{ duration: current.duration * 0.9, ease: 'easeInOut' }}
            className="absolute w-40 h-40 rounded-full border-2"
            style={{ borderColor: running ? current.color : '#f9a8d4' }} />
          <motion.div animate={{ scale: running ? current.scale * 0.7 : 0.7 }}
            transition={{ duration: current.duration * 0.9, ease: 'easeInOut' }}
            className="absolute w-24 h-24 rounded-full"
            style={{ backgroundColor: running ? current.color + '40' : '#fce7f3' }} />
          <div className="relative z-10 flex flex-col items-center">
            <span className="text-4xl font-black text-[#15192c]">{running ? count : '4'}</span>
            <span className="text-sm font-bold mt-1" style={{ color: running ? current.color : '#C4A0AC' }}>
              {running ? current.label : 'Ready'}
            </span>
          </div>
        </div>

        {cycles > 0 && <p className="text-xs text-[#ff69b4] font-black mb-4">✓ {cycles} cycle{cycles > 1 ? 's' : ''} complete</p>}

        <button onClick={() => setRunning(r => !r)}
          className="w-full py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] text-white transition-all hover:brightness-110 active:scale-95 shadow-lg"
          style={{ backgroundColor: running ? '#9079C1' : '#ff69b4' }}>
          {running ? 'Pause' : cycles > 0 ? 'Continue' : 'Start Breathing'}
        </button>
        {running && <p className="text-[10px] text-[#C4A0AC] mt-4 font-medium">Breathe naturally and follow the circle...</p>}
      </motion.div>
    </motion.div>
  );
};

// ── Self-Check Quiz Modal ────────────────────────────────────────────────────
const QuizModal = ({ onClose, onComplete }) => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);

  const handleAnswer = (optIdx) => {
    const newAnswers = [...answers, optIdx];
    setAnswers(newAnswers);
    if (step < quizQuestions.length - 1) {
      setStep(step + 1);
    } else {
      const score = newAnswers.reduce((a, b) => a + b, 0);
      const res = getResultFromScore(score);
      setResult(res);
      onComplete(res);
    }
  };

  const ResultIcon = result?.icon;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#15192c]/80 backdrop-blur-md p-4">
      <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
        className="bg-white rounded-[3rem] p-10 w-full max-w-sm shadow-2xl relative">
        <button onClick={onClose} className="absolute top-6 right-6 w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-[#C4A0AC] hover:bg-rose-100 transition-all">
          <X size={18} />
        </button>

        {!result ? (
          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <p className="text-[10px] font-black uppercase tracking-widest text-[#ff69b4] mb-2">Self-Check • {step + 1}/{quizQuestions.length}</p>
              <div className="w-full h-1 bg-rose-50 rounded-full mb-6 overflow-hidden">
                <div className="h-full bg-[#ff69b4] rounded-full transition-all duration-500" style={{ width: `${((step) / quizQuestions.length) * 100}%` }} />
              </div>
              <h3 className="text-lg font-black text-[#15192c] mb-6 leading-snug">{quizQuestions[step].q}</h3>
              <div className="space-y-3">
                {quizQuestions[step].opts.map((opt, i) => (
                  <button key={i} onClick={() => handleAnswer(i)}
                    className="w-full p-4 rounded-2xl border border-rose-50 text-left text-sm font-bold text-[#15192c] hover:border-[#ff69b4] hover:bg-rose-50/30 transition-all">
                    {opt}
                  </button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        ) : (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
            <div className={`w-20 h-20 rounded-3xl mx-auto mb-6 flex items-center justify-center ${result.badgeColor} border`}>
              {ResultIcon && <ResultIcon size={36} />}
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-[#ff69b4] mb-1">Your Result</p>
            <h3 className="text-2xl font-black text-[#15192c] mb-3">{result.label}</h3>
            <p className="text-sm text-[#9A8A8E] leading-relaxed mb-8">{result.msg}</p>
            <button onClick={onClose}
              className="w-full py-4 bg-[#ff69b4] text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:brightness-110 transition-all shadow-lg">
              Done ✨
            </button>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

// ── Main Screen ──────────────────────────────────────────────────────────────
const MentalHealthScreen = () => {
  const navigate = useNavigate();
  const [showSOS, setShowSOS] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [emotionalState, setEmotionalState] = useState(() => {
    try { return JSON.parse(localStorage.getItem('hs_emotional_state')) || { label: 'Balanced & Calm', badgeColor: 'bg-emerald-50 border-emerald-100', textColor: 'text-emerald-700', iconColor: 'text-emerald-600', bgIcon: 'bg-emerald-100' }; }
    catch { return { label: 'Balanced & Calm', badgeColor: 'bg-emerald-50 border-emerald-100', textColor: 'text-emerald-700', iconColor: 'text-emerald-600', bgIcon: 'bg-emerald-100' }; }
  });
  const [chartData, setChartData] = useState(() => getWeeklyChart());

  const handleQuizComplete = (result) => {
    const colorMap = {
      emerald: { textColor: 'text-emerald-700', iconColor: 'text-emerald-600', bgIcon: 'bg-emerald-100', badgeColor: 'bg-emerald-50 border-emerald-100' },
      amber: { textColor: 'text-amber-700', iconColor: 'text-amber-600', bgIcon: 'bg-amber-100', badgeColor: 'bg-amber-50 border-amber-100' },
      rose: { textColor: 'text-rose-700', iconColor: 'text-rose-600', bgIcon: 'bg-rose-100', badgeColor: 'bg-rose-50 border-rose-100' },
    };
    const state = { label: result.label, ...colorMap[result.color] };
    setEmotionalState(state);
    localStorage.setItem('hs_emotional_state', JSON.stringify(state));
  };

  const tools = [
    {
      title: 'Anxiety SOS',
      desc: 'Quick relief techniques for overwhelming moments.',
      icon: Wind, color: '#ff69b4', bg: 'bg-rose-50',
      action: () => setShowSOS(true)
    },
    {
      title: 'Sleep Hygiene',
      desc: 'Restorative routines for better nightly rest.',
      icon: Moon, color: '#9079C1', bg: 'bg-purple-50',
      action: () => navigate('/app/meditation')
    },
    {
      title: 'Morning Focus',
      desc: 'Setting healthy mental boundaries for the day.',
      icon: Sun, color: '#CCAA3D', bg: 'bg-amber-50',
      action: () => navigate('/app/todo')
    },
    {
      title: 'Expert Chat',
      desc: 'Secure space to talk about your deeper struggles.',
      icon: MessageCircle, color: '#D17B88', bg: 'bg-rose-50',
      action: () => navigate('/app/ai-sakhi')
    },
  ];

  const learningItems = [
    { title: 'Healing from Trauma', views: '2.4k views', tag: 'Expert', icon: Heart },
    { title: 'The Science of Joy', views: '1.8k views', tag: 'Course', icon: Sparkles },
    { title: 'Overcoming PCOD Stress', views: '5.1k views', tag: 'Wellness', icon: Activity },
  ];

  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } } };
  const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } } };

  return (
    <div className="relative min-h-screen pb-24 overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] rounded-full bg-[#ff69b4]/5 blur-[140px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[#FFF1F2] blur-[120px]" />
      </div>

      <AnimatePresence>
        {showSOS && <BreathingModal onClose={() => setShowSOS(false)} />}
        {showQuiz && <QuizModal onClose={() => setShowQuiz(false)} onComplete={handleQuizComplete} />}
      </AnimatePresence>

      <motion.div variants={container} initial="hidden" animate="show"
        className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 pt-12 space-y-12">

        {/* Header */}
        <motion.section variants={item} className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="flex items-center gap-8">
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => navigate('/app')}
              className="w-14 h-14 rounded-3xl bg-white border border-rose-100 flex items-center justify-center text-[#15192c] shadow-sm hover:shadow-md transition-all">
              <ChevronLeft size={24} />
            </motion.button>
            <div className="space-y-1">
              <h1 className="text-5xl font-black tracking-tighter text-[#15192c]">Mental Resonance 🧠</h1>
              <p className="text-[11px] font-black uppercase tracking-[0.4em] text-[#C4A0AC]">Nurturing Your Inner Peace</p>
            </div>
          </div>
          <div className={`px-8 py-5 backdrop-blur-md border rounded-[2.5rem] shadow-sm flex items-center gap-4 ${emotionalState.badgeColor}`}>
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner ${emotionalState.bgIcon} ${emotionalState.iconColor}`}>
              <ShieldCheck size={24} />
            </div>
            <div>
              <p className={`text-[10px] font-black uppercase tracking-widest ${emotionalState.iconColor}`}>Emotional State</p>
              <p className={`text-xl font-black ${emotionalState.textColor}`}>{emotionalState.label}</p>
            </div>
          </div>
        </motion.section>

        <main className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column */}
          <div className="lg:col-span-8 space-y-12">

            {/* Weekly Chart */}
            <motion.div variants={item}
              className="bg-white/60 backdrop-blur-2xl rounded-[3.5rem] p-12 border border-white/60 shadow-xl shadow-rose-100/20 relative overflow-hidden">
              <div className="flex items-center justify-between mb-12">
                <div>
                  <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-[#C4A0AC]">Emotional Frequency</h3>
                  <p className="text-2xl font-black text-[#15192c] mt-1">Weekly Pulse Overview</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#ff69b4]" />
                  <span className="text-[10px] font-black uppercase text-[#C4A0AC]">Joy Index</span>
                </div>
              </div>
              {/* Chart — fixed 192px (h-48) container, bars use pixel height */}
              <div className="flex items-end gap-3 md:gap-6 px-2" style={{ height: '192px' }}>
                {chartData.map((d, i) => {
                  const barH = Math.max(8, Math.round((d.value / 100) * 180));
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center justify-end gap-3 group" style={{ height: '192px' }}>
                      <div className="w-full relative" style={{ height: '160px', display: 'flex', alignItems: 'flex-end' }}>
                        <div className="w-full bg-rose-50 rounded-t-xl overflow-hidden" style={{ height: '160px', position: 'relative' }}>
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: barH }}
                            transition={{ duration: 1.2, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                            style={{ position: 'absolute', bottom: 0, left: 0, right: 0, borderRadius: '10px 10px 0 0' }}
                            className={d.hasLog ? 'bg-[#ff69b4] shadow-lg shadow-rose-200 group-hover:brightness-110 cursor-pointer transition-all' : 'bg-[#ff69b4]/60 cursor-pointer'}
                          />
                        </div>
                      </div>
                      <span className={`text-[10px] font-black transition-colors ${d.hasLog ? 'text-[#ff69b4]' : 'text-[#C4A0AC] group-hover:text-[#ff69b4]'}`}>
                        {d.day}
                      </span>
                    </div>
                  );
                })}
              </div>
              <p className="text-[10px] text-[#C4A0AC] font-bold text-center mt-6">
                {chartData.length > 0 && chartData.every(d => d.isDummy)
                  ? '✨ Start logging your mood daily to see your real emotional pattern'
                  : `${chartData.filter(d => d.hasLog).length} days logged this week`}
              </p>
            </motion.div>

            {/* Resilience Tools */}
            <motion.section variants={item} className="space-y-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#15192c] flex items-center justify-center text-white shadow-xl shadow-[#15192c]/20">
                  <Activity size={22} />
                </div>
                <h3 className="text-2xl font-black text-[#15192c] tracking-tight">Daily Resilience Tools</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {tools.map((tool, i) => (
                  <motion.div whileHover={{ y: -8 }} key={i} onClick={tool.action}
                    className="p-10 rounded-[3rem] bg-white border border-rose-50 shadow-sm hover:shadow-xl transition-all group cursor-pointer">
                    <div className={`w-16 h-16 rounded-[1.75rem] flex items-center justify-center mb-8 shadow-inner group-hover:scale-110 transition-transform ${tool.bg}`} style={{ color: tool.color }}>
                      <tool.icon size={28} />
                    </div>
                    <h4 className="text-2xl font-black text-[#15192c] mb-3 leading-tight">{tool.title}</h4>
                    <p className="text-sm font-medium text-[#9A8A8E] leading-relaxed mb-6">{tool.desc}</p>
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#ff69b4] flex items-center gap-2 group-hover:gap-3 transition-all">
                      Open Tool <ArrowRight size={14} />
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-4 space-y-10">

            {/* Self-Check Card */}
            <motion.div variants={item}
              className="p-12 rounded-[4rem] bg-[#15192c] text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute top-[-10%] right-[-10%] w-48 h-48 bg-[#ff69b4]/10 rounded-full blur-[80px] group-hover:bg-[#ff69b4]/20 transition-all duration-700" />
              <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center mb-10 text-[#ff69b4]">
                <Brain size={32} />
              </div>
              <h3 className="text-3xl font-black mb-6 tracking-tight leading-[1.1]">Your mental health is a priority.</h3>
              <p className="text-[15px] text-white/40 mb-10 leading-relaxed font-medium">
                Complete a 2-minute clinical self-check to understand your current emotional frequency.
              </p>
              <button onClick={() => setShowQuiz(true)}
                className="w-full py-5 bg-[#ff69b4] rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] text-white shadow-xl shadow-rose-900/40 hover:brightness-110 hover:scale-[1.02] active:scale-[0.98] transition-all">
                Take Self-Check
              </button>
            </motion.div>

            {/* Learning Bridge */}
            <motion.div variants={item}
              className="p-10 bg-white/80 backdrop-blur-md rounded-[3.5rem] border border-rose-50 shadow-sm space-y-8">
              <div className="flex items-center gap-3 text-[#C4A0AC]">
                <Star size={18} />
                <h3 className="text-[11px] font-black uppercase tracking-[0.3em]">Learning Bridge</h3>
              </div>
              <div className="space-y-8">
                {learningItems.map((mod, i) => (
                  <div key={i} onClick={() => navigate('/app/learning')}
                    className="flex items-center gap-5 group cursor-pointer">
                    <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center text-[#ff69b4] group-hover:bg-[#ff69b4] group-hover:text-white transition-all">
                      <mod.icon size={20} />
                    </div>
                    <div className="flex-1">
                      <span className="text-[9px] font-black uppercase text-[#ff69b4] mb-1 block tracking-widest">{mod.tag}</span>
                      <h4 className="text-sm font-black text-[#15192c] group-hover:text-[#ff69b4] transition-colors">{mod.title}</h4>
                      <span className="text-[10px] font-bold text-[#C4A0AC] mt-1 block">{mod.views}</span>
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={() => navigate('/app/learning')}
                className="w-full py-3 rounded-2xl border border-rose-100 text-[10px] font-black uppercase tracking-widest text-[#ff69b4] hover:bg-rose-50 transition-all">
                View All Courses →
              </button>
            </motion.div>

            {/* Mood Log Shortcut */}
            <motion.div variants={item} onClick={() => navigate('/app')}
              className="p-8 bg-gradient-to-br from-[#ff69b4]/10 to-purple-50 rounded-[3rem] border border-rose-100 cursor-pointer group hover:shadow-lg transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#ff69b4] flex items-center justify-center text-white group-hover:scale-110 transition-transform shadow-lg shadow-rose-200">
                  <Zap size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#ff69b4]">Daily Log</p>
                  <p className="text-sm font-black text-[#15192c]">Log Today's Mood</p>
                </div>
                <ArrowRight size={16} className="ml-auto text-[#C4A0AC] group-hover:text-[#ff69b4] group-hover:translate-x-1 transition-all" />
              </div>
            </motion.div>

          </div>
        </main>
      </motion.div>
    </div>
  );
};

export default MentalHealthScreen;
