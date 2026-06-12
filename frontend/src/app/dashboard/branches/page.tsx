'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api, getApiErrorMessage } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import type { ApiEnvelope, Branch } from '@/lib/types';
import { BranchModal } from '@/components/BranchModal';

async function fetchBranches(): Promise<Branch[]> {
  const response = await api.get<ApiEnvelope<Branch[]>>('/branches');
  return response.data.data;
}

export default function BranchesPage() {
  const currentRole = useAuthStore((s) => s.user?.role?.name);
  const isAdmin = currentRole === 'Owner' || currentRole === 'Admin';

  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Branch | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ['branches'],
    queryFn: fetchBranches,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/branches/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['branches'] });
      setDeleteError(null);
    },
    onError: (err) => {
      setDeleteError(getApiErrorMessage(err, 'Could not delete the branch.'));
    },
  });

  function handleEdit(branch: Branch) {
    setEditing(branch);
    setModalOpen(true);
  }

  function handleAdd() {
    setEditing(null);
    setModalOpen(true);
  }

  function handleDelete(branch: Branch) {
    if (
      !confirm(
        `Delete branch "${branch.name}"? This cannot be undone.\n\n` +
          'Tip: any staff assigned to this branch must be reassigned first.',
      )
    ) {
      return;
    }
    deleteMutation.mutate(branch.id);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Branches</h1>
          <p className="mt-1 text-slate-500">
            Stores/locations where products are stocked and sold.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:opacity-60"
          >
            {isFetching ? 'Refreshing…' : 'Refresh'}
          </button>
          {isAdmin && (
            <button
              onClick={handleAdd}
              className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-indigo-700"
            >
              + Add branch
            </button>
          )}
        </div>
      </div>

      {deleteError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {deleteError}
        </div>
      )}

      {isLoading && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 text-slate-500">
          Loading branches…
        </div>
      )}

      {isError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
          {getApiErrorMessage(error, 'Could not load branches.')}
        </div>
      )}

      {data && (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Address</th>
                <th className="px-4 py-3">Staff</th>
                <th className="px-4 py-3">Status</th>
                {isAdmin && <th className="px-4 py-3 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">{b.name}</td>
                  <td className="px-4 py-3 text-slate-600">
                    {b.address || <span className="text-slate-400">—</span>}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{b.staffCount}</td>
                  <td className="px-4 py-3">
                    {b.isActive ? (
                      <span className="rounded bg-green-100 px-2 py-0.5 text-xs text-green-700">
                        Active
                      </span>
                    ) : (
                      <span className="rounded bg-slate-200 px-2 py-0.5 text-xs text-slate-600">
                        Inactive
                      </span>
                    )}
                  </td>
                  {isAdmin && (
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(b)}
                          className="whitespace-nowrap rounded-lg border border-slate-300 px-2.5 py-1 text-xs font-medium text-slate-700 transition hover:bg-slate-100"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(b)}
                          disabled={deleteMutation.isPending}
                          className="whitespace-nowrap rounded-lg border border-red-300 px-2.5 py-1 text-xs font-medium text-red-700 transition hover:bg-red-50 disabled:opacity-60"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
              {data.length === 0 && (
                <tr>
                  <td
                    colSpan={isAdmin ? 5 : 4}
                    className="px-4 py-6 text-center text-slate-400"
                  >
                    No branches yet.
                    {isAdmin && (
                      <>
                        {' '}
                        Click <span className="font-medium">+ Add branch</span> to create one.
                      </>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {isAdmin && (
        <BranchModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          branch={editing}
        />
      )}
    </div>
  );
}
