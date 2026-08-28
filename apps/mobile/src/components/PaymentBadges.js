import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../theme/colors';

export function PaymentBadges() {
  return (
    <View style={styles.box}>
      <Text style={styles.headerTitle}>Qulay to'lov turlari</Text>
      <Text style={styles.headerSub}>Barcha burchakli kartalar va ilovalar orqali to'lang</Text>

      {/* Cards List */}
      <View style={styles.badgesRow}>
        <View style={[styles.badgePill, { borderColor: '#93C5FD' }]}>
          <View style={[styles.dot, { backgroundColor: '#2563EB' }]} />
          <Text style={[styles.badgeText, { color: '#1E3A8A' }]}>UZCARD</Text>
        </View>

        <View style={[styles.badgePill, { borderColor: '#A7F3D0' }]}>
          <View style={[styles.dot, { backgroundColor: '#10B981' }]} />
          <Text style={[styles.badgeText, { color: '#065F46' }]}>HUMO</Text>
        </View>

        <View style={[styles.badgePill, { borderColor: '#FDE68A' }]}>
          <Text style={[styles.badgeText, { color: '#1F2937' }]}>Mastercard</Text>
        </View>

        <View style={[styles.badgePill, { borderColor: '#C7D2FE' }]}>
          <Text style={[styles.badgeText, { color: '#3730A3', fontStyle: 'italic' }]}>VISA</Text>
        </View>

        <View style={[styles.badgePill, { borderColor: COLORS.pinkSoft }]}>
          <Text style={[styles.badgeText, { color: COLORS.rose }]}>Payme / Click / Naqd</Text>
        </View>
      </View>

      {/* Guarantees */}
      <View style={styles.guaranteesRow}>
        <View style={styles.guaranteeCard}>
          <Text style={styles.guaranteeIcon}>🧁</Text>
          <Text style={styles.guaranteeText}>100% Yangi Pishiriq</Text>
        </View>
        <View style={styles.guaranteeCard}>
          <Text style={styles.guaranteeIcon}>🚚</Text>
          <Text style={styles.guaranteeText}>Ehtiyotkor Yetkazish</Text>
        </View>
        <View style={styles.guaranteeCard}>
          <Text style={styles.guaranteeIcon}>🎀</Text>
          <Text style={styles.guaranteeText}>Nafis Sovg'abop</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    backgroundColor: COLORS.cream,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    padding: 14,
    marginVertical: 12,
  },
  headerTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: COLORS.coffee,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  headerSub: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 2,
    marginBottom: 10,
  },
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '900',
  },
  guaranteesRow: {
    flexDirection: 'row',
    gap: 6,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    paddingTop: 10,
  },
  guaranteeCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 10,
    padding: 6,
  },
  guaranteeIcon: {
    fontSize: 14,
  },
  guaranteeText: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.coffee,
    flex: 1,
  },
});
