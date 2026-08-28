import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { COLORS } from '../theme/colors';
import { useStore } from '../context/StoreContext';
import { Header } from '../components/Header';
import { ProductCard } from '../components/ProductCard';

export function WishlistScreen({ navigation }) {
  const { wishlist, wishlistCount } = useStore();

  return (
    <View style={styles.container}>
      <Header onCartPress={() => navigation.navigate('Cart')} />

      <View style={styles.headerBar}>
        <Text style={styles.headerTitle}>Saralangan shirinliklar ({wishlistCount})</Text>
      </View>

      {wishlistCount === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyIcon}>💖</Text>
          <Text style={styles.emptyTitle}>Saralanganlar bo'sh</Text>
          <Text style={styles.emptySub}>O'zingizga yoqqan tort va pishiriqlarni yurakcha tugmasini bosib saqlang</Text>
          <TouchableOpacity style={styles.shopBtn} onPress={() => navigation.navigate('Catalog')}>
            <Text style={styles.shopBtnText}>🍰 Shirinliklarni izlash</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.grid}>
            {wishlist.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onPress={(p) => navigation.navigate('ProductDetail', { product: p })}
              />
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.pinkBackground,
  },
  headerBar: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.coffee,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  emptyBox: {
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
