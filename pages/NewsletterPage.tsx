import React from 'react';
import { NewsletterSubscription } from '../components/NewsletterSubscription';
import { Mail, BookOpen, Sparkles, CheckCircle2, ShieldCheck, Award, Bell, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

export const NewsletterPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-6">
          <Link to="/" className="hover:text-brand-navy">Home</Link>
          <span>/</span>
          <span className="text-brand-navy font-semibold">Newsletter & Journal Alerts</span>
        </div>

        {/* Hero Description */}
        <div className="bg-white rounded-2xl p-8 md:p-10 border border-gray-200 shadow-sm mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-light text-brand-navy rounded-full text-xs font-bold uppercase mb-4">
            <Mail size={14} className="text-brand-action" />
            <span>Academic Publishing Group Publications Digest</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-brand-navy mb-4 tracking-tight">
            Subscribe to Academic Research Newsletters & Journal Alerts
          </h1>
          <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-6">
            Join global researchers, editors, reviewers, and faculty members receiving curated scientific breakthroughs, special issue calls for papers, impact metrics, and open-access publishing updates across all major disciplines.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-gray-100 text-xs">
            <div className="flex items-start gap-2.5">
              <div className="p-2 bg-blue-50 text-brand-action rounded-lg flex-shrink-0">
                <BookOpen size={18} />
              </div>
              <div>
                <strong className="block text-brand-navy font-bold">Curated Research</strong>
                <span className="text-gray-500">Peer-reviewed findings summarized by domain experts.</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg flex-shrink-0">
                <Bell size={18} />
              </div>
              <div>
                <strong className="block text-brand-navy font-bold">Call for Papers</strong>
                <span className="text-gray-500">First-hand notice of upcoming high-impact special issues.</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="p-2 bg-purple-50 text-purple-600 rounded-lg flex-shrink-0">
                <ShieldCheck size={18} />
              </div>
              <div>
                <strong className="block text-brand-navy font-bold">Privacy Guaranteed</strong>
                <span className="text-gray-500">Zero spam. Update preferences or unsubscribe anytime.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Interactive Subscription Form Component */}
        <NewsletterSubscription 
          variant="banner" 
          source="Dedicated Newsletter Page"
        />

        {/* Benefits Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-base font-bold text-brand-navy mb-2 flex items-center gap-2">
              <Award size={18} className="text-amber-500" />
              <span>Tailored to Your Research Domain</span>
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Select specific disciplines — from AI & Computer Science, Clinical Medicine, Biomedical Engineering, to Humanities & Social Sciences. Receive only papers and announcements directly pertinent to your field of study.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-base font-bold text-brand-navy mb-2 flex items-center gap-2">
              <Globe size={18} className="text-blue-500" />
              <span>Global Editorial Insights</span>
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Gain access to editorial board perspectives, peer-review guidance, author best practices, and international research conference schedules curated by the Academic Publishing Group.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
