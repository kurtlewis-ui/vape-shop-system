'use client';

import { useState } from 'react';
import { Search, Undo2, Trash2, X } from 'lucide-react';

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-card-bg border border-card-border rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-text-primary">{title}</h3>
          <button onClick={onClose} className="text-text-muted hover:text-text-primary transition"><X size={20} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

interface ArchivedShop {
  id: number;
  name: string;
  slug: string;
  archivedAt: string;
}

const mockArchivedShops: ArchivedShop[] = [
  {
    id: 1,
    name: 'Westside Branch',
    slug: 'westside-branch',
    archivedAt: '2024-01-08 02:30 PM',
  },
];

export default function ShopsArchivePage() {
  const [shops, setShops] = useState<ArchivedShop[]>(mockArchivedShops);
  const [search, setSearch] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedShop, setSelectedShop] = useState<ArchivedShop | null>(null);

  const filteredShops = shops.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.slug.toLowerCase().includes(search.toLowerCase())
  );

  const handleRestore = (shop: ArchivedShop) => {
    setShops(shops.filter((s) => s.id !== shop.id));
  };

  const handleDeleteClick = (shop: ArchivedShop) => {
    setSelectedShop(shop);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (selectedShop) {
      setShops(shops.filter((s) => s.id !== selectedShop.id));
    }
    setShowDeleteModal(false);
    setSelectedShop(null);
  };

  return (
    <div className="p-6 bg-page-bg min-h-screen">
      <h1 className="text-2xl font-bold text-text-primary mb-6">Shops Archive</h1>

      <div className="bg-card-bg rounded-xl border border-card-border shadow-sm">
        <div className="p-4 border-b border-card-border">
          <div className="relative w-64">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder="Search archived shops..."
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
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase">#</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Slug</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Archived At</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredShops.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12">
                    <div className="border-l-4 border-accent-orange pl-4">
                      <p className="text-accent-orange font-medium">No archived shops found.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredShops.map((shop, idx) => (
                  <tr key={shop.id} className="border-b border-card-border hover:bg-white/5 transition">
                    <td className="px-4 py-3 text-sm text-text-primary">{idx + 1}</td>
                    <td className="px-4 py-3 text-sm text-text-primary font-medium">{shop.name}</td>
                    <td className="px-4 py-3 text-sm text-text-secondary font-mono">{shop.slug}</td>
                    <td className="px-4 py-3 text-sm text-text-secondary">{shop.archivedAt}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleRestore(shop)}
                          className="flex items-center gap-1 text-accent-green hover:underline text-sm font-medium"
                          title="Restore"
                        >
                          <Undo2 size={14} /> Restore
                        </button>
                        <button
                          onClick={() => handleDeleteClick(shop)}
                          className="flex items-center gap-1 text-accent-red hover:underline text-sm font-medium"
                          title="Delete permanently"
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Permanent Delete Confirmation Modal */}
      {showDeleteModal && selectedShop && (
        <Modal title="Delete Permanently" onClose={() => setShowDeleteModal(false)}>
          <div className="mb-4">
            <p className="text-sm text-text-secondary">
              If you permanently delete this, it won&apos;t be restored and all previous data associated with it will not be seen anymore.
            </p>
          </div>
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="px-4 py-2 border border-input-border rounded-lg text-sm text-text-primary hover:bg-white/5 transition"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="px-4 py-2 bg-accent-red text-white rounded-lg text-sm font-medium hover:opacity-90 transition"
            >
              Yes, Delete Permanently
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
