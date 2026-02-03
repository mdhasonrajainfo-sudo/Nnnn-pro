
import React, { ReactNode } from 'react';
import { Menu, X, Home, User, Settings, LogOut, DollarSign, Facebook, PlayCircle, Shield, Briefcase, Wallet, Bell, Headset, History, Wrench } from 'lucide-react';
import { store } from '../services/store';
import { Logo } from './Logo';

interface LayoutProps {
  children: ReactNode;
  onMenuClick?: () => void;
  title?: string;
  showMenuIcon?: boolean;
}

export const MobileHeader: React.FC<LayoutProps> = ({ children, onMenuClick, showMenuIcon = true }) => {
  return (
    <div className="sticky top-0 z-50 bg-white shadow-sm px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {showMenuIcon && (
          <button onClick={onMenuClick} className="text-gray-700 hover:bg-gray-100 p-2 rounded-lg transition">
            <Menu size={24} />
          </button>
        )}
        <Logo size="small" />
      </div>
      {children}
    </div>
  );
};

export const Sidebar: React.FC<{ isOpen: boolean; onClose: () => void; onNavigate: (view: string) => void; user?: any }> = ({ isOpen, onClose, onNavigate, user }) => {
  if (!isOpen) return null;

  const handleLink = (url: string) => {
    window.open(url, '_blank');
    onClose();
  };

  const unreadCount = user ? store.getUnreadNotificationsCount(user.id) : 0;

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, color: 'text-gray-700' },
    { id: 'all-history', label: 'Income & Cashout History', icon: History, color: 'text-gray-700' }, 
    { id: 'tools', label: 'Tools', icon: Wrench, color: 'text-indigo-600' }, // Added Tools
    { id: 'notifications', label: 'Notifications', icon: Bell, color: 'text-gray-700', badge: unreadCount }, 
    { id: 'wallet', label: 'Wallet', icon: Wallet, color: 'text-gray-700' },
    { id: 'withdraw-form', label: 'Withdraw', icon: DollarSign, color: 'text-gray-700' }, 
    { id: 'job-withdraw', label: 'Job Withdraw', icon: Briefcase, color: 'text-gray-700' }, 
    { id: 'video-sessions', label: 'Work Video', icon: PlayCircle, color: 'text-gray-700' },
    { id: 'facebook', label: 'Facebook Group', icon: Facebook, action: () => handleLink(store.settings.facebookGroupLink), color: 'text-blue-600' },
    { id: 'privacy', label: 'Policy', icon: Shield, color: 'text-gray-700' },
    { id: 'profile', label: 'My Profile', icon: User, color: 'text-gray-700' },
    { id: 'support', label: 'Support', icon: Headset, color: 'text-gray-700' },
  ];

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-[60]" onClick={onClose} />
      <div className="fixed top-0 left-0 h-full w-[280px] bg-white z-[70] shadow-2xl flex flex-col transition-transform animate-in slide-in-from-left duration-300">
        <div className="p-6 bg-gradient-to-br from-emerald-600 to-emerald-800 text-white rounded-br-[30px]">
          <div className="flex items-center gap-3 mb-4">
             <img 
               src={user?.profileImage || "https://ui-avatars.com/api/?name=User&background=random"} 
               className="w-14 h-14 rounded-full border-2 border-white object-cover bg-gray-200"
               alt="Profile"
             />
             <div>
               <h3 className="font-bold text-lg">{user?.name || "Guest"}</h3>
               <p className="text-xs opacity-80">ID: {user?.id || "N/A"}</p>
             </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2 no-scrollbar">
          {menuItems.map((item, idx) => (
            <button 
              key={idx}
              onClick={() => { if (item.action) item.action(); else onNavigate(item.id); onClose(); }} 
              className={`w-full flex items-center justify-between p-3 rounded-lg hover:bg-emerald-50 font-medium transition ${item.color}`}
            >
              <div className="flex items-center gap-3">
                 <item.icon size={20} /> {item.label}
              </div>
              {item.badge && item.badge > 0 ? (
                 <span className="bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">{item.badge}</span>
              ) : null}
            </button>
          ))}
          
          <div className="h-px bg-gray-100 my-2" />
          
          <button onClick={() => { onNavigate('logout'); onClose(); }} className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-red-50 text-red-600 font-medium transition">
            <LogOut size={20} /> Logout
          </button>
        </div>
      </div>
    </>
  );
};
