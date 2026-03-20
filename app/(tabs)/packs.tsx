import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, StatusBar, Alert } from 'react-native';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, RADIUS, SHADOW } from '@/src/utils/theme';
import { useScrollContext } from '@/context/ScrollContext';
import { DISH_PACKS } from '@/data/dishPacks';
import productsData from '@/data/products.json';
import { useThemedStyles } from '@/src/utils/useThemedStyles';
import { useSavedCarts } from '@/context/SavedCartContext';
import { useCart } from '@/context/CartContext';

type FilterType = 'all' | 'veg' | 'fruit';
const FRUIT_PACK_IDS = ['pack_fruit_salad', 'pack_fruit_juice'];

export default function PacksScreen() {
  const router = useRouter();
  const { handleScroll } = useScrollContext();
  const [filter, setFilter] = useState<FilterType>('all');
  const themed = useThemedStyles();
  const { customPacks, deleteCustomPack, updateCustomPackLastOrdered } = useSavedCarts();
  const { addToCart } = useCart();

  const packs = useMemo(() => {
    if (filter === 'all') return DISH_PACKS;
    if (filter === 'fruit') return DISH_PACKS.filter(p => FRUIT_PACK_IDS.includes(p.id));
    return DISH_PACKS.filter(p => !FRUIT_PACK_IDS.includes(p.id));
  }, [filter]);

  const getPackImages = (pack: typeof DISH_PACKS[0]) =>
    pack.items.slice(0, 4).map(item => productsData.find(p => p.id === item.productId)?.image ?? '').filter(Boolean);

  const renderPack = ({ item }: { item: typeof DISH_PACKS[0] }) => {
    const images = getPackImages(item);
    return (
      <TouchableOpacity
        style={[styles.packCard, { backgroundColor: item.color }]}
        activeOpacity={0.85}
        onPress={() => router.push({ pathname: '/dish-pack-detail', params: { id: item.id } })}
      >
        <View style={styles.packHeader}>
          <Image source={{ uri: item.image }} style={styles.packImage} resizeMode="cover" />
          <View style={{ flex: 1 }}>
            <View style={styles.packNameRow}>
              <Text style={[styles.packName, themed.textPrimary]}>{item.name}</Text>
              {item.tag && <View style={styles.tagBadge}><Text style={styles.tagText}>{item.tag}</Text></View>}
            </View>
            <Text style={styles.packDesc}>{item.description}</Text>
            {item.regionalVariants && item.regionalVariants.length > 0 && (
              <Text style={styles.variantsHint}>{item.regionalVariants.length} regional styles available</Text>
            )}
          </View>
        </View>
        <View style={styles.thumbRow}>
          {images.map((img, i) => (
            <View key={i} style={styles.thumbWrap}>
              <Image source={{ uri: img }} style={styles.thumbImg} resizeMode="cover" />
            </View>
          ))}
          {item.items.length > 4 && (
            <View style={styles.thumbMore}><Text style={styles.thumbMoreText}>+{item.items.length - 4}</Text></View>
          )}
        </View>
        <View style={styles.packFooter}>
          <View>
            <Text style={[styles.packPrice, themed.textPrimary]}>{'\u20B9'}{item.price}</Text>
            <Text style={styles.packServes}>{item.items.length} items | Choose your cut style</Text>
          </View>
          <View style={styles.viewBtn}>
            <Text style={styles.viewBtnText}>View Pack</Text>
            <Icon name="chevron-right" size={16} color={COLORS.green} />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.safe, themed.safeArea]} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <LinearGradient colors={themed.headerGradient} style={styles.header}>
        <Text style={[styles.headerTitle, themed.textPrimary]}>Dish Packs</Text>
        <Text style={styles.headerSub}>Pre-cut veggie packs for your favorite dishes</Text>
      </LinearGradient>

      {/* Filter Chips — fixed */}
      <View style={styles.filterRow}>
        {([
          { key: 'all' as FilterType, label: 'All Packs' },
          { key: 'veg' as FilterType, label: 'Veg Dishes' },
          { key: 'fruit' as FilterType, label: 'Fruit Packs' },
        ]).map(f => (
          <TouchableOpacity key={f.key} style={[styles.filterChip, filter === f.key && styles.filterChipActive]} onPress={() => setFilter(f.key)}>
            <Text style={[styles.filterChipText, filter === f.key && styles.filterChipTextActive]}>{f.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={packs}
        keyExtractor={i => i.id}
        renderItem={renderPack}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        ListHeaderComponent={
          <View>
            {/* Create Pack Banner */}
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => router.push('/create-pack' as any)}
              style={styles.heroBanner}
            >
              <LinearGradient colors={['#43A047', '#66BB6A']} style={styles.createPackGrad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                <View style={styles.createPackContent}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.createPackTitle}>Create Your Pack</Text>
                    <Text style={styles.createPackDesc}>Build a custom veggie pack with your own selection of items & cut styles</Text>
                  </View>
                  <View style={styles.createPackIconWrap}>
                    <Icon name="plus-circle-outline" size={36} color="#FFF" />
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>

            {/* My Templates */}
            {customPacks.length > 0 && (
              <View style={styles.templateSection}>
                <View style={styles.templateHeader}>
                  <View style={styles.templateTitleRow}>
                    <Icon name="package-variant" size={18} color={COLORS.green} />
                    <Text style={[styles.templateTitle, themed.textPrimary]}>My Templates</Text>
                  </View>
                  <View style={styles.templateBadge}>
                    <Text style={styles.templateBadgeText}>{customPacks.length}</Text>
                  </View>
                </View>
                {customPacks.map(item => {
                  const itemNames = item.items.slice(0, 3).map(pi => {
                    const prod = productsData.find(p => p.id === pi.productId);
                    return prod?.name ?? 'Item';
                  });
                  return (
                    <View key={item.id} style={[styles.templateCard, themed.card]}>
                      <View style={styles.templateCardRow}>
                        <View style={styles.templateIconWrap}>
                          <Icon name="food-variant" size={20} color={COLORS.green} />
                        </View>
                        <View style={styles.templateInfo}>
                          <Text style={[styles.templateName, themed.textPrimary]} numberOfLines={1}>{item.name}</Text>
                          <Text style={styles.templateItems} numberOfLines={1}>
                            {itemNames.join(', ')}{item.items.length > 3 ? ` +${item.items.length - 3} more` : ''}
                          </Text>
                        </View>
                        <View style={styles.templateCardActions}>
                          <TouchableOpacity
                            style={styles.templateReorderBtn}
                            activeOpacity={0.8}
                            onPress={() => {
                              item.items.forEach(pi => {
                                const prod = productsData.find(p => p.id === pi.productId);
                                if (prod) addToCart(prod as any, pi.quantity, undefined, pi.cutType);
                              });
                              updateCustomPackLastOrdered(item.id);
                              Alert.alert('Added to Cart', `${item.name} items added to your cart`);
                            }}
                          >
                            <Icon name="cart-plus" size={14} color="#FFF" />
                            <Text style={styles.templateReorderText}>Add</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={styles.templateDeleteBtn}
                            activeOpacity={0.7}
                            onPress={() => {
                              Alert.alert('Delete Template', `Remove "${item.name}"?`, [
                                { text: 'Cancel', style: 'cancel' },
                                { text: 'Delete', style: 'destructive', onPress: () => deleteCustomPack(item.id) },
                              ]);
                            }}
                          >
                            <Icon name="delete-outline" size={16} color="#E53935" />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  );
                })}
              </View>
            )}
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  header: { paddingHorizontal: SPACING.base, paddingVertical: SPACING.md },
  headerTitle: { fontSize: 20, fontWeight: '800', color: COLORS.text.primary },
  headerSub: { fontSize: 12, color: COLORS.text.secondary, marginTop: 2 },
  heroBanner: { marginBottom: SPACING.sm, borderRadius: RADIUS.lg, overflow: 'hidden' },
  heroGrad: { padding: SPACING.base },
  heroTitle: { fontSize: 17, fontWeight: '800', color: '#FFF', marginBottom: 4 },
  heroDesc: { fontSize: 12, color: 'rgba(255,255,255,0.9)', lineHeight: 17 },
  filterRow: { flexDirection: 'row', paddingHorizontal: SPACING.base, marginTop: SPACING.sm, marginBottom: SPACING.sm, gap: 8 },
  filterChip: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: RADIUS.full, borderWidth: 1.5, borderColor: COLORS.border, backgroundColor: '#FFF' },
  filterChipActive: { borderColor: COLORS.green, backgroundColor: '#EAF7EB' },
  filterChipText: { fontSize: 13, fontWeight: '700', color: COLORS.text.secondary },
  filterChipTextActive: { color: COLORS.green },
  createPackCard: { marginHorizontal: SPACING.base, marginBottom: SPACING.sm, borderRadius: RADIUS.xl, overflow: 'hidden', ...SHADOW.sm },
  createPackGrad: { padding: SPACING.base },
  createPackContent: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  createPackTitle: { fontSize: 17, fontWeight: '800', color: '#FFF', marginBottom: 4 },
  createPackDesc: { fontSize: 12, color: 'rgba(255,255,255,0.9)', lineHeight: 17 },
  createPackIconWrap: { width: 52, height: 52, borderRadius: 26, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  templateSection: { marginTop: 12, marginBottom: SPACING.sm },
  templateHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.sm },
  templateTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  templateTitle: { fontSize: 16, fontWeight: '800', color: COLORS.text.primary },
  templateBadge: { backgroundColor: COLORS.green, borderRadius: 10, minWidth: 20, height: 20, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 6 },
  templateBadgeText: { fontSize: 11, fontWeight: '700', color: '#FFF' },
  templateCard: { backgroundColor: '#FFF', borderRadius: RADIUS.lg, padding: 10, marginBottom: 8, ...SHADOW.sm },
  templateCardRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  templateIconWrap: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#EAF7EB', justifyContent: 'center', alignItems: 'center' },
  templateInfo: { flex: 1 },
  templateName: { fontSize: 13, fontWeight: '700', color: COLORS.text.primary },
  templateItems: { fontSize: 11, color: COLORS.text.secondary, lineHeight: 15, marginTop: 1 },
  templateCardActions: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  templateReorderBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: COLORS.green, borderRadius: RADIUS.full, paddingVertical: 6, paddingHorizontal: 10 },
  templateReorderText: { fontSize: 11, fontWeight: '700', color: '#FFF' },
  templateDeleteBtn: { padding: 6 },
  list: { paddingHorizontal: SPACING.base, paddingBottom: 40 },
  packCard: { borderRadius: RADIUS.xl, padding: SPACING.base, marginBottom: SPACING.md, ...SHADOW.sm },
  packHeader: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  packImage: { width: 56, height: 56, borderRadius: RADIUS.lg },
  packNameRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 2 },
  packName: { fontSize: 17, fontWeight: '800', color: COLORS.text.primary },
  tagBadge: { backgroundColor: COLORS.green, borderRadius: RADIUS.sm, paddingHorizontal: 8, paddingVertical: 2 },
  tagText: { fontSize: 10, fontWeight: '700', color: '#FFF' },
  packDesc: { fontSize: 12, color: COLORS.text.secondary, lineHeight: 17 },
  variantsHint: { fontSize: 11, fontWeight: '600', color: COLORS.primary, marginTop: 4 },
  thumbRow: { flexDirection: 'row', gap: 6, marginBottom: 12 },
  thumbWrap: { width: 48, height: 48, borderRadius: RADIUS.md, overflow: 'hidden', borderWidth: 2, borderColor: '#FFF' },
  thumbImg: { width: '100%', height: '100%' },
  thumbMore: { width: 48, height: 48, borderRadius: RADIUS.md, backgroundColor: 'rgba(0,0,0,0.06)', justifyContent: 'center', alignItems: 'center' },
  thumbMoreText: { fontSize: 13, fontWeight: '700', color: COLORS.text.secondary },
  packFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  packPrice: { fontSize: 18, fontWeight: '800', color: COLORS.text.primary },
  packServes: { fontSize: 11, color: COLORS.text.muted, marginTop: 1 },
  viewBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, borderWidth: 1.5, borderColor: COLORS.green, borderRadius: RADIUS.full, paddingVertical: 8, paddingHorizontal: 16 },
  viewBtnText: { fontSize: 13, fontWeight: '700', color: COLORS.green },
});
