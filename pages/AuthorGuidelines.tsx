import React from 'react';
import { BookOpen, FileText, CheckCircle2, AlertCircle, Info, ChevronRight, Download, Send, FileCode } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AuthorGuidelines: React.FC = () => {
  const sections = [
    { id: 'before', title: '1. Before You Submit', path: '/author-guidelines/before-submit' },
    { id: 'guidelines', title: '2. Submission Guidelines', path: '/author-guidelines/submission-guidelines' },
    { id: 'writing', title: '3. Writing Your Manuscript', path: '/author-guidelines/writing-manuscript' },
    { id: 'visuals', title: '4. Figures and Visuals', path: '/author-guidelines/figures-visuals' },
    { id: 'ready', title: '5. Ready to Submit', path: '/author-guidelines/ready-to-submit' },
    { id: 'post', title: '6. Post-Publication', path: '/author-guidelines/post-publication' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Editorial Header */}
      <div className="bg-brand-navy text-white pt-32 pb-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-action opacity-10 skew-x-12 translate-x-1/4"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-action text-[10px] font-black uppercase tracking-[0.2em] mb-8">
              Author Resources
            </div>
            <h1 className="text-5xl md:text-7xl font-serif font-black tracking-tight mb-8 leading-tight text-left">
              Instructions for <span className="text-brand-action">Authors</span>
            </h1>
            <p className="text-xl text-slate-300 font-light max-w-2xl leading-relaxed text-left">
              Welcome to Academic Publishing. We publish original research across diverse fields, including Engineering and Psychology. To ensure a smooth peer-review and publication process, please adhere to the following guidelines.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-24">
        <div className="flex flex-col lg:flex-row gap-16">
          {/* Sticky Navigation */}
          <aside className="lg:w-1/4">
            <div className="sticky top-32 space-y-8">
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6 text-left">Detailed Guides</h3>
                <nav className="space-y-1">
                  {sections.map((section) => (
                    <Link 
                      key={section.id} 
                      to={section.path}
                      className="group flex items-center justify-between p-4 bg-slate-50 border-l-2 border-transparent hover:border-brand-action hover:bg-white transition-all text-left"
                    >
                      <span className="text-[11px] font-black uppercase tracking-widest text-slate-500 group-hover:text-brand-navy">{section.title}</span>
                      <ChevronRight size={14} className="text-slate-300 group-hover:text-brand-action" />
                    </Link>
                  ))}
                </nav>
              </div>

              <div className="p-8 bg-brand-navy text-white rounded-sm text-left">
                <FileText className="text-brand-action mb-4" size={32} />
                <h4 className="font-bold mb-2">Style Template</h4>
                <p className="text-[10px] text-slate-400 leading-relaxed mb-6 uppercase tracking-widest font-bold">
                  Download our LaTeX and Microsoft Word manuscript templates for formatted submission.
                </p>
                <div className="space-y-3">
                  <button className="w-full py-3 bg-white/10 hover:bg-white/20 text-[10px] font-black uppercase tracking-widest transition-all inline-flex items-center justify-center gap-2">
                    <Download size={14} /> LaTeX Template
                  </button>
                  <button className="w-full py-3 bg-white/10 hover:bg-white/20 text-[10px] font-black uppercase tracking-widest transition-all inline-flex items-center justify-center gap-2">
                    <Download size={14} /> Word Template
                  </button>
                </div>
              </div>
            </div>
          </aside>

          {/* Guidelines Content */}
          <div className="lg:w-3/4 text-left space-y-16">
            
            {/* Detailed Guides Grid */}
            <section className="bg-slate-50 p-10 border border-slate-200">
              <h2 className="text-xl font-serif font-black text-brand-navy mb-8 uppercase tracking-widest">Detailed Guides</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sections.map((section) => (
                  <Link 
                    key={section.id} 
                    to={section.path}
                    className="p-8 bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:border-brand-action transition-all group relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-2 h-full bg-brand-action/10 group-hover:bg-brand-action transition-colors"></div>
                    <h3 className="text-sm font-black text-brand-navy uppercase tracking-[0.1em] mb-3 group-hover:text-brand-action transition-colors">
                      {section.title}
                    </h3>
                    <p className="text-xs text-slate-400 font-medium leading-relaxed italic">
                      {section.id === 'before' && 'Ensure your work meets core publication standards before submission.'}
                      {section.id === 'guidelines' && 'Formatting, length, and structural requirements for your manuscript.'}
                      {section.id === 'writing' && 'Best practices for Methods, Ethics, and Reference citations.'}
                      {section.id === 'visuals' && 'Technical specs for figures, line art, and photographic data.'}
                      {section.id === 'ready' && 'Checklist for your final submission package and cover letter.'}
                      {section.id === 'post' && 'Editorial policy, corrections, and open access archiving.'}
                    </p>
                    <div className="mt-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-brand-action opacity-0 group-hover:opacity-100 transition-opacity">
                      View Full Guide <ChevronRight size={12} />
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            {/* Template Download Section */}
            <section className="space-y-8">
              <h2 className="text-xl font-serif font-black text-brand-navy uppercase tracking-widest">Style Templates</h2>
              <p className="text-sm text-slate-500 leading-relaxed max-w-2xl">
                Download our LaTeX and Microsoft Word manuscript templates for formatted submission. These templates ensure your work adheres to the Academic Publishing structural and stylistic requirements from stage-one.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-8 bg-white border-2 border-slate-100 rounded-sm hover:border-brand-action/30 transition-all flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-blue-50 text-brand-navy rounded-full flex items-center justify-center mb-6">
                    <FileText size={32} />
                  </div>
                  <h4 className="font-bold text-brand-navy mb-2">Microsoft Word</h4>
                  <p className="text-xs text-slate-400 font-medium mb-8 leading-relaxed">Preferred format for most submissions. Includes pre-set styles for all manuscript sections.</p>
                  <button className="px-10 py-4 bg-brand-navy text-white text-[10px] font-black uppercase tracking-widest hover:bg-brand-action transition-all flex items-center gap-2">
                    <Download size={14} /> Download .docx Template
                  </button>
                </div>

                <div className="p-8 bg-white border-2 border-slate-100 rounded-sm hover:border-brand-action/30 transition-all flex flex-col items-center text-center">
                   <div className="w-16 h-16 bg-slate-50 text-brand-navy rounded-full flex items-center justify-center mb-6">
                    <FileCode size={32} />
                  </div>
                  <h4 className="font-bold text-brand-navy mb-2">LaTeX Template</h4>
                  <p className="text-xs text-slate-400 font-medium mb-8 leading-relaxed">For technical manuscripts. Uses standard 'Article' class with custom style files.</p>
                  <button className="px-10 py-4 border-2 border-brand-navy text-brand-navy text-[10px] font-black uppercase tracking-widest hover:bg-brand-navy hover:text-white transition-all flex items-center gap-2">
                    <Download size={14} /> Download .zip Package
                  </button>
                </div>
              </div>
            </section>

            <section className="pb-20">
              <div className="p-10 border border-slate-200 bg-slate-50 rounded-sm">
                <h3 className="text-lg font-serif font-black text-brand-navy mb-4">Academic Publishing Manifesto</h3>
                <p className="text-sm text-slate-600 leading-relaxed font-light italic">
                  Academic Publishing processes manuscripts as permanent nodes of intellectual progress. We uphold the highest standards of technical rigor and transparency to ensure that every published finding contributes meaningfully to the global record of science.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};
