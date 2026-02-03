
import React, { useState, useEffect } from 'react';
import { store } from '../services/store';
// @ts-ignore
import * as RRD from 'react-router-dom';
const { useNavigate, useLocation } = RRD as any;

// @ts-ignore
import * as MotionModule from 'framer-motion';
const { motion, AnimatePresence } = MotionModule as any;

import { 
  Menu, X, Smartphone, UserPlus, FileText, CircleHelp, 
  Download, Youtube, Facebook, MessageCircle, ArrowRight, ArrowLeft,
  Lock, PlayCircle, Star, Shield, CheckCircle, 
  Instagram, Phone, Video, Headphones, User, Globe, Users,
  Mail, Send, AlertCircle, Key
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { settings, currentUser } = store;
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  return (
    <div className="min-h-screen font-sans text-gray-800 relative overflow-hidden bg-white">
      <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => navigate('/support')} className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white p-3.5 rounded-full shadow-xl shadow-emerald-200 flex items-center justify-center"><Headphones size={22} /></motion.button>
      <div className="absolute inset-0 z-0 pointer-events-none"><div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-emerald-50 to-transparent"></div></div>
      <div className="relative z-10 max-w-md mx-auto bg-white min-h-screen flex flex-col shadow-2xl">
          <header className="flex justify-between items-center px-5 py-3 sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-50">
            <div className="flex items-center">
               <div className="flex items-center gap-2"><img src="https://files.catbox.moe/oq7gs8.jpg" alt="Logo" className="w-8 h-8 object-contain" /><span className="font-black text-xl tracking-tighter flex items-center"><span className="text-emerald-600">Next</span><span className="text-gray-900">Level</span></span></div>
            </div>
            <div className="flex gap-2">
              {currentUser && (<button onClick={() => navigate('/user/home')} className="text-xs bg-gray-900 text-white px-4 py-2 rounded-lg font-bold">Dashboard</button>)}
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-800 p-1.5 hover:bg-gray-50 rounded-lg transition">{isMenuOpen ? <X size={26} /> : <Menu size={26} />}</button>
            </div>
          </header>
          <AnimatePresence>
          {isMenuOpen && (
            <><motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsMenuOpen(false)} className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"/><motion.div initial={{ opacity: 0, x: '100%' }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: '100%' }} transition={{ type: "tween" }} className="fixed inset-y-0 right-0 w-72 bg-white z-50 p-6 flex flex-col gap-2 shadow-2xl pt-24 border-l border-gray-100">
                <button onClick={() => navigate('/login')} className="flex items-center gap-4 p-4 hover:bg-emerald-50 rounded-xl text-sm font-bold text-gray-700 transition"><Smartphone size={18} className="text-emerald-600"/> Login</button>
                <button onClick={() => navigate('/register')} className="flex items-center gap-4 p-4 hover:bg-emerald-50 rounded-xl text-sm font-bold text-gray-700 transition"><UserPlus size={18} className="text-emerald-600"/> Registration</button>
                <div className="h-px bg-gray-100 my-2"></div>
                <button className="flex items-center gap-4 p-4 hover:bg-emerald-50 rounded-xl text-sm font-bold text-gray-700 transition"><Download size={18} className="text-emerald-600"/> Download App</button>
                <button onClick={() => navigate('/support')} className="flex items-center gap-4 p-4 hover:bg-emerald-50 rounded-xl text-sm font-bold text-gray-700 transition"><Headphones size={18} className="text-emerald-600"/> Help & Support</button>
                </motion.div></>
          )}
          </AnimatePresence>
          <main className="flex-grow overflow-y-auto hide-scrollbar">
            <section className="px-5 pt-8 pb-4 text-center"><motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mb-6"><h1 className="text-4xl font-black text-gray-900 mb-3 leading-tight">Earn Money <br/><span className="text-emerald-600">Every Single Day</span></h1><p className="text-gray-500 text-sm leading-relaxed px-2 font-medium">{settings.landingDescription}</p><div className="flex gap-3 w-full mt-8"><button onClick={() => navigate('/login')} className="flex-1 bg-gray-900 text-white py-4 rounded-xl shadow-lg shadow-gray-200 font-bold text-sm flex items-center justify-center gap-2"><Smartphone size={18} /> Login</button><button onClick={() => navigate('/register')} className="flex-1 bg-white text-emerald-600 border-2 border-emerald-500 py-4 rounded-xl shadow-sm font-bold text-sm flex items-center justify-center gap-2"><UserPlus size={18} /> Register</button></div></motion.div></section>
          </main>
      </div>
    </div>
  );
};

