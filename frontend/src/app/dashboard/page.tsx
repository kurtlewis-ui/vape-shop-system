'use client';

import { useState } from 'react';
import { Store, Package, DollarSign, Users } from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const salesData = [
  { name: 'Monday', sales: 140000 },
  { name: 'Tuesday', sales: 152000 },
  { name: 'Wednesday', sales: 120000 },
  { name: 'Thursday', sales: 60000 },
  { name: 'Friday', sales: 8000 },
  { name: 'Saturday', sales: 2000 },
  { name: 'Sunday', sales: 1000 },
];

const topProducts = [
  { name: 'Product A', sold: 1900, fill: '#3b82f6' },
  { name: 'Product B', sold: 1220, fill: '#f97316' },
  { name: 'Product C', sold: 700, fill: '#ef4444' },
  { name: 'Product D', sold: 690, fill: '#14b8a6' },
  { name: 'Product E', sold: 480, fill: '#84cc16' },
  { name: 'Product F', sold: 450, fill: '#eab308' },
  { name: 'Product G', sold: 400, fill: '#8b5cf6' },
  { name: 'Product H', sold: 370, fill: '#ec4899' },
  { name: 'Product I', sold: 310, fill: '#f472b6' },
  { name: 'Product J', sold: 280, fill: '#a8a29e' },
];

const shops = ['All Shops', 'Main Branch', 'Downtown Branch', 'Mall Branch'];

export default function DashboardPage() {
  const [salesPeriod, setSalesPeriod] = useState('Daily');
  const [salesShop, setSalesShop] = useState('All Shops');
  const [topPeriod, setTopPeriod] = useState('This Month');
  const [topShop, setTopShop] = useState('All Shops');

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <p className="text-sm text-accent-primary font-medium uppercase">Overview</p>
        <h1 className="text-2xl font-bold text-text-primary">Dashboard</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard icon={<Store size={24} />} iconBg="bg-red-100" iconColor="text-accent-primary" value="12 Shops" />
        <StatsCard icon={<Package size={24} />} iconBg="bg-red-100" iconColor="text-accent-primary" value="82 Products" subtitle="13 brands" />
        <StatsCard icon={<DollarSign size={24} />} iconBg="bg-green-100" iconColor="text-accent-green" value="2 Pending Sales" subtitle="6420 Approved Sales" />
        <StatsCard icon={<Users size={24} />} iconBg="bg-blue-100" iconColor="text-accent-blue" value="29 Staff/s" subtitle="5 Admin/s" />
      </div>

      {/* Sales Overview Chart */}
      <div className="bg-card-bg border border-card-border rounded-lg p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h2 className="text-lg font-bold text-text-primary">Sales Overview</h2>
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={salesPeriod}
              onChange={(e) => setSalesPeriod(e.target.value)}
              className="border border-input-border rounded px-3 py-1.5 text-sm text-text-primary bg-input-bg focus:outline-none focus:border-input-focus"
            >
              <option>Daily</option>
              <option>Weekly</option>
              <option>Monthly</option>
              <option>Last 10 Years</option>
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
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => v.toLocaleString()} />
              <Tooltip formatter={(value) => [`₱${Number(value).toLocaleString()}`, 'Sales']} />
              <defs>
                <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="sales" stroke="#3b82f6" fillOpacity={1} fill="url(#salesGradient)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top 10 Best-Selling Products */}
      <div className="bg-card-bg border border-card-border rounded-lg p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h2 className="text-lg font-bold text-text-primary">Top 10 Best-Selling Products</h2>
          <div className="flex items-center gap-2">
            <select
              value={topPeriod}
              onChange={(e) => setTopPeriod(e.target.value)}
              className="border border-input-border rounded px-3 py-1.5 text-sm text-text-primary bg-input-bg focus:outline-none focus:border-input-focus"
            >
              <option>All Time</option>
              <option>This Week</option>
              <option>This Month</option>
              <option>This Year</option>
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
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topProducts}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" stroke="#6b7280" fontSize={11} tickLine={false} axisLine={false} angle={-20} textAnchor="end" height={60} />
              <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip formatter={(value) => [Number(value).toLocaleString(), 'Units Sold']} />
              <Bar dataKey="sold" radius={[4, 4, 0, 0]}>
                {topProducts.map((entry, index) => (
                  <rect key={index} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function StatsCard({
  icon,
  iconBg,
  iconColor,
  value,
  subtitle,
}: {
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  value: string;
  subtitle?: string;
}) {
  return (
    <div className="bg-card-bg border border-card-border rounded-lg p-4 flex items-center gap-4">
      <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${iconBg}`}>
        <span className={iconColor}>{icon}</span>
      </div>
      <div>
        <p className="text-base font-bold text-text-primary">{value}</p>
        {subtitle && <p className="text-xs text-text-secondary">{subtitle}</p>}
      </div>
    </div>
  );
}
