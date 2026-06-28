'use client';

import { useState } from 'react';
import { Plus, Search, Pencil, Trash2, X, Upload, Download, RefreshCw } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  image: string | null;
  brand: string;
  sellingPrice: number;
  quantityAlert: number;
  quantities: Record<string, number>;
}

const shopsList = ['Main Branch', 'Downtown Branch', 'Mall Branch'];
const brandsList = ['All Brands', 'Brand A', 'Brand B', 'Brand C'];

const initialProducts: Product[] = [
  { id: 1, name: 'PRODUCT ONE', image: null, brand: 'Brand A', sellingPrice: 250, quantityAlert: 0, quantities: { 'Main Branch': 12, 'Downtown Branch': 8, 'Mall Branch': 5 } },
  { id: 2, name: 'PRODUCT TWO', image: null, brand: 'Brand B', sellingPrice: 180, quantityAlert: 0, quantities: { 'Main Branch': 45, 'Downtown Branch': 30, 'Mall Branch': 22 } },
  { id: 3, name: 'PRODUCT THREE', image: null, brand: 'Brand A', sellingPrice: 500, quantityAlert: 5, quantities: { 'Main Branch': 3, 'Downtown Branch': 0, 'Mall Branch': 1 } },
];

const ENTRIES_OPTIONS = [5, 10, 25, 50, 100, 'All'] as const;

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [search, setSearch] = useState('');
  const [shopFilter, setShopFilter] = useState('All Shops');
  const [brandFilter, setBrandFilter] = useState('All Brands');
  const [entriesPerPage, setEntriesPerPage] = useState<number | 'All'>(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showRestockModal, setShowRestockModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [archivingProduct, setArchivingProduct] = useState<Product | null>(null);

  // Form state
  const [formName, setFormName] = useState('');
  const [formBrand, setFormBrand] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formAlert, setFormAlert] = useState('0');
  const [formQuantities, setFormQuantities] = useState<Record<string, string>>({});

  const filteredProducts = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchBrand = brandFilter === 'All Brands' || p.brand === brandFilter;
    return matchSearch && matchBrand;
  });

  const totalPages = entriesPerPage === 'All' ? 1 : Math.ceil(filteredProducts.length / entriesPerPage);
  const displayProducts = entriesPerPage === 'All' ? filteredProducts : filteredProducts.slice((currentPage - 1) * entriesPerPage, currentPage * entriesPerPage);

  function openAddModal() {
    setFormName('');
    setFormBrand('');
    setFormPrice('');
    setFormAlert('0');
    const q: Record<string, string> = {};
    shopsList.forEach((s) => (q[s] = ''));
    setFormQuantities(q);
    setShowAddModal(true);
  }

  function openEditModal(product: Product) {
    setEditingProduct(product);
    setFormName(product.name);
    setFormBrand(product.brand);
    setFormPrice(product.sellingPrice.toString());
    setFormAlert(product.quantityAlert.toString());
    const q: Record<string, string> = {};
    shopsList.forEach((s) => (q[s] = (product.quantities[s] || 0).toString()));
    setFormQuantities(q);
    setShowEditModal(true);
  }

  function handleAdd() {
    if (!formName.trim()) return;
    const quantities: Record<string, number> = {};
    shopsList.forEach((s) => (quantities[s] = parseInt(formQuantities[s] || '0') || 0));
    const newProduct: Product = {
      id: Date.now(),
      name: formName.trim().toUpperCase(),
      image: null,
      brand: formBrand,
      sellingPrice: parseFloat(formPrice) || 0,
      quantityAlert: parseInt(formAlert) || 0,
      quantities,
    };
    setProducts([...products, newProduct]);
    setShowAddModal(false);
  }

  function handleEdit() {
    if (!editingProduct || !formName.trim()) return;
    const quantities: Record<string, number> = {};
    shopsList.forEach((s) => (quantities[s] = parseInt(formQuantities[s] || '0') || 0));
    setProducts(products.map((p) => p.id === editingProduct.id ? { ...p, name: formName.trim().toUpperCase(), brand: formBrand, sellingPrice: parseFloat(formPrice) || 0, quantityAlert: parseInt(formAlert) || 0, quantities } : p));
    setEditingProduct(null);
    setShowEditModal(false);
  }

  function handleArchive() {
    if (!archivingProduct) return;
    setProducts(products.filter((p) => p.id !== archivingProduct.id));
    setArchivingProduct(null);
    setShowArchiveModal(false);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-2xl font-bold text-text-primary">Products</h1>
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={() => setShowImportModal(true)} className="flex items-center gap-1 bg-btn-danger text-white px-3 py-2 rounded text-sm font-medium hover:opacity-90 transition">
            <Upload size={14} /> Import Products
          </button>
          <button className="flex items-center gap-1 bg-btn-primary text-white px-3 py-2 rounded text-sm font-medium hover:opacity-90 transition">
            <Download size={14} /> Export Products
          </button>
          <button onClick={openAddModal} className="flex items-center gap-1 bg-btn-primary text-white px-3 py-2 rounded text-sm font-medium hover:opacity-90 transition">
            <Plus size={14} /> Add Product
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <select value={shopFilter} onChange={(e) => setShopFilter(e.target.value)} className="border border-input-border rounded px-3 py-2 text-sm text-text-primary bg-input-bg focus:outline-none focus:border-input-focus min-w-[180px]">
          <option>All Shops</option>
          {shopsList.map((s) => <option key={s}>{s}</option>)}
        </select>
        <select value={brandFilter} onChange={(e) => setBrandFilter(e.target.value)} className="border border-input-border rounded px-3 py-2 text-sm text-text-primary bg-input-bg focus:outline-none focus:border-input-focus min-w-[180px]">
          {brandsList.map((b) => <option key={b}>{b}</option>)}
        </select>
        <button onClick={() => setShowRestockModal(true)} className="flex items-center gap-1 bg-btn-danger text-white px-3 py-2 rounded text-sm font-medium hover:opacity-90 transition">
          <RefreshCw size={14} /> Restock
        </button>
        <button className="flex items-center gap-1 bg-btn-primary text-white px-3 py-2 rounded text-sm font-medium hover:opacity-90 transition">
          <Download size={14} /> Excel Template
        </button>
      </div>

      {/* Table Controls */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2 text-sm text-text-secondary">
          <span>Show</span>
          <select value={entriesPerPage.toString()} onChange={(e) => { const v = e.target.value; setEntriesPerPage(v === 'All' ? 'All' : parseInt(v)); setCurrentPage(1); }} className="border border-input-border rounded px-2 py-1 text-sm bg-input-bg">
            {ENTRIES_OPTIONS.map((o) => <option key={o} value={o.toString()}>{o}</option>)}
          </select>
          <span>entries</span>
        </div>
        <input type="text" placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} className="border border-input-border rounded px-3 py-1.5 text-sm text-text-primary bg-input-bg focus:outline-none focus:border-input-focus w-48" />
      </div>

      {/* Table */}
      <div className="bg-card-bg border border-card-border rounded-lg overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-table-header">
              <th className="text-left px-3 py-3 text-xs font-semibold uppercase text-table-header-text w-10">#</th>
              <th className="text-left px-3 py-3 text-xs font-semibold uppercase text-table-header-text w-16">Image</th>
              <th className="text-left px-3 py-3 text-xs font-semibold uppercase text-table-header-text">Name</th>
              <th className="text-left px-3 py-3 text-xs font-semibold uppercase text-table-header-text">Quantity</th>
              <th className="text-left px-3 py-3 text-xs font-semibold uppercase text-table-header-text">Brand</th>
              <th className="text-left px-3 py-3 text-xs font-semibold uppercase text-table-header-text">Selling Price</th>
              <th className="text-left px-3 py-3 text-xs font-semibold uppercase text-table-header-text">Qty Alert</th>
              <th className="text-right px-3 py-3 text-xs font-semibold uppercase text-table-header-text w-20"></th>
            </tr>
          </thead>
          <tbody>
            {displayProducts.length === 0 ? (
              <tr><td colSpan={8} className="text-center py-8 text-text-muted">No products found.</td></tr>
            ) : (
              displayProducts.map((product, i) => (
                <tr key={product.id} className="border-t border-card-border hover:bg-white/5 transition-colors align-top">
                  <td className="px-3 py-3 text-sm text-text-muted font-medium">{(entriesPerPage === 'All' ? 0 : (currentPage - 1) * (entriesPerPage as number)) + i + 1}</td>
                  <td className="px-3 py-3">
                    {product.image ? (
                      <div className="w-10 h-10 rounded bg-white/10 overflow-hidden"><img src={product.image} alt="" className="w-full h-full object-cover" /></div>
                    ) : (
                      <span className="text-xs text-text-muted">No Image</span>
                    )}
                  </td>
                  <td className="px-3 py-3 text-sm text-text-primary font-medium">{product.name}</td>
                  <td className="px-3 py-3 text-sm">
                    {shopFilter !== 'All Shops' ? (
                      <span className="font-medium text-text-primary">{product.quantities[shopFilter] || 0}</span>
                    ) : (
                      <div className="space-y-0.5">
                        {shopsList.map((shop) => (
                          <div key={shop} className="text-xs">
                            <span className="font-semibold text-text-primary">{shop}:</span>{' '}
                            <span className="text-text-secondary">{product.quantities[shop] || 0}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="px-3 py-3 text-sm text-text-primary">{product.brand}</td>
                  <td className="px-3 py-3 text-sm text-text-primary">₱{product.sellingPrice.toFixed(2)}</td>
                  <td className="px-3 py-3 text-sm text-text-primary">{product.quantityAlert}</td>
                  <td className="px-3 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEditModal(product)} className="text-text-muted hover:text-accent-primary transition"><Pencil size={16} /></button>
                      <button onClick={() => { setArchivingProduct(product); setShowArchiveModal(true); }} className="text-btn-danger hover:text-btn-danger/80 transition"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between text-sm text-text-secondary">
        <span>Showing {displayProducts.length === 0 ? 0 : ((entriesPerPage === 'All' ? 0 : (currentPage - 1) * (entriesPerPage as number)) + 1)} to {entriesPerPage === 'All' ? filteredProducts.length : Math.min(currentPage * (entriesPerPage as number), filteredProducts.length)} of {filteredProducts.length} products</span>
        {totalPages > 1 && (
          <div className="flex items-center gap-1">
            <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="px-2 py-1 rounded border border-card-border disabled:opacity-50">Previous</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button key={p} onClick={() => setCurrentPage(p)} className={`px-2.5 py-1 rounded ${p === currentPage ? 'bg-accent-blue text-white' : 'border border-card-border hover:bg-white/5'}`}>{p}</button>
            ))}
            <button onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="px-2 py-1 rounded border border-card-border disabled:opacity-50">Next</button>
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <ProductFormModal title="Add New Product" onClose={() => setShowAddModal(false)} onSubmit={handleAdd} buttonLabel="Save Product" formName={formName} setFormName={setFormName} formBrand={formBrand} setFormBrand={setFormBrand} formPrice={formPrice} setFormPrice={setFormPrice} formAlert={formAlert} setFormAlert={setFormAlert} formQuantities={formQuantities} setFormQuantities={setFormQuantities} shopsList={shopsList} brandsList={brandsList} />
      )}

      {/* Edit Product Modal */}
      {showEditModal && editingProduct && (
        <ProductFormModal title="Edit Product" onClose={() => { setShowEditModal(false); setEditingProduct(null); }} onSubmit={handleEdit} buttonLabel="Update Product" buttonColor="bg-accent-green" formName={formName} setFormName={setFormName} formBrand={formBrand} setFormBrand={setFormBrand} formPrice={formPrice} setFormPrice={setFormPrice} formAlert={formAlert} setFormAlert={setFormAlert} formQuantities={formQuantities} setFormQuantities={setFormQuantities} shopsList={shopsList} brandsList={brandsList} />
      )}

      {/* Archive Modal */}
      {showArchiveModal && archivingProduct && (
        <Modal title="Confirm Archive" onClose={() => { setShowArchiveModal(false); setArchivingProduct(null); }}>
          <div className="space-y-4">
            <p className="text-sm text-text-primary">Are you sure you want to archive <strong>{archivingProduct.name}</strong>?</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => { setShowArchiveModal(false); setArchivingProduct(null); }} className="bg-white/10 text-text-primary px-4 py-2 rounded text-sm font-medium">Cancel</button>
              <button onClick={handleArchive} className="bg-btn-danger text-white px-4 py-2 rounded text-sm font-medium">Yes, Archive</button>
            </div>
          </div>
        </Modal>
      )}

      {/* Import Modal */}
      {showImportModal && (
        <Modal title="Import Products" onClose={() => setShowImportModal(false)}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Upload Products File</label>
              <input type="file" accept=".xlsx,.csv" className="w-full border border-input-border rounded px-3 py-2 text-sm bg-input-bg" />
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowImportModal(false)} className="bg-white/10 text-text-primary px-4 py-2 rounded text-sm font-medium">Close</button>
              <button className="bg-btn-primary text-white px-4 py-2 rounded text-sm font-medium">Import Products</button>
            </div>
          </div>
        </Modal>
      )}

      {/* Restock Modal */}
      {showRestockModal && (
        <Modal title="Restock Products" onClose={() => setShowRestockModal(false)}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Upload Products File</label>
              <input type="file" accept=".xlsx,.csv" className="w-full border border-input-border rounded px-3 py-2 text-sm bg-input-bg" />
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowRestockModal(false)} className="bg-white/10 text-text-primary px-4 py-2 rounded text-sm font-medium">Close</button>
              <button className="bg-btn-primary text-white px-4 py-2 rounded text-sm font-medium">Restock Products</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

function ProductFormModal({ title, onClose, onSubmit, buttonLabel, buttonColor, formName, setFormName, formBrand, setFormBrand, formPrice, setFormPrice, formAlert, setFormAlert, formQuantities, setFormQuantities, shopsList, brandsList }: {
  title: string; onClose: () => void; onSubmit: () => void; buttonLabel: string; buttonColor?: string;
  formName: string; setFormName: (v: string) => void; formBrand: string; setFormBrand: (v: string) => void;
  formPrice: string; setFormPrice: (v: string) => void; formAlert: string; setFormAlert: (v: string) => void;
  formQuantities: Record<string, string>; setFormQuantities: (v: Record<string, string>) => void;
  shopsList: string[]; brandsList: string[];
}) {
  return (
    <Modal title={title} onClose={onClose}>
      <div className="space-y-4 max-h-[70vh] overflow-y-auto">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">Name</label>
          <input type="text" value={formName} onChange={(e) => setFormName(e.target.value)} className="w-full border border-input-border rounded px-3 py-2 text-sm bg-input-bg focus:outline-none focus:border-input-focus" />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">Quantity</label>
          <div className="space-y-2">
            {shopsList.map((shop) => (
              <div key={shop} className="flex items-center gap-2">
                <span className="text-xs font-medium text-accent-primary bg-white/10 px-2 py-1.5 rounded min-w-[140px]">{shop}</span>
                <input type="number" placeholder={`Quantity for ${shop}`} value={formQuantities[shop] || ''} onChange={(e) => setFormQuantities({ ...formQuantities, [shop]: e.target.value })} className="flex-1 border border-input-border rounded px-3 py-1.5 text-sm bg-input-bg focus:outline-none focus:border-input-focus" />
              </div>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">Brand</label>
          <select value={formBrand} onChange={(e) => setFormBrand(e.target.value)} className="w-full border border-input-border rounded px-3 py-2 text-sm bg-input-bg focus:outline-none focus:border-input-focus">
            <option value="">Select a brand</option>
            {brandsList.filter((b) => b !== 'All Brands').map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">Selling Price</label>
          <input type="number" step="0.01" value={formPrice} onChange={(e) => setFormPrice(e.target.value)} className="w-full border border-input-border rounded px-3 py-2 text-sm bg-input-bg focus:outline-none focus:border-input-focus" />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">Quantity Alert</label>
          <input type="number" value={formAlert} onChange={(e) => setFormAlert(e.target.value)} className="w-full border border-input-border rounded px-3 py-2 text-sm bg-input-bg focus:outline-none focus:border-input-focus" />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">Product Image</label>
          <input type="file" accept="image/*" className="w-full border border-input-border rounded px-3 py-2 text-sm bg-input-bg" />
        </div>
        <div className="flex justify-end">
          <button onClick={onSubmit} className={`${buttonColor || 'bg-btn-primary'} text-white px-4 py-2 rounded text-sm font-medium hover:opacity-90 transition`}>{buttonLabel}</button>
        </div>
      </div>
    </Modal>
  );
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-card-bg border border-card-border rounded-lg shadow-xl w-full max-w-lg mx-4 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-text-primary">{title}</h3>
          <button onClick={onClose} className="text-text-muted hover:text-text-primary transition"><X size={20} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}
