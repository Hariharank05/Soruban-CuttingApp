import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar } from 'react-native';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, RADIUS, SHADOW } from '@/src/utils/theme';
import { useThemedStyles } from '@/src/utils/useThemedStyles';

type NotifType = 'order' | 'offer' | 'tip' | 'pack' | 'freshness' | 'nutritionist' | 'group' | 'corporate' | 'subscription';

interface Notification {
  id: string;
  type: NotifType;
  title: string;
  message: string;
  time: string;
  read: boolean;
  route?: string;
  params?: Record<string, string>;
}

const ICON_MAP: Record<NotifType, { name: string; color: string; bg: string }> = {
  order: { name: 'package-variant', color: '#1565C0', bg: '#E3F2FD' },
  offer: { name: 'tag-outline', color: '#E65100', bg: '#FFF3E0' },
  tip: { name: 'heart-pulse', color: '#388E3C', bg: '#E8F5E9' },
  pack: { name: 'food-variant', color: '#7B1FA2', bg: '#F3E5F5' },
  freshness: { name: 'clock-alert-outline', color: '#FF9800', bg: '#FFF3E0' },
  nutritionist: { name: 'doctor', color: '#1565C0', bg: '#E3F2FD' },
  group: { name: 'account-group', color: '#7B1FA2', bg: '#F3E5F5' },
  corporate: { name: 'domain', color: '#1A237E', bg: '#E8EAF6' },
  subscription: { name: 'calendar-sync', color: '#00796B', bg: '#E0F2F1' },
};

type FilterKey = 'all' | 'freshness' | 'orders' | 'nutrition' | 'offers';

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'freshness', label: 'Freshness' },
  { key: 'orders', label: 'Orders' },
  { key: 'nutrition', label: 'Nutrition' },
  { key: 'offers', label: 'Offers' },
];

