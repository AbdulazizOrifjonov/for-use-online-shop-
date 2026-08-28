import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { COLORS } from '../theme/colors';
import { useStore } from '../context/StoreContext';
import { Header } from '../components/Header';
import { ProductCard } from '../components/ProductCard';

export function CatalogScreen({ route, navigation }) {
  const { products, categories } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(route.params?.category || null);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesQuery = !searchQuery.trim() ||
        p.nameUz?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.nameEn?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = !selectedCategory || p.category?.slug === selectedCategory;
      return matchesQuery && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  return (
    <View style={styles.container}>
      <Header onCartPress={() => navigation.navigate('Cart')} />

      {/* Search Input */}
      <View style={styles.searchBox}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Tortlar, pishiriqlar yoki desertlarni qidiring..."
          placeholderTextColor={COLORS.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Text style={styles.clearIcon}>❌</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Categories Filter Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryTabs}
      >
        <TouchableOpacity
          style={[styles.tabPill, !selectedCategory && styles.activeTabPill]}
          onPress={() => setSelectedCategory(null)}
        >
          <Text style={[styles.tabText, !selectedCategory && styles.activeTabText]}>
            Barchasi
          </Text>
        </TouchableOpacity>

        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.slug;
          return (
            <TouchableOpacity
              key={cat.id}
              style={[styles.tabPill, isSelected && styles.activeTabPill]}
              onPress={() => setSelectedCategory(isSelected ? null : cat.slug)}
            >
              <Text style={[styles.tabText, isSelected && styles.activeTabText]}>
                {cat.nameUz || cat.nameEn}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Products Grid */}
      <ScrollView contentContainerStyle={styles.gridContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.countRow}>
          <Text style={styles.countText}>
            {selectedCategory ? `Kategoriya mahsulotlari` : 'Barcha mahsulotlar'} ({filteredProducts.length})
          </Text>
        </View>

        {filteredProducts.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyIcon}>🍰</Text>
            <Text style={styles.emptyTitle}>Hech narsa topilmadi</Text>
            <Text style={styles.emptySub}>Boshqa qidiruv so'zidan foydalanib ko'ring</Text>
          </View>
        ) : (
          <View style={styles.grid}>
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onPress={(p) => navigation.navigate('ProductDetail', { product: p })}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.pinkBackground,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.borderPink,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.coffee,
  },
  clearIcon: {
    fontSize: 12,
  },
  categoryTabs: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    gap: 8,
  },
  tabPill: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  activeTabPill: {
    backgroundColor: COLORS.rose,
    borderColor: COLORS.rose,
  },
  tabText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.coffee,
  },
  activeTabText: {
    color: COLORS.white,
  },
  gridContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  countRow: {
    marginVertical: 10,
  },
  countText: {
    fontSize: 13,
    fontWeight: '900',
    color: COLORS.coffee,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  emptyBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 10,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.coffee,
  },
  emptySub: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 4,
  },
});
