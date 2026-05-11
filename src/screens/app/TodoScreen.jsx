import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Circle, Plus, Trash2, ListTodo, Star, Clock, Calendar, Search, Heart, Activity, Wind, Zap, Edit2, X } from 'lucide-react';

const TodoScreen = () => {
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem('sakhiTasks');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error('SakhiTasks Error:', e);
    }
    return [
      { id: 1, text: 'Morning Yoga Session', category: 'Health', completed: true, priority: 'High', date: '2026-04-21', time: '07:00', desc: 'Complete 30 mins of Surya Namaskar.' },
      { id: 2, text: 'Read "The Mystery of Hunger"', category: 'Learning', completed: false, priority: 'Medium', date: '2026-04-21', time: '14:30', desc: 'Focus on chapters 4 and 5.' },
      { id: 3, text: 'Plan household budget', category: 'Finance', completed: false, priority: 'High', date: '2026-04-22', time: '10:00', desc: 'Review expenses for the last month.' },
    ];
  });

  const [newTask, setNewTask] = useState('');
  const [taskDate, setTaskDate] = useState(new Date().toISOString().split('T')[0]);
  const [taskTime, setTaskTime] = useState('10:00');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskPriority, setTaskPriority] = useState('Medium');
  const [taskCategory, setTaskCategory] = useState('General');
  const [isExpanding, setIsExpanding] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState(null);

  const categoryColors = {
    Health: { color: '#ff69b4', bg: '#FDEEF1' },
    Learning: { color: '#3B82F6', bg: '#EFF6FF' },
    Finance: { color: '#10B981', bg: '#ECFDF5' },
    Mindset: { color: '#8B5CF6', bg: '#F5F3FF' },
    General: { color: '#64748B', bg: '#F8FAFC' }
  };

  useEffect(() => {
    localStorage.setItem('sakhiTasks', JSON.stringify(tasks));
  }, [tasks]);

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const addTask = (e) => {
    e.preventDefault();
    if (!newTask.trim()) {
      alert("Sakhi, please write a task title first! ✨");
      return;
    }

    if (editingId) {
      setTasks(prev => prev.map(t => t.id === editingId ? { 
        ...t, 
        text: newTask, 
        category: taskCategory, 
        priority: taskPriority, 
        date: taskDate, 
        time: taskTime, 
        desc: taskDesc 
      } : t));
      setEditingId(null);
    } else {
      const task = {
        id: Date.now(),
        text: newTask.trim(),
        category: taskCategory,
        completed: false,
        priority: taskPriority,
        date: taskDate,
        time: taskTime,
        desc: taskDesc
      };
      setTasks(prev => [task, ...prev]);
    }

    setNewTask('');
    setTaskDesc('');
    setTaskPriority('Medium');
    setIsExpanding(false);
  };

  const startEdit = (task) => {
    setEditingId(task.id);
    setNewTask(task.text);
    setTaskDesc(task.desc);
    setTaskPriority(task.priority);
    setTaskCategory(task.category);
    setTaskDate(task.date);
    setTaskTime(task.time);
    setIsExpanding(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const filteredTasks = tasks.filter(task => 
    task.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = useMemo(() => {
    const total = tasks.length;
    const done = tasks.filter(t => t.completed).length;
    const percentage = total === 0 ? 0 : Math.round((done / total) * 100);
    return { done, remaining: total - done, percentage };
  }, [tasks]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full pb-24 px-4 pt-8"
    >
      {/* Header Row */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="space-y-1">
          <h2 className="text-4xl font-black tracking-tight" style={{ color: '#15192c' }}>To-Do Sakhi ✅</h2>
          <span className="text-[11px] font-black uppercase tracking-[0.3em]" style={{ color: '#C4A0AC' }}>Premium Productivity Manager</span>
        </div>
        <div className="flex items-center gap-3 bg-white border border-[#F5E6EA] p-3 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <Search size={16} className="text-[#C4A0AC]" />
          <input 
            type="text" 
            placeholder="Search your journey..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none outline-none text-[11px] font-bold w-40" 
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
        <div className="md:col-span-8 space-y-8">
          
          {/* ADVANCED ADD TASK FORM */}
          <motion.form
            layout
            onSubmit={addTask}
            className="bg-white border-2 border-[#F5E6EA] rounded-[2.5rem] p-4 shadow-xl overflow-hidden"
          >
            <div className="flex items-center gap-4 px-4">
                <input
                 type="text"
                 required
                 value={newTask}
                 onFocus={() => setIsExpanding(true)}
                 onChange={(e) => setNewTask(e.target.value)}
                 placeholder="Write a new task title here..."
                 className="flex-1 py-4 text-sm font-black text-[#15192c] placeholder:text-[#C4A0AC] outline-none"
               />
              {!isExpanding ? (
                 <button 
                  type="button" 
                  onClick={() => setIsExpanding(true)}
                  className="w-12 h-12 bg-[#ff69b4] text-white rounded-2xl flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all duration-300"
                 >
                    <Plus size={24} />
                 </button>
              ) : (
                <div className="w-10 h-1 relative"><div className="absolute right-0 top-0 w-2 h-2 rounded-full bg-rose-500 animate-pulse" /></div>
              )}
            </div>

            <AnimatePresence>
              {isExpanding && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-4 py-6 border-t border-[#F5E6EA] space-y-8"
                >
                  <div className="grid grid-cols-2 gap-6">
                     <div className="space-y-3">
                        <label className="text-[9px] font-black text-[#C4A0AC] uppercase tracking-[0.2em]">Priority Status</label>
                        <div className="flex gap-2">
                           {['Low', 'Medium', 'High'].map(p => (
                             <button
                               key={p}
                               type="button"
                               onClick={() => setTaskPriority(p)}
                               className={`flex-1 py-3.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                                 taskPriority === p 
                                 ? 'bg-[#15192c] text-white shadow-lg scale-105' 
                                 : 'bg-slate-50 text-[#C4A0AC] hover:bg-slate-100'
                               }`}
                             >
                               {p}
                             </button>
                           ))}
                        </div>
                     </div>
                     <div className="space-y-3">
                        <label className="text-[9px] font-black text-[#C4A0AC] uppercase tracking-[0.2em]">Target Category</label>
                        <select 
                          value={taskCategory}
                          onChange={(e) => setTaskCategory(e.target.value)}
                          className="w-full bg-slate-50 border border-transparent rounded-xl p-3 text-[10px] font-black uppercase text-[#15192c] outline-none appearance-none cursor-pointer"
                        >
                           <option>General</option>
                           <option>Health</option>
                           <option>Learning</option>
                           <option>Finance</option>
                           <option>Mindset</option>
                        </select>
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                     <div className="space-y-3">
                        <label className="text-[9px] font-black text-[#C4A0AC] uppercase tracking-[0.2em]">Task Date</label>
                        <input 
                          type="date" 
                          value={taskDate}
                          onChange={(e) => setTaskDate(e.target.value)}
                          className="w-full bg-slate-50 border border-transparent rounded-xl p-3.5 text-[11px] font-bold text-[#15192c]" 
                        />
                     </div>
                     <div className="space-y-3">
                        <label className="text-[9px] font-black text-[#C4A0AC] uppercase tracking-[0.2em]">Task Time</label>
                        <input 
                          type="time" 
                          value={taskTime}
                          onChange={(e) => setTaskTime(e.target.value)}
                          className="w-full bg-slate-50 border border-transparent rounded-xl p-3.5 text-[11px] font-bold text-[#15192c]" 
                        />
                     </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[9px] font-black text-[#C4A0AC] uppercase tracking-[0.2em]">Description Details</label>
                    <textarea 
                      placeholder="Specify your focus for this task..."
                      value={taskDesc}
                      onChange={(e) => setTaskDesc(e.target.value)}
                      className="w-full bg-slate-50 border border-transparent rounded-2xl p-4 text-xs font-medium text-[#15192c] min-h-[100px] outline-none focus:bg-white focus:border-rose-100 transition-all"
                    />
                  </div>
                  <div className="flex gap-4 pt-2">
                     <button type="submit" className="flex-2 bg-[#ff69b4] text-white px-10 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-[0_15px_40px_-5px_rgba(255,105,180,0.4)] hover:scale-105 active:scale-95 transition-all">
                       {editingId ? 'Update Journey Item' : 'Confirm Journey Item'}
                     </button>
                     <button type="button" onClick={() => { setIsExpanding(false); setEditingId(null); setNewTask(''); }} className="flex-1 py-5 border border-[#F5E6EA] rounded-2xl text-[10px] font-black uppercase text-[#C4A0AC] tracking-widest hover:bg-slate-50 transition-all">Cancel</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.form>

          {/* TASK VIEW PORT */}
          <div className="space-y-5">
            <AnimatePresence mode="popLayout">
              {filteredTasks.map((task) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  key={task.id}
                  className={`relative p-8 rounded-[3.5rem] border transition-all cursor-pointer group ${task.completed ? 'bg-rose-50/20 border-[#F5E6EA]' : 'bg-white border-[#F5E6EA] shadow-xl hover:shadow-2xl'}`}
                >
                   <div className="flex items-start gap-6">
                      <button
                        onClick={() => toggleTask(task.id)}
                        className={`mt-1 w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${task.completed ? 'bg-[#ff69b4] text-white shadow-lg' : 'bg-white border-2 border-[#F5E6EA] text-[#C4A0AC] hover:border-[#ff69b4]'}`}
                      >
                        {task.completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                      </button>

                      <div className="flex-1">
                         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                            <h4 className={`text-base font-black transition-all ${task.completed ? 'text-[#C4A0AC] line-through' : 'text-[#15192c]'}`}>{task.text}</h4>
                            <div className="flex items-center gap-3">
                               <span className="flex items-center gap-1.5 text-[9px] font-black text-rose-500 uppercase bg-rose-50 px-4 py-1.5 rounded-full"><Clock size={12} /> {task.time}</span>
                               <span className="flex items-center gap-1.5 text-[9px] font-black text-[#C4A0AC] uppercase bg-slate-50 px-4 py-1.5 rounded-full"><Calendar size={12} /> {task.date}</span>
                            </div>
                         </div>
                         {task.desc && (
                            <div className="relative mb-6">
                               <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-rose-100 rounded-full" />
                               <p className="text-xs font-medium text-[#15192c]/60 leading-relaxed pl-5 italic">"{task.desc}"</p>
                            </div>
                         )}
                         <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                               <div className="w-1.5 h-1.5 rounded-full" style={{ background: categoryColors[task.category]?.color || '#ff69b4' }} />
                               <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: categoryColors[task.category]?.color || '#15192c' }}>{task.category}</span>
                            </div>
                            <div className="flex items-center gap-2">
                               <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: task.priority === 'High' ? '#ef4444' : task.priority === 'Medium' ? '#f59e0b' : '#10b981' }}>{task.priority} Strength</span>
                            </div>
                         </div>
                      </div>

                      <div className="flex items-center gap-2 transition-all">
                        <button
                          onClick={(e) => { e.stopPropagation(); startEdit(task); }}
                          className="w-10 h-10 rounded-2xl bg-white border border-[#F5E6EA] text-[#C4A0AC] flex items-center justify-center shadow-md hover:text-[#ff69b4] hover:bg-rose-50"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); deleteTask(task.id); }}
                          className="w-10 h-10 rounded-2xl bg-white border border-[#F5E6EA] text-rose-500 flex items-center justify-center shadow-md hover:bg-rose-50"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                   </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {filteredTasks.length === 0 && (
              <div className="text-center py-20 bg-white/40 rounded-[3rem] border-2 border-dashed border-[#F5E6EA]">
                 <ListTodo size={40} className="mx-auto text-[#C4A0AC] mb-4 opacity-20" />
                 <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#C4A0AC]">Your journey list is empty</p>
              </div>
            )}
          </div>
        </div>

        {/* SIDE BAR ANALYTICS */}
        <div className="md:col-span-4 space-y-10">
          
          {/* HYPER-PREMIUM PRODUCTIVITY CARD */}
          <div className="bg-white rounded-[3.5rem] p-10 text-[#15192c] relative overflow-hidden shadow-2xl border border-[#F5E6EA]">
            {/* Background Aesthetic Orbs */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-rose-100/40 rounded-full blur-[100px] -mr-32 -mt-32" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-pink-100/30 rounded-full blur-[80px] -ml-24 -mb-24" />
            
            <header className="flex justify-between items-start mb-12 relative z-10">
               <div>
                  <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-rose-500 mb-2">Mastery Performance</h3>
                  <div className="flex items-baseline gap-2">
                     <p className="text-5xl font-black tracking-tighter">{stats.percentage}%</p>
                     <span className="text-[10px] font-black text-[#C4A0AC] uppercase tracking-widest">Efficiency</span>
                  </div>
               </div>
               <div className="w-14 h-14 bg-rose-50 border border-rose-100 rounded-[22px] flex items-center justify-center shadow-lg shadow-rose-100">
                  <Activity size={24} className="text-rose-500 animate-pulse" />
               </div>
            </header>

            {/* Premium Multi-Layer Orb Graph */}
            <div className="relative w-full aspect-square max-w-[220px] mx-auto flex items-center justify-center mb-12 group">
               <div className="absolute inset-0 rounded-full border-4 border-rose-100/50 blur-md" />
               
               <svg className="w-full h-full -rotate-90 filter drop-shadow-[0_0_15px_rgba(244,63,94,0.2)]">
                  <circle cx="50%" cy="50%" r="42%" className="fill-none stroke-slate-100 stroke-[16]" />
                  <motion.circle 
                    cx="50%" cy="50%" r="42%" 
                    className="fill-none stroke-rose-500 stroke-[16]"
                    strokeLinecap="round"
                    initial={{ strokeDashoffset: 264 }}
                    animate={{ strokeDashoffset: 264 - (stats.percentage / 100) * 264 }}
                    style={{ strokeDasharray: 264 }}
                    transition={{ 
                      duration: 2.5, 
                      ease: [0.22, 1, 0.36, 1] // Super smooth cubic bezier
                    }}
                  />
               </svg>

               <div className="absolute inset-4 rounded-full bg-white border border-rose-100 flex flex-col items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-700">
                  <span className="text-5xl font-black tabular-nums tracking-tighter">{stats.done}</span>
                  <p className="text-[8px] font-black uppercase tracking-[0.5em] text-[#C4A0AC] mt-1">Mastered</p>
               </div>
            </div>

            <footer className="grid grid-cols-2 gap-6 relative z-10">
              <div className="p-6 rounded-[2.5rem] bg-slate-50 border border-slate-100 flex flex-col items-center justify-center transition-all duration-500 hover:bg-white hover:shadow-lg">
                <p className="text-3xl font-black text-rose-500 mb-1">{stats.remaining}</p>
                <p className="text-[8px] font-black uppercase text-[#C4A0AC] tracking-[0.2em]">Pending</p>
              </div>
              <div className="p-6 rounded-[2.5rem] bg-rose-500 text-white flex flex-col items-center justify-center shadow-xl shadow-rose-200">
                <p className="text-3xl font-black text-white mb-1">{tasks.length}</p>
                <p className="text-[8px] font-black uppercase text-white/80 tracking-[0.2em]">Total</p>
              </div>
            </footer>
          </div>

          <div className="bg-white rounded-[3.5rem] p-10 border border-[#F5E6EA] shadow-xl">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] mb-10 text-[#C4A0AC]">Growth Pulse</h3>
            <div className="space-y-6">
              {[
                { label: 'Consistency', val: stats.percentage > 70 ? 'Peak' : stats.percentage > 40 ? 'Normal' : 'Low', color: stats.percentage > 70 ? '#10B981' : '#F59E0B', icon: Zap },
                { label: 'Flow State', val: stats.percentage > 50 ? 'Steady' : 'Idle', color: '#F59E0B', icon: Wind },
                { label: 'Vitality', val: stats.done > 2 ? 'Radiant' : 'Calm', color: '#EF4444', icon: Heart }
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center"><item.icon size={18} /></div>
                      <span className="text-[11px] font-black uppercase tracking-widest text-[#15192c]">{item.label}</span>
                   </div>
                   <span className="text-xs font-black" style={{ color: item.color }}>{item.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TodoScreen;
