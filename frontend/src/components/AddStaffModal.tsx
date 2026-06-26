'use client';

import { useState, type FormEvent } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api, getApiErrorMessage } from '@/lib/api';
import type { ApiEnvelope, Branch, RoleOption } from '@/lib/types';
import { Modal } from './Modal';

interface AddStaffModalProps {
  open: boolean;
  onClose: () => void;
  roles: RoleOption[];
  branches: Branch[];
}

const inputClass =
  'w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200';

export function AddStaffModal({ open, onClose, roles, branches }: AddStaffModalProps) {
  const queryClient = useQueryClient();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [roleId, setRoleId] = useState('');
  const [branchId, setBranchId] = useState<string>('');
  const [formError, setFormError] = useState<string | null>(null);

  // Default the select to "Staff" (or the first role) until the user picks one.
  const defaultRoleId =
    roles.find((r) => r.name.toLowerCase() === 'staff')?.id ?? roles[0]?.id ?? '';
  const selectedRoleId = roleId || defaultRoleId;

  // Determine whether the chosen role is "Staff" (which should require a branch).
  const selectedRole = roles.find((r) => r.id === selectedRoleId);
  const isStaffRole = selectedRole?.name === 'Staff';

  const activeBranches = branches.filter((b) => b.isActive);

  const mutation = useMutation({
    mutationFn: async () => {
      const payload: Record<string, unknown> = {
        firstName,
        lastName,
        email,
        password,
        roleId: selectedRoleId,
      };
      if (branchId) {
        payload.branchId = branchId;
      }
      const response = await api.post<ApiEnvelope<unknown>>('/users', payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      handleClose();
    },
    onError: (err) => {
      setFormError(getApiErrorMessage(err, 'Could not create the staff account.'));
    },
  });

  function resetForm() {
    setFirstName('');
    setLastName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setRoleId('');
    setBranchId('');
    setFormError(null);
  }

  function handleClose() {
    resetForm();
    onClose();
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setFormError(null);

    if (password !== confirmPassword) {
      setFormError('Passwords do not match.');
      return;
    }
    if (!selectedRoleId) {
      setFormError('Please choose a role.');
      return;
    }
    if (isStaffRole && !branchId) {
      setFormError('Please assign this Staff member to a branch.');
      return;
    }
    mutation.mutate();
  }

  return (
    <Modal open={open} onClose={handleClose} title="Add new staff">
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
            placeholder="name@gmail.com"
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Role</label>
          <select
            className={inputClass}
            value={selectedRoleId}
            onChange={(e) => setRoleId(e.target.value)}
          >
            {roles.length === 0 && <option value="">Loading roles…</option>}
            {roles.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Branch {isStaffRole && <span className="text-red-500">*</span>}
          </label>
          <select
            className={inputClass}
            value={branchId}
            onChange={(e) => setBranchId(e.target.value)}
          >
            <option value="">
              {isStaffRole ? '— Select a branch —' : '— No branch (Admin) —'}
            </option>
            {activeBranches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-slate-400">
            Staff can only sell from their assigned branch.
          </p>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Password</label>
          <input
            type="password"
            className={inputClass}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Confirm password</label>
          <input
            type="password"
            className={inputClass}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <p className="text-xs text-slate-400">
          Min 8 characters, with an uppercase, lowercase, a number and a special character (@$!%*?&).
        </p>

        {formError && (
          <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{formError}</div>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={mutation.isPending}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            {mutation.isPending ? 'Creating…' : 'Create staff'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
