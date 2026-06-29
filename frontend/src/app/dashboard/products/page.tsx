'use client';

import { useMemo, useState } from 'react';
import { Plus, Search, Pencil, Trash2, X, Loader2 } from 'lucide-react';
import {
  useProducts,
  useBrands,
  useBranches,
  useCreateProduct,
  useUpdateProduct,
  useArchiveProduct,
} from '@/lib/hooks';
import { getApiErrorMessage } from '@/lib/api';
import type { Product } from '@/lib/types';

const ENTRIES_OPTIONS = [5, 10, 25, 50, 100, 'All'] as const;

export default function ProductsPage() {
  const [search, setSearch] = useState('');
  const [shopFilter, setShopFilter] = useState(''); // branchId or ''
  const [brandFilter, setBrandFilter] = useState(''); // brandId or ''
  const [entriesPerPage, setEntriesPerPage] = useState<number | 'All'>(10);
  const [currentPage, setCurrentPage] = useState(1);

  const { data: branchData } = useBranches();
  const { data: brandData } = useBrands();
  const branches = branchData?.data ?? [];
  const brands = brandData?.data ?? [];

  const { data, isLoading, isError, error } = useProducts({
    search,
    brandId: brandFilter || undefined,
  });
  const products = data?.data ?? [];

  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const archiveProduct = useArchiveProduct();

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
  const [formError, setFormError] = useState<string | null>(null);

  const totalPages = entriesPerPage === 'All' ? 1 : Math.max(1, Math.ceil(products.length / entriesPerPage));
  const displayProducts = entriesPerPage === 'All' ? products : products.slice((currentPage - 1) * entriesPerPage, currentPage * entriesPerPage);

  const branchesForForm = useMemo(() => branches, [branches]);

  function openAddModal() {
    setFormName('');
    setFormBrand(brands[0]?.id ?? '');
    setFormPrice('');
    setFormAlert('0');
    const q: Record<string, string> = {};
    branchesForForm.forEach((b) => (q[b.id] = ''));
    setFormQuantities(q);
    setFormError(null);
    setShowAddModal(true);
  }

  function openEditModal(product: Product) {
    setEditingProduct(product);
    setFormName(product.name);
    setFormBrand(product.brand?.id ?? brands[0]?.id ?? '');
    setFormPrice(product.sellingPrice.toString());
    setFormAlert(product.quantityAlert.toString());
    const q: Record<string, string> = {};
    branchesForForm.forEach((b) => {
      const found = product.quantities.find((x) => x.branchId === b.id);
      q[b.id] = (found?.quantity ?? 0).toString();
    });
    setFormQuantities(q);
    setFormError(null);
    setShowEditModal(true);
  }

  function buildQuantitiesPayload() {
    return branchesForForm
      .map((b) => ({ branchId: b.id, quantity: parseInt(formQuantities[b.id] || '0') || 0 }))
      .filter((q) => q.quantity > 0 || true); // send all so edits to 0 persist
  }

  async function handleAdd() {
    if (!formName.trim()) { setFormError('Product name is required.'); return; }
    if (!formBrand) { setFormError('Please select a brand.'); return; }
    setFormError(null);
    try {
      await createProduct.mutateAsync({
        name: formName.trim(),
        brandId: formBrand,
        sellingPrice: parseFloat(formPrice) || 0,
        quantityAlert: parseInt(formAlert) || 0,
        quantities: buildQuantitiesPayload(),
      });
      setShowAddModal(false);
    } catch (e) { setFormError(getApiErrorMessage(e)); }
  }

  async function handleEdit() {
    if (!editingProduct || !formName.trim()) { setFormError('Product name is required.'); return; }
    if (!formBrand) { setFormError('Please select a brand.'); return; }
    setFormError(null);
    try {
      await updateProduct.mutateAsync({
        id: editingProduct.id,
        name: formName.trim(),
        brandId: formBrand,
        sellingPrice: parseFloat(formPrice) || 0,
        quantityAlert: parseInt(formAlert) || 0,
        quantities: buildQuantitiesPayload(),
      });
      setEditingProduct(null);
      setShowEditModal(false);
    } catch (e) { setFormError(getApiErrorMessage(e)); }
  }

  async function handleArchive() {
    if (!archivingProduct) return;
    try {
      await archiveProduct.mutateAsync(archivingProduct.id);
      setArchivingProduct(null);
      setShowArchiveModal(false);
    } catch (e) { setFormError(getApiErrorMessage(e)); }
  }

  function qtyForBranch(product: Product, branchId: string) {
    return product.quantities.find((q) => q.branchId === branchId)?.quantity ?? 0;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-2xl font-bold text-text-primary">Products</h1>
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={() => setShowImportModal(true)} className="flex items-center gap-1 bg-btn-primary text-white px-3 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition">
            Import Products
          </button>
          <button onClick={openAddModal} className="flex items-center gap-1 btn-grad px-3 py-2 rounded-lg text-sm font-medium">
            <Plus size={14} /> Add Product
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <select value={shopFilter} onChange={(e) => setShopFilter(e.target.value)} className="border border-input-border rounded px-3 py-2 text-sm text-text-primary bg-input-bg focus:outline-none focus:border-input-focus min-w-[180px]">
          <option value="">All Shops</option>
          {branches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
        </select>
        <select value={brandFilter} onChange={(e) => { setBrandFilter(e.target.value); setCurrentPage(1); }} className="border border-input-border rounded px-3 py-2 text-sm text-text-primary bg-input-bg focus:outline-none focus:border-input-focus min-w-[180px]">
          <option value="">All Brands</option>
          {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
        </select>
        <button onClick={() => setShowRestockModal(true)} className="flex items-center gap-1 bg-btn-primary text-white px-3 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition">
          Restock
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
        <input type="text" placeholder="Search products..." value={search} onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }} className="border border-input-border rounded px-3 py-1.5 text-sm text-text-primary bg-input-bg focus:outline-none focus:border-input-focus w-48" />
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
            {isLoading ? (
              <tr><td colSpan={8} className="text-center py-8 text-text-muted"><Loader2 className="inline animate-spin mr-2" size={16} />Loading products...</td></tr>
            ) : isError ? (
              <tr><td colSpan={8} className="text-center py-8 text-accent-red">{getApiErrorMessage(error)}</td></tr>
            ) : displayProducts.length === 0 ? (
              <tr><td colSpan={8} className="text-center py-8 text-text-muted">No products found.</td></tr>
            ) : (
              displayProducts.map((product, i) => (
                <tr key={product.id} className="border-t border-card-border hover:bg-white/5 transition-colors align-top">
                  <td className="px-3 py-3 text-sm text-accent-blue font-medium">{(entriesPerPage === 'All' ? 0 : (currentPage - 1) * (entriesPerPage as number)) + i + 1}</td>
                  <td className="px-3 py-3">
                    {product.image ? (
                      <div className="w-10 h-10 rounded bg-white/10 overflow-hidden"><img src={product.image} alt="" className="w-full h-full object-cover" /></div>
                    ) : (
                      <span className="text-xs text-text-muted">No Image</span>
                    )}
                  </td>
                  <td className="px-3 py-3 text-sm text-text-primary font-medium">{product.name}</td>
                  <td className="px-3 py-3 text-sm">
                    {shopFilter ? (
                      <span className="font-medium text-text-primary">{qtyForBranch(product, shopFilter)}</span>
                    ) : (
                      <div className="space-y-0.5">
                        {branches.map((b) => (
                          <div key={b.id} className="text-xs">
                            <span className="font-semibold text-text-primary">{b.name}:</span>{' '}
                            <span className="text-accent-blue">{qtyForBranch(product, b.id)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="px-3 py-3 text-sm text-text-primary">{product.brand?.name ?? '—'}</td>
                  <td className="px-3 py-3 text-sm text-text-primary">₱{product.sellingPrice.toFixed(2)}</td>
                  <td className="px-3 py-3 text-sm">
                    {product.quantityAlert > 0 ? (
                      <span className="badge badge-neutral"><span className="badge-dot bg-accent-orange" />{product.quantityAlert}</span>
                    ) : (
                      <span className="text-text-muted">{product.quantityAlert}</span>
                    )}
                  </td>
                  <td className="px-3 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEditModal(product)} className="icon-btn text-accent-blue hover:bg-accent-blue/10"><Pencil size={16} /></button>
                      <button onClick={() => { setArchivingProduct(product); setFormError(null); setShowArchiveModal(true); }} className="icon-btn text-accent-red hover:bg-accent-red/10"><Trash2 size={16} /></button>
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
        <span>Showing {displayProducts.length === 0 ? 0 : ((entriesPerPage === 'All' ? 0 : (currentPage - 1) * (entriesPerPage as number)) + 1)} to {entriesPerPage === 'All' ? products.length : Math.min(currentPage * (entriesPerPage as number), products.length)} of {products.length} products</span>
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

      {showAddModal && (
        <ProductFormModal title="Add New Product" onClose={() => setShowAddModal(false)} onSubmit={handleAdd} error={formError} buttonLabel={createProduct.isPending ? 'Saving...' : 'Save Product'} disabled={createProduct.isPending} formName={formName} setFormName={setFormName} formBrand={formBrand} setFormBrand={setFormBrand} formPrice={formPrice} setFormPrice={setFormPrice} formAlert={formAlert} setFormAlert={setFormAlert} formQuantities={formQuantities} setFormQuantities={setFormQuantities} branches={branchesForForm} brands={brands} />
      )}

      {showEditModal && editingProduct && (
        <ProductFormModal title="Edit Product" onClose={() => { setShowEditModal(false); setEditingProduct(null); }} onSubmit={handleEdit} error={formError} buttonLabel={updateProduct.isPending ? 'Saving...' : 'Update Product'} disabled={updateProduct.isPending} formName={formName} setFormName={setFormName} formBrand={formBrand} setFormBrand={setFormBrand} formPrice={formPrice} setFormPrice={setFormPrice} formAlert={formAlert} setFormAlert={setFormAlert} formQuantities={formQuantities} setFormQuantities={setFormQuantities} branches={branchesForForm} brands={brands} />
      )}

      {showArchiveModal && archivingProduct && (
        <Modal title="Confirm Archive" onClose={() => { setShowArchiveModal(false); setArchivingProduct(null); }}>
          <div className="space-y-4">
            <p className="text-sm text-text-primary">Are you sure you want to archive <strong>{archivingProduct.name}</strong>?</p>
            {formError && <p className="text-sm text-accent-red">{formError}</p>}
            <div className="flex justify-end gap-2">
              <button onClick={() => { setShowArchiveModal(false); setArchivingProduct(null); }} className="bg-white/10 text-text-primary px-4 py-2 rounded text-sm font-medium">Cancel</button>
              <button onClick={handleArchive} disabled={archiveProduct.isPending} className="bg-btn-danger text-white px-4 py-2 rounded text-sm font-medium disabled:opacity-60">{archiveProduct.isPending ? 'Archiving...' : 'Yes, Archive'}</button>
            </div>
          </div>
        </Modal>
      )}

      {showImportModal && (
        <Modal title="Import Products" onClose={() => setShowImportModal(false)}>
          <div className="space-y-4">
            <p className="text-sm text-text-secondary">Bulk import from a spreadsheet isn&apos;t wired to the backend yet. Use <strong>Add Product</strong> to create products for now.</p>
            <div className="flex justify-end">
              <button onClick={() => setShowImportModal(false)} className="bg-white/10 text-text-primary px-4 py-2 rounded text-sm font-medium">Close</button>
            </div>
          </div>
        </Modal>
      )}

      {showRestockModal && (
        <Modal title="Restock Products" onClose={() => setShowRestockModal(false)}>
          <div className="space-y-4">
            <p className="text-sm text-text-secondary">Bulk restock isn&apos;t wired to the backend yet. Edit a product to adjust per-branch quantities.</p>
            <div className="flex justify-end">
              <button onClick={() => setShowRestockModal(false)} className="bg-white/10 text-text-primary px-4 py-2 rounded text-sm font-medium">Close</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

function ProductFormModal({ title, onClose, onSubmit, buttonLabel, disabled, error, formName, setFormName, formBrand, setFormBrand, formPrice, setFormPrice, formAlert, setFormAlert, formQuantities, setFormQuantities, branches, brands }: {
  title: string; onClose: () => void; onSubmit: () => void; buttonLabel: string; disabled?: boolean; error?: string | null;
  formName: string; setFormName: (v: string) => void; formBrand: string; setFormBrand: (v: string) => void;
  formPrice: string; setFormPrice: (v: string) => void; formAlert: string; setFormAlert: (v: string) => void;
  formQuantities: Record<string, string>; setFormQuantities: (v: Record<string, string>) => void;
  branches: { id: string; name: string }[]; brands: { id: string; name: string }[];
}) {
  return (
    <Modal title={title} onClose={onClose}>
      <div className="space-y-4 max-h-[70vh] overflow-y-auto">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">Name</label>
          <input type="text" value={formName} onChange={(e) => setFormName(e.target.value)} className="w-full border border-input-border rounded px-3 py-2 text-sm bg-input-bg focus:outline-none focus:border-input-focus" />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">Quantity per shop</label>
          <div className="space-y-2">
            {branches.length === 0 && <p className="text-xs text-text-muted">No shops yet. Create a shop first.</p>}
            {branches.map((b) => (
              <div key={b.id} className="flex items-center gap-2">
                <span className="text-xs font-medium text-accent-primary bg-white/10 px-2 py-1.5 rounded min-w-[140px]">{b.name}</span>
                <input type="number" min="0" placeholder={`Quantity for ${b.name}`} value={formQuantities[b.id] ?? ''} onChange={(e) => setFormQuantities({ ...formQuantities, [b.id]: e.target.value })} className="flex-1 border border-input-border rounded px-3 py-1.5 text-sm bg-input-bg focus:outline-none focus:border-input-focus" />
              </div>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">Brand</label>
          <select value={formBrand} onChange={(e) => setFormBrand(e.target.value)} className="w-full border border-input-border rounded px-3 py-2 text-sm bg-input-bg focus:outline-none focus:border-input-focus">
            <option value="">Select a brand</option>
            {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">Selling Price (₱)</label>
          <input type="number" step="0.01" min="0" value={formPrice} onChange={(e) => setFormPrice(e.target.value)} className="w-full border border-input-border rounded px-3 py-2 text-sm bg-input-bg focus:outline-none focus:border-input-focus" />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">Quantity Alert</label>
          <input type="number" min="0" value={formAlert} onChange={(e) => setFormAlert(e.target.value)} className="w-full border border-input-border rounded px-3 py-2 text-sm bg-input-bg focus:outline-none focus:border-input-focus" />
        </div>
        {error && <p className="text-sm text-accent-red">{error}</p>}
        <div className="flex justify-end">
          <button onClick={onSubmit} disabled={disabled} className="btn-grad text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition disabled:opacity-60">{buttonLabel}</button>
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
