import React, { useState, useRef, useEffect } from 'react';
import { CreditCard, DollarSign, Download, ExternalLink, Calendar, Search, Shield, Clock, Filter, X, ChevronDown, CheckCircle, ArrowUpRight, TrendingUp, Info, Eye, FileText, Share2, Mail, Send } from 'lucide-react';

// NOTE: PDF generation requires jspdf and jspdf-autotable. 
// If not installed, the app will prompt to run 'npm install jspdf jspdf-autotable'.

// ── Sample Payment Data ──────────────────────────────────────────────────────
const INITIAL_PAYMENTS = [
  { id: 'TXN-82937401', user: 'Ananya Iyer', plan: 'Pro (Annual)', amount: '₹8,999.00', status: 'Success', date: '5 mins ago', method: 'Razorpay', gst: '₹1,372.00', email: 'ananya@live.com' },
  { id: 'TXN-82937402', user: 'Ritu Verma', plan: 'Premium (Monthly)', amount: '₹999.00', status: 'Success', date: '2 hours ago', method: 'UPI', gst: '₹152.00', email: 'ritu@verma.com' },
  { id: 'TXN-82937403', user: 'Sneha Patel', plan: 'Trial Upgrade', amount: '₹4,500.00', status: 'Pending', date: 'Yesterday', method: 'Card', gst: '₹686.00', email: 'sneha.p@gmail.com' },
  { id: 'TXN-82937404', user: 'Kavita Singh', plan: 'Pro (Annual)', amount: '₹8,999.00', status: 'Failed', date: '2 days ago', method: 'Razorpay', gst: '₹0.00', email: 'kavita@health.com' },
];

// ── Table Filter Dropdown ─────────────────────────────────────────────────────
const StyledDropdown = ({ label, value, options, onChange, icon: Icon }) => {
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
      <div className="relative flex-1 w-full" ref={dropdownRef}>
        <button onClick={() => setIsOpen(!isOpen)} className={`h-10 px-4 rounded-2xl border transition-all flex items-center gap-3 font-black text-[9px] uppercase tracking-widest w-full justify-between ${isOpen ? 'bg-white border-#15192c ring-4 ring-#15192c/5' : 'bg-white border-black/5 hover:border-slate-200'}`}>
          <div className="flex items-center gap-3 overflow-hidden">
              <div className={`p-1 rounded-lg flex-shrink-0 ${isOpen ? 'bg-#15192c text-white' : 'bg-slate-50 text-slate-400'}`}><Icon size={14} /></div>
              <span className={`truncate ${isOpen ? 'text-#15192c' : 'text-slate-500'}`}>{value}</span>
          </div>
          <ChevronDown size={14} className={`flex-shrink-0 transition-transform duration-300 text-slate-300 ${isOpen ? 'rotate-180 text-#15192c' : ''}`} />
        </button>
        {isOpen && (
          <div className="absolute top-14 left-0 w-full bg-white rounded-2xl shadow-2xl border border-black/5 p-2 z-[60] animate-in zoom-in-95 duration-200">
             <p className="px-4 py-2 text-[8px] font-black text-slate-300 uppercase tracking-widest">{label}</p>
             {options.map(opt => (
                 <button key={opt} onClick={() => { onChange(opt); setIsOpen(false); }} className={`w-full text-left px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${value === opt ? 'bg-#15192c/10 text-#15192c' : 'text-slate-500 hover:bg-slate-50'}`}>{opt}</button>
             ))}
          </div>
        )}
      </div>
    );
  };

