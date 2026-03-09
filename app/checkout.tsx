import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, TextInput, Alert, Platform } from 'react-native';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, RADIUS, SHADOW } from '@/src/utils/theme';
import { useCart } from '@/context/CartContext';
import { useOrders } from '@/context/OrderContext';
import { getCutLabel, getCutFee } from '@/data/cutTypes';
import deliverySlotsData from '@/data/deliverySlots.json';

const SCHEDULE_DATES = (() => {
  const dates: { key: string; label: string; sub: string }[] = [];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const dayLabel = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
    dates.push({
      key: d.toISOString().split('T')[0],
      label: dayLabel,
      sub: d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
    });
  }
  return dates;
})();

const TIME_SLOTS = [
  { id: 'slot_7am', label: '7:00 AM - 8:00 AM' },
  { id: 'slot_8am', label: '8:00 AM - 10:00 AM' },
  { id: 'slot_10am', label: '10:00 AM - 12:00 PM' },
  { id: 'slot_12pm', label: '12:00 PM - 2:00 PM' },
  { id: 'slot_2pm', label: '2:00 PM - 4:00 PM' },
  { id: 'slot_5pm', label: '5:00 PM - 7:00 PM' },
  { id: 'slot_7pm', label: '7:00 PM - 9:00 PM' },
];

