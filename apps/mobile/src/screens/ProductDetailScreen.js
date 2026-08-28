import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { COLORS } from '../theme/colors';
import { formatUZS } from '../config/api';
import { useStore } from '../context/StoreContext';
import { PaymentBadges } from '../components/PaymentBadges';

const { width } = Dimensions.get('window');

export function ProductDetailScreen({ route, navigation }) {
  const { product } = route.params;
  const { addToCart, toggleWishlist, isWishlisted } = useStore();
  const [quantity, setQuantity] = useState(1);
  const wishlisted = isWishlisted(product.id);

  const images = product.images?.length > 0
    ? product.images.map((img) => img.url)
    : ['https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800'];
  const [selectedImage, setSelectedImage] = useState(images[0]);

  const price = product.discountPrice ?? product.price;

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header Back Button */}
        <View style={styles.topNav}>
          <TouchableOpacity style={styles.circleBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.topNavIcon}>❮</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.circleBtn} onPress={() => toggleWishlist(product)}>
            <Text style={styles.topNavIcon}>{wishlisted ? '❤️' : '🤍'}</Text>
          </TouchableOpacity>
        </View>

        {/* Main Image */}
        <View style={styles.imageBox}>
          <Image source={{ uri: selectedImage }} style={styles.mainImage} />
        </View>

        {/* Gallery Thumbnails */}
        {images.length > 1 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.thumbsRow}>
            {images.map((url, idx) => (
              <TouchableOpacity
                key={idx}
                onPress={() => setSelectedImage(url)}
                style={[
                  styles.thumb,
                  selectedImage === url && styles.activeThumb,
                ]}
              >
                <Image source={{ uri: url }} style={styles.thumbImage} />
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* Details Card */}
        <View style={styles.card}>
          {product.brand && (
            <View style={styles.brandTag}>
              <Text style={styles.brandText}>✨ {product.brand.name.toUpperCase()}</Text>
            </View>
          )}

          <Text style={styles.title}>{product.nameUz || product.nameEn}</Text>

          {/* Price Box */}
          <View style={styles.priceContainer}>
            <Text style={styles.price}>{formatUZS(price)}</Text>
            {product.discountPrice && (
              <Text style={styles.oldPrice}>{formatUZS(product.price)}</Text>
            )}
          </View>

          {/* Description */}
          <View style={styles.descBox}>
            <Text style={styles.descTitle}>Mahsulot tavsifi</Text>
            <Text style={styles.descText}>
              {product.descriptionUz || `${product.nameUz} — Professional Tools do'konining eng sifatli, zamonaviy texnologiyalar bilan jihozlangan mahsulotidir.`}
            </Text>
          </View>

          {/* Quantity Stepper */}
          <View style={styles.stepperRow}>
            <Text style={styles.stepperLabel}>Miqdori:</Text>
            <View style={styles.stepper}>
              <TouchableOpacity
                style={styles.stepBtn}
                onPress={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                <Text style={styles.stepBtnText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.qtyText}>{quantity}</Text>
              <TouchableOpacity
                style={styles.stepBtn}
                onPress={() => setQuantity((q) => q + 1)}
              >
                <Text style={styles.stepBtnText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Payment Badges & Guarantees */}
          <PaymentBadges />
        </View>
      </ScrollView>

      {/* Bottom Bar Action */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.totalLabel}>Jami summa:</Text>
          <Text style={styles.totalPrice}>{formatUZS(price * quantity)}</Text>
        </View>

        <TouchableOpacity
          style={styles.addToCartBtn}
          onPress={() => {
            addToCart(product, quantity);
            navigation.navigate('Cart');
          }}
        >
          <Text style={styles.addToCartText}>🛒 Savatchaga qo'shish</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.pinkBackground,
  },
  scrollContent: {
    paddingBottom: 90,
  },
  topNav: {
    position: 'absolute',
    top: 40,
    left: 16,
    right: 16,
    zIndex: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  circleBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
  topNavIcon: {
    fontSize: 18,
    color: COLORS.coffee,
    fontWeight: '900',
  },
  imageBox: {
    width: width,
    height: 280,
    backgroundColor: COLORS.pinkLight,
  },
  mainImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  thumbsRow: {
    paddingHorizontal: 16,
    marginVertical: 10,
  },
  thumb: {
    width: 50,
    height: 50,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    marginRight: 8,
    overflow: 'hidden',
  },
  activeThumb: {
    borderColor: COLORS.rose,
  },
  thumbImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  card: {
    backgroundColor: COLORS.glassWhite,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -20,
    padding: 16,
    elevation: 6,
  },
  brandTag: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.pinkLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 6,
  },
  brandText: {
    color: COLORS.rose,
    fontSize: 10,
    fontWeight: '900',
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.coffee,
    lineHeight: 26,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    marginTop: 8,
  },
  price: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.rose,
  },
  oldPrice: {
    fontSize: 14,
    color: COLORS.textMuted,
    textDecorationLine: 'line-through',
  },
  descBox: {
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  descTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: COLORS.coffee,
    marginBottom: 4,
  },
  descText: {
    fontSize: 12,
    color: COLORS.textMuted,
    lineHeight: 18,
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  stepperLabel: {
    fontSize: 14,
    fontWeight: '900',
    color: COLORS.coffee,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.pinkLight,
    borderRadius: 12,
    padding: 4,
    gap: 12,
  },
  stepBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: COLORS.coffee,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBtnText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '900',
  },
  qtyText: {
    fontSize: 15,
    fontWeight: '900',
    color: COLORS.coffee,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    elevation: 10,
  },
  totalLabel: {
    fontSize: 10,
    color: COLORS.textMuted,
    fontWeight: '700',
  },
  totalPrice: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.rose,
  },
  addToCartBtn: {
    backgroundColor: COLORS.coffee,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 14,
  },
  addToCartText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '900',
  },
});
