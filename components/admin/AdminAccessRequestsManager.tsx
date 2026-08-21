import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  UserCheck, 
  UserX, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Filter, 
  Search, 
  Eye, 
  Building, 
  Mail, 
  FileText, 
  X,
  Send,
  AlertCircle
} from 'lucide-react';
import { AdminAccessRequest } from '../../types';
import { MockService } from '../../services/mockDb';

export const AdminAccessRequestsManager: React.FC = () => {
  const [requests, setRequests] = useState<AdminAccessRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<AdminAccessRequest | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const data = await MockService.getAdminAccessRequests();
      setRequests(data);
    } catch (e) {
      console.error('Failed to load access requests:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: 'approved' | 'rejected') => {
    setProcessingId(id);
    try {
      const updated = await MockService.updateAdminAccessRequestStatus(id, status, adminNotes, 'System Admin');
      if (updated) {
        setRequests(requests.map(r => r.id === id ? updated : r));
        setSelectedRequest(null);
        setAdminNotes('');
      }
    } catch (err) {
      console.error('Failed to update access request:', err);
    } finally {
      setProcessingId(null);
    }
  };

  const pendingCount = requests.filter(r => r.status === 'pending').length;
  const approvedCount = requests.filter(r => r.status === 'approved').length;
  const rejectedCount = requests.filter(r => r.status === 'rejected').length;

  const filteredRequests = requests.filter(req => {
    const matchesSearch = 
      req.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.institution.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || req.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-brand-navy to-slate-900 p-8 rounded-md text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-white/10">
        <div>
          <div className="flex items-center gap-2 text-purple-300 mb-2">
            <ShieldCheck size={20} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Platform Governance</span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-white mb-2">Admin & Editorial Access Requests</h2>
          <p className="text-xs text-white/70 max-w-2xl leading-relaxed">
            Review credentials, institutional affiliations, and scope of work for scholars applying for section editor, managing editor, or administrative console privileges.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-md border border-white/10 text-center">
            <div className="text-[10px] font-bold uppercase tracking-wider text-white/60">Pending Review</div>
            <div className="text-xl font-serif font-bold text-amber-300">{pendingCount}</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-md border border-white/10 text-center">
            <div className="text-[10px] font-bold uppercase tracking-wider text-white/60">Approved Editors</div>
            <div className="text-xl font-serif font-bold text-emerald-300">{approvedCount}</div>
          </div>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-md border border-gray-200 shadow-xl overflow-hidden">
        {/* Controls Bar */}
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 bg-gray-50/50">
          <div className="relative w-full sm:w-80">
            <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search by Name, Email, Institution..."
              className="w-full pl-9 pr-3 py-1.5 border border-gray-300 rounded-sm text-xs outline-none focus:border-purple-600"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter size={14} className="text-slate-600" />
            <span className="text-[10px] font-black uppercase text-slate-600">Filter Status:</span>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-sm px-2 py-1 text-xs outline-none focus:border-purple-600 bg-white"
            >
              <option value="all">All Requests</option>
              <option value="pending">Pending Review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Requests Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-brand-navy text-white text-[10px] font-black uppercase tracking-widest">
                <th className="px-6 py-3.5">Applicant Name</th>
                <th className="px-6 py-3.5">Institution & Dept</th>
                <th className="px-6 py-3.5">Requested Role</th>
                <th className="px-6 py-3.5">Submitted</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400 font-mono">
                    Loading access requests...
                  </td>
                </tr>
              ) : filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-600">
                    No access requests matching criteria.
                  </td>
                </tr>
              ) : (
                filteredRequests.map(req => (
                  <tr key={req.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-brand-navy">{req.fullName}</div>
                      <div className="text-[10px] text-gray-400 font-mono">{req.email}</div>
                      {req.orcidId && (
                        <div className="text-[9px] text-emerald-700 font-mono">ORCID: {req.orcidId}</div>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <div className="font-semibold text-brand-navy">{req.institution}</div>
                      {req.department && (
                        <div className="text-[10px] text-gray-500">{req.department}</div>
                      )}
                    </td>

                    <td className="px-6 py-4 font-mono font-bold uppercase text-brand-action">
                      {req.requestedRole}
                    </td>

                    <td className="px-6 py-4 font-mono text-gray-400 text-[10px]">
                      {new Date(req.submittedAt).toLocaleDateString()}
                    </td>

                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                        req.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                        req.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                        'bg-rose-100 text-rose-800'
                      }`}>
                        {req.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {req.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleUpdateStatus(req.id, 'approved')}
                              disabled={processingId === req.id}
                              className="px-2.5 py-1.5 bg-emerald-600 text-white hover:bg-emerald-700 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm disabled:opacity-50"
                            >
                              <UserCheck size={13} /> Approve
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(req.id, 'rejected')}
                              disabled={processingId === req.id}
                              className="px-2.5 py-1.5 bg-rose-600 text-white hover:bg-rose-700 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm disabled:opacity-50"
                            >
                              <UserX size={13} /> Reject
                            </button>
                          </>
                        )}

                        <button
                          onClick={() => {
                            setSelectedRequest(req);
                            setAdminNotes(req.adminNotes || '');
                          }}
                          className="p-1.5 bg-gray-100 text-brand-navy hover:bg-brand-navy hover:text-white rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 transition-colors"
                        >
                          <Eye size={13} /> Review
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

      {/* DETAIL INSPECTION MODAL */}
      {selectedRequest && (
        <div className="fixed inset-0 z-[220] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-md shadow-2xl max-w-lg w-full border border-gray-100 overflow-hidden">
            <div className="bg-brand-navy p-5 text-white flex items-center justify-between border-b border-white/10">
              <div className="flex items-center gap-2">
                <ShieldCheck size={20} className="text-brand-action" />
                <h3 className="font-serif font-bold text-base">Review Applicant Credentials</h3>
              </div>
              <button onClick={() => setSelectedRequest(null)} className="text-white/40 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="bg-gray-50 p-4 rounded border border-gray-100 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400 font-bold uppercase text-[10px]">Applicant:</span>
                  <span className="font-bold text-brand-navy">{selectedRequest.fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 font-bold uppercase text-[10px]">Email:</span>
                  <span className="font-mono text-brand-action">{selectedRequest.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 font-bold uppercase text-[10px]">Institution:</span>
                  <span className="font-semibold text-brand-navy">{selectedRequest.institution}</span>
                </div>
                {selectedRequest.department && (
                  <div className="flex justify-between">
                    <span className="text-gray-400 font-bold uppercase text-[10px]">Department:</span>
                    <span className="text-gray-600">{selectedRequest.department}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-400 font-bold uppercase text-[10px]">Requested Role:</span>
                  <span className="font-mono font-bold uppercase text-purple-700">{selectedRequest.requestedRole}</span>
                </div>
                {selectedRequest.orcidId && (
                  <div className="flex justify-between">
                    <span className="text-gray-400 font-bold uppercase text-[10px]">ORCID iD:</span>
                    <span className="font-mono text-emerald-700">{selectedRequest.orcidId}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-700 mb-1">
                  Justification & Scope Statement
                </label>
                <div className="p-3 bg-amber-50/50 border border-amber-200/50 rounded text-slate-700 leading-relaxed italic">
                  "{selectedRequest.justification}"
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-700 mb-1">
                  Governance Admin Reviewer Notes
                </label>
                <textarea
                  rows={2}
                  value={adminNotes}
                  onChange={e => setAdminNotes(e.target.value)}
                  placeholder="Record verification notes or justification for approval/rejection..."
                  className="w-full border border-gray-300 rounded p-2 text-xs outline-none focus:border-brand-action"
                ></textarea>
              </div>

              <div className="pt-3 flex items-center justify-between border-t border-gray-100">
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="px-4 py-2 text-slate-600 hover:bg-gray-100 rounded"
                >
                  Close
                </button>

                {selectedRequest.status === 'pending' && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleUpdateStatus(selectedRequest.id, 'rejected')}
                      className="px-4 py-2 bg-rose-600 text-white font-bold uppercase text-[10px] rounded hover:bg-rose-700"
                    >
                      Reject Request
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(selectedRequest.id, 'approved')}
                      className="px-4 py-2 bg-emerald-600 text-white font-bold uppercase text-[10px] rounded hover:bg-emerald-700"
                    >
                      Approve & Grant Role
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
