import React, { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput,
  StatusBar, Alert, Share, Linking, Modal,
} from 'react-native';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, RADIUS, SHADOW } from '@/src/utils/theme';
import { useThemedStyles } from '@/src/utils/useThemedStyles';
import { useLoyalty } from '@/context/LoyaltyContext';
import type { Referral } from '@/types';

const STEPS = [
  { icon: 'share-variant', label: 'Share Code', desc: 'Share your referral code with friends' },
  { icon: 'cart-outline', label: 'Friend Orders', desc: 'Your friend places their first order' },
  { icon: 'gift-outline', label: 'Both Earn \u20B950', desc: 'You and your friend both get \u20B950' },
];

const STATUS_CONFIG: Record<string, { label: string; bg: string; color: string }> = {
  pending: { label: 'Pending', bg: '#FFF3E0', color: '#F57C00' },
  joined: { label: 'Joined', bg: '#E3F2FD', color: '#1565C0' },
  first_order: { label: 'Ordered', bg: '#E8F5E9', color: '#388E3C' },
  rewarded: { label: 'Rewarded', bg: '#F3E5F5', color: '#7B1FA2' },
};

function maskPhone(phone: string): string {
  if (phone.length <= 4) return phone;
  return phone.slice(0, 2) + '****' + phone.slice(-2);
}

