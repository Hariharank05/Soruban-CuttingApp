import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, RADIUS, SHADOW } from '@/src/utils/theme';

const FAQS = [
  { q: 'How do I place an order?', a: 'Browse products, select cut style and quantity, add to cart, and proceed to checkout. You can schedule delivery or get it delivered now.' },
  { q: 'What cutting styles are available?', a: 'We offer Small Pieces, Slices, Cubes, Long Cuts, and Grated. Each style has a small cutting charge.' },
  { q: 'Can I schedule a delivery?', a: 'Yes! During checkout, choose "Schedule" and pick your preferred date and time slot.' },
  { q: 'What are Dish Packs?', a: 'Dish Packs are pre-selected vegetable combinations for specific dishes like Sambar, Biryani, etc. You can customize cut styles for each item.' },
  { q: 'How do I cancel an order?', a: 'You can cancel an order before it enters the "Cutting Started" stage. Go to Orders > tap the order > Cancel.' },
  { q: 'Is there a minimum order amount?', a: 'No minimum order amount. However, orders below ₹199 may have a delivery charge.' },
  { q: 'How fresh are the vegetables?', a: 'All vegetables are sourced fresh daily from local farms. We cut them only after you place an order.' },
];

const CONTACT_OPTIONS = [
  { icon: 'phone-outline', label: 'Call Us', value: '+91 98765 43210', color: '#1565C0' },
  { icon: 'email-outline', label: 'Email', value: 'support@cutready.com', color: '#2E7D32' },
  { icon: 'chat-outline', label: 'Live Chat', value: 'Available 8AM - 10PM', color: '#F57C00' },
];

export default function HelpScreen() {
  const router = useRouter();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <LinearGradient colors={COLORS.gradient.header} style={styles.header}>
        <SafeAreaView edges={['top']} style={{ backgroundColor: 'transparent' }}>
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
              <Icon name="arrow-left" size={24} color={COLORS.text.primary} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Help & Support</Text>
            <View style={{ width: 40 }} />
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Contact */}
        <Text style={styles.sectionTitle}>Contact Us</Text>
        <View style={styles.contactRow}>
          {CONTACT_OPTIONS.map((c, i) => (
            <TouchableOpacity key={i} style={styles.contactCard}>
              <View style={[styles.contactIcon, { backgroundColor: c.color + '15' }]}>
                <Icon name={c.icon as any} size={24} color={c.color} />
              </View>
              <Text style={styles.contactLabel}>{c.label}</Text>
              <Text style={styles.contactValue} numberOfLines={1}>{c.value}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* FAQs */}
        <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
        {FAQS.map((faq, i) => {
          const isOpen = expandedIndex === i;
          return (
            <TouchableOpacity
              key={i}
              style={styles.faqCard}
              activeOpacity={0.8}
              onPress={() => setExpandedIndex(isOpen ? null : i)}
            >
              <View style={styles.faqHeader}>
                <Text style={styles.faqQuestion}>{faq.q}</Text>
                <Icon name={isOpen ? 'chevron-up' : 'chevron-down'} size={20} color={COLORS.text.muted} />
              </View>
              {isOpen && <Text style={styles.faqAnswer}>{faq.a}</Text>}
            </TouchableOpacity>
          );
        })}
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
  sectionTitle: { fontSize: 15, fontWeight: '800', color: COLORS.text.primary, marginBottom: SPACING.md, marginTop: SPACING.sm },
  contactRow: { flexDirection: 'row', gap: 8 },
  contactCard: { flex: 1, backgroundColor: '#FFF', borderRadius: RADIUS.lg, padding: SPACING.md, alignItems: 'center', ...SHADOW.sm },
  contactIcon: { width: 48, height: 48, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  contactLabel: { fontSize: 12, fontWeight: '700', color: COLORS.text.primary },
  contactValue: { fontSize: 10, color: COLORS.text.muted, marginTop: 2, textAlign: 'center' },
  faqCard: { backgroundColor: '#FFF', borderRadius: RADIUS.lg, padding: SPACING.base, marginBottom: SPACING.sm, ...SHADOW.sm },
  faqHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  faqQuestion: { flex: 1, fontSize: 13, fontWeight: '700', color: COLORS.text.primary, marginRight: 8 },
  faqAnswer: { fontSize: 12, color: COLORS.text.secondary, lineHeight: 18, marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: COLORS.border },
});
