

export type AccountType = 'FREE' | 'PREMIUM';
export type UserStatus = 'ACTIVE' | 'BLOCKED';
export type TaskStatus = 'PENDING' | 'WAITING_RECOVERY' | 'SUBMITTED' | 'APPROVED' | 'REJECTED' | 'REQUESTED' | 'DETAILS_PROVIDED' | 'CREATED_BY_USER' | 'RECOVERY_PROVIDED' | 'SUBMITTED_FINAL';

export type WalletType = 'MAIN' | 'FREE'; 

export interface User {
  id: string;
  name: string;
  whatsapp: string;
  email: string;
  password: string;
  referralCode: string;
  referrerId?: string;
  accountType: AccountType;
  joiningDate: string;
  status: UserStatus;
  isAdminAccess?: boolean; 
  
  // Wallets
  balanceMain: number; // Premium Income
  balanceFree: number; // Free Income
  
  // Holding/Pending
  pendingReferralBonus: number; 
  pendingPremiumQuizzes?: number; // New: For Premium Quiz
  
  // Deprecated
  balanceJob?: number; 
  balanceRegBonus?: number; 
  balancePremRef?: number; 
  balanceReferral?: number; 

  profileImage?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  image: string;
  amount: number;
  totalSlots: number;
  filledSlots: number;
  type: 'FREE' | 'PAID';
  link?: string;
  videoUrl?: string;
}

export interface TaskSubmission {
  id: string;
  userId: string;
  taskId: string;
  taskTitle: string;
  proofText: string;
  screenshotLink: string;
  status: TaskStatus;
  submittedAt: string;
  amount: number; 
}

export interface SocialSell {
  id: string;
  type: 'GMAIL' | 'FACEBOOK' | 'INSTAGRAM' | 'TIKTOK';
  userId: string;
  userName: string;
  accountIdentifier: string; 
  password?: string;
  uid?: string;
  twoFactorCode?: string;
  rate: number;
  status: TaskStatus;
  date: string;
}

export interface GmailOrder {
  id: string;
  userId: string;
  userName: string;
  status: TaskStatus;
  requestDate: string;
  userMessage?: string;
  adminProvidedEmail?: string;
  adminProvidedPassword?: string;
  recoveryEmail?: string;
}

export interface JobWithdrawMethod {
  id: string;
  title: string; 
  walletLabel: string; 
  minAmount: number;
  instruction?: string;
  isActive?: boolean;
}

export interface JobWithdrawRequest {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  walletNumber: string; 
  jobMethodId: string; 
  jobMethodName: string; 
  amountCoins: string; // New: User inputs coin/dollar amount
  screenshotLink: string;
  status: TaskStatus;
  date: string;
}

export interface WithdrawRequest {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  walletType: WalletType;
  fee: number;
  finalAmount: number;
  status: TaskStatus;
  requestDate: string;
  paymentMethod: string;
  paymentNumber: string;
}

export interface PremiumRequest {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  transactionId: string;
  method: string;
  paymentFromNumber: string; 
  status: TaskStatus;
  date: string;
}

export interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  subject: string;
  message: string;
  adminReply?: string;
  status: 'OPEN' | 'CLOSED';
  createdAt: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  image?: string;
  link?: string;
  linkName?: string;
  type: 'TEXT' | 'IMAGE_TEXT' | 'IMAGE_LINK' | 'LINK_TEXT'; 
  targetUserId?: string;
  date: string;
  readBy: string[];
}

export interface VideoFolder {
  id: string;
  name: string; 
  description?: string;
  videos: {
    id: string;
    title: string;
    url: string;
    duration?: string;
    description?: string; // Added description
  }[];
}

export interface CustomPage {
  id: string;
  buttonName: string;
  iconUrl: string;
  htmlContent: string; 
}

export interface Tool {
  id: string;
  name: string;
  iconUrl: string;
  link: string;
}

export interface AppSettings {
  companyName: string;
  companyLogo: string;
  founderName: string; 

  landingDescription: string;
  noticeText: string;
  privacyLink: string;
  appDownloadLink: string;
  
  supportConfig: {
    freeWhatsappGroupLink: string;
    freeTelegramChannelLink: string;
    freeTelegramGroupLink: string;
    premiumSupportGroupLink: string; 
    premiumAdminWhatsapp: string;    
    whatsappSupportLink: string; 
    supportDescription: string;
  };

  facebookGroupLink: string; 
  telegramLink: string; 
  supportLink: string; 
  youtubeLink: string;
  
  videoSessions: VideoFolder[];

  tutorialVideos: {
    workVideo: string;
    gmailVideo: string;
    withdrawVideo: string;
  };

  premiumFee: number;
  premiumDescription: string;
  isPremiumActive?: boolean;

  paymentNumbers: {
    bkash: string;
    nagad: string;
    rocket: string;
  };
  sliderImages: string[];
  
  socialSellConfig: {
    gmailRate: number;
    fbRate: number;
    instaRate: number;
    tiktokRate: number; 
    isGmailOn: boolean;
    isFbOn: boolean;
    isInstaOn: boolean;
    isTiktokOn: boolean; 
  };

  planLimits: {
    freeAllowWithdraw: boolean; 
    freeMaxWithdraw: number; 
    freeGmailLimit: number; 
    freeWalletMinWithdraw: number; 
    // NEW FIELDS
    premiumMaxWithdraw: number;
    freeWithdrawFrequency: number; // How many times a free user can withdraw
    isFreeWithdrawEnabled: boolean;
    isMainWithdrawEnabled: boolean;
    
    freeDailyTaskLimit?: number;
    premiumDailyTaskLimit?: number;

    isFreeTasksEnabled?: boolean;
    isPremiumTasksEnabled?: boolean;
  };
  
  referralConfig: {
    enabled: boolean;
    signupBonus: number; 
    quizRate: number; 
    level1Bonus: number; 
    quizAdLinks: string[]; // Unlimited links array
    quizTimer?: number;
    level1Percent?: number;
    level2Percent?: number;
    level3Percent?: number;
  };

  // New Configs
  launchConfig: {
      launchDate: string; // ISO String for countdown
      htmlContent: string; // HTML Description
      actionLink: string; // Link to redirect after time up
  };

  premiumQuizConfig: {
      rate: number;
      quizzesPerRef: number; // 5
      adLinks: string[];
      timer: number;
  };
  
  withdrawRules: {
    MAIN: { minWithdraw: number; feePercent: number; enabled: boolean };
    FREE: { minWithdraw: number; feePercent: number; enabled: boolean };
  };

  messages: {
    premiumPopup: string;
    withdrawMessage: string;
    freeJobInfo: string;
    premiumBenefits: string[];
  };
  
  jobWithdrawMethods: JobWithdrawMethod[]; 
  customPages: CustomPage[]; 
  tools: Tool[]; 
}

/**
 * Missing types required by store.tsx
 */

export type Withdrawal = WithdrawRequest;
export type Settings = AppSettings;
export type JobWithdrawal = JobWithdrawRequest;

export interface IncomeLog {
  id: string;
  userId: string;
  amount: number;
  source: string;
  date: string;
  type: 'INCOME' | 'EXPENSE';
}
