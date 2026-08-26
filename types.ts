export interface Journal {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  issn: string;
  eissn?: string;
  scopusIndexed?: boolean;
  indexing?: string[];
  category?: string;
  subject?: string;
  aimsAndScope?: string;
}

export interface Issue {
  id: string;
  journalId: string;
  volume: number;
  number: number;
  year: number;
  month?: string;
  title?: string;
  published: boolean;
  coverImage?: string;
}

export interface Author {
  id: string;
  firstName: string;
  lastName: string;
  affiliation: string;
  email: string;
  name?: string;
}

export type ArticleStatus = 
  | 'Draft' 
  | 'Submitted' 
  | 'Under Editorial Review' 
  | 'Reviewer Assigned' 
  | 'In Peer Review' 
  | 'In Review'
  | 'Revision Requested' 
  | 'Minor Revision' 
  | 'Major Revision' 
  | 'Accepted' 
  | 'Rejected' 
  | 'Copyediting' 
  | 'Typesetting' 
  | 'Proofing' 
  | 'Paid'
  | 'Published';

export interface Article {
  id: string;
  issueId?: string;
  journalId: string; // Denormalized for easier access
  title: string;
  abstract: string;
  authors: Author[];
  pageStart?: number;
  pageEnd?: number;
  pdfUrl?: string;
  doi?: string;
  keywords: string[];
  views: number;
  downloads: number;
  citations?: number;
  status: ArticleStatus;
  submissionDate?: string;
  volume?: number | string;
  issue?: number | string;
  
  // Extended academic publishing flow fields
  lastUpdatedDate?: string;
  correspondingAuthor?: string;
  reviewProgress?: number; // 0 to 100
  editorAssignment?: string; // id, name or email of editor
  reviewerAssignment?: string; // id, name or email of reviewer
  manuscriptFile?: { name: string; size: number };
  supplementaryFiles?: { name: string; size: number; url?: string }[];
  comments?: { author: string; text: string; date: string; stage: string }[];
}

export interface User {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  email: string;
  role: 'admin' | 'editor' | 'reviewer' | 'author' | 'reader';
  affiliation?: string;
  institution?: string;
  department?: string;
  country?: string;
  orcidId?: string;
  orcid?: string;
  website?: string;
  bio?: string;
  avatarUrl?: string;
  avatar?: string;
  isVerified?: boolean;
  isActive?: boolean;
  paymentMethods?: {
    type: 'card' | 'paypal';
    lastFour?: string;
    email?: string;
  }[];
  notifications?: {
    reviewUpdates: boolean;
    manuscriptStatusChanges: boolean;
    citationAlerts: boolean;
    newsletter: boolean;
    marketing: boolean;
  };
}

export interface AdminAccessRequest {
  id: string;
  fullName: string;
  email: string;
  institution: string;
  department?: string;
  requestedRole: 'admin' | 'editor' | 'reviewer' | 'finance_admin';
  orcidId?: string;
  justification: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  adminNotes?: string;
}

export type PaymentGatewayType = 
  | 'stripe' 
  | 'paypal' 
  | 'paystack' 
  | 'flutterwave' 
  | 'crypto' 
  | 'bank_transfer'
  | string;

