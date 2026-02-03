
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Task, TaskSubmission, Withdrawal, Settings, UserStatus, PremiumRequest, Notification, JobWithdrawal, IncomeLog, SupportTicket } from './types';

interface StoreContextType {
  currentUser: User | null;
  users: User[];
  tasks: Task[];
  submissions: TaskSubmission[];
  withdrawals: Withdrawal[];
  jobWithdrawals: JobWithdrawal[];
  incomeLogs: IncomeLog[];
  premiumRequests: PremiumRequest[];
  notifications: Notification[];
  tickets: SupportTicket[];
  settings: Settings;
  unreadCount: number;
  
  login: (phone: string, pass: string) => Promise<boolean>;
  register: (data: any) => Promise<boolean>;
  logout: () => void;
  updateUser: (user: User) => void;
  deleteUser: (userId: string) => void;
  submitTask: (submission: TaskSubmission) => void;
  requestWithdraw: (withdrawal: Withdrawal) => void;
  submitJobWithdraw: (jw: JobWithdrawal) => void;
  requestPremium: (req: PremiumRequest) => void;
  markNotificationsRead: () => void;
  addLog: (log: IncomeLog) => void;
  submitTicket: (t: SupportTicket) => void;
  
  approvePremium: (id: string) => void;
  rejectPremium: (id: string) => void;
  addTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  approveTask: (id: string) => void;
  rejectTask: (id: string) => void;
  approveWithdraw: (id: string) => void;
  rejectWithdraw: (id: string) => void;

