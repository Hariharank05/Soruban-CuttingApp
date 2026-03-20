import React, { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar,
  TextInput, Alert, Share, Linking, Modal,
} from 'react-native';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, RADIUS, SHADOW } from '@/src/utils/theme';
import { useThemedStyles } from '@/src/utils/useThemedStyles';
import { useAuth } from '@/context/AuthContext';

/* ─── Types ─── */
interface GroupMember {
  id: string;
  name: string;
  phone: string;
  status: 'invited' | 'joined' | 'subscribed';
  plan?: string;
  share?: number;
}

/* ─── Demo Data ─── */
const DEMO_MEMBERS: GroupMember[] = [
  { id: 'm1', name: 'Priya', phone: '9876543210', status: 'subscribed', plan: 'Budget Daily Pack', share: 75 },
  { id: 'm2', name: 'Kavitha', phone: '9876543211', status: 'subscribed', plan: 'Glow & Beauty Pack', share: 110 },
  { id: 'm3', name: 'Meena', phone: '9876543212', status: 'joined', plan: undefined, share: 0 },
];

const PLAN_OPTIONS = [
  { id: 'budget', name: 'Budget Daily Pack', price: 75, icon: 'cash', color: '#2E7D32' },
  { id: 'beauty', name: 'Glow & Beauty Pack', price: 110, icon: 'face-woman-shimmer', color: '#AD1457' },
  { id: 'period', name: 'Period Care Plan', price: 100, icon: 'heart-circle', color: '#E91E63' },
  { id: 'protein', name: 'Protein Power Plan', price: 150, icon: 'dumbbell', color: '#E53935' },
  { id: 'snack', name: 'Student Snack Pack', price: 90, icon: 'food-apple', color: '#1565C0' },
];

const STATUS_CONFIG: Record<string, { label: string; bg: string; color: string; icon: string }> = {
  invited: { label: 'Invited', bg: '#FFF3E0', color: '#F57C00', icon: 'send' },
  joined: { label: 'Joined', bg: '#E3F2FD', color: '#1565C0', icon: 'account-check' },
  subscribed: { label: 'Subscribed', bg: '#E8F5E9', color: '#2E7D32', icon: 'check-circle' },
};

const AVATAR_COLORS = ['#E91E63', '#FF9800', '#9C27B0', '#009688', '#3F51B5', '#FF5722', '#00BCD4', '#8BC34A'];

