'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api, getApiErrorMessage } from '@/lib/api';
import type { ApiEnvelope, Branch } from '@/lib/types';
import { Modal } from './Modal';

interface BranchModalProps {
  open: boolean;
  onClose: () => void;
  /** Branch to edit. If null, the modal is in "create" mode. */
  branch?: Branch | null;
}

const inputClass =
  'w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200';

export function BranchModal({ open, onClose, branch }: BranchModalProps) {
  const queryClient = useQueryClient();
  const isEdit = !!branch;

  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [formError, setFormError] = useState<string | null>(null);

  // Sync the form whenever the modal opens with a (potentially different) branch.
  useEffect(() => {
    if (open) {
      setName(branch?.name ?? '');
      setAddress(branch?.address ?? '');
      setIsActive(branch?.isActive ?? true);
      setFormError(null);
    }
  }, [open, branch]);

  const mutation = useMutation({
    mutationFn: async () => {
      const payload = {
        name: name.trim(),
        address: address.trim() || undefined,
        isActive,
      };
      if (isEdit && branch) {
        const response = await api.patch<ApiEnvelope<Branch>>(
          `/branches/${branch.id}`,
          payload,
        );
        return response.data;
      }
      const response = await api.post<ApiEnvelope<Branch>>('/branches', payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['branches'] });
      onClose();
    },
    onError: (err) => {
      setFormError(getApiErrorMessage(err, 'Could not save the branch.'));
    },
  });

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setFormError(null);
    if (!name.trim()) {
      setFormError('Branch name is required.');
      return;
    }
    mutation.mutate();
  }

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? 'Edit branch' : 'Add new branch'}>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Branch name</label>
          <input
            className={inputClass}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. SM Branch"
            required
            maxLength={100}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Address <span className="text-slate-400">(optional)</span>
          </label>
          <textarea
            className={inputClass}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            rows={2}
            placeholder="Street, city, province"
          />
        </div>

        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
          />
          Active
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
            {mutation.isPending ? 'Saving…' : isEdit ? 'Save changes' : 'Create branch'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
