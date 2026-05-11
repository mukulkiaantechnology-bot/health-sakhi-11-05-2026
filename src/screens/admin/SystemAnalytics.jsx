import React, { useState } from 'react';
import { BarChart2, TrendingUp, Users, DollarSign, ArrowUpRight, ArrowDownRight, Activity, PieChart, Info, ShieldCheck, Target, Zap, Clock, ChevronDown, X, Lock, CheckCircle, Database, Layout, Shield } from 'lucide-react';

// ── Shared Modal Component ──────────────────────────────────────────────────
const AnalyticModal = ({ open, onClose, title, subtitle, icon: Icon, iconBg, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-[#15192c]/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white rounded-t-[2.5rem] sm:rounded-[3rem] w-full sm:max-w-2xl shadow-2xl border animate-in slide-in-from-bottom sm:zoom-in-95 duration-500 max-h-[92vh] flex flex-col overflow-hidden relative" style={{ borderColor: '#F5E6EA' }}>
        <div className="p-4 sm:p-6 border-b flex items-center justify-between flex-shrink-0 bg-rose-50/30" style={{ borderColor: '#F5E6EA' }}>
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-[1.75rem] flex items-center justify-center shadow-xl ${iconBg} text-white transition-transform hover:scale-110`}>
              <Icon size={20} />
            </div>
            <div>
              <h2 className="text-lg sm:text-2xl font-bold tracking-tight leading-none" style={{ color: '#15192c' }}>{title}</h2>
              {subtitle && <p className="text-[8px] font-bold uppercase tracking-widest mt-2" style={{ color: '#C4A0AC' }}>{subtitle}</p>}
            </div>
          </div>
          <button onClick={onClose} className="w-12 h-12 flex items-center justify-center text-[#C4A0AC] hover:bg-rose-50 rounded-full transition-all active:scale-90"><X size={28} /></button>
        </div>
        <div className="p-4 sm:p-6 overflow-y-auto bg-white flex-1 custom-analytic-scrollbar">{children}</div>
      </div>
    </div>
  );
};

const SystemAnalytics = () => {
  const [activeModal, setActiveModal] = useState(null); // 'range', 'audit', 'log', 'vault'
  const [isProcessing, setIsProcessing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [complete, setComplete] = useState(false);
  const [vaultAuthorized, setVaultAuthorized] = useState(false);
  const [pin, setPin] = useState('');

  const triggerAudit = () => {
      setIsProcessing(true);
      setComplete(false);
      setTimeout(() => {
          setIsProcessing(false);
          setComplete(true);
      }, 3000);
  }

  const triggerVault = () => {
      setIsProcessing(true);
      setTimeout(() => {
          setIsProcessing(false);
          setActiveModal('vault');
      }, 1000);
  }

  const handlePinSubmit = () => {
      if(pin === '1234') { 
          setIsProcessing(true);
          setTimeout(() => {
              setIsProcessing(false);
              setVaultAuthorized(true);
          }, 1500);
      } else {
          alert('ACCESS DENIED: Invalid Auditor PIN');
      }
  }

  const handleExportRegulatoryPDF = async () => {
      setIsExporting(true);
      try {
          const { default: jsPDF } = await import('jspdf');
          const { default: autoTable } = await import('jspdf-autotable');

          setTimeout(() => {
              setIsExporting(null);
              const doc = new jsPDF();
              
              // Official Header (Plum Theme)
              doc.setFillColor(45, 21, 32); 
              doc.rect(0, 0, 210, 50, 'F');
              doc.setTextColor(255, 255, 255);
              
              doc.setFontSize(24);
              doc.setFont("helvetica", "bold");
              doc.text("REGULATORY COMPLIANCE REPORT", 20, 30);
              
              doc.setFontSize(10);
              doc.setFont("helvetica", "normal");
              doc.text("VERIFIED BY: HEALTH SAKHI BI-ENGINE V2", 20, 40);
              doc.text(`AUDIT ID: HS-BI-${Math.floor(Math.random() * 900000 + 100000)}`, 140, 40);

              // Summary
              doc.setTextColor(50, 50, 50);
              doc.setFontSize(16);
              doc.text("Executive Audit Summary", 20, 65);
              
              autoTable(doc, {
                  startY: 75,
                  head: [['Metric', 'Status/Value', 'Verification']],
                  body: [
                      ['Annual Projected Revenue', '₹4,82,400.00', 'MATCHED'],
                      ['Total Active Subscriptions', '12,840 Units', 'VERIFIED'],
                      ['Compliance Index Score', '99.8%', 'STABLE'],
                      ['Bank Settlement Node', 'Node Active (Axis)', 'SECURE'],
                      ['GST Leakage Analysis', '0.00%', 'CLEAN']
                  ],
                  headStyles: { fillColor: [196, 96, 122] }, // Health Sakhi Theme Plum
                  theme: 'striped'
              });

              // Disclaimer
              const finalY = doc.lastAutoTable.finalY + 20;
              doc.setFontSize(10);
              doc.setTextColor(150, 150, 150);
              doc.setFont("helvetica", "italic");
              doc.text("Disclaimer: This report is generated from real-time ledger nodes of Health Sakhi.", 20, finalY);
              doc.text("It is intended for regulatory and institutional audit purposes only.", 20, finalY + 5);
              
              doc.save(`HealthSakhi_Regulatory_Audit_${new Date().toISOString().split('T')[0]}.pdf`);
              setIsExporting(false);
          }, 2000);
      } catch (err) {
          setIsExporting(false);
          alert("Could not export. Please ensure jspdf-autotable is installed.");
      }
  }

  return (
    <div className="space-y-10 font-sans pb-20 animate-in fade-in duration-700">
      <style>{`
          .custom-analytic-scrollbar::-webkit-scrollbar { width: 4px; }
          .custom-analytic-scrollbar::-webkit-scrollbar-track { background: transparent; }
          .custom-analytic-scrollbar::-webkit-scrollbar-thumb { background: #F5E6EA; border-radius: 20px; border: 2px solid transparent; background-clip: content-box; }
      `}</style>
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 px-1">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight leading-none mb-2" style={{ color: '#15192c' }}>Business Intelligence</h1>
          <p className="text-xs sm:text-sm font-medium" style={{ color: '#9A8A8E' }}>Real-time meta-analysis of HealthSakhi's <span className="font-bold border-b-2" style={{ color: '#ff69b4', borderColor: '#F5E6EA' }}>growth and revenue metrics.</span></p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
           <button onClick={() => setActiveModal('range')} className="px-3 sm:px-4 py-2 bg-white border text-[8px] font-black rounded-2xl tracking-tight flex items-center justify-center gap-2 hover:bg-rose-50/50 transition-all shadow-sm" style={{ borderColor: '#F5E6EA', color: '#15192c' }}>
             <Clock size={14} /> <span className="truncate">Custom Range</span>
           </button>
           <button onClick={() => { setActiveModal('audit'); triggerAudit(); }} className="px-3 sm:px-4 py-2 text-white font-black rounded-2xl text-[8px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl transition-all hover:brightness-110 active:scale-95" style={{ background: '#15192c' }}>
             Audit Analytics
           </button>
        </div>
      </div>

      {/* Primary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Annual Revenue', val: '₹4.2M', growth: '+22%', up: true, icon: DollarSign, color: '#ff69b4', bg: '#FDEEF1' },
          { label: 'Active Subscriptions', val: '12,840', growth: '+12%', up: true, icon: Users, color: '#C4A0AC', bg: '#FFF7F8' },
          { label: 'CAC (Avg)', val: '₹420', growth: '-5%', up: true, icon: Zap, color: '#15192c', bg: '#FDEEF1' },
          { label: 'Churn Rate', val: '2.4%', growth: '+0.2%', up: false, icon: Target, color: '#ff69b4', bg: 'rgba(196, 96, 122, 0.05)' },
        ].map((m, i) => (
          <div key={i} className={`p-4 rounded-[1.75rem] border shadow-sm hover:shadow-md transition-all relative overflow-hidden group`} style={{ background: m.bg, borderColor: '#F5E6EA' }}>
             <div className="flex items-center justify-between mb-3 relative z-10">
                <div className={`w-9 h-9 rounded-2xl bg-white flex items-center justify-center shadow-sm border`} style={{ borderColor: '#F5E6EA', color: m.color }}>
                   <m.icon size={18} className="group-hover:scale-110 transition-transform" />
                </div>
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-[8px] font-black uppercase tracking-widest bg-white shadow-sm`} style={{ color: m.up ? '#ff69b4' : '#f43f5e' }}>
                   {m.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />} {m.growth}
                </div>
             </div>
             <p className="text-[8px] font-bold uppercase tracking-widest mb-1 relative z-10" style={{ color: '#C4A0AC' }}>{m.label}</p>
             <p className="text-xl font-black tracking-tight relative z-10" style={{ color: '#15192c' }}>{m.val}</p>
             <m.icon size={80} className={`absolute -bottom-6 -right-6 opacity-[0.03] -rotate-12 group-hover:rotate-0 transition-transform duration-700`} style={{ color: m.color }} />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         {/* Acquisition Chart */}
         <div className="bg-white p-4 rounded-[2rem] border border-black/5 shadow-sm space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-#15192c/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
               <div>
                  <h2 className="text-lg font-black text-slate-800 tracking-tight leading-none">User Acquisition</h2>
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-2">Historical Growth Pattern (12M)</p>
               </div>
               <div className="flex gap-3">
                  <div className="flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-#15192c shadow-[0_0_8px_rgba(34,197,94,0.4)]"></div>
                     <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Paid</span>
                  </div>
                  <div className="flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-slate-200"></div>
                     <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Organic</span>
                  </div>
               </div>
            </div>
            
            <div className="h-48 flex items-end justify-between gap-2 sm:gap-3 px-2 relative z-10">
               {[40, 60, 45, 90, 65, 80, 50, 70, 85, 95, 75, 100].map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-3 group cursor-pointer h-full justify-end">
                     <div className="w-full flex-1 flex flex-col gap-1 justify-end">
                        <div className="w-full bg-#15192c rounded-xl group-hover:brightness-110 transition-all shadow-sm shadow-#15192c/10 group-hover:scale-x-110" style={{ height: `${h}%` }}></div>
                        <div className="w-full bg-slate-50 border border-black/[0.03] rounded-xl group-hover:bg-slate-100 transition-colors" style={{ height: `${Math.max(15, 60-h/2)}%` }}></div>
                     </div>
                     <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest group-hover:text-slate-900 transition-colors">M{i+1}</span>
                  </div>
               ))}
            </div>
         </div>

         {/* Distribution Strategy */}
         <div className="bg-white p-4 rounded-[2.5rem] border shadow-sm flex flex-col" style={{ borderColor: '#F5E6EA' }}>
            <div className="mb-4">
                <h2 className="text-lg font-bold tracking-tight leading-none" style={{ color: '#15192c' }}>Revenue Distribution</h2>
                <p className="text-[8px] font-bold uppercase tracking-widest mt-2" style={{ color: '#C4A0AC' }}>Modular Contribution Breakdown</p>
            </div>
            <div className="space-y-6 flex-1">
               {[
                 { label: 'Hormonal Health', val: '45%', color: '#ff69b4' },
                 { label: 'Diabetes Care', val: '22%', color: '#C4A0AC' },
                 { label: 'Senior Wellness', val: '18%', color: '#15192c' },
                 { label: 'General Lifestyle', val: '15%', color: '#F5B4BC' },
               ].map((item, i) => (
                  <div key={i} className="space-y-3 group cursor-pointer">
                     <div className="flex justify-between items-center px-1">
                        <span className="text-[8px] font-bold uppercase tracking-widest group-hover:text-[#15192c] transition-colors" style={{ color: '#C4A0AC' }}>{item.label}</span>
                        <div className="flex items-center gap-2">
                           <span className="text-base font-black tracking-tight group-hover:scale-110 transition-transform" style={{ color: '#15192c' }}>{item.val}</span>
                           <div className={`w-2 h-2 rounded-full`} style={{ background: item.color }}></div>
                        </div>
                     </div>
                     <div className="h-2 w-full bg-rose-50/50 rounded-full overflow-hidden flex shadow-inner border" style={{ borderColor: '#F5E6EA' }}>
                        <div className={`h-full shadow-2xl transition-all duration-1000 group-hover:brightness-110`} style={{ width: item.val, background: item.color }}></div>
                     </div>
                  </div>
               ))}
            </div>
            
            <div className="mt-5 pt-5 border-t flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4" style={{ borderColor: '#F5E6EA' }}>
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-rose-50/50 border rounded-2xl flex items-center justify-center" style={{ borderColor: '#F5E6EA', color: '#ff69b4' }}>
                     <PieChart size={20} />
                  </div>
                  <div>
                      <p className="text-xs font-bold uppercase tracking-widest mb-1 leading-none" style={{ color: '#15192c' }}>Meta Intelligence</p>
                      <p className="text-[10px] font-bold leading-none" style={{ color: '#C4A0AC' }}>Module-specific yield reports available.</p>
                  </div>
               </div>
               <button onClick={() => setActiveModal('log')} className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-slate-900/10 flex items-center gap-2">Detailed Log <ArrowUpRight size={12}/></button>
            </div>
         </div>
      </div>

      {/* Audit Alert */}
      <div className="p-4 border rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-4 relative overflow-hidden" style={{ background: '#FFF7F8', borderColor: '#F5E6EA' }}>
         <div className="absolute top-0 right-0 w-52 h-52 rounded-full blur-3xl -mr-24 -mt-24 opacity-10" style={{ background: '#ff69b4' }}></div>
         <div className="space-y-3 relative z-10">
            <div className="flex items-center gap-2 font-bold text-[9px] uppercase tracking-[0.2em]" style={{ color: '#ff69b4' }}>
                <ShieldCheck size={18}/> Secured Node Intelligence
            </div>
            <h3 className="text-lg font-black tracking-tight" style={{ color: '#15192c' }}>Audit-Ready Financial Data</h3>
            <p className="text-[9px] font-medium max-w-xl leading-relaxed italic" style={{ color: '#9A8A8E' }}>
              "Our business intelligence engine uses decentralized verification to ensure all metrics are mathematically accurate and ready for institutional auditing."
            </p>
         </div>
         <button onClick={triggerVault} disabled={isProcessing} className="px-4 py-2 bg-white border-2 text-[8px] font-bold uppercase tracking-[0.3em] rounded-[1.75rem] shadow-xl hover:bg-[#15192c] hover:text-white transition-all active:scale-95 relative z-10" style={{ color: '#15192c', borderColor: '#15192c' }}>
            {isProcessing ? 'Verifying Node...' : 'Open Auditor Vault'}
         </button>
      </div>

      {/* ── Modals ── */}
      <AnalyticModal open={activeModal === 'range'} onClose={() => setActiveModal(null)} title="Temporal Range" subtitle="Select analysis period" icon={Clock} iconBg="bg-[#15192c]">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {['Last 24 Hours', 'Past 7 Days', 'Current Month', 'Fiscal Year 2024', 'Last 365 Days', 'Lifetime Analysis'].map(range => (
                  <button key={range} onClick={() => setActiveModal(null)} className="p-3 bg-rose-50/20 border rounded-[1.75rem] text-left hover:border-[#ff69b4] transition-all group" style={{ borderColor: '#F5E6EA' }}>
                      <p className="text-[8px] font-bold uppercase tracking-widest mb-1 group-hover:text-[#ff69b4]" style={{ color: '#C4A0AC' }}>Interval</p>
                      <p className="font-bold text-sm" style={{ color: '#15192c' }}>{range}</p>
                  </button>
              ))}
          </div>
      </AnalyticModal>

      <AnalyticModal open={activeModal === 'audit'} onClose={() => setActiveModal(null)} title="Deep System Audit" subtitle="Financial Reconciliation Engine" icon={ShieldCheck} iconBg="bg-[#15192c]">
          <div className="space-y-8 py-4">
              {isProcessing ? (
              <div className="space-y-4 animate-pulse">
                      <div className="h-2 w-full bg-rose-50 rounded-full overflow-hidden flex">
                          <div className="h-full animate-[progress_3s_ease-in-out]" style={{ width: '100%', background: '#ff69b4' }}></div>
                      </div>
                      <div className="text-center text-[9px] font-black uppercase tracking-widest" style={{ color: '#C4A0AC' }}>
                        Scanning platform nodes for discrepancies...
                      </div>
                  </div>
              ) : complete ? (
                  <div className="text-center space-y-6 animate-in zoom-in-95 duration-500">
                      <div className="w-20 h-20 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-inner" style={{ background: '#FDEEF1', color: '#ff69b4' }}>
                          <CheckCircle size={40} />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-xl font-bold tracking-tight" style={{ color: '#15192c' }}>Audit Successful</h3>
                        <p className="text-[10px] font-medium max-w-xs mx-auto" style={{ color: '#9A8A8E' }}>All entries match. No leakages detected.</p>
                      </div>
                      <button onClick={() => setActiveModal(null)} className="px-6 py-3 text-white font-bold rounded-2xl text-[9px] uppercase tracking-widest shadow-xl" style={{ background: '#ff69b4' }}>Commit Log</button>
                  </div>
              ) : null}
          </div>
          <style>{` @keyframes progress { from { width: 0%; } to { width: 100%; } } `}</style>
      </AnalyticModal>

      <AnalyticModal open={activeModal === 'log'} onClose={() => setActiveModal(null)} title="Intelligence Log" subtitle="Real-time Platform Metadata" icon={Database} iconBg="bg-[#ff69b4]">
          <div className="space-y-3">
              {[
                { time: '14:22:01', event: 'Razorpay Gateway Verified', type: 'SUCCESS' },
                { time: '14:21:45', event: 'Subscription Tier Migration', type: 'INFO' },
                { time: '14:21:30', event: 'GST Node Calculation Logic', type: 'SUCCESS' },
                { time: '14:20:12', event: 'Latency Spike Detected', type: 'WARN' },
                { time: '14:18:55', event: 'Advisor Payout Ledger Synced', type: 'SUCCESS' },
              ].map((log, i) => (
                  <div key={i} className="p-3 bg-rose-50/20 border rounded-xl flex items-center justify-between group hover:bg-white transition-all" style={{ borderColor: '#F5E6EA' }}>
                      <div className="flex items-center gap-3">
                          <span className="text-[8px] font-bold font-mono" style={{ color: '#C4A0AC' }}>{log.time}</span>
                          <span className="text-[10px] font-bold tracking-tight" style={{ color: '#15192c' }}>{log.event}</span>
                      </div>
                      <span className={`text-[8px] font-bold px-2 py-1 rounded-md border ${log.type === 'SUCCESS' ? 'bg-[#FDEEF1] text-[#ff69b4] border-[#F5E6EA]' : 'bg-orange-50 text-orange-600 border-orange-100'}`}>{log.type}</span>
                  </div>
              ))}
          </div>
      </AnalyticModal>

      <AnalyticModal open={activeModal === 'vault'} onClose={() => { setActiveModal(null); setVaultAuthorized(false); setPin(''); }} title="Auditor Vault" subtitle={vaultAuthorized ? "Authorized Access Root" : "Restricted Financial Ledgers"} icon={vaultAuthorized ? Shield : Lock} iconBg={vaultAuthorized ? "bg-[#ff69b4]" : "bg-red-500"}>
          {!vaultAuthorized ? (
              <div className="space-y-8 text-center p-4">
                  <div className="w-20 h-20 bg-rose-50 text-[#ff69b4] rounded-[2rem] flex items-center justify-center mx-auto mb-6"> <Shield size={40} /> </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold tracking-tight leading-none mb-3" style={{ color: '#15192c' }}>Security Protocol Required</h3>
                    <p className="text-sm font-medium leading-relaxed max-w-sm mx-auto" style={{ color: '#9A8A8E' }}>Access to the Auditor Vault is strictly limited to authorized financial stakeholders only.</p>
                  </div>
                  <div className="bg-rose-50/30 p-4 rounded-[2rem] border flex flex-col items-center gap-3" style={{ borderColor: '#F5E6EA' }}>
                      <input type="password" value={pin} onChange={e=>setPin(e.target.value)} placeholder="0000" className="w-full h-10 bg-white border rounded-2xl text-center font-bold tracking-[0.5em] text-sm outline-none focus:border-[#ff69b4] transition-all" style={{ borderColor: '#F5E6EA' }} />
                      <button onClick={handlePinSubmit} className="w-full py-2 bg-slate-900 text-white font-bold rounded-2xl text-[8px] uppercase tracking-[0.3em] shadow-xl">Authorize Access</button>
                  </div>
                  <p className="text-[9px] font-bold uppercase tracking-widest" style={{ color: '#C4A0AC' }}>Master PIN for DEMO: 1234</p>
              </div>
          ) : (
              <div className="space-y-8 animate-in zoom-in-95 duration-700">
                  <div className="p-6 bg-[#FDEEF1] rounded-[2rem] border flex items-center justify-between" style={{ borderColor: '#F5E6EA' }}>
                      <div>
                          <p className="text-[9px] font-bold uppercase tracking-widest mb-1" style={{ color: '#ff69b4' }}>Secure Terminal Active</p>
                          <h4 className="text-xl font-bold tracking-tight" style={{ color: '#15192c' }}>Root Ledger Connected</h4>
                      </div>
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg" style={{ background: '#ff69b4', color: '#fff' }}><Activity size={24}/></div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                      <button onClick={handleExportRegulatoryPDF} disabled={isExporting} className="flex-1 py-3 bg-slate-900 text-white font-bold text-[9px] uppercase tracking-widest rounded-2xl hover:bg-black transition-all flex items-center justify-center gap-2">
                           {isExporting ? 'Generating Report...' : 'Export Regulatory PDF'}
                      </button>
                      <button onClick={() => { setActiveModal(null); setVaultAuthorized(false); }} className="px-6 py-3 bg-rose-50 text-[#C4A0AC] font-bold text-[9px] uppercase tracking-widest rounded-2xl hover:bg-rose-100 transition-all">Destroy Session</button>
                  </div>
              </div>
          )}
      </AnalyticModal>
    </div>
  );
};

export default SystemAnalytics;

