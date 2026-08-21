import { db } from '../db';
import { VisitorActivity, CookieConsentRecord, CookieSettings, VisitorAnalyticsSummary } from '../../types';

export const DEFAULT_COOKIE_SETTINGS: CookieSettings = {
  policyVersion: '1.2.0',
  essentialLocked: true,
  analyticsDefault: true,
  functionalDefault: true,
  marketingDefault: false,
  expirationDays: 365,
  bannerTitle: 'We Value Your Research Privacy & Experience',
  bannerDescription: 'We use essential cookies for secure site navigation and authentication, plus optional analytics cookies to monitor scholarly reading activity, improve journal services, and understand manuscript engagement.',
  privacyPolicyLink: '/privacy-policy',
  cookiePolicyLink: '/cookies',
  updatedAt: new Date().toISOString()
};

export class VisitorActivityService {
  private static activitiesCollection = 'visitor_activities';
  private static consentsCollection = 'cookie_consents';
  private static settingsCollection = 'settings';

  /**
   * Record a new visitor activity event in database
   */
  static async recordActivity(activity: Partial<VisitorActivity>): Promise<VisitorActivity> {
    const id = activity.id || `act_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const fullActivity: VisitorActivity = {
      id,
      visitorId: activity.visitorId || 'anon_visitor',
      sessionId: activity.sessionId || `sess_${Date.now()}`,
      actionType: activity.actionType || 'PAGE_VIEW',
      pagePath: activity.pagePath || '/',
      pageTitle: activity.pageTitle || 'Academic Publishing Platform',
      details: activity.details || {},
      device: activity.device || 'desktop',
      browser: activity.browser || 'Chrome',
      os: activity.os || 'Unknown OS',
      ip: activity.ip || '127.0.0.1',
      country: activity.country || 'Global',
      region: activity.region || 'Unknown',
      referrer: activity.referrer || '',
      consentCategory: activity.consentCategory || 'analytics',
      timestamp: activity.timestamp || new Date().toISOString()
    };

    console.log(`[Database POST] doc: ${this.activitiesCollection}/${id} [${fullActivity.actionType}]`);
    await db.collection(this.activitiesCollection).doc(id).set(fullActivity);
    return fullActivity;
  }

  /**
   * Fetch visitor activities with filtering, search, and pagination
   */
  static async getActivities(params: {
    limit?: number;
    actionType?: string;
    startDate?: string;
    endDate?: string;
    search?: string;
  } = {}): Promise<{ activities: VisitorActivity[]; total: number }> {
    const maxLimit = params.limit && params.limit > 0 ? Math.min(params.limit, 500) : 100;
    console.log(`[Database GET] collection: ${this.activitiesCollection} (limit: ${maxLimit})`);

    const snap = await db.collection(this.activitiesCollection).get();
    let activities: VisitorActivity[] = [];

    if (snap && snap.docs) {
      activities = snap.docs.map(doc => doc.data() as VisitorActivity);
    }

    // Sort by timestamp descending
    activities.sort((a, b) => (b.timestamp || '').localeCompare(a.timestamp || ''));

    // Filter by actionType
    if (params.actionType && params.actionType !== 'ALL') {
      activities = activities.filter(a => a.actionType === params.actionType);
    }

    // Filter by start date
    if (params.startDate) {
      activities = activities.filter(a => a.timestamp >= params.startDate!);
    }

    // Filter by end date
    if (params.endDate) {
      activities = activities.filter(a => a.timestamp <= params.endDate!);
    }

    // Filter by search query
    if (params.search && params.search.trim()) {
      const q = params.search.toLowerCase().trim();
      activities = activities.filter(a => 
        (a.pagePath && a.pagePath.toLowerCase().includes(q)) ||
        (a.pageTitle && a.pageTitle.toLowerCase().includes(q)) ||
        (a.visitorId && a.visitorId.toLowerCase().includes(q)) ||
        (a.country && a.country.toLowerCase().includes(q)) ||
        (a.browser && a.browser.toLowerCase().includes(q)) ||
        (a.details && JSON.stringify(a.details).toLowerCase().includes(q))
      );
    }

    const total = activities.length;
    const paginated = activities.slice(0, maxLimit);

    return { activities: paginated, total };
  }

  /**
   * Record a cookie consent record
   */
  static async recordConsent(consent: Partial<CookieConsentRecord>): Promise<CookieConsentRecord> {
    const id = consent.id || `consent_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const fullConsent: CookieConsentRecord = {
      id,
      visitorId: consent.visitorId || 'anon_visitor',
      sessionId: consent.sessionId || `sess_${Date.now()}`,
      acceptedAll: !!consent.acceptedAll,
      essential: true, // Always true
      analytics: consent.analytics ?? true,
      functional: consent.functional ?? true,
      marketing: consent.marketing ?? false,
      timestamp: consent.timestamp || new Date().toISOString(),
      userAgent: consent.userAgent || '',
      ip: consent.ip || '',
      country: consent.country || 'Global',
      version: consent.version || '1.2.0'
    };

    console.log(`[Database POST] doc: ${this.consentsCollection}/${id} (All: ${fullConsent.acceptedAll})`);
    await db.collection(this.consentsCollection).doc(id).set(fullConsent);

    // Also record a consent activity event
    await this.recordActivity({
      visitorId: fullConsent.visitorId,
      sessionId: fullConsent.sessionId,
      actionType: 'CONSENT_UPDATE',
      pagePath: windowOrRootPath(consent.userAgent),
      pageTitle: 'Cookie Consent Settings Saved',
      details: {
        acceptedAll: fullConsent.acceptedAll,
        analytics: fullConsent.analytics,
        functional: fullConsent.functional,
        marketing: fullConsent.marketing,
        policyVersion: fullConsent.version
      },
      country: fullConsent.country,
      consentCategory: 'essential'
    });

    return fullConsent;
  }

