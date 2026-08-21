import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MockService } from '../services/mockDb';
import { Issue, Article, Journal } from '../types';
import { FileText, User } from 'lucide-react';
import { NotFound } from './NotFound';

export const IssuePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [issue, setIssue] = useState<Issue | undefined>(undefined);
  const [journal, setJournal] = useState<Journal | undefined>(undefined);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        const iData = await MockService.getIssueById(id);
        if (iData) {
            setIssue(iData);
            document.title = `Vol ${iData.volume}, No ${iData.number} (${iData.year}) | Academic Publishing Group`;
            const jData = await MockService.getJournalById(iData.journalId);
            setJournal(jData);
            const aData = await MockService.getArticlesByIssue(id);
            setArticles(aData);
        }
        setLoading(false);
      };
      fetchData();
    }
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-slate-500 font-medium animate-pulse">Loading Issue Architecture...</div>
    </div>
  );
  
  if (!issue || !journal) return <NotFound />;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link to={`/journal/${journal.id}`} className="text-brand-600 hover:underline text-sm mb-2 block">&larr; Back to {journal.title}</Link>
        <h1 className="text-3xl font-serif font-bold text-slate-900 mb-2">
            Vol {issue.volume}, No {issue.number} ({issue.year})
        </h1>
        {issue.title && <h2 className="text-xl text-slate-600">{issue.title}</h2>}
      </div>

      <div className="space-y-6">
        <h3 className="text-lg font-bold uppercase tracking-wider text-slate-400 border-b border-gray-200 pb-2">Articles</h3>
        {articles.map(article => (
            <div key={article.id} className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:border-brand-300 transition-colors">
                <Link to={`/article/${article.id}`}>
                    <h4 className="text-xl font-bold font-serif text-slate-900 hover:text-brand-700 mb-2">
                        {article.title}
                    </h4>
                </Link>
                <div className="flex flex-wrap gap-y-2 gap-x-6 text-sm text-slate-600 mb-4">
                    <div className="flex items-center gap-1">
                        <User size={14} />
                        {article.authors.map(a => `${a.firstName} ${a.lastName}`).join(', ')}
                    </div>
                    {article.pageStart && article.pageEnd && (
                      <div>pp. {article.pageStart}-{article.pageEnd}</div>
                    )}
                </div>
                <div className="flex gap-4">
                    <Link to={`/article/${article.id}`} className="inline-flex items-center gap-1 text-sm font-medium text-white bg-brand-600 px-3 py-1.5 rounded hover:bg-brand-700 transition-colors">
                        <FileText size={14} /> View Article
                    </Link>
                    {article.pdfUrl && (
                        <span className="inline-flex items-center gap-1 text-sm font-medium text-brand-700 border border-brand-200 px-3 py-1.5 rounded bg-brand-50">
                            PDF
                        </span>
                    )}
                </div>
            </div>
        ))}
        {articles.length === 0 && <p className="text-slate-500 italic">No articles found in this issue.</p>}
      </div>
    </div>
  );
};