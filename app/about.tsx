import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, RADIUS, SHADOW } from '@/src/utils/theme';
import { useThemedStyles } from '@/src/utils/useThemedStyles';

export default function AboutScreen() {
  const router = useRouter();
  const themed = useThemedStyles();

  return (
    <SafeAreaView style={[styles.safe, themed.safeArea]} edges={['bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <LinearGradient colors={themed.headerGradient} style={styles.header}>
        <SafeAreaView edges={['top']} style={{ backgroundColor: 'transparent' }}>
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
              <Icon name="arrow-left" size={24} color={COLORS.text.primary} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, themed.textPrimary]}>About</Text>
            <View style={{ width: 40 }} />
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* App Info */}
        <View style={[styles.appCard, themed.card]}>
          <View style={styles.appIcon}>
            <Icon name="basket" size={36} color={COLORS.primary} />
          </View>
          <Text style={styles.appName}>Chopify</Text>
          <Text style={styles.appVersion}>Version 1.0.0</Text>
          <Text style={styles.appDesc}>Fresh cut vegetables & fruits delivered to your doorstep. Choose your veggies, select the cut style, and we deliver them ready for your kitchen!</Text>
        </View>

        {/* Features */}
        <Text style={[styles.sectionTitle, themed.textPrimary]}>What We Offer</Text>
        {[
          { icon: 'leaf', title: 'Farm Fresh', desc: 'Vegetables sourced daily from local farms', color: '#388E3C' },
          { icon: 'knife', title: 'Custom Cutting', desc: 'Choose from 5 cut styles - small pieces, slices, cubes & more', color: COLORS.primary },
          { icon: 'food-variant', title: 'Dish Packs', desc: 'Pre-selected veggie packs for Sambar, Biryani & more', color: '#1565C0' },
          { icon: 'truck-fast', title: 'Quick Delivery', desc: 'Delivery in 30-45 minutes or schedule at your convenience', color: '#F57C00' },
          { icon: 'heart-pulse', title: 'Health Focus', desc: 'Diet foods, sports nutrition & healthy snacks for everyone', color: '#D32F2F' },
        ].map((f, i) => (
          <View key={i} style={[styles.featureCard, themed.card]}>
            <View style={[styles.featureIcon, { backgroundColor: f.color + '15' }]}>
              <Icon name={f.icon as any} size={22} color={f.color} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.featureTitle}>{f.title}</Text>
              <Text style={styles.featureDesc}>{f.desc}</Text>
            </View>
          </View>
        ))}

        {/* Legal */}
        <View style={[styles.legalCard, themed.card]}>
          {['Terms of Service', 'Privacy Policy', 'Refund Policy'].map((item, i) => (
            <TouchableOpacity key={i} style={styles.legalItem}>
              <Text style={styles.legalText}>{item}</Text>
              <Icon name="chevron-right" size={16} color={COLORS.text.muted} />
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.copyright}>Made with care in Coimbatore, Tamil Nadu</Text>
        <View style={{ height: 40 }} />
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
  scroll: { padding: SPACING.base },
  appCard: { backgroundColor: '#FFF', borderRadius: RADIUS.xl, padding: SPACING.xl, alignItems: 'center', ...SHADOW.sm },
  appIcon: { width: 72, height: 72, borderRadius: 20, backgroundColor: '#E8F5E9', justifyContent: 'center', alignItems: 'center', marginBottom: SPACING.md },
  appName: { fontSize: 22, fontWeight: '800', color: COLORS.text.primary },
  appVersion: { fontSize: 12, color: COLORS.text.muted, marginTop: 2 },
  appDesc: { fontSize: 13, color: COLORS.text.secondary, textAlign: 'center', lineHeight: 19, marginTop: SPACING.md },
  sectionTitle: { fontSize: 15, fontWeight: '800', color: COLORS.text.primary, marginTop: SPACING.xl, marginBottom: SPACING.md },
  featureCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#FFF', borderRadius: RADIUS.lg, padding: SPACING.base,
    marginBottom: SPACING.sm, ...SHADOW.sm,
  },
  featureIcon: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  featureTitle: { fontSize: 14, fontWeight: '700', color: COLORS.text.primary },
  featureDesc: { fontSize: 11, color: COLORS.text.secondary, marginTop: 2, lineHeight: 16 },
  legalCard: { backgroundColor: '#FFF', borderRadius: RADIUS.lg, marginTop: SPACING.xl, ...SHADOW.sm, overflow: 'hidden' },
  legalItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: SPACING.base, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  legalText: { fontSize: 13, fontWeight: '600', color: COLORS.text.primary },
  copyright: { fontSize: 11, color: COLORS.text.muted, textAlign: 'center', marginTop: SPACING.xl },
});
