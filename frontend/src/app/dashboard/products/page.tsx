'use client';

import { useMemo, useState } from 'react';
import { Plus, Pencil, Trash2, X, Loader2, Upload, Download, RefreshCw, FileDown } from 'lucide-react';
import {
  useProducts,
  useBrands,
  useBranches,
  useCreateProduct,
  useUpdateProduct,
  useArchiveProduct,
  useImportProducts,
  useRestock,
  type ImportProductRow,
  type RestockItem,
} from '@/lib/hooks';
import { getApiErrorMessage } from '@/lib/api';
import { parseCsv, toCsv, downloadCsv, readFileAsText } from '@/lib/csv';
import type { Product, ImportResult, RestockResult } from '@/lib/types';

const ENTRIES_OPTIONS = [5, 10, 25, 50, 100, 'All'] as const;

export default function ProductsPage() {
  const [search, setSearch] = useState('');
  const [shopFilter, setShopFilter] = useState('');
  const [brandFilter, setBrandFilter] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState<number | 'All'>(10);
  const [currentPage, setCurrentPage] = useState(1);

  const { data: branchData } = useBranches();
  const { data: brandData } = useBrands();
  const branches = branchData?.data ?? [];
  const brands = brandData?.data ?? [];

  const { data, isLoading, isError, error } = useProducts({ search, brandId: brandFilter || undefined });
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

  const [formName, setFormName] = useState('');
  const [formBrand, setFormBrand] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formAlert, setFormAlert] = useState('0');
  const [formQuantities, setFormQuantities] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);

  const totalPages = entriesPerPage === 'All' ? 1 : Math.max(1, Math.ceil(products.length / entriesPerPage));
  const displayProducts = entriesPerPage === 'All' ? products : products.slice((currentPage - 1) * entriesPerPage, currentPage * entriesPerPage);
  const branchesForForm = useMemo(() => branches, [branches]);

  function qtyForBranch(product: Product, branchId: string) {
    return product.quantities.find((q) => q.branchId === branchId)?.quantity ?? 0;
  }

  function openAddModal() {
    setFormName(''); setFormBrand(brands[0]?.id ?? ''); setFormPrice(''); setFormAlert('0');
    const q: Record<string, string> = {}; branchesForForm.forEach((b) => (q[b.id] = ''));
    setFormQuantities(q); setFormError(null); setShowAddModal(true);
  }
  function openEditModal(product: Product) {
    setEditingProduct(product);
    setFormName(product.name); setFormBrand(product.brand?.id ?? brands[0]?.id ?? '');
    setFormPrice(product.sellingPrice.toString()); setFormAlert(product.quantityAlert.toString());
    const q: Record<string, string> = {};
    branchesForForm.forEach((b) => { q[b.id] = (product.quantities.find((x) => x.branchId === b.id)?.quantity ?? 0).toString(); });
    setFormQuantities(q); setFormError(null); setShowEditModal(true);
  }
  function buildQuantitiesPayload() {
    return branchesForForm.map((b) => ({ branchId: b.id, quantity: parseInt(formQuantities[b.id] || '0') || 0 }));
  }
  async function handleAdd() {
    if (!formName.trim()) { setFormError('Product name is required.'); return; }
    if (!formBrand) { setFormError('Please select a brand.'); return; }
    setFormError(null);
    try {
      await createProduct.mutateAsync({ name: formName.trim(), brandId: formBrand, sellingPrice: parseFloat(formPrice) || 0, quantityAlert: parseInt(formAlert) || 0, quantities: buildQuantitiesPayload() });
      setShowAddModal(false);
    } catch (e) { setFormError(getApiErrorMessage(e)); }
  }
  async function handleEdit() {
    if (!editingProduct || !formName.trim()) { setFormError('Product name is required.'); return; }
    if (!formBrand) { setFormError('Please select a brand.'); return; }
    setFormError(null);
    try {
      await updateProduct.mutateAsync({ id: editingProduct.id, name: formName.trim(), brandId: formBrand, sellingPrice: parseFloat(formPrice) || 0, quantityAlert: parseInt(formAlert) || 0, quantities: buildQuantitiesPayload() });
      setEditingProduct(null); setShowEditModal(false);
    } catch (e) { setFormError(getApiErrorMessage(e)); }
  }
  async function handleArchive() {
    if (!archivingProduct) return;
    try { await archiveProduct.mutateAsync(archivingProduct.id); setArchivingProduct(null); setShowArchiveModal(false); }
    catch (e) { setFormError(getApiErrorMessage(e)); }
  }

  function handleExport() {
    const headers = ['Name', 'Brand', 'SellingPrice', 'QuantityAlert', ...branches.map((b) => b.name)];
    const rows = products.map((p) => [
      p.name, p.brand?.name ?? '', p.sellingPrice, p.quantityAlert,
      ...branches.map((b) => qtyForBranch(p, b.id)),
    ]);
    downloadCsv(`products-${new Date().toISOString().slice(0, 10)}.csv`, toCsv(headers, rows));
  }
  function handleTemplate() {
    const headers = ['Name', 'Brand', 'SellingPrice', 'QuantityAlert', ...branches.map((b) => b.name)];
    const example = ['Example Vape 5000', 'Example Brand', 350, 5, ...branches.map(() => 0)];
    downloadCsv('products-import-template.csv', toCsv(headers, [example]));
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-2xl font-bold text-text-primary">Products</h1>
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={() => setShowImportModal(true)} className="flex items-center gap-1 bg-btn-primary text-white px-3 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition"><Upload size={14} /> Import</button>
          <button onClick={handleExport} className="flex items-center gap-1 bg-btn-primary text-white px-3 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition"><Download size={14} /> Export</button>
          <button onClick={openAddModal} className="flex items-center gap-1 btn-grad px-3 py-2 rounded-lg text-sm font-medium"><Plus size={14} /> Add Product</button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <select value={shopFilter} onChange={(e) => setShopFilter(e.target.value)} className="border border-input-border rounded px-3 py-2 text-sm text-text-primary bg-input-bg focus:outline-none focus:border-input-focus min-w-[180px]">
          <option value="">All Shops</option>
          {branches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
        </select>
        <select value={brandFilter} onChange={(e) => { setBrandFilter(e.target.value); setCurrentPage(1); }} className="border border-input-border rounded px-3 py-2 text-sm text-text-primary bg-input-bg focus:outline-none focus:border-input-focus min-w-[180px]">
          <option value="">All Brands</option>
          {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
        </select>
        <button onClick={() => setShowRestockModal(true)} className="flex items-center gap-1 bg-btn-primary text-white px-3 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition"><RefreshCw size={14} /> Restock</button>
        <button onClick={handleTemplate} className="flex items-center gap-1 bg-white/10 text-text-primary px-3 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition"><FileDown size={14} /> CSV Template</button>
      </div>

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

      <div className="bg-card-bg border border-card-border rounded-lg overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-table-header">
              <th className="text-left px-3 py-3 text-xs font-semibold uppercase text-table-header-text w-10">#</th>
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
              <tr><td colSpan={7} className="text-center py-8 text-text-muted"><Loader2 className="inline animate-spin mr-2" size={16} />Loading products...</td></tr>
            ) : isError ? (
              <tr><td colSpan={7} className="text-center py-8 text-accent-red">{getApiErrorMessage(error)}</td></tr>
            ) : displayProducts.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-8 text-text-muted">No products found. Add one or import a CSV.</td></tr>
            ) : (
              displayProducts.map((product, i) => (
                <tr key={product.id} className="border-t border-card-border hover:bg-white/5 transition-colors align-top">
                  <td className="px-3 py-3 text-sm text-accent-blue font-medium">{(entriesPerPage === 'All' ? 0 : (currentPage - 1) * (entriesPerPage as number)) + i + 1}</td>
                  <td className="px-3 py-3 text-sm text-text-primary font-medium">{product.name}</td>
                  <td className="px-3 py-3 text-sm">
                    {shopFilter ? (
                      <span className="font-medium text-text-primary">{qtyForBranch(product, shopFilter)}</span>
                    ) : (
                      <div className="space-y-0.5">
                        {branches.map((b) => (
                          <div key={b.id} className="text-xs"><span className="font-semibold text-text-primary">{b.name}:</span> <span className="text-accent-blue">{qtyForBranch(product, b.id)}</span></div>
                        ))}
                        {branches.length === 0 && <span className="text-xs text-text-muted">No shops yet</span>}
                      </div>
                    )}
                  </td>
                  <td className="px-3 py-3 text-sm text-text-primary">{product.brand?.name ?? '—'}</td>
                  <td className="px-3 py-3 text-sm text-text-primary">₱{product.sellingPrice.toFixed(2)}</td>
                  <td className="px-3 py-3 text-sm">
                    {product.quantityAlert > 0 ? (<span className="badge badge-neutral"><span className="badge-dot bg-accent-orange" />{product.quantityAlert}</span>) : (<span className="text-text-muted">{product.quantityAlert}</span>)}
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

      <div className="flex items-center justify-between text-sm text-text-secondary">
        <span>Showing {displayProducts.length === 0 ? 0 : ((entriesPerPage === 'All' ? 0 : (currentPage - 1) * (entriesPerPage as number)) + 1)} to {entriesPerPage === 'All' ? products.length : Math.min(currentPage * (entriesPerPage as number), products.length)} of {products.length} products</span>
        {totalPages > 1 && (
          <div className="flex items-center gap-1">
            <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="px-2 py-1 rounded border border-card-border disabled:opacity-50">Previous</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (<button key={p} onClick={() => setCurrentPage(p)} className={`px-2.5 py-1 rounded ${p === currentPage ? 'bg-accent-blue text-white' : 'border border-card-border hover:bg-white/5'}`}>{p}</button>))}
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
      {showImportModal && <ImportModal branches={branches} onClose={() => setShowImportModal(false)} />}
      {showRestockModal && <RestockModal products={products} branches={branches} onClose={() => setShowRestockModal(false)} />}
    </div>
  );
}

function ImportModal({ branches, onClose }: { branches: { id: string; name: string }[]; onClose: () => void }) {
  const importProducts = useImportProducts();
  const [rows, setRows] = useState<ImportProductRow[]>([]);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ImportResult | null>(null);

  const branchNameSet = new Set(branches.map((b) => b.name.toLowerCase()));

  async function onFile(file: File) {
    setError(null); setResult(null);
    try {
      const text = await readFileAsText(file);
      const { headers, rows: csvRows } = parseCsv(text);
      const required = ['Name', 'Brand', 'SellingPrice'];
      const missing = required.filter((h) => !headers.includes(h));
      if (missing.length) { setError(`Missing required column(s): ${missing.join(', ')}`); return; }
      const branchCols = headers.filter((h) => branchNameSet.has(h.toLowerCase()));
      const parsed: ImportProductRow[] = csvRows
        .filter((r) => r.Name?.trim())
        .map((r) => ({
          name: r.Name.trim(),
          brand: (r.Brand || '').trim(),
          sellingPrice: Number(r.SellingPrice) || 0,
          quantityAlert: Number(r.QuantityAlert) || 0,
          quantities: branchCols
            .map((col) => ({ branchName: col, quantity: Number(r[col]) || 0 }))
            .filter((q) => q.quantity > 0),
        }));
      setRows(parsed);
      setFileName(file.name);
    } catch (e) { setError('Could not read the file.'); }
  }

  async function submit() {
    if (rows.length === 0) { setError('No valid rows to import.'); return; }
    setError(null);
    try { setResult(await importProducts.mutateAsync(rows)); }
    catch (e) { setError(getApiErrorMessage(e)); }
  }

  return (
    <Modal title="Import Products (CSV)" onClose={onClose}>
      <div className="space-y-4">
        <p className="text-xs text-text-muted">
          CSV columns: <strong>Name, Brand, SellingPrice, QuantityAlert</strong>, plus one column per shop name for stock. Brands are created automatically if they don&apos;t exist. Existing products (matched by name) are updated.
        </p>
        <input type="file" accept=".csv,text/csv" onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} className="w-full border border-input-border rounded px-3 py-2 text-sm bg-input-bg" />
        {fileName && <p className="text-sm text-text-secondary">Parsed <strong>{rows.length}</strong> row(s) from {fileName}.</p>}
        {error && <p className="text-sm text-accent-red">{error}</p>}
        {result && (
          <div className="rounded-lg bg-accent-green/10 border border-accent-green/30 px-3 py-2 text-sm text-text-primary">
            <p>Imported: <strong>{result.created}</strong> created, <strong>{result.updated}</strong> updated (of {result.total}).</p>
            {result.warnings.length > 0 && (
              <ul className="mt-1 list-disc list-inside text-accent-orange text-xs max-h-28 overflow-y-auto">
                {result.warnings.map((w, i) => <li key={i}>{w}</li>)}
              </ul>
            )}
          </div>
        )}
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="bg-white/10 text-text-primary px-4 py-2 rounded text-sm font-medium">{result ? 'Done' : 'Cancel'}</button>
          {!result && <button onClick={submit} disabled={importProducts.isPending || rows.length === 0} className="btn-grad px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-60">{importProducts.isPending ? 'Importing...' : `Import ${rows.length || ''}`}</button>}
        </div>
      </div>
    </Modal>
  );
}

interface RestockRow { productId: string; branchId: string; quantity: string; }

function RestockModal({ products, branches, onClose }: { products: Product[]; branches: { id: string; name: string }[]; onClose: () => void }) {
  const restock = useRestock();
  const [rows, setRows] = useState<RestockRow[]>([{ productId: products[0]?.id ?? '', branchId: branches[0]?.id ?? '', quantity: '' }]);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<RestockResult | null>(null);

  const setRow = (i: number, patch: Partial<RestockRow>) => setRows((rs) => rs.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  const addRow = () => setRows((rs) => [...rs, { productId: products[0]?.id ?? '', branchId: branches[0]?.id ?? '', quantity: '' }]);
  const removeRow = (i: number) => setRows((rs) => rs.filter((_, idx) => idx !== i));

  async function submit() {
    const items: RestockItem[] = rows
      .filter((r) => r.productId && r.branchId && Number(r.quantity) > 0)
      .map((r) => ({ productId: r.productId, branchId: r.branchId, quantity: Number(r.quantity) }));
    if (items.length === 0) { setError('Add at least one row with a quantity greater than zero.'); return; }
    setError(null);
    try { setResult(await restock.mutateAsync(items)); }
    catch (e) { setError(getApiErrorMessage(e)); }
  }

  return (
    <Modal title="Restock Products" onClose={onClose}>
      <div className="space-y-4">
        <p className="text-xs text-text-muted">Add stock to products at a shop. The quantity is <strong>added</strong> to the current stock.</p>
        {products.length === 0 || branches.length === 0 ? (
          <p className="text-sm text-accent-orange">You need at least one product and one shop before restocking.</p>
        ) : (
          <div className="space-y-2">
            {rows.map((row, i) => (
              <div key={i} className="flex items-center gap-2">
                <select value={row.productId} onChange={(e) => setRow(i, { productId: e.target.value })} className="flex-1 border border-input-border rounded px-2 py-1.5 text-sm bg-input-bg">
                  {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
                <select value={row.branchId} onChange={(e) => setRow(i, { branchId: e.target.value })} className="w-36 border border-input-border rounded px-2 py-1.5 text-sm bg-input-bg">
                  {branches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
                <input type="number" min="1" placeholder="+Qty" value={row.quantity} onChange={(e) => setRow(i, { quantity: e.target.value })} className="w-20 border border-input-border rounded px-2 py-1.5 text-sm bg-input-bg" />
                <button onClick={() => removeRow(i)} className="p-1.5 text-accent-red hover:bg-red-500/10 rounded" title="Remove"><Trash2 size={15} /></button>
              </div>
            ))}
            <button onClick={addRow} className="flex items-center gap-1 text-sm text-accent-blue hover:underline"><Plus size={14} /> Add row</button>
          </div>
        )}
        {error && <p className="text-sm text-accent-red">{error}</p>}
        {result && (
          <div className="rounded-lg bg-accent-green/10 border border-accent-green/30 px-3 py-2 text-sm text-text-primary">
            Restocked <strong>{result.updated}</strong> of {result.total} entries.
            {result.warnings.length > 0 && <ul className="mt-1 list-disc list-inside text-accent-orange text-xs">{result.warnings.map((w, i) => <li key={i}>{w}</li>)}</ul>}
          </div>
        )}
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="bg-white/10 text-text-primary px-4 py-2 rounded text-sm font-medium">{result ? 'Done' : 'Cancel'}</button>
          {!result && <button onClick={submit} disabled={restock.isPending} className="btn-grad px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-60">{restock.isPending ? 'Restocking...' : 'Restock'}</button>}
        </div>
      </div>
    </Modal>
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
          {brands.length === 0 && <p className="text-xs text-text-muted mt-1">No brands yet. Create a brand first.</p>}
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
