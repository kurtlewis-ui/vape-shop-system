'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  BarChart3,
  Settings,
  LogOut,
  Bell,
  Search,
  Menu,
  X,
  ChevronDown,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  enabled: boolean;
  roles?: string[];
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard size={20} />, enabled: true },
  { label: 'Inventory', href: '/dashboard/inventory', icon: <Package size={20} />, enabled: true },
  { label: 'Orders', href: '/dashboard/orders', icon: <ShoppingCart size={20} />, enabled: true },
  { label: 'Reports', href: '/dashboard/reports', icon: <BarChart3 size={20} />, enabled: true, roles: ['Owner', 'Admin'] },
  { label: 'Settings', href: '/dashboard/settings', icon: <Settings size={20} />, enabled: true },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, accessToken, logout } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
      <main className="flex min-h-screen items-center justify-center bg-dark-bg">
        <div className="flex items-center gap-3">
          <svg className="h-6 w-6 animate-spin text-accent-purple" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-text-secondary">Loading...</p>
        </div>
      </main>
    );
  }

  if (!accessToken) {
    return null;
  }

  const currentRole = user?.role?.name;
  const visibleNav = navItems.filter(
    (item) => !item.roles || (currentRole && item.roles.includes(currentRole)),
  );

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  };

  return (
    <div className="flex min-h-screen bg-dark-bg">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-dark-sidebar border-r border-dark-border transition-transform duration-300 md:static md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 px-6 border-b border-dark-border">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-accent-purple to-accent-purple-light">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/>
              <line x1="7" y1="7" x2="7.01" y2="7"/>
            </svg>
          </div>
          <span className="text-lg font-bold text-white">Vape Shop</span>
          <button
            className="ml-auto md:hidden text-text-secondary hover:text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {visibleNav.map((item) => {
            const active = isActive(item.href);
            if (!item.enabled) {
              return (
                <span
                  key={item.href}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-text-muted cursor-not-allowed"
                >
                  {item.icon}
                  {item.label}
                  <span className="ml-auto text-[10px] uppercase bg-dark-card px-2 py-0.5 rounded-full">soon</span>
                </span>
              );
            }
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                  active
                    ? 'bg-accent-purple/15 text-accent-purple-light shadow-sm'
                    : 'text-text-secondary hover:bg-dark-card hover:text-white'
                }`}
              >
                <span className={active ? 'text-accent-purple' : ''}>{item.icon}</span>
                {item.label}
                {active && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-accent-purple" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="border-t border-dark-border p-4">
          <div className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-dark-card transition-colors cursor-pointer">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-accent-purple to-accent-blue text-sm font-bold text-white">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-text-muted truncate">{user?.role?.name}</p>
            </div>
            <ChevronDown size={16} className="text-text-muted" />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-dark-border bg-dark-bg/80 backdrop-blur-xl px-6">
          <button
            className="md:hidden text-text-secondary hover:text-white"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={20} />
          </button>

          {/* Search */}
          <div className="hidden md:flex flex-1 max-w-md">
            <div className="relative w-full">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                placeholder="Search products, orders..."
                className="w-full rounded-xl border border-dark-border bg-dark-card pl-10 pr-4 py-2 text-sm text-white placeholder-text-muted outline-none transition-all focus:border-accent-purple focus:ring-1 focus:ring-accent-purple/20"
              />
            </div>
          </div>

          <div className="flex-1 md:hidden" />

          {/* Header Actions */}
          <div className="flex items-center gap-3">
            {/* Notifications */}
            <button className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-dark-border bg-dark-card text-text-secondary hover:text-white hover:border-accent-purple/30 transition-all">
              <Bell size={18} />
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent-purple text-[10px] font-bold text-white">
                3
              </span>
            </button>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex h-9 items-center gap-2 rounded-xl border border-dark-border bg-dark-card px-3 text-sm text-text-secondary hover:text-white hover:border-accent-red/30 transition-all"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
