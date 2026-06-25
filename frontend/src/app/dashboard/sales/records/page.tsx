'use client';

import { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';

interface SaleItem {
  id: number;
  saleId: number;
  image: string;
  name: string;
  quantity: number;
  brand: string;
  sellingPrice: number;
  subTotal: number;
  paymentMethod: 'Cash' | 'Gcash';
  staff: string;
  dateCreated: string;
}

const mockSalesData: SaleItem[] = [
  { id: 1, saleId: 1001, image: '', name: 'Blue Razz Ice 5000', quantity: 2, brand: 'Elf Bar', sellingPrice: 450, subTotal: 900, paymentMethod: 'Cash', staff: 'Sarah Williams', dateCreated: '2024-01-15 10:30 AM' },
  { id: 2, saleId: 1001, image: '', name: 'Mango Tango 3000', quantity: 1, brand: 'Lost Mary', sellingPrice: 380, subTotal: 380, paymentMethod: 'Cash', staff: 'Sarah Williams', dateCreated: '2024-01-15 10:30 AM' },
  { id: 3, saleId: 1001, image: '', name: 'Strawberry Banana', quantity: 3, brand: 'Funky Republic', sellingPrice: 520, subTotal: 1560, paymentMethod: 'Cash', staff: 'Sarah Williams', dateCreated: '2024-01-15 10:30 AM' },
  { id: 4, saleId: 1001, image: '', name: 'Watermelon Ice', quantity: 1, brand: 'Elf Bar', sellingPrice: 450, subTotal: 450, paymentMethod: 'Cash', staff: 'Sarah Williams', dateCreated: '2024-01-15 10:30 AM' },
  { id: 5, saleId: 1002, image: '', name: 'Grape Ice 5000', quantity: 2, brand: 'Lost Mary', sellingPrice: 400, subTotal: 800, paymentMethod: 'Gcash', staff: 'Tom Brown', dateCreated: '2024-01-15 11:15 AM' },
  { id: 6, saleId: 1002, image: '', name: 'Cool Mint', quantity: 1, brand: 'Elf Bar', sellingPrice: 450, subTotal: 450, paymentMethod: 'Gcash', staff: 'Tom Brown', dateCreated: '2024-01-15 11:15 AM' },
];

const shops = ['All Shops', 'Downtown Branch', 'Mall Branch', 'Uptown Branch'];

export default function SalesRecordsPage() {
  const [search, setSearch] = useState('');
  const [selectedShop, setSelectedShop] = useState('All Shops');
  const [viewBy, setViewBy] = useState('View by Sale');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const filteredItems = mockSalesData.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.brand.toLowerCase().includes(search.toLowerCase()) ||
      item.staff.toLowerCase().includes(search.toLowerCase())
  );

  const saleGroups = filteredItems.reduce((acc, item) => {
    if (!acc[item.saleId]) acc[item.saleId] = [];
    acc[item.saleId].push(item);
    return acc;
  }, {} as Record<number, SaleItem[]>);

  const totalCash = filteredItems
    .filter((i) => i.paymentMethod === 'Cash')
    .reduce((sum, i) => sum + i.subTotal, 0);
  const totalGcash = filteredItems
    .filter((i) => i.paymentMethod === 'Gcash')
    .reduce((sum, i) => sum + i.subTotal, 0);
  const totalAll = totalCash + totalGcash;

  const clearFilters = () => {
    setSelectedShop('All Shops');
    setViewBy('View by Sale');
    setStartDate('');
    setEndDate('');
    setSearch('');
  };

  let rowIndex = 0;

  return (
    <div className="p-6 bg-page-bg min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Products</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={clearFilters}
            className="px-4 py-2 border border-input-border rounded-lg text-sm text-text-primary hover:bg-gray-50 transition"
          >
            Clear Filter
          </button>
          <button className="px-4 py-2 bg-btn-danger text-white rounded-lg text-sm font-medium hover:opacity-90 transition">
            Disposals
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card-bg rounded-xl border border-card-border shadow-sm mb-4">
        <div className="p-4 flex flex-wrap items-center gap-3">
          <select
            value={selectedShop}
            onChange={(e) => setSelectedShop(e.target.value)}
            className="px-3 py-2 border border-input-border rounded-lg text-sm bg-input-bg focus:outline-none focus:ring-2 focus:ring-input-focus"
          >
            {shops.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <select
            value={viewBy}
            onChange={(e) => setViewBy(e.target.value)}
            className="px-3 py-2 border border-input-border rounded-lg text-sm bg-input-bg focus:outline-none focus:ring-2 focus:ring-input-focus"
          >
            <option>View by Sale</option>
            <option>View by Product</option>
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
        <div className="p-4 border-b border-card-border">
          <div className="relative w-64">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-input-border rounded-lg bg-input-bg text-sm focus:outline-none focus:ring-2 focus:ring-input-focus"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-table-header text-table-header-text">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Customer</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Image</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Quantity</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Brand</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Selling Price</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Sub Total Price</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Payment Method</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Staff</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Date Created</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(saleGroups).map(([saleId, items]) => {
                const groupTotal = items.reduce((sum, item) => sum + item.subTotal, 0);
                return (
                  <>{items.map((item, idx) => {
                    rowIndex++;
                    return (
                      <tr key={item.id} className="border-b border-card-border hover:bg-gray-50 transition">
                        <td className="px-4 py-3 text-sm text-text-primary font-medium">
                          {idx === 0 ? `#${saleId}` : ''}
                        </td>
                        <td className="px-4 py-3">
                          <div className="w-8 h-8 rounded bg-gray-200 flex items-center justify-center text-xs text-text-muted">
                            IMG
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-text-primary">{item.name}</td>
                        <td className="px-4 py-3 text-sm text-text-primary">{item.quantity}</td>
                        <td className="px-4 py-3 text-sm text-text-secondary">{item.brand}</td>
                        <td className="px-4 py-3 text-sm text-text-primary">&#8369;{item.sellingPrice.toLocaleString()}</td>
                        <td className="px-4 py-3 text-sm text-text-primary font-medium">&#8369;{item.subTotal.toLocaleString()}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            item.paymentMethod === 'Cash'
                              ? 'bg-green-100 text-accent-green'
                              : 'bg-blue-100 text-accent-blue'
                          }`}>
                            {item.paymentMethod}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-text-secondary">{item.staff}</td>
                        <td className="px-4 py-3 text-sm text-text-secondary">{item.dateCreated}</td>
                      </tr>
                    );
                  })}
                  <tr key={`total-${saleId}`} className="bg-accent-orange/10 border-b border-card-border">
                    <td colSpan={10} className="px-4 py-2 text-sm font-semibold text-accent-orange">
                      Total for Sale ID {saleId}: &#8369;{groupTotal.toLocaleString()}
                    </td>
                  </tr>
                  </>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div className="p-4 border-t border-card-border">
          <div className="border-l-4 border-accent-blue pl-4 space-y-1">
            <p className="text-sm text-text-primary">
              <span className="font-medium">Total for Cash:</span> &#8369;{totalCash.toLocaleString()}
            </p>
            <p className="text-sm text-text-primary">
              <span className="font-medium">Total for Gcash:</span> &#8369;{totalGcash.toLocaleString()}
            </p>
            <p className="text-sm text-text-primary font-bold">
              Total for All Sales: &#8369;{totalAll.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
