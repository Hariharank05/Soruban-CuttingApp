import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar } from 'react-native';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, RADIUS, SHADOW } from '@/src/utils/theme';
import { useThemedStyles } from '@/src/utils/useThemedStyles';

interface Transaction {
  id: string;
  type: 'credit' | 'debit';
  title: string;
  description: string;
  amount: number;
  date: string;
}

const TRANSACTIONS: Transaction[] = [
  { id: '1', type: 'credit', title: 'Cashback Received', description: 'Order #CUT1001 cashback', amount: 25, date: 'Today, 10:30 AM' },
  { id: '2', type: 'debit', title: 'Wallet Payment', description: 'Order #CUT1001 partial payment', amount: 50, date: 'Today, 10:28 AM' },
  { id: '3', type: 'credit', title: 'Referral Bonus', description: 'Friend joined using your code', amount: 100, date: 'Yesterday, 3:15 PM' },
  { id: '4', type: 'credit', title: 'Welcome Bonus', description: 'New user welcome reward', amount: 50, date: '2 days ago' },
];

export default function WalletScreen() {
  const router = useRouter();
  const themed = useThemedStyles();
  const balance = TRANSACTIONS.reduce((sum, t) => sum + (t.type === 'credit' ? t.amount : -t.amount), 0);

  const renderTransaction = ({ item }: { item: Transaction }) => (
    <View style={[styles.txCard, themed.card]}>
      <View style={[styles.txIcon, { backgroundColor: item.type === 'credit' ? '#E8F5E9' : '#E8F5E9' }]}>
        <Icon
          name={item.type === 'credit' ? 'arrow-down-circle' : 'arrow-up-circle'}
          size={22}
          color={item.type === 'credit' ? COLORS.green : COLORS.primary}
        />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.txTitle}>{item.title}</Text>
        <Text style={styles.txDesc}>{item.description}</Text>
        <Text style={styles.txDate}>{item.date}</Text>
      </View>
      <Text style={[styles.txAmount, { color: item.type === 'credit' ? COLORS.green : COLORS.primary }]}>
        {item.type === 'credit' ? '+' : '-'}{'\u20B9'}{item.amount}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.safe, themed.safeArea]} edges={['bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <LinearGradient colors={themed.headerGradient} style={styles.header}>
        <SafeAreaView edges={['top']} style={{ backgroundColor: 'transparent' }}>
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
              <Icon name="arrow-left" size={24} color={COLORS.text.primary} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, themed.textPrimary]}>Wallet</Text>
            <View style={{ width: 40 }} />
          </View>
        </SafeAreaView>
      </LinearGradient>

      {/* Balance Card */}
      <View style={styles.balanceCard}>
        <LinearGradient colors={['#388E3C', '#4CAF50']} style={styles.balanceGrad}>
          <Text style={styles.balanceLabel}>Wallet Balance</Text>
          <Text style={styles.balanceAmount}>{'\u20B9'}{balance}</Text>
          <TouchableOpacity style={styles.addMoneyBtn}>
            <Icon name="plus" size={16} color={COLORS.green} />
            <Text style={styles.addMoneyText}>Add Money</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>

      {/* Transactions */}
      <Text style={[styles.sectionTitle, themed.textPrimary]}>Transaction History</Text>
      <FlatList
        data={TRANSACTIONS}
        keyExtractor={i => i.id}
        renderItem={renderTransaction}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Icon name="wallet-outline" size={48} color={COLORS.text.muted} />
            <Text style={styles.emptyText}>No transactions yet</Text>
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
  balanceCard: { marginHorizontal: SPACING.base, marginTop: SPACING.sm, borderRadius: RADIUS.xl, overflow: 'hidden', ...SHADOW.sm },
  balanceGrad: { padding: SPACING.xl, alignItems: 'center' },
  balanceLabel: { fontSize: 13, color: 'rgba(255,255,255,0.8)' },
  balanceAmount: { fontSize: 36, fontWeight: '800', color: '#FFF', marginTop: 4 },
  addMoneyBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#FFF', borderRadius: RADIUS.full,
    paddingHorizontal: 20, paddingVertical: 10, marginTop: SPACING.md,
  },
  addMoneyText: { fontSize: 13, fontWeight: '700', color: COLORS.green },
  sectionTitle: { fontSize: 15, fontWeight: '800', color: COLORS.text.primary, marginHorizontal: SPACING.base, marginTop: SPACING.xl, marginBottom: SPACING.sm },
  list: { paddingHorizontal: SPACING.base, paddingBottom: 40 },
  txCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#FFF', borderRadius: RADIUS.lg, padding: SPACING.base,
    marginBottom: SPACING.sm, ...SHADOW.sm,
  },
  txIcon: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  txTitle: { fontSize: 13, fontWeight: '700', color: COLORS.text.primary },
  txDesc: { fontSize: 11, color: COLORS.text.muted, marginTop: 1 },
  txDate: { fontSize: 10, color: COLORS.text.muted, marginTop: 2 },
  txAmount: { fontSize: 15, fontWeight: '800' },
  empty: { alignItems: 'center', paddingVertical: 60 },
  emptyText: { fontSize: 14, color: COLORS.text.muted, marginTop: 8 },
});
