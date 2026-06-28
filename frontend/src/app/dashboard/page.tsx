'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Store, Package, PhilippinePeso, Users, BarChart3 } from 'lucide-react';

// Filters are kept for when the sales backend is wired up. There is no
// hardcoded sales data here on purpose — the dashboard shows honest
// zero/empty states until real data is available.
const periodOptions = ['Daily', 'Weekly', 'Monthly', 'Last 10 Years'];
const topPeriodOptions = ['All Time', 'This Week', 'This Month', 'This Year'];
const shops = ['All Shops'];

export default function DashboardPage() {
  const [salesPeriod, setSalesPeriod] = useState('Daily');
  const [salesShop, setSalesShop] = useState('All Shops');
  const [topPeriod, setTopPeriod] = useState('This Month');
  const [topShop, setTopShop] = useState('All Shops');

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <p className="text-xs text-text-muted font-medium uppercase tracking-wider">Overview</p>
        <h1 className="text-2xl font-bold text-text-primary">Dashboard</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          href="/dashboard/shops"
          icon={<Store size={24} />}
          iconBg="bg-accent-primary/10"
          iconColor="text-accent-primary"
          value="0"
          label="Shops"
        />
        <StatsCard
          href="/dashboard/products"
          icon={<Package size={24} />}
          iconBg="bg-accent-primary/10"
          iconColor="text-accent-primary"
          value="0"
          label="Products"
          subtitle="0 brands"
        />
        <StatsCard
          href="/dashboard/sales/pending"
          icon={<PhilippinePeso size={24} />}
          iconBg="bg-accent-primary/10"
          iconColor="text-accent-primary"
          value="0"
          label="Pending Sales"
          subtitle="0 Approved Sales"
        />
        <StatsCard
          href="/dashboard/users"
          icon={<Users size={24} />}
          iconBg="bg-accent-primary/10"
          iconColor="text-accent-primary"
          value="0"
          label="Staff"
          subtitle="0 Admins"
        />
      </div>

      {/* Sales Overview */}
      <div className="bg-card-bg border border-card-border rounded-xl p-6 shadow-sm shadow-black/20">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h2 className="text-lg font-bold text-text-primary">Sales Overview</h2>
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={salesPeriod}
              onChange={(e) => setSalesPeriod(e.target.value)}
              className="border border-input-border rounded px-3 py-1.5 text-sm text-text-primary bg-input-bg focus:outline-none focus:border-input-focus"
            >
              {periodOptions.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
            <input
              type="date"
              className="border border-input-border rounded px-3 py-1.5 text-sm text-text-primary bg-input-bg focus:outline-none focus:border-input-focus"
            />
            <select
              value={salesShop}
              onChange={(e) => setSalesShop(e.target.value)}
              className="border border-input-border rounded px-3 py-1.5 text-sm text-text-primary bg-input-bg focus:outline-none focus:border-input-focus"
            >
              {shops.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>
        <EmptyChart message="No sales data yet" />
      </div>

      {/* Top 10 Best-Selling Products */}
      <div className="bg-card-bg border border-card-border rounded-xl p-6 shadow-sm shadow-black/20">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h2 className="text-lg font-bold text-text-primary">Top 10 Best-Selling Products</h2>
          <div className="flex items-center gap-2">
            <select
              value={topPeriod}
              onChange={(e) => setTopPeriod(e.target.value)}
              className="border border-input-border rounded px-3 py-1.5 text-sm text-text-primary bg-input-bg focus:outline-none focus:border-input-focus"
            >
              {topPeriodOptions.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
            <select
              value={topShop}
              onChange={(e) => setTopShop(e.target.value)}
              className="border border-input-border rounded px-3 py-1.5 text-sm text-text-primary bg-input-bg focus:outline-none focus:border-input-focus"
            >
              {shops.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>
        <EmptyChart message="No product sales data yet" />
      </div>
    </div>
  );
}

function StatsCard({
  href,
  icon,
  iconBg,
  iconColor,
  value,
  label,
  subtitle,
}: {
  href: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  value: string;
  label: string;
  subtitle?: string;
}) {
  return (
    <Link
      href={href}
      className="group bg-card-bg border border-card-border rounded-xl p-4 flex items-center gap-4 transition-colors duration-200 hover:border-accent-primary/40"
    >
      <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${iconBg}`}>
        <span className={iconColor}>{icon}</span>
      </div>
      <div>
        <p className="text-2xl font-bold text-text-primary leading-tight">{value}</p>
        <p className="text-sm font-medium text-text-secondary">{label}</p>
        {subtitle && <p className="text-xs text-text-muted">{subtitle}</p>}
      </div>
    </Link>
  );
}

function EmptyChart({ message }: { message: string }) {
  return (
    <div className="h-72 flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-card-border text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-primary/10">
        <BarChart3 size={28} className="text-accent-primary" />
      </div>
      <p className="text-sm font-medium text-text-secondary">{message}</p>
      <p className="text-xs text-text-muted">Charts will populate once sales are recorded.</p>
    </div>
  );
}
