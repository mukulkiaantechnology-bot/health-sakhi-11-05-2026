import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { ShieldCheck, Plus, Search, Edit2, Trash2, Check, Package, X, ChevronDown, Eye } from 'lucide-react';
import { defaultPlans, PLAN_STORAGE_KEY } from '../../data/planCatalog';
import { APPROVED_MEMBERS_KEY, PENDING_SIGNUPS_KEY, readJsonArray, writeJsonArray } from '../../data/memberOnboarding';

const PlanManagement = () => {
   const [plans, setPlans] = useState(() => {
      const saved = localStorage.getItem(PLAN_STORAGE_KEY);
      if (!saved) return defaultPlans;
      try {
         const parsed = JSON.parse(saved);
         return Array.isArray(parsed) && parsed.length > 0 ? parsed : defaultPlans;
      } catch (error) {
         return defaultPlans;
      }
   });
   const [isCreating, setIsCreating] = useState(false);
   const [isEditing, setIsEditing] = useState(false);
   const [isDeleting, setIsDeleting] = useState(false);
   const [isViewing, setIsViewing] = useState(false);
   const [currentPlanId, setCurrentPlanId] = useState(null);
   const [viewPlan, setViewPlan] = useState(null);
   const [activeTab, setActiveTab] = useState('Plans');
   const [openDropdown, setOpenDropdown] = useState(null);
   
   const [requests, setRequests] = useState(() => readJsonArray(PENDING_SIGNUPS_KEY));

   const handleRequestAction = (id, action) => {
      const currentRequests = readJsonArray(PENDING_SIGNUPS_KEY);
      const selectedRequest = currentRequests.find((req) => req.id === id);
      if (!selectedRequest) return;

      if (action === 'Accepted') {
         const approvedUsers = readJsonArray(APPROVED_MEMBERS_KEY);
         const exists = approvedUsers.some((user) => user.email.toLowerCase() === selectedRequest.email.toLowerCase());

         if (!exists) {
            const newUser = {
               id: Date.now(),
               name: selectedRequest.user,
               email: selectedRequest.email,
               phone: selectedRequest.phone,
               password: selectedRequest.password || 'member123',
               plan: selectedRequest.plan,
               status: 'Active',
               role: 'Member',
               progress: 0,
               active: 'Just approved'
            };
            writeJsonArray(APPROVED_MEMBERS_KEY, [newUser, ...approvedUsers]);
         }
      }

      const updatedRequests = currentRequests.filter((req) => req.id !== id);
      writeJsonArray(PENDING_SIGNUPS_KEY, updatedRequests);
      setRequests(updatedRequests);
   };

   const [formData, setFormData] = useState({
      name: '',
      price: '',
      duration: '1 Month',
      status: 'Active',
      videos: '',
      books: '',
      advisorSessions: '',
      aiSakhiChat: false
   });

   useEffect(() => {
      localStorage.setItem(PLAN_STORAGE_KEY, JSON.stringify(plans));
   }, [plans]);

   useEffect(() => {
      const syncRequests = () => setRequests(readJsonArray(PENDING_SIGNUPS_KEY));
      syncRequests();
      window.addEventListener('storage', syncRequests);
      return () => window.removeEventListener('storage', syncRequests);
   }, []);

   const openCreateModal = () => {
      setFormData({ name: '', price: '', duration: '1 Month', status: 'Active', videos: '', books: '', advisorSessions: '', aiSakhiChat: false });
      setIsCreating(true);
   };

   const openEditModal = (plan) => {
      setFormData({ name: plan.name, price: plan.price, duration: plan.duration, status: plan.status, videos: plan.videos || '', books: plan.books || '', advisorSessions: plan.advisorSessions || '', aiSakhiChat: plan.aiSakhiChat || false });
      setCurrentPlanId(plan.id);
      setIsEditing(true);
   };

   const openViewModal = (plan) => {
      setViewPlan(plan);
      setIsViewing(true);
   };

   const openDeleteModal = (plan) => {
      setCurrentPlanId(plan.id);
      setIsDeleting(true);
   };

   const handleDelete = () => {
      setPlans(plans.filter(p => p.id !== currentPlanId));
      setIsDeleting(false);
   };

   const handleSubmit = (e) => {
      e.preventDefault();
         if (isCreating) {
            const newPlan = {
               id: `PLN-${String(plans.length + 1).padStart(2, '0')}`,
               name: formData.name,
               price: formData.price,
               duration: formData.duration,
               status: formData.status,
               videos: formData.videos,
               books: formData.books,
               advisorSessions: formData.advisorSessions,
               aiSakhiChat: formData.aiSakhiChat,
               shortDescription: `${formData.name} for guided healing and structured progress.`,
               features: [
                  `${formData.videos || 'Limited'} videos access`,
                  `${formData.books || 'Limited'} books in library`,
                  `${formData.advisorSessions || '0/month'} advisor support`,
                  formData.aiSakhiChat ? 'AI Sakhi chat enabled' : 'AI Sakhi chat disabled'
               ],
               members: 0
            };
            setPlans([newPlan, ...plans]);
            setIsCreating(false);
         } else if (isEditing) {
            setPlans(plans.map(p => p.id === currentPlanId ? { ...p, ...formData } : p));
            setIsEditing(false);
         }
   };

   return (
      <div className="space-y-8 font-sans">
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
               <h1 className="text-3xl font-black text-slate-800 tracking-tight">Plan Management</h1>
               <p className="text-sm font-medium text-slate-500">Create pricing tiers and approve subscription requests.</p>
            </div>
            {activeTab === 'Plans' && (
               <button onClick={openCreateModal} className="px-6 py-3 bg-[#ff69b4] text-white font-black rounded-xl text-xs uppercase tracking-widest shadow-lg shadow-[#ff69b4]/20 hover:brightness-110 flex items-center gap-2 transition-all">
                  <Plus size={16} /> Create New Plan
               </button>
            )}
         </div>

         {/* Tabs */}
         <div className="flex gap-2 p-1 bg-slate-50 border border-black/5 rounded-2xl w-fit">
            <button onClick={() => setActiveTab('Plans')} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'Plans' ? 'bg-white text-slate-800 shadow-sm border border-black/5' : 'text-slate-400 hover:text-slate-600'}`}>
               Subscription Plans
            </button>
            <button onClick={() => setActiveTab('Requests')} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'Requests' ? 'bg-white text-slate-800 shadow-sm border border-black/5' : 'text-slate-400 hover:text-slate-600'}`}>
               Plan Requests
               {requests.filter(r => r.status === 'Pending').length > 0 && (
                  <span className="w-4 h-4 rounded-full bg-rose-500 text-white flex items-center justify-center text-[8px] animate-pulse">
                     {requests.filter(r => r.status === 'Pending').length}
                  </span>
               )}
            </button>
         </div>

         {/* Plan Creation / Edit Modal */}
         {(isCreating || isEditing) && createPortal(
            <div className="fixed inset-0 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 2147483647 }}>
               <div className="bg-white rounded-[2.5rem] w-full max-w-2xl shadow-2xl border border-black/5 animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col overflow-hidden">
                  <div className="p-8 border-b border-black/5 flex items-center justify-between flex-shrink-0 bg-white z-10">
                     <h2 className="text-xl font-black text-slate-800 tracking-tight">{isCreating ? 'Define New Plan' : 'Edit Plan'}</h2>
                     <button type="button" onClick={() => { setIsCreating(false); setIsEditing(false); }} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
                        <X size={20} />
                     </button>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto pr-[14px]">
                     <form onSubmit={handleSubmit} className="p-8 space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                           <div className="space-y-2 col-span-2 sm:col-span-1">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Plan Name</label>
                              <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Wellness Plus" className="w-full h-12 px-4 bg-slate-50 border border-black/5 rounded-xl outline-none focus:border-[#ff69b4] text-sm font-bold shadow-inner" />
                           </div>
                           <div className="space-y-2 col-span-2 sm:col-span-1">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Price (₹)</label>
                              <input required type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} placeholder="e.g. 999" className="w-full h-12 px-4 bg-slate-50 border border-black/5 rounded-xl outline-none focus:border-[#ff69b4] text-sm font-bold shadow-inner" />
                           </div>
                           <div className="space-y-2 col-span-2 sm:col-span-1 border-none">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Duration</label>
                              <div className="relative">
                                 <div 
                                    className={`w-full h-12 px-4 bg-slate-50 border rounded-xl flex items-center justify-between cursor-pointer transition-colors ${openDropdown === 'duration' ? 'border-[#ff69b4] shadow-sm' : 'border-black/5 shadow-inner'}`}
                                    onClick={() => setOpenDropdown(openDropdown === 'duration' ? null : 'duration')}
                                 >
                                    <span className="text-sm font-bold text-slate-700">{formData.duration}</span>
                                    <ChevronDown size={14} strokeWidth={3} className={`text-slate-400 transition-transform duration-300 ${openDropdown === 'duration' ? 'rotate-180 text-[#ff69b4]' : ''}`} />
                                 </div>
                                 {openDropdown === 'duration' && (
                                    <>
                                       <div className="fixed inset-0 z-40" onClick={() => setOpenDropdown(null)} />
                                       <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-white border border-slate-100 rounded-xl shadow-xl overflow-hidden z-50 py-2 opacity-100 transform translate-y-0 transition-all">
                                          {['1 Month', '3 Months', '6 Months', '12 Months', 'Lifetime'].map(opt => (
                                             <div 
                                                key={opt}
                                                className={`px-4 py-2.5 text-sm font-bold cursor-pointer transition-colors ${formData.duration === opt ? 'bg-[#ff69b4]/10 text-[#ff69b4]' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                                                onClick={() => { setFormData({...formData, duration: opt}); setOpenDropdown(null); }}
                                             >
                                                {opt}
                                             </div>
                                          ))}
                                       </div>
                                    </>
                                 )}
                              </div>
                           </div>
                           <div className="space-y-2 col-span-2 sm:col-span-1 border-none">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</label>
                              <div className="relative">
                                 <div 
                                    className={`w-full h-12 px-4 bg-slate-50 border rounded-xl flex items-center justify-between cursor-pointer transition-colors ${openDropdown === 'status' ? 'border-[#ff69b4] shadow-sm' : 'border-black/5 shadow-inner'}`}
                                    onClick={() => setOpenDropdown(openDropdown === 'status' ? null : 'status')}
                                 >
                                    <span className="text-sm font-bold text-slate-700">{formData.status}</span>
                                    <ChevronDown size={14} strokeWidth={3} className={`text-slate-400 transition-transform duration-300 ${openDropdown === 'status' ? 'rotate-180 text-[#ff69b4]' : ''}`} />
                                 </div>
                                 {openDropdown === 'status' && (
                                    <>
                                       <div className="fixed inset-0 z-40" onClick={() => setOpenDropdown(null)} />
                                       <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-white border border-slate-100 rounded-xl shadow-xl overflow-hidden z-50 py-2 opacity-100 transform translate-y-0 transition-all">
                                          {['Active', 'Inactive'].map(opt => (
                                             <div 
                                                key={opt}
                                                className={`px-4 py-2.5 text-sm font-bold cursor-pointer transition-colors ${formData.status === opt ? 'bg-[#ff69b4]/10 text-[#ff69b4]' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                                                onClick={() => { setFormData({...formData, status: opt}); setOpenDropdown(null); }}
                                             >
                                                {opt}
                                             </div>
                                          ))}
                                       </div>
                                    </>
                                 )}
                              </div>
                           </div>

                           {/* Features Section */}
                           <div className="col-span-2 pt-4 border-t border-black/5">
                              <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-4 flex items-center gap-2"><Package size={14} className="text-[#ff69b4]" /> Plan Features</h3>
                              <div className="grid grid-cols-2 gap-6">
                                 <div className="space-y-2 col-span-2 sm:col-span-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Videos Access</label>
                                    <input required type="text" value={formData.videos} onChange={e => setFormData({...formData, videos: e.target.value})} placeholder="e.g. 10 or Unlimited" className="w-full h-12 px-4 bg-slate-50 border border-black/5 rounded-xl outline-none focus:border-[#ff69b4] text-sm font-bold shadow-inner" />
                                 </div>
                                 <div className="space-y-2 col-span-2 sm:col-span-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Books / Library</label>
                                    <input required type="text" value={formData.books} onChange={e => setFormData({...formData, books: e.target.value})} placeholder="e.g. 1 free or Unlimited" className="w-full h-12 px-4 bg-slate-50 border border-black/5 rounded-xl outline-none focus:border-[#ff69b4] text-sm font-bold shadow-inner" />
                                 </div>
                                 <div className="space-y-2 col-span-2 sm:col-span-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Advisor Sessions</label>
                                    <input required type="text" value={formData.advisorSessions} onChange={e => setFormData({...formData, advisorSessions: e.target.value})} placeholder="e.g. 1/month" className="w-full h-12 px-4 bg-slate-50 border border-black/5 rounded-xl outline-none focus:border-[#ff69b4] text-sm font-bold shadow-inner" />
                                 </div>
                                 <div className="space-y-2 col-span-2 sm:col-span-1 flex flex-col justify-end">
                                    <div className="flex items-center justify-between h-12 px-4 bg-slate-50 border border-black/5 rounded-xl cursor-pointer" onClick={() => setFormData({...formData, aiSakhiChat: !formData.aiSakhiChat})}>
                                       <label className="text-[10px] font-black text-slate-800 uppercase tracking-widest cursor-pointer select-none">AI Sakhi Chat</label>
                                       <div 
                                          style={{ width: '48px', height: '24px' }}
                                          className={`rounded-full relative flex-shrink-0 shadow-inner transition-colors duration-300 ${formData.aiSakhiChat ? 'bg-[#ff69b4]' : 'bg-slate-300'}`}
                                       >
                                          <div 
                                             style={{ width: '20px', height: '20px', top: '2px', left: formData.aiSakhiChat ? '26px' : '2px' }}
                                             className="rounded-full bg-white shadow-md absolute transition-all duration-300" 
                                          />
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </div>
                        
                        <div className="pt-6 border-t border-black/5 flex justify-end gap-3 mt-4">
                           <button type="button" onClick={() => { setIsCreating(false); setIsEditing(false); }} className="px-6 py-2 text-slate-400 font-black text-[9px] uppercase tracking-widest hover:bg-slate-50 rounded-xl transition-all">
                              Cancel
                           </button>
                           <button type="submit" className="px-8 py-2 bg-[#ff69b4] text-white font-black text-[9px] uppercase tracking-[0.2em] rounded-xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-[#ff69b4]/20">
                              Save Plan
                           </button>
                        </div>
                     </form>
                  </div>
               </div>
            </div>
         , document.body)}

         {/* Delete Confirmation Modal */}
         {isDeleting && createPortal(
            <div className="fixed inset-0 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 2147483647 }}>
               <div className="bg-white rounded-[2.5rem] w-full max-w-sm shadow-2xl border border-black/5 animate-in zoom-in-95 duration-300 overflow-hidden text-center">
                  <div className="p-8 pb-6">
                     <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Trash2 size={24} />
                     </div>
                     <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-2">Delete Plan?</h3>
                     <p className="text-slate-500 text-sm font-medium mb-2">This action cannot be undone. Are you sure you want to permanently remove this plan?</p>
                  </div>
                  <div className="p-6 bg-slate-50/50 border-t border-black/5 flex flex-col gap-3">
                     <button onClick={handleDelete} className="w-full py-3.5 bg-rose-500 text-white font-black rounded-xl text-[10px] uppercase tracking-widest shadow-lg shadow-rose-500/20 hover:brightness-110 transition-all">
                        Yes, Delete Plan
                     </button>
                     <button type="button" onClick={() => setIsDeleting(false)} className="w-full py-3.5 bg-white border border-black/5 text-slate-600 font-extrabold rounded-xl text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all">
                        Cancel
                     </button>
                  </div>
               </div>
            </div>
         , document.body)}

         {/* Render Active Tab Content */}
         {activeTab === 'Plans' && (
            <div className="bg-white rounded-[2rem] border border-black/5 shadow-sm overflow-hidden animate-in fade-in zoom-in-95 duration-300">
               <div className="p-6 border-b border-black/5 flex items-center justify-between bg-slate-50/50">
                  <div className="relative">
                     <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                     <input type="text" placeholder="Search plans..." className="h-10 pl-11 pr-4 bg-white border border-black/5 rounded-xl text-xs font-bold text-slate-700 outline-none focus:border-[#ff69b4] w-64" />
                  </div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total: {plans.length} Plans</span>
               </div>

               <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                     <thead className="bg-[#fcfcfc] border-b border-black/5">
                        <tr>
                           <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Plan ID</th>
                           <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Name</th>
                           <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Price</th>
                           <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Duration</th>
                           <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                           <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Members</th>
                           <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-black/5">
                        {plans.map((plan, i) => (
                           <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                              <td className="px-6 py-4 font-black font-mono text-xs text-slate-500">{plan.id}</td>
                              <td className="px-6 py-4 font-extrabold text-slate-800">{plan.name}</td>
                              <td className="px-6 py-4 font-black text-[#ff69b4]">₹{plan.price}</td>
                              <td className="px-6 py-4 font-bold text-slate-600 text-xs">{plan.duration}</td>
                              <td className="px-6 py-4">
                                 <span className={`inline-flex px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${plan.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'
                                    }`}>
                                    {plan.status}
                                 </span>
                              </td>
                              <td className="px-6 py-4 font-bold text-slate-600">{plan.members.toLocaleString()}</td>
                              <td className="px-6 py-4">
                                 <div className="flex items-center justify-end gap-2 transition-all duration-300">
                                    <button onClick={() => openViewModal(plan)} className="w-8 h-8 flex items-center justify-center bg-white text-slate-400 hover:text-sky-500 hover:bg-sky-50 rounded-lg transition-all shadow-sm border border-black/5" title="View Plan"><Eye size={14} strokeWidth={2.5} /></button>
                                    <button onClick={() => openEditModal(plan)} className="w-8 h-8 flex items-center justify-center bg-white text-slate-400 hover:text-[#ff69b4] hover:bg-[#ff69b4]/10 rounded-lg transition-all shadow-sm border border-black/5" title="Edit Plan"><Edit2 size={14} /></button>
                                    <button onClick={() => openDeleteModal(plan)} className="w-8 h-8 flex items-center justify-center bg-white text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all shadow-sm border border-black/5" title="Delete Plan"><Trash2 size={14} /></button>
                                 </div>
                              </td>
                           </tr>
                        ))}
                        {plans.length === 0 && (
                           <tr>
                              <td colSpan={7} className="px-6 py-12 text-center text-xs font-bold text-slate-400">
                                 No plans found.
                              </td>
                           </tr>
                        )}
                     </tbody>
                  </table>
               </div>
            </div>
         )}

         {activeTab === 'Requests' && (
            <div className="bg-white rounded-[2rem] border border-black/5 shadow-sm overflow-hidden animate-in fade-in zoom-in-95 duration-300">
               <div className="p-6 border-b border-black/5 flex items-center justify-between bg-slate-50/50">
                  <h2 className="text-sm font-black text-slate-800 tracking-tight">Pending Member Signup Requests</h2>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total: {requests.length} Requests</span>
               </div>
               <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                     <thead className="bg-[#fcfcfc] border-b border-black/5">
                        <tr>
                           <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Request ID</th>
                           <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">User</th>
                           <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Plan requested</th>
                           <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                           <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                           <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-black/5">
                        {requests.map((req, i) => (
                           <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                              <td className="px-6 py-4 font-black font-mono text-xs text-slate-500">{req.id}</td>
                              <td className="px-6 py-4">
                                 <div className="font-extrabold text-slate-800">{req.user}</div>
                                 <div className="text-[10px] font-bold text-slate-400 mt-0.5">{req.email}</div>
                                 <div className="text-[10px] font-bold text-slate-400">{req.phone}</div>
                              </td>
                              <td className="px-6 py-4 font-black text-[#ff69b4]">{req.plan}</td>
                              <td className="px-6 py-4 font-bold text-slate-600 text-xs">{req.date}</td>
                              <td className="px-6 py-4">
                                 <span className={`inline-flex px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                                    req.status === 'Accepted' ? 'bg-emerald-50 text-emerald-600' : 
                                    req.status === 'Rejected' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'
                                 }`}>
                                    {req.status}
                                 </span>
                              </td>
                              <td className="px-6 py-4 border-l border-transparent">
                                 <div className="flex items-center justify-end gap-2 transition-all duration-300">
                                    {req.status === 'Pending' ? (
                                       <>
                                          <button onClick={() => handleRequestAction(req.id, 'Accepted')} className="px-4 py-2 flex items-center gap-1.5 bg-white text-emerald-500 hover:bg-emerald-50 hover:text-emerald-600 border border-black/5 hover:border-emerald-200 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all shadow-sm">
                                             <Check size={12} /> Accept
                                          </button>
                                          <button onClick={() => handleRequestAction(req.id, 'Rejected')} className="px-4 py-2 flex items-center gap-1.5 bg-white text-rose-500 hover:bg-rose-50 hover:text-rose-600 border border-black/5 hover:border-rose-200 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all shadow-sm">
                                             <X size={12} /> Reject
                                          </button>
                                       </>
                                    ) : (
                                       <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Resolved</span>
                                    )}
                                 </div>
                              </td>
                           </tr>
                        ))}
                        {requests.length === 0 && (
                           <tr>
                              <td colSpan={6} className="px-6 py-12 text-center text-xs font-bold text-slate-400">
                                 No requests found.
                              </td>
                           </tr>
                        )}
                     </tbody>
                  </table>
               </div>
            </div>
         )}

         {/* Read-Only View Modal */}
         {isViewing && viewPlan && createPortal(
            <div className="fixed inset-0 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm z-[2147483647]">
               <div className="w-full max-w-xl bg-white rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
                  
                  {/* Header */}
                  <div className="flex items-center justify-between p-6 sm:p-8 bg-slate-50 border-b border-black/5">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-sky-100 text-sky-500 rounded-full flex items-center justify-center shadow-inner">
                           <Eye size={24} strokeWidth={2.5} />
                        </div>
                        <div>
                           <h2 className="text-xl font-black text-slate-800 tracking-tight">Plan Details</h2>
                           <p className="text-xs font-bold text-slate-400 mt-1">Information card for {viewPlan.name}</p>
                        </div>
                     </div>
                     <button onClick={() => setIsViewing(false)} className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                        <X size={20} strokeWidth={2.5} />
                     </button>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
                     <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-50 p-4 rounded-xl border border-black/5">
                           <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Plan Name</div>
                           <div className="text-sm font-bold text-slate-800">{viewPlan.name || '-'}</div>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-xl border border-black/5">
                           <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Price (₹)</div>
                           <div className="text-sm font-black text-[#ff69b4]">₹{viewPlan.price || '0'}</div>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-xl border border-black/5">
                           <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Duration</div>
                           <div className="text-sm font-bold text-slate-800">{viewPlan.duration || '-'}</div>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-xl border border-black/5">
                           <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</div>
                           <div className={`text-sm font-bold ${viewPlan.status === 'Active' ? 'text-emerald-500' : 'text-slate-500'}`}>{viewPlan.status || '-'}</div>
                        </div>
                     </div>

                     <div className="pt-4 border-t border-black/5 mt-4">
                        <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-4 flex items-center gap-2"><Package size={14} className="text-sky-500" /> Included Features</h3>
                        <div className="grid grid-cols-2 gap-4">
                           <div className="bg-slate-50 p-4 rounded-xl border border-black/5">
                              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Videos Access</div>
                              <div className="text-sm font-bold text-slate-800">{viewPlan.videos || 'Not Specified'}</div>
                           </div>
                           <div className="bg-slate-50 p-4 rounded-xl border border-black/5">
                              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Books / Library</div>
                              <div className="text-sm font-bold text-slate-800">{viewPlan.books || 'Not Specified'}</div>
                           </div>
                           <div className="bg-slate-50 p-4 rounded-xl border border-black/5">
                              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Advisor Sessions</div>
                              <div className="text-sm font-bold text-slate-800">{viewPlan.advisorSessions || 'Not Specified'}</div>
                           </div>
                           <div className="bg-slate-50 p-4 rounded-xl border border-black/5 flex flex-col justify-center">
                              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">AI Sakhi Chat</div>
                              <div className="flex items-center gap-2">
                                 {viewPlan.aiSakhiChat ? (
                                    <span className="px-2 py-1 bg-emerald-100 text-emerald-600 rounded-md text-[9px] font-black uppercase tracking-widest flex items-center gap-1"><Check size={10} /> Enabled</span>
                                 ) : (
                                    <span className="px-2 py-1 bg-slate-200 text-slate-500 rounded-md text-[9px] font-black uppercase tracking-widest flex items-center gap-1"><X size={10} /> Disabled</span>
                                 )}
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         , document.body)}
      </div>
   );
};

export default PlanManagement;
