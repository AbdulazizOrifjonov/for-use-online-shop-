import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { ProductCarousel } from '@/components/product/ProductCarousel';

export function ProductRail({ title, endpoint }) {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    api
      .get(endpoint)
      .then(({ data }) => active && setProducts(data.products))
      .finally(() => {
        if (active) {
          setIsLoading(false);
          setLoaded(true);
        }
      });
    return () => {
      active = false;
    };
  }, [endpoint]);

  if (loaded && products.length === 0) return null;

  return (
    <section className="mt-8">
      <h2 className="mb-4 text-xl font-bold sm:text-2xl text-[#1f2937]">{title}</h2>
      <ProductCarousel products={products} isLoading={isLoading} />
    </section>
  );
}
