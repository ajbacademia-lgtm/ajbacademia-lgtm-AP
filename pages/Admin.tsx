import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { MockService } from '../services/mockDb';
import { Article, Journal, User } from '../types';
import { Plus, Edit, Trash2, FileText, Book, Users, ShieldCheck, CreditCard } from 'lucide-react';

export const AdminPage: React.FC = () => {
  const { authState } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'journals' | 'articles' | 'users'>('articles');
  
  // Data State
  const [articles, setArticles] = useState<Article[]>([]);
  const [journals, setJournals] = useState<Journal[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  // Article Modal State
  const [showArticleModal, setShowArticleModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newAbstract, setNewAbstract] = useState('');

  // Journal Modal State
  const [showJournalModal, setShowJournalModal] = useState(false);
  const [editingJournal, setEditingJournal] = useState<Journal | null>(null);
  const [journalTitle, setJournalTitle] = useState('');
  const [journalDesc, setJournalDesc] = useState('');
  const [journalIssn, setJournalIssn] = useState('');
  const [journalCover, setJournalCover] = useState('');

  useEffect(() => {
    if (!authState.isAuthenticated || authState.user?.role !== 'admin') {
      navigate('/admindashboard/login');
      return;
    }
    
    // Fetch data based on active tab
    if (activeTab === 'articles') {
      MockService.getAllArticles().then(setArticles);
    } else if (activeTab === 'journals') {
      MockService.getJournals().then(setJournals);
    } else if (activeTab === 'users') {
      MockService.getUsers().then(setUsers);
    }
  }, [authState, navigate, activeTab]);

  // --- Article Handlers ---

  const handleCreateArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    const newArticle: Article = {
        id: `art${Date.now()}`,
        journalId: 'j1', // Defaulting for demo
        issueId: 'i1',
        title: newTitle,
        abstract: newAbstract,
        authors: [{id: 'a1', firstName: 'Admin', lastName: 'User', affiliation: 'Academic Publishing', email: 'admin@academicjp.com'}],
        pageStart: 100,
        pageEnd: 110,
        keywords: [],
        views: 0,
        downloads: 0,
        status: 'Published'
    };
    
    await MockService.createArticle(newArticle);
    setArticles([...articles, newArticle]);
    setShowArticleModal(false);
    setNewTitle('');
    setNewAbstract('');
  };

  // --- Journal Handlers ---

  const openJournalModal = (journal?: Journal) => {
    if (journal) {
      setEditingJournal(journal);
      setJournalTitle(journal.title);
      setJournalDesc(journal.description);
      setJournalIssn(journal.issn);
      setJournalCover(journal.coverImage);
    } else {
      setEditingJournal(null);
      setJournalTitle('');
      setJournalDesc('');
      setJournalIssn('');
      setJournalCover('https://picsum.photos/400/600'); // Default placeholder
    }
    setShowJournalModal(true);
  };

  const handleSaveJournal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingJournal) {
      // Update
      const updatedJournal: Journal = {
        ...editingJournal,
        title: journalTitle,
        description: journalDesc,
        issn: journalIssn,
        coverImage: journalCover
      };
      await MockService.updateJournal(updatedJournal);
      setJournals(journals.map(j => j.id === updatedJournal.id ? updatedJournal : j));
    } else {
      // Create
      const newJournal: Journal = {
        id: `j${Date.now()}`,
        title: journalTitle,
        description: journalDesc,
        issn: journalIssn,
        coverImage: journalCover
      };
      await MockService.createJournal(newJournal);
      setJournals([...journals, newJournal]);
    }
    setShowJournalModal(false);
  };

  const handleDeleteJournal = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this journal?")) {
      await MockService.deleteJournal(id);
      setJournals(journals.filter(j => j.id !== id));
    }
  };

  // --- User Handlers ---
  const handleUpdateRole = async (userId: string, newRole: User['role']) => {
    const updatedUser = await MockService.updateUserRole(userId, newRole);
    if (updatedUser) {
      setUsers(users.map(u => u.id === userId ? updatedUser : u));
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
        <div className="text-sm text-slate-500">Logged in as {authState.user?.name}</div>
      </div>

      <div className="grid md:grid-cols-4 gap-8">
        {/* Sidebar Nav */}
        <div className="space-y-2">
            <button 
                onClick={() => setActiveTab('articles')}
                className={`w-full text-left px-4 py-2 rounded-md font-medium transition-colors ${activeTab === 'articles' ? 'bg-brand-100 text-brand-800' : 'hover:bg-gray-100 text-slate-600'}`}
            >
                Articles
            </button>
            <button 
                onClick={() => setActiveTab('journals')}
                className={`w-full text-left px-4 py-2 rounded-md font-medium transition-colors ${activeTab === 'journals' ? 'bg-brand-100 text-brand-800' : 'hover:bg-gray-100 text-slate-600'}`}
            >
                Journals
            </button>
            <button 
                onClick={() => setActiveTab('users')}
                className={`w-full text-left px-4 py-2 rounded-md font-medium transition-colors ${activeTab === 'users' ? 'bg-brand-100 text-brand-800' : 'hover:bg-gray-100 text-slate-600'}`}
            >
                Users & Roles
            </button>

            <Link 
                to="/admindashboard/payment-gateway-billing"
                className="w-full text-left px-4 py-2.5 rounded-md font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 transition-colors flex items-center justify-between mt-4 border border-amber-200 text-xs uppercase tracking-wider"
            >
                <span className="flex items-center gap-2">
                  <CreditCard size={16} /> Payment Gateway & Billing
                </span>
            </Link>
        </div>

        {/* Content Area */}
        <div className="md:col-span-3">
            {activeTab === 'articles' && (
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-bold">Manage Articles</h2>
                        <button 
                            onClick={() => setShowArticleModal(true)}
                            className="bg-brand-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-brand-700 flex items-center gap-2"
                        >
                            <Plus size={16} /> New Article
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-slate-500 font-medium border-b border-gray-200">
                                <tr>
                                    <th className="px-4 py-3">Title</th>
                                    <th className="px-4 py-3">Authors</th>
                                    <th className="px-4 py-3">Views</th>
                                    <th className="px-4 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {articles.map(article => (
                                    <tr key={article.id} className="hover:bg-gray-50 group">
                                        <td className="px-4 py-3 font-medium text-slate-900">{article.title}</td>
                                        <td className="px-4 py-3 text-slate-500">{article.authors.map(a => a.lastName).join(', ')}</td>
                                        <td className="px-4 py-3 text-slate-500">{article.views}</td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button className="p-1 text-slate-400 hover:text-brand-600"><Edit size={16} /></button>
                                                <button className="p-1 text-slate-400 hover:text-red-600"><Trash2 size={16} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'journals' && (
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-bold">Manage Journals</h2>
                        <button 
                            onClick={() => openJournalModal()}
                            className="bg-brand-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-brand-700 flex items-center gap-2"
                        >
                            <Plus size={16} /> New Journal
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-slate-500 font-medium border-b border-gray-200">
                                <tr>
                                    <th className="px-4 py-3">Title</th>
                                    <th className="px-4 py-3">ISSN</th>
                                    <th className="px-4 py-3">Description</th>
                                    <th className="px-4 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {journals.map(journal => (
                                    <tr key={journal.id} className="hover:bg-gray-50 group">
                                        <td className="px-4 py-3 font-medium text-slate-900 flex items-center gap-2">
                                           <div className="w-8 h-10 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                                              <img src={journal.coverImage} className="w-full h-full object-cover" alt="" />
                                           </div>
                                           {journal.title}
                                        </td>
                                        <td className="px-4 py-3 text-slate-500 font-mono text-xs">{journal.issn}</td>
                                        <td className="px-4 py-3 text-slate-500 max-w-xs truncate">{journal.description}</td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => openJournalModal(journal)} className="p-1 text-slate-400 hover:text-brand-600"><Edit size={16} /></button>
                                                <button onClick={() => handleDeleteJournal(journal.id)} className="p-1 text-slate-400 hover:text-red-600"><Trash2 size={16} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

             {activeTab === 'users' && (
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-bold flex items-center gap-2">
                            <Users size={20} className="text-brand-600" />
                            Manage Users & Roles
                        </h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-slate-500 font-medium border-b border-gray-200">
                                <tr>
                                    <th className="px-4 py-3">Name</th>
                                    <th className="px-4 py-3">Email</th>
                                    <th className="px-4 py-3">Current Role</th>
                                    <th className="px-4 py-3 text-right">Assign Role</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {users.map(user => (
                                    <tr key={user.id} className="hover:bg-gray-50 group">
                                        <td className="px-4 py-3 font-medium text-slate-900">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 bg-brand-50 text-brand-700 rounded-full flex items-center justify-center font-bold text-xs">
                                                    {user.name.charAt(0)}
                                                </div>
                                                {user.name}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-slate-500">{user.email}</td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                                user.role === 'admin' ? 'bg-red-100 text-red-700' :
                                                user.role === 'editor' ? 'bg-blue-100 text-blue-700' :
                                                user.role === 'reviewer' ? 'bg-purple-100 text-purple-700' :
                                                user.role === 'author' ? 'bg-green-100 text-green-700' :
                                                'bg-gray-100 text-gray-700'
                                            }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <select 
                                                value={user.role}
                                                onChange={(e) => handleUpdateRole(user.id, e.target.value as User['role'])}
                                                className="text-xs border border-gray-200 rounded px-2 py-1 outline-none focus:ring-1 focus:ring-brand-500 bg-white"
                                            >
                                                <option value="admin">Admin</option>
                                                <option value="editor">Editor</option>
                                                <option value="reviewer">Reviewer</option>
                                                <option value="author">Author</option>
                                                <option value="reader">Reader</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
      </div>

      {/* Article Modal */}
      {showArticleModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6">
                <h3 className="text-xl font-bold mb-4">Add New Article</h3>
                <form onSubmit={handleCreateArticle} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                        <input 
                            required
                            type="text" 
                            className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-brand-500"
                            value={newTitle}
                            onChange={e => setNewTitle(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Abstract</label>
                        <textarea 
                            required
                            rows={4}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-brand-500"
                            value={newAbstract}
                            onChange={e => setNewAbstract(e.target.value)}
                        ></textarea>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Upload PDF</label>
                        <input type="file" className="block w-full text-sm text-slate-500
                          file:mr-4 file:py-2 file:px-4
                          file:rounded-md file:border-0
                          file:text-sm file:font-semibold
                          file:bg-brand-50 file:text-brand-700
                          hover:file:bg-brand-100
                        "/>
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                        <button type="button" onClick={() => setShowArticleModal(false)} className="px-4 py-2 text-slate-600 hover:bg-gray-100 rounded-md">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-brand-600 text-white rounded-md hover:bg-brand-700">Save Article</button>
                    </div>
                </form>
            </div>
        </div>
      )}

      {/* Journal Modal */}
      {showJournalModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6">
                <h3 className="text-xl font-bold mb-4">{editingJournal ? 'Edit Journal' : 'Create New Journal'}</h3>
                <form onSubmit={handleSaveJournal} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Journal Title</label>
                        <input 
                            required
                            type="text" 
                            className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-brand-500"
                            value={journalTitle}
                            onChange={e => setJournalTitle(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">ISSN</label>
                        <input 
                            required
                            type="text" 
                            className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-brand-500"
                            value={journalIssn}
                            onChange={e => setJournalIssn(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                        <textarea 
                            required
                            rows={3}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-brand-500"
                            value={journalDesc}
                            onChange={e => setJournalDesc(e.target.value)}
                        ></textarea>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Journal Logo / Cover Image</label>
                        <div className="flex items-center gap-4 py-2">
                          {journalCover && (
                            <img src={journalCover} className="w-12 h-16 object-cover rounded border" alt="Preview" />
                          )}
                          <div>
                            <input 
                              type="file" 
                              accept="image/*"
                              id="admin-page-journal-upload"
                              className="hidden" 
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  try {
                                    const url = await MockService.uploadFile(file);
                                    setJournalCover(url);
                                  } catch (err: any) {
                                    alert(`Upload failed: ${err.message}`);
                                  }
                                }
                              }}
                            />
                            <label 
                              htmlFor="admin-page-journal-upload"
                              className="px-4 py-2 bg-brand-600 text-white text-xs font-bold rounded cursor-pointer hover:bg-brand-700 inline-block"
                            >
                              Upload Logo / Image
                            </label>
                            {journalCover ? (
                              <p className="text-xs text-emerald-600 font-medium mt-1">Logo uploaded</p>
                            ) : (
                              <p className="text-xs text-slate-400 mt-1">Upload a logo file for the journal.</p>
                            )}
                          </div>
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                        <button type="button" onClick={() => setShowJournalModal(false)} className="px-4 py-2 text-slate-600 hover:bg-gray-100 rounded-md">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-brand-600 text-white rounded-md hover:bg-brand-700">
                          {editingJournal ? 'Update Journal' : 'Create Journal'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};