
// ... (imports remain the same)
import React, { useState, useEffect } from 'react';
import { store } from '../services/store';
import { Users, DollarSign, List, CheckCircle, XCircle, Settings, LogOut, Crown, CheckSquare, Plus, Trash2, Bell, MessageCircle, Send, Shield, FileText, Database, Edit3, Mail, Briefcase, Grid, Menu, PlusCircle, Save, PlayCircle, Lock, Headset, ChevronRight, Filter, Link, Video, Instagram, Facebook, Smartphone, Folder, Image, ThumbsUp, Youtube, Music, Layout, Code, Eye, Brain, FolderPlus, MonitorPlay, MousePointer, Moon, Sun, BellRing, Wrench, ExternalLink, X, AlertTriangle, Activity, ToggleLeft, ToggleRight, CreditCard, Gift, Power } from 'lucide-react';
import { Task, WalletType, User, CustomPage, Tool } from '../types';
import { Logo } from '../components/Logo';

interface AdminProps {
  onLogout: () => void;
}

// ... (Icons & Helpers remain the same)

const TikTok = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
    </svg>
);

const UserRequestInfo = ({ userId }: { userId: string }) => {
    const u = store.users.find(x => x.id === userId);
    if(!u) return <span className="text-xs text-red-500 font-bold bg-red-50 px-2 py-1 rounded">User Deleted/Not Found</span>;
    return (
      <div className="flex items-center gap-3 mb-2 p-2 bg-gray-50/80 rounded-lg border border-gray-200/50 hover:bg-white transition shadow-sm">
         <img src={u.profileImage || "https://ui-avatars.com/api/?name=User"} className="w-10 h-10 rounded-full border border-gray-300 object-cover bg-white"/>
         <div>
            <div className="font-bold text-sm text-gray-800 flex items-center gap-2">
                {u.name} 
                <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${u.accountType==='PREMIUM'?'bg-amber-100 text-amber-700':'bg-gray-200 text-gray-600'}`}>{u.accountType}</span>
            </div>
            <div className="text-[11px] text-gray-500 font-mono mt-0.5">
                {u.whatsapp} | Bal: <span className="font-bold text-emerald-600">{u.balanceMain}</span> | Free: <span className="font-bold text-blue-600">{u.balanceFree}</span>
            </div>
         </div>
      </div>
    );
};

const Toast = ({ message, onClose }: { message: string, onClose: () => void }) => (
    <div className="fixed top-5 right-5 bg-slate-800 text-white px-6 py-4 rounded-lg shadow-2xl z-[100] animate-in slide-in-from-right flex items-center gap-4 border border-slate-700 min-w-[300px]">
        <div className="bg-emerald-500 p-1 rounded-full"><CheckCircle size={18} className="text-white"/></div>
        <div className="flex-1">
            <h4 className="font-bold text-sm">Success</h4>
            <p className="text-xs text-gray-300">{message}</p>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-white"><X size={18}/></button>
    </div>
);

// --- MAIN COMPONENT ---

export const AdminPanel: React.FC<AdminProps> = ({ onLogout }) => {
  const [view, setView] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [refresh, setRefresh] = useState(0); 
  const [darkMode, setDarkMode] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  
  // Realtime Sync
  useEffect(() => {
     const unsubscribe = store.subscribe(() => {
        setRefresh(r => r + 1);
     });
     return () => unsubscribe();
  }, []);

  const saveAndNotify = (message: string = "Operation Successful!") => {
      store.save(); // Ensure persistence
      setRefresh(r => r + 1);
      setToastMsg(message);
      setTimeout(() => setToastMsg(''), 3000);
  };

  const extractEmbedUrl = (url: string) => {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
      const match = url.match(regExp);
      if (match && match[2].length === 11) return `https://www.youtube.com/embed/${match[2]}`;
      return url; 
  };

  const notifyUser = (userId: string, title: string, message: string) => {
      store.notifications.push({
          id: Date.now().toString(), title, message, type: 'TEXT', targetUserId: userId, date: new Date().toISOString(), readBy: []
      });
  };

  // Styles
  const cardStyle = `p-6 rounded-xl shadow-sm border transition hover:shadow-md ${darkMode ? 'bg-gray-800 border-gray-700 text-gray-200' : 'bg-white border-gray-100 text-gray-900'}`;
  const inputStyle = `w-full border p-3 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-medium transition ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-200 text-gray-900'}`;
  const labelStyle = `text-xs font-bold uppercase mb-1 block tracking-wide ${darkMode ? 'text-gray-400' : 'text-gray-600'}`;
  const headingStyle = `font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`;
  const textStyle = darkMode ? 'text-gray-300' : 'text-gray-700';

  // --- SUB-COMPONENTS (VIEWS) ---

  // 1. DASHBOARD
  const Dashboard = () => {
    const pendingGmail = store.socialSells.filter(s => s.type === 'GMAIL' && s.status === 'PENDING').length;
    const pendingFB = store.socialSells.filter(s => s.type === 'FACEBOOK' && s.status === 'PENDING').length;
    const pendingTikTok = store.socialSells.filter(s => s.type === 'TIKTOK' && s.status === 'PENDING').length;
    const pendingPrem = store.premiumRequests.filter(r => r.status === 'PENDING').length;
    const pendingTask = store.submissions.filter(s => s.status === 'PENDING').length;
    const pendingWithdraw = store.withdrawals.filter(w => w.status === 'PENDING').length;
    const pendingJobWithdraw = store.jobWithdrawRequests.filter(r => r.status === 'PENDING').length;

    const Stat = ({ title, count, color, icon: Icon }: any) => (
       <div className={`${cardStyle} flex items-center justify-between group cursor-pointer hover:-translate-y-1`}>
          <div>
             <p className={`text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{title}</p>
             <h3 className={`text-3xl font-extrabold mt-1 ${color}`}>{count}</h3>
          </div>
          <div className={`p-4 rounded-full ${color.replace('text-', 'bg-').replace('600', '100').replace('500', '100').replace('black', 'gray-200')} group-hover:scale-110 transition`}>
             <Icon size={24} className={color}/>
          </div>
       </div>
    );

    return (
       <div className="space-y-6">
          <h2 className={`text-2xl font-bold ${headingStyle}`}>Admin Dashboard</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             <Stat title="Total Users" count={store.users.length} color="text-emerald-600" icon={Users}/>
             <Stat title="Pending Premium" count={pendingPrem} color="text-amber-500" icon={Crown}/>
             <Stat title="Pending Withdraw" count={pendingWithdraw} color="text-red-500" icon={DollarSign}/>
             <Stat title="Job Transfers" count={pendingJobWithdraw} color="text-purple-500" icon={Briefcase}/>
             <Stat title="Pending Tasks" count={pendingTask} color="text-blue-500" icon={CheckSquare}/>
             <Stat title="Gmail Pending" count={pendingGmail} color="text-pink-600" icon={Mail}/>
             <Stat title="FB Pending" count={pendingFB} color="text-blue-600" icon={Facebook}/>
             <Stat title="TikTok Pending" count={pendingTikTok} color="text-black" icon={TikTok}/>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
              <div className={cardStyle}>
                  <h3 className={`font-bold mb-4 flex items-center gap-2 ${headingStyle}`}><Settings size={20}/> Quick Actions</h3>
                  <div className="grid grid-cols-2 gap-3">
                      <button onClick={()=>setView('settings')} className="bg-slate-100 p-3 rounded-lg text-slate-700 font-bold hover:bg-slate-200 text-sm border">Global Settings</button>
                      <button onClick={()=>setView('notifications')} className="bg-slate-100 p-3 rounded-lg text-slate-700 font-bold hover:bg-slate-200 text-sm border">Send Notification</button>
                      <button onClick={()=>setView('users')} className="bg-slate-100 p-3 rounded-lg text-slate-700 font-bold hover:bg-slate-200 text-sm border">Manage Users</button>
                      <button onClick={()=>setView('withdraw')} className="bg-slate-100 p-3 rounded-lg text-slate-700 font-bold hover:bg-slate-200 text-sm border">Process Withdrawals</button>
                  </div>
              </div>
              <div className={cardStyle}>
                  <h3 className={`font-bold mb-4 flex items-center gap-2 ${headingStyle}`}><Activity size={20}/> System Health</h3>
                  <div className="space-y-2">
                      <div className="flex justify-between text-sm border-b pb-2"><span>Database Status</span> <span className="text-emerald-500 font-bold">Connected</span></div>
                      <div className="flex justify-between text-sm border-b pb-2"><span>Total Tasks</span> <span className="font-bold">{store.tasks.length}</span></div>
                      <div className="flex justify-between text-sm border-b pb-2"><span>Total Payouts</span> <span className="font-bold text-red-500">{store.withdrawals.filter(w=>w.status==='APPROVED').reduce((a,b)=>a+b.amount,0)} Tk</span></div>
                  </div>
              </div>
          </div>
       </div>
    );
  };

  // 2. USER MANAGER
  const UserManagement = () => {
     const [term, setTerm] = useState('');
     const [editor, setEditor] = useState<User | null>(null);
     const [editForm, setEditForm] = useState<any>({});

     useEffect(() => { if(editor) setEditForm({...editor}); }, [editor]);

     const list = store.users.filter(u => 
        u.name.toLowerCase().includes(term.toLowerCase()) || 
        u.whatsapp.includes(term) ||
        u.referralCode.includes(term)
     );

     const saveUser = async () => {
        if(editor) {
           const updatedUser = { 
               ...editForm,
               balanceMain: Number(editForm.balanceMain),
               balanceFree: Number(editForm.balanceFree)
           };
           await store.updateUser(updatedUser); 
           saveAndNotify(`User Updated!`);
           setEditor(null); 
        }
     };

     const toggleBlock = async (u: User) => {
         const newStatus = u.status === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE';
         await store.updateUser({ ...u, status: newStatus });
         saveAndNotify(`User ${newStatus}`);
     };

     return (
        <div className="space-y-6">
           <h3 className={`text-xl font-bold ${headingStyle}`}>User Database ({store.users.length})</h3>
           <input className={inputStyle} placeholder="Search by Name, Phone or Ref Code..." value={term} onChange={e=>setTerm(e.target.value)} />

           {editor && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
                 <div className={`p-6 rounded-2xl w-full max-w-lg shadow-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    <h3 className={`text-lg font-bold mb-4 ${headingStyle}`}>Edit User: {editor.name}</h3>
                    <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-2">
                       <div className="flex justify-center"><img src={editForm.profileImage} className="w-20 h-20 rounded-full border-2 border-emerald-500"/></div>
                       <div><label className={labelStyle}>Full Name</label><input className={inputStyle} value={editForm.name} onChange={e=>setEditForm({...editForm, name:e.target.value})}/></div>
                       <div><label className={labelStyle}>Password</label><input className={inputStyle} value={editForm.password} onChange={e=>setEditForm({...editForm, password:e.target.value})}/></div>
                       <div className="grid grid-cols-2 gap-3">
                          <div><label className={labelStyle + " text-emerald-500"}>Main Wallet</label><input type="number" className={inputStyle} value={editForm.balanceMain} onChange={e=>setEditForm({...editForm, balanceMain: e.target.value})}/></div>
                          <div><label className={labelStyle + " text-blue-500"}>Free Wallet</label><input type="number" className={inputStyle} value={editForm.balanceFree} onChange={e=>setEditForm({...editForm, balanceFree: e.target.value})}/></div>
                       </div>
                       <div><label className={labelStyle}>Status</label><select className={inputStyle} value={editForm.status} onChange={e=>setEditForm({...editForm, status: e.target.value as any})}><option value="ACTIVE">Active</option><option value="BLOCKED">Blocked</option></select></div>
                       <div><label className={labelStyle}>Account Type</label><select className={inputStyle} value={editForm.accountType} onChange={e=>setEditForm({...editForm, accountType: e.target.value as any})}><option value="FREE">Free</option><option value="PREMIUM">Premium</option></select></div>
                    </div>
                    <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                       <button onClick={saveUser} className="flex-1 bg-emerald-600 text-white py-2 rounded-lg font-bold hover:bg-emerald-700">Save Changes</button>
                       <button onClick={()=>setEditor(null)} className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg font-bold hover:bg-gray-300">Cancel</button>
                    </div>
                 </div>
              </div>
           )}

           <div className="space-y-3">
               {list.slice(0, 50).map(u => (
                   <div key={u.id} className={`${cardStyle} flex flex-col md:flex-row justify-between items-center py-4 gap-4`}>
                       <div className="flex items-center gap-4 w-full md:w-auto">
                           <img src={u.profileImage || "https://ui-avatars.com/api/?name=User"} className="w-12 h-12 rounded-full border border-gray-200 object-cover"/>
                           <div>
                               <h4 className={`font-bold ${headingStyle}`}>{u.name} <span className="text-xs font-normal opacity-70">({u.accountType})</span></h4>
                               <p className={`text-xs font-mono opacity-80`}>{u.whatsapp}</p>
                               <div className="flex gap-3 mt-1 text-[10px] font-bold">
                                   <span className="text-emerald-600">Main: {u.balanceMain}</span>
                                   <span className="text-blue-600">Free: {u.balanceFree}</span>
                               </div>
                           </div>
                       </div>
                       <div className="flex gap-2 w-full md:w-auto justify-end">
                           <button onClick={()=>toggleBlock(u)} className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 ${u.status === 'ACTIVE' ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-green-50 text-green-600 hover:bg-green-100'}`}>
                               {u.status === 'ACTIVE' ? <Lock size={16}/> : <CheckCircle size={16}/>} {u.status === 'ACTIVE' ? 'Block' : 'Unblock'}
                           </button>
                           <button onClick={()=>setEditor({...u})} className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-bold hover:bg-blue-100 flex items-center gap-2"><Edit3 size={16}/> Edit</button>
                       </div>
                   </div>
               ))}
               {list.length === 0 && <p className="text-center text-gray-400 py-10">No users found.</p>}
           </div>
        </div>
     );
  };

  // 3. TASK MANAGER (UPDATED SETTINGS)
  const TaskManager = () => {
     const [tab, setTab] = useState<'LIST'|'SUBMISSIONS'|'SETTINGS'>('LIST');
     const [taskForm, setTaskForm] = useState({ id: '', title: '', description: '', amount: '', image: '', type: 'FREE', link: '' });
     const [isEditing, setIsEditing] = useState(false);
     const [taskLimits, setTaskLimits] = useState({ 
         free: store.settings.planLimits.freeDailyTaskLimit, 
         prem: store.settings.planLimits.premiumDailyTaskLimit,
         isFreeEnabled: store.settings.planLimits.isFreeTasksEnabled ?? true,
         isPremEnabled: store.settings.planLimits.isPremiumTasksEnabled ?? true
     });

     const saveTask = async () => {
        const taskData = { 
            id: isEditing ? taskForm.id : Date.now().toString(),
            title: taskForm.title, 
            description: taskForm.description,
            amount: Number(taskForm.amount) || 0, 
            image: taskForm.image || 'https://placehold.co/100', 
            type: taskForm.type as any, 
            link: taskForm.link, 
            totalSlots: 1000, filledSlots: 0 
        };

        if(isEditing) {
            const idx = store.tasks.findIndex(t => t.id === taskData.id);
            if(idx >= 0) {
                store.tasks[idx] = taskData as Task;
                await store.save(); 
                saveAndNotify("Task Updated!");
            }
        } else {
            await store.addTask(taskData as Task);
            saveAndNotify("New Task Added!");
        }
        setTaskForm({ id: '', title: '', description: '', amount: '', image: '', type: 'FREE', link: '' });
        setIsEditing(false);
     };

     const handleSub = async (id: string, action: 'APPROVED'|'REJECTED') => {
        const sub = store.submissions.find(s => s.id === id);
        if(!sub) return;
        await store.updateSubmission(id, { status: action });
        if(action === 'APPROVED') {
            const u = store.users.find(x => x.id === sub.userId);
            if(u) {
                const updatedUser = { ...u, balanceFree: u.balanceFree + sub.amount }; 
                await store.updateUser(updatedUser);
            }
        }
        saveAndNotify(`Task ${action}`);
     };

     const saveTaskSettings = async () => {
         const newSettings = { 
             ...store.settings, 
             planLimits: { 
                 ...store.settings.planLimits, 
                 freeDailyTaskLimit: Number(taskLimits.free), 
                 premiumDailyTaskLimit: Number(taskLimits.prem),
                 isFreeTasksEnabled: taskLimits.isFreeEnabled,
                 isPremiumTasksEnabled: taskLimits.isPremEnabled
             } 
         };
         await store.updateSettings(newSettings);
         saveAndNotify("Task Settings Saved!");
     };

     return (
        <div className="space-y-6">
           <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700 pb-2 overflow-x-auto">
              {['LIST', 'SUBMISSIONS', 'SETTINGS'].map(t => (
                  <button key={t} onClick={()=>setTab(t as any)} className={`px-4 py-2 rounded-lg font-bold text-sm whitespace-nowrap ${tab===t?'bg-emerald-600 text-white':'text-gray-500 hover:bg-gray-100'}`}>
                      {t === 'LIST' ? 'Task List & Add' : t === 'SUBMISSIONS' ? 'Submissions' : 'Task Settings'}
                  </button>
              ))}
           </div>

           {tab === 'LIST' && (
              <div className="space-y-6">
                 <div className={cardStyle}>
                    <h4 className={`font-bold mb-4 flex items-center gap-2 ${headingStyle}`}><PlusCircle size={20}/> {isEditing ? 'Edit Task' : 'Add New Task'}</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                       <div><label className={labelStyle}>Task Title</label><input className={inputStyle} value={taskForm.title} onChange={e=>setTaskForm({...taskForm, title:e.target.value})}/></div>
                       <div><label className={labelStyle}>Amount (Tk)</label><input className={inputStyle} type="number" value={taskForm.amount} onChange={e=>setTaskForm({...taskForm, amount:e.target.value})}/></div>
                       <div><label className={labelStyle}>Type</label><select className={inputStyle} value={taskForm.type} onChange={e=>setTaskForm({...taskForm, type:e.target.value}) as any}><option value="FREE">Free Task</option><option value="PAID">Premium Task</option></select></div>
                       <div><label className={labelStyle}>Image URL</label><input className={inputStyle} value={taskForm.image} onChange={e=>setTaskForm({...taskForm, image:e.target.value})}/></div>
                       <div className="md:col-span-2"><label className={labelStyle}>Work Link (YouTube/Web)</label><input className={inputStyle} value={taskForm.link} onChange={e=>setTaskForm({...taskForm, link:e.target.value})}/></div>
                       <div className="md:col-span-2"><label className={labelStyle}>Description/Instruction</label><textarea className={inputStyle + " h-20"} value={taskForm.description} onChange={e=>setTaskForm({...taskForm, description:e.target.value})}/></div>
                    </div>
                    <div className="flex gap-2 mt-4">
                        <button onClick={saveTask} className="flex-1 bg-emerald-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-emerald-700">{isEditing ? 'Update Task' : 'Publish Task'}</button>
                        {isEditing && <button onClick={()=>{setIsEditing(false); setTaskForm({ id: '', title: '', description: '', amount: '', image: '', type: 'FREE', link: '' })}} className="bg-gray-400 text-white px-6 py-3 rounded-lg font-bold">Cancel</button>}
                    </div>
                 </div>
                 
                 <div className="grid gap-3">
                    {store.tasks.map(t => (
                       <div key={t.id} className={cardStyle + " flex justify-between items-center"}>
                          <div className="flex items-center gap-4">
                              <img src={t.image} className="w-12 h-12 rounded-lg bg-gray-100 object-cover border"/>
                              <div>
                                  <h4 className={`font-bold ${headingStyle}`}>{t.title}</h4>
                                  <div className="flex gap-2 mt-1">
                                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${t.type==='PAID'?'bg-amber-100 text-amber-700':'bg-blue-100 text-blue-700'}`}>{t.type}</span>
                                      <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded font-bold">{t.amount} Tk</span>
                                  </div>
                              </div>
                          </div>
                          <div className="flex gap-2">
                              <button onClick={()=>{ setTaskForm({ id: t.id, title: t.title, description: t.description, amount: t.amount.toString(), image: t.image, type: t.type, link: t.link || '' }); setIsEditing(true); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="bg-blue-50 text-blue-600 p-2 rounded hover:bg-blue-100"><Edit3 size={18}/></button>
                              <button onClick={()=>{ if(window.confirm("Delete Task?")) { store.deleteTask(t.id); saveAndNotify("Deleted"); } }} className="bg-red-50 text-red-600 p-2 rounded hover:bg-red-100"><Trash2 size={18}/></button>
                          </div>
                       </div>
                    ))}
                 </div>
              </div>
           )}

           {tab === 'SUBMISSIONS' && (
              <div className="space-y-4">
                 {store.submissions.filter(s=>s.status==='PENDING').map(s => (
                    <div key={s.id} className={cardStyle}>
                       <UserRequestInfo userId={s.userId} />
                       <div className="flex justify-between mt-3 border-t pt-3 border-gray-100">
                          <div>
                              <h4 className={`font-bold text-sm ${headingStyle}`}>Task: {s.taskTitle}</h4>
                              <p className="font-bold text-emerald-600 text-xs">Reward: {s.amount} Tk</p>
                          </div>
                          <div className="text-right text-[10px] text-gray-400">{new Date(s.submittedAt).toLocaleDateString()}</div>
                       </div>
                       <div className="bg-slate-50 p-3 rounded-lg text-xs mt-3 border border-slate-100 text-slate-700">
                           <p className="font-bold mb-1">Proof:</p>
                           <p className="mb-2 whitespace-pre-wrap">{s.proofText}</p>
                           {s.screenshotLink && <a href={s.screenshotLink} target="_blank" className="text-blue-500 hover:underline flex items-center gap-1"><Link size={12}/> View Screenshot</a>}
                       </div>
                       <div className="flex gap-3 mt-4">
                          <button onClick={()=>handleSub(s.id, 'APPROVED')} className="flex-1 bg-emerald-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-emerald-700">Approve & Pay</button>
                          <button onClick={()=>handleSub(s.id, 'REJECTED')} className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-red-600">Reject</button>
                       </div>
                    </div>
                 ))}
                 {store.submissions.filter(s=>s.status==='PENDING').length === 0 && <div className="text-center py-10 text-gray-400"><CheckSquare size={48} className="mx-auto mb-2 opacity-20"/> No pending submissions.</div>}
              </div>
           )}

           {tab === 'SETTINGS' && (
               <div className={cardStyle}>
                   <h4 className={`font-bold mb-4 flex items-center gap-2 ${headingStyle}`}><Settings size={20}/> Task Module Settings</h4>
                   <div className="space-y-6">
                       <div className="grid md:grid-cols-2 gap-6">
                           <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                               <h5 className="font-bold text-blue-700 mb-2">Free User Tasks</h5>
                               <label className={labelStyle}>Daily Limit</label>
                               <input type="number" className={inputStyle} value={taskLimits.free} onChange={e=>setTaskLimits({...taskLimits, free: Number(e.target.value)})}/>
                               <div className="flex items-center gap-2 mt-3">
                                   <input type="checkbox" className="w-5 h-5 accent-blue-600" checked={taskLimits.isFreeEnabled} onChange={e=>setTaskLimits({...taskLimits, isFreeEnabled: e.target.checked})}/>
                                   <span className="text-sm font-bold text-gray-700">Enable Free Tasks</span>
                               </div>
                           </div>
                           <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
                               <h5 className="font-bold text-amber-700 mb-2">Premium User Tasks</h5>
                               <label className={labelStyle}>Daily Limit</label>
                               <input type="number" className={inputStyle} value={taskLimits.prem} onChange={e=>setTaskLimits({...taskLimits, prem: Number(e.target.value)})}/>
                               <div className="flex items-center gap-2 mt-3">
                                   <input type="checkbox" className="w-5 h-5 accent-amber-600" checked={taskLimits.isPremEnabled} onChange={e=>setTaskLimits({...taskLimits, isPremEnabled: e.target.checked})}/>
                                   <span className="text-sm font-bold text-gray-700">Enable Premium Tasks</span>
                               </div>
                           </div>
                       </div>
                   </div>
                   <button onClick={saveTaskSettings} className="w-full bg-emerald-600 text-white py-3 rounded-lg font-bold mt-6 shadow-lg">Save Task Settings</button>
               </div>
           )}
        </div>
     );
  };

  // 4. SOCIAL MANAGER
  const SocialManager = () => {
     // ... (Existing Social Manager code - no changes requested, kept same logic) ...
     const [tab, setTab] = useState<'REQUESTS' | 'SETTINGS'>('REQUESTS');
     const [filter, setFilter] = useState('ALL');
     const [localConfig, setLocalConfig] = useState(store.settings.socialSellConfig);

     const saveConfig = async () => {
         const newSettings = { ...store.settings, socialSellConfig: localConfig };
         await store.updateSettings(newSettings);
         saveAndNotify("Social Settings Saved!");
     };

     const handleAction = async (id: string, action: 'APPROVED' | 'REJECTED') => {
         const req = store.socialSells.find(s => s.id === id);
         if(!req) return;
         await store.updateSocialSell(id, action);
         if(action === 'APPROVED') {
             const u = store.users.find(x => x.id === req.userId);
             if(u) {
                 const updatedUser = { ...u, balanceFree: u.balanceFree + req.rate };
                 await store.updateUser(updatedUser);
                 notifyUser(u.id, "Work Approved", `${req.type} selling approved. ${req.rate} Tk added.`);
             }
         }
         saveAndNotify("Action Taken!");
     };

     const requests = store.socialSells.filter(s => s.status === 'PENDING' && (filter === 'ALL' || s.type === filter));

     return (
        <div className="space-y-6">
           <div className="flex gap-2 border-b pb-2">
              <button onClick={()=>setTab('REQUESTS')} className={`px-4 py-2 rounded-lg font-bold text-sm ${tab==='REQUESTS'?'bg-emerald-600 text-white':'text-gray-500 hover:bg-gray-100'}`}>Work Requests</button>
              <button onClick={()=>setTab('SETTINGS')} className={`px-4 py-2 rounded-lg font-bold text-sm ${tab==='SETTINGS'?'bg-emerald-600 text-white':'text-gray-500 hover:bg-gray-100'}`}>Rate & Config</button>
           </div>

           {tab === 'REQUESTS' && (
              <>
                 <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
                    {['ALL', 'GMAIL', 'FACEBOOK', 'INSTAGRAM', 'TIKTOK'].map(f => <button key={f} onClick={()=>setFilter(f)} className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${filter===f?'bg-slate-800 text-white':'bg-slate-100 text-slate-600'}`}>{f}</button>)}
                 </div>
                 <div className="grid gap-4">
                    {requests.map(r => (
                       <div key={r.id} className={cardStyle}>
                          <div className="flex justify-between items-start">
                             <div>
                                <UserRequestInfo userId={r.userId}/>
                                <div className="mt-2 flex items-center gap-2">
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded text-white ${r.type==='GMAIL'?'bg-red-500':r.type==='FACEBOOK'?'bg-blue-600':r.type==='INSTAGRAM'?'bg-pink-600':'bg-black'}`}>{r.type}</span>
                                    <span className="text-xs font-bold text-emerald-600">Rate: {r.rate} Tk</span>
                                </div>
                                <div className="text-xs bg-slate-50 p-3 rounded-lg mt-2 border border-slate-200 select-all cursor-pointer font-mono text-slate-800" onClick={()=>navigator.clipboard.writeText(`${r.accountIdentifier}|${r.password}`)}>
                                   <p>ID: {r.accountIdentifier}</p>
                                   <p>Pass: {r.password}</p>
                                   {r.uid && <p>UID: {r.uid}</p>}
                                   {r.twoFactorCode && <p>2FA: {r.twoFactorCode}</p>}
                                </div>
                             </div>
                             <div className="flex flex-col gap-2">
                                <button onClick={()=>handleAction(r.id, 'APPROVED')} className="bg-emerald-100 text-emerald-700 px-3 py-2 rounded-lg text-xs font-bold hover:bg-emerald-200">Approve</button>
                                <button onClick={()=>handleAction(r.id, 'REJECTED')} className="bg-red-100 text-red-700 px-3 py-2 rounded-lg text-xs font-bold hover:bg-red-200">Reject</button>
                             </div>
                          </div>
                       </div>
                    ))}
                    {requests.length === 0 && <p className="text-center text-gray-400 py-10">No pending {filter !== 'ALL' ? filter : ''} requests.</p>}
                 </div>
              </>
           )}

           {tab === 'SETTINGS' && (
              <div className="grid md:grid-cols-2 gap-4">
                 {['gmail', 'fb', 'insta', 'tiktok'].map(key => {
                    const label = key === 'gmail' ? 'Gmail' : key === 'fb' ? 'Facebook' : key === 'insta' ? 'Instagram' : 'TikTok';
                    const rateKey = `${key}Rate` as keyof typeof localConfig;
                    const switchKey = `is${label.charAt(0).toUpperCase() + label.slice(1).replace('ikTok', 'Tiktok')}On` as keyof typeof localConfig;
                    return (
                       <div key={key} className={cardStyle}>
                          <h4 className={`font-bold mb-3 flex items-center gap-2 ${headingStyle}`}>{label} Config</h4>
                          <div className="mb-2"><label className={labelStyle}>Rate (Tk)</label><input type="text" className={inputStyle} value={localConfig[rateKey] as number} onChange={e=>{ setLocalConfig({...localConfig, [rateKey]: Number(e.target.value) || 0}) }}/></div>
                          <div className="flex items-center gap-2 mt-3 p-2 bg-gray-50 rounded border">
                             <input type="checkbox" className="w-5 h-5 accent-emerald-600" checked={(localConfig as any)[switchKey] || false} onChange={e=>{ setLocalConfig({...localConfig, [switchKey]: e.target.checked}) }}/>
                             <span className={`text-sm font-bold ${textStyle}`}>Enable {label} Work</span>
                          </div>
                       </div>
                    )
                 })}
                 <button onClick={saveConfig} className="col-span-2 w-full bg-emerald-600 text-white py-3 rounded-lg font-bold shadow-lg hover:bg-emerald-700">Save Rates & Config</button>
              </div>
           )}
        </div>
     );
  };

  // 5. WITHDRAW MANAGER (UPDATED SETTINGS)
  const WithdrawManager = () => {
     const [tab, setTab] = useState<'REQUESTS' | 'SETTINGS'>('REQUESTS');
     const list = store.withdrawals.filter(w => w.status === 'PENDING');
     const [rules, setRules] = useState(store.settings.withdrawRules);
     const [limits, setLimits] = useState(store.settings.planLimits);

     const saveWConfig = async () => {
         const newSettings = { ...store.settings, withdrawRules: rules, planLimits: limits };
         await store.updateSettings(newSettings);
         saveAndNotify("Withdraw Rules Saved!");
     };
     
     const handleW = async (id: string, action: 'APPROVED'|'REJECTED') => {
        const w = store.withdrawals.find(x=>x.id===id);
        if(!w) return;
        await store.updateWithdrawal(id, action);
        if(action === 'REJECTED') {
            const u = store.users.find(u=>u.id===w.userId);
            if(u) {
                const updatedUser = { ...u };
                if(w.walletType === 'FREE') updatedUser.balanceFree += w.amount;
                else updatedUser.balanceMain += w.amount;
                await store.updateUser(updatedUser);
            }
        }
        notifyUser(w.userId, `Withdraw ${action}`, action === 'APPROVED' ? `Payment of ${w.amount} Tk sent.` : `Withdrawal rejected & refunded.`);
        saveAndNotify(`Withdraw ${action}`);
     };

     return (
        <div className="space-y-6">
           <div className="flex gap-2 border-b pb-2">
              <button onClick={()=>setTab('REQUESTS')} className={`px-4 py-2 rounded-lg font-bold text-sm ${tab==='REQUESTS'?'bg-emerald-600 text-white':'text-gray-500 hover:bg-gray-100'}`}>Pending Requests</button>
              <button onClick={()=>setTab('SETTINGS')} className={`px-4 py-2 rounded-lg font-bold text-sm ${tab==='SETTINGS'?'bg-emerald-600 text-white':'text-gray-500 hover:bg-gray-100'}`}>Rules & Limits</button>
           </div>

           {tab === 'REQUESTS' && (
               <div className="space-y-4">
               {list.map(w => (
                  <div key={w.id} className={cardStyle}>
                     <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                           <UserRequestInfo userId={w.userId} />
                           <div className="mt-2 text-sm text-gray-700 bg-gray-50 p-2 rounded border border-gray-200">
                               <span className="font-bold text-purple-600">{w.paymentMethod.toUpperCase()}</span> number: <span className="font-mono font-bold text-lg select-all">{w.paymentNumber}</span>
                           </div>
                           <p className="text-xs font-bold text-emerald-600 mt-2 bg-emerald-50 px-2 py-1 rounded w-fit">Amount: {w.amount} Tk (Fee: {w.fee})</p>
                        </div>
                        <div className="flex gap-2 w-full md:w-auto">
                           <button onClick={()=>handleW(w.id, 'APPROVED')} className="flex-1 md:flex-none bg-emerald-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-emerald-600">Approve</button>
                           <button onClick={()=>handleW(w.id, 'REJECTED')} className="flex-1 md:flex-none bg-red-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-600">Reject</button>
                        </div>
                     </div>
                  </div>
               ))}
               {list.length === 0 && <div className="text-center py-12 text-gray-400"><DollarSign size={48} className="mx-auto mb-2 opacity-20"/> All caught up! No pending withdrawals.</div>}
               </div>
           )}

           {tab === 'SETTINGS' && (
               <div className="grid md:grid-cols-2 gap-6">
                   <div className={cardStyle}>
                       <h4 className={`font-bold mb-4 flex items-center gap-2 text-emerald-600`}>Free Wallet Rules</h4>
                       <div className="space-y-3">
                           <div><label className={labelStyle}>Min Withdraw</label><input type="number" className={inputStyle} value={rules.FREE.minWithdraw} onChange={e=>setRules({...rules, FREE: {...rules.FREE, minWithdraw: Number(e.target.value)}})}/></div>
                           <div><label className={labelStyle}>Max Limit</label><input type="number" className={inputStyle} value={limits.freeMaxWithdraw} onChange={e=>setLimits({...limits, freeMaxWithdraw: Number(e.target.value)})}/></div>
                           <div>
                               <label className={labelStyle}>Withdraw Frequency (Times)</label>
                               <input type="number" className={inputStyle} value={limits.freeWithdrawFrequency} onChange={e=>setLimits({...limits, freeWithdrawFrequency: Number(e.target.value)})}/>
                               <p className="text-[10px] text-gray-500">How many times a free user can withdraw (e.g. 1)</p>
                           </div>
                           <div className="flex items-center gap-2 mt-2"><input type="checkbox" checked={limits.isFreeWithdrawEnabled} onChange={e=>setLimits({...limits, isFreeWithdrawEnabled: e.target.checked})} className="w-4 h-4"/> <span className="text-sm font-bold">Enable Withdraw</span></div>
                       </div>
                   </div>
                   <div className={cardStyle}>
                       <h4 className={`font-bold mb-4 flex items-center gap-2 text-amber-600`}>Premium Wallet Rules</h4>
                       <div className="space-y-3">
                           <div><label className={labelStyle}>Min Withdraw</label><input type="number" className={inputStyle} value={rules.MAIN.minWithdraw} onChange={e=>setRules({...rules, MAIN: {...rules.MAIN, minWithdraw: Number(e.target.value)}})}/></div>
                           <div><label className={labelStyle}>Max Limit</label><input type="number" className={inputStyle} value={limits.premiumMaxWithdraw} onChange={e=>setLimits({...limits, premiumMaxWithdraw: Number(e.target.value)})}/></div>
                           <div className="flex items-center gap-2 mt-2"><input type="checkbox" checked={limits.isMainWithdrawEnabled} onChange={e=>setLimits({...limits, isMainWithdrawEnabled: e.target.checked})} className="w-4 h-4"/> <span className="text-sm font-bold">Enable Withdraw</span></div>
                       </div>
                   </div>
                   <button onClick={saveWConfig} className="col-span-2 w-full bg-emerald-600 text-white py-3 rounded-lg font-bold shadow-lg hover:bg-emerald-700">Save Withdrawal Settings</button>
               </div>
           )}
        </div>
     );
  };

  // 6. JOB WITHDRAW MANAGER (UPDATED SETTINGS)
  const JobWithdrawManager = () => {
      const [tab, setTab] = useState<'REQUESTS'|'SETTINGS'>('REQUESTS');
      const [approvalState, setApprovalState] = useState<{id: string, amount: string} | null>(null);
      const reqs = store.jobWithdrawRequests.filter(r => r.status === 'PENDING');
      
      const [newMethod, setNewMethod] = useState({ title: '', min: '', description: '', walletLabel: '', isActive: true });

      const handleApprove = async () => {
          if(!approvalState) return;
          const { id, amount } = approvalState;
          const r = store.jobWithdrawRequests.find(x=>x.id===id);
          if(!r) return;

          const finalAmount = Number(amount);
          if(isNaN(finalAmount) || finalAmount <= 0) return alert("Please enter valid amount");

          await store.updateJobWithdraw(id, 'APPROVED');
          const u = store.users.find(x=>x.id===r.userId);
          if(u) {
              const updatedUser = { ...u, balanceMain: u.balanceMain + finalAmount };
              await store.updateUser(updatedUser);
              notifyUser(u.id, "Job Transfer Approved", `${finalAmount} Tk added to Main Wallet.`);
          }
          saveAndNotify("Approved & Balance Added!");
          setApprovalState(null);
      };

      const handleReject = async (id: string) => {
          const r = store.jobWithdrawRequests.find(x=>x.id===id);
          if(!r) return;
          await store.updateJobWithdraw(id, 'REJECTED');
          notifyUser(r.userId, "Job Transfer Rejected", "Invalid proof or info.");
          saveAndNotify("Rejected");
      };

      return (
         <div className="space-y-6">
            <div className="flex gap-2 border-b pb-2">
                <button onClick={()=>setTab('REQUESTS')} className={`px-4 py-2 rounded-lg font-bold text-sm ${tab==='REQUESTS'?'bg-emerald-600 text-white':'text-gray-500 hover:bg-gray-100'}`}>Pending Transfers</button>
                <button onClick={()=>setTab('SETTINGS')} className={`px-4 py-2 rounded-lg font-bold text-sm ${tab==='SETTINGS'?'bg-emerald-600 text-white':'text-gray-500 hover:bg-gray-100'}`}>Methods & Settings</button>
            </div>
            
            {tab === 'REQUESTS' && (
                <>
                {approvalState && (
                    <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
                        <div className="bg-white p-6 rounded-xl w-full max-w-sm shadow-2xl animate-in zoom-in duration-200">
                            <h3 className="font-bold text-lg mb-2 text-gray-800">Approve Transfer</h3>
                            <p className="text-xs text-gray-500 mb-4">
                                User requested: <span className="font-bold text-emerald-600">{store.jobWithdrawRequests.find(r=>r.id===approvalState.id)?.amountCoins}</span> (Coins/USD).<br/>
                                Enter the BDT amount to add to their wallet.
                            </p>
                            <input autoFocus type="number" className={inputStyle} placeholder="Amount in BDT" value={approvalState.amount} onChange={e=>setApprovalState({...approvalState, amount: e.target.value})}/>
                            <div className="flex gap-2 mt-4">
                                <button onClick={handleApprove} className="flex-1 bg-emerald-600 text-white py-2 rounded-lg font-bold">Confirm</button>
                                <button onClick={()=>setApprovalState(null)} className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg font-bold">Cancel</button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="space-y-4">
                    {reqs.map(r => (
                        <div key={r.id} className={cardStyle + " border-l-4 border-l-blue-500"}>
                        <div className="flex justify-between mb-2">
                            <UserRequestInfo userId={r.userId} />
                            <span className="text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded-full h-fit font-bold">{r.jobMethodName}</span>
                        </div>
                        <div className="flex gap-4 text-sm text-gray-700 bg-gray-50 p-3 rounded mb-3">
                            <div><strong>Wallet:</strong> {r.walletNumber}</div>
                            <div><strong>Requested:</strong> {r.amountCoins}</div>
                        </div>
                        <div className="text-xs text-blue-600 underline cursor-pointer mb-4 flex items-center gap-1" onClick={()=>window.open(r.screenshotLink, '_blank')}><Link size={12}/> View Proof Screenshot</div>
                        <div className="flex gap-2">
                            <button onClick={()=>setApprovalState({id: r.id, amount: ''})} className="bg-emerald-600 text-white px-6 py-2 rounded-lg text-xs font-bold hover:bg-emerald-700">Approve & Pay</button>
                            <button onClick={()=>handleReject(r.id)} className="bg-red-500 text-white px-6 py-2 rounded-lg text-xs font-bold hover:bg-red-600">Reject</button>
                        </div>
                        </div>
                    ))}
                    {reqs.length === 0 && <div className="text-center py-10 text-gray-400">No transfer requests pending.</div>}
                </div>
                </>
            )}

            {tab === 'SETTINGS' && (
                <div className={cardStyle}>
                    <h4 className={`font-bold mb-4 ${headingStyle}`}>Add New Job Method</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div><label className={labelStyle}>Title</label><input className={inputStyle} placeholder="e.g. Like4Like" value={newMethod.title} onChange={e=>setNewMethod({...newMethod, title: e.target.value})}/></div>
                        <div><label className={labelStyle}>Min Amount</label><input className={inputStyle} placeholder="e.g. 5000 Coins" value={newMethod.min} onChange={e=>setNewMethod({...newMethod, min: e.target.value})}/></div>
                        <div><label className={labelStyle}>Wallet Label</label><input className={inputStyle} placeholder="e.g. User ID / Wallet" value={newMethod.walletLabel} onChange={e=>setNewMethod({...newMethod, walletLabel: e.target.value})}/></div>
                        <div><label className={labelStyle}>Status</label><div className="flex items-center gap-2 mt-2"><input type="checkbox" className="w-5 h-5" checked={newMethod.isActive} onChange={e=>setNewMethod({...newMethod, isActive: e.target.checked})} /><span className="text-sm font-bold">Active</span></div></div>
                        <div className="col-span-2"><label className={labelStyle}>Description / Instructions</label><textarea className={inputStyle} placeholder="Instructions for user..." value={newMethod.description} onChange={e=>setNewMethod({...newMethod, description: e.target.value})}/></div>
                    </div>
                    <button onClick={async () => {
                        if(!newMethod.title) return alert("Title required");
                        const m = { id: Date.now().toString(), title: newMethod.title, walletLabel: newMethod.walletLabel || 'User ID', minAmount: Number(newMethod.min) || 0, instruction: newMethod.description, isActive: newMethod.isActive };
                        // Note: Using 'any' cast as types might not fully support new fields yet, handled by store dynamic logic
                        await store.updateSettings({ ...store.settings, jobWithdrawMethods: [...store.settings.jobWithdrawMethods, m as any] });
                        saveAndNotify("Job Method Added!"); setNewMethod({title:'', min:'', description:'', walletLabel:'', isActive:true});
                    }} className="mt-4 bg-emerald-600 text-white px-6 py-2 rounded-lg font-bold">Add Method</button>
                    
                    <div className="mt-6 space-y-2">
                        {store.settings.jobWithdrawMethods.map((m: any) => (
                            <div key={m.id} className="flex justify-between items-center p-3 bg-gray-50 border rounded-lg">
                                <div>
                                    <span className="font-bold text-gray-800">{m.title} <span className="text-xs font-normal text-gray-500">(Min: {m.minAmount})</span></span>
                                    <span className={`ml-2 text-[10px] px-2 py-0.5 rounded ${m.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{m.isActive ? 'Active' : 'Inactive'}</span>
                                </div>
                                <button onClick={async () => {
                                    await store.updateSettings({ ...store.settings, jobWithdrawMethods: store.settings.jobWithdrawMethods.filter(x=>x.id!==m.id) });
                                    saveAndNotify("Removed");
                                }} className="text-red-500"><Trash2 size={18}/></button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
         </div>
      );
  };

  // 7. VIDEO & FOLDER MANAGER
  const VideoManager = () => {
      // ... (VideoManager content)
      const [newFolder, setNewFolder] = useState('');
      const [videoForm, setVideoForm] = useState({ id: '', title: '', url: '', folderId: '', description: '' });
      const [isEditing, setIsEditing] = useState(false);

      const saveVideo = async () => {
          if(!videoForm.folderId || !videoForm.url) return alert("Folder and URL required");
          const embedUrl = extractEmbedUrl(videoForm.url);
          const videoData = { 
              id: isEditing ? videoForm.id : Date.now().toString(), title: videoForm.title, url: embedUrl, description: videoForm.description 
          };

          let updatedSessions = [...store.settings.videoSessions];
          if (isEditing) {
              updatedSessions = updatedSessions.map(f => {
                  if (f.id === videoForm.folderId) {
                      const vIndex = f.videos.findIndex(v => v.id === videoForm.id);
                      if(vIndex >= 0) f.videos[vIndex] = { ...f.videos[vIndex], ...videoData }; 
                  }
                  return f;
              });
          } else {
              updatedSessions = updatedSessions.map(f => {
                  if (f.id === videoForm.folderId) return { ...f, videos: [...f.videos, videoData] };
                  return f;
              });
          }
          await store.updateSettings({ ...store.settings, videoSessions: updatedSessions });
          saveAndNotify(isEditing ? "Video Updated!" : "Video Added!");
          setVideoForm({ id: '', title: '', url: '', folderId: '', description: '' }); setIsEditing(false);
      };

      const deleteVideo = async (folderId: string, videoId: string) => {
          if(!window.confirm("Delete Video?")) return;
          const updatedSessions = store.settings.videoSessions.map(folder => {
              if (folder.id === folderId) return { ...folder, videos: folder.videos.filter(vid => vid.id !== videoId) };
              return folder;
          });
          await store.updateSettings({ ...store.settings, videoSessions: updatedSessions });
          saveAndNotify("Video Deleted");
      };

      return (
         <div className="space-y-6">
            {/* Create Folder */}
            <div className={cardStyle}>
               <h4 className={`font-bold flex items-center gap-2 mb-3 ${headingStyle}`}><FolderPlus size={18}/> Create New Folder</h4>
               <div className="flex gap-2">
                  <input className={inputStyle} placeholder="Folder Name (e.g. Graphic Design)" value={newFolder} onChange={e=>setNewFolder(e.target.value)}/>
                  <button onClick={async ()=>{
                      if(!newFolder) return;
                      const newSettings = { ...store.settings, videoSessions: [...store.settings.videoSessions, { id: Date.now().toString(), name: newFolder, videos: [] }] };
                      await store.updateSettings(newSettings);
                      saveAndNotify("Folder Created!");
                      setNewFolder('');
                  }} className="bg-emerald-600 text-white px-6 rounded-lg font-bold hover:bg-emerald-700">Create</button>
               </div>
            </div>

            {/* Add/Edit Video */}
            <div className={cardStyle}>
               <h4 className={`font-bold flex items-center gap-2 mb-3 ${headingStyle}`}><MonitorPlay size={18}/> {isEditing ? 'Edit Video' : 'Add Video to Folder'}</h4>
               <div className="space-y-3">
                  <select className={inputStyle} value={videoForm.folderId} onChange={e=>setVideoForm({...videoForm, folderId:e.target.value})} disabled={isEditing}>
                     <option value="">Select Target Folder</option>
                     {store.settings.videoSessions.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                  </select>
                  <input className={inputStyle} placeholder="Video Title" value={videoForm.title} onChange={e=>setVideoForm({...videoForm, title:e.target.value})}/>
                  <input className={inputStyle} placeholder="YouTube Link (Auto Converts to Embed)" value={videoForm.url} onChange={e=>setVideoForm({...videoForm, url:e.target.value})}/>
                  <textarea className={inputStyle} placeholder="Short Description (Optional)" value={videoForm.description} onChange={e=>setVideoForm({...videoForm, description:e.target.value})}/>
                  <div className="flex gap-2">
                      <button onClick={saveVideo} className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700">{isEditing ? 'Update Video' : 'Add Video'}</button>
                      {isEditing && <button onClick={()=>{setIsEditing(false); setVideoForm({ id: '', title: '', url: '', folderId: '', description: '' })}} className="bg-gray-400 text-white px-6 rounded-lg font-bold">Cancel</button>}
                  </div>
               </div>
            </div>

            {/* List */}
            <div className="space-y-4">
               {store.settings.videoSessions.map(f => (
                  <div key={f.id} className={cardStyle}>
                     <div className="flex justify-between items-center mb-3 border-b pb-2 border-gray-100">
                        <h5 className={`font-bold text-lg flex items-center gap-2 ${headingStyle}`}><Folder size={20} className="text-amber-500 fill-amber-500"/> {f.name}</h5>
                        <button onClick={async ()=>{
                            if(!window.confirm("Delete Folder & All Videos?")) return;
                            const newSettings = { ...store.settings, videoSessions: store.settings.videoSessions.filter(x => x.id !== f.id) };
                            await store.updateSettings(newSettings);
                        }} className="text-red-400 hover:text-red-600"><Trash2 size={18}/></button>
                     </div>
                     <div className="space-y-2">
                        {f.videos.map(v => (
                           <div key={v.id} className={`flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-200 hover:bg-white transition`}>
                              <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600"><Video size={16}/></div>
                                  <div>
                                      <div className="text-sm font-bold text-gray-800">{v.title}</div>
                                      <div className="text-[10px] text-gray-500 truncate w-40">{v.url}</div>
                                  </div>
                              </div>
                              <div className="flex gap-2">
                                  <button onClick={()=>{ setVideoForm({id:v.id, title:v.title, url:v.url, description:v.description || '', folderId:f.id}); setIsEditing(true); window.scrollTo({top:0, behavior:'smooth'}); }} className="text-blue-500 p-2 hover:bg-blue-50 rounded"><Edit3 size={16}/></button>
                                  <button onClick={()=>deleteVideo(f.id, v.id)} className="text-red-500 p-2 hover:bg-red-50 rounded"><Trash2 size={16}/></button>
                              </div>
                           </div>
                        ))}
                        {f.videos.length === 0 && <p className="text-xs text-gray-400 italic">Empty folder</p>}
                     </div>
                  </div>
               ))}
            </div>
         </div>
      );
  };

  // 8. SUPPORT & TICKETS (RESTORED SETTINGS TAB)
  const SupportManager = () => {
// ... (SupportManager content)
      const [tab, setTab] = useState<'TICKETS'|'SETTINGS'>('TICKETS');
      const [replyState, setReplyState] = useState<{id: string, text: string} | null>(null);
      const [config, setConfig] = useState(store.settings.supportConfig);

      const submitReply = async () => {
          if(!replyState?.text) return;
          await store.updateTicket(replyState.id, { adminReply: replyState.text, status: 'CLOSED' });
          const t = store.supportTickets.find(x=>x.id===replyState.id);
          if(t) notifyUser(t.userId, "Support Reply", "Admin has replied to your ticket.");
          saveAndNotify("Reply Sent!");
          setReplyState(null);
      };

      const saveSupportConfig = async () => {
          await store.updateSettings({ ...store.settings, supportConfig: config });
          saveAndNotify("Support Config Saved!");
      };

      return (
          <div className="space-y-6">
              <div className="flex gap-2 border-b pb-2">
                  <button onClick={()=>setTab('TICKETS')} className={`px-4 py-2 rounded-lg font-bold text-sm ${tab==='TICKETS'?'bg-emerald-600 text-white':'text-gray-500 hover:bg-gray-100'}`}>Tickets</button>
                  <button onClick={()=>setTab('SETTINGS')} className={`px-4 py-2 rounded-lg font-bold text-sm ${tab==='SETTINGS'?'bg-emerald-600 text-white':'text-gray-500 hover:bg-gray-100'}`}>Support Settings</button>
              </div>

              {tab === 'TICKETS' && (
                  <div className="space-y-4">
                      {store.supportTickets.slice().reverse().map(t => (
                          <div key={t.id} className={cardStyle}>
                              <UserRequestInfo userId={t.userId} />
                              <div className="flex justify-between mb-2 mt-3">
                                  <span className={`font-bold ${headingStyle}`}>{t.subject}</span>
                                  <span className={`text-[10px] px-2 py-1 rounded font-bold ${t.status==='OPEN'?'bg-green-100 text-green-800':'bg-gray-100 text-gray-600'}`}>{t.status}</span>
                              </div>
                              <p className="text-sm text-gray-600 bg-slate-50 p-3 rounded mb-3 border border-slate-100">{t.message}</p>
                              
                              {t.adminReply ? (
                                  <div className="text-xs text-emerald-700 bg-emerald-50 p-3 rounded border border-emerald-100">
                                      <strong>Admin Reply:</strong> {t.adminReply}
                                  </div>
                              ) : (
                                  <div className="mt-2 flex gap-2">
                                      {replyState?.id === t.id ? (
                                          <>
                                              <input className={inputStyle} autoFocus placeholder="Type reply..." value={replyState.text} onChange={e=>setReplyState({...replyState, text:e.target.value})}/>
                                              <button onClick={submitReply} className="bg-blue-600 text-white px-4 rounded font-bold">Send</button>
                                              <button onClick={()=>setReplyState(null)} className="bg-gray-200 text-gray-600 px-4 rounded">X</button>
                                          </>
                                      ) : (
                                          <button onClick={()=>setReplyState({id: t.id, text: ''})} className="text-xs bg-blue-600 text-white px-4 py-2 rounded-lg font-bold shadow hover:bg-blue-700">Reply & Close</button>
                                      )}
                                  </div>
                              )}
                          </div>
                      ))}
                      {store.supportTickets.length === 0 && <div className="text-center py-10 text-gray-400">No tickets found.</div>}
                  </div>
              )}

              {tab === 'SETTINGS' && (
                  <div className={cardStyle}>
                      <h4 className={`font-bold mb-4 ${headingStyle} flex items-center gap-2`}><Settings size={20}/> Configure Support Links</h4>
                      <div className="space-y-3">
                          <div><label className={labelStyle}>WhatsApp Support Link</label><input className={inputStyle} value={config.whatsappSupportLink} onChange={e=>setConfig({...config, whatsappSupportLink: e.target.value})}/></div>
                          <div><label className={labelStyle}>Free Telegram Group</label><input className={inputStyle} value={config.freeTelegramGroupLink} onChange={e=>setConfig({...config, freeTelegramGroupLink: e.target.value})}/></div>
                          <div><label className={labelStyle}>Premium Support Link</label><input className={inputStyle} value={config.premiumSupportGroupLink} onChange={e=>setConfig({...config, premiumSupportGroupLink: e.target.value})}/></div>
                          <div><label className={labelStyle}>Admin WhatsApp Number</label><input className={inputStyle} value={config.premiumAdminWhatsapp} onChange={e=>setConfig({...config, premiumAdminWhatsapp: e.target.value})}/></div>
                          <div className="col-span-2"><label className={labelStyle}>Support Description Text</label><textarea className={inputStyle} value={config.supportDescription} onChange={e=>setConfig({...config, supportDescription: e.target.value})}/></div>
                      </div>
                      <button onClick={saveSupportConfig} className="w-full bg-emerald-600 text-white py-3 rounded-lg font-bold mt-4 shadow-lg">Save Configuration</button>
                  </div>
              )}
          </div>
      );
  };

  // 9. GENERAL SETTINGS (UPDATED QUIZ & BUTTONS)
  const GeneralSettings = () => {
      const [localSettings, setLocalSettings] = useState(store.settings);
      // FIXED: Added safety check for quizAdLinks to prevent 'join of undefined' error
      const [quizLinksText, setQuizLinksText] = useState((store.settings.referralConfig?.quizAdLinks || []).join('\n'));

      const saveGeneral = async () => {
          const newSettings = { 
              ...store.settings, 
              ...localSettings,
              referralConfig: {
                  ...localSettings.referralConfig,
                  quizAdLinks: quizLinksText.split('\n').filter(l => l.trim() !== '')
              }
          };
          await store.updateSettings(newSettings);
          saveAndNotify("Settings Saved Successfully!");
      };

      return (
         <div className="space-y-6">
            {/* Branding */}
            <div className={cardStyle}>
               <h4 className={`font-bold mb-4 ${headingStyle} border-b pb-2`}>App Branding</h4>
               <div className="grid md:grid-cols-2 gap-4">
                  <div><label className={labelStyle}>Company Name</label><input className={inputStyle} value={localSettings.companyName} onChange={e=>setLocalSettings({...localSettings, companyName:e.target.value})}/></div>
                  <div><label className={labelStyle}>Logo URL</label><input className={inputStyle} value={localSettings.companyLogo} onChange={e=>setLocalSettings({...localSettings, companyLogo:e.target.value})}/></div>
                  <div className="md:col-span-2"><label className={labelStyle}>Notice Text (Scrolling)</label><input className={inputStyle} value={localSettings.noticeText} onChange={e=>setLocalSettings({...localSettings, noticeText:e.target.value})}/></div>
                  <div className="md:col-span-2"><label className={labelStyle}>Landing Page Text</label><textarea className={inputStyle} value={localSettings.landingDescription} onChange={e=>setLocalSettings({...localSettings, landingDescription:e.target.value})}/></div>
               </div>
            </div>

            {/* Links */}
            <div className={cardStyle}>
               <h4 className={`font-bold mb-4 ${headingStyle} border-b pb-2`}>Social & Support Links</h4>
               <div className="grid md:grid-cols-2 gap-4">
                  <div><label className={labelStyle}>Telegram Channel</label><input className={inputStyle} value={localSettings.supportConfig.freeTelegramChannelLink} onChange={e=>setLocalSettings({...localSettings, supportConfig: {...localSettings.supportConfig, freeTelegramChannelLink: e.target.value}})}/></div>
                  <div><label className={labelStyle}>Telegram Group</label><input className={inputStyle} value={localSettings.supportConfig.freeTelegramGroupLink} onChange={e=>setLocalSettings({...localSettings, supportConfig: {...localSettings.supportConfig, freeTelegramGroupLink: e.target.value}})}/></div>
                  <div><label className={labelStyle}>Admin WhatsApp</label><input className={inputStyle} value={localSettings.supportConfig.premiumAdminWhatsapp} onChange={e=>setLocalSettings({...localSettings, supportConfig: {...localSettings.supportConfig, premiumAdminWhatsapp: e.target.value}})}/></div>
                  <div><label className={labelStyle}>WhatsApp Link</label><input className={inputStyle} value={localSettings.supportConfig.whatsappSupportLink} onChange={e=>setLocalSettings({...localSettings, supportConfig: {...localSettings.supportConfig, whatsappSupportLink: e.target.value}})}/></div>
               </div>
            </div>

            {/* Referral & Quiz */}
            <div className={cardStyle}>
                <h4 className={`font-bold mb-4 ${headingStyle} border-b pb-2 flex items-center gap-2`}><Gift size={18}/> Referral & Quiz</h4>
                <div className="grid md:grid-cols-2 gap-4">
                    <div><label className={labelStyle}>Registration Bonus (Tk)</label><input type="number" className={inputStyle} value={localSettings.referralConfig.signupBonus} onChange={e=>setLocalSettings({...localSettings, referralConfig: {...localSettings.referralConfig, signupBonus: Number(e.target.value)}})}/></div>
                    <div><label className={labelStyle}>Quiz Reward (Tk)</label><input type="number" className={inputStyle} value={localSettings.referralConfig.quizRate} onChange={e=>setLocalSettings({...localSettings, referralConfig: {...localSettings.referralConfig, quizRate: Number(e.target.value)}})}/></div>
                    <div><label className={labelStyle}>Level 1 Bonus (Tk)</label><input type="number" className={inputStyle} value={localSettings.referralConfig.level1Bonus} onChange={e=>setLocalSettings({...localSettings, referralConfig: {...localSettings.referralConfig, level1Bonus: Number(e.target.value)}})}/></div>
                    <div><label className={labelStyle}>Quiz Visit Timer (Seconds)</label><input type="number" className={inputStyle} value={localSettings.referralConfig.quizTimer || 30} onChange={e=>setLocalSettings({...localSettings, referralConfig: {...localSettings.referralConfig, quizTimer: Number(e.target.value)}})}/></div>
                    <div className="col-span-2">
                        <label className={labelStyle}>Quiz Ad Links (Unlimited - One per line)</label>
                        <textarea className={inputStyle + " h-32 font-mono text-xs"} value={quizLinksText} onChange={e=>setQuizLinksText(e.target.value)} placeholder="https://link1.com&#10;https://link2.com"></textarea>
                    </div>
                </div>
            </div>

            <button onClick={saveGeneral} className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold shadow-lg hover:bg-emerald-700 flex justify-center items-center gap-2"><Save size={20}/> Save All Settings</button>
         </div>
      );
  };

  // 10. NOTIFICATIONS (UPDATED 3 TYPES)
  const NotificationManager = () => {
// ... (NotificationManager content)
      const [type, setType] = useState<'TEXT' | 'IMAGE_TEXT' | 'IMAGE_LINK'>('TEXT');
      const [title, setTitle] = useState('');
      const [msg, setMsg] = useState('');
      const [img, setImg] = useState('');
      const [link, setLink] = useState('');
      
      const send = async () => {
          if(!title || !msg) return alert("Title and Message required");
          store.notifications.push({
              id: Date.now().toString(), 
              title, 
              message: msg, 
              type: type as any, 
              image: (type === 'IMAGE_TEXT' || type === 'IMAGE_LINK') ? img : undefined,
              link: type === 'IMAGE_LINK' ? link : undefined,
              date: new Date().toISOString(), 
              readBy: []
          });
          await store.save();
          saveAndNotify("Notification Sent!");
          setTitle(''); setMsg(''); setImg(''); setLink('');
      };

      return (
          <div className="space-y-6">
              <div className={cardStyle}>
                  <h4 className={`font-bold mb-3 ${headingStyle}`}>Broadcast Message</h4>
                  
                  <div className="flex gap-2 mb-4 bg-gray-100 p-1 rounded-lg">
                      {['TEXT', 'IMAGE_TEXT', 'IMAGE_LINK'].map(t => (
                          <button key={t} onClick={()=>setType(t as any)} className={`flex-1 py-2 text-xs font-bold rounded-md transition ${type===t?'bg-white shadow text-emerald-600':'text-gray-500'}`}>
                              {t.replace('_', ' + ')}
                          </button>
                      ))}
                  </div>

                  <div className="space-y-3">
                      <input className={inputStyle} placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)}/>
                      <textarea className={inputStyle + " h-24"} placeholder="Message" value={msg} onChange={e=>setMsg(e.target.value)}/>
                      
                      {(type === 'IMAGE_TEXT' || type === 'IMAGE_LINK') && (
                          <input className={inputStyle} placeholder="Image URL" value={img} onChange={e=>setImg(e.target.value)}/>
                      )}
                      
                      {type === 'IMAGE_LINK' && (
                          <input className={inputStyle} placeholder="Target Link URL" value={link} onChange={e=>setLink(e.target.value)}/>
                      )}
                  </div>

                  <button onClick={send} className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold mt-4">Send to All Users</button>
              </div>
              
              <div className="space-y-3">
                  <h4 className={`font-bold ${headingStyle}`}>History</h4>
                  {store.notifications.slice().reverse().map(n => (
                      <div key={n.id} className={cardStyle + " py-3"}>
                          <div className="font-bold text-sm">{n.title} <span className="text-[10px] font-normal bg-gray-200 px-1 rounded">{n.type}</span></div>
                          <div className="text-xs text-gray-500">{n.message}</div>
                          {n.image && <img src={n.image} className="h-10 mt-1 rounded"/>}
                          <div className="text-[10px] text-gray-400 mt-1">{new Date(n.date).toLocaleString()}</div>
                      </div>
                  ))}
              </div>
          </div>
      );
  };

  // 11. TOOLS MANAGER
  const ToolsManager = () => {
// ... (ToolsManager content)
      const [newTool, setNewTool] = useState({ name: '', link: '', icon: '' });
      return (
          <div className="space-y-6">
              <div className={cardStyle}>
                  <h4 className={`font-bold mb-3 ${headingStyle}`}>Add Tool</h4>
                  <div className="space-y-3">
                      <input className={inputStyle} placeholder="Tool Name" value={newTool.name} onChange={e=>setNewTool({...newTool, name:e.target.value})}/>
                      <input className={inputStyle} placeholder="Link" value={newTool.link} onChange={e=>setNewTool({...newTool, link:e.target.value})}/>
                      <input className={inputStyle} placeholder="Icon URL" value={newTool.icon} onChange={e=>setNewTool({...newTool, icon:e.target.value})}/>
                      <button onClick={async ()=>{
                          const t = { id: Date.now().toString(), name: newTool.name, link: newTool.link, iconUrl: newTool.icon };
                          await store.updateSettings({ ...store.settings, tools: [...store.settings.tools, t] });
                          saveAndNotify("Tool Added"); setNewTool({name:'', link:'', icon:''});
                      }} className="w-full bg-indigo-600 text-white py-2 rounded font-bold">Add</button>
                  </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                  {store.settings.tools.map(t => (
                      <div key={t.id} className={cardStyle + " flex justify-between items-center"}>
                          <div className="flex items-center gap-2">
                              {t.iconUrl && <img src={t.iconUrl} className="w-8 h-8 rounded"/>}
                              <div><h5 className="font-bold text-sm">{t.name}</h5><a href={t.link} target="_blank" className="text-[10px] text-blue-500 underline">Visit</a></div>
                          </div>
                          <button onClick={async ()=>{
                              await store.updateSettings({ ...store.settings, tools: store.settings.tools.filter(x=>x.id!==t.id) });
                              saveAndNotify("Deleted");
                          }} className="text-red-500"><Trash2 size={16}/></button>
                      </div>
                  ))}
              </div>
          </div>
      );
  };

  // 12. CUSTOM BUTTONS MANAGER (UPDATED: Link or HTML)
  const ButtonManager = () => {
// ... (ButtonManager content)
      const [type, setType] = useState<'HTML'|'LINK'>('HTML');
      const [btn, setBtn] = useState({ name: '', icon: '', content: '' });
      
      return (
         <div className={cardStyle}>
            <h4 className={`font-bold mb-4 ${headingStyle}`}>Add Custom Page Button</h4>
            
            <div className="flex gap-4 mb-4">
                <label className="flex items-center gap-2 cursor-pointer"><input type="radio" checked={type==='HTML'} onChange={()=>setType('HTML')}/> HTML Page</label>
                <label className="flex items-center gap-2 cursor-pointer"><input type="radio" checked={type==='LINK'} onChange={()=>setType('LINK')}/> Direct Link</label>
            </div>

            <div className="space-y-3">
               <input className={inputStyle} placeholder="Button Name" value={btn.name} onChange={e=>setBtn({...btn, name:e.target.value})}/>
               <input className={inputStyle} placeholder="Icon URL or Image Link" value={btn.icon} onChange={e=>setBtn({...btn, icon:e.target.value})}/>
               
               {type === 'HTML' ? (
                   <textarea className={inputStyle + " h-32 font-mono"} placeholder="HTML Content" value={btn.content} onChange={e=>setBtn({...btn, content:e.target.value})}></textarea>
               ) : (
                   <input className={inputStyle} placeholder="Target Link (https://...)" value={btn.content} onChange={e=>setBtn({...btn, content:e.target.value})}/>
               )}

               <button onClick={async ()=>{
                   const newSettings = { ...store.settings, customPages: [...store.settings.customPages, { id: Date.now().toString(), buttonName: btn.name, iconUrl: btn.icon, htmlContent: type === 'LINK' ? `LINK:${btn.content}` : btn.content }] };
                   await store.updateSettings(newSettings);
                   saveAndNotify("Button Added!"); setBtn({name:'', icon:'', content:''});
               }} className="w-full bg-indigo-600 text-white py-2 rounded font-bold">Create Button</button>
            </div>
            
            <div className="mt-4 space-y-2">
               {store.settings.customPages.map(p => (
                  <div key={p.id} className="flex justify-between items-center p-2 bg-gray-50 border rounded">
                     <span className="font-bold text-sm flex items-center gap-2">
                         {p.iconUrl && <img src={p.iconUrl} className="w-5 h-5"/>} {p.buttonName}
                     </span>
                     <button onClick={async ()=>{
                         const newSettings = { ...store.settings, customPages: store.settings.customPages.filter(x => x.id !== p.id) };
                         await store.updateSettings(newSettings);
                     }} className="text-red-500"><Trash2 size={16}/></button>
                  </div>
               ))}
            </div>
         </div>
      );
  };

  // 13. PREMIUM MANAGER (UPDATED SETTINGS)
  const PremiumManager = () => {
// ... (PremiumManager content)
      const [tab, setTab] = useState<'REQUESTS'|'SETTINGS'>('REQUESTS');
      const reqs = store.premiumRequests.filter(r => r.status === 'PENDING');
      const [premSettings, setPremSettings] = useState({ 
          fee: store.settings.premiumFee, 
          refBonus: store.settings.referralConfig.level1Bonus, // Premium Ref Bonus
          isActive: store.settings.isPremiumActive ?? true,
          bkash: store.settings.paymentNumbers.bkash, 
          nagad: store.settings.paymentNumbers.nagad, 
          rocket: store.settings.paymentNumbers.rocket, 
          desc: store.settings.premiumDescription 
      });

      const handle = async (id: string, action: 'APPROVED'|'REJECTED') => {
          const r = store.premiumRequests.find(x=>x.id===id);
          if(!r) return;
          await store.updatePremiumRequest(id, action);
          if(action === 'APPROVED') {
              const u = store.users.find(x=>x.id===r.userId);
              if(u) { 
                  // Referrer Bonus Logic for Premium
                  if(u.referrerId) {
                      const referrer = store.users.find(ru => ru.id === u.referrerId);
                      if(referrer && referrer.accountType === 'PREMIUM') {
                          const bonus = Number(store.settings.referralConfig.level1Bonus);
                          referrer.balanceMain += bonus;
                          await store.updateUser(referrer);
                          notifyUser(referrer.id, "Premium Referral Bonus", `You earned ${bonus} Tk for premium referral!`);
                      }
                  }
                  await store.updateUser({ ...u, accountType: 'PREMIUM' }); 
                  notifyUser(u.id, "Premium Approved", "You are now Premium!"); 
              }
          }
          saveAndNotify(`Premium ${action}`);
      };

      const savePrem = async () => {
          const newSettings = { 
              ...store.settings, 
              premiumFee: Number(premSettings.fee), 
              isPremiumActive: premSettings.isActive,
              referralConfig: { ...store.settings.referralConfig, level1Bonus: Number(premSettings.refBonus) },
              paymentNumbers: { bkash: premSettings.bkash, nagad: premSettings.nagad, rocket: premSettings.rocket }, 
              premiumDescription: premSettings.desc 
          };
          await store.updateSettings(newSettings);
          saveAndNotify("Premium Settings Saved!");
      };

      return (
          <div className="space-y-4">
              <div className="flex gap-2 border-b pb-2">
                  <button onClick={()=>setTab('REQUESTS')} className={`px-4 py-2 rounded-lg font-bold text-sm ${tab==='REQUESTS'?'bg-emerald-600 text-white':'text-gray-500 hover:bg-gray-100'}`}>Requests</button>
                  <button onClick={()=>setTab('SETTINGS')} className={`px-4 py-2 rounded-lg font-bold text-sm ${tab==='SETTINGS'?'bg-emerald-600 text-white':'text-gray-500 hover:bg-gray-100'}`}>Settings</button>
              </div>

              {tab === 'REQUESTS' && (
                  <>
                  {reqs.map(r => (
                      <div key={r.id} className={cardStyle + " flex justify-between items-center"}>
                          <div><UserRequestInfo userId={r.userId}/><div className="text-xs mt-1">TrxID: <b>{r.transactionId}</b> | {r.method}</div></div>
                          <div className="flex gap-2"><button onClick={()=>handle(r.id, 'APPROVED')} className="bg-emerald-500 text-white px-3 py-1 rounded">Approve</button><button onClick={()=>handle(r.id, 'REJECTED')} className="bg-red-500 text-white px-3 py-1 rounded">Reject</button></div>
                      </div>
                  ))}
                  {reqs.length === 0 && <div className="text-center text-gray-400 py-10">No pending requests.</div>}
                  </>
              )}

              {tab === 'SETTINGS' && (
                  <div className={cardStyle}>
                      <h4 className={`font-bold mb-4 ${headingStyle}`}>Premium Configuration</h4>
                      <div className="space-y-3">
                          <div className="flex items-center gap-2 mb-4 p-3 bg-amber-50 rounded border border-amber-200">
                              <input type="checkbox" className="w-5 h-5 accent-amber-600" checked={premSettings.isActive} onChange={e=>setPremSettings({...premSettings, isActive: e.target.checked})}/>
                              <span className="font-bold text-amber-800">Enable Premium System</span>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                              <div><label className={labelStyle}>Activation Fee (Tk)</label><input type="number" className={inputStyle} value={premSettings.fee} onChange={e=>setPremSettings({...premSettings, fee: Number(e.target.value)})}/></div>
                              <div><label className={labelStyle}>Premium Ref Bonus (Tk)</label><input type="number" className={inputStyle} value={premSettings.refBonus} onChange={e=>setPremSettings({...premSettings, refBonus: Number(e.target.value)})}/></div>
                          </div>

                          <div className="grid grid-cols-3 gap-3">
                              <div><label className={labelStyle}>bKash</label><input className={inputStyle} value={premSettings.bkash} onChange={e=>setPremSettings({...premSettings, bkash: e.target.value})}/></div>
                              <div><label className={labelStyle}>Nagad</label><input className={inputStyle} value={premSettings.nagad} onChange={e=>setPremSettings({...premSettings, nagad: e.target.value})}/></div>
                              <div><label className={labelStyle}>Rocket</label><input className={inputStyle} value={premSettings.rocket} onChange={e=>setPremSettings({...premSettings, rocket: e.target.value})}/></div>
                          </div>
                          <div><label className={labelStyle}>Benefits Text (HTML)</label><textarea className={inputStyle + " h-24"} value={premSettings.desc} onChange={e=>setPremSettings({...premSettings, desc: e.target.value})}/></div>
                      </div>
                      <button onClick={savePrem} className="w-full bg-emerald-600 text-white py-3 rounded-lg font-bold mt-4 shadow-lg">Save Configuration</button>
                  </div>
              )}
          </div>
      );
  };

  const menuItems = [
     { id: 'dashboard', label: 'Dashboard', icon: Grid },
     { id: 'users', label: 'Users', icon: Users },
     { id: 'tasks', label: 'Tasks', icon: CheckSquare },
     { id: 'withdraw', label: 'Withdraws', icon: DollarSign },
     { id: 'job_withdraw', label: 'Job Transfers', icon: Briefcase },
     { id: 'social', label: 'Social Sell', icon: Instagram },
     { id: 'premium', label: 'Premium', icon: Crown },
     { id: 'videos', label: 'Videos', icon: Video },
     { id: 'support', label: 'Support', icon: Headset },
     { id: 'notifications', label: 'Notify', icon: Bell },
     { id: 'tools', label: 'Tools', icon: Wrench },
     { id: 'buttons', label: 'Custom Pages', icon: MousePointer },
     { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className={`min-h-screen flex flex-col md:flex-row font-sans transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {toastMsg && <Toast message={toastMsg} onClose={()=>setToastMsg('')}/>}
      
      {/* Sidebar */}
      <div className={`fixed md:relative top-0 left-0 h-full w-64 z-50 transform transition-transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 shadow-2xl flex flex-col ${darkMode ? 'bg-black border-r border-gray-800' : 'bg-slate-900 text-white'}`}>
         <div className="p-5 flex justify-between items-center border-b border-gray-700">
            <Logo size="small" className="text-white filter brightness-200"/> 
            <button onClick={() => setSidebarOpen(false)} className="md:hidden text-gray-400 hover:text-white"><XCircle /></button>
         </div>
         <div className="flex-1 p-4 space-y-1 overflow-y-auto h-full no-scrollbar">
            {menuItems.map(item => (
               <button key={item.id} onClick={() => { setView(item.id); setSidebarOpen(false); }} className={`w-full text-left p-3 rounded-lg flex gap-3 items-center transition ${view === item.id ? 'bg-emerald-600 text-white shadow-lg' : 'text-gray-400 hover:bg-white/10 hover:text-white'}`}>
                  <item.icon size={18}/> <span className="font-medium">{item.label}</span>
               </button>
            ))}
            <div className="h-px bg-slate-700 my-4"></div>
            <button onClick={onLogout} className="w-full text-left p-3 rounded-lg flex gap-3 text-red-400 hover:bg-slate-800"><LogOut size={18}/> Logout</button>
         </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <div className={`shadow-sm p-4 flex justify-between items-center z-10 sticky top-0 ${darkMode ? 'bg-gray-800 border-b border-gray-700' : 'bg-white'}`}>
            <div className="flex items-center gap-3">
                <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2 rounded-lg bg-gray-200 text-gray-800"><Menu size={24}/></button>
                <span className={`font-bold capitalize flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div> {menuItems.find(m=>m.id===view)?.label}
                </span>
            </div>
            
            {/* Dark Mode Toggle */}
            <button 
                onClick={() => setDarkMode(!darkMode)} 
                className={`p-2 rounded-full transition ${darkMode ? 'bg-gray-700 text-yellow-400' : 'bg-gray-100 text-gray-600'}`}
            >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
        </div>
        
        <div className={`flex-1 p-6 overflow-y-auto ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
           {view === 'dashboard' && <Dashboard />}
           {view === 'users' && <UserManagement />}
           {view === 'premium' && <PremiumManager />}
           {view === 'social' && <SocialManager />}
           {view === 'tasks' && <TaskManager />}
           {view === 'withdraw' && <WithdrawManager />}
           {view === 'job_withdraw' && <JobWithdrawManager />}
           {view === 'support' && <SupportManager />}
           {view === 'videos' && <VideoManager />}
           {view === 'tools' && <ToolsManager />}
           {view === 'buttons' && <ButtonManager />}
           {view === 'notifications' && <NotificationManager />}
           {view === 'settings' && <GeneralSettings />}
        </div>
      </div>
    </div>
  );
};
