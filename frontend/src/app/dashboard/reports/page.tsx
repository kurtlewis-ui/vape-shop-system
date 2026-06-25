'use client';

import { useState } from 'react';
import { Calendar, TrendingUp, DollarSign, ShoppingCart, Users } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, LineChart, Line,
} from 'recharts';

const revenueData = [
  { name: 'Jan', revenue: 12400 },
  { name: 'Feb', revenue: 11800 },
  { name: 'Mar', revenue: 15600 },
  { name: 'Apr', revenue: 14200 },
  { name: 'May', revenue: 18900 },
  { name: 'Jun', revenue: 17100 },
  { name: 'Jul', revenue: 21300 },
  { name: 'Aug', revenue: 19800 },
  { name: 'Sep', revenue: 24500 },
  { name: 'Oct', revenue: 22100 },
  { name: 'Nov', revenue: 27800 },
  { name: 'Dec', revenue: 25400 },
];

const categoryData = [
  { name: 'Disposables', value: 35, color: '#7c3aed' },
  { name: 'Pod Systems', value: 25, color: '#38bdf8' },
  { name: 'E-Liquids', value: 20, color: '#4ade80' },
  { name: 'Mods & Kits', value: 12, color: '#fb923c' },
  { name: 'Accessories', value: 8, color: '#f472b6' },
];

const weeklyData = [
  { name: 'Mon', orders: 42, revenue: 3200 },
  { name: 'Tue', orders: 38, revenue: 2800 },
  { name: 'Wed', orders: 55, revenue: 4100 },
  { name: 'Thu', orders: 48, revenue: 3600 },
  { name: 'Fri', orders: 62, revenue: 4800 },
  { name: 'Sat', orders: 71, revenue: 5500 },
  { name: 'Sun', orders: 45, revenue: 3400 },
];

const topProductsRevenue = [
  { name: 'Elf Bar BC5000', revenue: '$12,450', units: 498, growth: '+18%' },
  { name: 'JUUL Starter Kit', revenue: '$9,800', units: 245, growth: '+12%' },
  { name: 'Vaporesso XROS 3', revenue: '$7,560', units: 189, growth: '+22%' },
  { name: 'Lost Mary BM5000', revenue: '$6,340', units: 317, growth: '+8%' },
  { name: 'SMOK Nord 5', revenue: '$5,890', units: 147, growth: '+15%' },
];

