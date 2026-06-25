'use client';

import { useState } from 'react';
import { Search, Filter, SortAsc, Plus, MoreHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';

const products = [
  { id: 1, name: 'Elf Bar BC5000', sku: 'ELF-BC5000', category: 'Disposables', stock: 245, price: '$19.99', status: 'In Stock', image: '🔋' },
  { id: 2, name: 'JUUL Starter Kit', sku: 'JUUL-SK01', category: 'Pod Systems', stock: 89, price: '$39.99', status: 'In Stock', image: '📦' },
  { id: 3, name: 'Vaporesso XROS 3', sku: 'VAP-XR03', category: 'Pod Systems', stock: 12, price: '$29.99', status: 'Low Stock', image: '💨' },
  { id: 4, name: 'Lost Mary BM5000', sku: 'LM-BM5000', category: 'Disposables', stock: 178, price: '$19.99', status: 'In Stock', image: '🎨' },
  { id: 5, name: 'SMOK Nord 5', sku: 'SMK-N5', category: 'Pod Systems', stock: 0, price: '$32.99', status: 'Out of Stock', image: '⚡' },
  { id: 6, name: 'Naked 100 E-Liquid', sku: 'NK-100ML', category: 'E-Liquids', stock: 340, price: '$24.99', status: 'In Stock', image: '🧪' },
  { id: 7, name: 'GeekVape Aegis Legend', sku: 'GV-AGL2', category: 'Mods & Kits', stock: 8, price: '$59.99', status: 'Low Stock', image: '🔧' },
  { id: 8, name: 'Uwell Caliburn G2', sku: 'UW-CG2', category: 'Pod Systems', stock: 156, price: '$27.99', status: 'In Stock', image: '✨' },
  { id: 9, name: 'Fume Extra 1500', sku: 'FM-EX1500', category: 'Disposables', stock: 0, price: '$12.99', status: 'Out of Stock', image: '💫' },
  { id: 10, name: 'Vuse Alto Pods', sku: 'VS-ALT4', category: 'Pods & Coils', stock: 420, price: '$15.99', status: 'In Stock', image: '🔌' },
];

function getStockStatusStyle(status: string) {
  switch (status) {
    case 'In Stock':
      return 'bg-accent-green/10 text-accent-green';
    case 'Low Stock':
      return 'bg-accent-orange/10 text-accent-orange';
    case 'Out of Stock':
      return 'bg-accent-red/10 text-accent-red';
    default:
      return 'bg-text-muted/10 text-text-muted';
  }
}

export default function InventoryPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Inventory</h1>
          <p className="mt-1 text-text-secondary">Manage your product inventory</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-accent-purple to-accent-purple-light px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-accent-purple/25 hover:shadow-xl hover:brightness-110 transition-all">
          <Plus size={18} />
          Add Product
        </button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search products by name, SKU, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-dark-border bg-dark-card pl-11 pr-4 py-2.5 text-sm text-white placeholder-text-muted outline-none transition-all focus:border-accent-purple focus:ring-1 focus:ring-accent-purple/20"
          />
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 rounded-xl border border-dark-border bg-dark-card px-4 py-2.5 text-sm text-text-secondary hover:text-white hover:border-accent-purple/30 transition-all">
            <Filter size={16} />
            Filter
          </button>
          <button className="flex items-center gap-2 rounded-xl border border-dark-border bg-dark-card px-4 py-2.5 text-sm text-text-secondary hover:text-white hover:border-accent-purple/30 transition-all">
            <SortAsc size={16} />
            Sort
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="rounded-2xl bg-gradient-to-br from-dark-card-hover to-dark-card border border-dark-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-border">
                <th className="text-left px-6 py-4 text-xs font-medium uppercase tracking-wider text-text-muted">Product</th>
                <th className="text-left px-6 py-4 text-xs font-medium uppercase tracking-wider text-text-muted">SKU</th>
                <th className="text-left px-6 py-4 text-xs font-medium uppercase tracking-wider text-text-muted">Category</th>
                <th className="text-left px-6 py-4 text-xs font-medium uppercase tracking-wider text-text-muted">Stock</th>
                <th className="text-left px-6 py-4 text-xs font-medium uppercase tracking-wider text-text-muted">Price</th>
                <th className="text-left px-6 py-4 text-xs font-medium uppercase tracking-wider text-text-muted">Status</th>
                <th className="text-right px-6 py-4 text-xs font-medium uppercase tracking-wider text-text-muted">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id} className="border-b border-dark-border/50 last:border-0 hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-dark-card text-lg">
                        {product.image}
                      </span>
                      <span className="text-sm font-medium text-white">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-text-secondary font-mono">{product.sku}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex rounded-lg bg-dark-card px-2.5 py-1 text-xs font-medium text-text-secondary">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-white font-medium">{product.stock}</td>
                  <td className="px-6 py-4 text-sm text-white font-medium">{product.price}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getStockStatusStyle(product.status)}`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-text-muted hover:text-white hover:bg-dark-card transition-colors">
                      <MoreHorizontal size={16} />
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
            Showing <span className="font-medium text-text-secondary">1-10</span> of <span className="font-medium text-text-secondary">1,234</span> products
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
              12
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
