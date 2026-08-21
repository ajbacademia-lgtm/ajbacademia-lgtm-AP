import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  MessageSquare, 
  ShieldCheck, 
  Activity, 
  ExternalLink,
  Users,
  Radio,
  Clock,
  Sparkles,
  CreditCard,
  Cookie
} from 'lucide-react';
import { AdminLiveChatDashboard } from '../components/admin/AdminLiveChatDashboard';
import { useAuth } from '../context/AuthContext';

export const AdminChatDashboard: React.FC = () => {
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
              <MessageSquare size={14} /> Live Customer Support Chat
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/admindashboard/payment-gateway-billing"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 text-gray-600 hover:text-brand-navy text-xs font-semibold rounded-sm hover:bg-gray-50 transition-colors"
            >
              <CreditCard size={13} /> Billing & Invoices
            </Link>

            <Link
              to="/admindashboard/cookie-dashboard"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 text-gray-600 hover:text-brand-navy text-xs font-semibold rounded-sm hover:bg-gray-50 transition-colors"
            >
              <Cookie size={13} /> Cookie & Telemetry
            </Link>
          </div>
        </div>

        {/* Page Hero Header */}
        <div className="bg-brand-navy rounded-sm p-8 text-white relative overflow-hidden shadow-lg border-l-4 border-brand-action">
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-action/20 border border-brand-action/40 text-brand-action text-[11px] font-mono font-bold uppercase tracking-wider mb-4">
              <Radio size={12} className="animate-pulse" /> Live Customer Interaction & Helpdesk
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight mb-2">
              Customer Live Chat & Helpdesk Console
            </h1>
            <p className="text-gray-300 text-xs md:text-sm leading-relaxed font-serif">
              Monitor incoming scholarly visitor chats in real-time, reply directly as editorial staff, manage waiting queues, and utilize AI copilot assistance to resolve author and institutional inquiries.
            </p>
          </div>

          {/* Decorative background vectors */}
          <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 flex items-center justify-center pointer-events-none">
            <MessageSquare size={260} />
          </div>
        </div>

        {/* Live Chat Dashboard Component */}
        <AdminLiveChatDashboard />

      </div>
    </div>
  );
};
