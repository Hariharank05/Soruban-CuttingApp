import React, { useState, useEffect, useRef, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Animated, Linking, Alert, Image, Modal, TextInput } from 'react-native';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, RADIUS, SHADOW } from '@/src/utils/theme';
import { useThemedStyles } from '@/src/utils/useThemedStyles';
import { useOrders } from '@/context/OrderContext';

const DELIVERY_PARTNER = {
  name: 'Rajesh Kumar',
  phone: '+91 98765 43210',
  rating: 4.8,
  totalDeliveries: 1240,
  vehicle: 'Bike',
  vehicleNumber: 'TN 38 AB 1234',
  avatar: 'R',
};

// Delivery OTP for verification
const DELIVERY_OTP = '4829';

// Simulated route steps
const ROUTE_STEPS = [
  { id: 1, label: 'Order Picked Up', sublabel: 'Partner picked up your order from store', icon: 'store', duration: 0 },
  { id: 2, label: 'On the Way', sublabel: 'Heading towards your location', icon: 'bike-fast', duration: 3 },
  { id: 3, label: 'Nearby', sublabel: 'Almost at your doorstep — 500m away', icon: 'map-marker-radius', duration: 2 },
  { id: 4, label: 'Arrived', sublabel: 'Delivery partner is at your door', icon: 'map-marker-check', duration: 1 },
  { id: 5, label: 'Delivered', sublabel: 'Order delivered successfully', icon: 'check-circle', duration: 0 },
];

// Proof photo placeholder

