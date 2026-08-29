import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Star, ShoppingCart, Minus, Plus, Loader2, Share2, GitCompareArrows, Check, CreditCard, Truck, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ProductGallery } from '@/components/product/ProductGallery';
import { ProductReviews } from '@/components/product/ProductReviews';
import { ProductQA } from '@/components/product/ProductQA';
import { ProductRail } from '@/components/product/ProductRail';
import { localizedField } from '@/lib/localize';
import { formatUZS, cn } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useCompareStore, MAX_COMPARE } from '@/store/compareStore';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

// SVG Logos for Payment Methods
const PaymeLogo = () => (
  <svg viewBox="0 0 100 30" className="h-[14px] w-auto fill-[#2EBDAD]" preserveAspectRatio="xMidYMid meet">
    <path d="M11.5,18.7c0,2.1-1.6,3.6-3.8,3.6H4.2v6.6H0V3h7.6c2.3,0,3.9,1.5,3.9,3.6c0,1.3-0.6,2.4-1.6,3.1 C10.9,10.4,11.5,11.5,11.5,18.7z M7.7,6.6c0-0.4-0.3-0.7-0.7-0.7H4.2v3.7h2.7c0.4,0,0.7-0.3,0.7-0.7V6.6z M7.7,18.7c0-0.4-0.3-0.7-0.7-0.7H4.2v3.7h2.7 c0.4,0,0.7-0.3,0.7-0.7V18.7z" />
    <path d="M26.2,16.5h-5.2l-1.3,4.1h-4l5.6-17h4.8l5.6,17h-4.2L26.2,16.5z M23.6,8l-1.8,5.4h3.6L23.6,8z"/>
    <path d="M42.8,20.6L37.1,3h4.3l3.5,11.7L48.4,3h4.2l-8.4,26h-4V20.6z"/>
    <path d="M72.9,20.6L67.1,3h4.1l3.7,12.3L78.6,3h4.2l-8.4,26h-4V20.6z"/>
    <path d="M99.6,17.2h-12c0.2,2.3,2.1,4.1,4.4,4.1c1.5,0,2.8-0.7,3.5-1.9l3.5,1.7c-1.4,2.4-3.9,3.9-7,3.9 c-4.8,0-8.6-3.8-8.6-8.6s3.8-8.6,8.6-8.6c4.6,0,8.3,3.6,8.6,8.2l0,1.2H99.6z M87.8,14.3h8c-0.4-2-2.1-3.5-4-3.5 C89.9,10.8,88.2,12.3,87.8,14.3z"/>
  </svg>
);

const ClickLogo = () => (
  <svg viewBox="0 0 100 30" className="h-[14px] w-auto fill-[#00529C]" preserveAspectRatio="xMidYMid meet">
    <path d="M12.9,14.8c0,4.3-3.4,7.8-7.7,7.8s-7.7-3.5-7.7-7.8c0-4.3,3.4-7.8,7.7-7.8C9.5,7,12.9,10.5,12.9,14.8z M2,14.8 c0,3.3,2.4,5.9,5.5,5.9c3.1,0,5.5-2.7,5.5-5.9c0-3.3-2.4-5.9-5.5-5.9C4.4,8.9,2,11.6,2,14.8z"/>
    <path d="M17.1,7.2h4.5v15.2h-4.5V7.2z"/>
    <path d="M26.2,7.2h4.5v15.2h-4.5V7.2z"/>
    <path d="M43.7,7.2c3.4,0,6.2,2.3,7,5.5l-4.2,1.1c-0.4-1.4-1.5-2.4-2.8-2.4c-1.7,0-3,1.4-3,3.4c0,2,1.4,3.4,3,3.4 c1.3,0,2.5-1,2.8-2.4l4.2,1.1c-0.8,3.2-3.6,5.5-7,5.5c-4.2,0-7.5-3.5-7.5-7.7S39.5,7.2,43.7,7.2z"/>
    <path d="M53.6,7.2h4.5v7.2l5.6-7.2h5.5l-6.5,7.5l7.1,7.7h-5.8l-5.8-6.4v6.4h-4.5V7.2z"/>
  </svg>
);

