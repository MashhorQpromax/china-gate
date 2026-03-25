'use client';

import React, { useState } from 'react';

interface WorkflowStageStatus {
  id: string;
  stageNumber: number;
  role: string;
  userAvatar?: string;
  userName: string;
  status: 'pending' | 'approved' | 'rejected' | 'current';
  timestamp?: Date;
  notes?: string;
}

interface WorkflowTrackerProps {
  stages: WorkflowStageStatus[];
  title?: string;
  itemType?: string;
  itemId?: string;
  currentUserId?: string;
  canApprove?: boolean;
  onApprove?: (notes?: string) => void;
  onReject?: (notes: string) => void;
  onRequestChange?: (notes: string) => void;
  isRTL?: boolean;
}

const statusColors = {
  approved: { bg: 'bg-green-600 bg-opacity-20', text: 'text-green-400', connector: 'border-green-500' },
  rejected: { bg: 'bg-red-600 bg-opacity-20', text: 'text-red-400', connector: 'border-red-500' },
  current: { bg: 'bg-blue-600 bg-opacity-20', text: 'text-blue-400', connector: 'border-blue-500' },
  pending: { bg: 'bg-gray-600 bg-opacity-20', text: 'text-gray-400', connector: 'border-gray-500' },
};

export default function WorkflowTracker({
  stages,
  title = 'Approval Workflow',
  itemType = 'Item',
  itemId,
  currentUserId,
  canApprove = false,
  onApprove,
  onReject,
  onRequestChange,
  isRTL = false,
}: WorkflowTrackerProps) {
  const [selectedStage, setSelectedStage] = useState<string | null>(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject' | 'request_change'>('approve');
  const [actionNotes, setActionNotes] = useState('');

  const currentStage = stages.find(s => s.status === 'current');

  const handleApprove = () => {
    if (onApprove) {
      onApprove(actionNotes);
      setActionNotes('');
      setShowActionModal(false);
    }
  };

  const handleReject = () => {
    if (onReject && actionNotes.trim()) {
      onReject(actionNotes);
      setActionNotes('');
      setShowActionModal(false);
    }
  };

  const handleRequestChange = () => {
    if (onRequestChange && actionNotes.trim()) {
      onRequestChange(actionNotes);
      setActionNotes('');
      setShowActionModal(false);
    }
  };

  return (
    <div className={`space-y-6 ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white mb-2">{title}</h2>
        {itemId && (
          <p className="text-sm text-gray-400">{itemType}: {itemId}</p>
        )}
      </div>

      {/* Workflow Visual Flow */}
      <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-8">
        <div className="space-y-4">
          {stages.map((stage, index) => (
            <div key={stage.id}>
              {/* Stage Item */}
              <div
                onClick={() => setSelectedStage(stage.id)}
                className={`cursor-pointer transition-all duration-200 ${
                  selectedStage === stage.id ? 'ring-2 ring-[#c41e3a]' : ''
                }`}
              >
                <div
                  className={`p-4 rounded-lg border ${
                    statusColors[stage.status].bg
                  } border-[#242830] flex items-start gap-4 hover:border-[#d4a843] transition-colors`}
                >
                  {/* Avatar */}
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                      stage.status === 'approved'
                        ? 'bg-green-600 text-white'
                        : stage.status === 'rejected'
                        ? 'bg-red-600 text-white'
                        : stage.status === 'current'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-600 text-white'
                    }`}
                  >
                    {stage.userAvatar ? stage.userAvatar : `S${stage.stageNumber}`}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${statusColors[stage.status].bg} ${statusColors[stage.status].text}`}>
                        {stage.status === 'approved' && '✓ Approved'}
                        {stage.status === 'rejected' && '✗ Rejected'}
                        {stage.status === 'current' && '→ Current'}
                        {stage.status === 'pending' && '⏳ Pending'}
                      </span>
                    </div>
                    <h3 className="text-white font-semibold">Stage {stage.stageNumber}: {stage.role}</h3>
                    <p className="text-sm text-gray-400">{stage.userName}</p>
                    {stage.timestamp && (
                      <p className="text-xs text-gray-500 mt-1">
                        {stage.timestamp.toLocaleDateString()} at {stage.timestamp.toLocaleTimeString()}
                      </p>
                    )}
                    {stage.notes && (
                      <div className="mt-2 p-2 bg-[#0c0f14] rounded text-xs text-gray-300 border-l-2 border-[#d4a843]">
                        {stage.notes}
                      </div>
                    )}
                  </div>

                  {/* Status Icon */}
                  <div className="text-2xl flex-shrink-0">
                    {stage.status === 'approved' && '✓'}
                    {stage.status === 'rejected' && '✗'}
                    {stage.status === 'current' && '→'}
                    {stage.status === 'pending' && '⏳'}
                  </div>
                </div>
              </div>

              {/* Connector Line */}
              {index < stages.length - 1 && (
                <div className="flex justify-center py-2">
                  <div className={`w-1 h-6 border-l-2 ${statusColors[stages[index + 1].status].connector}`}></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      {canApprove && currentStage && currentStage.status === 'current' && (
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={() => {
              setActionType('approve');
              setShowActionModal(true);
            }}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
          >
            Approve
          </button>
          <button
            onClick={() => {
              setActionType('reject');
              setShowActionModal(true);
            }}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
          >
            Reject
          </button>
          <button
            onClick={() => {
              setActionType('request_change');
              setShowActionModal(true);
            }}
            className="px-6 py-2 bg-[#d4a843] text-[#0c0f14] rounded-lg hover:bg-yellow-500 transition-colors font-semibold"
          >
            Request Changes
          </button>
        </div>
      )}

      {/* Audit Trail */}
      <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-6">
        <h3 className="text-lg font-bold text-white mb-4">Audit Trail</h3>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {stages
            .filter(s => s.status !== 'pending')
            .reverse()
            .map(stage => (
              <div key={stage.id} className="p-3 bg-[#0c0f14] rounded border border-[#242830] text-sm">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-white">{stage.userName}</span>
                  <span className={`px-2 py-0.5 rounded text-xs font-semibold ${statusColors[stage.status].bg} ${statusColors[stage.status].text}`}>
                    {stage.status === 'approved' && 'Approved'}
                    {stage.status === 'rejected' && 'Rejected'}
                  </span>
                </div>
                {stage.timestamp && (
                  <p className="text-xs text-gray-500">
                    {stage.timestamp.toLocaleString()}
                  </p>
                )}
                {stage.notes && (
                  <p className="mt-2 text-gray-300">{stage.notes}</p>
                )}
              </div>
            ))}
        </div>
      </div>

      {/* Action Modal */}
      {showActionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-8 max-w-md w-full">
            <h3 className="text-xl font-bold text-white mb-4">
              {actionType === 'approve' && 'Approve Request'}
              {actionType === 'reject' && 'Reject Request'}
              {actionType === 'request_change' && 'Request Changes'}
            </h3>

            {(actionType === 'reject' || actionType === 'request_change') && (
              <p className="text-sm text-gray-400 mb-4">
                {actionType === 'reject' ? 'Note is required for rejection.' : 'Please provide details about the required changes.'}
              </p>
            )}

            <textarea
              value={actionNotes}
              onChange={(e) => setActionNotes(e.target.value)}
              placeholder="Add notes (optional)"
              className="w-full bg-[#0c0f14] border border-[#242830] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-[#c41e3a] outline-none transition-colors min-h-32 resize-none"
            />

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowActionModal(false);
                  setActionNotes('');
                }}
                className="flex-1 px-4 py-2 border border-[#242830] text-white rounded-lg hover:bg-[#242830] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={
                  actionType === 'approve'
                    ? handleApprove
                    : actionType === 'reject'
                    ? handleReject
                    : handleRequestChange
                }
                disabled={
                  (actionType === 'reject' && !actionNotes.trim()) ||
                  (actionType === 'request_change' && !actionNotes.trim())
                }
                className={`flex-1 px-4 py-2 rounded-lg text-white font-semibold transition-colors ${
                  actionType === 'approve'
                    ? 'bg-green-600 hover:bg-green-700'
                    : actionType === 'reject'
                    ? 'bg-red-600 hover:bg-red-700 disabled:opacity-50'
                    : 'bg-[#d4a843] hover:bg-yellow-500 text-[#0c0f14] disabled:opacity-50'
                }`}
              >
                {actionType === 'approve' && 'Approve'}
                {actionType === 'reject' && 'Reject'}
                {actionType === 'request_change' && 'Request Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
