
import React, { useState, useEffect, useRef } from 'react';
import { store } from '../services/store';
import { User, Task, TaskSubmission, SupportTicket, WalletType, GmailOrder, JobWithdrawRequest, SocialSell, CustomPage, Notification, VideoFolder } from '../types';
import { MobileHeader, Sidebar } from '../components/Layout';
import { Home, Wallet, Users, CheckSquare, Mail, Copy, Bell, ArrowRight, Upload, Clock, Crown, MessageCircle, Edit, Save, History, Youtube, CheckCircle, Image as ImageIcon, RefreshCw, User as UserIcon, Network, Headset, Send, Lock, Eye, EyeOff, FileText, Link, ShieldAlert, Briefcase, ChevronRight, Star, PlusCircle, PlayCircle, Key, DollarSign, X, Facebook, Instagram, Music, Video, Globe, Camera, Settings, Ticket, HelpCircle, AlertCircle, Copy as CopyIcon, Smartphone, LogOut, ChevronLeft, Folder, FolderOpen, Brain, Loader, Wrench, Download, List, Moon, Sun, ExternalLink, Image, MousePointer } from 'lucide-react';
import { Logo } from '../components/Logo';

interface UserPanelProps {
  onLogout: () => void;
  onAdminLogin: () => void;
}

// Internal Toast Component for User Panel
const UserToast = ({ message, onClose }: { message: string, onClose: () => void }) => (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-slate-800 text-white px-6 py-3 rounded-full shadow-2xl z-[100] animate-in fade-in zoom-in duration-300 flex items-center gap-3 min-w-[300px] justify-center border border-slate-700">
        <CheckCircle size={20} className="text-emerald-400" />
        <span className="font-bold text-sm">{message}</span>
    </div>
);

