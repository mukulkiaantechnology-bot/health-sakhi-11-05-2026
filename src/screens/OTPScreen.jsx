import React, { useState, useRef, useEffect } from 'react';
import { Heart, ArrowLeft, ShieldCheck, Smartphone, RefreshCw, Key } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const OTPScreen = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const inputs = useRef([]);
  const navigate = useNavigate();

  useEffect(() => {
    let interval;
    if (timer > 0 && !canResend) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer, canResend]);

  const handleChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Focus next input
    if (value !== '' && index < 5) {
      inputs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  const handleResend = () => {
    setTimer(30);
    setCanResend(false);
    setOtp(['', '', '', '', '', '']);
    inputs.current[0].focus();
  };

  const handleVerify = () => {
    if (otp.every(v => v !== '')) {
      const role = sessionStorage.getItem('temp_role') || 'user';
      if (role === 'admin') {
        navigate('/admin');
      } else if (role === 'advisor') {
        navigate('/advisor');
      } else if (role === 'affiliate') {
        navigate('/affiliate');
      } else {
        navigate('/welcome');
      }
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden font-sans" style={{ background: '#FFF7F8' }}>
      {/* Background Gradients */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] blur-[140px] rounded-full opacity-20" 
        style={{ background: '#ff69b4' }}
      ></motion.div>
      <motion.div 
        animate={{ scale: [1.3, 1, 1.3], rotate: [0, -90, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] blur-[120px] rounded-full opacity-30" 
        style={{ background: '#F5B4BC' }}
      ></motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-md w-full mx-4 relative z-10"
      >
        <div className="bg-white p-10 md:p-14 rounded-[4rem] shadow-2xl shadow-[#ff69b4]/5 border" style={{ borderColor: '#F5E6EA' }}>
          <button 
            onClick={() => navigate('/login')}
            className="group flex items-center gap-2 text-[#C4A0AC] hover:text-[#ff69b4] transition-all mb-10 font-black text-[10px] uppercase tracking-widest"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Role
          </button>

          <div className="text-center mb-10">
            <motion.div 
              whileHover={{ scale: 1.1, rotate: -10 }}
              className="w-20 h-20 rounded-[2rem] flex items-center justify-center text-white mx-auto mb-8 shadow-xl shadow-[#ff69b4]/20"
              style={{ background: '#ff69b4' }}
            >
              <Key size={36} />
            </motion.div>
            <h2 className="text-3xl font-black text-[#15192c] mb-3 tracking-tight">Security Check</h2>
            <p className="text-[#9A8A8E] font-medium leading-relaxed italic text-sm">
              "We've sent a unique passkey to your verified email node."
            </p>
          </div>

          <div className="flex justify-between gap-3 mb-10 text-[10px]">
            {otp.map((digit, index) => (
              <motion.input
                key={index}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                ref={(el) => (inputs.current[index] = el)}
                type="text"
                maxLength={1}
                autoFocus={index === 0}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-full aspect-square text-center text-2xl font-black rounded-2xl border bg-rose-50/20 focus:bg-white focus:shadow-xl focus:border-[#ff69b4] outline-none transition-all shadow-inner"
                style={{ borderColor: '#F5E6EA' }}
              />
            ))}
          </div>

          <div className="space-y-6">
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleVerify}
              disabled={otp.some(v => v === '')}
              className="w-full py-6 text-[12px] font-black uppercase tracking-[0.3em] text-white rounded-[2.5rem] shadow-2xl transition-all disabled:grayscale disabled:opacity-30 disabled:shadow-none flex items-center justify-center"
              style={{ background: '#15192c' }}
            >
              Unlock Access
            </motion.button>

            <div className="flex items-center justify-center pt-2">
              {canResend ? (
                <button 
                  onClick={handleResend} 
                  className="flex items-center gap-3 px-6 py-3 bg-rose-50 rounded-2xl text-[10px] font-black uppercase tracking-widest text-[#ff69b4] hover:bg-[#ff69b4] hover:text-white transition-all shadow-sm"
                >
                  <RefreshCw size={14} />
                  Resend Key
                </button>
              ) : (
                <div className="px-6 py-3 bg-rose-50/50 rounded-2xl text-[10px] font-black text-[#C4A0AC] uppercase tracking-[0.2em]">
                  Resend in {timer < 10 ? `0${timer}` : timer}s
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
      
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-3 opacity-40">
         <ShieldCheck size={16} className="text-[#ff69b4]"/>
         <span className="text-[10px] font-black uppercase tracking-[0.6em] text-[#C4A0AC] leading-none">High Security Protocol</span>
      </div>
    </div>
  );
};

export default OTPScreen;

