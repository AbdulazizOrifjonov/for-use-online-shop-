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
        <div className="flex gap-3 overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[4/5] w-32 shrink-0 rounded-2xl sm:w-40 md:w-48" />
          ))}
        </div>
      ) : (
        <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]">
          <div className="flex min-w-max gap-3 animate-marquee">
            {[0, 1].map((setIndex) => (
              <div key={setIndex} className="flex gap-3">
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    to={`/catalog?category=${cat.slug}`}
                    className="group flex w-32 shrink-0 flex-col items-center overflow-hidden rounded-2xl border border-border/50 bg-card shadow-sm transition-all hover:shadow-md sm:w-40 md:w-48"
                  >
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted/30">
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
                      <span className="line-clamp-2 text-xs font-semibold transition-colors group-hover:text-primary sm:text-sm">
                        {localizedField(cat, 'name', i18n.language)}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
