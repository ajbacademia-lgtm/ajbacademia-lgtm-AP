import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MockService } from '../services/mockDb';
import { Journal, Issue, Article, JournalEditor } from '../types';
import { Calendar, Layers, BookOpen, Info, Users, FileText, Share2, Rss, Award, CheckCircle2, ChevronRight, Download, Eye, ArrowRight, Shield, Upload, X, Send, Loader2, File as FileIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { NotFound } from './NotFound';

export const JournalPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { authState } = useAuth();
  const [journal, setJournal] = useState<Journal | undefined>(undefined);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [latestArticles, setLatestArticles] = useState<Article[]>([]);
  const [editors, setEditors] = useState<JournalEditor[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'home' | 'editorial' | 'authors' | 'articles'>('home');
  const [showBoardModal, setShowBoardModal] = useState(false);
  const [showMetadataModal, setShowMetadataModal] = useState(false);
  const [metaIssn, setMetaIssn] = useState('');
  const [metaEissn, setMetaEissn] = useState('');
  const [metaScopus, setMetaScopus] = useState(false);
  const [metaIndexing, setMetaIndexing] = useState('');

  const openMetadataEdit = () => {
    if (journal) {
      setMetaIssn(journal.issn || '');
      setMetaEissn(journal.eissn || 'Pending');
      setMetaScopus(journal.scopusIndexed ?? false);
      setMetaIndexing(journal.indexing ? journal.indexing.join(', ') : 'Scopus, Web of Science, DOAJ, Google Scholar, PubMed, Crossref, EBSCO, ProQuest');
      setShowMetadataModal(true);
    }
  };

  const handleSaveMetadata = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!journal) return;

    const updatedJournal: Journal = {
      ...journal,
      issn: metaIssn,
      eissn: metaEissn,
      scopusIndexed: metaScopus,
      indexing: metaIndexing.split(',').map(s => s.trim()).filter(Boolean)
    };

    const saved = await MockService.updateJournal(updatedJournal);
    setJournal(saved);
    setShowMetadataModal(false);
  };

  const handleDeleteMetadata = async () => {
    if (!journal) return;
    if (window.confirm('Are you sure you want to delete ISSN/E-ISSN information and all indexings from this homepage?')) {
      const updatedJournal: Journal = {
        ...journal,
        issn: '',
        eissn: 'Deleted',
        scopusIndexed: false,
        indexing: []
      };
      const saved = await MockService.updateJournal(updatedJournal);
      setJournal(saved);
    }
  };
  const [boardForm, setBoardForm] = useState({ name: '', email: '', researchArea: '', message: '' });
  const [uploadedCv, setUploadedCv] = useState<File | null>(null);
  const [isSubmittingBoard, setIsSubmittingBoard] = useState(false);
  const cvInputRef = React.useRef<HTMLInputElement>(null);

  const handleCvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedCv(e.target.files[0]);
    }
  };

  const handleBoardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingBoard(true);

    const subject = `Board Membership Inquiry: ${boardForm.name} - ${journal?.title}`;
    const body = `Name: ${boardForm.name}\nEmail: ${boardForm.email}\nResearch Area: ${boardForm.researchArea}\n\nAttached CV: ${uploadedCv?.name || 'No attachment'}\n\nMessage:\n${boardForm.message}`;
    const mailtoLink = `mailto:cv@academicpublishinggroup.org?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    setTimeout(() => {
      window.location.href = mailtoLink;
      setIsSubmittingBoard(false);
      setShowBoardModal(false);
      setUploadedCv(null);
      setBoardForm({ name: '', email: '', researchArea: '', message: '' });
    }, 1500);
  };

  useEffect(() => {
    if (id) {
      setLoading(true);
      Promise.all([
        MockService.getJournalById(id),
        MockService.getIssuesByJournal(id),
        MockService.getArticlesByJournal(id),
        MockService.getEditorsByJournal(id)
      ]).then(([jData, iData, aData, eData]) => {
        setJournal(jData);
        if (jData) {
          document.title = `${jData.title} | Academic Publishing Group`;
        }
        // Only show published issues to the public
        const publishedIssues = iData.filter(i => i.published).sort((a, b) => b.year - a.year || b.volume - a.volume || b.number - a.number);
        setIssues(publishedIssues);
        // Only show published articles on the home page
        const publishedArticles = aData.filter(a => a.status === 'Published')
          .sort((a, b) => new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime());
        setLatestArticles(publishedArticles.slice(0, 3)); 
        setEditors(eData);
        setLoading(false);
      });
    }
  }, [id]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id, activeTab]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium animate-pulse">Loading Journal Platform...</p>
        </div>
      </div>
    );
  }

  if (!journal) {
    return <NotFound />;
  }

  const currentIssue = issues[0];
  const editorsInChief = editors.filter(ed => ed.role === 'Editor-in-Chief');
  const otherEditors = editors.filter(ed => ed.role !== 'Editor-in-Chief');

  const handleForAuthorsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (authState.isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  const tabs = [
    { id: 'home', label: 'Home', icon: <BookOpen size={16} /> },
    { id: 'articles', label: 'Articles', icon: <FileText size={16} /> },
    { id: 'editorial', label: 'Editorial Board', icon: <Users size={16} /> },
    { id: 'authors', label: 'For Authors', icon: <Info size={16} /> },
  ] as const;

  return (
    <div className="bg-white min-h-screen">
      {/* Dynamic Journal Banner */}
      <section className="relative bg-brand-navy pt-24 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-brand-action/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row gap-12 items-center lg:items-start text-center lg:text-left">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-56 md:w-64 flex-shrink-0 relative group"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-brand-action to-blue-600 rounded shadow-2xl blur-lg opacity-25 group-hover:opacity-50 transition-opacity duration-500"></div>
              <img 
                src={journal.coverImage} 
                alt={journal.title} 
                className="relative w-full h-auto rounded shadow-2xl border border-white/10"
              />
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex-grow"
            >
              <nav className="flex items-center justify-center lg:justify-start gap-2 mb-6">
                <Link to="/journals" className="text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors">Journals</Link>
                <ChevronRight size={10} className="text-white/20" />
                <span className="text-[10px] font-black uppercase tracking-widest text-brand-action">{journal.category}</span>
              </nav>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-black text-white mb-6 leading-tight">
                {journal.title}
              </h1>
              
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-8">
                {journal.issn && (
                  <div className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-sm">
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/40">ISSN</span>
                    <span className="text-xs font-mono text-white/80">{journal.issn}</span>
                  </div>
                )}
                {journal.eissn && (
                  <div className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-sm">
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/40">E-ISSN</span>
                    <span className="text-xs font-mono text-white/80">{journal.eissn}</span>
                  </div>
                )}
                {journal.scopusIndexed && (
                  <div className="flex items-center gap-2 px-3 py-1 bg-brand-action/10 border border-brand-action/20 rounded-sm">
                    <Award size={14} className="text-brand-action" />
                    <span className="text-xs font-bold text-brand-action">Scopus Indexed</span>
                  </div>
                )}
                {authState.user?.role === 'admin' && (
                  <div className="flex items-center gap-2 ml-2">
                    <button 
                      onClick={openMetadataEdit}
                      className="p-1.5 bg-brand-action text-white hover:bg-white hover:text-brand-navy rounded transition-all flex items-center gap-1 text-[10px] font-black uppercase tracking-widest"
                      title="Edit ISSN & Indexing"
                    >
                      <Layers size={10} /> Edit Metadata
                    </button>
                    <button 
                      onClick={handleDeleteMetadata}
                      className="p-1.5 bg-red-650 text-white hover:bg-red-800 rounded transition-all flex items-center gap-1 text-[10px] font-black uppercase tracking-widest"
                      title="Delete Metadata"
                    >
                      <X size={10} /> Delete Info
                    </button>
                  </div>
                )}
              </div>
              
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                <Link to={`/submit?journalId=${journal.id}`} className="px-8 py-3 bg-brand-action text-white font-bold uppercase tracking-widest text-xs rounded-sm hover:bg-white hover:text-brand-navy transition-all shadow-xl">
                  Submit Manuscript
                </Link>
                <button 
                  onClick={handleForAuthorsClick}
                  className="px-8 py-3 bg-white/5 text-white/80 border border-white/10 font-bold uppercase tracking-widest text-xs rounded-sm hover:bg-white/10 transition-all flex items-center gap-2"
                >
                  <Users size={14} /> For Authors
                </button>
                <button className="px-8 py-3 bg-transparent text-white/60 hover:text-white transition-all">
                  <Share2 size={14} />
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Tabs Navigation */}
      <div className="sticky top-0 bg-white border-b border-gray-100 z-40 shadow-sm overflow-x-auto">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-8 min-w-max">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-5 text-xs font-black uppercase tracking-widest transition-all relative ${
                  activeTab === tab.id ? 'text-brand-navy' : 'text-slate-400 hover:text-brand-navy'
                }`}
              >
                {tab.icon}
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div 
                    layoutId="activeTab" 
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-action"
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Main Content Side */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              {activeTab === 'home' && (
                <motion.div
                  key="home"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-12"
                >
                  <section>
                    <h2 className="text-2xl font-serif font-black text-brand-navy mb-6 flex items-center gap-3">
                      <div className="w-8 h-1 bg-brand-action"></div>
                      Aims and Scope
                    </h2>
                    <div className="prose prose-slate max-w-none">
                      <p className="text-slate-600 leading-relaxed text-lg italic mb-6">
                        {journal.description}
                      </p>
                      <p className="text-slate-600 leading-relaxed">
                        {journal.title} is a premier international journal for researchers, practitioners, and educators to exchange and disseminate theoretical and empirical research on all aspects of {journal.subject || 'modern research'}.
                      </p>
                      <p className="text-slate-600 leading-relaxed mt-4 font-bold">
                        Core coverage areas include:
                      </p>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                        {[
                          'Theoretical foundations and innovative methodologies',
                          'Empirical studies and experimental research',
                          'Case studies and industry applications',
                          'Policy implications and ethical considerations',
                          'Future trends and disruptive technologies',
                          'Cross-disciplinary integrations'
                        ].map((item, i) => (
                          <li key={i} className="flex items-center gap-3 text-sm text-slate-500">
                            <CheckCircle2 size={16} className="text-brand-action flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </section>

                  {latestArticles.length > 0 && (
                    <section>
                      <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-serif font-black text-brand-navy flex items-center gap-3">
                          <div className="w-8 h-1 bg-brand-action"></div>
                          Latest Real-time Articles
                        </h2>
                        <button 
                          onClick={() => setActiveTab('articles')}
                          className="text-xs font-black uppercase tracking-widest text-brand-action hover:underline"
                        >
                          View All
                        </button>
                      </div>
                      <div className="space-y-6">
                        {latestArticles.map(article => (
                          <motion.div 
                            key={article.id}
                            whileHover={{ x: 4 }}
                            className="p-6 bg-slate-50 border border-slate-100 rounded hover:border-brand-action hover:bg-white hover:shadow-xl transition-all group"
                          >
                            <Link to={`/article/${article.id}`}>
                              <h3 className="text-lg font-bold text-brand-navy mb-2 group-hover:text-brand-action transition-colors leading-tight">
                                {article.title}
                              </h3>
                            </Link>
                            <p className="text-xs text-slate-400 mb-4 flex flex-wrap gap-x-4 gap-y-1">
                              <span className="font-bold text-slate-600">
                                {article.authors.map(a => `${a.firstName} ${a.lastName}`).join(', ')}
                              </span>
                              <span className="flex items-center gap-1"><Eye size={12} /> {article.views} Views</span>
                              <span className="flex items-center gap-1"><Download size={12} /> {article.downloads} Downloads</span>
                            </p>
                            <div className="flex items-center gap-4">
                              <Link to={`/article/${article.id}`} className="text-xs font-black uppercase tracking-widest text-brand-navy hover:text-brand-action transition-colors flex items-center gap-2">
                                Abstract <ArrowRight size={14} />
                              </Link>
                              <a href="#" className="text-xs font-black uppercase tracking-widest text-brand-action hover:text-brand-navy transition-colors flex items-center gap-2">
                                PDF Full-Text <Download size={14} />
                              </a>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </section>
                  )}

                  <section className="bg-brand-navy p-8 rounded text-white overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                      <Layers size={80} />
                    </div>
                    <h3 className="text-xl font-serif font-bold mb-4 relative z-10">Indexing and Abstracting</h3>
                    <p className="text-white/60 text-sm mb-8 max-w-xl relative z-10">
                      We ensure maximum visibility for your research. This journal is indexed in international citation databases and academic repositories.
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 relative z-10">
                      {(journal.indexing || ['Scopus', 'Web of Science', 'DOAJ', 'Google Scholar', 'PubMed', 'Crossref', 'EBSCO', 'ProQuest']).map(index => (
                        <div key={index} className="px-4 py-2 bg-white/10 border border-white/10 rounded text-[10px] uppercase font-black tracking-widest text-center hover:bg-white/20 transition-colors">
                          {index}
                        </div>
                      ))}
                    </div>
                  </section>
                </motion.div>
              )}

              {activeTab === 'articles' && (
                <motion.div
                  key="articles"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-12"
                >
                   <section>
                    <h2 className="text-2xl font-serif font-black text-brand-navy mb-8 flex items-center gap-3">
                      <div className="w-8 h-1 bg-brand-action"></div>
                      Browse Volumes & Issues
                    </h2>
                    
                    <div className="space-y-8">
                       {currentIssue && (
                        <div>
                          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-action mb-4">Current Issue</h3>
                          <div className="p-8 border-2 border-brand-action bg-brand-action/5 rounded flex flex-col md:flex-row gap-8 items-center">
                            <div className="w-32 h-44 bg-brand-navy rounded shadow-xl flex-shrink-0">
                               <img 
                                src={currentIssue.coverImage || journal.coverImage} 
                                alt="" 
                                className="w-full h-full object-cover rounded opacity-80"
                              />
                            </div>
                            <div className="flex-grow text-center md:text-left">
                               <div className="text-2xl font-serif font-bold text-brand-navy mb-2">
                                  Volume {currentIssue.volume}, Number {currentIssue.number}
                               </div>
                               <div className="text-slate-500 mb-6">Published: {currentIssue.year}</div>
                               <Link to={`/issue/${currentIssue.id}`} className="px-8 py-3 bg-brand-navy text-white font-bold uppercase tracking-widest text-xs rounded-sm hover:bg-brand-action transition-all inline-block shadow-lg">
                                  Browse Full Issue
                               </Link>
                            </div>
                          </div>
                        </div>
                       )}

                       <div>
                          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Past Archives</h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {issues.slice(1).map(issue => (
                               <Link 
                                key={issue.id} 
                                to={`/issue/${issue.id}`}
                                className="p-4 border border-slate-100 rounded hover:border-brand-action hover:shadow-md transition-all flex items-center justify-between group"
                               >
                                 <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-slate-50 rounded flex items-center justify-center text-slate-400 group-hover:text-brand-action">
                                       <Calendar size={20} />
                                    </div>
                                    <div>
                                       <div className="font-bold text-brand-navy text-sm">Vol {issue.volume}, No {issue.number}</div>
                                       <div className="text-[10px] text-slate-400 uppercase tracking-widest">{issue.year}</div>
                                    </div>
                                 </div>
                                 <ChevronRight size={16} className="text-slate-300 group-hover:text-brand-action" />
                               </Link>
                            ))}
                          </div>
                       </div>
                    </div>
                  </section>
                </motion.div>
              )}

              {activeTab === 'editorial' && (
                <motion.div
                  key="editorial"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-12"
                >
                   <section>
                    <h2 className="text-2xl font-serif font-black text-brand-navy mb-6 flex items-center gap-3">
                      <div className="w-8 h-1 bg-brand-action"></div>
                      Editorial Board
                    </h2>
                    <div className="prose prose-slate max-w-none mb-12">
                      <p className="text-slate-600">
                        Our distinguished editorial board consists of world-class scholars and experts across all disciplines of {journal.category}. They ensure the academic rigor and ethical standards of all published work.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="space-y-8">
                          <div>
                             <h3 className="text-[10px] font-black uppercase tracking-widest text-brand-action mb-6">Editor-in-Chief</h3>
                             <div className="space-y-6">
                               {editorsInChief.length > 0 ? (
                                 editorsInChief.map((eic, idx) => (
                                   <div key={eic.id || idx} className="flex gap-4 items-start border-l-2 border-brand-action/40 pl-4">
                                     <div className="w-16 h-16 bg-slate-100 rounded-full flex-shrink-0 flex items-center justify-center text-slate-400 overflow-hidden">
                                       {eic.photoUrl ? (
                                         <img 
                                            src={eic.photoUrl} 
                                            className="w-16 h-16 rounded-full object-cover shadow border border-slate-100 flex-shrink-0" 
                                            alt={eic.name}
                                            referrerPolicy="no-referrer"
                                         />
                                       ) : (
                                         <Users size={32} />
                                       )}
                                     </div>
                                     <div>
                                        <div className="font-bold text-brand-navy underline decoration-brand-action decoration-2 underline-offset-4 font-serif">{eic.name}</div>
                                        <div className="text-xs text-slate-500 mt-1">{eic.affiliation}</div>
                                        <div className="text-[10px] text-brand-action font-black uppercase tracking-widest mt-2 hover:underline cursor-pointer">View Profile</div>
                                     </div>
                                   </div>
                                 ))
                               ) : (
                                 <div className="flex gap-4 items-start">
                                    <div className="w-16 h-16 bg-slate-100 rounded-full flex-shrink-0 flex items-center justify-center text-slate-400">
                                       <Users size={32} />
                                    </div>
                                    <div>
                                       <div className="font-bold text-brand-navy underline decoration-brand-action decoration-2 underline-offset-4 font-serif">Prof. Alexander Sterling, PhD</div>
                                       <div className="text-xs text-slate-500 mt-1">Massachusetts Institute of Technology, USA</div>
                                       <div className="text-[10px] text-brand-action font-black uppercase tracking-widest mt-2 hover:underline cursor-pointer">View Profile</div>
                                    </div>
                                 </div>
                               )}
                             </div>
                          </div>

                          <div>
                             <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6 font-bold">Associate Editors</h3>
                             <div className="space-y-6">
                                {(otherEditors.length > 0 ? otherEditors : [
                                   { name: 'Dr. Sarah Chen', affiliation: 'Nanyang Technological University, Singapore', role: 'Associate Editor' },
                                   { name: 'Prof. Maria Garcia', affiliation: 'University of Madrid, Spain', role: 'Associate Editor' },
                                   { name: 'Dr. Hiroshi Tanaka', affiliation: 'University of Tokyo, Japan', role: 'Associate Editor' },
                                   { name: 'Prof. David Okoro', affiliation: 'University of Cape Town, South Africa', role: 'Associate Editor' }
                                 ]).map((ed, i) => (
                                  <div key={i} className="flex gap-4 items-start border-l-2 border-slate-100 pl-4">
                                      {ed.photoUrl && (
                                         <img 
                                            src={ed.photoUrl} 
                                            className="w-10 h-10 rounded-full object-cover shadow border border-slate-100 flex-shrink-0" 
                                            alt={ed.name}
                                            referrerPolicy="no-referrer"
                                         />
                                      )}
                                      <div>
                                         <div className="font-bold text-brand-navy text-sm">{ed.name}</div>
                                         {ed.role && ed.role !== 'Associate Editor' && <div className="text-[9px] text-brand-action font-bold uppercase tracking-wider mb-0.5">{ed.role}</div>}
                                         <div className="text-[10px] text-slate-500">{ed.aff || ed.affiliation}</div>
                                         {ed.email && <div className="text-[9px] text-slate-400 font-mono mt-0.5">{ed.email}</div>}
                                      </div>
                                   </div>
                                ))}
                             </div>
                          </div>
                       </div>

                       <div className="bg-slate-50 p-8 rounded border border-slate-100 h-fit">
                          <h3 className="font-bold text-brand-navy mb-4">Join our Board</h3>
                          <p className="text-sm text-slate-600 mb-6">
                            We are always looking for passionate researchers to contribute to our peer-review process or join our editorial team.
                          </p>
                          <div className="space-y-4">
                            <button 
                              onClick={() => setShowBoardModal(true)}
                              className="w-full py-4 bg-brand-navy text-white font-black uppercase tracking-widest text-[10px] rounded hover:bg-brand-action transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-navy/10"
                            >
                              <Upload size={14} /> Submit Application & CV
                            </button>
                            <p className="text-[9px] text-slate-400 text-center uppercase tracking-widest font-black">
                              Review cycle: 14-21 Business Days
                            </p>
                          </div>
                       </div>
                    </div>
                  </section>
                </motion.div>
              )}

              {activeTab === 'authors' && (
                <motion.div
                  key="authors"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-12"
                >
                  <section>
                    <h2 className="text-2xl font-serif font-black text-brand-navy mb-6 flex items-center gap-3">
                      <div className="w-8 h-1 bg-brand-action"></div>
                      Information for Authors
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                       <div className="p-6 bg-slate-50 border border-slate-100 rounded text-center hover:bg-brand-action shadow-sm hover:text-white transition-all group">
                          <div className="w-10 h-10 bg-white shadow-sm rounded-full flex items-center justify-center mx-auto mb-4 text-brand-action">
                             <FileText size={20} />
                          </div>
                          <h4 className="font-bold text-sm mb-2">Author Guidelines</h4>
                          <p className="text-[10px] opacity-60 uppercase font-bold tracking-wider">PDF Download</p>
                       </div>
                       <div className="p-6 bg-slate-50 border border-slate-100 rounded text-center hover:bg-brand-action shadow-sm hover:text-white transition-all group">
                          <div className="w-10 h-10 bg-white shadow-sm rounded-full flex items-center justify-center mx-auto mb-4 text-brand-action">
                             <Layers size={20} />
                          </div>
                          <h4 className="font-bold text-sm mb-2">Word Template</h4>
                          <p className="text-[10px] opacity-60 uppercase font-bold tracking-wider">DOCX Download</p>
                       </div>
                       <div className="p-6 bg-slate-50 border border-slate-100 rounded text-center hover:bg-brand-action shadow-sm hover:text-white transition-all group">
                          <div className="w-10 h-10 bg-white shadow-sm rounded-full flex items-center justify-center mx-auto mb-4 text-brand-action">
                             <Rss size={20} />
                          </div>
                          <h4 className="font-bold text-sm mb-2">LaTeX Style</h4>
                          <p className="text-[10px] opacity-60 uppercase font-bold tracking-wider">ZIP Download</p>
                       </div>
                    </div>

                    <div className="space-y-8 prose prose-slate max-w-none">
                       <div>
                          <h3 className="text-lg font-bold text-brand-navy">Peer Review Process</h3>
                          <p className="text-sm text-slate-600 leading-relaxed">
                            {journal.title} operates a double-blind peer review process. All manuscripts are initially screened by the Editor-in-Chief for suitability and aims. Suitable papers are sent to at least two independent expert reviewers to assess the scientific quality of the paper. The Editor is responsible for the final decision regarding acceptance or rejection of articles.
                          </p>
                       </div>
                       <div>
                          <h3 className="text-lg font-bold text-brand-navy">Open Access Policy</h3>
                          <p className="text-sm text-slate-600 leading-relaxed">
                            This is a fully open access journal, which means that all articles are available on the internet to all users immediately upon publication. Non-commercial use and distribution in any medium is permitted, provided the author and the journal are properly credited.
                          </p>
                       </div>
                       <div className="p-6 bg-blue-50 border-l-4 border-blue-500 rounded">
                          <p className="text-sm text-blue-800 font-medium">
                            <CheckCircle2 size={18} className="inline mr-2" />
                            Academic Publishing Journals are committed to rapid publication. Average time from submission to first decision: <strong>24.2 Days</strong>.
                          </p>
                       </div>
                    </div>
                  </section>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar Area */}
          <div className="lg:col-span-4 space-y-12">
            {/* Impact Metrics Card */}
            <div className="bg-slate-50 p-8 rounded border border-slate-100">
               <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-action mb-8">Journal Metrics</h3>
               <div className="space-y-8">
                  <div className="flex items-end justify-between border-b border-slate-200 pb-4">
                     <div>
                        <div className="text-3xl font-serif font-black text-brand-navy">5.82</div>
                        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">Impact Factor (2023)</div>
                     </div>
                     <div className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">+0.42</div>
                  </div>
                  <div className="flex items-end justify-between border-b border-slate-200 pb-4">
                     <div>
                        <div className="text-3xl font-serif font-black text-brand-navy">8.4</div>
                        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">CiteScore</div>
                     </div>
                     <div className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">Rank #4</div>
                  </div>
                  <div className="flex items-end justify-between border-b border-slate-200 pb-4">
                     <div>
                        <div className="text-3xl font-serif font-black text-brand-navy">24.2d</div>
                        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">Time to First Decision</div>
                     </div>
                  </div>
               </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-4">
               <button 
                  onClick={handleForAuthorsClick}
                  className="flex items-center justify-between w-full p-6 bg-brand-navy text-brand-action border border-brand-action/20 rounded shadow-lg hover:bg-brand-action hover:text-white transition-all group"
               >
                  <div className="text-left">
                     <div className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">Author Services</div>
                     <div className="font-serif font-black text-xl">For Authors portal</div>
                  </div>
                  <ArrowRight className="group-hover:translate-x-2 transition-transform" />
               </button>
               <Link to={`/submit?journalId=${journal.id}`} className="flex items-center justify-between w-full p-6 bg-brand-action text-white rounded shadow-lg hover:bg-brand-navy transition-all group">
                  <div className="text-left">
                     <div className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">Ready to publish?</div>
                     <div className="font-serif font-black text-xl">Start Submission</div>
                  </div>
                  <ChevronRight className="group-hover:translate-x-2 transition-transform" />
               </Link>
               <Link to="/submission-workflow" className="flex items-center justify-between w-full p-6 bg-white border border-slate-100 rounded shadow-sm hover:border-brand-action transition-all group">
                  <div className="text-left">
                     <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">How it works</div>
                     <div className="font-serif font-black text-xl text-brand-navy">Our Workflow</div>
                  </div>
                  <ChevronRight className="group-hover:translate-x-2 transition-transform text-brand-action" />
               </Link>
            </div>

            {/* Newsletter */}
            <div className="bg-brand-navy p-8 rounded text-white text-center">
               <Rss size={32} className="mx-auto text-brand-action mb-4" />
               <h3 className="font-serif font-black text-xl mb-2">Issue Alerts</h3>
               <p className="text-white/40 text-[10px] uppercase font-black tracking-widest mb-6">Stay updated with new research</p>
               <input 
                type="email" 
                placeholder="author@university.edu"
                className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-3 text-xs mb-4 outline-none focus:border-brand-action transition-colors"
               />
               <button className="w-full py-3 bg-brand-action text-white font-bold uppercase tracking-widest text-[10px] rounded transition-all">Subscribe</button>
            </div>
            
            {/* Publisher Info */}
            <div className="text-center pt-8 border-t border-slate-100">
               <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">Published by</div>
               <div className="font-serif font-black text-brand-navy tracking-tighter text-2xl">ACADEMIC PUBLISHING GROUP</div>
               <p className="text-[8px] uppercase font-black tracking-widest text-slate-400 mt-2">Connecting Global Scientific Intelligence</p>
            </div>
          </div>
        </div>
      </main>

      {/* Board Membership and Metadata Modals */}
      <AnimatePresence>
        {showBoardModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowBoardModal(false)}
              className="absolute inset-0 bg-brand-navy/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white w-full max-w-xl rounded-sm shadow-2xl overflow-hidden"
            >
              <div className="bg-brand-navy p-6 text-white flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-serif font-black">Apply for Board Membership</h3>
                  <p className="text-[10px] font-black uppercase tracking-widest text-brand-action mt-1">Direct submission to Academic Publishing</p>
                </div>
                <button onClick={() => setShowBoardModal(false)} className="text-white/60 hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleBoardSubmit} className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-brand-navy/40">Full Name</label>
                    <input 
                      required
                      type="text"
                      value={boardForm.name}
                      onChange={e => setBoardForm({...boardForm, name: e.target.value})}
                      placeholder="Prof. Jane Doe"
                      className="w-full border-b border-gray-200 py-2 outline-none focus:border-brand-action transition-colors text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-brand-navy/40">Email Address</label>
                    <input 
                      required
                      type="email"
                      value={boardForm.email}
                      onChange={e => setBoardForm({...boardForm, email: e.target.value})}
                      placeholder="jane.doe@university.edu"
                      className="w-full border-b border-gray-200 py-2 outline-none focus:border-brand-action transition-colors text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-brand-navy/40">Primary Research Area</label>
                  <input 
                    required
                    type="text"
                    value={boardForm.researchArea}
                    onChange={e => setBoardForm({...boardForm, researchArea: e.target.value})}
                    placeholder="e.g. Molecular Biology, Quantum Computing..."
                    className="w-full border-b border-gray-200 py-2 outline-none focus:border-brand-action transition-colors text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-brand-navy/40">Message to Editor-in-Chief</label>
                  <textarea 
                    rows={3}
                    value={boardForm.message}
                    onChange={e => setBoardForm({...boardForm, message: e.target.value})}
                    placeholder="Briefly describe your motivation for joining the board..."
                    className="w-full border-b border-gray-200 py-2 outline-none focus:border-brand-action transition-colors text-sm resize-none"
                  ></textarea>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-brand-navy/40">Attach Academic CV (PDF)</label>
                  <input 
                    type="file"
                    ref={cvInputRef}
                    onChange={handleCvChange}
                    className="hidden"
                    accept=".pdf"
                  />
                  <div 
                    onClick={() => cvInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-100 rounded-sm p-8 flex flex-col items-center justify-center cursor-pointer hover:border-brand-action hover:bg-brand-action/5 transition-all group"
                  >
                    {uploadedCv ? (
                      <div className="flex items-center gap-4 text-brand-navy w-full px-4">
                        <div className="w-10 h-10 bg-brand-action/10 rounded flex items-center justify-center shrink-0">
                          <FileIcon className="text-brand-action" size={20} />
                        </div>
                        <div className="text-left overflow-hidden">
                          <div className="text-sm font-bold truncate">{uploadedCv.name}</div>
                          <div className="text-[10px] text-brand-navy/40 uppercase font-black tracking-widest">
                            {(uploadedCv.size / 1024 / 1024).toFixed(2)} MB — Added
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Upload size={32} className="text-gray-300 mb-3 group-hover:text-brand-action transition-colors mx-auto" />
                        <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Click to upload CV</p>
                      </div>
                    )}
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={isSubmittingBoard}
                  className="w-full bg-brand-navy text-white py-4 rounded-sm font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 hover:bg-brand-action transition-all disabled:opacity-70 shadow-xl shadow-brand-navy/10"
                >
                  {isSubmittingBoard ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="animate-spin" size={16} /> Processing Application...
                    </span>
                  ) : (
                    <>
                      <Send size={16} /> Submit Board Application
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
        {showMetadataModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMetadataModal(false)}
              className="absolute inset-0 bg-brand-navy/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white w-full max-w-xl rounded-sm shadow-2xl overflow-hidden text-left"
            >
              <div className="bg-brand-navy p-6 text-white flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-serif font-black">Edit Homepage Metadata</h3>
                  <p className="text-[10px] font-black uppercase tracking-widest text-brand-action mt-1">Configure ISSN, E-ISSN, Scopus and Databases</p>
                </div>
                <button onClick={() => setShowMetadataModal(false)} className="text-white/60 hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSaveMetadata} className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-brand-navy/40">ISSN</label>
                    <input 
                      required
                      type="text"
                      value={metaIssn}
                      onChange={e => setMetaIssn(e.target.value)}
                      placeholder="e.g. 2456-1878"
                      className="w-full border-b border-gray-200 py-2 outline-none focus:border-brand-action transition-colors text-sm font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-brand-navy/40">E-ISSN</label>
                    <input 
                      required
                      type="text"
                      value={metaEissn}
                      onChange={e => setMetaEissn(e.target.value)}
                      placeholder="e.g. Pending"
                      className="w-full border-b border-gray-200 py-2 outline-none focus:border-brand-action transition-colors text-sm font-mono"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox"
                    id="meta-scopus"
                    checked={metaScopus}
                    onChange={e => setMetaScopus(e.target.checked)}
                    className="rounded text-brand-action focus:ring-brand-action h-4 w-4 cursor-pointer"
                  />
                  <label htmlFor="meta-scopus" className="text-xs font-semibold text-brand-navy cursor-pointer selection:bg-transparent">
                    Is Scopus Indexed (Displays "Scopus Indexed" badge)
                  </label>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-brand-navy/40">
                    Indexing & Abstracting Databases (Comma Separated)
                  </label>
                  <textarea 
                    rows={3}
                    value={metaIndexing}
                    onChange={e => setMetaIndexing(e.target.value)}
                    placeholder="e.g. Scopus, Web of Science, DOAJ, Google Scholar, PubMed, Crossref, EBSCO, ProQuest"
                    className="w-full border border-gray-100 p-3 outline-none focus:border-brand-action transition-colors text-sm rounded-sm"
                  ></textarea>
                </div>

                <div className="flex justify-between gap-4 pt-2">
                  <button 
                    type="button" 
                    onClick={handleDeleteMetadata}
                    className="px-4 py-2.5 bg-red-50 text-red-600 font-bold uppercase tracking-widest text-[10px] rounded-sm hover:bg-red-100 transition-all font-sans"
                  >
                    Delete ISSN / Info
                  </button>
                  <div className="flex gap-4">
                    <button 
                      type="button" 
                      onClick={() => setShowMetadataModal(false)}
                      className="px-4 py-2.5 border border-gray-200 text-slate-500 font-bold uppercase tracking-widest text-[10px] rounded-sm hover:bg-slate-50 transition-all font-sans"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      className="px-6 py-2.5 bg-brand-action text-white font-bold uppercase tracking-widest text-[10px] rounded-sm hover:bg-brand-navy transition-all shadow-xl shadow-brand-action/10 font-sans"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer dynamic section */}
       <section className="bg-slate-50 py-20 border-t border-slate-100 mt-20">
          <div className="container mx-auto px-6 text-center">
             <h2 className="text-3xl font-serif font-black text-brand-navy mb-8 italic">"Advancing the frontiers of {journal.subject}."</h2>
             <div className="flex justify-center flex-wrap gap-8 opacity-30 grayscale hover:grayscale-0 transition-all duration-500">
                <div className="h-12 w-32 bg-slate-300 rounded border-2 border-slate-400 flex items-center justify-center font-black text-slate-500">IEEE</div>
                <div className="h-12 w-32 bg-slate-300 rounded border-2 border-slate-400 flex items-center justify-center font-black text-slate-500">ACM</div>
                <div className="h-12 w-32 bg-slate-300 rounded border-2 border-slate-400 flex items-center justify-center font-black text-slate-500">ELSEVIER</div>
                <div className="h-12 w-32 bg-slate-300 rounded border-2 border-slate-400 flex items-center justify-center font-black text-slate-500">SPRINGER</div>
             </div>
          </div>
       </section>
    </div>
  );
};
