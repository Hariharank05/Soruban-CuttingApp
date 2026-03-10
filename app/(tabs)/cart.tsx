import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, StatusBar } from 'react-native';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, RADIUS, SHADOW } from '@/src/utils/theme';
import { useCart } from '@/context/CartContext';
import { useScrollContext } from '@/context/ScrollContext';
import { getCutLabel, getCutFee } from '@/data/cutTypes';
import { useThemedStyles } from '@/src/utils/useThemedStyles';

export default function CartScreen() {
  const router = useRouter();
  const { cartItems, updateQuantity, removeFromCart, getSubtotal, getCuttingTotal, getItemCount } = useCart();
  const { handleScroll } = useScrollContext();
  const themed = useThemedStyles();

  const subtotal = getSubtotal();
  const cuttingTotal = getCuttingTotal();
  const deliveryFee = subtotal > 0 ? 25 : 0;
  const total = subtotal + deliveryFee;

  const calcItemPrice = (item: typeof cartItems[0]) => {
    let base = item.price;
    if (item.selectedWeight && item.unit.includes('kg')) base = Math.round((item.price * item.selectedWeight) / 1000);
    return base * item.quantity + getCutFee(item.cutType) * item.quantity;
  };

  const getWeightLabel = (item: typeof cartItems[0]) => {
    if (!item.selectedWeight) return item.unit;
    return item.selectedWeight >= 1000 ? `${item.selectedWeight / 1000} kg` : `${item.selectedWeight}g`;
  };

  const renderItem = ({ item }: { item: typeof cartItems[0] }) => (
    <View style={[styles.itemCard, themed.card]}>
      <View style={styles.itemImageWrap}>
        <Image source={{ uri: item.image }} style={styles.itemImage} resizeMode="cover" />
      </View>
      <View style={styles.itemBody}>
        <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.itemUnit}>{getWeightLabel(item)}</Text>
        {item.cutType && (
          <View style={styles.cutBadge}>
            <Text style={styles.cutBadgeText}>{getCutLabel(item.cutType)} (+{'\u20B9'}{getCutFee(item.cutType)})</Text>
          </View>
        )}
        {item.specialInstructions ? <Text style={styles.instructions} numberOfLines={1}>{'\uD83D\uDCDD'} {item.specialInstructions}</Text> : null}
        <View style={styles.itemBottom}>
          <Text style={styles.itemPrice}>{'\u20B9'}{calcItemPrice(item)}</Text>
          <View style={styles.qtyRow}>
            <TouchableOpacity style={styles.qtyBtn} onPress={() => updateQuantity(item.id, item.quantity - 1)}>
              <Icon name="minus" size={14} color={COLORS.primary} />
            </TouchableOpacity>
            <Text style={styles.qtyText}>{item.quantity}</Text>
            <TouchableOpacity style={styles.qtyBtn} onPress={() => updateQuantity(item.id, item.quantity + 1)}>
              <Icon name="plus" size={14} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <TouchableOpacity style={styles.removeBtn} onPress={() => removeFromCart(item.id)}>
        <Icon name="delete-outline" size={18} color={COLORS.status.error} />
      </TouchableOpacity>
    </View>
  );

  if (cartItems.length === 0) {
    return (
      <SafeAreaView style={[styles.safe, themed.safeArea]} edges={['top', 'bottom']}>
        <StatusBar barStyle="dark-content" />
        <LinearGradient colors={themed.headerGradient} style={styles.header}><Text style={[styles.headerTitle, themed.textPrimary]}>{'\uD83D\uDED2'} Your Cart</Text></LinearGradient>
        <View style={styles.emptyContainer}>
          <Icon name="cart-outline" size={64} color={COLORS.text.muted} />
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptyDesc}>Add fresh-cut vegetables & fruits to get started</Text>
          <TouchableOpacity style={styles.emptyBtn} onPress={() => router.push({ pathname: '/browse', params: { category: 'Vegetables' } })}>
            <Text style={styles.emptyBtnText}>Browse Items</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safe, themed.safeArea]} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" />
      <LinearGradient colors={themed.headerGradient} style={styles.header}><Text style={[styles.headerTitle, themed.textPrimary]}>{'\uD83D\uDED2'} Your Cart ({getItemCount()} items)</Text></LinearGradient>
      <FlatList
        data={cartItems} keyExtractor={(item, idx) => `${item.id}_${idx}`} renderItem={renderItem}
        contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}
        onScroll={handleScroll} scrollEventThrottle={16}
        ListFooterComponent={
          <View style={[styles.billCard, themed.card]}>
            <Text style={[styles.billTitle, themed.textPrimary]}>Bill Summary</Text>
            <View style={styles.billRow}><Text style={styles.billLabel}>Items Total</Text><Text style={styles.billValue}>{'\u20B9'}{subtotal - cuttingTotal}</Text></View>
            {cuttingTotal > 0 && <View style={styles.billRow}><Text style={styles.billLabel}>{'\uD83D\uDD2A'} Cutting Charges</Text><Text style={[styles.billValue, { color: COLORS.primary }]}>{'\u20B9'}{cuttingTotal}</Text></View>}
            <View style={styles.billRow}><Text style={styles.billLabel}>Delivery Fee</Text><Text style={styles.billValue}>{'\u20B9'}{deliveryFee}</Text></View>
            <View style={[styles.billRow, styles.billTotal]}><Text style={styles.billTotalLabel}>Total</Text><Text style={styles.billTotalValue}>{'\u20B9'}{total}</Text></View>
          </View>
        }
      />
      <View style={[styles.checkoutBar, themed.card]}>
        <View>
          <Text style={[styles.checkoutTotal, themed.textPrimary]}>{'\u20B9'}{total}</Text>
          <Text style={styles.checkoutSub}>incl. cutting charges</Text>
        </View>
        <TouchableOpacity style={styles.checkoutBtn} onPress={() => router.push('/checkout')}>
          <Text style={styles.checkoutBtnText}>Proceed to Checkout</Text>
          <Icon name="chevron-right" size={18} color="#FFF" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  header: { paddingHorizontal: SPACING.base, paddingVertical: SPACING.md },
  headerTitle: { fontSize: 20, fontWeight: '800', color: COLORS.text.primary },
  list: { paddingHorizontal: SPACING.base, paddingTop: SPACING.sm, paddingBottom: 20 },
  itemCard: { flexDirection: 'row', backgroundColor: '#FFF', borderRadius: RADIUS.lg, padding: SPACING.md, marginBottom: SPACING.sm, ...SHADOW.sm },
  itemImageWrap: { width: 60, height: 60, borderRadius: RADIUS.md, overflow: 'hidden' },
  itemImage: { width: '100%', height: '100%' },
  itemBody: { flex: 1, marginLeft: SPACING.md },
  itemName: { fontSize: 14, fontWeight: '700', color: COLORS.text.primary },
  itemUnit: { fontSize: 11, color: COLORS.text.muted, marginTop: 1 },
  cutBadge: { alignSelf: 'flex-start', backgroundColor: '#E8F5E9', borderRadius: RADIUS.sm, paddingHorizontal: 6, paddingVertical: 2, marginTop: 4, borderWidth: 1, borderColor: '#A5D6A7' },
  cutBadgeText: { fontSize: 10, fontWeight: '600', color: '#4CAF50' },
  instructions: { fontSize: 10, color: COLORS.text.muted, marginTop: 3 },
  itemBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 },
  itemPrice: { fontSize: 15, fontWeight: '800', color: COLORS.text.primary },
  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  qtyBtn: { width: 28, height: 28, borderRadius: 14, borderWidth: 1.5, borderColor: COLORS.primary, justifyContent: 'center', alignItems: 'center' },
  qtyText: { fontSize: 14, fontWeight: '700', color: COLORS.text.primary, minWidth: 20, textAlign: 'center' },
  removeBtn: { padding: 4 },
  billCard: { backgroundColor: '#FFF', borderRadius: RADIUS.lg, padding: SPACING.base, marginTop: SPACING.md, ...SHADOW.sm },
  billTitle: { fontSize: 15, fontWeight: '800', color: COLORS.text.primary, marginBottom: SPACING.md },
  billRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  billLabel: { fontSize: 13, color: COLORS.text.secondary },
  billValue: { fontSize: 13, fontWeight: '600', color: COLORS.text.primary },
  billTotal: { borderTopWidth: 1, borderTopColor: COLORS.border, marginTop: 6, paddingTop: 10 },
  billTotalLabel: { fontSize: 15, fontWeight: '800', color: COLORS.text.primary },
  billTotalValue: { fontSize: 17, fontWeight: '800', color: COLORS.primary },
  checkoutBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFF', paddingHorizontal: SPACING.base, paddingVertical: SPACING.md, paddingBottom: 80, borderTopWidth: 1, borderTopColor: COLORS.border, ...SHADOW.floating },
  checkoutTotal: { fontSize: 18, fontWeight: '800', color: COLORS.text.primary },
  checkoutSub: { fontSize: 10, color: COLORS.text.muted },
  checkoutBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: COLORS.primary, borderRadius: RADIUS.full, paddingHorizontal: 20, paddingVertical: 12 },
  checkoutBtnText: { fontSize: 14, fontWeight: '700', color: '#FFF' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: SPACING.xxl },
  emptyTitle: { fontSize: 18, fontWeight: '800', color: COLORS.text.primary, marginTop: SPACING.base },
  emptyDesc: { fontSize: 13, color: COLORS.text.muted, textAlign: 'center', marginTop: 4 },
  emptyBtn: { backgroundColor: COLORS.primary, borderRadius: RADIUS.full, paddingHorizontal: 24, paddingVertical: 12, marginTop: SPACING.lg },
  emptyBtnText: { fontSize: 14, fontWeight: '700', color: '#FFF' },
});
