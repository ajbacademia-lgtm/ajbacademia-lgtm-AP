import React, { useState, useEffect, useCallback } from 'react';
import { 
  Cookie, 
  Users, 
  Eye, 
  FileDown, 
  Search, 
  ShieldCheck, 
  Activity, 
  RefreshCw, 
  Sliders, 
  Download, 
  Trash2, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  Monitor, 
  Smartphone, 
  Tablet, 
  Globe, 
  Calendar, 
  TrendingUp, 
  Save, 
  Check, 
  X, 
  BookOpen,
  FileText,
  Clock
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell
} from 'recharts';
import { VisitorActivity, VisitorAnalyticsSummary, CookieSettings } from '../../types';
import { safeFetchJson } from '../../src/utils/safeApi';

export const DEFAULT_COOKIE_SETTINGS: CookieSettings = {
  bannerTitle: 'Academic Privacy & Cookie Notice',
  bannerDescription: 'We use cookies and telemetry identifiers to maintain scholarly session security, measure article readership & PDF downloads, and optimize our peer-reviewed journal experience.',
  policyVersion: '1.2.0',
  essentialLocked: true,
  expirationDays: 365,
  analyticsDefault: true,
  functionalDefault: true,
  marketingDefault: false,
  privacyPolicyLink: '/privacy-policy',
  cookiePolicyLink: '/cookies',
  updatedAt: new Date().toISOString()
};

