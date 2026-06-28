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

interface ArchivedProduct {
  id: number;
  name: string;
  brand: string;
  price: number;
  archivedAt: string;
  image: string;
}

const mockArchivedProducts: ArchivedProduct[] = [
  {
    id: 1,
    name: 'Lemon Drop 3000',
    brand: 'Elf Bar',
    price: 420,
    archivedAt: '2024-01-05 09:00 AM',
    image: '',
  },
  {
    id: 2,
    name: 'Peach Ice 5000',
    brand: 'Lost Mary',
    price: 480,
    archivedAt: '2024-01-09 04:20 PM',
    image: '',
  },
];

export default function ProductsArchivePage() {
  const [products, setProducts] = useState<ArchivedProduct[]>(mockArchivedProducts);
  const [search, setSearch] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ArchivedProduct | null>(null);

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase())
  );

  const handleRestore = (product: ArchivedProduct) => {
    setProducts(products.filter((p) => p.id !== product.id));
  };

  const handleDeleteClick = (product: ArchivedProduct) => {
    setSelectedProduct(product);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (selectedProduct) {
      setProducts(products.filter((p) => p.id !== selectedProduct.id));
    }
    setShowDeleteModal(false);
    setSelectedProduct(null);
  };

  return (
    <div className="p-6 bg-page-bg min-h-screen">
      <h1 className="text-2xl font-bold text-text-primary mb-6">Products Archive</h1>

      <div className="bg-card-bg rounded-xl border border-card-border shadow-sm">
        <div className="p-4 border-b border-card-border">
          <div className="relative w-64">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder="Search archived products..."
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
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Image</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Product</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Brand</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Price</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Archived At</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12">
                    <div className="border-l-4 border-accent-orange pl-4">
                      <p className="text-accent-orange font-medium">No archived products found.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product, idx) => (
                  <tr key={product.id} className="border-b border-card-border hover:bg-white/5 transition">
                    <td className="px-4 py-3 text-sm text-text-primary">{idx + 1}</td>
                    <td className="px-4 py-3">
                      <div className="w-10 h-10 rounded bg-white/10 flex items-center justify-center text-xs text-text-muted">
                        IMG
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-text-primary font-medium">{product.name}</td>
                    <td className="px-4 py-3 text-sm text-text-secondary">{product.brand}</td>
                    <td className="px-4 py-3 text-sm text-text-primary">&#8369;{product.price.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm text-text-secondary">{product.archivedAt}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleRestore(product)}
                          className="inline-flex items-center gap-1 rounded-lg bg-accent-green/10 px-2.5 py-1 text-sm font-medium text-accent-green hover:bg-accent-green/20 transition-colors"
                          title="Restore"
                        >
                          <Undo2 size={14} /> Restore
                        </button>
                        <button
                          onClick={() => handleDeleteClick(product)}
                          className="inline-flex items-center gap-1 rounded-lg bg-accent-red/10 px-2.5 py-1 text-sm font-medium text-accent-red hover:bg-accent-red/20 transition-colors"
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
      {showDeleteModal && selectedProduct && (
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
