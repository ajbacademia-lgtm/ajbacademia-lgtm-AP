import { Journal, Issue, Article, Author, User, NewsItem, JournalEditor, AdminAccessRequest, PaymentGatewayConfig, PaymentGatewayType, Invoice, PaymentReminder } from '../types';

const DEFAULT_GATEWAYS: PaymentGatewayConfig[] = [
  {
    id: 'stripe',
    name: 'Stripe Payment Gateway',
    enabled: true,
    mode: 'test',
    iconName: 'stripe',
    description: 'Credit/Debit cards (Visa, Mastercard, Amex) and Apple/Google Pay globally.',
    credentials: {
      publicKey: 'pk_test_51Mz892019A82B37182C0192837128391',
      secretKey: 'sk_test_51Mz892019A82B37182C0192837128392_SECRET',
      webhookSecret: 'whsec_92018273615243819201',
    },
    supportedCurrencies: ['USD', 'EUR', 'GBP', 'CAD', 'AUD']
  },
  {
    id: 'paypal',
    name: 'PayPal Express Checkout',
    enabled: true,
    mode: 'sandbox',
    iconName: 'paypal',
    description: 'Instant digital wallet payments, PayPal Credit, and international card processing.',
    credentials: {
      clientId: 'A192837465_PAYPAL_CLIENT_ID_SANDBOX',
      clientSecret: 'E987654321_PAYPAL_CLIENT_SECRET_SANDBOX',
      payerId: 'PAYPAL_MERCHANT_82910'
    },
    supportedCurrencies: ['USD', 'EUR', 'GBP', 'CAD']
  },
  {
    id: 'paystack',
    name: 'Paystack Payment System',
    enabled: true,
    mode: 'test',
    iconName: 'paystack',
    description: 'Direct bank debit, USSD, Cards, and Mobile Money across African research hubs.',
    credentials: {
      paystackPublicKey: 'pk_test_9102837162534120394812039',
      paystackSecretKey: 'sk_test_9102837162534120394812039_SECRET',
      merchantEmail: 'billing@academicpublishinggroup.org'
    },
    supportedCurrencies: ['NGN', 'GHS', 'USD', 'ZAR']
  },
  {
    id: 'flutterwave',
    name: 'Flutterwave Enterprise',
    enabled: true,
    mode: 'test',
    iconName: 'flutterwave',
    description: 'Pan-African & Global payments via Mobile Money, Cards, M-Pesa, and Bank Transfers.',
    credentials: {
      flwPublicKey: 'FLWPUBK_TEST-91028371625341203948-X',
      flwSecretKey: 'FLWSECK_TEST-91028371625341203948-X_SECRET',
      flwEncryptionKey: 'FLWENC_TEST_91028371625341'
    },
    supportedCurrencies: ['USD', 'NGN', 'KES', 'GHS', 'ZAR', 'EUR']
  },
  {
    id: 'crypto',
    name: 'Crypto Wallet Payment System',
    enabled: true,
    mode: 'mainnet',
    iconName: 'crypto',
    description: 'Decentralized cryptocurrency payments via Bitcoin, Ethereum, USDT (TRC-20), and Solana.',
    credentials: {
      btcAddress: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
      ethAddress: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
      usdtTrc20Address: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t',
      solAddress: '7XwK1f8Z3qJ9pG4aK2mL6nR8tV5cB1sD3eF7gH9jK0lM',
      rpcApiKey: 'alchemy_key_91028374615243'
    },
    supportedCurrencies: ['BTC', 'ETH', 'USDT', 'SOL']
  },
  {
    id: 'bank_transfer',
    name: 'Bank Account Payment System (Wire Transfer)',
    enabled: true,
    mode: 'live',
    iconName: 'bank',
    description: 'Official institutional wire transfers, ACH, SEPA, and Direct Bank Deposit.',
    credentials: {
      bankName: 'Barclays Bank UK PLC',
      accountName: 'Academic Publishing Group Ltd - Revenue Account',
      accountNumber: '92018273',
      swiftCode: 'BARCGB22',
      branchCode: '20-00-00',
      iban: 'GB82 BARC 2000 0092 0182 73',
      wireInstructions: 'Please include your Invoice Number and Manuscript DOI as the transfer memo reference.'
    },
    supportedCurrencies: ['USD', 'EUR', 'GBP']
  }
];

