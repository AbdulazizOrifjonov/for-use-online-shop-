import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCategoryTree } from '@/hooks/useCategoryTree';
import { localizedField } from '@/lib/localize';
import { Skeleton } from '@/components/ui/skeleton';

export function CategoriesShowcase() {
  const { t, i18n } = useTranslation();
  const { categories, isLoading } = useCategoryTree();

  return (
    <section className="mt-8">
      <h2 className="mb-4 text-lg font-bold sm:text-xl">{t('home.categories')}</h2>
      {isLoading ? (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[4/5] rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/catalog?category=${cat.slug}`}
              className="group flex flex-col items-center overflow-hidden rounded-2xl bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-md border border-border/50"
            >
              <div className="relative w-full aspect-[4/3] bg-muted/30 overflow-hidden">
                {cat.imageUrl ? (
                  <img 
                    src={cat.imageUrl} 
                    alt={localizedField(cat, 'name', i18n.language)} 
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110" 
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-3xl font-bold text-primary/20 transition-colors group-hover:bg-primary/5 group-hover:text-primary/30">
                    {localizedField(cat, 'name', i18n.language)[0]}
                  </div>
                )}
              </div>
              <div className="flex w-full items-center justify-center p-3 text-center">
                <span className="line-clamp-2 text-xs font-semibold sm:text-sm transition-colors group-hover:text-primary">
                  {localizedField(cat, 'name', i18n.language)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
