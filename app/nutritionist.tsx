import React, { useState, useRef, useMemo, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar,
  TextInput, KeyboardAvoidingView, Platform, Animated,
} from 'react-native';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, RADIUS, SHADOW } from '@/src/utils/theme';
import { useThemedStyles } from '@/src/utils/useThemedStyles';
import { useOrders } from '@/context/OrderContext';
import { useDiet } from '@/context/DietContext';
import productsData from '@/data/products.json';

/* ─── Simulated Nutritionist ─── */
const NUTRITIONIST = {
  name: 'Dr. Priya Sharma',
  title: 'Clinical Nutritionist',
  experience: '12 years',
  rating: 4.9,
  avatar: 'P',
  speciality: 'Diet planning, PCOS, Diabetes & Sports Nutrition',
};

type MsgType = { id: string; text: string; sender: 'user' | 'bot'; time: string };

const QUICK_QUESTIONS = [
  { id: 'q1', text: 'Best diet for weight loss?', icon: 'scale-bathroom' },
  { id: 'q2', text: 'What to eat for glowing skin?', icon: 'face-woman-shimmer' },
  { id: 'q3', text: 'Suggest a weekly meal plan', icon: 'calendar-week' },
  { id: 'q4', text: 'Foods to avoid for diabetes?', icon: 'medical-bag' },
  { id: 'q5', text: 'Post-workout nutrition tips?', icon: 'dumbbell' },
  { id: 'q6', text: 'Period cramp relief foods?', icon: 'heart-circle' },
];

