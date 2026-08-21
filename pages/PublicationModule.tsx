import React from 'react';
import { FileCode, History, FileText, Share2, CheckCircle2, Globe, Database, ArrowRight, Download, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const PUBLICATION_FEATURES = [
  {
    id: 'doi-assignment',
    title: 'DOI Assignment',
    icon: <Globe size={32} />,
    color: 'bg-blue-50 text-blue-600',
    description: 'Every article published through Academic Publishing is assigned a unique, permanent Digital Object Identifier (DOI) via CrossRef, ensuring long-term discoverability and reliable citation.',
    details: [
      'Permanent link to research',
      'CrossRef registration',
      'Automated metadata deposit',
      'Citation tracking integration'
    ]
  },
  {
    id: 'versioning',
    title: 'Article Versioning',
    icon: <History size={32} />,
    color: 'bg-emerald-50 text-emerald-600',
    description: 'We support the full lifecycle of a manuscript, from pre-prints to Version of Record (VoR) and subsequent corrections or updates, maintaining a clear audit trail.',
    details: [
      'Pre-print hosting',
      'Version of Record (VoR)',
      'Correction & Retraction management',
      'Linked version history'
    ]
  },
  {
    id: 'rendering',
    title: 'HTML + PDF Rendering',
    icon: <FileText size={32} />,
    color: 'bg-brand-action/10 text-brand-action',
    description: 'Our multi-format rendering engine automatically generates high-quality PDF and responsive HTML versions of every article, optimized for both print and digital reading.',
    details: [
      'Responsive HTML5 articles',
      'Typeset-quality PDF generation',
      'Mobile-optimized reading',
      'Interactive figures and tables'
    ]
  },
  {
    id: 'metadata-export',
    title: 'Metadata Export',
    icon: <Database size={32} />,
    color: 'bg-indigo-50 text-indigo-600',
    description: 'Seamless integration with global indexing services. We export rich metadata in multiple formats to ensure your research is indexed where it matters most.',
    details: [
      'JATS XML compliant',
      'CrossRef & PubMed deposits',
      'DOAJ & Scopus integration',
      'OAI-PMH harvesting support'
    ]
  }
];

export const PublicationModule: React.FC = () => {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="py-20 bg-gray-50 border-b border-gray-100">
        <div className="container mx-auto px-6 text-center">
          <span className="text-xs font-black uppercase tracking-[0.3em] text-brand-action mb-4 block">Production Pipeline</span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-brand-navy mb-6">🔹 Publication Module</h1>
          <p className="text-lg text-brand-navy/60 max-w-2xl mx-auto leading-relaxed">
            From final acceptance to global distribution. Our automated production suite handles DOI registration, multi-format rendering, and metadata syndication.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {PUBLICATION_FEATURES.map((feature) => (
              <div key={feature.id} className="p-10 border border-gray-100 rounded-sm hover:shadow-xl transition-all group bg-white flex flex-col">
                <div className={`w-16 h-16 ${feature.color} rounded-sm flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h2 className="text-2xl font-serif font-bold text-brand-navy mb-4">{feature.title}</h2>
                <p className="text-brand-navy/60 mb-8 leading-relaxed">
                  {feature.description}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-auto">
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

      {/* Production Preview */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <div className="max-w-xl">
                <div className="flex items-center gap-3 text-brand-action mb-4">
                  <FileCode size={20} />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">Automated Typesetting</span>
                </div>
                <h2 className="text-3xl font-serif font-bold text-brand-navy mb-4">High-Fidelity Rendering</h2>
                <p className="text-brand-navy/60 text-sm leading-relaxed">
                  Our platform uses a single-source XML workflow. This means that from one set of data, we generate perfectly formatted HTML for web browsers and professional-grade PDFs for printing and offline reading.
                </p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-sm">
                  <div className="text-brand-action"><FileCode size={24} /></div>
                  <div>
                    <div className="font-bold text-brand-navy text-sm">JATS XML Source</div>
                    <div className="text-[10px] text-brand-navy/40 uppercase tracking-widest">Industry Standard</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-sm">
                  <div className="text-blue-600"><FileText size={24} /></div>
                  <div>
                    <div className="font-bold text-brand-navy text-sm">Automated PDF Generation</div>
                    <div className="text-[10px] text-brand-navy/40 uppercase tracking-widest">Typeset Quality</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-sm">
                  <div className="text-emerald-600"><Globe size={24} /></div>
                  <div>
                    <div className="font-bold text-brand-navy text-sm">Responsive HTML5</div>
                    <div className="text-[10px] text-brand-navy/40 uppercase tracking-widest">Mobile First</div>
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
                  <div className="text-[10px] text-white/40 font-mono">article_v2.1_final.xml</div>
                </div>
                <div className="p-8 space-y-6">
                  <div className="h-4 bg-gray-100 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-100 rounded w-1/2"></div>
                  <div className="grid grid-cols-3 gap-4 py-4">
                    <div className="h-20 bg-blue-50 rounded flex items-center justify-center text-blue-300"><Download size={24} /></div>
                    <div className="h-20 bg-emerald-50 rounded flex items-center justify-center text-emerald-300"><ExternalLink size={24} /></div>
                    <div className="h-20 bg-indigo-50 rounded flex items-center justify-center text-indigo-300"><Share2 size={24} /></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 bg-gray-50 rounded w-full"></div>
                    <div className="h-2 bg-gray-50 rounded w-full"></div>
                    <div className="h-2 bg-gray-50 rounded w-5/6"></div>
                  </div>
                  <div className="pt-6 border-t border-gray-100 flex justify-between items-center">
                    <div className="text-[10px] font-bold text-brand-navy/40 uppercase tracking-widest">DOI: 10.1234/ap.2024.001</div>
                    <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-bold">VERSION 2.1 (VOR)</div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 bg-brand-action text-white p-6 shadow-xl rounded-sm">
                <div className="text-2xl font-bold">XML-First</div>
                <div className="text-[10px] uppercase font-black tracking-widest opacity-70">Workflow</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Metadata Syndication */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-serif font-bold text-brand-navy mb-8">Global Metadata Syndication</h2>
          <p className="text-brand-navy/60 max-w-2xl mx-auto mb-16">
            We ensure your research is visible to the global scientific community by automatically depositing metadata to major indexing services.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="p-8 border border-gray-100 rounded-sm hover:bg-gray-50 transition-colors">
              <div className="font-bold text-brand-navy mb-2">CrossRef</div>
              <div className="text-[10px] text-brand-navy/40 uppercase tracking-widest font-black">DOI Registration</div>
            </div>
            <div className="p-8 border border-gray-100 rounded-sm hover:bg-gray-50 transition-colors">
              <div className="font-bold text-brand-navy mb-2">PubMed</div>
              <div className="text-[10px] text-brand-navy/40 uppercase tracking-widest font-black">PMC Deposits</div>
            </div>
            <div className="p-8 border border-gray-100 rounded-sm hover:bg-gray-50 transition-colors">
              <div className="font-bold text-brand-navy mb-2">Scopus</div>
              <div className="text-[10px] text-brand-navy/40 uppercase tracking-widest font-black">Citation Index</div>
            </div>
            <div className="p-8 border border-gray-100 rounded-sm hover:bg-gray-50 transition-colors">
              <div className="font-bold text-brand-navy mb-2">DOAJ</div>
              <div className="text-[10px] text-brand-navy/40 uppercase tracking-widest font-black">Open Access</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto bg-brand-navy rounded-sm p-12 text-center text-white relative overflow-hidden">
            <h3 className="text-3xl font-serif font-bold mb-6">Ready to publish?</h3>
            <p className="text-white/60 mb-10 max-w-xl mx-auto">
              Experience the most advanced publication pipeline in scholarly publishing.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Link to="/submit" className="px-10 py-4 bg-brand-action text-white font-bold uppercase tracking-widest text-xs rounded-sm hover:bg-white hover:text-brand-navy transition-all">
                Submit Manuscript
              </Link>
              <Link to="/contact" className="px-10 py-4 border border-white/20 text-white font-bold uppercase tracking-widest text-xs rounded-sm hover:bg-white/10 transition-all">
                Contact Production Team
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