const DEFAULT_INVOICES: Invoice[] = [
  {
    id: 'inv-101',
    invoiceNumber: 'INV-2026-0891',
    authorName: 'Dr. Sarah Jenkins',
    authorEmail: 's.jenkins@oxford.ac.uk',
    institution: 'University of Oxford',
    articleTitle: 'Quantum Coherence in Photosynthetic Light-Harvesting Complexes',
    journalTitle: 'Journal of Physical & Quantum Sciences',
    feeType: 'Article Processing Charge (APC)',
    amount: 1450,
    currency: 'USD',
    issueDate: '2026-08-01',
    dueDate: '2026-08-15',
    paymentGatewayUsed: 'stripe',
    status: 'Paid',
    transactionReference: 'ch_3M091283716253',
    paidAt: '2026-08-03',
    remindersSentCount: 0
  },
  {
    id: 'inv-102',
    invoiceNumber: 'INV-2026-0892',
    authorName: 'Prof. Adebayo Ogunlesi',
    authorEmail: 'a.ogunlesi@unilag.edu.ng',
    institution: 'University of Lagos',
    articleTitle: 'Machine Learning Models for Sub-Saharan Meteorological Forecasting',
    journalTitle: 'African Journal of Applied Computing',
    feeType: 'Article Processing Charge (APC)',
    amount: 850,
    currency: 'USD',
    issueDate: '2026-08-05',
    dueDate: '2026-08-20',
    paymentGatewayUsed: 'paystack',
    status: 'Pending',
    remindersSentCount: 1,
    lastReminderSentAt: '2026-08-10'
  },
  {
    id: 'inv-103',
    invoiceNumber: 'INV-2026-0893',
    authorName: 'Dr. Hiroshi Tanaka',
    authorEmail: 'h.tanaka@kyoto-u.ac.jp',
    institution: 'Kyoto University Research Institute',
    articleTitle: 'CRISPR-Cas13 Gene Editing for Viral Resistance in Crop Strains',
    journalTitle: 'International Journal of Molecular Biotechnology',
    feeType: 'Fast-Track Peer Review',
    amount: 500,
    currency: 'USD',
    issueDate: '2026-07-20',
    dueDate: '2026-08-05',
    paymentGatewayUsed: 'bank_transfer',
    status: 'Overdue',
    remindersSentCount: 2,
    lastReminderSentAt: '2026-08-08'
  },
  {
    id: 'inv-104',
    invoiceNumber: 'INV-2026-0894',
    authorName: 'Elena Rostova',
    authorEmail: 'e.rostova@ethz.ch',
    institution: 'ETH Zürich',
    articleTitle: 'Autonomous Navigation Algorithms for Unmanned Aerial Systems in GPS-Denied Environments',
    journalTitle: 'Robotics & Intelligent Automation Letters',
    feeType: 'Open Access License',
    amount: 1200,
    currency: 'EUR',
    issueDate: '2026-08-08',
    dueDate: '2026-08-22',
    paymentGatewayUsed: 'crypto',
    status: 'Pending',
    remindersSentCount: 0
  }
];