// ── Reusable Modal Shell (Fixed Scrollbar & Inset) ──────────────────────────────
const CMSModal = ({ open, onClose, title, icon: Icon, iconBg, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
      <style>{`
          .custom-pay-scrollbar::-webkit-scrollbar { width: 4px; }
          .custom-pay-scrollbar::-webkit-scrollbar-track { background: transparent; }
          .custom-pay-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 20px; border: 2px solid transparent; background-clip: content-box; }
      `}</style>
      <div className="bg-white rounded-t-[2.5rem] sm:rounded-[2.5rem] w-full sm:max-w-xl shadow-2xl border border-black/5 animate-in slide-in-from-bottom sm:zoom-in-95 duration-500 max-h-[92vh] flex flex-col overflow-hidden relative">
        <div className="p-6 sm:p-8 border-b border-black/5 flex items-center justify-between flex-shrink-0 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shadow-lg ${iconBg} text-white`}>
              <Icon size={20} />
            </div>
            <h2 className="text-lg sm:text-2xl font-black text-slate-800 tracking-tight leading-none">{title}</h2>
          </div>
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center text-slate-400 hover:bg-slate-100 rounded-full transition-all active:scale-90"><X size={24} /></button>
        </div>
        <div className="p-6 sm:p-10 overflow-y-auto bg-white flex-1 custom-pay-scrollbar pr-[18px]">{children}</div>
      </div>
    </div>
  );
};

