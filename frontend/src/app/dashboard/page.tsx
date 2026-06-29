'use client';

import Link from 'next/link';
import { Store, Package, PhilippinePeso, Users, BarChart3 } from 'lucide-react';
import { useDashboardStats } from '@/lib/hooks';

export default function DashboardPage() {
  const { data: stats, isLoading } = useDashboardStats();

  const v = (n?: number) => (isLoading || n === undefined ? '—' : n.toLocaleString());

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs text-text-muted font-medium uppercase tracking-wider">Overview</p>
        <h1 className="text-2xl font-bold text-text-primary">Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          href="/dashboard/shops"
          icon={<Store size={24} />}
          value={v(stats?.shops)}
          label="Shops"
        />
        <StatsCard
          href="/dashboard/products"
          icon={<Package size={24} />}
          value={v(stats?.products)}
          label="Products"
          subtitle={`${v(stats?.brands)} brands`}
        />
        <StatsCard
          href="/dashboard/sales/pending"
          icon={<PhilippinePeso size={24} />}
          value={v(stats?.pendingSales)}
          label="Pending Sales"
          subtitle={`${v(stats?.approvedSales)} Approved Sales`}
        />
        <StatsCard
          href="/dashboard/users"
          icon={<Users size={24} />}
          value={v(stats?.staff)}
          label="Staff"
          subtitle={`${v(stats?.admins)} Admins`}
        />
      </div>

      <div className="bg-card-bg border border-card-border rounded-xl p-6 shadow-sm shadow-black/20">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h2 className="text-lg font-bold text-text-primary">Sales Overview</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SummaryTile label="Approved sales (count)" value={v(stats?.approvedSales)} />
          <SummaryTile
            label="Approved sales (total)"
            value={isLoading || stats === undefined ? '—' : `\u20B1${stats.approvedSalesTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          />
        </div>
      </div>

      <div className="bg-card-bg border border-card-border rounded-xl p-6 shadow-sm shadow-black/20">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h2 className="text-lg font-bold text-text-primary">Top 10 Best-Selling Products</h2>
        </div>
        <EmptyChart message="Per-product sales charts are coming next" />
      </div>
    </div>
  );
}

function StatsCard({ href, icon, value, label, subtitle }: { href: string; icon: React.ReactNode; value: string; label: string; subtitle?: string }) {
  return (
    <Link href={href} className="group bg-card-bg border border-card-border rounded-xl p-4 flex items-center gap-4 transition-colors duration-200 hover:border-accent-primary/40">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-primary/10">
        <span className="text-accent-primary">{icon}</span>
      </div>
      <div>
        <p className="text-2xl font-bold text-text-primary leading-tight">{value}</p>
        <p className="text-sm font-medium text-text-secondary">{label}</p>
        {subtitle && <p className="text-xs text-text-muted">{subtitle}</p>}
      </div>
    </Link>
  );
}

function SummaryTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-card-border p-4">
      <p className="text-2xl font-bold text-text-primary">{value}</p>
      <p className="text-sm text-text-secondary">{label}</p>
    </div>
  );
}

function EmptyChart({ message }: { message: string }) {
  return (
    <div className="h-56 flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-card-border text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-primary/10">
        <BarChart3 size={28} className="text-accent-primary" />
      </div>
      <p className="text-sm font-medium text-text-secondary">{message}</p>
    </div>
  );
}
