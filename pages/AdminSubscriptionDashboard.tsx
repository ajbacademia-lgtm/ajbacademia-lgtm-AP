import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, 
  Mail, 
  UserCheck, 
  UserX, 
  TrendingUp, 
  Send, 
  Download, 
  Plus, 
  Search, 
  Filter, 
  Trash2, 
  Edit, 
  RefreshCw, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  ChevronLeft, 
  Calendar, 
  Tag, 
  Globe, 
  Building, 
  Sparkles, 
  CheckSquare, 
  Square, 
  BarChart3, 
  PieChart, 
  Clock, 
  FileText, 
  ShieldCheck, 
  Loader2, 
  ExternalLink,
  ChevronDown,
  X
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { NewsletterClientService } from '../src/services/newsletterClientService';
import { 
  NewsletterSubscriber, 
  SubscriberStatus, 
  NewsletterFrequency, 
  NewsletterAnalyticsSummary, 
  NewsletterCampaign 
} from '../types';

const ALL_TOPICS = [
  'Medicine & Healthcare',
  'Computer Science & AI',
  'Engineering & Tech',
  'Life Sciences & Biology',
  'Social Sciences & Humanities',
  'Business & Economics',
  'All Disciplines & Research Updates'
];

export const AdminSubscriptionDashboard: React.FC = () => {
  const { authState } = useAuth();
  const navigate = useNavigate();

  // Active Tab
  const [activeTab, setActiveTab] = useState<'subscribers' | 'campaigns' | 'analytics'>('subscribers');

  // Subscribers Data
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [analytics, setAnalytics] = useState<NewsletterAnalyticsSummary | null>(null);
  const [campaigns, setCampaigns] = useState<NewsletterCampaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [topicFilter, setTopicFilter] = useState<string>('All');
  const [frequencyFilter, setFrequencyFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'email' | 'name'>('newest');

  // Selection for Batch Actions
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingSubscriber, setEditingSubscriber] = useState<NewsletterSubscriber | null>(null);
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);

  // Form State for Add / Edit
  const [formEmail, setFormEmail] = useState('');
  const [formName, setFormName] = useState('');
  const [formInstitution, setFormInstitution] = useState('');
  const [formCountry, setFormCountry] = useState('');
  const [formStatus, setFormStatus] = useState<SubscriberStatus>('Active');
  const [formFrequency, setFormFrequency] = useState<NewsletterFrequency>('Weekly');
  const [formTopics, setFormTopics] = useState<string[]>(['All Disciplines & Research Updates']);
  const [formNotes, setFormNotes] = useState('');
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);

  // Broadcast Form State
  const [broadcastSubject, setBroadcastSubject] = useState('');
  const [broadcastPreview, setBroadcastPreview] = useState('');
  const [broadcastContent, setBroadcastContent] = useState('');
  const [broadcastTargetTopic, setBroadcastTargetTopic] = useState('all');
  const [broadcastFrequency, setBroadcastFrequency] = useState('All');
  const [isSendingBroadcast, setIsSendingBroadcast] = useState(false);
  const [broadcastPreviewMode, setBroadcastPreviewMode] = useState(false);

  // Authentication check
  useEffect(() => {
    if (!authState.isAuthenticated || authState.user?.role !== 'admin') {
      navigate('/admindashboard/login');
    }
  }, [authState, navigate]);

  // Load all initial data
  const loadData = async (silent = false) => {
    if (!silent) setIsLoading(true);
    else setIsRefreshing(true);

    try {
      const [subsData, analyticsData, campaignsData] = await Promise.all([
        NewsletterClientService.getSubscribers(),
        NewsletterClientService.getAnalytics(),
        NewsletterClientService.getCampaignHistory()
      ]);

      setSubscribers(subsData);
      setAnalytics(analyticsData);
      setCampaigns(campaignsData);
    } catch (err: any) {
      console.error('Failed to load subscriber dashboard data:', err);
      setStatusMessage({ type: 'error', text: err.message || 'Failed to load subscriber data' });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filtered & Sorted subscribers
  const filteredSubscribers = useMemo(() => {
    let result = [...subscribers];

    // Status filter
    if (statusFilter !== 'All') {
      result = result.filter(s => s.status === statusFilter);
    }

    // Topic filter
    if (topicFilter !== 'All') {
      result = result.filter(s => s.topics && s.topics.some(t => t.toLowerCase().includes(topicFilter.toLowerCase())));
    }

    // Frequency filter
    if (frequencyFilter !== 'All') {
      result = result.filter(s => s.frequency === frequencyFilter);
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(s => 
        (s.email && s.email.toLowerCase().includes(q)) ||
        (s.name && s.name.toLowerCase().includes(q)) ||
        (s.institution && s.institution.toLowerCase().includes(q)) ||
        (s.country && s.country.toLowerCase().includes(q)) ||
        (s.source && s.source.toLowerCase().includes(q)) ||
        (s.notes && s.notes.toLowerCase().includes(q))
      );
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.subscribedAt || 0).getTime() - new Date(a.subscribedAt || 0).getTime();
      }
      if (sortBy === 'oldest') {
        return new Date(a.subscribedAt || 0).getTime() - new Date(b.subscribedAt || 0).getTime();
      }
      if (sortBy === 'email') {
        return (a.email || '').localeCompare(b.email || '');
      }
      if (sortBy === 'name') {
        return (a.name || '').localeCompare(b.name || '');
      }
      return 0;
    });

    return result;
  }, [subscribers, statusFilter, topicFilter, frequencyFilter, searchQuery, sortBy]);

  // Selection Helpers
  const toggleSelectAll = () => {
    if (selectedIds.length === filteredSubscribers.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredSubscribers.map(s => s.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // Add Subscriber
  const handleOpenAdd = () => {
    setFormEmail('');
    setFormName('');
    setFormInstitution('');
    setFormCountry('');
    setFormStatus('Active');
    setFormFrequency('Weekly');
    setFormTopics(['All Disciplines & Research Updates']);
    setFormNotes('');
    setShowAddModal(true);
  };

  const handleSaveNewSubscriber = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingForm(true);
    try {
      const newSub = await NewsletterClientService.createSubscriber({
        email: formEmail,
        name: formName,
        institution: formInstitution,
        country: formCountry,
        status: formStatus,
        frequency: formFrequency,
        topics: formTopics,
        notes: formNotes,
        source: 'Admin Manual Entry'
      });

      setSubscribers([newSub, ...subscribers]);
      setShowAddModal(false);
      setStatusMessage({ type: 'success', text: `Subscriber "${formEmail}" added successfully!` });
      loadData(true);
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Failed to create subscriber' });
    } finally {
      setIsSubmittingForm(false);
    }
  };

  // Edit Subscriber
  const handleOpenEdit = (sub: NewsletterSubscriber) => {
    setEditingSubscriber(sub);
    setFormEmail(sub.email);
    setFormName(sub.name || '');
    setFormInstitution(sub.institution || '');
    setFormCountry(sub.country || '');
    setFormStatus(sub.status);
    setFormFrequency(sub.frequency);
    setFormTopics(sub.topics && sub.topics.length > 0 ? sub.topics : ['All Disciplines & Research Updates']);
    setFormNotes(sub.notes || '');
    setShowEditModal(true);
  };

  const handleSaveEditSubscriber = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSubscriber) return;
    setIsSubmittingForm(true);
    try {
      const updated = await NewsletterClientService.updateSubscriber(editingSubscriber.id, {
        email: formEmail,
        name: formName,
        institution: formInstitution,
        country: formCountry,
        status: formStatus,
        frequency: formFrequency,
        topics: formTopics,
        notes: formNotes,
      });

      setSubscribers(subscribers.map(s => s.id === updated.id ? updated : s));
      setShowEditModal(false);
      setStatusMessage({ type: 'success', text: `Subscriber "${formEmail}" updated successfully!` });
      loadData(true);
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Failed to update subscriber' });
    } finally {
      setIsSubmittingForm(false);
    }
  };

  // Quick Status Toggle
  const handleToggleStatus = async (sub: NewsletterSubscriber) => {
    const newStatus: SubscriberStatus = sub.status === 'Active' ? 'Unsubscribed' : 'Active';
    try {
      const updated = await NewsletterClientService.updateSubscriber(sub.id, { status: newStatus });
      setSubscribers(subscribers.map(s => s.id === updated.id ? updated : s));
      setStatusMessage({ 
        type: 'success', 
        text: `Subscriber "${sub.email}" marked as ${newStatus}` 
      });
      loadData(true);
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Failed to update status' });
    }
  };

  // Delete Single Subscriber
  const handleDeleteSubscriber = async (sub: NewsletterSubscriber) => {
    if (!window.confirm(`Are you sure you want to permanently delete subscriber "${sub.email}"?`)) {
      return;
    }
    try {
      await NewsletterClientService.deleteSubscriber(sub.id);
      setSubscribers(subscribers.filter(s => s.id !== sub.id));
      setSelectedIds(selectedIds.filter(i => i !== sub.id));
      setStatusMessage({ type: 'success', text: `Subscriber "${sub.email}" deleted permanently.` });
      loadData(true);
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Failed to delete subscriber' });
    }
  };

  // Bulk Status Update
  const handleBulkStatus = async (status: SubscriberStatus) => {
    if (selectedIds.length === 0) return;
    try {
      const count = await NewsletterClientService.bulkUpdateStatus(selectedIds, status);
      setStatusMessage({ type: 'success', text: `Updated ${count} subscribers to ${status}` });
      setSelectedIds([]);
      loadData(true);
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Failed to bulk update status' });
    }
  };

  // Bulk Delete
  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!window.confirm(`Are you sure you want to delete ${selectedIds.length} selected subscribers? This cannot be undone.`)) {
      return;
    }
    try {
      const count = await NewsletterClientService.bulkDelete(selectedIds);
      setStatusMessage({ type: 'success', text: `Deleted ${count} subscribers.` });
      setSelectedIds([]);
      loadData(true);
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Failed to bulk delete subscribers' });
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    const listToExport = selectedIds.length > 0
      ? subscribers.filter(s => selectedIds.includes(s.id))
      : filteredSubscribers;

    if (listToExport.length === 0) {
      alert('No subscribers to export.');
      return;
    }

    const headers = ['ID', 'Email', 'Name', 'Institution', 'Country', 'Status', 'Frequency', 'Topics', 'Subscribed Date', 'Source', 'Notes'];
    const rows = listToExport.map(s => [
      s.id,
      `"${s.email}"`,
      `"${(s.name || '').replace(/"/g, '""')}"`,
      `"${(s.institution || '').replace(/"/g, '""')}"`,
      `"${(s.country || '').replace(/"/g, '""')}"`,
      s.status,
      s.frequency,
      `"${(s.topics || []).join(', ')}"`,
      s.subscribedAt,
      `"${(s.source || '').replace(/"/g, '""')}"`,
      `"${(s.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `academic_subscribers_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setStatusMessage({ type: 'success', text: `Exported ${listToExport.length} subscribers to CSV.` });
  };

  // Broadcast Campaign
  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastSubject.trim() || !broadcastContent.trim()) {
      alert('Please fill in both the Subject and Content body.');
      return;
    }

    setIsSendingBroadcast(true);
    try {
      const campaign = await NewsletterClientService.sendBroadcastCampaign({
        subject: broadcastSubject,
        previewText: broadcastPreview,
        content: broadcastContent,
        targetTopics: broadcastTargetTopic === 'all' ? ['all'] : [broadcastTargetTopic],
        targetFrequency: broadcastFrequency,
        createdBy: authState.user?.name || authState.user?.email || 'Admin Editor'
      });

      setCampaigns([campaign, ...campaigns]);
      setShowBroadcastModal(false);
      setBroadcastSubject('');
      setBroadcastPreview('');
      setBroadcastContent('');
      setStatusMessage({ 
        type: 'success', 
        text: `Campaign broadcast successfully to ${campaign.recipientCount} active subscribers!` 
      });
      loadData(true);
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Failed to send broadcast campaign' });
    } finally {
      setIsSendingBroadcast(false);
    }
  };

  // Topic checkbox helper
  const handleTopicCheck = (topic: string) => {
    if (topic === 'All Disciplines & Research Updates') {
      setFormTopics(['All Disciplines & Research Updates']);
      return;
    }

    let updated = formTopics.filter(t => t !== 'All Disciplines & Research Updates');
    if (updated.includes(topic)) {
      updated = updated.filter(t => t !== topic);
    } else {
      updated.push(topic);
    }

    if (updated.length === 0) {
      updated = ['All Disciplines & Research Updates'];
    }
    setFormTopics(updated);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Top Header Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="container mx-auto px-4 md:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Link 
                to="/admindashboard" 
                className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 hover:text-brand-navy transition-colors"
                title="Back to Admin Dashboards"
              >
                <ChevronLeft size={20} />
              </Link>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl md:text-2xl font-serif font-bold text-brand-navy">
                    Subscription & Newsletter Dashboard
                  </h1>
                  <span className="px-2.5 py-0.5 bg-brand-light text-brand-navy text-xs font-bold rounded-full border border-brand-navy/10">
                    Live Subscribers: {analytics?.totalSubscribers ?? subscribers.length}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  Manage email subscribers, journal digest deliveries, discipline segments, and broadcast announcements.
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => loadData(true)}
                disabled={isRefreshing}
                className="p-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-semibold"
                title="Refresh subscribers"
              >
                <RefreshCw size={15} className={isRefreshing ? 'animate-spin' : ''} />
                <span className="hidden sm:inline">Refresh</span>
              </button>

              <button
                onClick={handleExportCSV}
                className="px-3.5 py-2.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-semibold shadow-sm"
              >
                <Download size={15} />
                <span>Export CSV {selectedIds.length > 0 ? `(${selectedIds.length})` : ''}</span>
              </button>

              <button
                onClick={() => setShowBroadcastModal(true)}
                className="px-3.5 py-2.5 bg-brand-action hover:bg-[#0047b3] text-white rounded-lg transition-colors flex items-center gap-1.5 text-xs font-bold shadow-sm"
              >
                <Send size={15} />
                <span>Broadcast Announcement</span>
              </button>

              <button
                onClick={handleOpenAdd}
                className="px-3.5 py-2.5 bg-brand-navy hover:bg-brand-navy-light text-white rounded-lg transition-colors flex items-center gap-1.5 text-xs font-bold shadow-sm"
              >
                <Plus size={15} />
                <span>Add Subscriber</span>
              </button>
            </div>
          </div>

          {/* Sub Navigation Tabs */}
          <div className="flex gap-6 mt-4 border-t border-gray-100 pt-3">
            <button
              onClick={() => setActiveTab('subscribers')}
              className={`text-xs font-bold uppercase tracking-wider pb-2 border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === 'subscribers'
                  ? 'border-brand-action text-brand-action'
                  : 'border-transparent text-gray-500 hover:text-brand-navy'
              }`}
            >
              <Users size={14} />
              <span>Subscribers List ({subscribers.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`text-xs font-bold uppercase tracking-wider pb-2 border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === 'analytics'
                  ? 'border-brand-action text-brand-action'
                  : 'border-transparent text-gray-500 hover:text-brand-navy'
              }`}
            >
              <BarChart3 size={14} />
              <span>Audience Breakdown & Stats</span>
            </button>

            <button
              onClick={() => setActiveTab('campaigns')}
              className={`text-xs font-bold uppercase tracking-wider pb-2 border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === 'campaigns'
                  ? 'border-brand-action text-brand-action'
                  : 'border-transparent text-gray-500 hover:text-brand-navy'
              }`}
            >
              <FileText size={14} />
              <span>Broadcast History ({campaigns.length})</span>
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 pt-6">
        {/* Status Toast Message */}
        {statusMessage && (
          <div className={`p-4 mb-6 rounded-lg flex items-center justify-between shadow-sm border ${
            statusMessage.type === 'success' 
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
              : 'bg-red-50 text-red-800 border-red-200'
          }`}>
            <div className="flex items-center gap-2.5 text-xs font-medium">
              {statusMessage.type === 'success' ? <CheckCircle2 size={16} className="text-emerald-600" /> : <AlertCircle size={16} className="text-red-600" />}
              <span>{statusMessage.text}</span>
            </div>
            <button onClick={() => setStatusMessage(null)} className="text-gray-400 hover:text-gray-600">
              <X size={14} />
            </button>
          </div>
        )}

        {/* Executive Metrics Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between text-gray-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Total Subscribers</span>
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <Users size={16} />
              </div>
            </div>
            <div className="text-2xl font-bold text-brand-navy">{analytics?.totalSubscribers ?? subscribers.length}</div>
            <div className="text-[11px] text-gray-500 mt-1 flex items-center gap-1">
              <TrendingUp size={12} className="text-emerald-600" />
              <span>{analytics?.newThisMonth ?? 0} new this month</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between text-gray-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Active Audience</span>
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                <UserCheck size={16} />
              </div>
            </div>
            <div className="text-2xl font-bold text-emerald-700">{analytics?.activeSubscribers ?? subscribers.filter(s => s.status === 'Active').length}</div>
            <div className="text-[11px] text-gray-500 mt-1">
              {subscribers.length > 0 
                ? `${Math.round(((analytics?.activeSubscribers ?? subscribers.filter(s => s.status === 'Active').length) / subscribers.length) * 100)}% of audience` 
                : '0 active'}
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between text-gray-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Unsubscribed</span>
              <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                <UserX size={16} />
              </div>
            </div>
            <div className="text-2xl font-bold text-amber-700">{analytics?.unsubscribedCount ?? subscribers.filter(s => s.status === 'Unsubscribed').length}</div>
            <div className="text-[11px] text-gray-500 mt-1">
              {subscribers.length > 0 
                ? `${Math.round(((analytics?.unsubscribedCount ?? subscribers.filter(s => s.status === 'Unsubscribed').length) / subscribers.length) * 100)}% opt-out rate` 
                : '0 opt-outs'}
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between text-gray-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Growth Rate</span>
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                <TrendingUp size={16} />
              </div>
            </div>
            <div className="text-2xl font-bold text-indigo-700">+{analytics?.growthRatePercent ?? 0}%</div>
            <div className="text-[11px] text-gray-500 mt-1">
              Calculated from new subscribers
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between text-gray-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Broadcast Campaigns</span>
              <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                <Send size={16} />
              </div>
            </div>
            <div className="text-2xl font-bold text-purple-700">{campaigns.length}</div>
            <div className="text-[11px] text-gray-500 mt-1">
              {campaigns.filter(c => c.status === 'Sent').length} campaign(s) sent
            </div>
          </div>
        </div>

        {/* TAB 1: SUBSCRIBERS LIST & MANAGEMENT TABLE */}
        {activeTab === 'subscribers' && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Search & Filter Bar */}
            <div className="p-4 md:p-6 border-b border-gray-200 bg-gray-50/50">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Search Field */}
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    placeholder="Search by email, name, institution, or origin source..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-brand-action focus:border-brand-action outline-none"
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>

                {/* Dropdown Filters */}
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-1.5 text-xs text-gray-600">
                    <Filter size={14} />
                    <span>Filters:</span>
                  </div>

                  {/* Status Filter */}
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs font-medium text-gray-700 focus:outline-none focus:ring-1 focus:ring-brand-action"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Active">Active Only</option>
                    <option value="Unsubscribed">Unsubscribed</option>
                    <option value="Pending">Pending</option>
                  </select>

                  {/* Topic Filter */}
                  <select
                    value={topicFilter}
                    onChange={(e) => setTopicFilter(e.target.value)}
                    className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs font-medium text-gray-700 focus:outline-none focus:ring-1 focus:ring-brand-action"
                  >
                    <option value="All">All Disciplines</option>
                    {ALL_TOPICS.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>

                  {/* Frequency Filter */}
                  <select
                    value={frequencyFilter}
                    onChange={(e) => setFrequencyFilter(e.target.value)}
                    className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs font-medium text-gray-700 focus:outline-none focus:ring-1 focus:ring-brand-action"
                  >
                    <option value="All">All Frequencies</option>
                    <option value="Weekly">Weekly Digest</option>
                    <option value="Monthly">Monthly Digest</option>
                    <option value="Breaking Alerts">Breaking Alerts</option>
                    <option value="Quarterly">Quarterly</option>
                  </select>

                  {/* Sort Order */}
                  <select
                    value={sortBy}
                    onChange={(e: any) => setSortBy(e.target.value)}
                    className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs font-medium text-gray-700 focus:outline-none focus:ring-1 focus:ring-brand-action"
                  >
                    <option value="newest">Sort: Newest First</option>
                    <option value="oldest">Sort: Oldest First</option>
                    <option value="email">Sort: Email (A-Z)</option>
                    <option value="name">Sort: Name (A-Z)</option>
                  </select>
                </div>
              </div>

              {/* Batch Action Bar (Visible when items selected) */}
              {selectedIds.length > 0 && (
                <div className="mt-4 p-3 bg-brand-navy text-white rounded-lg flex flex-wrap items-center justify-between gap-3 text-xs animate-fadeIn">
                  <div className="flex items-center gap-2 font-medium">
                    <CheckSquare size={16} className="text-brand-action" />
                    <span>{selectedIds.length} subscriber(s) selected</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleBulkStatus('Active')}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 rounded font-semibold transition-colors"
                    >
                      Set Active
                    </button>
                    <button
                      onClick={() => handleBulkStatus('Unsubscribed')}
                      className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 rounded font-semibold transition-colors"
                    >
                      Set Unsubscribed
                    </button>
                    <button
                      onClick={handleBulkDelete}
                      className="px-3 py-1.5 bg-red-600 hover:bg-red-700 rounded font-semibold transition-colors"
                    >
                      Delete Selected
                    </button>
                    <button
                      onClick={() => setSelectedIds([])}
                      className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded transition-colors"
                    >
                      Deselect
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Table Content */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-gray-100/80 text-gray-600 uppercase tracking-wider font-bold border-b border-gray-200">
                    <th className="py-3.5 px-4 w-10">
                      <button onClick={toggleSelectAll} className="text-gray-500 hover:text-brand-navy">
                        {selectedIds.length > 0 && selectedIds.length === filteredSubscribers.length ? (
                          <CheckSquare size={16} className="text-brand-action" />
                        ) : (
                          <Square size={16} />
                        )}
                      </button>
                    </th>
                    <th className="py-3.5 px-4">Subscriber</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Disciplines & Topics</th>
                    <th className="py-3.5 px-4">Frequency</th>
                    <th className="py-3.5 px-4">Subscribed Date</th>
                    <th className="py-3.5 px-4">Origin / Notes</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {isLoading ? (
                    <tr>
                      <td colSpan={8} className="py-16 text-center text-gray-500">
                        <Loader2 size={24} className="animate-spin mx-auto mb-2 text-brand-action" />
                        <span>Loading subscriber database...</span>
                      </td>
                    </tr>
                  ) : filteredSubscribers.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-16 text-center text-gray-500">
                        <Users size={32} className="mx-auto mb-2 text-gray-300" />
                        <p className="font-semibold text-gray-700 mb-1">No subscribers found</p>
                        <p className="text-[11px] text-gray-400">
                          {searchQuery || statusFilter !== 'All' || topicFilter !== 'All'
                            ? 'Try clearing your search query or filter settings.'
                            : 'No newsletter subscribers have registered yet.'}
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filteredSubscribers.map((sub) => {
                      const isSelected = selectedIds.includes(sub.id);
                      return (
                        <tr 
                          key={sub.id} 
                          className={`hover:bg-blue-50/40 transition-colors ${isSelected ? 'bg-blue-50/60' : ''}`}
                        >
                          {/* Checkbox */}
                          <td className="py-3.5 px-4">
                            <button onClick={() => toggleSelectOne(sub.id)} className="text-gray-500 hover:text-brand-navy">
                              {isSelected ? (
                                <CheckSquare size={16} className="text-brand-action" />
                              ) : (
                                <Square size={16} />
                              )}
                            </button>
                          </td>

                          {/* Subscriber Identity */}
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-gray-900 flex items-center gap-1.5">
                              <Mail size={13} className="text-gray-400" />
                              <span>{sub.email}</span>
                            </div>
                            {(sub.name || sub.institution) && (
                              <div className="text-[11px] text-gray-500 mt-0.5 flex items-center gap-2">
                                {sub.name && <span className="font-medium text-gray-700">{sub.name}</span>}
                                {sub.institution && (
                                  <span className="flex items-center gap-1 text-gray-500">
                                    <Building size={11} /> {sub.institution}
                                  </span>
                                )}
                                {sub.country && <span>({sub.country})</span>}
                              </div>
                            )}
                          </td>

                          {/* Status Badge */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <button
                              onClick={() => handleToggleStatus(sub)}
                              title="Click to toggle status"
                              className={`px-2.5 py-1 rounded-full text-[11px] font-bold inline-flex items-center gap-1 transition-transform active:scale-95 ${
                                sub.status === 'Active'
                                  ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                  : sub.status === 'Unsubscribed'
                                  ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${sub.status === 'Active' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                              <span>{sub.status}</span>
                            </button>
                          </td>

                          {/* Topics Chips */}
                          <td className="py-3.5 px-4 max-w-xs">
                            <div className="flex flex-wrap gap-1">
                              {sub.topics && sub.topics.length > 0 ? (
                                sub.topics.map(t => (
                                  <span key={t} className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-[10px] font-medium border border-gray-200">
                                    {t}
                                  </span>
                                ))
                              ) : (
                                <span className="text-gray-400 italic text-[11px]">All Disciplines</span>
                              )}
                            </div>
                          </td>

                          {/* Frequency */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded font-semibold text-[11px]">
                              {sub.frequency || 'Weekly'}
                            </span>
                          </td>

                          {/* Subscribed Date */}
                          <td className="py-3.5 px-4 whitespace-nowrap text-gray-600">
                            <div className="flex items-center gap-1">
                              <Calendar size={12} className="text-gray-400" />
                              <span>{new Date(sub.subscribedAt).toLocaleDateString()}</span>
                            </div>
                            <div className="text-[10px] text-gray-400 mt-0.5">
                              {new Date(sub.subscribedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </td>

                          {/* Source & Notes */}
                          <td className="py-3.5 px-4 max-w-xs">
                            <div className="text-gray-600 truncate">{sub.source || 'Website'}</div>
                            {sub.notes && (
                              <div className="text-[10px] text-gray-400 italic truncate" title={sub.notes}>
                                Note: {sub.notes}
                              </div>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 px-4 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleOpenEdit(sub)}
                                className="p-1.5 text-gray-500 hover:text-brand-action hover:bg-gray-100 rounded transition-colors"
                                title="Edit Subscriber"
                              >
                                <Edit size={14} />
                              </button>
                              <button
                                onClick={() => handleDeleteSubscriber(sub)}
                                className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                title="Delete Subscriber"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer / Summary */}
            <div className="p-4 border-t border-gray-200 bg-gray-50/70 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500">
              <div>
                Showing <strong>{filteredSubscribers.length}</strong> of <strong>{subscribers.length}</strong> total registered subscribers
              </div>
              <div className="flex items-center gap-4">
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Active: {subscribers.filter(s => s.status === 'Active').length}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  Unsubscribed: {subscribers.filter(s => s.status === 'Unsubscribed').length}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: AUDIENCE BREAKDOWN & ANALYTICS */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Discipline Breakdown */}
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
                  <h3 className="font-bold text-brand-navy text-sm flex items-center gap-2">
                    <Tag size={16} className="text-brand-action" />
                    <span>Popular Research Disciplines & Topics</span>
                  </h3>
                  <span className="text-xs text-gray-400">By Active Subscribers</span>
                </div>
                <div className="space-y-3.5">
                  {analytics?.topicBreakdown && analytics.topicBreakdown.length > 0 ? (
                    analytics.topicBreakdown.map(item => (
                      <div key={item.topic}>
                        <div className="flex justify-between items-center text-xs mb-1">
                          <span className="font-medium text-gray-700">{item.topic}</span>
                          <span className="font-bold text-brand-navy">{item.count} ({item.percentage}%)</span>
                        </div>
                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-brand-action rounded-full transition-all duration-500" 
                            style={{ width: `${Math.max(8, item.percentage)}%` }}
                          />
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-8 text-center text-gray-400 text-xs">
                      No discipline breakdown data available yet.
                    </div>
                  )}
                </div>
              </div>

              {/* Delivery Frequency Preferences */}
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
                  <h3 className="font-bold text-brand-navy text-sm flex items-center gap-2">
                    <Clock size={16} className="text-purple-600" />
                    <span>Delivery Frequency Distribution</span>
                  </h3>
                  <span className="text-xs text-gray-400">Subscriber Preference</span>
                </div>
                <div className="space-y-3.5">
                  {analytics?.frequencyBreakdown && analytics.frequencyBreakdown.length > 0 ? (
                    analytics.frequencyBreakdown.map(item => (
                      <div key={item.frequency}>
                        <div className="flex justify-between items-center text-xs mb-1">
                          <span className="font-medium text-gray-700">{item.frequency} Digest</span>
                          <span className="font-bold text-brand-navy">{item.count} ({item.percentage}%)</span>
                        </div>
                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-purple-600 rounded-full transition-all duration-500" 
                            style={{ width: `${Math.max(8, item.percentage)}%` }}
                          />
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-8 text-center text-gray-400 text-xs">
                      No frequency distribution recorded yet.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Subscriber Acquisition Source */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
                <h3 className="font-bold text-brand-navy text-sm flex items-center gap-2">
                  <Globe size={16} className="text-emerald-600" />
                  <span>Acquisition Channel & Origin</span>
                </h3>
                <span className="text-xs text-gray-400">Where users subscribed</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {analytics?.sourceBreakdown && analytics.sourceBreakdown.length > 0 ? (
                  analytics.sourceBreakdown.map(item => (
                    <div key={item.source} className="p-4 bg-gray-50 rounded-lg border border-gray-200/70">
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{item.source}</div>
                      <div className="text-xl font-bold text-brand-navy mt-1">{item.count} subscribers</div>
                      <div className="text-xs text-emerald-600 font-medium mt-0.5">{item.percentage}% of all subscribers</div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-3 py-6 text-center text-gray-400 text-xs">
                    No source channel statistics recorded yet.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: BROADCAST CAMPAIGN HISTORY */}
        {activeTab === 'campaigns' && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-brand-navy">Broadcast Announcements & Newsletter Campaigns</h3>
                <p className="text-xs text-gray-500 mt-0.5">Past digests sent to active academic subscribers</p>
              </div>
              <button
                onClick={() => setShowBroadcastModal(true)}
                className="px-4 py-2 bg-brand-action hover:bg-[#0047b3] text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 transition-colors"
              >
                <Send size={14} />
                <span>Create New Broadcast</span>
              </button>
            </div>

            <div className="divide-y divide-gray-200">
              {campaigns.length === 0 ? (
                <div className="py-16 text-center text-gray-500">
                  <Mail size={32} className="mx-auto mb-2 text-gray-300" />
                  <p className="font-semibold text-gray-700 mb-1">No Broadcast Campaigns Sent Yet</p>
                  <p className="text-[11px] text-gray-400 mb-4">
                    Send your first journal issue highlights or academic call-for-papers to active subscribers.
                  </p>
                  <button
                    onClick={() => setShowBroadcastModal(true)}
                    className="px-4 py-2 bg-brand-action hover:bg-[#0047b3] text-white text-xs font-bold rounded-lg shadow-sm transition-colors"
                  >
                    Compose Broadcast
                  </button>
                </div>
              ) : (
                campaigns.map((camp) => (
                  <div key={camp.id} className="p-6 hover:bg-gray-50/60 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <h4 className="text-base font-bold text-brand-navy flex items-center gap-2">
                        <span>{camp.subject}</span>
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded text-[10px] font-bold">
                          {camp.status}
                        </span>
                      </h4>
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Calendar size={12} />
                        {new Date(camp.createdAt).toLocaleString()}
                      </span>
                    </div>

                    {camp.previewText && (
                      <p className="text-xs text-gray-600 mb-3 italic">
                        "{camp.previewText}"
                      </p>
                    )}

                    <div className="bg-gray-50 p-4 rounded-lg text-xs text-gray-800 mb-4 font-mono whitespace-pre-wrap border border-gray-200 line-clamp-3">
                      {camp.content}
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 pt-2 border-t border-gray-100">
                      <span><strong>Recipients:</strong> {camp.recipientCount} subscribers</span>
                      <span><strong>Target:</strong> {(camp.targetTopics || []).join(', ')}</span>
                      <span><strong>Frequency:</strong> {camp.targetFrequency || 'All'}</span>
                      <span><strong>Sender:</strong> {camp.createdBy || 'Admin'}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* MODAL: ADD SUBSCRIBER */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden animate-scaleIn border border-gray-200">
            <div className="px-6 py-4 bg-brand-navy text-white flex items-center justify-between">
              <h3 className="font-serif font-bold text-base flex items-center gap-2">
                <Plus size={18} className="text-brand-action" />
                <span>Add New Newsletter Subscriber</span>
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-white/70 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveNewSubscriber} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  placeholder="author@university.edu"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-action outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    placeholder="Prof. John Doe"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-action outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Institution</label>
                  <input
                    type="text"
                    placeholder="Harvard University"
                    value={formInstitution}
                    onChange={(e) => setFormInstitution(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-action outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Status</label>
                  <select
                    value={formStatus}
                    onChange={(e: any) => setFormStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-action outline-none"
                  >
                    <option value="Active">Active</option>
                    <option value="Unsubscribed">Unsubscribed</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Delivery Frequency</label>
                  <select
                    value={formFrequency}
                    onChange={(e: any) => setFormFrequency(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-action outline-none"
                  >
                    <option value="Weekly">Weekly Digest</option>
                    <option value="Monthly">Monthly Digest</option>
                    <option value="Breaking Alerts">Breaking Alerts</option>
                    <option value="Quarterly">Quarterly</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1.5">Disciplines of Interest</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-36 overflow-y-auto p-2 bg-gray-50 rounded border border-gray-200">
                  {ALL_TOPICS.map(topic => (
                    <label key={topic} className="flex items-center gap-2 cursor-pointer text-[11px] text-gray-700">
                      <input
                        type="checkbox"
                        checked={formTopics.includes(topic)}
                        onChange={() => handleTopicCheck(topic)}
                        className="rounded text-brand-action focus:ring-brand-action"
                      />
                      <span>{topic}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Admin Notes (Optional)</label>
                <textarea
                  rows={2}
                  placeholder="e.g. VIP reviewer, editor contact..."
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-action outline-none"
                />
              </div>

              <div className="pt-3 border-t border-gray-200 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingForm}
                  className="px-5 py-2 bg-brand-navy hover:bg-brand-navy-light text-white rounded-lg font-bold flex items-center gap-1.5"
                >
                  {isSubmittingForm && <Loader2 size={14} className="animate-spin" />}
                  <span>Save Subscriber</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT SUBSCRIBER */}
      {showEditModal && editingSubscriber && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden animate-scaleIn border border-gray-200">
            <div className="px-6 py-4 bg-brand-navy text-white flex items-center justify-between">
              <h3 className="font-serif font-bold text-base flex items-center gap-2">
                <Edit size={18} className="text-brand-action" />
                <span>Edit Subscriber Details</span>
              </h3>
              <button onClick={() => setShowEditModal(false)} className="text-white/70 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEditSubscriber} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-action outline-none font-mono"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-action outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Institution</label>
                  <input
                    type="text"
                    value={formInstitution}
                    onChange={(e) => setFormInstitution(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-action outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Status</label>
                  <select
                    value={formStatus}
                    onChange={(e: any) => setFormStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-action outline-none font-semibold"
                  >
                    <option value="Active">Active</option>
                    <option value="Unsubscribed">Unsubscribed</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Delivery Frequency</label>
                  <select
                    value={formFrequency}
                    onChange={(e: any) => setFormFrequency(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-action outline-none"
                  >
                    <option value="Weekly">Weekly Digest</option>
                    <option value="Monthly">Monthly Digest</option>
                    <option value="Breaking Alerts">Breaking Alerts</option>
                    <option value="Quarterly">Quarterly</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1.5">Disciplines of Interest</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-36 overflow-y-auto p-2 bg-gray-50 rounded border border-gray-200">
                  {ALL_TOPICS.map(topic => (
                    <label key={topic} className="flex items-center gap-2 cursor-pointer text-[11px] text-gray-700">
                      <input
                        type="checkbox"
                        checked={formTopics.includes(topic)}
                        onChange={() => handleTopicCheck(topic)}
                        className="rounded text-brand-action focus:ring-brand-action"
                      />
                      <span>{topic}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Admin Notes</label>
                <textarea
                  rows={2}
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-action outline-none"
                />
              </div>

              <div className="pt-3 border-t border-gray-200 flex items-center justify-between">
                <div className="text-[10px] text-gray-400">
                  Subscribed: {new Date(editingSubscriber.subscribedAt).toLocaleDateString()}
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingForm}
                    className="px-5 py-2 bg-brand-action hover:bg-[#0047b3] text-white rounded-lg font-bold flex items-center gap-1.5"
                  >
                    {isSubmittingForm && <Loader2 size={14} className="animate-spin" />}
                    <span>Update Subscriber</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: BROADCAST CAMPAIGN */}
      {showBroadcastModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden animate-scaleIn border border-gray-200">
            <div className="px-6 py-4 bg-brand-navy text-white flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-base flex items-center gap-2">
                  <Send size={18} className="text-brand-action" />
                  <span>Broadcast Newsletter / Editorial Digest</span>
                </h3>
                <p className="text-[11px] text-white/70">
                  Targeted to {subscribers.filter(s => s.status === 'Active').length} active verified subscribers
                </p>
              </div>
              <button onClick={() => setShowBroadcastModal(false)} className="text-white/70 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSendBroadcast} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Target Discipline / Field</label>
                  <select
                    value={broadcastTargetTopic}
                    onChange={(e) => setBroadcastTargetTopic(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-action outline-none"
                  >
                    <option value="all">All Active Subscribers (Full List)</option>
                    {ALL_TOPICS.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Target Frequency Segment</label>
                  <select
                    value={broadcastFrequency}
                    onChange={(e) => setBroadcastFrequency(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-action outline-none"
                  >
                    <option value="All">All Frequencies (Weekly + Monthly + Alerts)</option>
                    <option value="Weekly">Weekly Subscribers Only</option>
                    <option value="Monthly">Monthly Subscribers Only</option>
                    <option value="Breaking Alerts">Breaking Alerts Only</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Campaign Subject Line <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Call for Papers: Volume 14 Issue 2 Special Issue & Research Highlights"
                  value={broadcastSubject}
                  onChange={(e) => setBroadcastSubject(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-md text-xs font-semibold focus:ring-2 focus:ring-brand-action outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Preview Subtitle (Inbox Pre-header)</label>
                <input
                  type="text"
                  placeholder="Discover the latest peer-reviewed breakthroughs in open access academic publishing."
                  value={broadcastPreview}
                  onChange={(e) => setBroadcastPreview(e.target.value)}
                  className="w-full px-3.5 py-2 border border-gray-300 rounded-md text-xs focus:ring-2 focus:ring-brand-action outline-none"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block font-bold text-gray-700">
                    Content Body <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setBroadcastPreviewMode(!broadcastPreviewMode)}
                    className="text-brand-action font-semibold text-[11px] hover:underline"
                  >
                    {broadcastPreviewMode ? 'Switch to Edit' : 'Preview Layout'}
                  </button>
                </div>

                {broadcastPreviewMode ? (
                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-md min-h-[160px] text-gray-800 whitespace-pre-wrap font-sans text-xs">
                    <div className="font-bold text-base text-brand-navy mb-2">{broadcastSubject || 'Untitled Subject'}</div>
                    {broadcastPreview && <div className="text-gray-500 italic mb-4">{broadcastPreview}</div>}
                    <div>{broadcastContent || 'No content provided.'}</div>
                  </div>
                ) : (
                  <textarea
                    rows={6}
                    placeholder="Write the newsletter digest, journal highlights, newly accepted papers, or editorial notes..."
                    value={broadcastContent}
                    onChange={(e) => setBroadcastContent(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-md font-mono text-xs focus:ring-2 focus:ring-brand-action outline-none"
                    required
                  />
                )}
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-900 text-[11px] flex items-center gap-2">
                <ShieldCheck size={16} className="text-blue-600 flex-shrink-0" />
                <span>
                  Emails will include individual 1-click unsubscribe tokens and header metadata compliant with CAN-SPAM and GDPR requirements.
                </span>
              </div>

              <div className="pt-3 border-t border-gray-200 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowBroadcastModal(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSendingBroadcast}
                  className="px-6 py-2.5 bg-brand-action hover:bg-[#0047b3] text-white rounded-lg font-bold flex items-center gap-1.5 shadow-md"
                >
                  {isSendingBroadcast ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      <span>Broadcasting...</span>
                    </>
                  ) : (
                    <>
                      <Send size={14} />
                      <span>Send Campaign Broadcast</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
