import React, { useState, useRef, useEffect } from 'react';
import { Search, Filter, UserMinus, Mail, Edit2, X, Plus, Trash2, Send, CheckCircle, ChevronDown, DownloadCloud, Clock, Tag, UserPlus, Eye, EyeOff } from 'lucide-react';
import { APPROVED_MEMBERS_KEY, readJsonArray, writeJsonArray } from '../../data/memberOnboarding';

// ── Sample Users Data ──────────────────────────────────────────────────────────
const INITIAL_USERS = [
  { id: 1, name: 'Priya Sharma', phone: '+91 98XXX XXX29', email: 'priya@example.com', password: 'demo123', plan: 'Premium Pro', status: 'Active', progress: 65, active: '2h ago', role: 'Member' },
  { id: 2, name: 'Ananya Iyer', phone: '+91 87XXX XXX12', email: 'ananya@example.com', password: 'demo123', plan: 'Free Sakhi', status: 'Inactive', progress: 12, active: '3d ago', role: 'Member' },
  { id: 3, name: 'Megha Singh', phone: '+91 76XXX XXX45', email: 'megha@example.com', password: 'demo123', plan: 'Premium Pro', status: 'Active', progress: 88, active: 'Online', role: 'Member' },
  { id: 4, name: 'Sonal Verma', phone: '+91 91XXX XXX33', email: 'sonal@example.com', password: 'demo123', plan: 'Advisor Connect+', status: 'Active', progress: 42, active: '1h ago', role: 'Member' },
  { id: 5, name: 'Divya Nair', phone: '+91 93XXX XXX77', email: 'divya@example.com', password: 'demo123', plan: 'Premium Pro', status: 'Active', progress: 55, active: '30m ago', role: 'Member' },
];

const planStyle = (plan) => {
  const lower = (plan || '').toLowerCase();
  if (lower.includes('premium') || lower.includes('gold') || lower.includes('elite')) return 'bg-amber-100 text-amber-600 border-amber-200';
  if (lower.includes('free')) return 'bg-gray-100 text-gray-500 border-gray-200';
  return 'bg-slate-200 text-slate-600 border-slate-300';
};

const planLabel = (plan) => plan || 'Free';

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
      <button type="button" onClick={() => setIsOpen(!isOpen)} className={`w-full h-12 px-4 flex items-center justify-between bg-rose-50/20 border rounded-xl transition-all font-bold text-sm ${isOpen ? 'border-[#ff69b4] ring-2 ring-[#ff69b4]/5' : 'border-[#F5E6EA] hover:border-slate-200'}`}>
        <span className="text-slate-700">{value}</span>
        <ChevronDown size={16} className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="absolute top-[74px] left-0 w-full bg-white border border-black/5 rounded-xl shadow-xl z-[60] p-1.5 animate-in slide-in-from-top-2 duration-200">
          {options.map((opt) => (
            <button key={opt} type="button" onClick={() => { onChange(opt); setIsOpen(false); }} className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${value === opt ? 'bg-[#ff69b4] text-white' : 'text-slate-600 hover:bg-rose-50'}`}>
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ── Reusable Modal Shell (Fixed Scrollbar & Inset) ──────────────────────────────
const Modal = ({ open, onClose, title, subtitle, icon: Icon, iconBg, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
      <style>{`
          .custom-user-scrollbar::-webkit-scrollbar { width: 4px; }
          .custom-user-scrollbar::-webkit-scrollbar-track { background: transparent; }
          .custom-user-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 20px; border: 1px solid transparent; background-clip: content-box; }
      `}</style>
      <div className="bg-white rounded-t-[2.5rem] sm:rounded-[3rem] w-full sm:max-w-xl shadow-2xl border border-black/5 animate-in slide-in-from-bottom sm:zoom-in-95 duration-500 max-h-[92vh] flex flex-col overflow-hidden relative">
        <div className="p-6 sm:p-8 border-b border-black/5 flex items-center justify-between flex-shrink-0 bg-slate-50/30">
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shadow-lg ${iconBg} text-white transition-transform hover:scale-110`}>
              <Icon size={20} />
            </div>
            <div>
              <h2 className="text-lg sm:text-2xl font-black text-slate-800 tracking-tight leading-none">{title}</h2>
              {subtitle && <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5 truncate max-w-[180px] sm:max-w-none">{subtitle}</p>}
            </div>
          </div>
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center text-slate-400 hover:bg-slate-100 rounded-full transition-all active:scale-90"><X size={24} /></button>
        </div>
        <div className="p-6 sm:p-10 overflow-y-auto bg-white flex-1 custom-user-scrollbar pr-[18px]">{children}</div>
      </div>
    </div>
  );
};

