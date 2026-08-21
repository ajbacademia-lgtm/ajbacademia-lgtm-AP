import React from 'react';
import { Link } from 'react-router-dom';
import { Target, Heart, History, Award, BookOpen, Quote, ChevronRight, ArrowRight } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="bg-white min-h-screen">
      {/* Intro */}
      <section className="py-24 bg-gray-50 border-b border-gray-100">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-xs font-black uppercase tracking-[0.3em] text-brand-action mb-4 block">Our Story</span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-brand-navy mb-8 leading-tight">
                Democratizing Scientific Knowledge
              </h1>
              <p className="text-xl text-brand-navy/70 leading-relaxed mb-8">
                Founded in 2015, Academic Publishing Group was built on a single, powerful conviction: that the world's most critical research should be accessible to everyone, everywhere.
              </p>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-brand-navy">100%</div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-brand-navy/40">Open Access</div>
                </div>
                <div className="w-[1px] h-10 bg-gray-200"></div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-brand-navy">Rigorous</div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-brand-navy/40">Peer Review</div>
                </div>
                <div className="w-[1px] h-10 bg-gray-200"></div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-brand-navy">Global</div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-brand-navy/40">Indexing</div>
                </div>
              </div>
            </div>
            <div className="flex justify-center lg:justify-end">
              <div className="relative group max-w-md w-full">
                <div className="absolute -inset-4 bg-gradient-to-tr from-brand-action/10 to-transparent blur-2xl opacity-40 group-hover:opacity-80 transition-opacity"></div>
                <div className="relative overflow-hidden rounded-sm shadow-xl border border-white/20 aspect-[4/3] bg-gray-200">
                  <img 
                    src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80&w=1200" 
                    alt="Academic Library" 
                    className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-1000"
                  />
                </div>
                {/* Decorative element */}
                <div className="absolute -bottom-4 -right-4 w-24 h-24 border-r-2 border-b-2 border-brand-action/20 -z-10 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center mb-20">
            <h2 className="text-3xl font-serif font-bold text-brand-navy mb-6 italic">
              "We believe that barriers to knowledge are barriers to human progress."
            </h2>
            <div className="w-16 h-[1px] bg-brand-action mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-blue-50 text-brand-action rounded-sm flex items-center justify-center">
                <Target size={24} />
              </div>
              <h3 className="text-xl font-bold text-brand-navy">Our Mission</h3>
              <p className="text-sm text-brand-navy/60 leading-relaxed">
                To empower global research communities through open communication, rigorous standards, and high-performance technology.
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-indigo-50 text-brand-action rounded-sm flex items-center justify-center">
                <BookOpen size={24} />
              </div>
              <h3 className="text-xl font-bold text-brand-navy">Our Values</h3>
              <p className="text-sm text-brand-navy/60 leading-relaxed">
                Integrity in peer review, transparency in processing, and a relentless commitment to editorial excellence.
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-gray-50 text-brand-action rounded-sm flex items-center justify-center">
                <Heart size={24} />
              </div>
              <h3 className="text-xl font-bold text-brand-navy">Community First</h3>
              <p className="text-sm text-brand-navy/60 leading-relaxed">
                Supporting non-native English speakers and researchers from underserved regions to ensure global inclusivity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership / Culture Quote */}
      <section className="py-24 bg-brand-navy text-white overflow-hidden">
        <div className="container mx-auto px-6 relative">
          <div className="absolute top-0 left-0 opacity-10">
             <Quote size={200} />
          </div>
          <div className="max-w-3xl relative z-10 ml-auto">
            <h2 className="text-3xl font-serif font-bold mb-8 italic leading-snug">
              "Scientific publishing shouldn't just be about moving PDFs around. It's about building trust, fostering dialogue, and accelerating the pace of discovery."
            </h2>
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 rounded-full bg-gray-800 border border-white/10 overflow-hidden">
                  <img src="https://i.pravatar.cc/150?u=admin" alt="CEO" />
               </div>
               <div>
                  <div className="font-bold">Dr. Elena Rodriguez</div>
                  <div className="text-[10px] uppercase tracking-widest text-white/40 font-black">Chief Executive Officer</div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Heritage Timeline Placeholder */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-6 mb-16">
            <h2 className="text-2xl font-serif font-bold text-brand-navy">Milestones</h2>
            <div className="flex-grow h-[1px] bg-brand-navy/10"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {[
              { year: "2015", event: "Founded in London" },
              { year: "2018", event: "Reached 100 Journal Milestone" },
              { year: "2021", event: "Launched AI-Native Platform" },
              { year: "2024", event: "Global HQ expansion to Singapore" }
            ].map((m, i) => (
              <div key={i} className="border-l-2 border-brand-action/20 pl-6 pb-4">
                <div className="text-2xl font-bold text-brand-navy mb-2">{m.year}</div>
                <div className="text-sm text-brand-navy/60">{m.event}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* User Roles Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <span className="text-xs font-black uppercase tracking-[0.3em] text-brand-action mb-4 block">Our Community</span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-navy mb-8">🔹 User Roles</h2>
            <p className="text-lg text-brand-navy/60 mb-12">
              Our platform is built on a collaborative ecosystem of authors, reviewers, editors, admins, and public users. Each role is vital to the integrity and success of scientific publishing.
            </p>
            <Link to="/user-roles" className="inline-flex items-center gap-2 px-8 py-4 bg-brand-navy text-white font-bold uppercase tracking-widest text-xs rounded-sm hover:bg-brand-action transition-all">
              Explore All Roles <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Submission Workflow Section */}
      <section className="py-24 bg-white border-t border-gray-100">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <span className="text-xs font-black uppercase tracking-[0.3em] text-brand-action mb-4 block">Author Experience</span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-navy mb-8">🔹 Submission Workflow</h2>
            <p className="text-lg text-brand-navy/60 mb-12">
              Experience a streamlined, transparent, and technology-driven submission process. From manuscript upload to review assignments, we ensure your research moves forward efficiently.
            </p>
            <Link to="/submission-workflow" className="inline-flex items-center gap-2 px-8 py-4 border-2 border-brand-navy text-brand-navy font-bold uppercase tracking-widest text-xs rounded-sm hover:bg-brand-navy hover:text-white transition-all">
              View Workflow <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Review Management Section */}
      <section className="py-24 bg-gray-50 border-t border-gray-100">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <span className="text-xs font-black uppercase tracking-[0.3em] text-brand-action mb-4 block">Quality Assurance</span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-navy mb-8">🔹 Review Management</h2>
            <p className="text-lg text-brand-navy/60 mb-12">
              Our advanced review management system ensures academic rigor through double-blind peer review, structured scoring, and automated deadline tracking.
            </p>
            <Link to="/review-management" className="inline-flex items-center gap-2 px-8 py-4 bg-brand-navy text-white font-bold uppercase tracking-widest text-xs rounded-sm hover:bg-brand-action transition-all shadow-lg">
              Explore Review System <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Publication Module Section */}
      <section className="py-24 bg-white border-t border-gray-100">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <span className="text-xs font-black uppercase tracking-[0.3em] text-brand-action mb-4 block">Global Distribution</span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-navy mb-8">🔹 Publication Module</h2>
            <p className="text-lg text-brand-navy/60 mb-12">
              Automated DOI assignment, multi-format rendering (HTML + PDF), and rich metadata syndication to CrossRef, PubMed, and global indexes.
            </p>
            <Link to="/publication-module" className="inline-flex items-center gap-2 px-8 py-4 border-2 border-brand-navy text-brand-navy font-bold uppercase tracking-widest text-xs rounded-sm hover:bg-brand-navy hover:text-white transition-all">
              View Publication Suite <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Admin Dashboards Section */}
      <section className="py-24 bg-gray-50 border-t border-gray-100">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <span className="text-xs font-black uppercase tracking-[0.3em] text-brand-action mb-4 block">Platform Governance</span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-navy mb-8">🔹 Admin Dashboards</h2>
            <p className="text-lg text-brand-navy/60 mb-12">
              Empowering editors and administrators with real-time data, submission metrics, and advanced content moderation tools.
            </p>
            <Link to="/admindashboard" className="inline-flex items-center gap-2 px-8 py-4 bg-brand-navy text-white font-bold uppercase tracking-widest text-xs rounded-sm hover:bg-brand-action transition-all shadow-lg">
              Explore Admin Suite <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Security & Compliance Section */}
      <section className="py-24 bg-white border-t border-gray-100">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <span className="text-xs font-black uppercase tracking-[0.3em] text-brand-action mb-4 block">Trust & Integrity</span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-navy mb-8">🔹 Security & Compliance</h2>
            <p className="text-lg text-brand-navy/60 mb-12">
              Protecting research integrity with GDPR compliance, double opt-in verification, immutable audit logs, and granular permission systems.
            </p>
            <Link to="/security-compliance" className="inline-flex items-center gap-2 px-8 py-4 border-2 border-brand-navy text-brand-navy font-bold uppercase tracking-widest text-xs rounded-sm hover:bg-brand-navy hover:text-white transition-all">
              View Security Standards <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
