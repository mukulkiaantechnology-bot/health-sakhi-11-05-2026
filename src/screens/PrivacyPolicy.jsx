import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, FileText, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PrivacyPolicy = () => {
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
            <div className="w-16 h-16 rounded-2xl bg-[#E91E63]/10 flex items-center justify-center text-[#E91E63]">
              <Lock size={32} />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-serif font-black text-[#4B1E5A]">Privacy Policy</h1>
              <p className="text-[#C69214] font-serif italic text-sm">Last Updated: May 2026</p>
            </div>
          </div>

          <div className="space-y-8 text-[#4B1E5A]/80 leading-relaxed font-medium">
            <section className="space-y-4">
              <h2 className="text-xl font-black text-[#4B1E5A] uppercase tracking-wide flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#E91E63]"></div>
                Introduction
              </h2>
              <p>
                At HealthSakhi, we respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website or use our application.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-black text-[#4B1E5A] uppercase tracking-wide flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#E91E63]"></div>
                Data Collection
              </h2>
              <p>
                We collect information that you provide directly to us when you create an account, participate in our wellness programs, or communicate with us. This may include your name, email address, phone number, and health-related preferences you choose to share.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-black text-[#4B1E5A] uppercase tracking-wide flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#E91E63]"></div>
                How We Use Your Data
              </h2>
              <p>
                Your data is used to provide personalized wellness insights, manage your subscription, and improve our services. We do not sell your personal data to third parties.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-black text-[#4B1E5A] uppercase tracking-wide flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#E91E63]"></div>
                Medical Disclaimer
              </h2>
              <p className="italic bg-rose-50 p-6 rounded-2xl border border-pink-100">
                The information provided by HealthSakhi is for educational and informational purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-black text-[#4B1E5A] uppercase tracking-wide flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#E91E63]"></div>
                Contact Us
              </h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us at hello@healthsakhi.com.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
