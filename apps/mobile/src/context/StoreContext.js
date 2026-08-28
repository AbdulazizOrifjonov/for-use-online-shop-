import React, { createContext, useState, useEffect, useContext } from 'react';
import { fetchApi } from '../config/api';

const StoreContext = createContext();

// Default Fallback Database Products (matching Prisma backend DB)
const FALLBACK_PRODUCTS = [
  {
    id: 'cmsyi15yv002nkzmkmzims16k',
    nameUz: 'Shokoladli Mousse Stakanchik',
    nameEn: 'Chocolate Mousse Cup',
    price: 48000,
    discountPrice: null,
    images: [{ url: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=800' }],
    category: { nameUz: 'Desert Stakanchiklar', slug: 'cup-desserts' },
    isFeatured: true,
  },
  {
    id: 'cmsyi169j0032kzmkw545zwdw',
    nameUz: 'Qulupnayli Qaymoqli Milkshake',
    nameEn: 'Strawberry Cream Milkshake',
    price: 42000,
    discountPrice: null,
    images: [{ url: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=800' }],
    category: { nameUz: 'Mevali Choy & Milkshake', slug: 'fruit-tea-milkshakes' },
    isFeatured: true,
  },
  {
    id: 'cmsyi15eq001tkzmkhloijmcu',
    nameUz: "Parij Sariyog'li Kuruassan (4 dona)",
    nameEn: 'Paris Butter Croissants (4 pcs)',
    price: 70000,
    discountPrice: null,
    images: [{ url: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800' }],
    category: { nameUz: 'Kuruassanlar & Bulochkalar', slug: 'croissants-buns' },
    isFeatured: true,
  },
  {
    id: 'cmsyi15c9001mkzmkhehb2zni',
    nameUz: 'Taza Qulupnayli Mevali Tort',
    nameEn: 'Fresh Strawberry Fruit Cake',
    price: 290000,
    discountPrice: 260000,
    images: [{ url: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800' }],
    category: { nameUz: 'Mevali Tortlar', slug: 'fruit-cakes' },
    isFeatured: true,
  },
  {
    id: 'cmsyi15cj001pkzmk8nvgganb',
    nameUz: 'Pista & Shokoladli Fransuz Eklerlari (6 dona)',
    nameEn: 'Pistachio & Chocolate French Eclairs',
    price: 95000,
    discountPrice: null,
    images: [{ url: 'https://images.unsplash.com/photo-1612203985729-70726954388c?w=800' }],
    category: { nameUz: 'Eklerlar & Ponchiklar', slug: 'eclairs-donuts' },
    isFeatured: true,
  },
  {
    id: 'cmsyi15hf001xkzmkror8a33u',
    nameUz: "Rang-barang Fransuz Makaronlari Sets (12 dona)",
    nameEn: 'Colorful French Macarons Set',
    price: 140000,
    discountPrice: null,
    images: [{ url: 'https://images.unsplash.com/photo-1569864358642-9d1684040f43?w=800' }],
    category: { nameUz: 'Kapkeyklar & Makaronlar', slug: 'cupcakes-macarons' },
    isFeatured: true,
  },
];

const FALLBACK_CATEGORIES = [
  { id: '1', nameUz: 'Tortlar', slug: 'cakes', imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400' },
  { id: '2', nameUz: 'Pishiriqlar', slug: 'pastries', imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400' },
  { id: '3', nameUz: 'Desertlar', slug: 'cup-desserts', imageUrl: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=400' },
  { id: '4', nameUz: 'Ichimliklar', slug: 'drinks', imageUrl: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400' },
];

export function StoreProvider({ children }) {
  const [user, setUser] = useState(null);
  const [categories, setCategories] = useState(FALLBACK_CATEGORIES);
  const [products, setProducts] = useState(FALLBACK_PRODUCTS);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load initial data from Express API Backend
  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setIsLoading(true);
    try {
      const [catRes, prodRes] = await Promise.all([
        fetchApi('/categories/tree'),
        fetchApi('/products?limit=50'),
      ]);

      if (catRes.ok && catRes.data?.categories?.length > 0) {
        setCategories(catRes.data.categories);
      }
      if (prodRes.ok && prodRes.data?.products?.length > 0) {
        setProducts(prodRes.data.products);
      }
    } catch (e) {
      console.log('Using backend fallback data:', e);
    } finally {
      setIsLoading(false);
    }
  }

  // Auth Functions
  async function login(email, password) {
    try {
      const res = await fetchApi('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      if (res.ok && res.data?.user) {
        setUser(res.data.user);
        return { success: true, user: res.data.user };
      }
      // Demo login fallback
      if (email === 'admin@protools.uz' || email === 'admin') {
        const adminUser = { id: 'admin1', name: 'Abdulazizbek (Admin)', email, role: 'ADMIN' };
        setUser(adminUser);
        return { success: true, user: adminUser };
      }
      const normalUser = { id: 'user1', name: email.split('@')[0], email, role: 'CUSTOMER' };
      setUser(normalUser);
      return { success: true, user: normalUser };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  function logout() {
    setUser(null);
  }

  // Cart Management
  function addToCart(product, quantity = 1) {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { product, quantity }];
    });
  }

  function updateQuantity(productId, delta) {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  }

  function removeFromCart(productId) {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  }

  function clearCart() {
    setCart([]);
  }

  // Wishlist Management
  function toggleWishlist(product) {
    setWishlist((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) return prev.filter((p) => p.id !== product.id);
      return [...prev, product];
    });
  }

  function isWishlisted(productId) {
    return wishlist.some((p) => p.id === productId);
  }

  // Totals
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = wishlist.length;
  const cartTotal = cart.reduce(
    (sum, item) => sum + (item.product.discountPrice ?? item.product.price) * item.quantity,
    0
  );

  return (
    <StoreContext.Provider
      value={{
        user,
        login,
        logout,
        categories,
        products,
        cart,
        wishlist,
        isLoading,
        reload: loadData,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        toggleWishlist,
        isWishlisted,
        cartCount,
        wishlistCount,
        cartTotal,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  return useContext(StoreContext);
}
