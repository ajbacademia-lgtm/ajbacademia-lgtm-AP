import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, Cpu, Users, ShieldCheck, Zap, BarChart3, Database, MessageSquare, ArrowRight, Check } from 'lucide-react';

export const Solution: React.FC = () => {
  const offerings = [
    {
      title: "For Researchers",
      icon: <Users className="text-blue-500" />,
      description: "Accelerate your discovery and maximize the impact of your work with our advanced author toolkit.",
      features: ["Rapid Peer Review", "Open Access Publishing", "AI-Powered Summarization", "Citation Impact Tracking"]
    },
    {
      title: "For Institutions",
      icon: <Globe className="text-indigo-500" />,
      description: "Comprehensive hosting and management solutions for university-led research and digital archives.",
      features: ["Custom Library Branding", "Institutional Repositories", "Usage & Impact Analytics", "OAI-PMH Compliance"]
    },
    {
      title: "For Societies",
      icon: <Database className="text-brand-action" />,
      description: "Scale your scholarly society with professional journal management and global distribution.",
      features: ["Full Editorial Workflow", "Subscriber Management", "Metadata Optimization", "Strategic Growth Consulting"]
    }
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <section className="bg-brand-navy text-white py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-500/10 skew-x-12 transform origin-top translate-x-1/2"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-serif font-bold mb-8 leading-tight">
              Scholarly Solutions for a Digital World
            </h1>
            <p className="text-xl text-white/60 mb-10 leading-relaxed">
              Academic Publishing provides the technical infrastructure and editorial expertise required to navigate the complexities of modern academic publishing.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/explore-enterprise" className="bg-brand-action text-white px-10 py-4 rounded-sm font-black uppercase tracking-widest text-[10px] hover:bg-white hover:text-brand-navy transition-all shadow-xl shadow-blue-500/20">
                Explore Enterprise
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Core Offerings */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {offerings.map((off, i) => (
              <div key={i} className="bg-white p-10 rounded-sm border border-gray-100 shadow-sm hover:shadow-xl transition-all group border-t-4 border-t-transparent hover:border-t-brand-action">
                <div className="w-16 h-16 bg-gray-50 rounded-sm flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                  {off.icon}
                </div>
                <h3 className="text-2xl font-bold text-brand-navy mb-4">{off.title}</h3>
                <p className="text-brand-navy/60 text-sm mb-8 leading-relaxed">
                  {off.description}
                </p>
                <ul className="space-y-3 mb-10">
                  {off.features.map(feat => (
                    <li key={feat} className="flex items-center gap-3 text-sm text-brand-navy/80">
                      <Check size={16} className="text-green-500" /> {feat}
                    </li>
                  ))}
                </ul>
                <button className="w-full py-4 bg-gray-50 text-brand-navy font-bold text-xs uppercase tracking-widest hover:bg-brand-navy hover:text-white transition-all rounded-sm">
                  View Solutions
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Capabilities */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-3xl font-serif font-bold text-brand-navy mb-8">Advanced Platform Capabilities</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <div className="text-brand-action"><Cpu size={32} /></div>
                  <h4 className="font-bold text-brand-navy">AI-Native Workflow</h4>
                  <p className="text-xs text-brand-navy/60 leading-relaxed">Integrated LLM tools for summarization, keyword extraction, and preliminary screening.</p>
                </div>
                <div className="space-y-3">
                  <div className="text-brand-action"><ShieldCheck size={32} /></div>
                  <h4 className="font-bold text-brand-navy">Rigorous Security</h4>
                  <p className="text-xs text-brand-navy/60 leading-relaxed">ISO-certified data management ensuring researcher privacy and intellectual property protection.</p>
                </div>
                <div className="space-y-3">
                  <div className="text-brand-action"><BarChart3 size={32} /></div>
                  <h4 className="font-bold text-brand-navy">Real-time Analytics</h4>
                  <p className="text-xs text-brand-navy/60 leading-relaxed">Granular insights into downloads, citations, and geographic reach for every publication.</p>
                </div>
                <div className="space-y-3">
                  <div className="text-brand-action"><Zap size={32} /></div>
                  <h4 className="font-bold text-brand-navy">Global CDN</h4>
                  <p className="text-xs text-brand-navy/60 leading-relaxed">High-performance delivery ensuring rapid access to manuscripts from any continent.</p>
                </div>
              </div>
              <div className="mt-12 flex flex-col gap-4">
                <Link to="/submission-workflow" className="inline-flex items-center gap-2 text-brand-action font-bold uppercase tracking-widest text-xs hover:underline">
                  Explore our Submission Workflow <ArrowRight size={16} />
                </Link>
                <Link to="/publication-module" className="inline-flex items-center gap-2 text-brand-action font-bold uppercase tracking-widest text-xs hover:underline">
                  Explore our Publication Module <ArrowRight size={16} />
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="bg-brand-navy p-12 rounded-sm shadow-2xl relative z-10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="space-y-4 font-mono text-sm text-blue-300 opacity-80">
                  <p className="text-white">// Initiating Platform Discovery...</p>
                  <p>const impact = await AcademicPublishing.analyze(manuscript_id);</p>
                  <p>if (impact.global_reach &gt; threshold) {"{"}</p>
                  <p className="pl-4">await AcademicPublishing.promote(trending_networks);</p>
                  <p className="pl-4">await AcademicPublishing.translate(major_languages);</p>
                  <p>{"}"}</p>
                  <p className="text-green-400">STATUS: ACCELERATING SCIENCE</p>
                </div>
              </div>
              <div className="absolute inset-0 bg-blue-500 blur-[80px] opacity-20 -z-0"></div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="bg-brand-navy rounded-sm p-12 md:p-20 text-center relative overflow-hidden">
             <div className="relative z-10">
                <h2 className="text-4xl font-serif font-bold text-white mb-6">Build the Future of Science Together</h2>
                <p className="text-white/60 mb-10 text-lg max-w-2xl mx-auto">
                  Whether you're starting a new journal or migrating an existing portfolio, our team provides the support you need to thrive.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                   <button className="w-full sm:w-auto px-12 py-4 bg-brand-action text-white font-bold rounded-sm hover:bg-white hover:text-brand-navy transition-all">
                      Schedule a Consultation
                   </button>
                   <button 
                     onClick={() => window.dispatchEvent(new CustomEvent('openSalesChat'))}
                     className="w-full sm:w-auto px-12 py-4 border border-white/20 text-white font-bold rounded-sm hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                   >
                      <MessageSquare size={18} /> Chat with us
                   </button>
                </div>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
};