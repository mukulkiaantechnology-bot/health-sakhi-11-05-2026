import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import BookReaderModal from '../components/BookReaderModal';
import VideoModal from '../components/VideoModal';

const CompanionIcon = ({ icon, label }) => (
  <div className="flex flex-col items-center gap-4 group cursor-pointer transition-all duration-300">
    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border border-pink-100 bg-white flex items-center justify-center shadow-[0_4px_15px_rgba(233,30,99,0.06)] group-hover:shadow-lg group-hover:scale-110 transition-all duration-500 overflow-hidden">
      <div className="w-8 h-8 sm:w-10 sm:h-10 text-[#E91E63] group-hover:scale-110 transition-transform">
        {icon}
      </div>
    </div>
    <span className="text-[10px] sm:text-[11px] font-black text-[#E91E63] uppercase tracking-widest text-center">{label}</span>
  </div>
);

const LandingPage = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [selectedBook, setSelectedBook] = useState(null);
  const [bookMode, setBookMode] = useState('read');
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  const onSubmit = (data) => {
    console.log('Form submitted:', data);
    alert('Thank you for contacting us! We will get back to you shortly.');
    reset();
  };

  const companionIcons = [
    { label: 'Food', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v10" /><path d="M18.5 17a2.5 2.5 0 0 1-2.5 2.5H8a2.5 2.5 0 0 1-2.5-2.5" /><path d="M12 2l-2 2h4l-2-2z" /></svg> },
    { label: 'Mood', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" /></svg> },
    { label: 'Energy', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg> },
    { label: 'Hormone', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 8v8" /><path d="M8 12h8" /></svg> },
    { label: 'Stress', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 10 10H12V2z" /><path d="M12 12l4.5-4.5" /><circle cx="16.5" cy="7.5" r="1.5" /></svg> },
    { label: 'Sleep', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" /><path d="M19 10.5v3" /><path d="M16 12h6" /></svg> },
    { label: 'Skin', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg> },
    { label: 'Love', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg> },
    { label: 'Care', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.5 19a3.5 3.5 0 1 1 0-7 3.5 3.5 0 1 1 0 7z" /><path d="M12 19h5.5" /><path d="M12 10l3-3-3-3" /><path d="M12 4v11" /></svg> }
  ];

  return (
    <div
      className="w-full min-h-screen relative overflow-hidden font-['Poppins']"
      style={{
        backgroundImage: "url('/Images/WhatsApp Image 2026-05-07 at 2.49.24 PM.jpeg')",
        backgroundAttachment: 'fixed',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >

      {/* Hero Section - fully responsive layout */}
      <section id="home" className="relative w-full lg:h-screen lg:min-h-[850px] flex flex-col pt-20 lg:pt-16 overflow-visible">

        {/* ── Responsive Hero Composition ── */}
        <div className="relative flex-1 w-full max-w-[1280px] mx-auto px-6 lg:px-10 flex flex-col lg:block">

          {/* ── BRAND COLUMN: Logo · Brand · Tagline · Headings · Description · CTAs ── */}
          <div className="flex flex-col items-center text-center lg:absolute lg:left-[1%] lg:top-[40%] lg:-translate-y-1/2 lg:w-[224px] xl:w-[230px] z-20 mt-6 lg:mt-0">

            {/* Lotus Logo */}
            <img
              src="/Images/WhatsApp Image 2026-05-04 at 6.32.54 PM.jpeg"
              alt="HealthSakhi Lotus Logo"
              className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 object-contain drop-shadow-md mb-1"
            />

            {/* Brand Name */}
            <h1
              className="font-serif font-black text-[#4B1E5A] uppercase leading-none mb-0.5"
              style={{ fontSize: 'clamp(1.35rem, 2.5vw, 1.85rem)', letterSpacing: '0.18em' }}
            >
              Health Sakhi
            </h1>

            {/* ─ Wellness Academy tagline with decorative rule ─ */}
            <div className="flex items-center gap-2 w-full justify-center mb-2 max-w-[200px]">
              <div className="h-[1px] flex-1 bg-[#C69214]/50"></div>
              <span className="text-[#C69214] font-serif italic font-semibold text-[10px] lg:text-[11px] whitespace-nowrap">
                ✦ Wellness Academy ✦
              </span>
              <div className="h-[1px] flex-1 bg-[#C69214]/50"></div>
            </div>

            {/* Heart divider */}
            <div className="text-[#E91E63] text-sm mb-2 opacity-80">♥</div>

            {/* ─ Main 3-line headings ─ */}
            <div className="mb-2 leading-tight space-y-[1px]">
              <p className="font-black text-[#2D1B3D] uppercase tracking-widest"
                style={{ fontSize: 'clamp(1.1rem, 2vw, 1.55rem)' }}>
                Gyan Badhao
              </p>
              <p className="font-black text-[#E91E63] uppercase tracking-widest"
                style={{ fontSize: 'clamp(1.1rem, 2vw, 1.55rem)' }}>
                Dhan Kamao
              </p>
              <p className="font-black text-[#2D1B3D] uppercase tracking-widest"
                style={{ fontSize: 'clamp(1.1rem, 2vw, 1.55rem)' }}>
                Learn To Earn
              </p>
            </div>

            {/* Heart divider */}
            <div className="text-[#E91E63] text-sm my-2 opacity-80">♥</div>

            {/* Description */}
            <p className="text-[#4B1E5A]/75 font-medium leading-relaxed mb-4 max-w-[250px] lg:max-w-none"
              style={{ fontSize: 'clamp(0.7rem, 1.2vw, 0.88rem)' }}>
              Join our unique{' '}
              <span className="text-[#E91E63] font-bold">HealthSakhi</span> Program<br />
              and become a Wellness Champion<br />
              to become our Affiliate.
            </p>

            {/* CTA Buttons */}
            <div className="flex items-center gap-2 sm:gap-3 justify-center w-full">
              <button
                onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
                className="flex-1 max-w-[140px] sm:max-w-none sm:px-6 py-2.5 sm:py-3 rounded-full bg-[#E91E63] text-white font-black text-[9px] sm:text-[11px] uppercase tracking-widest shadow-[0_4px_15px_rgba(233,30,99,0.3)] hover:scale-105 transition-all whitespace-nowrap"
              >
                Explore Services
              </button>
              <button
                onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
                className="flex-1 max-w-[140px] sm:max-w-none sm:px-6 py-2.5 sm:py-3 rounded-full border-2 border-[#4B1E5A] bg-white/60 backdrop-blur-sm text-[#4B1E5A] font-black text-[9px] sm:text-[11px] uppercase tracking-widest hover:bg-[#4B1E5A] hover:text-white transition-all whitespace-nowrap"
              >
                Learn More
              </button>
            </div>
          </div>

          {/* ── PHOTO COLUMN: Group Photo ── */}
          <div className="relative lg:absolute lg:left-1/2 lg:-translate-x-1/2 lg:top-10 lg:bottom-[165px] w-full lg:w-[85%] z-10 flex items-end justify-center mt-8 lg:mt-0 pointer-events-none min-h-[300px] lg:min-h-0">
            <img
              src="/Images/9463e621-f694-4e65-b51c-8c53c4bcd51e-removebg-preview.png"
              alt="HealthSakhi Community Women"
              className="w-full h-full max-h-[400px] lg:max-h-none object-contain drop-shadow-2xl"
              style={{ objectPosition: 'center bottom' }}
            />
          </div>

          {/* ── APP COLUMN: Phone Mockup ── */}
          <div className="relative lg:absolute lg:right-[1%] lg:top-[45%] lg:-translate-y-1/2 w-full lg:w-[22%] flex justify-center lg:justify-end z-20 mt-12 lg:mt-0 pb-10 lg:pb-0">
            <div className="relative w-[200px] md:w-[220px] xl:w-[255px]">
              <img
                src="/Images/mobilecard.png"
                alt="HealthSakhi App Mockup"
                className="w-full h-auto drop-shadow-[0_20px_50px_rgba(233,30,99,0.2)] hover:-translate-y-2 transition-transform duration-700"
              />
            </div>
          </div>
        </div>{/* end responsive wrapper */}

        {/* ── Bottom Stats Bar — responsive layout ── */}
        <div className="relative lg:absolute bottom-0 left-0 right-0 lg:h-[165px] z-30 flex items-center px-6 lg:px-16 mt-12 lg:mt-0 pb-12 lg:pb-0">
          <div className="w-full max-w-[1280px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-3 lg:h-[120px]">
            {[
              {
                value: '10,000+',
                label: 'Women Empowered',
                emoji: '👩',
                color: '#E91E63'
              },
              {
                value: '20',
                label: 'Wellness Books',
                emoji: '📚',
                color: '#C69214'
              },
              {
                value: '4',
                label: 'Certification Levels',
                emoji: '🎓',
                color: '#4B1E5A'
              },
              {
                value: '100%',
                label: 'Work From Home',
                emoji: '🏡',
                color: '#E91E63'
              }
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 + idx * 0.1, duration: 0.6 }}
                className="flex items-center gap-4 px-5 py-4 lg:py-3 rounded-2xl bg-white/70 backdrop-blur-md border border-white/60 shadow-[0_4px_20px_rgba(233,30,99,0.06)] hover:bg-white hover:shadow-[0_6px_25px_rgba(233,30,99,0.1)] transition-all duration-300 group"
              >
                <span className="text-3xl lg:text-2xl shrink-0">{stat.emoji}</span>
                <div className="min-w-0">
                  <p
                    className="font-black text-2xl lg:text-xl leading-none"
                    style={{ color: stat.color }}
                  >
                    {stat.value}
                  </p>
                  <p className="text-[11px] lg:text-[10px] font-black text-[#4B1E5A]/60 uppercase tracking-wide leading-tight mt-1 lg:mt-0.5 truncate">
                    {stat.label}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>



      </section>

      {/* Academy Highlights Section */}
      <section id="academy-highlights" className="relative w-full py-[70px] px-6 lg:px-10 flex flex-col items-center overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-[-10%] left-[-5%] w-80 h-80 bg-[#C69214]/5 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-[#ff69b4]/5 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="w-full max-w-[1280px] flex flex-col items-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 space-y-3"
          >
            <span className="text-xs font-black text-[#E91E63] uppercase tracking-[0.3em] opacity-80">HealthSakhi Academy</span>
            <h2 className="text-[#4B1E5A] font-serif font-black text-4xl lg:text-5xl leading-tight">
              Become Certified in Women’s Wellness
            </h2>
            <p className="text-base text-[#4B1E5A]/60 font-medium max-w-2xl mx-auto pt-2 leading-relaxed">
              Empower yourself with trusted knowledge. Learn, grow, and build a fulfilling career by becoming a certified wellness expert.
            </p>
            <div className="flex justify-center mt-4">
              <div className="h-[1px] w-32 bg-[#C69214]/20 rounded-full"></div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full mb-12">
            {[
              {
                title: 'Awareness Courses',
                desc: 'Basic understanding of the female body and wellness.',
                icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>
              },
              {
                title: 'Professional Certifications',
                desc: 'Expert-led programs for in-depth knowledge and practice.',
                icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7" /><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" /></svg>
              },
              {
                title: 'Advanced Diploma',
                desc: 'Comprehensive training for specialized wellness practices.',
                icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></svg>
              },
              {
                title: 'Trainer Programs',
                desc: 'Learn to teach, guide, and build your own wellness community.',
                icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
              }
            ].map((course, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="group p-6 rounded-[2rem] bg-white/65 backdrop-blur-md border border-white/40 hover:bg-white hover:shadow-[0_15px_40px_rgba(233,30,99,0.08)] hover:-translate-y-1 transition-all duration-500 flex flex-col h-full shadow-sm text-center items-center"
              >
                <div className="w-12 h-12 rounded-xl bg-white shadow-sm border border-pink-50 flex items-center justify-center text-[#E91E63] group-hover:bg-[#E91E63] group-hover:text-white transition-all duration-500 mb-4 shrink-0">
                  <div className="w-6 h-6">
                    {course.icon}
                  </div>
                </div>
                <h3 className="text-[#4B1E5A] font-serif font-black text-lg mb-2 leading-tight">{course.title}</h3>
                <p className="text-[#4B1E5A]/60 text-xs font-medium leading-relaxed flex-1">{course.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Link
              to="/login"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-[#E91E63] to-[#FF5E9B] text-white font-black text-[11px] uppercase tracking-widest shadow-[0_8px_25px_rgba(233,30,99,0.3)] hover:scale-105 hover:shadow-[0_12px_35px_rgba(233,30,99,0.45)] transition-all"
            >
              Explore Academy
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5l7 7-7 7" /></svg>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="relative w-full py-[80px] px-6 lg:px-10 flex flex-col items-center overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-[-5%] right-[-5%] w-80 h-80 bg-[#ff69b4]/5 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-[-5%] left-[-5%] w-96 h-96 bg-[#C69214]/5 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="w-full max-w-[1280px] grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center relative z-10">

          {/* ── LEFT: Image ── */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative group order-2 lg:order-1"
          >
            <div className="absolute -inset-4 bg-gradient-to-tr from-[#ff69b4]/10 to-transparent rounded-[3rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <div className="relative rounded-[2.5rem] overflow-hidden shadow-[0_20px_60px_rgba(233,30,99,0.12)] border-4 border-white group-hover:scale-[1.02] transition-transform duration-700">
              <img
                src="/Images/girlsgroup.png"
                alt="HealthSakhi Community"
                className="w-full h-auto object-cover"
              />
            </div>
            {/* Floating stat badge */}
            <div className="absolute -bottom-5 -right-4 bg-white rounded-2xl shadow-[0_8px_30px_rgba(233,30,99,0.12)] border border-pink-50 px-5 py-3 flex items-center gap-3">
              <span className="text-2xl font-black text-[#E91E63]">20+</span>
              <div>
                <p className="text-[10px] font-black text-[#4B1E5A] uppercase tracking-widest leading-none">Wellness</p>
                <p className="text-[10px] font-black text-[#4B1E5A] uppercase tracking-widest leading-none opacity-60">Books</p>
              </div>
            </div>
          </motion.div>

          {/* ── RIGHT: Content ── */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col gap-8 order-1 lg:order-2"
          >
            {/* Heading */}
            <div>
              <span className="text-xs font-black text-[#E91E63] uppercase tracking-[0.3em] opacity-80">Learn to Earn</span>
              <h2 className="text-[#4B1E5A] font-serif font-black text-4xl lg:text-5xl leading-tight mt-2">
                ज्ञान बढ़ाओ,<br />
                <span className="text-[#E91E63]">धन कमाओ</span>
              </h2>
              <div className="h-[3px] w-14 bg-[#C69214]/40 rounded-full mt-4"></div>
            </div>

            {/* Hook text */}
            <p className="text-[#4B1E5A]/70 text-base font-medium leading-relaxed max-w-md">
              What if the knowledge that heals your family could also{' '}
              <span className="text-[#E91E63] font-bold">bring income to your home?</span>{' '}
              You already have what it takes — your care, your empathy, your lived experience.
            </p>

            {/* 3 Pillars */}
            <div className="grid grid-cols-1 gap-3">
              {[
                {
                  emoji: '📚',
                  title: '20 Books — Every Answer',
                  desc: 'Puberty to Menopause · PCOD · Hormones · Mental Health'
                },
                {
                  emoji: '💰',
                  title: 'Affiliate Income — Real Freedom',
                  desc: 'Work from home · No degree needed · Earn while you share'
                },
                {
                  emoji: '🌸',
                  title: 'From Dependent to Independent',
                  desc: 'Build your own income · Empower yourself & others'
                }
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * idx, duration: 0.5 }}
                  className="flex items-start gap-4 p-4 rounded-2xl bg-white/60 backdrop-blur-sm border border-white/70 hover:bg-white hover:shadow-[0_8px_25px_rgba(233,30,99,0.07)] transition-all duration-300 group"
                >
                  <span className="text-2xl shrink-0 mt-0.5">{item.emoji}</span>
                  <div>
                    <p className="text-[#4B1E5A] font-black text-[13px] uppercase tracking-wide">{item.title}</p>
                    <p className="text-[#4B1E5A]/55 text-[12px] font-medium mt-0.5 leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-2">
              <button
                onClick={() => setIsVideoModalOpen(true)}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-[#E91E63] to-[#FF5E9B] text-white font-black text-[11px] uppercase tracking-widest shadow-[0_8px_25px_rgba(233,30,99,0.3)] hover:scale-105 hover:shadow-[0_12px_35px_rgba(233,30,99,0.4)] transition-all"
              >
                👉 Watch Demo Video
              </button>
              <p className="text-[#C69214] font-serif font-semibold italic text-[13px]">
                Welcome to your new life, Sakhi 🌸
              </p>
            </div>

          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="relative w-full py-[70px] px-6 lg:px-10 flex flex-col items-center">
        <div className="w-full max-w-[1280px] flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 space-y-3"
          >
            <span className="text-xs font-black text-[#E91E63] uppercase tracking-[0.3em] opacity-80">HealthSakhi Ecosystem</span>
            <h2 className="text-[#4B1E5A] font-serif font-black text-4xl lg:text-5xl leading-tight">Your Personal Companion</h2>
            <div className="flex justify-center mt-4">
              <div className="h-[1px] w-32 bg-[#C69214]/20 rounded-full"></div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {[
              {
                label: 'Food Sakhi',
                desc: 'Personalized nutrition guidance aligned with your body and lifestyle.',
                icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v10" /><path d="M18.5 17a2.5 2.5 0 0 1-2.5 2.5H8a2.5 2.5 0 0 1-2.5-2.5" /><path d="M12 2l-2 2h4l-2-2z" /></svg>
              },
              {
                label: 'Mood Sakhi',
                desc: 'Gentle emotional support through mindful conversations.',
                icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" /></svg>
              },
              {
                label: 'Energy Sakhi',
                desc: 'Daily practices to restore and sustain your natural energy.',
                icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
              },
              {
                label: 'Hormone Sakhi',
                desc: 'Support for hormonal balance across every life stage.',
                icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 8v8" /><path d="M8 12h8" /></svg>
              },
              {
                label: 'Stress Sakhi',
                desc: 'Calm your mind with simple, proven relaxation techniques.',
                icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 10 10H12V2z" /><path d="M12 12l4.5-4.5" /><circle cx="16.5" cy="7.5" r="1.5" /></svg>
              },
              {
                label: 'Sleep Sakhi',
                desc: 'Improve sleep naturally with guided routines.',
                icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" /><path d="M19 10.5v3" /><path d="M16 12h6" /></svg>
              },
              {
                label: 'Skin Care Sakhi',
                desc: 'Radiance through inner wellness and daily habits.',
                icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
              },
              {
                label: 'Relationship Sakhi',
                desc: 'Build deeper, healthier emotional connections.',
                icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
              },
              {
                label: 'Parenting Sakhi',
                desc: 'Navigate motherhood with clarity, patience, and care.',
                icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.5 19a3.5 3.5 0 1 1 0-7 3.5 3.5 0 1 1 0 7z" /><path d="M12 19h5.5" /><path d="M12 10l3-3-3-3" /><path d="M12 4v11" /></svg>
              }
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{
                  duration: 0.7,
                  delay: i * 0.05,
                  ease: [0.21, 0.47, 0.32, 0.98]
                }}
                onClick={() => navigate('/login')}
                className="group p-8 rounded-[2.5rem] bg-white/65 backdrop-blur-md border border-white/40 hover:bg-white hover:shadow-[0_20px_50px_rgba(233,30,99,0.08)] hover:-translate-y-1.5 transition-all duration-500 cursor-pointer flex flex-col h-full relative overflow-hidden shadow-sm"
              >
                <div className="w-14 h-14 rounded-2xl bg-white shadow-sm border border-pink-50 flex items-center justify-center text-[#E91E63] group-hover:bg-[#E91E63] group-hover:text-white transition-all duration-500 mb-6 shrink-0">
                  <div className="w-7 h-7">
                    {item.icon}
                  </div>
                </div>
                <h3 className="text-[#4B1E5A] font-serif font-black text-xl mb-3 leading-tight">{item.label}</h3>
                <p className="text-[#4B1E5A]/70 text-sm font-medium leading-relaxed mb-6 flex-1">{item.desc}</p>
                <div className="flex items-center gap-2 text-[#E91E63] font-black text-[10px] uppercase tracking-widest group-hover:gap-3 transition-all">
                  Explore More <span>→</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section id="resources" className="relative w-full py-[70px] px-6 lg:px-10 flex flex-col items-center">
        <div className="w-full max-w-[1280px]">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 space-y-3"
          >
            <span className="text-xs font-black text-[#E91E63] uppercase tracking-[0.3em] opacity-80">Knowledge & Learning</span>
            <h2 className="text-[#4B1E5A] font-serif font-black text-4xl lg:text-5xl leading-tight">Library & Learning</h2>
            <h3 className="text-[#C69214] font-serif font-bold text-xl opacity-80">ज्ञान जो जीवन में बदलाव लाए</h3>
            <p className="text-base text-[#4B1E5A]/60 font-medium max-w-2xl mx-auto pt-2 leading-relaxed">
              Explore a growing collection of wellness books and guided learning designed to support every stage of a woman’s journey.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'PCOD Solution',
                desc: 'Understand your body and take control of your cycle.',
                img: '/Images/hunger ChatGPT Image Feb 6, 2026, 10_53_00 PM.png',
                gradient: 'from-amber-50 to-orange-50',
                dummyContent: '<h2>PCOD Solution</h2><p>This is a dummy content for the PCOD Solution book. Real content will be updated soon. PCOD stands for Polycystic Ovarian Disease. It is a common health condition among women of reproductive age. This book offers practical habits, nutrition tips, and lifestyle changes to manage PCOD effectively.</p>'
              },
              {
                title: 'Women’s Wellness',
                desc: 'Everyday habits for balanced living.',
                img: '/Images/heart  ChatGPT Image Feb 7, 2026, 09_46_44 PM.png',
                gradient: 'from-rose-50 to-pink-50',
                fileUrl: '/files/HealthSakhi_Complete_ThreeParts.txt'
              },
              {
                title: 'Motherhood Guide',
                desc: 'Support for every step of your parenting journey.',
                img: '/Images/Gemini_Generated_Image_uw8kj4uw8kj4uw8k.png',
                gradient: 'from-indigo-50 to-blue-50',
                fileUrl: '/files/Beyond_Parenting_HealthSakhi.txt'
              }
            ].map((book, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{
                  duration: 0.8,
                  delay: i * 0.1,
                  ease: [0.21, 0.47, 0.32, 0.98]
                }}
                className="group relative flex flex-col h-full"
              >
                {/* Book Card Main Container */}
                <div className={`flex-1 rounded-[2.5rem] p-7 bg-white/65 backdrop-blur-md border border-white/40 shadow-sm hover:shadow-[0_20px_50px_rgba(233,30,99,0.1)] hover:-translate-y-1.5 transition-all duration-500 flex flex-col overflow-hidden`}>

                  {/* Book Cover Area */}
                  <div className={`relative aspect-[3/4.2] rounded-2xl overflow-hidden mb-6 shadow-inner bg-gradient-to-br ${book.gradient}`}>
                    <img
                      src={book.img}
                      alt={book.title}
                      className="w-full h-full object-cover mix-blend-multiply opacity-90 group-hover:scale-105 transition-transform duration-1000"
                    />
                  </div>

                  {/* Text Content */}
                  <div className="space-y-2 mb-6 flex-1">
                    <h4 className="text-[#4B1E5A] font-serif font-black text-xl group-hover:text-[#E91E63] transition-colors">{book.title}</h4>
                    <p className="text-[#4B1E5A]/60 text-xs font-medium leading-relaxed line-clamp-2">{book.desc}</p>
                  </div>

                  {/* CTA Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => { setSelectedBook(book); setBookMode('read'); }}
                      className="flex-1 py-2.5 rounded-xl bg-[#4B1E5A] text-white font-black text-[9px] uppercase tracking-widest hover:bg-[#E91E63] transition-all shadow-sm">
                      Read
                    </button>
                    <button
                      onClick={() => { setSelectedBook(book); setBookMode('listen'); }}
                      className="flex-1 py-2.5 rounded-xl bg-[#4B1E5A] text-white font-black text-[9px] uppercase tracking-widest hover:bg-[#E91E63] transition-all shadow-sm">
                      Listen
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="relative w-full py-[70px] px-6 lg:px-10 flex flex-col items-center">
        <div className="w-full max-w-[1280px]">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 space-y-3"
          >
            <span className="text-xs font-black text-[#E91E63] uppercase tracking-[0.3em] opacity-80">Community Voices</span>
            <h2 className="text-[#4B1E5A] font-serif font-black text-4xl lg:text-5xl leading-tight">Words from Our Sakhis</h2>
            <p className="text-lg text-[#C69214] font-serif font-bold italic opacity-70">
              "Experience the journey of women who found their lifelong wellness companion."
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: 'Priya Sharma',
                role: 'Mother & Professional',
                quote: 'Finding Food Sakhi was a turning point. I finally understand my body\'s needs without feeling restricted. It\'s truly a companion.',
                img: '/Images/image10.png'
              },
              {
                name: 'Anjali Rao',
                role: 'Entrepreneur',
                quote: 'The Mood Sakhi feature is like having a friend who actually listens without judgment. It helped me manage my stress during growth phases.',
                img: '/Images/image11.png'
              },
              {
                name: 'Meera Kapoor',
                role: 'New Mother',
                quote: 'Motherhood felt overwhelming until I joined this community. The guidance from Motherhood Sakhi is invaluable and so gentle.',
                img: '/Images/image9.png'
              }
            ].map((review, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: i * 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
                className="group relative p-8 rounded-[2.5rem] bg-white/65 backdrop-blur-md border border-white/40 shadow-sm hover:bg-white hover:shadow-[0_20px_50px_rgba(233,30,99,0.08)] transition-all duration-500 flex flex-col h-full overflow-hidden"
              >
                {/* Quote Icon */}
                <div className="absolute top-6 right-8 text-[#E91E63]/5">
                  <svg width="50" height="50" viewBox="0 0 24 24" fill="currentColor"><path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V11C14.017 11.5523 13.5693 12 13.017 12H12.017V5H22.017V15C22.017 18.3137 19.3307 21 16.017 21H14.017ZM2.01697 21L2.01697 18C2.01697 16.8954 2.9124 16 4.01697 16H7.01697C7.56925 16 8.01697 15.5523 8.01697 15V9C8.01697 8.44772 7.56925 8 7.01697 8H3.01697C2.46468 8 2.01697 8.44772 2.01697 9V11C2.01697 11.5523 1.56925 12 1.01697 12H0.0169678V5H10.017V15C10.017 18.3137 7.33068 21 4.01697 21H2.01697Z" /></svg>
                </div>

                <p className="text-[#4B1E5A] font-serif text-lg leading-relaxed mb-8 relative z-10 italic">
                  "{review.quote}"
                </p>

                <div className="mt-auto flex items-center gap-4 relative z-10">
                  <div className="w-12 h-12 rounded-xl overflow-hidden border border-white shadow-sm group-hover:scale-105 transition-transform duration-500">
                    <img src={review.img} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="text-[#4B1E5A] font-black text-xs uppercase tracking-widest">{review.name}</h4>
                    <p className="text-[#E91E63] font-bold text-[9px] uppercase tracking-widest opacity-60">{review.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section id="blog" className="relative w-full py-[70px] px-6 lg:px-10 flex flex-col items-center">
        <div className="w-full max-w-[1280px]">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-12 space-y-3"
          >
            <span className="text-xs font-black text-[#E91E63] uppercase tracking-[0.3em] opacity-80">Wellness Insights</span>
            <h2 className="text-[#4B1E5A] font-serif font-black text-4xl lg:text-5xl leading-tight">The Sakhi Journal</h2>
            <p className="text-[#C69214] font-serif font-bold text-xl opacity-80">Simple, thoughtful insights for everyday wellness</p>
            <div className="flex justify-center mt-6">
              <div className="h-[1px] w-24 bg-[#C69214]/20 rounded-full"></div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: 'Ayurvedic Habits for Morning Energy',
                desc: 'Start your day with small rituals that bring lasting energy.',
                date: 'April 2025',
                img: '/Images/ayurvedic.png',
                tag: 'Wellness'
              },
              {
                title: 'The Silent Impact of Stress on Hormones',
                desc: 'Understand how stress shapes your body and mind.',
                date: 'April 2025',
                img: '/Images/silent.png',
                tag: 'Health'
              }
            ].map((post, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, delay: i * 0.1 }}
                className="group flex flex-col bg-white/65 backdrop-blur-md rounded-[2.5rem] overflow-hidden border border-white/40 hover:bg-white hover:shadow-[0_20px_50px_rgba(233,30,99,0.08)] transition-all duration-700 cursor-pointer relative shadow-sm"
              >
                {/* Image Container 16:9 */}
                <div className="w-full aspect-video overflow-hidden relative">
                  <img src={post.img} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                  <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[9px] font-black text-[#E91E63] uppercase tracking-widest shadow-sm">
                    {post.tag}
                  </div>
                </div>

                {/* Content Area */}
                <div className="p-8 space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-[9px] font-black text-[#C69214] uppercase tracking-widest">{post.date}</p>
                    <div className="w-1.5 h-1.5 rounded-full bg-[#E91E63]/20 group-hover:bg-[#E91E63] transition-colors"></div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-[#4B1E5A] font-serif font-black text-xl leading-tight group-hover:text-[#E91E63] transition-colors">{post.title}</h4>
                    <p className="text-[#4B1E5A]/60 text-sm font-medium leading-relaxed line-clamp-2">{post.desc}</p>
                  </div>
                  <div
                    onClick={() => navigate('/login')}
                    className="flex items-center gap-2 text-[#E91E63] font-black text-[10px] uppercase tracking-widest pt-4 border-t border-[#4B1E5A]/5 group-hover:gap-3 transition-all"
                  >
                    Read More <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* Contact Section */}
      <section id="contact" className="relative w-full py-[70px] px-6 lg:px-10 flex flex-col items-center">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#ff69b4]/5 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#C69214]/5 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="w-full max-w-[1280px] grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center relative z-10 px-4">
          {/* Left Side: Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <span className="text-xs font-black text-[#E91E63] uppercase tracking-[0.3em] opacity-80">Connect With Us</span>
              <h2 className="text-[#4B1E5A] font-serif font-black text-4xl lg:text-5xl leading-tight">Start Your Wellness Journey</h2>
              <p className="text-[#4B1E5A]/70 text-lg font-medium leading-relaxed max-w-md opacity-80">
                Have questions or need guidance? We’re here to support you — gently and privately.
              </p>
            </div>

            {/* Trust Note Box */}
            <div className="p-6 rounded-[2rem] bg-white/50 backdrop-blur-md border border-white shadow-sm space-y-3 max-w-xs">
              <div className="flex items-center gap-3 text-[#E91E63]">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                <span className="font-black text-[10px] uppercase tracking-widest">Safe & Secure</span>
              </div>
              <p className="text-[#4B1E5A]/80 text-xs font-bold leading-relaxed">
                Your information stays private. We never share your data.
              </p>
            </div>
          </motion.div>

          {/* Right Side: Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-white/70 backdrop-blur-xl p-8 lg:p-10 rounded-[3rem] border border-white shadow-[0_20px_60px_rgba(233,30,99,0.06)]"
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#4B1E5A] uppercase tracking-widest ml-1 opacity-70">YOUR NAME</label>
                <input
                  {...register('fullName', { required: true })}
                  type="text"
                  className="w-full h-14 px-6 bg-white rounded-2xl border-2 border-[#4B1E5A]/20 focus:border-[#4B1E5A] outline-none transition-all font-bold text-sm text-[#4B1E5A]"
                  placeholder="Priya Sharma"
                />
                {errors.fullName && <span className="text-red-500 text-[10px] ml-1 font-bold">This field is required</span>}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#4B1E5A] uppercase tracking-widest ml-1 opacity-70">EMAIL ADDRESS</label>
                <input
                  {...register('email', { required: true, pattern: /^\S+@\S+$/i })}
                  type="email"
                  className="w-full h-14 px-6 bg-white rounded-2xl border-2 border-[#4B1E5A]/20 focus:border-[#4B1E5A] outline-none transition-all font-bold text-sm text-[#4B1E5A]"
                  placeholder="priya@example.com"
                />
                {errors.email && <span className="text-red-500 text-[10px] ml-1 font-bold">Valid email is required</span>}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#4B1E5A] uppercase tracking-widest ml-1 opacity-70">MESSAGE</label>
                <textarea
                  {...register('message', { required: true })}
                  className="w-full h-32 p-6 bg-white rounded-2xl border-2 border-[#4B1E5A]/20 focus:border-[#4B1E5A] outline-none transition-all font-bold text-sm text-[#4B1E5A] resize-none"
                  placeholder="How can we help?"
                ></textarea>
                {errors.message && <span className="text-red-500 text-[10px] ml-1 font-bold">Message is required</span>}
              </div>

              <button
                type="submit"
                className="w-full py-5 bg-[#E91E63] text-white rounded-full font-black text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-pink-100 hover:scale-[1.02] hover:shadow-2xl hover:shadow-pink-200 transition-all duration-300 flex items-center justify-center gap-3 group"
              >
                Send Message
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="relative w-full py-12 px-6 lg:px-10 overflow-hidden bg-white/50 backdrop-blur-md">
        <div className="w-full max-w-[1280px] mx-auto relative z-10">
          <div className="w-full h-[1px] bg-[#4B1E5A] opacity-10 rounded-full mb-10"></div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex flex-col md:flex-row items-center gap-6 text-[#4B1E5A] font-black text-xs">
              <div className="flex items-center gap-2.5 opacity-80 hover:opacity-100 transition-opacity cursor-pointer">
                <div className="w-8 h-8 rounded-full bg-[#E91E63]/10 flex items-center justify-center text-[#E91E63]">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                </div>
                <span>hello@healthsakhi.com</span>
              </div>
              <div className="flex items-center gap-2.5 opacity-80 hover:opacity-100 transition-opacity cursor-pointer">
                <div className="w-8 h-8 rounded-full bg-[#E91E63]/10 flex items-center justify-center text-[#E91E63]">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                </div>
                <span>+91 800-123-4567</span>
              </div>
            </div>

            <div className="flex items-center gap-6">
              {['Privacy', 'Terms', 'Contact'].map(link => {
                if (link === 'Contact') {
                  return (
                    <button
                      key={link}
                      onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                      className="text-[10px] font-black text-[#4B1E5A] uppercase tracking-widest opacity-60 hover:opacity-100 hover:text-[#E91E63] transition-all"
                    >
                      {link}
                    </button>
                  );
                }
                return (
                  <Link key={link} to={`/${link.toLowerCase()}`} className="text-[10px] font-black text-[#4B1E5A] uppercase tracking-widest opacity-60 hover:opacity-100 hover:text-[#E91E63] transition-all">
                    {link}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="mt-10 text-center">
            <p className="text-[9px] font-black text-[#4B1E5A] opacity-30 uppercase tracking-[0.3em]">
              © 2026 HEALTHSAKHI WELLNESS. ALL RIGHTS RESERVED.
            </p>
          </div>
        </div>
      </footer>

      {/* Global Style for Animations */}
      <BookReaderModal
        isOpen={!!selectedBook}
        onClose={() => setSelectedBook(null)}
        book={selectedBook}
        initialMode={bookMode}
      />
      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
      />
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-float { animation: float 5s ease-in-out infinite; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
};

export default LandingPage;