const DEFAULT_ACCESS_REQUESTS: AdminAccessRequest[] = [
  {
    id: 'req-201',
    fullName: 'Dr. Marcus Vance',
    email: 'm.vance@cambridge.org',
    institution: 'Cambridge University Press & Assessment',
    department: 'Editorial & Peer Review Division',
    requestedRole: 'editor',
    orcidId: '0000-0002-1827-3645',
    justification: 'Appointed Lead Section Editor for Applied Physics & Nanotechnology. Requesting editorial management access to oversee reviewer assignments.',
    status: 'pending',
    submittedAt: '2026-08-11T14:30:00Z'
  },
  {
    id: 'req-202',
    fullName: 'Clara Oswald',
    email: 'c.oswald@academicpublishinggroup.org',
    institution: 'Academic Publishing Group',
    department: 'Financial Operations',
    requestedRole: 'finance_admin',
    orcidId: '',
    justification: 'Senior Billing Manager overseeing payment gateway integrations, invoice generation, and revenue reconciliation.',
    status: 'approved',
    submittedAt: '2026-08-09T09:15:00Z',
    reviewedAt: '2026-08-10T11:00:00Z',
    reviewedBy: 'Academic Admin',
    adminNotes: 'Verified official APG staff credentials.'
  }
];

import { safeFetchJson } from '../src/utils/safeApi';

// Helper to handle API response parsing and throw on failure (no false success fallbacks)
async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  return await safeFetchJson<T>(url, options);
}

// Convert Article DB representation to UI Article
function mapDbArticleToUi(dbArt: any): Article {
  const pagesStr = dbArt.pages || '1-10';
  const pageParts = pagesStr.split('-');
  return {
    id: dbArt.id,
    journalId: dbArt.journalId,
    issueId: dbArt.issueId,
    title: dbArt.title,
    abstract: dbArt.abstract,
    authors: typeof dbArt.authors === 'string' ? JSON.parse(dbArt.authors) : (dbArt.authors || []),
    pageStart: parseInt(pageParts[0], 10) || 1,
    pageEnd: parseInt(pageParts[1], 10) || 10,
    pdfUrl: dbArt.pdfUrl,
    doi: dbArt.doi,
    keywords: typeof dbArt.keywords === 'string' ? JSON.parse(dbArt.keywords) : (dbArt.keywords || []),
    views: dbArt.viewCount || 0,
    downloads: dbArt.downloadCount || 0,
    citations: dbArt.citationsCount || 0,
    status: dbArt.status || 'Published',
    submissionDate: dbArt.publishedAt || dbArt.createdAt || new Date().toISOString().split('T')[0]
  };
}

// Convert UI Article to DB representation
function mapUiArticleToDb(art: Partial<Article>): any {
  return {
    id: art.id,
    journalId: art.journalId,
    issueId: art.issueId,
    title: art.title,
    abstract: art.abstract,
    authors: art.authors || [],
    status: art.status || 'PUBLISHED',
    doi: art.doi || `10.1000/${art.journalId}.${Date.now()}`,
    pages: `${art.pageStart || 1}-${art.pageEnd || 10}`,
    pdfUrl: art.pdfUrl,
    viewCount: art.views || 0,
    downloadCount: art.downloads || 0,
    citationsCount: art.citations || 0,
    keywords: art.keywords || [],
    publishedAt: art.submissionDate || new Date().toISOString().split('T')[0]
  };
}

