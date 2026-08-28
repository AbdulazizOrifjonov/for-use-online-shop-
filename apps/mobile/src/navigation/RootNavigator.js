import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Icon } from '../components/Icon';
import { HomeScreen } from '../screens/HomeScreen';
import { CatalogScreen } from '../screens/CatalogScreen';
import { ProductDetailScreen } from '../screens/ProductDetailScreen';
import { CartScreen } from '../screens/CartScreen';
import { WishlistScreen } from '../screens/WishlistScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { COLORS } from '../theme/colors';
import { useStore } from '../context/StoreContext';

export function RootNavigator() {
  const [currentTab, setCurrentTab] = React.useState('Home');
  const [activeStack, setActiveStack] = React.useState(null);

  const { cartCount, wishlistCount } = useStore();

  function navigate(tabName, params) {
    if (params?.product) {
      setActiveStack({ screen: 'ProductDetail', params });
      return;
    }
    setActiveStack(null);
    setCurrentTab(tabName);
  }

  function goBack() {
    setActiveStack(null);
  }

  function renderScreen() {
    if (activeStack?.screen === 'ProductDetail') {
      return <ProductDetailScreen route={{ params: activeStack.params }} navigation={{ goBack, navigate }} />;
    }

    switch (currentTab) {
      case 'Home':
        return <HomeScreen navigation={{ navigate }} />;
      case 'Catalog':
        return <CatalogScreen route={{ params: activeStack?.params || {} }} navigation={{ navigate }} />;
      case 'Cart':
        return <CartScreen navigation={{ navigate }} />;
      case 'Wishlist':
        return <WishlistScreen navigation={{ navigate }} />;
      case 'Profile':
        return <ProfileScreen navigation={{ navigate }} />;
      default:
        return <HomeScreen navigation={{ navigate }} />;
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.screenContainer}>{renderScreen()}</View>

      {/* 1-to-1 Web Store Vector Icon Bottom Navigation Bar */}
      {!activeStack && (
        <View style={styles.tabBar}>
          <TouchableOpacity style={styles.tabItem} onPress={() => navigate('Home')} activeOpacity={0.7}>
            <View style={[styles.iconBox, currentTab === 'Home' && styles.activeBox]}>
              <Icon
                name="home"
                size={20}
                color={currentTab === 'Home' ? COLORS.white : 'rgba(74,46,43,0.75)'}
              />
            </View>
            <Text style={[styles.tabLabel, currentTab === 'Home' && styles.activeLabel]}>
              Bosh sahifa
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.tabItem} onPress={() => navigate('Catalog')} activeOpacity={0.7}>
            <View style={[styles.iconBox, currentTab === 'Catalog' && styles.activeBox]}>
              <Icon
                name="compass"
                size={20}
                color={currentTab === 'Catalog' ? COLORS.white : 'rgba(74,46,43,0.75)'}
              />
            </View>
            <Text style={[styles.tabLabel, currentTab === 'Catalog' && styles.activeLabel]}>
              Katalog
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.tabItem} onPress={() => navigate('Cart')} activeOpacity={0.7}>
            <View style={[styles.iconBox, currentTab === 'Cart' && styles.activeBox]}>
              <Icon
                name="shopping-bag"
                size={20}
                color={currentTab === 'Cart' ? COLORS.white : 'rgba(74,46,43,0.75)'}
              />
              {cartCount > 0 && (
                <View style={[styles.badge, currentTab === 'Cart' ? styles.badgeActiveBox : styles.badgeInactiveBox]}>
                  <Text style={styles.badgeText}>{cartCount > 99 ? '99+' : cartCount}</Text>
                </View>
              )}
            </View>
            <Text style={[styles.tabLabel, currentTab === 'Cart' && styles.activeLabel]}>
              Savatcha
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.tabItem} onPress={() => navigate('Wishlist')} activeOpacity={0.7}>
            <View style={[styles.iconBox, currentTab === 'Wishlist' && styles.activeBox]}>
              <Icon
                name="heart"
                size={20}
                color={currentTab === 'Wishlist' ? COLORS.white : 'rgba(74,46,43,0.75)'}
              />
              {wishlistCount > 0 && (
                <View style={[styles.badge, currentTab === 'Wishlist' ? styles.badgeActiveBox : styles.badgeInactiveBox]}>
                  <Text style={styles.badgeText}>{wishlistCount > 99 ? '99+' : wishlistCount}</Text>
                </View>
              )}
            </View>
            <Text style={[styles.tabLabel, currentTab === 'Wishlist' && styles.activeLabel]}>
              Saralangan
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.tabItem} onPress={() => navigate('Profile')} activeOpacity={0.7}>
            <View style={[styles.iconBox, currentTab === 'Profile' && styles.activeBox]}>
              <Icon
                name="user"
                size={20}
                color={currentTab === 'Profile' ? COLORS.white : 'rgba(74,46,43,0.75)'}
              />
            </View>
            <Text style={[styles.tabLabel, currentTab === 'Profile' && styles.activeLabel]}>
              Profil
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  screenContainer: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    height: 64,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(251, 207, 232, 0.9)',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 4,
    elevation: 25,
    shadowColor: 'rgba(74,46,43,0.12)',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 1,
    shadowRadius: 25,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: 4,
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 4,
  },
  activeBox: {
    backgroundColor: COLORS.rose,
    transform: [{ scale: 1.05 }],
    shadowColor: COLORS.rose,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: 'rgba(74,46,43,0.8)',
  },
  activeLabel: {
    color: COLORS.rose,
    fontWeight: '900',
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -6,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 1,
    borderColor: '#ffffff',
  },
  badgeActiveBox: {
    backgroundColor: COLORS.coffee,
  },
  badgeInactiveBox: {
    backgroundColor: COLORS.rose,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '900',
  },
});