  /**
   * Get all cookie consent records
   */
  static async getConsents(limit = 200): Promise<CookieConsentRecord[]> {
    console.log(`[Database GET] collection: ${this.consentsCollection}`);
    const snap = await db.collection(this.consentsCollection).get();
    if (!snap || !snap.docs) return [];
    const list = snap.docs.map(doc => doc.data() as CookieConsentRecord);
    list.sort((a, b) => (b.timestamp || '').localeCompare(a.timestamp || ''));
    return list.slice(0, limit);
  }

  /**
   * Get or initialize global cookie settings
   */
  static async getCookieSettings(): Promise<CookieSettings> {
    console.log(`[Database GET] doc: ${this.settingsCollection}/cookie_settings`);
    const doc = await db.collection(this.settingsCollection).doc('cookie_settings').get();
    if (doc.exists) {
      const data = doc.data();
      return (data?.value || data) as CookieSettings;
    }
    // Return default settings
    return DEFAULT_COOKIE_SETTINGS;
  }

  /**
   * Update global cookie settings
   */
  static async updateCookieSettings(settings: Partial<CookieSettings>): Promise<CookieSettings> {
    const current = await this.getCookieSettings();
    const merged: CookieSettings = {
      ...current,
      ...settings,
      updatedAt: new Date().toISOString()
    };
    console.log(`[Database PUT] doc: ${this.settingsCollection}/cookie_settings`);
    await db.collection(this.settingsCollection).doc('cookie_settings').set({
      key: 'cookie_settings',
      value: merged,
      updatedAt: merged.updatedAt
    }, { merge: true });
    return merged;
  }

