import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity, StatusBar,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, RADIUS, SPACING } from '@/src/utils/theme';
import { useAuth } from '@/context/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemedStyles } from '@/src/utils/useThemedStyles';

export default function OTPScreen() {
  const themed = useThemedStyles();
  const router = useRouter();
  const { phone, name, address } = useLocalSearchParams<{ phone: string; name?: string; address?: string }>();
  const { login, loginByPhone } = useAuth();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [error, setError] = useState('');
  const inputs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(t => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (val: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);
    setError('');
    if (val && index < 5) inputs.current[index + 1]?.focus();
  };

  const handleVerify = async () => {
    const code = otp.join('');
    if (code === '123456') {
      const normalizedPhone = phone || '9876543210';
      const existingUser = await loginByPhone(normalizedPhone);
      if (existingUser) return;

      await login({
        id: Date.now().toString(),
        name: name?.trim() || '',
        phone: normalizedPhone,
        address: address?.trim() || undefined,
      });
    } else {
      setError('Invalid OTP. Use 123456 for demo.');
    }
  };

  const fullOtp = otp.join('');

  return (
    <SafeAreaView style={[styles.safe, themed.safeArea]} edges={['bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <LinearGradient colors={themed.headerGradient} style={styles.heroSection}>
        <TouchableOpacity onPress={() => router.back()} style={styles.back}>
          <Icon name="arrow-left" size={24} color={COLORS.text.primary} />
        </TouchableOpacity>
        <View style={styles.heroContent}>
          <Icon name="cellphone-message" size={60} color={COLORS.primary} />
          <Text style={[styles.title, themed.textPrimary]}>Verify OTP</Text>
          <Text style={styles.sub}>Enter the 6-digit code sent to +91 {phone}</Text>
        </View>
      </LinearGradient>

      <View style={styles.container}>
        <View style={styles.otpRow}>
          {otp.map((val, i) => (
            <TextInput
              key={i}
              ref={ref => { inputs.current[i] = ref; }}
              style={[styles.otpBox, themed.inputBg, val ? styles.otpBoxFilled : null]}
              maxLength={1}
              keyboardType="number-pad"
              value={val}
              onChangeText={v => handleChange(v, i)}
              onKeyPress={({ nativeEvent }) => {
                if (nativeEvent.key === 'Backspace' && !val && i > 0) {
                  inputs.current[i - 1]?.focus();
                }
              }}
            />
          ))}
        </View>

        <Text style={styles.hint}>Use 123456 for demo</Text>
        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity
          style={[styles.btn, fullOtp.length < 6 && styles.btnOff]}
          onPress={handleVerify}
          disabled={fullOtp.length < 6}
        >
          <Text style={styles.btnText}>Verify & Login</Text>
        </TouchableOpacity>

        <TouchableOpacity disabled={timer > 0} style={styles.resend}>
          <Text style={[styles.resendText, timer > 0 && { color: COLORS.text.muted }]}>
            {timer > 0 ? `Resend OTP in ${timer}s` : 'Resend OTP'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  heroSection: { paddingBottom: 24 },
  back: { paddingHorizontal: SPACING.base, paddingTop: 44, paddingBottom: SPACING.sm },
  heroContent: { alignItems: 'center', paddingHorizontal: 24 },
  container: { flex: 1, paddingHorizontal: 24, paddingTop: 24, alignItems: 'center' },
  title: { fontSize: 26, fontWeight: '800', color: COLORS.text.primary, marginTop: 12, marginBottom: 8 },
  sub: { fontSize: 14, color: COLORS.text.secondary, textAlign: 'center' },
  otpRow: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  otpBox: {
    width: 48, height: 56, borderRadius: RADIUS.lg,
    backgroundColor: '#FFF',
    textAlign: 'center', fontSize: 22, fontWeight: '700',
    color: COLORS.text.primary,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08, shadowRadius: 3, elevation: 2,
  },
  otpBoxFilled: { borderWidth: 1.5, borderColor: COLORS.primary, backgroundColor: COLORS.primary + '10' },
  hint: { fontSize: 12, color: COLORS.text.muted, marginBottom: 8 },
  error: { fontSize: 12, color: COLORS.status.error, marginBottom: 16 },
  btn: { width: '100%', borderRadius: RADIUS.full, backgroundColor: COLORS.primary, paddingVertical: 15, alignItems: 'center', marginBottom: 16 },
  btnOff: { backgroundColor: '#CCC' },
  btnText: { color: '#FFF', fontWeight: '700', fontSize: 16 },
  resend: { padding: 8 },
  resendText: { color: COLORS.primary, fontWeight: '600', fontSize: 14 },
});
