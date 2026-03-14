import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, StatusBar, Alert, TextInput, ScrollView, Switch } from 'react-native';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, RADIUS, SHADOW } from '@/src/utils/theme';
import { useCart } from '@/context/CartContext';

import { getCutLabel, getCutFee } from '@/data/cutTypes';
import { useThemedStyles } from '@/src/utils/useThemedStyles';
import { useCoupons } from '@/context/CouponContext';
import { useSavedCarts } from '@/context/SavedCartContext';
import { DISH_PACKS } from '@/data/dishPacks';
import productsData from '@/data/products.json';
import type { SubFrequency } from '@/types';

const WEEK_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;
const WEEK_DAY_FULL: Record<string, string> = { Mon: 'Monday', Tue: 'Tuesday', Wed: 'Wednesday', Thu: 'Thursday', Fri: 'Friday', Sat: 'Saturday', Sun: 'Sunday' };
const MONTHLY_DATE_OPTIONS = [1, 5, 10, 15, 20, 25];
const SUB_DISCOUNTS: Record<SubFrequency, number> = { daily: 10, weekly: 15, monthly: 20 };

export default function CartScreen() {
  const router = useRouter();
  const { cartItems, updateQuantity, removeFromCart, removePackFromCart, getSubtotal, getCuttingTotal, getItemCount } = useCart();
  const themed = useThemedStyles();
  const { appliedCoupon, applyCoupon, removeCoupon, calculateDiscount } = useCoupons();
  const { saveCart } = useSavedCarts();
  const [couponCode, setCouponCode] = useState('');
  const [couponMsg, setCouponMsg] = useState('');
  const [expandedPacks, setExpandedPacks] = useState<Set<string>>(new Set());

  // Subscription state
  const [orderType, setOrderType] = useState<'once' | 'subscribe'>('once');
  const [subFrequency, setSubFrequency] = useState<SubFrequency>('weekly');
  const [subWeeklyDay, setSubWeeklyDay] = useState('Mon');
  const [subMonthlyDates, setSubMonthlyDates] = useState<number[]>([1]);
  const [autoRepeatWeekly, setAutoRepeatWeekly] = useState(true);
  const [calendarMonth, setCalendarMonth] = useState(() => { const d = new Date(); return { year: d.getFullYear(), month: d.getMonth() }; });
  const [selectedDates, setSelectedDates] = useState<Set<string>>(new Set());

  // Calendar helpers
  const calendarDays = useMemo(() => {
    const { year, month } = calendarMonth;
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const blanks = (firstDay === 0 ? 6 : firstDay - 1); // Mon-start
    const days: (number | null)[] = Array(blanks).fill(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);
    return days;
  }, [calendarMonth]);

  const calendarLabel = useMemo(() => {
    const d = new Date(calendarMonth.year, calendarMonth.month);
    return d.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
  }, [calendarMonth]);

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  const toggleCalendarDate = useCallback((day: number) => {
    const dateStr = `${calendarMonth.year}-${String(calendarMonth.month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    if (dateStr < todayStr) return; // can't select past dates
    setSelectedDates(prev => {
      const next = new Set(prev);
      next.has(dateStr) ? next.delete(dateStr) : next.add(dateStr);
      return next;
    });
  }, [calendarMonth, todayStr]);

  const shiftMonth = useCallback((dir: number) => {
    setCalendarMonth(prev => {
      let m = prev.month + dir;
      let y = prev.year;
      if (m < 0) { m = 11; y--; }
      if (m > 11) { m = 0; y++; }
      return { year: y, month: m };
    });
  }, []);

  const togglePackExpand = (packId: string) => {
    setExpandedPacks(prev => {
      const next = new Set(prev);
      next.has(packId) ? next.delete(packId) : next.add(packId);
      return next;
    });
  };

  // Group cart items: individual items + grouped packs
  const { individualItems, packGroups } = useMemo(() => {
    const individual: typeof cartItems = [];
    const packs: Record<string, { packId: string; packName: string; items: typeof cartItems; packImage?: string }> = {};
    cartItems.forEach(item => {
      if (item.packId && item.packName) {
        if (!packs[item.packId]) {
          const dishPack = DISH_PACKS.find(p => p.id === item.packId);
          packs[item.packId] = { packId: item.packId, packName: item.packName, items: [], packImage: dishPack?.image };
        }
        packs[item.packId].items.push(item);
      } else {
        individual.push(item);
      }
    });
    return { individualItems: individual, packGroups: Object.values(packs) };
  }, [cartItems]);

  const MIN_ORDER = 100;
  const FREE_DELIVERY_THRESHOLD = 300;

  const subtotal = getSubtotal();
  const cuttingTotal = getCuttingTotal();
  const minOrderProgress = Math.min(subtotal / MIN_ORDER, 1);
  const freeDeliveryProgress = Math.min(subtotal / FREE_DELIVERY_THRESHOLD, 1);
  const couponDiscount = appliedCoupon ? calculateDiscount(appliedCoupon, subtotal) : 0;
  const deliveryFee = subtotal > 0 ? 25 : 0;
  const subDeliveryDiscount = orderType === 'subscribe' ? Math.round(deliveryFee * SUB_DISCOUNTS[subFrequency] / 100) : 0;
  const total = subtotal + deliveryFee - subDeliveryDiscount;

  const suggestions = useMemo(() => {
    const cartIds = cartItems.map(c => c.id);
    return productsData.filter(p => !cartIds.includes(p.id) && (p.category === 'Vegetables' || p.category === 'Fruits')).slice(0, 6);
  }, [cartItems]);

  const handleApplyCoupon = () => {
    const result = applyCoupon(couponCode, subtotal);
    setCouponMsg(result.message);
  };

  const handleSaveCart = () => {
    if (cartItems.length === 0) return;
    Alert.alert('Save Cart', 'Save current cart for later?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Save', onPress: () => { saveCart('My Cart ' + new Date().toLocaleDateString(), cartItems); Alert.alert('Saved!', 'Cart saved successfully.'); } },
    ]);
  };

  const calcItemPrice = (item: typeof cartItems[0]) => {
    let base = item.price;
    if (item.selectedWeight && item.unit.includes('kg')) base = Math.round((item.price * item.selectedWeight) / 1000);
    return base * item.quantity + getCutFee(item.cutType) * item.quantity;
  };

  const getWeightLabel = (item: typeof cartItems[0]) => {
    if (!item.selectedWeight) return item.unit;
    return item.selectedWeight >= 1000 ? `${item.selectedWeight / 1000} kg` : `${item.selectedWeight}g`;
  };

  const renderItem = ({ item }: { item: typeof cartItems[0] }) => (
    <View style={[styles.itemCard, themed.card]}>
      <View style={styles.itemImageWrap}>
        <Image source={{ uri: item.image }} style={styles.itemImage} resizeMode="cover" />
      </View>
      <View style={styles.itemBody}>
        <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.itemUnit}>{getWeightLabel(item)}</Text>
        {item.cutType && (
          <View style={styles.cutBadge}>
            <Text style={styles.cutBadgeText}>{getCutLabel(item.cutType)} (+{'\u20B9'}{getCutFee(item.cutType)})</Text>
          </View>
        )}
        {item.specialInstructions ? <Text style={styles.instructions} numberOfLines={1}>{'\uD83D\uDCDD'} {item.specialInstructions}</Text> : null}
        <View style={styles.itemBottom}>
          <Text style={styles.itemPrice}>{'\u20B9'}{calcItemPrice(item)}</Text>
          <View style={styles.qtyRow}>
            <TouchableOpacity style={styles.qtyBtn} onPress={() => updateQuantity(item.id, item.quantity - 1)}>
              <Icon name="minus" size={14} color={COLORS.primary} />
            </TouchableOpacity>
            <Text style={styles.qtyText}>{item.quantity}</Text>
            <TouchableOpacity style={styles.qtyBtn} onPress={() => updateQuantity(item.id, item.quantity + 1)}>
              <Icon name="plus" size={14} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <TouchableOpacity style={styles.removeBtn} onPress={() => removeFromCart(item.id)}>
        <Icon name="delete-outline" size={18} color={COLORS.status.error} />
      </TouchableOpacity>
    </View>
  );

  if (cartItems.length === 0) {
    return (
      <SafeAreaView style={[styles.safe, themed.safeArea]} edges={['top', 'bottom']}>
        <StatusBar barStyle="dark-content" />
        <LinearGradient colors={themed.headerGradient} style={styles.header}><Text style={[styles.headerTitle, themed.textPrimary]}>{'\uD83D\uDED2'} Your Cart</Text></LinearGradient>
        <View style={styles.emptyContainer}>
          <Icon name="cart-outline" size={64} color={COLORS.text.muted} />
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptyDesc}>Add fresh-cut vegetables & fruits to get started</Text>
          <TouchableOpacity style={styles.emptyBtn} onPress={() => router.push({ pathname: '/browse', params: { category: 'Vegetables' } })}>
            <Text style={styles.emptyBtnText}>Browse Items</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safe, themed.safeArea]} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" />
      <LinearGradient colors={themed.headerGradient} style={styles.header}><Text style={[styles.headerTitle, themed.textPrimary]}>{'\uD83D\uDED2'} Your Cart ({getItemCount()} items)</Text></LinearGradient>
      <ScrollView
        showsVerticalScrollIndicator
        scrollEventThrottle={16}
        contentContainerStyle={styles.list}
      >
        {/* Cart Items - scrollable container when >3 items */}
        {cartItems.length > 3 && (
          <View style={styles.cartItemsHeaderRow}>
            <Text style={styles.cartItemsCount}>{cartItems.length} items in cart</Text>
            <Text style={styles.cartScrollHint}>Scroll to see all</Text>
          </View>
        )}
        <View style={cartItems.length > 3 ? styles.cartItemsScrollWrap : undefined}>
          <ScrollView
            nestedScrollEnabled
            showsVerticalScrollIndicator={cartItems.length > 3}
            style={cartItems.length > 3 ? styles.cartItemsScroll : undefined}
          >
            {/* Pack groups */}
            {packGroups.map(group => {
              const isExpanded = expandedPacks.has(group.packId);
              const packTotal = group.items.reduce((sum, item) => sum + calcItemPrice(item), 0);
              return (
                <View key={group.packId} style={[styles.packGroupCard, themed.card]}>
                  <View style={styles.packGroupRow}>
                    <TouchableOpacity style={styles.packGroupHeader} activeOpacity={0.8} onPress={() => togglePackExpand(group.packId)}>
                      {group.packImage && <Image source={{ uri: group.packImage }} style={styles.packGroupImg} resizeMode="cover" />}
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.packGroupName, themed.textPrimary]}>{group.packName}</Text>
                        <Text style={styles.packGroupMeta}>{group.items.length} items · {'\u20B9'}{packTotal}</Text>
                      </View>
                      <Icon name={isExpanded ? 'chevron-up' : 'chevron-down'} size={20} color={COLORS.text.muted} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.packDeleteBtn}
                      onPress={() => Alert.alert('Remove Pack', `Remove "${group.packName}" and all its items from cart?`, [
                        { text: 'Cancel', style: 'cancel' },
                        { text: 'Remove', style: 'destructive', onPress: () => removePackFromCart(group.packId) },
                      ])}
                    >
                      <Icon name="delete-outline" size={20} color={COLORS.status.error} />
                    </TouchableOpacity>
                  </View>
                  {isExpanded && (
                    <View style={styles.packGroupItems}>
                      {group.items.map((item, idx) => (
                        <View key={`${item.id}_${idx}`}>{renderItem({ item })}</View>
                      ))}
                    </View>
                  )}
                </View>
              );
            })}
            {/* Individual items */}
            {individualItems.map((item, idx) => (
              <View key={`${item.id}_${idx}`}>
                {renderItem({ item })}
              </View>
            ))}
          </ScrollView>
        </View>

        {subtotal < MIN_ORDER && (
          <View style={styles.minOrderCard}>
            <View style={styles.minOrderRow}>
              <Icon name="information-outline" size={16} color="#E65100" />
              <Text style={styles.minOrderText}>Add ₹{MIN_ORDER - subtotal} more to place order (Min: ₹{MIN_ORDER})</Text>
            </View>
            <View style={styles.progressBarBg}><View style={[styles.progressBarFill, { width: `${minOrderProgress * 100}%` }]} /></View>
          </View>
        )}

        {subtotal < FREE_DELIVERY_THRESHOLD && (
          <View style={styles.freeDeliveryCard}>
            <View style={styles.minOrderRow}>
              <Icon name="truck-delivery-outline" size={16} color={COLORS.green} />
              <Text style={styles.freeDeliveryText}>Add ₹{FREE_DELIVERY_THRESHOLD - subtotal} more for FREE delivery</Text>
            </View>
            <View style={styles.progressBarBg}><View style={[styles.progressBarFill, { width: `${freeDeliveryProgress * 100}%`, backgroundColor: COLORS.green }]} /></View>
          </View>
        )}

        {/* ─── Subscribe & Save ─── */}
        <View style={[styles.subSection, themed.card]}>
          <View style={styles.subHeaderRow}>
            <Icon name="calendar-sync" size={20} color={COLORS.primary} />
            <Text style={[styles.subTitle, themed.textPrimary]}>Subscribe & Save</Text>
          </View>
          <Text style={styles.subDesc}>Get regular deliveries with up to 20% off on delivery</Text>

          {/* Order type toggle */}
          <View style={styles.orderTypeRow}>
            <TouchableOpacity style={[styles.orderTypeBtn, orderType === 'once' && styles.orderTypeBtnActive]} onPress={() => setOrderType('once')}>
              <Icon name="cart-outline" size={16} color={orderType === 'once' ? '#FFF' : COLORS.text.secondary} />
              <Text style={[styles.orderTypeBtnText, orderType === 'once' && styles.orderTypeBtnTextActive]}>One-time</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.orderTypeBtn, orderType === 'subscribe' && styles.orderTypeBtnActive]} onPress={() => setOrderType('subscribe')}>
              <Icon name="repeat" size={16} color={orderType === 'subscribe' ? '#FFF' : COLORS.text.secondary} />
              <Text style={[styles.orderTypeBtnText, orderType === 'subscribe' && styles.orderTypeBtnTextActive]}>Subscribe</Text>
            </TouchableOpacity>
          </View>

          {orderType === 'subscribe' && (
            <>
              {/* Frequency selector */}
              <Text style={styles.subLabel}>Delivery Frequency</Text>
              <View style={styles.freqRow}>
                {(['daily', 'weekly', 'monthly'] as SubFrequency[]).map(freq => (
                  <TouchableOpacity key={freq} style={[styles.freqPill, subFrequency === freq && styles.freqPillActive]} onPress={() => setSubFrequency(freq)}>
                    <Text style={[styles.freqPillText, subFrequency === freq && styles.freqPillTextActive]}>
                      {freq.charAt(0).toUpperCase() + freq.slice(1)}
                    </Text>
                    <View style={[styles.freqDiscount, subFrequency === freq && styles.freqDiscountActive]}>
                      <Text style={[styles.freqDiscountText, subFrequency === freq && styles.freqDiscountTextActive]}>{SUB_DISCOUNTS[freq]}% off</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Weekly: day selector + auto-repeat */}
              {subFrequency === 'weekly' && (
                <View style={styles.weekSection}>
                  <Text style={styles.subLabel}>Delivery Day</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.weekDayRow}>
                    {WEEK_DAYS.map(day => (
                      <TouchableOpacity key={day} style={[styles.weekDayBtn, subWeeklyDay === day && styles.weekDayBtnActive]} onPress={() => setSubWeeklyDay(day)}>
                        <Text style={[styles.weekDayText, subWeeklyDay === day && styles.weekDayTextActive]}>{day}</Text>
                        <Text style={[styles.weekDayFull, subWeeklyDay === day && { color: 'rgba(255,255,255,0.8)' }]}>{WEEK_DAY_FULL[day].slice(0, 3)}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                  <View style={styles.autoRepeatRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.autoRepeatLabel, themed.textPrimary]}>Auto-repeat every week</Text>
                      <Text style={styles.autoRepeatDesc}>Same items delivered every {WEEK_DAY_FULL[subWeeklyDay]}</Text>
                    </View>
                    <Switch
                      value={autoRepeatWeekly}
                      onValueChange={setAutoRepeatWeekly}
                      trackColor={{ false: '#E0E0E0', true: '#A5D6A7' }}
                      thumbColor={autoRepeatWeekly ? COLORS.green : '#BDBDBD'}
                    />
                  </View>
                </View>
              )}

              {/* Monthly: date chips */}
              {subFrequency === 'monthly' && (
                <View style={styles.monthSection}>
                  <Text style={styles.subLabel}>Delivery Dates (select one or more)</Text>
                  <View style={styles.monthDateRow}>
                    {MONTHLY_DATE_OPTIONS.map(d => {
                      const sel = subMonthlyDates.includes(d);
                      return (
                        <TouchableOpacity key={d} style={[styles.monthDateChip, sel && styles.monthDateChipActive]}
                          onPress={() => setSubMonthlyDates(prev => sel ? prev.filter(x => x !== d) : [...prev, d].sort((a, b) => a - b))}
                        >
                          <Text style={[styles.monthDateChipText, sel && styles.monthDateChipTextActive]}>{d}{d === 1 ? 'st' : d === 5 ? 'th' : 'th'}</Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              )}

              {/* Mini Calendar */}
              <Text style={[styles.subLabel, { marginTop: SPACING.md }]}>
                {subFrequency === 'daily' ? 'Start Date' : 'Select Delivery Dates'}
              </Text>
              <View style={styles.calendarCard}>
                <View style={styles.calHeaderRow}>
                  <TouchableOpacity onPress={() => shiftMonth(-1)} style={styles.calArrow}>
                    <Icon name="chevron-left" size={20} color={COLORS.text.secondary} />
                  </TouchableOpacity>
                  <Text style={[styles.calMonthLabel, themed.textPrimary]}>{calendarLabel}</Text>
                  <TouchableOpacity onPress={() => shiftMonth(1)} style={styles.calArrow}>
                    <Icon name="chevron-right" size={20} color={COLORS.text.secondary} />
                  </TouchableOpacity>
                </View>
                <View style={styles.calWeekHeader}>
                  {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map(d => (
                    <Text key={d} style={styles.calWeekHeaderText}>{d}</Text>
                  ))}
                </View>
                <View style={styles.calGrid}>
                  {calendarDays.map((day, idx) => {
                    if (day === null) return <View key={`b${idx}`} style={styles.calCell} />;
                    const dateStr = `${calendarMonth.year}-${String(calendarMonth.month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    const isPast = dateStr < todayStr;
                    const isToday = dateStr === todayStr;
                    const isSelected = selectedDates.has(dateStr);
                    return (
                      <TouchableOpacity
                        key={dateStr}
                        style={[styles.calCell, isToday && styles.calCellToday, isSelected && styles.calCellSelected, isPast && styles.calCellPast]}
                        onPress={() => toggleCalendarDate(day)}
                        disabled={isPast}
                      >
                        <Text style={[styles.calDayText, isToday && styles.calDayToday, isSelected && styles.calDaySelected, isPast && styles.calDayPast]}>{day}</Text>
                        {isSelected && <View style={styles.calDot} />}
                      </TouchableOpacity>
                    );
                  })}
                </View>
                {selectedDates.size > 0 && (
                  <Text style={styles.calSelectedCount}>{selectedDates.size} date{selectedDates.size > 1 ? 's' : ''} selected</Text>
                )}
              </View>

              {/* Subscription savings summary */}
              <View style={styles.subSavingsCard}>
                <Icon name="tag-outline" size={16} color={COLORS.green} />
                <Text style={styles.subSavingsText}>
                  You save {'\u20B9'}{Math.round(deliveryFee * SUB_DISCOUNTS[subFrequency] / 100)}/delivery with {subFrequency} subscription ({SUB_DISCOUNTS[subFrequency]}% off delivery)
                </Text>
              </View>
            </>
          )}
        </View>

        <View style={[styles.couponSection, themed.card]}>
          <Text style={[styles.couponTitle, themed.textPrimary]}>Apply Coupon</Text>
          <View style={styles.couponInputRow}>
            <TextInput style={styles.couponInput} placeholder="Enter code" placeholderTextColor={COLORS.text.muted} value={couponCode} onChangeText={setCouponCode} autoCapitalize="characters" />
            {appliedCoupon ? (
              <TouchableOpacity style={styles.couponRemoveBtn} onPress={() => { removeCoupon(); setCouponCode(''); setCouponMsg(''); }}>
                <Icon name="close" size={16} color={COLORS.status.error} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.couponApplyBtn} onPress={handleApplyCoupon}>
                <Text style={styles.couponApplyText}>APPLY</Text>
              </TouchableOpacity>
            )}
          </View>
          {couponMsg !== '' && <Text style={[styles.couponMsg, { color: appliedCoupon ? COLORS.green : COLORS.status.error }]}>{couponMsg}</Text>}
          {appliedCoupon && <Text style={styles.couponSaving}>You save ₹{couponDiscount}!</Text>}
          <TouchableOpacity onPress={() => router.push('/offers-coupons' as any)}><Text style={styles.viewCouponsLink}>View all coupons</Text></TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.saveCartBtn} onPress={handleSaveCart}>
          <Icon name="content-save-outline" size={18} color={COLORS.primary} />
          <Text style={styles.saveCartText}>Save Cart for Later</Text>
        </TouchableOpacity>

        {suggestions.length > 0 && (
          <View style={styles.suggestionsSection}>
            <Text style={[styles.suggestionsTitle, themed.textPrimary]}>You might also need</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.suggestionsScroll}>
              {suggestions.map(p => (
                <TouchableOpacity key={p.id} style={[styles.suggestionCard, themed.card]}
                  onPress={() => router.push({ pathname: '/product-detail', params: { id: p.id } })}>
                  <Image source={{ uri: p.image }} style={styles.suggestionImg} resizeMode="cover" />
                  <Text style={styles.suggestionName} numberOfLines={1}>{p.name}</Text>
                  <Text style={styles.suggestionPrice}>₹{p.price}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        <View style={[styles.billCard, themed.card]}>
          <Text style={[styles.billTitle, themed.textPrimary]}>Bill Summary</Text>
          <View style={styles.billRow}><Text style={styles.billLabel}>Items Total</Text><Text style={styles.billValue}>{'\u20B9'}{subtotal - cuttingTotal}</Text></View>
          {cuttingTotal > 0 && <View style={styles.billRow}><Text style={styles.billLabel}>{'\uD83D\uDD2A'} Cutting Charges</Text><Text style={[styles.billValue, { color: COLORS.primary }]}>{'\u20B9'}{cuttingTotal}</Text></View>}
          <View style={styles.billRow}><Text style={styles.billLabel}>Delivery Fee</Text><Text style={styles.billValue}>{'\u20B9'}{deliveryFee}</Text></View>
          {subDeliveryDiscount > 0 && (
            <View style={styles.billRow}><Text style={[styles.billLabel, { color: COLORS.green }]}>Subscription Discount ({SUB_DISCOUNTS[subFrequency]}%)</Text><Text style={[styles.billValue, { color: COLORS.green }]}>-{'\u20B9'}{subDeliveryDiscount}</Text></View>
          )}
          <View style={[styles.billRow, styles.billTotal]}><Text style={styles.billTotalLabel}>Total</Text><Text style={styles.billTotalValue}>{'\u20B9'}{total}</Text></View>
        </View>
      </ScrollView>
      <View style={[styles.checkoutBar, themed.card]}>
        <View>
          <Text style={[styles.checkoutTotal, themed.textPrimary]}>{'\u20B9'}{total}</Text>
          <Text style={styles.checkoutSub}>incl. cutting charges</Text>
        </View>
        <TouchableOpacity style={styles.checkoutBtn} onPress={() => {
          const params: Record<string, string> = {};
          if (orderType === 'subscribe') {
            params.orderType = 'subscribe';
            params.subFrequency = subFrequency;
            if (subFrequency === 'weekly') {
              params.subWeeklyDay = subWeeklyDay;
              params.autoRepeat = autoRepeatWeekly ? '1' : '0';
            }
            if (subFrequency === 'monthly') params.subMonthlyDates = subMonthlyDates.join(',');
            if (selectedDates.size > 0) params.selectedDates = Array.from(selectedDates).sort().join(',');
          }
          router.push({ pathname: '/checkout', params });
        }}>
          <Text style={styles.checkoutBtnText}>{orderType === 'subscribe' ? 'Subscribe & Checkout' : 'Proceed to Checkout'}</Text>
          <Icon name="chevron-right" size={18} color="#FFF" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  header: { paddingHorizontal: SPACING.base, paddingVertical: SPACING.md },
  headerTitle: { fontSize: 20, fontWeight: '800', color: COLORS.text.primary },
  list: { paddingHorizontal: SPACING.base, paddingTop: SPACING.sm, paddingBottom: 20 },
  cartItemsHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.sm },
  cartItemsCount: { fontSize: 12, fontWeight: '700', color: COLORS.text.secondary },
  cartScrollHint: { fontSize: 11, color: COLORS.text.muted, fontStyle: 'italic' },
  cartItemsScrollWrap: { borderRadius: RADIUS.lg, borderWidth: 1, borderColor: COLORS.border, overflow: 'hidden', marginBottom: SPACING.sm },
  cartItemsScroll: { maxHeight: 420 },
  packGroupCard: { backgroundColor: '#FFF', borderRadius: RADIUS.lg, marginBottom: SPACING.sm, overflow: 'hidden', ...SHADOW.sm },
  packGroupRow: { flexDirection: 'row', alignItems: 'center' },
  packGroupHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: SPACING.md, flex: 1 },
  packDeleteBtn: { padding: SPACING.sm, marginRight: 4 },
  packGroupImg: { width: 44, height: 44, borderRadius: RADIUS.md },
  packGroupName: { fontSize: 14, fontWeight: '700', color: COLORS.text.primary },
  packGroupMeta: { fontSize: 11, color: COLORS.text.muted, marginTop: 2 },
  packGroupItems: { borderTopWidth: 1, borderTopColor: COLORS.border, paddingTop: 4, paddingHorizontal: 4 },
  itemCard: { flexDirection: 'row', backgroundColor: '#FFF', borderRadius: RADIUS.lg, padding: SPACING.md, marginBottom: SPACING.sm, ...SHADOW.sm },
  itemImageWrap: { width: 60, height: 60, borderRadius: RADIUS.md, overflow: 'hidden' },
  itemImage: { width: '100%', height: '100%' },
  itemBody: { flex: 1, marginLeft: SPACING.md },
  itemName: { fontSize: 14, fontWeight: '700', color: COLORS.text.primary },
  itemUnit: { fontSize: 11, color: COLORS.text.muted, marginTop: 1 },
  cutBadge: { alignSelf: 'flex-start', backgroundColor: '#E8F5E9', borderRadius: RADIUS.sm, paddingHorizontal: 6, paddingVertical: 2, marginTop: 4, borderWidth: 1, borderColor: '#A5D6A7' },
  cutBadgeText: { fontSize: 10, fontWeight: '600', color: '#4CAF50' },
  instructions: { fontSize: 10, color: COLORS.text.muted, marginTop: 3 },
  itemBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 },
  itemPrice: { fontSize: 15, fontWeight: '800', color: COLORS.text.primary },
  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  qtyBtn: { width: 28, height: 28, borderRadius: 14, borderWidth: 1.5, borderColor: COLORS.primary, justifyContent: 'center', alignItems: 'center' },
  qtyText: { fontSize: 14, fontWeight: '700', color: COLORS.text.primary, minWidth: 20, textAlign: 'center' },
  removeBtn: { padding: 4 },
  billCard: { backgroundColor: '#FFF', borderRadius: RADIUS.lg, padding: SPACING.base, marginTop: SPACING.md, ...SHADOW.sm },
  billTitle: { fontSize: 15, fontWeight: '800', color: COLORS.text.primary, marginBottom: SPACING.md },
  billRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  billLabel: { fontSize: 13, color: COLORS.text.secondary },
  billValue: { fontSize: 13, fontWeight: '600', color: COLORS.text.primary },
  billTotal: { borderTopWidth: 1, borderTopColor: COLORS.border, marginTop: 6, paddingTop: 10 },
  billTotalLabel: { fontSize: 15, fontWeight: '800', color: COLORS.text.primary },
  billTotalValue: { fontSize: 17, fontWeight: '800', color: COLORS.primary },
  checkoutBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFF', paddingHorizontal: SPACING.base, paddingVertical: SPACING.md, paddingBottom: 80, borderTopWidth: 1, borderTopColor: COLORS.border, ...SHADOW.floating },
  checkoutTotal: { fontSize: 18, fontWeight: '800', color: COLORS.text.primary },
  checkoutSub: { fontSize: 10, color: COLORS.text.muted },
  checkoutBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: COLORS.primary, borderRadius: RADIUS.full, paddingHorizontal: 20, paddingVertical: 12 },
  checkoutBtnText: { fontSize: 14, fontWeight: '700', color: '#FFF' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: SPACING.xxl },
  emptyTitle: { fontSize: 18, fontWeight: '800', color: COLORS.text.primary, marginTop: SPACING.base },
  emptyDesc: { fontSize: 13, color: COLORS.text.muted, textAlign: 'center', marginTop: 4 },
  emptyBtn: { backgroundColor: COLORS.primary, borderRadius: RADIUS.full, paddingHorizontal: 24, paddingVertical: 12, marginTop: SPACING.lg },
  emptyBtnText: { fontSize: 14, fontWeight: '700', color: '#FFF' },
  minOrderCard: { marginTop: SPACING.md, backgroundColor: '#FFF3E0', borderRadius: RADIUS.lg, padding: SPACING.md },
  minOrderRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  minOrderText: { fontSize: 12, fontWeight: '600', color: '#E65100', flex: 1 },
  progressBarBg: { height: 4, backgroundColor: '#E0E0E0', borderRadius: 2 },
  progressBarFill: { height: 4, backgroundColor: '#FF9800', borderRadius: 2 },
  freeDeliveryCard: { marginTop: SPACING.sm, backgroundColor: '#E8F5E9', borderRadius: RADIUS.lg, padding: SPACING.md },
  freeDeliveryText: { fontSize: 12, fontWeight: '600', color: COLORS.green, flex: 1 },
  couponSection: { marginTop: SPACING.md, backgroundColor: '#FFF', borderRadius: RADIUS.lg, padding: SPACING.base, ...SHADOW.sm },
  couponTitle: { fontSize: 14, fontWeight: '800', color: COLORS.text.primary, marginBottom: SPACING.sm },
  couponInputRow: { flexDirection: 'row', gap: 8 },
  couponInput: { flex: 1, borderWidth: 1, borderColor: COLORS.border, borderRadius: RADIUS.md, paddingHorizontal: 12, paddingVertical: 8, fontSize: 13, borderStyle: 'dashed' },
  couponApplyBtn: { backgroundColor: COLORS.green, borderRadius: RADIUS.md, paddingHorizontal: 16, justifyContent: 'center' },
  couponApplyText: { fontSize: 12, fontWeight: '800', color: '#FFF' },
  couponRemoveBtn: { width: 36, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: COLORS.status.error, borderRadius: RADIUS.md },
  couponMsg: { fontSize: 11, marginTop: 6 },
  couponSaving: { fontSize: 12, fontWeight: '700', color: COLORS.green, marginTop: 4 },
  viewCouponsLink: { fontSize: 12, fontWeight: '700', color: COLORS.primary, marginTop: 8 },
  saveCartBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: SPACING.md, paddingVertical: 10, borderWidth: 1, borderColor: COLORS.primary, borderRadius: RADIUS.lg, borderStyle: 'dashed' },
  saveCartText: { fontSize: 13, fontWeight: '700', color: COLORS.primary },
  suggestionsSection: { marginTop: SPACING.lg },
  suggestionsTitle: { fontSize: 15, fontWeight: '800', color: COLORS.text.primary, marginBottom: SPACING.md },
  suggestionsScroll: { gap: 8, paddingBottom: 4 },
  suggestionCard: { width: 90, backgroundColor: '#FFF', borderRadius: RADIUS.md, overflow: 'hidden', ...SHADOW.sm },
  suggestionImg: { width: 90, height: 60 },
  suggestionName: { fontSize: 10, fontWeight: '600', color: COLORS.text.primary, paddingHorizontal: 4, paddingTop: 4 },
  suggestionPrice: { fontSize: 11, fontWeight: '800', color: COLORS.primary, paddingHorizontal: 4, paddingBottom: 4 },
  // Subscribe & Save styles
  subSection: { marginTop: SPACING.md, backgroundColor: '#FFF', borderRadius: RADIUS.lg, padding: SPACING.base, ...SHADOW.sm },
  subHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  subTitle: { fontSize: 15, fontWeight: '800', color: COLORS.text.primary },
  subDesc: { fontSize: 11, color: COLORS.text.muted, marginBottom: SPACING.md },
  subLabel: { fontSize: 12, fontWeight: '700', color: COLORS.text.secondary, marginBottom: 8 },
  orderTypeRow: { flexDirection: 'row', gap: 8, marginBottom: SPACING.md },
  orderTypeBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, borderRadius: RADIUS.full, backgroundColor: '#F5F5F5', borderWidth: 1.5, borderColor: '#E0E0E0' },
  orderTypeBtnActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  orderTypeBtnText: { fontSize: 13, fontWeight: '700', color: COLORS.text.secondary },
  orderTypeBtnTextActive: { color: '#FFF' },
  freqRow: { flexDirection: 'row', gap: 8, marginBottom: SPACING.md },
  freqPill: { flex: 1, alignItems: 'center', paddingVertical: 10, borderRadius: RADIUS.lg, backgroundColor: '#F5F5F5', borderWidth: 1.5, borderColor: '#E0E0E0', gap: 4 },
  freqPillActive: { backgroundColor: '#E8F5E9', borderColor: COLORS.green },
  freqPillText: { fontSize: 12, fontWeight: '700', color: COLORS.text.secondary },
  freqPillTextActive: { color: COLORS.green },
  freqDiscount: { backgroundColor: '#E0E0E0', borderRadius: RADIUS.sm, paddingHorizontal: 6, paddingVertical: 1 },
  freqDiscountActive: { backgroundColor: COLORS.green },
  freqDiscountText: { fontSize: 9, fontWeight: '700', color: COLORS.text.muted },
  freqDiscountTextActive: { color: '#FFF' },
  weekSection: { marginBottom: SPACING.sm },
  weekDayRow: { gap: 6, paddingVertical: 2 },
  weekDayBtn: { width: 52, height: 52, borderRadius: RADIUS.md, backgroundColor: '#F5F5F5', alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: '#E0E0E0' },
  weekDayBtnActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  weekDayText: { fontSize: 14, fontWeight: '800', color: COLORS.text.secondary },
  weekDayTextActive: { color: '#FFF' },
  weekDayFull: { fontSize: 9, color: COLORS.text.muted, marginTop: 1 },
  autoRepeatRow: { flexDirection: 'row', alignItems: 'center', marginTop: SPACING.md, backgroundColor: '#F1F8E9', borderRadius: RADIUS.md, padding: 12 },
  autoRepeatLabel: { fontSize: 13, fontWeight: '700', color: COLORS.text.primary },
  autoRepeatDesc: { fontSize: 11, color: COLORS.text.muted, marginTop: 2 },
  monthSection: { marginBottom: SPACING.sm },
  monthDateRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  monthDateChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: RADIUS.full, backgroundColor: '#F5F5F5', borderWidth: 1.5, borderColor: '#E0E0E0' },
  monthDateChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  monthDateChipText: { fontSize: 12, fontWeight: '700', color: COLORS.text.secondary },
  monthDateChipTextActive: { color: '#FFF' },
  // Calendar styles
  calendarCard: { backgroundColor: '#FAFAFA', borderRadius: RADIUS.lg, padding: SPACING.md, borderWidth: 1, borderColor: COLORS.border },
  calHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.sm },
  calMonthLabel: { fontSize: 14, fontWeight: '800', color: COLORS.text.primary },
  calArrow: { padding: 4 },
  calWeekHeader: { flexDirection: 'row', marginBottom: 4 },
  calWeekHeaderText: { flex: 1, textAlign: 'center', fontSize: 10, fontWeight: '700', color: COLORS.text.muted },
  calGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  calCell: { width: '14.28%', aspectRatio: 1, alignItems: 'center', justifyContent: 'center' },
  calCellToday: { borderWidth: 1.5, borderColor: COLORS.primary, borderRadius: 20 },
  calCellSelected: { backgroundColor: COLORS.primary, borderRadius: 20 },
  calCellPast: { opacity: 0.3 },
  calDayText: { fontSize: 12, fontWeight: '600', color: COLORS.text.primary },
  calDayToday: { color: COLORS.primary, fontWeight: '800' },
  calDaySelected: { color: '#FFF', fontWeight: '800' },
  calDayPast: { color: COLORS.text.muted },
  calDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#FFF', marginTop: 1 },
  calSelectedCount: { fontSize: 11, fontWeight: '600', color: COLORS.primary, textAlign: 'center', marginTop: 8 },
  subSavingsCard: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: SPACING.md, backgroundColor: '#E8F5E9', borderRadius: RADIUS.md, padding: 10 },
  subSavingsText: { fontSize: 11, fontWeight: '600', color: COLORS.green, flex: 1 },
});
