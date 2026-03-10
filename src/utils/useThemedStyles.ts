import { useMemo } from 'react';
import { useTheme } from '@/context/ThemeContext';

/**
 * Returns commonly needed dynamic style overrides for dark/light mode.
 * Use these as inline style array items alongside static StyleSheet styles.
 */
export function useThemedStyles() {
  const { colors, isDark } = useTheme();

  return useMemo(() => ({
    colors,
    isDark,
    // Screen background
    safeArea: { backgroundColor: colors.background },
    // Card / section backgrounds
    card: { backgroundColor: colors.card },
    // Header gradient colors (for LinearGradient)
    headerGradient: colors.gradient.header as unknown as [string, string],
    heroGradient: colors.gradient.hero as unknown as [string, string],
    primaryGradient: colors.gradient.primary as unknown as [string, string],
    // Text overrides
    textPrimary: { color: colors.text.primary },
    textSecondary: { color: colors.text.secondary },
    textMuted: { color: colors.text.muted },
    textAccent: { color: colors.primary },
    // Borders
    borderColor: { borderColor: colors.border },
    dividerColor: { backgroundColor: colors.divider },
    // Input fields
    inputBg: { backgroundColor: isDark ? '#2A2A2A' : '#F7F7F7', borderColor: colors.border, color: colors.text.primary },
    // Soft backgrounds (tags, badges)
    softBg: { backgroundColor: colors.backgroundSoft },
    // Active chip style
    chipActive: { borderColor: colors.primary, backgroundColor: colors.backgroundSoft },
  }), [colors, isDark]);
}
