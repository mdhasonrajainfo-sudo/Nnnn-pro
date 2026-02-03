
import React, { useState, useEffect } from 'react';
import { store } from '../services/store';
import { Users, Activity, CheckCircle, MessageCircle, PlayCircle, Send, Instagram, Facebook, Download, Heart, ShieldCheck, Zap, X, Globe, LogIn, UserPlus, Headset } from 'lucide-react';
import { Logo } from '../components/Logo';

interface LandingProps {
  onNavigate: (view: string) => void;
}

// Helper component for animating numbers
const CountUp = ({ end, duration = 2000, prefix = "", suffix = "" }: { end: number, duration?: number, prefix?: string, suffix?: string }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = end / (duration / 16); // 60fps
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [end, duration]);

  return <>{prefix}{count.toLocaleString()}{suffix}</>;
};

export const Landing: React.FC<LandingProps> = ({ onNavigate }) => {
  const { settings } = store;
  const [showSupportModal, setShowSupportModal] = useState(false);

  const stats = [
      { icon: Users, label: "Active Users", value: "2500+", end: 2500, color: "bg-blue-500" },
      { icon: CheckCircle, label: "Total Paid", value: "50000+", end: 50000, color: "bg-emerald-500", prefix: "৳" },
      { icon: ShieldCheck, label: "Secure", value: "100%", end: 100, color: "bg-orange-500", suffix: "%" }
  ];

  const SupportModal = () => (
      <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm relative shadow-2xl">
              <button onClick={() => setShowSupportModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition"><X size={24}/></button>
              <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3 text-emerald-600">
                      <Headset size={32}/>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Support Center</h3>
                  <p className="text-xs text-gray-500 mt-1">We are here to help you 24/7</p>
              </div>
              
              <div className="bg-emerald-50 p-4 rounded-xl text-sm text-emerald-800 mb-4 border border-emerald-100 text-center leading-relaxed">
                  {settings.supportConfig.supportDescription || "Our support team is always ready to assist you. Please join our communities."}
              </div>

              <div className="space-y-3">
                  <a href={settings.supportConfig.freeTelegramChannelLink} target="_blank" className="flex items-center gap-3 p-3 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition border border-blue-200">
                      <Globe size={20}/> <span className="font-bold">Official Channel</span>
                  </a>
                  <a href={settings.supportConfig.freeTelegramGroupLink} target="_blank" className="flex items-center gap-3 p-3 bg-sky-50 text-sky-700 rounded-xl hover:bg-sky-100 transition border border-sky-200">
                      <Send size={20}/> <span className="font-bold">Join Community Group</span>
                  </a>
                  <a href={settings.supportConfig.whatsappSupportLink} target="_blank" className="flex items-center gap-3 p-3 bg-green-50 text-green-700 rounded-xl hover:bg-green-100 transition border border-green-200">
                      <MessageCircle size={20}/> <span className="font-bold">Admin WhatsApp</span>
                  </a>
              </div>
          </div>
      </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-24 relative overflow-hidden font-sans">
      {showSupportModal && <SupportModal />}

      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-emerald-100/50 to-transparent z-0 rounded-b-[50px]"></div>
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-emerald-200/30 rounded-full blur-3xl"></div>
      <div className="absolute top-40 -left-20 w-64 h-64 bg-blue-200/30 rounded-full blur-3xl"></div>

      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md px-5 py-4 flex justify-between items-center shadow-sm sticky top-0 z-50 border-b border-gray-100">
        <Logo size="normal" />
        <div className="flex gap-2">
            <button onClick={() => onNavigate('login')} className="flex items-center gap-1 text-xs font-bold text-emerald-600 border border-emerald-200 px-4 py-2 rounded-full hover:bg-emerald-50 transition">
               <LogIn size={14}/> Login
            </button>
            <button onClick={() => onNavigate('register')} className="flex items-center gap-1 text-xs font-bold text-white bg-emerald-600 px-4 py-2 rounded-full hover:bg-emerald-700 transition shadow-lg shadow-emerald-200">
               <UserPlus size={14}/> Join
            </button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="p-6 text-center space-y-6 relative z-10 mt-6">
        <div className="inline-block animate-bounce">
           <span className="bg-gradient-to-r from-orange-100 to-amber-100 text-orange-600 text-xs font-bold px-4 py-1.5 rounded-full border border-orange-200 shadow-sm flex items-center gap-1">
             <Zap size={12} className="fill-orange-500"/> Best Earning App 2025
           </span>
        </div>
        <h1 className="text-4xl font-extrabold text-slate-800 leading-tight">
          সহজ কাজ করে <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">টাকা ইনকাম</span> করুন
        </h1>
        <p className="text-gray-600 text-sm leading-relaxed max-w-md mx-auto">
          {settings.landingDescription}
        </p>
        
        <div className="flex flex-col gap-3 justify-center pt-2 px-8">
          <button onClick={() => onNavigate('login')} className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-4 rounded-xl font-bold shadow-xl shadow-emerald-200 hover:scale-105 transition flex items-center justify-center gap-2">
            <PlayCircle size={20} className="fill-white/20"/> কাজ শুরু করুন
          </button>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-3 gap-3 px-4 mb-10 relative z-10">
        {stats.map((stat, idx) => (
            <div key={idx} className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center gap-2 text-center">
                <div className={`p-2 rounded-full ${stat.color} text-white shadow-md`}>
                    <stat.icon size={16} />
                </div>
                <h3 className="font-bold text-sm text-gray-800">
                    <CountUp end={stat.end} prefix={stat.prefix} suffix={stat.suffix} />
                </h3>
                <p className="text-[10px] text-gray-500 font-bold uppercase">{stat.label}</p>
            </div>
        ))}
      </div>

      {/* Features */}
      <div className="px-4 space-y-4 relative z-10 mb-10">
          <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">কেন আমাদের সাথে কাজ করবেন?</h2>
              <p className="text-xs text-gray-500">আপনার বিশ্বস্ত ইনকাম পার্টনার</p>
          </div>

          {[
              { title: "সম্পূর্ণ ফ্রি কাজ", desc: "কোনো প্রকার ইনভেস্টমেন্ট ছাড়াই কাজ শুরু করুন। আমরা ছাত্রদের জন্য ফ্রি ইনকামের সুযোগ দিচ্ছি।", icon: CheckCircle, color: "text-blue-500", bg: "bg-blue-50" },
              { title: "দ্রুত পেমেন্ট", desc: "বিকাশ, নগদ এবং রকেটের মাধ্যমে খুব দ্রুত পেমেন্ট নিন। পেমেন্ট নিয়ে কোনো চিন্তা নেই।", icon: Zap, color: "text-orange-500", bg: "bg-orange-50" },
              { title: "২৪/৭ সাপোর্ট", desc: "আমাদের ডেডিকেটেড অ্যাডমিন প্যানেল সবসময় আপনার পাশে আছে। যেকোনো সমস্যায় যোগাযোগ করুন।", icon: Headset, color: "text-green-500", bg: "bg-green-50" }
          ].map((item, i) => (
              <div key={i} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex gap-4 items-start hover:shadow-md transition">
                  <div className={`p-3 rounded-full ${item.bg} ${item.color} flex-shrink-0`}>
                      <item.icon size={24}/>
                  </div>
                  <div>
                      <h4 className="font-bold text-gray-800 mb-1">{item.title}</h4>
                      <p className="text-xs text-gray-600 leading-relaxed">{item.desc}</p>
                  </div>
              </div>
          ))}
      </div>

      {/* Emotional / Friend Section */}
      <div className="px-4 mb-10 relative z-10">
          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-6 text-white text-center shadow-xl relative overflow-hidden">
              <div className="relative z-10">
                  <Heart className="mx-auto mb-3 text-pink-400 fill-pink-400 animate-pulse" size={40}/>
                  <h3 className="text-xl font-bold mb-2">আমরা একটি পরিবার</h3>
                  <p className="text-sm opacity-90 leading-relaxed mb-4">
                      "এখানে কাজ করা শুধু ইনকাম নয়, এটি একটি কমিউনিটি। আপনার ছোট ছোট প্রচেষ্টাই আপনাকে বড় সফলতার দিকে নিয়ে যাবে। সততার সাথে কাজ করুন, আমরা সবসময় আপনার পাশে আছি।"
                  </p>
                  <button onClick={() => onNavigate('register')} className="bg-white text-indigo-700 px-6 py-2 rounded-full text-xs font-bold shadow-lg hover:bg-gray-100 transition">
                      আজই মেম্বার হোন
                  </button>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-pink-500 opacity-20 rounded-full blur-2xl"></div>
          </div>
      </div>

      {/* Social Links */}
      <div className="px-4 mb-12 relative z-10 text-center">
        <h3 className="font-bold text-gray-400 mb-4 text-xs uppercase tracking-widest">Connect With Us</h3>
        <div className="flex justify-center gap-4 flex-wrap">
          {[
            { icon: Facebook, color: 'bg-blue-600', link: settings.facebookGroupLink },
            { icon: Send, color: 'bg-sky-500', link: settings.telegramLink },
            { icon: PlayCircle, color: 'bg-red-600', link: settings.youtubeLink },
            { icon: MessageCircle, color: 'bg-green-500', link: settings.supportLink },
          ].map((item, idx) => (
            <a key={idx} href={item.link} target="_blank" className={`${item.color} text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition duration-300`}>
              <item.icon size={18} />
            </a>
          ))}
        </div>
      </div>

      {/* App Download Footer */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-4 z-40 shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
          <div className="max-w-md mx-auto flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                  <div className="bg-emerald-100 p-2 rounded-lg">
                      <Logo size="small"/>
                  </div>
                  <div>
                      <p className="text-xs font-bold text-gray-800">Download App</p>
                      <p className="text-[10px] text-gray-500">For better experience</p>
                  </div>
              </div>
              <a href={settings.appDownloadLink} target="_blank" className="bg-black text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-gray-800 transition">
                  <Download size={14}/> Download
              </a>
          </div>
      </div>

      {/* Floating REAL Support Button */}
      <button 
        onClick={() => setShowSupportModal(true)}
        className="fixed bottom-20 right-6 z-[60] group"
      >
        <div className="relative">
            <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-75"></div>
            <div className="relative bg-gradient-to-r from-emerald-500 to-teal-600 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center border-4 border-white transform hover:scale-110 transition duration-300">
                <Headset size={28} className="text-white fill-white/20"/>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white"></div>
            </div>
            {/* Tooltip */}
            <div className="absolute right-16 top-2 bg-white px-3 py-1 rounded-lg shadow-md text-xs font-bold text-gray-700 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                Live Support
            </div>
        </div>
      </button>
    </div>
  );
};