export interface PaymentGatewayConfig {
  id: PaymentGatewayType;
  name: string;
  enabled: boolean;
  mode: 'test' | 'live' | 'sandbox' | 'mainnet' | 'testnet';
  iconName: string;
  description: string;
  credentials: {
    // Stripe
    publicKey?: string;
    secretKey?: string;
    webhookSecret?: string;
    // PayPal
    clientId?: string;
    clientSecret?: string;
    payerId?: string;
    // Paystack
    paystackPublicKey?: string;
    paystackSecretKey?: string;
    merchantEmail?: string;
    // Flutterwave
    flwPublicKey?: string;
    flwSecretKey?: string;
    flwEncryptionKey?: string;
    // Crypto
    btcAddress?: string;
    ethAddress?: string;
    usdtTrc20Address?: string;
    solAddress?: string;
    rpcApiKey?: string;
    // Bank Account
    bankName?: string;
    accountName?: string;
    accountNumber?: string;
    swiftCode?: string;
    branchCode?: string;
    iban?: string;
    wireInstructions?: string;
    // Custom Gateway
    apiEndpoint?: string;
    merchantId?: string;
    customNotes?: string;
    [key: string]: any;
  };
  supportedCurrencies: string[];
  isCustom?: boolean;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  authorName: string;
  authorEmail: string;
  institution?: string;
  articleId?: string;
  articleTitle?: string;
  journalTitle?: string;
  feeType: 'Article Processing Charge (APC)' | 'Fast-Track Peer Review' | 'Editing/Proofreading Fee' | 'Open Access License' | 'Color & Print Publication' | 'Institutional Membership';
  amount: number;
  currency: 'USD' | 'EUR' | 'GBP' | 'NGN' | 'GHS' | 'KES' | 'CAD';
  issueDate: string;
  dueDate: string;
  paymentGatewayUsed?: PaymentGatewayType;
  status: 'Paid' | 'Pending' | 'Overdue' | 'Cancelled' | 'Refunded';
  transactionReference?: string;
  paidAt?: string;
  remindersSentCount: number;
  lastReminderSentAt?: string;
  notes?: string;
}

export interface PaymentReminder {
  id: string;
  invoiceId: string;
  invoiceNumber: string;
  recipientEmail: string;
  recipientName: string;
  amount: number;
  currency: string;
  sentAt: string;
  channel: 'email' | 'system_notification';
  status: 'delivered' | 'failed';
  customNote?: string;
}

export interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  content?: string;
  date: string;
  category: string;
  image: string;
  featured?: boolean;
}

