'use client';

import { useState } from 'react';
import { Search, Plus, Pencil, Trash2, X, Eye, EyeOff, RefreshCw } from 'lucide-react';

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-text-primary">{title}</h3>
          <button onClick={onClose} className="text-text-muted hover:text-text-primary transition"><X size={20} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

interface User {
  id: number;
  firstName: string;
  middleInitial: string;
  lastName: string;
  email: string;
  role: 'Admin' | 'Staff';
  shop: string;
  status: 'Active' | 'Disabled';
  image: string;
}

const mockUsers: User[] = [
  { id: 1, firstName: 'John', middleInitial: 'A', lastName: 'Doe', email: 'john.doe@vapeshop.com', role: 'Admin', shop: 'N/A', status: 'Active', image: '' },
  { id: 2, firstName: 'Jane', middleInitial: 'B', lastName: 'Smith', email: 'jane.smith@vapeshop.com', role: 'Admin', shop: 'N/A', status: 'Active', image: '' },
  { id: 3, firstName: 'Mike', middleInitial: 'C', lastName: 'Johnson', email: 'mike.johnson@vapeshop.com', role: 'Admin', shop: 'N/A', status: 'Active', image: '' },
  { id: 4, firstName: 'Sarah', middleInitial: 'D', lastName: 'Williams', email: 'sarah.williams@vapeshop.com', role: 'Staff', shop: 'Downtown Branch', status: 'Active', image: '' },
  { id: 5, firstName: 'Tom', middleInitial: 'E', lastName: 'Brown', email: 'tom.brown@vapeshop.com', role: 'Staff', shop: 'Mall Branch', status: 'Active', image: '' },
  { id: 6, firstName: 'Emily', middleInitial: 'F', lastName: 'Davis', email: 'emily.davis@vapeshop.com', role: 'Staff', shop: 'Uptown Branch', status: 'Disabled', image: '' },
  { id: 7, firstName: 'Chris', middleInitial: 'G', lastName: 'Wilson', email: 'chris.wilson@vapeshop.com', role: 'Staff', shop: 'Downtown Branch', status: 'Active', image: '' },
];