const UzcardLogo = () => (
  <svg viewBox="0 0 100 30" className="h-4 w-auto fill-[#005187]" preserveAspectRatio="xMidYMid meet">
    <path d="M28.3,16.3c0,4.1-3.2,7.3-7.2,7.3H3.6V2.6h17.5C25.1,2.6,28.3,5.8,28.3,9.9V16.3z M24,9.9c0-1.8-1.4-3.3-3.1-3.3H8 v13.1h12.9c1.7,0,3.1-1.5,3.1-3.3V9.9z" />
    <path d="M40.3,2.6v3.9H32.4v13.3h-4V2.6H40.3z" />
    <path d="M42,23.5l10.4-16h-9.5V2.6h15.2v4.7L47.7,23.5H42z" />
    <path d="M83,9.5c0-4-3-7.1-7.2-7.1c-4.1,0-7.3,3-7.3,7.1v5.1c0,4,3.2,7.1,7.3,7.1c4.1,0,7.2-3.1,7.2-7.1V9.5z M79,14.6 c0,1.9-1.4,3.4-3.2,3.4c-1.8,0-3.3-1.5-3.3-3.4V9.5c0-1.9,1.5-3.4,3.3-3.4c1.8,0,3.2,1.5,3.2,3.4V14.6z" />
    <path d="M88.5,23.5h-4.1V2.6h4.1v7.6c1-1.4,2.5-2.2,4.3-2.2c3.5,0,6.2,2.8,6.2,6.4v3.1c0,3.5-2.7,6.4-6.2,6.4 C91,23.8,89.5,23,88.5,21.6V23.5z M94.8,17.4v-3.1c0-1.5-1.2-2.7-2.7-2.7c-1.5,0-2.8,1.2-2.8,2.7v3.1c0,1.5,1.3,2.7,2.8,2.7 C93.6,20.2,94.8,18.9,94.8,17.4z" />
    <circle cx="95.5" cy="5.4" r="1.3" fill="#F47D20" />
  </svg>
);

const HumoLogo = () => (
  <svg viewBox="0 0 100 30" className="h-[14px] w-auto fill-[#D4AF37]" preserveAspectRatio="xMidYMid meet">
    <path d="M12.9,23.5H9.2v-8.6H3.6v8.6H0V2.6h3.6v8.3h5.6V2.6h3.6V23.5z" />
    <path d="M26,2.6v13.5c0,2.3-1.8,4.1-4.1,4.1s-4.1-1.8-4.1-4.1V2.6h3.6v13.5c0,0.3,0.2,0.5,0.5,0.5s0.5-0.2,0.5-0.5V2.6H26z" />
    <path d="M43.7,23.5h-3.6v-13l-4.1,7l-4.1-7v13h-3.6V2.6h4.2l3.5,6.1l3.5-6.1h4.2V23.5z" />
    <path d="M60.8,13.1c0,5.8-4.7,10.6-10.6,10.6S39.6,18.9,39.6,13.1S44.3,2.5,50.2,2.5S60.8,7.3,60.8,13.1z M57.2,13.1 c0-3.9-3.1-7-7-7s-7,3.1-7,7s3.1,7,7,7S57.2,17,57.2,13.1z" />
  </svg>
);

