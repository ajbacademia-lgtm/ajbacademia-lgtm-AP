import React, { useState } from 'react';
import { Shield, Globe, Database, Scale, BarChart3, Users, CheckCircle2, ArrowRight, Zap, Award, Building2, Server, X, Send, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';

export const ExploreEnterprise: React.FC = () => {
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [inquiryType, setInquiryType] = useState<'Strategy' | 'Specifications' | 'General' | 'Tier'>('General');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inquiryForm, setInquiryForm] = useState({
    name: '',
    email: '',
    institution: '',
    message: ''
  });

  const handleOpenInquiry = (type: typeof inquiryType) => {
    setInquiryType(type);
    setShowInquiryModal(true);
  };

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const subject = `Enterprise Inquiry [${inquiryType}]: ${inquiryForm.institution}`;
    const body = `Name: ${inquiryForm.name}\nEmail: ${inquiryForm.email}\nInstitution: ${inquiryForm.institution}\nInquiry Type: ${inquiryType}\n\nMessage:\n${inquiryForm.message}`;
    const mailtoLink = `mailto:info@academicpublishinggroup.org?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    setTimeout(() => {
      window.location.href = mailtoLink;
      setIsSubmitting(false);
      setShowInquiryModal(false);
      setInquiryForm({ name: '', email: '', institution: '', message: '' });
    }, 1500);
  };
  const tiers = [
    {
      name: "Institutional Base",
      price: "Enquire for Pricing",
      description: "Ideal for individual university departments or specialized research centers.",
      features: [
        "Single Journal/Repository Hosting",
        "Standard Metadata Syndication",
        "24/7 technical support",
        "Basic Usage Analytics",
        "OAI-PMH Support"
      ]
    },
    {
      name: "Enterprise Multi-Journal",
      price: "Custom Quote",
      featured: true,
      description: "Designed for universities managing complete portfolios or large scholarly societies.",
      features: [
        "Unlimited Journal Instances",
        "White-label Branding",
        "Advanced API Access",
        "Dedicated Account Manager",
        "Full XML Rendering Suite",
        "DOI Registration Management"
      ]
    },
    {
      name: "Global Consortium",
      price: "Strategic Partnership",
      description: "For national research networks or global multi-institutional alliances.",
      features: [
        "Shared Infrastructure Nodes",
        "Federated Search Integration",
        "Custom Governance Workflows",
        "Priority Feature Development",
        "On-premise Deployment Options"
      ]
    }
  ];

  const valueProps = [
    {
      title: "Ironclad Governance",
      icon: <Shield className="text-brand-action" />,
      text: "Enterprise-grade security with ISO 27001 compliance and advanced data residency controls."
    },
    {
      title: "Global Distribution",
      icon: <Globe className="text-brand-action" />,
      text: "Auto-indexing with Crossref, PubMed, Scopus, and Major Library Discovery Services."
    },
    {
      title: "Scalable Architecture",
      icon: <Server className="text-brand-action" />,
      text: "Cloud-native infrastructure that handles millions of downloads without latency."
    }
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="relative py-28 bg-brand-navy text-white overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10">
          <Database size={800} className="transform translate-x-1/2 -translate-y-1/4" />
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 text-brand-action mb-6"
            >
              <Building2 size={20} />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Enterprise Solutions</span>
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-6xl font-serif font-black mb-8 leading-tight"
            >
              Publishing Infrastructure <br />
              <span className="text-brand-action">at Scale</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-white/60 mb-10 leading-relaxed"
            >
              Academic Publishing provides the mission-critical foundation for institutions to host, manage, and disseminate scholarly knowledge with global impact.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <button 
                onClick={() => handleOpenInquiry('Strategy')}
                className="px-10 py-4 bg-brand-action text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-sm hover:bg-white hover:text-brand-navy transition-all shadow-2xl shadow-blue-500/20"
              >
                Contact Strategy Team
              </button>
              <button 
                onClick={() => handleOpenInquiry('Specifications')}
                className="px-10 py-4 border border-white/20 text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-sm hover:bg-white/10 transition-all"
              >
                Request Specifications
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section className="py-24 border-b border-gray-100">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {valueProps.map((prop, i) => (
              <div key={i} className="space-y-4">
                <div className="w-12 h-12 bg-brand-action/10 rounded-sm flex items-center justify-center">
                  {prop.icon}
                </div>
                <h3 className="text-xl font-serif font-bold text-brand-navy">{prop.title}</h3>
                <p className="text-brand-navy/60 text-sm leading-relaxed">{prop.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing/Tiers */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-serif font-bold text-brand-navy mb-4">Enterprise Tiers</h2>
            <p className="text-brand-navy/50 max-w-2xl mx-auto">Scalable models designed to support your institution's growth from a single journal to a global publishing network.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {tiers.map((tier, i) => (
              <div 
                key={i} 
                className={`p-10 rounded-sm border ${tier.featured ? 'bg-brand-navy text-white border-brand-navy shadow-2xl relative scale-105 z-10' : 'bg-white border-gray-100'}`}
              >
                {tier.featured && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 bg-brand-action text-white text-[9px] font-black uppercase tracking-widest rounded-full">
                    Recommended
                  </div>
                )}
                <h3 className="text-2xl font-serif font-bold mb-2">{tier.name}</h3>
                <div className="text-brand-action font-black text-xs uppercase tracking-widest mb-6">{tier.price}</div>
                <p className={`text-sm mb-8 ${tier.featured ? 'text-white/60' : 'text-brand-navy/60'}`}>{tier.description}</p>
                
                <ul className="space-y-4 mb-10">
                  {tier.features.map(f => (
                    <li key={f} className="flex items-center gap-3 text-xs">
                      <CheckCircle2 size={16} className={tier.featured ? 'text-brand-action' : 'text-brand-action'} />
                      <span className={tier.featured ? 'text-white/80' : 'text-brand-navy/80'}>{f}</span>
                    </li>
                  ))}
                </ul>

                <button 
                  onClick={() => handleOpenInquiry('Tier')}
                  className={`w-full py-4 font-black uppercase tracking-widest text-[10px] rounded-sm transition-all ${
                  tier.featured 
                    ? 'bg-brand-action text-white hover:bg-white hover:text-brand-navy' 
                    : 'bg-brand-navy text-white hover:bg-brand-action'
                }`}>
                  Inquire Now
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integration Section */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl font-serif font-bold text-brand-navy">Deep Ecosystem Integration</h2>
              <p className="text-brand-navy/60 leading-relaxed italic">
                "Academic Publishing doesn't just host our content; they connect our research to the world. Their metadata syndication is the gold standard in the industry."
              </p>
              
              <div className="space-y-4">
                {[
                  { label: "ORCID", value: "Automatic author disambiguation & profile sync" },
                  { label: "Crossref", value: "Instant DOI minting and reference linking" },
                  { label: "OAI-PMH", value: "Seamless harvesting by major library networks" }
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 bg-gray-50 rounded-sm">
                    <div className="font-serif font-bold text-brand-action text-lg">{i + 1}.</div>
                    <div>
                      <h4 className="font-bold text-brand-navy text-sm">{item.label}</h4>
                      <p className="text-xs text-brand-navy/50">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-brand-navy p-1 px-1 rounded-sm shadow-2xl">
              <div className="bg-white p-12 rounded-sm border border-brand-navy/10 overflow-hidden relative">
                <div className="absolute top-0 right-0 p-8">
                   <Award size={48} className="text-brand-action opacity-20" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-brand-navy mb-6">Service Level Guarantee</h3>
                <div className="space-y-8">
                   <div className="flex items-center gap-6">
                      <div className="text-4xl font-light text-brand-action">99.9%</div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-brand-navy/40">Uptime Assurance</div>
                   </div>
                   <div className="flex items-center gap-6">
                      <div className="text-4xl font-light text-brand-action">&lt; 4h</div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-brand-navy/40">Critical Response Time</div>
                   </div>
                   <div className="flex items-center gap-6">
                      <div className="text-4xl font-light text-brand-action">Unlimited</div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-brand-navy/40">Archival Storage</div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-brand-navy text-white text-center">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-serif font-bold mb-8">Ready to transform your institutional publishing?</h2>
          <p className="text-white/60 mb-10 max-w-xl mx-auto">
            Our strategic consultants are ready to help you map out your digital transition or portfolio expansion.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <button 
              onClick={() => handleOpenInquiry('Strategy')}
              className="px-12 py-4 bg-brand-action text-white font-black uppercase tracking-widest text-[10px] rounded-sm hover:bg-white hover:text-brand-navy transition-all"
            >
              Schedule Strategic Review
            </button>
            <Link to="/contact" className="px-12 py-4 border border-white/20 text-white font-black uppercase tracking-widest text-[10px] rounded-sm hover:bg-white/10 transition-all flex items-center gap-2">
              Corporate Overview <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Inquiry Modal */}
      <AnimatePresence>
        {showInquiryModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowInquiryModal(false)}
              className="absolute inset-0 bg-brand-navy/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white w-full max-w-lg rounded-sm shadow-2xl overflow-hidden"
            >
              <div className="bg-brand-navy p-6 text-white flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-serif font-black">Enterprise Inquiry</h3>
                  <p className="text-[10px] font-black uppercase tracking-widest text-brand-action mt-1">Request Type: {inquiryType}</p>
                </div>
                <button onClick={() => setShowInquiryModal(false)} className="text-white/60 hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleInquirySubmit} className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-brand-navy/40">Full Name</label>
                    <input 
                      required
                      type="text"
                      className="w-full border-b border-gray-200 py-2 outline-none focus:border-brand-action transition-colors text-sm"
                      placeholder="Dr. Alexander West"
                      value={inquiryForm.name}
                      onChange={e => setInquiryForm({...inquiryForm, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-brand-navy/40">Work Email</label>
                    <input 
                      required
                      type="email"
                      className="w-full border-b border-gray-200 py-2 outline-none focus:border-brand-action transition-colors text-sm"
                      placeholder="alex.west@university.edu"
                      value={inquiryForm.email}
                      onChange={e => setInquiryForm({...inquiryForm, email: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-brand-navy/40">Institution / Organization</label>
                  <input 
                    required
                    type="text"
                    className="w-full border-b border-gray-200 py-2 outline-none focus:border-brand-action transition-colors text-sm"
                    placeholder="e.g. Oxford University, NIH..."
                    value={inquiryForm.institution}
                    onChange={e => setInquiryForm({...inquiryForm, institution: e.target.value})}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-brand-navy/40">Inquiry Details</label>
                  <textarea 
                    rows={4}
                    className="w-full border-b border-gray-200 py-2 outline-none focus:border-brand-action transition-colors text-sm resize-none"
                    placeholder="Briefly describe your requirements or strategic goals..."
                    value={inquiryForm.message}
                    onChange={e => setInquiryForm({...inquiryForm, message: e.target.value})}
                  ></textarea>
                </div>

                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-brand-navy text-white py-4 rounded-sm font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 hover:bg-brand-action transition-all disabled:opacity-70 shadow-xl shadow-brand-navy/10"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="animate-spin" size={16} /> Processing...
                    </span>
                  ) : (
                    <>
                      <Send size={16} /> Transmit Request
                    </>
                  )}
                </button>
                <p className="text-[9px] text-center text-brand-navy/40 uppercase font-black tracking-widest">
                  Direct Channel: info@academicpublishinggroup.org
                </p>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
