'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';

interface Dispute {
  id: string;
  dealRef: string;
  buyer: string;
  supplier: string;
  reason: string;
  status: 'open' | 'in_negotiation' | 'resolved';
  evidence: string[];
  openedDate: string;
}

const demoDisputes: Dispute[] = [
  {
    id: 'dispute-001',
    dealRef: '#2024-005',
    buyer: 'Fatima Al-Saud',
    supplier: 'Zhejiang Steel Manufacturing',
    reason: 'Quality issues with delivered materials - 4% rejection rate vs 2% agreed',
    status: 'open',
    evidence: ['Quality Report PDF', 'Photos of defects'],
    openedDate: '2024-03-12',
  },
  {
    id: 'dispute-002',
    dealRef: '#2024-008',
    buyer: 'Ahmed Al-Rashid',
    supplier: 'Shanghai Electronics Components',
    reason: 'Late delivery - 5 days behind schedule',
    status: 'in_negotiation',
    evidence: ['Shipping records', 'LC documentation'],
    openedDate: '2024-02-28',
  },
  {
    id: 'dispute-003',
    dealRef: '#2024-012',
    buyer: 'Mohammed Hassan',
    supplier: 'Jiangsu Solar Panel Manufacturing',
    reason: 'Quantity mismatch - 100 units short',
    status: 'in_negotiation',
    evidence: ['Delivery note', 'Invoice'],
    openedDate: '2024-02-15',
  },
];

const resolutionOptions = [
  { label: 'Re-ship', value: 're-ship' },
  { label: 'Discount', value: 'discount' },
  { label: 'Return', value: 'return' },
  { label: 'Compensation', value: 'compensation' },
];

const statusColors = {
  open: 'bg-red-500/20 text-red-400',
  in_negotiation: 'bg-yellow-500/20 text-yellow-400',
  resolved: 'bg-green-500/20 text-green-400',
};