/* Simulated AI responses based on keywords */
function getResponse(question: string, orderHistory: string[], userGoals: string[]): string {
  const q = question.toLowerCase();

  if (q.includes('weight loss') || q.includes('lose weight')) {
    return `Great question! For weight loss, I recommend:\n\n🥬 **High-fiber veggies**: Spinach, Broccoli, Cucumber\n🥕 **Low-cal snacks**: Carrot sticks, Beetroot juice\n🍌 **Smart fruits**: Apple, Papaya (avoid banana at night)\n\n**Your personalized tip**: Based on your orders, try replacing rice with cauliflower rice. Add more green smoothies.\n\n**Weekly target**: Include 5 servings of greens daily. You can subscribe to our "Lean & Fit Plan" for auto-delivery!`;
  }
  if (q.includes('skin') || q.includes('glow') || q.includes('acne')) {
    return `For naturally glowing skin:\n\n🍊 **Vitamin C**: Orange, Pomegranate, Amla\n🥒 **Hydration**: Cucumber, Coconut water\n🍈 **Papaya**: Contains papain — clears dark spots in 2 weeks\n🥕 **Beta-carotene**: Carrot, Sweet potato\n\n**Daily routine**: Start your morning with warm lemon water + 1 carrot juice. Eat papaya 3x/week.\n\n**Avoid**: Fried foods, excess sugar, processed snacks.\n\nTry our "Clear Skin & Glow Plan" subscription!`;
  }
  if (q.includes('meal plan') || q.includes('weekly plan')) {
    return `Here's a balanced weekly plan:\n\n**Mon**: Sambar + Poriyal + Rice\n**Tue**: Veg Biryani + Raita\n**Wed**: Dal Tadka + Roti + Salad\n**Thu**: Chettinad Kuzhambu + Rice\n**Fri**: Kerala Avial + Appam\n**Sat**: Paneer Butter Masala + Naan\n**Sun**: Mixed Veg Pulao + Curd\n\n${userGoals.includes('build_muscle') ? '💪 Add protein: Sprouts, Paneer, Dal with every meal.' : ''}\n${userGoals.includes('lose_weight') ? '🏃 Replace rice with millets 3 days/week.' : ''}\n\nSubscribe to our "Tonight\'s Dinner" packs for auto-delivery!`;
  }
  if (q.includes('diabetes') || q.includes('sugar')) {
    return `For diabetes management:\n\n✅ **Eat more**: Bitter gourd, Spinach, Fenugreek, Whole grains\n✅ **Good fruits**: Apple, Guava, Papaya (in moderation)\n❌ **Avoid**: Mango, Banana, White rice, Potatoes\n\n**Key tips**:\n- Eat small meals every 3 hours\n- Include fiber with every meal\n- Bitter gourd juice on empty stomach reduces blood sugar 25%\n\nOur "Diabetic Friendly Plan" subscription delivers the right foods daily!`;
  }
  if (q.includes('workout') || q.includes('gym') || q.includes('protein')) {
    return `Post-workout nutrition (within 30 mins):\n\n🥤 **Protein Smoothie**: Banana + Peanut butter + Milk\n🥗 **Protein Salad**: Sprouts + Paneer + Boiled veggies\n🍌 **Quick fuel**: 2 Bananas + handful of nuts\n\n**Daily protein targets**:\n- Men: 1.6-2g per kg body weight\n- Women: 1.2-1.6g per kg body weight\n\n**Best veggies for gym**: Spinach (iron), Sweet potato (carbs), Broccoli (recovery)\n\nTry our "Protein Power Plan" subscription!`;
  }
  if (q.includes('period') || q.includes('cramp') || q.includes('menstrual')) {
    return `Foods that help during periods:\n\n🍫 **Iron-rich**: Spinach, Beetroot, Dates, Pomegranate\n🍌 **Anti-cramp**: Banana (magnesium relaxes muscles)\n🫚 **Ginger tea**: Reduces inflammation & cramps\n💧 **Hydration**: Coconut water, Watermelon\n\n**Avoid**: Caffeine, very salty/spicy food, cold drinks\n\n**3-day period care routine**:\nDay 1: Warm turmeric milk + Iron-rich foods\nDay 2: Banana smoothie + Beetroot juice\nDay 3: Spinach dal + Pomegranate\n\nSubscribe to our "Period Care Plan"!`;
  }
  if (q.includes('hair') || q.includes('hair fall')) {
    return `For strong, healthy hair:\n\n🥬 **Iron**: Spinach, Beetroot (hair fall = iron deficiency)\n🥕 **Vitamin A**: Carrot, Sweet potato\n🍊 **Vitamin C**: Orange, Amla (boosts collagen)\n🥚 **Biotin**: Banana, Avocado\n\n**Daily hair care diet**: 1 carrot + handful spinach + 1 banana + 1 amla juice\n\nResults visible in 4-6 weeks with consistent intake.`;
  }

  // Generic response based on order history
  if (orderHistory.length > 0) {
    return `Based on your recent orders (${orderHistory.slice(0, 3).join(', ')}), I can see you prefer fresh vegetables!\n\n**My suggestion**: \n- Add more leafy greens for iron & vitamins\n- Include 2 servings of fruits daily\n- Try seasonal vegetables for best nutrition & price\n\nWould you like me to create a personalized weekly plan based on your preferences? Ask me about specific health goals!`;
  }

  return `I'd be happy to help! Here are some topics I can assist with:\n\n🥗 **Diet Plans**: Weight loss, muscle gain, general wellness\n🩺 **Health Conditions**: Diabetes, PCOS, Heart health\n💪 **Fitness**: Pre/post workout nutrition\n💆 **Beauty**: Skin glow, hair health\n🤰 **Women's Health**: Period care, pregnancy nutrition\n\nAsk me anything specific and I'll give you personalized advice with food recommendations!`;
}

/* ─── Health Report Generator ─── */
function generateHealthReport(orders: any[], productsDb: any[]) {
  const itemCounts: Record<string, number> = {};
  const categoryCounts: Record<string, number> = {};
  let totalSpent = 0;
  let totalItems = 0;

  orders.forEach(o => {
    totalSpent += o.total || 0;
    o.items.forEach((item: any) => {
      totalItems += item.quantity;
      itemCounts[item.name] = (itemCounts[item.name] || 0) + item.quantity;
      const product = productsDb.find(p => p.id === item.id);
      if (product) {
        categoryCounts[product.category] = (categoryCounts[product.category] || 0) + item.quantity;
      }
    });
  });

  const topItems = Object.entries(itemCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const topCategories = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1]);

  const vegCount = categoryCounts['Vegetables'] || 0;
  const fruitCount = categoryCounts['Fruits'] || 0;
  const snackCount = categoryCounts['Healthy Snacks'] || 0;

  let healthScore = 60;
  if (vegCount > 5) healthScore += 10;
  if (fruitCount > 3) healthScore += 10;
  if (snackCount > 2) healthScore += 5;
  if (topItems.length > 4) healthScore += 5;
  if (orders.length > 3) healthScore += 10;
  healthScore = Math.min(healthScore, 100);

  return { topItems, topCategories, totalSpent, totalItems, healthScore, vegCount, fruitCount, orderCount: orders.length };
}

