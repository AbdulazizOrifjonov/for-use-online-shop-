import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { COLORS } from '../theme/colors';
import { useStore } from '../context/StoreContext';

export function CategoriesMarquee({ onCategorySelect }) {
  const { categories } = useStore();

  if (!categories || categories.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Kategoriyalar</Text>
        <Text style={styles.subtitle}>Saralangan qandolatchilik turlari</Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            style={styles.card}
            onPress={() => onCategorySelect?.(cat.slug)}
            activeOpacity={0.85}
          >
            {cat.imageUrl ? (
              <Image source={{ uri: cat.imageUrl }} style={styles.image} />
            ) : (
              <View style={styles.placeholder}>
                <Text style={styles.placeholderText}>
                  {(cat.nameUz || cat.nameEn || 'A')[0]}
                </Text>
              </View>
            )}
            <Text style={styles.catName} numberOfLines={2}>
              {cat.nameUz || cat.nameEn}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    marginBottom: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#4A2E2B',
  },
  subtitle: {
    fontSize: 10,
    fontWeight: '600',
    color: '#6F4E37',
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 16,
    padding: 12,
    width: 240, // Match web w-60
    height: 72, // Match web h-18
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  image: {
    width: 48,
    height: 48,
    borderRadius: 12,
    resizeMode: 'cover',
  },
  placeholder: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(251, 207, 232, 0.8)', // pink-100/80
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.rose,
  },
  catName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: '#4A2E2B',
  },
});