export default function DeliveryTrackingScreen() {
  const router = useRouter();
  const themed = useThemedStyles();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { orders } = useOrders();
  const order = useMemo(() => orders.find(o => o.id === id), [orders, id]);

  // Simulated tracking state
  const [currentStep, setCurrentStep] = useState(1);
  const [etaMinutes, setEtaMinutes] = useState(12);
  const [etaSeconds, setEtaSeconds] = useState(0);
  const [deliveryProgress, setDeliveryProgress] = useState(0.25);
  const [liveUpdates, setLiveUpdates] = useState([
    { time: formatTime(-8), text: 'Order picked up from Soruban Store', icon: 'store' },
    { time: formatTime(-5), text: 'Delivery partner is on the way', icon: 'bike-fast' },
  ]);

  // Payment check — OTP only for COD
  const isCOD = order?.paymentMethod === 'cod';

  // Delivery instructions
  const DELIVERY_INSTRUCTIONS = [
    { id: 'door', label: 'Leave at door', icon: 'door' },
    { id: 'bell', label: 'Ring the bell', icon: 'bell-ring' },
    { id: 'call', label: 'Call when arriving', icon: 'phone' },
    { id: 'guard', label: 'Give to security', icon: 'shield-account' },
  ];
  const [deliveryInstruction, setDeliveryInstruction] = useState('door');

  // New states for enhanced features
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
  const [showProofModal, setShowProofModal] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [ratingComment, setRatingComment] = useState('');
  const [isDelivered, setIsDelivered] = useState(false);
  const [showNotifBanner, setShowNotifBanner] = useState(false);
  const [notifText, setNotifText] = useState('');
  const notifAnim = useRef(new Animated.Value(-80)).current;

  const bikerAnim = useRef(new Animated.Value(0.25)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const etaBounce = useRef(new Animated.Value(1)).current;

  // Pulse animation for current location dot
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.4, duration: 800, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [pulseAnim]);

  // Simulate delivery progress
  useEffect(() => {
    const interval = setInterval(() => {
      setEtaSeconds(prev => {
        if (prev <= 0) {
          setEtaMinutes(m => {
            if (m <= 0) return 0;
            return m - 1;
          });
          return 59;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Show notification banner
  const showNotification = (text: string) => {
    setNotifText(text);
    setShowNotifBanner(true);
    Animated.sequence([
      Animated.timing(notifAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
      Animated.delay(3500),
      Animated.timing(notifAnim, { toValue: -80, duration: 300, useNativeDriver: true }),
    ]).start(() => setShowNotifBanner(false));
  };

  // Auto advance steps
  useEffect(() => {
    const timers = [
      setTimeout(() => {
        setCurrentStep(2);
        setDeliveryProgress(0.55);
        setEtaMinutes(8);
        Animated.spring(bikerAnim, { toValue: 0.55, useNativeDriver: false }).start();
        Animated.sequence([
          Animated.timing(etaBounce, { toValue: 1.2, duration: 200, useNativeDriver: true }),
          Animated.timing(etaBounce, { toValue: 1, duration: 200, useNativeDriver: true }),
        ]).start();
        setLiveUpdates(prev => [{ time: formatTime(0), text: 'Partner is 2 km away from your location', icon: 'map-marker-distance' }, ...prev]);
        showNotification('Your delivery boy is 8 mins away!');
      }, 15000),
      setTimeout(() => {
        setCurrentStep(3);
        setDeliveryProgress(0.8);
        setEtaMinutes(3);
        Animated.spring(bikerAnim, { toValue: 0.8, useNativeDriver: false }).start();
        Animated.sequence([
          Animated.timing(etaBounce, { toValue: 1.2, duration: 200, useNativeDriver: true }),
          Animated.timing(etaBounce, { toValue: 1, duration: 200, useNativeDriver: true }),
        ]).start();
        setLiveUpdates(prev => [{ time: formatTime(0), text: 'Delivery partner is nearby — 500m away!', icon: 'map-marker-radius' }, ...prev]);
        showNotification('Your delivery boy is almost there — 3 mins away!');
      }, 35000),
      setTimeout(() => {
        setCurrentStep(4);
        setDeliveryProgress(1);
        setEtaMinutes(0);
        setEtaSeconds(0);
        Animated.spring(bikerAnim, { toValue: 1, useNativeDriver: false }).start();

        if (isCOD) {
          // COD: Need OTP to verify cash collection
          setLiveUpdates(prev => [{ time: formatTime(0), text: 'Delivery partner arrived — share OTP to collect (COD)', icon: 'map-marker-check' }, ...prev]);
          showNotification('Delivery boy arrived! Share OTP to collect your order.');
          setShowOtpModal(true);
        } else {
          // Paid online: Auto-deliver, leave at door, take photo
          const instrLabel = DELIVERY_INSTRUCTIONS.find(i => i.id === deliveryInstruction)?.label || 'Leave at door';
          setLiveUpdates(prev => [
            { time: formatTime(0), text: `Order left at your door — ${instrLabel}`, icon: 'package-variant-closed' },
            { time: formatTime(0), text: 'Delivery partner arrived at your location', icon: 'map-marker-check' },
            ...prev,
          ]);
          showNotification('Your order has been delivered at your door!');
          // Auto-complete delivery after 2 seconds
          setTimeout(() => {
            setCurrentStep(5);
            setIsDelivered(true);
            setOtpVerified(true);
            setLiveUpdates(prev => [{ time: formatTime(0), text: 'Delivery photo proof uploaded', icon: 'camera' }, ...prev]);
            setTimeout(() => setShowProofModal(true), 1000);
          }, 2000);
        }
      }, 55000),
    ];
    return () => timers.forEach(clearTimeout);
  }, [bikerAnim, etaBounce]);

  if (!order) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={{ textAlign: 'center', marginTop: 60 }}>Order not found</Text>
      </SafeAreaView>
    );
  }

  const handleCallPartner = () => {
    Alert.alert('Call Delivery Partner', `Call ${DELIVERY_PARTNER.name}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Call', onPress: () => Linking.openURL(`tel:${DELIVERY_PARTNER.phone}`) },
    ]);
  };

  const handleOtpVerify = () => {
    if (otpInput === DELIVERY_OTP) {
      setOtpVerified(true);
      setShowOtpModal(false);
      // Simulate delivery completion after OTP
      setTimeout(() => {
        setCurrentStep(5);
        setIsDelivered(true);
        setLiveUpdates(prev => [
          { time: formatTime(0), text: 'Order delivered! Proof photo uploaded.', icon: 'check-circle' },
          { time: formatTime(0), text: 'OTP verified successfully', icon: 'shield-check' },
          ...prev,
        ]);
        showNotification('Order delivered successfully!');
        // Show proof photo after short delay
        setTimeout(() => setShowProofModal(true), 1500);
      }, 1000);
    } else {
      Alert.alert('Wrong OTP', 'Please enter the correct 4-digit OTP.');
      setOtpInput('');
    }
  };

  const handleRatingSubmit = () => {
    setShowRatingModal(false);
    Alert.alert('Thank You!', `You rated ${rating} stars. Your feedback helps us improve!`);
  };

  return (
    <SafeAreaView style={[styles.safe, themed.safeArea]} edges={['bottom']}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <LinearGradient colors={[COLORS.primary, '#2E7D32']} style={styles.header}>
        <SafeAreaView edges={['top']} style={{ backgroundColor: 'transparent' }}>
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
              <Icon name="arrow-left" size={24} color="#FFF" />
            </TouchableOpacity>
            <View style={{ flex: 1 }}>
              <Text style={styles.headerTitle}>Live Tracking</Text>
              <Text style={styles.headerSub}>Order #{order.id}</Text>
            </View>
            <TouchableOpacity onPress={handleCallPartner} style={styles.callBtnHeader}>
              <Icon name="phone" size={20} color="#FFF" />
            </TouchableOpacity>
          </View>

          {/* ETA Banner */}
          <Animated.View style={[styles.etaBanner, { transform: [{ scale: etaBounce }] }]}>
            <View style={styles.etaIconWrap}>
              <Icon name="clock-fast" size={28} color="#FFF" />
            </View>
            <View>
              <Text style={styles.etaLabel}>Estimated Arrival</Text>
              <Text style={styles.etaTime}>
                {etaMinutes > 0 ? `${etaMinutes} min ${etaSeconds.toString().padStart(2, '0')} sec` : 'Arrived!'}
              </Text>
            </View>
          </Animated.View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Map Simulation */}
        <View style={[styles.mapCard, themed.card]}>
          <LinearGradient colors={['#E8F5E9', '#C8E6C9', '#A5D6A7']} style={styles.mapArea}>
            {/* Road */}
            <View style={styles.roadContainer}>
              <View style={styles.road}>
                <View style={styles.roadDash} />
                <View style={styles.roadDash} />
                <View style={styles.roadDash} />
                <View style={styles.roadDash} />
                <View style={styles.roadDash} />
                <View style={styles.roadDash} />
                <View style={styles.roadDash} />
                <View style={styles.roadDash} />
              </View>

              {/* Store marker */}
              <View style={[styles.marker, styles.markerStore]}>
                <Icon name="store" size={18} color="#FFF" />
              </View>

              {/* Animated biker */}
              <Animated.View style={[styles.bikerMarker, {
                left: bikerAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['5%', '85%'],
                }),
              }]}>
                <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                  <View style={styles.bikerPulse} />
                </Animated.View>
                <View style={styles.bikerIcon}>
                  <Icon name="bike-fast" size={20} color="#FFF" />
                </View>
                <View style={styles.bikerLabel}>
                  <Text style={styles.bikerLabelText}>{etaMinutes > 0 ? `${etaMinutes} min` : 'Here!'}</Text>
                </View>
              </Animated.View>

              {/* Home marker */}
              <View style={[styles.marker, styles.markerHome]}>
                <Icon name="home" size={18} color="#FFF" />
              </View>
            </View>

            {/* Street labels */}
            <View style={styles.streetLabels}>
              <Text style={styles.streetText}>Chopify Store</Text>
              <Text style={styles.streetText}>{order.deliveryAddress?.split(',')[0] || 'Your Home'}</Text>
            </View>
          </LinearGradient>

          {/* Progress bar */}
          <View style={styles.progressBarWrap}>
            <View style={styles.progressBarBg}>
              <Animated.View style={[styles.progressBarFill, {
                width: bikerAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%'],
                }),
              }]} />
            </View>
            <Text style={styles.progressText}>{Math.round(deliveryProgress * 100)}% complete</Text>
          </View>
        </View>

        {/* Route Steps */}
        <View style={[styles.stepsCard, themed.card]}>
          <Text style={[styles.cardTitle, themed.textPrimary]}>Delivery Status</Text>
          {ROUTE_STEPS.map((step, idx) => {
            const isCompleted = step.id < currentStep;
            const isCurrent = step.id === currentStep;
            const isPending = step.id > currentStep;
            return (
              <View key={step.id} style={styles.stepRow}>
                <View style={styles.stepTimeline}>
                  <View style={[
                    styles.stepDot,
                    isCompleted && styles.stepDotCompleted,
                    isCurrent && styles.stepDotCurrent,
                    isPending && styles.stepDotPending,
                  ]}>
                    {isCompleted ? (
                      <Icon name="check" size={12} color="#FFF" />
                    ) : isCurrent ? (
                      <Icon name={step.icon as any} size={12} color="#FFF" />
                    ) : (
                      <Icon name={step.icon as any} size={12} color={COLORS.text.muted} />
                    )}
                  </View>
                  {idx < ROUTE_STEPS.length - 1 && (
                    <View style={[styles.stepLine, (isCompleted || isCurrent) && styles.stepLineActive]} />
                  )}
                </View>
                <View style={styles.stepContent}>
                  <Text style={[
                    styles.stepLabel,
                    (isCompleted || isCurrent) && styles.stepLabelActive,
                  ]}>
                    {step.label}
                    {isCurrent && <Text style={styles.stepCurrent}> (Current)</Text>}
                  </Text>
                  <Text style={styles.stepSublabel}>{step.sublabel}</Text>
                  {isCurrent && etaMinutes > 0 && (
                    <View style={styles.stepEta}>
                      <Icon name="clock-outline" size={12} color={COLORS.primary} />
                      <Text style={styles.stepEtaText}>{etaMinutes} min away</Text>
                    </View>
                  )}
                </View>
              </View>
            );
          })}
        </View>

        {/* Delivery Partner Card */}
        <View style={[styles.partnerCard, themed.card]}>
          <Text style={[styles.cardTitle, themed.textPrimary]}>Delivery Partner</Text>
          <View style={styles.partnerRow}>
            <View style={styles.partnerAvatar}>
              <Text style={styles.partnerAvatarText}>{DELIVERY_PARTNER.avatar}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.partnerName}>{DELIVERY_PARTNER.name}</Text>
              <View style={styles.partnerMeta}>
                <Icon name="star" size={12} color="#FFD700" />
                <Text style={styles.partnerRating}>{DELIVERY_PARTNER.rating}</Text>
                <Text style={styles.partnerDot}>·</Text>
                <Text style={styles.partnerTrips}>{DELIVERY_PARTNER.totalDeliveries} deliveries</Text>
              </View>
              <View style={styles.partnerVehicle}>
                <Icon name="motorbike" size={12} color={COLORS.text.muted} />
                <Text style={styles.partnerVehicleText}>{DELIVERY_PARTNER.vehicle} · {DELIVERY_PARTNER.vehicleNumber}</Text>
              </View>
            </View>
            <View style={styles.partnerActions}>
              <TouchableOpacity style={styles.partnerActionBtn} onPress={handleCallPartner}>
                <Icon name="phone" size={18} color={COLORS.primary} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.partnerActionBtn} onPress={() => {
                Alert.alert('Chat', 'Opening chat with delivery partner...');
              }}>
                <Icon name="message-text" size={18} color={COLORS.primary} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Live Updates */}
        <View style={[styles.updatesCard, themed.card]}>
          <View style={styles.updatesHeader}>
            <Icon name="broadcast" size={18} color={COLORS.primary} />
            <Text style={[styles.cardTitle, themed.textPrimary, { marginBottom: 0 }]}>Live Updates</Text>
            <View style={styles.liveDot} />
          </View>
          {liveUpdates.map((update, idx) => (
            <View key={idx} style={[styles.updateRow, idx === 0 && styles.updateRowLatest]}>
              <Text style={[styles.updateTime, idx === 0 && styles.updateTimeLatest]}>{update.time}</Text>
              {update.icon && <Icon name={update.icon as any} size={14} color={idx === 0 ? COLORS.primary : COLORS.text.muted} />}
              <Text style={[styles.updateText, idx === 0 && styles.updateTextLatest]}>{update.text}</Text>
            </View>
          ))}
        </View>

        {/* Order Summary Mini */}
        <View style={[styles.orderMini, themed.card]}>
          <View style={styles.orderMiniHeader}>
            <Icon name="package-variant" size={16} color={COLORS.primary} />
            <Text style={[styles.orderMiniTitle, themed.textPrimary]}>Order Summary</Text>
          </View>
          <Text style={styles.orderMiniItems}>
            {order.items.map(i => `${i.name} x${i.quantity}`).join(', ')}
          </Text>
          <View style={styles.orderMiniFooter}>
            <Text style={styles.orderMiniTotal}>Total: {'\u20B9'}{order.total}</Text>
            <Text style={styles.orderMiniPayment}>{order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Paid Online'}</Text>
          </View>
        </View>

        {/* Delivery Instructions — shown before arrival */}
        {currentStep < 4 && !isDelivered && (
          <View style={[styles.instrCard, themed.card]}>
            <Text style={[styles.cardTitle, themed.textPrimary]}>Delivery Instructions</Text>
            {!isCOD && (
              <Text style={styles.instrHint}>Paid online — delivery boy will follow your instruction if you're not available</Text>
            )}
            {isCOD && (
              <Text style={[styles.instrHint, { color: '#F57C00' }]}>Cash on Delivery — you need to be available to pay & collect</Text>
            )}
            <View style={styles.instrGrid}>
              {DELIVERY_INSTRUCTIONS.map(instr => {
                const selected = deliveryInstruction === instr.id;
                const disabled = isCOD && instr.id !== 'call' && instr.id !== 'bell';
                return (
                  <TouchableOpacity
                    key={instr.id}
                    style={[styles.instrChip, selected && styles.instrChipActive, disabled && { opacity: 0.35 }]}
                    onPress={() => !disabled && setDeliveryInstruction(instr.id)}
                    disabled={disabled}
                    activeOpacity={0.7}
                  >
                    <Icon name={instr.icon as any} size={18} color={selected ? '#FFF' : COLORS.text.muted} />
                    <Text style={[styles.instrChipText, selected && styles.instrChipTextActive]}>{instr.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* OTP Verification Card — shown when arrived, only for COD */}
        {currentStep === 4 && !otpVerified && isCOD && (
          <View style={[styles.otpCard, themed.card]}>
            <View style={styles.otpHeader}>
              <View style={styles.otpIconWrap}>
                <Icon name="shield-key" size={22} color="#FFF" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.otpTitle, themed.textPrimary]}>Share OTP with delivery partner</Text>
                <Text style={styles.otpSubtitle}>Required for Cash on Delivery verification</Text>
              </View>
            </View>
            <View style={styles.otpDisplay}>
              {DELIVERY_OTP.split('').map((d, i) => (
                <View key={i} style={styles.otpDigit}>
                  <Text style={styles.otpDigitText}>{d}</Text>
                </View>
              ))}
            </View>
            <Text style={styles.otpHint}>Show this code to {DELIVERY_PARTNER.name}</Text>
          </View>
        )}

        {/* Delivered Card — shown after delivery */}
        {isDelivered && (
          <View style={[styles.deliveredCard, themed.card]}>
            <LinearGradient colors={['#E8F5E9', '#C8E6C9']} style={styles.deliveredGrad}>
              <Icon name="check-circle" size={40} color={COLORS.primary} />
              <Text style={styles.deliveredTitle}>Order Delivered!</Text>
              <Text style={styles.deliveredSub}>Your fresh-cut vegetables have been delivered</Text>
              <View style={styles.deliveredActions}>
                <TouchableOpacity style={styles.proofBtn} onPress={() => setShowProofModal(true)}>
                  <Icon name="camera" size={16} color={COLORS.primary} />
                  <Text style={styles.proofBtnText}>View Proof Photo</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.rateBtn} onPress={() => setShowRatingModal(true)}>
                  <Icon name="star" size={16} color="#FFF" />
                  <Text style={styles.rateBtnText}>Rate Delivery</Text>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </View>
        )}

        {/* Delivery Address */}
        <View style={[styles.addressCard, themed.card]}>
          <View style={styles.addressRow}>
            <View style={styles.addressIconWrap}>
              <Icon name="map-marker" size={18} color="#FFF" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.addressLabel}>Delivering to</Text>
              <Text style={[styles.addressText, themed.textPrimary]}>{order.deliveryAddress}</Text>
            </View>
          </View>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>

      {/* ━━━ Notification Banner (Swiggy-style) ━━━ */}
      {showNotifBanner && (
        <Animated.View style={[styles.notifBanner, { transform: [{ translateY: notifAnim }] }]}>
          <SafeAreaView edges={['top']} style={{ backgroundColor: 'transparent' }}>
            <View style={styles.notifContent}>
              <View style={styles.notifIconWrap}>
                <Icon name="bike-fast" size={20} color="#FFF" />
              </View>
              <Text style={styles.notifText} numberOfLines={2}>{notifText}</Text>
            </View>
          </SafeAreaView>
        </Animated.View>
      )}

      {/* ━━━ OTP Input Modal — only for COD ━━━ */}
      <Modal visible={showOtpModal && isCOD} transparent animationType="slide" onRequestClose={() => setShowOtpModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.otpModal, themed.card]}>
            <View style={styles.otpModalIcon}>
              <Icon name="shield-key-outline" size={36} color={COLORS.primary} />
            </View>
            <Text style={[styles.otpModalTitle, themed.textPrimary]}>Delivery Partner Arrived!</Text>
            <Text style={styles.otpModalSub}>Share this OTP with {DELIVERY_PARTNER.name} to verify delivery</Text>

            <View style={styles.otpBigDisplay}>
              {DELIVERY_OTP.split('').map((d, i) => (
                <View key={i} style={styles.otpBigDigit}>
                  <Text style={styles.otpBigDigitText}>{d}</Text>
                </View>
              ))}
            </View>

            <Text style={styles.otpOrText}>Or enter OTP manually</Text>
            <TextInput
              style={[styles.otpInput, themed.textPrimary]}
              placeholder="Enter 4-digit OTP"
              placeholderTextColor={COLORS.text.muted}
              value={otpInput}
              onChangeText={t => setOtpInput(t.replace(/[^0-9]/g, '').slice(0, 4))}
              keyboardType="number-pad"
              maxLength={4}
            />

            <View style={{ flexDirection: 'row', gap: 10, marginTop: 16 }}>
              <TouchableOpacity style={styles.otpSkipBtn} onPress={() => setShowOtpModal(false)}>
                <Text style={styles.otpSkipBtnText}>Later</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.otpVerifyBtn, otpInput.length < 4 && { opacity: 0.4 }]}
                onPress={handleOtpVerify}
                disabled={otpInput.length < 4}
              >
                <Icon name="check" size={18} color="#FFF" />
                <Text style={styles.otpVerifyBtnText}>Verify</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ━━━ Photo Proof Modal ━━━ */}
      <Modal visible={showProofModal} transparent animationType="fade" onRequestClose={() => setShowProofModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.proofModal, themed.card]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <Text style={[styles.proofModalTitle, themed.textPrimary]}>Delivery Proof</Text>
              <TouchableOpacity onPress={() => { setShowProofModal(false); if (isDelivered && !rating) setTimeout(() => setShowRatingModal(true), 500); }}>
                <Icon name="close" size={22} color={COLORS.text.muted} />
              </TouchableOpacity>
            </View>
            {/* Proof Photo Placeholder */}
            <LinearGradient colors={['#E8F5E9', '#C8E6C9', '#A5D6A7']} style={styles.proofImagePlaceholder}>
              <View style={styles.proofPhotoIcon}>
                <Icon name="camera" size={32} color="#FFF" />
              </View>
              <Text style={styles.proofPhotoLabel}>Photo Proof Captured</Text>
              <Text style={styles.proofPhotoTime}>{formatTime(0)}</Text>
              <View style={styles.proofPhotoItems}>
                {order?.items.slice(0, 3).map((item, i) => (
                  <View key={i} style={styles.proofPhotoItem}>
                    <Icon name="check-circle" size={12} color={COLORS.primary} />
                    <Text style={styles.proofPhotoItemText}>{item.name} x{item.quantity}</Text>
                  </View>
                ))}
                {(order?.items.length || 0) > 3 && (
                  <Text style={styles.proofPhotoMore}>+{(order?.items.length || 0) - 3} more items</Text>
                )}
              </View>
            </LinearGradient>

            <View style={styles.proofInfo}>
              <View style={styles.proofInfoRow}>
                <View style={[styles.proofInfoIcon, { backgroundColor: '#E8F5E9' }]}>
                  <Icon name="clock-outline" size={14} color={COLORS.primary} />
                </View>
                <View>
                  <Text style={styles.proofInfoLabel}>Delivered at</Text>
                  <Text style={styles.proofInfoValue}>{formatTime(0)}</Text>
                </View>
              </View>
              <View style={styles.proofInfoRow}>
                <View style={[styles.proofInfoIcon, { backgroundColor: '#E3F2FD' }]}>
                  <Icon name="account-check" size={14} color="#1565C0" />
                </View>
                <View>
                  <Text style={styles.proofInfoLabel}>Delivered by</Text>
                  <Text style={styles.proofInfoValue}>{DELIVERY_PARTNER.name}</Text>
                </View>
              </View>
              <View style={styles.proofInfoRow}>
                <View style={[styles.proofInfoIcon, { backgroundColor: '#FFF3E0' }]}>
                  <Icon name="package-variant-closed" size={14} color="#F57C00" />
                </View>
                <View>
                  <Text style={styles.proofInfoLabel}>Instruction</Text>
                  <Text style={styles.proofInfoValue}>{DELIVERY_INSTRUCTIONS.find(i => i.id === deliveryInstruction)?.label || 'Left at door'}</Text>
                </View>
              </View>
              <View style={styles.proofInfoRow}>
                <View style={[styles.proofInfoIcon, { backgroundColor: '#E8F5E9' }]}>
                  <Icon name="shield-check" size={14} color={COLORS.primary} />
                </View>
                <View>
                  <Text style={styles.proofInfoLabel}>Payment</Text>
                  <Text style={styles.proofInfoValue}>{isCOD ? 'Cash collected & OTP verified' : 'Paid online'}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* ━━━ Rating Modal ━━━ */}
      <Modal visible={showRatingModal} transparent animationType="slide" onRequestClose={() => setShowRatingModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.ratingModal, themed.card]}>
            <Text style={[styles.ratingTitle, themed.textPrimary]}>Rate Your Delivery</Text>
            <Text style={styles.ratingSub}>How was your experience with {DELIVERY_PARTNER.name}?</Text>

            <View style={styles.starsRow}>
              {[1, 2, 3, 4, 5].map(s => (
                <TouchableOpacity key={s} onPress={() => setRating(s)} activeOpacity={0.7}>
                  <Icon
                    name={s <= rating ? 'star' : 'star-outline'}
                    size={40}
                    color={s <= rating ? '#FFD700' : '#E0E0E0'}
                  />
                </TouchableOpacity>
              ))}
            </View>
            {rating > 0 && (
              <Text style={styles.ratingLabel}>
                {rating === 1 ? 'Poor' : rating === 2 ? 'Fair' : rating === 3 ? 'Good' : rating === 4 ? 'Very Good' : 'Excellent!'}
              </Text>
            )}

            <TextInput
              style={[styles.ratingInput, themed.textPrimary]}
              placeholder="Add a comment (optional)"
              placeholderTextColor={COLORS.text.muted}
              value={ratingComment}
              onChangeText={setRatingComment}
              multiline
            />

            <View style={{ flexDirection: 'row', gap: 10, marginTop: 16 }}>
              <TouchableOpacity style={styles.otpSkipBtn} onPress={() => setShowRatingModal(false)}>
                <Text style={styles.otpSkipBtnText}>Skip</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.otpVerifyBtn, !rating && { opacity: 0.4 }]}
                onPress={handleRatingSubmit}
                disabled={!rating}
              >
                <Icon name="check" size={18} color="#FFF" />
                <Text style={styles.otpVerifyBtnText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function formatTime(offsetMinutes: number): string {
  const d = new Date(Date.now() + offsetMinutes * 60000);
  return d.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' });
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },

  // Header
  header: { paddingBottom: SPACING.md, paddingHorizontal: SPACING.base },
  headerRow: { flexDirection: 'row', alignItems: 'center', paddingTop: SPACING.sm, gap: 12 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#FFF' },
  headerSub: { fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 1 },
  callBtnHeader: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },

  // ETA Banner
  etaBanner: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: RADIUS.lg, padding: SPACING.md, marginTop: SPACING.md },
  etaIconWrap: { width: 50, height: 50, borderRadius: 25, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  etaLabel: { fontSize: 12, color: 'rgba(255,255,255,0.8)' },
  etaTime: { fontSize: 22, fontWeight: '800', color: '#FFF', marginTop: 2 },

  scroll: { padding: SPACING.base, paddingBottom: 20 },

  // Map Card
  mapCard: { backgroundColor: '#FFF', borderRadius: RADIUS.lg, overflow: 'hidden', marginBottom: SPACING.md, ...SHADOW.sm },
  mapArea: { height: 180, padding: SPACING.base, justifyContent: 'center' },
  roadContainer: { position: 'relative', height: 60, justifyContent: 'center' },
  road: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: 4, backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: 2, marginHorizontal: 20, paddingHorizontal: 4 },
  roadDash: { width: 20, height: 2, backgroundColor: 'rgba(0,0,0,0.15)', borderRadius: 1 },
  marker: { position: 'absolute', width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', ...SHADOW.sm },
  markerStore: { left: 0, backgroundColor: COLORS.primary },
  markerHome: { right: 0, backgroundColor: '#F44336' },
  bikerMarker: { position: 'absolute', top: -10, alignItems: 'center' },
  bikerPulse: { position: 'absolute', width: 50, height: 50, borderRadius: 25, backgroundColor: 'rgba(76, 175, 80, 0.2)' },
  bikerIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#FF9800', justifyContent: 'center', alignItems: 'center', ...SHADOW.md, zIndex: 2 },
  bikerLabel: { backgroundColor: '#333', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3, marginTop: 4 },
  bikerLabelText: { fontSize: 10, fontWeight: '700', color: '#FFF' },
  streetLabels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: SPACING.sm, paddingHorizontal: 4 },
  streetText: { fontSize: 10, fontWeight: '600', color: COLORS.text.secondary },

  // Progress Bar
  progressBarWrap: { paddingHorizontal: SPACING.base, paddingVertical: SPACING.sm },
  progressBarBg: { height: 6, backgroundColor: '#E0E0E0', borderRadius: 3, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: COLORS.primary, borderRadius: 3 },
  progressText: { fontSize: 11, color: COLORS.text.muted, marginTop: 4, textAlign: 'center' },

  // Steps
  stepsCard: { backgroundColor: '#FFF', borderRadius: RADIUS.lg, padding: SPACING.base, marginBottom: SPACING.md, ...SHADOW.sm },
  cardTitle: { fontSize: 15, fontWeight: '800', color: COLORS.text.primary, marginBottom: SPACING.md },
  stepRow: { flexDirection: 'row', marginBottom: 4 },
  stepTimeline: { width: 30, alignItems: 'center' },
  stepDot: { width: 26, height: 26, borderRadius: 13, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: COLORS.border, backgroundColor: '#FFF' },
  stepDotCompleted: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  stepDotCurrent: { backgroundColor: '#FF9800', borderColor: '#FF9800' },
  stepDotPending: { backgroundColor: '#FFF', borderColor: '#E0E0E0' },
  stepLine: { width: 2, height: 30, backgroundColor: '#E0E0E0', marginVertical: 2 },
  stepLineActive: { backgroundColor: COLORS.primary },
  stepContent: { flex: 1, marginLeft: 12, paddingBottom: 16 },
  stepLabel: { fontSize: 13, fontWeight: '700', color: COLORS.text.muted },
  stepLabelActive: { color: COLORS.text.primary },
  stepCurrent: { fontSize: 11, fontWeight: '800', color: '#FF9800' },
  stepSublabel: { fontSize: 11, color: COLORS.text.muted, marginTop: 2 },
  stepEta: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#E8F5E9', borderRadius: RADIUS.sm, paddingHorizontal: 8, paddingVertical: 4, alignSelf: 'flex-start', marginTop: 6 },
  stepEtaText: { fontSize: 11, fontWeight: '700', color: COLORS.primary },

  // Delivery Partner
  partnerCard: { backgroundColor: '#FFF', borderRadius: RADIUS.lg, padding: SPACING.base, marginBottom: SPACING.md, ...SHADOW.sm },
  partnerRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  partnerAvatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center' },
  partnerAvatarText: { fontSize: 20, fontWeight: '800', color: '#FFF' },
  partnerName: { fontSize: 15, fontWeight: '800', color: COLORS.text.primary },
  partnerMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 3 },
  partnerRating: { fontSize: 12, fontWeight: '700', color: COLORS.text.primary },
  partnerDot: { fontSize: 12, color: COLORS.text.muted },
  partnerTrips: { fontSize: 12, color: COLORS.text.muted },
  partnerVehicle: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 3 },
  partnerVehicleText: { fontSize: 11, color: COLORS.text.muted },
  partnerActions: { flexDirection: 'row', gap: 8 },
  partnerActionBtn: { width: 40, height: 40, borderRadius: 20, borderWidth: 1.5, borderColor: COLORS.primary, justifyContent: 'center', alignItems: 'center' },

  // Live Updates
  updatesCard: { backgroundColor: '#FFF', borderRadius: RADIUS.lg, padding: SPACING.base, marginBottom: SPACING.md, ...SHADOW.sm },
  updatesHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: SPACING.md },
  liveDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#F44336', marginLeft: 'auto' },
  updateRow: { flexDirection: 'row', gap: 10, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  updateRowLatest: { backgroundColor: '#E8F5E9', marginHorizontal: -SPACING.base, paddingHorizontal: SPACING.base, borderRadius: RADIUS.sm },
  updateTime: { fontSize: 11, fontWeight: '600', color: COLORS.text.muted, width: 65 },
  updateTimeLatest: { color: COLORS.primary },
  updateText: { fontSize: 12, color: COLORS.text.secondary, flex: 1 },
  updateTextLatest: { color: COLORS.text.primary, fontWeight: '700' },

  // Order Summary Mini
  orderMini: { backgroundColor: '#FFF', borderRadius: RADIUS.lg, padding: SPACING.base, marginBottom: SPACING.md, ...SHADOW.sm },
  orderMiniHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  orderMiniTitle: { fontSize: 14, fontWeight: '800', color: COLORS.text.primary },
  orderMiniItems: { fontSize: 12, color: COLORS.text.secondary, lineHeight: 18 },
  orderMiniFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: COLORS.border },
  orderMiniTotal: { fontSize: 15, fontWeight: '800', color: COLORS.primary },
  orderMiniPayment: { fontSize: 11, color: COLORS.text.muted, backgroundColor: '#F5F5F5', paddingHorizontal: 8, paddingVertical: 3, borderRadius: RADIUS.sm },

  // Address
  addressCard: { backgroundColor: '#FFF', borderRadius: RADIUS.lg, padding: SPACING.base, marginBottom: SPACING.md, ...SHADOW.sm },
  addressRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  addressIconWrap: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#F44336', justifyContent: 'center', alignItems: 'center' },
  addressLabel: { fontSize: 11, color: COLORS.text.muted },
  addressText: { fontSize: 13, fontWeight: '700', color: COLORS.text.primary, marginTop: 2 },

  // Notification Banner
  notifBanner: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 100, backgroundColor: '#333', paddingBottom: 10, paddingHorizontal: SPACING.base },
  notifContent: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingTop: 6 },
  notifIconWrap: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#FF9800', justifyContent: 'center', alignItems: 'center' },
  notifText: { flex: 1, fontSize: 13, fontWeight: '700', color: '#FFF' },

  // Delivery Instructions
  instrCard: { backgroundColor: '#FFF', borderRadius: RADIUS.lg, padding: SPACING.base, marginBottom: SPACING.md, ...SHADOW.sm },
  instrHint: { fontSize: 11, color: COLORS.text.muted, marginBottom: 10, marginTop: -6 },
  instrGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  instrChip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 10, borderRadius: RADIUS.full, borderWidth: 1.5, borderColor: '#E0E0E0', backgroundColor: '#FFF' },
  instrChipActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primary },
  instrChipText: { fontSize: 11, fontWeight: '700', color: COLORS.text.secondary },
  instrChipTextActive: { color: '#FFF' },

  // OTP Card
  otpCard: { backgroundColor: '#FFF', borderRadius: RADIUS.lg, padding: SPACING.base, marginBottom: SPACING.md, borderWidth: 2, borderColor: '#FF9800', ...SHADOW.sm },
  otpHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  otpIconWrap: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#FF9800', justifyContent: 'center', alignItems: 'center' },
  otpTitle: { fontSize: 14, fontWeight: '800' },
  otpSubtitle: { fontSize: 11, color: COLORS.text.muted, marginTop: 1 },
  otpDisplay: { flexDirection: 'row', justifyContent: 'center', gap: 12, marginBottom: 8 },
  otpDigit: { width: 48, height: 52, borderRadius: 12, backgroundColor: '#FFF3E0', borderWidth: 2, borderColor: '#FF9800', justifyContent: 'center', alignItems: 'center' },
  otpDigitText: { fontSize: 24, fontWeight: '800', color: '#E65100' },
  otpHint: { fontSize: 11, color: COLORS.text.muted, textAlign: 'center' },

  // Delivered Card
  deliveredCard: { borderRadius: RADIUS.lg, overflow: 'hidden', marginBottom: SPACING.md, ...SHADOW.sm },
  deliveredGrad: { padding: SPACING.lg, alignItems: 'center' },
  deliveredTitle: { fontSize: 20, fontWeight: '800', color: COLORS.primary, marginTop: 8 },
  deliveredSub: { fontSize: 12, color: COLORS.text.secondary, marginTop: 4 },
  deliveredActions: { flexDirection: 'row', gap: 10, marginTop: 16 },
  proofBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#FFF', borderRadius: RADIUS.full, paddingHorizontal: 16, paddingVertical: 10, borderWidth: 1, borderColor: COLORS.primary },
  proofBtnText: { fontSize: 12, fontWeight: '700', color: COLORS.primary },
  rateBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: COLORS.primary, borderRadius: RADIUS.full, paddingHorizontal: 16, paddingVertical: 10 },
  rateBtnText: { fontSize: 12, fontWeight: '700', color: '#FFF' },

  // Modal Common
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },

  // OTP Modal
  otpModal: { width: '100%', borderRadius: RADIUS.xl, padding: SPACING.lg, alignItems: 'center' },
  otpModalIcon: { width: 64, height: 64, borderRadius: 20, backgroundColor: '#E8F5E9', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  otpModalTitle: { fontSize: 18, fontWeight: '800', textAlign: 'center' },
  otpModalSub: { fontSize: 12, color: COLORS.text.muted, textAlign: 'center', marginTop: 4, marginBottom: 20 },
  otpBigDisplay: { flexDirection: 'row', gap: 14, marginBottom: 16 },
  otpBigDigit: { width: 52, height: 58, borderRadius: 14, backgroundColor: '#E8F5E9', borderWidth: 2, borderColor: COLORS.primary, justifyContent: 'center', alignItems: 'center' },
  otpBigDigitText: { fontSize: 28, fontWeight: '800', color: COLORS.primary },
  otpOrText: { fontSize: 11, color: COLORS.text.muted, marginBottom: 8 },
  otpInput: { width: '100%', borderWidth: 1.5, borderColor: '#E0E0E0', borderRadius: RADIUS.lg, paddingHorizontal: 16, paddingVertical: 12, fontSize: 18, fontWeight: '700', textAlign: 'center', letterSpacing: 8 },
  otpSkipBtn: { flex: 1, borderWidth: 1.5, borderColor: '#E0E0E0', borderRadius: RADIUS.lg, paddingVertical: 14, alignItems: 'center' },
  otpSkipBtnText: { fontSize: 14, fontWeight: '700', color: COLORS.text.muted },
  otpVerifyBtn: { flex: 1, flexDirection: 'row', backgroundColor: COLORS.primary, borderRadius: RADIUS.lg, paddingVertical: 14, alignItems: 'center', justifyContent: 'center', gap: 6 },
  otpVerifyBtnText: { fontSize: 14, fontWeight: '700', color: '#FFF' },

  // Photo Proof Modal
  proofModal: { width: '100%', borderRadius: RADIUS.xl, padding: SPACING.base, maxHeight: '85%' },
  proofModalTitle: { fontSize: 16, fontWeight: '800' },
  proofImagePlaceholder: { width: '100%', borderRadius: RADIUS.lg, padding: 24, alignItems: 'center', marginBottom: 14 },
  proofPhotoIcon: { width: 56, height: 56, borderRadius: 28, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  proofPhotoLabel: { fontSize: 15, fontWeight: '800', color: COLORS.primary },
  proofPhotoTime: { fontSize: 12, color: COLORS.text.secondary, marginTop: 2, marginBottom: 12 },
  proofPhotoItems: { alignSelf: 'stretch', gap: 6 },
  proofPhotoItem: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,255,255,0.7)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  proofPhotoItemText: { fontSize: 12, fontWeight: '600', color: COLORS.text.primary },
  proofPhotoMore: { fontSize: 11, color: COLORS.text.muted, marginLeft: 18 },
  proofInfo: { gap: 12 },
  proofInfoRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  proofInfoIcon: { width: 32, height: 32, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  proofInfoLabel: { fontSize: 10, color: COLORS.text.muted },
  proofInfoValue: { fontSize: 13, fontWeight: '700', color: COLORS.text.primary },

  // Rating Modal
  ratingModal: { width: '100%', borderRadius: RADIUS.xl, padding: SPACING.lg, alignItems: 'center' },
  ratingTitle: { fontSize: 18, fontWeight: '800' },
  ratingSub: { fontSize: 12, color: COLORS.text.muted, marginTop: 4, marginBottom: 20, textAlign: 'center' },
  starsRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  ratingLabel: { fontSize: 14, fontWeight: '700', color: '#FF9800', marginBottom: 12 },
  ratingInput: { width: '100%', borderWidth: 1.5, borderColor: '#E0E0E0', borderRadius: RADIUS.lg, paddingHorizontal: 14, paddingVertical: 12, fontSize: 13, minHeight: 60, textAlignVertical: 'top' },
});
