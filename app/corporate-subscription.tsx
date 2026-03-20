import React, { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar,
  TextInput, Alert, Modal, Image,
} from 'react-native';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, RADIUS, SHADOW } from '@/src/utils/theme';
import { useThemedStyles } from '@/src/utils/useThemedStyles';

/* ─── Corporate Plans ─── */
interface CorpPlan {
  id: string;
  name: string;
  icon: string;
  color: string;
  desc: string;
  items: string[];
  pricePerDay: number;
  minEmployees: number;
  tag?: string;
  image: string;
}

const CORP_PLANS: CorpPlan[] = [
  {
    id: 'fruit_basket', name: 'Office Fruit Basket', icon: 'fruit-cherries', color: '#E53935',
    desc: 'Fresh seasonal fruits delivered daily to your office. Keeps employees energized and healthy.',
    items: ['Apple x5', 'Banana x10', 'Orange x5', 'Pomegranate x3', 'Seasonal fruit x5'],
    pricePerDay: 350, minEmployees: 10, tag: 'Most Popular',
    image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'meeting_snack', name: 'Meeting Snack Pack', icon: 'food-variant', color: '#FF6F00',
    desc: 'Healthy snack platters for meetings and conferences. Fresh-cut veggies, dips & fruit bowls.',
    items: ['Veggie sticks platter', 'Fresh fruit bowl', 'Sprout salad cups', 'Juice bottles x10'],
    pricePerDay: 500, minEmployees: 15, tag: 'Premium',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'wellness_basic', name: 'Employee Wellness — Basic', icon: 'heart-pulse', color: '#2E7D32',
    desc: 'Individual fruit & veggie packs for each employee. Promotes healthy eating at workplace.',
    items: ['1 Banana', '1 Apple/Orange', '1 Juice box', 'Healthy snack bar'],
    pricePerDay: 45, minEmployees: 20, tag: 'Per Employee',
    image: 'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'wellness_pro', name: 'Employee Wellness — Pro', icon: 'shield-check', color: '#1565C0',
    desc: 'Complete nutrition pack with customized diet plans for each employee based on health goals.',
    items: ['Personalized fruit pack', 'Fresh salad bowl', 'Protein smoothie', 'Health snack', 'Detox water'],
    pricePerDay: 120, minEmployees: 10, tag: 'Per Employee',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'pantry_stock', name: 'Office Pantry Stock', icon: 'fridge-outline', color: '#7B1FA2',
    desc: 'Weekly fresh produce for your office pantry. Fruits, veggies, juices & healthy snacks.',
    items: ['Mixed fruits 5kg', 'Salad veggies 3kg', 'Juice bottles x20', 'Dry fruit mix 1kg', 'Sprouts 1kg'],
    pricePerDay: 250, minEmployees: 15,
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'event_catering', name: 'Event & Party Pack', icon: 'party-popper', color: '#C62828',
    desc: 'Fresh-cut fruit platters, juice bars & healthy catering for office events and celebrations.',
    items: ['Fruit platter (50 pax)', 'Juice bar setup', 'Salad counter', 'Healthy dessert cups'],
    pricePerDay: 2500, minEmployees: 50, tag: 'Events',
    image: 'https://images.unsplash.com/photo-1564093497595-593b96d80571?auto=format&fit=crop&w=400&q=80',
  },
];

const FREQ_OPTIONS = [
  { key: 'daily', label: 'Daily', icon: 'calendar-today', discount: '15% off' },
  { key: 'weekly', label: 'Weekly', icon: 'calendar-week', discount: '10% off' },
  { key: 'monthly', label: 'Monthly', icon: 'calendar-month', discount: '5% off' },
  { key: 'one_time', label: 'One-time', icon: 'calendar-check', discount: '' },
];

const TESTIMONIALS = [
  { name: 'Zoho Corp', role: 'HR Manager', text: 'Our employees love the daily fruit baskets. Productivity went up and sick leaves came down!', rating: 5 },
  { name: 'TCS Chennai', role: 'Admin Head', text: 'Meeting snack packs are a hit. Fresh, healthy and always on time.', rating: 5 },
  { name: 'Infosys', role: 'Wellness Lead', text: 'The employee wellness program has been amazing. Great variety and quality.', rating: 4 },
];