export default function AdminDisputesPage() {
  const [disputes, setDisputes] = useState(demoDisputes);
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedResolution, setSelectedResolution] = useState('');

  const handleResolveDispute = () => {
    if (selectedDispute && selectedResolution) {
      setDisputes(
        disputes.map(d =>
          d.id === selectedDispute.id
            ? { ...d, status: 'resolved' }
            : d
        )
      );
      setShowDetailModal(false);
      setSelectedDispute(null);
      setSelectedResolution('');
    }
  };

  const handleUpdateStatus = (id: string, newStatus: 'open' | 'in_negotiation' | 'resolved') => {
    setDisputes(
      disputes.map(d => (d.id === id ? { ...d, status: newStatus } : d))
    );
  };

  const openDisputes = disputes.filter(d => d.status === 'open');
  const inNegotiation = disputes.filter(d => d.status === 'in_negotiation');
  const resolved = disputes.filter(d => d.status === 'resolved');

  return (
    <DashboardLayout
      user={{ name: 'Admin', initials: 'AD' }}
      isAuthenticated={true}
      userRole="admin"
    >
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Dispute Management</h1>
          <p className="text-gray-400">Manage and resolve disputes between buyers and suppliers</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-6">
            <p className="text-gray-400 text-sm mb-2">Open Disputes</p>
            <p className="text-3xl font-bold text-red-400">{openDisputes.length}</p>
          </div>
          <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-6">
            <p className="text-gray-400 text-sm mb-2">In Negotiation</p>
            <p className="text-3xl font-bold text-yellow-400">{inNegotiation.length}</p>
          </div>
          <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-6">
            <p className="text-gray-400 text-sm mb-2">Resolved</p>
            <p className="text-3xl font-bold text-green-400">{resolved.length}</p>
          </div>
        </div>

        {/* Open Disputes */}
        <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-6">Open Disputes</h2>
          {openDisputes.length > 0 ? (
            <div className="space-y-4">
              {openDisputes.map(dispute => (
                <div
                  key={dispute.id}
                  className="p-4 bg-[#0c0f14] rounded-lg border border-red-500/30 hover:border-red-500/60 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <p className="font-semibold text-white mb-1">
                        {dispute.dealRef} - {dispute.buyer} vs {dispute.supplier}
                      </p>
                      <p className="text-gray-400 text-sm mb-2">{dispute.reason}</p>
                      <p className="text-gray-600 text-xs">Opened: {dispute.openedDate}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${statusColors[dispute.status]}`}>
                      {dispute.status === 'open' ? 'Open' : 'In Negotiation'}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedDispute(dispute);
                        setShowDetailModal(true);
                      }}
                      className="px-4 py-2 bg-[#c41e3a] text-white rounded-lg hover:bg-red-700 transition-colors font-semibold text-sm"
                    >
                      Mediate
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(dispute.id, 'in_negotiation')}
                      className="px-4 py-2 border border-[#242830] text-white rounded-lg hover:bg-[#242830] transition-colors font-semibold text-sm"
                    >
                      Mark In Negotiation
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No open disputes</p>
          )}
        </div>

        {/* In Negotiation Disputes */}
        <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-6">In Negotiation</h2>
          {inNegotiation.length > 0 ? (
            <div className="space-y-4">
              {inNegotiation.map(dispute => (
                <div
                  key={dispute.id}
                  className="p-4 bg-[#0c0f14] rounded-lg border border-yellow-500/30 hover:border-yellow-500/60 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <p className="font-semibold text-white mb-1">
                        {dispute.dealRef} - {dispute.buyer} vs {dispute.supplier}
                      </p>
                      <p className="text-gray-400 text-sm mb-2">{dispute.reason}</p>
                      <p className="text-gray-600 text-xs">Opened: {dispute.openedDate}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${statusColors[dispute.status]}`}>
                      In Negotiation
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedDispute(dispute);
                        setShowDetailModal(true);
                      }}
                      className="px-4 py-2 bg-[#c41e3a] text-white rounded-lg hover:bg-red-700 transition-colors font-semibold text-sm"
                    >
                      Resolve
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(dispute.id, 'open')}
                      className="px-4 py-2 border border-[#242830] text-white rounded-lg hover:bg-[#242830] transition-colors font-semibold text-sm"
                    >
                      Reopen
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No disputes in negotiation</p>
          )}
        </div>

        {/* Detail Modal */}
        {showDetailModal && selectedDispute && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-[#1a1d23] border border-[#242830] rounded-lg max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-white">Dispute Details</h2>
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    setSelectedDispute(null);
                    setSelectedResolution('');
                  }}
                  className="text-gray-400 hover:text-white text-2xl leading-none"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Deal Reference</p>
                  <p className="text-white font-semibold">{selectedDispute.dealRef}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Buyer</p>
                    <p className="text-white">{selectedDispute.buyer}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Supplier</p>
                    <p className="text-white">{selectedDispute.supplier}</p>
                  </div>
                </div>

                <div>
                  <p className="text-gray-400 text-sm mb-1">Reason</p>
                  <p className="text-white">{selectedDispute.reason}</p>
                </div>

                <div>
                  <p className="text-gray-400 text-sm mb-2">Evidence</p>
                  <div className="space-y-2">
                    {selectedDispute.evidence.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-white">
                        <span className="text-blue-400">📎</span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-gray-400 text-sm mb-2">Resolution Option</p>
                  <select
                    value={selectedResolution}
                    onChange={(e) => setSelectedResolution(e.target.value)}
                    className="w-full bg-[#0c0f14] border border-[#242830] rounded px-4 py-2 text-white focus:border-[#c41e3a] outline-none"
                  >
                    <option value="">Select a resolution...</option>
                    {resolutionOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleResolveDispute}
                  disabled={!selectedResolution}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors font-semibold"
                >
                  Resolve Dispute
                </button>
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    setSelectedDispute(null);
                    setSelectedResolution('');
                  }}
                  className="flex-1 px-4 py-2 border border-[#242830] text-white rounded-lg hover:bg-[#242830] transition-colors font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
