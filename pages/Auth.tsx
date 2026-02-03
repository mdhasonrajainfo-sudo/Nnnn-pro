

import React, { useState } from 'react';
import { store } from '../services/store';
import { ArrowLeft, User, Phone, Lock, Mail, CreditCard, AlertCircle, Loader, CheckCircle } from 'lucide-react';
import { Logo } from '../components/Logo';

interface AuthProps {
  view: 'login' | 'register';
  onNavigate: (view: string) => void;
  onLoginSuccess: () => void;
}

// Fixed: Defined InputField outside to prevent re-renders losing focus
const InputField = ({ icon: Icon, type, placeholder, value, onChange, disabled = false }: any) => (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
        <Icon size={18} />
      </div>
      <input
        type={type}
        className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition bg-gray-50 text-sm text-gray-900 placeholder-gray-500"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required
      />
    </div>
);

export const Auth: React.FC<AuthProps> = ({ view, onNavigate, onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    whatsapp: '',
    email: '',
    password: '',
    referralCode: '' // Default empty as requested
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [referrerName, setReferrerName] = useState<string | null>(null);

  // Login Handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // Async login via Firebase
      const success = await store.login(formData.whatsapp, formData.password);
      if (success) {
        onLoginSuccess();
      } else {
        throw new Error("Invalid Phone Number or Password. If you are new, please Register first.");
      }
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // Register Handler
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (!formData.referralCode) throw new Error("Referral code is mandatory");
      // Async register via Firebase
      await store.register(formData);
      onLoginSuccess();
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  // Check Referral Code
  const checkReferral = (code: string) => {
    setFormData({ ...formData, referralCode: code });
    if (!code) {
        setReferrerName(null);
        return;
    }
    
    // Explicitly allow default code
    if (code === '123456') {
      setReferrerName('Admin (Official - Default)');
      return;
    }

    if (code.length >= 4) {
      const u = store.getReferrer(code);
      if (u) setReferrerName(u.name);
      else setReferrerName(null);
    } else {
      setReferrerName(null);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center px-6 py-12">
       <button onClick={() => onNavigate('landing')} className="absolute top-6 left-6 text-gray-500 hover:text-emerald-600">
         <ArrowLeft size={24} />
       </button>

       <div className="text-center mb-8 flex flex-col items-center">
         <Logo size="large" className="mb-4"/>
         <h2 className="text-2xl font-bold text-gray-800 mb-2">
           {view === 'login' ? 'Welcome Back' : 'Create Account'}
         </h2>
         <p className="text-gray-500 text-sm">
           {view === 'login' ? 'Login with your WhatsApp Number' : 'Join us and start earning today'}
         </p>
       </div>

       {error && (
         <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center gap-2 text-sm">
           <AlertCircle size={16} /> {error}
         </div>
       )}

       {view === 'login' && (
           <div className="mb-4 bg-blue-50 border border-blue-200 text-blue-700 px-3 py-2 rounded-lg text-xs">
               <strong>New here?</strong> Please create an account first. You must have a valid referral code.
           </div>
       )}

       <form onSubmit={view === 'login' ? handleLogin : handleRegister} className="space-y-4">
         
         {view === 'register' && (
           <>
             <InputField 
                icon={User} type="text" placeholder="Full Name" 
                value={formData.name} onChange={(e: any) => setFormData({...formData, name: e.target.value})} 
             />
             <InputField 
                icon={Mail} type="email" placeholder="Email Address" 
                value={formData.email} onChange={(e: any) => setFormData({...formData, email: e.target.value})} 
             />
           </>
         )}

         <InputField 
            icon={Phone} type="text" placeholder="WhatsApp Number" 
            value={formData.whatsapp} onChange={(e: any) => setFormData({...formData, whatsapp: e.target.value})} 
         />

         <InputField 
            icon={Lock} type="password" placeholder="Password" 
            value={formData.password} onChange={(e: any) => setFormData({...formData, password: e.target.value})} 
         />

         {view === 'register' && (
           <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100">
             <label className="text-xs font-semibold text-emerald-700 mb-1 block">Referral Code (Mandatory)</label>
             <InputField 
                icon={CreditCard} type="text" placeholder="Enter Referral Code" 
                value={formData.referralCode} onChange={(e: any) => checkReferral(e.target.value)} 
             />
             {referrerName ? (
               <div className="mt-2 flex items-center gap-2 text-emerald-600 text-xs font-medium animate-pulse">
                 <CheckCircle size={14} /> Referred by: {referrerName}
               </div>
             ) : (
               <div className="mt-2 text-red-500 text-xs">Valid Referral Code is Required to Register.</div>
             )}
           </div>
         )}

         <button 
           type="submit" 
           disabled={(view === 'register' && !referrerName) || loading}
           className={`w-full py-3.5 rounded-lg font-bold text-white shadow-lg transition flex justify-center items-center gap-2 ${
             (view === 'register' && !referrerName) || loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200'
           }`}>
           {loading ? <Loader className="animate-spin" size={20}/> : (view === 'login' ? 'Login' : 'Sign Up')}
         </button>
       </form>

       <div className="mt-8 text-center space-y-3">
         {view === 'login' && (
           <>
             <p className="text-gray-600 text-sm">Don't have an account? <span onClick={() => onNavigate('register')} className="text-emerald-600 font-bold cursor-pointer hover:underline">Register</span></p>
             <p className="text-gray-400 text-xs cursor-pointer hover:text-gray-600">Forgot Password?</p>
           </>
         )}
         {view === 'register' && (
           <p className="text-gray-600 text-sm">Already have an account? <span onClick={() => onNavigate('login')} className="text-emerald-600 font-bold cursor-pointer hover:underline">Login</span></p>
         )}
       </div>
    </div>
  );
};