export default function CorporateSubscriptionScreen() {
  const router = useRouter();
  const themed = useThemedStyles();

  const [selectedPlan, setSelectedPlan] = useState<CorpPlan | null>(null);
  const [showEnquiry, setShowEnquiry] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [employeeCount, setEmployeeCount] = useState('');
  const [frequency, setFrequency] = useState('daily');
  const [showPlanDetail, setShowPlanDetail] = useState(false);

  const estimatedCost = useMemo(() => {
    if (!selectedPlan || !employeeCount) return 0;
    const count = parseInt(employeeCount) || 0;
    const isPerEmployee = selectedPlan.tag === 'Per Employee';
    const base = isPerEmployee ? selectedPlan.pricePerDay * count : selectedPlan.pricePerDay;
    const discount = frequency === 'daily' ? 0.15 : frequency === 'weekly' ? 0.10 : frequency === 'monthly' ? 0.05 : 0;
    return Math.round(base * (1 - discount));
  }, [selectedPlan, employeeCount, frequency]);

  const handleSubmitEnquiry = () => {
    if (!companyName.trim()) { Alert.alert('Required', 'Please enter company name.'); return; }
    if (!contactName.trim()) { Alert.alert('Required', 'Please enter contact person name.'); return; }
    if (!contactPhone.trim() || contactPhone.length < 10) { Alert.alert('Required', 'Please enter valid phone number.'); return; }
    if (!employeeCount.trim()) { Alert.alert('Required', 'Please enter number of employees.'); return; }

    setShowEnquiry(false);
    Alert.alert(
      'Enquiry Submitted!',
      `Thank you ${contactName}! Our corporate team will contact you within 24 hours to set up ${selectedPlan?.name || 'your plan'} for ${companyName}.\n\nEstimated cost: \u20B9${estimatedCost}/day`,
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView style={[styles.safe, themed.safeArea]} edges={['bottom']}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <LinearGradient colors={['#1A237E', '#283593']} style={styles.header}>
        <SafeAreaView edges={['top']} style={{ backgroundColor: 'transparent' }}>
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
              <Icon name="arrow-left" size={24} color="#FFF" />
            </TouchableOpacity>
            <View style={{ flex: 1 }}>
              <Text style={styles.headerTitle}>Corporate Plans</Text>
              <Text style={styles.headerSub}>Healthy workplace, productive team</Text>
            </View>
            <Icon name="domain" size={28} color="rgba(255,255,255,0.4)" />
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Hero Stats */}
        <View style={styles.statsRow}>
          {[
            { value: '50+', label: 'Companies', icon: 'domain' },
            { value: '5000+', label: 'Employees', icon: 'account-group' },
            { value: '4.8', label: 'Rating', icon: 'star' },
          ].map((s, i) => (
            <View key={i} style={[styles.statCard, themed.card]}>
              <Icon name={s.icon as any} size={18} color="#1A237E" />
              <Text style={[styles.statValue, themed.textPrimary]}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Plans */}
        <Text style={[styles.sectionTitle, themed.textPrimary]}>Choose a Plan</Text>

        {CORP_PLANS.map(plan => (
          <TouchableOpacity
            key={plan.id}
            style={[styles.planCard, themed.card, selectedPlan?.id === plan.id && { borderColor: plan.color, borderWidth: 2 }]}
            onPress={() => { setSelectedPlan(plan); setShowPlanDetail(true); }}
            activeOpacity={0.85}
          >
            <View style={styles.planCardRow}>
              <View style={[styles.planIconWrap, { backgroundColor: plan.color + '15' }]}>
                <Icon name={plan.icon as any} size={24} color={plan.color} />
              </View>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text style={[styles.planName, themed.textPrimary]}>{plan.name}</Text>
                  {plan.tag && (
                    <View style={[styles.planTag, { backgroundColor: plan.color + '15' }]}>
                      <Text style={[styles.planTagText, { color: plan.color }]}>{plan.tag}</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.planDesc} numberOfLines={2}>{plan.desc}</Text>
                <View style={styles.planPriceRow}>
                  <Text style={[styles.planPrice, { color: plan.color }]}>{'\u20B9'}{plan.pricePerDay}</Text>
                  <Text style={styles.planPriceUnit}>/{plan.tag === 'Per Employee' ? 'employee/day' : plan.tag === 'Events' ? 'event' : 'day'}</Text>
                  <Text style={styles.planMin}>{plan.minEmployees}+ employees</Text>
                </View>
              </View>
              <Icon name="chevron-right" size={20} color={COLORS.text.muted} />
            </View>
          </TouchableOpacity>
        ))}

        {/* How It Works */}
        <Text style={[styles.sectionTitle, themed.textPrimary]}>How It Works</Text>
        <View style={[styles.howCard, themed.card]}>
          {[
            { step: '1', icon: 'file-document-edit', text: 'Choose a plan & submit enquiry', color: '#1565C0' },
            { step: '2', icon: 'phone', text: 'Our team contacts you within 24hrs', color: '#F57C00' },
            { step: '3', icon: 'handshake', text: 'Customize plan for your company', color: '#2E7D32' },
            { step: '4', icon: 'truck-delivery', text: 'Fresh delivery starts to your office', color: '#7B1FA2' },
          ].map((h, i) => (
            <View key={i} style={styles.howRow}>
              <View style={[styles.howStep, { backgroundColor: h.color }]}>
                <Text style={styles.howStepText}>{h.step}</Text>
              </View>
              <Icon name={h.icon as any} size={18} color={h.color} />
              <Text style={[styles.howText, themed.textPrimary]}>{h.text}</Text>
            </View>
          ))}
        </View>

        {/* Testimonials */}
        <Text style={[styles.sectionTitle, themed.textPrimary]}>Trusted By</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10, paddingBottom: 4 }}>
          {TESTIMONIALS.map((t, i) => (
            <View key={i} style={[styles.testimonialCard, themed.card]}>
              <View style={styles.testimonialStars}>
                {[1, 2, 3, 4, 5].map(s => (
                  <Icon key={s} name={s <= t.rating ? 'star' : 'star-outline'} size={12} color="#FFD700" />
                ))}
              </View>
              <Text style={styles.testimonialText}>"{t.text}"</Text>
              <View style={styles.testimonialAuthor}>
                <View style={styles.testimonialAvatar}>
                  <Text style={styles.testimonialAvatarText}>{t.name[0]}</Text>
                </View>
                <View>
                  <Text style={[styles.testimonialName, themed.textPrimary]}>{t.name}</Text>
                  <Text style={styles.testimonialRole}>{t.role}</Text>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Benefits */}
        <Text style={[styles.sectionTitle, themed.textPrimary]}>Why Companies Choose Us</Text>
        <View style={[styles.benefitsCard, themed.card]}>
          {[
            { icon: 'leaf', text: '100% fresh — farm to office in 4 hours', color: '#2E7D32' },
            { icon: 'knife', text: 'Custom cut styles — ready to eat', color: '#F57C00' },
            { icon: 'calendar-sync', text: 'Flexible — daily, weekly or one-time', color: '#1565C0' },
            { icon: 'receipt', text: 'GST invoice & corporate billing', color: '#7B1FA2' },
            { icon: 'account-cog', text: 'Dedicated account manager', color: '#00897B' },
            { icon: 'cancel', text: 'Cancel or modify anytime', color: '#E53935' },
          ].map((b, i) => (
            <View key={i} style={styles.benefitRow}>
              <View style={[styles.benefitIcon, { backgroundColor: b.color + '15' }]}>
                <Icon name={b.icon as any} size={16} color={b.color} />
              </View>
              <Text style={[styles.benefitText, themed.textPrimary]}>{b.text}</Text>
            </View>
          ))}
        </View>

        {/* CTA */}
        <TouchableOpacity style={styles.ctaBtn} onPress={() => setShowEnquiry(true)} activeOpacity={0.85}>
          <LinearGradient colors={['#1A237E', '#283593']} style={styles.ctaGrad}>
            <Icon name="file-document-edit-outline" size={20} color="#FFF" />
            <Text style={styles.ctaText}>Get a Custom Quote</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity style={styles.callBtn} onPress={() => Alert.alert('Call Us', 'Call our corporate team at +91 98765 43210?')}>
          <Icon name="phone" size={18} color="#1A237E" />
          <Text style={styles.callBtnText}>Talk to Corporate Sales</Text>
        </TouchableOpacity>

        <View style={{ height: 30 }} />
      </ScrollView>

      {/* ━━━ Plan Detail Modal ━━━ */}
      <Modal visible={showPlanDetail && !!selectedPlan} transparent animationType="slide" onRequestClose={() => setShowPlanDetail(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modal, themed.card]}>
            {selectedPlan && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.modalHeader}>
                  <View style={[styles.planIconWrap, { backgroundColor: selectedPlan.color + '15', width: 48, height: 48, borderRadius: 16 }]}>
                    <Icon name={selectedPlan.icon as any} size={24} color={selectedPlan.color} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.modalPlanName, themed.textPrimary]}>{selectedPlan.name}</Text>
                    <Text style={[styles.planPrice, { color: selectedPlan.color }]}>{'\u20B9'}{selectedPlan.pricePerDay}<Text style={styles.planPriceUnit}>/{selectedPlan.tag === 'Per Employee' ? 'employee/day' : 'day'}</Text></Text>
                  </View>
                  <TouchableOpacity onPress={() => setShowPlanDetail(false)}>
                    <Icon name="close" size={22} color={COLORS.text.muted} />
                  </TouchableOpacity>
                </View>

                <Text style={styles.modalDesc}>{selectedPlan.desc}</Text>

                <Text style={[styles.modalSubtitle, themed.textPrimary]}>What's Included</Text>
                {selectedPlan.items.map((item, i) => (
                  <View key={i} style={styles.modalItemRow}>
                    <Icon name="check-circle" size={14} color={selectedPlan.color} />
                    <Text style={styles.modalItemText}>{item}</Text>
                  </View>
                ))}

                <Text style={[styles.modalSubtitle, themed.textPrimary, { marginTop: 16 }]}>Delivery Frequency</Text>
                <View style={styles.freqGrid}>
                  {FREQ_OPTIONS.map(f => {
                    const active = frequency === f.key;
                    return (
                      <TouchableOpacity
                        key={f.key}
                        style={[styles.freqChip, active && { borderColor: selectedPlan.color, backgroundColor: selectedPlan.color + '10' }]}
                        onPress={() => setFrequency(f.key)}
                      >
                        <Icon name={f.icon as any} size={14} color={active ? selectedPlan.color : COLORS.text.muted} />
                        <Text style={[styles.freqChipText, active && { color: selectedPlan.color, fontWeight: '800' }]}>{f.label}</Text>
                        {f.discount ? <Text style={[styles.freqDiscount, { color: selectedPlan.color }]}>{f.discount}</Text> : null}
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <TouchableOpacity
                  style={[styles.modalCta, { backgroundColor: selectedPlan.color }]}
                  onPress={() => { setShowPlanDetail(false); setShowEnquiry(true); }}
                  activeOpacity={0.85}
                >
                  <Icon name="file-document-edit-outline" size={18} color="#FFF" />
                  <Text style={styles.modalCtaText}>Get Quote for This Plan</Text>
                </TouchableOpacity>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      {/* ━━━ Enquiry Modal ━━━ */}
      <Modal visible={showEnquiry} animationType="slide" onRequestClose={() => setShowEnquiry(false)}>
        <SafeAreaView style={[styles.safe, themed.safeArea]} edges={['top', 'bottom']}>
          <LinearGradient colors={['#1A237E', '#283593']} style={styles.header}>
            <View style={styles.headerRow}>
              <TouchableOpacity onPress={() => setShowEnquiry(false)} style={styles.backBtn}>
                <Icon name="close" size={24} color="#FFF" />
              </TouchableOpacity>
              <View style={{ flex: 1 }}>
                <Text style={styles.headerTitle}>Corporate Enquiry</Text>
                <Text style={styles.headerSub}>{selectedPlan?.name || 'Custom Plan'}</Text>
              </View>
            </View>
          </LinearGradient>

          <ScrollView contentContainerStyle={{ padding: SPACING.base }}>
            <Text style={[styles.formLabel, themed.textPrimary]}>Company Name *</Text>
            <TextInput style={[styles.formInput, themed.inputBg]} placeholder="e.g. Zoho Corporation" placeholderTextColor={COLORS.text.muted} value={companyName} onChangeText={setCompanyName} />

            <Text style={[styles.formLabel, themed.textPrimary]}>Contact Person *</Text>
            <TextInput style={[styles.formInput, themed.inputBg]} placeholder="Your name" placeholderTextColor={COLORS.text.muted} value={contactName} onChangeText={setContactName} />

            <Text style={[styles.formLabel, themed.textPrimary]}>Phone Number *</Text>
            <TextInput style={[styles.formInput, themed.inputBg]} placeholder="10-digit phone" placeholderTextColor={COLORS.text.muted} value={contactPhone} onChangeText={setContactPhone} keyboardType="phone-pad" maxLength={10} />

            <Text style={[styles.formLabel, themed.textPrimary]}>Email (Optional)</Text>
            <TextInput style={[styles.formInput, themed.inputBg]} placeholder="company@email.com" placeholderTextColor={COLORS.text.muted} value={contactEmail} onChangeText={setContactEmail} keyboardType="email-address" />

            <Text style={[styles.formLabel, themed.textPrimary]}>Number of Employees *</Text>
            <TextInput style={[styles.formInput, themed.inputBg]} placeholder="e.g. 50" placeholderTextColor={COLORS.text.muted} value={employeeCount} onChangeText={t => setEmployeeCount(t.replace(/[^0-9]/g, ''))} keyboardType="number-pad" />

            <Text style={[styles.formLabel, themed.textPrimary]}>Delivery Frequency</Text>
            <View style={styles.freqGrid}>
              {FREQ_OPTIONS.map(f => {
                const active = frequency === f.key;
                return (
                  <TouchableOpacity key={f.key} style={[styles.freqChip, active && { borderColor: '#1A237E', backgroundColor: '#E8EAF6' }]} onPress={() => setFrequency(f.key)}>
                    <Icon name={f.icon as any} size={14} color={active ? '#1A237E' : COLORS.text.muted} />
                    <Text style={[styles.freqChipText, active && { color: '#1A237E', fontWeight: '800' }]}>{f.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Cost Estimate */}
            {estimatedCost > 0 && (
              <View style={styles.estimateCard}>
                <View style={styles.estimateRow}>
                  <Text style={styles.estimateLabel}>Estimated Daily Cost</Text>
                  <Text style={styles.estimateValue}>{'\u20B9'}{estimatedCost}</Text>
                </View>
                <View style={styles.estimateRow}>
                  <Text style={styles.estimateLabel}>Monthly Estimate</Text>
                  <Text style={[styles.estimateValue, { color: '#1A237E' }]}>{'\u20B9'}{estimatedCost * 26}</Text>
                </View>
                {frequency === 'daily' && <Text style={styles.estimateSaving}>Saving 15% with daily subscription!</Text>}
              </View>
            )}

            <TouchableOpacity style={styles.submitBtn} onPress={handleSubmitEnquiry} activeOpacity={0.85}>
              <LinearGradient colors={['#1A237E', '#283593']} style={styles.submitGrad}>
                <Icon name="send" size={18} color="#FFF" />
                <Text style={styles.submitText}>Submit Enquiry</Text>
              </LinearGradient>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { paddingHorizontal: SPACING.base, paddingBottom: SPACING.md },
  headerRow: { flexDirection: 'row', alignItems: 'center', paddingTop: SPACING.sm, gap: 10 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.15)', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#FFF' },
  headerSub: { fontSize: 11, color: 'rgba(255,255,255,0.7)', marginTop: 1 },
  scroll: { padding: SPACING.base },

  // Stats
  statsRow: { flexDirection: 'row', gap: 8, marginBottom: SPACING.md },
  statCard: { flex: 1, alignItems: 'center', paddingVertical: 14, borderRadius: RADIUS.lg, ...SHADOW.sm },
  statValue: { fontSize: 18, fontWeight: '800', marginTop: 4 },
  statLabel: { fontSize: 9, color: COLORS.text.muted, marginTop: 1 },

  sectionTitle: { fontSize: 16, fontWeight: '800', marginBottom: SPACING.sm, marginTop: SPACING.md },

  // Plan Card
  planCard: { borderRadius: RADIUS.lg, padding: 14, marginBottom: 10, ...SHADOW.sm },
  planCardRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  planIconWrap: { width: 44, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  planName: { fontSize: 14, fontWeight: '800' },
  planTag: { borderRadius: 6, paddingHorizontal: 7, paddingVertical: 2 },
  planTagText: { fontSize: 8, fontWeight: '800' },
  planDesc: { fontSize: 11, color: COLORS.text.muted, marginTop: 3, lineHeight: 15 },
  planPriceRow: { flexDirection: 'row', alignItems: 'baseline', gap: 2, marginTop: 6 },
  planPrice: { fontSize: 16, fontWeight: '800' },
  planPriceUnit: { fontSize: 10, color: COLORS.text.muted, fontWeight: '600' },
  planMin: { fontSize: 9, color: COLORS.text.muted, marginLeft: 'auto' },

  // How it works
  howCard: { borderRadius: RADIUS.lg, padding: SPACING.base, gap: 14, ...SHADOW.sm },
  howRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  howStep: { width: 26, height: 26, borderRadius: 13, justifyContent: 'center', alignItems: 'center' },
  howStepText: { fontSize: 12, fontWeight: '800', color: '#FFF' },
  howText: { flex: 1, fontSize: 13, fontWeight: '600' },

  // Testimonials
  testimonialCard: { width: 260, borderRadius: RADIUS.lg, padding: 14, ...SHADOW.sm },
  testimonialStars: { flexDirection: 'row', gap: 2, marginBottom: 8 },
  testimonialText: { fontSize: 12, color: COLORS.text.secondary, lineHeight: 17, fontStyle: 'italic' },
  testimonialAuthor: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 10 },
  testimonialAvatar: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#1A237E', justifyContent: 'center', alignItems: 'center' },
  testimonialAvatarText: { fontSize: 12, fontWeight: '800', color: '#FFF' },
  testimonialName: { fontSize: 12, fontWeight: '700' },
  testimonialRole: { fontSize: 9, color: COLORS.text.muted },

  // Benefits
  benefitsCard: { borderRadius: RADIUS.lg, padding: SPACING.base, gap: 12, ...SHADOW.sm },
  benefitRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  benefitIcon: { width: 34, height: 34, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  benefitText: { flex: 1, fontSize: 12, fontWeight: '600' },

  // CTA
  ctaBtn: { borderRadius: RADIUS.lg, overflow: 'hidden', marginTop: SPACING.lg },
  ctaGrad: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16 },
  ctaText: { fontSize: 15, fontWeight: '800', color: '#FFF' },
  callBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderWidth: 1.5, borderColor: '#1A237E', borderRadius: RADIUS.lg, paddingVertical: 14, marginTop: 10 },
  callBtnText: { fontSize: 14, fontWeight: '700', color: '#1A237E' },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modal: { borderTopLeftRadius: RADIUS.xl, borderTopRightRadius: RADIUS.xl, padding: SPACING.lg, maxHeight: '80%' },
  modalHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  modalPlanName: { fontSize: 17, fontWeight: '800' },
  modalDesc: { fontSize: 12, color: COLORS.text.secondary, lineHeight: 18, marginBottom: 14 },
  modalSubtitle: { fontSize: 14, fontWeight: '800', marginBottom: 8 },
  modalItemRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  modalItemText: { fontSize: 13, color: COLORS.text.primary, fontWeight: '600' },
  modalCta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: RADIUS.lg, paddingVertical: 14, marginTop: 16 },
  modalCtaText: { fontSize: 14, fontWeight: '700', color: '#FFF' },

  // Frequency
  freqGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 },
  freqChip: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 12, paddingVertical: 10, borderRadius: RADIUS.full, borderWidth: 1.5, borderColor: '#E0E0E0' },
  freqChipText: { fontSize: 12, fontWeight: '600', color: COLORS.text.secondary },
  freqDiscount: { fontSize: 9, fontWeight: '800' },

  // Enquiry Form
  formLabel: { fontSize: 13, fontWeight: '700', marginBottom: 4, marginTop: 12 },
  formInput: { borderWidth: 1, borderColor: '#E0E0E0', borderRadius: RADIUS.md, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, marginBottom: 4 },
  estimateCard: { backgroundColor: '#E8EAF6', borderRadius: RADIUS.lg, padding: 14, marginTop: 14 },
  estimateRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  estimateLabel: { fontSize: 13, color: '#3F51B5', fontWeight: '600' },
  estimateValue: { fontSize: 16, fontWeight: '800', color: '#1A237E' },
  estimateSaving: { fontSize: 11, fontWeight: '700', color: '#2E7D32', marginTop: 6 },
  submitBtn: { borderRadius: RADIUS.lg, overflow: 'hidden', marginTop: 20, marginBottom: 30 },
  submitGrad: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16 },
  submitText: { fontSize: 15, fontWeight: '800', color: '#FFF' },
});
