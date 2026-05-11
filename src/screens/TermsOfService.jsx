import React from 'react';
import { motion } from 'framer-motion';
import { FileText, CheckCircle, AlertTriangle, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TermsOfService = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FFF7F8] py-20 px-6 font-['Poppins']">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-[#E91E63] font-black text-xs uppercase tracking-widest mb-12 hover:gap-3 transition-all"
        >
          <ChevronLeft size={16} /> Back to Home
        </button>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-xl rounded-[3rem] p-8 md:p-16 border border-white shadow-2xl shadow-pink-100/50"
        >
          <div className="flex items-center gap-4 mb-10">
            <div className="w-16 h-16 rounded-2xl bg-[#C69214]/10 flex items-center justify-center text-[#C69214]">
              <FileText size={32} />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-serif font-black text-[#4B1E5A]">Terms of Service</h1>
              <p className="text-[#C69214] font-serif italic text-sm">Last Updated: May 2026</p>
            </div>
          </div>

          <div className="space-y-8 text-[#4B1E5A]/80 leading-relaxed font-medium">
            <section className="space-y-4">
              <h2 className="text-xl font-black text-[#4B1E5A] uppercase tracking-wide flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#C69214]"></div>
                Agreement to Terms
              </h2>
              <p>
                By accessing or using HealthSakhi, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the service.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-black text-[#4B1E5A] uppercase tracking-wide flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#C69214]"></div>
                Use of Service
              </h2>
              <p>
                Our service provides wellness information and community support. You agree to use the service only for lawful purposes and in a way that does not infringe the rights of others.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-black text-[#4B1E5A] uppercase tracking-wide flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#C69214]"></div>
                App Disclaimer
              </h2>
              <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100 space-y-3">
                <p className="font-bold text-[#C69214] flex items-center gap-2">
                  <AlertTriangle size={18} /> IMPORTANT LEGAL NOTICE
                </p>
                <p>
                  HealthSakhi is written for information and education as well as for emotional reflection, personal awareness, and relationship understanding. It is not a substitute for professional counselling, couples therapy, psychological treatment, legal advice, or medical care.
                </p>
                <p>
                  The stories, names, and characters in our content are entirely fictional and created for educational and emotional illustration only. Any resemblance to real persons, living or dead, is purely coincidental.
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-black text-[#4B1E5A] uppercase tracking-wide flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#C69214]"></div>
                Intellectual Property
              </h2>
              <p>
                Copyright belongs to HealthSakhi and its contributors. All rights reserved. No part of our publication, website, or app content may be reproduced without prior written permission.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-black text-[#4B1E5A] uppercase tracking-wide flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#C69214]"></div>
                Limitation of Liability
              </h2>
              <p>
                The author, publisher, and distributor expressly disclaim all liability for any harm arising from the use or application of ideas within HealthSakhi. Every wellness journey is unique.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TermsOfService;