const NOTIFICATIONS: Notification[] = [
  // Freshness / Meal Prep Timer alerts
  { id: 'f1', type: 'freshness', title: 'Use your Carrots today!', message: 'Your carrots from Monday\'s order are best used today. Try making a quick stir-fry or sambar!', time: '10 min ago', read: false, route: '/order-detail', params: { id: 'CUT1001' } },
  { id: 'f2', type: 'freshness', title: 'Spinach expiring soon', message: 'Your spinach from yesterday\'s delivery stays fresh for 2 days. Use it in dal or poriyal today!', time: '30 min ago', read: false },
  { id: 'f3', type: 'freshness', title: 'Tomatoes — 1 day left', message: 'Your diced tomatoes are best used within 3 days. Perfect for rasam or chutney today!', time: '2 hours ago', read: false },

  // Nutritionist notifications
  { id: 'n1', type: 'nutritionist', title: 'Dr. Priya sent your Meal Plan', message: 'Your personalized Protein Power Plan is ready! Tap to view your weekly meal schedule.', time: '1 hour ago', read: false, route: '/nutritionist' },
  { id: 'n2', type: 'nutritionist', title: 'Monthly Health Report Ready', message: 'Your February health score is 85/100! Great protein intake. Tap to see full analysis.', time: '3 hours ago', read: false, route: '/nutritionist' },
  { id: 'n3', type: 'nutritionist', title: 'Nutrition Tip from Dr. Priya', message: 'Based on your orders, adding more leafy greens can boost your iron levels. Try our Spinach Pack!', time: '1 day ago', read: true },

  // Group subscription notifications
  { id: 'g1', type: 'group', title: 'Kavitha joined your group!', message: 'Kavitha R has joined "Anna Nagar Girls Hostel" group. 5 members now — you\'ve unlocked 10% group discount!', time: '2 hours ago', read: false, route: '/group-subscription' },
  { id: 'g2', type: 'group', title: 'Group delivery tomorrow', message: 'Your hostel group order of 5 packs will be delivered between 7:00 - 8:00 AM tomorrow.', time: '5 hours ago', read: true },

  // Corporate notifications
  { id: 'c1', type: 'corporate', title: 'Office Fruit Basket arriving', message: 'Your office fruit basket for TechCorp will be delivered at 10 AM. 85 employees served.', time: '4 hours ago', read: true },

  // Subscription notifications
  { id: 's1', type: 'subscription', title: 'Tomorrow\'s delivery is set', message: 'Your daily subscription delivery — Sambar Pack + Poriyal Pack — will arrive by 7:00 AM.', time: '6 hours ago', read: true },
  { id: 's2', type: 'subscription', title: 'Subscription renewed', message: 'Your weekly Protein Power Plan has been renewed for another month. ₹150/day.', time: '1 day ago', read: true },

  // Regular order notifications
  { id: 'o1', type: 'order', title: 'Order Delivered!', message: 'Your order #CUT1001 has been delivered. Rate your experience and earn 10 loyalty points!', time: '1 day ago', read: true, route: '/order-detail', params: { id: 'CUT1001' } },
  { id: 'o2', type: 'order', title: 'Order Out for Delivery', message: 'Your order #CUT1003 is on the way! Delivery boy Raju is 5 mins away.', time: '2 days ago', read: true },

  // Offers
  { id: 'of1', type: 'offer', title: 'Flat 20% Off!', message: 'Get 20% off on all vegetable packs this weekend. Use code FRESH20.', time: '2 days ago', read: true },
  { id: 'of2', type: 'offer', title: 'Weekend Special', message: 'Sambar Pack + Poriyal Pack combo at just ₹199. Order before Sunday!', time: '3 days ago', read: true },

  // Health tips
  { id: 't1', type: 'tip', title: 'Health Tip', message: 'Add bitter gourd to your diet — it helps regulate blood sugar levels naturally.', time: '3 days ago', read: true },
  { id: 't2', type: 'tip', title: 'Nutrition Alert', message: 'Drumstick leaves are a superfood rich in calcium and Vitamin A. Try our Drumstick Pack!', time: '4 days ago', read: true },

  // More freshness reminders (older)
  { id: 'f4', type: 'freshness', title: 'Veggies used on time!', message: 'Great job! You used all items from last week\'s order before they expired. Keep it up!', time: '5 days ago', read: true },

  // Pack notifications
  { id: 'p1', type: 'pack', title: 'New Pack Available', message: 'Try our new Chettinad Gravy Pack with freshly cut veggies — perfectly measured!', time: '6 days ago', read: true },
  { id: 'p2', type: 'pack', title: 'Recommended for You', message: 'Based on your orders, try the Biryani Veggie Pack — freshly cut by Chopify!', time: '1 week ago', read: true },
];

