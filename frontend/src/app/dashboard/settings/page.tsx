'use client';

import { useState } from 'react';
import { Store, Bell, Shield, CreditCard, Save, Upload } from 'lucide-react';

const tabs = [
  { id: 'general', label: 'General', icon: <Store size={18} /> },
  { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
  { id: 'security', label: 'Security', icon: <Shield size={18} /> },
  { id: 'billing', label: 'Billing', icon: <CreditCard size={18} /> },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="mt-1 text-text-secondary">Manage your store preferences and configuration</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-xl bg-dark-card border border-dark-border p-1 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-accent-purple text-white shadow-lg shadow-accent-purple/25'
                : 'text-text-secondary hover:text-white hover:bg-dark-card-hover'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'general' && <GeneralSettings />}
      {activeTab === 'notifications' && <NotificationSettings />}
      {activeTab === 'security' && <SecuritySettings />}
      {activeTab === 'billing' && <BillingSettings />}
    </div>
  );
}

function GeneralSettings() {
  return (
    <div className="space-y-6">
      {/* Store Information */}
      <div className="rounded-2xl bg-gradient-to-br from-dark-card-hover to-dark-card border border-dark-border p-6">
        <h2 className="text-lg font-semibold text-white mb-6">Store Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Store Name</label>
            <input
              type="text"
              defaultValue="Vape Shop Pro"
              className="w-full rounded-xl border border-input-border bg-input-bg px-4 py-3 text-white placeholder-text-muted outline-none transition-all focus:border-accent-purple focus:ring-2 focus:ring-accent-purple/20"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Email Address</label>
            <input
              type="email"
              defaultValue="contact@vapeshoppro.com"
              className="w-full rounded-xl border border-input-border bg-input-bg px-4 py-3 text-white placeholder-text-muted outline-none transition-all focus:border-accent-purple focus:ring-2 focus:ring-accent-purple/20"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Phone Number</label>
            <input
              type="tel"
              defaultValue="+1 (555) 123-4567"
              className="w-full rounded-xl border border-input-border bg-input-bg px-4 py-3 text-white placeholder-text-muted outline-none transition-all focus:border-accent-purple focus:ring-2 focus:ring-accent-purple/20"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Website</label>
            <input
              type="url"
              defaultValue="https://vapeshoppro.com"
              className="w-full rounded-xl border border-input-border bg-input-bg px-4 py-3 text-white placeholder-text-muted outline-none transition-all focus:border-accent-purple focus:ring-2 focus:ring-accent-purple/20"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-text-secondary mb-2">Address</label>
            <input
              type="text"
              defaultValue="123 Vapor Lane, Cloud City, CA 90210"
              className="w-full rounded-xl border border-input-border bg-input-bg px-4 py-3 text-white placeholder-text-muted outline-none transition-all focus:border-accent-purple focus:ring-2 focus:ring-accent-purple/20"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-text-secondary mb-2">Description</label>
            <textarea
              rows={3}
              defaultValue="Premium vape shop offering the best selection of e-cigarettes, e-liquids, and accessories."
              className="w-full rounded-xl border border-input-border bg-input-bg px-4 py-3 text-white placeholder-text-muted outline-none transition-all focus:border-accent-purple focus:ring-2 focus:ring-accent-purple/20 resize-none"
            />
          </div>
        </div>
      </div>

      {/* Business Hours */}
      <div className="rounded-2xl bg-gradient-to-br from-dark-card-hover to-dark-card border border-dark-border p-6">
        <h2 className="text-lg font-semibold text-white mb-6">Business Hours</h2>
        <div className="space-y-3">
          {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
            <div key={day} className="flex items-center justify-between py-2">
              <span className="text-sm font-medium text-text-secondary w-28">{day}</span>
              <div className="flex items-center gap-3">
                <input
                  type="time"
                  defaultValue={day === 'Sunday' ? '10:00' : '09:00'}
                  className="rounded-lg border border-input-border bg-input-bg px-3 py-2 text-sm text-white outline-none focus:border-accent-purple"
                />
                <span className="text-text-muted">to</span>
                <input
                  type="time"
                  defaultValue={day === 'Sunday' ? '18:00' : day === 'Saturday' ? '20:00' : '21:00'}
                  className="rounded-lg border border-input-border bg-input-bg px-3 py-2 text-sm text-white outline-none focus:border-accent-purple"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-accent-purple to-accent-purple-light px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-accent-purple/25 hover:shadow-xl hover:brightness-110 transition-all">
          <Save size={18} />
          Save Changes
        </button>
      </div>
    </div>
  );
}

function NotificationSettings() {
  const notifications = [
    { id: 'order_new', label: 'New Order', desc: 'Get notified when a new order is placed', enabled: true },
    { id: 'order_status', label: 'Order Status Changes', desc: 'Updates when order status changes', enabled: true },
    { id: 'stock_low', label: 'Low Stock Alerts', desc: 'Alert when product stock is running low', enabled: true },
    { id: 'stock_out', label: 'Out of Stock', desc: 'Alert when a product is out of stock', enabled: true },
    { id: 'reports_weekly', label: 'Weekly Reports', desc: 'Receive weekly performance summary', enabled: false },
    { id: 'reports_monthly', label: 'Monthly Reports', desc: 'Receive monthly analytics report', enabled: true },
    { id: 'promo', label: 'Promotional Updates', desc: 'News about features and promotions', enabled: false },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-gradient-to-br from-dark-card-hover to-dark-card border border-dark-border p-6">
        <h2 className="text-lg font-semibold text-white mb-2">Notification Preferences</h2>
        <p className="text-sm text-text-muted mb-6">Choose what notifications you want to receive</p>
        <div className="space-y-4">
          {notifications.map((item) => (
            <div key={item.id} className="flex items-center justify-between py-3 border-b border-dark-border/50 last:border-0">
              <div>
                <p className="text-sm font-medium text-white">{item.label}</p>
                <p className="text-xs text-text-muted mt-0.5">{item.desc}</p>
              </div>
              <label className="relative inline-flex cursor-pointer">
                <input type="checkbox" defaultChecked={item.enabled} className="sr-only peer" />
                <div className="w-11 h-6 rounded-full bg-dark-card border border-dark-border peer-checked:bg-accent-purple peer-checked:border-accent-purple transition-all after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5" />
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-accent-purple to-accent-purple-light px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-accent-purple/25 hover:shadow-xl hover:brightness-110 transition-all">
          <Save size={18} />
          Save Preferences
        </button>
      </div>
    </div>
  );
}

function SecuritySettings() {
  return (
    <div className="space-y-6">
      {/* Change Password */}
      <div className="rounded-2xl bg-gradient-to-br from-dark-card-hover to-dark-card border border-dark-border p-6">
        <h2 className="text-lg font-semibold text-white mb-6">Change Password</h2>
        <div className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Current Password</label>
            <input
              type="password"
              placeholder="Enter current password"
              className="w-full rounded-xl border border-input-border bg-input-bg px-4 py-3 text-white placeholder-text-muted outline-none transition-all focus:border-accent-purple focus:ring-2 focus:ring-accent-purple/20"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">New Password</label>
            <input
              type="password"
              placeholder="Enter new password"
              className="w-full rounded-xl border border-input-border bg-input-bg px-4 py-3 text-white placeholder-text-muted outline-none transition-all focus:border-accent-purple focus:ring-2 focus:ring-accent-purple/20"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Confirm New Password</label>
            <input
              type="password"
              placeholder="Confirm new password"
              className="w-full rounded-xl border border-input-border bg-input-bg px-4 py-3 text-white placeholder-text-muted outline-none transition-all focus:border-accent-purple focus:ring-2 focus:ring-accent-purple/20"
            />
          </div>
        </div>
      </div>

      {/* Two-Factor Authentication */}
      <div className="rounded-2xl bg-gradient-to-br from-dark-card-hover to-dark-card border border-dark-border p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">Two-Factor Authentication</h2>
            <p className="text-sm text-text-muted mt-1">Add an extra layer of security to your account</p>
          </div>
          <button className="rounded-xl border border-accent-purple bg-accent-purple/10 px-4 py-2.5 text-sm font-medium text-accent-purple hover:bg-accent-purple/20 transition-all">
            Enable 2FA
          </button>
        </div>
      </div>

      {/* Active Sessions */}
      <div className="rounded-2xl bg-gradient-to-br from-dark-card-hover to-dark-card border border-dark-border p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Active Sessions</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-3 border-b border-dark-border/50">
            <div>
              <p className="text-sm font-medium text-white">Chrome on Windows</p>
              <p className="text-xs text-text-muted">192.168.1.1 · Current session</p>
            </div>
            <span className="inline-flex rounded-full bg-accent-green/10 px-2.5 py-1 text-xs font-medium text-accent-green">Active</span>
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-medium text-white">Safari on iPhone</p>
              <p className="text-xs text-text-muted">192.168.1.5 · Last active 2h ago</p>
            </div>
            <button className="text-xs text-accent-red hover:text-accent-red/80 transition-colors">Revoke</button>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-accent-purple to-accent-purple-light px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-accent-purple/25 hover:shadow-xl hover:brightness-110 transition-all">
          <Save size={18} />
          Update Password
        </button>
      </div>
    </div>
  );
}

function BillingSettings() {
  return (
    <div className="space-y-6">
      {/* Current Plan */}
      <div className="rounded-2xl bg-gradient-to-br from-dark-card-hover to-dark-card border border-dark-border p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Current Plan</h2>
          <span className="inline-flex rounded-full bg-accent-purple/10 px-3 py-1 text-xs font-semibold text-accent-purple">Pro Plan</span>
        </div>
        <div className="flex items-baseline gap-1 mb-2">
          <span className="text-3xl font-bold text-white">$49</span>
          <span className="text-text-muted">/month</span>
        </div>
        <p className="text-sm text-text-muted mb-4">Next billing date: February 15, 2024</p>
        <div className="flex gap-3">
          <button className="rounded-xl bg-accent-purple/10 border border-accent-purple/30 px-4 py-2 text-sm font-medium text-accent-purple hover:bg-accent-purple/20 transition-all">
            Upgrade Plan
          </button>
          <button className="rounded-xl border border-dark-border px-4 py-2 text-sm font-medium text-text-secondary hover:text-white hover:border-accent-red/30 transition-all">
            Cancel Subscription
          </button>
        </div>
      </div>

      {/* Payment Method */}
      <div className="rounded-2xl bg-gradient-to-br from-dark-card-hover to-dark-card border border-dark-border p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Payment Method</h2>
        <div className="flex items-center justify-between p-4 rounded-xl bg-dark-card border border-dark-border">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-14 items-center justify-center rounded-lg bg-accent-blue/15 text-accent-blue text-xs font-bold">
              VISA
            </div>
            <div>
              <p className="text-sm font-medium text-white">•••• •••• •••• 4242</p>
              <p className="text-xs text-text-muted">Expires 12/2025</p>
            </div>
          </div>
          <button className="text-sm text-accent-purple hover:text-accent-purple-light transition-colors">Edit</button>
        </div>
      </div>

      {/* Billing History */}
      <div className="rounded-2xl bg-gradient-to-br from-dark-card-hover to-dark-card border border-dark-border p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Billing History</h2>
        <div className="space-y-3">
          {[
            { date: 'Jan 15, 2024', amount: '$49.00', status: 'Paid' },
            { date: 'Dec 15, 2023', amount: '$49.00', status: 'Paid' },
            { date: 'Nov 15, 2023', amount: '$49.00', status: 'Paid' },
          ].map((invoice, i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-dark-border/50 last:border-0">
              <div className="flex items-center gap-4">
                <span className="text-sm text-text-secondary">{invoice.date}</span>
                <span className="text-sm font-medium text-white">{invoice.amount}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="inline-flex rounded-full bg-accent-green/10 px-2.5 py-1 text-xs font-medium text-accent-green">
                  {invoice.status}
                </span>
                <button className="text-xs text-accent-purple hover:text-accent-purple-light transition-colors">Download</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