export const LoginPage: React.FC = () => {
  const { login, adminLogin, settings } = store;
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [pass, setPass] = useState('');
  const [adminCode, setAdminCode] = useState('');
  const [showAdminAuth, setShowAdminAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // নতুন এডমিন লগইন ডিটেকশন
    if(phone === '0145875542' && pass === '855#@#@Gfewghu') {
        setIsLoading(false);
        setShowAdminAuth(true); 
        return;
    }

    try {
        const success = await login(phone, pass);
        setIsLoading(false);
        if (success) navigate('/user/home');
        else alert("Invalid Credentials");
    } catch (err: any) {
        setIsLoading(false);
        alert(err.message);
    }
  };

  const handleAdminVerify = async (e: React.FormEvent) => {
      e.preventDefault();
      if(adminCode === '123456') {
          const success = await adminLogin(phone, pass);
          if(success) navigate('/admin/dashboard');
          else alert("Admin verification failed.");
      } else {
          alert("Wrong Security Code!");
      }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center p-8 max-w-md mx-auto relative">
      <button onClick={() => navigate('/')} className="absolute top-6 left-6 p-2 bg-white rounded-full shadow-sm text-gray-600"><ArrowRight size={20} className="rotate-180"/></button>
      <div className="flex justify-center mb-6"><div className="bg-white p-3 rounded-2xl shadow-sm"><img src="https://files.catbox.moe/oq7gs8.jpg" alt="Logo" className="w-12 h-12 object-contain" /></div></div>
      <div className="mb-8 text-center"><h2 className="text-3xl font-black text-gray-800">Welcome Back</h2><p className="text-gray-400 mt-2 font-medium">Please sign in to {settings.companyName}</p></div>
      {!showAdminAuth ? (
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="relative"><div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><Phone size={20} /></div><input type="text" value={phone} onChange={e => setPhone(e.target.value)} className="w-full p-4 pl-12 border-none bg-white rounded-2xl shadow-sm focus:ring-2 focus:ring-emerald-500 outline-none text-lg font-medium text-gray-900" placeholder="WhatsApp Number" required /></div>
            <div className="relative"><div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><Lock size={20} /></div><input type="password" value={pass} onChange={e => setPass(e.target.value)} className="w-full p-4 pl-12 border-none bg-white rounded-2xl shadow-sm focus:ring-2 focus:ring-emerald-500 outline-none text-lg font-medium text-gray-900" placeholder="Password" required /></div>
            <button type="submit" disabled={isLoading} className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold shadow-xl shadow-emerald-200 text-lg hover:scale-[1.02] transition flex justify-center active:scale-95 items-center gap-2">{isLoading ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <><Smartphone size={20}/> Sign In</>}</button>
          </form>
      ) : (
          <form onSubmit={handleAdminVerify} className="space-y-5 animate-in fade-in zoom-in duration-300">
              <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200 text-center mb-4"><p className="text-yellow-800 font-bold text-sm">Admin Security Check</p><p className="text-xs text-yellow-600">Please enter the security code</p></div>
              <div className="relative"><div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><Key size={20} /></div><input type="password" value={adminCode} onChange={e => setAdminCode(e.target.value)} className="w-full p-4 pl-12 border-none bg-white rounded-2xl shadow-sm focus:ring-2 focus:ring-emerald-500 outline-none text-lg font-medium text-gray-900 text-center tracking-widest" placeholder="1-6 Code" required /></div>
              <button type="submit" className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold shadow-xl text-lg hover:scale-[1.02] transition flex justify-center active:scale-95 items-center gap-2">Verify & Login</button>
              <button type="button" onClick={() => setShowAdminAuth(false)} className="w-full text-gray-500 text-sm font-bold hover:underline">Cancel</button>
          </form>
      )}
      <div className="mt-10 text-center"><p className="text-sm text-gray-500 font-medium">Don't have an account? <span onClick={() => navigate('/register')} className="text-emerald-600 font-bold cursor-pointer hover:underline">Create Account</span></p></div>
    </div>
  );
};

