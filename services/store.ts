
import { User, Task, TaskSubmission, WithdrawRequest, AppSettings, PremiumRequest, SupportTicket, Notification, SocialSell, JobWithdrawRequest, VideoFolder, GmailOrder, CustomPage, Tool } from '../types';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ikbjjhlbvqhzjrktdxgt.supabase.co';
const SUPABASE_KEY = 'sb_publishable_Zh3Wu8UyN6hBc5McYUoztQ_JaEHJpEt'; 

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const INITIAL_SETTINGS: AppSettings = {
  companyName: "UdyanIT.com",
  companyLogo: "https://files.catbox.moe/oq7gs8.jpg",
  founderName: "Md. Limon",
  landingDescription: "Welcome to UdyanIT.com, the most trusted platform for digital earnings.",
  noticeText: "Welcome to UdyanIT.com. Work carefully and earn money. We provide 100% payment guarantee.",
  privacyLink: "#",
  appDownloadLink: "https://play.google.com/store/apps", 
  supportConfig: {
    freeWhatsappGroupLink: "https://chat.whatsapp.com/free",
    freeTelegramChannelLink: "https://t.me/udyanit",
    freeTelegramGroupLink: "https://t.me/udyan_chat",
    premiumSupportGroupLink: "https://t.me/udyan_premium_group",
    premiumAdminWhatsapp: "0145875542",
    whatsappSupportLink: "https://wa.me/880145875542",
    supportDescription: "আমাদের প্ল্যাটফর্মে কাজ করার জন্য আপনাকে স্বাগতম।"
  },
  supportLink: "https://wa.me/880145875542", 
  facebookGroupLink: "https://facebook.com/groups/udyanit",
  telegramLink: "https://t.me/udyanit",
  youtubeLink: "https://youtube.com",
  videoSessions: [],
  tutorialVideos: {
    workVideo: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    gmailVideo: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    withdrawVideo: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
  },
  premiumFee: 500,
  premiumDescription: "Upgrade to Premium to unlock unlimited earnings.",
  paymentNumbers: { bkash: "0145875542", nagad: "0145875542", rocket: "0145875542" },
  sliderImages: ["https://picsum.photos/800/400?random=1", "https://picsum.photos/800/400?random=2"],
  socialSellConfig: {
    gmailRate: 5, fbRate: 10, instaRate: 8, tiktokRate: 8,
    isGmailOn: true, isFbOn: true, isInstaOn: true, isTiktokOn: true
  },
  planLimits: {
    freeAllowWithdraw: true, freeMaxWithdraw: 500, freeGmailLimit: 5, freeWalletMinWithdraw: 50,
    premiumMaxWithdraw: 10000, freeWithdrawFrequency: 2, isFreeWithdrawEnabled: true, isMainWithdrawEnabled: true,
    freeDailyTaskLimit: 20,
    premiumDailyTaskLimit: 100
  },
  referralConfig: {
    enabled: true, signupBonus: 2, quizRate: 1, level1Bonus: 100, quizAdLinks: ["https://google.com"], quizTimer: 30
  },
  withdrawRules: {
    MAIN: { minWithdraw: 100, feePercent: 2, enabled: true },
    FREE: { minWithdraw: 50, feePercent: 0, enabled: true },
  },
  messages: {
    premiumPopup: "Buy Premium!", withdrawMessage: "Withdraw Success.", freeJobInfo: "Free Info.", premiumBenefits: ["Lifetime Access", "Higher Rates", "Instant Withdraw"]
  },
  jobWithdrawMethods: [],
  customPages: [],
  tools: []
};

class LocalStore {
  users: User[] = [];
  tasks: Task[] = [];
  submissions: TaskSubmission[] = [];
  withdrawals: WithdrawRequest[] = [];
  socialSells: SocialSell[] = [];
  gmailOrders: GmailOrder[] = [];
  jobWithdrawRequests: JobWithdrawRequest[] = [];
  premiumRequests: PremiumRequest[] = [];
  supportTickets: SupportTicket[] = [];
  notifications: Notification[] = [];
  settings: AppSettings = INITIAL_SETTINGS;
  currentUser: User | null = null;
  
  private listeners: Function[] = [];
  private STORAGE_KEY = 'udyanit_db_v4';

  constructor() {
    this.loadLocal();
    this.initSupabase();
  }

  private async initSupabase() {
      try {
          const { data: usersData } = await supabase.from('users').select('*');
          if (usersData) {
              this.users = usersData;
              this.seedAdmin();
              const sessionUser = localStorage.getItem('udyan_session_user');
              if (sessionUser) {
                  const exists = this.users.find(u => u.id === sessionUser);
                  if (exists) this.currentUser = exists;
              }
          }

          const { data: settingsData } = await supabase.from('app_settings').select('*').limit(1);
          if (settingsData && settingsData.length > 0) this.settings = { ...INITIAL_SETTINGS, ...settingsData[0] };

          this.saveLocal();
          this.notifyListeners();
      } catch (error) {
          console.error("Supabase Init Error:", error);
      }
  }