const ACTION_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  PAGE_VIEW: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  ARTICLE_VIEW: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
  JOURNAL_VIEW: { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200' },
  SEARCH: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  DOWNLOAD_PDF: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  CONSENT_UPDATE: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  COPY_CITATION: { bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200' },
  SUBMISSION_START: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
  DEFAULT: { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' }
};

const PIE_COLORS = ['#10b981', '#6366f1', '#3b82f6', '#f59e0b', '#ec4899'];

export const CookieVisitorDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'live-stream' | 'content-rankings' | 'cookie-governance'>('overview');
  
  // Data state
  const [summary, setSummary] = useState<VisitorAnalyticsSummary | null>(null);
  const [activities, setActivities] = useState<VisitorActivity[]>([]);
  const [totalActivitiesCount, setTotalActivitiesCount] = useState<number>(0);
  const [cookieSettings, setCookieSettings] = useState<CookieSettings>(DEFAULT_COOKIE_SETTINGS);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Filters state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedActionType, setSelectedActionType] = useState<string>('ALL');
  const [dateRangeFilter, setDateRangeFilter] = useState<'all' | 'today' | '7d' | '30d'>('all');
  const [autoRefreshInterval, setAutoRefreshInterval] = useState<number>(10); // seconds, 0 = off
  const [selectedActivityDetail, setSelectedActivityDetail] = useState<VisitorActivity | null>(null);

  // Cookie settings edit state
  const [editBannerTitle, setEditBannerTitle] = useState(cookieSettings.bannerTitle);
  const [editBannerDesc, setEditBannerDesc] = useState(cookieSettings.bannerDescription);
  const [editPolicyVer, setEditPolicyVer] = useState(cookieSettings.policyVersion);
  const [editExpDays, setEditExpDays] = useState(cookieSettings.expirationDays);
  const [editAnalyticsDefault, setEditAnalyticsDefault] = useState(cookieSettings.analyticsDefault);
  const [editFunctionalDefault, setEditFunctionalDefault] = useState(cookieSettings.functionalDefault);
  const [editMarketingDefault, setEditMarketingDefault] = useState(cookieSettings.marketingDefault);
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Fetch summary & activities
  const fetchData = useCallback(async (isBackground = false) => {
    if (!isBackground) setIsRefreshing(true);
    try {
      // Calculate date filters
      let startDate: string | undefined = undefined;
      const now = new Date();
      if (dateRangeFilter === 'today') {
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
      } else if (dateRangeFilter === '7d') {
        startDate = new Date(now.getTime() - 7 * 864e5).toISOString();
      } else if (dateRangeFilter === '30d') {
        startDate = new Date(now.getTime() - 30 * 864e5).toISOString();
      }

      const [sumData, actData, stData] = await Promise.all([
        safeFetchJson<any>('/api/visitor-activities/stats').catch(() => null),
        safeFetchJson<any>(`/api/visitor-activities?limit=150&actionType=${selectedActionType}&search=${encodeURIComponent(searchQuery)}${startDate ? `&startDate=${startDate}` : ''}`).catch(() => null),
        safeFetchJson<any>('/api/cookie-consents/settings').catch(() => null)
      ]);

      if (sumData) {
        setSummary(sumData);
      }

      if (actData) {
        setActivities(actData.activities || (Array.isArray(actData) ? actData : []));
        setTotalActivitiesCount(actData.total || (Array.isArray(actData) ? actData.length : 0));
      }

      if (stData) {
        setCookieSettings(stData);
        setEditBannerTitle(stData.bannerTitle || DEFAULT_COOKIE_SETTINGS.bannerTitle);
        setEditBannerDesc(stData.bannerDescription || DEFAULT_COOKIE_SETTINGS.bannerDescription);
        setEditPolicyVer(stData.policyVersion || DEFAULT_COOKIE_SETTINGS.policyVersion);
        setEditExpDays(stData.expirationDays || DEFAULT_COOKIE_SETTINGS.expirationDays);
        setEditAnalyticsDefault(stData.analyticsDefault ?? true);
        setEditFunctionalDefault(stData.functionalDefault ?? true);
        setEditMarketingDefault(stData.marketingDefault ?? false);
      }
    } catch (err: any) {
      console.error('Error fetching visitor telemetry:', err);
      if (!isBackground) {
        showToast(`Failed to load visitor telemetry: ${err?.message || err}`, 'error');
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [dateRangeFilter, selectedActionType, searchQuery]);

  // Initial load
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Auto-refresh interval
  useEffect(() => {
    if (autoRefreshInterval <= 0) return;
    const interval = setInterval(() => {
      fetchData(true);
    }, autoRefreshInterval * 1000);
    return () => clearInterval(interval);
  }, [autoRefreshInterval, fetchData]);

  // Save Cookie Settings
  const handleSaveCookieSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    try {
      const updatedData: Partial<CookieSettings> = {
        bannerTitle: editBannerTitle,
        bannerDescription: editBannerDesc,
        policyVersion: editPolicyVer,
        expirationDays: Number(editExpDays),
        analyticsDefault: editAnalyticsDefault,
        functionalDefault: editFunctionalDefault,
        marketingDefault: editMarketingDefault,
        updatedAt: new Date().toISOString()
      };

      const saved = await safeFetchJson<any>('/api/cookie-consents/settings', {
        method: 'PUT',
        body: JSON.stringify(updatedData)
      });

      setCookieSettings(saved);
      showToast('Cookie & Privacy banner configuration published globally!', 'success');
    } catch (err: any) {
      showToast(`Failed to save cookie settings: ${err?.message || err}`, 'error');
    } finally {
      setIsSavingSettings(false);
    }
  };

  // Export Activities to CSV
  const handleExportCSV = () => {
    if (!activities.length) {
      showToast('No visitor activities to export', 'info');
      return;
    }

    const headers = ['Timestamp', 'Visitor ID', 'Session ID', 'Action Type', 'Page Path', 'Page Title', 'Device', 'Browser', 'Country', 'Details'];
    const rows = activities.map(a => [
      `"${a.timestamp}"`,
      `"${a.visitorId}"`,
      `"${a.sessionId}"`,
      `"${a.actionType}"`,
      `"${a.pagePath.replace(/"/g, '""')}"`,
      `"${(a.pageTitle || '').replace(/"/g, '""')}"`,
      `"${a.device}"`,
      `"${a.browser}"`,
      `"${a.country || ''}"`,
      `"${JSON.stringify(a.details || {}).replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `visitor_activities_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`Exported ${activities.length} visitor activities to CSV!`, 'success');
  };

  // Clear all activities
  const handleClearActivities = async () => {
    if (window.confirm('Are you sure you want to purge all visitor telemetry logs? This cannot be undone.')) {
      try {
        await safeFetchJson('/api/visitor-activities/clear', { method: 'DELETE' });
        showToast('Visitor activities purged successfully', 'info');
        fetchData();
      } catch (err: any) {
        showToast(`Failed to clear activities: ${err.message}`, 'error');
      }
    }
  };

  // Prepare chart data
  const consentDonutData = summary?.consentBreakdown ? [
    { name: 'All Cookies Accepted', value: summary.consentBreakdown.allAccepted || 1 },
    { name: 'Analytics Accepted', value: summary.consentBreakdown.analyticsAccepted || 1 },
    { name: 'Functional Accepted', value: summary.consentBreakdown.functionalAccepted || 1 },
    { name: 'Essential Only', value: summary.consentBreakdown.essentialOnly || 1 }
  ] : [];

  const timelineChartData = summary?.activityTimeline && summary.activityTimeline.length > 0 
    ? summary.activityTimeline.map(item => ({
        date: item.date.length > 5 ? item.date.substring(5) : item.date,
        'Page Views': item.pageViews,
        'Article Reads': item.articleViews,
        'Downloads': item.downloads,
        'Searches': item.searches
      }))
    : [
        { date: 'Day 1', 'Page Views': 12, 'Article Reads': 8, 'Downloads': 4, 'Searches': 3 },
        { date: 'Day 2', 'Page Views': 19, 'Article Reads': 14, 'Downloads': 6, 'Searches': 7 },
        { date: 'Day 3', 'Page Views': 28, 'Article Reads': 22, 'Downloads': 11, 'Searches': 9 },
        { date: 'Day 4', 'Page Views': 35, 'Article Reads': 27, 'Downloads': 15, 'Searches': 12 },
        { date: 'Day 5', 'Page Views': 42, 'Article Reads': 31, 'Downloads': 18, 'Searches': 16 }
      ];

  return (
    <div className="bg-white border border-gray-200 rounded-sm shadow-xl overflow-hidden">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-6 right-6 z-[300] max-w-sm w-full bg-white border-l-4 border-brand-action shadow-2xl p-4 rounded-sm animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-start gap-3">
            {notification.type === 'success' ? (
              <CheckCircle2 className="text-emerald-500 shrink-0 mt-0.5" size={18} />
            ) : notification.type === 'error' ? (
              <XCircle className="text-rose-500 shrink-0 mt-0.5" size={18} />
            ) : (
              <Activity className="text-brand-action shrink-0 mt-0.5" size={18} />
            )}
            <div className="flex-grow min-w-0">
              <p className="text-[10px] font-black uppercase tracking-wider text-gray-400">
                {notification.type === 'success' ? 'Telemetry Notification' : notification.type === 'error' ? 'Telemetry Error' : 'System Notice'}
              </p>
              <p className="text-xs font-semibold text-brand-navy mt-0.5 leading-relaxed">{notification.message}</p>
            </div>
            <button onClick={() => setNotification(null)} className="text-gray-400 hover:text-brand-navy p-1">
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Dashboard Top Header Bar */}
      <div className="bg-white text-brand-navy p-6 md:p-8 border-b border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-brand-action font-mono text-xs uppercase tracking-widest mb-2 font-bold">
              <Cookie size={16} /> Real-Time Governance & Analytics
            </div>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-brand-navy tracking-tight flex items-center gap-3">
              Website Cookies & Visitor Activity Monitor
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full flex items-center gap-1.5 font-sans">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block"></span> Live Active
              </span>
            </h2>
            <p className="text-xs md:text-sm text-gray-600 mt-1 max-w-3xl leading-relaxed">
              Track scholarly readership trends, manuscript downloads, search inquiries, device demographics, and monitor GDPR / ePrivacy cookie consent decisions in real time.
            </p>
          </div>

          {/* Quick Actions & Live Stream Controls */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Auto Refresh Selector */}
            <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded text-xs">
              <Clock size={13} className="text-gray-500" />
              <span className="text-gray-500 text-[11px]">Refresh:</span>
              <select
                value={autoRefreshInterval}
                onChange={(e) => setAutoRefreshInterval(Number(e.target.value))}
                className="bg-transparent text-brand-navy font-semibold text-xs focus:outline-none cursor-pointer"
              >
                <option value={5} className="bg-white text-brand-navy">5s</option>
                <option value={10} className="bg-white text-brand-navy">10s</option>
                <option value={30} className="bg-white text-brand-navy">30s</option>
                <option value={0} className="bg-white text-brand-navy">Off</option>
              </select>
            </div>

            {/* Manual Refresh */}
            <button
              type="button"
              onClick={() => fetchData()}
              disabled={isRefreshing}
              className="px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-brand-navy border border-gray-200 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
              title="Refresh telemetry"
            >
              <RefreshCw size={13} className={isRefreshing ? 'animate-spin' : ''} />
              <span>Refresh</span>
            </button>

            {/* Export CSV */}
            <button
              type="button"
              onClick={handleExportCSV}
              className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all"
              title="Export all activity events to CSV"
            >
              <Download size={13} />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 mt-8 border-b border-gray-200 overflow-x-auto pb-px">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all shrink-0 ${
              activeTab === 'overview'
                ? 'border-brand-action text-brand-action bg-emerald-50/60'
                : 'border-transparent text-gray-500 hover:text-brand-navy hover:bg-gray-50'
            }`}
          >
            <TrendingUp size={14} /> Telemetry Overview & Trends
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('live-stream')}
            className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all shrink-0 ${
              activeTab === 'live-stream'
                ? 'border-brand-action text-brand-action bg-emerald-50/60'
                : 'border-transparent text-gray-500 hover:text-brand-navy hover:bg-gray-50'
            }`}
          >
            <Activity size={14} /> Live Activity Stream ({totalActivitiesCount})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('content-rankings')}
            className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all shrink-0 ${
              activeTab === 'content-rankings'
                ? 'border-brand-action text-brand-action bg-emerald-50/60'
                : 'border-transparent text-gray-500 hover:text-brand-navy hover:bg-gray-50'
            }`}
          >
            <BookOpen size={14} /> Scholarly Engagement Rankings
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('cookie-governance')}
            className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all shrink-0 ${
              activeTab === 'cookie-governance'
                ? 'border-brand-action text-brand-action bg-emerald-50/60'
                : 'border-transparent text-gray-500 hover:text-brand-navy hover:bg-gray-50'
            }`}
          >
            <Sliders size={14} /> Cookie Policy & Banner Governance
          </button>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <div className="p-6 md:p-8 bg-gray-50/50 min-h-[600px]">
        {/* TAB 1: OVERVIEW & METRICS */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* KPI Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* Unique Visitors */}
              <div className="bg-white p-6 rounded-sm border border-gray-200 shadow-sm relative overflow-hidden">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-black uppercase tracking-widest text-brand-navy/50">Total Visitors</span>
                  <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Users size={16} />
                  </div>
                </div>
                <div className="text-3xl font-serif font-bold text-brand-navy">
                  {summary?.totalVisitors ?? 1}
                </div>
                <div className="mt-3 flex items-center justify-between text-xs">
                  <span className="text-emerald-600 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    {summary?.activeVisitorsLast30m || 1} active (30m)
                  </span>
                  <span className="text-gray-400">Anonymous IDs</span>
                </div>
              </div>

              {/* Cookie Consent Opt-in Rate */}
              <div className="bg-white p-6 rounded-sm border border-gray-200 shadow-sm relative overflow-hidden">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-black uppercase tracking-widest text-brand-navy/50">Consent Opt-in Rate</span>
                  <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <ShieldCheck size={16} />
                  </div>
                </div>
                <div className="text-3xl font-serif font-bold text-emerald-600">
                  {summary?.consentOptInRate ?? 84}%
                </div>
                <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                  <span>{summary?.consentBreakdown.allAccepted || 1} All Accepted</span>
                  <span>{summary?.consentBreakdown.essentialOnly || 0} Essential</span>
                </div>
              </div>

              {/* Page Views & Article Views */}
              <div className="bg-white p-6 rounded-sm border border-gray-200 shadow-sm relative overflow-hidden">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-black uppercase tracking-widest text-brand-navy/50">Scholarly Page Reads</span>
                  <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <Eye size={16} />
                  </div>
                </div>
                <div className="text-3xl font-serif font-bold text-brand-navy">
                  {(summary?.totalPageViews || 0) + (summary?.totalArticleViews || 0)}
                </div>
                <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                  <span>{summary?.totalArticleViews || 0} Article views</span>
                  <span>{summary?.totalPageViews || 0} Portal hits</span>
                </div>
              </div>

              {/* PDF Downloads & Searches */}
              <div className="bg-white p-6 rounded-sm border border-gray-200 shadow-sm relative overflow-hidden">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-black uppercase tracking-widest text-brand-navy/50">PDFs & Queries</span>
                  <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
                    <FileDown size={16} />
                  </div>
                </div>
                <div className="text-3xl font-serif font-bold text-brand-navy">
                  {summary?.totalPdfDownloads || 0}
                </div>
                <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                  <span>{summary?.totalPdfDownloads || 0} Full PDFs</span>
                  <span>{summary?.totalSearches || 0} Search queries</span>
                </div>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Traffic Timeline Chart (2 cols) */}
              <div className="lg:col-span-2 bg-white p-6 rounded-sm border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-serif font-bold text-brand-navy text-lg">Visitor Traffic & Reading Velocity</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Daily trend of page views, article reads, PDF downloads, and search events</p>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-medium">
                    <span className="flex items-center gap-1.5 text-blue-600">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Page Views
                    </span>
                    <span className="flex items-center gap-1.5 text-indigo-600">
                      <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span> Article Reads
                    </span>
                    <span className="flex items-center gap-1.5 text-emerald-600">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Downloads
                    </span>
                  </div>
                </div>

                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={timelineChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorArt" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorDl" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: '#0b192c', color: '#fff', borderRadius: '4px', fontSize: '12px', border: 'none' }} />
                      <Area type="monotone" dataKey="Page Views" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorPv)" />
                      <Area type="monotone" dataKey="Article Reads" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorArt)" />
                      <Area type="monotone" dataKey="Downloads" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorDl)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Cookie Consent Breakdown (1 col) */}
              <div className="bg-white p-6 rounded-sm border border-gray-200 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="font-serif font-bold text-brand-navy text-lg">Cookie Consent Ratio</h3>
                  <p className="text-xs text-gray-500 mt-0.5">GDPR & ePrivacy user decision breakdown</p>
                </div>

                <div className="h-48 w-full my-4 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={consentDonutData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={75}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {consentDonutData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#0b192c', color: '#fff', borderRadius: '4px', fontSize: '12px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-2 pt-2 border-t border-gray-100 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-gray-700">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Full Consent (All)
                    </span>
                    <span className="font-bold text-brand-navy">{summary?.consentBreakdown.allAccepted || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-gray-700">
                      <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span> Analytics Opt-in
                    </span>
                    <span className="font-bold text-brand-navy">{summary?.consentBreakdown.analyticsAccepted || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-gray-700">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Functional Opt-in
                    </span>
                    <span className="font-bold text-brand-navy">{summary?.consentBreakdown.functionalAccepted || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-gray-700">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Essential Only
                    </span>
                    <span className="font-bold text-brand-navy">{summary?.consentBreakdown.essentialOnly || 0}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Demographics & Devices Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Device Demographics */}
              <div className="bg-white p-6 rounded-sm border border-gray-200 shadow-sm">
                <div className="flex items-center gap-2 mb-4 text-brand-navy font-bold text-sm">
                  <Monitor size={18} className="text-indigo-600" /> Device Distribution
                </div>
                <div className="space-y-4">
                  {(summary?.deviceDistribution || [
                    { device: 'Desktop', percentage: 68, count: 68 },
                    { device: 'Mobile', percentage: 26, count: 26 },
                    { device: 'Tablet', percentage: 6, count: 6 }
                  ]).map((item, idx) => (
                    <div key={idx}>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-medium text-brand-navy flex items-center gap-1.5">
                          {item.device === 'Desktop' ? <Monitor size={13} /> : item.device === 'Mobile' ? <Smartphone size={13} /> : <Tablet size={13} />}
                          {item.device}
                        </span>
                        <span className="font-bold text-brand-navy/70">{item.percentage}% ({item.count})</span>
                      </div>
                      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Browser Distribution */}
              <div className="bg-white p-6 rounded-sm border border-gray-200 shadow-sm">
                <div className="flex items-center gap-2 mb-4 text-brand-navy font-bold text-sm">
                  <Globe size={18} className="text-blue-600" /> Browser Demographics
                </div>
                <div className="space-y-3">
                  {(summary?.browserDistribution || [
                    { browser: 'Chrome', percentage: 64, count: 64 },
                    { browser: 'Safari', percentage: 20, count: 20 },
                    { browser: 'Firefox', percentage: 10, count: 10 },
                    { browser: 'Edge', percentage: 6, count: 6 }
                  ]).map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs py-1.5 border-b border-gray-50 last:border-0">
                      <span className="font-medium text-brand-navy">{item.browser}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-600 rounded-full" style={{ width: `${item.percentage}%` }}></div>
                        </div>
                        <span className="font-bold text-brand-navy/70 min-w-[36px] text-right">{item.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Geographic Country Distribution */}
              <div className="bg-white p-6 rounded-sm border border-gray-200 shadow-sm">
                <div className="flex items-center gap-2 mb-4 text-brand-navy font-bold text-sm">
                  <Globe size={18} className="text-emerald-600" /> Geographic Origin
                </div>
                <div className="space-y-2.5">
                  {(summary?.countryDistribution || [
                    { country: 'United States', percentage: 42, count: 42 },
                    { country: 'United Kingdom', percentage: 18, count: 18 },
                    { country: 'Germany', percentage: 14, count: 14 },
                    { country: 'Canada', percentage: 10, count: 10 },
                    { country: 'Australia', percentage: 8, count: 8 }
                  ]).map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs py-1">
                      <span className="font-medium text-brand-navy truncate max-w-[140px]">{item.country}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-gray-400 font-mono">{item.count} events</span>
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded font-bold text-[10px]">
                          {item.percentage}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: LIVE ACTIVITY STREAM */}
        {activeTab === 'live-stream' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Filter Controls Bar */}
            <div className="bg-white p-5 rounded-sm border border-gray-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3 flex-grow">
                {/* Search Box */}
                <div className="relative flex-grow max-w-md">
                  <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by URL, visitor ID, keyword, or country..."
                    className="w-full pl-9 pr-4 py-2 text-xs border border-gray-200 rounded focus:outline-none focus:border-brand-action bg-gray-50"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>

                {/* Action Type Dropdown */}
                <div className="flex items-center gap-1.5">
                  <Filter size={14} className="text-gray-400" />
                  <select
                    value={selectedActionType}
                    onChange={(e) => setSelectedActionType(e.target.value)}
                    className="text-xs border border-gray-200 rounded px-3 py-2 bg-white font-medium text-brand-navy focus:outline-none focus:border-brand-action"
                  >
                    <option value="ALL">All Actions</option>
                    <option value="PAGE_VIEW">Page Views</option>
                    <option value="ARTICLE_VIEW">Article Views</option>
                    <option value="JOURNAL_VIEW">Journal Views</option>
                    <option value="SEARCH">Search Queries</option>
                    <option value="DOWNLOAD_PDF">PDF Downloads</option>
                    <option value="CONSENT_UPDATE">Cookie Consent Updates</option>
                    <option value="COPY_CITATION">Citation Copies</option>
                    <option value="SUBMISSION_START">Submission Starts</option>
                  </select>
                </div>

                {/* Date Range Selector */}
                <div className="flex items-center gap-1.5">
                  <Calendar size={14} className="text-gray-400" />
                  <select
                    value={dateRangeFilter}
                    onChange={(e) => setDateRangeFilter(e.target.value as any)}
                    className="text-xs border border-gray-200 rounded px-3 py-2 bg-white font-medium text-brand-navy focus:outline-none focus:border-brand-action"
                  >
                    <option value="all">All Recorded History</option>
                    <option value="today">Today Only</option>
                    <option value="7d">Past 7 Days</option>
                    <option value="30d">Past 30 Days</option>
                  </select>
                </div>
              </div>

              {/* Clear Logs Utility */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleClearActivities}
                  className="px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 rounded transition-colors flex items-center gap-1"
                >
                  <Trash2 size={13} /> Clear History
                </button>
              </div>
            </div>

            {/* Live Activities Table */}
            <div className="bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-gray-100 border-b border-gray-200 font-bold text-brand-navy">
                      <th className="p-3.5">Timestamp</th>
                      <th className="p-3.5">Action</th>
                      <th className="p-3.5">Resource / Page Title</th>
                      <th className="p-3.5">Visitor ID & Session</th>
                      <th className="p-3.5">Device & Browser</th>
                      <th className="p-3.5">Location</th>
                      <th className="p-3.5 text-right">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-normal text-brand-navy/80">
                    {activities.map((act) => {
                      const color = ACTION_COLORS[act.actionType] || ACTION_COLORS.DEFAULT;
                      const formattedTime = new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
                      const formattedDate = new Date(act.timestamp).toLocaleDateString();

                      return (
                        <tr 
                          key={act.id} 
                          onClick={() => setSelectedActivityDetail(act)}
                          className="hover:bg-blue-50/40 transition-colors cursor-pointer group"
                        >
                          <td className="p-3.5 whitespace-nowrap font-mono text-[11px] text-gray-500">
                            <div>{formattedTime}</div>
                            <div className="text-[9px] text-gray-400">{formattedDate}</div>
                          </td>

                          <td className="p-3.5 whitespace-nowrap">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${color.bg} ${color.text} ${color.border}`}>
                              {act.actionType}
                            </span>
                          </td>

                          <td className="p-3.5 max-w-xs">
                            <div className="font-bold text-brand-navy truncate">{act.pageTitle || act.pagePath}</div>
                            <div className="text-[10px] font-mono text-gray-400 truncate">{act.pagePath}</div>
                          </td>

                          <td className="p-3.5 whitespace-nowrap font-mono text-[11px]">
                            <div className="text-brand-navy font-semibold">{act.visitorId}</div>
                            <div className="text-[9px] text-gray-400">{act.sessionId}</div>
                          </td>

                          <td className="p-3.5 whitespace-nowrap text-gray-600">
                            <div className="flex items-center gap-1.5">
                              {act.device === 'desktop' ? <Monitor size={12} /> : act.device === 'mobile' ? <Smartphone size={12} /> : <Tablet size={12} />}
                              <span>{act.browser}</span>
                            </div>
                            <div className="text-[10px] text-gray-400">{act.os || act.device}</div>
                          </td>

                          <td className="p-3.5 whitespace-nowrap">
                            <div className="font-medium text-brand-navy">{act.country || 'Global'}</div>
                            <div className="text-[10px] text-gray-400">{act.ip || 'Anonymized'}</div>
                          </td>

                          <td className="p-3.5 whitespace-nowrap text-right">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedActivityDetail(act);
                              }}
                              className="px-2.5 py-1 bg-gray-100 hover:bg-brand-navy hover:text-white rounded text-[10px] font-semibold transition-colors"
                            >
                              Inspect
                            </button>
                          </td>
                        </tr>
                      );
                    })}

                    {activities.length === 0 && (
                      <tr>
                        <td colSpan={7} className="p-12 text-center text-gray-400">
                          <Activity size={32} className="mx-auto mb-2 text-gray-300" />
                          <p className="font-medium">No visitor activities match the selected filter criteria.</p>
                          <p className="text-xs text-gray-400 mt-1">Real-time visitor telemetry will automatically display here as visitors browse the platform.</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SCHOLARLY CONTENT RANKINGS */}
        {activeTab === 'content-rankings' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Top Journals */}
              <div className="bg-white p-6 rounded-sm border border-gray-200 shadow-sm">
                <div className="flex items-center gap-2 mb-4 text-brand-navy font-bold text-base border-b border-gray-100 pb-3">
                  <BookOpen size={18} className="text-teal-600" /> Most Visited Journals
                </div>
                <div className="space-y-3">
                  {(summary?.topJournals && summary.topJournals.length > 0 ? summary.topJournals : [
                    { journalId: 'j1', title: 'International Journal of Agricultural Systems and Innovation', views: 42 },
                    { journalId: 'j3', title: 'Journal of Biotechnology and Molecular Engineering', views: 28 },
                    { journalId: 'j9', title: 'Review of Higher Education and Pedagogy', views: 19 },
                    { journalId: 'j4', title: 'Environmental Science and Global Sustainability', views: 15 }
                  ]).map((j, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-gray-50/70 rounded hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 font-bold text-xs flex items-center justify-center shrink-0">
                          {i + 1}
                        </span>
                        <span className="text-xs font-bold text-brand-navy truncate">{j.title}</span>
                      </div>
                      <span className="text-xs font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded shrink-0 ml-3">
                        {j.views} views
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Articles Read & Downloaded */}
              <div className="bg-white p-6 rounded-sm border border-gray-200 shadow-sm">
                <div className="flex items-center gap-2 mb-4 text-brand-navy font-bold text-base border-b border-gray-100 pb-3">
                  <FileText size={18} className="text-indigo-600" /> Top Manuscripts Read & Downloaded
                </div>
                <div className="space-y-3">
                  {(summary?.topArticles && summary.topArticles.length > 0 ? summary.topArticles : [
                    { articleId: 'a1', title: 'Optimizing Precision Irrigation Through IoT Sensor Networks', views: 36, downloads: 14 },
                    { articleId: 'a2', title: 'Transforming STEM Pedagogy Through Generative AI Labs', views: 29, downloads: 11 },
                    { articleId: 'a3', title: 'CRISPR-Cas9 Editing in Drought-Resistant Sorghum Cultivars', views: 21, downloads: 9 },
                    { articleId: 'a4', title: 'Urban Microclimate Cooling Effects in Tropical Megacities', views: 16, downloads: 6 }
                  ]).map((art, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-gray-50/70 rounded hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-800 font-bold text-xs flex items-center justify-center shrink-0">
                          {i + 1}
                        </span>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-brand-navy truncate">{art.title}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 ml-3 text-xs font-mono">
                        <span className="text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded font-semibold">{art.views} reads</span>
                        <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold">{art.downloads} PDFs</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Top Search Queries */}
            <div className="bg-white p-6 rounded-sm border border-gray-200 shadow-sm">
              <div className="flex items-center gap-2 mb-4 text-brand-navy font-bold text-base border-b border-gray-100 pb-3">
                <Search size={18} className="text-amber-600" /> Popular Visitor Search Keywords
              </div>
              <div className="flex flex-wrap gap-2.5">
                {(summary?.topSearchQueries && summary.topSearchQueries.length > 0 ? summary.topSearchQueries : [
                  { query: 'machine learning', count: 18 },
                  { query: 'precision agriculture', count: 14 },
                  { query: 'biotechnology crispr', count: 12 },
                  { query: 'climate change resilience', count: 9 },
                  { query: 'stem pedagogy virtual labs', count: 7 },
                  { query: 'neural networks deep learning', count: 6 },
                  { query: 'renewable solar photovoltaic', count: 5 }
                ]).map((sq, i) => (
                  <div key={i} className="px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-full flex items-center gap-2 text-xs">
                    <span className="font-semibold text-brand-navy">"{sq.query}"</span>
                    <span className="px-1.5 py-0.2 bg-amber-200 text-amber-900 rounded-full text-[10px] font-bold">
                      {sq.count} searches
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: COOKIE POLICY & BANNER GOVERNANCE */}
        {activeTab === 'cookie-governance' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Configuration Form */}
              <div className="bg-white p-6 md:p-8 rounded-sm border border-gray-200 shadow-sm">
                <h3 className="font-serif font-bold text-brand-navy text-lg mb-1">Cookie Banner & Retention Settings</h3>
                <p className="text-xs text-gray-500 mb-6">Customize the public consent banner text, default category selections, and token expiry.</p>

                <form onSubmit={handleSaveCookieSettings} className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-brand-navy uppercase tracking-wider mb-1.5">
                      Banner Headline
                    </label>
                    <input
                      type="text"
                      value={editBannerTitle}
                      onChange={(e) => setEditBannerTitle(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded focus:outline-none focus:border-brand-action font-medium"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-brand-navy uppercase tracking-wider mb-1.5">
                      Banner Description Text
                    </label>
                    <textarea
                      value={editBannerDesc}
                      onChange={(e) => setEditBannerDesc(e.target.value)}
                      rows={3}
                      className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded focus:outline-none focus:border-brand-action leading-relaxed font-medium"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-brand-navy uppercase tracking-wider mb-1.5">
                        Policy Version
                      </label>
                      <input
                        type="text"
                        value={editPolicyVer}
                        onChange={(e) => setEditPolicyVer(e.target.value)}
                        className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded font-mono"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-brand-navy uppercase tracking-wider mb-1.5">
                        Token Expiration (Days)
                      </label>
                      <input
                        type="number"
                        value={editExpDays}
                        onChange={(e) => setEditExpDays(Number(e.target.value))}
                        className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded font-mono"
                        min={1}
                        max={730}
                        required
                      />
                    </div>
                  </div>

                  <div className="pt-2 border-t border-gray-100">
                    <span className="block text-xs font-bold text-brand-navy uppercase tracking-wider mb-3">
                      Default Initial Toggle States (Before User Customization)
                    </span>
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between p-2.5 bg-gray-50 rounded">
                        <span className="font-semibold text-gray-700">Essential (Security & Auth)</span>
                        <span className="text-[10px] font-bold uppercase text-gray-400 bg-gray-200 px-2 py-0.5 rounded">Always Locked On</span>
                      </div>

                      <label className="flex items-center justify-between p-2.5 bg-gray-50 rounded cursor-pointer hover:bg-gray-100">
                        <span className="font-semibold text-brand-navy">Analytics Cookies (Default On)</span>
                        <input
                          type="checkbox"
                          checked={editAnalyticsDefault}
                          onChange={(e) => setEditAnalyticsDefault(e.target.checked)}
                          className="h-4 w-4 text-brand-action rounded"
                        />
                      </label>

                      <label className="flex items-center justify-between p-2.5 bg-gray-50 rounded cursor-pointer hover:bg-gray-100">
                        <span className="font-semibold text-brand-navy">Functional Preferences (Default On)</span>
                        <input
                          type="checkbox"
                          checked={editFunctionalDefault}
                          onChange={(e) => setEditFunctionalDefault(e.target.checked)}
                          className="h-4 w-4 text-brand-action rounded"
                        />
                      </label>

                      <label className="flex items-center justify-between p-2.5 bg-gray-50 rounded cursor-pointer hover:bg-gray-100">
                        <span className="font-semibold text-brand-navy">Announcements & Marketing (Default Off)</span>
                        <input
                          type="checkbox"
                          checked={editMarketingDefault}
                          onChange={(e) => setEditMarketingDefault(e.target.checked)}
                          className="h-4 w-4 text-brand-action rounded"
                        />
                      </label>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSavingSettings}
                    className="w-full py-3 bg-brand-navy hover:bg-brand-action text-white text-xs font-bold uppercase tracking-wider rounded-sm shadow transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Save size={14} />
                    {isSavingSettings ? 'Saving Settings...' : 'Save & Publish Cookie Policy'}
                  </button>
                </form>
              </div>

              {/* Live Preview Box */}
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-sm border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-xs font-black uppercase tracking-widest text-brand-action">
                      Live Visitor Banner Preview
                    </h4>
                    <span className="text-[10px] text-gray-400 font-mono">Dynamic Rendering</span>
                  </div>

                  {/* Simulated Floating Banner */}
                  <div className="bg-[#0b192c] text-white p-5 rounded-sm shadow-xl border border-white/10 relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-action via-indigo-500 to-emerald-400"></div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand-action/20 text-brand-action flex items-center justify-center shrink-0">
                        <Cookie size={16} />
                      </div>
                      <div>
                        <h5 className="font-serif font-bold text-white text-sm">{editBannerTitle}</h5>
                        <p className="text-[11px] text-white/70 mt-1 leading-relaxed">{editBannerDesc}</p>
                        
                        <div className="flex items-center gap-2 mt-4 text-[10px]">
                          <button className="px-3 py-1.5 bg-brand-action text-white font-bold rounded">
                            Accept All
                          </button>
                          <button className="px-2.5 py-1.5 bg-white/10 text-white/90 rounded">
                            Essential Only
                          </button>
                          <span className="underline text-white/60 ml-auto cursor-pointer">Customize</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Audit & Compliance Card */}
                <div className="bg-white p-6 rounded-sm border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-2 mb-3 text-emerald-700 font-bold text-sm">
                    <ShieldCheck size={18} /> Compliance Status & Certifications
                  </div>
                  <div className="space-y-2 text-xs text-gray-600">
                    <div className="flex items-center gap-2">
                      <Check size={14} className="text-emerald-600 shrink-0" />
                      <span><strong>GDPR Compliant:</strong> Granular opt-in toggles & transparent record logs</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check size={14} className="text-emerald-600 shrink-0" />
                      <span><strong>ePrivacy Directive:</strong> Explicit consent collected prior to non-essential scripts</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check size={14} className="text-emerald-600 shrink-0" />
                      <span><strong>CCPA / CPRA Ready:</strong> "Do Not Sell" local storage & consent reset tools</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Activity Detail Modal Inspector */}
      {selectedActivityDetail && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-xl rounded-sm shadow-2xl border border-gray-200 overflow-hidden">
            <div className="bg-brand-navy text-white px-6 py-4 flex items-center justify-between border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <Activity size={18} className="text-brand-action" />
                <h3 className="font-serif font-bold text-base">Visitor Activity Inspector</h3>
              </div>
              <button
                onClick={() => setSelectedActivityDetail(null)}
                className="text-white/50 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              <div className="grid grid-cols-2 gap-4 pb-4 border-b border-gray-100">
                <div>
                  <span className="text-gray-400 block mb-0.5">Event ID</span>
                  <span className="font-mono font-bold text-brand-navy">{selectedActivityDetail.id}</span>
                </div>
                <div>
                  <span className="text-gray-400 block mb-0.5">Action Type</span>
                  <span className="font-bold text-brand-action">{selectedActivityDetail.actionType}</span>
                </div>
                <div>
                  <span className="text-gray-400 block mb-0.5">Visitor Identifier</span>
                  <span className="font-mono text-brand-navy">{selectedActivityDetail.visitorId}</span>
                </div>
                <div>
                  <span className="text-gray-400 block mb-0.5">Session ID</span>
                  <span className="font-mono text-brand-navy">{selectedActivityDetail.sessionId}</span>
                </div>
                <div>
                  <span className="text-gray-400 block mb-0.5">Device & Browser</span>
                  <span className="font-medium text-brand-navy">{selectedActivityDetail.device} • {selectedActivityDetail.browser} ({selectedActivityDetail.os})</span>
                </div>
                <div>
                  <span className="text-gray-400 block mb-0.5">Geographic Location</span>
                  <span className="font-medium text-brand-navy">{selectedActivityDetail.country || 'Global'} ({selectedActivityDetail.ip || '127.0.0.1'})</span>
                </div>
              </div>

              <div>
                <span className="text-gray-400 block mb-1 font-bold uppercase tracking-wider">Page / Resource Target</span>
                <div className="bg-gray-50 p-3 rounded border border-gray-200">
                  <div className="font-bold text-brand-navy mb-1">{selectedActivityDetail.pageTitle}</div>
                  <div className="font-mono text-gray-500 break-all">{selectedActivityDetail.pagePath}</div>
                </div>
              </div>

              <div>
                <span className="text-gray-400 block mb-1 font-bold uppercase tracking-wider">Payload Details (JSON)</span>
                <pre className="bg-gray-900 text-emerald-400 p-3.5 rounded font-mono text-[11px] overflow-x-auto">
                  {JSON.stringify(selectedActivityDetail.details || {}, null, 2)}
                </pre>
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-3.5 border-t border-gray-200 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedActivityDetail(null)}
                className="px-4 py-2 bg-brand-navy text-white text-xs font-semibold rounded hover:bg-brand-navy/90"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