export const RegisterPage: React.FC = () => {
  const { register, settings, users } = store;
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({ name: '', whatsapp: '', email: '', password: '', referralCode: '' });
  const [refName, setRefName] = useState<string | null>(null);
  const [isValidRef, setIsValidRef] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const refParam = params.get('ref');
    if (refParam) setFormData(prev => ({ ...prev, referralCode: refParam }));
  }, [location]);

  useEffect(() => {
      if(formData.referralCode === '123456') { setRefName('Official Admin'); setIsValidRef(true); }
      else if(formData.referralCode.length >= 6) {
          const matchedUser = users.find(u => u.referralCode === formData.referralCode);
          if(matchedUser) { setRefName(matchedUser.name); setIsValidRef(true); }
          else { setRefName(null); setIsValidRef(false); }
      } else { setRefName(null); setIsValidRef(false); }
  }, [formData.referralCode, users]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!isValidRef) return alert("Invalid Referral Code!");
    try {
        const success = await register(formData);
        if (success) { alert("Registration Successful!"); navigate('/user/home'); }
    } catch (err: any) {
        alert(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center p-8 max-w-md mx-auto relative">
       <button onClick={() => navigate('/')} className="absolute top-6 left-6 p-2 bg-white rounded-full shadow-sm text-gray-600"><ArrowRight size={20} className="rotate-180"/></button>
       <div className="flex justify-center mb-6"><div className="bg-white p-3 rounded-2xl shadow-sm"><img src="https://files.catbox.moe/oq7gs8.jpg" alt="Logo" className="w-12 h-12 object-contain" /></div></div>
       <div className="mb-8 text-center"><h2 className="text-3xl font-black text-gray-800">Create Account</h2><p className="text-gray-400 mt-2 font-medium">Join {settings.companyName} today</p></div>
      <form onSubmit={handleRegister} className="space-y-4">
        <div className="relative"><div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><User size={20}/></div><input type="text" placeholder="Full Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-4 pl-12 border-none bg-white rounded-2xl shadow-sm outline-none font-medium text-gray-900" required /></div>
        <div className="relative"><div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><Phone size={20}/></div><input type="text" placeholder="WhatsApp Number" value={formData.whatsapp} onChange={e => setFormData({...formData, whatsapp: e.target.value})} className="w-full p-4 pl-12 border-none bg-white rounded-2xl shadow-sm outline-none font-medium text-gray-900" required /></div>
        <div className="relative"><div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><Mail size={20}/></div><input type="email" placeholder="Email Address" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full p-4 pl-12 border-none bg-white rounded-2xl shadow-sm outline-none font-medium text-gray-900" required /></div>
        <div className="relative"><div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><Lock size={20}/></div><input type="password" placeholder="Password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full p-4 pl-12 border-none bg-white rounded-2xl shadow-sm outline-none font-medium text-gray-900" required /></div>
        <div className="relative"><div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><Users size={20}/></div><input type="text" placeholder="Referral Code" value={formData.referralCode} onChange={e => setFormData({...formData, referralCode: e.target.value})} className={`w-full p-4 pl-12 border-2 bg-white rounded-2xl shadow-sm outline-none font-medium text-gray-900 transition ${formData.referralCode.length > 0 ? (isValidRef ? 'border-emerald-500' : 'border-red-500') : 'border-transparent'}`} required /></div>
        {formData.referralCode.length > 0 && (<div className={`text-center text-xs font-bold py-2 rounded-lg ${isValidRef ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>{isValidRef ? `Referred by: ${refName}` : 'Invalid Referral Code'}</div>)}
        <button type="submit" disabled={!isValidRef} className={`w-full text-white py-4 rounded-2xl font-bold shadow-xl mt-4 hover:scale-[1.02] transition active:scale-95 flex items-center justify-center gap-2 ${isValidRef ? 'bg-gray-900' : 'bg-gray-400 cursor-not-allowed'}`}><UserPlus size={20}/> Sign Up</button>
      </form>
      <div className="mt-8 text-center"><p className="text-sm text-gray-500 font-medium">Already have an account? <span onClick={() => navigate('/login')} className="text-emerald-600 font-bold cursor-pointer hover:underline">Sign In</span></p></div>
    </div>
  );
};
