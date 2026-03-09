import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, RADIUS, SHADOW } from '@/src/utils/theme';

const MENU_ITEMS = [
  { icon: 'map-marker-outline', label: 'Delivery Addresses', color: '#1565C0' },
  { icon: 'wallet-outline', label: 'Wallet', color: '#2E7D32' },
  { icon: 'bell-outline', label: 'Notifications', color: '#F57C00' },
  { icon: 'heart-outline', label: 'Favorites', color: '#D32F2F' },
  { icon: 'help-circle-outline', label: 'Help & Support', color: '#7B1FA2' },
  { icon: 'information-outline', label: 'About', color: '#455A64' },
];

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" />
      <LinearGradient colors={COLORS.gradient.header} style={styles.header}><Text style={styles.headerTitle}>{'\uD83D\uDC64'} Profile</Text></LinearGradient>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.profileCard}>
          <View style={styles.avatarCircle}><Icon name="account" size={40} color={COLORS.primary} /></View>
          <View style={{ flex: 1 }}>
            <Text style={styles.profileName}>Customer</Text>
            <Text style={styles.profilePhone}>+91 98765 43210</Text>
          </View>
          <TouchableOpacity style={styles.editBtn}><Icon name="pencil" size={16} color={COLORS.primary} /></TouchableOpacity>
        </View>
        <View style={styles.statsRow}>
          {[{ v: '0', l: 'Orders' }, { v: '\u20B90', l: 'Saved' }, { v: '0', l: 'Favorites' }].map((s, i) => (
            <View key={i} style={styles.statCard}><Text style={styles.statValue}>{s.v}</Text><Text style={styles.statLabel}>{s.l}</Text></View>
          ))}
        </View>
        <View style={styles.menuCard}>
          {MENU_ITEMS.map((item, i) => (
            <TouchableOpacity key={i} style={styles.menuItem}>
              <View style={[styles.menuIcon, { backgroundColor: item.color + '15' }]}><Icon name={item.icon as any} size={20} color={item.color} /></View>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Icon name="chevron-right" size={18} color={COLORS.text.muted} />
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity style={styles.logoutBtn}>
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
  editBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.backgroundSoft, justifyContent: 'center', alignItems: 'center' },
  statsRow: { flexDirection: 'row', gap: 10, marginTop: SPACING.md },
  statCard: { flex: 1, backgroundColor: '#FFF', borderRadius: RADIUS.lg, padding: SPACING.md, alignItems: 'center', ...SHADOW.sm },
  statValue: { fontSize: 18, fontWeight: '800', color: COLORS.primary },
  statLabel: { fontSize: 11, color: COLORS.text.muted, marginTop: 2 },
  menuCard: { backgroundColor: '#FFF', borderRadius: RADIUS.lg, marginTop: SPACING.md, ...SHADOW.sm, overflow: 'hidden' },
  menuItem: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, padding: SPACING.base, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  menuIcon: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  menuLabel: { flex: 1, fontSize: 14, fontWeight: '600', color: COLORS.text.primary },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: SPACING.xl, paddingVertical: SPACING.md, borderWidth: 1.5, borderColor: COLORS.status.error, borderRadius: RADIUS.full },
  logoutText: { fontSize: 14, fontWeight: '700', color: COLORS.status.error },
});