  /**
   * Calculate comprehensive Analytics Summary for Admin Dashboard
   */
  static async getAnalyticsSummary(): Promise<VisitorAnalyticsSummary> {
    const [actSnap, consentSnap] = await Promise.all([
      db.collection(this.activitiesCollection).get(),
      db.collection(this.consentsCollection).get()
    ]);

    const activities: VisitorActivity[] = actSnap?.docs ? actSnap.docs.map(d => d.data() as VisitorActivity) : [];
    const consents: CookieConsentRecord[] = consentSnap?.docs ? consentSnap.docs.map(d => d.data() as CookieConsentRecord) : [];

    const uniqueVisitors = new Set<string>();
    const now = Date.now();
    const thirtyMinsAgo = new Date(now - 30 * 60 * 1000).toISOString();
    const activeVisitorsLast30mSet = new Set<string>();

    let totalPageViews = 0;
    let totalArticleViews = 0;
    let totalPdfDownloads = 0;
    let totalSearches = 0;

    const journalViewsMap: Record<string, { title: string; views: number }> = {};
    const articleViewsMap: Record<string, { title: string; views: number; downloads: number }> = {};
    const searchQueriesMap: Record<string, number> = {};
    const deviceMap: Record<string, number> = { desktop: 0, mobile: 0, tablet: 0 };
    const browserMap: Record<string, number> = {};
    const countryMap: Record<string, number> = {};
    const timelineMap: Record<string, { pageViews: number; articleViews: number; downloads: number; searches: number }> = {};

    // Process activities
    activities.forEach(a => {
      if (a.visitorId) uniqueVisitors.add(a.visitorId);
      if (a.timestamp && a.timestamp >= thirtyMinsAgo && a.visitorId) {
        activeVisitorsLast30mSet.add(a.visitorId);
      }

      // Count actions
      if (a.actionType === 'PAGE_VIEW') totalPageViews++;
      if (a.actionType === 'ARTICLE_VIEW') totalArticleViews++;
      if (a.actionType === 'DOWNLOAD_PDF') totalPdfDownloads++;
      if (a.actionType === 'SEARCH') totalSearches++;

      // Device
      const dev = (a.device || 'desktop').toLowerCase();
      deviceMap[dev] = (deviceMap[dev] || 0) + 1;

      // Browser
      const br = a.browser || 'Chrome';
      browserMap[br] = (browserMap[br] || 0) + 1;

      // Country
      const c = a.country || 'United States';
      countryMap[c] = (countryMap[c] || 0) + 1;

      // Journal engagement
      if (a.actionType === 'JOURNAL_VIEW' && a.details?.journalId) {
        const jId = a.details.journalId;
        const jTitle = a.details.journalTitle || a.pageTitle || 'Academic Journal';
        if (!journalViewsMap[jId]) journalViewsMap[jId] = { title: jTitle, views: 0 };
        journalViewsMap[jId].views++;
      }

      // Article engagement
      if ((a.actionType === 'ARTICLE_VIEW' || a.actionType === 'DOWNLOAD_PDF') && a.details?.articleId) {
        const artId = a.details.articleId;
        const artTitle = a.details.articleTitle || a.pageTitle || 'Scholarly Manuscript';
        if (!articleViewsMap[artId]) articleViewsMap[artId] = { title: artTitle, views: 0, downloads: 0 };
        if (a.actionType === 'ARTICLE_VIEW') articleViewsMap[artId].views++;
        if (a.actionType === 'DOWNLOAD_PDF') articleViewsMap[artId].downloads++;
      }

      // Searches
      if (a.actionType === 'SEARCH' && a.details?.query) {
        const q = String(a.details.query).trim();
        if (q) {
          searchQueriesMap[q] = (searchQueriesMap[q] || 0) + 1;
        }
      }

      // Timeline (group by YYYY-MM-DD or date string)
      if (a.timestamp) {
        const dateKey = a.timestamp.split('T')[0];
        if (!timelineMap[dateKey]) {
          timelineMap[dateKey] = { pageViews: 0, articleViews: 0, downloads: 0, searches: 0 };
        }
        if (a.actionType === 'PAGE_VIEW') timelineMap[dateKey].pageViews++;
        if (a.actionType === 'ARTICLE_VIEW') timelineMap[dateKey].articleViews++;
        if (a.actionType === 'DOWNLOAD_PDF') timelineMap[dateKey].downloads++;
        if (a.actionType === 'SEARCH') timelineMap[dateKey].searches++;
      }
    });

    // Process consents
    let allAcceptedCount = 0;
    let essentialOnlyCount = 0;
    let analyticsAcceptedCount = 0;
    let functionalAcceptedCount = 0;
    let marketingAcceptedCount = 0;

    consents.forEach(c => {
      if (c.acceptedAll) allAcceptedCount++;
      else if (!c.analytics && !c.functional && !c.marketing) essentialOnlyCount++;
      if (c.analytics) analyticsAcceptedCount++;
      if (c.functional) functionalAcceptedCount++;
      if (c.marketing) marketingAcceptedCount++;
    });

    const totalConsentsRecorded = consents.length;
    const consentOptInRate = totalConsentsRecorded > 0 
      ? Math.round((analyticsAcceptedCount / totalConsentsRecorded) * 100) 
      : 84; // default baseline

    // Top Journals sorted
    const topJournals = Object.entries(journalViewsMap)
      .map(([journalId, val]) => ({ journalId, title: val.title, views: val.views }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 5);

    // Top Articles sorted
    const topArticles = Object.entries(articleViewsMap)
      .map(([articleId, val]) => ({ articleId, title: val.title, views: val.views, downloads: val.downloads }))
      .sort((a, b) => (b.views + b.downloads * 2) - (a.views + a.downloads * 2))
      .slice(0, 5);

    // Top Searches
    const topSearchQueries = Object.entries(searchQueriesMap)
      .map(([query, count]) => ({ query, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    // Device distribution
    const totalDevices = Object.values(deviceMap).reduce((a, b) => a + b, 0) || 1;
    const deviceDistribution = Object.entries(deviceMap).map(([device, count]) => ({
      device: device.charAt(0).toUpperCase() + device.slice(1),
      count,
      percentage: Math.round((count / totalDevices) * 100)
    }));

    // Browser distribution
    const totalBrowsers = Object.values(browserMap).reduce((a, b) => a + b, 0) || 1;
    const browserDistribution = Object.entries(browserMap)
      .map(([browser, count]) => ({
        browser,
        count,
        percentage: Math.round((count / totalBrowsers) * 100)
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Country distribution
    const totalCountries = Object.values(countryMap).reduce((a, b) => a + b, 0) || 1;
    const countryDistribution = Object.entries(countryMap)
      .map(([country, count]) => ({
        country,
        count,
        percentage: Math.round((count / totalCountries) * 100)
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

    // Timeline sorted by date
    const activityTimeline = Object.entries(timelineMap)
      .map(([date, counts]) => ({
        date,
        ...counts
      }))
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-14); // Last 14 days

    return {
      totalVisitors: Math.max(uniqueVisitors.size, 1),
      activeVisitorsLast30m: activeVisitorsLast30mSet.size,
      totalPageViews,
      totalArticleViews,
      totalPdfDownloads,
      totalSearches,
      consentOptInRate,
      totalConsentsRecorded,
      consentBreakdown: {
        allAccepted: allAcceptedCount,
        essentialOnly: essentialOnlyCount,
        analyticsAccepted: analyticsAcceptedCount,
        functionalAccepted: functionalAcceptedCount,
        marketingAccepted: marketingAcceptedCount
      },
      topJournals,
      topArticles,
      topSearchQueries,
      deviceDistribution,
      browserDistribution,
      countryDistribution,
      activityTimeline
    };
  }

  /**
   * Clear all visitor activities (Admin only utility)
   */
  static async clearActivities(): Promise<void> {
    console.log(`[Database DELETE] Clearing all documents in ${this.activitiesCollection}`);
    const snap = await db.collection(this.activitiesCollection).get();
    if (snap && snap.docs) {
      const batchPromises = snap.docs.map(doc => db.collection(this.activitiesCollection).doc(doc.id).delete());
      await Promise.all(batchPromises);
    }
  }

  /**
   * Seed Initial Realistic Visitor Data if empty
   */
  static async seedInitialVisitorDataIfEmpty(): Promise<void> {
    try {
      const snap = await db.collection(this.activitiesCollection).limit(1).get();
      if (!snap.empty) {
        return; // Already populated
      }

      console.log('Seeding initial visitor activities and cookie consents into database...');

      const sampleCountries = ['United States', 'United Kingdom', 'Germany', 'Canada', 'Australia', 'Japan', 'India', 'France', 'Netherlands', 'Singapore'];
      const sampleBrowsers = ['Chrome', 'Safari', 'Firefox', 'Edge'];
      const sampleDevices: ('desktop' | 'mobile' | 'tablet')[] = ['desktop', 'desktop', 'desktop', 'mobile', 'mobile', 'tablet'];

      const seedConsents: CookieConsentRecord[] = [
        {
          id: 'consent_seed_1',
          visitorId: 'vis_usr_84920',
          sessionId: 'sess_1001',
          acceptedAll: true,
          essential: true,
          analytics: true,
          functional: true,
          marketing: true,
          timestamp: new Date(Date.now() - 3600 * 1000 * 24 * 3).toISOString(),
          country: 'United Kingdom',
          version: '1.2.0'
        },
        {
          id: 'consent_seed_2',
          visitorId: 'vis_usr_39201',
          sessionId: 'sess_1002',
          acceptedAll: true,
          essential: true,
          analytics: true,
          functional: true,
          marketing: false,
          timestamp: new Date(Date.now() - 3600 * 1000 * 24 * 2).toISOString(),
          country: 'United States',
          version: '1.2.0'
        },
        {
          id: 'consent_seed_3',
          visitorId: 'vis_usr_77124',
          sessionId: 'sess_1003',
          acceptedAll: false,
          essential: true,
          analytics: false,
          functional: false,
          marketing: false,
          timestamp: new Date(Date.now() - 3600 * 1000 * 18).toISOString(),
          country: 'Germany',
          version: '1.2.0'
        },
        {
          id: 'consent_seed_4',
          visitorId: 'vis_usr_90214',
          sessionId: 'sess_1004',
          acceptedAll: true,
          essential: true,
          analytics: true,
          functional: true,
          marketing: true,
          timestamp: new Date(Date.now() - 3600 * 1000 * 5).toISOString(),
          country: 'Canada',
          version: '1.2.0'
        },
        {
          id: 'consent_seed_5',
          visitorId: 'vis_usr_11093',
          sessionId: 'sess_1005',
          acceptedAll: true,
          essential: true,
          analytics: true,
          functional: true,
          marketing: false,
          timestamp: new Date(Date.now() - 3600 * 1000 * 1).toISOString(),
          country: 'Australia',
          version: '1.2.0'
        }
      ];

      for (const c of seedConsents) {
        await db.collection(this.consentsCollection).doc(c.id).set(c);
      }

      // Generate 25 realistic seed activities across the past 7 days
      const activitiesToSeed: VisitorActivity[] = [];
      const now = Date.now();

      const activityBlueprints = [
        { path: '/', title: 'Home - Academic Publishing Platform', action: 'PAGE_VIEW' as const, details: {} },
        { path: '/journals', title: 'Browse Journals - Academic Publishing', action: 'PAGE_VIEW' as const, details: {} },
        { path: '/journal/j1', title: 'International Journal of Agricultural Systems and Innovation', action: 'JOURNAL_VIEW' as const, details: { journalId: 'j1', journalTitle: 'International Journal of Agricultural Systems and Innovation (IJASI)' } },
        { path: '/article/a1', title: 'Optimizing Precision Irrigation Through IoT Sensor Networks', action: 'ARTICLE_VIEW' as const, details: { articleId: 'a1', articleTitle: 'Optimizing Precision Irrigation Through IoT Sensor Networks', journalId: 'j1' } },
        { path: '/article/a1/download', title: 'Downloading PDF: Optimizing Precision Irrigation', action: 'DOWNLOAD_PDF' as const, details: { articleId: 'a1', articleTitle: 'Optimizing Precision Irrigation Through IoT Sensor Networks' } },
        { path: '/search?q=machine+learning', title: 'Search: "machine learning"', action: 'SEARCH' as const, details: { query: 'machine learning', resultsCount: 14 } },
        { path: '/journal/j3', title: 'Journal of Biotechnology and Molecular Engineering', action: 'JOURNAL_VIEW' as const, details: { journalId: 'j3', journalTitle: 'Journal of Biotechnology and Molecular Engineering (JBME)' } },
        { path: '/article/a2', title: 'Transforming STEM Pedagogy Through Generative AI', action: 'ARTICLE_VIEW' as const, details: { articleId: 'a2', articleTitle: 'Transforming STEM Pedagogy Through Generative AI and Interactive Virtual Labs', journalId: 'j9' } },
        { path: '/article/a2/download', title: 'Downloading PDF: STEM Pedagogy AI', action: 'DOWNLOAD_PDF' as const, details: { articleId: 'a2', articleTitle: 'Transforming STEM Pedagogy Through Generative AI' } },
        { path: '/search?q=biotechnology+crispr', title: 'Search: "biotechnology crispr"', action: 'SEARCH' as const, details: { query: 'biotechnology crispr', resultsCount: 8 } },
        { path: '/submission-workflow', title: 'Author Manuscript Submission Guidelines', action: 'PAGE_VIEW' as const, details: {} },
        { path: '/submit', title: 'Submit Manuscript Portal', action: 'SUBMISSION_START' as const, details: { journalSelected: 'IJASI' } },
        { path: '/article/a1/cite', title: 'Copying APA Citation: Precision Irrigation', action: 'COPY_CITATION' as const, details: { format: 'APA 7th Edition', articleId: 'a1' } },
        { path: '/cookies', title: 'Cookie Policy & Preferences', action: 'CONSENT_UPDATE' as const, details: { acceptedAll: true, analytics: true, functional: true, marketing: false } },
        { path: '/contact', title: 'Contact Us - Academic Publishing', action: 'PAGE_VIEW' as const, details: {} },
        { path: '/search?q=sustainability+climate', title: 'Search: "sustainability climate"', action: 'SEARCH' as const, details: { query: 'sustainability climate', resultsCount: 22 } },
        { path: '/leadership', title: 'Editorial Leadership Team', action: 'PAGE_VIEW' as const, details: {} },
        { path: '/journal/j1/archive', title: 'Journal Archive Volume 12', action: 'PAGE_VIEW' as const, details: { journalId: 'j1' } },
        { path: '/article/a2/cite', title: 'Copying BibTeX Citation: STEM AI', action: 'COPY_CITATION' as const, details: { format: 'BibTeX', articleId: 'a2' } },
        { path: '/search?q=neural+networks', title: 'Search: "neural networks"', action: 'SEARCH' as const, details: { query: 'neural networks', resultsCount: 31 } }
      ];

      for (let i = 0; i < activityBlueprints.length; i++) {
        const bp = activityBlueprints[i];
        const randomHoursAgo = Math.floor(Math.random() * 120); // within last 5 days
        const timestamp = new Date(now - randomHoursAgo * 3600 * 1000).toISOString();
        const visitorId = `vis_usr_${10000 + (i % 8)}`;
        const sessionId = `sess_${20000 + (i % 8)}`;
        const country = sampleCountries[i % sampleCountries.length];
        const browser = sampleBrowsers[i % sampleBrowsers.length];
        const device = sampleDevices[i % sampleDevices.length];

        activitiesToSeed.push({
          id: `seed_act_${i + 1}`,
          visitorId,
          sessionId,
          actionType: bp.action,
          pagePath: bp.path,
          pageTitle: bp.title,
          details: bp.details,
          device,
          browser,
          os: device === 'mobile' ? 'iOS' : 'macOS / Windows',
          ip: `192.168.1.${10 + i}`,
          country,
          region: 'Metropolitan',
          referrer: i % 3 === 0 ? 'https://google.com' : i % 3 === 1 ? 'https://scholar.google.com' : '',
          consentCategory: bp.action === 'CONSENT_UPDATE' ? 'essential' : 'analytics',
          timestamp
        });
      }

      for (const act of activitiesToSeed) {
        await db.collection(this.activitiesCollection).doc(act.id).set(act);
      }

      // Seed default cookie settings
      await db.collection(this.settingsCollection).doc('cookie_settings').set({
        key: 'cookie_settings',
        value: DEFAULT_COOKIE_SETTINGS,
        updatedAt: new Date().toISOString()
      }, { merge: true });

      console.log('Seeded visitor activities and cookie policy settings successfully!');
    } catch (err: any) {
      console.warn('Notice seeding visitor activities:', err?.message || err);
    }
  }
}

function windowOrRootPath(userAgent?: string): string {
  return '/cookies';
}
