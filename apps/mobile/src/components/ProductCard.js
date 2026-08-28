import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Icon } from './Icon';
import { COLORS } from '../theme/colors';
import { formatUZS } from '../config/api';
import { useStore } from '../context/StoreContext';

export function ProductCard({ product, onPress }) {
  const { width } = useWindowDimensions();
  
  // Responsive grid logic exactly like Tailwind:
  // sm:grid-cols-3 (>=640px)
  // lg:grid-cols-4 (>=1024px)
  let cols = 2;
  if (width >= 1024) cols = 4;
  else if (width >= 640) cols = 3;
  
  // Container padding is 14px on each side (28 total). 
  // Gap between cards is roughly 12px.
  const totalGap = (cols - 1) * 12;
  const cardWidth = Math.max(0, (width - 28 - totalGap) / cols);

  const { cart, addToCart, updateQuantity, toggleWishlist, isWishlisted } = useStore();
  const wishlisted = isWishlisted(product.id);

  const cartItem = cart.find((item) => item.product.id === product.id);
  const cartQty = cartItem ? cartItem.quantity : 0;

  const imageUrl = product.images?.[0]?.url || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400';
  const price = product.discountPrice ?? product.price;
  const hasDiscount = Boolean(product.discountPrice);
  const discountPercent = hasDiscount
    ? Math.round(100 - (product.discountPrice / product.price) * 100)
    : 0;
  const outOfStock = product.stock <= 0;

  return (
    <TouchableOpacity style={[styles.card, { width: cardWidth }]} onPress={() => onPress?.(product)} activeOpacity={0.9}>
      {/* Image Box */}
      <View style={styles.imageBox}>
        <Image source={{ uri: imageUrl }} style={styles.image} />
        
        {/* Discount Badge */}
        <View style={styles.badgeContainer}>
          {hasDiscount && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>-{discountPercent}%</Text>
            </View>
          )}
          {outOfStock && (
            <View style={[styles.discountBadge, { backgroundColor: '#FEF3C7' }]}>
              <Text style={[styles.discountText, { color: '#78350F' }]}>Tugagan</Text>
            </View>
          )}
        </View>

        {/* Heart Wishlist Vector Button */}
        <TouchableOpacity
          style={styles.wishlistBtn}
          onPress={() => toggleWishlist(product)}
          activeOpacity={0.8}
        >
          <Icon
            name="heart"
            size={16}
            color={wishlisted ? COLORS.rose : '#9CA3AF'}
            style={wishlisted ? { fill: COLORS.rose } : {}}
          />
        </TouchableOpacity>
      </View>

      {/* Product Info Body */}
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2}>
          {product.nameUz || product.nameEn}
        </Text>

        <View style={styles.priceRow}>
          <Text style={styles.price}>{formatUZS(price)}</Text>
          {hasDiscount && (
            <Text style={styles.oldPrice}>{formatUZS(product.price)}</Text>
          )}
        </View>

        {/* Action Button / Vector Stepper */}
        <View style={styles.actionContainer}>
          {cartQty > 0 ? (
            <View style={styles.stepperContainer}>
              <TouchableOpacity
                style={[styles.stepBtn, { backgroundColor: COLORS.coffee }]}
                onPress={() => updateQuantity(product.id, -1)}
              >
                <Icon name="minus" size={14} color={COLORS.white} />
              </TouchableOpacity>

              <Text style={styles.qtyText}>{cartQty}</Text>

              <TouchableOpacity
                style={[styles.stepBtn, { backgroundColor: COLORS.rose }]}
                onPress={() => updateQuantity(product.id, 1)}
                disabled={outOfStock}
              >
                <Icon name="plus" size={14} color={COLORS.white} />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              onPress={() => !outOfStock && addToCart(product)}
              activeOpacity={0.85}
              disabled={outOfStock}
            >
              <LinearGradient
                colors={['#4A2E2B', '#831843', '#BE185D']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.addBtn}
              >
                <Icon name="shopping-cart" size={14} color={COLORS.white} style={{ marginRight: 6 }} />
                <Text style={styles.addBtnText}>Savatchaga</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    overflow: 'hidden',
    marginBottom: 12,
    elevation: 3,
    shadowColor: 'rgba(74, 46, 43, 1)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
  },
  imageBox: {
    width: '100%',
    aspectRatio: 1,
    position: 'relative',
    backgroundColor: 'rgba(253, 242, 248, 0.5)',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  badgeContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
    gap: 4,
  },
  discountBadge: {
    backgroundColor: COLORS.rose,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 99,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  discountText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: '700',
  },
  wishlistBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  info: {
    padding: 12,
    paddingTop: 12,
    paddingBottom: 12,
    flex: 1,
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.coffee,
    minHeight: 34,
    lineHeight: 16,
  },
  priceRow: {
    marginTop: 8,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    flexWrap: 'wrap',
  },
  price: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.rose,
  },
  oldPrice: {
    fontSize: 11,
    color: '#6B7280',
    textDecorationLine: 'line-through',
  },
  actionContainer: {
    marginTop: 'auto',
    paddingHorizontal: 2,
  },
  addBtn: {
    flexDirection: 'row',
    height: 34,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  addBtnText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: '700',
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(253, 242, 248, 0.5)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F9A8D4',
    height: 36,
    padding: 4,
  },
  stepBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyText: {
    color: COLORS.coffee,
    fontSize: 12,
    fontWeight: '800',
    paddingHorizontal: 8,
  },
});