  private async seedAdmin() {
      // আপনার নতুন এডমিন তথ্য
      const adminPhone = '0145875542';
      const adminPass = '855#@#@Gfewghu';
      
      const adminUser = {
        id: 'admin-101',
        name: 'Super Admin',
        whatsapp: adminPhone,
        email: 'admin@udyanit.com',
        password: adminPass,
        referralCode: '123456',
        accountType: 'PREMIUM',
        status: 'ACTIVE',
        isAdminAccess: true,
        balanceMain: 99999,
        balanceFree: 99999,
        joiningDate: new Date().toISOString()
      };

      const existingIdx = this.users.findIndex(u => u.whatsapp === adminPhone);
      if (existingIdx === -1) {
          this.users.push(adminUser as any);
          await supabase.from('users').upsert(adminUser);
      } else {
          // পাসওয়ার্ড আপডেট করা যদি নাম্বার ঠিক থাকে
          if(this.users[existingIdx].password !== adminPass) {
              this.users[existingIdx].password = adminPass;
              this.users[existingIdx].isAdminAccess = true;
              await supabase.from('users').update({ password: adminPass, isAdminAccess: true }).eq('whatsapp', adminPhone);
          }
      }
  }

  private saveLocal() {
    const data = { users: this.users, settings: this.settings };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  }

  public save() { this.saveLocal(); this.notifyListeners(); }

  private loadLocal() {
    const dataStr = localStorage.getItem(this.STORAGE_KEY);
    if (dataStr) {
      const data = JSON.parse(dataStr);
      this.users = data.users || [];
      // Deep merge settings to prevent undefined errors when new fields are added to INITIAL_SETTINGS
      this.settings = { 
          ...INITIAL_SETTINGS, 
          ...data.settings,
          referralConfig: { ...INITIAL_SETTINGS.referralConfig, ...(data.settings?.referralConfig || {}) },
          planLimits: { ...INITIAL_SETTINGS.planLimits, ...(data.settings?.planLimits || {}) },
          socialSellConfig: { ...INITIAL_SETTINGS.socialSellConfig, ...(data.settings?.socialSellConfig || {}) },
          supportConfig: { ...INITIAL_SETTINGS.supportConfig, ...(data.settings?.supportConfig || {}) }
      };
    }
  }

  subscribe(callback: Function) {
    this.listeners.push(callback);
    callback();
    return () => { this.listeners = this.listeners.filter(l => l !== callback); };
  }

  notifyListeners() { this.listeners.forEach(cb => cb()); }

  async login(phone: string, pass: string): Promise<boolean> {
    const user = this.users.find(u => u.whatsapp === phone && u.password === pass);
    if (user) {
      if (user.status === 'BLOCKED') throw new Error("Account Blocked");
      this.currentUser = user;
      localStorage.setItem('udyan_session_user', user.id);
      this.notifyListeners();
      return true;
    }
    return false;
  }

  async adminLogin(phone: string, pass: string): Promise<boolean> {
      // নতুন এডমিন লগইন চেক
      if (phone === '0145875542' && pass === '855#@#@Gfewghu') {
          const admin = this.users.find(u => u.whatsapp === phone);
          if (admin) {
              this.currentUser = admin;
              localStorage.setItem('udyan_session_user', admin.id);
              this.notifyListeners();
              return true;
          }
      }
      return false;
  }

  async register(data: Partial<User>): Promise<User> {
    if (this.users.find(u => u.whatsapp === data.whatsapp)) throw new Error("Phone number already registered.");
    
    let referrerId: string | undefined = undefined;
    if (data.referralCode !== '123456') {
        const referrer = this.users.find(u => u.referralCode === data.referralCode);
        if (!referrer) throw new Error("Invalid Referral Code!");
        referrerId = referrer.id;
    }

    const id = Math.floor(100000 + Math.random() * 900000).toString();
    const newUser: any = {
      id, 
      name: data.name!, 
      whatsapp: data.whatsapp!, 
      email: data.email!, 
      password: data.password!,
      referralCode: Math.floor(100000 + Math.random() * 900000).toString(),
      referrerId: referrerId, 
      accountType: 'FREE', 
      joiningDate: new Date().toISOString(),
      status: 'ACTIVE', 
      isAdminAccess: false, 
      balanceMain: 0, 
      balanceFree: 5,
      pendingReferralBonus: 0, 
      profileImage: `https://ui-avatars.com/api/?name=${data.name}&background=random`
    };

    const { error } = await supabase.from('users').insert(newUser);
    if(error) {
        console.error("Supabase Register Error:", error);
        throw new Error(error.message);
    }

    this.users.push(newUser);
    this.currentUser = newUser;
    localStorage.setItem('udyan_session_user', newUser.id);
    this.saveLocal();
    this.notifyListeners();
    return newUser;
  }

