import { memo, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Star, ShoppingCart, Minus, Plus, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { localizedField } from '@/lib/localize';
import { formatUZS, cn } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';

export const ProductCard = memo(function ProductCard({ product }) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const cartItem = useCartStore((s) => s.cart?.items?.find((i) => i.productId === product.id));
  const addItem = useCartStore((s) => s.addItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);

  const isWishlisted = useWishlistStore((s) => s.isWishlisted(product.id));
  const wishlistAdd = useWishlistStore((s) => s.addItem);
  const wishlistRemove = useWishlistStore((s) => s.removeItem);

  const [busy, setBusy] = useState(false);

  const name = localizedField(product, 'name', i18n.language);
  const image = product.images?.[0]?.url;
  
  // Consistent random percentage based on product ID (10% to 15%)
  const idHash = product.id ? product.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) : 0;
  const fakePercent = (idHash % 6) + 10;
  
  const hasRealDiscount = Boolean(product.discountPrice);
  
  // Current selling price is either real discountPrice or price
  const currentPrice = hasRealDiscount ? product.discountPrice : product.price;
  // Old crossed-out price is either original price, or fake higher price
  const oldPrice = hasRealDiscount 
    ? product.price 
    : Math.round(product.price * (1 + fakePercent / 100));
    
  const discountPercent = Math.round(100 - (currentPrice / oldPrice) * 100);
  
  const outOfStock = product.stock <= 0;

  const images = product.images || [];
  const [activeImage, setActiveImage] = useState(0);
  const scrollRef = useRef(null);

  let isDown = false;
  let startX;
  let scrollLeft;

  const handlePointerDown = (e) => {
    isDown = true;
    if (scrollRef.current) {
      startX = e.pageX - scrollRef.current.offsetLeft;
      scrollLeft = scrollRef.current.scrollLeft;
    }
  };

  const handlePointerUpOrLeave = () => {
    isDown = false;
  };

  const handlePointerMove = (e) => {
    if (!isDown || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  function requireAuth() {
    if (!isAuthenticated) {
      toast.info(t('auth.login_title'));
      navigate('/login');
      return false;
    }
    return true;
  }

  async function handleAddToCart(e) {
    e.preventDefault();
    setBusy(true);
    try {
      await addItem(product.id, 1, product);
      toast.success(t('product.added_to_cart'));
    } catch {
      toast.error(t('common.error_occurred'));
    } finally {
      setBusy(false);
    }
  }

  async function handleQuantityChange(e, delta) {
    e.preventDefault();
    if (!cartItem) return;
    const nextQty = cartItem.quantity + delta;
    setBusy(true);
    try {
      await updateQuantity(cartItem.id || cartItem.productId, nextQty);
      if (nextQty <= 0) toast.success(t('product.removed_from_cart'));
    } catch {
      toast.error(t('common.error_occurred'));
    } finally {
      setBusy(false);
    }
  }

  async function handleToggleWishlist(e) {
    e.preventDefault();
    setBusy(true);
    try {
      if (isWishlisted) {
        await wishlistRemove(product.id);
        toast.success(t('product.removed_from_wishlist'));
      } else {
        await wishlistAdd(product.id, product);
        toast.success(t('product.added_to_wishlist'));
      }
    } catch {
      toast.error(t('common.error_occurred'));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Link
      to={`/product/${product.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all hover:shadow-lg hover:-translate-y-0.5"
      draggable={false}
      onDragStart={(e) => e.preventDefault()}
    >
      <div className="relative aspect-square w-full overflow-hidden bg-muted">
        {images.length > 0 ? (
          <>
            <div 
              ref={scrollRef}
              className="flex h-full w-full overflow-x-auto snap-x snap-mandatory scrollbar-hide cursor-grab active:cursor-grabbing"
              onPointerDown={handlePointerDown}
              onPointerLeave={handlePointerUpOrLeave}
              onPointerUp={handlePointerUpOrLeave}
              onPointerMove={handlePointerMove}
              onScroll={(e) => {
                const sl = e.currentTarget.scrollLeft;
                const width = e.currentTarget.clientWidth;
                if (width > 0) {
                  const index = Math.round(sl / width);
                  if (index !== activeImage) setActiveImage(index);
                }
              }}
            >
              {images.map((img, i) => (
                <div key={i} className="h-full w-full shrink-0 snap-center relative overflow-hidden">
                  <img
                    src={img.url}
                    alt={name}
                    loading="lazy"
                    draggable={false}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110 pointer-events-none"
                  />
                </div>
              ))}
            </div>

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    if (scrollRef.current) {
                      scrollRef.current.scrollBy({ left: -scrollRef.current.clientWidth, behavior: 'smooth' });
                    }
                  }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white/70 shadow-sm backdrop-blur opacity-0 transition-opacity group-hover:opacity-100 hover:bg-white text-black z-20"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    if (scrollRef.current) {
                      scrollRef.current.scrollBy({ left: scrollRef.current.clientWidth, behavior: 'smooth' });
                    }
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white/70 shadow-sm backdrop-blur opacity-0 transition-opacity group-hover:opacity-100 hover:bg-white text-black z-20"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>

                <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5 px-2 pointer-events-none z-10">
                  {images.map((_, idx) => (
                    <div
                      key={idx}
                      className={cn(
                        "h-1 rounded-full transition-all duration-300 shadow-sm",
                        activeImage === idx ? "w-4 bg-primary" : "w-1.5 bg-white/70 dark:bg-black/50"
                      )}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground text-xs">No image</div>
        )}

        <div className="absolute left-2 top-2 z-10 flex flex-col gap-1 pointer-events-none">
          {discountPercent > 0 && <Badge className="bg-destructive text-destructive-foreground hover:bg-destructive/90">-{discountPercent}%</Badge>}
          {outOfStock && <Badge variant="secondary">{t('product.out_of_stock')}</Badge>}
        </div>

        <button
          onClick={handleToggleWishlist}
          disabled={busy}
          aria-label="wishlist"
          className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur transition-colors hover:bg-white dark:bg-black/60"
        >
          <Heart className={cn('h-4 w-4', isWishlisted ? 'fill-destructive text-destructive' : 'text-foreground/70')} />
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-2.5 sm:p-3">
        <h3 className="line-clamp-2 min-h-[2.5em] text-xs font-medium leading-tight sm:text-sm">{name}</h3>

        {product.reviewCount > 0 && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            <span>{product.rating?.toFixed(1)}</span>
            <span>({product.reviewCount})</span>
          </div>
        )}

        <div className="mt-auto flex flex-wrap items-baseline gap-1.5">
          <span className="text-sm font-bold sm:text-base text-destructive">{formatUZS(currentPrice)}</span>
          <span className="text-xs text-muted-foreground line-through">{formatUZS(oldPrice)}</span>
        </div>

        <div className="mt-1.5" onClick={(e) => e.preventDefault()}>
          <AnimatePresence mode="wait" initial={false}>
            {!cartItem ? (
              <motion.div key="add" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Button
                  size="sm"
                  className="w-full gap-1 px-1.5"
                  disabled={busy || outOfStock}
                  onClick={handleAddToCart}
                >
                  {busy ? (
                    <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin" />
                  ) : (
                    <ShoppingCart className="h-3.5 w-3.5 shrink-0" />
                  )}
                  <span className="hidden truncate text-[11px] leading-none sm:inline">{t('product.add_to_cart')}</span>
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="stepper"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex h-8 w-full items-center gap-1.5"
              >
                <button
                  type="button"
                  className="flex h-full flex-1 items-center justify-center rounded-md bg-primary text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
                  onClick={(e) => handleQuantityChange(e, -1)}
                  disabled={busy}
                  aria-label="decrease"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <motion.span
                  key={cartItem.quantity}
                  initial={{ scale: 1.3 }}
                  animate={{ scale: 1 }}
                  className="flex h-full min-w-8 items-center justify-center rounded-md border border-primary/40 px-2 text-sm font-bold tabular-nums text-primary"
                >
                  {cartItem.quantity}
                </motion.span>
                <button
                  type="button"
                  className="flex h-full flex-1 items-center justify-center rounded-md bg-primary text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
                  onClick={(e) => handleQuantityChange(e, 1)}
                  disabled={busy}
                  aria-label="increase"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Link>
  );
});
