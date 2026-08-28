import React from 'react';
import { View, Text, StyleSheet, Dimensions, useWindowDimensions } from 'react-native';
import { Icon } from './Icon';
import { COLORS } from '../theme/colors';

export function TrustBadges() {
  const { width } = useWindowDimensions();
  const isTablet = width >= 640;

  const badges = [
    { id: 1, title: '100% Tabiiy Masalliqlar', subtitle: "Faqat toza sariq yog', bezen va tabiat in'omi", icon: 'star' },
    { id: 2, title: 'Har kuni yangi pishiriladi', subtitle: 'Har bir buyurtma uchun yangi va issiq', icon: 'heart' },
    { id: 3, title: 'Ehtiyotkor yetkazib berish', subtitle: 'Tortlar shaklini saqlagan holda yetkazish', icon: 'truck' },
    { id: 4, title: 'Retseptlar Siri', subtitle: 'Fransuz va Italiya qandolat mahorati', icon: 'award' },
  ];

  return (
    <View style={styles.container}>
      {badges.map((badge) => (
        <View key={badge.id} style={[styles.badgeItem, { width: isTablet ? '48%' : '100%' }]}>
          <View style={styles.iconBox}>
            <Icon name={badge.icon} size={20} color={COLORS.rose} />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.title}>{badge.title}</Text>
            <Text style={styles.subtitle}>{badge.subtitle}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  badgeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(251, 207, 232, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 13,
    fontWeight: '800',
    color: '#4A2E2B',
  },
  subtitle: {
    fontSize: 10,
    color: '#6F4E37',
    marginTop: 2,
  },
});
