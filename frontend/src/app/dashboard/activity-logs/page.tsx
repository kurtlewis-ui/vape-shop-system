'use client';

import { useState } from 'react';
import { Search, ChevronUp, ChevronDown } from 'lucide-react';

interface LogEntry {
  id: number;
  userName: string;
  userEmail: string;
  action: string;
  module: string;
  shop: string;
  description: string;
  device: string;
  ipAddress: string;
  date: string;
  category: string;
}

const mockLogs: LogEntry[] = [
  {
    id: 1,
    userName: 'John Doe',
    userEmail: 'john.doe@vapeshop.com',
    action: 'Login',
    module: 'Authentication',
    shop: 'N/A',
    description: 'User logged in successfully',
    device: 'Chrome / Windows',
    ipAddress: '192.168.1.100',
    date: '2024-01-16 08:30 AM',
    category: 'Authentications',
  },
  {
    id: 2,
    userName: 'John Doe',
    userEmail: 'john.doe@vapeshop.com',
    action: 'Approved All Sales',
    module: 'Reports',
    shop: 'Downtown Branch',
    description: 'Approved all pending sales for Downtown Branch',
    device: 'Chrome / Windows',
    ipAddress: '192.168.1.100',
    date: '2024-01-16 09:15 AM',
    category: 'Reports',
  },
  {
    id: 3,
    userName: 'Jane Smith',
    userEmail: 'jane.smith@vapeshop.com',
    action: 'Updated Profile',
    module: 'Accounts',
    shop: 'N/A',
    description: 'Updated user profile information',
    device: 'Safari / macOS',
    ipAddress: '192.168.1.101',
    date: '2024-01-16 10:00 AM',
    category: 'Accounts',
  },
  {
    id: 4,
    userName: 'Sarah Williams',
    userEmail: 'sarah.williams@vapeshop.com',
    action: 'Added Product',
    module: 'Products',
    shop: 'Downtown Branch',
    description: 'Added new product: Blue Razz Ice 5000',
    device: 'Chrome / Android',
    ipAddress: '192.168.1.105',
    date: '2024-01-16 11:30 AM',
    category: 'Products',
  },
  {
    id: 5,
    userName: 'Mike Johnson',
    userEmail: 'mike.johnson@vapeshop.com',
    action: 'Created User',
    module: 'Users',
    shop: 'N/A',
    description: 'Created new staff account for Tom Brown',
    device: 'Firefox / Windows',
    ipAddress: '192.168.1.102',
    date: '2024-01-16 02:45 PM',
    category: 'Users',
  },
];

const categories = [
  { name: 'All', color: 'bg-accent-primary' },
  { name: 'Authentications', color: 'bg-gray-700' },
  { name: 'Accounts', color: 'bg-gray-700' },
  { name: 'Shops', color: 'bg-accent-green' },
  { name: 'Products', color: 'bg-accent-green' },
  { name: 'Brands', color: 'bg-gray-700' },
  { name: 'Reports', color: 'bg-gray-700' },
  { name: 'Users', color: 'bg-gray-700' },
];

type SortKey = 'userName' | 'action' | 'module' | 'shop' | 'date';
type SortDir = 'asc' | 'desc';

