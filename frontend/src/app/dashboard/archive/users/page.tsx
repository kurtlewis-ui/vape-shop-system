'use client';

import { useState } from 'react';
import { Search, Undo2, Trash2, X } from 'lucide-react';

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-text-primary">{title}</h3>
          <button onClick={onClose} className="text-text-muted hover:text-text-primary transition"><X size={20} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

interface ArchivedUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: 'Admin' | 'Staff';
  shop: string;
  archivedAt: string;
  image: string;
}

const mockArchivedUsers: ArchivedUser[] = [
  {
    id: 1,
    firstName: 'David',
    lastName: 'Garcia',
    email: 'david.garcia@vapeshop.com',
    role: 'Staff',
    shop: 'Mall Branch',
    archivedAt: '2024-01-10 03:15 PM',
    image: '',
  },
  {
    id: 2,
    firstName: 'Lisa',
    lastName: 'Martinez',
    email: 'lisa.martinez@vapeshop.com',
    role: 'Staff',
    shop: 'Uptown Branch',
    archivedAt: '2024-01-12 11:45 AM',
    image: '',
  },
];

export default function UsersArchivePage() {
  const [users, setUsers] = useState<ArchivedUser[]>(mockArchivedUsers);
  const [search, setSearch] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<ArchivedUser | null>(null);

  const filteredUsers = users.filter(
    (u) =>
      `${u.firstName} ${u.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleRestore = (user: ArchivedUser) => {
    setUsers(users.filter((u) => u.id !== user.id));
  };

  const handleDeleteClick = (user: ArchivedUser) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (selectedUser) {
      setUsers(users.filter((u) => u.id !== selectedUser.id));
    }
    setShowDeleteModal(false);
    setSelectedUser(null);
  };

  return (
    <div className="p-6 bg-page-bg min-h-screen">
      <h1 className="text-2xl font-bold text-text-primary mb-6">Users Archive</h1>

      <div className="bg-card-bg rounded-xl border border-card-border shadow-sm">
        <div className="p-4 border-b border-card-border">
          <div className="relative w-64">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder="Search archived users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-input-border rounded-lg bg-input-bg text-sm focus:outline-none focus:ring-2 focus:ring-input-focus"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-table-header text-table-header-text">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase">#</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Image</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Email</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Role</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Shop</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Archived At</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12">
                    <div className="border-l-4 border-accent-orange pl-4">
                      <p className="text-accent-orange font-medium">No archived users found.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user, idx) => (
                  <tr key={user.id} className="border-b border-card-border hover:bg-gray-50 transition">
                    <td className="px-4 py-3 text-sm text-text-primary">{idx + 1}</td>
                    <td className="px-4 py-3">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs text-text-muted">
                        {user.firstName[0]}{user.lastName[0]}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-text-primary font-medium">
                      {user.firstName} {user.lastName}
                    </td>
                    <td className="px-4 py-3 text-sm text-text-secondary">{user.email}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.role === 'Admin'
                          ? 'bg-blue-100 text-accent-blue'
                          : 'bg-gray-100 text-text-secondary'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-text-secondary">{user.shop}</td>
                    <td className="px-4 py-3 text-sm text-text-secondary">{user.archivedAt}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleRestore(user)}
                          className="flex items-center gap-1 text-accent-green hover:underline text-sm font-medium"
                          title="Restore"
                        >
                          <Undo2 size={14} /> Restore
                        </button>
                        <button
                          onClick={() => handleDeleteClick(user)}
                          className="flex items-center gap-1 text-accent-red hover:underline text-sm font-medium"
                          title="Delete permanently"
                        >
                          <Trash2 size={14} /> Delete
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

      {/* Permanent Delete Confirmation Modal */}
      {showDeleteModal && selectedUser && (
        <Modal title="Delete Permanently" onClose={() => setShowDeleteModal(false)}>
          <div className="mb-4">
            <p className="text-sm text-text-secondary">
              If you permanently delete this, it won&apos;t be restored and all previous data associated with it will not be seen anymore.
            </p>
          </div>
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="px-4 py-2 border border-input-border rounded-lg text-sm text-text-primary hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="px-4 py-2 bg-accent-red text-white rounded-lg text-sm font-medium hover:opacity-90 transition"
            >
              Yes, Delete Permanently
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
