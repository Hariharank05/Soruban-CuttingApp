import React, { useEffect, useRef } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View } from 'react-native';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { OrderProvider } from '@/context/OrderContext';
import { COLORS } from '@/src/utils/theme';

function RootLayoutNav() {
  const { isLoading, isAuthenticated } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const hasNavigated = useRef(false);

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!isAuthenticated && !inAuthGroup) {
      if (!hasNavigated.current) {
        hasNavigated.current = true;
        router.replace('/(auth)' as any);
      }
    } else if (isAuthenticated && inAuthGroup) {
      if (!hasNavigated.current) {
        hasNavigated.current = true;
        router.replace('/(tabs)' as any);
      }
    } else {
      hasNavigated.current = false;
    }
  }, [isAuthenticated, isLoading, segments]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="browse" />
        <Stack.Screen name="product-detail" />
        <Stack.Screen name="dish-pack-detail" />
        <Stack.Screen name="checkout" />
        <Stack.Screen name="order-detail" />
        <Stack.Screen name="notifications" />
        <Stack.Screen name="wallet" />
        <Stack.Screen name="addresses" />
        <Stack.Screen name="favorites" />
        <Stack.Screen name="help" />
        <Stack.Screen name="about" />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <CartProvider>
        <OrderProvider>
          <RootLayoutNav />
        </OrderProvider>
      </CartProvider>
    </AuthProvider>
  );
}