export default function ActivityLogsPage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedShop, setSelectedShop] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState<number | 'All'>(10);
  const [sortKey, setSortKey] = useState<SortKey>('date');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredLogs = mockLogs.filter((log) => {
    const matchesCategory = activeCategory === 'All' || log.category === activeCategory;
    const matchesShop = selectedShop === 'All' || log.shop === selectedShop;
    const matchesSearch =
      log.userName.toLowerCase().includes(search.toLowerCase()) ||
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.description.toLowerCase().includes(search.toLowerCase()) ||
      log.module.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesShop && matchesSearch;
  });

  const sortedLogs = [...filteredLogs].sort((a, b) => {
    const valA = a[sortKey];
    const valB = b[sortKey];
    if (valA < valB) return sortDir === 'asc' ? -1 : 1;
    if (valA > valB) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });

  const displayedLogs = entriesPerPage === 'All' ? sortedLogs : sortedLogs.slice(0, entriesPerPage);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const SortIcon = ({ column }: { column: SortKey }) => (
    <span className="inline-flex flex-col ml-1">
      <ChevronUp size={10} className={sortKey === column && sortDir === 'asc' ? 'text-white' : 'text-white/40'} />
      <ChevronDown size={10} className={sortKey === column && sortDir === 'desc' ? 'text-white' : 'text-white/40'} />
    </span>
  );

  return (
    <div className="p-6 bg-page-bg min-h-screen">
      <h1 className="text-2xl font-bold text-text-primary mb-6">Activity Logs</h1>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        {categories.map((cat) => (
          <button
            key={cat.name}
            onClick={() => setActiveCategory(cat.name)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
              activeCategory === cat.name
                ? 'bg-accent-primary text-white'
                : `${cat.color} text-white opacity-70 hover:opacity-100`
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-card-bg rounded-xl border border-card-border shadow-sm mb-4">
        <div className="p-4 flex flex-wrap items-center gap-3">
          <select
            value={selectedShop}
            onChange={(e) => setSelectedShop(e.target.value)}
            className="px-3 py-2 border border-input-border rounded-lg text-sm bg-input-bg focus:outline-none focus:ring-2 focus:ring-input-focus"
          >
            <option value="All">All</option>
            <option>Downtown Branch</option>
            <option>Mall Branch</option>
            <option>Uptown Branch</option>
          </select>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="px-3 py-2 border border-input-border rounded-lg text-sm bg-input-bg focus:outline-none focus:ring-2 focus:ring-input-focus"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="px-3 py-2 border border-input-border rounded-lg text-sm bg-input-bg focus:outline-none focus:ring-2 focus:ring-input-focus"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-card-bg rounded-xl border border-card-border shadow-sm">
        <div className="p-4 flex items-center justify-between border-b border-card-border">
          <div className="flex items-center gap-2">
            <label className="text-sm text-text-secondary">Show</label>
            <select
              value={entriesPerPage}
              onChange={(e) => setEntriesPerPage(e.target.value === 'All' ? 'All' : Number(e.target.value))}
              className="px-2 py-1 border border-input-border rounded text-sm bg-input-bg focus:outline-none focus:ring-2 focus:ring-input-focus"
            >
              {[5, 10, 25, 50, 100].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
              <option value="All">All</option>
            </select>
            <span className="text-sm text-text-secondary">entries</span>
          </div>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder="Search activity logs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 border border-input-border rounded-lg bg-input-bg text-sm focus:outline-none focus:ring-2 focus:ring-input-focus w-64"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-table-header text-table-header-text">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase">#</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase cursor-pointer" onClick={() => handleSort('userName')}>
                  User <SortIcon column="userName" />
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase cursor-pointer" onClick={() => handleSort('action')}>
                  Action <SortIcon column="action" />
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase cursor-pointer" onClick={() => handleSort('module')}>
                  Module <SortIcon column="module" />
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase cursor-pointer" onClick={() => handleSort('shop')}>
                  Shop <SortIcon column="shop" />
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Description</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Device</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase">IP Address</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase cursor-pointer" onClick={() => handleSort('date')}>
                  Date <SortIcon column="date" />
                </th>
              </tr>
            </thead>
            <tbody>
              {displayedLogs.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center">
                    <p className="text-accent-primary font-medium">No data available in table</p>
                  </td>
                </tr>
              ) : (
                displayedLogs.map((log, idx) => (
                  <tr key={log.id} className="border-b border-card-border hover:bg-gray-50 transition">
                    <td className="px-4 py-3 text-sm text-text-primary">{idx + 1}</td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm font-medium text-text-primary">{log.userName}</p>
                        <p className="text-xs text-text-muted">{log.userEmail}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-text-primary">{log.action}</td>
                    <td className="px-4 py-3 text-sm text-text-secondary">{log.module}</td>
                    <td className="px-4 py-3 text-sm text-text-secondary">{log.shop}</td>
                    <td className="px-4 py-3 text-sm text-text-secondary max-w-[200px] truncate">{log.description}</td>
                    <td className="px-4 py-3 text-sm text-text-secondary">{log.device}</td>
                    <td className="px-4 py-3 text-sm text-text-muted font-mono text-xs">{log.ipAddress}</td>
                    <td className="px-4 py-3 text-sm text-text-secondary">{log.date}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 text-sm text-text-secondary">
          Showing 1 to {displayedLogs.length} of {filteredLogs.length} logs
        </div>
      </div>
    </div>
  );
}
