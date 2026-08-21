import React from 'react';
import { Upload, FileCheck, Bell, Users, ArrowRight, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

const WORKFLOW_STEPS = [
  {
    id: 'upload',
    title: 'Manuscript Upload',
    icon: <Upload size={32} />,
    color: 'bg-blue-50 text-blue-600',
    description: 'Authors submit their original research through our secure portal. We support multiple file formats and provide easy-to-use templates.',
    details: [
      'Secure file transmission',
      'Support for LaTeX, Word, and PDF',
      'Metadata extraction from files',
      'ORCID integration for authors'
    ]
  },
  {
    id: 'validation',
    title: 'File Validation',
    icon: <FileCheck size={32} />,
    color: 'bg-emerald-50 text-emerald-600',
    description: 'Automated systems verify file integrity, check for plagiarism, and ensure compliance with journal formatting guidelines.',
    details: [
      'Automated technical screening',
      'Plagiarism detection (Crossref Similarity Check)',
      'Image integrity verification',
      'Reference formatting check'
    ]
  },
  {
    id: 'notifications',
    title: 'Auto Notifications',
    icon: <Bell size={32} />,
    color: 'bg-amber-50 text-amber-600',
    description: 'Real-time updates keep authors, reviewers, and editors informed at every stage of the submission and review process.',
    details: [
      'Submission confirmation',
      'Review milestone alerts',
      'Decision notifications',
      'Revision reminders'
    ]
  },
  {
    id: 'assignments',
    title: 'Review Assignments',
    icon: <Users size={32} />,
    color: 'bg-indigo-50 text-indigo-600',
    description: 'Editors assign qualified peer reviewers based on subject expertise, ensuring a rigorous and fair evaluation of the research.',
    details: [
      'Expertise-based matching',
      'Conflict of interest screening',
      'Double-blind review options',
      'Reviewer performance tracking'
    ]
  }
];

export const SubmissionWorkflow: React.FC = () => {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="py-20 bg-gray-50 border-b border-gray-100">
        <div className="container mx-auto px-6 text-center">
          <span className="text-xs font-black uppercase tracking-[0.3em] text-brand-action mb-4 block">Author Resources</span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-brand-navy mb-6">🔹 Submission Workflow</h1>
          <p className="text-lg text-brand-navy/60 max-w-2xl mx-auto leading-relaxed">
            Our streamlined submission process is designed to be efficient, transparent, and supportive of researchers at every step.
          </p>
        </div>
      </section>

      {/* Workflow Steps */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <div className="space-y-20">
              {WORKFLOW_STEPS.map((step, index) => (
                <div key={step.id} className={`flex flex-col lg:flex-row items-center gap-12 ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                  <div className="lg:w-1/2 space-y-6">
                    <div className={`w-16 h-16 ${step.color} rounded-sm flex items-center justify-center mb-6`}>
                      {step.icon}
                    </div>
                    <h2 className="text-3xl font-serif font-bold text-brand-navy">{step.title}</h2>
                    <p className="text-brand-navy/70 leading-relaxed text-lg">
                      {step.description}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                      {step.details.map((detail, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <CheckCircle2 size={18} className="text-brand-action flex-shrink-0" />
                          <span className="text-sm text-brand-navy/80">{detail}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="lg:w-1/2 w-full">
                    <div className="aspect-video bg-gray-100 rounded-sm overflow-hidden relative group border border-gray-200 shadow-lg">
                      <div className="absolute inset-0 bg-gradient-to-br from-brand-navy/5 to-transparent"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                         <div className="text-brand-navy/10 transform scale-[3] group-hover:scale-[3.5] transition-transform duration-1000">
                            {step.icon}
                         </div>
                      </div>
                      <div className="absolute bottom-6 left-6 right-6 p-4 bg-white/90 backdrop-blur-sm rounded-sm border border-gray-100 shadow-sm">
                         <div className="text-[10px] font-black uppercase tracking-widest text-brand-navy/40 mb-1">Step 0{index + 1}</div>
                         <div className="font-bold text-brand-navy">{step.title} Interface</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Summary Section */}
      <section className="py-24 bg-gray-50 border-t border-gray-100">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="max-w-xl">
                <div className="flex items-center gap-3 text-brand-action mb-4">
                  <Zap size={20} />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">Efficiency & Trust</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-navy mb-8">Built for Speed and Integrity</h2>
                <p className="text-brand-navy/60 leading-relaxed mb-10 text-lg">
                  Our platform leverages advanced technology to reduce the time from submission to publication while maintaining the highest standards of peer review.
                </p>
              </div>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-white rounded-sm shadow-sm flex items-center justify-center flex-shrink-0">
                    <Zap size={20} className="text-brand-action" />
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-navy mb-1">Rapid Processing</h4>
                    <p className="text-sm text-brand-navy/50">Average time to first decision is under 30 days.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-white rounded-sm shadow-sm flex items-center justify-center flex-shrink-0">
                    <ShieldCheck size={20} className="text-brand-action" />
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-navy mb-1">Rigorous Standards</h4>
                    <p className="text-sm text-brand-navy/50">Every paper undergoes strict technical and ethical screening.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white p-10 rounded-sm border border-gray-200 shadow-xl">
              <h3 className="text-2xl font-serif font-bold text-brand-navy mb-6">Ready to submit?</h3>
              <p className="text-brand-navy/60 mb-8">
                Review our author guidelines and ensure your manuscript is ready for the Academic Publishing workflow.
              </p>
              <div className="space-y-4">
                <button className="w-full py-4 bg-brand-navy text-white font-bold uppercase tracking-widest text-xs rounded-sm hover:bg-brand-action transition-all flex items-center justify-center gap-2">
                  Start Submission <ArrowRight size={16} />
                </button>
                <button className="w-full py-4 border border-gray-100 text-brand-navy font-bold uppercase tracking-widest text-xs rounded-sm hover:bg-gray-50 transition-all">
                  Author Guidelines
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
