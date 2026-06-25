'use client';

import { useState } from 'react';
import { Search, Filter, Download, Eye, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

const orders = [
  { id: 'ORD-2401', customer: 'John Smith', email: 'john@email.com', date: '2024-01-15', items: 3, total: '$125.00', status: 'Completed', payment: 'Credit Card' },
  { id: 'ORD-2402', customer: 'Sarah Johnson', email: 'sarah@email.com', date: '2024-01-15', items: 1, total: '$89.50', status: 'Processing', payment: 'PayPal' },
  { id: 'ORD-2403', customer: 'Mike Wilson', email: 'mike@email.com', date: '2024-01-14', items: 5, total: '$234.00', status: 'Completed', payment: 'Credit Card' },
  { id: 'ORD-2404', customer: 'Emily Davis', email: 'emily@email.com', date: '2024-01-14', items: 2, total: '$56.75', status: 'Pending', payment: 'Debit Card' },
  { id: 'ORD-2405', customer: 'Robert Brown', email: 'robert@email.com', date: '2024-01-13', items: 4, total: '$178.25', status: 'Completed', payment: 'Credit Card' },
  { id: 'ORD-2406', customer: 'Lisa Anderson', email: 'lisa@email.com', date: '2024-01-13', items: 1, total: '$39.99', status: 'Cancelled', payment: 'PayPal' },
  { id: 'ORD-2407', customer: 'David Martinez', email: 'david@email.com', date: '2024-01-12', items: 6, total: '$312.50', status: 'Completed', payment: 'Credit Card' },
  { id: 'ORD-2408', customer: 'Jennifer Taylor', email: 'jennifer@email.com', date: '2024-01-12', items: 2, total: '$67.98', status: 'Processing', payment: 'Debit Card' },
  { id: 'ORD-2409', customer: 'Chris Lee', email: 'chris@email.com', date: '2024-01-11', items: 3, total: '$145.00', status: 'Completed', payment: 'Credit Card' },
  { id: 'ORD-2410', customer: 'Amanda White', email: 'amanda@email.com', date: '2024-01-11', items: 1, total: '$29.99', status: 'Pending', payment: 'PayPal' },
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

export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Orders</h1>
          <p className="mt-1 text-text-secondary">Manage and track customer orders</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-xl border border-dark-border bg-dark-card px-4 py-2.5 text-sm font-medium text-text-secondary hover:text-white hover:border-accent-purple/30 transition-all">
          <Download size={16} />
          Export
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-xl bg-dark-card border border-dark-border p-4 text-center">
          <p className="text-2xl font-bold text-white">856</p>
          <p className="text-xs text-text-muted mt-1">Total Orders</p>
        </div>
        <div className="rounded-xl bg-dark-card border border-dark-border p-4 text-center">
          <p className="text-2xl font-bold text-accent-green">742</p>
          <p className="text-xs text-text-muted mt-1">Completed</p>
        </div>
        <div className="rounded-xl bg-dark-card border border-dark-border p-4 text-center">
          <p className="text-2xl font-bold text-accent-blue">68</p>
          <p className="text-xs text-text-muted mt-1">Processing</p>
        </div>
        <div className="rounded-xl bg-dark-card border border-dark-border p-4 text-center">
          <p className="text-2xl font-bold text-accent-orange">46</p>
          <p className="text-xs text-text-muted mt-1">Pending</p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search by order ID, customer name, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-dark-border bg-dark-card pl-11 pr-4 py-2.5 text-sm text-white placeholder-text-muted outline-none transition-all focus:border-accent-purple focus:ring-1 focus:ring-accent-purple/20"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-dark-border bg-dark-card px-4 py-2.5 text-sm text-text-secondary outline-none focus:border-accent-purple transition-all"
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="processing">Processing</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <button className="flex items-center gap-2 rounded-xl border border-dark-border bg-dark-card px-4 py-2.5 text-sm text-text-secondary hover:text-white hover:border-accent-purple/30 transition-all">
            <Calendar size={16} />
            Date Range
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-2xl bg-gradient-to-br from-dark-card-hover to-dark-card border border-dark-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-border">
                <th className="text-left px-6 py-4 text-xs font-medium uppercase tracking-wider text-text-muted">Order ID</th>
                <th className="text-left px-6 py-4 text-xs font-medium uppercase tracking-wider text-text-muted">Customer</th>
                <th className="text-left px-6 py-4 text-xs font-medium uppercase tracking-wider text-text-muted">Date</th>
                <th className="text-left px-6 py-4 text-xs font-medium uppercase tracking-wider text-text-muted">Items</th>
                <th className="text-left px-6 py-4 text-xs font-medium uppercase tracking-wider text-text-muted">Total</th>
                <th className="text-left px-6 py-4 text-xs font-medium uppercase tracking-wider text-text-muted">Payment</th>
                <th className="text-left px-6 py-4 text-xs font-medium uppercase tracking-wider text-text-muted">Status</th>
                <th className="text-right px-6 py-4 text-xs font-medium uppercase tracking-wider text-text-muted">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className="border-b border-dark-border/50 last:border-0 hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4 text-sm font-semibold text-accent-purple">{order.id}</td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-white">{order.customer}</p>
                      <p className="text-xs text-text-muted">{order.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-text-secondary">{order.date}</td>
                  <td className="px-6 py-4 text-sm text-text-secondary">{order.items} items</td>
                  <td className="px-6 py-4 text-sm font-medium text-white">{order.total}</td>
                  <td className="px-6 py-4 text-sm text-text-secondary">{order.payment}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getStatusStyle(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-text-muted hover:text-accent-purple hover:bg-accent-purple/10 transition-colors">
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-dark-border px-6 py-4">
          <p className="text-sm text-text-muted">
            Showing <span className="font-medium text-text-secondary">1-10</span> of <span className="font-medium text-text-secondary">856</span> orders
          </p>
          <div className="flex items-center gap-2">
            <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-dark-border text-text-muted hover:text-white hover:border-accent-purple/30 transition-all">
              <ChevronLeft size={16} />
            </button>
            <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-purple text-white text-sm font-medium">
              1
            </button>
            <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-dark-border text-text-muted hover:text-white hover:border-accent-purple/30 text-sm transition-all">
              2
            </button>
            <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-dark-border text-text-muted hover:text-white hover:border-accent-purple/30 text-sm transition-all">
              3
            </button>
            <span className="text-text-muted text-sm">...</span>
            <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-dark-border text-text-muted hover:text-white hover:border-accent-purple/30 text-sm transition-all">
              86
            </button>
            <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-dark-border text-text-muted hover:text-white hover:border-accent-purple/30 transition-all">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
