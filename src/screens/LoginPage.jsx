import React, { useEffect, useMemo, useState } from 'react';
import { Heart, ArrowRight, User, ShieldCheck, Share2, Stethoscope, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { defaultPlans, MEMBER_PLAN_KEY, PLAN_STORAGE_KEY } from '../data/planCatalog';
import { APPROVED_MEMBERS_KEY, PENDING_SIGNUPS_KEY, getApprovedMembers, readJsonArray, writeJsonArray } from '../data/memberOnboarding';

const LoginPage = () => {
  const [authMode, setAuthMode] = useState('login');
  const [role, setRole] = useState('user');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [signupForm, setSignupForm] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    plan: 'Free Sakhi',
    isAgreed: false
  });
  const navigate = useNavigate();

  const planOptions = useMemo(() => {
    let source = defaultPlans;
    try {
      const savedPlans = localStorage.getItem(PLAN_STORAGE_KEY);
      source = savedPlans ? JSON.parse(savedPlans) : defaultPlans;
    } catch (error) {
      source = defaultPlans;
    }
    return source.filter((p) => p.status === 'Active').map((p) => p.name);
  }, []);

  useEffect(() => {
    const selectedPlanId = localStorage.getItem(MEMBER_PLAN_KEY);
    const savedPlans = readJsonArray(PLAN_STORAGE_KEY);
    const plans = savedPlans.length > 0 ? savedPlans : defaultPlans;
    const selectedPlan = plans.find((plan) => plan.id === selectedPlanId);
    if (selectedPlan?.name) {
      setSignupForm((prev) => ({ ...prev, plan: selectedPlan.name }));
    } else if (planOptions[0]) {
      setSignupForm((prev) => ({ ...prev, plan: planOptions[0] }));
    }
  }, [planOptions]);

  const handleContinue = (e) => {
    e.preventDefault();
    setFeedback('');

    if (!email.includes('@') || password.length < 4) {
      setFeedback('Valid email and password required.');
      return;
    }

    if (role === 'user') {
      const members = getApprovedMembers();
      const member = members.find((m) => m.email.toLowerCase() === email.toLowerCase() && m.password === password && m.status === 'Active');
      if (!member) {
        setFeedback('Member is not approved yet or credentials are invalid.');
        return;
      }
      sessionStorage.setItem('hs_current_member', JSON.stringify({ name: member.name, email: member.email }));
    } else {
      const expected = demoCredentials[role];
      if (!expected || expected.email !== email.toLowerCase() || expected.password !== password) {
        setFeedback('Demo credentials mismatch. Admin: admin@healthsakhi.in / admin123');
        return;
      }
    }

    sessionStorage.setItem('temp_role', role);
    navigate('/otp');
  };

  const handleSignup = (e) => {
    e.preventDefault();
    setFeedback('');

    const { name, phone, email: signupEmail, password: signupPassword, plan, isAgreed } = signupForm;
    if (!name || !phone || !signupEmail.includes('@') || signupPassword.length < 4 || !plan) {
      setFeedback('Please fill all signup fields with valid values.');
      return;
    }

    if (!isAgreed) {
      setFeedback('Please agree to the Terms of Service and Privacy Policy to continue.');
      return;
    }

    const pending = readJsonArray(PENDING_SIGNUPS_KEY);
    const approved = readJsonArray(APPROVED_MEMBERS_KEY);
    const emailExists = [...pending, ...approved].some((u) => u.email.toLowerCase() === signupEmail.toLowerCase());
    if (emailExists) {
      setFeedback('This email is already registered or has a pending request.');
      return;
    }

    const request = {
      id: `REQ-${Date.now()}`,
      user: name,
      email: signupEmail.toLowerCase(),
      phone,
      password: signupPassword,
      plan,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      status: 'Pending'
    };

    writeJsonArray(PENDING_SIGNUPS_KEY, [request, ...pending]);
    setFeedback('Signup request submitted successfully. You can log in after admin approval.');
    setEmail(signupEmail.toLowerCase());
    setPassword(signupPassword);
    setAuthMode('login');
  };

  const roles = [
    { id: 'user', name: 'Member', icon: User, color: '#ff69b4' },
    { id: 'advisor', name: 'Advisor', icon: Stethoscope, color: '#ff69b4' },
    { id: 'admin', name: 'Admin', icon: ShieldCheck, color: '#15192c' },
    { id: 'affiliate', name: 'Partner', icon: Share2, color: '#15192c' },
  ];

  const demoCredentials = {
    user: { email: 'member@gmail.com', password: 'member123' },
    admin: { email: 'admin@healthsakhi.in', password: 'admin123' },
    advisor: { email: 'advisor@healthsakhi.in', password: 'advisor123' },
    affiliate: { email: 'partner@healthsakhi.in', password: 'partner123' }
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
        animate={{ scale: [1.2, 1, 1.2], rotate: [0, -90, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] blur-[120px] rounded-full opacity-30" 
        style={{ background: '#F5B4BC' }}
      ></motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-sm w-full mx-4 relative z-10"
      >
        <div className="bg-white p-8 md:p-10 rounded-[3rem] shadow-2xl shadow-[#ff69b4]/5 border" style={{ borderColor: '#F5E6EA' }}>
          {/* Logo */}
          <div className="text-center mb-8">
            <motion.div 
              whileHover={{ scale: 1.1, rotate: 10 }}
              className="w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-white mx-auto mb-4 shadow-xl shadow-[#ff69b4]/20 transition-all" 
              style={{ background: '#ff69b4' }}
            >
              <Heart size={28} fill="currentColor" />
            </motion.div>
            <h1 className="text-2xl font-black tracking-tight" style={{ color: '#15192c' }}>HealthSakhi</h1>
            <p className="font-bold text-[10px] mt-1 uppercase tracking-widest" style={{ color: '#C4A0AC' }}>Trusted Wellness Companion</p>
          </div>

          <div className="flex bg-rose-50/50 p-1 rounded-2xl mb-5 border" style={{ borderColor: '#F5E6EA' }}>
            {['login', 'signup'].map((mode) => (
              <button
                key={mode}
                onClick={() => setAuthMode(mode)}
                className={`flex-1 py-3 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all ${authMode === mode ? 'bg-white text-[#15192c] shadow-sm border' : 'text-[#C4A0AC]'}`}
                style={{ borderColor: '#F5E6EA' }}
              >
                {mode}
              </button>
            ))}
          </div>

          {authMode === 'login' && (
            <div className="flex bg-rose-50/50 p-1 rounded-2xl mb-8 border" style={{ borderColor: '#F5E6EA' }}>
              {roles.map((r) => {
                const isActive = role === r.id;
                return (
                  <button
                    key={r.id}
                    onClick={() => {
                      setRole(r.id);
                      setFeedback('');
                      const creds = demoCredentials[r.id];
                      if (creds) {
                        setEmail(creds.email);
                        setPassword(creds.password);
                      }
                    }}
                    className={`flex-1 flex flex-col items-center gap-1.5 py-3 rounded-xl transition-all relative ${isActive ? 'text-[#15192c]' : 'text-[#C4A0AC]'}`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeRole"
                        className="absolute inset-0 bg-white rounded-xl shadow-md border"
                        style={{ borderColor: '#F5E6EA' }}
                      />
                    )}
                    <span className="relative z-10"><r.icon size={16} style={{ color: isActive ? r.color : undefined }} /></span>
                    <span className="relative z-10 text-[8px] font-black uppercase tracking-widest">{r.name}</span>
                  </button>
                );
              })}
            </div>
          )}

          {authMode === 'login' ? (
            <form onSubmit={handleContinue} className="space-y-4">
              <input
                type="email"
                required
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                className="w-full h-14 px-5 rounded-2xl border bg-rose-50/20 focus:bg-white focus:shadow-xl outline-none transition-all text-xs font-bold shadow-inner"
                style={{ borderColor: '#F5E6EA' }}
              />
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full h-14 px-5 pr-12 rounded-2xl border bg-rose-50/20 focus:bg-white focus:shadow-xl outline-none transition-all text-xs font-bold shadow-inner"
                  style={{ borderColor: '#F5E6EA' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#C4A0AC] hover:text-[#ff69b4] transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full py-5 text-[11px] font-black uppercase tracking-[0.3em] text-white rounded-[2rem] shadow-2xl transition-all flex items-center justify-center gap-3"
                style={{ background: '#ff69b4' }}
              >
                Access Portal
                <ArrowRight size={18} />
              </motion.button>
            </form>
          ) : (
            <form onSubmit={handleSignup} className="space-y-3">
              <input type="text" required value={signupForm.name} onChange={(e) => setSignupForm((p) => ({ ...p, name: e.target.value }))} placeholder="Full Name" className="w-full h-12 px-4 rounded-xl border bg-rose-50/20 text-xs font-bold" style={{ borderColor: '#F5E6EA' }} />
              <input type="text" required value={signupForm.phone} onChange={(e) => setSignupForm((p) => ({ ...p, phone: e.target.value }))} placeholder="Phone Number" className="w-full h-12 px-4 rounded-xl border bg-rose-50/20 text-xs font-bold" style={{ borderColor: '#F5E6EA' }} />
              <input type="email" required value={signupForm.email} onChange={(e) => setSignupForm((p) => ({ ...p, email: e.target.value.toLowerCase() }))} placeholder="Email Address" className="w-full h-12 px-4 rounded-xl border bg-rose-50/20 text-xs font-bold" style={{ borderColor: '#F5E6EA' }} />
              <div className="relative">
                <input
                  type={showSignupPassword ? 'text' : 'password'}
                  required
                  value={signupForm.password}
                  onChange={(e) => setSignupForm((p) => ({ ...p, password: e.target.value }))}
                  placeholder="Password"
                  className="w-full h-12 px-4 pr-10 rounded-xl border bg-rose-50/20 text-xs font-bold"
                  style={{ borderColor: '#F5E6EA' }}
                />
                <button
                  type="button"
                  onClick={() => setShowSignupPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#C4A0AC] hover:text-[#ff69b4] transition-colors"
                  aria-label={showSignupPassword ? 'Hide password' : 'Show password'}
                >
                  {showSignupPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              <select value={signupForm.plan} onChange={(e) => setSignupForm((p) => ({ ...p, plan: e.target.value }))} className="w-full h-12 px-4 rounded-xl border bg-rose-50/20 text-xs font-bold" style={{ borderColor: '#F5E6EA' }}>
                {planOptions.map((plan) => <option key={plan} value={plan}>{plan}</option>)}
              </select>

              {/* Agreement Checkbox */}
              <div className="flex items-start gap-3 py-2 px-1">
                <div className="relative flex items-center h-5">
                  <input
                    id="terms-checkbox"
                    type="checkbox"
                    checked={signupForm.isAgreed}
                    onChange={(e) => setSignupForm(p => ({ ...p, isAgreed: e.target.checked }))}
                    className="w-4 h-4 rounded border-[#F5E6EA] text-[#ff69b4] focus:ring-[#ff69b4] cursor-pointer"
                  />
                </div>
                <label htmlFor="terms-checkbox" className="text-[10px] font-bold text-[#C4A0AC] leading-tight cursor-pointer">
                  I have read and agree to the{' '}
                  <button type="button" onClick={() => navigate('/terms')} className="text-[#ff69b4] hover:underline">Terms of Service</button>
                  {' '}and{' '}
                  <button type="button" onClick={() => navigate('/privacy')} className="text-[#ff69b4] hover:underline">Privacy Policy</button>
                </label>
              </div>

              <motion.button 
                whileHover={signupForm.isAgreed ? { scale: 1.02 } : {}} 
                whileTap={signupForm.isAgreed ? { scale: 0.98 } : {}} 
                type="submit" 
                disabled={!signupForm.isAgreed}
                className={`w-full py-4 text-[11px] font-black uppercase tracking-[0.3em] text-white rounded-[2rem] shadow-2xl transition-all flex items-center justify-center gap-3 ${!signupForm.isAgreed ? 'opacity-40 grayscale cursor-not-allowed' : ''}`} 
                style={{ background: '#15192c' }}
              >
                Create Signup Request
              </motion.button>
            </form>
          )}

          {feedback && (
            <p className="text-[10px] font-bold mt-4 text-center" style={{ color: '#D17B88' }}>{feedback}</p>
          )}
        </div>
      </motion.div>
      
      <p className="absolute bottom-10 left-1/2 -translate-x-1/2 text-[10px] font-black uppercase tracking-[0.6em] z-10 text-center w-full opacity-40" style={{ color: '#C4A0AC' }}>
        HEALTHSAKHI GLOBAL NODES
      </p>
    </div>
  );
};

export default LoginPage;

