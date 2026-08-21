import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  MessageSquare, 
  Send, 
  RefreshCw, 
  Sparkles, 
  User, 
  Bot, 
  Search, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Trash2, 
  ShieldCheck, 
  Volume2, 
  VolumeX, 
  Check, 
  ChevronRight, 
  Globe, 
  Phone, 
  Mail, 
  ExternalLink, 
  Filter, 
  UserCheck, 
  FileText, 
  Info,
  Radio,
  Smile,
  Zap,
  RotateCcw,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';
import { LiveChatSession, LiveChatMessage, LiveChatStatus, LiveChatAnalyticsSummary } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { safeFetchJson } from '../../src/utils/safeApi';

const CANNED_RESPONSES = [
  { label: 'Welcome Greeting', text: 'Hello! Thank you for contacting Academic Publishing Group. How can I assist you with your manuscript or journal inquiry today?' },
  { label: 'APC Information', text: 'Our Article Processing Charges (APCs) depend on the journal and article type. You can review our transparent fee schedule and open access options at /author-guidelines.' },
  { label: 'Submission Portal', text: 'You can submit your manuscript directly through our online submission portal at /submit. Please ensure your formatting follows our author guidelines.' },
  { label: 'Review Timeline', text: 'Our standard peer-review process typically takes 3 to 5 weeks. You will receive email notifications at every milestone of the editorial workflow.' },
  { label: 'Editorial Follow-up', text: 'I have logged your request with our senior editorial team. We will follow up via your email with complete details.' }
];

