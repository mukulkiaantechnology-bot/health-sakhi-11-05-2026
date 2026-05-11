import React from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, Users, CheckCircle, TrendingUp, Link as LinkIcon, DollarSign, ArrowRight, X, Info, Copy, Check, FileText } from 'lucide-react';

const AffiliateDashboard = () => {
  const [showLinkModal, setShowLinkModal] = React.useState(false);
  const [showRulesModal, setShowRulesModal] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const referralLink = "https://healthsakhi.com/join?ref=PARTNER_6BCB";

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="space-y-10 font-sans">
      <div className="bg-slate-900 text-white p-6 md:p-10 rounded-[2rem] relative overflow-hidden">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <div className="inline-flex py-1 px-2.5 bg-[#ff69b4]/10 text-[#ff69b4] rounded-md text-[9px] font-black uppercase tracking-widest border border-[#ff69b4]/20">
               Direct Partner Performance
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-none text-white">
              Your impact is <span className="text-[#ff69b4]">Growing.</span>
            </h1>
            <p className="text-white/50 text-sm leading-relaxed max-w-md">
              Shared HealthSakhi with our sisters and track your commission growth in real-time.
            </p>
            <div className="flex gap-4 pt-2">
               <button onClick={() => setShowLinkModal(true)} className="px-6 py-3 bg-[#ff69b4] text-white font-black rounded-xl text-[10px] uppercase tracking-widest hover:brightness-110 shadow-lg shadow-[#ff69b4]/20 transition-all">
                  Get Referral Link
               </button>
               <button onClick={() => setShowRulesModal(true)} className="px-6 py-3 bg-white/5 text-white border border-white/10 font-black rounded-xl text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all">
                  View Rules
               </button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
             {[
               { label: 'Total Earnings', val: '₹42,800', change: '+₹4k' },
               { label: 'Active Referrals', val: '128', change: '+12' },
               { label: 'Clicks', val: '1.2k', change: '+150' },
               { label: 'Conversion', val: '10.5%', change: '+1.2%' }
             ].map((stat, i) => (
                <div key={i} className="bg-white/5 border border-white/10 p-4 rounded-xl backdrop-blur-md">
                   <p className="text-white/40 text-[9px] font-black uppercase tracking-widest mb-1">{stat.label}</p>
                   <p className="text-xl font-black text-white">{stat.val}</p>
                   <p className="text-[#ff69b4] text-[9px] font-bold mt-1.5">{stat.change} today</p>
                </div>
             ))}
          </div>
        </div>
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#ff69b4]/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between px-1">
               <h2 className="text-lg font-black text-slate-800 tracking-tight">Recent Conversions</h2>
               <button className="text-[10px] font-black text-[#ff69b4] uppercase tracking-[0.1em]">See Detailed History</button>
            </div>
            <div className="bg-white rounded-[1.5rem] border border-black/5 shadow-sm overflow-hidden">
               <div className="divide-y divide-black/5">
                  {[1,2,3,4].map(i => (
                     <div key={i} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-black text-slate-400 text-[10px]">SA</div>
                           <div>
                              <p className="font-bold text-slate-800 text-xs">Sakhi_User_{i}482</p>
                              <p className="text-[9px] text-slate-400 font-bold tracking-widest uppercase">Premium Pro Plan</p>
                           </div>
                        </div>
                        <div className="text-right">
                           <p className="font-black text-slate-900 text-[11px]">₹1,799.00</p>
                           <p className="text-[9px] text-[#ff69b4] font-black uppercase tracking-widest">Earned</p>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </div>

         <div className="space-y-4">
            <h2 className="text-lg font-black text-slate-800 tracking-tight px-1">Top Performing Assets</h2>
            <div className="bg-white rounded-[1.5rem] p-6 border border-black/5 shadow-sm space-y-5">
               {[
                 { title: 'Banner - Women Health', usage: '48%' },
                 { title: 'Video - PCOD Intro', usage: '32%' },
                 { title: 'Coupon - SAKHI20', usage: '20%' }
               ].map((asset, i) => (
                  <div key={i} className="space-y-2">
                     <div className="flex justify-between items-center">
                        <span className="text-[11px] font-bold text-slate-700">{asset.title}</span>
                        <span className="text-[9px] font-black text-[#ff69b4]">{asset.usage}</span>
                     </div>
                     <div className="h-1.5 w-full bg-rose-50 rounded-full overflow-hidden">
                        <div className="h-full bg-[#ff69b4]" style={{ width: asset.usage }}></div>
                     </div>
                  </div>
               ))}
                <div className="pt-3 border-t border-black/5 mt-auto">
                   <Link to="/affiliate/assets" className="flex items-center justify-center gap-2 w-full py-3 text-[10px] font-black uppercase tracking-widest text-[#C4A0AC] hover:text-[#ff69b4] hover:bg-rose-50 rounded-xl transition-all">
                      Go to Marketing Assets <ArrowRight size={14} />
                   </Link>
                </div>
            </div>
         </div>
      </div>
      {/* Referral Link Modal */}
      {showLinkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-[2rem] w-full max-w-sm p-6 md:p-8 relative shadow-2xl animate-in zoom-in-95 duration-300">
             <button onClick={() => setShowLinkModal(false)} className="absolute top-5 right-5 text-[#C4A0AC] hover:text-slate-900 transition-colors"><X size={20}/></button>
             <div className="w-12 h-12 bg-rose-50 text-[#ff69b4] rounded-2xl flex items-center justify-center mb-4">
                <LinkIcon size={24} />
             </div>
             <h3 className="text-2xl font-black text-[#15192c] tracking-tight mb-2">Referral Code</h3>
             <p className="text-[#C4A0AC] text-sm font-medium mb-6">Share this unique link with sisters in your community to track your growth.</p>
             
             <div className="relative group mb-6">
                <input readOnly value={referralLink} className="w-full h-12 pl-4 pr-12 bg-rose-50/20 border rounded-xl font-bold text-slate-700 text-sm outline-none focus:border-[#ff69b4] transition-all" style={{ borderColor: '#F5E6EA' }} />
                <button onClick={handleCopy} className="absolute right-1.5 top-1.5 bottom-1.5 w-10 bg-white border border-[#F5E6EA] rounded-lg flex items-center justify-center text-slate-400 hover:text-[#ff69b4] hover:shadow-sm transition-all">
                   {copied ? <Check size={16} className="text-[#ff69b4] animate-in zoom-in" /> : <Copy size={16} />}
                </button>
             </div>

             <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 flex items-start gap-3">
                 <Info size={16} className="text-blue-500 flex-shrink-0 mt-0.5" />
                 <p className="text-[9px] font-black text-blue-600 leading-relaxed uppercase tracking-widest">Commission is automatically tracked for every pro subscription converted via this link.</p>
             </div>
          </div>
        </div>
      )}

      {/* Rules Modal */}
      {showRulesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300">
           <div className="bg-white rounded-[2rem] w-full max-w-md p-6 md:p-8 relative shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden" style={{ border: '1px solid #F5E6EA' }}>
             <button onClick={() => setShowRulesModal(false)} className="absolute top-6 right-6 text-[#C4A0AC] hover:text-slate-900 transition-colors"><X size={20}/></button>
             <div className="absolute top-0 right-0 w-24 h-24 bg-[#ff69b4]/5 rounded-full -mr-12 -mt-12"></div>
             
             <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center"><FileText size={20}/></div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Partner Rules</h3>
             </div>

             <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                {[
                  { title: 'Commission Tier', desc: 'Earn 15% on every direct referral subscription and 5% on renewals.' },
                  { title: 'Payout Cycle', desc: 'Earnings are disbursed on the 1st of every month for previous month cleared balances.' },
                  { title: 'Active Link', desc: 'Clicks are valid for 30 days from the initial interaction via cookie tracking.' },
                  { title: 'Compliance', desc: 'Spamming or misleading sisters through fake claims is strictly prohibited.' }
                ].map((rule, idx) => (
                  <div key={idx} className="p-4 bg-rose-50/20 border rounded-2xl space-y-1.5" style={{ borderColor: '#F5E6EA' }}>
                     <p className="text-[9px] font-black text-[#ff69b4] uppercase tracking-[0.2em]">{rule.title}</p>
                     <p className="text-xs font-bold text-slate-600 leading-relaxed">{rule.desc}</p>
                  </div>
                ))}
             </div>
             
             <button onClick={() => setShowRulesModal(false)} className="w-full mt-6 py-3.5 bg-slate-900 text-white font-black rounded-xl text-[10px] uppercase tracking-widest hover:bg-black transition-all">I Agree to the Terms</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AffiliateDashboard;

