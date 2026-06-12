'use client';

import { useState, type FormEvent } from 'react';
import { useMutation } from '@tanstack/react-query';
import { api, getApiErrorMessage } from '@/lib/api';
import type { ApiEnvelope, UserListItem } from '@/lib/types';
import { Modal } from './Modal';

interface ChangePasswordModalProps {
  user: UserListItem | null;
  onClose: () => void;
}

const inputClass =
  'w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200';

export function ChangePasswordModal({ user, onClose }: ChangePasswordModalProps) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const mutation = useMutation({
    mutationFn: async () => {
      if (!user) return undefined;
      const response = await api.patch<ApiEnvelope<{ message: string }>>(
        `/users/${user.id}/password`,
        { newPassword, confirmPassword },
      );
      return response.data;
    },
    onSuccess: () => {
      setSuccess(true);
    },
    onError: (err) => {
      setFormError(getApiErrorMessage(err, 'Could not update the password.'));
    },
  });

  function handleClose() {
    setNewPassword('');
    setConfirmPassword('');
    setFormError(null);
    setSuccess(false);
    onClose();
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setFormError(null);

    if (newPassword !== confirmPassword) {
      setFormError('Passwords do not match.');
      return;
    }
    mutation.mutate();
  }

  const title = user
    ? `Change password — ${user.firstName} ${user.lastName}`
    : 'Change password';

  return (
    <Modal open={!!user} onClose={handleClose} title={title}>
      {success ? (
        <div className="space-y-4">
          <div className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
            Password updated. The user will need to log in again with the new password.
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
            >
              Done
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">New password</label>
            <input
              type="password"
              className={inputClass}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Confirm new password
            </label>
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
              {mutation.isPending ? 'Saving…' : 'Update password'}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}