const PaymentManagement = () => {
  const [payments, setPayments] = useState(INITIAL_PAYMENTS);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All Status');
  const [viewPay, setViewPay] = useState(null);

  const [isGenerating, setIsGenerating] = useState(false);
  const [isAuditing, setIsAuditing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(null);
  const [isViewingInvoice, setIsViewingInvoice] = useState(false);

  const handleGenerateReports = () => {
      setIsGenerating(true);
      setTimeout(() => {
          setIsGenerating(false);
          const headers = ['Txn ID', 'Customer', 'Email', 'Plan', 'Amount', 'GST', 'Method', 'Date', 'Status'];
          const rows = payments.map(p => [p.id, p.user, p.email, p.plan, p.amount, p.gst, p.method, p.date, p.status]);
          const csvContent = [headers, ...rows].map(e => e.join(',')).join("\n");
          const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.download = `Financial_Report_${new Date().toLocaleDateString()}.csv`;
          link.click();
      }, 2000);
  };

  const handleAuditPayouts = () => {
      setIsAuditing(true);
      setTimeout(() => {
          setIsAuditing(false);
          alert('Payout audit completed securely. All ledgers are synchronized.');
      }, 1500);
  };

  const handleDownloadInvoice = async (txn) => {
      setIsDownloading(txn.id);
      try {
          // Dynamic import to prevent crash if library is missing
          // Dynamic import to prevent crash if library is missing
          const { default: jsPDF } = await import('jspdf');
          const { default: autoTable } = await import('jspdf-autotable');

          setTimeout(() => {
              setIsDownloading(null);
              const doc = new jsPDF();
              
              // Header & Branding
              doc.setFillColor(255, 105, 180); // #ff69b4 brand color
              doc.rect(0, 0, 210, 40, 'F');
              doc.setTextColor(255, 255, 255);
              doc.setFontSize(22);
              doc.setFont("helvetica", "bold");
              doc.text("HEALTH SAKHI DIGITAL INVOICE", 20, 25);
              
              doc.setFontSize(10);
              doc.text(`DATE: ${new Date().toLocaleDateString()}`, 160, 25);
              
              doc.setTextColor(45, 21, 32); // #15192c
              doc.setFontSize(14);
              doc.text("Transaction Details", 20, 55);
              
              autoTable(doc, {
                  startY: 65,
                  head: [['Field', 'Information']],
                  body: [
                      ['Transaction ID', txn.id],
                      ['Customer Name', txn.user],
                      ['Contact Email', txn.email],
                      ['Subscription Tier', txn.plan],
                      ['Payment Method', txn.method],
                      ['Settle Date', txn.date],
                      ['Processing Status', txn.status]
                  ],
                  headStyles: { fillColor: [45, 21, 32] }, // #15192c header
                  theme: 'grid'
              });
              
              const finalY = doc.lastAutoTable.finalY + 10;
              doc.setFontSize(14);
              doc.text("Financial Breakdown", 20, finalY);
              
              autoTable(doc, {
                  startY: finalY + 5,
                  body: [
                      ['Base Membership Fee', txn.amount],
                      ['GST (Applicable 18%)', txn.gst],
                      ['Total Amount Settled', txn.amount]
                  ],
                  columnStyles: { 0: { cellWidth: 100 }, 1: { halign: 'right', fontStyle: 'bold' } },
                  theme: 'plain'
              });
              
              doc.setFontSize(10);
              doc.setTextColor(150, 150, 150);
              doc.text("This is an electronically generated document. No signature required.", 20, 280);
              doc.text("Health Sakhi Portal - Wellness for every Sister.", 140, 280);
              
              doc.save(`HealthSakhi_Invoice_${txn.id}.pdf`);
          }, 1000);
      } catch (err) {
          setIsDownloading(null);
          console.error("PDF Lib missing:", err);
          alert("Dependencies missing! Please run this in your terminal:\nnpm install jspdf jspdf-autotable");
      }
  };

  const handleViewInvoice = () => {
      setIsViewingInvoice(true);
      setTimeout(() => {
          setIsViewingInvoice(false);
          handleDownloadInvoice(viewPay);
      }, 1500);
  };

  const filtered = payments.filter(p => {
      const matchesSearch = p.user.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = filterStatus === 'All Status' || p.status === filterStatus;
      return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-10 font-sans pb-20 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <h1 className="text-2xl font-black text-slate-800 tracking-tight leading-none mb-2">Financial Console</h1>
           <p className="text-sm text-slate-500 font-medium">Tracking subscriptions, payouts, and <span className="text-#15192c font-black">GST compliance.</span></p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
           <button onClick={handleGenerateReports} disabled={isGenerating} className="px-5 py-3 bg-white border border-black/5 text-slate-900 font-black rounded-2xl text-[9px] uppercase tracking-widest flex items-center gap-2 hover:bg-slate-50 transition-all shadow-sm">
             {isGenerating ? <><Clock size={14} className="text-blue-500 animate-spin"/> Generating...</> : <><Calendar size={14} className="text-blue-500"/> Generate Reports</>}
           </button>
           <button onClick={handleAuditPayouts} disabled={isAuditing} className="px-5 py-3 bg-slate-900 text-white font-black rounded-2xl text-[9px] uppercase tracking-[0.2em] flex items-center gap-2 shadow-2xl shadow-slate-900/20 hover:scale-105 active:scale-95 transition-all">
             {isAuditing ? 'Auditing Ledger...' : 'Audit Payouts'}
           </button>
        </div>
      </div>

      {/* Stats Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Net Core Revenue', val: '₹4,82,400', icon: DollarSign, color: 'text-#15192c', bg: 'bg-emerald-50/50' },
          { label: 'GST Accrued (18%)', val: '₹86,832', icon: Shield, color: 'text-blue-500', bg: 'bg-blue-50/50' },
          { label: 'Pending Payouts', val: '₹12,400', icon: Clock, color: 'text-orange-500', bg: 'bg-orange-50/50' },
        ].map((stat, i) => (
          <div key={i} className={`p-5 rounded-[2rem] border border-black/5 shadow-sm relative overflow-hidden group hover:shadow-md transition-all ${stat.bg}`}>
            <div className="relative z-10">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                <div className="flex items-end gap-2">
                    <p className="text-2xl font-black text-slate-900 tracking-tight">{stat.val}</p>
                    <div className="flex items-center text-[9px] font-black text-#15192c uppercase tracking-widest mb-1.5"><TrendingUp size={12} className="mr-1"/> 12%</div>
                </div>
            </div>
            <stat.icon className={`absolute -bottom-5 -right-5 size-28 ${stat.color} opacity-[0.08] -rotate-12 group-hover:rotate-0 transition-transform duration-700`} />
          </div>
        ))}
      </div>

      {/* Transactions Control */}
      <div className="bg-white rounded-[3rem] border border-black/5 shadow-sm overflow-hidden animate-in slide-in-from-bottom-6 duration-500">
        <div className="p-6 border-b border-black/5 flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-slate-50/20">
           <div className="flex-1 relative w-full lg:max-w-sm lg:ml-2">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input type="text" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Find Txn ID or Customer..." className="w-full h-12 pl-12 pr-6 bg-white border border-black/5 rounded-2xl outline-none focus:border-#15192c transition-all text-xs font-bold shadow-sm" />
           </div>
           <div className="flex flex-col sm:flex-row w-full lg:w-auto gap-2 lg:pr-2">
              <StyledDropdown label="By Status" value={filterStatus} options={['All Status', 'Success', 'Pending', 'Failed']} onChange={setFilterStatus} icon={Filter} />
           </div>
        </div>
        <div className="overflow-x-auto text-[10px]">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-400 text-[9px] uppercase font-black tracking-widest border-b border-black/5">
               <tr>
                 <th className="px-4 py-4">Transaction Core</th>
                 <th className="px-4 py-4">Customer Profile</th>
                 <th className="px-4 py-4">Subscription Tier</th>
                 <th className="px-4 py-4">Net Amount</th>
                 <th className="px-4 py-4">Status</th>
                 <th className="px-4 py-4 text-right">Console</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-black/5 text-sm">
               {filtered.map(p => (
                 <tr key={p.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-4 py-4">
                       <p className="font-mono font-black text-slate-800 tracking-tight leading-none mb-1">{p.id}</p>
                       <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2">{p.method} • {p.date}</p>
                    </td>
                    <td className="px-4 py-4">
                       <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center font-black text-[10px] text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all shadow-sm">{p.user.charAt(0)}</div>
                          <span className="font-extrabold text-slate-700 tracking-tight leading-none">{p.user}</span>
                       </div>
                    </td>
                    <td className="px-4 py-4">
                       <span className="text-slate-500 font-bold flex items-center gap-2"><CreditCard size={14} className="text-blue-500"/> {p.plan}</span>
                    </td>
                    <td className="px-4 py-4">
                       <p className="font-black text-slate-900 tracking-tight leading-none mb-1">{p.amount}</p>
                       <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest leading-none">GST: {p.gst}</p>
                    </td>
                    <td className="px-4 py-4">
                       <span className={`inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest ${
                          p.status === 'Success' ? 'text-#15192c' : p.status === 'Pending' ? 'text-orange-500' : 'text-red-500'
                       }`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${p.status==='Success'?'bg-#15192c shadow-[0_0_8px_rgba(34,197,94,0.6)]':p.status==='Pending'?'bg-orange-500 animate-pulse':'bg-red-500'}`}></div>
                          {p.status}
                       </span>
                    </td>
                    <td className="px-4 py-4 text-right">
                       <div className="flex items-center justify-end gap-2 transition-all duration-300">
                          <button onClick={() => setViewPay(p)} className="p-2 bg-white border border-black/5 text-slate-400 rounded-lg hover:text-blue-500 hover:border-blue-200 transition-all shadow-sm"><Eye size={16} /></button>
                          <button onClick={(e) => { e.stopPropagation(); handleDownloadInvoice(p); }} className={`p-2 bg-white border border-black/5 rounded-lg transition-all shadow-sm ${isDownloading === p.id ? 'text-#15192c' : 'text-slate-400 hover:text-#15192c hover:border-#15192c/20'}`}>
                              {isDownloading === p.id ? <CheckCircle size={16} className="animate-pulse" /> : <Download size={16} />}
                          </button>
                       </div>
                    </td>
                 </tr>
               ))}
               {filtered.length === 0 && (
                   <tr><td colSpan={6} className="px-4 py-10 text-center font-black text-slate-300 uppercase tracking-[0.4em]">No financial records found</td></tr>
               )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── VIEW TRANSACTION MODAL ────────────────────────────────────────────── */}
      <CMSModal open={!!viewPay} title="Digital Invoice" icon={FileText} iconBg="bg-[#ff69b4]" onClose={() => setViewPay(null)}>
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
             <div className="p-6 bg-[#FFF7F8] border border-[#F5E6EA] rounded-[2rem] flex flex-col sm:flex-row items-start sm:items-center justify-between relative overflow-hidden gap-4">
                <div className="relative z-10 space-y-1">
                   <p className="text-[9px] font-black text-[#C4A0AC] uppercase tracking-[0.2em] leading-none mb-2">Settlement Proof</p>
                   <h3 className="text-3xl font-black text-[#15192c] tracking-tighter leading-none">{viewPay?.amount}</h3>
                   <div className="flex flex-wrap items-center gap-2 pt-2">
                       <span className="px-3 py-1 bg-[#ff69b4] text-white text-[9px] font-black uppercase tracking-widest rounded-lg shadow-lg shadow-[#ff69b4]/20">{viewPay?.status}</span>
                       <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest underline decoration-black/10 underline-offset-4">{viewPay?.id}</span>
                   </div>
                </div>
                <div className="w-14 h-14 rounded-full bg-white border border-[#F5E6EA] flex items-center justify-center text-[#ff69b4] shadow-xl"><TrendingUp size={28}/></div>
                <div className="absolute top-0 right-0 w-28 h-28 bg-[#ff69b4]/10 rounded-full blur-3xl -mr-14 -mt-14"></div>
             </div>

             <div className="grid grid-cols-2 gap-3">
                <div className="p-4 bg-slate-50 border border-black/5 rounded-[1.75rem] space-y-3">
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Customer Entity</p>
                   <p className="text-sm font-black text-slate-800 leading-none">{viewPay?.user}</p>
                   <p className="text-[9px] font-bold text-slate-400 truncate">{viewPay?.email}</p>
                   <div className="flex gap-2 pt-1">
                       <Mail size={14} className="text-slate-300 hover:text-slate-900 cursor-pointer transition-colors"/>
                       <Share2 size={14} className="text-slate-300 hover:text-slate-900 cursor-pointer transition-colors"/>
                   </div>
                </div>
                <div className="p-4 bg-slate-50 border border-black/5 rounded-[1.75rem] space-y-3">
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Internal Meta</p>
                   <p className="text-sm font-black text-slate-800 leading-none">{viewPay?.plan}</p>
                   <p className="text-[9px] font-bold text-slate-400">{viewPay?.method} Interaction</p>
                   <p className="text-[9px] font-bold text-slate-400">{viewPay?.date}</p>
                </div>
             </div>

             <div className="space-y-3">
                 <div className="flex items-center justify-between px-2">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Tax Breakdown (GST 18%)</span>
                    <span className="text-[9px] font-black text-[#15192c] uppercase tracking-widest">{viewPay?.gst}</span>
                 </div>
                 <div className="h-px bg-[#F5E6EA] w-full"></div>
                 <div className="flex items-center justify-between px-2 pt-1">
                    <span className="text-[9px] font-black text-[#15192c] uppercase tracking-widest">Total Settled</span>
                    <span className="text-lg font-black text-[#ff69b4] tracking-tight">{viewPay?.amount}</span>
                 </div>
             </div>

             <div className="p-4 bg-rose-50 border border-rose-100 rounded-3xl flex items-start gap-3 animate-in slide-in-from-top-4 duration-500">
                <Info size={16} className="text-[#ff69b4] flex-shrink-0 mt-0.5" />
                <p className="text-[9px] font-bold text-rose-600 leading-relaxed uppercase tracking-widest">This transaction has been verified across multiple ledger nodes. Digital invoice was dispatched to {viewPay?.email}.</p>
             </div>

             <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button onClick={handleViewInvoice} disabled={isViewingInvoice} className="flex-1 py-3 bg-slate-900 text-white font-black text-[9px] uppercase tracking-[0.2em] rounded-2xl hover:bg-black transition-all flex items-center justify-center gap-2 shadow-xl shadow-slate-900/10">
                    {isViewingInvoice ? <><Clock size={14} className="animate-spin" /> Generating PDF...</> : <><FileText size={14}/> Download PDF Invoice</>}
                </button>
                <button onClick={() => setViewPay(null)} className="px-5 py-3 bg-slate-100 text-slate-400 font-black text-[9px] uppercase tracking-widest rounded-2xl hover:bg-slate-200 transition-all">Dismiss</button>
             </div>
          </div>
      </CMSModal>

    </div>
  );
};

export default PaymentManagement;