// ── EDIT MODAL ─────────────────────────────────────────────────────────────────
const EditModal = ({ user, onClose, onSave }) => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', plan: 'Free Sakhi', status: 'Active', role: 'Member' });
  const [showPassword, setShowPassword] = useState(false);
  useEffect(() => { if (user) setForm({ name: user.name, email: user.email, phone: user.phone, password: user.password || '', plan: user.plan, status: user.status, role: 'Member' }); }, [user]);

  const field = (label, key, type = 'text', placeholder = '') => (
    <div className="space-y-1.5">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</label>
      {key === 'password' ? (
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            value={form[key]}
            onChange={e => setForm({ ...form, [key]: e.target.value })}
            placeholder={placeholder}
            className="w-full h-12 px-4 pr-11 bg-rose-50/20 border rounded-xl outline-none focus:border-[#ff69b4] focus:bg-white transition-all text-sm font-bold shadow-inner"
            style={{ borderColor: '#F5E6EA' }}
          />
          <button type="button" onClick={() => setShowPassword((prev) => !prev)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#ff69b4] transition-colors">
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      ) : (
        <input type={type} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} placeholder={placeholder} className="w-full h-12 px-4 bg-rose-50/20 border rounded-xl outline-none focus:border-[#ff69b4] focus:bg-white transition-all text-sm font-bold shadow-inner" style={{ borderColor: '#F5E6EA' }} />
      )}
    </div>
  );
  return (
    <Modal open={!!user} onClose={onClose} title="Edit User Account" subtitle={user?.email} icon={Edit2} iconBg="bg-[#ff69b4]">
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">{field('Full Name', 'name', 'text', 'Priya Sharma')}{field('Phone Number', 'phone', 'text', '+91 98XXX XXXXX')}</div>
        {field('Email Address', 'email', 'email', 'priya@example.com')}
        {field('Password', 'password', 'password', '********')}
        <div className="grid grid-cols-2 gap-3">
          <FormDropdown label="Plan" value={form.plan} options={['Free Sakhi', 'Premium Pro', 'Advisor Connect+']} onChange={val => setForm({ ...form, plan: val })} />
          <FormDropdown label="Status" value={form.status} options={['Active', 'Inactive']} onChange={val => setForm({ ...form, status: val })} />
        </div>
        <div className="flex justify-end gap-3 pt-6 border-t" style={{ borderColor: '#F5E6EA' }}>
          <button onClick={onClose} className="px-5 py-2.5 text-slate-500 font-bold text-xs uppercase tracking-widest hover:bg-rose-50 rounded-xl transition-colors">Cancel</button>
          <button onClick={() => { onSave(form); onClose(); }} className="px-8 py-3 text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-[#ff69b4]/20 flex items-center gap-2" style={{ background: '#ff69b4' }}>Update Profile</button>
        </div>
      </div>
    </Modal>
  );
};

