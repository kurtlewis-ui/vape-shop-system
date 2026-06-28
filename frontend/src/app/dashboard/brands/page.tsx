'use client';

import { useState } from 'react';
import { Plus, Search, Pencil, Trash2, X, ImageIcon } from 'lucide-react';

interface Brand {
  id: number;
  name: string;
  slug: string;
  coverImage: string | null;
}

const initialBrands: Brand[] = [
  { id: 1, name: 'BRAND A', slug: 'brand-a', coverImage: null },
  { id: 2, name: 'BRAND B', slug: 'brand-b', coverImage: null },
  { id: 3, name: 'BRAND C', slug: 'brand-c', coverImage: null },
];

function generateSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>(initialBrands);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [archivingBrand, setArchivingBrand] = useState<Brand | null>(null);
  const [formName, setFormName] = useState('');

  const filteredBrands = brands.filter(
    (b) => b.name.toLowerCase().includes(search.toLowerCase()) || b.slug.includes(search.toLowerCase())
  );

  function handleAdd() {
    if (!formName.trim()) return;
    const newBrand: Brand = {
      id: Date.now(),
      name: formName.trim().toUpperCase(),
      slug: generateSlug(formName.trim()),
      coverImage: null,
    };
    setBrands([...brands, newBrand]);
    setFormName('');
    setShowAddModal(false);
  }

  function handleEdit() {
    if (!editingBrand || !formName.trim()) return;
    setBrands(brands.map((b) => (b.id === editingBrand.id ? { ...b, name: formName.trim().toUpperCase(), slug: generateSlug(formName.trim()) } : b)));
    setFormName('');
    setEditingBrand(null);
    setShowEditModal(false);
  }

  function handleArchive() {
    if (!archivingBrand) return;
    setBrands(brands.filter((b) => b.id !== archivingBrand.id));
    setArchivingBrand(null);
    setShowArchiveModal(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text-primary">Brands</h1>
        <button
          onClick={() => { setFormName(''); setShowAddModal(true); }}
          className="flex items-center gap-2 bg-btn-primary text-white px-4 py-2 rounded text-sm font-medium hover:opacity-90 transition"
        >
          <Plus size={16} />
          Add new Brand
        </button>
      </div>

      <div className="flex">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border border-input-border rounded-l px-4 py-2 text-sm text-text-primary bg-input-bg focus:outline-none focus:border-input-focus"
        />
        <button className="bg-btn-primary text-white px-4 py-2 rounded-r">
          <Search size={16} />
        </button>
      </div>

      <div className="bg-card-bg border border-card-border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-table-header">
              <th className="text-left px-4 py-3 text-xs font-semibold uppercase text-table-header-text w-12">#</th>
              <th className="text-left px-4 py-3 text-xs font-semibold uppercase text-table-header-text w-28">Cover Image</th>
              <th className="text-left px-4 py-3 text-xs font-semibold uppercase text-table-header-text">Name</th>
              <th className="text-left px-4 py-3 text-xs font-semibold uppercase text-table-header-text">Slug</th>
              <th className="text-right px-4 py-3 text-xs font-semibold uppercase text-table-header-text w-24"></th>
            </tr>
          </thead>
          <tbody>
            {filteredBrands.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-8 text-text-muted">No brands found.</td></tr>
            ) : (
              filteredBrands.map((brand, i) => (
                <tr key={brand.id} className="border-t border-card-border hover:bg-white/5 transition-colors">
                  <td className="px-4 py-3 text-sm text-text-muted font-medium">{i + 1}</td>
                  <td className="px-4 py-3 text-sm text-text-muted">
                    {brand.coverImage ? (
                      <div className="w-12 h-12 rounded bg-white/10 overflow-hidden">
                        <img src={brand.coverImage} alt={brand.name} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <span className="text-xs text-text-muted">No Image</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm font-bold text-text-primary">{brand.name}</td>
                  <td className="px-4 py-3 text-sm text-text-secondary">{brand.slug}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => { setEditingBrand(brand); setFormName(brand.name); setShowEditModal(true); }}
                        className="text-text-muted hover:text-accent-primary transition"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => { setArchivingBrand(brand); setShowArchiveModal(true); }}
                        className="text-btn-danger hover:text-btn-danger/80 transition"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <Modal title="Add New Brand" onClose={() => setShowAddModal(false)}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Name</label>
              <input type="text" value={formName} onChange={(e) => setFormName(e.target.value)} className="w-full border border-input-border rounded px-3 py-2 text-sm text-text-primary bg-input-bg focus:outline-none focus:border-input-focus" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Cover Image</label>
              <input type="file" accept="image/*" className="w-full border border-input-border rounded px-3 py-2 text-sm text-text-primary bg-input-bg" />
            </div>
            <div className="flex justify-end">
              <button onClick={handleAdd} className="bg-btn-primary text-white px-4 py-2 rounded text-sm font-medium hover:opacity-90 transition">Save Brand</button>
            </div>
          </div>
        </Modal>
      )}

      {/* Edit Modal */}
      {showEditModal && editingBrand && (
        <Modal title="Edit Brand" onClose={() => { setShowEditModal(false); setEditingBrand(null); }}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Name</label>
              <input type="text" value={formName} onChange={(e) => setFormName(e.target.value)} className="w-full border border-input-border rounded px-3 py-2 text-sm text-text-primary bg-input-bg focus:outline-none focus:border-input-focus" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Cover Image</label>
              <input type="file" accept="image/*" className="w-full border border-input-border rounded px-3 py-2 text-sm text-text-primary bg-input-bg" />
            </div>
            <div className="flex justify-end">
              <button onClick={handleEdit} className="bg-btn-primary text-white px-4 py-2 rounded text-sm font-medium hover:opacity-90 transition">Save Brand</button>
            </div>
          </div>
        </Modal>
      )}

      {/* Archive Modal */}
      {showArchiveModal && archivingBrand && (
        <Modal title="Confirm Archive" onClose={() => { setShowArchiveModal(false); setArchivingBrand(null); }}>
          <div className="space-y-4">
            <p className="text-sm text-text-primary">Are you sure you want to archive <strong>{archivingBrand.name}</strong>?</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => { setShowArchiveModal(false); setArchivingBrand(null); }} className="bg-white/10 text-text-primary px-4 py-2 rounded text-sm font-medium hover:opacity-90 transition">Cancel</button>
              <button onClick={handleArchive} className="bg-btn-danger text-white px-4 py-2 rounded text-sm font-medium hover:opacity-90 transition">Yes, Archive</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

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
