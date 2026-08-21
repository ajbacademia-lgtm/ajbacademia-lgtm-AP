import React from 'react';
import { Shield, Star, Clock, CheckCircle2, AlertCircle, Calendar, Users, FileText, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const REVIEW_FEATURES = [
  {
    id: 'blind-review',
    title: 'Blind Review System',
    icon: <Shield size={32} />,
    color: 'bg-indigo-50 text-indigo-600',
    description: 'We employ a rigorous double-blind peer review process to ensure objectivity and minimize bias in scientific evaluation.',
    details: [
      'Author identities hidden from reviewers',
      'Reviewer identities hidden from authors',
      'Anonymized manuscript handling',
      'Conflict of interest automated screening'
    ]
  },
  {
    id: 'scoring',
    title: 'Reviewer Scoring',
    icon: <Star size={32} />,
    color: 'bg-amber-50 text-amber-600',
    description: 'A structured scoring system allows reviewers to provide quantitative and qualitative feedback across multiple dimensions of research quality.',
    details: [
      'Customizable rubric for different disciplines',
      'Numerical scoring for methodology and impact',
      'Detailed qualitative commentary sections',
      'Overall recommendation (Accept, Reject, Revise)'
    ]
  },
  {
    id: 'deadlines',
    title: 'Deadline Trackers',
    icon: <Clock size={32} />,
    color: 'bg-rose-50 text-rose-600',
    description: 'Automated tracking ensures the review process stays on schedule, providing timely decisions to authors and reducing publication lag.',
    details: [
      'Automated reminder notifications',
      'Real-time status tracking for authors',
      'Reviewer availability management',
      'Escalation protocols for delayed reviews'
    ]
  }
];

export const ReviewManagement: React.FC = () => {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="py-20 bg-gray-50 border-b border-gray-100">
        <div className="container mx-auto px-6 text-center">
          <span className="text-xs font-black uppercase tracking-[0.3em] text-brand-action mb-4 block">Editorial Excellence</span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-brand-navy mb-6">🔹 Review Management</h1>
          <p className="text-lg text-brand-navy/60 max-w-2xl mx-auto leading-relaxed">
            Maintaining the highest standards of academic integrity through an advanced, transparent, and efficient peer-review ecosystem.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto space-y-24">
            {REVIEW_FEATURES.map((feature, index) => (
              <div key={feature.id} className={`flex flex-col lg:flex-row items-center gap-16 ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                <div className="lg:w-1/2 space-y-6">
                  <div className={`w-16 h-16 ${feature.color} rounded-sm flex items-center justify-center mb-6`}>
                    {feature.icon}
                  </div>
                  <h2 className="text-3xl font-serif font-bold text-brand-navy">{feature.title}</h2>
                  <p className="text-brand-navy/70 leading-relaxed text-lg">
                    {feature.description}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                    {feature.details.map((detail, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <CheckCircle2 size={18} className="text-brand-action flex-shrink-0" />
                        <span className="text-sm text-brand-navy/80">{detail}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="lg:w-1/2 w-full">
                  <div className="bg-white rounded-sm border border-gray-100 shadow-2xl p-8 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
                    
                    {/* Mock Interface Elements */}
                    <div className="relative z-10 space-y-6">
                      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-brand-navy rounded-full flex items-center justify-center text-white font-bold text-xs">R1</div>
                          <div>
                            <div className="text-xs font-bold text-brand-navy">Reviewer #2481</div>
                            <div className="text-[10px] text-brand-navy/40">Status: Active Review</div>
                          </div>
                        </div>
                        <div className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-[10px] font-bold uppercase tracking-wider">
                          Due in 4 Days
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-brand-navy/60">
                            <span>Methodology</span>
                            <span>4.5/5.0</span>
                          </div>
                          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className="w-[90%] h-full bg-brand-action"></div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-brand-navy/60">
                            <span>Originality</span>
                            <span>4.8/5.0</span>
                          </div>
                          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className="w-[96%] h-full bg-brand-action"></div>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-gray-50 rounded-sm border border-gray-100">
                        <div className="flex items-start gap-3">
                          <AlertCircle size={16} className="text-brand-action mt-0.5" />
                          <p className="text-[11px] text-brand-navy/60 leading-relaxed italic">
                            "The experimental design is robust, however, I suggest expanding the discussion on the long-term implications of the findings in section 4.2..."
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-gray-50 border-y border-gray-100">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 text-brand-action mb-4">
              <Users size={20} />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Scale & Impact</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-navy mb-6">Global Review Network</h2>
            <p className="text-brand-navy/60 max-w-2xl mx-auto">Our review system connects thousands of experts across the globe to ensure the highest quality of published research.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="space-y-4">
              <div className="text-5xl font-light text-brand-action">15k+</div>
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-navy/40">Active Reviewers</div>
            </div>
            <div className="space-y-4">
              <div className="text-5xl font-light text-brand-action">28 Days</div>
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-navy/40">Avg. Review Cycle</div>
            </div>
            <div className="space-y-4">
              <div className="text-5xl font-light text-brand-action">100%</div>
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-navy/40">Double-Blind Compliance</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto bg-gray-50 rounded-sm p-12 border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl shadow-gray-100">
            <div>
              <div className="flex items-center gap-2 text-brand-action mb-2">
                <Star size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest">Expert Network</span>
              </div>
              <h3 className="text-2xl font-serif font-bold text-brand-navy mb-2">Interested in becoming a reviewer?</h3>
              <p className="text-brand-navy/60 text-sm">Join our network of experts and contribute to the advancement of your field.</p>
            </div>
            <Link to="/register" className="px-8 py-4 bg-brand-navy text-white font-bold uppercase tracking-widest text-xs rounded-sm hover:bg-brand-action transition-all flex items-center gap-2 whitespace-nowrap shadow-lg">
              Register as Reviewer <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
