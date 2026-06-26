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

interface ArchivedBrand {
  id: number;
  name: string;
  slug: string;
  archivedAt: string;
  coverImage: string;
}

export default function BrandsArchivePage() {
  const [brands, setBrands] = useState<ArchivedBrand[]>([]);
  const [search, setSearch] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<ArchivedBrand | null>(null);

  const filteredBrands = brands.filter(
    (b) =>
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.slug.toLowerCase().includes(search.toLowerCase())
  );

  const handleRestore = (brand: ArchivedBrand) => {
    setBrands(brands.filter((b) => b.id !== brand.id));
  };

  const handleDeleteClick = (brand: ArchivedBrand) => {
    setSelectedBrand(brand);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (selectedBrand) {
      setBrands(brands.filter((b) => b.id !== selectedBrand.id));
    }
    setShowDeleteModal(false);
    setSelectedBrand(null);
  };

  return (
    <div className="p-6 bg-page-bg min-h-screen">
      <h1 className="text-2xl font-bold text-text-primary mb-6">Brands Archive</h1>

      <div className="bg-card-bg rounded-xl border border-card-border shadow-sm">
        <div className="p-4 border-b border-card-border">
          <div className="relative w-64">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder="Search archived brands..."
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
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Cover Image</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Slug</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Archived At</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBrands.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12">
                    <div className="border-l-4 border-accent-orange pl-4">
                      <p className="text-accent-orange font-medium">No archived brands found.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredBrands.map((brand, idx) => (
                  <tr key={brand.id} className="border-b border-card-border hover:bg-white/5 transition">
                    <td className="px-4 py-3 text-sm text-text-primary">{idx + 1}</td>
                    <td className="px-4 py-3">
                      <div className="w-10 h-10 rounded bg-white/10 flex items-center justify-center text-xs text-text-muted">
                        IMG
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-text-primary font-medium">{brand.name}</td>
                    <td className="px-4 py-3 text-sm text-text-secondary font-mono">{brand.slug}</td>
                    <td className="px-4 py-3 text-sm text-text-secondary">{brand.archivedAt}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleRestore(brand)}
                          className="flex items-center gap-1 text-accent-green hover:underline text-sm font-medium"
                          title="Restore"
                        >
                          <Undo2 size={14} /> Restore
                        </button>
                        <button
                          onClick={() => handleDeleteClick(brand)}
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
      {showDeleteModal && selectedBrand && (
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
