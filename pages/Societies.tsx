import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Globe, Rocket, ShieldCheck, Heart, ArrowRight } from 'lucide-react';

export const Societies: React.FC = () => {
  return (
    <div className="bg-white min-h-screen">
      <section className="bg-brand-navy text-white py-16">
        <div className="container mx-auto px-6">
          <span className="text-xs font-black uppercase tracking-[0.3em] text-brand-action mb-4 block">Partnerships</span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">For Scholarly Societies</h1>
          <p className="text-xl text-white/60 max-w-2xl">
            Partner with Academic Publishing to grow your community, increase global reach, and ensure a sustainable future for your society.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-24">
            <div>
              <h2 className="text-3xl font-serif font-bold text-brand-navy mb-8">Elevate Your Society</h2>
              <p className="text-brand-navy/70 leading-relaxed mb-8">
                We believe scholarly societies are the heartbeat of academia. Our partnership model is designed to support your independence while providing the technical scale and global presence of a world-class publisher.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="p-4 bg-gray-50 rounded-sm border border-gray-100">
                  <h4 className="font-bold text-brand-navy mb-1 text-sm">Strategic Growth</h4>
                  <p className="text-xs text-brand-navy/50">Dedicated portfolio managers to help you expand your journal's influence.</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-sm border border-gray-100">
                  <h4 className="font-bold text-brand-navy mb-1 text-sm">Member Benefits</h4>
                  <p className="text-xs text-brand-navy/50">Exclusive discounts on APCs and access to high-performance author tools.</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-sm border border-gray-100">
                  <h4 className="font-bold text-brand-navy mb-1 text-sm">Financial Stability</h4>
                  <p className="text-xs text-brand-navy/50">Transparent revenue-sharing models designed for long-term health.</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-sm border border-gray-100">
                  <h4 className="font-bold text-brand-navy mb-1 text-sm">Brand Identity</h4>
                  <p className="text-xs text-brand-navy/50">Keep your society's unique voice and visual identity front and center.</p>
                </div>
              </div>
              <div className="mt-12 flex flex-col gap-4">
                <Link to="/submission-workflow" className="inline-flex items-center gap-2 text-brand-action font-bold uppercase tracking-widest text-xs hover:underline">
                  🔹 View Submission Workflow <ArrowRight size={16} />
                </Link>
                <Link to="/publication-module" className="inline-flex items-center gap-2 text-brand-action font-bold uppercase tracking-widest text-xs hover:underline">
                  🔹 View Publication Module <ArrowRight size={16} />
                </Link>
                <Link to="/security-compliance" className="inline-flex items-center gap-2 text-brand-action font-bold uppercase tracking-widest text-xs hover:underline">
                  🔹 View Security & Compliance <ArrowRight size={16} />
                </Link>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1540317580384-e5d43616b9aa?auto=format&fit=crop&q=80&w=800" 
                alt="Society Meeting" 
                className="rounded-sm shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-brand-action text-white p-6 shadow-xl rounded-sm">
                <div className="text-3xl font-bold">40+</div>
                <div className="text-[10px] uppercase font-black tracking-widest opacity-70">Partner Societies</div>
              </div>
            </div>
          </div>

          <div className="text-center py-16 border-t border-gray-100">
             <h3 className="text-2xl font-serif font-bold text-brand-navy mb-6">Interested in partnering?</h3>
             <p className="text-brand-navy/60 mb-10 max-w-xl mx-auto">Our development team would love to hear about your society's goals and how we can support your publishing journey.</p>
             <button className="px-12 py-4 bg-brand-navy text-white text-sm font-bold rounded-sm hover:bg-brand-action transition-all flex items-center justify-center gap-2 mx-auto">
                Start a Conversation <ArrowRight size={18} />
             </button>
          </div>
        </div>
      </section>
    </div>
  );
};
