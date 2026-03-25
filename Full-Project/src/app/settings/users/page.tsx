'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { DEMO_USERS, DEMO_COMPANIES } from '@/lib/demo-data';
import { UserRole } from '@/types';

interface CompanyUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  status: 'active' | 'inactive' | 'suspended';
  joinedDate: Date;
  department?: string;
}

const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  [UserRole.ADMIN]: 'Full access to all features and settings',
  [UserRole.MANAGER]: 'Can manage users and approve workflows',
  [UserRole.EXECUTIVE]: 'Can review and approve high-level decisions',
  [UserRole.EMPLOYEE]: 'Can create and view requests',
  [UserRole.BUYER]: 'Can purchase products and create requests',
  [UserRole.SUPPLIER]: 'Can list and sell products',
  [UserRole.MANUFACTURER]: 'Can offer manufacturing services',
  [UserRole.CUSTOMS_AGENT]: 'Can process customs clearance',
  [UserRole.LOGISTICS_PARTNER]: 'Can manage shipments',
  [UserRole.BANK_REPRESENTATIVE]: 'Can issue LCs and guarantees',
};

const rolesArray = Object.values(UserRole);

export default function UsersManagementPage() {
  const [users, setUsers] = useState<CompanyUser[]>(
    DEMO_USERS.slice(0, 3).map(u => ({
      id: u.id,
      firstName: u.firstName,
      lastName: u.lastName,
      email: u.email,
      role: u.role,
      status: u.status as 'active' | 'inactive' | 'suspended',
      joinedDate: u.createdAt,
      department: u.department,
    }))
  );

  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: UserRole.EMPLOYEE,
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<UserRole | 'all'>('all');
  const [hoveredRole, setHoveredRole] = useState<UserRole | null>(null);

  const currentUser = users[0];

  const handleAddUser = () => {
    if (newUser.firstName && newUser.lastName && newUser.email) {
      const user: CompanyUser = {
        id: `user-new-${Date.now()}`,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        role: newUser.role,
        status: 'active',
        joinedDate: new Date(),
        department: 'New Department',
      };
      setUsers([...users, user]);
      setNewUser({
        firstName: '',
        lastName: '',
        email: '',
        role: UserRole.EMPLOYEE,
      });
      setShowAddModal(false);
    }
  };

  const handleRemoveUser = (id: string) => {
    if (id !== currentUser.id) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  const handleRoleChange = (id: string, newRole: UserRole) => {
    setUsers(users.map(u =>
      u.id === id ? { ...u, role: newRole } : u
    ));
  };

  const filteredUsers = users.filter(user =>
    (filterRole === 'all' || user.role === filterRole) &&
    (user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <DashboardLayout
      user={{ name: 'Company Manager', initials: 'CM' }}
      isAuthenticated={true}
    >
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Team Members</h1>
            <p className="text-gray-400">Manage company users and their roles</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-6 py-3 bg-[#c41e3a] text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
          >
            + Add User
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-4 flex-col sm:flex-row">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-[#1a1d23] border border-[#242830] rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:border-[#c41e3a] outline-none transition-colors"
          />
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value as any)}
            className="bg-[#1a1d23] border border-[#242830] rounded-lg px-4 py-2 text-white focus:border-[#c41e3a] outline-none transition-colors min-w-[200px]"
          >
            <option value="all">All Roles</option>
            {rolesArray.map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
        </div>

        {/* Users Table */}
        <div className="bg-[#1a1d23] border border-[#242830] rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#0c0f14] border-b border-[#242830]">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Role</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Department</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Joined</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#242830]">
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className={`hover:bg-[#242830] transition-colors ${
                      user.id === currentUser.id ? 'bg-[#0c0f14]' : ''
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#d4a843] flex items-center justify-center text-[#0c0f14] font-semibold text-sm">
                          {user.firstName[0]}{user.lastName[0]}
                        </div>
                        <div>
                          <p className="text-white font-semibold">
                            {user.firstName} {user.lastName}
                            {user.id === currentUser.id && (
                              <span className="ml-2 text-xs bg-[#c41e3a] px-2 py-1 rounded text-white">You</span>
                            )}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-300 text-sm">{user.email}</td>
                    <td className="px-6 py-4">
                      {user.id === currentUser.id ? (
                        <span className="px-3 py-1 bg-[#d4a843] bg-opacity-20 text-[#d4a843] rounded text-sm font-semibold">
                          {user.role}
                        </span>
                      ) : (
                        <div className="relative group">
                          <select
                            value={user.role}
                            onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)}
                            onMouseEnter={() => setHoveredRole(user.role)}
                            onMouseLeave={() => setHoveredRole(null)}
                            className="bg-[#0c0f14] border border-[#242830] rounded px-3 py-1 text-white text-sm focus:border-[#c41e3a] outline-none transition-colors cursor-pointer"
                          >
                            {rolesArray.map(role => (
                              <option key={role} value={role}>{role}</option>
                            ))}
                          </select>
                          {hoveredRole && (
                            <div className="absolute left-0 top-full mt-2 p-2 bg-[#0c0f14] border border-[#242830] rounded text-xs text-gray-300 w-48 z-10 pointer-events-none">
                              {ROLE_DESCRIPTIONS[hoveredRole]}
                            </div>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-sm">{user.department || '-'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded text-sm font-semibold ${
                        user.status === 'active'
                          ? 'bg-green-600 bg-opacity-20 text-green-400'
                          : user.status === 'inactive'
                          ? 'bg-gray-600 bg-opacity-20 text-gray-400'
                          : 'bg-red-600 bg-opacity-20 text-red-400'
                      }`}>
                        {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-sm">
                      {user.joinedDate.toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      {user.id !== currentUser.id && (
                        <button
                          onClick={() => handleRemoveUser(user.id)}
                          className="px-3 py-1 bg-red-600 bg-opacity-20 text-red-400 rounded hover:bg-opacity-30 transition-colors text-sm"
                        >
                          Remove
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add User Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-8 max-w-md w-full">
              <h2 className="text-2xl font-bold text-white mb-6">Add New User</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">First Name</label>
                  <input
                    type="text"
                    value={newUser.firstName}
                    onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
                    className="w-full bg-[#0c0f14] border border-[#242830] rounded-lg px-4 py-2 text-white focus:border-[#c41e3a] outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Last Name</label>
                  <input
                    type="text"
                    value={newUser.lastName}
                    onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
                    className="w-full bg-[#0c0f14] border border-[#242830] rounded-lg px-4 py-2 text-white focus:border-[#c41e3a] outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Email</label>
                  <input
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    className="w-full bg-[#0c0f14] border border-[#242830] rounded-lg px-4 py-2 text-white focus:border-[#c41e3a] outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Role</label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value as UserRole })}
                    className="w-full bg-[#0c0f14] border border-[#242830] rounded-lg px-4 py-2 text-white focus:border-[#c41e3a] outline-none transition-colors"
                  >
                    {rolesArray.map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                  <p className="mt-2 text-xs text-gray-400">{ROLE_DESCRIPTIONS[newUser.role]}</p>
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 border border-[#242830] text-white rounded-lg hover:bg-[#242830] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddUser}
                  disabled={!newUser.firstName || !newUser.lastName || !newUser.email}
                  className="flex-1 px-4 py-2 bg-[#c41e3a] text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
                >
                  Add User
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