const branches = ['Downtown Branch', 'Mall Branch', 'Uptown Branch', 'Eastside Branch'];

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [search, setSearch] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState<number | 'All'>(10);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    middleInitial: '',
    lastName: '',
    email: '',
    role: 'Staff' as 'Admin' | 'Staff',
    shop: branches[0],
    status: 'Active' as 'Active' | 'Disabled',
    password: '',
    confirmPassword: '',
    image: null as File | null,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const filteredUsers = users.filter(
    (u) =>
      `${u.firstName} ${u.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const displayedUsers = entriesPerPage === 'All' ? filteredUsers : filteredUsers.slice(0, entriesPerPage);

  const resetForm = () => {
    setFormData({
      firstName: '',
      middleInitial: '',
      lastName: '',
      email: '',
      role: 'Staff',
      shop: branches[0],
      status: 'Active',
      password: '',
      confirmPassword: '',
      image: null,
    });
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const handleAdd = () => {
    resetForm();
    setShowAddModal(true);
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setFormData({
      firstName: user.firstName,
      middleInitial: user.middleInitial,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      shop: user.shop === 'N/A' ? branches[0] : user.shop,
      status: user.status,
      password: '',
      confirmPassword: '',
      image: null,
    });
    setShowEditModal(true);
  };

  const handleArchive = (user: User) => {
    setSelectedUser(user);
    setShowArchiveModal(true);
  };

  const confirmArchive = () => {
    if (selectedUser) {
      setUsers(users.filter((u) => u.id !== selectedUser.id));
    }
    setShowArchiveModal(false);
    setSelectedUser(null);
  };

  const handleSaveUser = () => {
    const newUser: User = {
      id: Math.max(...users.map((u) => u.id)) + 1,
      firstName: formData.firstName,
      middleInitial: formData.middleInitial,
      lastName: formData.lastName,
      email: formData.email,
      role: formData.role,
      shop: formData.role === 'Admin' ? 'N/A' : formData.shop,
      status: formData.status,
      image: '',
    };
    setUsers([...users, newUser]);
    setShowAddModal(false);
  };

  const handleUpdateUser = () => {
    if (selectedUser) {
      setUsers(
        users.map((u) =>
          u.id === selectedUser.id
            ? {
                ...u,
                firstName: formData.firstName,
                middleInitial: formData.middleInitial,
                lastName: formData.lastName,
                email: formData.email,
                role: formData.role,
                shop: formData.role === 'Admin' ? 'N/A' : formData.shop,
                status: formData.status,
              }
            : u
        )
      );
    }
    setShowEditModal(false);
    setSelectedUser(null);
  };

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData({ ...formData, password, confirmPassword: password });
  };

  const UserForm = ({ isEdit }: { isEdit: boolean }) => (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">First Name</label>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            className="w-full px-3 py-2 border border-input-border rounded-lg bg-input-bg focus:outline-none focus:ring-2 focus:ring-input-focus text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">M.I.</label>
          <input
            type="text"
            value={formData.middleInitial}
            onChange={(e) => setFormData({ ...formData, middleInitial: e.target.value })}
            className="w-full px-3 py-2 border border-input-border rounded-lg bg-input-bg focus:outline-none focus:ring-2 focus:ring-input-focus text-sm"
            maxLength={1}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">Last Name</label>
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            className="w-full px-3 py-2 border border-input-border rounded-lg bg-input-bg focus:outline-none focus:ring-2 focus:ring-input-focus text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">Status</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as 'Active' | 'Disabled' })}
            className="w-full px-3 py-2 border border-input-border rounded-lg bg-input-bg focus:outline-none focus:ring-2 focus:ring-input-focus text-sm"
          >
            <option value="Active">Active</option>
            <option value="Disabled">Disabled</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">Role</label>
          <select
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value as 'Admin' | 'Staff' })}
            className="w-full px-3 py-2 border border-input-border rounded-lg bg-input-bg focus:outline-none focus:ring-2 focus:ring-input-focus text-sm"
          >
            <option value="Admin">Admin</option>
            <option value="Staff">Staff</option>
          </select>
        </div>
      </div>

      {formData.role === 'Staff' && (
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">Shop</label>
          <select
            value={formData.shop}
            onChange={(e) => setFormData({ ...formData, shop: e.target.value })}
            className="w-full px-3 py-2 border border-input-border rounded-lg bg-input-bg focus:outline-none focus:ring-2 focus:ring-input-focus text-sm"
          >
            {branches.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-text-primary mb-1">Email</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full px-3 py-2 border border-input-border rounded-lg bg-input-bg focus:outline-none focus:ring-2 focus:ring-input-focus text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-text-primary mb-1">
          Password {isEdit && <span className="text-text-muted font-normal">(Leave blank to keep current password)</span>}
        </label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-3 py-2 border border-input-border rounded-lg bg-input-bg focus:outline-none focus:ring-2 focus:ring-input-focus text-sm pr-10"
              placeholder={isEdit ? 'Leave blank to keep current' : ''}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <button
            type="button"
            onClick={generatePassword}
            className="px-3 py-2 bg-accent-blue text-white rounded-lg text-sm flex items-center gap-1 hover:opacity-90"
          >
            <RefreshCw size={14} /> Generate
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-text-primary mb-1">Confirm Password</label>
        <div className="relative">
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            className="w-full px-3 py-2 border border-input-border rounded-lg bg-input-bg focus:outline-none focus:ring-2 focus:ring-input-focus text-sm pr-10"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
          >
            {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-text-primary mb-1">User Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFormData({ ...formData, image: e.target.files?.[0] || null })}
          className="w-full px-3 py-2 border border-input-border rounded-lg bg-input-bg text-sm file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:bg-accent-primary file:text-white"
        />
        {isEdit && selectedUser?.image && (
          <p className="text-xs text-text-muted mt-1">Current image uploaded. Upload new to replace.</p>
        )}
      </div>

      <button
        onClick={isEdit ? handleUpdateUser : handleSaveUser}
        className="w-full py-2.5 bg-btn-primary text-white rounded-lg font-medium hover:opacity-90 transition"
      >
        {isEdit ? 'Update User' : 'Save User'}
      </button>
    </div>
  );

  return (
    <div className="p-6 bg-page-bg min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Users</h1>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-btn-primary text-white rounded-lg font-medium hover:opacity-90 transition"
        >
          <Plus size={18} /> Add New User
        </button>
      </div>

      <div className="bg-card-bg rounded-xl border border-card-border shadow-sm">
        <div className="p-4 flex items-center justify-between border-b border-card-border">
          <div className="flex items-center gap-2">
            <label className="text-sm text-text-secondary">Show</label>
            <select
              value={entriesPerPage}
              onChange={(e) => setEntriesPerPage(e.target.value === 'All' ? 'All' : Number(e.target.value))}
              className="px-2 py-1 border border-input-border rounded text-sm bg-input-bg focus:outline-none focus:ring-2 focus:ring-input-focus"
            >
              {[5, 10, 25, 50, 100].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
              <option value="All">All</option>
            </select>
            <span className="text-sm text-text-secondary">entries</span>
          </div>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 border border-input-border rounded-lg bg-input-bg text-sm focus:outline-none focus:ring-2 focus:ring-input-focus w-64"
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
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayedUsers.map((user, idx) => (
                <tr key={user.id} className="border-b border-card-border hover:bg-gray-50 transition">
                  <td className="px-4 py-3 text-sm text-text-primary">{idx + 1}</td>
                  <td className="px-4 py-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs text-text-muted">
                      {user.firstName[0]}{user.lastName[0]}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-text-primary font-medium">
                    {user.firstName} {user.middleInitial}. {user.lastName}
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
                  <td className="px-4 py-3">
                    <span className={`text-sm font-medium ${
                      user.status === 'Active' ? 'text-accent-green' : 'text-accent-red'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(user)}
                        className="p-1.5 text-accent-blue hover:bg-blue-50 rounded transition"
                        title="Edit"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => handleArchive(user)}
                        className="p-1.5 text-accent-red hover:bg-red-50 rounded transition"
                        title="Archive"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 text-sm text-text-secondary">
          Showing 1 to {displayedUsers.length} of {filteredUsers.length} entries
        </div>
      </div>

      {/* Add New User Modal */}
      {showAddModal && (
        <Modal title="Add New User" onClose={() => setShowAddModal(false)}>
          <UserForm isEdit={false} />
        </Modal>
      )}

      {/* Edit User Modal */}
      {showEditModal && (
        <Modal title="Edit User" onClose={() => setShowEditModal(false)}>
          <UserForm isEdit={true} />
        </Modal>
      )}

      {/* Archive Confirmation Modal */}
      {showArchiveModal && selectedUser && (
        <Modal title="Archive User" onClose={() => setShowArchiveModal(false)}>
          <p className="text-sm text-text-secondary mb-4">
            Are you sure you want to archive <strong>{selectedUser.firstName} {selectedUser.lastName}</strong>? This user will be moved to the archive.
          </p>
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => setShowArchiveModal(false)}
              className="px-4 py-2 border border-input-border rounded-lg text-sm text-text-primary hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={confirmArchive}
              className="px-4 py-2 bg-accent-red text-white rounded-lg text-sm font-medium hover:opacity-90 transition"
            >
              Yes, Archive
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
