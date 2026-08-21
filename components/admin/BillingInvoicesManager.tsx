import React, { useState, useEffect } from 'react';
import { 
  Receipt, 
  Send, 
  DollarSign, 
  Plus, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  XCircle, 
  FileText, 
  Printer, 
  Mail, 
  Building, 
  User, 
  Calendar, 
  CreditCard, 
  X, 
  RefreshCw,
  Bell
} from 'lucide-react';
import { Invoice, PaymentGatewayType, PaymentReminder } from '../../types';
import { MockService } from '../../services/mockDb';

export const BillingInvoicesManager: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [reminders, setReminders] = useState<PaymentReminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Modals
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [reminderModalInvoice, setReminderModalInvoice] = useState<Invoice | null>(null);
  const [customReminderNote, setCustomReminderNote] = useState('');
  const [reminderSuccessMsg, setReminderSuccessMsg] = useState<string | null>(null);

  // New Invoice Form
  const [newAuthorName, setNewAuthorName] = useState('');
  const [newAuthorEmail, setNewAuthorEmail] = useState('');
  const [newInstitution, setNewInstitution] = useState('');
  const [newArticleTitle, setNewArticleTitle] = useState('');
  const [newJournalTitle, setNewJournalTitle] = useState('Journal of Physical & Quantum Sciences');
  const [newFeeType, setNewFeeType] = useState<Invoice['feeType']>('Article Processing Charge (APC)');
  const [newAmount, setNewAmount] = useState<number>(1200);
  const [newCurrency, setNewCurrency] = useState<Invoice['currency']>('USD');
  const [newDueDate, setNewDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().split('T')[0];
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [invs, rems] = await Promise.all([
        MockService.getInvoices(),
        MockService.getPaymentReminders()
      ]);
      setInvoices(invs);
      setReminders(rems);
    } catch (e) {
      console.error('Failed to load billing data:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await MockService.createInvoice({
        authorName: newAuthorName,
        authorEmail: newAuthorEmail,
        institution: newInstitution,
        articleTitle: newArticleTitle,
        journalTitle: newJournalTitle,
        feeType: newFeeType,
        amount: Number(newAmount),
        currency: newCurrency,
        issueDate: new Date().toISOString().split('T')[0],
        dueDate: newDueDate
      });

      setInvoices([created, ...invoices]);
      setShowCreateModal(false);
      // Reset form
      setNewAuthorName('');
      setNewAuthorEmail('');
      setNewArticleTitle('');
    } catch (err) {
      console.error('Failed to create invoice:', err);
    }
  };

  const handleSendReminder = async () => {
    if (!reminderModalInvoice) return;
    try {
      const result = await MockService.sendPaymentReminder(reminderModalInvoice.id, customReminderNote);
      setInvoices(invoices.map(i => i.id === reminderModalInvoice.id ? result.updatedInvoice : i));
      setReminders([result.reminder, ...reminders]);
      setReminderSuccessMsg(`Payment reminder dispatched to ${reminderModalInvoice.authorEmail}`);
      setTimeout(() => {
        setReminderSuccessMsg(null);
        setReminderModalInvoice(null);
        setCustomReminderNote('');
      }, 1500);
    } catch (err) {
      console.error('Failed to send payment reminder:', err);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: Invoice['status']) => {
    try {
      const ref = newStatus === 'Paid' ? `TXN_${Date.now().toString().substring(5)}` : undefined;
      const updated = await MockService.updateInvoiceStatus(id, newStatus, undefined, ref);
      if (updated) {
        setInvoices(invoices.map(i => i.id === id ? updated : i));
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  // Metrics
  const totalRevenue = invoices.filter(i => i.status === 'Paid').reduce((acc, i) => acc + i.amount, 0);
  const pendingCount = invoices.filter(i => i.status === 'Pending').length;
  const overdueCount = invoices.filter(i => i.status === 'Overdue').length;
  const totalRemindersCount = invoices.reduce((acc, i) => acc + (i.remindersSentCount || 0), 0);

  // Filtered invoices
  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = 
      inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.authorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.authorEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (inv.articleTitle && inv.articleTitle.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || inv.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8">
      {/* Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-md border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[10px] font-black uppercase tracking-widest text-slate-600 mb-1">Total Paid Revenue</div>
            <div className="text-2xl font-serif font-bold text-emerald-600">${totalRevenue.toLocaleString()}</div>
            <div className="text-[10px] text-slate-600 mt-0.5">Verified Collections</div>
          </div>
          <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center font-bold">
            <DollarSign size={22} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-md border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[10px] font-black uppercase tracking-widest text-slate-600 mb-1">Pending Invoices</div>
            <div className="text-2xl font-serif font-bold text-brand-navy">{pendingCount}</div>
            <div className="text-[10px] text-brand-action font-semibold mt-0.5">Awaiting Payment</div>
          </div>
          <div className="w-10 h-10 bg-blue-50 text-brand-navy rounded-full flex items-center justify-center font-bold">
            <Clock size={22} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-md border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[10px] font-black uppercase tracking-widest text-slate-600 mb-1">Overdue Accounts</div>
            <div className="text-2xl font-serif font-bold text-rose-600">{overdueCount}</div>
            <div className="text-[10px] text-rose-500 mt-0.5">Requires Reminder Action</div>
          </div>
          <div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center font-bold">
            <AlertTriangle size={22} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-md border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[10px] font-black uppercase tracking-widest text-slate-600 mb-1">Payment Reminders Sent</div>
            <div className="text-2xl font-serif font-bold text-purple-700">{totalRemindersCount}</div>
            <div className="text-[10px] text-slate-600 mt-0.5">Automated & Manual Notices</div>
          </div>
          <div className="w-10 h-10 bg-purple-50 text-purple-700 rounded-full flex items-center justify-center font-bold">
            <Bell size={22} />
          </div>
        </div>
      </div>

      {/* Main Billing Card */}
      <div className="bg-white rounded-md border border-gray-200 shadow-xl overflow-hidden">
        {/* Controls Toolbar */}
        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50/50">
          <div>
            <h3 className="font-serif font-bold text-lg text-brand-navy flex items-center gap-2">
              <Receipt className="text-brand-action" size={20} /> Article Processing Charge (APC) & Invoice Records
            </h3>
            <p className="text-xs text-slate-600">
              Manage publication fees, issue payment reminders, inspect tax invoices, and track settlement histories.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2.5 bg-brand-action text-white text-xs font-bold uppercase tracking-widest rounded-sm hover:bg-brand-navy transition-all shadow-md flex items-center gap-2"
            >
              <Plus size={16} /> Generate Invoice
            </button>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white">
          <div className="relative w-full sm:w-80">
            <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search by Invoice #, Author, Title..."
              className="w-full pl-9 pr-3 py-1.5 border border-gray-300 rounded-sm text-xs outline-none focus:border-brand-action"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter size={14} className="text-slate-600" />
            <span className="text-[10px] font-black uppercase text-slate-600">Filter Status:</span>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-sm px-2 py-1 text-xs outline-none focus:border-brand-action bg-white"
            >
              <option value="all">All Invoices</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Invoices Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-brand-navy text-white text-[10px] font-black uppercase tracking-widest">
                <th className="px-6 py-3.5">Invoice Ref</th>
                <th className="px-6 py-3.5">Billed Author</th>
                <th className="px-6 py-3.5">Fee Item & Journal</th>
                <th className="px-6 py-3.5">Amount</th>
                <th className="px-6 py-3.5">Due Date</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5">Reminders</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-400 font-mono">
                    Loading billing invoices...
                  </td>
                </tr>
              ) : filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-600">
                    No invoices matching the selected search/filter criteria.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map(inv => (
                  <tr key={inv.id} className="hover:bg-gray-50/80 transition-colors group">
                    <td className="px-6 py-4 font-mono font-bold text-brand-navy">
                      {inv.invoiceNumber}
                    </td>

                    <td className="px-6 py-4">
                      <div className="font-semibold text-brand-navy">{inv.authorName}</div>
                      <div className="text-[10px] text-gray-400">{inv.authorEmail}</div>
                      {inv.institution && (
                        <div className="text-[10px] text-brand-action font-mono">{inv.institution}</div>
                      )}
                    </td>

                    <td className="px-6 py-4 max-w-xs">
                      <div className="font-bold text-brand-navy">{inv.feeType}</div>
                      {inv.articleTitle && (
                        <div className="text-[10px] text-gray-500 truncate" title={inv.articleTitle}>
                          {inv.articleTitle}
                        </div>
                      )}
                      <div className="text-[9px] text-gray-400 uppercase tracking-widest mt-0.5">
                        {inv.journalTitle}
                      </div>
                    </td>

                    <td className="px-6 py-4 font-mono font-bold text-brand-navy text-sm">
                      {inv.currency} {inv.amount.toLocaleString()}
                    </td>

                    <td className="px-6 py-4 font-mono text-slate-600">
                      {inv.dueDate}
                    </td>

                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                        inv.status === 'Paid' ? 'bg-emerald-100 text-emerald-800' :
                        inv.status === 'Pending' ? 'bg-amber-100 text-amber-800' :
                        inv.status === 'Overdue' ? 'bg-rose-100 text-rose-800' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {inv.status}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 font-mono text-xs">
                        <Bell size={14} className={inv.remindersSentCount > 0 ? 'text-purple-600' : 'text-gray-300'} />
                        <span className="font-bold">{inv.remindersSentCount || 0}</span>
                      </div>
                      {inv.lastReminderSentAt && (
                        <div className="text-[9px] text-gray-400">Last: {inv.lastReminderSentAt}</div>
                      )}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Send Reminder Button */}
                        {inv.status !== 'Paid' && inv.status !== 'Cancelled' && (
                          <button
                            onClick={() => {
                              setReminderModalInvoice(inv);
                              setCustomReminderNote(`Regarding Invoice ${inv.invoiceNumber} for APC payment.`);
                            }}
                            className="p-1.5 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1"
                            title="Send Payment Reminder"
                          >
                            <Mail size={13} /> Reminder
                          </button>
                        )}

                        {/* Mark Paid Button */}
                        {inv.status !== 'Paid' && (
                          <button
                            onClick={() => handleUpdateStatus(inv.id, 'Paid')}
                            className="p-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1"
                            title="Mark as Paid"
                          >
                            <CheckCircle2 size={13} /> Paid
                          </button>
                        )}

                        {/* View Invoice PDF Modal */}
                        <button
                          onClick={() => setSelectedInvoice(inv)}
                          className="p-1.5 bg-gray-100 text-brand-navy hover:bg-brand-navy hover:text-white rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 transition-colors"
                          title="View Complete Invoice"
                        >
                          <FileText size={13} /> View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Reminders Schedule & Dispatch History */}
      <div className="bg-white rounded-md border border-gray-200 shadow-md p-6">
        <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-3">
          <div>
            <h4 className="font-serif font-bold text-brand-navy text-base flex items-center gap-2">
              <Bell size={18} className="text-purple-600" /> Dispatch History & Automated Reminder Audit Log
            </h4>
            <p className="text-xs text-slate-600">
              Audit log of all payment reminders and automated payment schedules sent to authors.
            </p>
          </div>
          <span className="text-xs font-mono font-bold bg-purple-50 text-purple-700 px-3 py-1 rounded">
            {reminders.length} Notices Dispatched
          </span>
        </div>

        <div className="space-y-3">
          {reminders.length === 0 ? (
            <div className="text-xs text-gray-400 py-4 text-center">No payment reminders recorded yet.</div>
          ) : (
            reminders.slice(0, 5).map(rem => (
              <div key={rem.id} className="p-3 bg-gray-50 rounded border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                    <Mail size={16} />
                  </div>
                  <div>
                    <div className="font-bold text-brand-navy">
                      Notice for Invoice #{rem.invoiceNumber} — <span className="text-purple-700">{rem.recipientName}</span> ({rem.recipientEmail})
                    </div>
                    {rem.customNote && (
                      <div className="text-[10px] text-slate-600 italic">"{rem.customNote}"</div>
                    )}
                  </div>
                </div>
                <div className="text-right font-mono text-[10px] text-gray-400">
                  {new Date(rem.sentAt).toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* CREATE INVOICE MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-[220] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-md shadow-2xl max-w-xl w-full border border-gray-100 overflow-hidden my-8">
            <div className="bg-brand-navy p-5 text-white flex items-center justify-between border-b border-white/10">
              <div className="flex items-center gap-2">
                <Receipt size={20} className="text-brand-action" />
                <h3 className="font-serif font-bold text-base">Generate Custom APC Invoice</h3>
              </div>
              <button onClick={() => setShowCreateModal(false)} className="text-white/40 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateInvoice} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-700 mb-1">
                    Author Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newAuthorName}
                    onChange={e => setNewAuthorName(e.target.value)}
                    placeholder="Dr. Sarah Jenkins"
                    className="w-full border border-gray-300 rounded-sm px-3 py-2 text-xs outline-none focus:border-brand-action"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-700 mb-1">
                    Author Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={newAuthorEmail}
                    onChange={e => setNewAuthorEmail(e.target.value)}
                    placeholder="s.jenkins@oxford.ac.uk"
                    className="w-full border border-gray-300 rounded-sm px-3 py-2 text-xs outline-none focus:border-brand-action"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-700 mb-1">
                    Institution / University
                  </label>
                  <input
                    type="text"
                    value={newInstitution}
                    onChange={e => setNewInstitution(e.target.value)}
                    placeholder="University of Oxford"
                    className="w-full border border-gray-300 rounded-sm px-3 py-2 text-xs outline-none focus:border-brand-action"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-700 mb-1">
                    Journal Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={newJournalTitle}
                    onChange={e => setNewJournalTitle(e.target.value)}
                    placeholder="Journal of Physical & Quantum Sciences"
                    className="w-full border border-gray-300 rounded-sm px-3 py-2 text-xs outline-none focus:border-brand-action"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-700 mb-1">
                  Manuscript / Article Title
                </label>
                <input
                  type="text"
                  value={newArticleTitle}
                  onChange={e => setNewArticleTitle(e.target.value)}
                  placeholder="Quantum Coherence in Light-Harvesting Complexes"
                  className="w-full border border-gray-300 rounded-sm px-3 py-2 text-xs outline-none focus:border-brand-action"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-700 mb-1">
                    Fee Type *
                  </label>
                  <select
                    value={newFeeType}
                    onChange={e => setNewFeeType(e.target.value as any)}
                    className="w-full border border-gray-300 rounded-sm px-2 py-2 text-xs outline-none focus:border-brand-action bg-white"
                  >
                    <option value="Article Processing Charge (APC)">Article Processing Charge (APC)</option>
                    <option value="Fast-Track Peer Review">Fast-Track Peer Review</option>
                    <option value="Editing/Proofreading Fee">Editing/Proofreading Fee</option>
                    <option value="Open Access License">Open Access License</option>
                    <option value="Color & Print Publication">Color & Print Publication</option>
                    <option value="Institutional Membership">Institutional Membership</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-700 mb-1">
                    Amount *
                  </label>
                  <input
                    type="number"
                    required
                    value={newAmount}
                    onChange={e => setNewAmount(Number(e.target.value))}
                    className="w-full border border-gray-300 rounded-sm px-3 py-2 text-xs font-mono outline-none focus:border-brand-action"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-700 mb-1">
                    Currency
                  </label>
                  <select
                    value={newCurrency}
                    onChange={e => setNewCurrency(e.target.value as any)}
                    className="w-full border border-gray-300 rounded-sm px-2 py-2 text-xs outline-none focus:border-brand-action bg-white font-mono"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="NGN">NGN (₦)</option>
                    <option value="GHS">GHS (GH₵)</option>
                    <option value="KES">KES (KSh)</option>
                    <option value="CAD">CAD (C$)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-700 mb-1">
                  Payment Due Date *
                </label>
                <input
                  type="date"
                  required
                  value={newDueDate}
                  onChange={e => setNewDueDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-sm px-3 py-2 text-xs font-mono outline-none focus:border-brand-action"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-xs text-slate-600 hover:bg-gray-100 rounded-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-brand-action text-white text-xs font-bold uppercase tracking-widest rounded-sm hover:bg-brand-navy transition-all shadow-md"
                >
                  Generate Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REMINDER MODAL */}
      {reminderModalInvoice && (
        <div className="fixed inset-0 z-[220] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-md shadow-2xl max-w-md w-full border border-gray-100 overflow-hidden">
            <div className="bg-purple-900 p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail size={18} className="text-purple-300" />
                <h3 className="font-serif font-bold text-sm">Send Payment Reminder</h3>
              </div>
              <button onClick={() => setReminderModalInvoice(null)} className="text-white/40 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {reminderSuccessMsg && (
                <div className="p-3 bg-emerald-50 text-emerald-800 text-xs font-bold rounded flex items-center gap-2">
                  <CheckCircle2 size={16} /> {reminderSuccessMsg}
                </div>
              )}

              <div className="text-xs text-slate-600">
                Send an official payment reminder notice for Invoice <span className="font-mono font-bold text-brand-navy">#{reminderModalInvoice.invoiceNumber}</span> to:
                <div className="font-bold text-brand-navy mt-1">{reminderModalInvoice.authorName} ({reminderModalInvoice.authorEmail})</div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-700 mb-1">
                  Custom Reminder Message / Note
                </label>
                <textarea
                  rows={3}
                  value={customReminderNote}
                  onChange={e => setCustomReminderNote(e.target.value)}
                  placeholder="Add a custom note to include in the email notification..."
                  className="w-full border border-gray-300 rounded-sm p-2 text-xs outline-none focus:border-purple-600"
                ></textarea>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-gray-100">
                <button
                  onClick={() => setReminderModalInvoice(null)}
                  className="px-4 py-2 text-xs text-slate-600 hover:bg-gray-100 rounded-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendReminder}
                  className="px-6 py-2 bg-purple-700 text-white text-xs font-bold uppercase tracking-widest rounded-sm hover:bg-purple-800 transition-all shadow-md flex items-center gap-2"
                >
                  <Send size={14} /> Send Reminder
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW OFFICIAL INVOICE PDF/PREVIEW MODAL */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-[220] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-md shadow-2xl max-w-2xl w-full border border-gray-200 overflow-hidden my-8">
            {/* Toolbar */}
            <div className="bg-slate-900 p-4 text-white flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-brand-action">
                OFFICIAL INVOICE RECORD #{selectedInvoice.invoiceNumber}
              </span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-[10px] font-bold uppercase tracking-widest rounded flex items-center gap-1.5"
                >
                  <Printer size={14} /> Print Invoice
                </button>
                <button onClick={() => setSelectedInvoice(null)} className="text-white/40 hover:text-white">
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Printable Invoice Sheet */}
            <div className="p-8 space-y-8 bg-white text-brand-navy">
              <div className="flex justify-between items-start border-b border-gray-200 pb-6">
                <div>
                  <h1 className="font-serif font-bold text-xl text-brand-navy">ACADEMIC PUBLISHING GROUP</h1>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest">Global Editorial & Financial Operations</p>
                  <p className="text-xs text-gray-400 mt-1">5 Howick Place, London, SW1P 1WG, United Kingdom</p>
                  <p className="text-xs text-gray-400">VAT Reg: GB 920 1827 36</p>
                </div>
                <div className="text-right">
                  <span className={`inline-block px-3 py-1 rounded text-xs font-bold uppercase tracking-widest ${
                    selectedInvoice.status === 'Paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {selectedInvoice.status}
                  </span>
                  <div className="text-xs font-mono font-bold text-brand-navy mt-2">{selectedInvoice.invoiceNumber}</div>
                  <div className="text-[10px] text-gray-400">Issue Date: {selectedInvoice.issueDate}</div>
                  <div className="text-[10px] text-gray-400">Due Date: {selectedInvoice.dueDate}</div>
                </div>
              </div>

              {/* Billed To */}
              <div className="grid grid-cols-2 gap-6 bg-gray-50 p-4 rounded border border-gray-100 text-xs">
                <div>
                  <div className="text-[10px] font-black uppercase text-gray-400 mb-1">Billed To (Author)</div>
                  <div className="font-bold text-brand-navy">{selectedInvoice.authorName}</div>
                  <div className="text-gray-600">{selectedInvoice.authorEmail}</div>
                  {selectedInvoice.institution && (
                    <div className="text-brand-action mt-0.5">{selectedInvoice.institution}</div>
                  )}
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase text-gray-400 mb-1">Journal & Publication Details</div>
                  <div className="font-bold text-brand-navy">{selectedInvoice.journalTitle}</div>
                  {selectedInvoice.articleTitle && (
                    <div className="text-gray-600 italic">"{selectedInvoice.articleTitle}"</div>
                  )}
                </div>
              </div>

              {/* Itemized Table */}
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b-2 border-brand-navy text-[10px] font-black uppercase tracking-widest text-brand-navy">
                    <th className="py-2">Description</th>
                    <th className="py-2 text-right">Amount ({selectedInvoice.currency})</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr>
                    <td className="py-3 font-semibold">
                      {selectedInvoice.feeType}
                    </td>
                    <td className="py-3 text-right font-mono font-bold">
                      {selectedInvoice.amount.toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="border-t border-gray-200 pt-4 flex justify-between items-center font-bold">
                <span className="text-xs uppercase tracking-widest text-brand-navy">Total Payable</span>
                <span className="text-xl font-mono text-brand-navy">
                  {selectedInvoice.currency} {selectedInvoice.amount.toLocaleString()}
                </span>
              </div>

              <div className="bg-slate-50 p-4 rounded text-[10px] text-slate-600 space-y-1">
                <div className="font-bold text-brand-navy uppercase tracking-widest">Payment Instructions:</div>
                <p>Settlement can be made via credit card, wire transfer, or PayPal on the Academic Publishing author console. Mention Invoice Reference <span className="font-mono font-bold">{selectedInvoice.invoiceNumber}</span> on all transfer memos.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
