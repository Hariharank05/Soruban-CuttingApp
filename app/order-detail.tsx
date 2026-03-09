import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, RADIUS, SHADOW } from '@/src/utils/theme';
import { useOrders } from '@/context/OrderContext';
import { getCutLabel } from '@/data/cutTypes';

const STATUS_ICONS: Record<string, string> = {
  'Order Placed': 'clipboard-check', 'Confirmed': 'check-circle', 'Cutting Started': 'content-cut',
  'Quality Check': 'shield-check', 'Packed': 'package-variant-closed', 'Out for Delivery': 'truck-delivery', 'Delivered': 'check-all',
};

export default function OrderDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { orders } = useOrders();
  const order = useMemo(() => orders.find(o => o.id === id), [orders, id]);

  if (!order) return <SafeAreaView style={styles.safe}><Text style={{ textAlign: 'center', marginTop: 60 }}>Order not found</Text></SafeAreaView>;

  const date = new Date(order.createdAt);
  const dateStr = date.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  const timeStr = date.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' });

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <LinearGradient colors={COLORS.gradient.header} style={styles.header}>
        <SafeAreaView edges={['top']} style={{ backgroundColor: 'transparent' }}>
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}><Icon name="arrow-left" size={24} color={COLORS.text.primary} /></TouchableOpacity>
            <Text style={styles.headerTitle}>Order #{order.id}</Text>
            <View style={{ width: 40 }} />
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Status */}
        <View style={styles.statusBanner}>
          <LinearGradient colors={COLORS.gradient.primary} style={styles.statusGrad}>
            <Icon name="content-cut" size={32} color="#FFF" />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.statusLabel}>
                {order.status === 'cutting' ? 'Cutting in Progress...' : order.status === 'delivered' ? 'Delivered!' : order.status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </Text>
              {order.estimatedDelivery && <Text style={styles.statusTime}>ETA: {order.estimatedDelivery}</Text>}
            </View>
          </LinearGradient>
        </View>

        {/* Timeline */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Order Timeline</Text>
          {order.timeline?.map((step, i) => (
            <View key={i} style={styles.timelineRow}>
              <View style={styles.timelineDotCol}>
                <View style={[styles.timelineDot, step.completed && styles.timelineDotDone]}>
                  <Icon name={(STATUS_ICONS[step.status] || 'circle-outline') as any} size={14} color={step.completed ? '#FFF' : COLORS.text.muted} />
                </View>
                {i < (order.timeline?.length ?? 0) - 1 && <View style={[styles.timelineLine, step.completed && styles.timelineLineDone]} />}
              </View>
              <View style={styles.timelineContent}>
                <Text style={[styles.timelineStatus, step.completed && styles.timelineStatusDone]}>{step.status}</Text>
                {step.time ? <Text style={styles.timelineTime}>{step.time}</Text> : null}
                <Text style={styles.timelineDesc}>{step.description}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Items */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Order Items ({order.items.length})</Text>
          {order.items.map((item, idx) => (
            <View key={idx} style={styles.orderItem}>
              <View style={{ flex: 1 }}>
                <Text style={styles.orderItemName}>{item.name} x{item.quantity}</Text>
                {item.cutType && <View style={styles.cutBadge}><Text style={styles.cutBadgeText}>{getCutLabel(item.cutType)}</Text></View>}
                {item.specialInstructions && <Text style={styles.orderItemInstr}>{'\uD83D\uDCDD'} {item.specialInstructions}</Text>}
              </View>
              <Text style={styles.orderItemPrice}>{'\u20B9'}{item.price * item.quantity}</Text>
            </View>
          ))}
        </View>

        {/* Details */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Order Details</Text>
          {[
            ['Order ID', `#${order.id}`], ['Placed on', `${dateStr} at ${timeStr}`],
            ['Delivery Slot', order.deliverySlot], ['Address', order.deliveryAddress],
            ...(order.specialNote ? [['Note', order.specialNote]] : []),
          ].map(([label, value], i) => (
            <View key={i} style={styles.detailRow}><Text style={styles.detailLabel}>{label}</Text><Text style={styles.detailValue}>{value}</Text></View>
          ))}
        </View>

        {/* Bill */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Bill Summary</Text>
          <View style={styles.billRow}><Text style={styles.billLabel}>Items Total</Text><Text style={styles.billValue}>{'\u20B9'}{order.subtotal}</Text></View>
          {order.cuttingCharges > 0 && <View style={styles.billRow}><Text style={styles.billLabel}>{'\uD83D\uDD2A'} Cutting Charges</Text><Text style={[styles.billValue, { color: COLORS.primary }]}>{'\u20B9'}{order.cuttingCharges}</Text></View>}
          <View style={styles.billRow}><Text style={styles.billLabel}>Delivery Fee</Text><Text style={styles.billValue}>{'\u20B9'}{order.deliveryFee}</Text></View>
          <View style={[styles.billRow, styles.billTotal]}><Text style={styles.billTotalLabel}>Total Paid</Text><Text style={styles.billTotalValue}>{'\u20B9'}{order.total}</Text></View>
        </View>
        <View style={{ height: 30 }} />
      </ScrollView>
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
  statusBanner: { borderRadius: RADIUS.lg, overflow: 'hidden', marginBottom: SPACING.md },
  statusGrad: { flexDirection: 'row', alignItems: 'center', padding: SPACING.lg },
  statusLabel: { fontSize: 17, fontWeight: '800', color: '#FFF' },
  statusTime: { fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  sectionCard: { backgroundColor: '#FFF', borderRadius: RADIUS.lg, padding: SPACING.base, marginBottom: SPACING.md, ...SHADOW.sm },
  sectionTitle: { fontSize: 15, fontWeight: '800', color: COLORS.text.primary, marginBottom: SPACING.md },
  timelineRow: { flexDirection: 'row', minHeight: 60 },
  timelineDotCol: { width: 30, alignItems: 'center' },
  timelineDot: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#F0F0F0', justifyContent: 'center', alignItems: 'center' },
  timelineDotDone: { backgroundColor: COLORS.primary },
  timelineLine: { width: 2, flex: 1, backgroundColor: '#E0E0E0', marginVertical: 2 },
  timelineLineDone: { backgroundColor: COLORS.primary },
  timelineContent: { flex: 1, marginLeft: 10, paddingBottom: 16 },
  timelineStatus: { fontSize: 13, fontWeight: '700', color: COLORS.text.muted },
  timelineStatusDone: { color: COLORS.text.primary },
  timelineTime: { fontSize: 11, color: COLORS.primary, fontWeight: '600', marginTop: 1 },
  timelineDesc: { fontSize: 11, color: COLORS.text.muted, marginTop: 2 },
  orderItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  orderItemName: { fontSize: 13, fontWeight: '600', color: COLORS.text.primary },
  cutBadge: { alignSelf: 'flex-start', backgroundColor: '#FFF3E0', borderRadius: RADIUS.sm, paddingHorizontal: 6, paddingVertical: 2, marginTop: 3, borderWidth: 1, borderColor: '#FFCC80' },
  cutBadgeText: { fontSize: 10, fontWeight: '600', color: '#E65100' },
  orderItemInstr: { fontSize: 10, color: COLORS.text.muted, marginTop: 2 },
  orderItemPrice: { fontSize: 13, fontWeight: '700', color: COLORS.text.primary },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  detailLabel: { fontSize: 12, color: COLORS.text.muted },
  detailValue: { fontSize: 12, fontWeight: '600', color: COLORS.text.primary, maxWidth: '60%', textAlign: 'right' },
  billRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  billLabel: { fontSize: 13, color: COLORS.text.secondary },
  billValue: { fontSize: 13, fontWeight: '600', color: COLORS.text.primary },
  billTotal: { borderTopWidth: 1, borderTopColor: COLORS.border, marginTop: 6, paddingTop: 10 },
  billTotalLabel: { fontSize: 15, fontWeight: '800', color: COLORS.text.primary },
  billTotalValue: { fontSize: 17, fontWeight: '800', color: COLORS.primary },
});
