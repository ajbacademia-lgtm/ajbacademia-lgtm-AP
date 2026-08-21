import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  CreditCard, 
  Receipt, 
  ChevronRight, 
  ShieldCheck, 
  ArrowLeft
} from 'lucide-react';
import { PaymentGatewaysManager } from '../components/admin/PaymentGatewaysManager';
import { BillingInvoicesManager } from '../components/admin/BillingInvoicesManager';

export const PaymentGatewayBillingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'gateways' | 'invoices'>('gateways');

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Top Banner Header */}
      <div className="bg-brand-navy text-white pt-10 pb-16 border-b border-brand-action/20">
        <div className="container mx-auto px-6">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs text-slate-300 mb-6 font-mono">
            <Link to="/admindashboard" className="hover:text-brand-action flex items-center gap-1 transition-colors">
              <ArrowLeft size={14} /> Admin Console
            </Link>
            <ChevronRight size={12} className="text-slate-500" />
            <span className="text-white font-semibold">Payment Gateway & Billing</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 text-amber-300 rounded-full text-[10px] font-black uppercase tracking-widest mb-3 border border-amber-500/30">
                <ShieldCheck size={14} /> Financial Governance & Credentials Vault
              </div>
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-white tracking-tight">
                Payment Gateway & Billing Management
              </h1>
              <p className="text-xs md:text-sm text-slate-300 max-w-3xl mt-2 leading-relaxed">
                Configure global multi-currency payment providers, store encrypted merchant credentials, manage Article Processing Charge (APC) tax invoices, and issue automated payment reminders.
              </p>
            </div>

            {/* Quick Action Badges */}
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-4 rounded-md border border-white/10">
              <div className="text-center px-3 border-r border-white/10">
                <div className="text-[10px] uppercase tracking-wider text-slate-300 font-bold">Active Providers</div>
                <div className="text-xl font-serif font-bold text-amber-400">6 Gateways</div>
              </div>
              <div className="text-center px-3">
                <div className="text-[10px] uppercase tracking-wider text-slate-300 font-bold">Settlement Mode</div>
                <div className="text-xl font-serif font-bold text-emerald-400">Production</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto px-6 -mt-8">
        {/* Navigation Tabs */}
        <div className="bg-white rounded-md shadow-lg border border-gray-200 p-2 flex flex-col sm:flex-row items-center gap-2 mb-8">
          <button
            onClick={() => setActiveTab('gateways')}
            className={`flex-1 w-full sm:w-auto px-6 py-3.5 rounded text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${
              activeTab === 'gateways'
                ? 'bg-brand-navy text-white shadow-md'
                : 'text-slate-600 hover:bg-gray-100'
            }`}
          >
            <CreditCard size={18} className={activeTab === 'gateways' ? 'text-amber-400' : 'text-slate-400'} />
            Payment Gateways & API Credentials
          </button>

          <button
            onClick={() => setActiveTab('invoices')}
            className={`flex-1 w-full sm:w-auto px-6 py-3.5 rounded text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${
              activeTab === 'invoices'
                ? 'bg-brand-navy text-white shadow-md'
                : 'text-slate-600 hover:bg-gray-100'
            }`}
          >
            <Receipt size={18} className={activeTab === 'invoices' ? 'text-emerald-400' : 'text-slate-400'} />
            APC Invoices & Billing History
          </button>
        </div>

        {/* Tab Panel Display */}
        <div className="transition-all duration-300">
          {activeTab === 'gateways' ? (
            <div className="space-y-6">
              <PaymentGatewaysManager />
            </div>
          ) : (
            <div className="space-y-6">
              <BillingInvoicesManager />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
