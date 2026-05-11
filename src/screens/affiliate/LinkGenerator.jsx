import React, { useState } from 'react';
import { Link as LinkIcon, Copy, TrendingUp, Users, ArrowUpRight, Plus, ExternalLink, Activity, X, CheckCircle2, MoreVertical, Trash2, Clock } from 'lucide-react';

const LinkGenerator = () => {
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [isGenerating, setIsGenerating] = useState(false);
   const [copiedId, setCopiedId] = useState(null);
   const [links, setLinks] = useState([
      { id: 1, name: 'Diwali Wellness Campaign', link: 'healthsakhi.com/join?ref=KI-9201&src=inst', clicks: 840, conv: '4.2%', earned: '₹12,400' },
      { id: 2, name: 'Instagram Bio Link', link: 'healthsakhi.com/join?ref=KI-9003&src=bio', clicks: 2150, conv: '2.8%', earned: '₹8,200' },
      { id: 3, name: 'WhatsApp Group Blast', link: 'healthsakhi.com/join?ref=KI-8120&src=wap', clicks: 128, conv: '12.5%', earned: '₹4,800' },
   ]);

   const [formData, setFormData] = useState({ name: '', source: 'Instagram', path: '' });

   const handleCopy = (text, id) => {
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
   };

   const handleGenerate = (e) => {
      e.preventDefault();
      setIsGenerating(true);

      // Simulate generation delay
      setTimeout(() => {
         const newId = Date.now();
         const newLink = {
            id: newId,
            name: formData.name || 'Untitled Campaign',
            link: `healthsakhi.com/${formData.path || 'join'}?ref= _PR7&src=${formData.source.toLowerCase().substring(0, 3)}`,
            clicks: 0,
            conv: '0%',
            earned: '₹0'
         };
         setLinks([newLink, ...links]);
         setIsGenerating(false);
         setIsModalOpen(false);
         setFormData({ name: '', source: 'Instagram', path: '' });
      }, 1200);
   };

   return (
      <div className="space-y-6 font-sans pb-16">
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
               <h1 className="text-2xl font-black text-slate-800 tracking-tight">Referral Engine</h1>
               <p className="text-slate-500 text-sm font-medium">Generate unique links to share HealthSakhi and track your impact.</p>
            </div>
            <button
               onClick={() => setIsModalOpen(true)}
               className="px-5 py-2.5 bg-health-green text-white font-black rounded-2xl text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 shadow-lg shadow-health-green/20 hover:brightness-110 hover:scale-105 transition-all"
            >
               <Plus size={14} /> New Tracking Link
            </button>
         </div>

         <div className="bg-slate-900 text-white p-6 md:p-8 rounded-[2.5rem] relative overflow-hidden shadow-2xl shadow-slate-900/20">
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
               <div className="space-y-4">
                  <div className="inline-block px-3 py-1 bg-health-green/20 text-health-green rounded-lg text-[9px] font-black uppercase tracking-widest border border-health-green/20">
                     Global Referral Link
                  </div>
                  <h2 className="text-3xl font-black tracking-tight leading-none">Your master link is <span className="text-health-green">Ready.</span></h2>
                  <div className="flex items-center gap-3 p-3 bg-white/10 rounded-2xl border border-white/10 max-w-lg group">
                     <code className="text-[13px] font-black text-health-green truncate pr-3">healthsakhi.com/join?ref= _PR7</code>
                     <button onClick={() => handleCopy('healthsakhi.com/join?ref= _PR7', 'master')} className="p-2.5 ml-auto bg-health-green text-white rounded-xl hover:bg-white hover:text-health-green transition-all shadow-lg shadow-health-green/20">
                        {copiedId === 'master' ? <CheckCircle2 size={14} /> : <Copy size={14} />}
                     </button>
                  </div>
               </div>
               <div className="hidden lg:grid w-28 h-28 bg-white/5 rounded-full place-items-center relative shadow-inner">
                  <TrendingUp size={48} className="text-health-green/50 animate-pulse relative z-10" />
                  <div className="absolute inset-0 border-2 border-dashed border-white/10 rounded-full animate-reverse-spin"></div>
               </div>
            </div>
         </div>

         <div className="space-y-5">
            <div className="flex items-center justify-between px-2">
               <h2 className="text-lg font-black text-slate-800 tracking-tight">Campaign Performance</h2>
               <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <Activity size={14} className="text-health-green" /> Live CTR Tracking
               </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
               {links.map((item, i) => (
                  <div key={i} className="bg-white p-4 md:p-5 rounded-[2rem] border border-black/5 shadow-sm hover:shadow-md hover:shadow-black/[0.02] transition-all group overflow-hidden relative">
                     <div className="flex flex-col md:flex-row items-center gap-4 relative z-10">
                        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-health-green group-hover:text-white transition-all duration-500">
                           <LinkIcon size={22} />
                        </div>
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                           <div className="md:col-span-2">
                              <h3 className="text-lg font-black text-slate-800 tracking-tight">{item.name}</h3>
                              <p className="text-[11px] font-bold text-slate-400 mt-1 flex items-center gap-1">{item.link} <ExternalLink size={10} /></p>
                           </div>
                           <div className="grid grid-cols-2 gap-3">
                              <div>
                                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Clicks</p>
                                 <p className="text-lg font-black text-slate-900 tracking-tight">{(item.clicks / 1000).toFixed(1)}k</p>
                              </div>
                              <div>
                                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Conversion</p>
                                 <div className="flex items-center gap-1 text-health-green font-black">
                                    <ArrowUpRight size={12} /> {item.conv}
                                 </div>
                              </div>
                           </div>
                           <div className="text-right">
                              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Earned</p>
                              <p className="text-xl font-black text-slate-900 tracking-tight">{item.earned}</p>
                           </div>
                        </div>
                        <button onClick={() => handleCopy(item.link, item.id)} className={`p-3 rounded-[1.5rem] transition-all duration-300 ${copiedId === item.id ? 'bg-health-green text-white shadow-lg' : 'bg-slate-900 text-white hover:bg-black active:scale-95 shadow-xl shadow-slate-900/10'}`}>
                           {copiedId === item.id ? <CheckCircle2 size={20} /> : <Copy size={20} />}
                        </button>
                     </div>
                  </div>
               ))}
            </div>
         </div>

         {/* New Tracking Link Modal */}
         {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
               <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl border border-black/5 animate-in zoom-in-95 duration-300">
                  <div className="p-6 border-b border-black/5 flex items-center justify-between">
                     <div>
                        <h2 className="text-lg font-black text-slate-800 tracking-tight">New Tracking Link</h2>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Generate custom ref campaign</p>
                     </div>
                     <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
                        <X size={20} />
                     </button>
                  </div>

                  <form className="p-6 space-y-5" onSubmit={handleGenerate}>
                     <div className="space-y-4">
                        <div className="space-y-2">
                           <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Campaign / Link Name</label>
                           <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full h-12 px-4 bg-slate-50 border border-black/5 rounded-2xl outline-none focus:bg-white focus:border-health-green text-sm font-bold shadow-inner" placeholder="e.g. YouTube Winter Launch" />
                        </div>

                        <div className="space-y-2">
                           <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Traffic Source</label>
                           <select value={formData.source} onChange={e => setFormData({ ...formData, source: e.target.value })} className="w-full h-12 px-4 bg-slate-50 border border-black/5 rounded-2xl outline-none focus:bg-white focus:border-health-green text-sm font-bold appearance-none shadow-inner cursor-pointer">
                              <option>Instagram</option>
                              <option>YouTube</option>
                              <option>WhatsApp</option>
                              <option>Facebook Ads</option>
                              <option>Twitter/X</option>
                              <option>Direct Traffic</option>
                           </select>
                        </div>

                        <div className="space-y-2">
                           <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Target Page Path</label>
                           <div className="flex group">
                              <span className="flex items-center px-3 bg-slate-100 border border-r-0 border-black/5 rounded-l-2xl text-[9px] font-black text-slate-400 uppercase tracking-widest transition-colors group-focus-within:bg-slate-200">healthsakhi.com/</span>
                              <input type="text" value={formData.path} onChange={e => setFormData({ ...formData, path: e.target.value })} className="flex-1 w-full h-12 px-3 bg-slate-50 border border-black/5 rounded-r-2xl outline-none focus:bg-white focus:border-health-green text-sm font-bold shadow-inner" placeholder="Optional: PCOS-Care" />
                           </div>
                           <p className="text-[9px] font-bold text-slate-400 mt-1 ml-1">Leave empty to target the main landing page.</p>
                        </div>
                     </div>

                     <div className="pt-5 border-t border-black/5">
                        <button type="submit" disabled={isGenerating} className="w-full py-4 bg-slate-900 text-white font-black text-[10px] uppercase tracking-[0.3em] rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-slate-900/10 flex items-center justify-center gap-2 group">
                           {isGenerating ? <><Clock size={14} className="animate-spin" /> Synching Nodes...</> : <><LinkIcon size={14} className="group-hover:rotate-45 transition-transform" /> Generate Campaign Link</>}
                        </button>
                     </div>
                  </form>
               </div>
            </div>
         )}
      </div>
   );
};

export default LinkGenerator;
