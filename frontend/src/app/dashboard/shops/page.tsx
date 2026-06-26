'use client';

import { useState } from 'react';
import { Plus, Search, Pencil, Trash2, X } from 'lucide-react';

interface Shop {
  id: number;
  name: string;
  slug: string;
}

const initialShops: Shop[] = [
  { id: 1, name: 'MAIN BRANCH', slug: 'main-branch' },
  { id: 2, name: 'DOWNTOWN BRANCH', slug: 'downtown-branch' },
  { id: 3, name: 'MALL BRANCH', slug: 'mall-branch' },
];

function generateSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export default function ShopsPage() {
  const [shops, setShops] = useState<Shop[]>(initialShops);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [editingShop, setEditingShop] = useState<Shop | null>(null);
  const [archivingShop, setArchivingShop] = useState<Shop | null>(null);
  const [newName, setNewName] = useState('');

  const filteredShops = shops.filter(
    (s) => s.name.toLowerCase().includes(search.toLowerCase()) || s.slug.includes(search.toLowerCase())
  );

  function handleAdd() {
    if (!newName.trim()) return;
    const newShop: Shop = {
      id: Date.now(),
      name: newName.trim().toUpperCase(),
      slug: generateSlug(newName.trim()),
    };
    setShops([...shops, newShop]);
    setNewName('');
    setShowAddModal(false);
  }

  function handleEdit() {
    if (!editingShop || !newName.trim()) return;
    setShops(shops.map((s) => (s.id === editingShop.id ? { ...s, name: newName.trim().toUpperCase(), slug: generateSlug(newName.trim()) } : s)));
    setNewName('');
    setEditingShop(null);
    setShowEditModal(false);
  }

  function handleArchive() {
    if (!archivingShop) return;
    setShops(shops.filter((s) => s.id !== archivingShop.id));
    setArchivingShop(null);
    setShowArchiveModal(false);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text-primary">Shops</h1>
        <button
          onClick={() => { setNewName(''); setShowAddModal(true); }}
          className="flex items-center gap-2 bg-btn-primary text-white px-4 py-2 rounded text-sm font-medium hover:opacity-90 transition"
        >
          <Plus size={16} />
          Add new Shop
        </button>
      </div>

      {/* Search */}
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

      {/* Table */}
      <div className="bg-card-bg border border-card-border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-table-header">
              <th className="text-left px-4 py-3 text-xs font-semibold uppercase text-table-header-text w-16">#</th>
              <th className="text-left px-4 py-3 text-xs font-semibold uppercase text-table-header-text">Name</th>
              <th className="text-left px-4 py-3 text-xs font-semibold uppercase text-table-header-text">Slug</th>
              <th className="text-right px-4 py-3 text-xs font-semibold uppercase text-table-header-text w-24"></th>
            </tr>
          </thead>
          <tbody>
            {filteredShops.length === 0 ? (
              <tr><td colSpan={4} className="text-center py-8 text-text-muted">No shops found.</td></tr>
            ) : (
              filteredShops.map((shop, i) => (
                <tr key={shop.id} className="border-t border-card-border hover:bg-white/5 transition-colors">
                  <td className="px-4 py-3 text-sm text-accent-blue font-medium">{i + 1}</td>
                  <td className="px-4 py-3 text-sm text-accent-blue font-medium">{shop.name}</td>
                  <td className="px-4 py-3 text-sm text-accent-blue">{shop.slug}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => { setEditingShop(shop); setNewName(shop.name); setShowEditModal(true); }}
                        className="text-accent-blue hover:text-accent-blue/80 transition"
                        title="Edit"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => { setArchivingShop(shop); setShowArchiveModal(true); }}
                        className="text-btn-danger hover:text-btn-danger/80 transition"
                        title="Archive"
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
        <Modal title="Add New Shop" onClose={() => setShowAddModal(false)}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Name</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full border border-input-border rounded px-3 py-2 text-sm text-text-primary bg-input-bg focus:outline-none focus:border-input-focus"
              />
            </div>
            <div className="flex justify-end">
              <button onClick={handleAdd} className="bg-btn-primary text-white px-4 py-2 rounded text-sm font-medium hover:opacity-90 transition">
                Save Shop
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Edit Modal */}
      {showEditModal && editingShop && (
        <Modal title="Edit Shop" onClose={() => { setShowEditModal(false); setEditingShop(null); }}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Name</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full border border-input-border rounded px-3 py-2 text-sm text-text-primary bg-input-bg focus:outline-none focus:border-input-focus"
              />
            </div>
            <div className="flex justify-end">
              <button onClick={handleEdit} className="bg-btn-primary text-white px-4 py-2 rounded text-sm font-medium hover:opacity-90 transition">
                Save Shop
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Archive Confirm Modal */}
      {showArchiveModal && archivingShop && (
        <Modal title="Confirm Archive" onClose={() => { setShowArchiveModal(false); setArchivingShop(null); }}>
          <div className="space-y-4">
            <p className="text-sm text-text-primary">
              Are you sure you want to archive <strong>{archivingShop.name}</strong>?
            </p>
            <div className="flex justify-end gap-2">
              <button onClick={() => { setShowArchiveModal(false); setArchivingShop(null); }} className="bg-white/10 text-text-primary px-4 py-2 rounded text-sm font-medium hover:opacity-90 transition">
                Cancel
              </button>
              <button onClick={handleArchive} className="bg-btn-danger text-white px-4 py-2 rounded text-sm font-medium hover:opacity-90 transition">
                Yes, Archive
              </button>
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
          <button onClick={onClose} className="text-text-muted hover:text-text-primary transition">
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
