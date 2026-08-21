import React from 'react';
import { Globe, Shield, Scale, Zap, Building2, Landmark } from 'lucide-react';

export const Company: React.FC = () => {
  const pillars = [
    {
      title: "Academic Integrity",
      icon: <Scale className="text-blue-600" />,
      desc: "Our journals adhere to the highest standards of peer-review and ethical publishing guidelines set by COPE."
    },
    {
      title: "Technological Edge",
      icon: <Zap className="text-amber-500" />,
      desc: "Leveraging AI and modern infrastructure to accelerate the speed of discovery without compromising quality."
    },
    {
      title: "Global Inclusivity",
      icon: <Globe className="text-emerald-600" />,
      desc: "Ensuring researchers from all regions have an equitable platform to share their life's work."
    }
  ];

  return (
    <div className="bg-white min-h-screen">
      <section className="bg-brand-navy text-white py-20">
        <div className="container mx-auto px-6">
          <span className="text-xs font-black uppercase tracking-[0.3em] text-brand-action mb-4 block">Academic Publishing Group</span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">Our Company</h1>
          <p className="text-xl text-white/60 max-w-2xl leading-relaxed">
            Academic Publishing Group is a leading global publisher of open access, peer-reviewed journals across science, technology, medicine, and social sciences.
          </p>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
            <div>
              <h2 className="text-3xl font-serif font-bold text-brand-navy mb-6">A Division of Excellence</h2>
              <p className="text-brand-navy/70 leading-relaxed mb-6">
                Academic Publishing operates as a specialized division of the ACADEMIC PUBLISHING GROUP, a conglomerate dedicated to the advancement of human knowledge for over a decade. Our corporate structure is designed to support the autonomy of editorial boards while providing the robust technical and financial backing of a global leader.
              </p>
              <div className="flex items-center gap-8 py-6 border-y border-gray-100">
                <div className="flex items-center gap-3">
                  <Building2 className="text-brand-action" size={32} />
                  <div>
                    <div className="font-bold text-brand-navy">5 Global Hubs</div>
                    <div className="text-[10px] uppercase tracking-widest text-brand-navy/40">Infrastructure</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Landmark className="text-brand-action" size={32} />
                  <div>
                    <div className="font-bold text-brand-navy">ISO Certified</div>
                    <div className="text-[10px] uppercase tracking-widest text-brand-navy/40">Quality Standards</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 p-12 rounded-sm border border-gray-100">
              <h3 className="text-xl font-bold text-brand-navy mb-8">Corporate Pillars</h3>
              <div className="space-y-8">
                {pillars.map((p, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="mt-1">{p.icon}</div>
                    <div>
                      <h4 className="font-bold text-brand-navy mb-1">{p.title}</h4>
                      <p className="text-sm text-brand-navy/60">{p.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-brand-light">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-serif font-bold text-brand-navy mb-12">Our Commitment to Open Access</h2>
          <div className="max-w-3xl mx-auto prose prose-blue text-brand-navy/70">
            <p>
              We believe that knowledge should not be behind a paywall. Our Gold Open Access model ensures that research is freely available immediately upon publication, fostering a more collaborative and innovative global research environment. 
            </p>
            <p>
              By removing financial barriers for readers, we increase the visibility and impact of the research we publish, benefiting both the authors and society at large.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
