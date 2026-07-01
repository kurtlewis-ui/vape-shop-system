'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Search, Loader2, Plus, Check } from 'lucide-react';
import { useBrands, useProducts } from '@/lib/hooks';
import { useAuthStore } from '@/lib/store';
import { useDraftStore } from '@/lib/draft';
import { getApiErrorMessage } from '@/lib/api';

function peso(n: number) {
  return `\u20B1${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function BrandProductsPage() {
  const router = useRouter();
  const params = useParams();
  const brandId = String(params.brandId);
  const [search, setSearch] = useState('');
  const [added, setAdded] = useState<string | null>(null);

  const user = useAuthStore((s) => s.user);
  const branchId = user?.branch?.id;
  const branchName = user?.branch?.name;

  const { data: brandData } = useBrands();
  const brand = (brandData?.data ?? []).find((b) => b.id === brandId);

  const { data, isLoading, isError, error } = useProducts({ brandId, branchId, search });
  const products = data?.data ?? [];

  const addItem = useDraftStore((s) => s.addItem);

  function handleAdd(p: (typeof products)[number]) {
    addItem({
      productId: p.id,
      name: p.name,
      brandName: p.brand?.name ?? brand?.name ?? '',
      unitPrice: p.sellingPrice,
      image: p.image,
    });
    setAdded(p.id);
    setTimeout(() => setAdded((cur) => (cur === p.id ? null : cur)), 1200);
  }

  // With branchId passed, the backend returns only that branch's inventory,
  // so totalQuantity is the stock at the staff's shop.
  const stockOf = (p: (typeof products)[number]) => p.totalQuantity;

  return (
    <div>
      <button
        onClick={() => router.push('/staff')}
        className="mb-3 inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-sm text-text-primary hover:bg-white/15 transition"
      >
        <ArrowLeft size={15} /> Back
      </button>

      {branchName && (
        <p className="text-xs font-semibold uppercase tracking-wide text-text-muted mb-1">{branchName}</p>
      )}
      <h1 className="text-2xl font-bold text-text-primary mb-4">{brand?.name ?? 'Products'}</h1>

      <div className="mb-6 flex max-w-2xl items-center gap-2">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-input-border bg-input-bg py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-input-focus"
          />
        </div>
      </div>

      {!branchId ? (
        <div className="py-16 text-center text-accent-orange">
          Your account is not assigned to a shop. Ask an admin to assign one.
        </div>
      ) : isLoading ? (
        <div className="py-16 text-center text-text-muted">
          <Loader2 className="inline animate-spin mr-2" size={16} /> Loading products...
        </div>
      ) : isError ? (
        <div className="py-16 text-center text-accent-red">{getApiErrorMessage(error)}</div>
      ) : products.length === 0 ? (
        <div className="py-16 text-center text-text-muted">No products found for this brand.</div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {products.map((p) => {
            const stock = stockOf(p);
            const outOfStock = stock <= 0;
            return (
              <div key={p.id} className="flex flex-col overflow-hidden rounded-xl border border-card-border bg-card-bg shadow-sm">
                <div className="flex aspect-square items-center justify-center bg-white/5">
                  {p.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-xs text-text-muted">No Image Available</span>
                  )}
                </div>
                <div className="flex flex-1 flex-col px-3 py-2">
                  <p className="truncate text-sm font-semibold text-text-primary" title={p.name}>{p.name}</p>
                  <p className="text-sm font-bold text-accent-purple-light">{peso(p.sellingPrice)}</p>
                  <p className={`text-xs ${outOfStock ? 'text-accent-red' : 'text-text-muted'}`}>Stock: {stock}</p>
                  <button
                    onClick={() => handleAdd(p)}
                    disabled={outOfStock}
                    className="mt-2 flex items-center justify-center gap-1 rounded-lg btn-grad px-2 py-1.5 text-xs font-medium disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {added === p.id ? (
                      <><Check size={13} /> Added</>
                    ) : outOfStock ? (
                      'Out of stock'
                    ) : (
                      <><Plus size={13} /> Add to order</>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