const VisaLogo = () => (
  <svg viewBox="0 0 100 30" className="h-[14px] w-auto fill-[#1A1F71]" preserveAspectRatio="xMidYMid meet">
    <path d="M41.4,2.5L34,22.8H27.5L32.2,2.5H41.4z M17,2.5l-4.5,13.8l-1.9-9.8c-0.3-2-2.1-3.6-4.1-4L0,1.9v2.2 c1.7,0.4,3.7,1.1,4.9,2l4.2,16.7h7.1l6.7-20.2H17z M74.7,6.8c-1.3-0.5-3.3-1-5.5-1c-6,0-10.2,3.1-10.3,7.5c0,3.3,3,5.2,5.3,6.2 c2.4,1.1,3.2,1.8,3.2,2.8c0,1.5-1.9,2.2-3.6,2.2c-2.4,0-4.6-0.6-6.4-1.6l-0.9-0.4l-1,6C57.3,29.4,60.1,30,63.1,30 c6.4,0,10.6-3.1,10.6-7.8c0-2.6-1.5-4.5-5.1-6.2c-2.2-1.1-3.5-1.8-3.5-2.8c0-0.9,1.1-1.9,3.4-1.9c1.9,0,3.6,0.4,5,1l0.6,0.3 L74.7,6.8z M91.3,2.5h-5.4c-1.4,0-2.6,0.8-3.2,2.1L73.1,22.8h7.4l1.5-4h9l0.9,4h6.5L91.3,2.5z M84.3,13.3l2.4-6.3l1.4,6.3H84.3z" />
    <path fill="#F7B600" d="M17,2.5l-4.5,13.8l-1.9-9.8c-0.3-2-2.1-3.6-4.1-4L0,1.9v2.2c1.7,0.4,3.7,1.1,4.9,2l4.2,16.7h7.1l6.7-20.2H17z" />
  </svg>
);

