import { VisitorActivity, VisitorActivityAction, CookieCategoryPreferences } from '../../types';

const VISITOR_ID_KEY = '_ajp_uid';
const SESSION_ID_KEY = '_ajp_sid';
const CONSENT_STORAGE_KEY = '_ajp_cookie_consent';

// Helper to read cookie by name
function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

// Helper to write cookie
function setCookie(name: string, value: string, days = 365) {
  if (typeof document === 'undefined') return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

// Get or initialize persistent visitor ID
export function getVisitorId(): string {
  if (typeof window === 'undefined') return 'anon_server';
  
  // Try cookie first
  let visitorId = getCookie(VISITOR_ID_KEY);
  if (!visitorId) {
    // Try localStorage
    try {
      visitorId = localStorage.getItem(VISITOR_ID_KEY);
    } catch {
      // ignore
    }
  }

  if (!visitorId) {
    visitorId = `vis_${Math.random().toString(36).substring(2, 9)}_${Date.now().toString(36)}`;
    try {
      localStorage.setItem(VISITOR_ID_KEY, visitorId);
    } catch {
      // ignore
    }
    setCookie(VISITOR_ID_KEY, visitorId, 365);
  }

  return visitorId;
}

// Get or initialize session ID
export function getSessionId(): string {
  if (typeof window === 'undefined') return 'sess_server';
  
  let sessionId = getCookie(SESSION_ID_KEY);
  if (!sessionId) {
    try {
      sessionId = sessionStorage.getItem(SESSION_ID_KEY);
    } catch {
      // ignore
    }
  }

  if (!sessionId) {
    sessionId = `sess_${Math.random().toString(36).substring(2, 8)}_${Date.now().toString(36)}`;
    try {
      sessionStorage.setItem(SESSION_ID_KEY, sessionId);
    } catch {
      // ignore
    }
    setCookie(SESSION_ID_KEY, sessionId, 1); // 1 day
  }

  return sessionId;
}

// Detect client device type
export function getDeviceType(): 'desktop' | 'mobile' | 'tablet' {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return 'desktop';
  const ua = navigator.userAgent.toLowerCase();
  if (/ipad|tablet|(android(?!.*mobile))/i.test(ua)) return 'tablet';
  if (/mobile|iphone|ipod|blackberry|opera mini|iemobile/i.test(ua)) return 'mobile';
  return 'desktop';
}

// Detect browser
export function getBrowserName(): string {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return 'Chrome';
  const ua = navigator.userAgent;
  if (ua.includes('Firefox/')) return 'Firefox';
  if (ua.includes('Edg/')) return 'Edge';
  if (ua.includes('Chrome/') && !ua.includes('Edg/')) return 'Chrome';
  if (ua.includes('Safari/') && !ua.includes('Chrome/')) return 'Safari';
  if (ua.includes('OPR/') || ua.includes('Opera/')) return 'Opera';
  return 'Other Browser';
}

// Detect OS
export function getOSName(): string {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return 'Unknown OS';
  const ua = navigator.userAgent;
  if (ua.includes('Mac OS X')) return 'macOS';
  if (ua.includes('Windows')) return 'Windows';
  if (ua.includes('Android')) return 'Android';
  if (ua.includes('iPhone') || ua.includes('iPad')) return 'iOS';
  if (ua.includes('Linux')) return 'Linux';
  return 'Unknown OS';
}

// Check if user has consented to analytics
export function hasAnalyticsConsent(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    const raw = localStorage.getItem(CONSENT_STORAGE_KEY) || getCookie(CONSENT_STORAGE_KEY);
    if (!raw) return true; // Default to true before explicit choice, or essential only
    const parsed = JSON.parse(raw);
    return parsed.analytics !== false;
  } catch {
    return true;
  }
}

/**
 * Send an event payload to the visitor tracking backend
 */
export async function sendVisitorActivity(
  actionType: VisitorActivityAction,
  options: {
    pagePath?: string;
    pageTitle?: string;
    details?: Record<string, any>;
    consentCategory?: 'essential' | 'analytics' | 'functional' | 'marketing';
  } = {}
): Promise<void> {
  // If user explicitly opted out of analytics and event is analytics category, skip non-essential tracking
  if (options.consentCategory === 'analytics' && !hasAnalyticsConsent()) {
    return;
  }

  const payload: Partial<VisitorActivity> = {
    visitorId: getVisitorId(),
    sessionId: getSessionId(),
    actionType,
    pagePath: options.pagePath || (typeof window !== 'undefined' ? window.location.pathname + window.location.search : '/'),
    pageTitle: options.pageTitle || (typeof document !== 'undefined' ? document.title : 'Academic Publishing Platform'),
    details: options.details || {},
    device: getDeviceType(),
    browser: getBrowserName(),
    os: getOSName(),
    referrer: typeof document !== 'undefined' ? document.referrer : '',
    consentCategory: options.consentCategory || 'analytics',
    timestamp: new Date().toISOString()
  };

  try {
    await fetch('/api/visitor-activities', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload),
      keepalive: true // Keep connection alive even on page transitions
    });
  } catch (err) {
    // Non-blocking error handling
    console.debug('[Visitor Tracking] Delivery skipped or network offline');
  }
}

// Quick helper methods
export const VisitorTracker = {
  pageView: (path: string, title?: string) => {
    sendVisitorActivity('PAGE_VIEW', { pagePath: path, pageTitle: title || document.title, consentCategory: 'analytics' });
  },
  journalView: (journalId: string, title: string) => {
    sendVisitorActivity('JOURNAL_VIEW', {
      pageTitle: `Journal: ${title}`,
      details: { journalId, journalTitle: title },
      consentCategory: 'analytics'
    });
  },
  articleView: (articleId: string, title: string, journalId?: string) => {
    sendVisitorActivity('ARTICLE_VIEW', {
      pageTitle: `Article: ${title}`,
      details: { articleId, articleTitle: title, journalId },
      consentCategory: 'analytics'
    });
  },
  pdfDownload: (articleId: string, title: string, pdfUrl?: string) => {
    sendVisitorActivity('DOWNLOAD_PDF', {
      pageTitle: `PDF Download: ${title}`,
      details: { articleId, articleTitle: title, pdfUrl },
      consentCategory: 'analytics'
    });
  },
  search: (query: string, resultsCount?: number) => {
    sendVisitorActivity('SEARCH', {
      pageTitle: `Search: "${query}"`,
      details: { query, resultsCount: resultsCount ?? 0 },
      consentCategory: 'analytics'
    });
  },
  copyCitation: (format: string, articleId: string, articleTitle: string) => {
    sendVisitorActivity('COPY_CITATION', {
      pageTitle: `Copied ${format} citation for "${articleTitle}"`,
      details: { format, articleId, articleTitle },
      consentCategory: 'analytics'
    });
  },
  submissionStart: (journalId?: string, journalName?: string) => {
    sendVisitorActivity('SUBMISSION_START', {
      pageTitle: 'Started Manuscript Submission',
      details: { journalId, journalName },
      consentCategory: 'analytics'
    });
  }
};