  isAdmin: boolean;
  adminLogin: (phone: string, pass: string) => boolean;
  updateSettings: (s: Settings) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const INITIAL_SETTINGS: Settings = {
  companyName: "UdyanIT",
  noticeText: "আমাদের প্লাটফর্মে আপনাকে স্বাগতম! নিয়মিত কাজ করুন এবং রেফার করে ইনকাম বাড়ান।",
  landingDescription: "বিশ্বস্ত ইনকাম সোর্স, ১০০% পেমেন্ট গ্যারান্টি।",
  youtubeLink: "https://youtube.com",
  facebookGroupLink: "https://facebook.com",
  telegramLink: "https://t.me",
  supportLink: "https://wa.me/017XXXXXXXX",
  premiumFee: 500,
  premiumDescription: "প্রিমিয়াম মেম্বার হয়ে আনলিমিটেড ইনকাম করুন।",
  founderName: "Admin",
  companyLogo: "https://files.catbox.moe/oq7gs8.jpg",
  privacyLink: "#",
  appDownloadLink: "#",
  supportConfig: {
    freeWhatsappGroupLink: "#",
    freeTelegramChannelLink: "#",
    freeTelegramGroupLink: "#",
    premiumSupportGroupLink: "#",
    premiumAdminWhatsapp: "017XXXXXXXX",
    whatsappSupportLink: "https://wa.me/017XXXXXXXX",
    supportDescription: "support"
  },
  videoSessions: [],
  tutorialVideos: {
    workVideo: "",
    gmailVideo: "",
    withdrawVideo: ""
  },
  paymentNumbers: {
    bkash: "017XXXXXXXX",
    nagad: "017XXXXXXXX",
    rocket: "017XXXXXXXX"
  },
  sliderImages: [
      "https://files.catbox.moe/v7r386.jpg",
      "https://files.catbox.moe/p99cwy.jpg"
  ],
  socialSellConfig: {
    gmailRate: 5,
    fbRate: 15,
    instaRate: 10,
    tiktokRate: 10,
    isGmailOn: true,
    isFbOn: true,
    isInstaOn: true,
    isTiktokOn: true
  },
  planLimits: {
    freeAllowWithdraw: true,
    freeMaxWithdraw: 500,
    freeGmailLimit: 5,
    freeWalletMinWithdraw: 50,
    premiumMaxWithdraw: 10000,
    freeWithdrawFrequency: 2,
    isFreeWithdrawEnabled: true,
    isMainWithdrawEnabled: true,
    freeDailyTaskLimit: 5,
    premiumDailyTaskLimit: 20,
    isFreeTasksEnabled: true,
    isPremiumTasksEnabled: true
  },
  referralConfig: {
    enabled: true,
    signupBonus: 10,
    quizRate: 1,
    level1Bonus: 50,
    quizAdLinks: ["https://google.com"],
    quizTimer: 30
  },
  withdrawRules: {
    MAIN: { minWithdraw: 100, feePercent: 2, enabled: true },
    FREE: { minWithdraw: 50, feePercent: 0, enabled: true },
  },
  messages: {
    premiumPopup: "প্রিমিয়াম করুন",
    withdrawMessage: "উত্তোলন সফল",
    freeJobInfo: "ফ্রি কাজ",
    premiumBenefits: ["বেশি ইনকাম", "দ্রুত পেমেন্ট"]
  },
  jobWithdrawMethods: [],
  customPages: [],
  tools: []
};

// Fixed DEFAULT_ADMIN to match User interface in types.ts
const DEFAULT_ADMIN: User = {
    id: 'admin-main',
    name: 'Admin Boss',
    whatsapp: '01772209016',
    email: 'admin@app.com',
    password: 'admin',
    referralCode: '123456',
    referrerId: '',
    status: 'ACTIVE',
    accountType: 'PREMIUM',
    balanceFree: 0,
    balanceMain: 0,
    pendingReferralBonus: 0,
    joiningDate: '2024-01-01',
    isAdminAccess: true
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('app_users');
    const parsed = saved ? JSON.parse(saved) : [];
    // Ensure admin user exists for 123456 referral
    if (!parsed.find((u: User) => u.referralCode === '123456')) {
        return [DEFAULT_ADMIN, ...parsed];
    }
    return parsed;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('app_currentUser');
    return saved ? JSON.parse(saved) : null;
  });

  const [isAdmin, setIsAdmin] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]); 
  const [submissions, setSubmissions] = useState<TaskSubmission[]>([]);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [jobWithdrawals, setJobWithdrawals] = useState<JobWithdrawal[]>([]);
  const [incomeLogs, setIncomeLogs] = useState<IncomeLog[]>([]);
  const [premiumRequests, setPremiumRequests] = useState<PremiumRequest[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [settings, setSettings] = useState<Settings>(INITIAL_SETTINGS);

  useEffect(() => {
    localStorage.setItem('app_users', JSON.stringify(users));
  }, [users]);

  const login = async (phone: string, pass: string) => {
    const user = users.find(u => u.whatsapp === phone && u.password === pass);
    if (user && user.status !== 'BLOCKED') {
      setCurrentUser(user);
      localStorage.setItem('app_currentUser', JSON.stringify(user));
      return true;
    }
    return false;
  };

  const adminLogin = (phone: string, pass: string) => {
    if (phone === "01772209016" && pass === "123456") {
      setIsAdmin(true);
      return true;
    }
    return false;
  };

  const register = async (data: any) => {
    if (users.find(u => u.whatsapp === data.phone)) {
        alert("Phone already registered!");
        return false;
    }
    const upline = users.find(u => u.referralCode === data.refCode);
    if (!upline) {
        alert("Invalid Referral Code! Use 123456 as default.");
        return false;
    }

    // Updated newUser to match User interface
    const newUser: User = {
      id: Date.now().toString(),
      name: data.name,
      whatsapp: data.phone,
      email: data.email,
      password: data.password,
      balanceFree: settings.referralConfig.signupBonus,
      balanceMain: 0,
      status: 'ACTIVE', 
      accountType: 'FREE',
      joiningDate: new Date().toISOString().split('T')[0],
      pendingReferralBonus: 0,
      referralCode: Math.floor(100000 + Math.random() * 900000).toString(),
      referrerId: upline.id
    };

    setUsers(prev => prev.map(u => 
        u.id === upline.id ? { ...u, pendingReferralBonus: (u.pendingReferralBonus || 0) + 2 } : u
    ).concat(newUser));
    
    setCurrentUser(newUser);
    localStorage.setItem('app_currentUser', JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAdmin(false);
    localStorage.removeItem('app_currentUser');
  };

  const updateUser = (updatedUser: User) => {
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    if (currentUser?.id === updatedUser.id) {
      setCurrentUser(updatedUser);
      localStorage.setItem('app_currentUser', JSON.stringify(updatedUser));
    }
  };

  const submitTask = (sub: TaskSubmission) => setSubmissions(prev => [sub, ...prev]);
  const requestWithdraw = (w: Withdrawal) => setWithdrawals(prev => [w, ...prev]);
  const submitJobWithdraw = (jw: JobWithdrawal) => setJobWithdrawals(prev => [jw, ...prev]);
  const requestPremium = (req: PremiumRequest) => setPremiumRequests(prev => [req, ...prev]);
  const addLog = (log: IncomeLog) => setIncomeLogs(prev => [log, ...prev]);
  const submitTicket = (t: SupportTicket) => setTickets(prev => [t, ...prev]);

  const approvePremium = (id: string) => {
    const req = premiumRequests.find(r => r.id === id);
    if (!req) return;
    setPremiumRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'APPROVED' } : r));
    const user = users.find(u => u.id === req.userId);
    if (user) {
      updateUser({ ...user, accountType: 'PREMIUM' });
    }
  };

  const rejectPremium = (id: string) => {
    setPremiumRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'REJECTED' } : r));
  };

  const addTask = (task: Task) => setTasks(prev => [task, ...prev]);
  const deleteTask = (id: string) => setTasks(prev => prev.filter(t => t.id !== id));

  const approveTask = (id: string) => {
    const sub = submissions.find(s => s.id === id);
    if (!sub) return;
    setSubmissions(prev => prev.map(s => s.id === id ? { ...s, status: 'APPROVED' } : s));
    const user = users.find(u => u.id === sub.userId);
    if (user) {
      updateUser({ 
        ...user, 
        balanceFree: user.balanceFree + sub.amount
      });
      addLog({
        id: Date.now().toString(),
        userId: user.id,
        amount: sub.amount,
        source: `Task Approved: ${sub.taskTitle || 'Bounty'}`,
        date: new Date().toISOString(),
        type: 'INCOME'
      });
    }
  };

  const rejectTask = (id: string) => {
    setSubmissions(prev => prev.map(s => s.id === id ? { ...s, status: 'REJECTED' } : s));
  };

  const approveWithdraw = (id: string) => {
    setWithdrawals(prev => prev.map(w => w.id === id ? { ...w, status: 'APPROVED' } : w));
  };

  const rejectWithdraw = (id: string) => {
    const w = withdrawals.find(withdraw => withdraw.id === id);
    if (!w) return;
    setWithdrawals(prev => prev.map(withdraw => withdraw.id === id ? { ...withdraw, status: 'REJECTED' } : withdraw));
    const user = users.find(u => u.id === w.userId);
    if (user) {
      if (w.walletType === 'FREE') updateUser({ ...user, balanceFree: user.balanceFree + w.amount });
      else if (w.walletType === 'MAIN') updateUser({ ...user, balanceMain: user.balanceMain + w.amount });
    }
  };

  const markNotificationsRead = () => setNotifications(prev => prev.map(n => ({...n, readBy: [...n.readBy, currentUser?.id || '']})));
  const unreadCount = notifications.filter(n => !n.readBy.includes(currentUser?.id || '')).length;

  return (
    <StoreContext.Provider value={{
      currentUser, users, tasks, submissions, withdrawals, jobWithdrawals, incomeLogs, premiumRequests, notifications, tickets, settings, isAdmin, unreadCount,
      login, register, logout, updateUser, deleteUser: (id) => setUsers(prev => prev.filter(u => u.id !== id)),
      submitTask, requestWithdraw, submitJobWithdraw, requestPremium, addLog, submitTicket,
      approvePremium, rejectPremium, addTask, deleteTask, approveTask, rejectTask, approveWithdraw, rejectWithdraw,
      markNotificationsRead, adminLogin, updateSettings: setSettings
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used within StoreProvider");
  return context;
};
