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
        <p className="text-sm text-accent-purple font-semibold uppercase tracking-wider">Overview</p>
        <h1 className="text-3xl font-extrabold text-gradient">Dashboard</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          href="/dashboard/shops"
          icon={<Store size={24} />}
          iconBg="bg-gradient-to-br from-accent-primary/30 to-accent-primary/5 ring-1 ring-inset ring-accent-primary/20"
          iconColor="text-accent-purple-light"
          glow="hover:shadow-accent-primary/20"
          value="0"
          label="Shops"
        />
        <StatsCard
          href="/dashboard/products"
          icon={<Package size={24} />}
          iconBg="bg-gradient-to-br from-accent-cyan/30 to-accent-cyan/5 ring-1 ring-inset ring-accent-cyan/20"
          iconColor="text-accent-cyan"
          glow="hover:shadow-accent-cyan/20"
          value="0"
          label="Products"
          subtitle="0 brands"
        />
        <StatsCard
          href="/dashboard/sales/pending"
          icon={<PhilippinePeso size={24} />}
          iconBg="bg-gradient-to-br from-accent-green/30 to-accent-green/5 ring-1 ring-inset ring-accent-green/20"
          iconColor="text-accent-green"
          glow="hover:shadow-accent-green/20"
          value="0"
          label="Pending Sales"
          subtitle="0 Approved Sales"
        />
        <StatsCard
          href="/dashboard/users"
          icon={<Users size={24} />}
          iconBg="bg-gradient-to-br from-accent-blue/30 to-accent-blue/5 ring-1 ring-inset ring-accent-blue/20"
          iconColor="text-accent-blue"
          glow="hover:shadow-accent-blue/20"
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
  glow,
  value,
  label,
  subtitle,
}: {
  href: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  glow?: string;
  value: string;
  label: string;
  subtitle?: string;
}) {
  return (
    <Link
      href={href}
      className={`group bg-card-bg border border-card-border rounded-xl p-4 flex items-center gap-4 transition-all duration-200 hover:-translate-y-1 hover:border-accent-primary/50 hover:shadow-xl ${glow ?? ''}`}
    >
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-110 ${iconBg}`}
      >
        <span className={iconColor}>{icon}</span>
      </div>
      <div>
        <p className="text-2xl font-extrabold text-text-primary leading-tight">{value}</p>
        <p className="text-sm font-medium text-text-secondary">{label}</p>
        {subtitle && <p className="text-xs text-text-muted">{subtitle}</p>}
      </div>
    </Link>
  );
}

function EmptyChart({ message }: { message: string }) {
  return (
    <div className="h-72 flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-card-border bg-gradient-to-b from-white/[0.02] to-transparent text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-primary/20 to-accent-pink/10 ring-1 ring-inset ring-accent-primary/20">
        <BarChart3 size={32} className="text-accent-purple-light" />
      </div>
      <p className="text-sm font-semibold text-text-secondary">{message}</p>
      <p className="text-xs text-text-muted">Charts will populate once sales are recorded.</p>
    </div>
  );
}
