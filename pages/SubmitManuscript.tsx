import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Upload, FileText, CheckCircle2, AlertTriangle, ArrowRight, X, Plus, Trash2, Info, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { MockService } from '../services/mockDb';
import { Journal, Author } from '../types';

export const SubmitManuscript: React.FC = () => {
  const { authState } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preSelectedJournalId = searchParams.get('journalId');

  const [journals, setJournals] = useState<Journal[]>([]);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Form State
  const [journalId, setJournalId] = useState(preSelectedJournalId || '');
  const [title, setTitle] = useState('');
  const [abstract, setAbstract] = useState('');
  const [keywords, setKeywords] = useState('');
  const [authors, setAuthors] = useState<Author[]>([{
    id: 'a1',
    firstName: authState.user?.name ? authState.user.name.split(' ')[0] : '',
    lastName: authState.user?.name ? authState.user.name.split(' ').slice(1).join(' ') : '',
    affiliation: '',
    email: authState.user?.email || ''
  }]);
  const [manuscriptFile, setManuscriptFile] = useState<File | null>(null);

  useEffect(() => {
    MockService.getJournals().then(setJournals);
    if (!authState.isAuthenticated) {
      navigate('/login?redirect=/submit');
    }
  }, [authState.isAuthenticated, navigate]);

  const handleAddAuthor = () => {
    setAuthors([...authors, {
      id: `a-${Date.now()}`,
      firstName: '',
      lastName: '',
      affiliation: '',
      email: ''
    }]);
  };

  const handleRemoveAuthor = (index: number) => {
    if (authors.length > 1) {
      setAuthors(authors.filter((_, i) => i !== index));
    }
  };

  const handleAuthorChange = (index: number, field: keyof Author, value: string) => {
    const updatedAuthors = [...authors];
    updatedAuthors[index] = { ...updatedAuthors[index], [field]: value };
    setAuthors(updatedAuthors);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!journalId) return;
    setSubmitting(true);
    
    try {
      const today = new Date().toISOString().split('T')[0];
      const newArticleId = `art_${Date.now()}`;
      
      let fileUrl = '#';
      if (manuscriptFile) {
        fileUrl = await MockService.uploadFile(manuscriptFile);
      }

      const newArticle = {
        id: newArticleId,
        issueId: 'i1', // Assign to default issue or draft container
        journalId,
        title,
        abstract,
        authors: authors.map((a, idx) => ({
          id: a.id || `a_${idx}_${Date.now()}`,
          firstName: a.firstName.trim(),
          lastName: a.lastName.trim(),
          affiliation: a.affiliation.trim(),
          email: a.email.trim()
        })),
        pageStart: 1,
        pageEnd: 15,
        pdfUrl: fileUrl,
        doi: `10.1002/ajp.${newArticleId.replace('art_', '')}`,
        keywords: keywords.split(',').map(k => k.trim()).filter(Boolean),
        views: 0,
        downloads: 0,
        citations: 0,
        status: 'Submitted' as const,
        submissionDate: today,
        lastUpdatedDate: today,
        correspondingAuthor: `${authors[0]?.firstName || ''} ${authors[0]?.lastName || ''}`.trim(),
        reviewProgress: 0,
        manuscriptFile: manuscriptFile ? { name: manuscriptFile.name, size: manuscriptFile.size } : undefined,
        supplementaryFiles: [],
        comments: []
      };

      await MockService.createArticle(newArticle);
      setSubmitted(true);
    } catch (err) {
      console.error('Submission failed:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-24 px-6">
        <div className="max-w-xl w-full bg-white p-12 rounded-sm shadow-xl text-center">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 animate-in zoom-in duration-500">
            <CheckCircle2 size={40} />
          </div>
          <h2 className="text-3xl font-serif font-bold text-brand-navy mb-4">Submission Received</h2>
          <p className="text-brand-navy/60 mb-10 leading-relaxed">
            Your manuscript <strong>"{title}"</strong> has been successfully submitted to the editorial board. You will receive a confirmation email shortly and can track the status of your submission in your dashboard.
          </p>
          <div className="flex flex-col gap-4">
            <button 
              onClick={() => navigate('/dashboard')}
              className="w-full py-4 bg-brand-navy text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-sm hover:bg-brand-action transition-all"
            >
              Go to Author Dashboard
            </button>
            <button 
              onClick={() => navigate('/')}
              className="w-full py-4 border border-gray-200 text-brand-navy/40 text-[10px] font-black uppercase tracking-[0.2em] rounded-sm hover:border-brand-navy hover:text-brand-navy transition-all"
            >
              Return Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-24">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-serif font-bold text-brand-navy mb-4 italic">Submit Manuscript</h1>
            <div className="flex items-center gap-2 text-brand-navy/40 text-[10px] font-black uppercase tracking-widest">
              <span>Step {step} of 3</span>
              <div className="flex gap-1 h-1 w-32 bg-gray-200 ml-4">
                <div className={`h-full bg-brand-action transition-all duration-500 ${step === 1 ? 'w-1/3' : step === 2 ? 'w-2/3' : 'w-full'}`}></div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="bg-white border border-gray-100 rounded-sm shadow-sm overflow-hidden">
            {/* Step 1: Journal & Title */}
            {step === 1 && (
              <div className="p-10 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-brand-navy/40">Select Target Journal</label>
                    <select 
                      required
                      className="w-full border-b border-gray-200 py-3 outline-none focus:border-brand-action transition-colors text-sm font-bold bg-transparent"
                      value={journalId}
                      onChange={e => setJournalId(e.target.value)}
                    >
                      <option value="">-- Choose Journal --</option>
                      {journals.map(j => (
                        <option key={j.id} value={j.id}>{j.title}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-brand-navy/40">Manuscript Title</label>
                    <textarea 
                      required
                      placeholder="Enter the full title of your research..."
                      className="w-full border-b border-gray-200 py-3 outline-none focus:border-brand-action transition-colors text-lg font-serif font-bold italic"
                      rows={2}
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-brand-navy/40">Abstract</label>
                    <textarea 
                      required
                      placeholder="Briefly describe the key findings and methodology..."
                      className="w-full border border-gray-100 rounded-sm p-4 outline-none focus:border-brand-action transition-colors text-sm leading-relaxed"
                      rows={6}
                      value={abstract}
                      onChange={e => setAbstract(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-brand-navy/40">Keywords</label>
                    <input 
                      type="text"
                      placeholder="Separated by commas (e.g. climate change, sustainability, policy)"
                      className="w-full border-b border-gray-200 py-3 outline-none focus:border-brand-action transition-colors text-sm"
                      value={keywords}
                      onChange={e => setKeywords(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-8">
                  <button 
                    type="button"
                    onClick={() => setStep(2)}
                    disabled={!journalId || !title || !abstract}
                    className="flex items-center gap-3 px-10 py-4 bg-brand-navy text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-sm hover:bg-brand-action transition-all disabled:opacity-20"
                  >
                    Next: Author Details <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Authors */}
            {step === 2 && (
              <div className="p-10 space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-serif font-bold text-brand-navy italic">Author Information</h3>
                  <button 
                    type="button"
                    onClick={handleAddAuthor}
                    className="flex items-center gap-2 text-brand-action text-[10px] font-black uppercase tracking-widest"
                  >
                    <Plus size={16} /> Add Co-Author
                  </button>
                </div>

                {authors.map((author, index) => (
                  <div key={author.id} className="p-6 bg-gray-50 border border-gray-100 rounded-sm space-y-4 relative group">
                    {index > 0 && (
                      <button 
                        type="button"
                        onClick={() => handleRemoveAuthor(index)}
                        className="absolute top-4 right-4 p-2 text-gray-300 hover:text-rose-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-brand-navy/40">First Name</label>
                        <input 
                          required
                          type="text"
                          className="w-full border-b border-gray-200 bg-transparent py-2 outline-none focus:border-brand-action transition-colors text-sm font-bold"
                          value={author.firstName}
                          onChange={e => handleAuthorChange(index, 'firstName', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-brand-navy/40">Last Name</label>
                        <input 
                          required
                          type="text"
                          className="w-full border-b border-gray-200 bg-transparent py-2 outline-none focus:border-brand-action transition-colors text-sm font-bold"
                          value={author.lastName}
                          onChange={e => handleAuthorChange(index, 'lastName', e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-brand-navy/40">Email</label>
                        <input 
                          required
                          type="email"
                          className="w-full border-b border-gray-200 bg-transparent py-2 outline-none focus:border-brand-action transition-colors text-sm"
                          value={author.email}
                          onChange={e => handleAuthorChange(index, 'email', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-brand-navy/40">Affiliation</label>
                        <input 
                          required
                          type="text"
                          className="w-full border-b border-gray-200 bg-transparent py-2 outline-none focus:border-brand-action transition-colors text-sm"
                          value={author.affiliation}
                          onChange={e => handleAuthorChange(index, 'affiliation', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <div className="flex justify-between pt-8 border-t border-gray-50">
                  <button 
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex items-center gap-3 px-8 py-4 border border-gray-200 text-brand-navy/60 text-[10px] font-black uppercase tracking-[0.2em] rounded-sm hover:border-brand-navy hover:text-brand-navy transition-all"
                  >
                    Back to Info
                  </button>
                  <button 
                    type="button"
                    onClick={() => setStep(3)}
                    className="flex items-center gap-3 px-10 py-4 bg-brand-navy text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-sm hover:bg-brand-action transition-all"
                  >
                    Next: Upload Files <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Files */}
            {step === 3 && (
              <div className="p-10 space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="bg-amber-50 border border-amber-100 p-6 rounded-sm flex gap-4 text-amber-800">
                   <Info className="shrink-0" />
                   <div className="text-xs leading-relaxed">
                      <p className="font-bold mb-1 uppercase tracking-widest text-[10px]">Submission Guidelines</p>
                      Please ensure your manuscript is in PDF format and does not contain identifying author information if you are submitting to a double-blind peer review journal. Supplemental files can be added after initial screening.
                   </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-brand-navy/40">Manuscript Upload (PDF)</label>
                  <div 
                    className={`border-2 border-dashed rounded-sm p-12 flex flex-col items-center justify-center transition-all ${manuscriptFile ? 'border-emerald-200 bg-emerald-50/30' : 'border-gray-200 hover:border-brand-action hover:bg-brand-action/5 cursor-pointer'}`}
                    onClick={() => !manuscriptFile && document.getElementById('file-upload')?.click()}
                  >
                    <input 
                      type="file" 
                      id="file-upload" 
                      className="hidden" 
                      accept=".pdf" 
                      onChange={(e) => setManuscriptFile(e.target.files?.[0] || null)}
                    />
                    {manuscriptFile ? (
                      <div className="flex items-center gap-4 w-full">
                        <div className="w-14 h-14 bg-white border border-emerald-100 rounded flex items-center justify-center shadow-sm">
                          <FileText size={28} className="text-emerald-600" />
                        </div>
                        <div className="flex-grow">
                          <p className="text-sm font-bold text-brand-navy">{manuscriptFile.name}</p>
                          <p className="text-[10px] text-brand-navy/40 uppercase font-black tracking-widest">{(manuscriptFile.size / 1024 / 1024).toFixed(2)} MB — Ready to Submit</p>
                        </div>
                        <button 
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setManuscriptFile(null);
                          }}
                          className="p-2 text-gray-300 hover:text-rose-500 transition-colors"
                        >
                          <X size={20} />
                        </button>
                      </div>
                    ) : (
                      <div className="text-center group">
                        <Upload size={40} className="text-gray-200 mx-auto mb-4 group-hover:text-brand-action transition-colors" />
                        <p className="text-sm font-bold text-brand-navy mb-1 italic">Click to browse files</p>
                        <p className="text-[10px] text-brand-navy/40 uppercase font-black tracking-widest">PDF format only — Max file size 25MB</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4 pt-6">
                  <div className="flex items-start gap-3">
                    <input type="checkbox" required className="mt-1 accent-brand-action" />
                    <p className="text-[11px] text-brand-navy/60 leading-relaxed uppercase font-black tracking-wider">I confirm that this manuscript is original, has not been published elsewhere, and all authors have approved the submission.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <input type="checkbox" required className="mt-1 accent-brand-action" />
                    <p className="text-[11px] text-brand-navy/60 leading-relaxed uppercase font-black tracking-wider">I agree to the publisher's terms of service and editorial policies.</p>
                  </div>
                </div>

                <div className="flex justify-between pt-8 border-t border-gray-50">
                  <button 
                    type="button"
                    onClick={() => setStep(2)}
                    className="flex items-center gap-3 px-8 py-4 border border-gray-200 text-brand-navy/60 text-[10px] font-black uppercase tracking-[0.2em] rounded-sm hover:border-brand-navy hover:text-brand-navy transition-all"
                  >
                    Back to Authors
                  </button>
                  <button 
                    type="submit"
                    disabled={!manuscriptFile || submitting}
                    className="flex items-center gap-3 px-12 py-4 bg-brand-action text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-sm hover:bg-brand-navy transition-all shadow-lg shadow-brand-action/20 disabled:opacity-50"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="animate-spin" size={16} /> Submitting...
                      </>
                    ) : (
                      <>Final Submission <ArrowRight size={16} /></>
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>

          {/* Footer Info */}
          <div className="mt-12 p-8 border border-gray-200 rounded-sm bg-white/50 flex gap-6">
            <div className="text-brand-action">
              <AlertTriangle size={24} />
            </div>
            <div className="space-y-2">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-brand-navy">Pre-submission Check</h4>
              <p className="text-xs text-brand-navy/60 leading-relaxed">
                Ensure your manuscript follows our <strong>House Style Guide</strong> and that all figures are high-resolution. Incomplete submissions may be returned to the author for correction before peer review begins.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