export const AdminLiveChatDashboard: React.FC = () => {
  const { authState } = useAuth();
  const currentAdminName = authState.user?.name || 'Academic Admin';
  const currentAdminEmail = (authState.user?.email && authState.user.email !== 'admin@academicjp.com' && authState.user.email !== 'admin@journal.org')
    ? authState.user.email
    : 'admin@academicpublishinggroup.org';

  // Chat sessions state
  const [sessions, setSessions] = useState<LiveChatSession[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [activeSession, setActiveSession] = useState<LiveChatSession | null>(null);
  const [stats, setStats] = useState<LiveChatAnalyticsSummary>({
    totalChats: 0,
    activeChats: 0,
    waitingChats: 0,
    resolvedChats: 0,
    totalMessagesSent: 0,
    adminOnlineCount: 1,
    avgResponseTimeSeconds: 45
  });

  // UI & Filter state
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [replyText, setReplyText] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);
  const [isLoadingList, setIsLoadingList] = useState<boolean>(false);
  const [isDraftingAI, setIsDraftingAI] = useState<boolean>(false);
  const [autoRefreshSecs, setAutoRefreshSecs] = useState<number>(4);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [adminPresence, setAdminPresence] = useState<{ isOnline: boolean; statusNote: string }>({
    isOnline: true,
    statusNote: 'Online and accepting chats'
  });
  const [staffNote, setStaffNote] = useState<string>('');
  const [isSavingNote, setIsSavingNote] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const replyInputRef = useRef<HTMLTextAreaElement>(null);
  const previousMessageCountRef = useRef<number>(0);

  // Play notification chime for incoming messages
  const playChime = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch {}
  }, [soundEnabled]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Fetch admin presence status
  const fetchPresence = async () => {
    try {
      const data = await safeFetchJson<any>('/api/live-chats/presence');
      if (data) {
        setAdminPresence({
          isOnline: data.isOnline ?? true,
          statusNote: data.statusNote || 'Online and accepting chats'
        });
      }
    } catch {}
  };

  // Toggle admin presence
  const togglePresence = async () => {
    const nextState = !adminPresence.isOnline;
    try {
      const data = await safeFetchJson<any>('/api/live-chats/presence', {
        method: 'POST',
        body: JSON.stringify({
          isOnline: nextState,
          statusNote: nextState ? 'Online and accepting chats' : 'Offline / Away',
          adminEmail: currentAdminEmail
        })
      });
      if (data) {
        setAdminPresence({
          isOnline: data.isOnline,
          statusNote: nextState ? 'Online and accepting chats' : 'Offline / Away'
        });
        showToast(nextState ? 'Status set to: Online (Accepting customer chats)' : 'Status set to: Offline / Away');
      }
    } catch (err) {
      console.error('Failed to toggle presence:', err);
    }
  };

  // Fetch stats
  const fetchStats = async () => {
    try {
      const data = await safeFetchJson<any>('/api/live-chats/stats');
      if (data) {
        setStats(data);
      }
    } catch {}
  };

  // Fetch sessions list
  const fetchSessions = async (showLoading = false) => {
    if (showLoading) setIsLoadingList(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (searchQuery.trim()) params.append('search', searchQuery.trim());

      const data = await safeFetchJson<any>(`/api/live-chats?${params.toString()}`);
      if (data) {
        const fetchedSessions: LiveChatSession[] = data.sessions || (Array.isArray(data) ? data : []);
        setSessions(fetchedSessions);

        // If no session selected and list exists, select the first one
        if (!selectedSessionId && fetchedSessions.length > 0) {
          setSelectedSessionId(fetchedSessions[0].id);
        }
      }
    } catch (err) {
      console.error('Error fetching chat sessions:', err);
    } finally {
      if (showLoading) setIsLoadingList(false);
    }
  };

  // Fetch active session messages
  const fetchActiveSession = async (sessionId: string, isPoll = false) => {
    try {
      const data = await safeFetchJson<LiveChatSession>(`/api/live-chats/${sessionId}`);
      if (data && data.id) {
        // Check if there are new incoming visitor messages while polling
        if (isPoll && data.messages && data.messages.length > previousMessageCountRef.current) {
          const latest = data.messages[data.messages.length - 1];
          if (latest.sender === 'visitor') {
            playChime();
          }
        }
        previousMessageCountRef.current = data.messages?.length || 0;
        
        setActiveSession(data);
        setStaffNote(data.notes || '');

        // Mark as read by admin
        if (data.unreadByAdmin && data.unreadByAdmin > 0) {
          safeFetchJson(`/api/live-chats/${sessionId}/read`, {
            method: 'POST',
            body: JSON.stringify({ by: 'admin' })
          }).catch(() => {});
        }
      }
    } catch (err) {
      console.error('Error fetching active session:', err);
    }
  };

  // Initial load
  useEffect(() => {
    fetchPresence();
    fetchStats();
    fetchSessions(true);
  }, [statusFilter]);

  // Polling loop for auto-refresh
  useEffect(() => {
    if (autoRefreshSecs <= 0) return;

    const interval = setInterval(() => {
      fetchSessions(false);
      fetchStats();
      if (selectedSessionId) {
        fetchActiveSession(selectedSessionId, true);
      }
    }, autoRefreshSecs * 1000);

    return () => clearInterval(interval);
  }, [autoRefreshSecs, selectedSessionId, statusFilter, searchQuery]);

  // When selectedSessionId changes, fetch active session details
  useEffect(() => {
    if (selectedSessionId) {
      fetchActiveSession(selectedSessionId);
      setTimeout(() => {
        replyInputRef.current?.focus();
      }, 100);
    } else {
      setActiveSession(null);
    }
  }, [selectedSessionId]);

  // Scroll to bottom of message thread on update
  useEffect(() => {
    if (activeSession?.messages) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeSession?.messages]);

  // Send admin reply
  const handleSendReply = async () => {
    if (!replyText.trim() || !selectedSessionId || isSending) return;

    const textToSend = replyText.trim();
    setReplyText('');
    setIsSending(true);

    try {
      const newMsg = await safeFetchJson<LiveChatMessage>(`/api/live-chats/${selectedSessionId}/messages`, {
        method: 'POST',
        body: JSON.stringify({
          sender: 'admin',
          senderName: currentAdminName,
          content: textToSend,
          adminEmail: currentAdminEmail
        })
      });

      if (newMsg) {
        setActiveSession(prev => {
          if (!prev) return null;
          return {
            ...prev,
            status: 'active',
            lastMessage: textToSend,
            lastMessageSender: 'admin',
            lastMessageAt: new Date().toISOString(),
            messages: [...(prev.messages || []), newMsg]
          };
        });
        fetchSessions(false);
        fetchStats();
      } else {
        showToast('Failed to send reply. Please try again.');
      }
    } catch (err: any) {
      console.error('Error sending reply:', err);
      showToast(err.message || 'Error sending message');
    } finally {
      setIsSending(false);
      setTimeout(() => replyInputRef.current?.focus(), 50);
    }
  };

  // Generate AI Copilot Draft
  const handleGenerateAIDraft = async () => {
    if (!selectedSessionId || isDraftingAI) return;
    setIsDraftingAI(true);
    try {
      const data = await safeFetchJson<any>(`/api/live-chats/${selectedSessionId}/copilot`, {
        method: 'POST',
        body: JSON.stringify({ customInstruction: '' })
      });
      if (data && data.draft) {
        setReplyText(data.draft);
        showToast('✨ AI response draft generated!');
        setTimeout(() => replyInputRef.current?.focus(), 100);
      }
    } catch (err: any) {
      console.error('Error generating AI draft:', err);
      showToast(err.message || 'Could not generate AI draft');
    } finally {
      setIsDraftingAI(false);
    }
  };

  // Update session status
  const handleUpdateStatus = async (newStatus: LiveChatStatus) => {
    if (!selectedSessionId) return;
    try {
      const updated = await safeFetchJson<any>(`/api/live-chats/${selectedSessionId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus })
      });
      if (updated) {
        setActiveSession(updated);
        fetchSessions(false);
        fetchStats();
        showToast(`Chat status updated to "${newStatus.toUpperCase()}"`);
      }
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  // Assign session to current admin
  const handleAssignToMe = async () => {
    if (!selectedSessionId) return;
    try {
      const updated = await safeFetchJson<any>(`/api/live-chats/${selectedSessionId}/assign`, {
        method: 'POST',
        body: JSON.stringify({
          adminEmail: currentAdminEmail,
          adminName: currentAdminName
        })
      });
      if (updated) {
        setActiveSession(updated);
        fetchSessions(false);
        showToast(`Assigned chat to ${currentAdminName}`);
      }
    } catch (err) {
      console.error('Error assigning chat:', err);
    }
  };

  // Save internal staff note
  const handleSaveStaffNote = async () => {
    if (!selectedSessionId || isSavingNote) return;
    setIsSavingNote(true);
    try {
      await safeFetchJson(`/api/live-chats/${selectedSessionId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({
          status: activeSession?.status || 'active',
          notes: staffNote
        })
      });
      showToast('Internal note saved successfully');
    } catch (err) {
      console.error('Error saving staff note:', err);
    } finally {
      setIsSavingNote(false);
    }
  };

  // Delete chat session
  const handleDeleteSession = async (chatId: string) => {
    if (!window.confirm('Are you sure you want to delete this chat session? This action cannot be undone.')) {
      return;
    }
    try {
      await safeFetchJson(`/api/live-chats/${chatId}`, { method: 'DELETE' });
      showToast('Chat conversation deleted');
      if (selectedSessionId === chatId) {
        setSelectedSessionId(null);
        setActiveSession(null);
      }
      fetchSessions(true);
      fetchStats();
    } catch (err) {
      console.error('Error deleting session:', err);
    }
  };

  // Helper formatting for timestamps
  const formatTimeAgo = (isoString?: string) => {
    if (!isoString) return '';
    const diffMs = Date.now() - new Date(isoString).getTime();
    const diffSec = Math.floor(diffMs / 1000);
    if (diffSec < 60) return 'Just now';
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return `${diffHr}h ago`;
    const diffDays = Math.floor(diffHr / 24);
    return `${diffDays}d ago`;
  };

  const getStatusBadge = (status: LiveChatStatus) => {
    switch (status) {
      case 'waiting':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
            <Clock size={10} /> Waiting
          </span>
        );
      case 'active':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Active Live
          </span>
        );
      case 'resolved':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
            <CheckCircle2 size={10} /> Resolved
          </span>
        );
      case 'closed':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-700 border border-gray-200">
            Closed
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-8 z-50 bg-brand-navy text-white text-xs font-bold px-4 py-3 rounded shadow-xl border border-brand-action/40 flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 size={15} className="text-brand-action" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP KPI & STATUS BANNER */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* Metric 1: Waiting Inquiries */}
        <div className="bg-white p-4 rounded border border-gray-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Waiting Queue</div>
            <div className="text-2xl font-black text-amber-600 mt-1">{stats.waitingChats}</div>
            <div className="text-[10px] text-gray-500 font-medium">Needs editor response</div>
          </div>
          <div className="p-3 bg-amber-50 rounded text-amber-600">
            <Clock size={22} />
          </div>
        </div>

        {/* Metric 2: Active Live Chats */}
        <div className="bg-white p-4 rounded border border-gray-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Active Chats</div>
            <div className="text-2xl font-black text-emerald-600 mt-1">{stats.activeChats}</div>
            <div className="text-[10px] text-gray-500 font-medium">Live conversations</div>
          </div>
          <div className="p-3 bg-emerald-50 rounded text-emerald-600">
            <Radio size={22} className="animate-pulse" />
          </div>
        </div>

        {/* Metric 3: Resolved Today */}
        <div className="bg-white p-4 rounded border border-gray-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Resolved Inquiries</div>
            <div className="text-2xl font-black text-blue-600 mt-1">{stats.resolvedChats}</div>
            <div className="text-[10px] text-gray-500 font-medium">Successfully completed</div>
          </div>
          <div className="p-3 bg-blue-50 rounded text-blue-600">
            <CheckCircle2 size={22} />
          </div>
        </div>

        {/* Metric 4: Total Inquiries */}
        <div className="bg-white p-4 rounded border border-gray-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Total Inquiries</div>
            <div className="text-2xl font-black text-brand-navy mt-1">{stats.totalChats}</div>
            <div className="text-[10px] text-gray-500 font-medium">Logged in Database</div>
          </div>
          <div className="p-3 bg-slate-100 rounded text-brand-navy">
            <MessageSquare size={22} />
          </div>
        </div>

        {/* Metric 5: Admin Live Status Toggle */}
        <div className={`p-4 rounded border shadow-xs flex flex-col justify-between transition-all ${
          adminPresence.isOnline ? 'bg-emerald-950/10 border-emerald-300' : 'bg-gray-100 border-gray-300'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-gray-600">Your Online State</span>
            <span className={`w-2.5 h-2.5 rounded-full ${adminPresence.isOnline ? 'bg-emerald-500 animate-ping' : 'bg-gray-400'}`}></span>
          </div>
          <div className="flex items-center justify-between mt-2">
            <div>
              <div className="text-xs font-bold text-gray-900">
                {adminPresence.isOnline ? '🟢 Online' : '⚪ Offline / Away'}
              </div>
              <div className="text-[10px] text-gray-500">
                {adminPresence.isOnline ? 'Accepting visitor chats' : 'Visitors see AI assistant'}
              </div>
            </div>
            <button
              type="button"
              onClick={togglePresence}
              className={`px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                adminPresence.isOnline 
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                  : 'bg-gray-700 hover:bg-gray-800 text-white'
              }`}
            >
              {adminPresence.isOnline ? 'Go Offline' : 'Go Online'}
            </button>
          </div>
        </div>
      </div>

      {/* CONTROLS HEADER BAR */}
      <div className="bg-white p-4 rounded border border-gray-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        {/* Left: Search & Filter */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search visitor, email, message..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded text-xs text-gray-800 w-56 md:w-64 focus:outline-none focus:border-brand-action"
            />
            {searchQuery && (
              <button 
                type="button" 
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          {/* Status Tabs */}
          <div className="flex items-center bg-gray-100 p-0.5 rounded text-xs">
            {[
              { id: 'all', label: 'All' },
              { id: 'waiting', label: `Waiting (${stats.waitingChats})` },
              { id: 'active', label: `Active (${stats.activeChats})` },
              { id: 'resolved', label: 'Resolved' }
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1 font-bold rounded transition-all cursor-pointer ${
                  statusFilter === tab.id
                    ? 'bg-white text-brand-navy shadow-xs'
                    : 'text-gray-600 hover:text-brand-navy'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Actions, Auto-Refresh & Chime */}
        <div className="flex items-center gap-3">
          {/* Sound Alert Toggle */}
          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              soundEnabled 
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' 
                : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'
            }`}
            title={soundEnabled ? 'Chime sound on incoming messages is active' : 'Sound muted'}
          >
            {soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
            <span className="hidden sm:inline text-[11px]">{soundEnabled ? 'Sound On' : 'Muted'}</span>
          </button>

          {/* Auto Refresh Select */}
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Clock size={13} />
            <select
              value={autoRefreshSecs}
              onChange={(e) => setAutoRefreshSecs(parseInt(e.target.value, 10))}
              className="bg-gray-50 border border-gray-200 rounded py-1 px-2 text-xs text-gray-700 font-medium focus:outline-none focus:border-brand-action cursor-pointer"
            >
              <option value="3">Sync: Every 3s</option>
              <option value="5">Sync: Every 5s</option>
              <option value="10">Sync: Every 10s</option>
              <option value="0">Sync: Manual Only</option>
            </select>
          </div>

          {/* Manual Refresh Button */}
          <button
            type="button"
            onClick={() => {
              fetchSessions(true);
              fetchStats();
              if (selectedSessionId) fetchActiveSession(selectedSessionId);
              showToast('Refreshed chat sessions');
            }}
            disabled={isLoadingList}
            className="p-2 bg-brand-navy hover:bg-brand-action text-white rounded text-xs transition-colors flex items-center gap-1 cursor-pointer"
            title="Refresh now"
          >
            <RefreshCw size={14} className={isLoadingList ? 'animate-spin' : ''} />
            <span className="hidden sm:inline font-bold text-[11px]">Sync Now</span>
          </button>
        </div>
      </div>

      {/* MAIN DUAL-PANE CHAT CONSOLE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[680px]">
        {/* LEFT COLUMN: CONVERSATION SESSIONS LIST (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded border border-gray-200 shadow-xs flex flex-col overflow-hidden h-[680px]">
          {/* List Header */}
          <div className="p-3.5 bg-slate-50 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare size={16} className="text-brand-action" />
              <span className="text-xs font-bold text-brand-navy uppercase tracking-wider">
                Conversations ({sessions.length})
              </span>
            </div>
            <span className="text-[10px] text-gray-500 font-mono">
              {stats.activeChats} active · {stats.waitingChats} waiting
            </span>
          </div>

          {/* Sessions Scrollable List */}
          <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
            {isLoadingList && sessions.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                <RefreshCw size={24} className="animate-spin mx-auto mb-2 text-brand-action" />
                <p className="text-xs">Loading conversations...</p>
              </div>
            ) : sessions.length === 0 ? (
              <div className="p-8 text-center text-gray-500 space-y-2">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-gray-400">
                  <MessageSquare size={22} />
                </div>
                <p className="text-xs font-bold text-gray-700">No conversations found</p>
                <p className="text-[11px] text-gray-500">
                  {searchQuery ? 'Try clearing your search filters.' : 'Incoming real-time visitor chats will automatically appear here.'}
                </p>
              </div>
            ) : (
              sessions.map((session) => {
                const isSelected = session.id === selectedSessionId;
                const hasUnread = Boolean(session.unreadByAdmin && session.unreadByAdmin > 0);

                return (
                  <div
                    key={session.id}
                    onClick={() => setSelectedSessionId(session.id)}
                    className={`p-3.5 transition-all cursor-pointer hover:bg-slate-50 relative ${
                      isSelected ? 'bg-blue-50/60 border-l-4 border-brand-action' : ''
                    } ${hasUnread ? 'bg-amber-50/30 font-semibold' : ''}`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2 min-w-0">
                        {/* Avatar */}
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                          session.status === 'active' 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : session.status === 'waiting'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {session.visitorName ? session.visitorName.charAt(0).toUpperCase() : 'V'}
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-brand-navy truncate flex items-center gap-1.5">
                            <span className="truncate">{session.visitorName || 'Scholarly Visitor'}</span>
                            {hasUnread && (
                              <span className="w-2 h-2 rounded-full bg-brand-action animate-pulse shrink-0"></span>
                            )}
                          </div>
                          {session.visitorEmail && (
                            <div className="text-[10px] text-gray-400 truncate">{session.visitorEmail}</div>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col items-end shrink-0 gap-1">
                        <span className="text-[10px] text-gray-400 font-mono">
                          {formatTimeAgo(session.lastMessageAt || session.createdAt)}
                        </span>
                        {getStatusBadge(session.status)}
                      </div>
                    </div>

                    {/* Last message preview */}
                    <p className="text-[11px] text-gray-600 line-clamp-2 leading-relaxed pl-9">
                      {session.lastMessageSender === 'admin' ? (
                        <span className="text-brand-action font-semibold">You: </span>
                      ) : null}
                      {session.lastMessage || session.initialDescription || 'Started chat session'}
                    </p>

                    {/* Footer tags */}
                    <div className="flex items-center justify-between text-[10px] text-gray-400 pt-2 pl-9 mt-1 border-t border-gray-100/80">
                      <span className="truncate max-w-[140px] flex items-center gap-1">
                        <Globe size={10} /> {session.pageUrl || '/'}
                      </span>
                      {session.assignedAdminName && (
                        <span className="text-indigo-600 font-medium truncate max-w-[100px]">
                          👤 {session.assignedAdminName.split(' ')[0]}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* MIDDLE & RIGHT COLUMN: ACTIVE CONVERSATION & INTELLIGENCE SIDEBAR (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded border border-gray-200 shadow-xs flex flex-col overflow-hidden h-[680px]">
          {activeSession ? (
            <div className="flex flex-col h-full">
              {/* Active Chat Header */}
              <div className="p-4 bg-slate-50 border-b border-gray-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-navy text-white flex items-center justify-center font-bold text-sm shadow-xs">
                    {activeSession.visitorName ? activeSession.visitorName.charAt(0).toUpperCase() : 'V'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-brand-navy">
                        {activeSession.visitorName || 'Scholarly Researcher'}
                      </h3>
                      {getStatusBadge(activeSession.status)}
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-gray-500 mt-0.5">
                      {activeSession.visitorEmail && (
                        <span className="flex items-center gap-1">
                          <Mail size={11} className="text-gray-400" /> {activeSession.visitorEmail}
                        </span>
                      )}
                      {activeSession.visitorPhone && (
                        <span className="flex items-center gap-1">
                          <Phone size={11} className="text-gray-400" /> {activeSession.visitorPhone}
                        </span>
                      )}
                      <span className="flex items-center gap-1 text-gray-400 font-mono text-[10px]">
                        <Globe size={11} /> {activeSession.pageUrl || '/'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right controls: Status Dropdown & Assignment */}
                <div className="flex items-center gap-2">
                  {/* Status Selector */}
                  <select
                    value={activeSession.status}
                    onChange={(e) => handleUpdateStatus(e.target.value as LiveChatStatus)}
                    className="bg-white border border-gray-200 rounded px-2.5 py-1 text-xs font-bold text-brand-navy focus:outline-none focus:border-brand-action cursor-pointer"
                  >
                    <option value="waiting">Status: Waiting</option>
                    <option value="active">Status: Active Live</option>
                    <option value="resolved">Status: Resolved</option>
                    <option value="closed">Status: Closed</option>
                  </select>

                  {/* Assign to me */}
                  <button
                    type="button"
                    onClick={handleAssignToMe}
                    className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-gray-200 text-gray-700 text-xs font-semibold rounded transition-colors flex items-center gap-1 cursor-pointer"
                    title="Assign to yourself"
                  >
                    <UserCheck size={13} className="text-brand-action" />
                    <span>{activeSession.assignedAdminName ? activeSession.assignedAdminName.split(' ')[0] : 'Assign Me'}</span>
                  </button>

                  {/* Delete Conversation */}
                  <button
                    type="button"
                    onClick={() => handleDeleteSession(activeSession.id)}
                    className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded transition-colors cursor-pointer"
                    title="Delete conversation"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              {/* Pre-Chat Inquiry Banner if provided */}
              {activeSession.initialDescription && (
                <div className="bg-amber-50/70 border-b border-amber-200/80 px-4 py-2 text-xs text-amber-900 flex items-start gap-2 shrink-0">
                  <Info size={14} className="text-amber-600 shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <span className="font-bold">Initial Inquiry: </span>
                    <span>{activeSession.initialDescription}</span>
                  </div>
                </div>
              )}

              {/* Main Chat Stream Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50">
                {activeSession.messages && activeSession.messages.length > 0 ? (
                  activeSession.messages.map((msg) => {
                    const isAdmin = msg.sender === 'admin';
                    const isBot = msg.sender === 'bot';

                    return (
                      <div
                        key={msg.id}
                        className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`flex gap-2.5 max-w-[80%] ${isAdmin ? 'flex-row-reverse' : 'flex-row'}`}>
                          {/* Avatar */}
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                            isAdmin 
                              ? 'bg-brand-navy text-brand-action' 
                              : isBot
                              ? 'bg-purple-100 text-purple-700'
                              : 'bg-brand-action text-white'
                          }`}>
                            {isAdmin ? <ShieldCheck size={14} /> : isBot ? <Sparkles size={14} /> : <User size={14} />}
                          </div>

                          {/* Bubble */}
                          <div>
                            <div className="flex items-center gap-1.5 mb-1 px-0.5">
                              <span className="text-[10px] font-bold text-gray-700">
                                {isAdmin 
                                  ? `${msg.senderName || 'Editorial Support'} (Admin)` 
                                  : isBot 
                                  ? 'Academic AI Assistant' 
                                  : msg.senderName || 'Visitor'}
                              </span>
                              <span className="text-[9px] text-gray-400 font-mono">
                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <div className={`p-3 rounded text-xs leading-relaxed shadow-xs ${
                              isAdmin
                                ? 'bg-brand-navy text-white rounded-tr-none'
                                : isBot
                                ? 'bg-purple-50 text-purple-950 border border-purple-200 rounded-tl-none'
                                : 'bg-white text-gray-800 border border-gray-200 rounded-tl-none'
                            }`}>
                              {msg.content}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-8 text-center text-gray-400">
                    <p className="text-xs">No messages recorded in this session yet.</p>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Response Templates & AI Copilot Bar */}
              <div className="px-4 py-2 bg-slate-100 border-t border-gray-200 flex flex-wrap items-center justify-between gap-2 shrink-0">
                {/* Canned Responses Chips */}
                <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 max-w-[calc(100%-180px)]">
                  <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 shrink-0">
                    Quick Canned:
                  </span>
                  {CANNED_RESPONSES.map((cr, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setReplyText(cr.text)}
                      className="px-2 py-1 bg-white hover:bg-brand-action hover:text-white text-gray-700 border border-gray-200 rounded text-[10px] font-semibold transition-all whitespace-nowrap cursor-pointer shadow-2xs"
                    >
                      {cr.label}
                    </button>
                  ))}
                </div>

                {/* AI Copilot Draft Button */}
                <button
                  type="button"
                  onClick={handleGenerateAIDraft}
                  disabled={isDraftingAI}
                  className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded text-[11px] font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shrink-0"
                  title="Generate a smart editorial draft using Gemini"
                >
                  <Sparkles size={13} className={isDraftingAI ? 'animate-spin' : ''} />
                  <span>{isDraftingAI ? 'Drafting...' : '✨ AI Copilot Draft'}</span>
                </button>
              </div>

              {/* Reply Input Box */}
              <div className="p-4 bg-white border-t border-gray-200 shrink-0">
                <div className="relative">
                  <textarea
                    ref={replyInputRef}
                    rows={3}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendReply();
                      }
                    }}
                    placeholder={`Reply to ${activeSession.visitorName || 'visitor'} as ${currentAdminName}... (Press Enter to send)`}
                    className="w-full bg-slate-50 border border-gray-200 rounded-md px-3.5 py-2.5 text-xs text-gray-800 pr-24 focus:outline-none focus:border-brand-action focus:ring-1 focus:ring-brand-action/20 font-medium resize-none"
                  />
                  
                  {/* Send Button */}
                  <div className="absolute right-3 bottom-3 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleSendReply}
                      disabled={!replyText.trim() || isSending}
                      className="px-4 py-2 bg-brand-action hover:bg-brand-navy text-white rounded font-bold text-xs shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <span>Send</span>
                      <Send size={13} />
                    </button>
                  </div>
                </div>

                {/* Bottom Footer Info */}
                <div className="flex items-center justify-between text-[10px] text-gray-400 mt-2 px-1">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1">
                      <ShieldCheck size={11} className="text-emerald-600" /> Replying as {currentAdminName} ({currentAdminEmail})
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>Markdown formatting supported</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* EMPTY STATE: NO SESSION SELECTED */
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-50/40">
              <div className="w-16 h-16 rounded-full bg-brand-navy/10 text-brand-navy flex items-center justify-center mb-4">
                <MessageSquare size={32} />
              </div>
              <h3 className="text-base font-bold text-brand-navy mb-1">
                Select a Live Chat Conversation
              </h3>
              <p className="text-xs text-gray-500 max-w-sm leading-relaxed">
                Choose a conversation from the waiting queue on the left to review visitor inquiries, draft AI-assisted responses, and chat with authors in real-time.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
