import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, useWindowDimensions, ScrollView, TouchableOpacity } from 'react-native';
import { COLORS } from '../theme/colors';

const DEFAULT_SLIDERS = [
  {
    id: 'd-2',
    title: 'Fransuz Kuruassanlari & Eklerlar',
    subtitle: 'Ertalabki kofe uchun har kuni yangi pishiriladigan qarsillama french bakery mahsulotlari',
    imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=1600&auto=format&fit=crop&q=80',
  },
  {
    id: 'd-1',
    title: 'Professional Tools — Kompyuter Aksessuarlari',
    subtitle: 'Har bir tort alohida mehr va tabiiy masalliqlar bilan pishiriladi',
    imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=1600&auto=format&fit=crop&q=80',
  },
  {
    id: 'd-3',
    title: 'Bayram Shirinlik Boks To\'plamlari',
    subtitle: 'Yaqinlaringiz uchun ideal va nafis sovg\'a tanlovi',
    imageUrl: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=1600&auto=format&fit=crop&q=80',
  },
];

export function BannerSlider() {
  const { width } = useWindowDimensions();
  const SLIDER_WIDTH = Math.max(0, width - 32); // 16px padding on each side
  const isTablet = width >= 640;
  
  // sm:aspect-[16/6] else aspect-[16/9]
  const sliderHeight = isTablet ? (SLIDER_WIDTH * 6) / 16 : (SLIDER_WIDTH * 9) / 16;

  const [activeIndex, setActiveIndex] = useState(0);
  const scrollViewRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => {
      const nextIndex = (activeIndex + 1) % DEFAULT_SLIDERS.length;
      setActiveIndex(nextIndex);
      scrollViewRef.current?.scrollTo({ x: nextIndex * SLIDER_WIDTH, animated: true });
    }, 5000);
    return () => clearInterval(timer);
  }, [activeIndex, SLIDER_WIDTH]);

  function handleScroll(e) {
    const x = e.nativeEvent.contentOffset.x;
    const index = Math.round(x / SLIDER_WIDTH);
    if (index !== activeIndex) setActiveIndex(index);
  }

  return (
    <View style={[styles.container, { height: sliderHeight }]}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {DEFAULT_SLIDERS.map((item) => (
          <View key={item.id} style={[styles.slide, { width: SLIDER_WIDTH, height: sliderHeight }]}>
            <Image source={{ uri: item.imageUrl }} style={styles.image} />
            <View style={styles.overlay} />
            <View style={[styles.content, isTablet && { bottom: 24, left: 32 }]}>
              <View style={styles.tag}>
                <Text style={styles.tagText}>✨ PROFESSIONAL TOOLS</Text>
              </View>
              <Text style={[styles.title, isTablet && { fontSize: 28, lineHeight: 34 }]}>{item.title}</Text>
              {item.subtitle ? <Text style={[styles.subtitle, isTablet && { fontSize: 14, marginTop: 6 }]}>{item.subtitle}</Text> : null}
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Pagination Dots */}
      <View style={[styles.dotsContainer, isTablet && { bottom: 20 }]}>
        {DEFAULT_SLIDERS.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              i === activeIndex && styles.activeDot,
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#FFF9F0',
    borderWidth: 1,
    borderColor: 'rgba(251, 207, 232, 0.5)',
    elevation: 4,
    shadowColor: '#4A2E2B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  slide: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(74, 46, 43, 0.4)',
  },
  content: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
  },
  tag: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.rose,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 99,
    marginBottom: 8,
  },
  tagText: {
    color: COLORS.white,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  title: {
    color: '#FFF9F0',
    fontSize: 20,
    fontWeight: '900',
    lineHeight: 24,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    color: '#FBCFE8',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  dotsContainer: {
    position: 'absolute',
    bottom: 12,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  },
  activeDot: {
    width: 24,
    backgroundColor: COLORS.rose,
  },
});