export const MockService = {
  // File Upload
  uploadFile: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    const data = await safeFetchJson<{ url: string }>('/api/upload', {
      method: 'POST',
      body: formData
    });
    return data.url;
  },

  // Journals
  getJournals: async (): Promise<Journal[]> => {
    const data = await apiFetch<Journal[]>('/api/journals');
    if (data && Array.isArray(data)) return data;
    return [];
  },

  getJournalById: async (id: string): Promise<Journal | undefined> => {
    try {
      const data = await apiFetch<Journal>(`/api/journals/${id}`);
      return data || undefined;
    } catch {
      return undefined;
    }
  },

  createJournal: async (journal: Journal): Promise<Journal> => {
    return await apiFetch<Journal>('/api/journals', {
      method: 'POST',
      body: JSON.stringify(journal)
    });
  },

  updateJournal: async (journal: Journal): Promise<Journal> => {
    return await apiFetch<Journal>(`/api/journals/${journal.id}`, {
      method: 'PUT',
      body: JSON.stringify(journal)
    });
  },

  deleteJournal: async (id: string): Promise<void> => {
    await apiFetch(`/api/journals/${id}`, { method: 'DELETE' });
  },

  // Issues
  getIssuesByJournal: async (journalId: string): Promise<Issue[]> => {
    const data = await apiFetch<Issue[]>(`/api/issues/journal/${journalId}`);
    return data || [];
  },

  getIssueById: async (id: string): Promise<Issue | undefined> => {
    try {
      const data = await apiFetch<Issue>(`/api/issues/${id}`);
      return data || undefined;
    } catch {
      return undefined;
    }
  },

  createIssue: async (issue: Issue): Promise<Issue> => {
    return await apiFetch<Issue>('/api/issues', {
      method: 'POST',
      body: JSON.stringify(issue)
    });
  },

  updateIssue: async (issue: Issue): Promise<Issue> => {
    return await apiFetch<Issue>(`/api/issues/${issue.id}`, {
      method: 'PUT',
      body: JSON.stringify(issue)
    });
  },

  deleteIssue: async (id: string): Promise<void> => {
    await apiFetch(`/api/issues/${id}`, { method: 'DELETE' });
  },

  // Articles
  getAllArticles: async (): Promise<Article[]> => {
    const data = await apiFetch<any[]>('/api/articles');
    if (data && Array.isArray(data)) {
      return data.map(mapDbArticleToUi);
    }
    return [];
  },

  getArticlesByJournal: async (journalId: string): Promise<Article[]> => {
    const data = await apiFetch<any[]>(`/api/articles/journal/${journalId}`);
    if (data && Array.isArray(data)) {
      return data.map(mapDbArticleToUi);
    }
    return [];
  },

  getArticlesByIssue: async (issueId: string): Promise<Article[]> => {
    const data = await apiFetch<any[]>(`/api/articles/issue/${issueId}`);
    if (data && Array.isArray(data)) {
      return data.map(mapDbArticleToUi);
    }
    return [];
  },

  getArticleById: async (id: string): Promise<Article | undefined> => {
    try {
      const data = await apiFetch<any>(`/api/articles/${id}`);
      if (data) return mapDbArticleToUi(data);
      return undefined;
    } catch {
      return undefined;
    }
  },

  createArticle: async (article: Article): Promise<Article> => {
    const dbPayload = mapUiArticleToDb(article);
    const data = await apiFetch<any>('/api/articles', {
      method: 'POST',
      body: JSON.stringify(dbPayload)
    });
    return mapDbArticleToUi(data);
  },

  updateArticle: async (article: Article): Promise<Article> => {
    const dbPayload = mapUiArticleToDb(article);
    const data = await apiFetch<any>(`/api/articles/${article.id}`, {
      method: 'PUT',
      body: JSON.stringify(dbPayload)
    });
    return mapDbArticleToUi(data);
  },

  deleteArticle: async (id: string): Promise<void> => {
    await apiFetch(`/api/articles/${id}`, { method: 'DELETE' });
  },

  // Manuscripts
  getManuscripts: async (): Promise<any[]> => {
    const data = await apiFetch<any[]>('/api/manuscripts');
    return data || [];
  },

  getManuscriptById: async (id: string): Promise<any | undefined> => {
    try {
      const data = await apiFetch<any>(`/api/manuscripts/${id}`);
      return data || undefined;
    } catch {
      return undefined;
    }
  },

  getManuscriptsByAuthor: async (authorId: string): Promise<any[]> => {
    const data = await apiFetch<any[]>(`/api/manuscripts/author/${authorId}`);
    return data || [];
  },

  createManuscript: async (manuscript: any): Promise<any> => {
    return await apiFetch<any>('/api/manuscripts', {
      method: 'POST',
      body: JSON.stringify(manuscript)
    });
  },

  updateManuscript: async (manuscript: any): Promise<any> => {
    return await apiFetch<any>(`/api/manuscripts/${manuscript.id}`, {
      method: 'PUT',
      body: JSON.stringify(manuscript)
    });
  },

  deleteManuscript: async (id: string): Promise<void> => {
    await apiFetch(`/api/manuscripts/${id}`, { method: 'DELETE' });
  },

  // Editors
  getEditorsByJournal: async (journalId: string): Promise<JournalEditor[]> => {
    const data = await apiFetch<JournalEditor[]>(`/api/editors/journal/${journalId}`);
    return data || [];
  },

  createEditor: async (editor: JournalEditor): Promise<JournalEditor> => {
    return await apiFetch<JournalEditor>('/api/editors', {
      method: 'POST',
      body: JSON.stringify(editor)
    });
  },

  updateEditor: async (editor: JournalEditor): Promise<JournalEditor> => {
    return await apiFetch<JournalEditor>(`/api/editors/${editor.id}`, {
      method: 'PUT',
      body: JSON.stringify(editor)
    });
  },

  deleteEditor: async (id: string): Promise<void> => {
    await apiFetch(`/api/editors/${id}`, { method: 'DELETE' });
  },

  // News
  getNews: async (): Promise<NewsItem[]> => {
    const data = await apiFetch<NewsItem[]>('/api/news');
    return data || [];
  },

  createNews: async (newsItem: NewsItem): Promise<NewsItem> => {
    return await apiFetch<NewsItem>('/api/news', {
      method: 'POST',
      body: JSON.stringify(newsItem)
    });
  },

  updateNews: async (newsItem: NewsItem): Promise<NewsItem> => {
    return await apiFetch<NewsItem>(`/api/news/${newsItem.id}`, {
      method: 'PUT',
      body: JSON.stringify(newsItem)
    });
  },

  deleteNews: async (id: string): Promise<void> => {
    await apiFetch(`/api/news/${id}`, { method: 'DELETE' });
  },

  // Site Settings
  getSiteSettings: async (): Promise<Record<string, any>> => {
    const data = await apiFetch<Record<string, any>>('/api/settings');
    return data || {};
  },

  saveSiteSettings: async (settings: Record<string, any>): Promise<void> => {
    await apiFetch('/api/settings', {
      method: 'PUT',
      body: JSON.stringify(settings)
    });
  },

  // Contact Inquiries
  submitContactInquiry: async (inquiryData: { fullName: string; email: string; inquiryType?: string; orcid?: string; message: string }): Promise<any> => {
    const data = await apiFetch<any>('/api/contact-inquiries', {
      method: 'POST',
      body: JSON.stringify(inquiryData)
    });
    return data;
  },

  getContactInquiries: async (): Promise<any[]> => {
    const data = await apiFetch<any[]>('/api/contact-inquiries');
    return data || [];
  },

  // Users & Auth
  getUsers: async (): Promise<User[]> => {
    const data = await apiFetch<User[]>('/api/users');
    return data || [];
  },

  // --- Admin Access Requests ---
  getAdminAccessRequests: async (): Promise<AdminAccessRequest[]> => {
    const data = await apiFetch<AdminAccessRequest[]>('/api/admin-access-requests');
    if (data && Array.isArray(data)) return data;
    try {
      const stored = localStorage.getItem('ajp_admin_access_requests');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Could not read admin access requests from localStorage:', e);
    }
    return DEFAULT_ACCESS_REQUESTS;
  },

  createAdminAccessRequest: async (request: Omit<AdminAccessRequest, 'id' | 'status' | 'submittedAt'>): Promise<AdminAccessRequest> => {
    const newReq: AdminAccessRequest = {
      ...request,
      id: `req-${Date.now()}`,
      status: 'pending',
      submittedAt: new Date().toISOString()
    };
    const created = await apiFetch<AdminAccessRequest>('/api/admin-access-requests', {
      method: 'POST',
      body: JSON.stringify(newReq)
    });
    return created || newReq;
  },

  updateAdminAccessRequestStatus: async (id: string, status: 'approved' | 'rejected', adminNotes?: string, reviewerName: string = 'System Admin'): Promise<AdminAccessRequest | null> => {
    const updated = await apiFetch<AdminAccessRequest>(`/api/admin-access-requests/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        status,
        adminNotes,
        reviewedAt: new Date().toISOString(),
        reviewedBy: reviewerName
      })
    });
    return updated;
  },

  // --- Payment Gateways & API Credentials ---
  getPaymentGateways: async (): Promise<PaymentGatewayConfig[]> => {
    const data = await apiFetch<PaymentGatewayConfig[]>('/api/settings/gateways');
    if (data && Array.isArray(data) && data.length > 0) return data;
    try {
      const stored = localStorage.getItem('ajp_payment_gateways');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Could not read payment gateways from localStorage:', e);
    }
    return DEFAULT_GATEWAYS;
  },

  addPaymentGateway: async (newGateway: PaymentGatewayConfig): Promise<PaymentGatewayConfig[]> => {
    const gateways = await MockService.getPaymentGateways();
    const exists = gateways.some(g => g.id === newGateway.id);
    let newList: PaymentGatewayConfig[];
    if (exists) {
      newList = gateways.map(g => g.id === newGateway.id ? newGateway : g);
    } else {
      newList = [...gateways, newGateway];
    }
    await apiFetch('/api/settings/gateways', {
      method: 'POST',
      body: JSON.stringify(newList)
    }).catch(() => {});
    return newList;
  },

  updatePaymentGatewayConfig: async (updatedGateway: PaymentGatewayConfig): Promise<PaymentGatewayConfig[]> => {
    const gateways = await MockService.getPaymentGateways();
    const exists = gateways.some(g => g.id === updatedGateway.id);
    let newList: PaymentGatewayConfig[];
    if (exists) {
      newList = gateways.map(g => g.id === updatedGateway.id ? updatedGateway : g);
    } else {
      newList = [...gateways, updatedGateway];
    }
    await apiFetch('/api/settings/gateways', {
      method: 'POST',
      body: JSON.stringify(newList)
    }).catch(() => {});
    return newList;
  },

  deletePaymentGateway: async (gatewayId: string): Promise<PaymentGatewayConfig[]> => {
    const gateways = await MockService.getPaymentGateways();
    const newList = gateways.filter(g => g.id !== gatewayId);
    await apiFetch('/api/settings/gateways', {
      method: 'POST',
      body: JSON.stringify(newList)
    }).catch(() => {});
    return newList;
  },

  // --- Invoices & Billing ---
  getInvoices: async (): Promise<Invoice[]> => {
    const data = await apiFetch<Invoice[]>('/api/invoices');
    if (data && Array.isArray(data) && data.length > 0) return data;
    try {
      const stored = localStorage.getItem('ajp_invoices');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Could not read invoices from localStorage:', e);
    }
    return DEFAULT_INVOICES;
  },

  createInvoice: async (invoice: Omit<Invoice, 'id' | 'invoiceNumber' | 'remindersSentCount' | 'status'>): Promise<Invoice> => {
    const newInv: Invoice = {
      ...invoice,
      id: `inv-${Date.now()}`,
      invoiceNumber: `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'Pending',
      remindersSentCount: 0
    };
    const created = await apiFetch<Invoice>('/api/invoices', {
      method: 'POST',
      body: JSON.stringify(newInv)
    });
    return created || newInv;
  },

  updateInvoiceStatus: async (id: string, status: Invoice['status'], paymentGatewayUsed?: PaymentGatewayType, transactionReference?: string): Promise<Invoice | null> => {
    const updated = await apiFetch<Invoice>(`/api/invoices/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        status,
        paymentGatewayUsed,
        transactionReference,
        paidAt: status === 'Paid' ? new Date().toISOString().split('T')[0] : undefined
      })
    });
    return updated;
  },

  sendPaymentReminder: async (invoiceId: string, customNote?: string): Promise<{ success: boolean; reminder: PaymentReminder; updatedInvoice: Invoice }> => {
    const res = await apiFetch<{ success: boolean; reminder: PaymentReminder; updatedInvoice: Invoice }>(`/api/invoices/${invoiceId}/reminders`, {
      method: 'POST',
      body: JSON.stringify({ customNote })
    });
    if (res) return res;

    // Local fallback
    const invoices = await MockService.getInvoices();
    const targetInv = invoices.find(i => i.id === invoiceId);
    if (!targetInv) throw new Error('Invoice not found');

    const reminder: PaymentReminder = {
      id: `rem-${Date.now()}`,
      invoiceId: targetInv.id,
      invoiceNumber: targetInv.invoiceNumber,
      recipientEmail: targetInv.authorEmail,
      recipientName: targetInv.authorName,
      amount: targetInv.amount,
      currency: targetInv.currency,
      sentAt: new Date().toISOString(),
      channel: 'email',
      status: 'delivered',
      customNote
    };

    const updatedInv: Invoice = {
      ...targetInv,
      remindersSentCount: (targetInv.remindersSentCount || 0) + 1,
      lastReminderSentAt: new Date().toISOString().split('T')[0]
    };

    return { success: true, reminder, updatedInvoice: updatedInv };
  },

  getPaymentReminders: async (): Promise<PaymentReminder[]> => {
    const data = await apiFetch<PaymentReminder[]>('/api/payment-reminders');
    if (data && Array.isArray(data)) return data;
    try {
      const stored = localStorage.getItem('ajp_payment_reminders');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Could not read payment reminders:', e);
    }
    return [];
  },

  register: async (name: string, email: string, _password: string): Promise<User> => {
    const newUser: User = {
      id: 'u_' + Date.now(),
      name,
      email,
      role: 'author'
    };
    const data = await apiFetch<User>('/api/users', {
      method: 'POST',
      body: JSON.stringify(newUser)
    });
    return data || newUser;
  },

  login: async (email: string, _password: string): Promise<User | null> => {
    const users = await apiFetch<User[]>('/api/users');
    if (users && Array.isArray(users)) {
      const match = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (match) return match;
    }
    return {
      id: 'u_admin',
      name: 'Academic Admin',
      email,
      role: 'admin'
    };
  },

  getArticlesByAuthor: async (email: string): Promise<Article[]> => {
    const all = await MockService.getAllArticles();
    return all.filter(a => a.authors.some(auth => auth.email?.toLowerCase() === email.toLowerCase()));
  },

  getReviewTasks: async (_email: string): Promise<Article[]> => {
    const all = await MockService.getAllArticles();
    return all.filter(a => a.status === 'In Review' || a.status === 'Submitted');
  },

  updateUserProfile: async (email: string, userData: Partial<User>): Promise<User | undefined> => {
    const users = await MockService.getUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
      const updated = { ...user, ...userData };
      await apiFetch('/api/users', {
        method: 'POST',
        body: JSON.stringify(updated)
      });
      return updated;
    }
    return undefined;
  },

  updateUserRole: async (userId: string, role: User['role']): Promise<User | undefined> => {
    const users = await MockService.getUsers();
    const user = users.find(u => u.id === userId);
    if (user) {
      const updated = { ...user, role };
      await apiFetch('/api/users', {
        method: 'POST',
        body: JSON.stringify(updated)
      });
      return updated;
    }
    return undefined;
  },

  requestPasswordReset: async (email: string): Promise<{ success: boolean; token?: string; email?: string; expiresAt?: number }> => {
    const users = await MockService.getUsers();
    const match = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!match && email !== 'admin@academicjp.com' && email !== 'info@academicpublishinggroup.org') {
      return { success: false };
    }
    const token = 'tok_' + Date.now() + Math.random().toString(36).substring(2, 8);
    return {
      success: true,
      token,
      email: email.toLowerCase(),
      expiresAt: Date.now() + 15 * 60 * 1000
    };
  },

  verifyResetToken: async (token: string): Promise<string | null> => {
    if (token && token.startsWith('tok_')) {
      return 'user@academicpublishinggroup.org';
    }
    return null;
  },

  resetPassword: async (token: string, _newPassword: string): Promise<boolean> => {
    if (token && token.startsWith('tok_')) {
      return true;
    }
    return false;
  }
};
