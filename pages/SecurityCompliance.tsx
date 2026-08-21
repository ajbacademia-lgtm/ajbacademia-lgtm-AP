import React from 'react';
import { Shield, Lock, History, UserCheck, CheckCircle2, ArrowRight, FileText, Eye, AlertCircle, Database } from 'lucide-react';
import { Link } from 'react-router-dom';

const SECURITY_FEATURES = [
  {
    id: 'gdpr',
    title: 'GDPR Compliance',
    icon: <Shield size={32} />,
    color: 'bg-blue-50 text-blue-600',
    description: 'Full compliance with General Data Protection Regulation (GDPR) standards, ensuring the highest level of data privacy and protection for all users.',
    details: [
      'Right to be forgotten',
      'Data portability support',
      'Privacy by design architecture',
      'Transparent data processing'
    ]
  },
  {
    id: 'double-opt-in',
    title: 'Double Opt-in System',
    icon: <UserCheck size={32} />,
    color: 'bg-emerald-50 text-emerald-600',
    description: 'A secure registration and subscription process that verifies user intent, preventing unauthorized account creation and ensuring high-quality communication.',
    details: [
      'Email verification workflows',
      'Consent management tracking',
      'Anti-spam protection',
      'Verified user profiles'
    ]
  },
  {
    id: 'audit-logs',
    title: 'Comprehensive Audit Logs',
    icon: <History size={32} />,
    color: 'bg-indigo-50 text-indigo-600',
    description: 'Detailed tracking of all system actions, providing a transparent and immutable record of editorial decisions, user changes, and system events.',
    details: [
      'Immutable action history',
      'Editorial decision tracking',
      'User access monitoring',
      'Compliance reporting tools'
    ]
  },
  {
    id: 'permission-systems',
    title: 'Granular Permission Systems',
    icon: <Lock size={32} />,
    color: 'bg-rose-50 text-rose-600',
    description: 'Role-based access control (RBAC) that ensures users only have access to the data and tools necessary for their specific role in the publishing process.',
    details: [
      'Role-based access control',
      'Custom permission profiles',
      'Secure data isolation',
      'Multi-factor authentication'
    ]
  }
];

