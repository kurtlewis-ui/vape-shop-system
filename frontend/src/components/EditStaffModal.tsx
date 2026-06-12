'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api, getApiErrorMessage } from '@/lib/api';
import type { ApiEnvelope, Branch, RoleOption, UserListItem } from '@/lib/types';
import { Modal } from './Modal';

interface EditStaffModalProps {
  user: UserListItem | null;
  onClose: () => void;
  roles: RoleOption[];
  branches: Branch[];
}

const inputClass =
  'w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200';

export function EditStaffModal({ user, onClose, roles, branches }: EditStaffModalProps) {
  const queryClient = useQueryClient();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [roleId, setRoleId] = useState('');
  const [branchId, setBranchId] = useState<string>('');
  const [isActive, setIsActive] = useState(true);
  const [formError, setFormError] = useState<string | null>(null);

  // Reset the form whenever a different user is opened.
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName);
      setLastName(user.lastName);
      setEmail(user.email);
      setRoleId(user.role.id);
      setBranchId(user.branchId ?? '');
      setIsActive(user.isActive);
      setFormError(null);
    }
  }, [user]);

  const mutation = useMutation({
    mutationFn: async () => {
      if (!user) return;
      const payload: Record<string, unknown> = {
        firstName,
        lastName,
        email,
        roleId,
        isActive,
        // Send null to explicitly unassign the branch.
        branchId: branchId === '' ? null : branchId,
      };
      const response = await api.patch<ApiEnvelope<unknown>>(`/users/${user.id}`, payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      onClose();
    },
    onError: (err) => {
      setFormError(getApiErrorMessage(err, 'Could not update the staff member.'));
    },
  });

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setFormError(null);
    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      setFormError('First name, last name and email are required.');
      return;
    }
    mutation.mutate();
  }

  const title = user ? `Edit staff — ${user.firstName} ${user.lastName}` : 'Edit staff';
  const activeBranches = branches.filter((b) => b.isActive);

  return (
    <Modal open={!!user} onClose={onClose} title={title}>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">First name</label>
            <input
              className={inputClass}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Last name</label>
            <input
              className={inputClass}
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
          <input
            type="email"
            className={inputClass}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Role</label>
          <select
            className={inputClass}
            value={roleId}
            onChange={(e) => setRoleId(e.target.value)}
          >
            {roles.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Branch</label>
          <select
            className={inputClass}
            value={branchId}
            onChange={(e) => setBranchId(e.target.value)}
          >
            <option value="">— No branch (Owner/Admin) —</option>
            {activeBranches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-slate-400">
            Staff are restricted to selling from their assigned branch. Owner/Admin can be left
            unassigned.
          </p>
        </div>

        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
          />
          Active (can log in)
        </label>

        {formError && (
          <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{formError}</div>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={mutation.isPending}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            {mutation.isPending ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
