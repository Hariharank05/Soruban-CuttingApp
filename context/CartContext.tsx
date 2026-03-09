import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { CartItem, CutType, Product } from '@/types';
import { getCutFee } from '@/data/cutTypes';

const CART_KEY = '@cutting_cart';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity: number, weight?: number, cutType?: CutType, instructions?: string) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  updateCutType: (productId: string, cutType?: CutType) => void;
  updateInstructions: (productId: string, instructions: string) => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getCuttingTotal: () => number;
  getItemCount: () => number;
}

const CartContext = createContext<CartContextType>({
  cartItems: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  updateCutType: () => {},
  updateInstructions: () => {},
  clearCart: () => {},
  getSubtotal: () => 0,
  getCuttingTotal: () => 0,
  getItemCount: () => 0,
});

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(CART_KEY).then(raw => {
      if (raw) {
        try { setCartItems(JSON.parse(raw)); } catch {}
      }
    });
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(CART_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = useCallback((product: Product, quantity: number, weight?: number, cutType?: CutType, instructions?: string) => {
    setCartItems(prev => {
      const existingIdx = prev.findIndex(i => i.id === product.id && i.cutType === cutType && i.selectedWeight === weight);
      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx] = {
          ...updated[existingIdx],
          quantity: updated[existingIdx].quantity + quantity,
          cutType,
          specialInstructions: instructions || updated[existingIdx].specialInstructions,
        };
        return updated;
      }
      return [...prev, { ...product, quantity, selectedWeight: weight, cutType, specialInstructions: instructions }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCartItems(prev => prev.filter(i => i.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    setCartItems(prev => {
      if (quantity <= 0) return prev.filter(i => i.id !== productId);
      return prev.map(i => i.id === productId ? { ...i, quantity } : i);
    });
  }, []);

  const updateCutType = useCallback((productId: string, cutType?: CutType) => {
    setCartItems(prev => prev.map(i => i.id === productId ? { ...i, cutType } : i));
  }, []);

  const updateInstructions = useCallback((productId: string, instructions: string) => {
    setCartItems(prev => prev.map(i => i.id === productId ? { ...i, specialInstructions: instructions } : i));
  }, []);

  const clearCart = useCallback(() => setCartItems([]), []);

  const calcItemPrice = useCallback((item: CartItem) => {
    let basePrice = item.price;
    if (item.selectedWeight && item.unit.includes('kg')) {
      basePrice = Math.round((item.price * item.selectedWeight) / 1000);
    }
    return basePrice * item.quantity;
  }, []);

  const getSubtotal = useCallback(() => {
    return cartItems.reduce((sum, item) => sum + calcItemPrice(item) + getCutFee(item.cutType) * item.quantity, 0);
  }, [cartItems, calcItemPrice]);

  const getCuttingTotal = useCallback(() => {
    return cartItems.reduce((sum, item) => sum + getCutFee(item.cutType) * item.quantity, 0);
  }, [cartItems]);

  const getItemCount = useCallback(() => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }, [cartItems]);

  const value = useMemo(() => ({
    cartItems, addToCart, removeFromCart, updateQuantity,
    updateCutType, updateInstructions, clearCart,
    getSubtotal, getCuttingTotal, getItemCount,
  }), [cartItems, addToCart, removeFromCart, updateQuantity, updateCutType, updateInstructions, clearCart, getSubtotal, getCuttingTotal, getItemCount]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => useContext(CartContext);
