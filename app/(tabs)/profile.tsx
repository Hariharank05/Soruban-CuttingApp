import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, RADIUS, SHADOW } from '@/src/utils/theme';
import { useOrders } from '@/context/OrderContext';
import { useAuth } from '@/context/AuthContext';

const MENU_ITEMS = [
  { icon: 'map-marker-outline', label: 'Delivery Addresses', color: '#1565C0', route: '/addresses' },
  { icon: 'wallet-outline', label: 'Wallet', color: '#2E7D32', route: '/wallet' },
  { icon: 'bell-outline', label: 'Notifications', color: '#F57C00', route: '/notifications' },
  { icon: 'heart-outline', label: 'Favorites', color: '#D32F2F', route: '/favorites' },
  { icon: 'help-circle-outline', label: 'Help & Support', color: '#7B1FA2', route: '/help' },
  { icon: 'information-outline', label: 'About', color: '#455A64', route: '/about' },
];

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { orders } = useOrders();
  const totalOrders = orders.length;
  const totalSaved = orders.reduce((sum, o) => sum + (o.discount || 0), 0);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" />
      <LinearGradient colors={COLORS.gradient.header} style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </LinearGradient>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* User Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarCircle}><Icon name="account" size={40} color={COLORS.primary} /></View>
          <View style={{ flex: 1 }}>
            <Text style={styles.profileName}>{user?.name || 'Customer'}</Text>
            <Text style={styles.profilePhone}>+91 {user?.phone || '98765 43210'}</Text>
            <Text style={styles.profileAddress} numberOfLines={1}>{user?.address || '42, Anna Nagar, Coimbatore'}</Text>
          </View>
          <TouchableOpacity style={styles.editBtn}><Icon name="pencil" size={16} color={COLORS.primary} /></TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          {[
            { v: String(totalOrders), l: 'Orders' },
            { v: `\u20B9${totalSaved}`, l: 'Saved' },
            { v: '0', l: 'Favorites' },
          ].map((s, i) => (
            <View key={i} style={styles.statCard}>
              <Text style={styles.statValue}>{s.v}</Text>
              <Text style={styles.statLabel}>{s.l}</Text>
            </View>
          ))}
        </View>

        {/* Recent Orders */}
        {totalOrders > 0 && (
          <View style={styles.recentSection}>
            <View style={styles.recentHeader}>
              <Text style={styles.recentTitle}>Recent Orders</Text>
              <TouchableOpacity onPress={() => router.push('/(tabs)/orders')}>
                <Text style={styles.recentLink}>View All</Text>
              </TouchableOpacity>
            </View>
            {orders.slice(0, 3).map(order => (
              <TouchableOpacity
                key={order.id}
                style={styles.orderCard}
                onPress={() => router.push({ pathname: '/order-detail', params: { id: order.id } })}
              >
                <View style={styles.orderIcon}>
                  <Icon name="package-variant" size={20} color={COLORS.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.orderIdText}>#{order.id}</Text>
                  <Text style={styles.orderMeta}>{order.items.length} items · {'\u20B9'}{order.total}</Text>
                </View>
                <View style={styles.orderStatus}>
                  <Text style={styles.orderStatusText}>{order.status}</Text>
                </View>
                <Icon name="chevron-right" size={16} color={COLORS.text.muted} />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Menu */}
        <View style={styles.menuCard}>
          {MENU_ITEMS.map((item, i) => (
            <TouchableOpacity
              key={i}
              style={styles.menuItem}
              onPress={() => { if (item.route) router.push(item.route as any); }}
            >
              <View style={[styles.menuIcon, { backgroundColor: item.color + '15' }]}>
                <Icon name={item.icon as any} size={20} color={item.color} />
              </View>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Icon name="chevron-right" size={18} color={COLORS.text.muted} />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
          <Icon name="logout" size={18} color={COLORS.status.error} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  header: { paddingHorizontal: SPACING.base, paddingVertical: SPACING.md },
  headerTitle: { fontSize: 20, fontWeight: '800', color: COLORS.text.primary },
  scroll: { padding: SPACING.base, paddingBottom: 40 },
  profileCard: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, backgroundColor: '#FFF', borderRadius: RADIUS.lg, padding: SPACING.base, ...SHADOW.sm },
  avatarCircle: { width: 60, height: 60, borderRadius: 30, backgroundColor: COLORS.backgroundSoft, justifyContent: 'center', alignItems: 'center' },
  profileName: { fontSize: 17, fontWeight: '800', color: COLORS.text.primary },
  profilePhone: { fontSize: 13, color: COLORS.text.muted, marginTop: 2 },
  profileAddress: { fontSize: 12, color: COLORS.text.secondary, marginTop: 2 },
  editBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.backgroundSoft, justifyContent: 'center', alignItems: 'center' },
  statsRow: { flexDirection: 'row', gap: 10, marginTop: SPACING.md },
  statCard: { flex: 1, backgroundColor: '#FFF', borderRadius: RADIUS.lg, padding: SPACING.md, alignItems: 'center', ...SHADOW.sm },
  statValue: { fontSize: 18, fontWeight: '800', color: COLORS.primary },
  statLabel: { fontSize: 11, color: COLORS.text.muted, marginTop: 2 },
  recentSection: { marginTop: SPACING.md },
  recentHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.sm },
  recentTitle: { fontSize: 15, fontWeight: '800', color: COLORS.text.primary },
  recentLink: { fontSize: 12, fontWeight: '700', color: COLORS.primary },
  orderCard: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#FFF', borderRadius: RADIUS.lg, padding: SPACING.md,
    marginBottom: SPACING.sm, ...SHADOW.sm,
  },
  orderIcon: { width: 40, height: 40, borderRadius: 10, backgroundColor: '#FFF3E0', justifyContent: 'center', alignItems: 'center' },
  orderIdText: { fontSize: 13, fontWeight: '700', color: COLORS.text.primary },
  orderMeta: { fontSize: 11, color: COLORS.text.muted, marginTop: 1 },
  orderStatus: { backgroundColor: '#E8F5E9', borderRadius: RADIUS.sm, paddingHorizontal: 8, paddingVertical: 3 },
  orderStatusText: { fontSize: 10, fontWeight: '700', color: COLORS.green, textTransform: 'capitalize' },
  menuCard: { backgroundColor: '#FFF', borderRadius: RADIUS.lg, marginTop: SPACING.md, ...SHADOW.sm, overflow: 'hidden' },
  menuItem: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, padding: SPACING.base, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  menuIcon: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  menuLabel: { flex: 1, fontSize: 14, fontWeight: '600', color: COLORS.text.primary },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: SPACING.xl, paddingVertical: SPACING.md, borderWidth: 1.5, borderColor: COLORS.status.error, borderRadius: RADIUS.full },
  logoutText: { fontSize: 14, fontWeight: '700', color: COLORS.status.error },
});