export const UserPanel: React.FC<UserPanelProps> = ({ onLogout, onAdminLogin }) => {
  // --- State Management ---
  const [view, setView] = useState('dashboard'); 
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(store.currentUser);
  const [showFreeJobModal, setShowFreeJobModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [activeCustomPage, setActiveCustomPage] = useState<CustomPage | null>(null);
  const [refresh, setRefresh] = useState(0);
  const [toastMsg, setToastMsg] = useState('');
  
  // Dark Mode State
  const [darkMode, setDarkMode] = useState(false);
  
  // Realtime Sync with Local Store
  useEffect(() => {
     setCurrentUser(store.currentUser);
     const unsubscribe = store.subscribe(() => {
        setCurrentUser(store.currentUser);
        setRefresh(prev => prev + 1);
     });
     window.scrollTo({ top: 0, behavior: 'smooth' });
     return () => unsubscribe();
  }, [view]);

  // Helper: Show Toast
  const showToast = (msg: string) => {
      setToastMsg(msg);
      setTimeout(() => setToastMsg(''), 3000);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast('Copied to clipboard!');
  };

  const unreadCount = currentUser ? store.getUnreadNotificationsCount(currentUser.id) : 0;

  // --- Theme Helpers ---
  const bgMain = darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900';
  const bgCard = darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100';
  const textTitle = darkMode ? 'text-white' : 'text-gray-800';
  const textSub = darkMode ? 'text-gray-400' : 'text-gray-500';
  const bgInput = darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-200 text-gray-900';
  const borderLight = darkMode ? 'border-gray-700' : 'border-gray-100';

  // --- SUB-COMPONENTS ---

  // 1. Notice Modal
  const FreeJobInfoModal = () => (
    <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className={`rounded-xl p-6 max-w-sm w-full relative shadow-2xl ${bgCard} border`}>
        <button onClick={() => setShowFreeJobModal(false)} className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition">
          <X size={20} />
        </button>
        <h3 className="font-bold text-lg text-emerald-600 mb-3 flex items-center gap-2">
           <Briefcase size={20}/> Free Job Info
        </h3>
        <div className={`text-sm whitespace-pre-line leading-relaxed p-3 rounded-lg border mb-4 ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-300' : 'bg-emerald-50 border-emerald-100 text-gray-600'}`}>
          {store.settings.messages.freeJobInfo}
        </div>
        <button onClick={() => setShowFreeJobModal(false)} className="w-full bg-emerald-600 text-white font-bold py-2.5 rounded-lg hover:bg-emerald-700 transition">
          Understand (বুঝতে পেরেছি)
        </button>
      </div>
    </div>
  );

  // 2. Image Slider
  const ImageSlider = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const images = store.settings.sliderImages.length > 0 ? store.settings.sliderImages : [
        "https://picsum.photos/800/400?random=1",
        "https://picsum.photos/800/400?random=2"
    ];

    useEffect(() => {
      const interval = setInterval(() => { setCurrentIndex((prev) => (prev + 1) % images.length); }, 3000);
      return () => clearInterval(interval);
    }, [images.length]);

    return (
      <div className={`w-full relative overflow-hidden rounded-xl shadow-md h-40 my-4 border-2 ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-emerald-100 bg-gray-200'}`}>
        <img src={images[currentIndex]} alt="Banner" className="w-full h-full object-cover transition-all duration-700 ease-in-out" />
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {images.map((_, i) => (
                <div key={i} className={`w-2 h-2 rounded-full ${i === currentIndex ? 'bg-white' : 'bg-white/50'}`}></div>
            ))}
        </div>
      </div>
    );
  };

  // 3. Dashboard Home
  const DashboardHome = () => {
    const upline = currentUser ? store.getUpline(currentUser.id) : null;
    const [showDetails, setShowDetails] = useState(false);

    return (
      <div className="p-4 space-y-5 pb-24">
        {/* Profile Header */}
        <div className={`${bgCard} p-4 rounded-2xl shadow-sm relative overflow-hidden border space-y-3`}>
          <div className="absolute right-0 top-0 p-3 opacity-5"><Crown size={80} className="text-emerald-500" /></div>
          
          <div className="flex items-start justify-between relative z-10">
              <div className="flex items-center gap-3">
                 <img src={currentUser?.profileImage} className="w-14 h-14 rounded-full border-2 border-emerald-100 object-cover bg-gray-100" />
                 <div>
                    <h2 className={`font-bold text-lg ${textTitle}`}>{currentUser?.name}</h2>
                    <div className="flex items-center gap-2 mt-1">
                       <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${currentUser?.accountType === 'PREMIUM' ? 'bg-amber-100 text-amber-700' : 'bg-gray-200 text-gray-600'}`}>{currentUser?.accountType}</span>
                       <div className={`flex items-center gap-1 px-2 py-0.5 rounded cursor-pointer active:scale-95 transition ${darkMode ? 'bg-gray-700' : 'bg-emerald-50'}`} onClick={() => handleCopy(currentUser?.referralCode || '')}>
                          <span className="text-[10px] text-emerald-600 font-bold">Ref: {currentUser?.referralCode}</span>
                          <Copy size={10} className="text-emerald-600" />
                       </div>
                    </div>
                 </div>
              </div>
              <button onClick={() => setShowDetails(!showDetails)} className={`${textSub} hover:text-emerald-600 p-1`}>
                  {showDetails ? <EyeOff size={20}/> : <Eye size={20}/>}
              </button>
          </div>

          <div className={`border-t pt-2 grid grid-cols-2 gap-2 text-xs relative z-10 ${borderLight}`}>
              <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} p-2 rounded`}>
                 <p className="text-gray-400 font-bold mb-1">My WhatsApp</p>
                 <p className={`font-mono font-bold ${textTitle}`}>{showDetails ? currentUser?.whatsapp : '***********'}</p>
              </div>
              <div className={`${darkMode ? 'bg-emerald-900/30' : 'bg-emerald-50'} p-2 rounded`}>
                 <p className="text-emerald-500 font-bold mb-1">Upline WhatsApp</p>
                 <p className={`font-mono font-bold ${darkMode ? 'text-emerald-400' : 'text-emerald-800'}`}>{upline ? (showDetails ? upline.whatsapp : '***********') : 'No Upline'}</p>
              </div>
          </div>
        </div>
        
        {/* Notice */}
        <div className="bg-amber-50 rounded-lg px-3 py-2 border border-amber-100 flex items-center gap-3 shadow-sm">
          <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded animate-pulse">NOTICE</span>
          <div className="flex-1 overflow-hidden whitespace-nowrap">
             <div className="animate-marquee inline-block text-xs font-medium text-amber-900">{store.settings.noticeText}</div>
          </div>
        </div>

        {/* Start Working Box */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 px-1">
             <div className="h-4 w-1 bg-emerald-500 rounded-full"></div>
             <h3 className={`font-bold text-sm ${textTitle}`}>Start Working</h3>
          </div>
          
          <div className={`${bgCard} p-4 rounded-2xl shadow-sm border`}>
            <div className="grid grid-cols-4 gap-2">
               <button onClick={() => setView('free-job-hub')} className="flex flex-col items-center gap-2 active:scale-95 transition group">
                  <div className={`p-3 rounded-xl shadow-sm group-hover:shadow-md transition-all w-12 h-12 flex items-center justify-center ${darkMode ? 'bg-indigo-900/50 text-indigo-400' : 'bg-indigo-50 text-indigo-600'}`}>
                    <Briefcase size={20} />
                  </div>
                  <span className={`text-[10px] font-bold whitespace-nowrap ${textSub}`}>Free Job</span>
               </button>

               <button onClick={() => setView('referral')} className="flex flex-col items-center gap-2 active:scale-95 transition group">
                  <div className={`p-3 rounded-xl shadow-sm group-hover:shadow-md transition-all w-12 h-12 flex items-center justify-center ${darkMode ? 'bg-orange-900/50 text-orange-400' : 'bg-orange-50 text-orange-600'}`}>
                    <Users size={20} />
                  </div>
                  <span className={`text-[10px] font-bold whitespace-nowrap ${textSub}`}>Team</span>
               </button>

               <button onClick={() => setView('wallet')} className="flex flex-col items-center gap-2 active:scale-95 transition group">
                  <div className={`p-3 rounded-xl shadow-sm group-hover:shadow-md transition-all w-12 h-12 flex items-center justify-center ${darkMode ? 'bg-emerald-900/50 text-emerald-400' : 'bg-emerald-50 text-emerald-600'}`}>
                    <Wallet size={20} />
                  </div>
                  <span className={`text-[10px] font-bold whitespace-nowrap ${textSub}`}>Wallet</span>
               </button>

               <button onClick={() => setView('premium')} className="flex flex-col items-center gap-2 active:scale-95 transition group">
                  <div className={`p-3 rounded-xl shadow-sm group-hover:shadow-md transition-all w-12 h-12 flex items-center justify-center relative ${darkMode ? 'bg-amber-900/50 text-amber-400' : 'bg-amber-50 text-amber-600'}`}>
                    <Crown size={20} />
                    <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-white"></div>
                  </div>
                  <span className={`text-[10px] font-bold whitespace-nowrap ${textSub}`}>Premium</span>
               </button>
            </div>
          </div>
        </div>

        <ImageSlider />
        
        {/* Support */}
        <div className="space-y-2">
           <h3 className={`font-bold text-sm px-1 ${textTitle}`}>Support & Community</h3>
           <div className={`${bgCard} p-4 rounded-xl shadow-sm border grid grid-cols-2 gap-3`}>
               <a href={store.settings.supportConfig.freeTelegramGroupLink} target="_blank" className={`flex items-center gap-2 p-3 rounded-lg border transition ${darkMode ? 'bg-sky-900/30 border-sky-800 text-sky-400' : 'bg-sky-50 border-sky-100 text-sky-600 hover:bg-sky-100'}`}>
                  <Send size={18}/> <span className="text-xs font-bold">Telegram Group</span>
               </a>
               <a href={store.settings.supportConfig.freeTelegramChannelLink} target="_blank" className={`flex items-center gap-2 p-3 rounded-lg border transition ${darkMode ? 'bg-blue-900/30 border-blue-800 text-blue-400' : 'bg-blue-50 border-blue-100 text-blue-600 hover:bg-blue-100'}`}>
                  <Globe size={18}/> <span className="text-xs font-bold">Official Channel</span>
               </a>
               <a href={store.settings.supportConfig.whatsappSupportLink} target="_blank" className={`flex items-center gap-2 p-3 rounded-lg border transition col-span-2 justify-center ${darkMode ? 'bg-green-900/30 border-green-800 text-green-400' : 'bg-green-50 border-green-100 text-green-600 hover:bg-green-100'}`}>
                  <Headset size={18}/> <span className="text-xs font-bold">Contact Admin Support</span>
               </a>
           </div>
        </div>

        {/* Company Details */}
        <div className={`${bgCard} p-5 rounded-xl shadow-sm border text-center space-y-2`}>
           <div className="flex justify-center mb-2">
              <Logo size="normal" />
           </div>
           <p className={`text-xs leading-relaxed ${textSub}`}>
              {store.settings.landingDescription}
           </p>
           <div className={`pt-3 border-t mt-2 ${borderLight}`}>
              <p className={`text-xs font-bold ${textTitle}`}>Founder & CEO</p>
              <p className="text-xs text-emerald-600 font-medium">{store.settings.founderName}</p>
           </div>
        </div>

        {/* Social */}
        <div className="space-y-2 pb-4">
           <h3 className="text-center text-xs font-bold text-gray-400 uppercase">Follow Us On</h3>
           <div className="flex justify-center gap-4">
              <a href={store.settings.facebookGroupLink} target="_blank" className={`${bgCard} p-3 rounded-full shadow-sm text-blue-600 border hover:-translate-y-1 transition`}><Facebook size={20}/></a>
              <a href={store.settings.youtubeLink} target="_blank" className={`${bgCard} p-3 rounded-full shadow-sm text-red-600 border hover:-translate-y-1 transition`}><Youtube size={20}/></a>
              <a href={store.settings.telegramLink} target="_blank" className={`${bgCard} p-3 rounded-full shadow-sm text-sky-500 border hover:-translate-y-1 transition`}><Send size={20}/></a>
           </div>
        </div>

        <style>{`@keyframes marquee { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } } .animate-marquee { animation: marquee 15s linear infinite; }`}</style>
      </div>
    );
  };

  // --- FULL VIEWS (Components) ---

  // 4. Free Job Hub
  const FreeJobHub = () => (
     <div className="p-4 space-y-4 pb-20">
         <button onClick={() => setView('dashboard')} className={`flex items-center text-sm gap-1 mb-2 ${textSub}`}><ChevronLeft size={16} /> Back</button>
         
         <div className="bg-black rounded-xl overflow-hidden shadow-md aspect-video relative group flex items-center justify-center text-white">
            <iframe className="w-full h-full" src={store.settings.tutorialVideos.workVideo} title="Work Video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
         </div>

         <div className={`p-6 rounded-2xl text-center shadow-sm border ${darkMode ? 'bg-indigo-900/20 border-indigo-800' : 'bg-indigo-50 border-indigo-100'}`}>
             <h2 className={`text-xl font-bold mb-2 ${darkMode ? 'text-indigo-400' : 'text-indigo-700'}`}>Free Job Center</h2>
             <p className={`text-sm mb-4 ${textSub}`}>Watch the video above to understand how to work.</p>
             <button onClick={() => setView('tasks')} className="bg-indigo-600 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-indigo-700 animate-pulse">
                Start Job (কাজ শুরু করুন)
             </button>
         </div>

         <div className="grid grid-cols-2 gap-4 mt-4">
            <button onClick={() => setView('tasks')} className={`${bgCard} p-4 rounded-xl shadow-sm border flex flex-col items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition`}>
               <div className="bg-emerald-100 p-3 rounded-full text-emerald-600"><CheckSquare size={24}/></div>
               <span className={`font-bold text-sm ${textTitle}`}>All Tasks</span>
            </button>
            <button onClick={() => setView('gmail-sell')} className={`${bgCard} p-4 rounded-xl shadow-sm border flex flex-col items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition`}>
               <div className="bg-pink-100 p-3 rounded-full text-pink-600"><Mail size={24}/></div>
               <span className={`font-bold text-sm ${textTitle}`}>Gmail Sell</span>
            </button>
            <button onClick={() => setView('referral-quiz')} className={`${bgCard} p-4 rounded-xl shadow-sm border flex flex-col items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition`}>
               <div className="bg-orange-100 p-3 rounded-full text-orange-600"><Brain size={24}/></div>
               <span className={`font-bold text-sm ${textTitle}`}>Referral Task</span>
            </button>
            <button onClick={() => setShowFreeJobModal(true)} className={`${bgCard} p-4 rounded-xl shadow-sm border flex flex-col items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition`}>
               <div className="bg-blue-100 p-3 rounded-full text-blue-600"><ShieldAlert size={24}/></div>
               <span className={`font-bold text-sm ${textTitle}`}>Rules & Info</span>
            </button>
         </div>
     </div>
  );

  // 11d. Referral Quiz View (Full implementation)
  const ReferralQuizView = () => {
      const [quizState, setQuizState] = useState<'IDLE' | 'SOLVING' | 'CLAIMING' | 'WAITING'>('IDLE');
      const [num1, setNum1] = useState(0);
      const [num2, setNum2] = useState(0);
      const [answer, setAnswer] = useState('');
      const [timer, setTimer] = useState(0);
      
      const quizRate = store.settings.referralConfig.quizRate || 1;
      const pending = currentUser?.pendingReferralBonus || 0;

      const startQuiz = () => {
          if (pending < quizRate) return showToast("No pending referral bonus to claim!");
          setNum1(Math.floor(Math.random() * 10) + 1);
          setNum2(Math.floor(Math.random() * 10) + 1);
          setQuizState('SOLVING');
          setAnswer('');
      };

      const submitAnswer = () => {
          if (parseInt(answer) === num1 + num2) {
              setQuizState('CLAIMING');
          } else {
              showToast("Wrong Answer!");
          }
      };

      const handleClaim = () => {
          const links = store.settings.referralConfig.quizAdLinks;
          const randomLink = links[Math.floor(Math.random() * links.length)] || "https://google.com";
          window.open(randomLink, '_blank');
          setQuizState('WAITING');
          setTimer(30);
      };

      useEffect(() => {
          if (quizState === 'WAITING' && timer > 0) {
              const t = setTimeout(() => setTimer(timer - 1), 1000);
              return () => clearTimeout(t);
          } else if (quizState === 'WAITING' && timer === 0) {
              if (currentUser && currentUser.pendingReferralBonus >= quizRate) {
                  const updatedUser = { 
                      ...currentUser,
                      pendingReferralBonus: currentUser.pendingReferralBonus - quizRate,
                      balanceFree: currentUser.balanceFree + quizRate
                  };
                  store.updateUser(updatedUser);
                  showToast(`Successfully claimed ${quizRate} Tk!`);
              }
              setQuizState('IDLE');
          }
      }, [quizState, timer]);

      return (
          <div className="p-4 space-y-6 pb-20">
              <button onClick={() => setView('free-job-hub')} className={`flex items-center text-sm gap-1 mb-2 ${textSub}`}><ChevronLeft size={16} /> Back</button>
              
              <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 rounded-2xl text-white shadow-lg text-center">
                  <h2 className="text-2xl font-bold flex justify-center items-center gap-2"><Brain size={28}/> Referral Quiz</h2>
                  <p className="opacity-90 mt-2 text-sm">Convert your pending bonus to Free Wallet balance.</p>
                  <div className="mt-4 bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                      <p className="text-xs uppercase font-bold opacity-80">Pending Bonus</p>
                      <h3 className="text-3xl font-bold">{pending} ৳</h3>
                  </div>
              </div>

              {quizState === 'IDLE' && (
                  <div className={`${bgCard} p-6 rounded-xl shadow-sm border text-center space-y-4`}>
                      <p className={`text-sm ${textSub}`}>Solve simple math problems to claim your referral registration bonus. You get <strong>{quizRate} Tk</strong> per quiz.</p>
                      <button onClick={startQuiz} disabled={pending < quizRate} className={`w-full py-3 rounded-xl font-bold text-white shadow-lg ${pending < quizRate ? 'bg-gray-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700 animate-pulse'}`}>
                          {pending < quizRate ? 'No Pending Bonus' : 'Start Quiz Task'}
                      </button>
                  </div>
              )}

              {quizState === 'SOLVING' && (
                  <div className={`${bgCard} p-6 rounded-xl shadow-sm border text-center space-y-4 animate-in zoom-in duration-200`}>
                      <h3 className={`text-xl font-bold ${textTitle}`}>Calculate: {num1} + {num2} = ?</h3>
                      <input type="number" className={bgInput + " w-full p-3 border-2 rounded-xl text-center text-xl font-bold"} value={answer} onChange={e => setAnswer(e.target.value)} placeholder="?"/>
                      <button onClick={submitAnswer} className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold shadow-lg">Submit Answer</button>
                  </div>
              )}

              {quizState === 'CLAIMING' && (
                  <div className={`${bgCard} p-6 rounded-xl shadow-sm border text-center space-y-4`}>
                      <div className="text-green-500 mx-auto"><CheckCircle size={48}/></div>
                      <h3 className={`text-lg font-bold ${textTitle}`}>Correct!</h3>
                      <p className={`text-sm ${textSub}`}>Click below to visit the sponsor link. Wait 30 seconds to claim reward.</p>
                      <button onClick={handleClaim} className="w-full bg-orange-500 text-white py-3 rounded-xl font-bold shadow-lg animate-bounce">Visit & Claim Reward</button>
                  </div>
              )}

              {quizState === 'WAITING' && (
                  <div className={`${bgCard} p-6 rounded-xl shadow-sm border text-center space-y-4`}>
                      <div className="text-blue-500 mx-auto animate-spin"><RefreshCw size={48}/></div>
                      <h3 className={`text-xl font-bold ${textTitle}`}>Please Wait...</h3>
                      <p className="text-4xl font-mono font-bold text-blue-600">{timer}s</p>
                      <p className="text-xs text-red-500">Do not close this tab!</p>
                  </div>
              )}
          </div>
      );
  };

  // 7. Wallet View
  const WalletView = () => {
    const today = new Date().toDateString();
    const todayTasks = store.submissions.filter(s => s.userId === currentUser?.id && s.status === 'APPROVED' && new Date(s.submittedAt).toDateString() === today);
    const todayTaskIncome = todayTasks.reduce((acc, curr) => acc + curr.amount, 0);
    const totalWithdraws = store.withdrawals.filter(w => w.userId === currentUser?.id && w.status === 'APPROVED').reduce((acc, curr) => acc + curr.amount, 0);

    const WalletCard = ({ title, balance, color, icon: Icon }: any) => (
        <div className={`p-4 rounded-xl text-white shadow-lg text-left ${color} relative overflow-hidden h-32 flex flex-col justify-center`}>
           <div className="relative z-10">
               <p className="text-xs opacity-90 uppercase font-bold tracking-wider mb-1">{title}</p>
               <h3 className="text-3xl font-extrabold">{balance || 0} ৳</h3>
           </div>
           <div className="absolute -right-2 -bottom-4 opacity-20"><Icon size={80}/></div>
        </div>
    );

    return (
       <div className="p-4 space-y-6 pb-20">
          <button onClick={() => setView('dashboard')} className={`flex items-center text-sm gap-1 mb-2 ${textSub}`}><ChevronLeft size={16} /> Back</button>
          
          <div className={`${bgCard} p-4 rounded-xl shadow-sm border flex justify-between items-center`}>
             <div><p className={`text-xs font-bold uppercase ${textSub}`}>Total Earnings</p><h3 className="text-2xl font-bold text-emerald-600">{(currentUser?.balanceMain || 0) + (currentUser?.balanceFree || 0)} ৳</h3></div>
             <div className="bg-emerald-50 p-3 rounded-full"><DollarSign className="text-emerald-600"/></div>
          </div>

          <div className="grid grid-cols-2 gap-3">
              <div className={`${bgCard} p-3 rounded-xl shadow-sm border text-center`}>
                  <p className={`text-[10px] uppercase font-bold ${textSub}`}>Today's Income</p>
                  <p className="text-lg font-bold text-green-600">+{todayTaskIncome} ৳</p>
              </div>
              <div className={`${bgCard} p-3 rounded-xl shadow-sm border text-center`}>
                  <p className={`text-[10px] uppercase font-bold ${textSub}`}>Total Withdraw</p>
                  <p className="text-lg font-bold text-red-500">-{totalWithdraws} ৳</p>
              </div>
          </div>

          <div className="space-y-4">
             <WalletCard title="Main Wallet (Premium)" balance={currentUser?.balanceMain} color="bg-gradient-to-r from-blue-600 to-blue-500" icon={Crown} />
             <WalletCard title="Free Wallet" balance={currentUser?.balanceFree} color="bg-gradient-to-r from-emerald-600 to-emerald-500" icon={Briefcase} />
          </div>

          <button onClick={() => setView('withdraw-form')} className="w-full bg-slate-800 text-white py-4 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2">
             <DollarSign size={20}/> Withdraw Money (উত্তোলন করুন)
          </button>
          <button onClick={() => setView('job-withdraw')} className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2">
             <Briefcase size={20}/> Job Transfer (Other Sites)
          </button>
       </div>
    );
  };

  // 8. Withdraw Form View (FIXED: Strict Rules for Free/Premium)
  const WithdrawFormView = () => {
    const [amount, setAmount] = useState('');
    const [method, setMethod] = useState('bkash');
    const [number, setNumber] = useState('');
    const [walletType, setWalletType] = useState<WalletType>('FREE');

    const handleWithdraw = async () => {
       const val = parseFloat(amount);
       const latestUser = store.users.find(u => u.id === currentUser?.id);
       if(!latestUser) return showToast("User session error.");

       const balance = walletType === 'FREE' ? latestUser.balanceFree : latestUser.balanceMain;
       // Added safety check for missing rule
       const rule = store.settings.withdrawRules?.[walletType] || { minWithdraw: 0, feePercent: 0, enabled: false };

       // 1. Check Balance
       if((balance || 0) < val) return showToast("Insufficient Balance in selected wallet");
       
       // 2. Check Min Withdraw
       if(val < rule.minWithdraw) return showToast(`Minimum withdraw for ${walletType} wallet is ${rule.minWithdraw} Tk`);

       // 3. STRICT PREMIUM RULE for MAIN Wallet
       if (walletType === 'MAIN' && latestUser.accountType !== 'PREMIUM') {
           return showToast("আপনার একাউন্ট অ্যাক্টিভেশন (Premium) করা নেই। প্রিমিয়াম ব্যালেন্স উত্তোলন করতে হলে একাউন্ট অ্যাক্টিভেশন করতে হবে।");
       }

       // 4. STRICT FREE USER LIMIT for FREE Wallet
       if (walletType === 'FREE' && latestUser.accountType !== 'PREMIUM') {
            const pastFreeWithdraws = store.withdrawals.filter(w => 
                w.userId === latestUser.id && 
                w.walletType === 'FREE' && 
                (w.status === 'APPROVED' || w.status === 'PENDING')
            ).length;

            if (pastFreeWithdraws >= 1) {
                return showToast("ফ্রি ইউজাররা শুধুমাত্র ১ বার ফ্রি ওয়ালেট থেকে উত্তোলন করতে পারবেন। দ্বিতীয়বার উত্তোলন করতে একাউন্ট প্রিমিয়াম করুন।");
            }
       }

       // 5. Deduct and Request
       const updatedUser = { ...latestUser };
       if(walletType === 'FREE') updatedUser.balanceFree = (updatedUser.balanceFree || 0) - val;
       else updatedUser.balanceMain = (updatedUser.balanceMain || 0) - val;
       
       await store.updateUser(updatedUser);

       await store.requestWithdraw({ 
           id: Date.now().toString(), 
           userId: latestUser.id, 
           userName: latestUser.name, 
           amount: val, 
           walletType, 
           fee: 0, 
           finalAmount: val, 
           status: 'PENDING', 
           requestDate: new Date().toISOString(), 
           paymentMethod: method, 
           paymentNumber: number 
       });
       
       showToast("Withdrawal Request Submitted Successfuly!"); 
       setView('wallet');
    };
    
    // Safety check if settings are not loaded
    const rule = store.settings.withdrawRules?.[walletType] || { minWithdraw: 0 };

    return (
       <div className="p-4 space-y-6 pb-20">
          <button onClick={() => setView('wallet')} className={`flex items-center text-sm gap-1 mb-2 ${textSub}`}><ChevronLeft size={16} /> Back to Wallet</button>
          
          <div className={`${bgCard} p-6 rounded-xl shadow-lg border space-y-5`}>
             <div className="text-center">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2"><DollarSign size={28}/></div>
                <h3 className={`font-bold text-xl ${textTitle}`}>Withdraw Money</h3>
                <p className={`text-xs ${textSub}`}>Select wallet and enter details</p>
             </div>

             <div className="space-y-4">
                <div>
                   <label className={`block text-xs font-bold mb-1 ${textTitle}`}>Select Wallet</label>
                   <div className="grid grid-cols-2 gap-2">
                      <button onClick={() => setWalletType('MAIN')} className={`py-3 px-1 rounded-lg text-xs font-bold border transition ${walletType === 'MAIN' ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-50 text-gray-600 border-gray-200'}`}>Main Wallet (Premium)</button>
                      <button onClick={() => setWalletType('FREE')} className={`py-3 px-1 rounded-lg text-xs font-bold border transition ${walletType === 'FREE' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-gray-50 text-gray-600 border-gray-200'}`}>Free Wallet</button>
                   </div>
                   <p className="text-[10px] text-gray-400 mt-1">
                       Available: {walletType === 'MAIN' ? currentUser?.balanceMain : currentUser?.balanceFree} Tk
                   </p>
                </div>

                <div>
                   <label className={`block text-xs font-bold mb-1 ${textTitle}`}>Payment Method</label>
                   <select className={bgInput + " w-full p-3 rounded-lg"} value={method} onChange={e=>setMethod(e.target.value)}><option value="bkash">bKash</option><option value="nagad">Nagad</option><option value="rocket">Rocket</option></select>
                </div>

                <div>
                   <label className={`block text-xs font-bold mb-1 ${textTitle}`}>Account Number</label>
                   <input className={bgInput + " w-full p-3 rounded-lg"} placeholder="017xxxxxxxx" value={number} onChange={e=>setNumber(e.target.value)}/>
                </div>

                <div>
                   <label className={`block text-xs font-bold mb-1 ${textTitle}`}>Amount</label>
                   <input className={bgInput + " w-full p-3 rounded-lg"} type="number" placeholder="Enter Amount" value={amount} onChange={e=>setAmount(e.target.value)}/>
                   <div className="text-[10px] text-gray-500 mt-1 flex justify-between">
                       <span>Min: {rule.minWithdraw} Tk</span>
                       {walletType === 'FREE' && <span>Limit: {store.settings.planLimits.freeMaxWithdraw} Tk</span>}
                       {walletType === 'MAIN' && <span>Limit: {store.settings.planLimits.premiumMaxWithdraw} Tk</span>}
                   </div>
                </div>

                <button onClick={handleWithdraw} className="w-full bg-emerald-600 text-white py-3.5 rounded-xl font-bold shadow-md hover:bg-emerald-700 transition">Confirm Withdraw</button>
             </div>
          </div>
       </div>
    );
  };
  
  // 9. Tasks List View (Hide submitted)
  const TasksView = () => {
    // Logic to filter submitted tasks
    const submittedTaskIds = store.submissions
        .filter(s => s.userId === currentUser?.id)
        .map(s => s.taskId);
        
    const tasks = store.tasks.filter(t => t.type === 'FREE' && !submittedTaskIds.includes(t.id));

    return (
        <div className="p-4 space-y-4 pb-20">
             <button onClick={() => setView('free-job-hub')} className={`flex items-center text-sm gap-1 mb-2 ${textSub}`}><ChevronLeft size={16} /> Back</button>
             <h3 className={`font-bold ${textTitle}`}>Available Tasks</h3>
             <div className="space-y-3">
                 {tasks.map(task => (
                    <div key={task.id} className={`${bgCard} p-3 rounded-xl shadow-sm flex gap-3 border`}>
                       <img src={task.image} className="w-16 h-16 rounded bg-gray-100 object-cover"/>
                       <div className="flex-1 flex flex-col justify-between">
                         <h4 className={`font-bold text-sm line-clamp-1 ${textTitle}`}>{task.title}</h4>
                         <div className="flex justify-between mt-2 items-center">
                             <span className="text-emerald-600 font-bold">{task.amount} Tk</span> 
                             <button onClick={() => { setSelectedTask(task); setView('task-detail'); }} className="bg-emerald-600 text-white px-4 py-1.5 rounded-lg text-xs font-bold">Start</button>
                         </div>
                       </div>
                    </div>
                 ))}
                 {tasks.length === 0 && <p className="text-gray-500 text-center py-10">No tasks available right now or you have completed all tasks.</p>}
             </div>
        </div>
    );
  };

  // 10. Task Detail View (Modified to go back to filtered list)
  const TaskDetailView = () => {
    if (!selectedTask) { setView('tasks'); return null; }
    const [proof, setProof] = useState('');
    const [screenLink, setScreenLink] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const handleSubmit = async () => {
        if(!proof && !screenLink) return showToast("Please provide proof (Text or Link)");
        setIsSubmitting(true);
        
        try {
            await store.submitTask({
                id: Date.now().toString(),
                userId: currentUser!.id,
                taskId: selectedTask.id,
                taskTitle: selectedTask.title,
                proofText: proof,
                screenshotLink: screenLink,
                status: 'PENDING',
                submittedAt: new Date().toISOString(),
                amount: selectedTask.amount
            });
            showToast("Task Submitted Successfully! Check History for Status.");
            // Navigate back, which will refresh the list and hide this task
            if (selectedTask.type === 'FREE') setView('tasks');
            else setView('premium-task-list');
        } catch (error) {
            showToast("Submission failed. Try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-4 space-y-4 pb-20">
            <button onClick={() => selectedTask.type === 'FREE' ? setView('tasks') : setView('premium-task-list')} className={`flex items-center text-sm gap-1 mb-2 ${textSub}`}><ChevronLeft size={16} /> Back to Tasks</button>
            <div className={`${bgCard} p-4 rounded-xl shadow-sm border space-y-4`}>
                <img src={selectedTask.image} className="w-full h-48 object-cover rounded-lg bg-gray-100"/>
                <div>
                    <h2 className={`text-lg font-bold ${textTitle}`}>{selectedTask.title}</h2>
                    <p className="text-emerald-600 font-bold text-lg">{selectedTask.amount} Tk</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-700 whitespace-pre-wrap dark:bg-gray-700 dark:text-gray-300">
                    {selectedTask.description}
                </div>
                {selectedTask.link && (
                    <a href={selectedTask.link} target="_blank" className="block w-full text-center bg-blue-600 text-white py-3 rounded-lg font-bold">Open Task Link</a>
                )}
                
                <div className={`border-t pt-4 space-y-3 ${borderLight}`}>
                    <h3 className={`font-bold text-sm ${textTitle}`}>Submit Proof</h3>
                    <input className={bgInput + " w-full p-3 rounded-lg text-sm"} placeholder="Type text proof..." value={proof} onChange={e => setProof(e.target.value)} />
                    <input className={bgInput + " w-full p-3 rounded-lg text-sm"} placeholder="Screenshot Link..." value={screenLink} onChange={e => setScreenLink(e.target.value)} />
                    <button onClick={handleSubmit} disabled={isSubmitting} className="w-full bg-emerald-600 text-white py-3 rounded-lg font-bold flex justify-center items-center gap-2">
                        {isSubmitting ? <Loader className="animate-spin" size={20}/> : "Submit Task"}
                    </button>
                </div>
            </div>
        </div>
    );
  };
  
  // 11b. New Premium Support Full Page (As Requested: "new page open hobe")
  const PremiumSupportPage = () => {
      return (
          <div className="p-4 space-y-6 pb-20 bg-white min-h-screen">
              <button onClick={() => setView('premium')} className="flex items-center text-gray-500 text-sm gap-1 mb-2"><ChevronLeft size={16} /> Back to Premium</button>
              
              <div className="text-center py-6 bg-gradient-to-r from-amber-100 to-orange-50 rounded-2xl border border-amber-100">
                  <div className="bg-white p-4 rounded-full inline-block mb-3 shadow-sm"><Headset size={40} className="text-amber-600"/></div>
                  <h2 className="text-2xl font-bold text-gray-800">Premium Support Center</h2>
                  <p className="text-sm text-gray-600 px-4 mt-2">Dedicated support line for our premium members. Solve your issues instantly.</p>
              </div>

              <div className="space-y-4">
                  <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                          <div className="bg-green-100 p-3 rounded-full text-green-600"><Smartphone size={24}/></div>
                          <div>
                              <p className="text-xs font-bold text-gray-500 uppercase">Admin WhatsApp</p>
                              <p className="font-mono font-bold text-lg text-gray-800">{store.settings.supportConfig.premiumAdminWhatsapp}</p>
                          </div>
                      </div>
                      <button onClick={() => handleCopy(store.settings.supportConfig.premiumAdminWhatsapp)} className="text-emerald-600 hover:bg-emerald-50 p-2 rounded-full"><Copy size={20}/></button>
                  </div>

                  <a href={store.settings.supportConfig.whatsappSupportLink} target="_blank" className="flex items-center justify-between p-5 bg-green-50 rounded-xl border border-green-200 hover:bg-green-100 transition shadow-sm group">
                      <div className="flex items-center gap-4">
                          <MessageCircle size={28} className="text-green-600"/>
                          <div>
                              <h4 className="font-bold text-green-800">Direct Message</h4>
                              <p className="text-xs text-green-600">Chat with Admin on WhatsApp</p>
                          </div>
                      </div>
                      <ChevronRight className="text-green-400 group-hover:translate-x-1 transition"/>
                  </a>

                  <a href={store.settings.supportConfig.premiumSupportGroupLink} target="_blank" className="flex items-center justify-between p-5 bg-blue-50 rounded-xl border border-blue-200 hover:bg-blue-100 transition shadow-sm group">
                      <div className="flex items-center gap-4">
                          <Send size={28} className="text-blue-600"/>
                          <div>
                              <h4 className="font-bold text-blue-800">Premium Group</h4>
                              <p className="text-xs text-blue-600">Join official Telegram community</p>
                          </div>
                      </div>
                      <ChevronRight className="text-blue-400 group-hover:translate-x-1 transition"/>
                  </a>
              </div>

              <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                  <h4 className="font-bold text-gray-700 mb-2 text-sm flex items-center gap-2"><ShieldAlert size={16}/> Important Note</h4>
                  <p className="text-xs text-gray-600 leading-relaxed text-justify">
                      {store.settings.supportConfig.supportDescription || "Please do not spam messages. Admins are available from 10 AM to 10 PM. For payment issues, send screenshot and transaction ID directly."}
                  </p>
              </div>
          </div>
      );
  };

  // 11. Premium View (Updated with link to Support Page and Custom Buttons)
  const PremiumView = () => {
    const isPremium = currentUser?.accountType === 'PREMIUM';
    const pendingReq = store.premiumRequests.find(r => r.userId === currentUser?.id && r.status === 'PENDING');
    const [showPayment, setShowPayment] = useState(false);

    const JobButton = ({ icon: Icon, title, color, onClick, customIcon }: any) => (
        <button onClick={onClick} className="flex flex-col items-center gap-2 active:scale-95 transition group">
            <div className={`p-3 rounded-xl ${color} shadow-sm group-hover:shadow-md transition-all w-12 h-12 flex items-center justify-center border border-transparent`}>
                {customIcon ? <img src={customIcon} className="w-6 h-6 object-contain"/> : <Icon size={22}/>}
            </div>
            <span className={`text-[11px] font-bold whitespace-nowrap overflow-hidden text-ellipsis w-full text-center ${textSub}`}>{title}</span>
        </button>
    );

    const premiumTasks = store.tasks.filter(t => t.type === 'PAID');

    const [trxId, setTrxId] = useState('');
    const [method, setMethod] = useState('bkash');
    const [senderNumber, setSenderNumber] = useState('');
    
    const handlePayment = async () => {
        if(!trxId || !senderNumber) return showToast("Fill all fields");
        await store.addPremiumRequest({ id: Date.now().toString(), userId: currentUser!.id, userName: currentUser!.name, amount: store.settings.premiumFee, transactionId: trxId, method, paymentFromNumber: senderNumber, status: 'PENDING', date: new Date().toISOString() });
        showToast("Request Submitted!"); 
        setView('dashboard');
    };

    const handleSupport = () => {
        setView('premium-support-page'); 
    };

    if (pendingReq && !isPremium) {
        return (
            <div className="p-4 space-y-6 pb-20 bg-white min-h-screen text-center">
               <button onClick={() => setView('dashboard')} className="flex items-center text-gray-500 text-sm gap-1 mb-2"><ChevronLeft size={16} /> Back</button>
               
               <div className="bg-amber-50 p-6 rounded-2xl border border-amber-200 mt-10">
                   <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                       <Clock size={32}/>
                   </div>
                   <h2 className="text-xl font-bold text-gray-800 mb-2">Request Pending</h2>
                   <p className="text-sm text-gray-600 mb-4">Your premium upgrade request is under review. Please wait for admin approval.</p>
                   
                   <div className="text-left bg-white p-4 rounded-xl border border-gray-100 space-y-2 text-sm">
                       <div className="flex justify-between"><span className="text-gray-500">Amount:</span> <span className="font-bold">{pendingReq.amount} Tk</span></div>
                       <div className="flex justify-between"><span className="text-gray-500">Number:</span> <span className="font-bold">{pendingReq.paymentFromNumber}</span></div>
                       <div className="flex justify-between"><span className="text-gray-500">Method:</span> <span className="font-bold uppercase">{pendingReq.method}</span></div>
                       <div className="flex justify-between"><span className="text-gray-500">TrxID:</span> <span className="font-bold font-mono">{pendingReq.transactionId}</span></div>
                       <div className="flex justify-between border-t pt-2 mt-2"><span className="text-gray-500">Status:</span> <span className="font-bold text-amber-600 bg-amber-50 px-2 rounded">PENDING</span></div>
                   </div>
               </div>
            </div>
        )
    }

    if (!isPremium && !showPayment) {
       return (
           <div className="p-4 space-y-6 pb-20 bg-white min-h-screen">
               <button onClick={() => setView('dashboard')} className="flex items-center text-gray-500 text-sm gap-1 mb-2"><ChevronLeft size={16} /> Back</button>
               
               <div className="text-center space-y-4">
                   <div className="bg-amber-100 p-5 rounded-full inline-block mb-2 shadow-sm border border-amber-200"><Crown size={48} className="text-amber-600"/></div>
                   <h2 className="text-2xl font-bold text-gray-900">Premium Membership</h2>
                   <p className="text-sm text-gray-500">Upgrade to Premium and unlock these exclusive benefits.</p>
               </div>
               
               <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 space-y-3">
                   {(store.settings.messages?.premiumBenefits || []).map((b, i) => (
                       <div key={i} className="flex gap-3 items-center">
                           <CheckCircle size={18} className="text-emerald-500 flex-shrink-0"/>
                           <span className="text-sm text-gray-700" dangerouslySetInnerHTML={{__html: b}}></span>
                       </div>
                   ))}
               </div>

               <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 text-center">
                   <p className="text-xs text-amber-800 font-bold uppercase mb-1">Membership Fee</p>
                   <h3 className="text-3xl font-extrabold text-amber-600">{store.settings.premiumFee} ৳</h3>
                   <p className="text-[10px] text-gray-500">Lifetime Access • One Time Payment</p>
               </div>

               <button onClick={() => setShowPayment(true)} className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold shadow-xl hover:bg-emerald-700 transition flex items-center justify-center gap-2">
                   Upgrade Now <ArrowRight size={18}/>
               </button>
           </div>
       )
    }

    if (!isPremium && showPayment) {
        return (
            <div className="p-4 space-y-6 pb-20 bg-white min-h-screen">
                <button onClick={() => setShowPayment(false)} className="flex items-center text-gray-500 text-sm gap-1 mb-2"><ChevronLeft size={16} /> Back to Benefits</button>
                
                <div className="text-center mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Complete Payment</h2>
                    <p className="text-sm text-gray-500">Send <strong>{store.settings.premiumFee} Tk</strong> to any number below.</p>
                </div>

                <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 space-y-3">
                    <div className="flex justify-between items-center bg-white p-3 rounded border border-gray-100">
                        <span className="font-bold text-pink-600 flex items-center gap-2"><Smartphone size={16}/> bKash</span>
                        <div className="flex items-center gap-2">
                             <span className="font-mono text-gray-800">{store.settings.paymentNumbers.bkash}</span>
                             <CopyIcon size={14} className="text-gray-400 cursor-pointer" onClick={() => handleCopy(store.settings.paymentNumbers.bkash)}/>
                        </div>
                    </div>
                    <div className="flex justify-between items-center bg-white p-3 rounded border border-gray-100">
                        <span className="font-bold text-orange-600 flex items-center gap-2"><Smartphone size={16}/> Nagad</span>
                        <div className="flex items-center gap-2">
                             <span className="font-mono text-gray-800">{store.settings.paymentNumbers.nagad}</span>
                             <CopyIcon size={14} className="text-gray-400 cursor-pointer" onClick={() => handleCopy(store.settings.paymentNumbers.nagad)}/>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Your Payment Number</label>
                        <input className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900" placeholder="017xxxxxxxx" value={senderNumber} onChange={e=>setSenderNumber(e.target.value)}/>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Payment Method</label>
                        <select className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900" value={method} onChange={e=>setMethod(e.target.value)}><option value="bkash">bKash</option><option value="nagad">Nagad</option></select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Transaction ID</label>
                        <input className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900" placeholder="TrxID (e.g. 9JHS...)" value={trxId} onChange={e=>setTrxId(e.target.value)}/>
                    </div>

                    <button onClick={handlePayment} className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold shadow-lg hover:bg-emerald-700 transition">
                        Submit Payment Request
                    </button>
                </div>
            </div>
        );
    }

    // --- State 3: Premium User Dashboard ---
    return (
       <div className="p-4 space-y-6 pb-20">
          <div className="flex justify-between items-center">
             <button onClick={() => setView('dashboard')} className={`flex items-center text-sm gap-1 ${textSub}`}><ChevronLeft size={16} /> Back</button>
             <button onClick={handleSupport} className="flex items-center gap-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-md hover:scale-105 transition cursor-pointer">
                 <Headset size={14}/> Premium Support
             </button>
          </div>
          
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-6 rounded-2xl text-white shadow-xl relative overflow-hidden">
              <div className="absolute right-0 top-0 p-10 bg-white opacity-5 rounded-full blur-2xl"></div>
              <h2 className="text-xl font-bold flex items-center gap-2"><Crown className="text-amber-400"/> Premium Zone</h2>
              <p className="text-xs text-gray-400 mt-1">Exclusive high-paying tasks for you.</p>
          </div>

          <div className={`${bgCard} p-4 rounded-2xl shadow-sm border`}>
              <h3 className={`font-bold text-sm mb-3 ml-1 ${textTitle}`}>Premium Tools & Services</h3>
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                  <JobButton icon={Mail} title="Gmail" color="bg-red-50 text-red-600" onClick={() => setView('gmail-sell')} />
                  <JobButton icon={Facebook} title="Facebook" color="bg-blue-50 text-blue-600" onClick={() => setView('fb-sell')} />
                  <JobButton icon={Instagram} title="Instagram" color="bg-pink-50 text-pink-600" onClick={() => setView('insta-sell')} />
                  <JobButton icon={Music} title="TikTok" color="bg-black text-white" onClick={() => setView('tiktok-sell')} />
                  <JobButton icon={CheckSquare} title="Tasks" color="bg-amber-50 text-amber-600" onClick={() => setView('premium-task-list')} />
                  
                  {/* Dynamic Custom Buttons (Now in Premium) */}
                  {(store.settings.customPages || []).map(page => (
                     <JobButton 
                        key={page.id}
                        icon={Link} 
                        customIcon={page.iconUrl}
                        title={page.buttonName} 
                        color="bg-gray-50 text-gray-600 border border-gray-200" 
                        onClick={() => { setActiveCustomPage(page); setView('custom-page'); }} 
                     />
                  ))}
              </div>
          </div>

          {/* Premium Tasks List */}
          <div>
              <h3 className={`font-bold mb-3 flex items-center gap-2 ${textTitle}`}><CheckSquare size={18}/> Quick Tasks</h3>
              <div className="space-y-3">
                  {premiumTasks.slice(0, 3).map(task => (
                      <div key={task.id} onClick={() => { setSelectedTask(task); setView('task-detail'); }} className={`${bgCard} p-4 rounded-xl shadow-sm border flex gap-3 items-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700`}>
                          <img src={task.image} className="w-12 h-12 rounded-lg bg-gray-100 object-cover"/>
                          <div className="flex-1">
                              <h4 className={`font-bold text-sm line-clamp-1 ${textTitle}`}>{task.title}</h4>
                              <p className="text-xs text-emerald-600 font-bold">{task.amount} Tk</p>
                          </div>
                      </div>
                  ))}
                  <button onClick={() => setView('premium-task-list')} className="w-full text-center text-xs text-emerald-600 font-bold py-2 bg-emerald-50 rounded-lg">View All Tasks</button>
              </div>
          </div>
       </div>
    );
  };

  // 12. Premium Task List View
  const PremiumTaskListView = () => {
    // Logic to filter submitted tasks
    const submittedTaskIds = store.submissions
        .filter(s => s.userId === currentUser?.id)
        .map(s => s.taskId);

    const tasks = store.tasks.filter(t => t.type === 'PAID' && !submittedTaskIds.includes(t.id));
    return (
        <div className="p-4 space-y-4 pb-20">
             <button onClick={() => setView('premium')} className={`flex items-center text-sm gap-1 mb-2 ${textSub}`}><ChevronLeft size={16} /> Back to Premium</button>
             <h3 className={`font-bold ${textTitle}`}>Premium Tasks</h3>
             <div className="space-y-3">
                 {tasks.map(task => (
                    <div key={task.id} className={`${bgCard} p-3 rounded-xl shadow-sm flex gap-3 border border-amber-100`}>
                       <img src={task.image} className="w-16 h-16 rounded bg-gray-100 object-cover"/>
                       <div className="flex-1 flex flex-col justify-between">
                         <h4 className={`font-bold text-sm line-clamp-1 ${textTitle}`}>{task.title}</h4>
                         <div className="flex justify-between mt-2 items-center">
                             <span className="text-amber-600 font-bold">{task.amount} Tk</span> 
                             <button onClick={() => { setSelectedTask(task); setView('task-detail'); }} className="bg-amber-600 text-white px-4 py-1.5 rounded-lg text-xs font-bold">Start</button>
                         </div>
                       </div>
                    </div>
                 ))}
                 {tasks.length === 0 && <p className="text-gray-500 text-center py-10">No premium tasks available.</p>}
             </div>
        </div>
    );
  };

  // 13. Social Task View (Updated with History and Merged Logic)
  const SocialTaskView = ({ type }: { type: 'GMAIL' | 'FACEBOOK' | 'INSTAGRAM' | 'TIKTOK' }) => {
      const isFree = currentUser?.accountType === 'FREE';
      const myOrders = store.socialSells.filter(s => s.userId === currentUser?.id && s.type === type).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      const config = store.settings.socialSellConfig;
      // Added safety check
      if (!config) return <div className="p-4 text-center">Config missing. Please contact admin.</div>;

      let rate = 0;
      let title = "";
      let icon = Mail;
      let bgClass = "";
      let isEnabled = false;

      if(type === 'GMAIL') { 
          rate = config.gmailRate; 
          title = "Gmail Sell"; 
          icon = Mail; 
          bgClass = "bg-red-500"; 
          isEnabled = config.isGmailOn;
      } else if(type === 'FACEBOOK') { 
          rate = config.fbRate; 
          title = "Facebook Sell"; 
          icon = Facebook; 
          bgClass = "bg-blue-600"; 
          isEnabled = config.isFbOn;
      } else if(type === 'INSTAGRAM') { 
          rate = config.instaRate; 
          title = "Instagram Sell"; 
          icon = Instagram; 
          bgClass = "bg-pink-600"; 
          isEnabled = config.isInstaOn;
      } else if(type === 'TIKTOK') { 
          rate = config.tiktokRate || 8; 
          title = "TikTok Sell"; 
          icon = Music; 
          bgClass = "bg-black"; 
          isEnabled = config.isTiktokOn;
      }
      
      const isLocked = type === 'GMAIL' && isFree && myOrders.length >= store.settings.planLimits.freeGmailLimit;

      const [identifier, setIdentifier] = useState('');
      const [password, setPassword] = useState('');
      const [uid, setUid] = useState('');
      const [twoFactor, setTwoFactor] = useState('');
      const fixedGmailPass = "Udyan@2025"; 

      const handleSubmit = async () => {
          if (!isEnabled) return showToast("This task is currently disabled.");
          if (isLocked) return showToast("Limit Reached. Upgrade to Premium.");

          if(type === 'GMAIL') {
              if(!identifier) return showToast("Please enter Gmail address");
              await store.addSocialSell({ id: Date.now().toString(), type: 'GMAIL', userId: currentUser!.id, userName: currentUser!.name, accountIdentifier: identifier, password: fixedGmailPass, rate: rate, status: 'PENDING', date: new Date().toISOString() });
          } else {
              if(!identifier || !password) return showToast("Please fill email/phone and password");
              await store.addSocialSell({ id: Date.now().toString(), type: type, userId: currentUser!.id, userName: currentUser!.name, accountIdentifier: identifier, password: password, uid: uid, twoFactorCode: twoFactor, rate: rate, status: 'PENDING', date: new Date().toISOString() });
          }
          showToast("Submitted Successfully!"); setIdentifier(''); setPassword('');
      };

      return (
          <div className="p-4 space-y-6 pb-20">
              {/* Back button logic updated to prevent blank screen */}
              <button 
                onClick={() => type === 'GMAIL' ? setView('free-job-hub') : setView('premium')} 
                className={`flex items-center text-sm gap-1 mb-2 ${textSub}`}
              >
                <ChevronLeft size={16} /> {type === 'GMAIL' ? 'Back to Jobs' : 'Back to Premium'}
              </button>
              
              <div className={`p-6 rounded-2xl text-white shadow-lg text-center ${bgClass}`}>
                  <h2 className="text-2xl font-bold flex justify-center items-center gap-2">{React.createElement(icon, { size: 28 })} {title}</h2>
                  <p className="opacity-90 text-sm mt-1">Rate: <span className="font-bold text-xl">{rate} Tk</span> per account</p>
                  {!isEnabled && <div className="mt-2 bg-black/20 inline-block px-3 py-1 rounded text-xs font-bold">Currently Disabled</div>}
              </div>

              <div className={`${bgCard} p-4 rounded-xl shadow-sm border flex items-center justify-between`}>
                  <div><h4 className={`font-bold ${textTitle}`}>Learn How To Work</h4><p className="text-xs text-gray-500">Watch video before starting</p></div>
                  <button onClick={() => setView('video-sessions')} className="bg-red-100 text-red-600 p-2 rounded-full hover:bg-red-200 transition"><PlayCircle size={24}/></button>
              </div>

              {isEnabled && !isLocked && (
                  <div className={`${bgCard} p-6 rounded-xl shadow-sm border space-y-4`}>
                      <h3 className={`font-bold border-b pb-2 ${textTitle}`}>Submit Account Details</h3>
                      {type === 'GMAIL' && (
                          <div className="bg-orange-50 p-3 rounded-lg border border-orange-100 text-sm text-orange-800 mb-2">
                              <p className="font-bold mb-1">Use this password only:</p>
                              <div className="flex items-center justify-between bg-white p-2 rounded border border-orange-200"><code className="font-mono font-bold">{fixedGmailPass}</code><CopyIcon size={16} className="cursor-pointer text-orange-500" onClick={() => handleCopy(fixedGmailPass)}/></div>
                          </div>
                      )}
                      <div><label className={`block text-xs font-bold mb-1 ${textTitle}`}>{type === 'GMAIL' ? 'Gmail Address' : 'Email or Phone'}</label><input className={bgInput + " w-full p-3 border rounded-lg"} placeholder={type === 'GMAIL' ? "example@gmail.com" : "017..."} value={identifier} onChange={e=>setIdentifier(e.target.value)}/></div>
                      {type === 'GMAIL' ? (
                          <div><label className={`block text-xs font-bold mb-1 ${textTitle}`}>Password (Auto Filled)</label><input className={bgInput + " w-full p-3 border rounded-lg opacity-50 cursor-not-allowed"} value={fixedGmailPass} readOnly/></div>
                      ) : (
                          <>
                              <div><label className={`block text-xs font-bold mb-1 ${textTitle}`}>Password</label><input className={bgInput + " w-full p-3 border rounded-lg"} placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)}/></div>
                              <div><label className={`block text-xs font-bold mb-1 ${textTitle}`}>UID (Profile Link/ID)</label><input className={bgInput + " w-full p-3 border rounded-lg"} placeholder="Profile Link / ID" value={uid} onChange={e=>setUid(e.target.value)}/></div>
                              <div><label className={`block text-xs font-bold mb-1 ${textTitle}`}>2FA / Backup Code</label><input className={bgInput + " w-full p-3 border rounded-lg"} placeholder="Enter code" value={twoFactor} onChange={e=>setTwoFactor(e.target.value)}/></div>
                          </>
                      )}
                      <button onClick={handleSubmit} className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold shadow-lg">Submit Account</button>
                  </div>
              )}

              {isLocked && <div className="p-4 bg-red-50 text-red-600 font-bold text-center rounded-xl border border-red-100">Daily Limit Reached. Upgrade to Premium for Unlimited.</div>}

              {/* History Section */}
              <div className={`${bgCard} p-4 rounded-xl shadow-sm border`}>
                  <h3 className={`font-bold mb-3 flex items-center gap-2 ${textTitle}`}><List size={18}/> Submission History</h3>
                  <div className="space-y-3">
                      {myOrders.map(h => (
                          <div key={h.id} className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} p-3 rounded-lg border flex justify-between items-center`}>
                              <div className="overflow-hidden">
                                  <p className={`text-xs font-bold truncate ${textTitle}`}>{h.accountIdentifier}</p>
                                  <p className={`text-[10px] ${textSub}`}>{new Date(h.date).toLocaleDateString()}</p>
                              </div>
                              <span className={`text-[10px] px-2 py-1 rounded font-bold ${
                                  h.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                                  h.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                              }`}>{h.status}</span>
                          </div>
                      ))}
                      {myOrders.length === 0 && <p className={`text-xs text-center py-2 ${textSub}`}>No history available.</p>}
                  </div>
              </div>
          </div>
      );
  };

  // 14. Profile View (Restored to Original Design)
  const ProfileView = () => {
    const [isEdit, setIsEdit] = useState(false);
    const [name, setName] = useState(currentUser?.name || '');
    const [pass, setPass] = useState(currentUser?.password || '');
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const saveProfile = async () => {
        if(currentUser) {
            const updatedUser = { ...currentUser, name: name, password: pass };
            await store.updateUser(updatedUser);
            setIsEdit(false); 
            showToast("Updated"); 
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && currentUser) {
            const reader = new FileReader();
            reader.onloadend = async () => {
                if (reader.result) {
                    const updatedUser = { ...currentUser, profileImage: reader.result as string };
                    await store.updateUser(updatedUser);
                    showToast("Profile Picture Updated!");
                }
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="p-4 space-y-4 pb-20">
            <button onClick={() => setView('dashboard')} className={`flex items-center text-sm gap-1 mb-2 ${textSub}`}><ChevronLeft size={16} /> Back to Home</button>
            
            <div className={`${bgCard} p-6 rounded-xl shadow-sm border flex flex-col items-center`}>
                <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                    <img src={currentUser?.profileImage} className="w-24 h-24 rounded-full border-4 border-emerald-50 mb-3 object-cover bg-gray-100"/>
                    <div className="absolute inset-0 bg-black/20 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                        <Camera className="text-white"/>
                    </div>
                    <div className="absolute bottom-0 right-0 bg-emerald-500 text-white p-1 rounded-full border-2 border-white pointer-events-none"><Edit size={12}/></div>
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload}/>
                </div>
                
                {!isEdit ? (
                    <>
                        <h2 className={`font-bold text-lg ${textTitle}`}>{currentUser?.name}</h2>
                        <p className={`text-sm mb-2 ${textSub}`}>{currentUser?.whatsapp}</p>
                        <button onClick={() => setIsEdit(true)} className="text-emerald-600 text-xs font-bold border border-emerald-200 px-3 py-1 rounded-full hover:bg-emerald-50">Edit Profile / Password</button>
                    </>
                ) : (
                    <div className="w-full space-y-3 mt-2">
                        <input className={bgInput + " w-full p-2 rounded text-sm"} value={name} onChange={e=>setName(e.target.value)} placeholder="Name"/>
                        <input className={bgInput + " w-full p-2 rounded text-sm"} value={pass} onChange={e=>setPass(e.target.value)} placeholder="Password"/>
                        <div className="flex gap-2">
                            <button onClick={saveProfile} className="flex-1 bg-emerald-600 text-white py-2 rounded text-xs font-bold">Save</button>
                            <button onClick={() => setIsEdit(false)} className="flex-1 bg-gray-200 text-gray-700 py-2 rounded text-xs font-bold">Cancel</button>
                        </div>
                    </div>
                )}
            </div>
             
             <div className={`${bgCard} rounded-xl shadow-sm overflow-hidden border`}>
                {currentUser?.isAdminAccess && (
                     <button onClick={onAdminLogin} className="w-full flex items-center justify-between p-4 bg-slate-800 text-white hover:bg-slate-700 transition">
                         <span className="flex items-center gap-2 font-bold text-sm"><Settings size={18}/> Admin Panel Login</span>
                         <ChevronRight size={16}/>
                     </button>
                )}
                
                {/* Dark Mode Toggle */}
                <div className={`w-full flex justify-between p-4 border-b text-sm font-bold items-center ${textTitle} ${borderLight}`}>
                    <span className="flex items-center gap-3"><Moon size={18}/> Dark Mode</span> 
                    <button onClick={() => setDarkMode(!darkMode)} className={`w-12 h-6 rounded-full p-1 transition-colors ${darkMode ? 'bg-emerald-500' : 'bg-gray-300'}`}>
                        <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${darkMode ? 'translate-x-6' : ''}`}></div>
                    </button>
                </div>

                <button onClick={() => setView('all-history')} className={`w-full flex justify-between p-4 border-b text-sm font-bold items-center hover:bg-gray-50 ${textTitle} ${borderLight}`}>
                    <span className="flex items-center gap-3"><History size={18}/> Income & Cashout History</span> 
                    <ChevronRight size={16} className="text-gray-400"/>
                </button>
                <button onClick={() => setView('support')} className={`w-full flex justify-between p-4 border-b text-sm font-bold items-center hover:bg-gray-50 ${textTitle} ${borderLight}`}>
                    <span className="flex items-center gap-3"><Headset size={18}/> Support Center</span> 
                    <ChevronRight size={16} className="text-gray-400"/>
                </button>
                <button onClick={() => setView('privacy')} className={`w-full flex justify-between p-4 border-b text-sm font-bold items-center hover:bg-gray-50 ${textTitle} ${borderLight}`}>
                    <span className="flex items-center gap-3"><ShieldAlert size={18}/> Privacy Policy</span> 
                    <ChevronRight size={16} className="text-gray-400"/>
                </button>
                <button onClick={onLogout} className="w-full flex justify-between p-4 hover:bg-red-50 text-sm font-bold text-red-600 items-center">
                    <span className="flex items-center gap-3"><LogOut size={18}/> Logout</span>
                </button>
            </div>

            <div className={`${bgCard} p-5 rounded-xl shadow-sm border space-y-3`}>
                <h3 className={`font-bold text-sm border-b pb-2 ${textTitle} ${borderLight}`}>Account Details</h3>
                <div className="flex justify-between text-sm"><span className="text-gray-500">User ID</span><span className={`font-medium ${textTitle}`}>{currentUser?.id}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-500">Phone</span><span className={`font-medium ${textTitle}`}>{currentUser?.whatsapp}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-500">Email</span><span className={`font-medium ${textTitle}`}>{currentUser?.email}</span></div>
            </div>
        </div>
    );
  };

  // 15. Referral View (Restored to Original Design)
  const ReferralView = () => {
    const downline = currentUser ? store.getDownline(currentUser.id) : [];
    const upline = currentUser ? store.getUpline(currentUser.id) : null;
    const [teamTab, setTeamTab] = useState<'FREE' | 'PREMIUM'>('FREE');
    const filteredTeam = downline.filter(u => u.accountType === teamTab);
    return (
        <div className="p-4 space-y-6 pb-20">
            <button onClick={() => setView('dashboard')} className={`flex items-center text-sm gap-1 mb-2 ${textSub}`}><ChevronLeft size={16} /> Back to Dashboard</button>
            
            <div className="bg-gradient-to-r from-orange-500 to-amber-600 p-6 rounded-2xl text-white shadow-lg text-center relative overflow-hidden">
               <div className="absolute -top-5 -right-5 bg-white opacity-10 rounded-full w-32 h-32"></div>
               <h2 className="text-2xl font-bold">{(currentUser?.balanceFree || 0) + (currentUser?.balanceMain || 0)} ৳</h2>
               <p className="text-xs opacity-90 mb-4">Total Income</p>
               <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm flex items-center justify-center gap-2 cursor-pointer" onClick={() => handleCopy(currentUser?.referralCode || '')}>
                  <span className="font-mono font-bold tracking-widest text-lg">{currentUser?.referralCode}</span>
                  <Copy size={16}/>
               </div>
               <p className="text-[10px] mt-2 opacity-80">Share this code to earn bonuses!</p>
            </div>

            {upline && (
                <div className={`${bgCard} p-4 rounded-xl shadow-sm border flex items-center gap-3`}>
                    <div className="bg-emerald-100 p-2 rounded-full text-emerald-600"><UserIcon size={20}/></div>
                    <div><p className="text-xs text-gray-500 font-bold">Upline Leader</p><p className={`text-sm font-bold ${textTitle}`}>{upline.name}</p></div>
                </div>
            )}

            <div className={`${bgCard} p-4 rounded-xl shadow-sm border`}>
                <h3 className={`font-bold mb-3 flex items-center gap-2 ${textTitle}`}><Users size={18}/> My Team Members ({downline.length})</h3>
                <div className="space-y-3">
                    {downline.map(u => (
                        <div key={u.id} className={`flex items-center gap-3 border-b pb-2 last:border-0 ${borderLight}`}>
                            <img src={u.profileImage} className="w-10 h-10 rounded-full bg-gray-100 object-cover"/>
                            <div className="flex-1">
                                <h4 className={`font-bold text-sm ${textTitle}`}>{u.name}</h4>
                                <p className="text-xs text-gray-500">Joined: {new Date(u.joiningDate).toLocaleDateString()}</p>
                            </div>
                            <span className={`text-[10px] font-bold px-2 py-1 rounded ${u.accountType === 'PREMIUM' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-500'}`}>{u.accountType}</span>
                        </div>
                    ))}
                    {downline.length === 0 && <p className="text-gray-400 text-sm text-center py-4">No team members yet.</p>}
                </div>
            </div>
        </div>
    );
  };

  // 16. Support View (Restored to Original Design)
  const SupportView = () => {
      const [subject, setSubject] = useState('');
      const [message, setMessage] = useState('');
      const tickets = store.supportTickets.filter(t => t.userId === currentUser?.id);

      const createTicket = async () => {
          if(!subject || !message) return showToast("Fill all fields");
          await store.addTicket({
              id: Date.now().toString(), userId: currentUser!.id, userName: currentUser!.name, subject, message, status: 'OPEN', createdAt: new Date().toISOString()
          });
          setSubject(''); setMessage(''); showToast("Ticket Created");
      };

      return (
        <div className="p-4 space-y-6 pb-20">
           <button onClick={() => setView('dashboard')} className={`flex items-center text-sm gap-1 mb-2 ${textSub}`}><ChevronLeft size={16} /> Back</button>
           <h3 className={`font-bold text-xl flex items-center gap-2 ${textTitle}`}><Headset size={24}/> Help & Support</h3>
           
           <div className={`${bgCard} p-5 rounded-xl shadow-sm border space-y-4`}>
              <h4 className={`font-bold ${textTitle}`}>Contact Us Directly</h4>
              <div className="grid grid-cols-2 gap-3">
                  <a href={store.settings.supportConfig.whatsappSupportLink} target="_blank" className="flex items-center gap-2 bg-green-50 text-green-700 p-3 rounded-lg border border-green-100 hover:bg-green-100 justify-center">
                      <MessageCircle size={20}/> <span className="text-xs font-bold">WhatsApp</span>
                  </a>
                  <a href={store.settings.supportConfig.freeTelegramGroupLink} target="_blank" className="flex items-center gap-2 bg-sky-50 text-sky-700 p-3 rounded-lg border border-sky-100 hover:bg-sky-100 justify-center">
                      <Send size={20}/> <span className="text-xs font-bold">Telegram</span>
                  </a>
              </div>
           </div>

           <div className={`${bgCard} p-5 rounded-xl shadow-sm border space-y-3`}>
               <h4 className={`font-bold ${textTitle}`}>Create Support Ticket</h4>
               <input className={bgInput + " w-full p-3 rounded-lg"} placeholder="Subject" value={subject} onChange={e=>setSubject(e.target.value)}/>
               <textarea className={bgInput + " w-full p-3 rounded-lg h-24"} placeholder="Describe your issue..." value={message} onChange={e=>setMessage(e.target.value)}></textarea>
               <button onClick={createTicket} className="w-full bg-emerald-600 text-white py-3 rounded-lg font-bold text-sm hover:bg-emerald-700 transition">Submit Ticket</button>
           </div>

           <div className="space-y-3">
               <h4 className={`font-bold ${textTitle}`}>My Tickets</h4>
               {tickets.map(t => (
                   <div key={t.id} className={`${bgCard} p-4 rounded-xl shadow-sm border`}>
                       <div className="flex justify-between items-start mb-2">
                           <span className={`font-bold text-sm ${textTitle}`}>{t.subject}</span>
                           <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${t.status === 'OPEN' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{t.status}</span>
                       </div>
                       <p className={`text-xs p-2 rounded ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-50 text-gray-600'}`}>{t.message}</p>
                       {t.adminReply && <div className="mt-2 text-xs text-emerald-700 bg-emerald-50 p-2 rounded border border-emerald-100"><strong>Admin:</strong> {t.adminReply}</div>}
                   </div>
               ))}
               {tickets.length === 0 && <p className="text-gray-400 text-sm text-center">No tickets found.</p>}
           </div>
        </div>
      );
  };

  // 17. Notifications View (Renamed User Notification, Updated Logic)
  const NotificationsView = () => {
    const [tab, setTab] = useState<'ADMIN' | 'USER'>('ADMIN');
    
    // Admin Notifications: Those without specific target, or global
    const adminNotifs = store.notifications.filter(n => !n.targetUserId).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    // User Notifications: Targeted at this user
    const userNotifs = store.notifications.filter(n => n.targetUserId === currentUser?.id).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const activeList = tab === 'ADMIN' ? adminNotifs : userNotifs;

    useEffect(() => {
        // Mark seen when opening tab
        const unreadIds = activeList.filter(n => !n.readBy.includes(currentUser!.id)).map(n => n.id);
        if(unreadIds.length > 0 && currentUser) {
            unreadIds.forEach(id => {
                const n = store.notifications.find(x => x.id === id);
                if(n) n.readBy.push(currentUser.id);
            });
            store.save(); // Using low-level save or dummy update
            store.notifyListeners();
        }
    }, [tab, activeList.length]);

    if (selectedNotification) {
        return (
            <div className="p-4 space-y-6 pb-20">
                <button onClick={() => setSelectedNotification(null)} className={`flex items-center text-sm gap-1 mb-2 ${textSub}`}><ChevronLeft size={16} /> Back to List</button>
                <div className={`${bgCard} p-6 rounded-2xl shadow-lg border overflow-hidden`}>
                    {selectedNotification.image && (
                        <div className="w-full mb-4 rounded-xl overflow-hidden shadow-sm border border-gray-100">
                            <img src={selectedNotification.image} className="w-full h-auto object-contain bg-black/5" alt="Notification"/>
                        </div>
                    )}
                    <h2 className={`text-xl font-bold mb-2 ${textTitle}`}>{selectedNotification.title}</h2>
                    <p className={`text-sm leading-relaxed mb-6 whitespace-pre-wrap ${textTitle}`}>{selectedNotification.message}</p>
                    
                    {selectedNotification.link && (
                        <a href={selectedNotification.link} target="_blank" className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition shadow-lg">
                            {selectedNotification.linkName || "Open Link"} <ExternalLink size={18}/>
                        </a>
                    )}
                    <p className={`text-[10px] mt-4 text-right ${textSub}`}>{new Date(selectedNotification.date).toLocaleString()}</p>
                </div>
            </div>
        );
    }

    return (
       <div className="p-4 space-y-4 pb-20">
          <button onClick={() => setView('dashboard')} className={`flex items-center text-sm gap-1 mb-2 ${textSub}`}><ChevronLeft size={16} /> Back</button>
          
          <div className="flex gap-4 border-b">
             <button onClick={()=>setTab('ADMIN')} className={`pb-2 border-b-2 font-bold flex-1 ${tab==='ADMIN'?'border-emerald-600 text-emerald-600':'border-transparent text-gray-500'}`}>Admin Notice</button>
             <button onClick={()=>setTab('USER')} className={`pb-2 border-b-2 font-bold flex-1 ${tab==='USER'?'border-emerald-600 text-emerald-600':'border-transparent text-gray-500'}`}>User Notification</button>
          </div>

          <div className="space-y-3">
             {activeList.map(n => (
                <div key={n.id} onClick={() => setSelectedNotification(n)} className={`${bgCard} p-4 rounded-xl shadow-sm border flex gap-3 cursor-pointer hover:opacity-90 active:scale-95 transition`}>
                   {n.image ? <img src={n.image} className="w-14 h-14 rounded bg-gray-100 object-cover flex-shrink-0"/> : <div className="p-2 bg-gray-100 rounded-full h-12 w-12 flex items-center justify-center flex-shrink-0"><Bell size={20} className="text-gray-600"/></div>}
                   <div className="flex-1 overflow-hidden">
                      <h4 className={`font-bold text-sm truncate ${textTitle}`}>{n.title}</h4>
                      <p className={`text-xs mt-1 line-clamp-2 ${textSub}`}>{n.message}</p>
                      <p className="text-[10px] text-gray-400 mt-2">{new Date(n.date).toLocaleDateString()}</p>
                   </div>
                   {!n.readBy.includes(currentUser!.id) && <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>}
                </div>
             ))}
             {activeList.length === 0 && <p className={`text-center py-10 ${textSub}`}>No notifications.</p>}
          </div>
       </div>
    );
  };

  // 18. All History View (Updated: Detailed Cards)
  const AllHistoryView = () => {
    const [tab, setTab] = useState<'INCOME' | 'CASHOUT'>('INCOME');

    // 1. Task Income
    const tasks = store.submissions.filter(s => s.userId === currentUser?.id).map(s => ({
        id: s.id,
        type: 'TASK', 
        amount: s.amount, 
        date: s.submittedAt, 
        status: s.status,
        title: s.taskTitle || 'Task Income',
        details: 'Task Reward'
    }));
    
    // 2. Withdrawals
    const withdrawals = store.withdrawals.filter(w => w.userId === currentUser?.id).map(w => ({
        id: w.id,
        type: 'WITHDRAW', 
        amount: w.amount, 
        date: w.requestDate, 
        status: w.status, 
        title: `Withdraw to ${w.paymentMethod}`,
        details: `Number: ${w.paymentNumber}`,
        wallet: w.walletType
    }));

    // 3. Referral Income (Regular)
    const downline = currentUser ? store.getDownline(currentUser.id) : [];
    const referrals = downline.map(u => ({
        id: u.id,
        type: 'REFERRAL', 
        amount: store.settings.referralConfig.signupBonus, 
        date: u.joiningDate, 
        status: 'RECEIVED', 
        title: `Free Ref: ${u.name}`,
        details: 'Referral Bonus'
    }));

    // 4. Premium Referral Bonus
    const premiumReferrals = downline.filter(u => u.accountType === 'PREMIUM').map(u => ({
        id: u.id + '_prem',
        type: 'PREM_BONUS',
        amount: store.settings.referralConfig.level1Bonus,
        date: u.joiningDate, 
        status: 'RECEIVED',
        title: `Premium Ref Bonus: ${u.name}`,
        details: 'Premium Upgrade'
    }));

    // 5. Registration Bonus
    const regBonus = currentUser ? [{
        id: 'reg_bonus',
        type: 'BONUS', amount: 5, date: currentUser.joiningDate, status: 'RECEIVED', title: 'Registration Bonus', details: 'Welcome Gift'
    }] : [];

    // Filter Logic
    let history: any[] = [];
    if (tab === 'INCOME') {
        history = [...tasks, ...referrals, ...premiumReferrals, ...regBonus].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } else {
        history = [...withdrawals].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }

    return (
        <div className="p-4 space-y-3 pb-20">
            <button onClick={() => setView('dashboard')} className={`flex items-center text-sm gap-1 mb-2 ${textSub}`}><ChevronLeft size={16} /> Back</button>
            <h3 className={`font-bold flex items-center gap-2 ${textTitle}`}><History size={20}/> Transaction History</h3>
            
            <div className="flex gap-2 mb-4 bg-gray-100 p-1 rounded-lg">
                <button onClick={()=>setTab('INCOME')} className={`flex-1 py-2 text-xs font-bold rounded-md transition ${tab==='INCOME' ? 'bg-white shadow text-emerald-600' : 'text-gray-500'}`}>Income History</button>
                <button onClick={()=>setTab('CASHOUT')} className={`flex-1 py-2 text-xs font-bold rounded-md transition ${tab==='CASHOUT' ? 'bg-white shadow text-red-600' : 'text-gray-500'}`}>Cashout History</button>
            </div>

            <div className="space-y-3">
                {history.map((h: any, i) => (
                    <div key={i} className={`${bgCard} p-4 rounded-xl shadow-sm border hover:bg-gray-50 transition relative overflow-hidden`}>
                        <div className={`absolute left-0 top-0 bottom-0 w-1 ${h.type==='WITHDRAW'?'bg-red-500':'bg-emerald-500'}`}></div>
                        <div className="flex justify-between items-start mb-1">
                            <p className={`font-bold text-sm ${textTitle}`}>{h.title}</p>
                            <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-bold ${
                                h.status === 'APPROVED' || h.status === 'RECEIVED' ? 'bg-green-100 text-green-700' : 
                                h.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                            }`}>
                                {h.status}
                            </span>
                        </div>
                        <div className="flex justify-between items-end">
                            <div>
                                <p className={`text-xs ${textSub}`}>{h.details}</p>
                                <p className="text-[10px] text-gray-400 mt-1">{new Date(h.date).toLocaleString()}</p>
                            </div>
                            <p className={`font-bold text-lg ${tab==='INCOME' ? 'text-green-600' : 'text-red-500'}`}>
                                {tab==='INCOME' ? '+' : '-'}{h.amount} Tk
                            </p>
                        </div>
                    </div>
                ))}
                {history.length === 0 && <div className="text-center py-10 text-gray-400 text-sm">No transaction history found.</div>}
            </div>
        </div>
    );
  };

  // 19. Job Withdraw View (Updated: Coin Input)
  const JobWithdrawView = () => {
    const [platform, setPlatform] = useState<string>('TikTok');
    const [details, setDetails] = useState('');
    const [screenshotLink, setScreenshotLink] = useState('');
    const [amountCoins, setAmountCoins] = useState('');
    const myRequests = store.jobWithdrawRequests.filter(r => r.userId === currentUser?.id);

    const handleSubmit = async () => {
        if (!details || !screenshotLink || !amountCoins) return showToast("Please fill all details including Coin Amount");
        
        await store.addJobWithdraw({ 
            id: Date.now().toString(), 
            userId: currentUser!.id, 
            userName: currentUser!.name, 
            userPhone: currentUser!.whatsapp, 
            walletNumber: currentUser!.whatsapp, 
            jobMethodId: platform, 
            jobMethodName: platform, 
            amountCoins: amountCoins, // User input coins
            screenshotLink: screenshotLink, 
            status: 'PENDING', 
            date: new Date().toISOString() 
        });
        showToast("Job Withdrawal Request Submitted! Waiting for Admin Approval."); 
        setView('dashboard');
    };

    return (
        <div className="p-4 space-y-6 pb-20">
            <button onClick={() => setView('dashboard')} className={`flex items-center text-sm gap-1 mb-2 ${textSub}`}><ChevronLeft size={16} /> Back</button>
            <h3 className={`font-bold text-xl flex items-center gap-2 ${textTitle}`}><Briefcase size={24}/> Job Transfer / Withdraw</h3>
            
            <div className={`${bgCard} p-5 rounded-xl shadow-sm border space-y-4`}>
                <div className="bg-blue-50 p-3 rounded-lg text-xs text-blue-700 leading-relaxed border border-blue-100">
                   <strong>Instructions:</strong> Select the platform. Enter the amount of Coins/Dollars you earned. Upload proof. Admin will convert it to BDT.
                </div>

                <div>
                    <label className={`text-xs font-bold block mb-1 ${textTitle}`}>Select Platform / Source</label>
                    <select className={bgInput + " w-full p-3 rounded-lg"} value={platform} onChange={e => setPlatform(e.target.value)}>
                        <option value="TikTok">TikTok Work</option>
                        <option value="GetLike">GetLike</option>
                        <option value="Like4Like">Like4Like</option>
                        <option value="FreeWork">Free Work Bonus</option>
                        <option value="Other">Other Source</option>
                    </select>
                </div>

                <div>
                    <label className={`text-xs font-bold block mb-1 ${textTitle}`}>Amount (Coin / Dollar)</label>
                    <input className={bgInput + " w-full p-3 rounded-lg"} placeholder="e.g. 5000 Coins or 5 USD" value={amountCoins} onChange={e => setAmountCoins(e.target.value)}/>
                </div>

                <div>
                    <label className={`text-xs font-bold block mb-1 ${textTitle}`}>Screenshot Link</label>
                    <input className={bgInput + " w-full p-3 rounded-lg"} placeholder="Paste image link here" value={screenshotLink} onChange={e => setScreenshotLink(e.target.value)}/>
                </div>

                <div>
                    <label className={`text-xs font-bold block mb-1 ${textTitle}`}>Description / Details</label>
                    <textarea className={bgInput + " w-full p-3 rounded-lg h-24"} placeholder="Describe your work amount and details..." value={details} onChange={e => setDetails(e.target.value)}></textarea>
                </div>

                <button onClick={handleSubmit} className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold shadow-lg hover:bg-blue-700 transition">Submit Request</button>
            </div>

            <div className="space-y-3">
                <h4 className={`font-bold text-sm ${textTitle}`}>Transfer History</h4>
                {myRequests.map(r => ( 
                    <div key={r.id} className={`${bgCard} p-4 rounded-xl shadow-sm border relative overflow-hidden`}>
                        <div className="absolute top-0 right-0 p-2">
                            <span className={`text-[10px] font-bold px-2 py-1 rounded ${r.status === 'APPROVED' ? 'bg-green-100 text-green-700' : r.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{r.status}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <div className={`font-bold text-sm ${textTitle}`}>{r.jobMethodName}</div>
                            <div className={`text-xs ${textSub}`}>Coin/Amt: <b>{r.amountCoins}</b></div>
                            <div className={`text-[10px] text-gray-400`}>{new Date(r.date).toLocaleString()}</div>
                        </div>
                    </div> 
                ))}
                {myRequests.length === 0 && <p className="text-gray-400 text-center text-xs">No transfer history.</p>}
            </div>
        </div>
    );
  };

  // 20. Video Sessions View (Updated: Folders then Videos)
  const VideoSessionsView = () => {
     const [activeFolder, setActiveFolder] = useState<VideoFolder | null>(null);

     if (activeFolder) {
         return (
             <div className="p-4 space-y-6 pb-20">
                <button onClick={() => setActiveFolder(null)} className={`flex items-center text-sm gap-1 mb-2 ${textSub}`}><ChevronLeft size={16} /> Back to Folders</button>
                <h3 className={`font-bold text-xl flex items-center gap-2 ${textTitle}`}><FolderOpen size={24}/> {activeFolder.name}</h3>
                <div className="space-y-6">
                    {activeFolder.videos.map(vid => (
                        <div key={vid.id} className={`${bgCard} p-4 rounded-xl shadow-sm border`}>
                            <div className="bg-black rounded-lg overflow-hidden aspect-video relative group mb-2 shadow-md">
                                <iframe className="w-full h-full" src={vid.url} title={vid.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                            </div>
                            <p className={`font-bold text-sm px-1 ${textTitle}`}>{vid.title}</p>
                            {vid.description && <p className="text-xs text-gray-500 px-1 mt-1">{vid.description}</p>}
                        </div>
                    ))}
                    {activeFolder.videos.length === 0 && <p className="text-gray-400 text-center">No videos in this folder.</p>}
                </div>
             </div>
         );
     }

     return (
         <div className="p-4 space-y-6 pb-20">
            <button onClick={() => setView('dashboard')} className={`flex items-center text-sm gap-1 mb-2 ${textSub}`}><ChevronLeft size={16} /> Back</button>
            <h3 className={`font-bold text-xl flex items-center gap-2 ${textTitle}`}><Video size={24}/> Work Tutorials</h3>
            <div className="grid grid-cols-2 gap-4">
               {store.settings.videoSessions.map(session => (
                  <button key={session.id} onClick={() => setActiveFolder(session)} className={`${bgCard} p-4 rounded-xl shadow-sm border flex flex-col items-center justify-center gap-2 hover:bg-emerald-50 transition aspect-square`}>
                     <Folder size={40} className="text-amber-500"/>
                     <span className={`font-bold text-sm text-center ${textTitle}`}>{session.name}</span>
                     <span className="text-[10px] text-gray-400">{session.videos.length} Videos</span>
                  </button>
               ))}
               {store.settings.videoSessions.length === 0 && <div className="col-span-2 text-center py-10 text-gray-400 text-sm">No video folders available.</div>}
            </div>
         </div>
     );
  };

  // 21. Privacy View
  const PrivacyView = () => (
    <div className="p-4 pb-20">
        <button onClick={() => setView('profile')} className={`flex items-center text-sm gap-1 mb-4 ${textSub}`}><ChevronLeft size={16} /> Back</button>
        <div className={`${bgCard} p-6 rounded-xl shadow-sm border`}>
            <h2 className={`font-bold text-xl mb-4 ${textTitle}`}>Privacy Policy</h2>
            <p className={`text-sm ${textSub}`}>We respect your privacy. All user data is secure and never shared with third parties...</p>
        </div>
    </div>
  );

  // 22. Custom Page View (Dynamic)
  const CustomPageView = () => {
    if (!activeCustomPage) {
        setView('dashboard');
        return null;
    }
    return (
        <div className="p-4 pb-20">
            <button onClick={() => setView('dashboard')} className={`flex items-center text-sm gap-1 mb-4 ${textSub}`}><ChevronLeft size={16} /> Back</button>
            <div className={`${bgCard} p-6 rounded-xl shadow-sm border`}>
                <h2 className={`font-bold text-xl mb-4 text-emerald-700 flex items-center gap-2 ${textTitle}`}>
                    {activeCustomPage.iconUrl && <img src={activeCustomPage.iconUrl} className="w-6 h-6 object-contain"/>} 
                    {activeCustomPage.buttonName}
                </h2>
                <div className={`prose max-w-none text-sm ${textTitle}`} dangerouslySetInnerHTML={{ __html: activeCustomPage.htmlContent }}></div>
            </div>
        </div>
    );
  };

  // 23. Tools View (New)
  const ToolsView = () => {
      return (
          <div className="p-4 pb-20">
              <button onClick={() => setView('dashboard')} className={`flex items-center text-sm gap-1 mb-4 ${textSub}`}><ChevronLeft size={16} /> Back</button>
              <div className="space-y-4">
                  <h3 className={`font-bold text-xl flex items-center gap-2 ${textTitle}`}><Wrench size={24}/> Essential Tools</h3>
                  <div className="grid grid-cols-2 gap-4">
                      {/* Dynamic Tools from Settings */}
                      {(store.settings.tools || []).map(tool => (
                          <div key={tool.id} className={`${bgCard} p-4 rounded-xl shadow-sm border text-center`}>
                              {tool.iconUrl ? <img src={tool.iconUrl} className="w-8 h-8 mx-auto mb-2 object-contain"/> : <Wrench size={32} className="mx-auto text-indigo-600 mb-2"/>}
                              <h4 className={`font-bold text-sm ${textTitle}`}>{tool.name}</h4>
                              <a href={tool.link} target="_blank" className="mt-2 inline-block text-xs bg-indigo-50 text-indigo-700 px-3 py-1 rounded font-bold">Open Tool</a>
                          </div>
                      ))}
                      {(store.settings.tools || []).length === 0 && <p className="text-gray-400 text-sm col-span-2 text-center">No tools added yet.</p>}
                  </div>
              </div>
          </div>
      );
  };

  // Side Menu
  const SidebarWithMenu = () => <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} onNavigate={(v) => { 
      if(v === 'logout') onLogout(); 
      else setView(v); 
  }} user={currentUser} />;

  return (
    <div className={`min-h-screen font-sans pb-32 transition-colors duration-300 ${bgMain}`}> 
      {toastMsg && <UserToast message={toastMsg} onClose={()=>setToastMsg('')}/>}
      
      <SidebarWithMenu />
      <MobileHeader onMenuClick={() => setSidebarOpen(true)} title={store.settings.companyName || "UdyanIT"} showMenuIcon={true}>
        <div className="flex items-center gap-4">
          <button onClick={() => setView('notifications')} className={`relative hover:text-emerald-600 ${textSub}`}><Bell size={22} />{unreadCount > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">{unreadCount}</span>}</button>
          <button onClick={() => setView('support')} className={`hover:text-emerald-600 ${textSub}`}><Headset size={22} /></button>
        </div>
      </MobileHeader>
      
      {showFreeJobModal && <FreeJobInfoModal />}

      <div className="max-w-md mx-auto min-h-screen relative">
        {/* VIEW ROUTER SWITCH */}
        {view === 'dashboard' && <DashboardHome />}
        {view === 'free-job-hub' && <FreeJobHub />}
        {view === 'referral-quiz' && <ReferralQuizView />} 
        {view === 'tasks' && <TasksView />}
        {view === 'task-detail' && <TaskDetailView />}
        
        {view === 'premium' && <PremiumView />}
        {view === 'premium-support-page' && <PremiumSupportPage />}
        {view === 'premium-task-list' && <PremiumTaskListView />} 
        {view === 'gmail-sell' && <SocialTaskView type="GMAIL" />}
        {view === 'fb-sell' && <SocialTaskView type="FACEBOOK" />}
        {view === 'insta-sell' && <SocialTaskView type="INSTAGRAM" />}
        {view === 'tiktok-sell' && <SocialTaskView type="TIKTOK" />}
        
        {view === 'wallet' && <WalletView />}
        {view === 'withdraw-form' && <WithdrawFormView />} 
        {view === 'profile' && <ProfileView />}
        {view === 'referral' && <ReferralView />}
        
        {view === 'support' && <SupportView />}
        {view === 'notifications' && <NotificationsView />}
        {view === 'all-history' && <AllHistoryView />}
        {view === 'job-withdraw' && <JobWithdrawView />}
        {view === 'video-sessions' && <VideoSessionsView />}
        {view === 'privacy' && <PrivacyView />}
        {view === 'custom-page' && <CustomPageView />}
        {view === 'tools' && <ToolsView />}
      </div>

      {/* Bottom Navigation */}
      <div className={`fixed bottom-0 left-0 w-full border-t flex justify-around py-2 px-2 pb-4 z-40 max-w-md mx-auto right-0 shadow-[0_-5px_10px_rgba(0,0,0,0.02)] ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
        {[ 
           { id: 'dashboard', icon: Home, label: 'Home' }, 
           { id: 'wallet', icon: Wallet, label: 'Wallet' }, 
           { id: 'referral', icon: Users, label: 'Team' }, 
           { id: 'profile', icon: UserIcon, label: 'Profile' } 
        ].map(item => (
          <button key={item.id} onClick={() => setView(item.id)} className={`flex flex-col items-center p-2 rounded-xl w-16 transition ${view === item.id ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30' : 'text-gray-400 hover:text-gray-600'}`}>
            <item.icon size={20} strokeWidth={view === item.id ? 2.5 : 2} /><span className="text-[10px] font-medium mt-1">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
