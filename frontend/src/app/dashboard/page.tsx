'use client';

import Link from 'next/link';
import { useAuthStore } from '@/lib/store';

export default function DashboardOverview() {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Welcome{user ? `, ${user.firstName}` : ''} 👋
        </h1>
        <p className="mt-1 text-slate-500">
          This is your vape shop management dashboard.
        </p>
      </div>

      {user?.mustChangePassword && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Your account is flagged to change its password. Use the backend
          <code className="mx-1 rounded bg-amber-100 px-1">POST /auth/change-password</code>
          endpoint to update it.
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/dashboard/users"
          className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
        >
          <div className="text-sm font-medium text-indigo-600">User management</div>
          <div className="mt-1 text-lg font-semibold text-slate-900">View users →</div>
          <p className="mt-1 text-sm text-slate-500">
            Browse all staff accounts pulled live from the API.
          </p>
        </Link>

        {['Products', 'Inventory', 'Sales', 'Reports'].map((name) => (
          <div
            key={name}
            className="rounded-xl border border-dashed border-slate-200 bg-white/60 p-5"
          >
            <div className="text-sm font-medium text-slate-400">{name}</div>
            <div className="mt-1 text-lg font-semibold text-slate-400">Coming soon</div>
            <p className="mt-1 text-sm text-slate-400">Not implemented yet.</p>
          </div>
        ))}
      </div>
    </div>
  );
}
