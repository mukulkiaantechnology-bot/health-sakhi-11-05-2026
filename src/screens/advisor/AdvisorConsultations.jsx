import React, { useState } from 'react';
import { 
  Users, Heart, MessageSquare, Clipboard, Send, 
  Search, Filter, ExternalLink, Calendar, CheckCircle 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { getAssignedMembersForAdvisor } from '../../data/advisorFlow';

const AdvisorConsultations = () => {
  const [activeTab, setActiveTab] = useState('relationship');
  const [selectedId, setSelectedId] = useState(null);
  const [consultations, setConsultations] = useState(() =>
    getAssignedMembersForAdvisor('Dr. Sakshi Sharma').map((member, idx) => ({
      id: member.id || idx + 1,
      user: member.name,
      type: member.condition?.toLowerCase().includes('stress') ? 'Mental Health' : 'Relationship',
      status: member.status === 'Active' ? 'Active' : 'Pending',
      date: member.nextSession || 'Upcoming',
      lastMessage: member.lastMessage || 'Awaiting advisor guidance.'
    }))
  );

  React.useEffect(() => {
    const sync = () => {
      const next = getAssignedMembersForAdvisor('Dr. Sakshi Sharma').map((member, idx) => ({
        id: member.id || idx + 1,
        user: member.name,
        type: member.condition?.toLowerCase().includes('stress') ? 'Mental Health' : 'Relationship',
        status: member.status === 'Active' ? 'Active' : 'Pending',
        date: member.nextSession || 'Upcoming',
        lastMessage: member.lastMessage || 'Awaiting advisor guidance.'
      }));
      setConsultations(next);
    };
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);

  const selectedConsultation = consultations.find((c) => c.id === selectedId) || consultations[0];

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-black text-[#15192c]">Consultation Center</h1>
        <p className="text-[#C4A0AC] font-bold">Manage wellness advice for your assigned Sakhis</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar List */}
        <div className="lg:col-span-4 space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C4A0AC]" size={18} />
            <input 
              type="text" 
              placeholder="Search members..."
              className="w-full pl-12 pr-4 py-4 bg-white border border-rose-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#ff69b4]/20 font-bold text-[#15192c]"
            />
          </div>

          <div className="space-y-4">
            {consultations.map((c) => (
              <div 
                key={c.id} 
                onClick={() => setSelectedId(c.id)}
                className="p-5 bg-white border border-rose-100 rounded-[2rem] hover:ring-2 hover:ring-[#ff69b4]/20 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-[#ff69b4] font-black">
                      {c.user.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-[#15192c]">{c.user}</h4>
                      <div className="flex items-center gap-2">
                        {c.type === 'Relationship' ? <Heart size={10} className="text-pink-500" /> : <Clipboard size={10} className="text-blue-500" />}
                        <span className="text-[9px] font-black uppercase tracking-widest text-[#C4A0AC]">{c.type}</span>
                      </div>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${
                    c.status === 'Active' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'
                  }`}>
                    {c.status}
                  </span>
                </div>
                <p className="text-[12px] font-bold text-[#9A8A8E] line-clamp-1">{c.lastMessage}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Advice Panel */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="p-8 bg-white border border-rose-100 rounded-[3rem] shadow-sm flex-1 space-y-6">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden">
                    <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(selectedConsultation?.user || 'Member')}&background=FDEEF1&color=ff69b4`} alt="User" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-[#15192c]">{selectedConsultation?.user || 'Member'}</h3>
                    <p className="text-[11px] font-black uppercase tracking-widest text-[#ff69b4]">Member since Sep 2023</p>
                  </div>
                </div>
                <button className="p-4 bg-rose-50 rounded-2xl text-[#ff69b4] hover:bg-[#ff69b4] hover:text-white transition-all">
                  <ExternalLink size={20} />
                </button>
             </div>

             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Case Type', value: selectedConsultation?.type || 'Relationship', icon: Heart },
                  { label: 'Last Chat', value: selectedConsultation?.lastMessage ? 'Synced' : 'No chat', icon: MessageSquare },
                  { label: 'Session', value: selectedConsultation?.date || 'Upcoming', icon: Calendar },
                  { label: 'Status', value: selectedConsultation?.status || 'Pending', icon: StarIcon },
                ].map((stat, i) => (
                 <div key={i} className="p-4 bg-rose-50/30 rounded-2xl border border-rose-100">
                    <stat.icon size={14} className="mb-2 text-[#ff69b4]" />
                    <p className="text-[14px] font-black text-[#15192c]">{stat.value}</p>
                    <p className="text-[8px] font-black uppercase tracking-widest text-[#C4A0AC]">{stat.label}</p>
                 </div>
               ))}
             </div>

             <div className="space-y-4">
               <h3 className="text-[10px] font-black uppercase tracking-widest text-[#C4A0AC]">Your Wellness Recommendations</h3>
               <textarea 
                  rows="6"
                  placeholder="Write your advice here for the Relationship/Mental Health module..."
                  className="w-full p-6 bg-rose-50/20 border border-rose-100 rounded-3xl focus:outline-none focus:ring-2 focus:ring-[#ff69b4]/20 transition-all font-bold text-[#15192c] leading-relaxed"
               ></textarea>
               <button className="w-full py-5 bg-[#ff69b4] text-white rounded-3xl font-black text-[12px] uppercase tracking-widest shadow-xl shadow-rose-200 flex items-center justify-center gap-3">
                  <Send size={18} /> Update Sakhi Advice
               </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StarIcon = ({ size, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

export default AdvisorConsultations;
