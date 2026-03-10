import React, { useMemo, useRef, useEffect, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Image, useWindowDimensions, StatusBar, FlatList,
} from 'react-native';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, RADIUS, SHADOW } from '@/src/utils/theme';
import { useScrollContext } from '@/context/ScrollContext';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import AnimatedSearchPlaceholder from '@/src/components/AnimatedSearchPlaceholder';
import { useThemedStyles } from '@/src/utils/useThemedStyles';
import { DISH_PACKS } from '@/data/dishPacks';
import productsData from '@/data/products.json';

const CATEGORIES = [
  { key: 'Vegetables', label: 'Vegetables', image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=200&q=80', color: '#E8F5E9' },
  { key: 'Fruits', label: 'Fruits', image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', color: '#E8F5E9' },
  { key: 'Healthy Snacks', label: 'Healthy Snacks', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=200&q=80', color: '#E8F5E9' },
  { key: 'Diet Foods', label: 'Diet Foods', image: 'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?auto=format&fit=crop&w=200&q=80', color: '#E3F2FD' },
  { key: 'Sports Nutrition', label: 'Sports & Gym', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=200&q=80', color: '#FCE4EC' },
];

const OFFERS = [
  { id: '1', title: 'Fresh Cut Vegetables & Fruits', desc: 'Select your veggies, choose your cut style & we deliver!', bg: ['#388E3C', '#4CAF50'] as const, icon: 'shopping' as const, route: '/browse', params: { category: 'Vegetables' }, btn: 'Order Now' },
  { id: '2', title: 'Free Cutting on First Order', desc: 'Choose any cut style absolutely free!', bg: ['#1565C0', '#1E88E5'] as const, icon: 'tag-outline' as const, route: null, params: null, btn: '' },
  { id: '3', title: 'Dish Packs from \u20B995', desc: 'Sambar, Biryani & more - pre-cut for your dish!', bg: ['#E65100', '#F57C00'] as const, icon: 'food-variant' as const, route: '/(tabs)/packs', params: null, btn: 'View Packs' },
  { id: '4', title: 'Healthy Diet Packs', desc: 'Low calorie, high protein foods for fitness lovers', bg: ['#7B1FA2', '#9C27B0'] as const, icon: 'heart-pulse' as const, route: '/browse', params: { category: 'Diet Foods' }, btn: 'Explore' },
  { id: '5', title: 'Buy 2 Get 1 Free', desc: 'On all seasonal fruit packs this week!', bg: ['#C62828', '#EF5350'] as const, icon: 'fruit-watermelon' as const, route: '/browse', params: { category: 'Fruits' }, btn: 'Shop Now' },
];

const POPULAR_IDS = ['1', '4', '13', '7', '19', '22', '11', '23'];

function OffersCarousel({ width }: { width: number }) {
  const flatListRef = useRef<FlatList>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const indexRef = useRef(0);
  const router = useRouter();

  useEffect(() => {
    const timer = setInterval(() => {
      const next = (indexRef.current + 1) % OFFERS.length;
      indexRef.current = next;
      flatListRef.current?.scrollToOffset({ offset: next * width, animated: true });
    }, 3500);
    return () => clearInterval(timer);
  }, [width]);

  const onScroll = useCallback((e: any) => {
    const idx = Math.round(e.nativeEvent.contentOffset.x / width);
    if (idx !== indexRef.current && idx >= 0 && idx < OFFERS.length) {
      indexRef.current = idx;
      setActiveIndex(idx);
    }
  }, [width]);

  return (
    <View style={styles.offersSection}>
      <FlatList
        ref={flatListRef}
        data={OFFERS}
        keyExtractor={i => i.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        getItemLayout={(_, index) => ({ length: width, offset: width * index, index })}
        renderItem={({ item }) => (
          <View style={{ width, paddingHorizontal: SPACING.base }}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => { if (item.route) router.push(item.params ? { pathname: item.route, params: item.params } as any : item.route as any); }}
            >
              <LinearGradient colors={item.bg} style={styles.offerCard}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.offerTitle}>{item.title}</Text>
                  <Text style={styles.offerDesc}>{item.desc}</Text>
                  {item.btn ? (
                    <View style={styles.offerBtn}>
                      <Text style={styles.offerBtnText}>{item.btn}</Text>
                      <Icon name="chevron-right" size={14} color={COLORS.primary} />
                    </View>
                  ) : null}
                </View>
                <View style={styles.offerIconWrap}>
                  <Icon name={item.icon} size={36} color="rgba(255,255,255,0.35)" />
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}
      />
      <View style={styles.offerDots}>
        {OFFERS.map((_, i) => (
          <View key={i} style={[styles.offerDot, activeIndex === i && styles.offerDotActive]} />
        ))}
      </View>
    </View>
  );
}

function AddToCartButton({ item }: { item: any }) {
  const { cartItems, addToCart, updateQuantity } = useCart();
  const inCart = cartItems.find((c) => c.id === item.id);
  const qty = inCart?.quantity || 0;

  if (qty === 0) {
    return (
      <TouchableOpacity
        style={styles.addBtn}
        onPress={(e) => { e.stopPropagation(); addToCart(item, 1); }}
        activeOpacity={0.8}
      >
        <Text style={styles.addBtnText}>ADD</Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.qtyRow}>
      <TouchableOpacity
        style={styles.qtyBtn}
        onPress={(e) => { e.stopPropagation(); updateQuantity(item.id, qty - 1); }}
      >
        <Icon name="minus" size={14} color={COLORS.primary} />
      </TouchableOpacity>
      <Text style={styles.qtyText}>{qty}</Text>
      <TouchableOpacity
        style={styles.qtyBtn}
        onPress={(e) => { e.stopPropagation(); updateQuantity(item.id, qty + 1); }}
      >
        <Icon name="plus" size={14} color={COLORS.primary} />
      </TouchableOpacity>
    </View>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { handleScroll } = useScrollContext();
  const { user } = useAuth();
  const themed = useThemedStyles();

  const popularProducts = useMemo(() => productsData.filter(p => POPULAR_IDS.includes(p.id)), []);
  const healthySnacks = useMemo(() => productsData.filter(p => p.category === 'Healthy Snacks').slice(0, 6), []);
  const dietFoods = useMemo(() => productsData.filter(p => p.category === 'Diet Foods').slice(0, 6), []);
  const sportsFoods = useMemo(() => productsData.filter(p => p.category === 'Sports Nutrition').slice(0, 6), []);
  const cardW = (width - SPACING.base * 2 - 10) / 2;

  return (
    <SafeAreaView style={[styles.safe, themed.safeArea]} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      <LinearGradient colors={themed.headerGradient} style={styles.header}>
        <View style={styles.headerRow}>
          <View>
            <Text style={[styles.headerTitle, themed.textPrimary]}>Chopify</Text>
            <Text style={styles.headerSub}>Fresh cut, ready to cook!</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity onPress={() => router.push('/wallet')} style={styles.walletBtn}>
              <View style={styles.walletIcon}>
                <Icon name="wallet-outline" size={20} color={COLORS.text.primary} />
              </View>
              <Text style={styles.walletText}>{'\u20B9'}0</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerIconBtn} onPress={() => router.push('/notifications')}>
              <Icon name="bell-outline" size={24} color={COLORS.text.primary} />
              <View style={styles.notifDot} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/(tabs)/profile')} style={styles.profileBtn}>
              {user?.avatar ? (
                <Image source={{ uri: user.avatar }} style={styles.profileIconImg} resizeMode="cover" />
              ) : (
                <View style={styles.profileIcon}>
                  <Icon name="account" size={20} color="#FFF" />
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar */}
        <TouchableOpacity
          style={styles.searchBar}
          onPress={() => router.push('/search')}
          activeOpacity={0.9}
        >
          <Icon name="magnify" size={20} color={COLORS.text.muted} />
          <AnimatedSearchPlaceholder />
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll} onScroll={handleScroll} scrollEventThrottle={16}>
        {/* Offers Carousel */}
        <OffersCarousel width={width} />

        {/* Categories */}
        <Text style={[styles.sectionTitle, themed.textPrimary]}>Shop by Category</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
          {CATEGORIES.map(cat => (
            <TouchableOpacity
              key={cat.key}
              style={[styles.categoryCard, { backgroundColor: cat.color }]}
              onPress={() => router.push({ pathname: '/browse', params: { category: cat.key } })}
              activeOpacity={0.8}
            >
              <Image source={{ uri: cat.image }} style={styles.categoryImage} resizeMode="cover" />
              <Text style={styles.categoryLabel}>{cat.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Dish Packs Banner */}
        <TouchableOpacity style={styles.packsBanner} onPress={() => router.push('/(tabs)/packs')} activeOpacity={0.85}>
          <LinearGradient colors={COLORS.gradient.green} style={styles.packsGrad}>
            <View style={styles.packsContent}>
              <Icon name="food-variant" size={36} color="#FFF" />
              <View style={{ flex: 1 }}>
                <Text style={styles.packsTitle}>Dish Packs</Text>
                <Text style={styles.packsDesc}>Sambar, Biryani, Fish Gravy & more - all veggies pre-cut for your dish!</Text>
              </View>
              <Icon name="chevron-right" size={20} color="#FFF" />
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* How It Works */}
        {/* <Text style={styles.sectionTitle}>How It Works</Text>
        <View style={styles.stepsRow}>
          {[
            { icon: 'cart-outline', label: 'Select Items', color: '#E3F2FD' },
            { icon: 'knife', label: 'Choose Cut', color: '#E8F5E9' },
            { icon: 'package-variant-closed', label: 'We Pack', color: '#E8F5E9' },
            { icon: 'truck-delivery', label: 'Delivered!', color: '#FCE4EC' },
          ].map((step, i) => (
            <View key={i} style={[styles.stepCard, { backgroundColor: step.color }]}>
              <Icon name={step.icon as any} size={24} color={COLORS.text.primary} />
              <Text style={styles.stepLabel}>{step.label}</Text>
            </View>
          ))}
        </View> */}

        {/* Popular Items */}
        <Text style={[styles.sectionTitle, themed.textPrimary]}>Popular Items</Text>
        <View style={styles.popularGrid}>
          {popularProducts.map(item => (
            <TouchableOpacity
              key={item.id}
              style={[styles.productCard, { width: cardW }, themed.card]}
              activeOpacity={0.85}
              onPress={() => router.push({ pathname: '/product-detail', params: { id: item.id } })}
            >
              <View style={styles.productImageWrap}>
                <Image source={{ uri: item.image }} style={styles.productImage} resizeMode="cover" />
              </View>
              <View style={styles.productBody}>
                <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.productUnit}>{item.unit}</Text>
                <View style={styles.priceAddRow}>
                  <Text style={styles.productPrice}>{'\u20B9'}{item.price}</Text>
                  <AddToCartButton item={item} />
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Dish Pack Carousel */}
        <Text style={[styles.sectionTitle, themed.textPrimary]}>Quick Dish Packs</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.packsScroll}>
          {DISH_PACKS.slice(0, 5).map(pack => (
            <TouchableOpacity
              key={pack.id}
              style={[styles.packCard, { backgroundColor: pack.color }]}
              onPress={() => router.push({ pathname: '/dish-pack-detail', params: { id: pack.id } })}
              activeOpacity={0.85}
            >
              <Image source={{ uri: pack.image }} style={styles.packImage} resizeMode="cover" />
              <Text style={styles.packName}>{pack.name}</Text>
              <Text style={styles.packPrice}>{'\u20B9'}{pack.price}</Text>
              {pack.tag ? (
                <View style={styles.packTag}><Text style={styles.packTagText}>{pack.tag}</Text></View>
              ) : <View style={{ height: 8 }} />}
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Healthy Snacks Section */}
        <View style={styles.sectionBanner}>
          <LinearGradient colors={['#66BB6A', '#43A047']} style={styles.sectionBannerGrad}>
            <Icon name="food-apple-outline" size={28} color="#FFF" />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.sectionBannerTitle}>Healthy Snacks</Text>
              <Text style={styles.sectionBannerDesc}>Salads, juices & snacks for office, school & college</Text>
            </View>
            <TouchableOpacity onPress={() => router.push({ pathname: '/browse', params: { category: 'Healthy Snacks' } })}>
              <Text style={styles.sectionBannerLink}>View All</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}>
          {healthySnacks.map(item => (
            <TouchableOpacity key={item.id} style={[styles.miniCard, themed.card]} activeOpacity={0.85}
              onPress={() => router.push({ pathname: '/product-detail', params: { id: item.id } })}>
              <Image source={{ uri: item.image }} style={styles.miniImage} resizeMode="cover" />
              <View style={styles.miniBody}>
                <Text style={styles.miniName} numberOfLines={1}>{item.name}</Text>
                <View style={styles.miniPriceRow}>
                  <Text style={styles.miniPrice}>{'\u20B9'}{item.price}</Text>
                  <AddToCartButton item={item} />
                </View>
                {item.tags && item.tags[0] && (
                  <View style={styles.miniTag}><Text style={styles.miniTagText}>{item.tags[0]}</Text></View>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Diet Foods Section */}
        <View style={styles.sectionBanner}>
          <LinearGradient colors={['#42A5F5', '#1E88E5']} style={styles.sectionBannerGrad}>
            <Icon name="heart-pulse" size={28} color="#FFF" />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.sectionBannerTitle}>Diet Foods</Text>
              <Text style={styles.sectionBannerDesc}>Special foods for diabetes, asthma & heart health</Text>
            </View>
            <TouchableOpacity onPress={() => router.push({ pathname: '/browse', params: { category: 'Diet Foods' } })}>
              <Text style={styles.sectionBannerLink}>View All</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}>
          {dietFoods.map(item => (
            <TouchableOpacity key={item.id} style={[styles.miniCard, themed.card]} activeOpacity={0.85}
              onPress={() => router.push({ pathname: '/product-detail', params: { id: item.id } })}>
              <Image source={{ uri: item.image }} style={styles.miniImage} resizeMode="cover" />
              <View style={styles.miniBody}>
                <Text style={styles.miniName} numberOfLines={1}>{item.name}</Text>
                <View style={styles.miniPriceRow}>
                  <Text style={styles.miniPrice}>{'\u20B9'}{item.price}</Text>
                  <AddToCartButton item={item} />
                </View>
                {item.tags && item.tags[0] && (
                  <View style={[styles.miniTag, { backgroundColor: '#E3F2FD' }]}>
                    <Text style={[styles.miniTagText, { color: '#1565C0' }]}>{item.tags[0]}</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Sports & Gym Nutrition Section */}
        <View style={styles.sectionBanner}>
          <LinearGradient colors={['#EF5350', '#E53935']} style={styles.sectionBannerGrad}>
            <Icon name="dumbbell" size={28} color="#FFF" />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.sectionBannerTitle}>Sports & Gym Nutrition</Text>
              <Text style={styles.sectionBannerDesc}>Protein-rich foods for athletes & fitness enthusiasts</Text>
            </View>
            <TouchableOpacity onPress={() => router.push({ pathname: '/browse', params: { category: 'Sports Nutrition' } })}>
              <Text style={styles.sectionBannerLink}>View All</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}>
          {sportsFoods.map(item => (
            <TouchableOpacity key={item.id} style={[styles.miniCard, themed.card]} activeOpacity={0.85}
              onPress={() => router.push({ pathname: '/product-detail', params: { id: item.id } })}>
              <Image source={{ uri: item.image }} style={styles.miniImage} resizeMode="cover" />
              <View style={styles.miniBody}>
                <Text style={styles.miniName} numberOfLines={1}>{item.name}</Text>
                <View style={styles.miniPriceRow}>
                  <Text style={styles.miniPrice}>{'\u20B9'}{item.price}</Text>
                  <AddToCartButton item={item} />
                </View>
                {item.tags && item.tags[0] && (
                  <View style={[styles.miniTag, { backgroundColor: '#FCE4EC' }]}>
                    <Text style={[styles.miniTagText, { color: '#C62828' }]}>{item.tags[0]}</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  header: { paddingHorizontal: SPACING.base, paddingTop: SPACING.md, paddingBottom: SPACING.sm },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { fontSize: 22, fontWeight: '800', color: COLORS.text.primary },
  headerSub: { fontSize: 12, color: COLORS.text.secondary, marginTop: 2 },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  walletBtn: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.6)', borderRadius: 17, paddingRight: 8, gap: 2,
  },
  walletIcon: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  walletText: { fontSize: 12, fontWeight: '700', color: COLORS.text.primary },
  headerIconBtn: { width: 38, height: 38, justifyContent: 'center', alignItems: 'center', position: 'relative' },
  notifDot: { position: 'absolute', top: 6, right: 6, width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.primary },
  profileBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  profileIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.text.primary, alignItems: 'center', justifyContent: 'center' },
  profileIconImg: { width: 36, height: 36, borderRadius: 18 },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#FFF', borderRadius: RADIUS.lg,
    marginTop: SPACING.sm,
    paddingHorizontal: 14, paddingVertical: 10,
    ...SHADOW.sm,
  },
  scroll: { paddingBottom: 80 },
  offersSection: { marginTop: SPACING.sm, marginBottom: 4 },
  offerCard: {
    flexDirection: 'row', alignItems: 'center', borderRadius: RADIUS.lg,
    padding: SPACING.base, minHeight: 110,
  },
  offerTitle: { fontSize: 17, fontWeight: '800', color: '#FFF', marginBottom: 4 },
  offerDesc: { fontSize: 12, color: 'rgba(255,255,255,0.9)', lineHeight: 17 },
  offerBtn: {
    flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start',
    backgroundColor: '#FFF', borderRadius: RADIUS.full, paddingHorizontal: 14, paddingVertical: 6, gap: 4, marginTop: 10,
  },
  offerBtnText: { fontSize: 12, fontWeight: '700', color: COLORS.primary },
  offerIconWrap: { width: 60, height: 60, borderRadius: 30, backgroundColor: 'rgba(255,255,255,0.15)', justifyContent: 'center', alignItems: 'center', marginLeft: 12 },
  offerDots: { flexDirection: 'row', justifyContent: 'center', gap: 5, marginTop: 8 },
  offerDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.border },
  offerDotActive: { width: 20, backgroundColor: COLORS.primary },
  sectionTitle: {
    fontSize: 17, fontWeight: '800', color: COLORS.text.primary,
    marginHorizontal: SPACING.base, marginTop: SPACING.lg, marginBottom: SPACING.md,
  },
  categoryScroll: { paddingHorizontal: SPACING.base, gap: 10, paddingVertical: 4 },
  categoryCard: { width: 100, alignItems: 'center', borderRadius: RADIUS.lg, overflow: 'hidden', ...SHADOW.sm },
  categoryImage: { width: 100, height: 70 },
  categoryLabel: { fontSize: 11, fontWeight: '700', color: COLORS.text.primary, paddingVertical: 8, textAlign: 'center' },
  packsBanner: { marginHorizontal: SPACING.base, marginTop: SPACING.lg, borderRadius: RADIUS.lg, overflow: 'hidden' },
  packsGrad: { padding: SPACING.base },
  packsContent: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  packsTitle: { fontSize: 16, fontWeight: '800', color: '#FFF' },
  packsDesc: { fontSize: 12, color: 'rgba(255,255,255,0.9)', lineHeight: 17, marginTop: 2 },
  stepsRow: { flexDirection: 'row', paddingHorizontal: SPACING.base, gap: 8 },
  stepCard: { flex: 1, alignItems: 'center', paddingVertical: 14, borderRadius: RADIUS.md, gap: 6 },
  stepLabel: { fontSize: 10, fontWeight: '700', color: COLORS.text.primary, textAlign: 'center' },
  popularGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: SPACING.base, gap: 10, paddingBottom: 4 },
  productCard: { backgroundColor: '#FFF', borderRadius: RADIUS.lg, ...SHADOW.sm, overflow: 'hidden' },
  productImageWrap: { width: '100%', height: 100, overflow: 'hidden' },
  productImage: { width: '100%', height: '100%' },
  productBody: { padding: 8 },
  productName: { fontSize: 13, fontWeight: '700', color: COLORS.text.primary },
  productUnit: { fontSize: 11, color: COLORS.text.muted, marginBottom: 4 },
  productPrice: { fontSize: 15, fontWeight: '800', color: COLORS.text.primary },
  packsScroll: { paddingHorizontal: SPACING.base, gap: 10, paddingVertical: 4 },
  packCard: { width: 160, borderRadius: RADIUS.lg, overflow: 'hidden', ...SHADOW.sm },
  packImage: { width: 160, height: 100 },
  packName: { fontSize: 13, fontWeight: '700', color: COLORS.text.primary, textAlign: 'center', paddingHorizontal: 8, marginTop: 8 },
  packPrice: { fontSize: 15, fontWeight: '800', color: COLORS.primary, textAlign: 'center', marginTop: 4 },
  packTag: { backgroundColor: COLORS.primary, borderRadius: RADIUS.sm, paddingHorizontal: 8, paddingVertical: 3, marginTop: 6, alignSelf: 'center', marginBottom: 10 },
  packTagText: { fontSize: 10, fontWeight: '700', color: '#FFF' },
  sectionBanner: { marginHorizontal: SPACING.base, marginTop: SPACING.xl, borderRadius: RADIUS.lg, overflow: 'hidden' },
  sectionBannerGrad: { flexDirection: 'row', alignItems: 'center', padding: SPACING.base },
  sectionBannerTitle: { fontSize: 15, fontWeight: '800', color: '#FFF' },
  sectionBannerDesc: { fontSize: 11, color: 'rgba(255,255,255,0.85)', marginTop: 2 },
  sectionBannerLink: { fontSize: 12, fontWeight: '700', color: '#FFF', textDecorationLine: 'underline' },
  horizontalList: { paddingHorizontal: SPACING.base, gap: 10, paddingTop: SPACING.md, paddingBottom: 4 },
  miniCard: { width: 140, backgroundColor: '#FFF', borderRadius: RADIUS.lg, overflow: 'hidden', ...SHADOW.sm },
  miniImage: { width: 140, height: 90 },
  miniBody: { padding: 8 },
  miniName: { fontSize: 12, fontWeight: '700', color: COLORS.text.primary },
  miniPrice: { fontSize: 14, fontWeight: '800', color: COLORS.primary, marginTop: 2 },
  miniTag: { backgroundColor: '#E8F5E9', borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2, alignSelf: 'flex-start', marginTop: 4 },
  miniTagText: { fontSize: 9, fontWeight: '700', color: COLORS.green },
  miniPriceRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 2 },
  priceAddRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  addBtn: {
    backgroundColor: '#E8F5E9', borderRadius: 6, borderWidth: 1, borderColor: COLORS.primary,
    paddingHorizontal: 10, paddingVertical: 3,
  },
  addBtnText: { fontSize: 11, fontWeight: '800', color: COLORS.primary },
  qtyRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E8F5E9', borderRadius: 6, borderWidth: 1, borderColor: COLORS.primary },
  qtyBtn: { paddingHorizontal: 6, paddingVertical: 3 },
  qtyText: { fontSize: 12, fontWeight: '800', color: COLORS.primary, minWidth: 18, textAlign: 'center' },
});