const chartTooltipStyle = {
  background: '#1e2a4a',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '12px',
  color: '#fff',
  boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
};

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState('this-year');

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Reports & Analytics</h1>
          <p className="mt-1 text-text-secondary">Track your store performance and insights</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="rounded-xl border border-dark-border bg-dark-card px-4 py-2.5 text-sm text-text-secondary outline-none focus:border-accent-purple transition-all"
          >
            <option value="this-week">This Week</option>
            <option value="this-month">This Month</option>
            <option value="this-year">This Year</option>
            <option value="custom">Custom Range</option>
          </select>
          <button className="flex items-center gap-2 rounded-xl border border-dark-border bg-dark-card px-4 py-2.5 text-sm text-text-secondary hover:text-white hover:border-accent-purple/30 transition-all">
            <Calendar size={16} />
            Custom
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl bg-gradient-to-br from-dark-card-hover to-dark-card border border-dark-border p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-green/15">
              <DollarSign size={20} className="text-accent-green" />
            </div>
            <span className="text-xs font-semibold text-accent-green">+15.3%</span>
          </div>
          <p className="text-2xl font-bold text-white">$231,900</p>
          <p className="text-sm text-text-secondary mt-1">Total Revenue</p>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-dark-card-hover to-dark-card border border-dark-border p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-blue/15">
              <ShoppingCart size={20} className="text-accent-blue" />
            </div>
            <span className="text-xs font-semibold text-accent-green">+8.2%</span>
          </div>
          <p className="text-2xl font-bold text-white">8,456</p>
          <p className="text-sm text-text-secondary mt-1">Total Orders</p>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-dark-card-hover to-dark-card border border-dark-border p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-purple/15">
              <Users size={20} className="text-accent-purple" />
            </div>
            <span className="text-xs font-semibold text-accent-green">+12.1%</span>
          </div>
          <p className="text-2xl font-bold text-white">2,345</p>
          <p className="text-sm text-text-secondary mt-1">Total Customers</p>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-dark-card-hover to-dark-card border border-dark-border p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-orange/15">
              <TrendingUp size={20} className="text-accent-orange" />
            </div>
            <span className="text-xs font-semibold text-accent-green">+5.7%</span>
          </div>
          <p className="text-2xl font-bold text-white">$27.42</p>
          <p className="text-sm text-text-secondary mt-1">Avg. Order Value</p>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="rounded-2xl bg-gradient-to-br from-dark-card-hover to-dark-card border border-dark-border p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-white">Revenue Overview</h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-accent-purple" />
              <span className="text-xs text-text-secondary">Revenue</span>
            </div>
          </div>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" stroke="#8b8fa3" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#8b8fa3" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
              <Tooltip contentStyle={chartTooltipStyle} formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Revenue']} />
              <Bar dataKey="revenue" fill="#7c3aed" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Orders Chart */}
        <div className="rounded-2xl bg-gradient-to-br from-dark-card-hover to-dark-card border border-dark-border p-6">
          <h2 className="text-lg font-semibold text-white mb-6">Weekly Orders</h2>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="#8b8fa3" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#8b8fa3" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={chartTooltipStyle} />
                <Line type="monotone" dataKey="orders" stroke="#38bdf8" strokeWidth={2} dot={{ fill: '#38bdf8', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="rounded-2xl bg-gradient-to-br from-dark-card-hover to-dark-card border border-dark-border p-6">
          <h2 className="text-lg font-semibold text-white mb-6">Sales by Category</h2>
          <div className="flex items-center gap-6">
            <div className="h-48 w-48 flex-shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={chartTooltipStyle} formatter={(value) => [`${value}%`, 'Share']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3 flex-1">
              {categoryData.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm text-text-secondary">{item.name}</span>
                  </div>
                  <span className="text-sm font-medium text-white">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Top Products by Revenue */}
      <div className="rounded-2xl bg-gradient-to-br from-dark-card-hover to-dark-card border border-dark-border p-6">
        <h2 className="text-lg font-semibold text-white mb-5">Top Products by Revenue</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-border">
                <th className="text-left pb-3 pr-4 text-xs font-medium uppercase tracking-wider text-text-muted">#</th>
                <th className="text-left pb-3 pr-4 text-xs font-medium uppercase tracking-wider text-text-muted">Product</th>
                <th className="text-left pb-3 pr-4 text-xs font-medium uppercase tracking-wider text-text-muted">Revenue</th>
                <th className="text-left pb-3 pr-4 text-xs font-medium uppercase tracking-wider text-text-muted">Units Sold</th>
                <th className="text-left pb-3 text-xs font-medium uppercase tracking-wider text-text-muted">Growth</th>
              </tr>
            </thead>
            <tbody>
              {topProductsRevenue.map((product, index) => (
                <tr key={index} className="border-b border-dark-border/50 last:border-0">
                  <td className="py-3.5 pr-4">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent-purple/15 text-xs font-bold text-accent-purple">
                      {index + 1}
                    </span>
                  </td>
                  <td className="py-3.5 pr-4 text-sm font-medium text-white">{product.name}</td>
                  <td className="py-3.5 pr-4 text-sm font-semibold text-white">{product.revenue}</td>
                  <td className="py-3.5 pr-4 text-sm text-text-secondary">{product.units}</td>
                  <td className="py-3.5">
                    <span className="text-sm font-medium text-accent-green">{product.growth}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