  logout() { this.currentUser = null; localStorage.removeItem('udyan_session_user'); this.notifyListeners(); }
  getReferrer(code: string) { if (code === '123456') return { name: 'Official Admin' } as User; return this.users.find(u => u.referralCode === code); }
  getUpline(userId: string) { const user = this.users.find(u => u.id === userId); if (!user || !user.referrerId) return undefined; return this.users.find(u => u.id === user.referrerId); }
  getDownline(userId: string) { return this.users.filter(u => u.referrerId === userId); }
  getUnreadNotificationsCount(userId: string) { return this.notifications.filter(n => !n.readBy.includes(userId)).length; }
  async updateUser(user: User) { const idx = this.users.findIndex(u => u.id === user.id); if(idx >= 0) { this.users[idx] = user; if(this.currentUser?.id === user.id) this.currentUser = user; this.saveLocal(); await supabase.from('users').update(user).eq('id', user.id); } }
  async updateSettings(newSettings: AppSettings) { this.settings = newSettings; this.saveLocal(); await supabase.from('app_settings').upsert({ id: 1, ...newSettings }); }
  async addTask(task: Task) { this.tasks.push(task); this.saveLocal(); await supabase.from('tasks').insert(task); }
  async deleteTask(id: string) { this.tasks = this.tasks.filter(t => t.id !== id); this.saveLocal(); await supabase.from('tasks').delete().eq('id', id); }
  async submitTask(submission: TaskSubmission) { this.submissions.push(submission); this.saveLocal(); await supabase.from('submissions').insert(submission); }
  async updateSubmission(id: string, data: Partial<TaskSubmission>) { const idx = this.submissions.findIndex(s => s.id === id); if(idx >= 0) { this.submissions[idx] = { ...this.submissions[idx], ...data }; this.saveLocal(); await supabase.from('submissions').update(data).eq('id', id); } }
  async requestWithdraw(req: WithdrawRequest) { this.withdrawals.push(req); this.saveLocal(); await supabase.from('withdrawals').insert(req); }
  async updateWithdrawal(id: string, status: string) { const idx = this.withdrawals.findIndex(w => w.id === id); if(idx >= 0) { this.withdrawals[idx].status = status as any; this.saveLocal(); await supabase.from('withdrawals').update({ status }).eq('id', id); } }
  async addSocialSell(sell: SocialSell) { this.socialSells.push(sell); this.saveLocal(); await supabase.from('social_sells').insert(sell); }
  async updateSocialSell(id: string, status: string) { const idx = this.socialSells.findIndex(s => s.id === id); if(idx >= 0) { this.socialSells[idx].status = status as any; this.saveLocal(); await supabase.from('social_sells').update({ status }).eq('id', id); } }
  async addPremiumRequest(req: PremiumRequest) { this.premiumRequests.push(req); this.saveLocal(); await supabase.from('premium_requests').insert(req); }
  async updatePremiumRequest(id: string, status: string) { const idx = this.premiumRequests.findIndex(r => r.id === id); if(idx >= 0) { this.premiumRequests[idx].status = status as any; this.saveLocal(); await supabase.from('premium_requests').update({ status }).eq('id', id); } }
  async addJobWithdraw(req: JobWithdrawRequest) { this.jobWithdrawRequests.push(req); this.saveLocal(); await supabase.from('job_withdraw_requests').insert(req); }
  async updateJobWithdraw(id: string, status: string) { const idx = this.jobWithdrawRequests.findIndex(r => r.id === id); if(idx >= 0) { this.jobWithdrawRequests[idx].status = status as any; this.saveLocal(); await supabase.from('job_withdraw_requests').update({ status }).eq('id', id); } }
  async addTicket(ticket: SupportTicket) { this.supportTickets.push(ticket); this.saveLocal(); await supabase.from('support_tickets').insert(ticket); }
  async updateTicket(id: string, data: Partial<SupportTicket>) { const idx = this.supportTickets.findIndex(t => t.id === id); if(idx >= 0) { this.supportTickets[idx] = { ...this.supportTickets[idx], ...data }; this.saveLocal(); this.notifyListeners(); await supabase.from('support_tickets').update(data).eq('id', id); } }
}

export const store = new LocalStore();