export default function NotificationsScreen() {
  const router = useRouter();
  const themed = useThemedStyles();
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');

  const filteredNotifications = useMemo(() => {
    if (activeFilter === 'all') return NOTIFICATIONS;
    if (activeFilter === 'freshness') return NOTIFICATIONS.filter(n => n.type === 'freshness');
    if (activeFilter === 'orders') return NOTIFICATIONS.filter(n => ['order', 'subscription', 'group', 'corporate'].includes(n.type));
    if (activeFilter === 'nutrition') return NOTIFICATIONS.filter(n => ['nutritionist', 'tip'].includes(n.type));
    if (activeFilter === 'offers') return NOTIFICATIONS.filter(n => ['offer', 'pack'].includes(n.type));
    return NOTIFICATIONS;
  }, [activeFilter]);

  const unreadCount = NOTIFICATIONS.filter(n => !n.read).length;

  const handleNotifPress = (item: Notification) => {
    if (item.route) {
      router.push({ pathname: item.route as any, params: item.params });
    }
  };

  const renderItem = ({ item }: { item: Notification }) => {
    const icon = ICON_MAP[item.type];
    return (
      <TouchableOpacity
        style={[styles.notifCard, themed.card, !item.read && styles.notifUnread]}
        activeOpacity={item.route ? 0.7 : 1}
        onPress={() => handleNotifPress(item)}
      >
        {!item.read && <View style={styles.unreadDot} />}
        <View style={[styles.notifIcon, { backgroundColor: icon.bg }]}>
          <Icon name={icon.name as any} size={22} color={icon.color} />
        </View>
        <View style={styles.notifBody}>
          <View style={styles.notifTitleRow}>
            <Text style={[styles.notifTitle, themed.textPrimary, !item.read && { fontWeight: '800' }]} numberOfLines={1}>{item.title}</Text>
            {item.type === 'freshness' && !item.read && (
              <View style={styles.urgentBadge}>
                <Text style={styles.urgentText}>Urgent</Text>
              </View>
            )}
          </View>
          <Text style={styles.notifMsg} numberOfLines={2}>{item.message}</Text>
          <View style={styles.notifFooter}>
            <Text style={styles.notifTime}>{item.time}</Text>
            {item.route && (
              <View style={styles.tapHint}>
                <Text style={styles.tapHintText}>Tap to view</Text>
                <Icon name="chevron-right" size={12} color={COLORS.primary} />
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.safe, themed.safeArea]} edges={['bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <LinearGradient colors={themed.headerGradient} style={styles.header}>
        <SafeAreaView edges={['top']} style={{ backgroundColor: 'transparent' }}>
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
              <Icon name="arrow-left" size={24} color={themed.colors.text.primary} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, themed.textPrimary]}>Notifications</Text>
            {unreadCount > 0 ? (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadBadgeText}>{unreadCount} new</Text>
              </View>
            ) : (
              <View style={{ width: 40 }} />
            )}
          </View>
        </SafeAreaView>
      </LinearGradient>

      {/* Filter Chips */}
      <View style={styles.filterRow}>
        {FILTERS.map(f => (
          <TouchableOpacity
            key={f.key}
            style={[styles.filterChip, activeFilter === f.key && styles.filterChipActive]}
            onPress={() => setActiveFilter(f.key)}
          >
            <Text style={[styles.filterText, activeFilter === f.key && styles.filterTextActive]}>{f.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredNotifications}
        keyExtractor={i => i.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Icon name="bell-off-outline" size={48} color={COLORS.text.muted} />
            <Text style={styles.emptyText}>No notifications in this category</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  header: { paddingBottom: SPACING.sm, paddingHorizontal: SPACING.base },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: SPACING.sm },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: COLORS.text.primary },
  unreadBadge: { backgroundColor: '#E53935', borderRadius: RADIUS.full, paddingHorizontal: 10, paddingVertical: 4 },
  unreadBadgeText: { fontSize: 11, fontWeight: '700', color: '#FFF' },
  filterRow: { flexDirection: 'row', paddingHorizontal: SPACING.base, paddingVertical: SPACING.sm, gap: SPACING.sm },
  filterChip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: RADIUS.full, backgroundColor: '#F1F5F9', borderWidth: 1, borderColor: '#E2E8F0' },
  filterChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  filterText: { fontSize: 12, fontWeight: '600', color: COLORS.text.secondary },
  filterTextActive: { color: '#FFF' },
  list: { padding: SPACING.base, paddingBottom: 40 },
  notifCard: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 12,
    backgroundColor: '#FFF', borderRadius: RADIUS.lg, padding: SPACING.base,
    marginBottom: SPACING.sm, ...SHADOW.sm, position: 'relative',
  },
  notifUnread: { backgroundColor: '#FFF8E1', borderLeftWidth: 3, borderLeftColor: '#FF9800' },
  unreadDot: {
    position: 'absolute', top: 14, left: 4,
    width: 6, height: 6, borderRadius: 3, backgroundColor: '#E53935',
  },
  notifIcon: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center', flexShrink: 0 },
  notifBody: { flex: 1 },
  notifTitleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 6 },
  notifTitle: { fontSize: 14, fontWeight: '700', color: COLORS.text.primary, flex: 1 },
  urgentBadge: { backgroundColor: '#FFEBEE', borderRadius: RADIUS.sm, paddingHorizontal: 6, paddingVertical: 2 },
  urgentText: { fontSize: 9, fontWeight: '700', color: '#E53935' },
  notifMsg: { fontSize: 12, color: COLORS.text.secondary, lineHeight: 17, marginTop: 3 },
  notifFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 },
  notifTime: { fontSize: 10, color: COLORS.text.muted },
  tapHint: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  tapHintText: { fontSize: 10, fontWeight: '600', color: COLORS.primary },
  empty: { alignItems: 'center', paddingVertical: 80 },
  emptyText: { fontSize: 14, color: COLORS.text.muted, marginTop: 8 },
});
