import React, { createContext, useContext, useRef, useCallback } from 'react';
import { Animated, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';

interface ScrollContextType {
  tabBarTranslateY: Animated.Value;
  handleScroll: (e: NativeSyntheticEvent<NativeScrollEvent>) => void;
}

const ScrollContext = createContext<ScrollContextType>({
  tabBarTranslateY: new Animated.Value(0),
  handleScroll: () => {},
});

export const useScrollContext = () => useContext(ScrollContext);

export const ScrollProvider = ({ children }: { children: React.ReactNode }) => {
  const tabBarTranslateY = useRef(new Animated.Value(0)).current;
  const lastOffsetY = useRef(0);
  const isHidden = useRef(false);

  const handleScroll = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentY = e.nativeEvent.contentOffset.y;
    const diff = currentY - lastOffsetY.current;

    // Only act on meaningful scroll (avoid jitter)
    if (currentY <= 10) {
      // At top — always show
      if (isHidden.current) {
        isHidden.current = false;
        Animated.timing(tabBarTranslateY, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }).start();
      }
    } else if (diff > 5 && !isHidden.current) {
      // Scrolling up (content moves up) — hide
      isHidden.current = true;
      Animated.timing(tabBarTranslateY, {
        toValue: 100,
        duration: 250,
        useNativeDriver: true,
      }).start();
    } else if (diff < -5 && isHidden.current) {
      // Scrolling down (content moves down) — show
      isHidden.current = false;
      Animated.timing(tabBarTranslateY, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }

    lastOffsetY.current = currentY;
  }, [tabBarTranslateY]);

  return (
    <ScrollContext.Provider value={{ tabBarTranslateY, handleScroll }}>
      {children}
    </ScrollContext.Provider>
  );
};
