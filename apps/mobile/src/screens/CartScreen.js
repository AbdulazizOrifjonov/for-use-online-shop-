import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { COLORS } from '../theme/colors';
import { formatUZS } from '../config/api';
import { useStore } from '../context/StoreContext';
import { Header } from '../components/Header';

export function CartScreen({ navigation }) {
  const { cart, cartTotal, updateQuantity, removeFromCart, clearCart } = useStore();
  const [isOrdering, setIsOrdering] = useState(false);

  function handleCheckout() {
    if (cart.length === 0) return;
    setIsOrdering(true);
    setTimeout(() => {
      setIsOrdering(false);
      clearCart();
      Alert.alert(
        'Buyurtma qabul qilindi!',
        'Rahmat! Professional Tools operatori 5 daqiqa ichida siz bilan boglanadi.',
        [{ text: 'Ajoyib!', onPress: () => navigation.navigate('Home') }]
      );
    }, 1200);
  }

  return (
    <View style={styles.container}>
      <Header />

      {cart.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🛒</Text>
          <Text style={styles.emptyTitle}>Savatchangiz bo'sh</Text>
          <Text style={styles.emptySub}>Shirinliklar va tortlarni tanlab savatga qo'shing</Text>
          <TouchableOpacity style={styles.shopBtn} onPress={() => navigation.navigate('Catalog')}>
            <Text style={styles.shopBtnText}>🍰 Shirinliklarni ko'rish</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {/* Header bar */}
            <View style={styles.cartHeader}>
              <Text style={styles.cartTitle}>Savatcha ({cart.length} turdagi)</Text>
              <TouchableOpacity style={styles.clearBtn} onPress={clearCart}>
                <Text style={styles.clearBtnText}>Savatchani tozalash</Text>
              </TouchableOpacity>
            </View>

            {/* Cart Items List */}
            {cart.map(({ product, quantity }) => {
              const itemPrice = (product.discountPrice ?? product.price) * quantity;
              const imgUrl = product.images?.[0]?.url || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=200';

              return (
                <View key={product.id} style={styles.card}>
                  <Image source={{ uri: imgUrl }} style={styles.itemImage} />

                  <View style={styles.itemDetails}>
                    <Text style={styles.itemName} numberOfLines={2}>
                      {product.nameUz || product.nameEn}
                    </Text>

                    <Text style={styles.itemPrice}>{formatUZS(itemPrice)}</Text>

                    {/* Stepper */}
                    <View style={styles.stepperRow}>
                      <View style={styles.stepper}>
                        <TouchableOpacity
                          style={styles.stepBtn}
                          onPress={() => updateQuantity(product.id, -1)}
                        >
                          <Text style={styles.stepBtnText}>-</Text>
                        </TouchableOpacity>
                        <Text style={styles.qtyText}>{quantity}</Text>
                        <TouchableOpacity
                          style={styles.stepBtn}
                          onPress={() => updateQuantity(product.id, 1)}
                        >
                          <Text style={styles.stepBtnText}>+</Text>
                        </TouchableOpacity>
                      </View>

                      <TouchableOpacity onPress={() => removeFromCart(product.id)}>
                        <Text style={styles.deleteText}>🗑 O'chirish</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              );
            })}

            {/* Summary Box */}
            <View style={styles.summaryBox}>
              <Text style={styles.summaryTitle}>Buyurtma xulosasi</Text>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Mahsulotlar summasi:</Text>
                <Text style={styles.summaryVal}>{formatUZS(cartTotal)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Yetkazib berish:</Text>
                <Text style={[styles.summaryVal, { color: COLORS.success }]}>BEPUL</Text>
              </View>
              <View style={[styles.summaryRow, styles.totalRow]}>
                <Text style={styles.totalLabel}>Jami to'lov:</Text>
                <Text style={styles.totalVal}>{formatUZS(cartTotal)}</Text>
              </View>
            </View>
          </ScrollView>

          {/* Checkout Action Bar */}
          <View style={styles.checkoutBar}>
            <View>
              <Text style={styles.totalBarLabel}>Jami:</Text>
              <Text style={styles.totalBarPrice}>{formatUZS(cartTotal)}</Text>
            </View>

            <TouchableOpacity
              style={[styles.checkoutBtn, isOrdering && styles.disabledBtn]}
              onPress={handleCheckout}
              disabled={isOrdering}
            >
              <Text style={styles.checkoutBtnText}>
                {isOrdering ? 'Rasmiylashtirilmoqda...' : 'Buyurtma berish 🚀'}
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.pinkBackground,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 90,
  },
  cartHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  cartTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.coffee,
  },
  clearBtn: {
    backgroundColor: COLORS.pinkLight,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.borderPink,
  },
  clearBtnText: {
    color: COLORS.danger,
    fontSize: 11,
    fontWeight: '800',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: COLORS.glassWhite,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    padding: 10,
    marginBottom: 10,
    gap: 12,
  },
  itemImage: {
    width: 75,
    height: 75,
    borderRadius: 12,
    resizeMode: 'cover',
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },
  itemName: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.coffee,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '900',
    color: COLORS.rose,
    marginTop: 2,
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.pinkLight,
    borderRadius: 8,
    padding: 2,
  },
  stepBtn: {
    width: 26,
    height: 26,
    borderRadius: 6,
    backgroundColor: COLORS.coffee,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBtnText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '900',
  },
  qtyText: {
    fontSize: 13,
    fontWeight: '900',
    color: COLORS.coffee,
  },
  deleteText: {
    fontSize: 11,
    color: COLORS.danger,
    fontWeight: '700',
  },
  summaryBox: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    padding: 14,
    marginTop: 10,
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: COLORS.coffee,
    marginBottom: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  summaryLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  summaryVal: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.coffee,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    paddingTop: 8,
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '900',
    color: COLORS.coffee,
  },
  totalVal: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.rose,
  },
  checkoutBar: {
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
  totalBarLabel: {
    fontSize: 10,
    color: COLORS.textMuted,
  },
  totalBarPrice: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.rose,
  },
  checkoutBtn: {
    backgroundColor: COLORS.rose,
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 14,
  },
  disabledBtn: {
    opacity: 0.6,
  },
  checkoutBtnText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '900',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyIcon: {
    fontSize: 60,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.coffee,
  },
  emptySub: {
    fontSize: 12,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 20,
  },
  shopBtn: {
    backgroundColor: COLORS.coffee,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 14,
  },
  shopBtnText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '800',
  },
});
