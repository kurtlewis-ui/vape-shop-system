'use client';

import { useQuery } from '@tanstack/react-query';
import { api, getApiErrorMessage } from '@/lib/api';
import type { ApiEnvelope, UserListItem } from '@/lib/types';

async function fetchUsers(): Promise<UserListItem[]> {
  const response = await api.get<ApiEnvelope<UserListItem[]>>('/users');
  return response.data.data;
}

export default function UsersPage() {
  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Users</h1>
          <p className="mt-1 text-slate-500">All staff accounts from the backend.</p>
        </div>
        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:opacity-60"
        >
          {isFetching ? 'Refreshing…' : 'Refresh'}
        </button>
      </div>

      {isLoading && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 text-slate-500">
          Loading users…
        </div>
      )}

      {isError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
          {getApiErrorMessage(error, 'Could not load users.')}
        </div>
      )}

      {data && (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">
                    {u.firstName} {u.lastName}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-700">
                      {u.role?.name}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {u.isActive ? (
                      <span className="rounded bg-green-100 px-2 py-0.5 text-xs text-green-700">
                        Active
                      </span>
                    ) : (
                      <span className="rounded bg-slate-200 px-2 py-0.5 text-xs text-slate-600">
                        Inactive
                      </span>
                    )}
                  </td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-slate-400">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
