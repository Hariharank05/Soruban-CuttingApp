import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar } from 'react-native';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, RADIUS, SHADOW } from '@/src/utils/theme';

interface Notification {
  id: string;
  type: 'order' | 'offer' | 'tip' | 'pack';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const ICON_MAP: Record<string, { name: string; color: string; bg: string }> = {
  order: { name: 'package-variant', color: '#1565C0', bg: '#E3F2FD' },
  offer: { name: 'tag-outline', color: '#4CAF50', bg: '#E8F5E9' },
  tip: { name: 'heart-pulse', color: '#388E3C', bg: '#E8F5E9' },
  pack: { name: 'food-variant', color: '#7B1FA2', bg: '#F3E5F5' },
};

const NOTIFICATIONS: Notification[] = [
  { id: '1', type: 'offer', title: 'Flat 20% Off!', message: 'Get 20% off on all vegetable packs this weekend. Use code FRESH20.', time: '2 hours ago', read: false },
  { id: '2', type: 'tip', title: 'Health Tip', message: 'Add bitter gourd to your diet — it helps regulate blood sugar levels naturally.', time: '5 hours ago', read: false },
  { id: '3', type: 'pack', title: 'New Pack Available', message: 'Try our new Chettinad Mutton Gravy Pack with freshly ground masala veggies!', time: '1 day ago', read: true },
  { id: '4', type: 'order', title: 'Order Delivered', message: 'Your order #CUT1001 has been delivered successfully. Enjoy your meal!', time: '2 days ago', read: true },
  { id: '5', type: 'offer', title: 'Weekend Special', message: 'Sambar Pack + Poriyal Pack combo at just ₹199. Order before Sunday!', time: '3 days ago', read: true },
  { id: '6', type: 'tip', title: 'Nutrition Alert', message: 'Spinach is rich in iron and great for boosting immunity. Add it to your cart!', time: '4 days ago', read: true },
  { id: '7', type: 'pack', title: 'Recommended for You', message: 'Based on your orders, try the Biryani Veggie Pack — freshly Chopify!', time: '5 days ago', read: true },
  { id: '8', type: 'order', title: 'Rate Your Order', message: 'How was your last order? Tap to rate and help us improve.', time: '1 week ago', read: true },
];

export default function NotificationsScreen() {
  const router = useRouter();

  const renderItem = ({ item }: { item: Notification }) => {
    const icon = ICON_MAP[item.type];
    return (
      <View style={[styles.notifCard, !item.read && styles.notifUnread]}>
        {!item.read && <View style={styles.unreadDot} />}
        <View style={[styles.notifIcon, { backgroundColor: icon.bg }]}>
          <Icon name={icon.name as any} size={22} color={icon.color} />
        </View>
        <View style={styles.notifBody}>
          <Text style={styles.notifTitle}>{item.title}</Text>
          <Text style={styles.notifMsg} numberOfLines={2}>{item.message}</Text>
          <Text style={styles.notifTime}>{item.time}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <LinearGradient colors={COLORS.gradient.header} style={styles.header}>
        <SafeAreaView edges={['top']} style={{ backgroundColor: 'transparent' }}>
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
              <Icon name="arrow-left" size={24} color={COLORS.text.primary} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Notifications</Text>
            <View style={{ width: 40 }} />
          </View>
        </SafeAreaView>
      </LinearGradient>

      <FlatList
        data={NOTIFICATIONS}
        keyExtractor={i => i.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Icon name="bell-off-outline" size={48} color={COLORS.text.muted} />
            <Text style={styles.emptyText}>No notifications yet</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  header: { paddingBottom: SPACING.md, paddingHorizontal: SPACING.base },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: SPACING.sm },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: COLORS.text.primary },
  list: { padding: SPACING.base, paddingBottom: 40 },
  notifCard: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 12,
    backgroundColor: '#FFF', borderRadius: RADIUS.lg, padding: SPACING.base,
    marginBottom: SPACING.sm, ...SHADOW.sm, position: 'relative',
  },
  notifUnread: { backgroundColor: '#FFF8E1' },
  unreadDot: {
    position: 'absolute', top: 14, left: 8,
    width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.primary,
  },
  notifIcon: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  notifBody: { flex: 1 },
  notifTitle: { fontSize: 14, fontWeight: '700', color: COLORS.text.primary, marginBottom: 2 },
  notifMsg: { fontSize: 12, color: COLORS.text.secondary, lineHeight: 17 },
  notifTime: { fontSize: 10, color: COLORS.text.muted, marginTop: 4 },
  empty: { alignItems: 'center', paddingVertical: 80 },
  emptyText: { fontSize: 14, color: COLORS.text.muted, marginTop: 8 },
});
