import { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ProductCard } from '@/components/product/ProductCard';
import { ProductGridSkeleton } from '@/components/product/ProductGridSkeleton';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { PackageSearch } from 'lucide-react';

export function ProductCarousel({ products, isLoading }) {
  const scrollRef = useRef(null);
  const { t } = useTranslation();
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeft(scrollLeft > 0);
      setShowRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [products]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.8;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (isLoading) return <ProductGridSkeleton />;

  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border py-16 text-center">
        <PackageSearch className="h-10 w-10 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">{t('common.no_results')}</p>
      </div>
    );
  }

  return (
    <div className="relative group">
      {/* Left Button */}
      {showLeft && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-[-15px] top-1/2 z-10 -translate-y-1/2 rounded-full bg-primary p-2 text-white shadow-lg transition-transform hover:scale-110 active:scale-95 hidden md:flex"
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      )}

      {/* Scroll Container */}
      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-4 hide-scrollbar"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {products.map((product) => (
          <div key={product.id} className="snap-start shrink-0 w-[180px] sm:w-[220px] md:w-[240px]">
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      {/* Right Button */}
      {showRight && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-[-15px] top-1/2 z-10 -translate-y-1/2 rounded-full bg-primary p-2 text-white shadow-lg transition-transform hover:scale-110 active:scale-95 hidden md:flex"
          aria-label="Scroll right"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}
