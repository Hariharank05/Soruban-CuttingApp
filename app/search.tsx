import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity,
  Image, StatusBar, ScrollView,
} from 'react-native';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';
import { COLORS, SPACING, RADIUS, SHADOW } from '@/src/utils/theme';
import { useThemedStyles } from '@/src/utils/useThemedStyles';
import { useCart } from '@/context/CartContext';
import productsData from '@/data/products.json';
import { SafeAreaView } from 'react-native-safe-area-context';

const RECENT_SEARCHES = ['Tomato', 'Carrot', 'Banana', 'Sambar Pack'];

const POPULAR_CATEGORIES = [
  { key: 'Vegetables', label: 'Vegetables', icon: 'leaf' as const, color: '#E8F5E9' },
  { key: 'Fruits', label: 'Fruits', icon: 'food-apple' as const, color: '#E8F5E9' },
  { key: 'Healthy Snacks', label: 'Healthy Snacks', icon: 'food-variant' as const, color: '#E8F5E9' },
  { key: 'Diet Foods', label: 'Diet Foods', icon: 'heart-pulse' as const, color: '#E3F2FD' },
  { key: 'Sports Nutrition', label: 'Sports & Gym', icon: 'dumbbell' as const, color: '#FCE4EC' },
];

export default function SearchScreen() {
  const router = useRouter();
  const { addToCart, cartItems, updateQuantity } = useCart();
  const themed = useThemedStyles();
  const [query, setQuery] = useState('');
  const inputRef = useRef<TextInput>(null);

  const results = query.length > 0
    ? productsData.filter(p => p.name.toLowerCase().includes(query.toLowerCase()))
    : [];

  const renderProduct = ({ item }: { item: any }) => {
    const cartItem = cartItems.find(i => i.id === item.id);
    const qty = cartItem?.quantity || 0;

    return (
      <TouchableOpacity
        style={[styles.productRow, themed.card]}
        onPress={() => router.push({ pathname: '/product-detail', params: { id: item.id } })}
      >
        <Image source={{ uri: item.image }} style={styles.productImage} />
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{item.name}</Text>
          <Text style={styles.productUnit}>{item.unit}</Text>
          <Text style={styles.productPrice}>{'\u20B9'}{item.price}</Text>
        </View>
        {qty === 0 ? (
          <TouchableOpacity style={styles.addBtn} onPress={() => addToCart(item, 1)}>
            <Text style={styles.addBtnText}>ADD</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.qtyControl}>
            <TouchableOpacity onPress={() => updateQuantity(item.id, qty - 1)}>
              <Icon name="minus" size={14} color="#FFF" />
            </TouchableOpacity>
            <Text style={styles.qtyText}>{qty}</Text>
            <TouchableOpacity onPress={() => addToCart(item, 1)}>
              <Icon name="plus" size={14} color="#FFF" />
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.safe, themed.safeArea]} edges={['bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      {/* Search Header */}
      <View style={[styles.header, themed.card]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.back}>
          <Icon name="arrow-left" size={24} color={COLORS.text.primary} />
        </TouchableOpacity>
        <View style={styles.searchBar}>
          <Icon name="magnify" size={20} color={COLORS.text.muted} />
          <TextInput
            ref={inputRef}
            style={styles.searchInput}
            placeholder="Search for vegetables, fruits..."
            placeholderTextColor={COLORS.text.muted}
            value={query}
            onChangeText={setQuery}
            autoFocus
            returnKeyType="search"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <Icon name="close-circle" size={18} color={COLORS.text.muted} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {query.length === 0 ? (
        <ScrollView contentContainerStyle={styles.content}>
          {/* Recent Searches */}
          <Text style={[styles.sectionTitle, themed.textPrimary]}>Recent Searches</Text>
          <View style={styles.chipsRow}>
            {RECENT_SEARCHES.map(term => (
              <TouchableOpacity key={term} style={styles.chip} onPress={() => setQuery(term)}>
                <Icon name="history" size={14} color={COLORS.text.muted} />
                <Text style={styles.chipText}>{term}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Popular Categories */}
          <Text style={[styles.sectionTitle, themed.textPrimary]}>Popular Categories</Text>
          <View style={styles.catGrid}>
            {POPULAR_CATEGORIES.map(cat => (
              <TouchableOpacity
                key={cat.key}
                style={styles.catCard}
                onPress={() => router.push({ pathname: '/browse', params: { category: cat.key } })}
              >
                <View style={[styles.catIconWrap, { backgroundColor: cat.color }]}>
                  <Icon name={cat.icon} size={24} color={COLORS.primary} />
                </View>
                <Text style={styles.catName} numberOfLines={2}>{cat.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      ) : results.length === 0 ? (
        <View style={styles.noResults}>
          <Icon name="magnify" size={48} color={COLORS.text.muted} />
          <Text style={styles.noResultsTitle}>No results for "{query}"</Text>
          <Text style={styles.noResultsSub}>Try a different search term</Text>
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={item => item.id}
          renderItem={renderProduct}
          contentContainerStyle={{ padding: SPACING.base }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF',
    paddingHorizontal: SPACING.base, paddingVertical: SPACING.sm,
    paddingTop: 44,
    borderBottomWidth: 0.5, borderBottomColor: '#E0E0E0',
  },
  back: { marginRight: SPACING.sm },
  searchBar: {
    flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: COLORS.background, borderRadius: RADIUS.full,
    paddingHorizontal: 12, paddingVertical: 8,
  },
  searchInput: { flex: 1, fontSize: 15, color: COLORS.text.primary },
  content: { padding: SPACING.base },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: COLORS.text.primary, marginBottom: 12 },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: SPACING.xl },
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#FFF', borderRadius: RADIUS.full,
    paddingHorizontal: 12, paddingVertical: 8,
    borderWidth: 1, borderColor: COLORS.border,
  },
  chipText: { fontSize: 13, color: COLORS.text.secondary },
  catGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  catCard: { width: '23%', alignItems: 'center', paddingVertical: 8 },
  catIconWrap: {
    width: 52, height: 52, borderRadius: RADIUS.lg,
    alignItems: 'center', justifyContent: 'center', marginBottom: 6,
  },
  catName: { fontSize: 10, fontWeight: '600', color: COLORS.text.secondary, textAlign: 'center' },
  noResults: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  noResultsTitle: { fontSize: 18, fontWeight: '700', color: COLORS.text.primary, marginTop: 12 },
  noResultsSub: { fontSize: 14, color: COLORS.text.muted },
  productRow: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF',
    borderRadius: RADIUS.lg, padding: SPACING.md, marginBottom: 8,
    ...SHADOW.sm,
  },
  productImage: { width: 56, height: 56, borderRadius: RADIUS.md },
  productInfo: { flex: 1, marginLeft: 12 },
  productName: { fontSize: 14, fontWeight: '700', color: COLORS.text.primary },
  productUnit: { fontSize: 11, color: COLORS.text.muted },
  productPrice: { fontSize: 14, fontWeight: '700', color: COLORS.text.primary },
  addBtn: {
    borderWidth: 1.5, borderColor: COLORS.primary, borderRadius: RADIUS.sm,
    paddingHorizontal: 14, paddingVertical: 6,
  },
  addBtnText: { fontSize: 12, fontWeight: '800', color: COLORS.primary },
  qtyControl: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: COLORS.primary, borderRadius: RADIUS.sm,
    paddingHorizontal: 8, paddingVertical: 6,
  },
  qtyText: { fontSize: 14, fontWeight: '700', color: '#FFF' },
});