export default function ProductDetail() {
  const { slug } = useParams();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const cartItem = useCartStore((s) => s.cart?.items?.find((i) => i.productId === product?.id));
  const addItem = useCartStore((s) => s.addItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);

  const isWishlisted = useWishlistStore((s) => (product ? s.isWishlisted(product.id) : false));
  const wishlistAdd = useWishlistStore((s) => s.addItem);
  const wishlistRemove = useWishlistStore((s) => s.removeItem);

  const isComparing = useCompareStore((s) => (product ? s.isComparing(product.id) : false));
  const toggleCompare = useCompareStore((s) => s.toggleCompare);

  useDocumentTitle(product ? localizedField(product, 'name', i18n.language) : '');

  useEffect(() => {
    setIsLoading(true);
    api
      .get(`/products/${slug}`)
      .then(({ data }) => setProduct(data.product))
      .catch(() => setProduct(null))
      .finally(() => setIsLoading(false));
    window.scrollTo(0, 0);
  }, [slug]);

  function requireAuth() {
    if (!isAuthenticated) {
      navigate('/login');
      return false;
    }
    return true;
  }

  async function handleAddToCart() {
    setBusy(true);
    try {
      await addItem(product.id, 1, product);
      toast.success(t('product.added_to_cart'));
    } catch (err) {
      toast.error(err.friendlyMessage);
    } finally {
      setBusy(false);
    }
  }

  async function handleQuantityChange(delta) {
    if (!cartItem) return;
    setBusy(true);
    try {
      await updateQuantity(cartItem.id || cartItem.productId, cartItem.quantity + delta);
    } finally {
      setBusy(false);
    }
  }

  async function handleToggleWishlist() {
    setBusy(true);
    try {
      if (isWishlisted) {
        await wishlistRemove(product.id);
        toast.success(t('product.removed_from_wishlist'));
      } else {
        await wishlistAdd(product.id, product);
        toast.success(t('product.added_to_wishlist'));
      }
    } finally {
      setBusy(false);
    }
  }

  function handleShare() {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ title: product?.nameUz, url }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url);
      toast.success(t('product.share'));
    }
  }

  function handleToggleCompare() {
    const ok = toggleCompare(product.id);
    if (!ok) toast.error(`Maksimal ${MAX_COMPARE} ta mahsulot`);
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <Skeleton className="aspect-square w-full rounded-xl" />
        <div className="space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  if (!product) {
    return <div className="py-16 text-center text-muted-foreground">{t('common.no_results')}</div>;
  }

  const name = localizedField(product, 'name', i18n.language);
  const description = localizedField(product, 'description', i18n.language);
  const specs = JSON.parse(product.specs || '{}');
  const hasDiscount = Boolean(product.discountPrice);
  const discountPercent = hasDiscount ? Math.round(100 - (product.discountPrice / product.price) * 100) : 0;
  const outOfStock = product.stock <= 0;
  const salePrice = product.discountPrice ?? product.price;

  const INSTALLMENT_OPTIONS = [
    { months: 3, markup: 0, labelKey: 'product.installment_3m' },
    { months: 6, markup: 0.05, labelKey: 'product.installment_6m' },
    { months: 12, markup: 0.12, labelKey: 'product.installment_12m' },
    { months: 24, markup: 0.25, labelKey: 'product.installment_24m' },
  ];

  return (
    <div className="pb-12">
      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2">
        <ProductGallery images={product.images} videoUrl={product.videoUrl} name={name} />

        <div>
          {product.brand && <p className="text-sm font-medium text-primary">{product.brand.name}</p>}
          <h1 className="mt-1 text-xl font-bold sm:text-2xl">{name}</h1>

          <div className="mt-2 flex items-center gap-3">
            {product.reviewCount > 0 && (
              <div className="flex items-center gap-1 text-sm">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span className="font-medium">{product.rating?.toFixed(1)}</span>
                <span className="text-muted-foreground">({product.reviewCount} {t('product.reviews')})</span>
              </div>
            )}
            <Badge variant={outOfStock ? 'secondary' : 'success'}>
              {outOfStock ? t('product.out_of_stock') : t('product.in_stock')}
            </Badge>
          </div>

          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-2xl font-bold sm:text-3xl">{formatUZS(product.discountPrice ?? product.price)}</span>
            {hasDiscount && (
              <>
                <span className="text-base text-muted-foreground line-through">{formatUZS(product.price)}</span>
                <Badge>-{discountPercent}%</Badge>
              </>
            )}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <AnimatePresence mode="wait" initial={false}>
              {!cartItem ? (
                <motion.div key="add" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <Button size="lg" disabled={busy || outOfStock} onClick={handleAddToCart} className="min-w-[220px]">
                    {busy ? <Loader2 className="h-5 w-5 animate-spin" /> : <ShoppingCart className="h-5 w-5" />}
                    {t('product.add_to_cart')}
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  key="stepper"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex h-12 min-w-[220px] items-center gap-1.5"
                >
                  <button
                    type="button"
                    className="flex h-full flex-1 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={busy}
                    aria-label="decrease"
                  >
                    <Minus className="h-5 w-5" />
                  </button>
                  <motion.span key={cartItem.quantity} initial={{ scale: 1.3 }} animate={{ scale: 1 }} className="flex h-full min-w-12 items-center justify-center rounded-lg border border-primary/40 px-4 text-base font-bold tabular-nums text-primary">
                    {cartItem.quantity}
                  </motion.span>
                  <button
                    type="button"
                    className="flex h-full flex-1 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
                    onClick={() => handleQuantityChange(1)}
                    disabled={busy}
                    aria-label="increase"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <Button variant="outline" size="lg" onClick={handleToggleWishlist} disabled={busy} className="hover:border-primary hover:bg-primary/10 hover:text-primary transition-colors">
              <Heart className={cn('h-5 w-5', isWishlisted && 'fill-destructive text-destructive')} />
            </Button>
            <Button variant="outline" size="lg" onClick={handleToggleCompare} className="hover:border-primary hover:bg-primary/10 hover:text-primary transition-colors">
              {isComparing ? <Check className="h-5 w-5 text-primary" /> : <GitCompareArrows className="h-5 w-5" />}
            </Button>
            <Button variant="outline" size="lg" onClick={handleShare} className="hover:border-primary hover:bg-primary/10 hover:text-primary transition-colors">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>



            <div className="mt-5 rounded-2xl border border-primary/20 bg-[#EAF8EF] p-4 py-3 dark:bg-primary/5 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
                  <CreditCard className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-[13px] font-semibold">{t('product.installment_title', "Bo'lib to'lash")}</p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                {INSTALLMENT_OPTIONS.map(({ months, markup }) => {
                  const monthly = Math.ceil((salePrice * (1 + markup)) / months);
                  return (
                    <div
                      key={months}
                      className="flex flex-row items-center gap-1 rounded-md border border-border bg-background px-2.5 py-1 text-center transition-all hover:border-primary/50"
                    >
                      <span className="text-[13px] font-bold text-foreground">{formatUZS(monthly)}</span>
                      <span className="text-[11px] text-muted-foreground">x {months}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md flex flex-col gap-3 justify-center">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold">{t('product.payment_methods', "To'lov usullari:")}</h3>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex h-7 px-2 items-center justify-center rounded bg-secondary/50 border border-border/50">
                    <UzcardLogo />
                  </div>
                  <div className="flex h-7 px-2 items-center justify-center rounded bg-secondary/50 border border-border/50">
                    <HumoLogo />
                  </div>
                  <div className="flex h-7 px-2 items-center justify-center rounded bg-secondary/50 border border-border/50">
                    <VisaLogo />
                  </div>
                  <div className="flex h-7 px-2 items-center justify-center rounded bg-secondary/50 border border-border/50">
                    <ClickLogo />
                  </div>
                  <div className="flex h-7 px-2 items-center justify-center rounded bg-secondary/50 border border-border/50">
                    <PaymeLogo />
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-card p-4 space-y-4 shadow-sm transition-shadow hover:shadow-md">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Truck className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold">{t('product.delivery_title', 'Yetkazib berish')}</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">{t('product.delivery_desc', "Butun O'zbekiston bo'ylab tezkor yetkazib berish")}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold">{t('product.warranty_title', 'Kafolat')}</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">{t('product.warranty_desc', "Rasmiy kafolat va xizmat ko'rsatish markazlari")}</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
      <div className="mt-8 mb-8 rounded-2xl border border-border bg-card shadow-sm">
        <Tabs defaultValue="description">
          <div className="border-b border-border px-1">
            <TabsList className="h-14 w-full justify-start gap-2 rounded-none bg-transparent p-2 overflow-x-auto scrollbar-hide">
              <TabsTrigger value="description" className="relative h-10 rounded-full px-5 text-sm font-semibold transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md hover:bg-primary/10 hover:text-primary">{t('product.description')}</TabsTrigger>
              <TabsTrigger value="specs" className="relative h-10 rounded-full px-5 text-sm font-semibold transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md hover:bg-primary/10 hover:text-primary">{t('product.specifications')}</TabsTrigger>
              <TabsTrigger value="reviews" className="relative h-10 rounded-full px-5 text-sm font-semibold transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md hover:bg-primary/10 hover:text-primary">{t('product.reviews')} ({product.reviewCount || 0})</TabsTrigger>
              <TabsTrigger value="qa" className="relative h-10 rounded-full px-5 text-sm font-semibold transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md hover:bg-primary/10 hover:text-primary">{t('product.questions_answers')}</TabsTrigger>
            </TabsList>
          </div>

          <div className="p-5 sm:p-6">
            <TabsContent value="description" className="mt-0">
              <p className="whitespace-pre-line text-sm leading-relaxed text-foreground/90">{description}</p>
            </TabsContent>

            <TabsContent value="specs" className="mt-0">
              <dl className="divide-y divide-border overflow-hidden rounded-xl border border-border">
                {Object.entries(specs).map(([key, value]) => (
                  <div key={key} className="flex justify-between gap-4 px-4 py-3 text-sm odd:bg-muted/30">
                    <dt className="text-muted-foreground">{key}</dt>
                    <dd className="font-medium">{value}</dd>
                  </div>
                ))}
              </dl>
            </TabsContent>

            <TabsContent value="reviews" className="mt-0">
              <ProductReviews slug={slug} />
            </TabsContent>

            <TabsContent value="qa" className="mt-0">
              <ProductQA slug={slug} />
            </TabsContent>
          </div>
        </Tabs>
      </div>

      <ProductRail title={t('product.frequently_bought')} endpoint={`/products/${slug}/frequently-bought-together`} />
      <ProductRail title={t('product.similar_products')} endpoint={`/products/${slug}/similar`} />
      <ProductRail title={t('product.related_products')} endpoint={`/products/${slug}/related`} />
      {isAuthenticated && <ProductRail title={t('product.recently_viewed')} endpoint="/products/recently-viewed" />}
    </div>
  );
}
