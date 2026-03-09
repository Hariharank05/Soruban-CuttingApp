import { Tabs, usePathname, useRouter } from 'expo-router';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { COLORS, SPACING, RADIUS } from '@/src/utils/theme';
import { useCart } from '@/context/CartContext';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function FloatingCartBar() {
  const { cartItems, getItemCount } = useCart();
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const count = getItemCount();

  if (count === 0 || pathname === '/cart') return null;

  const lastImage = cartItems[0]?.image;

  return (
    <TouchableOpacity
      style={[styles.floatingCart, { bottom: 68 + Math.max(insets.bottom, 8) }]}
      activeOpacity={0.9}
      onPress={() => router.push('/(tabs)/cart')}
    >
      {lastImage && (
        <Image source={{ uri: lastImage }} style={styles.fcThumb} />
      )}
      <View style={styles.fcTextWrap}>
        <Text style={styles.fcTitle}>View cart</Text>
        <Text style={styles.fcSub}>{count} {count === 1 ? 'item' : 'items'}</Text>
      </View>
      <View style={styles.fcArrow}>
        <Icon name="chevron-right" size={20} color="#FFF" />
      </View>
    </TouchableOpacity>
  );
}

export default function TabsLayout() {
  const { getItemCount } = useCart();
  const count = getItemCount();
  const insets = useSafeAreaInsets();
  const tabBarHeight = 60 + Math.max(insets.bottom, 8);

  return (
    <View style={{ flex: 1 }}>
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.text.muted,
        tabBarStyle: {
          backgroundColor: '#FFF',
          borderTopWidth: 1,
          borderTopColor: COLORS.border,
          height: tabBarHeight,
          paddingBottom: Math.max(insets.bottom, 8),
          paddingTop: 4,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Icon name="home" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="packs"
        options={{
          title: 'Dish Packs',
          tabBarIcon: ({ color, size }) => <Icon name="food-variant" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Cart',
          tabBarIcon: ({ color, size }) => (
            <View>
              <Icon name="cart" size={size} color={color} />
              {count > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{count}</Text>
                </View>
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: 'Orders',
          tabBarIcon: ({ color, size }) => <Icon name="clipboard-list" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <Icon name="account-circle" size={size} color={color} />,
        }}
      />
    </Tabs>
    <FloatingCartBar />
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: 'absolute', top: -4, right: -10,
    backgroundColor: COLORS.primary, borderRadius: 10,
    minWidth: 18, height: 18, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 4,
  },
  badgeText: { color: '#FFF', fontSize: 10, fontWeight: '700' },
  floatingCart: {
    position: 'absolute', alignSelf: 'center',
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#2E7D32', borderRadius: 30,
    paddingVertical: 6, paddingLeft: 6, paddingRight: 6,
    elevation: 10,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8,
  },
  fcThumb: {
    width: 40, height: 40, borderRadius: 20,
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.4)',
  },
  fcTextWrap: { marginLeft: 10, marginRight: 10 },
  fcTitle: { fontSize: 14, fontWeight: '800', color: '#FFF' },
  fcSub: { fontSize: 11, color: 'rgba(255,255,255,0.85)' },
  fcArrow: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center', alignItems: 'center',
  },
});