export default function GroupSubscriptionScreen() {
  const router = useRouter();
  const themed = useThemedStyles();
  const { user } = useAuth();

  const [groupName, setGroupName] = useState('Room 204 Gang');
  const [groupAddress, setGroupAddress] = useState('Hostel Block B, Room 204, Anna University, Chennai 600025');
  const [members, setMembers] = useState<GroupMember[]>(DEMO_MEMBERS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSplitModal, setShowSplitModal] = useState(false);
  const [showEditGroup, setShowEditGroup] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');

  const groupCode = 'GRP' + (user?.phone?.slice(-4) || '1234');
  const allMembers = useMemo(() => [
    { id: 'admin', name: user?.name || 'You', phone: user?.phone || '', status: 'subscribed' as const, plan: 'Budget Daily Pack', share: 75 },
    ...members,
  ], [members, user]);
  const subscribedCount = allMembers.filter(m => m.status === 'subscribed').length;
  const totalMembers = allMembers.length;
  const discountUnlocked = totalMembers >= 5;
  const discountPct = discountUnlocked ? 10 : 0;

  const totalGroupCost = useMemo(() => {
    return allMembers.reduce((sum, m) => sum + (m.share || 0), 0);
  }, [allMembers]);

  const deliveryFee = 30;
  const splitDelivery = Math.ceil(deliveryFee / totalMembers);
  const perPersonSaving = discountUnlocked ? Math.round(totalGroupCost / totalMembers * 0.1) : 0;

  const handleAddMember = () => {
    if (!newName.trim()) { Alert.alert('Name Required'); return; }
    if (newPhone.trim().length < 10) { Alert.alert('Valid Phone Required'); return; }
    if (totalMembers >= 8) { Alert.alert('Group Full', 'Maximum 8 members per group.'); return; }
    setMembers(prev => [...prev, {
      id: `m_${Date.now()}`, name: newName.trim(), phone: newPhone.trim(), status: 'invited', share: 0,
    }]);
    setNewName('');
    setNewPhone('');
    setShowAddModal(false);
    Alert.alert('Invited!', `${newName.trim()} has been invited to the group.`);
  };

  const handleRemoveMember = (id: string) => {
    Alert.alert('Remove Member', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => setMembers(prev => prev.filter(m => m.id !== id)) },
    ]);
  };

  const handleShareGroup = async () => {
    const msg = `Join my Soruban Group Subscription!\n\nGroup: ${groupName}\nCode: ${groupCode}\nAddress: ${groupAddress}\n\n${totalMembers}/5 members joined. When 5+ subscribe, everyone gets 10% OFF + shared delivery!\n\nJoin now & save together!`;
    try {
      const url = `whatsapp://send?text=${encodeURIComponent(msg)}`;
      const supported = await Linking.canOpenURL(url);
      if (supported) await Linking.openURL(url);
      else await Share.share({ message: msg });
    } catch {
      await Share.share({ message: msg });
    }
  };

  return (
    <SafeAreaView style={[styles.safe, themed.safeArea]} edges={['bottom']}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <LinearGradient colors={['#1565C0', '#1976D2']} style={styles.header}>
        <SafeAreaView edges={['top']} style={{ backgroundColor: 'transparent' }}>
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
              <Icon name="arrow-left" size={24} color="#FFF" />
            </TouchableOpacity>
            <View style={{ flex: 1 }}>
              <Text style={styles.headerTitle}>Group Subscription</Text>
              <Text style={styles.headerSub}>{groupName} · {totalMembers} members</Text>
            </View>
            <TouchableOpacity onPress={() => setShowEditGroup(true)} style={styles.backBtn}>
              <Icon name="pencil" size={20} color="#FFF" />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Group Info Card */}
        <View style={[styles.groupInfoCard, themed.card]}>
          <View style={styles.groupCodeRow}>
            <View>
              <Text style={styles.groupCodeLabel}>Group Code</Text>
              <Text style={[styles.groupCodeText, themed.textPrimary]}>{groupCode}</Text>
            </View>
            <TouchableOpacity style={styles.shareCodeBtn} onPress={handleShareGroup}>
              <Icon name="whatsapp" size={18} color="#FFF" />
              <Text style={styles.shareCodeBtnText}>Invite</Text>
            </TouchableOpacity>
          </View>

          {/* Shared Address */}
          <View style={styles.addressRow}>
            <View style={styles.addressIcon}>
              <Icon name="map-marker" size={16} color="#FFF" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.addressLabel}>Shared Delivery Address</Text>
              <Text style={[styles.addressText, themed.textPrimary]}>{groupAddress}</Text>
            </View>
            <TouchableOpacity onPress={() => setShowEditGroup(true)}>
              <Icon name="pencil-outline" size={16} color={COLORS.text.muted} />
            </TouchableOpacity>
          </View>

          {/* Discount Progress */}
          <View style={styles.discountSection}>
            <View style={styles.discountHeader}>
              <Text style={styles.discountTitle}>{discountUnlocked ? '10% Group Discount Active!' : `${5 - totalMembers > 0 ? 5 - totalMembers : 0} more to unlock 10% discount`}</Text>
              <Text style={styles.discountCount}>{totalMembers}/5</Text>
            </View>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${Math.min((totalMembers / 5) * 100, 100)}%`, backgroundColor: discountUnlocked ? '#43A047' : '#1565C0' }]} />
            </View>
            {discountUnlocked && (
              <View style={styles.discountBadge}>
                <Icon name="party-popper" size={14} color="#FF6F00" />
                <Text style={styles.discountBadgeText}>Everyone saves {perPersonSaving > 0 ? `~\u20B9${perPersonSaving}` : '10%'} per delivery!</Text>
              </View>
            )}
          </View>
        </View>

        {/* Members */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, themed.textPrimary]}>Members ({totalMembers})</Text>
          <TouchableOpacity style={styles.addMemberBtn} onPress={() => setShowAddModal(true)}>
            <Icon name="account-plus" size={16} color="#FFF" />
            <Text style={styles.addMemberBtnText}>Add</Text>
          </TouchableOpacity>
        </View>

        {allMembers.map((member, idx) => {
          const cfg = STATUS_CONFIG[member.status];
          const isAdmin = member.id === 'admin';
          return (
            <View key={member.id} style={[styles.memberCard, themed.card]}>
              <View style={[styles.memberAvatar, { backgroundColor: AVATAR_COLORS[idx % AVATAR_COLORS.length] }]}>
                <Text style={styles.memberAvatarText}>{member.name[0].toUpperCase()}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text style={[styles.memberName, themed.textPrimary]}>{member.name}</Text>
                  {isAdmin && <View style={styles.adminBadge}><Text style={styles.adminBadgeText}>Admin</Text></View>}
                </View>
                {member.plan ? (
                  <Text style={styles.memberPlan}>{member.plan} · {'\u20B9'}{member.share}/day</Text>
                ) : (
                  <Text style={styles.memberPlan}>No plan selected yet</Text>
                )}
              </View>
              <View style={{ alignItems: 'flex-end', gap: 4 }}>
                <View style={[styles.statusBadge, { backgroundColor: cfg.bg }]}>
                  <Icon name={cfg.icon as any} size={10} color={cfg.color} />
                  <Text style={[styles.statusBadgeText, { color: cfg.color }]}>{cfg.label}</Text>
                </View>
                {!isAdmin && (
                  <TouchableOpacity onPress={() => handleRemoveMember(member.id)}>
                    <Icon name="close-circle-outline" size={18} color={COLORS.text.muted} />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          );
        })}

        {/* Split Payment Summary */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, themed.textPrimary]}>Payment Split</Text>
          <TouchableOpacity onPress={() => setShowSplitModal(true)}>
            <Text style={styles.viewDetailLink}>View Details</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.splitCard, themed.card]}>
          <View style={styles.splitRow}>
            <Text style={styles.splitLabel}>Total group cost/day</Text>
            <Text style={[styles.splitValue, themed.textPrimary]}>{'\u20B9'}{totalGroupCost}</Text>
          </View>
          <View style={styles.splitRow}>
            <Text style={styles.splitLabel}>Delivery fee (shared)</Text>
            <Text style={[styles.splitValue, themed.textPrimary]}>{'\u20B9'}{deliveryFee} ({'\u20B9'}{splitDelivery}/person)</Text>
          </View>
          {discountUnlocked && (
            <View style={styles.splitRow}>
              <Text style={[styles.splitLabel, { color: '#2E7D32' }]}>Group discount (10%)</Text>
              <Text style={[styles.splitValue, { color: '#2E7D32' }]}>-{'\u20B9'}{Math.round(totalGroupCost * 0.1)}</Text>
            </View>
          )}
          <View style={[styles.splitRow, styles.splitTotal]}>
            <Text style={[styles.splitLabel, { fontWeight: '800' }]}>Your daily cost</Text>
            <Text style={[styles.splitValue, { fontSize: 18, color: COLORS.primary }]}>
              {'\u20B9'}{Math.round((75 + splitDelivery) * (1 - discountPct / 100))}
            </Text>
          </View>
          <View style={styles.savingsRow}>
            <Icon name="piggy-bank" size={14} color="#FF6F00" />
            <Text style={styles.savingsText}>
              You save {'\u20B9'}{deliveryFee - splitDelivery + perPersonSaving}/day compared to ordering alone!
            </Text>
          </View>
        </View>

        {/* Benefits */}
        <Text style={[styles.sectionTitle, themed.textPrimary, { marginTop: SPACING.md }]}>Group Benefits</Text>
        <View style={[styles.benefitsCard, themed.card]}>
          {[
            { icon: 'percent', text: '10% off when 5+ members subscribe', color: '#E53935' },
            { icon: 'truck-delivery', text: 'Single delivery — split fee among all', color: '#F57C00' },
            { icon: 'map-marker-check', text: 'Same address — no confusion', color: '#1565C0' },
            { icon: 'food-variant', text: 'Each member picks their own plan', color: '#2E7D32' },
            { icon: 'calendar-sync', text: 'Flexible — pause or change plan anytime', color: '#7B1FA2' },
            { icon: 'account-group', text: 'Up to 8 members per group', color: '#00897B' },
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
        <TouchableOpacity style={styles.subscribeCta} onPress={() => router.push('/subscription-setup' as any)} activeOpacity={0.85}>
          <LinearGradient colors={['#1565C0', '#1976D2']} style={styles.subscribeCtaGrad}>
            <Icon name="cart-plus" size={20} color="#FFF" />
            <Text style={styles.subscribeCtaText}>Choose Your Plan & Subscribe</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity style={styles.whatsappCta} onPress={handleShareGroup} activeOpacity={0.85}>
          <Icon name="whatsapp" size={20} color="#25D366" />
          <Text style={styles.whatsappCtaText}>Share Group Invite on WhatsApp</Text>
        </TouchableOpacity>

        <View style={{ height: 30 }} />
      </ScrollView>

      {/* ━━━ Add Member Modal ━━━ */}
      <Modal visible={showAddModal} transparent animationType="slide" onRequestClose={() => setShowAddModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modal, themed.card]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, themed.textPrimary]}>Add Member</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <Icon name="close" size={22} color={COLORS.text.muted} />
              </TouchableOpacity>
            </View>
            <TextInput
              style={[styles.modalInput, themed.inputBg]}
              placeholder="Friend's name"
              placeholderTextColor={COLORS.text.muted}
              value={newName}
              onChangeText={setNewName}
            />
            <TextInput
              style={[styles.modalInput, themed.inputBg]}
              placeholder="Phone number"
              placeholderTextColor={COLORS.text.muted}
              value={newPhone}
              onChangeText={setNewPhone}
              keyboardType="phone-pad"
              maxLength={10}
            />
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <TouchableOpacity style={styles.modalSecondaryBtn} onPress={handleShareGroup}>
                <Icon name="whatsapp" size={16} color="#25D366" />
                <Text style={styles.modalSecondaryBtnText}>Invite via WhatsApp</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalPrimaryBtn} onPress={handleAddMember}>
                <Icon name="account-plus" size={16} color="#FFF" />
                <Text style={styles.modalPrimaryBtnText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ━━━ Split Detail Modal ━━━ */}
      <Modal visible={showSplitModal} transparent animationType="slide" onRequestClose={() => setShowSplitModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modal, themed.card]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, themed.textPrimary]}>Payment Split Details</Text>
              <TouchableOpacity onPress={() => setShowSplitModal(false)}>
                <Icon name="close" size={22} color={COLORS.text.muted} />
              </TouchableOpacity>
            </View>

            {allMembers.filter(m => m.status === 'subscribed').map((m, i) => (
              <View key={m.id} style={styles.splitDetailRow}>
                <View style={[styles.splitDetailAvatar, { backgroundColor: AVATAR_COLORS[i % AVATAR_COLORS.length] }]}>
                  <Text style={styles.splitDetailAvatarText}>{m.name[0]}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.splitDetailName, themed.textPrimary]}>{m.name}</Text>
                  <Text style={styles.splitDetailPlan}>{m.plan || 'No plan'}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={[styles.splitDetailAmount, themed.textPrimary]}>{'\u20B9'}{m.share || 0}</Text>
                  <Text style={styles.splitDetailDelivery}>+{'\u20B9'}{splitDelivery} delivery</Text>
                </View>
              </View>
            ))}

            <View style={styles.splitDetailTotal}>
              <Text style={styles.splitDetailTotalLabel}>Total Daily Cost</Text>
              <Text style={styles.splitDetailTotalValue}>{'\u20B9'}{totalGroupCost + deliveryFee}{discountUnlocked ? ` (-${'\u20B9'}${Math.round(totalGroupCost * 0.1)} discount)` : ''}</Text>
            </View>

            <TouchableOpacity style={[styles.modalPrimaryBtn, { flex: 0 }]} onPress={() => setShowSplitModal(false)}>
              <Text style={styles.modalPrimaryBtnText}>Got It</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ━━━ Edit Group Modal ━━━ */}
      <Modal visible={showEditGroup} transparent animationType="slide" onRequestClose={() => setShowEditGroup(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modal, themed.card]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, themed.textPrimary]}>Edit Group</Text>
              <TouchableOpacity onPress={() => setShowEditGroup(false)}>
                <Icon name="close" size={22} color={COLORS.text.muted} />
              </TouchableOpacity>
            </View>
            <Text style={styles.modalFieldLabel}>Group Name</Text>
            <TextInput
              style={[styles.modalInput, themed.inputBg]}
              placeholder="Group name"
              placeholderTextColor={COLORS.text.muted}
              value={groupName}
              onChangeText={setGroupName}
            />
            <Text style={styles.modalFieldLabel}>Shared Delivery Address</Text>
            <TextInput
              style={[styles.modalInput, themed.inputBg, { minHeight: 70, textAlignVertical: 'top' }]}
              placeholder="Hostel address..."
              placeholderTextColor={COLORS.text.muted}
              value={groupAddress}
              onChangeText={setGroupAddress}
              multiline
            />
            <TouchableOpacity style={[styles.modalPrimaryBtn, { flex: 0 }]} onPress={() => { setShowEditGroup(false); Alert.alert('Saved', 'Group details updated.'); }}>
              <Icon name="check" size={16} color="#FFF" />
              <Text style={styles.modalPrimaryBtnText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { paddingHorizontal: SPACING.base, paddingBottom: SPACING.md },
  headerRow: { flexDirection: 'row', alignItems: 'center', paddingTop: SPACING.sm, gap: 10 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#FFF' },
  headerSub: { fontSize: 11, color: 'rgba(255,255,255,0.8)', marginTop: 1 },
  scroll: { padding: SPACING.base },

  // Group Info
  groupInfoCard: { borderRadius: RADIUS.lg, padding: SPACING.base, marginBottom: SPACING.md, ...SHADOW.sm },
  groupCodeRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  groupCodeLabel: { fontSize: 10, color: COLORS.text.muted, fontWeight: '600' },
  groupCodeText: { fontSize: 22, fontWeight: '800', letterSpacing: 3, marginTop: 2 },
  shareCodeBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#25D366', borderRadius: RADIUS.full, paddingHorizontal: 16, paddingVertical: 10 },
  shareCodeBtnText: { fontSize: 13, fontWeight: '700', color: '#FFF' },

  addressRow: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#F5F5F5', borderRadius: RADIUS.md, padding: 12, marginBottom: 14 },
  addressIcon: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#F44336', justifyContent: 'center', alignItems: 'center' },
  addressLabel: { fontSize: 9, color: COLORS.text.muted, fontWeight: '600' },
  addressText: { fontSize: 12, fontWeight: '700', marginTop: 1 },

  discountSection: {},
  discountHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  discountTitle: { fontSize: 12, fontWeight: '700', color: '#1565C0' },
  discountCount: { fontSize: 12, fontWeight: '800', color: '#1565C0' },
  progressBar: { height: 8, backgroundColor: '#E0E0E0', borderRadius: 4, overflow: 'hidden', marginBottom: 8 },
  progressFill: { height: '100%', borderRadius: 4 },
  discountBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#FFF3E0', borderRadius: RADIUS.md, padding: 8 },
  discountBadgeText: { fontSize: 11, fontWeight: '700', color: '#E65100' },

  // Section
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: SPACING.sm },
  sectionTitle: { fontSize: 15, fontWeight: '800' },
  addMemberBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#1565C0', borderRadius: RADIUS.full, paddingHorizontal: 14, paddingVertical: 7 },
  addMemberBtnText: { fontSize: 12, fontWeight: '700', color: '#FFF' },
  viewDetailLink: { fontSize: 12, fontWeight: '700', color: '#1565C0' },

  // Member Card
  memberCard: { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: RADIUS.lg, padding: 14, marginBottom: 8, ...SHADOW.sm },
  memberAvatar: { width: 42, height: 42, borderRadius: 21, justifyContent: 'center', alignItems: 'center' },
  memberAvatarText: { fontSize: 16, fontWeight: '800', color: '#FFF' },
  memberName: { fontSize: 14, fontWeight: '700' },
  memberPlan: { fontSize: 11, color: COLORS.text.muted, marginTop: 2 },
  adminBadge: { backgroundColor: '#1565C0', borderRadius: 6, paddingHorizontal: 6, paddingVertical: 1 },
  adminBadgeText: { fontSize: 8, fontWeight: '800', color: '#FFF' },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 3, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  statusBadgeText: { fontSize: 9, fontWeight: '700' },

  // Split Payment
  splitCard: { borderRadius: RADIUS.lg, padding: SPACING.base, marginBottom: SPACING.md, ...SHADOW.sm },
  splitRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
  splitTotal: { borderTopWidth: 1, borderTopColor: '#E0E0E0', marginTop: 4, paddingTop: 12 },
  splitLabel: { fontSize: 13, color: COLORS.text.secondary },
  splitValue: { fontSize: 14, fontWeight: '700' },
  savingsRow: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#FFF3E0', borderRadius: RADIUS.md, padding: 10, marginTop: 8 },
  savingsText: { flex: 1, fontSize: 11, fontWeight: '700', color: '#E65100' },

  // Benefits
  benefitsCard: { borderRadius: RADIUS.lg, padding: SPACING.base, gap: 12, ...SHADOW.sm },
  benefitRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  benefitIcon: { width: 34, height: 34, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  benefitText: { flex: 1, fontSize: 12, fontWeight: '600' },

  // CTA
  subscribeCta: { borderRadius: RADIUS.lg, overflow: 'hidden', marginTop: SPACING.md },
  subscribeCtaGrad: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16 },
  subscribeCtaText: { fontSize: 15, fontWeight: '800', color: '#FFF' },
  whatsappCta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderWidth: 1.5, borderColor: '#25D366', borderRadius: RADIUS.lg, paddingVertical: 14, marginTop: 10 },
  whatsappCtaText: { fontSize: 14, fontWeight: '700', color: '#25D366' },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modal: { borderRadius: RADIUS.xl, padding: SPACING.lg },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  modalTitle: { fontSize: 17, fontWeight: '800' },
  modalFieldLabel: { fontSize: 12, fontWeight: '700', color: COLORS.text.muted, marginBottom: 4, marginTop: 8 },
  modalInput: { borderWidth: 1, borderColor: '#E0E0E0', borderRadius: RADIUS.md, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, marginBottom: 10 },
  modalPrimaryBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: '#1565C0', borderRadius: RADIUS.lg, paddingVertical: 14 },
  modalPrimaryBtnText: { fontSize: 14, fontWeight: '700', color: '#FFF' },
  modalSecondaryBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, borderWidth: 1.5, borderColor: '#25D366', borderRadius: RADIUS.lg, paddingVertical: 14 },
  modalSecondaryBtnText: { fontSize: 13, fontWeight: '700', color: '#25D366' },

  // Split Detail Modal
  splitDetailRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
  splitDetailAvatar: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  splitDetailAvatarText: { fontSize: 13, fontWeight: '800', color: '#FFF' },
  splitDetailName: { fontSize: 13, fontWeight: '700' },
  splitDetailPlan: { fontSize: 10, color: COLORS.text.muted },
  splitDetailAmount: { fontSize: 14, fontWeight: '800' },
  splitDetailDelivery: { fontSize: 9, color: COLORS.text.muted },
  splitDetailTotal: { backgroundColor: '#E3F2FD', borderRadius: RADIUS.md, padding: 12, marginVertical: 12, flexDirection: 'row', justifyContent: 'space-between' },
  splitDetailTotalLabel: { fontSize: 13, fontWeight: '700', color: '#1565C0' },
  splitDetailTotalValue: { fontSize: 13, fontWeight: '800', color: '#1565C0' },
});
