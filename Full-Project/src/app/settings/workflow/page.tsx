'use client';

import React, { useState, useEffect, useCallback } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';

interface ApiUser {
  id: string;
  full_name_en: string;
  email: string;
  account_type: string;
}

interface WorkflowStage {
  id: string;
  roleType: 'Creator' | 'Reviewer' | 'Approver' | 'Final Approver';
  userId: string;
  userName: string;
}

interface WorkflowConfig {
  operationType: 'Purchase Requests' | 'LCs' | 'LGs' | 'Deals' | 'Payments' | 'Agreements';
  stages: WorkflowStage[];
  allowDelegation: boolean;
  autoApproveAfterDays: number;
  notifyOnEachStage: boolean;
  requireNoteOnReject: boolean;
}

function getAuthHeaders(): Record<string, string> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

const defaultConfig: WorkflowConfig = {
  operationType: 'Purchase Requests',
  stages: [],
  allowDelegation: true,
  autoApproveAfterDays: 7,
  notifyOnEachStage: true,
  requireNoteOnReject: true,
};

export default function WorkflowSettingsPage() {
  const [config, setConfig] = useState<WorkflowConfig>(defaultConfig);
  const [saved, setSaved] = useState(false);
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  const fetchUsers = useCallback(async () => {
    try {
      setLoadingUsers(true);
      const res = await fetch('/api/admin/users?limit=100', {
        headers: { ...getAuthHeaders() },
        credentials: 'include',
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setUsers(json.data);
          if (json.data.length > 0 && config.stages.length === 0) {
            setConfig(prev => ({
              ...prev,
              stages: [
                { id: '1', roleType: 'Reviewer', userId: json.data[0].id, userName: json.data[0].full_name_en },
              ],
            }));
          }
        }
      }
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoadingUsers(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const operationTypes: WorkflowConfig['operationType'][] = [
    'Purchase Requests',
    'LCs',
    'LGs',
    'Deals',
    'Payments',
    'Agreements',
  ];

  const roleTypes: WorkflowStage['roleType'][] = ['Creator', 'Reviewer', 'Approver', 'Final Approver'];

  const handleAddStage = () => {
    const defaultUser = users[0];
    const newStage: WorkflowStage = {
      id: String(config.stages.length + 1),
      roleType: 'Reviewer',
      userId: defaultUser?.id || '',
      userName: defaultUser?.full_name_en || 'Select User',
    };
    setConfig({ ...config, stages: [...config.stages, newStage] });
  };

  const handleRemoveStage = (id: string) => {
    setConfig({
      ...config,
      stages: config.stages.filter(stage => stage.id !== id),
    });
  };

  const handleStageChange = (id: string, field: keyof WorkflowStage, value: string) => {
    setConfig({
      ...config,
      stages: config.stages.map(stage =>
        stage.id === id ? { ...stage, [field]: value } : stage
      ),
    });
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Workflow Configuration</h1>
          <p className="text-gray-400">Configure approval workflows for different operation types</p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Configuration Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Operation Type Selection */}
            <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-6">
              <label className="block text-sm font-semibold text-white mb-3">
                Operation Type
              </label>
              <select
                value={config.operationType}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    operationType: e.target.value as WorkflowConfig['operationType'],
                  })
                }
                className="w-full bg-[#0c0f14] border border-[#242830] rounded-lg px-4 py-3 text-white focus:border-[#c41e3a] outline-none transition-colors"
              >
                {operationTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Approval Stages */}
            <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">Approval Stages ({config.stages.length})</h2>
                <button
                  onClick={handleAddStage}
                  disabled={config.stages.length >= 5 || loadingUsers}
                  className="px-4 py-2 bg-[#c41e3a] text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  + Add Stage
                </button>
              </div>

              {loadingUsers ? (
                <div className="text-center py-8">
                  <div className="animate-spin w-6 h-6 border-2 border-[#c41e3a] border-t-transparent rounded-full mx-auto mb-2" />
                  <p className="text-gray-400 text-sm">Loading users...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {config.stages.length === 0 && (
                    <p className="text-gray-500 text-center py-4">No stages configured. Click &quot;+ Add Stage&quot; to begin.</p>
                  )}
                  {config.stages.map((stage, index) => (
                    <div
                      key={stage.id}
                      className="bg-[#0c0f14] border border-[#242830] rounded-lg p-4 space-y-3"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-full bg-[#d4a843] text-[#0c0f14] flex items-center justify-center font-semibold">
                          {index + 1}
                        </div>
                        <h3 className="font-semibold text-white">Stage {index + 1}</h3>
                        {config.stages.length > 1 && (
                          <button
                            onClick={() => handleRemoveStage(stage.id)}
                            className="ml-auto px-3 py-1 bg-red-600 bg-opacity-20 text-red-400 rounded hover:bg-opacity-30 transition-colors"
                          >
                            Remove
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm text-gray-400 mb-2">Role Type</label>
                          <select
                            value={stage.roleType}
                            onChange={(e) =>
                              handleStageChange(stage.id, 'roleType', e.target.value)
                            }
                            className="w-full bg-[#1a1d23] border border-[#242830] rounded px-3 py-2 text-white text-sm focus:border-[#c41e3a] outline-none transition-colors"
                          >
                            {roleTypes.map((role) => (
                              <option key={role} value={role}>
                                {role}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm text-gray-400 mb-2">Assigned User</label>
                          <select
                            value={stage.userId}
                            onChange={(e) => {
                              const user = users.find(u => u.id === e.target.value);
                              if (user) {
                                handleStageChange(stage.id, 'userId', user.id);
                                handleStageChange(stage.id, 'userName', user.full_name_en);
                              }
                            }}
                            className="w-full bg-[#1a1d23] border border-[#242830] rounded px-3 py-2 text-white text-sm focus:border-[#c41e3a] outline-none transition-colors"
                          >
                            {users.map((user) => (
                              <option key={user.id} value={user.id}>
                                {user.full_name_en}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Options */}
            <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-6 space-y-4">
              <h2 className="text-lg font-semibold text-white mb-4">Workflow Options</h2>

              <div className="flex items-center justify-between">
                <label className="text-white">Allow delegation of approvals</label>
                <input
                  type="checkbox"
                  checked={config.allowDelegation}
                  onChange={(e) =>
                    setConfig({ ...config, allowDelegation: e.target.checked })
                  }
                  className="w-5 h-5 rounded border-[#242830] accent-[#c41e3a]"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="text-white">Notify on each stage</label>
                <input
                  type="checkbox"
                  checked={config.notifyOnEachStage}
                  onChange={(e) =>
                    setConfig({ ...config, notifyOnEachStage: e.target.checked })
                  }
                  className="w-5 h-5 rounded border-[#242830] accent-[#c41e3a]"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="text-white">Require note on rejection</label>
                <input
                  type="checkbox"
                  checked={config.requireNoteOnReject}
                  onChange={(e) =>
                    setConfig({ ...config, requireNoteOnReject: e.target.checked })
                  }
                  className="w-5 h-5 rounded border-[#242830] accent-[#c41e3a]"
                />
              </div>

              <div className="pt-4 border-t border-[#242830]">
                <label className="block text-sm text-gray-400 mb-2">Auto-approve after (days)</label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={config.autoApproveAfterDays}
                  onChange={(e) =>
                    setConfig({ ...config, autoApproveAfterDays: parseInt(e.target.value) })
                  }
                  className="w-full bg-[#0c0f14] border border-[#242830] rounded px-4 py-2 text-white focus:border-[#c41e3a] outline-none transition-colors"
                />
              </div>
            </div>

            {/* Save Button */}
            <div className="flex gap-4">
              <button
                onClick={handleSave}
                className="px-8 py-3 bg-[#c41e3a] text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
              >
                Save Configuration
              </button>
              {saved && (
                <div className="px-4 py-3 bg-green-600 bg-opacity-20 text-green-400 rounded-lg">
                  Configuration saved successfully
                </div>
              )}
            </div>
          </div>

          {/* Preview Panel */}
          <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-6 h-fit sticky top-8">
            <h2 className="text-lg font-semibold text-white mb-4">Current Workflow</h2>
            <p className="text-sm text-gray-400 mb-4">{config.operationType}</p>

            <div className="space-y-3">
              {config.stages.length === 0 && (
                <p className="text-gray-500 text-sm">No stages configured</p>
              )}
              {config.stages.map((stage, index) => (
                <div key={stage.id}>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#c41e3a] flex items-center justify-center text-white text-xs font-semibold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-300">{stage.roleType}</p>
                      <p className="text-xs text-gray-500">{stage.userName}</p>
                    </div>
                  </div>
                  {index < config.stages.length - 1 && (
                    <div className="ml-2.5 border-l-2 border-[#d4a843] h-4"></div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-[#242830] space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Delegation:</span>
                <span className="text-white">{config.allowDelegation ? 'Yes' : 'No'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Auto-approve:</span>
                <span className="text-white">{config.autoApproveAfterDays} days</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Notifications:</span>
                <span className="text-white">{config.notifyOnEachStage ? 'Each stage' : 'Final only'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
