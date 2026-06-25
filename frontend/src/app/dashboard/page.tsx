'use client';

import { useAuthStore } from '@/lib/store';
import { Package, AlertTriangle, ShoppingCart, DollarSign, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const salesData = [
  { name: 'Jan', sales: 4000 },
  { name: 'Feb', sales: 3000 },
  { name: 'Mar', sales: 5000 },
  { name: 'Apr', sales: 4500 },
  { name: 'May', sales: 6000 },
  { name: 'Jun', sales: 5500 },
  { name: 'Jul', sales: 7000 },
  { name: 'Aug', sales: 6500 },
  { name: 'Sep', sales: 8000 },
  { name: 'Oct', sales: 7500 },
  { name: 'Nov', sales: 9000 },
  { name: 'Dec', sales: 8500 },
];

const recentOrders = [
  { id: 'ORD-001', customer: 'John Smith', date: '2024-01-15', total: '$125.00', status: 'Completed' },
  { id: 'ORD-002', customer: 'Sarah Johnson', date: '2024-01-15', total: '$89.50', status: 'Processing' },
  { id: 'ORD-003', customer: 'Mike Wilson', date: '2024-01-14', total: '$234.00', status: 'Completed' },
  { id: 'ORD-004', customer: 'Emily Davis', date: '2024-01-14', total: '$56.75', status: 'Pending' },
  { id: 'ORD-005', customer: 'Robert Brown', date: '2024-01-13', total: '$178.25', status: 'Completed' },
];

const topProducts = [
  { name: 'Elf Bar BC5000', sold: 245, revenue: '$4,900' },
  { name: 'JUUL Starter Kit', sold: 189, revenue: '$7,560' },
  { name: 'Vaporesso XROS 3', sold: 156, revenue: '$4,680' },
  { name: 'Lost Mary BM5000', sold: 134, revenue: '$2,680' },
  { name: 'SMOK Nord 5', sold: 121, revenue: '$3,630' },
];

const statsCards = [
  {
    title: 'Total Products',
    value: '1,234',
    change: '+12.5%',
    trend: 'up',
    icon: <Package size={20} />,
    iconBg: 'bg-accent-purple/15',
    iconColor: 'text-accent-purple',
  },
  {
    title: 'Low Stock Items',
    value: '23',
    change: '23 items',
    trend: 'warning',
    icon: <AlertTriangle size={20} />,
    iconBg: 'bg-accent-orange/15',
    iconColor: 'text-accent-orange',
  },
  {
    title: 'Total Orders',
    value: '856',
    change: '+8.2%',
    trend: 'up',
    icon: <ShoppingCart size={20} />,
    iconBg: 'bg-accent-blue/15',
    iconColor: 'text-accent-blue',
  },
  {
    title: 'Total Revenue',
    value: '$48,295',
    change: '+15.3%',
    trend: 'up',
    icon: <DollarSign size={20} />,
    iconBg: 'bg-accent-green/15',
    iconColor: 'text-accent-green',
  },
];

function getStatusStyle(status: string) {
  switch (status) {
    case 'Completed':
      return 'bg-accent-green/10 text-accent-green';
    case 'Processing':
      return 'bg-accent-blue/10 text-accent-blue';
    case 'Pending':
      return 'bg-accent-orange/10 text-accent-orange';
    case 'Cancelled':
      return 'bg-accent-red/10 text-accent-red';
    default:
      return 'bg-text-muted/10 text-text-muted';
  }
}

export default function DashboardOverview() {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">
          Dashboard
        </h1>
        <p className="mt-1 text-text-secondary">
          Welcome back{user ? `, ${user.firstName}` : ''}! Here&apos;s your store overview.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((card) => (
          <div
            key={card.title}
            className="rounded-2xl bg-gradient-to-br from-dark-card-hover to-dark-card border border-dark-border p-5 transition-all hover:border-accent-purple/20"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${card.iconBg}`}>
                <span className={card.iconColor}>{card.icon}</span>
              </div>
              <span className={`flex items-center gap-1 text-xs font-semibold ${
                card.trend === 'up' ? 'text-accent-green' : 'text-accent-orange'
              }`}>
                {card.trend === 'up' && <ArrowUpRight size={14} />}
                {card.change}
              </span>
            </div>
            <div className="text-2xl font-bold text-white">{card.value}</div>
            <div className="mt-1 text-sm text-text-secondary">{card.title}</div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Sales Overview Chart */}
        <div className="lg:col-span-2 rounded-2xl bg-gradient-to-br from-dark-card-hover to-dark-card border border-dark-border p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Sales Overview</h2>
            <select className="rounded-lg border border-dark-border bg-input-bg px-3 py-1.5 text-sm text-white outline-none focus:border-accent-purple">
              <option>This Year</option>
              <option>Last Year</option>
            </select>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="#8b8fa3" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#8b8fa3" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    background: '#1e2a4a',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    color: '#fff',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="#7c3aed"
                  fillOpacity={1}
                  fill="url(#colorSales)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Selling Products */}
        <div className="rounded-2xl bg-gradient-to-br from-dark-card-hover to-dark-card border border-dark-border p-6">
          <h2 className="text-lg font-semibold text-white mb-5">Top Products</h2>
          <div className="space-y-3">
            {topProducts.map((product, index) => (
              <div
                key={index}
                className="flex items-center gap-3 rounded-xl p-3 hover:bg-white/[0.02] transition-colors"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-purple/15 text-xs font-bold text-accent-purple">
                  {index + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{product.name}</p>
                  <p className="text-xs text-text-muted">{product.sold} sold</p>
                </div>
                <span className="text-sm font-semibold text-accent-green">{product.revenue}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="rounded-2xl bg-gradient-to-br from-dark-card-hover to-dark-card border border-dark-border p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-white">Recent Orders</h2>
          <button className="text-sm font-medium text-accent-purple hover:text-accent-purple-light transition-colors">
            View All →
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-border">
                <th className="text-left pb-3 pr-4 text-xs font-medium uppercase tracking-wider text-text-muted">Order ID</th>
                <th className="text-left pb-3 pr-4 text-xs font-medium uppercase tracking-wider text-text-muted">Customer</th>
                <th className="text-left pb-3 pr-4 text-xs font-medium uppercase tracking-wider text-text-muted">Date</th>
                <th className="text-left pb-3 pr-4 text-xs font-medium uppercase tracking-wider text-text-muted">Total</th>
                <th className="text-left pb-3 text-xs font-medium uppercase tracking-wider text-text-muted">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b border-dark-border/50 last:border-0">
                  <td className="py-3.5 pr-4 text-sm font-medium text-white">{order.id}</td>
                  <td className="py-3.5 pr-4 text-sm text-text-secondary">{order.customer}</td>
                  <td className="py-3.5 pr-4 text-sm text-text-muted">{order.date}</td>
                  <td className="py-3.5 pr-4 text-sm font-medium text-white">{order.total}</td>
                  <td className="py-3.5">
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getStatusStyle(order.status)}`}>
                      {order.status}
                    </span>
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
