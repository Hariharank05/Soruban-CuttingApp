import React, { useMemo } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Image, useWindowDimensions, StatusBar,
} from 'react-native';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, RADIUS, SHADOW } from '@/src/utils/theme';
import { DISH_PACKS } from '@/data/dishPacks';
import productsData from '@/data/products.json';

const CATEGORIES = [
  { key: 'Vegetables', label: 'Vegetables', image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=200&q=80', color: '#E8F5E9' },
  { key: 'Fruits', label: 'Fruits', image: 'https://images.unsplash.com/photo-1564093497595-593b96d80f38?auto=format&fit=crop&w=200&q=80', color: '#FFF3E0' },
  { key: 'Healthy Snacks', label: 'Healthy Snacks', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=200&q=80', color: '#E8F5E9' },
  { key: 'Diet Foods', label: 'Diet Foods', image: 'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?auto=format&fit=crop&w=200&q=80', color: '#E3F2FD' },
  { key: 'Sports Nutrition', label: 'Sports & Gym', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=200&q=80', color: '#FCE4EC' },
];

const POPULAR_IDS = ['1', '4', '13', '7', '19', '22', '11', '23'];

export default function HomeScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();

  const popularProducts = useMemo(() => productsData.filter(p => POPULAR_IDS.includes(p.id)), []);
  const healthySnacks = useMemo(() => productsData.filter(p => p.category === 'Healthy Snacks').slice(0, 6), []);
  const dietFoods = useMemo(() => productsData.filter(p => p.category === 'Diet Foods').slice(0, 6), []);
  const sportsFoods = useMemo(() => productsData.filter(p => p.category === 'Sports Nutrition').slice(0, 6), []);
  const cardW = (width - SPACING.base * 2 - 10) / 2;

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      <LinearGradient colors={COLORS.gradient.header} style={styles.header}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerTitle}>Cut & Ready</Text>
            <Text style={styles.headerSub}>Fresh cut, ready to cook!</Text>
          </View>
          <TouchableOpacity style={styles.profileBtn}>
            <Icon name="account-circle" size={32} color={COLORS.text.primary} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Hero Banner */}
        <View style={styles.heroBanner}>
          <LinearGradient colors={COLORS.gradient.hero} style={styles.heroGrad}>
            <Text style={styles.heroTitle}>Fresh Cut Vegetables & Fruits</Text>
            <Text style={styles.heroDesc}>
              Select your veggies, choose how you want them cut, and we deliver them ready for your kitchen!
            </Text>
            <TouchableOpacity
              style={styles.heroBtn}
              onPress={() => router.push({ pathname: '/browse', params: { category: 'Vegetables' } })}
            >
              <Text style={styles.heroBtnText}>Order Now</Text>
              <Icon name="chevron-right" size={16} color={COLORS.primary} />
            </TouchableOpacity>
          </LinearGradient>
        </View>

        {/* Categories */}
        <Text style={styles.sectionTitle}>Shop by Category</Text>
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
            { icon: 'content-cut', label: 'Choose Cut', color: '#FFF3E0' },
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
        <Text style={styles.sectionTitle}>Popular Items</Text>
        <View style={styles.popularGrid}>
          {popularProducts.map(item => (
            <TouchableOpacity
              key={item.id}
              style={[styles.productCard, { width: cardW }]}
              activeOpacity={0.85}
              onPress={() => router.push({ pathname: '/product-detail', params: { id: item.id } })}
            >
              <View style={styles.productImageWrap}>
                <Image source={{ uri: item.image }} style={styles.productImage} resizeMode="cover" />
              </View>
              <View style={styles.productBody}>
                <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.productUnit}>{item.unit}</Text>
                <Text style={styles.productPrice}>{'\u20B9'}{item.price}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Dish Pack Carousel */}
        <Text style={styles.sectionTitle}>Quick Dish Packs</Text>
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
            <TouchableOpacity key={item.id} style={styles.miniCard} activeOpacity={0.85}
              onPress={() => router.push({ pathname: '/product-detail', params: { id: item.id } })}>
              <Image source={{ uri: item.image }} style={styles.miniImage} resizeMode="cover" />
              <View style={styles.miniBody}>
                <Text style={styles.miniName} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.miniPrice}>{'\u20B9'}{item.price}</Text>
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
            <TouchableOpacity key={item.id} style={styles.miniCard} activeOpacity={0.85}
              onPress={() => router.push({ pathname: '/product-detail', params: { id: item.id } })}>
              <Image source={{ uri: item.image }} style={styles.miniImage} resizeMode="cover" />
              <View style={styles.miniBody}>
                <Text style={styles.miniName} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.miniPrice}>{'\u20B9'}{item.price}</Text>
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
            <TouchableOpacity key={item.id} style={styles.miniCard} activeOpacity={0.85}
              onPress={() => router.push({ pathname: '/product-detail', params: { id: item.id } })}>
              <Image source={{ uri: item.image }} style={styles.miniImage} resizeMode="cover" />
              <View style={styles.miniBody}>
                <Text style={styles.miniName} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.miniPrice}>{'\u20B9'}{item.price}</Text>
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
  header: { paddingHorizontal: SPACING.base, paddingVertical: SPACING.md },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { fontSize: 22, fontWeight: '800', color: COLORS.text.primary },
  headerSub: { fontSize: 12, color: COLORS.text.secondary, marginTop: 2 },
  profileBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  scroll: { paddingBottom: 20 },
  heroBanner: { marginHorizontal: SPACING.base, marginTop: SPACING.sm, borderRadius: RADIUS.lg, overflow: 'hidden' },
  heroGrad: { padding: SPACING.base },
  heroTitle: { fontSize: 18, fontWeight: '800', color: '#FFF', marginBottom: 6 },
  heroDesc: { fontSize: 13, color: 'rgba(255,255,255,0.9)', lineHeight: 18, marginBottom: 12 },
  heroBtn: {
    flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start',
    backgroundColor: '#FFF', borderRadius: RADIUS.full, paddingHorizontal: 16, paddingVertical: 8, gap: 4,
  },
  heroBtnText: { fontSize: 13, fontWeight: '700', color: COLORS.primary },
  sectionTitle: {
    fontSize: 17, fontWeight: '800', color: COLORS.text.primary,
    marginHorizontal: SPACING.base, marginTop: SPACING.lg, marginBottom: SPACING.md,
  },
  categoryScroll: { paddingHorizontal: SPACING.base, gap: 10 },
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
  popularGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: SPACING.base, gap: 10 },
  productCard: { backgroundColor: '#FFF', borderRadius: RADIUS.lg, ...SHADOW.sm, overflow: 'hidden' },
  productImageWrap: { width: '100%', height: 100, overflow: 'hidden' },
  productImage: { width: '100%', height: '100%' },
  productBody: { padding: 8 },
  productName: { fontSize: 13, fontWeight: '700', color: COLORS.text.primary },
  productUnit: { fontSize: 11, color: COLORS.text.muted, marginBottom: 4 },
  productPrice: { fontSize: 15, fontWeight: '800', color: COLORS.text.primary },
  packsScroll: { paddingHorizontal: SPACING.base, gap: 10 },
  packCard: { width: 130, borderRadius: RADIUS.lg, overflow: 'hidden', ...SHADOW.sm },
  packImage: { width: 130, height: 80 },
  packName: { fontSize: 12, fontWeight: '700', color: COLORS.text.primary, textAlign: 'center', paddingHorizontal: 6, marginTop: 6 },
  packPrice: { fontSize: 14, fontWeight: '800', color: COLORS.primary, textAlign: 'center', marginTop: 4 },
  packTag: { backgroundColor: COLORS.primary, borderRadius: RADIUS.sm, paddingHorizontal: 6, paddingVertical: 2, marginTop: 6, alignSelf: 'center', marginBottom: 8 },
  packTagText: { fontSize: 9, fontWeight: '700', color: '#FFF' },
  sectionBanner: { marginHorizontal: SPACING.base, marginTop: SPACING.xl, borderRadius: RADIUS.lg, overflow: 'hidden' },
  sectionBannerGrad: { flexDirection: 'row', alignItems: 'center', padding: SPACING.base },
  sectionBannerTitle: { fontSize: 15, fontWeight: '800', color: '#FFF' },
  sectionBannerDesc: { fontSize: 11, color: 'rgba(255,255,255,0.85)', marginTop: 2 },
  sectionBannerLink: { fontSize: 12, fontWeight: '700', color: '#FFF', textDecorationLine: 'underline' },
  horizontalList: { paddingHorizontal: SPACING.base, gap: 10, paddingTop: SPACING.md },
  miniCard: { width: 140, backgroundColor: '#FFF', borderRadius: RADIUS.lg, overflow: 'hidden', ...SHADOW.sm },
  miniImage: { width: 140, height: 90 },
  miniBody: { padding: 8 },
  miniName: { fontSize: 12, fontWeight: '700', color: COLORS.text.primary },
  miniPrice: { fontSize: 14, fontWeight: '800', color: COLORS.primary, marginTop: 2 },
  miniTag: { backgroundColor: '#E8F5E9', borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2, alignSelf: 'flex-start', marginTop: 4 },
  miniTagText: { fontSize: 9, fontWeight: '700', color: COLORS.green },
});
