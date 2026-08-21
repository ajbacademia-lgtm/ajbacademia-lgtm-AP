import React from 'react';
import { Link } from 'react-router-dom';
import { User, ShieldCheck, PenTool, Search, Users, Eye, CheckCircle2, Globe, ShieldAlert, ArrowRight } from 'lucide-react';

const ROLES = [
  {
    id: 'authors',
    title: 'Authors',
    icon: <PenTool size={32} />,
    color: 'bg-emerald-50 text-emerald-600',
    description: 'The primary contributors to the academic community, responsible for conducting research and submitting original manuscripts.',
    permissions: [
      'Register & verify account (email + ORCID)',
      'Submit manuscript (PDF, DOCX, LaTeX, supplementary files)',
      'Edit submission before review',
      'Track submission status',
      'Respond to reviewer comments',
      'Upload revised versions',
      'Approve proofs before publication',
      'Pay APC (Article Processing Charge)',
      'View publication metrics (downloads, citations)'
    ],
    restrictions: [
      'Seeing reviewer identity (if blind review)',
      'Accessing other submissions',
      'Modifying editorial decisions'
    ]
  },
  {
    id: 'reviewers',
    title: 'Reviewers',
    icon: <Search size={32} />,
    color: 'bg-blue-50 text-blue-600',
    description: 'Subject matter experts who evaluate the quality, validity, and originality of submitted manuscripts.',
    permissions: [
      'Accept/decline review invitations',
      'Download manuscript files',
      'Submit review report',
      'Score manuscript (novelty, methodology, clarity)',
      'Upload annotated files',
      'Recommend decision (Accept, Minor revision, Major revision, Reject)',
      'View past reviews'
    ],
    restrictions: [
      'Viewing other reviewers’ reports (until editor release)',
      'Accessing payment modules',
      'Editing author metadata'
    ]
  },
  {
    id: 'editors',
    title: 'Editors',
    icon: <ShieldCheck size={32} />,
    color: 'bg-indigo-50 text-indigo-600',
    description: 'Decision-makers (Handling Editors / Section Editors / EIC) who oversee the editorial process, manage peer review, and ensure the journal\'s quality standards.',
    permissions: [
      'Assign reviewers',
      'View all reviewer reports',
      'Make editorial decision',
      'Request revision',
      'Escalate to Editor-in-Chief',
      'Approve for production',
      'Communicate with authors',
      'Override reviewer conflicts',
      'Access submission analytics'
    ],
    advancedTools: [
      'Conflict of interest checker',
      'Reviewer recommendation engine',
      'Plagiarism integration',
      'AI-assisted manuscript screening',
      'Special issue management'
    ]
  },
  {
    id: 'admins',
    title: 'Admins',
    icon: <ShieldAlert size={32} />,
    color: 'bg-slate-50 text-slate-800',
    description: 'Platform administrators (System & Publisher Admins) who manage system configurations, user accounts, and overall platform integrity.',
    permissions: [
      'Manage users & roles',
      'Configure journals',
      'Create special issues',
      'Set APC pricing',
      'Manage payment gateways',
      'Configure submission workflow',
      'Manage DOI integration',
      'Manage email templates',
      'System logs & audit trails',
      'Analytics dashboard'
    ]
  },
  {
    id: 'public',
    title: 'Public Users',
    icon: <Globe size={32} />,
    color: 'bg-amber-50 text-amber-600',
    description: 'The global audience of researchers, students, and professionals who access and read published content.',
    permissions: [
      'Browse and search published articles',
      'Download and cite research papers',
      'Register for publication alerts',
      'Engage with the academic community'
    ]
  }
];

export const UserRoles: React.FC = () => {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="py-20 bg-gray-50 border-b border-gray-100">
        <div className="container mx-auto px-6 text-center">
          <span className="text-xs font-black uppercase tracking-[0.3em] text-brand-action mb-4 block">Platform Ecosystem</span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-brand-navy mb-6">🔹 User Roles</h1>
          <p className="text-lg text-brand-navy/60 max-w-2xl mx-auto leading-relaxed">
            Academic Publishing Group operates on a collaborative ecosystem where different roles work together to ensure the highest standards of scientific publishing.
          </p>
        </div>
      </section>

      {/* Roles Grid */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {ROLES.map((role) => (
              <div key={role.id} className="group p-8 border border-gray-100 rounded-sm hover:border-brand-action hover:shadow-xl transition-all duration-500">
                <div className={`w-16 h-16 ${role.color} rounded-sm flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                  {role.icon}
                </div>
                <h3 className="text-2xl font-serif font-bold text-brand-navy mb-4">{role.title}</h3>
                <p className="text-sm text-brand-navy/60 leading-relaxed mb-8">
                  {role.description}
                </p>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-brand-navy/30 mb-4">Core Permissions</h4>
                    <div className="space-y-3">
                      {role.permissions.map((perm, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <CheckCircle2 size={16} className="text-brand-action mt-0.5 flex-shrink-0" />
                          <span className="text-xs text-brand-navy/80">{perm}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {role.restrictions && (
                    <div>
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-red-600/40 mb-4">Restricted From</h4>
                      <div className="space-y-3">
                        {role.restrictions.map((restr, i) => (
                          <div key={i} className="flex items-start gap-3">
                            <ShieldAlert size={16} className="text-red-500 mt-0.5 flex-shrink-0" />
                            <span className="text-xs text-brand-navy/60">{restr}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {role.advancedTools && (
                    <div>
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-brand-action/60 mb-4">Advanced Editorial Tools</h4>
                      <div className="space-y-3">
                        {role.advancedTools.map((tool, i) => (
                          <div key={i} className="flex items-start gap-3">
                            <CheckCircle2 size={16} className="text-brand-action mt-0.5 flex-shrink-0" />
                            <span className="text-xs text-brand-navy/80">{tool}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 bg-gray-50 border-t border-gray-100 text-center">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-center gap-3 text-brand-action mb-4">
            <Users size={20} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Community Ecosystem</span>
          </div>
          <h2 className="text-3xl font-serif font-bold text-brand-navy mb-6">Ready to join our community?</h2>
          <p className="text-brand-navy/60 mb-10 max-w-xl mx-auto">
            Whether you are an established researcher or a student starting your journey, there is a place for you in the Academic Publishing ecosystem.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/register" className="px-10 py-4 bg-brand-navy text-white font-bold uppercase tracking-widest text-xs rounded-sm hover:bg-brand-action transition-all shadow-lg shadow-brand-navy/10">
              Register Now
            </Link>
            <Link to="/review-management" className="px-10 py-4 border border-gray-200 text-brand-navy font-bold uppercase tracking-widest text-xs rounded-sm hover:bg-gray-50 transition-all flex items-center gap-2">
              Review Management <ArrowRight size={16} />
            </Link>
            <Link to="/publication-module" className="px-10 py-4 border border-gray-200 text-brand-navy font-bold uppercase tracking-widest text-xs rounded-sm hover:bg-gray-50 transition-all flex items-center gap-2">
              Publication Module <ArrowRight size={16} />
            </Link>
            <Link to="/admindashboard" className="px-10 py-4 border border-gray-200 text-brand-navy font-bold uppercase tracking-widest text-xs rounded-sm hover:bg-gray-50 transition-all flex items-center gap-2">
              Admin Dashboards <ArrowRight size={16} />
            </Link>
            <Link to="/security-compliance" className="px-10 py-4 border border-gray-200 text-brand-navy font-bold uppercase tracking-widest text-xs rounded-sm hover:bg-gray-50 transition-all flex items-center gap-2">
              Security & Compliance <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
