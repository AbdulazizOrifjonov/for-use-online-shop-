import { useEffect, useMemo, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { SlidersHorizontal, ChevronRight } from 'lucide-react';
import { api } from '@/lib/api';
import { useDebounce } from '@/hooks/useDebounce';
import { useCategoryTree } from '@/hooks/useCategoryTree';
import { localizedField } from '@/lib/localize';
import { ProductGrid } from '@/components/product/ProductGrid';
import { FiltersPanel } from '@/components/catalog/FiltersPanel';
import { SortDropdown } from '@/components/catalog/SortDropdown';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

export default function Catalog() {
  const { t, i18n } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const { categories: tree, isLoading: catsLoading } = useCategoryTree();

  const filters = useMemo(() => Object.fromEntries(searchParams.entries()), [searchParams]);
  const debouncedQuery = useDebounce(filters.q || '', 400);
  
  const isRoot = !filters.category && !filters.q && !filters.brand && !filters.minPrice && !filters.maxPrice;
  
  useDocumentTitle(isRoot ? t('nav.catalog') : (filters.q ? `"${filters.q}"` : t('nav.categories')));

  function updateFilters(next) {
    const cleaned = Object.fromEntries(Object.entries(next).filter(([, v]) => v !== undefined && v !== ''));
    setSearchParams(cleaned);
  }

  useEffect(() => {
    if (isRoot) return; // don't fetch products if showing category grid
    let active = true;
    setIsLoading(true);
    const params = { ...filters, q: debouncedQuery || undefined, page: filters.page || 1 };
    api
      .get('/products', { params })
      .then(({ data }) => {
        if (!active) return;
        setProducts(data.products);
        setPagination(data.pagination);
      })
      .finally(() => active && setIsLoading(false));
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify({ ...filters, q: debouncedQuery }), isRoot]);

  function goToPage(page) {
    updateFilters({ ...filters, page });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  if (isRoot) {
    return (
      <div className="pb-10">
        <h1 className="mb-6 text-xl font-bold sm:text-2xl">{t('nav.catalog', 'Katalog')}</h1>
        {catsLoading ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 lg:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-[4/5] animate-pulse rounded-2xl bg-muted/60 sm:aspect-square" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 lg:gap-6">
            {tree.map(cat => (
              <Link 
                key={cat.id} 
                to={`/catalog?category=${cat.slug}`}
                className="group relative flex aspect-[4/5] flex-col overflow-hidden rounded-2xl bg-muted/50 p-3 transition-all hover:bg-muted/80 hover:-translate-y-1 sm:aspect-square sm:p-4"
              >
                <div className="flex items-start justify-between z-10 relative">
                  <span className="font-bold text-sm sm:text-base leading-tight pr-2">
                    {localizedField(cat, 'name', i18n.language)}
                  </span>
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm">
                    <ChevronRight className="h-4 w-4" />
                  </div>
                </div>
                {cat.imageUrl && (
                  <div className="absolute bottom-0 left-0 right-0 top-[35%] mt-auto overflow-hidden">
                    <img 
                      src={cat.imageUrl} 
                      alt="" 
                      className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-110" 
                    />
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="pb-10">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h1 className="text-lg font-bold sm:text-2xl flex-1 truncate">
          {filters.q ? `"${filters.q}"` : t('nav.categories')}
          {!isLoading && <span className="ml-2 text-sm font-normal text-muted-foreground">({pagination.total})</span>}
        </h1>
        <div className="flex shrink-0 items-center gap-2">
          <Dialog open={filtersOpen} onOpenChange={setFiltersOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="lg:hidden">
                <SlidersHorizontal className="h-4 w-4" /> <span className="hidden sm:inline ml-1">{t('common.filter')}</span>
              </Button>
            </DialogTrigger>
            <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
              <DialogHeader>
                <DialogTitle>{t('common.filter')}</DialogTitle>
              </DialogHeader>
              <FiltersPanel filters={filters} onChange={(f) => { updateFilters(f); }} />
            </DialogContent>
          </Dialog>
          <SortDropdown value={filters.sort || 'newest'} onChange={(sort) => updateFilters({ ...filters, sort })} />
        </div>
      </div>

      <div className="flex gap-6">
        <aside className="hidden w-64 shrink-0 rounded-2xl border border-primary/20 bg-primary/5 p-4 dark:bg-primary/5 lg:block">
          <FiltersPanel filters={filters} onChange={updateFilters} />
        </aside>

        <div className="min-w-0 flex-1">
          <ProductGrid products={products} isLoading={isLoading} compact />

          {!isLoading && pagination.pages > 1 && (
            <div className="mt-6 flex justify-center gap-1.5 flex-wrap">
              {Array.from({ length: pagination.pages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => goToPage(i + 1)}
                  className={`h-9 min-w-9 rounded-lg px-2 text-sm font-medium ${
                    Number(filters.page || 1) === i + 1 ? 'bg-primary text-primary-foreground' : 'border border-input hover:bg-accent'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
