import React, { useState, useMemo } from 'react';
import {
  Settings, CreditCard, History, Bookmark, LogOut, ChevronRight,
  Shield, Award, Star, Flame, User, Users, ShieldCheck, DollarSign,
  Zap, Bell, Calendar, Camera
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const ProfileScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const fileInputRef = React.useRef(null);

  // Detect role from URL
  const role = useMemo(() => {
    if (location.pathname.startsWith('/admin')) return 'admin';
    if (location.pathname.startsWith('/advisor')) return 'advisor';
    if (location.pathname.startsWith('/affiliate')) return 'partner';
    return 'member';
  }, [location.pathname]);

  const [profileData, setProfileData] = useState({
    name: role === 'member' ? 'HealthSakhi' : (role === 'admin' ? 'Admin User' : (role === 'advisor' ? 'Dr. Sakshi Sharma' : 'Sakhi Partner')),
    email: role === 'member' ? 'user@healthsakhi.in' : (role === 'admin' ? 'admin@healthsakhi.in' : (role === 'advisor' ? 'dr.sakshi@healthsakhi.in' : 'partner@healthsakhi.in')),
    phone: '+91 98765 43210',
    bio: role === 'member' ? 'Wellness enthusiast.' : (role === 'admin' ? 'System Administrator for HealthSakhi platform.' : 'Dedicated wellness advisor specializing in holistic health.')
  });

  // Role-specific configurations
  const config = useMemo(() => {
    const configs = {
      member: {
        badge: 'Premium Member',
        stats: [
          { label: 'Wellness Journey', value: '72%', icon: Flame },
          { label: 'Total Sessions', value: '18', icon: Star },
          { label: 'Modules Done', value: '5', icon: Bookmark },
        ],
        menuItems: [
          { title: 'Saved Wellness Modules', icon: Bookmark, count: '12' },
          { title: 'Journey History', icon: History, count: '24 days' },
          { title: 'Mood Insights', icon: Star, count: 'Weekly' },
          { title: 'Subscription & Billing', icon: CreditCard, count: 'Active' },
        ],
        heading: 'My Activity & Billing',
        showMembership: true
      },
      admin: {
        badge: 'System Administrator',
        stats: [
          { label: 'Total Users', value: '1,280', icon: Users },
          { label: 'Active Plans', value: '450', icon: ShieldCheck },
          { label: 'Revenue (MTD)', value: '₹4.2L', icon: DollarSign },
        ],
        menuItems: [
          { title: 'System Settings', icon: Settings },
          { title: 'Security Logs', icon: Shield },
          { title: 'API Management', icon: Zap },
          { title: 'Notification Center', icon: Bell },
        ],
        heading: 'Administrative Controls',
        showMembership: false
      },
      advisor: {
        badge: 'Wellness Advisor',
        stats: [
          { label: 'My Patients', value: '42', icon: Users },
          { label: 'Total Sessions', value: '156', icon: Calendar },
          { label: 'Expert Rating', value: '4.9', icon: Star },
        ],
        menuItems: [
          { title: 'Professional Bio', icon: Award },
          { title: 'Consultation Rates', icon: DollarSign },
          { title: 'Work Availability', icon: Calendar },
          { title: 'Payments & Payouts', icon: CreditCard },
        ],
        heading: 'Advisor Settings',
        showMembership: false
      },
      partner: {
        badge: 'Growth Affiliate',
        stats: [
          { label: 'Total Referrals', value: '85', icon: Users },
          { label: 'Wallet Balance', value: '₹12,400', icon: DollarSign },
          { label: 'Conversion Rate', value: '12%', icon: Flame },
        ],
        menuItems: [
          { title: 'Payout Settings', icon: CreditCard },
          { title: 'Referral Reports', icon: History },
          { title: 'Marketing Kit', icon: Star },
          { title: 'Legal & Tax', icon: Shield },
        ],
        heading: 'Partner Preferences',
        showMembership: false
      }
    };
    return configs[role] || configs.member;
  }, [role]);

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/');
  };

  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically send profileData and profileImage to the backend
  };

  const handleImageClick = () => {
    if (isEditing && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-20 px-2 lg:px-0 mt-4">

      {/* ── Profile Header ── */}
      <div className="bg-white rounded-[2.5rem] p-8 md:p-12 mb-12 shadow-sm border relative" style={{ borderColor: '#F5E6EA' }}>
        <button
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          className="absolute top-8 right-8 px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all shadow-sm"
          style={{
            background: isEditing ? '#15192c' : '#FFF7F8',
            color: isEditing ? '#FFF' : '#ff69b4',
            border: isEditing ? 'none' : '1px solid #F5E6EA'
          }}
        >
          {isEditing ? 'Save Changes' : 'Edit Profile'}
        </button>

        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
          <div className="relative shrink-0">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              className="hidden"
              accept="image/*"
            />
            <div 
              className={`w-28 h-28 lg:w-32 lg:h-32 rounded-3xl overflow-hidden border-4 border-white shadow-xl relative z-10 mx-auto ${isEditing ? 'cursor-pointer group' : ''}`}
              onClick={handleImageClick}
            >
              <img
                src={profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(profileData.name)}&background=FDEEF1&color=C4607A&bold=true&size=128`}
                alt={profileData.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              {isEditing && (
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera size={24} className="text-white" />
                </div>
              )}
            </div>
            <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-xl bg-white shadow-lg flex items-center justify-center z-20 border border-rose-50">
              < Award size={20} style={{ color: '#ff69b4' }} />
            </div>
          </div>

          <div className="flex-1 w-full space-y-4">
            {!isEditing ? (
              <>
                <div>
                  <h1 className="text-3xl font-black mb-1 tracking-tight" style={{ color: '#15192c' }}>{profileData.name} 🌸</h1>
                  <p className="text-xs font-black uppercase tracking-[0.2em] mb-4" style={{ color: '#C4A0AC' }}>{config.badge}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-bold flex items-center gap-3" style={{ color: '#6B5E63' }}><User size={16} className="text-[#C4A0AC]" /> {profileData.email}</p>
                  <p className="text-sm font-bold flex items-center gap-3" style={{ color: '#6B5E63' }}><Settings size={16} className="text-[#C4A0AC]" /> {profileData.phone}</p>
                </div>
                <p className="text-sm font-medium leading-relaxed mt-4 max-w-lg" style={{ color: '#9A8A8E' }}>
                  {profileData.bio}
                </p>
              </>
            ) : (
              <div className="space-y-4 w-full max-w-lg mt-2">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] mb-1" style={{ color: '#C4A0AC' }}>Full Name</label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={e => setProfileData({ ...profileData, name: e.target.value })}
                    className="w-full h-12 px-4 rounded-xl border focus:border-[#ff69b4] focus:ring-2 focus:ring-[#ff69b4]/20 outline-none transition-all font-bold text-sm bg-rose-50/20"
                    style={{ borderColor: '#F5E6EA', color: '#15192c' }}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] mb-1" style={{ color: '#C4A0AC' }}>Email</label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={e => setProfileData({ ...profileData, email: e.target.value })}
                      className="w-full h-12 px-4 rounded-xl border focus:border-[#ff69b4] focus:ring-2 focus:ring-[#ff69b4]/20 outline-none transition-all font-bold text-sm bg-rose-50/20"
                      style={{ borderColor: '#F5E6EA', color: '#15192c' }}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] mb-1" style={{ color: '#C4A0AC' }}>Phone</label>
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={e => setProfileData({ ...profileData, phone: e.target.value })}
                      className="w-full h-12 px-4 rounded-xl border focus:border-[#ff69b4] focus:ring-2 focus:ring-[#ff69b4]/20 outline-none transition-all font-bold text-sm bg-rose-50/20"
                      style={{ borderColor: '#F5E6EA', color: '#15192c' }}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] mb-1" style={{ color: '#C4A0AC' }}>Bio</label>
                  <textarea
                    value={profileData.bio}
                    onChange={e => setProfileData({ ...profileData, bio: e.target.value })}
                    className="w-full p-4 rounded-xl border focus:border-[#ff69b4] focus:ring-2 focus:ring-[#ff69b4]/20 outline-none transition-all font-medium text-sm bg-rose-50/20 resize-none"
                    rows="3"
                    style={{ borderColor: '#F5E6EA', color: '#6B5E63' }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Stats Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {config.stats.map((s, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 border text-center shadow-sm" style={{ borderColor: '#F5E6EA' }}>
            <s.icon size={20} className="mx-auto mb-3" style={{ color: '#ff69b4' }} />
            <p className="text-2xl font-bold" style={{ color: '#15192c' }}>{s.value}</p>
            <p className="text-[10px] font-extrabold uppercase tracking-widest mt-1" style={{ color: '#C4A0AC' }}>{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

        {/* Membership Card (Member Role Only) */}
        {config.showMembership && (
          <div className="lg:col-span-12">
            <div className="rounded-[2.5rem] p-10 flex flex-col md:flex-row items-center justify-between gap-8 border shadow-sm" style={{ background: '#FFF7F8', borderColor: '#F5E6EA' }}>
              <div className="space-y-4 text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest" style={{ background: '#fff', color: '#ff69b4', border: '1px solid #F5E6EA' }}>
                  <Star size={12} fill="#ff69b4" />
                  Premium Active
                </div>
                <h2 className="text-24 font-bold" style={{ color: '#15192c' }}>Annual Wellness Pass 💎</h2>
                <p className="text-sm font-medium leading-relaxed" style={{ color: '#9A8A8E' }}>
                  Your yearly subscription expires on April 20, 2027. <br className="hidden md:block" />
                  You have full access to all Sakhi features.
                </p>
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={() => navigate('/app/plans')}
                  className="px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest text-white transition-all hover:brightness-105 active:scale-95 shadow-md" 
                  style={{ background: '#ff69b4' }}
                >
                  Manage Plan
                </button>
                <button 
                  onClick={() => navigate('/app/receipts')}
                  className="px-6 py-3 bg-white border rounded-xl font-bold text-xs uppercase tracking-widest transition-all hover:bg-rose-50 active:scale-95" 
                  style={{ borderColor: '#F5E6EA', color: '#ff69b4' }}
                >
                  Receipts
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Menu Items (Member Role Only) */}
        {role === 'member' && (
          <div className="lg:col-span-12 space-y-4">
            <h3 className="text-xs font-extrabold uppercase tracking-[0.2em] mb-4 mt-8" style={{ color: '#C4A0AC' }}>{config.heading}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {config.menuItems.map((item, i) => (
                <button 
                  key={i} 
                  onClick={() => {
                    if (item.title === 'Mood Insights') navigate('/app/mood/Happy');
                    else if (item.title === 'Saved Wellness Modules') navigate('/app/explore');
                    else if (item.title === 'Subscription & Billing') navigate('/app/plans');
                    else alert(`${item.title} section coming soon! ✨`);
                  }}
                  className="flex items-center justify-between p-5 bg-white rounded-2xl border transition-all hover:shadow-md hover:border-[#ff69b4]/30 group active:scale-[0.98]" 
                  style={{ borderColor: '#F5E6EA' }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center transition-colors group-hover:bg-[#ff69b4]/10">
                      <item.icon size={17} style={{ color: '#ff69b4' }} />
                    </div>
                    <span className="text-[13px] font-bold" style={{ color: '#15192c' }}>{item.title}</span>
                  </div>
                  {item.count ? (
                    <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-rose-50 group-hover:bg-[#ff69b4]/10 group-hover:text-[#ff69b4] transition-colors" style={{ color: '#C4A0AC' }}>{item.count}</span>
                  ) : (
                    <ChevronRight size={16} style={{ color: '#C4A0AC' }} className="group-hover:translate-x-1 transition-transform" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Sign Out (12 cols) */}
        <div className="lg:col-span-12 pt-12 pb-6">
          <button
            onClick={handleLogout}
            className="w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all bg-rose-50 hover:bg-rose-100 hover:shadow-sm active:scale-95 group border border-rose-100"
            style={{ color: '#d04f8f' }}
          >
            <LogOut size={18} className="transition-transform group-hover:-translate-x-1" />
            Sign Out of Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;

