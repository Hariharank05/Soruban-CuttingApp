// Cutting App theme - Orange/warm tones for cutting service brand

export const COLORS = {
  primary: '#E65100',
  primaryLight: '#FF8A65',
  primaryDark: '#BF360C',
  accent: '#FF7043',
  accentLight: '#FFAB91',
  background: '#FFF8F5',
  backgroundSoft: '#FFF3E0',
  surface: '#FFFFFF',
  card: '#FFFFFF',
  border: '#F0E0D6',
  divider: '#F5E6DB',
  green: '#2E7D32',
  greenLight: '#E8F5E9',

  text: {
    primary: '#1A1A1A',
    secondary: '#555555',
    muted: '#8E8E8E',
    white: '#FFFFFF',
    accent: '#E65100',
  },

  status: {
    success: '#2E7D32',
    warning: '#F57C00',
    error: '#D32F2F',
    info: '#1565C0',
  },

  gradient: {
    primary: ['#E65100', '#FF7043'] as const,
    warm: ['#FF8A65', '#FF7043'] as const,
    header: ['#FFCCBC', '#FFE0B2'] as const,
    hero: ['#E65100', '#FF5722'] as const,
    green: ['#66BB6A', '#43A047'] as const,
    card: ['#FFFFFF', '#FFF8F5'] as const,
  },
};

export const FONTS = {
  extraBold: { fontWeight: '800' as const },
  bold: { fontWeight: '700' as const },
  semiBold: { fontWeight: '600' as const },
  medium: { fontWeight: '500' as const },
  regular: { fontWeight: '400' as const },
  sizes: { xs: 10, sm: 12, md: 14, base: 16, lg: 18, xl: 20, xxl: 24, xxxl: 30 },
};

export const SPACING = { xs: 4, sm: 8, md: 12, base: 16, lg: 20, xl: 24, xxl: 32, xxxl: 48 };

export const RADIUS = { sm: 6, md: 10, lg: 16, xl: 24, full: 999 };

export const SHADOW = {
  sm: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 5, elevation: 2 },
  md: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.09, shadowRadius: 10, elevation: 4 },
  lg: { shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.15, shadowRadius: 16, elevation: 8 },
  floating: { shadowColor: '#000', shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.12, shadowRadius: 8, elevation: 10 },
};
