import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { COLORS } from '@/src/utils/theme';

const PLACEHOLDER_ITEMS = [
  'Search "Tomato"',
  'Search "Vegetables"',
  'Search "Fruits"',
  'Search "Sambar Pack"',
  'Search "Carrot"',
  'Search "Healthy Snacks"',
  'Search "Diet Foods"',
  'Search "Banana"',
];

const ITEM_HEIGHT = 20;
const CYCLE_DURATION = 2000;

export default function AnimatedSearchPlaceholder() {
  const indexRef = useRef(0);
  const [currentText, setCurrentText] = useState(PLACEHOLDER_ITEMS[0]);
  const [nextText, setNextText] = useState(PLACEHOLDER_ITEMS[1]);
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const interval = setInterval(() => {
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start(() => {
        const nextIdx = (indexRef.current + 1) % PLACEHOLDER_ITEMS.length;
        const afterNext = (nextIdx + 1) % PLACEHOLDER_ITEMS.length;
        indexRef.current = nextIdx;
        slideAnim.setValue(0);
        setCurrentText(PLACEHOLDER_ITEMS[nextIdx]);
        setNextText(PLACEHOLDER_ITEMS[afterNext]);
      });
    }, CYCLE_DURATION);

    return () => clearInterval(interval);
  }, [slideAnim]);

  const currentTranslateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -ITEM_HEIGHT],
  });

  const currentOpacity = slideAnim.interpolate({
    inputRange: [0, 0.7, 1],
    outputRange: [1, 1, 0],
  });

  const nextTranslateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [ITEM_HEIGHT, 0],
  });

  const nextOpacity = slideAnim.interpolate({
    inputRange: [0, 0.3, 1],
    outputRange: [0, 0, 1],
  });

  return (
    <View style={styles.container}>
      <Animated.Text
        style={[
          styles.text,
          {
            transform: [{ translateY: currentTranslateY }],
            opacity: currentOpacity,
          },
        ]}
        numberOfLines={1}
      >
        {currentText}
      </Animated.Text>
      <Animated.Text
        style={[
          styles.text,
          styles.nextText,
          {
            transform: [{ translateY: nextTranslateY }],
            opacity: nextOpacity,
          },
        ]}
        numberOfLines={1}
      >
        {nextText}
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: ITEM_HEIGHT,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  text: {
    fontSize: 14,
    color: COLORS.text.muted,
  },
  nextText: {
    position: 'absolute',
    left: 0,
  },
});
