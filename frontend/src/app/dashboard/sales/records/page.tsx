'use client';

import { useState } from 'react';
import { Search, Trash2, X } from 'lucide-react';

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

interface DisposedRecord extends SaleItem {
  disposedAt: string;
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
  const [showDisposalsModal, setShowDisposalsModal] = useState(false);
  const [disposedItems, setDisposedItems] = useState<DisposedRecord[]>([]);

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

  const totalDisposedValue = disposedItems.reduce((sum, d) => sum + d.subTotal, 0);

  // Records every item currently shown in the table as disposed stock,
  // stamping each with the time it was recorded. Items already recorded
  // are skipped so the same item is not logged twice.
  const handleRecordDisposals = () => {
    const timestamp = new Date().toLocaleString();
    setDisposedItems((prev) => {
      const existingIds = new Set(prev.map((d) => d.id));
      const additions = filteredItems
        .filter((item) => !existingIds.has(item.id))
        .map((item) => ({ ...item, disposedAt: timestamp }));
      return [...prev, ...additions];
    });
  };

  let rowIndex = 0;

  return (
    <div className="p-6 bg-page-bg min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Products</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={clearFilters}
            className="px-4 py-2 border border-input-border rounded-lg text-sm text-text-primary hover:bg-white/5 transition"
          >
            Clear Filter
          </button>
          <button
            onClick={() => setShowDisposalsModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-btn-danger text-white rounded-lg text-sm font-medium hover:opacity-90 transition"
          >
            Disposals
            {disposedItems.length > 0 && (
              <span className="badge bg-white/20 text-white">{disposedItems.length}</span>
            )}
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
                      <tr key={item.id} className="border-b border-card-border hover:bg-white/5 transition">
                        <td className="px-4 py-3 text-sm text-text-primary font-medium">
                          {idx === 0 ? `#${saleId}` : ''}
                        </td>
                        <td className="px-4 py-3">
                          <div className="w-8 h-8 rounded bg-white/10 flex items-center justify-center text-xs text-text-muted">
                            IMG
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-text-primary">{item.name}</td>
                        <td className="px-4 py-3 text-sm text-text-primary">{item.quantity}</td>
                        <td className="px-4 py-3 text-sm text-text-secondary">{item.brand}</td>
                        <td className="px-4 py-3 text-sm text-text-primary">&#8369;{item.sellingPrice.toLocaleString()}</td>
                        <td className="px-4 py-3 text-sm text-text-primary font-medium">&#8369;{item.subTotal.toLocaleString()}</td>
                        <td className="px-4 py-3">
                          <span className={`badge ${
                            item.paymentMethod === 'Cash'
                              ? 'bg-accent-green/15 text-accent-green'
                              : 'bg-accent-blue/15 text-accent-blue'
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

      {/* Disposals Modal */}
      {showDisposalsModal && (
        <Modal title="Disposed Items" onClose={() => setShowDisposalsModal(false)}>
          <div className="space-y-4">
            <p className="text-sm text-text-secondary">
              Record the items shown in the current view as disposed (damaged, expired or
              unsellable stock). Recorded disposals are listed below.
            </p>

            <button
              onClick={handleRecordDisposals}
              className="w-full flex items-center justify-center gap-2 bg-btn-danger text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition"
            >
              <Trash2 size={15} /> Record {filteredItems.length} Item{filteredItems.length === 1 ? '' : 's'} as Disposed
            </button>

            {disposedItems.length === 0 ? (
              <p className="py-6 text-center text-sm text-text-muted">No disposed items recorded yet.</p>
            ) : (
              <>
                <div className="max-h-72 overflow-y-auto rounded-lg border border-card-border">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-table-header text-table-header-text">
                        <th className="px-3 py-2 text-left text-xs font-semibold uppercase">Name</th>
                        <th className="px-3 py-2 text-left text-xs font-semibold uppercase">Qty</th>
                        <th className="px-3 py-2 text-left text-xs font-semibold uppercase">Brand</th>
                        <th className="px-3 py-2 text-left text-xs font-semibold uppercase">Value</th>
                        <th className="px-3 py-2 text-left text-xs font-semibold uppercase">Disposed At</th>
                      </tr>
                    </thead>
                    <tbody>
                      {disposedItems.map((d) => (
                        <tr key={d.id} className="border-t border-card-border">
                          <td className="px-3 py-2 text-sm text-text-primary">{d.name}</td>
                          <td className="px-3 py-2 text-sm text-text-primary">{d.quantity}</td>
                          <td className="px-3 py-2 text-sm text-text-secondary">{d.brand}</td>
                          <td className="px-3 py-2 text-sm text-text-primary">&#8369;{d.subTotal.toLocaleString()}</td>
                          <td className="px-3 py-2 text-sm text-text-secondary">{d.disposedAt}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-text-primary">
                    Total disposed: &#8369;{totalDisposedValue.toLocaleString()}
                  </p>
                  <button
                    onClick={() => setDisposedItems([])}
                    className="text-sm text-text-secondary hover:text-accent-red transition-colors"
                  >
                    Clear records
                  </button>
                </div>
              </>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card-bg border border-card-border rounded-2xl shadow-2xl shadow-black/40 w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-text-primary">{title}</h3>
          <button onClick={onClose} className="rounded-lg p-1 text-text-muted hover:text-text-primary hover:bg-white/5 transition-colors"><X size={20} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}
