import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, ScrollView, StatusBar,
} from 'react-native';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { COLORS, RADIUS, SPACING, SHADOW } from '@/src/utils/theme';
import { useAuth } from '@/context/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [phone, setPhone] = useState('');

  const handleSendOTP = () => {
    if (phone.length < 10) return;
    router.push({ pathname: '/(auth)/otp', params: { phone } });
  };

  const demoLogin = () => {
    login({
      id: '1',
      name: 'Ravi Kumar',
      phone: '9876543210',
      email: 'ravi@example.com',
      address: '42, Anna Nagar, Coimbatore',
    });
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <LinearGradient colors={COLORS.gradient.header} style={styles.heroSection}>
            <TouchableOpacity onPress={() => router.back()} style={styles.back}>
              <Icon name="arrow-left" size={24} color={COLORS.text.primary} />
            </TouchableOpacity>
            <View style={styles.heroBg}>
              <Icon name="content-cut" size={52} color={COLORS.primary} />
              <Text style={styles.heroTitle}>Customer Login</Text>
              <Text style={styles.heroSub}>Enter your mobile number to continue</Text>
            </View>
          </LinearGradient>

          <View style={styles.form}>
            <Text style={styles.label}>Mobile Number</Text>
            <View style={styles.inputRow}>
              <View style={styles.prefix}>
                <Text style={styles.prefixText}>{'\ud83c\uddee\ud83c\uddf3'} +91</Text>
              </View>
              <TextInput
                style={styles.input}
                placeholder="Enter 10-digit number"
                placeholderTextColor={COLORS.text.muted}
                keyboardType="phone-pad"
                maxLength={10}
                value={phone}
                onChangeText={setPhone}
              />
            </View>

            <TouchableOpacity
              style={[styles.btn, phone.length < 10 && styles.btnDisabled]}
              onPress={handleSendOTP}
              disabled={phone.length < 10}
            >
              <Text style={styles.btnText}>Send OTP</Text>
            </TouchableOpacity>

            <View style={styles.divider}>
              <View style={styles.divLine} />
              <Text style={styles.divText}>OR</Text>
              <View style={styles.divLine} />
            </View>

            <TouchableOpacity style={styles.demoBtn} onPress={demoLogin}>
              <Text style={styles.demoBtnText}>{'\u26a1'} Demo Login (Skip OTP)</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push('/(auth)/register')} style={styles.registerLink}>
              <Text style={styles.registerText}>
                New user? <Text style={{ color: COLORS.primary, fontWeight: '700' }}>Register here</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  container: { flexGrow: 1 },
  back: { paddingHorizontal: SPACING.base, paddingTop: 44, paddingBottom: SPACING.sm },
  heroSection: { overflow: 'hidden' },
  heroBg: {
    paddingVertical: 36, paddingHorizontal: 24,
    alignItems: 'center',
  },
  heroTitle: { fontSize: 26, fontWeight: '800', color: COLORS.text.primary, marginTop: 12, marginBottom: 8 },
  heroSub: { fontSize: 14, color: 'rgba(31,31,31,0.7)' },
  form: { padding: 24 },
  label: { fontSize: 13, color: COLORS.text.secondary, fontWeight: '600', marginBottom: 8, marginTop: 8 },
  inputRow: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: RADIUS.lg, overflow: 'hidden', marginBottom: 20,
    ...SHADOW.sm,
  },
  prefix: {
    paddingHorizontal: 14, paddingVertical: 14,
    backgroundColor: '#F7F7F7', borderRightWidth: 1, borderRightColor: '#EFEFEF',
    justifyContent: 'center',
  },
  prefixText: { fontWeight: '600', color: COLORS.text.secondary, fontSize: 14 },
  input: { flex: 1, paddingHorizontal: 14, fontSize: 16, color: COLORS.text.primary },
  btn: {
    backgroundColor: COLORS.primary, borderRadius: RADIUS.full,
    paddingVertical: 15, alignItems: 'center', marginBottom: 16,
  },
  btnDisabled: { backgroundColor: '#CCC' },
  btnText: { color: '#FFF', fontWeight: '700', fontSize: 16 },
  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: 16 },
  divLine: { flex: 1, height: 1, backgroundColor: COLORS.border },
  divText: { marginHorizontal: 12, color: COLORS.text.muted, fontSize: 13 },
  demoBtn: {
    borderWidth: 1.5, borderColor: COLORS.primary,
    borderRadius: RADIUS.full, paddingVertical: 13,
    alignItems: 'center', marginBottom: 16,
    backgroundColor: '#FFF',
  },
  demoBtnText: { color: COLORS.primary, fontWeight: '700', fontSize: 15 },
  registerLink: { alignItems: 'center', marginTop: 8 },
  registerText: { fontSize: 14, color: COLORS.text.secondary },
});