export interface JournalEditor {
  id: string;
  journalId: string;
  name: string;
  email: string;
  affiliation: string;
  role: string;
  photoUrl?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export type VisitorActivityAction = 
  | 'PAGE_VIEW'
  | 'ARTICLE_VIEW'
  | 'JOURNAL_VIEW'
  | 'SEARCH'
  | 'DOWNLOAD_PDF'
  | 'CONSENT_UPDATE'
  | 'USER_AUTH'
  | 'COPY_CITATION'
  | 'SUBMISSION_START'
  | 'FEEDBACK_SUBMIT';

export interface VisitorActivity {
  id: string;
  visitorId: string;
  sessionId: string;
  actionType: VisitorActivityAction;
  pagePath: string;
  pageTitle: string;
  details?: Record<string, any>;
  device: 'desktop' | 'mobile' | 'tablet';
  browser: string;
  os?: string;
  ip?: string;
  country?: string;
  region?: string;
  referrer?: string;
  consentCategory?: 'essential' | 'analytics' | 'functional' | 'marketing';
  timestamp: string;
}

export interface CookieCategoryPreferences {
  essential: boolean; // Always true
  analytics: boolean;
  functional: boolean;
  marketing: boolean;
}

export interface CookieConsentRecord {
  id: string;
  visitorId: string;
  sessionId: string;
  acceptedAll: boolean;
  essential: boolean;
  analytics: boolean;
  functional: boolean;
  marketing: boolean;
  timestamp: string;
  userAgent?: string;
  ip?: string;
  country?: string;
  version: string;
}

export interface CookieSettings {
  policyVersion: string;
  essentialLocked: boolean;
  analyticsDefault: boolean;
  functionalDefault: boolean;
  marketingDefault: boolean;
  expirationDays: number;
  bannerTitle: string;
  bannerDescription: string;
  privacyPolicyLink: string;
  cookiePolicyLink: string;
  updatedAt?: string;
}

export interface VisitorAnalyticsSummary {
  totalVisitors: number;
  activeVisitorsLast30m: number;
  totalPageViews: number;
  totalArticleViews: number;
  totalPdfDownloads: number;
  totalSearches: number;
  consentOptInRate: number; // percentage
  totalConsentsRecorded: number;
  consentBreakdown: {
    allAccepted: number;
    essentialOnly: number;
    analyticsAccepted: number;
    functionalAccepted: number;
    marketingAccepted: number;
  };
  topJournals: { journalId: string; title: string; views: number }[];
  topArticles: { articleId: string; title: string; views: number; downloads: number }[];
  topSearchQueries: { query: string; count: number }[];
  deviceDistribution: { device: string; count: number; percentage: number }[];
  browserDistribution: { browser: string; count: number; percentage: number }[];
  countryDistribution: { country: string; count: number; percentage: number }[];
  activityTimeline: { date: string; pageViews: number; articleViews: number; downloads: number; searches: number }[];
}

export type LiveChatStatus = 'waiting' | 'active' | 'resolved' | 'closed';

export interface LiveChatMessage {
  id: string;
  chatId: string;
  sender: 'visitor' | 'admin' | 'bot';
  senderName: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface LiveChatSession {
  id: string;
  visitorName: string;
  visitorEmail?: string;
  visitorPhone?: string;
  initialDescription?: string;
  status: LiveChatStatus;
  unreadByAdmin: number;
  unreadByVisitor: number;
  lastMessage: string;
  lastMessageSender: 'visitor' | 'admin' | 'bot';
  lastMessageAt: string;
  createdAt: string;
  assignedAdminEmail?: string;
  assignedAdminName?: string;
  pageUrl?: string;
  pageTitle?: string;
  ip?: string;
  device?: string;
  browser?: string;
  country?: string;
  messages?: LiveChatMessage[];
  notes?: string;
}

export interface LiveChatAnalyticsSummary {
  totalChats: number;
  activeChats: number;
  waitingChats: number;
  resolvedChats: number;
  totalMessagesSent: number;
  adminOnlineCount: number;
  avgResponseTimeSeconds: number;
}

export type SubscriberStatus = 'Active' | 'Unsubscribed' | 'Pending' | 'Bounced';
export type NewsletterFrequency = 'Weekly' | 'Monthly' | 'Breaking Alerts' | 'Quarterly';

export interface NewsletterSubscriber {
  id: string;
  email: string;
  name?: string;
  institution?: string;
  country?: string;
  status: SubscriberStatus;
  frequency: NewsletterFrequency;
  topics: string[];
  subscribedAt: string;
  updatedAt?: string;
  source?: string;
  notes?: string;
  lastEmailSentAt?: string;
  unsubscribeToken?: string;
}

export interface NewsletterCampaign {
  id: string;
  subject: string;
  previewText?: string;
  content: string;
  targetTopics: string[];
  targetFrequency?: string;
  status: 'Draft' | 'Sent' | 'Scheduled';
  sentAt?: string;
  recipientCount?: number;
  openRate?: number;
  clickRate?: number;
  createdAt: string;
  createdBy?: string;
}

export interface NewsletterAnalyticsSummary {
  totalSubscribers: number;
  activeSubscribers: number;
  unsubscribedCount: number;
  pendingCount: number;
  growthRatePercent: number;
  newThisMonth: number;
  topicBreakdown: { topic: string; count: number; percentage: number }[];
  frequencyBreakdown: { frequency: string; count: number; percentage: number }[];
  sourceBreakdown: { source: string; count: number; percentage: number }[];
  recentSubscribers: NewsletterSubscriber[];
  totalCampaignsSent: number;
}

export interface AuthCredentials {
  email: string;
  password?: string;
  rememberMe?: boolean;
}

export interface SignUpData {
  email: string;
  password?: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  affiliation?: string;
  department?: string;
  country?: string;
  orcidId?: string;
  bio?: string;
}