/* ─── Screen ─── */
export default function NutritionistScreen() {
  const router = useRouter();
  const themed = useThemedStyles();
  const { orders } = useOrders();
  const { healthGoals, gender, lifestyle, userName } = useDiet();
  const scrollRef = useRef<ScrollView>(null);

  const [activeTab, setActiveTab] = useState<'chat' | 'plan' | 'report'>('chat');
  const [messages, setMessages] = useState<MsgType[]>([
    { id: 'welcome', text: `Hi ${userName || 'there'}! I'm ${NUTRITIONIST.name}, your personal nutritionist. How can I help you today?\n\nYou can ask me about diet plans, health tips, or food recommendations.`, sender: 'bot', time: formatTime(0) },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const typingAnim = useRef(new Animated.Value(0)).current;

  const recentOrderItems = useMemo(() => {
    const items: string[] = [];
    orders.slice(0, 5).forEach(o => o.items.forEach((i: any) => { if (!items.includes(i.name)) items.push(i.name); }));
    return items;
  }, [orders]);

  const healthReport = useMemo(() => generateHealthReport(orders, productsData as any[]), [orders]);

  // Typing animation
  useEffect(() => {
    if (isTyping) {
      Animated.loop(Animated.sequence([
        Animated.timing(typingAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.timing(typingAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
      ])).start();
    } else {
      typingAnim.setValue(0);
    }
  }, [isTyping, typingAnim]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: MsgType = { id: `u_${Date.now()}`, text: text.trim(), sender: 'user', time: formatTime(0) };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate response delay
    setTimeout(() => {
      const response = getResponse(text, recentOrderItems, healthGoals);
      const botMsg: MsgType = { id: `b_${Date.now()}`, text: response, sender: 'bot', time: formatTime(0) };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    }, 1500);

    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const MEAL_PLAN = [
    { day: 'Mon', breakfast: 'Sprout Salad + Green Tea', lunch: 'Sambar + Rice + Poriyal', dinner: 'Dal Tadka + 2 Roti', color: '#E53935' },
    { day: 'Tue', breakfast: 'Fruit Bowl + Oats', lunch: 'Veg Biryani + Raita', dinner: 'Palak Paneer + Roti', color: '#F57C00' },
    { day: 'Wed', breakfast: 'Idli + Sambar', lunch: 'Chettinad Kuzhambu + Rice', dinner: 'Mixed Veg Soup + Bread', color: '#2E7D32' },
    { day: 'Thu', breakfast: 'Banana Smoothie', lunch: 'Kerala Avial + Rice', dinner: 'Mushroom Curry + Roti', color: '#1565C0' },
    { day: 'Fri', breakfast: 'Poha + Juice', lunch: 'Rajma Rice', dinner: 'Paneer Butter Masala + Naan', color: '#7B1FA2' },
    { day: 'Sat', breakfast: 'Dosa + Chutney', lunch: 'Veg Pulao + Curd', dinner: 'Aloo Gobi + Roti', color: '#00897B' },
    { day: 'Sun', breakfast: 'Paratha + Curd', lunch: 'Biryani + Raita', dinner: 'Light Soup + Salad', color: '#C62828' },
  ];

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
            <View style={styles.headerProfile}>
              <View style={styles.headerAvatar}>
                <Text style={styles.headerAvatarText}>{NUTRITIONIST.avatar}</Text>
              </View>
              <View>
                <Text style={styles.headerName}>{NUTRITIONIST.name}</Text>
                <Text style={styles.headerTitle}>{NUTRITIONIST.title}</Text>
              </View>
            </View>
            <View style={styles.headerBadge}>
              <Icon name="star" size={10} color="#FFD700" />
              <Text style={styles.headerBadgeText}>{NUTRITIONIST.rating}</Text>
            </View>
          </View>

          {/* Tabs */}
          <View style={styles.tabRow}>
            {[
              { key: 'chat', label: 'Chat', icon: 'message-text' },
              { key: 'plan', label: 'Meal Plan', icon: 'food-variant' },
              { key: 'report', label: 'Health Report', icon: 'chart-line' },
            ].map(tab => {
              const active = activeTab === tab.key;
              return (
                <TouchableOpacity
                  key={tab.key}
                  style={[styles.tab, active && styles.tabActive]}
                  onPress={() => setActiveTab(tab.key as any)}
                >
                  <Icon name={tab.icon as any} size={16} color={active ? '#1565C0' : 'rgba(255,255,255,0.7)'} />
                  <Text style={[styles.tabText, active && styles.tabTextActive]}>{tab.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </SafeAreaView>
      </LinearGradient>

      {/* ━━━ CHAT TAB ━━━ */}
      {activeTab === 'chat' && (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView ref={scrollRef} style={styles.chatScroll} contentContainerStyle={styles.chatContent}>
            {messages.map(msg => (
              <View key={msg.id} style={[styles.msgRow, msg.sender === 'user' && styles.msgRowUser]}>
                {msg.sender === 'bot' && (
                  <View style={styles.msgAvatar}>
                    <Text style={styles.msgAvatarText}>P</Text>
                  </View>
                )}
                <View style={[styles.msgBubble, msg.sender === 'user' ? styles.msgBubbleUser : styles.msgBubbleBot]}>
                  <Text style={[styles.msgText, msg.sender === 'user' && styles.msgTextUser]}>{msg.text}</Text>
                  <Text style={[styles.msgTime, msg.sender === 'user' && { color: 'rgba(255,255,255,0.6)' }]}>{msg.time}</Text>
                </View>
              </View>
            ))}
            {isTyping && (
              <View style={styles.msgRow}>
                <View style={styles.msgAvatar}><Text style={styles.msgAvatarText}>P</Text></View>
                <Animated.View style={[styles.typingBubble, { opacity: typingAnim.interpolate({ inputRange: [0, 1], outputRange: [0.4, 1] }) }]}>
                  <Text style={styles.typingText}>Dr. Priya is typing...</Text>
                </Animated.View>
              </View>
            )}
          </ScrollView>

          {/* Quick Questions */}
          <View style={{ maxHeight: 50 }}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickRow}>
              {QUICK_QUESTIONS.map(q => (
                <TouchableOpacity key={q.id} style={styles.quickChip} onPress={() => sendMessage(q.text)}>
                  <Icon name={q.icon as any} size={12} color={COLORS.primary} />
                  <Text style={styles.quickChipText}>{q.text}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Input */}
          <View style={styles.inputBar}>
            <TextInput
              style={[styles.chatInput, themed.textPrimary]}
              placeholder="Ask about diet, nutrition..."
              placeholderTextColor={COLORS.text.muted}
              value={input}
              onChangeText={setInput}
              multiline
            />
            <TouchableOpacity
              style={[styles.sendBtn, !input.trim() && { opacity: 0.3 }]}
              onPress={() => sendMessage(input)}
              disabled={!input.trim()}
            >
              <Icon name="send" size={20} color="#FFF" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      )}

      {/* ━━━ MEAL PLAN TAB ━━━ */}
      {activeTab === 'plan' && (
        <ScrollView contentContainerStyle={styles.planScroll} showsVerticalScrollIndicator={false}>
          <View style={styles.planHeader}>
            <Icon name="food-variant" size={20} color={COLORS.primary} />
            <Text style={[styles.planTitle, themed.textPrimary]}>Your Personalized Weekly Plan</Text>
          </View>
          <Text style={styles.planSub}>
            Based on your goals: {healthGoals.map(g => g.replace(/_/g, ' ')).join(', ') || 'General wellness'}
          </Text>

          {MEAL_PLAN.map((day, idx) => (
            <View key={day.day} style={[styles.planDayCard, themed.card]}>
              <View style={[styles.planDayBadge, { backgroundColor: day.color }]}>
                <Text style={styles.planDayBadgeText}>{day.day}</Text>
              </View>
              <View style={styles.planDayContent}>
                <View style={styles.planMealRow}>
                  <Icon name="weather-sunset-up" size={14} color="#FF9800" />
                  <Text style={styles.planMealLabel}>Breakfast</Text>
                  <Text style={[styles.planMealText, themed.textPrimary]}>{day.breakfast}</Text>
                </View>
                <View style={styles.planMealRow}>
                  <Icon name="weather-sunny" size={14} color="#F57C00" />
                  <Text style={styles.planMealLabel}>Lunch</Text>
                  <Text style={[styles.planMealText, themed.textPrimary]}>{day.lunch}</Text>
                </View>
                <View style={styles.planMealRow}>
                  <Icon name="weather-night" size={14} color="#5C6BC0" />
                  <Text style={styles.planMealLabel}>Dinner</Text>
                  <Text style={[styles.planMealText, themed.textPrimary]}>{day.dinner}</Text>
                </View>
              </View>
            </View>
          ))}

          <TouchableOpacity style={styles.subscribePlanBtn} onPress={() => router.push('/subscription-setup' as any)}>
            <LinearGradient colors={['#1565C0', '#1976D2']} style={styles.subscribePlanGrad}>
              <Icon name="cart-plus" size={18} color="#FFF" />
              <Text style={styles.subscribePlanText}>Subscribe to This Plan</Text>
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      )}

      {/* ━━━ HEALTH REPORT TAB ━━━ */}
      {activeTab === 'report' && (
        <ScrollView contentContainerStyle={styles.reportScroll} showsVerticalScrollIndicator={false}>
          {/* Health Score */}
          <View style={[styles.scoreCard, themed.card]}>
            <LinearGradient
              colors={healthReport.healthScore >= 80 ? ['#2E7D32', '#43A047'] : healthReport.healthScore >= 60 ? ['#F57C00', '#FF9800'] : ['#C62828', '#E53935']}
              style={styles.scoreGrad}
            >
              <Text style={styles.scoreLabel}>Your Health Score</Text>
              <Text style={styles.scoreValue}>{healthReport.healthScore}</Text>
              <Text style={styles.scoreMax}>/100</Text>
            </LinearGradient>
            <View style={styles.scoreDetails}>
              <View style={styles.scoreDetailRow}>
                <Icon name="basket" size={16} color={COLORS.primary} />
                <Text style={styles.scoreDetailText}>{healthReport.orderCount} orders this month</Text>
              </View>
              <View style={styles.scoreDetailRow}>
                <Icon name="leaf" size={16} color="#2E7D32" />
                <Text style={styles.scoreDetailText}>{healthReport.vegCount} vegetable servings</Text>
              </View>
              <View style={styles.scoreDetailRow}>
                <Icon name="fruit-cherries" size={16} color="#E53935" />
                <Text style={styles.scoreDetailText}>{healthReport.fruitCount} fruit servings</Text>
              </View>
            </View>
          </View>

          {/* Top Ordered */}
          <Text style={[styles.reportSectionTitle, themed.textPrimary]}>Most Ordered Items</Text>
          {healthReport.topItems.map(([name, count], idx) => (
            <View key={name} style={[styles.topItemRow, themed.card]}>
              <View style={[styles.topItemRank, { backgroundColor: idx === 0 ? '#FFD700' : idx === 1 ? '#C0C0C0' : idx === 2 ? '#CD7F32' : '#E0E0E0' }]}>
                <Text style={styles.topItemRankText}>{idx + 1}</Text>
              </View>
              <Text style={[styles.topItemName, themed.textPrimary]}>{name}</Text>
              <Text style={styles.topItemCount}>{count}x</Text>
            </View>
          ))}

          {/* Category Breakdown */}
          <Text style={[styles.reportSectionTitle, themed.textPrimary]}>Category Breakdown</Text>
          <View style={[styles.categoryCard, themed.card]}>
            {healthReport.topCategories.map(([cat, count]) => {
              const pct = Math.round((count / Math.max(healthReport.totalItems, 1)) * 100);
              return (
                <View key={cat} style={styles.categoryRow}>
                  <Text style={styles.categoryName}>{cat}</Text>
                  <View style={styles.categoryBarBg}>
                    <View style={[styles.categoryBarFill, { width: `${pct}%`, backgroundColor: cat === 'Vegetables' ? '#43A047' : cat === 'Fruits' ? '#E53935' : '#1565C0' }]} />
                  </View>
                  <Text style={styles.categoryPct}>{pct}%</Text>
                </View>
              );
            })}
          </View>

          {/* Recommendations */}
          <Text style={[styles.reportSectionTitle, themed.textPrimary]}>Recommendations</Text>
          <View style={[styles.recoCard, themed.card]}>
            {[
              { icon: 'leaf', text: 'Add more leafy greens — aim for 2 servings daily', color: '#2E7D32' },
              { icon: 'fruit-watermelon', text: 'Include seasonal fruits — better nutrition & lower price', color: '#E53935' },
              { icon: 'water', text: 'Stay hydrated — coconut water or cucumber juice daily', color: '#1565C0' },
              { icon: 'clock-outline', text: 'Eat dinner before 8 PM for better digestion', color: '#F57C00' },
            ].map((r, i) => (
              <View key={i} style={styles.recoRow}>
                <View style={[styles.recoIcon, { backgroundColor: r.color + '15' }]}>
                  <Icon name={r.icon as any} size={16} color={r.color} />
                </View>
                <Text style={styles.recoText}>{r.text}</Text>
              </View>
            ))}
          </View>

          <View style={{ height: 30 }} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

function formatTime(offsetMinutes: number): string {
  const d = new Date(Date.now() + offsetMinutes * 60000);
  return d.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' });
}

const styles = StyleSheet.create({
  safe: { flex: 1 },

  // Header
  header: { paddingHorizontal: SPACING.base, paddingBottom: 0 },
  headerRow: { flexDirection: 'row', alignItems: 'center', paddingTop: SPACING.sm, gap: 10 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  headerProfile: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  headerAvatar: { width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(255,255,255,0.25)', justifyContent: 'center', alignItems: 'center' },
  headerAvatarText: { fontSize: 16, fontWeight: '800', color: '#FFF' },
  headerName: { fontSize: 15, fontWeight: '800', color: '#FFF' },
  headerTitle: { fontSize: 10, color: 'rgba(255,255,255,0.75)' },
  headerBadge: { flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  headerBadgeText: { fontSize: 11, fontWeight: '700', color: '#FFF' },

  // Tabs
  tabRow: { flexDirection: 'row', marginTop: SPACING.md, gap: 6 },
  tab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, paddingVertical: 10, borderTopLeftRadius: RADIUS.lg, borderTopRightRadius: RADIUS.lg, backgroundColor: 'rgba(255,255,255,0.1)' },
  tabActive: { backgroundColor: '#FFF' },
  tabText: { fontSize: 12, fontWeight: '700', color: 'rgba(255,255,255,0.7)' },
  tabTextActive: { color: '#1565C0' },

  // Chat
  chatScroll: { flex: 1 },
  chatContent: { padding: SPACING.base, paddingBottom: 10 },
  msgRow: { flexDirection: 'row', marginBottom: 12, alignItems: 'flex-end', gap: 8 },
  msgRowUser: { justifyContent: 'flex-end' },
  msgAvatar: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#1565C0', justifyContent: 'center', alignItems: 'center' },
  msgAvatarText: { fontSize: 12, fontWeight: '800', color: '#FFF' },
  msgBubble: { maxWidth: '75%', padding: 12, borderRadius: RADIUS.lg },
  msgBubbleBot: { backgroundColor: '#F5F5F5', borderBottomLeftRadius: 4 },
  msgBubbleUser: { backgroundColor: '#1565C0', borderBottomRightRadius: 4 },
  msgText: { fontSize: 13, color: COLORS.text.primary, lineHeight: 20 },
  msgTextUser: { color: '#FFF' },
  msgTime: { fontSize: 9, color: COLORS.text.muted, marginTop: 4, alignSelf: 'flex-end' },
  typingBubble: { backgroundColor: '#F5F5F5', paddingHorizontal: 16, paddingVertical: 10, borderRadius: RADIUS.lg },
  typingText: { fontSize: 12, color: COLORS.text.muted, fontStyle: 'italic' },

  // Quick Questions
  quickRow: { paddingHorizontal: SPACING.base, paddingVertical: 6, gap: 6 },
  quickChip: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: '#E3F2FD', paddingHorizontal: 12, paddingVertical: 8, borderRadius: RADIUS.full, height: 36 },
  quickChipText: { fontSize: 11, fontWeight: '600', color: '#1565C0' },

  // Input
  inputBar: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, paddingHorizontal: SPACING.base, paddingVertical: 8, borderTopWidth: 1, borderTopColor: '#E0E0E0' },
  chatInput: { flex: 1, borderWidth: 1, borderColor: '#E0E0E0', borderRadius: RADIUS.lg, paddingHorizontal: 14, paddingVertical: 10, fontSize: 14, maxHeight: 80 },
  sendBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#1565C0', justifyContent: 'center', alignItems: 'center' },

  // Meal Plan
  planScroll: { padding: SPACING.base, paddingBottom: 30 },
  planHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  planTitle: { fontSize: 16, fontWeight: '800' },
  planSub: { fontSize: 11, color: COLORS.text.muted, marginBottom: 16 },
  planDayCard: { flexDirection: 'row', borderRadius: RADIUS.lg, overflow: 'hidden', marginBottom: 8, ...SHADOW.sm },
  planDayBadge: { width: 44, alignItems: 'center', justifyContent: 'center' },
  planDayBadgeText: { fontSize: 13, fontWeight: '800', color: '#FFF' },
  planDayContent: { flex: 1, padding: 10, gap: 4 },
  planMealRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  planMealLabel: { fontSize: 10, fontWeight: '700', color: COLORS.text.muted, width: 55 },
  planMealText: { fontSize: 11, fontWeight: '600', flex: 1 },
  subscribePlanBtn: { borderRadius: RADIUS.lg, overflow: 'hidden', marginTop: 16 },
  subscribePlanGrad: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16 },
  subscribePlanText: { fontSize: 15, fontWeight: '800', color: '#FFF' },

  // Health Report
  reportScroll: { padding: SPACING.base, paddingBottom: 30 },
  scoreCard: { borderRadius: RADIUS.xl, overflow: 'hidden', marginBottom: SPACING.md, ...SHADOW.sm },
  scoreGrad: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'center', paddingVertical: 24, gap: 4 },
  scoreLabel: { fontSize: 12, color: 'rgba(255,255,255,0.8)', position: 'absolute', top: 12, left: 16 },
  scoreValue: { fontSize: 56, fontWeight: '800', color: '#FFF' },
  scoreMax: { fontSize: 18, fontWeight: '600', color: 'rgba(255,255,255,0.6)' },
  scoreDetails: { padding: SPACING.base, gap: 8 },
  scoreDetailRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  scoreDetailText: { fontSize: 13, fontWeight: '600', color: COLORS.text.secondary },

  reportSectionTitle: { fontSize: 15, fontWeight: '800', marginTop: SPACING.md, marginBottom: SPACING.sm },
  topItemRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderRadius: RADIUS.md, marginBottom: 6, ...SHADOW.sm },
  topItemRank: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  topItemRankText: { fontSize: 12, fontWeight: '800', color: '#FFF' },
  topItemName: { flex: 1, fontSize: 13, fontWeight: '700' },
  topItemCount: { fontSize: 13, fontWeight: '800', color: COLORS.primary },

  categoryCard: { borderRadius: RADIUS.lg, padding: SPACING.base, ...SHADOW.sm },
  categoryRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  categoryName: { fontSize: 11, fontWeight: '700', color: COLORS.text.secondary, width: 90 },
  categoryBarBg: { flex: 1, height: 8, backgroundColor: '#F5F5F5', borderRadius: 4, overflow: 'hidden' },
  categoryBarFill: { height: '100%', borderRadius: 4 },
  categoryPct: { fontSize: 11, fontWeight: '800', color: COLORS.text.primary, width: 35, textAlign: 'right' },

  recoCard: { borderRadius: RADIUS.lg, padding: SPACING.base, gap: 12, ...SHADOW.sm },
  recoRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  recoIcon: { width: 34, height: 34, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  recoText: { flex: 1, fontSize: 12, fontWeight: '600', color: COLORS.text.primary, lineHeight: 17 },
});