// ── ADD MEMBER MODAL ───────────────────────────────────────────────────────────
const AddMemberModal = ({ open, onClose, onAdd }) => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', plan: 'Free Sakhi', status: 'Active', role: 'Member' });
  const [showPassword, setShowPassword] = useState(false);
  const field = (label, key, type = 'text', placeholder = '') => (
    <div className="space-y-1.5">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</label>
      {key === 'password' ? (
        <div className="relative">
          <input
            required
            type={showPassword ? 'text' : 'password'}
            value={form[key]}
            onChange={e => setForm({ ...form, [key]: e.target.value })}
            placeholder={placeholder}
            className="w-full h-12 px-4 pr-11 bg-rose-50/20 border rounded-xl outline-none focus:border-[#ff69b4] transition-all text-sm font-bold shadow-inner"
            style={{ borderColor: '#F5E6EA' }}
          />
          <button type="button" onClick={() => setShowPassword((prev) => !prev)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#ff69b4] transition-colors">
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      ) : (
        <input required type={type} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} placeholder={placeholder} className="w-full h-12 px-4 bg-rose-50/20 border rounded-xl outline-none focus:border-[#ff69b4] transition-all text-sm font-bold shadow-inner" style={{ borderColor: '#F5E6EA' }} />
      )}
    </div>
  );
  return (
    <Modal open={open} onClose={onClose} title="Add New Member" subtitle="Onboard a new sister" icon={UserPlus} iconBg="bg-slate-900">
      <form onSubmit={(e) => { e.preventDefault(); onAdd({ ...form, role: 'Member' }); onClose(); setForm({ name: '', email: '', phone: '', password: '', plan: 'Free Sakhi', status: 'Active', role: 'Member' }); }} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">{field('Full Name', 'name', 'text', 'Megha Iyer')}{field('Phone Number', 'phone', 'text', '+91 91XXX XXXXX')}</div>
        {field('Email Address', 'email', 'email', 'sister@healthsakhi.com')}
        {field('Password', 'password', 'password', '********')}
        <div className="grid grid-cols-2 gap-3">
          <FormDropdown label="Plan" value={form.plan} options={['Free Sakhi', 'Premium Pro', 'Advisor Connect+']} onChange={val => setForm({ ...form, plan: val })} />
          <FormDropdown label="Status" value={form.status} options={['Active', 'Inactive']} onChange={val => setForm({ ...form, status: val })} />
        </div>
        <div className="flex justify-end gap-3 pt-6 border-t" style={{ borderColor: '#F5E6EA' }}>
          <button type="button" onClick={onClose} className="px-5 py-2.5 text-[10px] font-bold text-slate-500 uppercase tracking-widest hover:bg-rose-50 rounded-xl transition-colors">Abort</button>
          <button type="submit" className="px-10 py-3 text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-[#ff69b4]/20" style={{ background: '#ff69b4' }}>Commit Member</button>
        </div>
      </form>
    </Modal>
  );
}

// ── DELETE MODAL ───────────────────────────────────────────────────────────────
const DeleteModal = ({ user, onClose, onConfirm }) => (
  <Modal open={!!user} onClose={onClose} title="Remove Member" subtitle="Irreversible Action" icon={Trash2} iconBg="bg-red-500">
    <div className="space-y-6">
      <div className="p-5 bg-red-50 border border-red-100 rounded-[2rem] space-y-2">
        <p className="text-sm font-black text-red-700">Are you absolutely sure?</p>
        <p className="text-xs text-red-500 leading-relaxed font-bold">Permanently removing <span className="underline">{user?.name}</span> will erase all subscription history and progress.</p>
      </div>
      <div className="flex justify-end gap-3 pt-4 border-t border-black/5">
        <button onClick={onClose} className="px-8 py-3 text-slate-500 font-bold text-xs uppercase tracking-widest hover:bg-slate-50 rounded-xl transition-colors">Abort</button>
        <button onClick={() => { onConfirm(user?.id); onClose(); }} className="px-10 py-3 bg-red-500 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl shadow-xl shadow-red-500/20">Yes, Confirm Deletion</button>
      </div>
    </div>
  </Modal>
);

// ── MAIL MODAL ─────────────────────────────────────────────────────────────────
const MailModal = ({ user, onClose }) => {
  const [form, setForm] = useState({ subject: '', body: '' });
  const [sent, setSent] = useState(false);
  const handleSend = (e) => { e.preventDefault(); setSent(true); setTimeout(() => { setSent(false); onClose(); }, 1800); };
  return (
    <Modal open={!!user} onClose={onClose} title="Dispatch Email" subtitle={user?.email} icon={Mail} iconBg="bg-[#15192c]">
      {sent ? (<div className="flex flex-col items-center justify-center py-10 gap-4 animate-in zoom-in-95"><div className="w-20 h-20 rounded-full bg-rose-50 flex items-center justify-center shadow-inner"><CheckCircle size={40} style={{ color: '#ff69b4' }} /></div><p className="text-xl font-black text-slate-800">Email Dispatched!</p></div>) : (
        <form onSubmit={handleSend} className="space-y-5">
          <div className="space-y-2">
            <div className="space-y-1.5"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Subject Line</label><input required value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} className="w-full h-12 px-4 bg-slate-50 border border-black/5 rounded-xl outline-none focus:border-[#15192c] text-sm font-bold shadow-inner" /></div>
            <div className="space-y-1.5"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Message Body</label><textarea required value={form.body} onChange={e => setForm({ ...form, body: e.target.value })} className="w-full h-32 p-4 bg-slate-50 border border-black/5 rounded-xl outline-none focus:border-[#15192c] text-sm font-bold resize-none shadow-inner" /></div>
          </div>
          <div className="flex justify-end gap-3 pt-6 border-t border-black/5">
            <button type="button" onClick={onClose} className="px-8 py-3 text-slate-500 font-bold text-xs uppercase tracking-widest hover:bg-slate-50 rounded-xl transition-colors">Discard</button>
            <button type="submit" className="px-10 py-3 bg-blue-500 text-white font-black text-[10px] uppercase tracking-widest rounded-xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-blue-500/20 flex items-center gap-2"><Send size={15} /> Send Now</button>
          </div>
        </form>
      )}
    </Modal>
  );
};

