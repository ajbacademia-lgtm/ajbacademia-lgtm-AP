import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Cookie, 
  ShieldCheck, 
  Activity, 
  FileText, 
  ExternalLink,
  Users,
  Eye,
  Sliders,
  CheckCircle2
} from 'lucide-react';
import { CookieVisitorDashboard } from '../components/admin/CookieVisitorDashboard';
import { useAuth } from '../context/AuthContext';

export const AdminCookieDashboard: React.FC = () => {
  const { authState } = useAuth();
  const isAdmin = authState.isAuthenticated && authState.user?.role === 'admin';

  return (
    <div className="bg-gray-50/50 min-h-screen py-10">
      <div className="container mx-auto px-4 md:px-6 space-y-8">
        
        {/* Navigation & Breadcrumbs Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Link
              to="/admindashboard"
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-gray-200 hover:border-brand-action text-brand-navy hover:text-brand-action rounded-sm text-xs font-bold uppercase tracking-wider transition-all shadow-xs group"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" /> Back to Admin Hub
            </Link>
            <span className="text-gray-300">/</span>
            <span className="text-xs font-bold uppercase tracking-widest text-brand-action flex items-center gap-1.5 font-mono">
              <Cookie size={14} /> Cookie & Telemetry Center
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/cookies"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 text-gray-600 hover:text-brand-navy text-xs font-semibold rounded-sm hover:bg-gray-50 transition-colors"
            >
              <FileText size={13} /> View Public Policy <ExternalLink size={11} />
            </Link>

            <Link
              to="/admindashboard/payment-gateway-billing"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 text-gray-600 hover:text-brand-navy text-xs font-semibold rounded-sm hover:bg-gray-50 transition-colors"
            >
              <span>Billing & Payments</span>
            </Link>
          </div>
        </div>

        {/* Page Hero Header */}
        <div className="bg-white p-6 md:p-8 rounded-sm border border-gray-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-500"></div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 text-brand-action font-mono text-xs font-bold uppercase tracking-widest mb-2">
                <ShieldCheck size={16} /> Privacy Compliance & Telemetry Engine
              </div>
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-brand-navy tracking-tight mb-3">
                Cookie Governance & Visitor Analytics Dashboard
              </h1>
              <p className="text-gray-600 text-sm leading-relaxed">
                Comprehensive administrative command center for monitoring real-time visitor activity, scholarly article reads, PDF downloads, and managing platform-wide GDPR and ePrivacy cookie consent configurations.
              </p>
            </div>

            {/* Quick Badges */}
            <div className="flex flex-wrap lg:flex-col gap-2.5 shrink-0">
              <div className="inline-flex items-center gap-2 px-3.5 py-2 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded text-xs font-semibold">
                <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                <span>GDPR / ePrivacy Enforced</span>
              </div>
              <div className="inline-flex items-center gap-2 px-3.5 py-2 bg-blue-50 text-blue-800 border border-blue-200 rounded text-xs font-semibold">
                <Activity size={14} className="text-blue-600 shrink-0" />
                <span>Live Event Stream Active</span>
              </div>
              <div className="inline-flex items-center gap-2 px-3.5 py-2 bg-indigo-50 text-indigo-800 border border-indigo-200 rounded text-xs font-semibold">
                <Sliders size={14} className="text-indigo-600 shrink-0" />
                <span>Custom Policy Versioning</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Interactive Cookie & Visitor Activity Dashboard */}
        <CookieVisitorDashboard />

        {/* Informational Guidance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="bg-white p-6 rounded-sm border border-gray-200 shadow-sm">
            <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4">
              <ShieldCheck size={20} />
            </div>
            <h3 className="font-serif font-bold text-brand-navy text-base mb-2">Consent Rate Optimization</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Transparent, light-themed banners with clear explanations for scholarly session security and article metrics increase researcher opt-in rates by up to 35%.
            </p>
          </div>

          <div className="bg-white p-6 rounded-sm border border-gray-200 shadow-sm">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center mb-4">
              <Users size={20} />
            </div>
            <h3 className="font-serif font-bold text-brand-navy text-base mb-2">Anonymous Telemetry</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Visitor sessions are pseudonymized via rotating client identifiers (`_ajp_uid`), ensuring compliance with European and international privacy mandates.
            </p>
          </div>

          <div className="bg-white p-6 rounded-sm border border-gray-200 shadow-sm">
            <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-700 flex items-center justify-center mb-4">
              <Eye size={20} />
            </div>
            <h3 className="font-serif font-bold text-brand-navy text-base mb-2">Scholarly Impact Tracking</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Track manuscript velocity, most-read journals, PDF downloads, and search query trends to optimize academic curation and journal indexing.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
