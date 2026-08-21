import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Send, 
  MessageSquare, 
  Eye, 
  Download,
  Plus,
  Settings,
  ChevronRight,
  LogOut,
  CreditCard,
  User,
  ShieldCheck,
  Search,
  ArrowRight,
  TrendingUp,
  Mail,
  Building,
  Edit2,
  Save,
  Loader2,
  XCircle,
  DollarSign,
  Bell,
  Lock,
  Globe,
  BookOpen,
  MapPin,
  Fingerprint,
  Quote,
  Award,
  MoreHorizontal,
  Filter,
  Receipt,
  AlertTriangle
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart as RePieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { MockService } from '../services/mockDb';
import { Article, Invoice, User as UserType } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { AuthorBilling } from '../components/AuthorBilling';

type DashboardTab = 'overview' | 'submissions' | 'reviews' | 'analytics' | 'billing' | 'profile';

export const Dashboard: React.FC = () => {
  const { authState, logout, login } = useAuth();
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  const [submissions, setSubmissions] = useState<Article[]>([]);
  const [reviewTasks, setReviewTasks] = useState<Article[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [activePaymentArticleId, setActivePaymentArticleId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Profile Form State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState<Partial<UserType>>({});
  const [isUpdating, setIsUpdating] = useState(false);
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  if (!authState.isAuthenticated || !authState.user) {
    return <Navigate to="/login" replace />;
  }

  const currentUser = authState.user;

  const fetchData = async () => {
    setLoading(true);
    try {
      const [subData, revData, invData] = await Promise.all([
        MockService.getArticlesByAuthor(currentUser.email),
        MockService.getReviewTasks(currentUser.email),
        MockService.getInvoices()
      ]);

      setSubmissions(subData || []);
      setReviewTasks(revData || []);
      setInvoices(invData || []);
      setProfileData(currentUser);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentUser]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const updatedUser = await MockService.updateUserProfile(currentUser.email, profileData);
      if (updatedUser) {
        login(updatedUser); // Refresh context
        setIsEditingProfile(false);
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const stats = {
    active: submissions.filter(s => s.status === 'Submitted' || s.status === 'In Review').length,
    inReview: submissions.filter(s => s.status === 'In Review').length,
    published: submissions.filter(s => s.status === 'Published').length,
    revisions: submissions.filter(s => s.status === 'Rejected').length, // Mock rejection as revisions
    accepted: submissions.filter(s => s.status === 'Accepted').length,
    paid: submissions.filter(s => s.status === 'Paid').length,
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Published': return 'bg-emerald-100 text-emerald-700';
      case 'Accepted': return 'bg-blue-100 text-blue-700';
      case 'Paid': return 'bg-purple-100 text-purple-700';
      case 'In Review': return 'bg-amber-100 text-amber-700';
      case 'Rejected': return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getJournalName = (jId: string) => {
    switch(jId?.toUpperCase()) {
      case 'IJASI': return 'International Journal of Agricultural Systems and Innovation (IJASI)';
      case 'IJESSI': return 'International Journal of Educational and Social Science Studies (IJESSI)';
      case 'JBME': return 'Journal of Bio-Medical and Evolutionary Research (JBME)';
      case 'JIEAI': return 'Journal of Industrial Engineering and Artificial Intelligence (JIEAI)';
      case 'QJESI': return 'Quarterly Journal of Environmental and Sustainability Issues (QJESI)';
      default: return 'International Journal of Agricultural Systems and Innovation (IJASI)';
    }
  };

  const renderOverview = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Accepted Manuscript Payment Alert */}
      {submissions.some(s => s.status === 'Accepted') && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded p-6 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold shrink-0 shadow-sm">
              <AlertTriangle size={20} />
            </div>
            <div>
              <h3 className="font-serif font-bold text-amber-950 text-base">Manuscript Accepted — Payment Action Required</h3>
              <p className="text-xs text-amber-800">
                Your manuscript has been accepted for publication. Please complete the Article Processing Charge (APC) payment to initiate typesetting and DOI assignment.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              const acceptedSub = submissions.find(s => s.status === 'Accepted');
              if (acceptedSub) setActivePaymentArticleId(acceptedSub.id);
              setActiveTab('billing');
            }}
            className="px-5 py-2.5 bg-brand-action hover:bg-brand-action/90 text-white text-xs font-black uppercase tracking-wider rounded shadow-md flex items-center gap-2 whitespace-nowrap hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <CreditCard size={16} /> Pay APC Fee Now
          </button>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded border border-slate-100 shadow-sm group hover:border-brand-action transition-all cursor-default">
          <div className="text-brand-action mb-2 group-hover:scale-110 transition-transform"><FileText size={20} /></div>
          <div className="text-2xl font-serif font-black text-brand-navy">{submissions.length}</div>
          <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Total Submissions</div>
        </div>
        <div className="bg-white p-6 rounded border border-slate-100 shadow-sm group hover:border-amber-500 transition-all cursor-default">
          <div className="text-amber-500 mb-2 group-hover:scale-110 transition-transform"><Clock size={20} /></div>
          <div className="text-2xl font-serif font-black text-brand-navy">{stats.inReview}</div>
          <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest">In Peer Review</div>
        </div>
        <div className="bg-white p-6 rounded border border-slate-100 shadow-sm group hover:border-emerald-500 transition-all cursor-default">
          <div className="text-emerald-500 mb-2 group-hover:scale-110 transition-transform"><CheckCircle2 size={20} /></div>
          <div className="text-2xl font-serif font-black text-brand-navy">{stats.published}</div>
          <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Published Works</div>
        </div>
        <div className="bg-white p-6 rounded border border-slate-100 shadow-sm group hover:border-blue-500 transition-all cursor-default">
          <div className="text-blue-500 mb-2 group-hover:scale-110 transition-transform"><TrendingUp size={20} /></div>
          <div className="text-2xl font-serif font-black text-brand-navy">{stats.accepted}</div>
          <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Accepted & Pending</div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="bg-white rounded border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-serif font-black text-brand-navy flex items-center gap-2">
            <div className="w-6 h-1 bg-brand-action"></div>
            Core Intelligence Node: Active Projects
          </h3>
          <button onClick={() => setActiveTab('submissions')} className="text-xs font-black uppercase tracking-widest text-brand-action hover:underline">Full Directory</button>
        </div>
        
        {submissions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Manuscript ID</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Title & Research Domain</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {submissions.slice(0, 3).map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="text-xs font-mono text-slate-400">#{sub.id.toUpperCase()}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="max-w-md">
                        <div className="text-sm font-bold text-brand-navy truncate mb-1">{sub.title}</div>
                        <div className="flex gap-2">
                          {sub.keywords.slice(0, 2).map(k => (
                            <span key={k} className="text-[9px] px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded uppercase font-bold tracking-tighter italic">#{k}</span>
                          ))}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${getStatusColor(sub.status)}`}>
                        {sub.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Link 
                        to={`/article/${sub.id}`} 
                        className="p-2 hover:bg-white rounded border border-transparent hover:border-slate-200 transition-all inline-block group"
                      >
                        <ArrowRight size={14} className="text-slate-300 group-hover:text-brand-action transition-colors" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText size={32} />
            </div>
            <h4 className="text-brand-navy font-bold mb-2">No active submissions found</h4>
            <p className="text-slate-500 text-xs max-w-xs mx-auto leading-relaxed">
              Start your journey by choosing a journal and initiating the Academic submission protocol.
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div className="bg-white p-8 rounded border border-slate-100 shadow-sm relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-32 h-32 bg-brand-action/5 rounded-full -translate-y-12 translate-x-12 blur-2xl group-hover:scale-125 transition-transform duration-700"></div>
           <div className="flex items-center gap-4 mb-6 relative z-10">
             <div className="p-3 bg-blue-50 text-[#0052cc] rounded-sm transform group-hover:rotate-12 transition-transform">
               <MessageSquare size={24} />
             </div>
             <h3 className="font-serif font-black text-brand-navy text-xl">Author Support Hub</h3>
           </div>
           <p className="text-sm text-slate-500 mb-8 leading-relaxed relative z-10">
             Having trouble with the submission process or need to follow up on a specific manuscript? Our strategic intelligence team is available 24/7.
           </p>
           <Link to="/contact" className="text-[10px] font-black uppercase tracking-[0.2em] text-white bg-brand-navy px-6 py-3 flex items-center gap-4 hover:bg-brand-action w-fit transition-all relative z-10">
             Open Support Ticket <ChevronRight size={14} />
           </Link>
         </div>
         <div className="bg-white p-8 rounded border border-slate-100 shadow-sm relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -translate-y-12 translate-x-12 blur-2xl group-hover:scale-125 transition-transform duration-700"></div>
           <div className="flex items-center gap-4 mb-6 relative z-10">
             <div className="p-3 bg-emerald-50 text-emerald-600 rounded-sm transform group-hover:-rotate-12 transition-transform">
               <TrendingUp size={24} />
             </div>
             <h3 className="font-serif font-black text-brand-navy text-xl">Impact Analytics</h3>
           </div>
           <p className="text-sm text-slate-500 mb-8 leading-relaxed relative z-10">
             View precise citation metrics for your intelligence nodes, including global downloads, cross-platform mentions, and metadata rankings.
           </p>
           {stats.published > 0 ? (
             <button className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-700 bg-emerald-50 px-6 py-3 flex items-center gap-4 hover:bg-emerald-100 w-fit transition-all relative z-10">
               View Impact Metrics <TrendingUp size={14} />
             </button>
           ) : (
             <div className="text-[9px] font-black uppercase tracking-widest text-slate-300 italic py-3">
               Data streams pending publication...
             </div>
           )}
         </div>
      </div>
    </div>
  );

  const [submissionSearch, setSubmissionSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All Statuses');

  const filteredSubmissions = submissions.filter(sub => {
    const matchesSearch = sub.title.toLowerCase().includes(submissionSearch.toLowerCase()) || 
                          sub.id.toLowerCase().includes(submissionSearch.toLowerCase());
    const matchesStatus = statusFilter === 'All Statuses' || sub.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'Published': return (
        <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold">
          <CheckCircle2 size={12} /> Published
        </span>
      );
      case 'Accepted': return (
        <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold">
          <CheckCircle2 size={12} /> Accepted
        </span>
      );
      case 'In Review': 
      case 'Under Review': return (
        <span className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-[10px] font-bold">
          <Clock size={12} /> Under Review
        </span>
      );
      case 'Rejected': return (
        <span className="flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-rose-600 rounded-full text-[10px] font-bold">
          <XCircle size={12} /> Rejected
        </span>
      );
      case 'Submitted': return (
        <span className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-bold">
          <Send size={12} /> Submitted
        </span>
      );
      default: return (
        <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 text-slate-400 rounded-full text-[10px] font-bold">
           {status}
        </span>
      );
    }
  };

  const renderSubmissions = () => (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500 text-left">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-brand-navy">My Manuscripts</h2>
        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-brand-action transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Search by title, ID, or author..."
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded text-sm w-full md:w-80 focus:outline-none focus:ring-1 focus:ring-brand-action"
              value={submissionSearch}
              onChange={(e) => setSubmissionSearch(e.target.value)}
            />
          </div>
          <div className="relative">
            <select 
              className="appearance-none pl-4 pr-10 py-2 bg-white border border-slate-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-brand-action cursor-pointer"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option>All Statuses</option>
              <option>Published</option>
              <option>Accepted</option>
              <option>Under Review</option>
              <option>Submitted</option>
              <option>Rejected</option>
            </select>
            <Filter size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Manuscript</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Journal</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Status</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Submitted</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Metrics</th>
                <th className="px-6 py-4 w-12"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredSubmissions.length > 0 ? (
                filteredSubmissions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-6">
                      <div className="max-w-md">
                        <div className="text-sm font-bold text-brand-navy leading-snug mb-1 group-hover:text-brand-action transition-colors">{sub.title}</div>
                        <div className="text-[10px] font-mono text-slate-400">AP-{new Date(sub.submissionDate || '').getFullYear()}-{sub.id.toUpperCase()}</div>
                      </div>
                    </td>
                    <td className="px-6 py-6 border-l border-slate-50">
                      <div className="text-xs text-slate-500 font-medium max-w-xs">
                        {getJournalName(sub.journalId)}
                      </div>
                    </td>
                    <td className="px-6 py-6 border-l border-slate-50 text-center">
                      <div className="flex justify-center">
                        {getStatusBadge(sub.status)}
                      </div>
                    </td>
                    <td className="px-6 py-6 border-l border-slate-50 text-center">
                      <span className="text-xs text-slate-500 font-medium">{sub.submissionDate}</span>
                    </td>
                    <td className="px-6 py-6 border-l border-slate-50">
                      <div className="flex items-center justify-center gap-4">
                        {(sub.status === 'Published' || sub.status === 'Accepted') ? (
                          <>
                            <div className="flex items-center gap-1 text-slate-400" title="Views">
                              <Eye size={14} /> <span className="text-[10px] font-bold">{sub.views >= 1000 ? (sub.views/1000).toFixed(1)+'K' : sub.views}</span>
                            </div>
                            <div className="flex items-center gap-1 text-slate-400" title="Downloads">
                              <Download size={14} /> <span className="text-[10px] font-bold">{sub.downloads >= 1000 ? (sub.downloads/1000).toFixed(1)+'K' : sub.downloads}</span>
                            </div>
                            <div className="flex items-center gap-1 text-slate-400" title="Citations">
                              <Quote size={12} /> <span className="text-[10px] font-bold text-slate-400">{sub.citations || Math.floor(Math.random() * 50)}</span>
                            </div>
                          </>
                        ) : (
                          <span className="text-slate-200">—</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-6 text-right">
                      {sub.status === 'Accepted' ? (
                        <button
                          onClick={() => {
                            setActivePaymentArticleId(sub.id);
                            setActiveTab('billing');
                          }}
                          className="px-3 py-1.5 bg-brand-action hover:bg-brand-action/90 text-white text-xs font-black uppercase tracking-wider rounded transition-all shadow-sm flex items-center gap-1.5 ml-auto whitespace-nowrap hover:scale-105 active:scale-95"
                        >
                          <CreditCard size={14} /> Pay APC Fee
                        </button>
                      ) : (
                        <button className="text-slate-300 hover:text-brand-navy p-1">
                          <MoreHorizontal size={18} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-20 text-center">
                    <div className="text-slate-300 mb-2 italic">No manuscripts found matching your criteria.</div>
                    {submissionSearch && (
                      <button onClick={() => setSubmissionSearch('')} className="text-xs font-bold text-brand-action hover:underline">Clear Search</button>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderReviews = () => (
    <div className="space-y-6 animate-in zoom-in duration-500">
      <div>
        <h2 className="text-3xl font-serif font-black text-brand-navy">Peer Criticality Stream</h2>
        <p className="text-slate-500 text-sm">Monitor existing manuscript lifecycle or peer review assignments.</p>
      </div>

      {reviewTasks.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {reviewTasks.map((task) => (
            <div key={task.id} className="bg-white p-6 rounded border-l-4 border-amber-500 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition-shadow">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${getStatusColor(task.status)} animate-pulse`}>
                    {task.status}
                  </span>
                  <span className="text-[10px] font-mono text-slate-300">Ref: {task.id.split('-')[1]}</span>
                </div>
                <h4 className="font-bold text-brand-navy mb-2 line-clamp-1">{task.title}</h4>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 text-slate-400 italic text-xs">
                    <Clock size={12} /> Pending Architecture Verification
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button className="px-5 py-2.5 bg-brand-navy text-white text-[9px] font-black uppercase tracking-widest rounded hover:bg-brand-action transition-all">
                  Process Review
                </button>
                <Link to={`/article/${task.id}`} className="p-2.5 bg-slate-50 text-slate-400 rounded hover:bg-brand-navy hover:text-white transition-all">
                  <Eye size={16} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-20 text-center rounded border border-slate-100 italic text-slate-300 font-serif text-lg">
          No pending review protocols detected in the stream.
        </div>
      )}

      {/* Workflow Tracking Simulation */}
      <div className="bg-brand-navy rounded-sm p-10 text-white relative overflow-hidden group">
        <div className="absolute inset-0 bg-brand-action/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-action mb-8">Node Lifecycle Tracking</h3>
        
        <div className="relative">
          <div className="hidden md:block absolute top-[22px] left-0 right-0 h-0.5 bg-white/10 z-0"></div>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-8 relative z-10">
            {[
              { label: 'Submitted', active: true, done: true },
              { label: 'Under Review', active: true, done: false },
              { label: 'Accepted', active: false, done: false },
              { label: 'Paid', active: false, done: false },
              { label: 'Published', active: false, done: false },
              { label: 'Rejected', active: false, done: false },
            ].map((step, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-500 mb-4 ${
                  step.done ? 'bg-brand-action border-brand-action text-white' : 
                  step.active ? 'bg-brand-navy border-brand-action text-brand-action animate-pulse shadow-[0_0_15px_rgba(255,51,102,0.3)]' : 
                  'bg-brand-navy border-white/10 text-white/20'
                }`}>
                  {step.done ? <CheckCircle2 size={24} /> : (idx + 1)}
                </div>
                <div className={`text-[9px] font-black uppercase tracking-widest text-center ${step.active || step.done ? 'text-white' : 'text-white/20'}`}>
                  {step.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => {
    // Real-Time Analytics calculations based on the authenticated user's dynamic submissions
    const totalSubmissions = submissions.length;
    
    // Sum view, download, citation metrics dynamically
    const totalDownloads = submissions.reduce((sum, s) => sum + (s.downloads || 0), 0);
    const totalViews = submissions.reduce((sum, s) => sum + (s.views || 0), 0);
    const totalCitations = submissions.reduce((sum, s) => sum + (s.citations || 0), 0);
    
    // Accurate, production-ready H-Index algorithm
    const citationsSorted = submissions.map(s => s.citations || 0).sort((a, b) => b - a);
    let calculatedHIndex = 0;
    while (calculatedHIndex < citationsSorted.length && citationsSorted[calculatedHIndex] >= calculatedHIndex + 1) {
      calculatedHIndex++;
    }

    // Manuscript stages counts matching the extended academic workflow statuses
    const draftCount = submissions.filter(s => s.status === 'Draft').length;
    const submittedCount = submissions.filter(s => s.status === 'Submitted').length;
    const reviewCount = submissions.filter(s => 
      s.status === 'In Peer Review' || 
      s.status === 'Under Editorial Review' || 
      s.status === 'Reviewer Assigned'
    ).length;
    const acceptedCount = submissions.filter(s => 
      s.status === 'Accepted' || 
      s.status === 'Copyediting' || 
      s.status === 'Typesetting' || 
      s.status === 'Proofing'
    ).length;
    const publishedCount = submissions.filter(s => s.status === 'Published').length;
    const rejectedCount = submissions.filter(s => s.status === 'Rejected').length;
    const revisionCount = submissions.filter(s => 
      s.status === 'Revision Requested' || 
      s.status === 'Minor Revision' || 
      s.status === 'Major Revision'
    ).length;

    // Rate calculations
    const decArticles = submissions.filter(s => s.status === 'Published' || s.status === 'Accepted' || s.status === 'Rejected');
    const acceptanceRate = decArticles.length > 0 
      ? Math.round((submissions.filter(s => s.status === 'Published' || s.status === 'Accepted').length / decArticles.length) * 100) 
      : 0;
      
    const rejectionRate = decArticles.length > 0
      ? Math.round((submissions.filter(s => s.status === 'Rejected').length / decArticles.length) * 100)
      : 0;

    // Journal breakdown based on actual submissions target journalId
    const journalCounts: Record<string, number> = {};
    submissions.forEach(s => {
      const jId = (s.journalId || 'IJASI').toUpperCase();
      journalCounts[jId] = (journalCounts[jId] || 0) + 1;
    });
    
    const colors = ['#0052cc', '#f97316', '#1e293b', '#10b981', '#eab308'];
    const journalData = Object.keys(journalCounts).map((key, idx) => ({
      name: key,
      value: journalCounts[key],
      color: colors[idx % colors.length]
    }));

    if (journalData.length === 0) {
      journalData.push({ name: 'No Submissions', value: 0, color: '#cbd5e1' });
    }

    // Dynamic statuses breakdown for Pie chart
    const statusData = [
      { name: 'Submitted', value: submittedCount, color: '#6366f1' },
      { name: 'In Review', value: reviewCount, color: '#94a3b8' },
      { name: 'Accepted', value: acceptedCount, color: '#10b981' },
      { name: 'Published', value: publishedCount, color: '#0052cc' },
      { name: 'Revisions', value: revisionCount, color: '#f97316' },
      { name: 'Rejected', value: rejectedCount, color: '#f43f5e' }
    ].filter(item => item.value > 0);

    if (statusData.length === 0) {
      statusData.push({ name: 'No Submissions', value: 1, color: '#cbd5e1' });
    }

    // Chronological Monthly Submission Timeline Data
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyStats = months.map(m => ({
      name: m,
      submissions: 0,
      downloads: 0,
      views: 0,
      citations: 0
    }));

    submissions.forEach(s => {
      if (s.submissionDate) {
        const dateObj = new Date(s.submissionDate);
        if (!isNaN(dateObj.getTime())) {
          const mIdx = dateObj.getMonth();
          if (mIdx >= 0 && mIdx < 12) {
            monthlyStats[mIdx].submissions += 1;
            monthlyStats[mIdx].downloads += s.downloads || 0;
            monthlyStats[mIdx].views += s.views || 0;
            monthlyStats[mIdx].citations += s.citations || 0;
          }
        }
      }
    });

    // Real cumulative citation data
    let cumulativeCitations = 0;
    const citationData = monthlyStats.map(stat => {
      cumulativeCitations += (stat.citations || 0);
      return {
        name: stat.name,
        citations: cumulativeCitations
      };
    });

    const viewsDownloadsData = monthlyStats.map(stat => {
      return {
        name: stat.name,
        downloads: stat.downloads || 0,
        views: stat.views || 0
      };
    });

    // Real-time top performing papers list sorted by citations, views descending
    const liveTopDocs = [...submissions]
      .sort((a, b) => ((b.citations || 0) + (b.views || 0)) - ((a.citations || 0) + (a.views || 0)))
      .slice(0, 3)
      .map(s => ({
        title: s.title,
        citations: s.citations || 0,
        downloads: s.downloads >= 1000 ? (s.downloads / 1000).toFixed(1) + 'K' : s.downloads.toString(),
        views: s.views >= 1000 ? (s.views / 1000).toFixed(1) + 'K' : s.views.toString()
      }));

    const finalTopPapers = liveTopDocs.length > 0 ? liveTopDocs : [
      { title: 'Natural Language Processing for Automated Scientific Literature Review', citations: 89, downloads: '2.2K', views: '12.5K' },
      { title: 'Deep Learning Approaches for Climate Pattern Recognition in Satellite Imagery', citations: 47, downloads: '1.3K', views: '8.9K' },
      { title: 'Transformer-Based Protein Structure Prediction with Attention Mechanisms', citations: 12, downloads: '456', views: '2.3K' }
    ];

    return (
      <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-2">
           <h2 className="text-xl font-serif font-black text-brand-navy">Analytics & Insights</h2>
           <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
              <input 
                type="text" 
                placeholder="Search metrics..."
                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-brand-action"
              />
           </div>
        </div>
 
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-8 rounded border border-slate-200 shadow-sm flex items-center justify-between group hover:border-brand-action/30 transition-all">
            <div className="text-left">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Total Citations</p>
              <h4 className="text-3xl font-serif font-black text-brand-navy">{totalCitations}</h4>
            </div>
            <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <Quote size={20} />
            </div>
          </div>
          <div className="bg-white p-8 rounded border border-slate-200 shadow-sm flex items-center justify-between group hover:border-brand-action/30 transition-all">
            <div className="text-left">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Total Downloads</p>
              <h4 className="text-3xl font-serif font-black text-brand-navy">
                {totalDownloads >= 1000 ? (totalDownloads / 1000).toFixed(1) + 'K' : totalDownloads}
              </h4>
            </div>
            <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <Download size={20} />
            </div>
          </div>
          <div className="bg-white p-8 rounded border border-slate-200 shadow-sm flex items-center justify-between group hover:border-brand-action/30 transition-all">
            <div className="text-left">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Total Views</p>
              <h4 className="text-3xl font-serif font-black text-brand-navy">
                {totalViews >= 1000 ? (totalViews / 1000).toFixed(1) + 'K' : totalViews}
              </h4>
            </div>
            <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <Eye size={20} />
            </div>
          </div>
          <div className="bg-white p-8 rounded border border-slate-200 shadow-sm flex items-center justify-between group hover:border-brand-action/30 transition-all">
            <div className="text-left">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">H-Index (Calculated)</p>
              <h4 className="text-3xl font-serif font-black text-brand-navy">{calculatedHIndex}</h4>
            </div>
            <div className="w-12 h-12 bg-yellow-50 text-yellow-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <Award size={20} />
            </div>
          </div>
        </div>
 
        {/* Research Productivity Ring / Performance Indices */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded border border-slate-200 shadow-sm text-left col-span-1">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Acceptance Rate</p>
            <div className="flex flex-col items-center justify-center py-6">
              <div className="relative w-32 h-32 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" className="stroke-slate-100" strokeWidth="8" fill="transparent" />
                  <circle cx="50" cy="50" r="40" className="stroke-emerald-500 transition-all duration-1000" strokeWidth="8" fill="transparent" strokeDasharray={251} strokeDashoffset={251 - (251 * acceptanceRate) / 100} />
                </svg>
                <div className="absolute text-brand-navy font-serif font-black text-2xl">{acceptanceRate}%</div>
              </div>
              <p className="text-xs text-slate-400 font-medium mt-4 text-center">Calculated from dynamic submitted and published manuscripts.</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded border border-slate-200 shadow-sm text-left col-span-1">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Rejection Ratio</p>
            <div className="flex flex-col items-center justify-center py-6">
              <div className="relative w-32 h-32 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" className="stroke-slate-100" strokeWidth="8" fill="transparent" />
                  <circle cx="50" cy="50" r="40" className="stroke-rose-500 transition-all duration-1000" strokeWidth="8" fill="transparent" strokeDasharray={251} strokeDashoffset={251 - (251 * rejectionRate) / 100} />
                </svg>
                <div className="absolute text-brand-navy font-serif font-black text-2xl">{rejectionRate}%</div>
              </div>
              <p className="text-xs text-slate-400 font-medium mt-4 text-center">Reflects percentage of manuscripts evaluated as unsuitable.</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded border border-slate-200 shadow-sm text-left col-span-1">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Workflow Health Indicators</p>
            <div className="space-y-4 py-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Avg. Review Duration</span>
                <span className="text-xs font-mono font-bold text-brand-navy">38 Days</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: '65%' }}></div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Peer Review Completion</span>
                <span className="text-xs font-mono font-bold text-brand-navy">92%</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: '92%' }}></div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Editorial Processing Speed</span>
                <span className="text-xs font-mono font-bold text-brand-navy">12 Days</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full">
                <div className="bg-blue-600 h-full rounded-full" style={{ width: '80%' }}></div>
              </div>
            </div>
          </div>
        </div>
 
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Citations Line Chart */}
          <div className="bg-white p-8 rounded border border-slate-200 shadow-sm text-left">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-navy mb-8 flex items-center gap-2">
              <TrendingUp size={14} className="text-brand-action" /> Citations Over Time
            </h3>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={citationData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fill: '#94a3b8' }}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fill: '#94a3b8' }}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="citations" 
                    stroke="#f97316" 
                    strokeWidth={3} 
                    dot={{ fill: '#f97316', r: 4 }} 
                    activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
 
          {/* Downloads & Views Bar Chart */}
          <div className="bg-white p-8 rounded border border-slate-200 shadow-sm text-left">
             <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-navy mb-8 flex items-center gap-2">
              <Eye size={14} className="text-brand-action" /> Downloads & Views
             </h3>
            <div className="h-80 w-full">
               <ResponsiveContainer width="100%" height="100%">
                <BarChart data={viewsDownloadsData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fill: '#94a3b8' }}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fill: '#94a3b8' }}
                  />
                  <Tooltip 
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }} />
                  <Bar dataKey="downloads" fill="#1e293b" radius={[4, 4, 0, 0]} barSize={12} />
                  <Bar dataKey="views" fill="#0052cc" radius={[4, 4, 0, 0]} barSize={12} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
 
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Journal Distribution Pie */}
          <div className="bg-white p-8 rounded border border-slate-200 shadow-sm text-left">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-navy mb-8">Journal Distribution</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie
                    data={journalData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {journalData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RePieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 mt-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              {journalData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span>{item.name} ({item.value})</span>
                </div>
              ))}
            </div>
          </div>
 
          {/* Manuscript Status Pie */}
          <div className="bg-white p-8 rounded border border-slate-200 shadow-sm text-left">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-navy mb-8">Manuscript Status</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie
                    data={statusData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RePieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
              {statusData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-[8px] font-bold text-slate-500 uppercase tracking-tight">{item.name} ({item.value})</span>
                </div>
              ))}
            </div>
          </div>
 
          {/* Top Performing Papers */}
          <div className="bg-white p-8 rounded border border-slate-200 shadow-sm text-left">
             <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-navy mb-8">Top Performing Papers</h3>
             <div className="space-y-4">
               {finalTopPapers.map((paper, i) => (
                  <div key={i} className="p-4 bg-slate-50 rounded group hover:bg-white hover:shadow-md transition-all border border-slate-100">
                    <div className="flex items-start gap-4">
                       <div className="w-6 h-6 bg-brand-action text-white rounded-full flex items-center justify-center shrink-0 text-[10px] font-black">
                         {i + 1}
                       </div>
                       <div>
                         <h4 className="text-xs font-bold text-brand-navy mb-3 line-clamp-2 leading-tight group-hover:text-brand-action transition-colors">{paper.title}</h4>
                         <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1 text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                               <Quote size={10} className="text-brand-action" /> {paper.citations}
                            </div>
                            <div className="flex items-center gap-1 text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                               <Download size={10} className="text-brand-action" /> {paper.downloads}
                            </div>
                            <div className="flex items-center gap-1 text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                               <Eye size={10} className="text-brand-action" /> {paper.views}
                            </div>
                         </div>
                       </div>
                    </div>
                  </div>
               ))}
             </div>
          </div>
        </div>
      </div>
    );
  };

  const renderProfile = () => (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
      {/* Profile Information Section */}
      <div className="bg-white rounded border border-slate-200 shadow-sm overflow-hidden text-left">
        <div className="px-8 py-4 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
          <User size={18} className="text-brand-action" />
          <h3 className="font-bold text-brand-navy">Profile Information</h3>
        </div>
        
        <div className="p-10 space-y-10">
          {/* Profile Photo */}
          <div className="flex items-center gap-8">
            <div className="w-24 h-24 bg-brand-navy rounded-full flex items-center justify-center text-white text-2xl font-serif font-black shadow-inner">
              {profileData.avatarUrl ? (
                <img src={profileData.avatarUrl} alt="Profile" className="w-full h-full object-cover rounded-full" />
              ) : (
                profileData.firstName?.charAt(0) || profileData.name?.charAt(0) || 'U'
              )}
            </div>
            <div className="text-left">
              <div className="font-bold text-sm text-brand-navy mb-1">Profile Photo</div>
              <div className="text-[10px] text-slate-400 font-medium mb-3">JPG, PNG up to 2MB</div>
              <button className="text-xs font-bold text-brand-action hover:underline">Change Photo</button>
            </div>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs font-bold text-brand-navy">First Name</label>
                <input 
                  type="text"
                  value={profileData.firstName || ''}
                  onChange={e => setProfileData({...profileData, firstName: e.target.value})}
                  className="w-full px-4 py-3 rounded border border-slate-200 bg-slate-50/30 focus:bg-white focus:ring-1 focus:ring-brand-action outline-none transition-all text-sm font-medium"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-brand-navy">Last Name</label>
                <input 
                  type="text"
                  value={profileData.lastName || ''}
                  onChange={e => setProfileData({...profileData, lastName: e.target.value})}
                  className="w-full px-4 py-3 rounded border border-slate-200 bg-slate-50/30 focus:bg-white focus:ring-1 focus:ring-brand-action outline-none transition-all text-sm font-medium"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-brand-navy flex items-center gap-2">
                <Mail size={14} className="text-slate-400" /> Email Address
              </label>
              <input 
                type="email"
                value={profileData.email || ''}
                disabled
                className="w-full px-4 py-3 rounded border border-slate-200 bg-slate-100/50 text-slate-500 cursor-not-allowed text-sm font-medium"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-brand-navy flex items-center gap-2">
                <Building size={14} className="text-slate-400" /> Institution
              </label>
              <input 
                type="text"
                value={profileData.affiliation || ''}
                onChange={e => setProfileData({...profileData, affiliation: e.target.value})}
                className="w-full px-4 py-3 rounded border border-slate-200 bg-slate-50/30 focus:bg-white focus:ring-1 focus:ring-brand-action outline-none transition-all text-sm font-medium"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs font-bold text-brand-navy">Department</label>
                <input 
                  type="text"
                  value={profileData.department || ''}
                  onChange={e => setProfileData({...profileData, department: e.target.value})}
                  className="w-full px-4 py-3 rounded border border-slate-200 bg-slate-50/30 focus:bg-white focus:ring-1 focus:ring-brand-action outline-none transition-all text-sm font-medium"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-brand-navy">ORCID ID</label>
                <input 
                  type="text"
                  placeholder="0000-0001-2345-6789"
                  value={profileData.orcidId || ''}
                  onChange={e => setProfileData({...profileData, orcidId: e.target.value})}
                  className="w-full px-4 py-3 rounded border border-slate-200 bg-slate-50/30 focus:bg-white focus:ring-1 focus:ring-brand-action outline-none transition-all text-sm font-medium"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-brand-navy flex items-center gap-2">
                <Globe size={14} className="text-slate-400" /> Personal Website
              </label>
              <input 
                type="url"
                value={profileData.website || ''}
                onChange={e => setProfileData({...profileData, website: e.target.value})}
                className="w-full px-4 py-3 rounded border border-slate-200 bg-slate-50/30 focus:bg-white focus:ring-1 focus:ring-brand-action outline-none transition-all text-sm font-medium"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-brand-navy">Bio</label>
              <textarea 
                rows={4}
                value={profileData.bio || ''}
                onChange={e => setProfileData({...profileData, bio: e.target.value})}
                className="w-full px-4 py-3 rounded border border-slate-200 bg-slate-50/30 focus:bg-white focus:ring-1 focus:ring-brand-action outline-none transition-all text-sm font-medium resize-none"
              />
            </div>

            <div className="flex justify-end pt-4">
              <button 
                type="submit"
                disabled={isUpdating}
                className="px-10 py-3 bg-brand-navy text-white text-xs font-black uppercase tracking-widest rounded hover:bg-brand-action transition-all flex items-center gap-3"
              >
                {isUpdating ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                Update Profile Data
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="bg-white rounded border border-slate-200 shadow-sm overflow-hidden text-left">
        <div className="px-8 py-4 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
          <Bell size={18} className="text-brand-action" />
          <h3 className="font-bold text-brand-navy">Notification Preferences</h3>
        </div>
        <div className="p-10 space-y-6">
          <label className="flex items-start gap-4 p-4 border border-transparent hover:border-slate-100 rounded-sm cursor-pointer group transition-all">
            <div className="mt-1">
              <input 
                type="checkbox" 
                className="w-4 h-4 accent-brand-action rounded border-slate-300"
                checked={profileData.notifications?.reviewUpdates ?? true}
                onChange={e => setProfileData({
                  ...profileData, 
                  notifications: { ...(profileData.notifications || {
                    reviewUpdates: true, manuscriptStatusChanges: true, citationAlerts: true, newsletter: false, marketing: false
                  }), reviewUpdates: e.target.checked }
                })}
              />
            </div>
            <div>
              <div className="text-sm font-bold text-brand-navy group-hover:text-brand-action transition-colors">Review Updates</div>
              <div className="text-xs text-slate-400">Get notified when reviewers submit comments</div>
            </div>
          </label>

          <label className="flex items-start gap-4 p-4 border border-transparent hover:border-slate-100 rounded-sm cursor-pointer group transition-all">
            <div className="mt-1">
              <input 
                type="checkbox" 
                className="w-4 h-4 accent-brand-action rounded border-slate-300"
                checked={profileData.notifications?.manuscriptStatusChanges ?? true}
                onChange={e => setProfileData({
                  ...profileData, 
                  notifications: { ...(profileData.notifications || {
                    reviewUpdates: true, manuscriptStatusChanges: true, citationAlerts: true, newsletter: false, marketing: false
                  }), manuscriptStatusChanges: e.target.checked }
                })}
              />
            </div>
            <div>
              <div className="text-sm font-bold text-brand-navy group-hover:text-brand-action transition-colors">Manuscript Status Changes</div>
              <div className="text-xs text-slate-400">Receive alerts when your manuscript status changes</div>
            </div>
          </label>

          <label className="flex items-start gap-4 p-4 border border-transparent hover:border-slate-100 rounded-sm cursor-pointer group transition-all">
            <div className="mt-1">
              <input 
                type="checkbox" 
                className="w-4 h-4 accent-brand-action rounded border-slate-300"
                checked={profileData.notifications?.citationAlerts ?? true}
                onChange={e => setProfileData({
                  ...profileData, 
                  notifications: { ...(profileData.notifications || {
                    reviewUpdates: true, manuscriptStatusChanges: true, citationAlerts: true, newsletter: false, marketing: false
                  }), citationAlerts: e.target.checked }
                })}
              />
            </div>
            <div>
              <div className="text-sm font-bold text-brand-navy group-hover:text-brand-action transition-colors">Citation Alerts</div>
              <div className="text-xs text-slate-400">Be notified when your papers are cited</div>
            </div>
          </label>

          <label className="flex items-start gap-4 p-4 border border-transparent hover:border-slate-100 rounded-sm cursor-pointer group transition-all">
            <div className="mt-1">
              <input 
                type="checkbox" 
                className="w-4 h-4 accent-brand-action rounded border-slate-300"
                checked={profileData.notifications?.newsletter ?? false}
                onChange={e => setProfileData({
                  ...profileData, 
                  notifications: { ...(profileData.notifications || {
                    reviewUpdates: true, manuscriptStatusChanges: true, citationAlerts: true, newsletter: false, marketing: false
                  }), newsletter: e.target.checked }
                })}
              />
            </div>
            <div>
              <div className="text-sm font-bold text-brand-navy group-hover:text-brand-action transition-colors">Academic Platform Newsletter</div>
              <div className="text-xs text-slate-400">Weekly digest of new publications and journal updates</div>
            </div>
          </label>

          <label className="flex items-start gap-4 p-4 border border-transparent hover:border-slate-100 rounded-sm cursor-pointer group transition-all">
            <div className="mt-1">
              <input 
                type="checkbox" 
                className="w-4 h-4 accent-brand-action rounded border-slate-300"
                checked={profileData.notifications?.marketing ?? false}
                onChange={e => setProfileData({
                  ...profileData, 
                  notifications: { ...(profileData.notifications || {
                    reviewUpdates: true, manuscriptStatusChanges: true, citationAlerts: true, newsletter: false, marketing: false
                  }), marketing: e.target.checked }
                })}
              />
            </div>
            <div>
              <div className="text-sm font-bold text-brand-navy group-hover:text-brand-action transition-colors">Marketing Communications</div>
              <div className="text-xs text-slate-400">Special offers and conference announcements</div>
            </div>
          </label>
        </div>
      </div>

      {/* Security Section */}
      <div className="bg-white rounded border border-slate-200 shadow-sm overflow-hidden text-left pb-10">
        <div className="px-8 py-4 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
          <ShieldCheck size={18} className="text-brand-action" />
          <h3 className="font-bold text-brand-navy">Security</h3>
        </div>
        <div className="p-10 space-y-8">
          <div className="space-y-2">
            <label className="text-xs font-bold text-brand-navy">Current Password</label>
            <input 
              type="password"
              placeholder="••••••••"
              value={passwords.current}
              onChange={e => setPasswords({...passwords, current: e.target.value})}
              className="w-full px-4 py-3 rounded border border-slate-200 bg-slate-50/30 focus:bg-white focus:ring-1 focus:ring-brand-action outline-none transition-all text-sm font-medium"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-xs font-bold text-brand-navy">New Password</label>
              <input 
                type="password"
                placeholder="••••••••"
                value={passwords.new}
                onChange={e => setPasswords({...passwords, new: e.target.value})}
                className="w-full px-4 py-3 rounded border border-slate-200 bg-slate-50/30 focus:bg-white focus:ring-1 focus:ring-brand-action outline-none transition-all text-sm font-medium"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-brand-navy">Confirm Password</label>
              <input 
                type="password"
                placeholder="••••••••"
                value={passwords.confirm}
                onChange={e => setPasswords({...passwords, confirm: e.target.value})}
                className="w-full px-4 py-3 rounded border border-slate-200 bg-slate-50/30 focus:bg-white focus:ring-1 focus:ring-brand-action outline-none transition-all text-sm font-medium"
              />
            </div>
          </div>
          <div className="flex justify-start">
             <button className="px-8 py-3 bg-brand-navy text-white text-[10px] font-black uppercase tracking-widest hover:bg-brand-action transition-all">
                Update Password
             </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Top Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4 text-left">
            <div className="w-10 h-10 bg-brand-navy flex items-center justify-center rounded-sm text-white font-serif font-black text-xl shadow-lg ring-4 ring-slate-50 overflow-hidden">
              {currentUser.avatarUrl ? (
                <img src={currentUser.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                (currentUser.firstName?.charAt(0) || currentUser.name.charAt(0))
              )}
            </div>
            <div>
              <h1 className="font-serif font-black text-brand-navy text-lg leading-none">
                {currentUser.firstName && currentUser.lastName ? `${currentUser.firstName} ${currentUser.lastName}` : currentUser.name}
              </h1>
              <p className="text-[9px] text-slate-400 uppercase tracking-widest font-black flex items-center gap-1 mt-1">
                Authorized Node: <span className="text-brand-action">{currentUser.role} Account</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-slate-50 border border-slate-100 rounded-full">
               <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
               <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Live Architecture Synced</span>
            </div>
            <button 
              onClick={logout}
              className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-red-500 transition-all"
            >
              <LogOut size={16} className="group-hover:translate-x-1 transition-transform" /> Logout
            </button>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar Navigation */}
          <aside className="lg:col-span-3 space-y-6">
            <nav className="bg-white border border-slate-100 rounded-sm p-2 shadow-sm space-y-1">
              <button 
                onClick={() => setActiveTab('overview')} 
                className={`w-full flex items-center justify-between px-4 py-3 transition-all ${
                  activeTab === 'overview' ? 'bg-brand-navy text-white font-black shadow-xl ring-2 ring-brand-navy/10' : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3 text-xs uppercase tracking-widest">
                  <LayoutDashboard size={18} /> Overview
                </div>
                {activeTab === 'overview' && <div className="w-1.5 h-1.5 rounded-full bg-brand-action"></div>}
              </button>
              
              <button 
                onClick={() => setActiveTab('submissions')} 
                className={`w-full flex items-center justify-between px-4 py-3 transition-all ${
                  activeTab === 'submissions' ? 'bg-brand-navy text-white font-black shadow-xl ring-2 ring-brand-navy/10' : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3 text-xs uppercase tracking-widest">
                  <FileText size={18} /> My Library
                </div>
                {submissions.length > 0 && (
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${activeTab === 'submissions' ? 'bg-brand-action text-white' : 'bg-slate-100 text-slate-500'}`}>
                    {submissions.length}
                  </span>
                )}
              </button>

              <button 
                onClick={() => setActiveTab('reviews')} 
                className={`w-full flex items-center justify-between px-4 py-3 transition-all ${
                  activeTab === 'reviews' ? 'bg-brand-navy text-white font-black shadow-xl ring-2 ring-brand-navy/10' : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3 text-xs uppercase tracking-widest">
                  <Clock size={18} /> Critical Tasks
                </div>
                {reviewTasks.length > 0 && (
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${activeTab === 'reviews' ? 'bg-brand-action text-white' : 'bg-slate-100 text-slate-500'}`}>
                    {reviewTasks.length}
                  </span>
                )}
              </button>

              <button 
                onClick={() => setActiveTab('analytics')} 
                className={`w-full flex items-center justify-between px-4 py-3 transition-all ${
                  activeTab === 'analytics' ? 'bg-brand-navy text-white font-black shadow-xl ring-2 ring-brand-navy/10' : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3 text-xs uppercase tracking-widest">
                  <TrendingUp size={18} /> Analytics & Insights
                </div>
              </button>

              <button 
                onClick={() => setActiveTab('billing')} 
                className={`w-full flex items-center justify-between px-4 py-3 transition-all ${
                  activeTab === 'billing' ? 'bg-brand-navy text-white font-black shadow-xl ring-2 ring-brand-navy/10' : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3 text-xs uppercase tracking-widest">
                  <CreditCard size={18} /> Billing
                </div>
                {invoices.filter(i => i.status === 'Pending' || i.status === 'Overdue').length > 0 && (
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${activeTab === 'billing' ? 'bg-brand-action text-white' : 'bg-amber-100 text-amber-800 font-bold'}`}>
                    {invoices.filter(i => i.status === 'Pending' || i.status === 'Overdue').length}
                  </span>
                )}
              </button>

              <button 
                onClick={() => setActiveTab('profile')} 
                className={`w-full flex items-center justify-between px-4 py-3 transition-all ${
                  activeTab === 'profile' ? 'bg-brand-navy text-white font-black shadow-xl ring-2 ring-brand-navy/10' : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3 text-xs uppercase tracking-widest">
                  <User size={18} /> My Profile
                </div>
              </button>
            </nav>

            <div className="bg-slate-50 border border-slate-100 rounded-sm p-4 space-y-4">
              <h5 className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Resources</h5>
              <Link to="/author-guidelines" className="flex items-center gap-3 text-xs font-bold text-brand-navy hover:text-brand-action transition-colors">
                <BookOpen size={16} /> Instruction Guide
              </Link>
            </div>

            <div className="p-8 bg-brand-navy rounded-sm text-white overflow-hidden relative group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-150 transition-transform duration-700 pointer-events-none">
                <Send size={120} className="-rotate-45" />
              </div>
              <h4 className="font-serif font-black text-xl mb-4 relative z-10 leading-tight">Architecture Submission</h4>
              <p className="text-[10px] text-white/40 mb-8 relative z-10 leading-relaxed font-black uppercase tracking-widest">
                Transmit your intellectual discoveries to the Academic repository.
              </p>
              <Link to="/submit" className="w-full py-4 bg-brand-action text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-sm flex items-center justify-center gap-4 hover:shadow-[0_0_20px_rgba(255,51,102,0.4)] transition-all">
                Initiate Protocol <Send size={14} />
              </Link>
            </div>

            <div className="bg-white border border-slate-100 p-6 rounded-sm space-y-4">
              <h5 className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-300">Quick Resource</h5>
              <div className="space-y-2">
                <Link to="/submission-workflow" className="flex items-center gap-2 text-xs font-bold text-brand-navy hover:text-brand-action transition-colors">
                  <div className="w-4 h-0.5 bg-brand-action"></div> Instruction Guide
                </Link>
                <Link to="/company" className="flex items-center gap-2 text-xs font-bold text-brand-navy hover:text-brand-action transition-colors">
                  <div className="w-4 h-0.5 bg-slate-200"></div> Publishing Standards
                </Link>
                <Link to="/rights-permissions" className="flex items-center gap-2 text-xs font-bold text-brand-navy hover:text-brand-action transition-colors">
                  <div className="w-4 h-0.5 bg-slate-200"></div> Ethical Matrix
                </Link>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <div className="lg:col-span-9 animate-in fade-in slide-in-from-right-2 duration-700">
            {loading ? (
              <div className="h-96 flex flex-col items-center justify-center bg-white rounded border border-slate-100">
                <Loader2 size={40} className="text-brand-action animate-spin mb-4" />
                <div className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">Retrieving Archive Node...</div>
              </div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  {activeTab === 'overview' && renderOverview()}
                  {activeTab === 'submissions' && renderSubmissions()}
                  {activeTab === 'reviews' && renderReviews()}
                  {activeTab === 'analytics' && renderAnalytics()}
                  {activeTab === 'billing' && (
                    <AuthorBilling
                      user={currentUser}
                      submissions={submissions}
                      invoices={invoices}
                      onRefreshData={fetchData}
                      activePaymentArticleId={activePaymentArticleId}
                      onClearActivePaymentArticleId={() => setActivePaymentArticleId(null)}
                    />
                  )}
                  {activeTab === 'profile' && renderProfile()}
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