export default function CheckoutScreen() {
  const router = useRouter();
  const { cartItems, getSubtotal, getCuttingTotal, clearCart } = useCart();
  const { createOrder } = useOrders();

  const [deliveryMode, setDeliveryMode] = useState<'now' | 'scheduled'>('now');
  const [selectedSlot, setSelectedSlot] = useState(deliverySlotsData[0].id);
  const [scheduleDate, setScheduleDate] = useState(SCHEDULE_DATES[1].key);
  const [scheduleTime, setScheduleTime] = useState(TIME_SLOTS[0].id);
  const [address, setAddress] = useState('42, Anna Nagar, Coimbatore');
  const [orderNote, setOrderNote] = useState('');
  const [payment, setPayment] = useState<'cod' | 'upi'>('cod');
  const [placing, setPlacing] = useState(false);

  const subtotal = getSubtotal();
  const cuttingTotal = getCuttingTotal();
  const deliveryFee = 25;
  const total = subtotal + deliveryFee;

  const deliveryLabel = useMemo(() => {
    if (deliveryMode === 'now') {
      return deliverySlotsData.find(s => s.id === selectedSlot)?.label || 'ASAP';
    }
    const dateLabel = SCHEDULE_DATES.find(d => d.key === scheduleDate)?.label || '';
    const timeLabel = TIME_SLOTS.find(t => t.id === scheduleTime)?.label || '';
    return `${dateLabel} ${timeLabel}`;
  }, [deliveryMode, selectedSlot, scheduleDate, scheduleTime]);

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) return;
    setPlacing(true);
    try {
      const order = await createOrder({
        items: cartItems, subtotal, cuttingCharges: cuttingTotal, deliveryFee, discount: 0,
        deliverySlot: deliveryLabel, deliveryAddress: address, specialNote: orderNote || undefined,
      });
      clearCart();
      Alert.alert('Order Placed!', `Order #${order.id} has been placed successfully. Your fresh-cut items will be ready soon!`,
        [{ text: 'View Order', onPress: () => router.replace({ pathname: '/order-detail', params: { id: order.id } }) }]);
    } catch { Alert.alert('Error', 'Failed to place order. Please try again.'); }
    finally { setPlacing(false); }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <LinearGradient colors={COLORS.gradient.header} style={styles.header}>
        <SafeAreaView edges={['top']} style={{ backgroundColor: 'transparent' }}>
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}><Icon name="arrow-left" size={24} color={COLORS.text.primary} /></TouchableOpacity>
            <Text style={styles.headerTitle}>Checkout</Text>
            <View style={{ width: 40 }} />
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Address */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}><Icon name="map-marker" size={20} color={COLORS.primary} /><Text style={styles.sectionTitle}>Delivery Address</Text></View>
          <TextInput style={styles.addressInput} value={address} onChangeText={setAddress} multiline numberOfLines={2} />
        </View>

        {/* Delivery Mode Toggle */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}><Icon name="clock-outline" size={20} color={COLORS.primary} /><Text style={styles.sectionTitle}>Delivery Time</Text></View>
          <View style={styles.modeToggle}>
            <TouchableOpacity style={[styles.modeBtn, deliveryMode === 'now' && styles.modeBtnActive]} onPress={() => setDeliveryMode('now')}>
              <Icon name="lightning-bolt" size={18} color={deliveryMode === 'now' ? '#FFF' : COLORS.text.secondary} />
              <Text style={[styles.modeBtnText, deliveryMode === 'now' && styles.modeBtnTextActive]}>Deliver Now</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.modeBtn, deliveryMode === 'scheduled' && styles.modeBtnActive]} onPress={() => setDeliveryMode('scheduled')}>
              <Icon name="calendar-clock" size={18} color={deliveryMode === 'scheduled' ? '#FFF' : COLORS.text.secondary} />
              <Text style={[styles.modeBtnText, deliveryMode === 'scheduled' && styles.modeBtnTextActive]}>Schedule</Text>
            </TouchableOpacity>
          </View>

          {deliveryMode === 'now' ? (
            <>
              {deliverySlotsData.map(slot => {
                const isActive = selectedSlot === slot.id;
                return (
                  <TouchableOpacity key={slot.id} style={[styles.slotRow, isActive && styles.slotRowActive]} onPress={() => setSelectedSlot(slot.id)}>
                    <Icon name={slot.icon as any} size={20} color={isActive ? COLORS.primary : COLORS.text.muted} />
                    <View style={{ flex: 1 }}><Text style={[styles.slotLabel, isActive && styles.slotLabelActive]}>{slot.label}</Text><Text style={styles.slotSub}>{slot.sub}</Text></View>
                    {isActive && <Icon name="check-circle" size={20} color={COLORS.primary} />}
                  </TouchableOpacity>
                );
              })}
            </>
          ) : (
            <>
              <Text style={styles.scheduleLabel}>Select Date</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dateRow}>
                {SCHEDULE_DATES.map(d => {
                  const isActive = scheduleDate === d.key;
                  return (
                    <TouchableOpacity key={d.key} style={[styles.dateChip, isActive && styles.dateChipActive]} onPress={() => setScheduleDate(d.key)}>
                      <Text style={[styles.dateChipLabel, isActive && styles.dateChipLabelActive]}>{d.label}</Text>
                      <Text style={[styles.dateChipSub, isActive && styles.dateChipSubActive]}>{d.sub}</Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
              <Text style={styles.scheduleLabel}>Select Time Slot</Text>
              <View style={styles.timeGrid}>
                {TIME_SLOTS.map(t => {
                  const isActive = scheduleTime === t.id;
                  return (
                    <TouchableOpacity key={t.id} style={[styles.timeChip, isActive && styles.timeChipActive]} onPress={() => setScheduleTime(t.id)}>
                      <Text style={[styles.timeChipText, isActive && styles.timeChipTextActive]}>{t.label}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </>
          )}
        </View>

        {/* Items */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}><Icon name="clipboard-list" size={20} color={COLORS.primary} /><Text style={styles.sectionTitle}>Order Items ({cartItems.length})</Text></View>
          {cartItems.map((item, idx) => (
            <View key={idx} style={styles.orderItem}>
              <View style={{ flex: 1 }}>
                <Text style={styles.orderItemName}>{item.name} x{item.quantity}</Text>
                {item.cutType && <Text style={styles.orderItemCut}>{getCutLabel(item.cutType)} (+{'\u20B9'}{getCutFee(item.cutType)})</Text>}
                {item.specialInstructions && <Text style={styles.orderItemInstr}>{item.specialInstructions}</Text>}
              </View>
              <Text style={styles.orderItemPrice}>{'\u20B9'}{(() => { let b = item.price; if (item.selectedWeight && item.unit.includes('kg')) b = Math.round((item.price * item.selectedWeight) / 1000); return b * item.quantity + getCutFee(item.cutType) * item.quantity; })()}</Text>
            </View>
          ))}
        </View>

        {/* Note */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}><Icon name="note-text" size={20} color={COLORS.primary} /><Text style={styles.sectionTitle}>Order Note</Text></View>
          <TextInput style={styles.noteInput} placeholder='"Ring the bell twice", "Leave at door"' placeholderTextColor={COLORS.text.muted} value={orderNote} onChangeText={setOrderNote} multiline />
        </View>

        {/* Bill */}
        <View style={styles.sectionCard}>
          <Text style={styles.billTitle}>Bill Summary</Text>
          <View style={styles.billRow}><Text style={styles.billLabel}>Items Total</Text><Text style={styles.billValue}>{'\u20B9'}{subtotal - cuttingTotal}</Text></View>
          {cuttingTotal > 0 && <View style={styles.billRow}><Text style={styles.billLabel}>Cutting Charges</Text><Text style={[styles.billValue, { color: COLORS.primary }]}>{'\u20B9'}{cuttingTotal}</Text></View>}
          <View style={styles.billRow}><Text style={styles.billLabel}>Delivery Fee</Text><Text style={styles.billValue}>{'\u20B9'}{deliveryFee}</Text></View>
          <View style={[styles.billRow, styles.billTotal]}><Text style={styles.billTotalLabel}>Total</Text><Text style={styles.billTotalValue}>{'\u20B9'}{total}</Text></View>
        </View>

        {/* Payment */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}><Icon name="credit-card" size={20} color={COLORS.primary} /><Text style={styles.sectionTitle}>Payment</Text></View>
          {([{ key: 'cod' as const, label: 'Cash on Delivery', icon: 'cash' }, { key: 'upi' as const, label: 'UPI Payment', icon: 'cellphone' }]).map(p => (
            <TouchableOpacity key={p.key} style={[styles.paymentRow, payment === p.key && styles.paymentRowActive]} onPress={() => setPayment(p.key)}>
              <Icon name={p.icon as any} size={20} color={payment === p.key ? COLORS.primary : COLORS.text.muted} />
              <Text style={[styles.paymentLabel, payment === p.key && styles.paymentLabelActive]}>{p.label}</Text>
              {payment === p.key && <Icon name="check-circle" size={20} color={COLORS.primary} />}
            </TouchableOpacity>
          ))}
        </View>
        <View style={{ height: 100 }} />
      </ScrollView>

      <View style={styles.orderBar}>
        <View><Text style={styles.orderBarTotal}>{'\u20B9'}{total}</Text><Text style={styles.orderBarSub}>{cartItems.length} items | {deliveryLabel}</Text></View>
        <TouchableOpacity style={[styles.orderBarBtn, placing && { opacity: 0.6 }]} onPress={handlePlaceOrder} disabled={placing}>
          <Icon name="content-cut" size={20} color="#FFF" /><Text style={styles.orderBarBtnText}>{placing ? 'Placing...' : 'Place Order'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  header: { paddingBottom: SPACING.md, paddingHorizontal: SPACING.base },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: SPACING.sm },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: COLORS.text.primary },
  scroll: { padding: SPACING.base, paddingBottom: 20 },
  sectionCard: { backgroundColor: '#FFF', borderRadius: RADIUS.lg, padding: SPACING.base, marginBottom: SPACING.md, ...SHADOW.sm },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: SPACING.md },
  sectionTitle: { fontSize: 15, fontWeight: '800', color: COLORS.text.primary },
  addressInput: { backgroundColor: '#F7F7F7', borderRadius: RADIUS.md, padding: SPACING.md, fontSize: 13, color: COLORS.text.primary, borderWidth: 1, borderColor: COLORS.border },
  // Delivery Mode Toggle
  modeToggle: { flexDirection: 'row', gap: 8, marginBottom: SPACING.md },
  modeBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 12, borderRadius: RADIUS.lg, borderWidth: 1.5, borderColor: COLORS.border, backgroundColor: '#FFF' },
  modeBtnActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primary },
  modeBtnText: { fontSize: 13, fontWeight: '700', color: COLORS.text.secondary },
  modeBtnTextActive: { color: '#FFF' },
  // Immediate slots
  slotRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10, paddingHorizontal: SPACING.sm, borderRadius: RADIUS.md, marginBottom: 4 },
  slotRowActive: { backgroundColor: '#E8F5E9' },
  slotLabel: { fontSize: 13, fontWeight: '700', color: COLORS.text.secondary },
  slotLabelActive: { color: COLORS.primary },
  slotSub: { fontSize: 11, color: COLORS.text.muted },
  // Schedule
  scheduleLabel: { fontSize: 13, fontWeight: '700', color: COLORS.text.primary, marginBottom: 8, marginTop: 4 },
  dateRow: { gap: 8, paddingBottom: 4 },
  dateChip: { width: 80, alignItems: 'center', paddingVertical: 10, borderRadius: RADIUS.lg, borderWidth: 1.5, borderColor: COLORS.border, backgroundColor: '#FFF' },
  dateChipActive: { borderColor: COLORS.primary, backgroundColor: '#E8F5E9' },
  dateChipLabel: { fontSize: 12, fontWeight: '700', color: COLORS.text.secondary },
  dateChipLabelActive: { color: COLORS.primary },
  dateChipSub: { fontSize: 10, color: COLORS.text.muted, marginTop: 2 },
  dateChipSubActive: { color: COLORS.primary },
  timeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  timeChip: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: RADIUS.full, borderWidth: 1.5, borderColor: COLORS.border, backgroundColor: '#FFF' },
  timeChipActive: { borderColor: COLORS.primary, backgroundColor: '#E8F5E9' },
  timeChipText: { fontSize: 12, fontWeight: '600', color: COLORS.text.secondary },
  timeChipTextActive: { color: COLORS.primary, fontWeight: '700' },
  // Order items
  orderItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  orderItemName: { fontSize: 13, fontWeight: '600', color: COLORS.text.primary },
  orderItemCut: { fontSize: 10, color: COLORS.primary, marginTop: 2 },
  orderItemInstr: { fontSize: 10, color: COLORS.text.muted, marginTop: 2 },
  orderItemPrice: { fontSize: 13, fontWeight: '700', color: COLORS.text.primary },
  noteInput: { backgroundColor: '#F7F7F7', borderRadius: RADIUS.md, padding: SPACING.md, fontSize: 13, color: COLORS.text.primary, borderWidth: 1, borderColor: COLORS.border, minHeight: 50 },
  billTitle: { fontSize: 15, fontWeight: '800', color: COLORS.text.primary, marginBottom: SPACING.md },
  billRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  billLabel: { fontSize: 13, color: COLORS.text.secondary },
  billValue: { fontSize: 13, fontWeight: '600', color: COLORS.text.primary },
  billTotal: { borderTopWidth: 1, borderTopColor: COLORS.border, marginTop: 6, paddingTop: 10 },
  billTotalLabel: { fontSize: 15, fontWeight: '800', color: COLORS.text.primary },
  billTotalValue: { fontSize: 17, fontWeight: '800', color: COLORS.primary },
  paymentRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 12, paddingHorizontal: SPACING.sm, borderRadius: RADIUS.md, marginBottom: 4 },
  paymentRowActive: { backgroundColor: '#E8F5E9' },
  paymentLabel: { flex: 1, fontSize: 14, fontWeight: '600', color: COLORS.text.secondary },
  paymentLabelActive: { color: COLORS.primary },
  orderBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFF', paddingHorizontal: SPACING.base, paddingVertical: SPACING.md, borderTopWidth: 1, borderTopColor: COLORS.border, ...SHADOW.floating },
  orderBarTotal: { fontSize: 18, fontWeight: '800', color: COLORS.text.primary },
  orderBarSub: { fontSize: 10, color: COLORS.text.muted },
  orderBarBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: COLORS.primary, borderRadius: RADIUS.full, paddingHorizontal: 24, paddingVertical: 14 },
  orderBarBtnText: { fontSize: 15, fontWeight: '700', color: '#FFF' },
});
