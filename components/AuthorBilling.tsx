import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Receipt, 
  DollarSign, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  X, 
  Download, 
  Printer, 
  ShieldCheck, 
  Lock, 
  Building, 
  Coins, 
  Search, 
  ArrowRight, 
  FileText, 
  ExternalLink,
  Copy,
  Check,
  Zap,
  HelpCircle
} from 'lucide-react';
import { Article, Invoice, PaymentGatewayConfig, PaymentGatewayType, User } from '../types';
import { MockService } from '../services/mockDb';

interface AuthorBillingProps {
  user: User;
  submissions: Article[];
  invoices: Invoice[];
  onRefreshData: () => void;
  activePaymentArticleId?: string | null;
  onClearActivePaymentArticleId?: () => void;
}

export const AuthorBilling: React.FC<AuthorBillingProps> = ({
  user,
  submissions,
  invoices,
  onRefreshData,
  activePaymentArticleId,
  onClearActivePaymentArticleId
}) => {
  const [gateways, setGateways] = useState<PaymentGatewayConfig[]>([]);
  const [loadingGateways, setLoadingGateways] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'paid' | 'overdue'>('all');

  // Checkout Modal State
  const [checkoutInvoice, setCheckoutInvoice] = useState<Invoice | null>(null);
  const [selectedGatewayId, setSelectedGatewayId] = useState<string>('stripe');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccessRef, setPaymentSuccessRef] = useState<string | null>(null);

  // Receipt Modal State
  const [viewingReceiptInvoice, setViewingReceiptInvoice] = useState<Invoice | null>(null);

  // Form Inputs for Payment
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [txHash, setTxHash] = useState('');
  const [bankRef, setBankRef] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    loadGateways();
  }, []);

  // Handle opening checkout if activePaymentArticleId was passed from parent
  useEffect(() => {
    if (activePaymentArticleId) {
      const matchedInvoice = invoices.find(inv => inv.articleId === activePaymentArticleId || inv.id === activePaymentArticleId);
      if (matchedInvoice) {
        openCheckoutModal(matchedInvoice);
      } else {
        // Find article and create transient invoice for payment
        const targetArticle = submissions.find(s => s.id === activePaymentArticleId);
        if (targetArticle) {
          const tempInvoice: Invoice = {
            id: `inv-temp-${targetArticle.id}`,
            invoiceNumber: `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
            authorName: user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Author',
            authorEmail: user.email,
            institution: user.affiliation || 'Academic Institution',
            articleId: targetArticle.id,
            articleTitle: targetArticle.title,
            journalTitle: targetArticle.journalId || 'International Academic Journal',
            feeType: 'Article Processing Charge (APC)',
            amount: 850,
            currency: 'USD',
            issueDate: new Date().toISOString().split('T')[0],
            dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
            status: 'Pending',
            remindersSentCount: 0
          };
          openCheckoutModal(tempInvoice);
        }
      }
      if (onClearActivePaymentArticleId) onClearActivePaymentArticleId();
    }
  }, [activePaymentArticleId, invoices, submissions]);

  const loadGateways = async () => {
    setLoadingGateways(true);
    try {
      const list = await MockService.getPaymentGateways();
      setGateways(list.filter(g => g.enabled));
      if (list.length > 0) {
        const firstEnabled = list.find(g => g.enabled);
        if (firstEnabled) setSelectedGatewayId(firstEnabled.id);
      }
    } catch (e) {
      console.error('Failed to load payment gateways:', e);
    } finally {
      setLoadingGateways(false);
    }
  };

  const openCheckoutModal = (invoice: Invoice) => {
    setCheckoutInvoice(invoice);
    setPaymentSuccessRef(null);
    setCardName(user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim());
    setCardNumber('');
    setCardExpiry('');
    setCardCvc('');
    setTxHash('');
    setBankRef('');
  };

  // Accepted submissions that need payment
  const acceptedArticlesNeedingPayment = submissions.filter(
    s => s.status === 'Accepted'
  );

  // Author specific invoices
  const userInvoices = invoices.filter(
    inv => inv.authorEmail?.toLowerCase() === user.email.toLowerCase() ||
           submissions.some(s => s.id === inv.articleId || s.title === inv.articleTitle)
  );

  // Filtered invoices list
  const filteredInvoices = userInvoices.filter(inv => {
    const matchesSearch = 
      inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (inv.articleTitle && inv.articleTitle.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (inv.journalTitle && inv.journalTitle.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!matchesSearch) return false;

    if (statusFilter === 'pending') return inv.status === 'Pending';
    if (statusFilter === 'paid') return inv.status === 'Paid';
    if (statusFilter === 'overdue') return inv.status === 'Overdue';
    return true;
  });

  const handleProcessPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkoutInvoice) return;

    setIsProcessing(true);
    const generatedTxRef = `TXN-2026-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

    try {
      // Simulate gateway authorization latency
      await new Promise(resolve => setTimeout(resolve, 1500));

      // 1. If invoice is temporary or real, update database
      if (checkoutInvoice.id.startsWith('inv-temp-')) {
        const createdInv = await MockService.createInvoice({
          authorName: checkoutInvoice.authorName,
          authorEmail: checkoutInvoice.authorEmail,
          institution: checkoutInvoice.institution,
          articleId: checkoutInvoice.articleId,
          articleTitle: checkoutInvoice.articleTitle,
          journalTitle: checkoutInvoice.journalTitle,
          feeType: checkoutInvoice.feeType,
          amount: checkoutInvoice.amount,
          currency: checkoutInvoice.currency,
          issueDate: checkoutInvoice.issueDate,
          dueDate: checkoutInvoice.dueDate
        });

        await MockService.updateInvoiceStatus(
          createdInv.id, 
          'Paid', 
          selectedGatewayId as PaymentGatewayType, 
          generatedTxRef
        );
      } else {
        await MockService.updateInvoiceStatus(
          checkoutInvoice.id, 
          'Paid', 
          selectedGatewayId as PaymentGatewayType, 
          generatedTxRef
        );
      }

      // 2. Update Article Status to 'Paid'
      if (checkoutInvoice.articleId) {
        const targetArticle = submissions.find(s => s.id === checkoutInvoice.articleId);
        if (targetArticle) {
          await MockService.updateArticle({
            ...targetArticle,
            status: 'Paid'
          });
        }
      }

      setPaymentSuccessRef(generatedTxRef);
      onRefreshData();
    } catch (err) {
      console.error('Payment processing failed:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopyText = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(fieldId);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const renderGatewayIcon = (id: string, iconName?: string) => {
    const key = id || iconName || '';
    switch (key) {
      case 'stripe':
        return <div className="w-8 h-8 rounded bg-indigo-600 text-white font-black text-xs flex items-center justify-center">S</div>;
      case 'paypal':
        return <div className="w-8 h-8 rounded bg-blue-600 text-white font-bold italic text-xs flex items-center justify-center">P</div>;
      case 'paystack':
        return <div className="w-8 h-8 rounded bg-cyan-600 text-white font-black text-[10px] flex items-center justify-center">PST</div>;
      case 'flutterwave':
        return <div className="w-8 h-8 rounded bg-amber-500 text-white font-black text-[10px] flex items-center justify-center">FLW</div>;
      case 'crypto':
        return <div className="w-8 h-8 rounded bg-purple-700 text-white flex items-center justify-center"><Coins size={16} /></div>;
      case 'bank_transfer':
        return <div className="w-8 h-8 rounded bg-slate-800 text-white flex items-center justify-center"><Building size={16} /></div>;
      case 'razorpay':
        return <div className="w-8 h-8 rounded bg-blue-700 text-white font-black text-[10px] flex items-center justify-center">RZP</div>;
      case 'square':
        return <div className="w-8 h-8 rounded bg-slate-900 text-white font-black text-[10px] flex items-center justify-center">SQ</div>;
      default:
        return <div className="w-8 h-8 rounded bg-brand-navy text-white font-bold text-[10px] flex items-center justify-center uppercase">{key.substring(0, 3)}</div>;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-brand-navy via-slate-900 to-brand-navy p-8 rounded-md text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-white/10">
        <div>
          <div className="flex items-center gap-2 text-brand-action mb-2">
            <Receipt size={20} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Author Financial Terminal</span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-white mb-2">Billing, APC & Invoices</h2>
          <p className="text-xs text-white/70 max-w-2xl leading-relaxed">
            Manage Article Processing Charges (APC), fast-track peer review fees, and open-access licensing. Pay online securely using major credit cards, PayPal, bank wire, or crypto.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-5 py-3.5 rounded-md border border-white/10">
          <ShieldCheck size={32} className="text-emerald-400" />
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-white/60">Checkout Security</div>
            <div className="text-xs font-mono font-bold text-emerald-300">PCI-DSS 256-bit Encrypted</div>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-md border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Accepted & Unpaid APC</div>
            <div className="text-2xl font-serif font-bold text-brand-navy">
              {acceptedArticlesNeedingPayment.length} <span className="text-xs font-sans text-slate-400 font-normal">Manuscript(s)</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
            <AlertTriangle size={20} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-md border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Total Pending Invoices</div>
            <div className="text-2xl font-serif font-bold text-amber-600">
              ${userInvoices.filter(i => i.status === 'Pending' || i.status === 'Overdue').reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()} <span className="text-xs font-sans text-slate-400 font-normal">USD</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock size={20} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-md border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Paid & Settled APCs</div>
            <div className="text-2xl font-serif font-bold text-emerald-600">
              ${userInvoices.filter(i => i.status === 'Paid').reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()} <span className="text-xs font-sans text-slate-400 font-normal">USD</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 size={20} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-md border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Active Gateways</div>
            <div className="text-2xl font-serif font-bold text-brand-navy">
              {gateways.length} <span className="text-xs font-sans text-slate-400 font-normal">Channels</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <CreditCard size={20} />
          </div>
        </div>
      </div>

      {/* ACCEPTED MANUSCRIPTS REQUIRING PAYMENT CALLOUT */}
      {acceptedArticlesNeedingPayment.length > 0 && (
        <div className="bg-amber-50/80 border-2 border-amber-300 rounded-md p-6 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-amber-200/60 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold shadow-sm">
                <AlertTriangle size={20} />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-amber-950">Action Required: Accepted Article APC Payment</h3>
                <p className="text-xs text-amber-800">
                  Congratulations! Your manuscript has passed peer review and was accepted. Complete payment to initiate DOI registration and final typesetting.
                </p>
              </div>
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest bg-amber-200 text-amber-900 px-2.5 py-1 rounded">
              {acceptedArticlesNeedingPayment.length} Action Needed
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {acceptedArticlesNeedingPayment.map(article => {
              const matchedInvoice = userInvoices.find(i => i.articleId === article.id || i.articleTitle === article.title);
              const apcAmount = matchedInvoice ? matchedInvoice.amount : 850;
              const currency = matchedInvoice ? matchedInvoice.currency : 'USD';

              return (
                <div key={article.id} className="bg-white rounded p-5 border border-amber-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-amber-400 transition-colors">
                  <div className="space-y-1 max-w-2xl">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-black uppercase tracking-widest bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                        Accepted for Publication
                      </span>
                      <span className="text-xs font-mono text-slate-400">AP-2026-{article.id.toUpperCase()}</span>
                    </div>
                    <h4 className="font-serif font-bold text-base text-brand-navy leading-snug">
                      {article.title}
                    </h4>
                    <p className="text-xs text-slate-500">
                      Target Journal: <strong className="text-brand-navy">{article.journalId || 'International Journal of Academic Research'}</strong>
                    </p>
                  </div>

                  <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-slate-100 pt-3 md:pt-0 md:pl-6">
                    <div className="text-right">
                      <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">APC Publication Fee</div>
                      <div className="text-xl font-bold text-brand-navy font-mono">${apcAmount} {currency}</div>
                    </div>

                    <button
                      onClick={() => {
                        if (matchedInvoice) {
                          openCheckoutModal(matchedInvoice);
                        } else {
                          // Create temporary invoice on the fly
                          openCheckoutModal({
                            id: `inv-temp-${article.id}`,
                            invoiceNumber: `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
                            authorName: user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Author',
                            authorEmail: user.email,
                            institution: user.affiliation || 'Academic Institution',
                            articleId: article.id,
                            articleTitle: article.title,
                            journalTitle: article.journalId || 'International Academic Journal',
                            feeType: 'Article Processing Charge (APC)',
                            amount: apcAmount,
                            currency: currency,
                            issueDate: new Date().toISOString().split('T')[0],
                            dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
                            status: 'Pending',
                            remindersSentCount: 0
                          });
                        }
                      }}
                      className="px-6 py-3 bg-brand-action hover:bg-brand-action/90 text-white text-xs font-black uppercase tracking-widest rounded-sm transition-all shadow-md flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap"
                    >
                      <CreditCard size={16} /> Pay APC Fee Now
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* INVOICES LIST SECTION */}
      <div className="bg-white rounded-md border border-slate-100 shadow-sm overflow-hidden space-y-4 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-lg font-serif font-bold text-brand-navy">Invoice Ledger & Payment Receipts</h3>
            <p className="text-xs text-slate-500">
              Complete invoice records and downloadable payment receipts for your submitted manuscripts.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input
                type="text"
                placeholder="Search invoice # or article..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-sm outline-none focus:border-brand-action w-48 md:w-64"
              />
            </div>

            {/* Filter */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-sm">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1 text-[10px] font-bold rounded-sm uppercase tracking-wider ${
                  statusFilter === 'all' ? 'bg-white text-brand-navy shadow-sm' : 'text-slate-500 hover:text-brand-navy'
                }`}
              >
                All ({userInvoices.length})
              </button>
              <button
                onClick={() => setStatusFilter('pending')}
                className={`px-3 py-1 text-[10px] font-bold rounded-sm uppercase tracking-wider ${
                  statusFilter === 'pending' ? 'bg-amber-500 text-white shadow-sm' : 'text-slate-500 hover:text-brand-navy'
                }`}
              >
                Unpaid ({userInvoices.filter(i => i.status === 'Pending').length})
              </button>
              <button
                onClick={() => setStatusFilter('paid')}
                className={`px-3 py-1 text-[10px] font-bold rounded-sm uppercase tracking-wider ${
                  statusFilter === 'paid' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-500 hover:text-brand-navy'
                }`}
              >
                Paid ({userInvoices.filter(i => i.status === 'Paid').length})
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400">Invoice Number</th>
                <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400">Manuscript / Fee Type</th>
                <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Due Date</th>
                <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Amount</th>
                <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Status</th>
                <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredInvoices.length > 0 ? (
                filteredInvoices.map(inv => (
                  <tr key={inv.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-4 font-mono text-xs font-bold text-brand-navy">
                      {inv.invoiceNumber}
                    </td>

                    <td className="px-4 py-4">
                      <div className="max-w-md">
                        <div className="text-xs font-bold text-brand-navy line-clamp-1 mb-0.5">
                          {inv.articleTitle || 'Article Processing Charge (APC)'}
                        </div>
                        <div className="text-[10px] text-slate-400 flex items-center gap-2">
                          <span>{inv.feeType}</span>
                          <span>•</span>
                          <span>{inv.journalTitle}</span>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4 text-center font-mono text-xs text-slate-500">
                      {inv.dueDate}
                    </td>

                    <td className="px-4 py-4 text-right font-mono text-sm font-bold text-brand-navy">
                      ${inv.amount.toLocaleString()} {inv.currency}
                    </td>

                    <td className="px-4 py-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                        inv.status === 'Paid' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : inv.status === 'Overdue'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {inv.status === 'Paid' && <CheckCircle2 size={12} />}
                        {inv.status === 'Pending' && <Clock size={12} />}
                        {inv.status === 'Overdue' && <AlertTriangle size={12} />}
                        {inv.status}
                      </span>
                    </td>

                    <td className="px-4 py-4 text-right">
                      {inv.status === 'Paid' ? (
                        <button
                          onClick={() => setViewingReceiptInvoice(inv)}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-brand-navy hover:text-white text-slate-700 text-xs font-bold rounded transition-colors inline-flex items-center gap-1.5"
                        >
                          <Receipt size={14} /> View Receipt
                        </button>
                      ) : (
                        <button
                          onClick={() => openCheckoutModal(inv)}
                          className="px-4 py-1.5 bg-brand-action hover:bg-brand-action/90 text-white text-xs font-bold rounded transition-colors inline-flex items-center gap-1.5 shadow-sm"
                        >
                          <CreditCard size={14} /> Pay Invoice
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-xs text-slate-400 font-mono">
                    No billing records or invoices found matching your filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CHECKOUT PAYMENT MODAL */}
      {checkoutInvoice && (
        <div className="fixed inset-0 z-[250] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-md shadow-2xl max-w-2xl w-full border border-slate-100 overflow-hidden relative my-8">
            {/* Modal Header */}
            <div className="bg-brand-navy p-6 text-white flex items-center justify-between border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded bg-brand-action/20 text-brand-action flex items-center justify-center border border-brand-action/30">
                  <CreditCard size={20} />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-white">Academic Checkout & APC Settlement</h3>
                  <p className="text-[10px] text-white/50 uppercase tracking-widest font-mono">
                    Invoice #{checkoutInvoice.invoiceNumber}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setCheckoutInvoice(null)}
                className="text-white/40 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {paymentSuccessRef ? (
              /* SUCCESS VIEW */
              <div className="p-8 text-center space-y-6">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner animate-bounce">
                  <CheckCircle2 size={36} />
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-serif font-bold text-brand-navy">Payment Successfully Received!</h3>
                  <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                    Your Article Processing Charge (APC) of <strong className="text-brand-navy">${checkoutInvoice.amount} {checkoutInvoice.currency}</strong> has been processed. Your manuscript status is updated to <strong>Paid & Processing for Publication</strong>.
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded p-4 max-w-md mx-auto font-mono text-xs text-left space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Transaction Ref:</span>
                    <span className="font-bold text-brand-navy">{paymentSuccessRef}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Invoice Number:</span>
                    <span className="font-bold text-slate-700">{checkoutInvoice.invoiceNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Payment Channel:</span>
                    <span className="font-bold text-slate-700 uppercase">{selectedGatewayId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Settled Amount:</span>
                    <span className="font-bold text-emerald-700">${checkoutInvoice.amount} {checkoutInvoice.currency}</span>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-center gap-3">
                  <button
                    onClick={() => {
                      setViewingReceiptInvoice({
                        ...checkoutInvoice,
                        status: 'Paid',
                        paymentGatewayUsed: selectedGatewayId as PaymentGatewayType,
                        transactionReference: paymentSuccessRef,
                        paidAt: new Date().toISOString().split('T')[0]
                      });
                      setCheckoutInvoice(null);
                    }}
                    className="px-6 py-2.5 bg-brand-navy text-white text-xs font-bold uppercase tracking-widest rounded transition-all shadow flex items-center gap-2"
                  >
                    <Receipt size={16} /> View Official Receipt
                  </button>

                  <button
                    onClick={() => setCheckoutInvoice(null)}
                    className="px-6 py-2.5 bg-slate-200 text-slate-800 text-xs font-bold uppercase tracking-widest rounded hover:bg-slate-300 transition-all"
                  >
                    Close Terminal
                  </button>
                </div>
              </div>
            ) : (
              /* CHECKOUT FORM VIEW */
              <form onSubmit={handleProcessPayment} className="p-6 space-y-6">
                {/* Invoice Summary Box */}
                <div className="bg-slate-50 p-4 rounded border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Item Summary</div>
                    <h4 className="text-xs font-bold text-brand-navy line-clamp-1">{checkoutInvoice.articleTitle || checkoutInvoice.feeType}</h4>
                    <p className="text-[10px] text-slate-500">{checkoutInvoice.journalTitle}</p>
                  </div>

                  <div className="text-right border-t sm:border-t-0 sm:border-l border-slate-200 pt-2 sm:pt-0 sm:pl-4">
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Due</div>
                    <div className="text-xl font-bold font-mono text-brand-navy">${checkoutInvoice.amount} {checkoutInvoice.currency}</div>
                  </div>
                </div>

                {/* Gateway Selector */}
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-700 mb-2">
                    Select Payment Gateway Method
                  </label>

                  {loadingGateways ? (
                    <div className="py-4 text-center text-xs font-mono text-slate-400">Loading payment gateways...</div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {gateways.map(gw => (
                        <button
                          key={gw.id}
                          type="button"
                          onClick={() => setSelectedGatewayId(gw.id)}
                          className={`p-3 rounded border text-left flex items-center gap-3 transition-all ${
                            selectedGatewayId === gw.id
                              ? 'border-brand-action bg-brand-action/5 ring-1 ring-brand-action shadow-sm'
                              : 'border-slate-200 hover:border-slate-300 bg-white'
                          }`}
                        >
                          {renderGatewayIcon(gw.id, gw.iconName)}
                          <div className="overflow-hidden">
                            <div className="text-xs font-bold text-brand-navy truncate">{gw.name}</div>
                            <div className="text-[9px] text-slate-400 font-mono uppercase">{gw.mode}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* GATEWAY-SPECIFIC INPUTS */}
                <div className="bg-slate-50/70 p-4 rounded border border-slate-200 space-y-4">
                  {/* CARD PAYMENT (Stripe, Paystack, Flutterwave, Razorpay, Square, etc.) */}
                  {['stripe', 'paystack', 'flutterwave', 'razorpay', 'square', 'authorizenet'].includes(selectedGatewayId) && (
                    <div className="space-y-3">
                      <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
                        <Lock size={12} className="text-emerald-600" /> Credit / Debit Card Details
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-700 mb-1">Cardholder Full Name</label>
                        <input
                          type="text"
                          required
                          value={cardName}
                          onChange={e => setCardName(e.target.value)}
                          placeholder="e.g. Dr. Jane Smith"
                          className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs outline-none focus:border-brand-action bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-700 mb-1">Card Number</label>
                        <input
                          type="text"
                          required
                          value={cardNumber}
                          onChange={e => setCardNumber(e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19))}
                          placeholder="4532 •••• •••• 8892"
                          className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs font-mono outline-none focus:border-brand-action bg-white"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-700 mb-1">Expiry Date</label>
                          <input
                            type="text"
                            required
                            value={cardExpiry}
                            onChange={e => setCardExpiry(e.target.value.replace(/\D/g, '').replace(/^(\d{2})/, '$1/').slice(0, 5))}
                            placeholder="MM/YY"
                            className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs font-mono outline-none focus:border-brand-action bg-white text-center"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-700 mb-1">Security Code (CVC)</label>
                          <input
                            type="password"
                            required
                            maxLength={4}
                            value={cardCvc}
                            onChange={e => setCardCvc(e.target.value.replace(/\D/g, ''))}
                            placeholder="•••"
                            className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs font-mono outline-none focus:border-brand-action bg-white text-center"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* PAYPAL */}
                  {selectedGatewayId === 'paypal' && (
                    <div className="text-center py-4 space-y-3">
                      <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center mx-auto font-bold italic text-xl">
                        P
                      </div>
                      <p className="text-xs text-slate-600 max-w-xs mx-auto">
                        You will be redirected to PayPal One-Touch Express Checkout to complete your payment of <strong>${checkoutInvoice.amount} {checkoutInvoice.currency}</strong> safely.
                      </p>
                    </div>
                  )}

                  {/* CRYPTO */}
                  {selectedGatewayId === 'crypto' && (
                    <div className="space-y-3">
                      <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
                        <Coins size={14} className="text-purple-600" /> Cryptocurrency Wallet Transfer
                      </div>

                      <div className="bg-white p-3 rounded border border-slate-200 text-xs space-y-2">
                        <div className="text-[10px] font-bold text-slate-400">USDT (TRC-20) / BTC Receiver Wallet</div>
                        <div className="font-mono text-brand-navy font-bold text-[11px] bg-slate-50 p-2 rounded flex items-center justify-between border border-slate-100">
                          <span>0x71C7656d091238716253901283</span>
                          <button
                            type="button"
                            onClick={() => handleCopyText('0x71C7656d091238716253901283', 'crypto')}
                            className="text-brand-action hover:underline text-[10px] font-sans font-bold flex items-center gap-1"
                          >
                            {copiedCode === 'crypto' ? <Check size={12} /> : <Copy size={12} />} Copy
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-700 mb-1">Blockchain Transaction Hash (TxHash)</label>
                        <input
                          type="text"
                          required
                          value={txHash}
                          onChange={e => setTxHash(e.target.value)}
                          placeholder="Paste blockchain transaction hash..."
                          className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs font-mono outline-none focus:border-brand-action bg-white"
                        />
                      </div>
                    </div>
                  )}

                  {/* BANK TRANSFER */}
                  {selectedGatewayId === 'bank_transfer' && (
                    <div className="space-y-3">
                      <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
                        <Building size={14} className="text-slate-800" /> Direct Wire / Bank Transfer
                      </div>

                      <div className="bg-white p-3 rounded border border-slate-200 text-xs space-y-1 font-mono">
                        <div><strong>Bank Name:</strong> First International Academic Bank</div>
                        <div><strong>Account Name:</strong> Academic Publishing Group Org</div>
                        <div><strong>Account / IBAN:</strong> US98 1029 3847 5610 2938</div>
                        <div><strong>SWIFT/BIC:</strong> FIABUS33XXX</div>
                        <div className="text-brand-action font-bold pt-1">
                          Transfer Memo Reference: {checkoutInvoice.invoiceNumber}
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-700 mb-1">Bank Wire Reference / Remittance Code</label>
                        <input
                          type="text"
                          required
                          value={bankRef}
                          onChange={e => setBankRef(e.target.value)}
                          placeholder="Enter bank transfer reference or wire number..."
                          className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs font-mono outline-none focus:border-brand-action bg-white"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Submit Action */}
                <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                    <ShieldCheck size={14} className="text-emerald-600" /> 256-Bit TLS Direct Encryption
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setCheckoutInvoice(null)}
                      className="px-4 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="px-6 py-2.5 bg-brand-action hover:bg-brand-action/90 text-white text-xs font-black uppercase tracking-widest rounded transition-all shadow-md flex items-center gap-2 disabled:opacity-50"
                    >
                      {isProcessing ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Processing Payment...
                        </>
                      ) : (
                        <>
                          <Lock size={14} /> Confirm & Pay ${checkoutInvoice.amount} {checkoutInvoice.currency}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* RECEIPT VIEW MODAL */}
      {viewingReceiptInvoice && (
        <div className="fixed inset-0 z-[260] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-md shadow-2xl max-w-xl w-full border border-slate-200 overflow-hidden relative my-8">
            <div className="bg-brand-navy p-6 text-white flex items-center justify-between border-b border-white/10">
              <div className="flex items-center gap-2">
                <Receipt size={20} className="text-emerald-400" />
                <div>
                  <h3 className="font-serif font-bold text-lg text-white">Official APC Payment Receipt</h3>
                  <p className="text-[10px] text-white/50 uppercase tracking-widest font-mono">
                    Receipt #{viewingReceiptInvoice.invoiceNumber}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setViewingReceiptInvoice(null)}
                className="text-white/40 hover:text-white p-2 rounded-full hover:bg-white/10"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-8 space-y-6 text-slate-800">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <div className="font-serif font-bold text-xl text-brand-navy">Academic Publishing Group</div>
                  <div className="text-xs text-slate-500">Global Open Access Repository</div>
                </div>
                <div className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded text-xs font-black uppercase tracking-widest flex items-center gap-1">
                  <CheckCircle2 size={14} /> PAID IN FULL
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Billed Author</span>
                  <strong className="text-slate-800">{viewingReceiptInvoice.authorName}</strong>
                  <div className="text-slate-500">{viewingReceiptInvoice.authorEmail}</div>
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Payment Date</span>
                  <strong className="text-slate-800">{viewingReceiptInvoice.paidAt || viewingReceiptInvoice.issueDate}</strong>
                  <div className="text-slate-500">Gateway: {viewingReceiptInvoice.paymentGatewayUsed?.toUpperCase() || 'STRIPE'}</div>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded border border-slate-200 text-xs space-y-2">
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Manuscript Information</div>
                <div className="font-bold text-brand-navy leading-snug">{viewingReceiptInvoice.articleTitle}</div>
                <div className="text-slate-500 text-[11px]">{viewingReceiptInvoice.journalTitle}</div>
                <div className="text-slate-400 text-[10px] font-mono">Fee Type: {viewingReceiptInvoice.feeType}</div>
              </div>

              <div className="flex justify-between items-center text-sm font-bold border-t border-slate-200 pt-4">
                <span>Total Settled Amount:</span>
                <span className="text-xl font-mono text-emerald-700">${viewingReceiptInvoice.amount} {viewingReceiptInvoice.currency}</span>
              </div>

              {viewingReceiptInvoice.transactionReference && (
                <div className="text-[10px] font-mono text-slate-400 bg-slate-100 p-2 rounded text-center">
                  Transaction Reference: {viewingReceiptInvoice.transactionReference}
                </div>
              )}

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded flex items-center gap-2"
                >
                  <Printer size={14} /> Print Receipt
                </button>
                <button
                  onClick={() => setViewingReceiptInvoice(null)}
                  className="px-6 py-2 bg-brand-navy text-white text-xs font-bold rounded hover:bg-brand-navy/90"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
