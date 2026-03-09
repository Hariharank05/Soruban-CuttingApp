import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { CartProvider } from '@/context/CartContext';
import { OrderProvider } from '@/context/OrderContext';

export default function RootLayout() {
  return (
    <CartProvider>
      <OrderProvider>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="browse" />
          <Stack.Screen name="product-detail" />
          <Stack.Screen name="dish-pack-detail" />
          <Stack.Screen name="checkout" />
          <Stack.Screen name="order-detail" />
        </Stack>
      </OrderProvider>
    </CartProvider>
  );
}
