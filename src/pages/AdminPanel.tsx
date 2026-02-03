import React, { useState } from 'react';
import { store } from '../services/store';
import { Users, DollarSign, List, CheckCircle, XCircle, Settings, LogOut, Crown, CheckSquare, Plus, Trash2, Bell, MessageCircle, Send, Shield, FileText, Database, Edit3, Mail, Briefcase, Grid, Menu, PlusCircle, Save, PlayCircle } from 'lucide-react';
import { Task, WalletType, User } from '../types';

interface AdminProps {
  onLogout: () => void;
}

export const AdminPanel: React.FC<AdminProps> = ({ onLogout }) => {
  const [view, setView] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [refresh, setRefresh] = useState(0); 

  // ... Dashboard, GmailManagement, TaskManagement from previous code ...
  const Dashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100"><p className="text-xs text-gray-500 uppercase">Total Users</p><h3 className="text-2xl font-bold text-emerald-600">{store.users.length}</h3></div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100"><p className="text-xs text-gray-500 uppercase">Pending Gmail</p><h3 className="text-2xl font-bold text-pink-500">{store.gmailOrders.filter(g => g.status !== 'APPROVED' && g.status !== 'REJECTED').length}</h3></div>
      </div>
    </div>
  );

  const UserManagement = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [editUser, setEditUser] = useState<User | null>(null);

    const filteredUsers = store.users.filter(u => 
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      u.whatsapp.includes(searchTerm) || 
      u.id.includes(searchTerm)
    );

    const toggleBlock = (u: User) => {
       u.status = u.status === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE';
       store.save(); setRefresh(r => r + 1);
    };

    const handleUpdateUser = () => {
       if(editUser) {
          const idx = store.users.findIndex(u => u.id === editUser.id);
          if(idx >= 0) {
             store.users[idx] = editUser;
             store.save();
             setEditUser(null);
             alert("User Updated");
          }
       }
    };

    return (
      <div className="space-y-4">
         <h3 className="font-bold text-gray-800">User Management</h3>
         <input className="w-full p-2 border rounded" placeholder="Search by Name, ID or Phone" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
         
         {editUser && (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-4 space-y-3">
               <h4 className="font-bold text-blue-800">Editing: {editUser.name}</h4>
               <div className="grid grid-cols-2 gap-2">
                  <input className="border p-2 rounded" value={editUser.name} onChange={e => setEditUser({...editUser, name: e.target.value})} placeholder="Name" />
                  <input className="border p-2 rounded" value={editUser.whatsapp} onChange={e => setEditUser({...editUser, whatsapp: e.target.value})} placeholder="Phone" />
                  <input className="border p-2 rounded" value={editUser.password} onChange={e => setEditUser({...editUser, password: e.target.value})} placeholder="Password" />
                  <input className="border p-2 rounded" type="number" value={editUser.balanceFree} onChange={e => setEditUser({...editUser, balanceFree: Number(e.target.value)})} placeholder="Balance" />
               </div>
               <div className="flex gap-2">
                  <button onClick={handleUpdateUser} className="bg-blue-600 text-white px-4 py-1 rounded">Save Changes</button>
                  <button onClick={() => setEditUser(null)} className="bg-gray-400 text-white px-4 py-1 rounded">Cancel</button>
               </div>
            </div>
         )}

         <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="w-full text-sm text-left">
               <thead className="bg-gray-50 text-gray-700 font-bold">
                  <tr>
                     <th className="p-3">User</th>
                     <th className="p-3">Balance</th>
                     <th className="p-3">Status</th>
                     <th className="p-3">Actions</th>
                  </tr>
               </thead>
               <tbody>
                  {filteredUsers.map(u => (
                     <tr key={u.id} className="border-t hover:bg-gray-50">
                        <td className="p-3">
                           <div className="font-bold">{u.name}</div>
                           <div className="text-xs text-gray-500">{u.whatsapp} | ID: {u.id}</div>
                        </td>
                        <td className="p-3">
                           <div className="font-mono text-emerald-600">{u.balanceFree} ৳</div>
                           <div className="text-[10px] text-gray-400">{u.accountType}</div>
                        </td>
                        <td className="p-3">
                           <span className={`px-2 py-1 rounded text-xs font-bold ${u.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{u.status}</span>
                        </td>
                        <td className="p-3 flex gap-2">
                           <button onClick={() => setEditUser(u)} className="p-1.5 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"><Edit3 size={16}/></button>
                           <button onClick={() => toggleBlock(u)} className={`p-1.5 rounded text-white ${u.status === 'ACTIVE' ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}>
                              {u.status === 'ACTIVE' ? 'Block' : 'Unblock'}
                           </button>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
    );
  };

  const GlobalSettings = () => {
    const [settings, setSettings] = useState(store.settings);

    const handleSave = () => {
       store.settings = settings;
       store.save();
       alert("Settings Saved Successfully!");
    };

    return (
       <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
             <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><Settings size={20}/> Referral & Bonus Settings</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                   <label className="text-xs font-bold text-gray-600">Registration Bonus (Tk)</label>
                   <input type="number" className="w-full border p-2 rounded" value={settings.referralConfig.signupBonus} onChange={e => setSettings({...settings, referralConfig: {...settings.referralConfig, signupBonus: Number(e.target.value)}})} />
                </div>
                <div>
                   <label className="text-xs font-bold text-gray-600">Level 1 Commission (%)</label>
                   <input type="number" className="w-full border p-2 rounded" value={settings.referralConfig.level1Percent} onChange={e => setSettings({...settings, referralConfig: {...settings.referralConfig, level1Percent: Number(e.target.value)}})} />
                </div>
                <div>
                   <label className="text-xs font-bold text-gray-600">Level 2 Commission (%)</label>
                   <input type="number" className="w-full border p-2 rounded" value={settings.referralConfig.level2Percent} onChange={e => setSettings({...settings, referralConfig: {...settings.referralConfig, level2Percent: Number(e.target.value)}})} />
                </div>
                <div>
                   <label className="text-xs font-bold text-gray-600">Level 3 Commission (%)</label>
                   <input type="number" className="w-full border p-2 rounded" value={settings.referralConfig.level3Percent} onChange={e => setSettings({...settings, referralConfig: {...settings.referralConfig, level3Percent: Number(e.target.value)}})} />
                </div>
             </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
             <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><PlayCircle size={20}/> Video Links</h3>
             <div className="space-y-3">
                <input className="w-full border p-2 rounded text-sm" placeholder="Work Video URL" value={settings.tutorialVideos.workVideo} onChange={e => setSettings({...settings, tutorialVideos: {...settings.tutorialVideos, workVideo: e.target.value}})} />
                <input className="w-full border p-2 rounded text-sm" placeholder="Gmail Video URL" value={settings.tutorialVideos.gmailVideo} onChange={e => setSettings({...settings, tutorialVideos: {...settings.tutorialVideos, gmailVideo: e.target.value}})} />
                <input className="w-full border p-2 rounded text-sm" placeholder="Withdraw Video URL" value={settings.tutorialVideos.withdrawVideo} onChange={e => setSettings({...settings, tutorialVideos: {...settings.tutorialVideos, withdrawVideo: e.target.value}})} />
             </div>
          </div>

          <button onClick={handleSave} className="w-full bg-emerald-600 text-white py-3 rounded-lg font-bold shadow-lg hover:bg-emerald-700 flex items-center justify-center gap-2"><Save size={18}/> Save All Settings</button>
       </div>
    );
  };
  
  // Re-export other components or keep placeholders
  const GmailManagement = () => <div className="p-4 bg-white rounded shadow">Gmail Manager (Use previous implementation)</div>;
  const TaskManagement = () => <div className="p-4 bg-white rounded shadow">Task Manager (Use previous implementation)</div>;
  const Withdrawals = () => <div className="p-4 bg-white rounded shadow">Withdrawals</div>;
  const PremiumRequests = () => <div className="p-4 bg-white rounded shadow">Premium Requests</div>;
  const ContentControlView = () => <div className="p-4 bg-white rounded shadow">Content</div>;
  const SupportManagement = () => <div className="p-4 bg-white rounded shadow">Support</div>;
  const WalletSettingsView = () => <div className="p-4 bg-white rounded shadow">Wallet Rules</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      <div className={`fixed md:relative top-0 left-0 h-full w-64 bg-slate-900 text-white z-50 transform transition-transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
         <div className="p-4 flex justify-between items-center"><div className="font-bold text-xl text-emerald-400">Admin Panel</div><button onClick={() => setSidebarOpen(false)} className="md:hidden"><XCircle /></button></div>
         <div className="p-4 space-y-2 overflow-y-auto">
            <button onClick={() => setView('dashboard')} className="w-full text-left p-3 rounded flex gap-3 hover:bg-slate-800"><List size={18}/> Dashboard</button>
            <button onClick={() => setView('users')} className="w-full text-left p-3 rounded flex gap-3 hover:bg-slate-800"><Users size={18}/> Users</button>
            <button onClick={() => setView('settings')} className="w-full text-left p-3 rounded flex gap-3 hover:bg-slate-800"><Settings size={18}/> Settings</button>
            {/* Add other nav items */}
            <div className="h-px bg-slate-700 my-2"></div>
            <button onClick={onLogout} className="w-full text-left p-3 rounded flex gap-3 text-red-400 hover:bg-slate-800"><LogOut size={18}/> Logout</button>
         </div>
      </div>

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <div className="bg-white shadow-sm p-4 flex justify-between items-center md:hidden"><span className="font-bold text-gray-800 capitalize">{view}</span><button onClick={() => setSidebarOpen(true)}><Menu size={24} className="text-emerald-600"/></button></div>
        <div className="flex-1 p-6 overflow-y-auto">
          {view === 'dashboard' && <Dashboard />}
          {view === 'users' && <UserManagement />}
          {view === 'settings' && <GlobalSettings />}
          {view === 'tasks' && <TaskManagement />}
          {view === 'gmail' && <GmailManagement />}
          {/* Add other views */}
        </div>
      </div>
    </div>
  );
};