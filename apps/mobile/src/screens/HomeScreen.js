import React from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { COLORS } from '../theme/colors';
import { useStore } from '../context/StoreContext';
import { Header } from '../components/Header';
import { BannerSlider } from '../components/BannerSlider';
import { CategoriesMarquee } from '../components/CategoriesMarquee';
import { ProductCard } from '../components/ProductCard';
import { TrustBadges } from '../components/TrustBadges';

export function HomeScreen({ navigation }) {
  const { products, isLoading, reload } = useStore();

  function handleProductPress(product) {
    navigation.navigate('ProductDetail', { product });
  }

  function handleCategorySelect(slug) {
    navigation.navigate('Catalog', { category: slug });
  }

  return (
    <View style={styles.container}>
      <Header
        onCartPress={() => navigation.navigate('Cart')}
        onSearchPress={() => navigation.navigate('Catalog')}
        onProfilePress={() => navigation.navigate('Profile')}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={reload} colors={[COLORS.rose]} />
        }
      >
        {/* Banner Slider */}
        <BannerSlider />

        {/* Trust Badges for Mobile */}
        <TrustBadges />

        {/* Categories Carousel Bar */}
        <CategoriesMarquee onCategorySelect={handleCategorySelect} />

        {/* Popular Products Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Mashhur mahsulotlar</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Catalog')}>
              <Text style={styles.viewAllText}>Barchasini ko'rish ›</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.grid}>
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onPress={handleProductPress}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollContent: {
    paddingBottom: 24,
  },
  section: {
    marginTop: 14,
    paddingHorizontal: 14,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: COLORS.coffee,
  },
  viewAllText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.rose,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});
