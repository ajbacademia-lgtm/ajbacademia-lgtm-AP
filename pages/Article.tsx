import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MockService } from '../services/mockDb';
import { GeminiService } from '../services/geminiService';
import { Article, Issue, Journal } from '../types';
import { NotFound } from './NotFound';
import { 
  Download, 
  Eye, 
  Sparkles, 
  FileText, 
  Share2, 
  Quote, 
  Twitter, 
  Linkedin, 
  Mail, 
  Link2, 
  Check 
} from 'lucide-react';

export const ArticlePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<Article | undefined>(undefined);
  const [issue, setIssue] = useState<Issue | undefined>(undefined);
  const [journal, setJournal] = useState<Journal | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  
  // AI State
  const [aiSummary, setAiSummary] = useState<string>('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiKeywords, setAiKeywords] = useState<string[]>([]);

  // UI State
  const [isShareExpanded, setIsShareExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        setLoading(true);
        try {
          const aData = await MockService.getArticleById(id);
          if (aData) {
            setArticle(aData);
            document.title = `${aData.title} | Academic Publishing Group`;
            if (aData.issueId) {
              const iData = await MockService.getIssueById(aData.issueId);
              setIssue(iData);
            }
            if (aData.journalId) {
              const jData = await MockService.getJournalById(aData.journalId);
              setJournal(jData);
            }
          }
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [id]);

  const handleGenerateAiSummary = async () => {
    if (!article) return;
    setAiLoading(true);
    try {
        const summary = await GeminiService.summarizeForLayman(article.abstract);
        setAiSummary(summary);
        
        // Also fetch keywords if not already there
        if(aiKeywords.length === 0) {
            const keys = await GeminiService.suggestKeywords(article.title, article.abstract);
            setAiKeywords(keys);
        }
    } finally {
        setAiLoading(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareTwitter = () => {
    const text = encodeURIComponent(`Check out this article on Academic Publishing: ${article?.title}`);
    const url = encodeURIComponent(window.location.href);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
  };

  const shareLinkedIn = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
  };

  const shareEmail = () => {
    const subject = encodeURIComponent(`Academic Article: ${article?.title}`);
    const body = encodeURIComponent(`I thought you might find this article interesting: ${window.location.href}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-slate-500 font-medium animate-pulse text-sm">Retrieving Scholarly Content...</div>
    </div>
  );

  if (!article || !journal) return <NotFound />;

  return (
    <div className="bg-white min-h-screen pb-12">
        {/* Context Bar */}
        <div className="bg-slate-50 border-b border-gray-200">
            <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-start md:items-center text-sm gap-2">
                <div className="flex items-center gap-2 text-slate-500">
                    <Link to="/" className="hover:text-brand-600">Home</Link> / 
                    <Link to={`/journal/${journal.id}`} className="hover:text-brand-600">{journal.title}</Link> / 
                    {issue ? (
                      <Link to={`/issue/${issue.id}`} className="hover:text-brand-600">Vol {issue.volume}, No {issue.number} ({issue.year})</Link>
                    ) : article.volume && article.issue ? (
                      <span className="text-slate-500">Vol {article.volume}, Issue {article.issue} (Real-time)</span>
                    ) : (
                      <span className="text-slate-500">Latest Real-time Article</span>
                    )}
                </div>
                <div className="font-mono text-xs text-slate-400">
                    DOI: {article.doi || '10.xxxx/pending'}
                </div>
            </div>
        </div>

        <div className="container mx-auto px-4 py-8 grid lg:grid-cols-4 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-3">
                <h1 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 mb-6 leading-tight">
                    {article.title}
                </h1>

                {/* Authors */}
                <div className="flex flex-wrap gap-4 mb-8">
                    {article.authors.map(author => (
                        <div key={author.id} className="text-sm">
                            <span className="font-bold text-slate-800 block">{author.firstName} {author.lastName}</span>
                            <span className="text-slate-500 italic">{author.affiliation}</span>
                        </div>
                    ))}
                </div>

                {/* Abstract Section */}
                <div className="mb-10">
                    <h2 className="text-lg font-bold text-slate-900 mb-3 uppercase tracking-wide border-b border-gray-100 pb-2">Abstract</h2>
                    <p className="text-slate-700 leading-relaxed text-lg font-serif">
                        {article.abstract}
                    </p>
                </div>

                {/* AI Feature Section */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100 mb-10">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-2 text-indigo-800 font-bold">
                            <Sparkles size={20} />
                            <span>AI Assistant</span>
                        </div>
                        {!aiSummary && (
                            <button 
                                onClick={handleGenerateAiSummary}
                                disabled={aiLoading}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-4 py-2 rounded-md font-medium transition-colors disabled:opacity-50"
                            >
                                {aiLoading ? 'Analyzing...' : 'Generate Layman Summary'}
                            </button>
                        )}
                    </div>
                    
                    {aiLoading && (
                        <div className="space-y-2 animate-pulse">
                            <div className="h-4 bg-indigo-200 rounded w-3/4"></div>
                            <div className="h-4 bg-indigo-200 rounded w-1/2"></div>
                        </div>
                    )}

                    {aiSummary && (
                        <div className="animate-in fade-in duration-500">
                            <p className="text-indigo-900 mb-3 italic">"{aiSummary}"</p>
                            <div className="text-xs text-indigo-400">
                                Generated by Gemini. Verify with full text.
                            </div>
                            {aiKeywords.length > 0 && (
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {aiKeywords.map(k => (
                                        <span key={k} className="bg-white text-indigo-700 text-xs px-2 py-1 rounded border border-indigo-200">
                                            #{k}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                    
                    {!aiSummary && !aiLoading && (
                        <p className="text-sm text-indigo-700">
                            Use AI to generate a simplified summary and discover relevant keywords for this article.
                        </p>
                    )}
                </div>

                 {/* Metrics */}
                 <div className="flex gap-8 text-sm text-slate-500 border-t border-gray-100 pt-6">
                    <div className="flex items-center gap-2">
                        <Eye size={16} /> {article.views} Views
                    </div>
                    <div className="flex items-center gap-2">
                        <Download size={16} /> {article.downloads} Downloads
                    </div>
                </div>
            </div>

            {/* Sidebar Tools */}
            <div className="space-y-6">
                <div className="bg-slate-50 p-5 rounded-lg border border-slate-200">
                    <h3 className="font-bold text-slate-900 mb-4">Downloads</h3>
                    <a 
                      href={article.pdfUrl && article.pdfUrl !== '#' ? article.pdfUrl : 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="w-full flex items-center justify-center gap-2 bg-brand-700 hover:bg-brand-800 text-white py-3 rounded-md font-medium transition-colors mb-3 shadow-sm"
                    >
                        <FileText size={18} /> PDF FULL-TEXT
                    </a>
                    <div className="text-xs text-center text-slate-500">Published: {issue ? `${issue.year}-${String(issue.month || 1).padStart(2, '0')}` : (article.submissionDate || 'Recent') }</div>
                </div>
            </div>
        </div>
    </div>
  );
};