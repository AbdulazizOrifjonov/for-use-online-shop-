import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions, TextInput } from 'react-native';
import { Icon } from './Icon';
import { COLORS } from '../theme/colors';
import { useStore } from '../context/StoreContext';

const { width } = Dimensions.get('window');
const isTablet = width >= 640;

export function Header({ onMenuPress, onSearchPress }) {
  return (
    <View style={styles.header}>
      {/* Left: Hamburger Menu */}
      <TouchableOpacity style={styles.iconBtn} onPress={onMenuPress}>
        <Icon name="menu" size={24} color="#4A2E2B" />
      </TouchableOpacity>

      {/* Logo */}
      <View style={styles.logoContainer}>
        <Image source={require('../../logo.png')} style={styles.logoImage} />
      </View>

      {/* Search Bar for Tablet */}
      {isTablet && (
        <View style={styles.searchContainer}>
          <Icon name="search" size={16} color="#9CA3AF" style={{ marginLeft: 12, marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Tortlar, pishiriqlar yoki desertlarni qidir..."
            placeholderTextColor="#9CA3AF"
          />
        </View>
      )}

      {/* Right Icons */}
      <View style={styles.rightIcons}>
        {!isTablet && (
          <TouchableOpacity style={styles.iconBtn} onPress={onSearchPress}>
            <Icon name="search" size={20} color="#4A2E2B" />
          </TouchableOpacity>
        )}
        {isTablet && (
          <>
            <TouchableOpacity style={styles.iconBtn}>
              <Icon name="moon" size={20} color="#4A2E2B" />
            </TouchableOpacity>
            <View style={styles.langBadge}>
              <Icon name="globe" size={14} color="#4A2E2B" />
              <Text style={styles.langText}>UZ</Text>
            </View>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 64, // Same as h-16
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(251, 207, 232, 0.8)',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  logoContainer: {
    paddingRight: isTablet ? 16 : 0,
    flex: isTablet ? 0 : 1,
    alignItems: isTablet ? 'flex-start' : 'center',
    justifyContent: 'center',
  },
  logoImage: {
    height: 40, // Same as web Logo height
    width: 140,
    resizeMode: 'contain',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    borderWidth: 1,
    borderColor: '#FBCFE8',
    borderRadius: 99, // fully rounded
    backgroundColor: '#FFFFFF',
    maxWidth: 400,
    marginHorizontal: 16,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 13,
    color: '#4A2E2B',
  },
  rightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  langBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: 'transparent',
  },
  langText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#4A2E2B',
  }
});
