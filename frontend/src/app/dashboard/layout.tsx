'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store';

const navItems = [
  { label: 'Overview', href: '/dashboard', enabled: true },
  { label: 'Users', href: '/dashboard/users', enabled: true },
  { label: 'Products', href: '/dashboard/products', enabled: false },
  { label: 'Inventory', href: '/dashboard/inventory', enabled: false },
  { label: 'Sales', href: '/dashboard/sales', enabled: false },
  { label: 'Reports', href: '/dashboard/reports', enabled: false },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, accessToken, logout } = useAuthStore();

  // Wait until after mount so we read the persisted token (localStorage) on the
  // client and avoid a server/client hydration mismatch.
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !accessToken) {
      router.replace('/login');
    }
  }, [mounted, accessToken, router]);

  function handleLogout() {
    logout();
    router.replace('/login');
  }

  if (!mounted) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-slate-500">Loading…</p>
      </main>
    );
  }

  if (!accessToken) {
    return null;
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="hidden w-60 flex-col bg-slate-900 p-4 text-slate-200 md:flex">
        <div className="mb-8 px-2 text-lg font-bold text-white">Vape Shop</div>
        <nav className="flex flex-1 flex-col gap-1">
          {navItems.map((item) => {
            const active = pathname === item.href;
            if (!item.enabled) {
              return (
                <span
                  key={item.href}
                  className="cursor-not-allowed rounded-lg px-3 py-2 text-sm text-slate-500"
                >
                  {item.label}
                  <span className="ml-2 text-[10px] uppercase">soon</span>
                </span>
              );
            }
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-lg px-3 py-2 text-sm transition ${
                  active ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-3">
          <div className="text-sm text-slate-500">
            {user ? (
              <>
                Signed in as{' '}
                <span className="font-medium text-slate-900">{user.email}</span>{' '}
                <span className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                  {user.role?.name}
                </span>
              </>
            ) : (
              'Signed in'
            )}
          </div>
          <button
            onClick={handleLogout}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          >
            Log out
          </button>
        </header>

        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
