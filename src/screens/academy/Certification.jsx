import React, { useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Download, 
  Share2, 
  ArrowLeft, 
  Award, 
  ShieldCheck,
  CheckCircle2,
  Calendar,
  User,
  ExternalLink
} from 'lucide-react';

const Certification = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const certificateRef = useRef();

  const handleDownload = () => {
    // Future: Use html2canvas/jspdf to download the certificate
    alert('Preparing your high-resolution certificate for download...');
  };

  return (
    <div className="max-w-5xl mx-auto pb-20 space-y-8 px-4 md:px-0">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[#C4A0AC] hover:text-[#ff69b4] transition-colors font-bold text-xs uppercase tracking-widest"
        >
          <ArrowLeft size={18} /> Back to Learning
        </button>

        <div className="flex gap-4">
          <button 
            onClick={handleDownload}
            className="flex items-center gap-2 px-6 py-3 bg-[#15192c] text-white rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg hover:scale-105 transition-all"
          >
            <Download size={14} /> Download PDF
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-white border border-rose-100 text-[#15192c] rounded-xl font-black uppercase tracking-widest text-[10px] shadow-sm hover:border-[#ff69b4] transition-all">
            <Share2 size={14} /> Share
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Certificate Display */}
        <div className="lg:col-span-3">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-4 md:p-12 rounded-[2rem] shadow-2xl border-8 border-rose-50 relative overflow-hidden aspect-[1.414/1] flex flex-col items-center justify-center text-center space-y-8"
            style={{ background: 'white' }}
          >
            {/* Watermark/Background Decor */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none flex items-center justify-center">
               <img src="/Images/logo.png" alt="Watermark" className="w-[80%] object-contain grayscale" />
            </div>
            
            {/* Corner Accents */}
            <div className="absolute top-0 left-0 w-32 h-32 border-t-8 border-l-8 border-[#ff69b4]/20 rounded-tl-[1.5rem]" />
            <div className="absolute top-0 right-0 w-32 h-32 border-t-8 border-r-8 border-[#ff69b4]/20 rounded-tr-[1.5rem]" />
            <div className="absolute bottom-0 left-0 w-32 h-32 border-b-8 border-l-8 border-[#ff69b4]/20 rounded-bl-[1.5rem]" />
            <div className="absolute bottom-0 right-0 w-32 h-32 border-b-8 border-r-8 border-[#ff69b4]/20 rounded-br-[1.5rem]" />

            <div className="space-y-2 relative z-10">
              <div className="w-20 h-20 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-rose-100">
                <img src="/Images/logo.png" alt="Logo" className="w-12 h-12 object-contain" />
              </div>
              <h1 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#ff69b4]">Certificate of Excellence</h1>
              <h2 className="text-3xl md:text-5xl font-black text-[#15192c] font-serif">HealthSakhi Academy</h2>
            </div>

            <div className="space-y-6 relative z-10 w-full max-w-2xl">
              <p className="text-[10px] font-black uppercase tracking-widest text-[#C4A0AC]">This is to certify that</p>
              <h3 className="text-4xl md:text-6xl font-black text-[#ff69b4] underline decoration-rose-100 underline-offset-8">Priya Sharma</h3>
              <p className="text-sm md:text-lg font-medium text-[#15192c] leading-relaxed">
                has successfully completed the professional certification course in <br />
                <span className="font-black text-[#15192c] uppercase tracking-wider">Menstrual Health & Wellness Management</span>
              </p>
            </div>

            <div className="grid grid-cols-2 gap-12 w-full max-w-xl pt-12 relative z-10">
               <div className="space-y-2 border-t border-[#F5E6EA] pt-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#C4A0AC]">Date of Issue</p>
                  <p className="font-bold text-[#15192c]">May 15, 2026</p>
               </div>
               <div className="space-y-2 border-t border-[#F5E6EA] pt-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#C4A0AC]">Verify ID</p>
                  <p className="font-bold text-[#15192c]">HS-ACAD-2026-X8Y2</p>
               </div>
            </div>

            <div className="pt-8 relative z-10 flex flex-col items-center">
               <div className="w-24 h-24 bg-white rounded-xl shadow-inner border border-rose-50 flex items-center justify-center p-2">
                  {/* Mock QR Code */}
                  <div className="w-full h-full bg-slate-100 rounded-md grid grid-cols-4 grid-rows-4 gap-1 p-1">
                     {[...Array(16)].map((_, i) => (
                       <div key={i} className={`rounded-sm ${Math.random() > 0.5 ? 'bg-slate-800' : 'bg-transparent'}`} />
                     ))}
                  </div>
               </div>
               <p className="text-[8px] font-bold text-[#C4A0AC] uppercase tracking-widest mt-3">Scan to verify authenticity</p>
            </div>
          </motion.div>
        </div>

        {/* Details Sidebar */}
        <div className="space-y-6">
           <div className="bg-white rounded-[2rem] p-8 border border-rose-100 shadow-sm space-y-6">
              <h4 className="text-sm font-black text-[#15192c] uppercase tracking-widest">Certificate Details</h4>
              <div className="space-y-4">
                 <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center text-[#ff69b4]">
                       <User size={16} />
                    </div>
                    <div>
                       <p className="text-[10px] font-black uppercase tracking-widest text-[#C4A0AC]">Student</p>
                       <p className="text-xs font-bold text-[#15192c]">Priya Sharma</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center text-[#ff69b4]">
                       <Award size={16} />
                    </div>
                    <div>
                       <p className="text-[10px] font-black uppercase tracking-widest text-[#C4A0AC]">Credential</p>
                       <p className="text-xs font-bold text-[#15192c]">Wellness Level 1</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center text-[#ff69b4]">
                       <Calendar size={16} />
                    </div>
                    <div>
                       <p className="text-[10px] font-black uppercase tracking-widest text-[#C4A0AC]">Issued</p>
                       <p className="text-xs font-bold text-[#15192c]">May 15, 2026</p>
                    </div>
                 </div>
              </div>
           </div>

           <div className="bg-[#15192c] rounded-[2rem] p-8 text-white space-y-6">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-[#ff69b4]">
                 <ShieldCheck size={24} />
              </div>
              <div className="space-y-2">
                 <h4 className="font-black">Verified Credential</h4>
                 <p className="text-xs text-white/60 font-medium">This certificate is secured by HealthSakhi Digital Ledger technology.</p>
              </div>
              <button className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-white/10 transition-all">
                 Public Profile <ExternalLink size={12} />
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Certification;