// ── MAIN COMPONENT ─────────────────────────────────────────────────────────────
const UserManagement = () => {
  const [users, setUsers] = useState(() => {
    const saved = readJsonArray(APPROVED_MEMBERS_KEY);
    return saved.length > 0 ? saved : INITIAL_USERS;
  });
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [deleteUser, setDeleteUser] = useState(null);
  const [mailUser, setMailUser] = useState(null);
  const [search, setSearch] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState({ status: 'All', plan: 'All' });

  useEffect(() => {
    writeJsonArray(APPROVED_MEMBERS_KEY, users);
  }, [users]);

  useEffect(() => {
    const syncMembers = () => {
      const saved = readJsonArray(APPROVED_MEMBERS_KEY);
      if (saved.length > 0) setUsers(saved);
    };
    window.addEventListener('storage', syncMembers);
    return () => window.removeEventListener('storage', syncMembers);
  }, []);

  const handleSaveEdit = (form) => setUsers(prev => prev.map(u => u.id === editUser.id ? { ...u, ...form, role: 'Member' } : u));
  const handleDelete = (id) => setUsers(prev => prev.filter(u => u.id !== id));
  const handleAdd = (form) => setUsers(prev => [{ id: Date.now(), progress: 0, active: 'Just now', role: 'Member', ...form }, ...prev]);

  const filtered = users.filter(u => {
    const q = search.toLowerCase();
    const matchSearch = !q || u.name.toLowerCase().includes(q) || u.phone.includes(q) || u.email.toLowerCase().includes(q) || u.plan.toLowerCase().includes(q);
    const matchStatus = filters.status === 'All' || u.status === filters.status;
    const matchPlan = filters.plan === 'All' || u.plan === filters.plan;
    return matchSearch && matchStatus && matchPlan;
  });

  const exportCSV = () => {
    const headers = ['ID', 'Name', 'Email', 'Phone', 'Plan', 'Status', 'Role', 'Activity'];
    const rows = filtered.map(u => [u.id, u.name, u.email, u.phone, u.plan, u.status, u.role, u.active]);
    const csvContent = [headers, ...rows].map(e => e.join(',')).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `Member_Database_${new Date().toLocaleDateString()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const ActionBtns = ({ user, mobile = false }) => (
    <div className={`flex items-center gap-1 ${mobile ? '' : 'justify-end transition-opacity duration-300'}`}>
      <button onClick={() => setEditUser(user)} className="p-1.5 text-slate-400 hover:text-[#15192c] hover:bg-indigo-50 rounded-lg transition-all"><Edit2 size={16} /></button>
      <button onClick={() => setDeleteUser(user)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"><UserMinus size={16} /></button>
      <button onClick={() => setMailUser(user)} className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all"><Mail size={16} /></button>
    </div>
  );

  return (
    <div className="space-y-8 font-sans pb-20 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#15192c] tracking-tight leading-none mb-2">Member Portal Management</h1>
          <p className="text-[#C4A0AC] font-medium tracking-tight">Active Database: <span className="text-[#ff69b4] font-black">{users.length} registered sisters.</span></p>
        </div>
        <button onClick={() => setIsAddOpen(true)} className="px-5 py-3 bg-slate-900 text-white font-black rounded-xl text-[9px] uppercase tracking-[0.2em] shadow-lg shadow-slate-900/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"><Plus size={16} /> Add New Member</button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[{ l: 'Total Sisters', v: '12,482', c: 'text-slate-800' }, { l: 'Premium Tier', v: '2,841', c: 'text-[#15192c]' }, { l: 'Online Now', v: '849', c: 'text-blue-500' }, { l: 'Trials Active', v: '1,202', c: 'text-amber-500' }].map((s, i) => (
          <div key={i} className="bg-white p-4 rounded-[1.5rem] border border-black/5 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{s.l}</p>
            <p className={`text-xl font-black tracking-tight ${s.c}`}>{s.v}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center bg-white p-2 rounded-[2.5rem] border border-black/5 shadow-inner">
        <div className="flex-1 relative w-full ml-2">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search member database..." className="w-full h-14 pl-12 pr-4 bg-transparent outline-none font-bold text-sm" />
        </div>
        <div className="flex gap-2 pr-2">
          <button onClick={() => setShowFilter(!showFilter)} className={`px-4 h-10 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all flex items-center gap-2 ${showFilter ? 'bg-[#15192c] text-white shadow-lg shadow-indigo-900/20' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}><Filter size={16} /> Filters</button>
          <button onClick={exportCSV} className="px-4 h-10 bg-slate-900 text-white rounded-xl font-black text-[9px] uppercase tracking-widest flex items-center gap-2 hover:bg-black transition-all shadow-lg active:scale-95"><DownloadCloud size={16} /> Export DB</button>
        </div>
      </div>

      {showFilter && (
        <div className="bg-white rounded-[2.5rem] border border-black/5 p-8 animate-in slide-in-from-top-4 duration-300 grid grid-cols-1 sm:grid-cols-3 gap-8 shadow-xl">
          {['status', 'plan'].map(key => (
            <div key={key} className="space-y-4">
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">{key}</p>
              <div className="flex flex-wrap gap-2">
                {(key === 'status' ? ['All', 'Active', 'Inactive'] : ['All', 'Free Sakhi', 'Premium Pro', 'Advisor Connect+']).map(o => (
                  <button key={o} onClick={() => setFilters(f => ({ ...f, [key]: o }))} className={`px-3 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${filters[key] === o ? 'bg-[#ff69b4] text-white shadow-lg' : 'bg-rose-50/50 text-[#C4A0AC] hover:bg-rose-50'}`}>{o}</button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="bg-white rounded-[2.5rem] border border-black/5 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-500">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-bold tracking-widest border-b border-black/5">
              <tr><th className="px-4 py-3">Sister Details</th><th className="px-4 py-3">Access Tier</th><th className="px-4 py-3">Engagement</th><th className="px-4 py-3">Status</th><th className="px-4 py-3 text-right">Console</th></tr>
            </thead>
            <tbody className="text-sm divide-y divide-black/5">
              {filtered.map(user => (
                <tr key={user.id} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3"><div className="flex items-center gap-3"><div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-[10px] shadow-lg">{user.name.split(' ').map(n => n[0]).join('')}</div><div><p className="font-extrabold text-slate-800 tracking-tight leading-none mb-1 text-sm">{user.name}</p><p className="text-[9px] text-slate-400 font-bold tracking-widest">{user.email}</p></div></div></td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border whitespace-nowrap ${planStyle(user.plan)}`}>
                      {planLabel(user.plan)}
                    </span>
                  </td>
                  <td className="px-4 py-3"><div className="flex items-center gap-2 w-24"><div className="h-1.5 flex-1 bg-rose-50 rounded-full overflow-hidden shadow-inner"><div className="h-full bg-[#ff69b4] rounded-full" style={{ width: `${user.progress}%` }} /></div><span className="text-[9px] font-black text-[#C4A0AC]">{user.progress}%</span></div></td>
                  <td className="px-4 py-3"><span className={`inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest ${user.status === 'Active' ? 'text-[#ff69b4]' : 'text-[#C4A0AC]'}`}><div className={`w-1.5 h-1.5 rounded-full ${user.status === 'Active' ? 'bg-[#ff69b4] animate-pulse shadow-[0_0_8px_rgba(196,96,122,0.6)]' : 'bg-[#C4A0AC]'}`}></div>{user.status}</span></td>
                  <td className="px-4 py-3"><ActionBtns user={user} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Modals ── */}
      <AddMemberModal open={isAddOpen} onClose={() => setIsAddOpen(false)} onAdd={handleAdd} />
      <EditModal user={editUser} onClose={() => setEditUser(null)} onSave={handleSaveEdit} />
      <DeleteModal user={deleteUser} onClose={() => setDeleteUser(null)} onConfirm={handleDelete} />
      <MailModal user={mailUser} onClose={() => setMailUser(null)} />
    </div>
  );
};

export default UserManagement;