function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function ReferralScreen() {
  const router = useRouter();
  const themed = useThemedStyles();
  const { referrals, addReferral, getReferralCode } = useLoyalty();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [sending, setSending] = useState(false);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [groupMembers, setGroupMembers] = useState<{ name: string; phone: string }[]>([]);
  const [gmName, setGmName] = useState('');
  const [gmPhone, setGmPhone] = useState('');

  const referralCode = useMemo(() => getReferralCode(), [getReferralCode]);
  const groupCode = useMemo(() => 'GRP' + referralCode.slice(4), [referralCode]);

  const stats = useMemo(() => {
    const total = referrals.length;
    const successful = referrals.filter(r => r.status === 'rewarded').length;
    const earned = successful * 50;
    return { total, successful, earned };
  }, [referrals]);

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Use my referral code ${referralCode} on CutReady and we both get \u20B950! Download now.`,
      });
    } catch {}
  };

  const handleShareWhatsApp = async (message: string) => {
    const url = `whatsapp://send?text=${encodeURIComponent(message)}`;
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        await Share.share({ message });
      }
    } catch {
      await Share.share({ message });
    }
  };

  const handleShareSubscription = () => {
    const msg = `Hey! I'm using Soruban for fresh-cut veggies delivered daily. Use my code ${referralCode} and we both get \u20B950 off!\n\nThey have amazing subscription plans:\n- Gym diet plans\n- Hostel budget packs\n- Skincare nutrition\n- Diabetic friendly\n\nTry it: Use code ${referralCode}`;
    handleShareWhatsApp(msg);
  };

  const handleShareGroupInvite = () => {
    const msg = `Join my Soruban Group Subscription!\n\nGroup: ${groupName || 'My Group'}\nCode: ${groupCode}\n\nWhen 5 friends subscribe together, everyone gets 10% OFF on all deliveries!\n\nAlready ${groupMembers.length}/5 members joined. Join now!`;
    handleShareWhatsApp(msg);
  };

  const handleAddGroupMember = () => {
    if (!gmName.trim()) { Alert.alert('Name Required'); return; }
    if (gmPhone.trim().length < 10) { Alert.alert('Valid Phone Required'); return; }
    if (groupMembers.length >= 4) { Alert.alert('Group Full', 'Maximum 4 friends + you = 5 members'); return; }
    setGroupMembers(prev => [...prev, { name: gmName.trim(), phone: gmPhone.trim() }]);
    setGmName('');
    setGmPhone('');
    addReferral(gmName.trim(), gmPhone.trim());
  };

  const handleCreateGroup = () => {
    if (!groupName.trim()) { Alert.alert('Group Name Required', 'Enter a name for your group'); return; }
    if (groupMembers.length < 1) { Alert.alert('Add Members', 'Add at least 1 friend to create a group'); return; }
    setShowGroupModal(false);
    Alert.alert(
      'Group Created!',
      `"${groupName}" created with ${groupMembers.length} member${groupMembers.length > 1 ? 's' : ''}. Share the group code to invite more friends. Everyone gets 10% off when 5 members join!`,
      [{ text: 'Share on WhatsApp', onPress: handleShareGroupInvite }, { text: 'OK' }]
    );
  };

  const handleSendInvite = async () => {
    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();

    if (!trimmedName) { Alert.alert('Missing Name', 'Please enter your friend\'s name.'); return; }
    if (trimmedPhone.length < 10) { Alert.alert('Invalid Phone', 'Please enter a valid phone number.'); return; }

    setSending(true);
    try {
      await addReferral(trimmedName, trimmedPhone);
      setName('');
      setPhone('');
      Alert.alert('Invite Sent!', `Referral invite sent to ${trimmedName}.`);
    } catch {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const renderReferral = ({ item }: { item: Referral }) => {
    const cfg = STATUS_CONFIG[item.status] || STATUS_CONFIG.pending;
    return (
      <View style={[styles.refCard, themed.card]}>
        <View style={[styles.refAvatar, { backgroundColor: COLORS.primary + '15' }]}>
          <Icon name="account-outline" size={22} color={COLORS.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.refName, themed.textPrimary]}>{item.referredName}</Text>
          <Text style={styles.refPhone}>{maskPhone(item.referredPhone)}</Text>
          <Text style={styles.refDate}>{formatDate(item.date)}</Text>
        </View>
        <View style={[styles.badge, { backgroundColor: cfg.bg }]}>
          <Text style={[styles.badgeText, { color: cfg.color }]}>{cfg.label}</Text>
        </View>
      </View>
    );
  };

  const ListHeader = () => (
    <>
      {/* Hero Card */}
      <View style={styles.heroCard}>
        <LinearGradient colors={['#388E3C', '#4CAF50']} style={styles.heroGrad}>
          <Icon name="gift-outline" size={36} color="#FFF" />
          <Text style={styles.heroTitle}>Earn {'\u20B9'}50 for each friend</Text>
          <Text style={styles.heroSub}>Share your code and earn rewards when friends join</Text>

          <View style={styles.codeRow}>
            <View style={styles.codeBox}>
              <Text style={styles.codeText}>{referralCode}</Text>
            </View>
            <TouchableOpacity style={styles.shareBtn} onPress={handleShare} activeOpacity={0.8}>
              <Icon name="share-variant" size={18} color="#FFF" />
              <Text style={styles.shareBtnText}>Share</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>

      {/* How it works */}
      <Text style={[styles.sectionTitle, themed.textPrimary]}>How it Works</Text>
      <View style={styles.stepsRow}>
        {STEPS.map((step, i) => (
          <React.Fragment key={i}>
            <View style={[styles.stepCard, themed.card]}>
              <View style={[styles.stepIcon, { backgroundColor: COLORS.primary + '15' }]}>
                <Icon name={step.icon as any} size={22} color={COLORS.primary} />
              </View>
              <Text style={[styles.stepLabel, themed.textPrimary]}>{step.label}</Text>
              <Text style={styles.stepDesc}>{step.desc}</Text>
            </View>
            {i < STEPS.length - 1 && (
              <Icon name="chevron-right" size={16} color={COLORS.text.muted} style={styles.stepArrow} />
            )}
          </React.Fragment>
        ))}
      </View>

      {/* Invite Form */}
      <Text style={[styles.sectionTitle, themed.textPrimary]}>Invite a Friend</Text>
      <View style={[styles.formCard, themed.card]}>
        <TextInput
          style={[styles.input, themed.inputBg]}
          placeholder="Friend's name"
          placeholderTextColor={COLORS.text.muted}
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={[styles.input, themed.inputBg]}
          placeholder="Phone number"
          placeholderTextColor={COLORS.text.muted}
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          maxLength={13}
        />
        <TouchableOpacity
          style={[styles.inviteBtn, sending && { opacity: 0.6 }]}
          onPress={handleSendInvite}
          activeOpacity={0.8}
          disabled={sending}
        >
          <LinearGradient colors={['#388E3C', '#4CAF50']} style={styles.inviteBtnGrad}>
            <Icon name="send" size={16} color="#FFF" />
            <Text style={styles.inviteBtnText}>{sending ? 'Sending...' : 'Send Invite'}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Stats Card */}
      <View style={[styles.statsCard, themed.card]}>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, themed.textPrimary]}>{stats.total}</Text>
          <Text style={styles.statLabel}>Total Referrals</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={[styles.statValue, themed.textPrimary]}>{stats.successful}</Text>
          <Text style={styles.statLabel}>Successful</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: COLORS.green }]}>{'\u20B9'}{stats.earned}</Text>
          <Text style={styles.statLabel}>Total Earned</Text>
        </View>
      </View>

      {/* ━━━ Share Subscription Plan ━━━ */}
      <Text style={[styles.sectionTitle, themed.textPrimary]}>Share & Earn More</Text>
      <TouchableOpacity style={styles.whatsappCard} onPress={handleShareSubscription} activeOpacity={0.85}>
        <LinearGradient colors={['#25D366', '#128C7E']} style={styles.whatsappGrad}>
          <View style={styles.whatsappLeft}>
            <Icon name="whatsapp" size={28} color="#FFF" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.whatsappTitle}>Share on WhatsApp</Text>
            <Text style={styles.whatsappSub}>Share subscription plans with friends & earn {'\u20B9'}50 each</Text>
          </View>
          <Icon name="chevron-right" size={20} color="rgba(255,255,255,0.7)" />
        </LinearGradient>
      </TouchableOpacity>

      {/* ━━━ Hostel Group Subscription ━━━ */}
      <View style={[styles.groupCard, themed.card]}>
        <LinearGradient colors={['#1565C0', '#1976D2']} style={styles.groupHeader}>
          <Icon name="account-group" size={24} color="#FFF" />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.groupHeaderTitle}>Hostel Group Subscription</Text>
            <Text style={styles.groupHeaderSub}>5 friends subscribe together, everyone gets 10% OFF!</Text>
          </View>
        </LinearGradient>

        <View style={styles.groupBody}>
          {/* Group benefits */}
          <View style={styles.groupBenefits}>
            {[
              { icon: 'percent', text: '10% off for all 5 members', color: '#E53935' },
              { icon: 'truck-delivery', text: 'Shared delivery slot — save on delivery', color: '#F57C00' },
              { icon: 'food-apple', text: 'Each member picks their own plan', color: '#2E7D32' },
              { icon: 'currency-inr', text: 'Split & save — cheaper than ordering alone', color: '#7B1FA2' },
            ].map((b, i) => (
              <View key={i} style={styles.groupBenefitRow}>
                <View style={[styles.groupBenefitIcon, { backgroundColor: b.color + '15' }]}>
                  <Icon name={b.icon as any} size={14} color={b.color} />
                </View>
                <Text style={styles.groupBenefitText}>{b.text}</Text>
              </View>
            ))}
          </View>

          {/* Progress — how many members */}
          <View style={styles.groupProgress}>
            <View style={styles.groupProgressHeader}>
              <Text style={[styles.groupProgressTitle, themed.textPrimary]}>Group Members</Text>
              <Text style={styles.groupProgressCount}>{Math.min(groupMembers.length + 1, 5)}/5</Text>
            </View>
            <View style={styles.groupProgressBar}>
              <View style={[styles.groupProgressFill, { width: `${((groupMembers.length + 1) / 5) * 100}%` }]} />
            </View>
            <View style={styles.groupAvatars}>
              {/* You */}
              <View style={[styles.groupAvatar, { backgroundColor: COLORS.primary }]}>
                <Text style={styles.groupAvatarText}>You</Text>
              </View>
              {groupMembers.map((m, i) => (
                <View key={i} style={[styles.groupAvatar, { backgroundColor: ['#E91E63', '#FF9800', '#9C27B0', '#009688'][i % 4] }]}>
                  <Text style={styles.groupAvatarText}>{m.name[0]}</Text>
                </View>
              ))}
              {Array.from({ length: Math.max(0, 4 - groupMembers.length) }).map((_, i) => (
                <View key={`empty_${i}`} style={[styles.groupAvatar, styles.groupAvatarEmpty]}>
                  <Icon name="plus" size={14} color={COLORS.text.muted} />
                </View>
              ))}
            </View>
          </View>

          {/* Actions */}
          <View style={styles.groupActions}>
            <TouchableOpacity style={styles.groupCreateBtn} onPress={() => setShowGroupModal(true)} activeOpacity={0.85}>
              <Icon name="plus-circle" size={16} color="#FFF" />
              <Text style={styles.groupCreateBtnText}>Create / Manage Group</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.groupShareBtn} onPress={handleShareGroupInvite} activeOpacity={0.85}>
              <Icon name="whatsapp" size={16} color="#25D366" />
              <Text style={styles.groupShareBtnText}>Invite Friends</Text>
            </TouchableOpacity>
          </View>

          {groupMembers.length + 1 >= 5 && (
            <View style={styles.groupUnlocked}>
              <Icon name="party-popper" size={16} color="#FF6F00" />
              <Text style={styles.groupUnlockedText}>10% discount unlocked for all members!</Text>
            </View>
          )}
        </View>
      </View>

      {/* History header */}
      {referrals.length > 0 && (
        <Text style={[styles.sectionTitle, themed.textPrimary]}>Referral History</Text>
      )}
    </>
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
            <Text style={[styles.headerTitle, themed.textPrimary]}>Refer & Earn</Text>
            <View style={{ width: 40 }} />
          </View>
        </SafeAreaView>
      </LinearGradient>

      <FlatList
        data={referrals}
        keyExtractor={i => i.id}
        renderItem={renderReferral}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          referrals.length === 0 ? (
            <View style={styles.empty}>
              <Icon name="account-group-outline" size={48} color={COLORS.text.muted} />
              <Text style={styles.emptyText}>No referrals yet. Invite friends to get started!</Text>
            </View>
          ) : null
        }
      />

      {/* ━━━ Group Modal ━━━ */}
      <Modal visible={showGroupModal} animationType="slide" onRequestClose={() => setShowGroupModal(false)}>
        <SafeAreaView style={[styles.safe, themed.safeArea]} edges={['top', 'bottom']}>
          <LinearGradient colors={['#1565C0', '#1976D2']} style={styles.header}>
            <View style={styles.headerRow}>
              <TouchableOpacity onPress={() => setShowGroupModal(false)} style={styles.backBtn}>
                <Icon name="close" size={24} color="#FFF" />
              </TouchableOpacity>
              <Text style={[styles.headerTitle, { color: '#FFF' }]}>Group Subscription</Text>
              <View style={{ width: 40 }} />
            </View>
          </LinearGradient>

          <View style={{ flex: 1, padding: SPACING.base }}>
            {/* Group Name */}
            <Text style={[styles.gmLabel, themed.textPrimary]}>Group Name</Text>
            <TextInput
              style={[styles.input, themed.inputBg]}
              placeholder="e.g. Room 204 Gang, Gym Squad"
              placeholderTextColor={COLORS.text.muted}
              value={groupName}
              onChangeText={setGroupName}
            />

            {/* Group Code */}
            <View style={styles.gmCodeRow}>
              <Text style={styles.gmCodeLabel}>Group Code:</Text>
              <View style={styles.gmCodeBox}>
                <Text style={styles.gmCodeText}>{groupCode}</Text>
              </View>
            </View>

            {/* Add Member */}
            <Text style={[styles.gmLabel, themed.textPrimary, { marginTop: 16 }]}>Add Friends ({groupMembers.length}/4)</Text>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <TextInput
                style={[styles.input, themed.inputBg, { flex: 1, marginBottom: 0 }]}
                placeholder="Name"
                placeholderTextColor={COLORS.text.muted}
                value={gmName}
                onChangeText={setGmName}
              />
              <TextInput
                style={[styles.input, themed.inputBg, { flex: 1, marginBottom: 0 }]}
                placeholder="Phone"
                placeholderTextColor={COLORS.text.muted}
                value={gmPhone}
                onChangeText={setGmPhone}
                keyboardType="phone-pad"
              />
              <TouchableOpacity
                style={styles.gmAddBtn}
                onPress={handleAddGroupMember}
                disabled={groupMembers.length >= 4}
              >
                <Icon name="plus" size={20} color="#FFF" />
              </TouchableOpacity>
            </View>

            {/* Members List */}
            <View style={{ marginTop: 16, gap: 8 }}>
              {/* You */}
              <View style={[styles.gmMemberRow, themed.card]}>
                <View style={[styles.gmMemberAvatar, { backgroundColor: COLORS.primary }]}>
                  <Text style={styles.gmMemberAvatarText}>You</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.gmMemberName, themed.textPrimary]}>You (Admin)</Text>
                </View>
                <View style={[styles.badge, { backgroundColor: '#E8F5E9' }]}>
                  <Text style={[styles.badgeText, { color: COLORS.primary }]}>Joined</Text>
                </View>
              </View>

              {groupMembers.map((m, i) => (
                <View key={i} style={[styles.gmMemberRow, themed.card]}>
                  <View style={[styles.gmMemberAvatar, { backgroundColor: ['#E91E63', '#FF9800', '#9C27B0', '#009688'][i % 4] }]}>
                    <Text style={styles.gmMemberAvatarText}>{m.name[0]}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.gmMemberName, themed.textPrimary]}>{m.name}</Text>
                    <Text style={styles.gmMemberPhone}>{maskPhone(m.phone)}</Text>
                  </View>
                  <TouchableOpacity onPress={() => setGroupMembers(prev => prev.filter((_, idx) => idx !== i))}>
                    <Icon name="close-circle" size={20} color={COLORS.text.muted} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            {/* Discount preview */}
            <View style={[styles.gmDiscountCard, { backgroundColor: groupMembers.length >= 4 ? '#E8F5E9' : '#FFF3E0' }]}>
              <Icon name={groupMembers.length >= 4 ? 'check-circle' : 'information'} size={16} color={groupMembers.length >= 4 ? COLORS.primary : '#F57C00'} />
              <Text style={styles.gmDiscountText}>
                {groupMembers.length >= 4
                  ? 'All 5 members will get 10% OFF on every delivery!'
                  : `Add ${4 - groupMembers.length} more friend${4 - groupMembers.length > 1 ? 's' : ''} to unlock 10% group discount`}
              </Text>
            </View>
          </View>

          {/* Bottom Buttons */}
          <View style={{ padding: SPACING.base, gap: 10 }}>
            <TouchableOpacity style={styles.gmWhatsAppBtn} onPress={handleShareGroupInvite} activeOpacity={0.85}>
              <Icon name="whatsapp" size={18} color="#FFF" />
              <Text style={styles.gmWhatsAppBtnText}>Share Group Invite on WhatsApp</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.gmCreateBtn, !groupName.trim() && { opacity: 0.4 }]}
              onPress={handleCreateGroup}
              disabled={!groupName.trim()}
              activeOpacity={0.85}
            >
              <Icon name="check-circle" size={18} color="#FFF" />
              <Text style={styles.gmCreateBtnText}>Create Group</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  header: { paddingBottom: SPACING.md, paddingHorizontal: SPACING.base },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: SPACING.sm },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: COLORS.text.primary },
  list: { paddingHorizontal: SPACING.base, paddingBottom: 40 },
  sectionTitle: { fontSize: 15, fontWeight: '800', color: COLORS.text.primary, marginTop: SPACING.lg, marginBottom: SPACING.md },

  /* Hero */
  heroCard: { marginTop: SPACING.sm, borderRadius: RADIUS.xl, overflow: 'hidden', ...SHADOW.sm },
  heroGrad: { padding: SPACING.xl, alignItems: 'center' },
  heroTitle: { fontSize: 20, fontWeight: '800', color: '#FFF', marginTop: SPACING.sm },
  heroSub: { fontSize: 12, color: 'rgba(255,255,255,0.85)', marginTop: 4, textAlign: 'center' },
  codeRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: SPACING.md, width: '100%' },
  codeBox: {
    flex: 1, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: RADIUS.md,
    paddingVertical: 12, paddingHorizontal: SPACING.base, borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)', borderStyle: 'dashed',
  },
  codeText: { fontSize: 18, fontWeight: '800', color: '#FFF', textAlign: 'center', letterSpacing: 2 },
  shareBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: RADIUS.md, paddingVertical: 12, paddingHorizontal: SPACING.base,
  },
  shareBtnText: { fontSize: 13, fontWeight: '700', color: '#FFF' },

  /* Steps */
  stepsRow: { flexDirection: 'row', alignItems: 'center' },
  stepCard: {
    flex: 1, backgroundColor: '#FFF', borderRadius: RADIUS.lg, padding: SPACING.md,
    alignItems: 'center', ...SHADOW.sm,
  },
  stepIcon: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  stepLabel: { fontSize: 11, fontWeight: '700', color: COLORS.text.primary, textAlign: 'center' },
  stepDesc: { fontSize: 9, color: COLORS.text.muted, textAlign: 'center', marginTop: 2, lineHeight: 13 },
  stepArrow: { marginHorizontal: 2 },

  /* Form */
  formCard: { backgroundColor: '#FFF', borderRadius: RADIUS.lg, padding: SPACING.base, ...SHADOW.sm },
  input: {
    borderWidth: 1, borderColor: COLORS.border, borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.base, paddingVertical: 12, fontSize: 13,
    color: COLORS.text.primary, backgroundColor: '#F7F7F7', marginBottom: SPACING.sm,
  },
  inviteBtn: { borderRadius: RADIUS.md, overflow: 'hidden', marginTop: SPACING.xs },
  inviteBtnGrad: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, paddingVertical: 14,
  },
  inviteBtnText: { fontSize: 14, fontWeight: '700', color: '#FFF' },

  /* Stats */
  statsCard: {
    flexDirection: 'row', backgroundColor: '#FFF', borderRadius: RADIUS.lg,
    padding: SPACING.base, marginTop: SPACING.md, ...SHADOW.sm,
  },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 18, fontWeight: '800', color: COLORS.text.primary },
  statLabel: { fontSize: 10, color: COLORS.text.muted, marginTop: 2 },
  statDivider: { width: 1, backgroundColor: COLORS.border },

  /* Referral list */
  refCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#FFF', borderRadius: RADIUS.lg, padding: SPACING.base,
    marginBottom: SPACING.sm, ...SHADOW.sm,
  },
  refAvatar: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  refName: { fontSize: 13, fontWeight: '700', color: COLORS.text.primary },
  refPhone: { fontSize: 11, color: COLORS.text.muted, marginTop: 1 },
  refDate: { fontSize: 10, color: COLORS.text.muted, marginTop: 2 },
  badge: { borderRadius: RADIUS.sm, paddingHorizontal: 10, paddingVertical: 4 },
  badgeText: { fontSize: 10, fontWeight: '700' },

  /* WhatsApp Share */
  whatsappCard: { borderRadius: RADIUS.lg, overflow: 'hidden', marginBottom: SPACING.md, ...SHADOW.sm },
  whatsappGrad: { flexDirection: 'row', alignItems: 'center', padding: SPACING.base, gap: 12 },
  whatsappLeft: { width: 44, height: 44, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  whatsappTitle: { fontSize: 14, fontWeight: '800', color: '#FFF' },
  whatsappSub: { fontSize: 11, color: 'rgba(255,255,255,0.85)', marginTop: 2 },

  /* Group Subscription */
  groupCard: { borderRadius: RADIUS.lg, overflow: 'hidden', marginBottom: SPACING.md, ...SHADOW.sm },
  groupHeader: { flexDirection: 'row', alignItems: 'center', padding: SPACING.base },
  groupHeaderTitle: { fontSize: 15, fontWeight: '800', color: '#FFF' },
  groupHeaderSub: { fontSize: 11, color: 'rgba(255,255,255,0.85)', marginTop: 2 },
  groupBody: { padding: SPACING.base },
  groupBenefits: { gap: 8, marginBottom: 14 },
  groupBenefitRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  groupBenefitIcon: { width: 28, height: 28, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  groupBenefitText: { fontSize: 12, fontWeight: '600', color: COLORS.text.primary },
  groupProgress: { marginBottom: 14 },
  groupProgressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  groupProgressTitle: { fontSize: 12, fontWeight: '700' },
  groupProgressCount: { fontSize: 12, fontWeight: '800', color: '#1565C0' },
  groupProgressBar: { height: 6, backgroundColor: '#E0E0E0', borderRadius: 3, overflow: 'hidden', marginBottom: 10 },
  groupProgressFill: { height: '100%', backgroundColor: '#1565C0', borderRadius: 3 },
  groupAvatars: { flexDirection: 'row', gap: 8 },
  groupAvatar: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  groupAvatarEmpty: { borderWidth: 1.5, borderColor: '#E0E0E0', borderStyle: 'dashed', backgroundColor: '#FAFAFA' },
  groupAvatarText: { fontSize: 11, fontWeight: '800', color: '#FFF' },
  groupActions: { flexDirection: 'row', gap: 8 },
  groupCreateBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: '#1565C0', borderRadius: RADIUS.lg, paddingVertical: 12 },
  groupCreateBtnText: { fontSize: 12, fontWeight: '700', color: '#FFF' },
  groupShareBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: '#FFF', borderRadius: RADIUS.lg, paddingVertical: 12, borderWidth: 1.5, borderColor: '#25D366' },
  groupShareBtnText: { fontSize: 12, fontWeight: '700', color: '#25D366' },
  groupUnlocked: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#FFF3E0', borderRadius: RADIUS.md, padding: 10, marginTop: 10 },
  groupUnlockedText: { fontSize: 11, fontWeight: '700', color: '#E65100' },

  /* Group Modal */
  gmLabel: { fontSize: 13, fontWeight: '700', marginBottom: 6, marginTop: 4 },
  gmCodeRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 10 },
  gmCodeLabel: { fontSize: 12, color: COLORS.text.muted, fontWeight: '600' },
  gmCodeBox: { backgroundColor: '#E3F2FD', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 8, borderWidth: 1, borderColor: '#1565C0', borderStyle: 'dashed' },
  gmCodeText: { fontSize: 16, fontWeight: '800', color: '#1565C0', letterSpacing: 2 },
  gmAddBtn: { width: 44, height: 44, borderRadius: RADIUS.md, backgroundColor: '#1565C0', justifyContent: 'center', alignItems: 'center' },
  gmMemberRow: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 10, borderRadius: RADIUS.md },
  gmMemberAvatar: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  gmMemberAvatarText: { fontSize: 11, fontWeight: '800', color: '#FFF' },
  gmMemberName: { fontSize: 13, fontWeight: '700' },
  gmMemberPhone: { fontSize: 11, color: COLORS.text.muted },
  gmDiscountCard: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12, borderRadius: RADIUS.md, marginTop: 14 },
  gmDiscountText: { flex: 1, fontSize: 12, fontWeight: '600', color: COLORS.text.primary },
  gmWhatsAppBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#25D366', borderRadius: RADIUS.lg, paddingVertical: 14 },
  gmWhatsAppBtnText: { fontSize: 14, fontWeight: '700', color: '#FFF' },
  gmCreateBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#1565C0', borderRadius: RADIUS.lg, paddingVertical: 14 },
  gmCreateBtnText: { fontSize: 14, fontWeight: '700', color: '#FFF' },

  /* Empty */
  empty: { alignItems: 'center', paddingVertical: 40 },
  emptyText: { fontSize: 13, color: COLORS.text.muted, marginTop: 8, textAlign: 'center' },
});