export const SecurityCompliance: React.FC = () => {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="py-20 bg-gray-50 border-b border-gray-100">
        <div className="container mx-auto px-6 text-center">
          <span className="text-xs font-black uppercase tracking-[0.3em] text-brand-action mb-4 block">Trust & Integrity</span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-brand-navy mb-6">🔹 Security & Compliance</h1>
          <p className="text-lg text-brand-navy/60 max-w-2xl mx-auto leading-relaxed">
            Protecting the integrity of scientific research through advanced security protocols, rigorous compliance standards, and transparent data governance.
          </p>
        </div>
      </section>

      {/* Security Overview */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
            <div className="space-y-8">
              <div className="max-w-xl">
                <div className="flex items-center gap-3 text-brand-action mb-4">
                  <Shield size={20} />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">Data Governance</span>
                </div>
                <h2 className="text-3xl font-serif font-bold text-brand-navy mb-4">Enterprise-Grade Protection</h2>
                <p className="text-brand-navy/60 text-sm leading-relaxed">
                  Our platform is built on a foundation of security. We implement industry-leading standards to safeguard intellectual property, personal data, and the editorial process from end to end.
                </p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-sm shadow-sm">
                  <div className="text-brand-action"><Database size={24} /></div>
                  <div>
                    <div className="font-bold text-brand-navy text-sm">Encrypted Data Storage</div>
                    <div className="text-[10px] text-brand-navy/40 uppercase tracking-widest">AES-256 Standard</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-sm shadow-sm">
                  <div className="text-blue-600"><Eye size={24} /></div>
                  <div>
                    <div className="font-bold text-brand-navy text-sm">Continuous Monitoring</div>
                    <div className="text-[10px] text-brand-navy/40 uppercase tracking-widest">24/7 Security Ops</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-sm shadow-2xl border border-gray-100 overflow-hidden">
                <div className="bg-brand-navy p-4 flex items-center justify-between">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-400"></div>
                    <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                    <div className="w-2 h-2 rounded-full bg-green-400"></div>
                  </div>
                  <div className="text-[10px] text-white/40 font-mono">security_audit_v4.log</div>
                </div>
                <div className="p-6 font-mono text-[10px] text-brand-navy/80 space-y-2 overflow-hidden">
                  <div className="flex gap-4"><span className="text-brand-action">[INFO]</span> <span>2024-03-03 10:20:35 - User #8421 login verified (MFA)</span></div>
                  <div className="flex gap-4"><span className="text-brand-action">[INFO]</span> <span>2024-03-03 10:21:12 - Manuscript #4928 status updated to 'Review'</span></div>
                  <div className="flex gap-4"><span className="text-blue-600">[AUDIT]</span> <span>2024-03-03 10:22:05 - Permission change: Editor &rarr; Admin (Auth: #001)</span></div>
                  <div className="flex gap-4"><span className="text-brand-action">[INFO]</span> <span>2024-03-03 10:23:44 - Encrypted backup completed (Region: EU-West-1)</span></div>
                  <div className="flex gap-4"><span className="text-emerald-600">[SEC]</span> <span>2024-03-03 10:25:01 - GDPR Data Export Request processed (#992)</span></div>
                  <div className="pt-4 border-t border-gray-100 mt-4">
                    <div className="flex items-center gap-2 text-emerald-600 font-bold">
                      <CheckCircle2 size={12} /> SYSTEM SECURE - ALL PROTOCOLS ACTIVE
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 bg-brand-navy text-white p-6 shadow-xl rounded-sm">
                <div className="text-2xl font-bold">ISO 27001</div>
                <div className="text-[10px] uppercase font-black tracking-widest opacity-70">Aligned Standards</div>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {SECURITY_FEATURES.map((feature) => (
              <div key={feature.id} className="p-10 border border-gray-100 rounded-sm hover:border-brand-action hover:shadow-xl transition-all group bg-white">
                <div className={`w-16 h-16 ${feature.color} rounded-sm flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-serif font-bold text-brand-navy mb-4">{feature.title}</h3>
                <p className="text-brand-navy/60 mb-8 leading-relaxed text-sm">
                  {feature.description}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {feature.details.map((detail, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <CheckCircle2 size={16} className="text-brand-action flex-shrink-0" />
                      <span className="text-xs text-brand-navy/80 font-medium">{detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Compliance Section */}
      <section className="py-24 bg-gray-50 border-t border-gray-100">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-navy mb-6">Global Compliance Framework</h2>
            <p className="text-brand-navy/60 leading-relaxed">
              We adhere to the most stringent international standards for data protection and ethical research conduct, ensuring your research is hosted in a compliant environment.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-white border border-gray-100 rounded-sm text-center">
              <div className="font-bold text-brand-navy mb-2">GDPR</div>
              <p className="text-xs text-brand-navy/50">General Data Protection Regulation compliant for all European and global users.</p>
            </div>
            <div className="p-8 bg-white border border-gray-100 rounded-sm text-center">
              <div className="font-bold text-brand-navy mb-2">COPE</div>
              <p className="text-xs text-brand-navy/50">Adherence to Committee on Publication Ethics guidelines for editorial integrity.</p>
            </div>
            <div className="p-8 bg-white border border-gray-100 rounded-sm text-center">
              <div className="font-bold text-brand-navy mb-2">HIPAA</div>
              <p className="text-xs text-brand-navy/50">Aligned with health data privacy standards for medical and clinical research.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto bg-brand-navy rounded-sm p-12 text-center text-white relative overflow-hidden">
            <h3 className="text-3xl font-serif font-bold mb-6">Have security questions?</h3>
            <p className="text-white/60 mb-10 max-w-xl mx-auto">
              Our security and compliance team is available to provide detailed documentation and answer institutional security questionnaires.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Link to="/contact" className="px-10 py-4 bg-brand-action text-white font-bold uppercase tracking-widest text-xs rounded-sm hover:bg-white hover:text-brand-navy transition-all">
                Contact Security Team
              </Link>
              <Link to="/leadership" className="px-10 py-4 border border-white/20 text-white font-bold uppercase tracking-widest text-xs rounded-sm hover:bg-white/10 transition-all">
                View Governance
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
