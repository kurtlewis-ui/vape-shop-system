'use client';

import { useMemo, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useBrands, useProducts } from '@/lib/hooks';
import { useAuthStore } from '@/lib/store';
import { getApiErrorMessage } from '@/lib/api';

function peso(n: number) {
  return `\u20B1${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

const PAGE_SIZES = [5, 10, 25, 50, 100, 'All'] as const;
type PageSize = (typeof PAGE_SIZES)[number];

export default function StaffProductsPage() {
  const [brandId, setBrandId] = useState('');
  const [search, setSearch] = useState('');
  const [pageSize, setPageSize] = useState<PageSize>(10);
  const [page, setPage] = useState(1);

  const user = useAuthStore((s) => s.user);
  const branchId = user?.branch?.id;

  const { data: brandData } = useBrands();
  const brands = brandData?.data ?? [];

  const { data, isLoading, isError, error } = useProducts({
    branchId,
    brandId: brandId || undefined,
    search: search || undefined,
  });
  const allProducts = data?.data ?? [];

  const perPage = pageSize === 'All' ? allProducts.length || 1 : pageSize;
  const totalPages = Math.max(1, Math.ceil(allProducts.length / perPage));
  const currentPage = Math.min(page, totalPages);
  const pageProducts = useMemo(() => {
    const start = (currentPage - 1) * perPage;
    return allProducts.slice(start, start + perPage);
  }, [allProducts, currentPage, perPage]);

  const startIndex = allProducts.length === 0 ? 0 : (currentPage - 1) * perPage + 1;
  const endIndex = Math.min(currentPage * perPage, allProducts.length);

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary mb-4">Products</h1>

      <div className="mb-4 max-w-sm">
        <select
          value={brandId}
          onChange={(e) => { setBrandId(e.target.value); setPage(1); }}
          className="w-full rounded-lg border border-input-border bg-input-bg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-input-focus"
        >
          <option value="">All Brands</option>
          {brands.map((b) => (
            <option key={b.id} value={b.id}>{b.name}</option>
          ))}
        </select>
      </div>

      <div className="rounded-xl border border-card-border bg-card-bg shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 p-4">
          <label className="flex items-center gap-2 text-sm text-text-secondary">
            Show
            <select
              value={String(pageSize)}
              onChange={(e) => {
                const v = e.target.value;
                setPageSize(v === 'All' ? 'All' : (Number(v) as PageSize));
                setPage(1);
              }}
              className="rounded-lg border border-input-border bg-input-bg px-2 py-1 text-sm focus:outline-none"
            >
              {PAGE_SIZES.map((s) => (
                <option key={String(s)} value={String(s)}>{s}</option>
              ))}
            </select>
            entries
          </label>
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-56 rounded-lg border border-input-border bg-input-bg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-input-focus"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-table-header text-table-header-text">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase w-12">#</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase w-20">Image</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Quantity</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Brand</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Selling Price</th>
              </tr>
            </thead>
            <tbody>
              {!branchId ? (
                <tr><td colSpan={6} className="py-10 text-center text-accent-orange">Your account is not assigned to a shop. Ask an admin to assign one.</td></tr>
              ) : isLoading ? (
                <tr><td colSpan={6} className="py-10 text-center text-text-muted"><Loader2 className="inline animate-spin mr-2" size={16} />Loading products...</td></tr>
              ) : isError ? (
                <tr><td colSpan={6} className="py-10 text-center text-accent-red">{getApiErrorMessage(error)}</td></tr>
              ) : pageProducts.length === 0 ? (
                <tr><td colSpan={6} className="py-10 text-center text-text-muted">No products found.</td></tr>
              ) : (
                pageProducts.map((p, i) => (
                  <tr key={p.id} className="border-t border-card-border hover:bg-white/5 transition">
                    <td className="px-4 py-3 text-sm text-accent-blue font-medium">{startIndex + i}</td>
                    <td className="px-4 py-3">
                      {p.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={p.image} alt={p.name} className="h-10 w-10 rounded object-cover bg-white/10" />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded bg-white/10 text-[9px] text-text-muted">No Img</div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-text-primary">{p.name}</td>
                    <td className="px-4 py-3 text-sm text-text-primary">{p.totalQuantity}</td>
                    <td className="px-4 py-3 text-sm text-text-secondary">{p.brand?.name ?? '—'}</td>
                    <td className="px-4 py-3 text-sm text-text-primary">{peso(p.sellingPrice)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-card-border p-4">
          <p className="text-sm text-text-muted">
            Showing {startIndex} to {endIndex} of {allProducts.length} products
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              className="rounded-lg px-3 py-1.5 text-sm text-text-secondary hover:bg-white/5 disabled:opacity-40"
            >
              Previous
            </button>
            <span className="rounded-lg bg-accent-primary px-3 py-1.5 text-sm font-medium text-white">{currentPage}</span>
            <span className="px-1 text-sm text-text-muted">/ {totalPages}</span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className="rounded-lg px-3 py-1.5 text-sm text-text-secondary hover:bg-white/5 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
