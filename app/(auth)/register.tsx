import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  ScrollView, KeyboardAvoidingView, Platform, StatusBar,
} from 'react-native';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { COLORS, RADIUS, SPACING, SHADOW } from '@/src/utils/theme';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RegisterScreen() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', phone: '', address: '' });

  const update = (key: string, val: string) => setForm(f => ({ ...f, [key]: val }));

  const handleRegister = () => {
    router.push({
      pathname: '/(auth)/otp',
      params: {
        phone: form.phone,
        name: form.name.trim(),
        address: form.address.trim(),
      },
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
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.sub}>Register as customer</Text>
          </LinearGradient>

          <View style={styles.formArea}>
            <View style={styles.field}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your name"
                placeholderTextColor={COLORS.text.muted}
                value={form.name}
                onChangeText={v => update('name', v)}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Mobile Number</Text>
              <TextInput
                style={styles.input}
                placeholder="10-digit mobile number"
                placeholderTextColor={COLORS.text.muted}
                keyboardType="phone-pad"
                maxLength={10}
                value={form.phone}
                onChangeText={v => update('phone', v)}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Address</Text>
              <TextInput
                style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
                placeholder="Enter your full address"
                placeholderTextColor={COLORS.text.muted}
                multiline
                numberOfLines={3}
                value={form.address}
                onChangeText={v => update('address', v)}
              />
            </View>

            <TouchableOpacity style={styles.btn} onPress={handleRegister}>
              <Text style={styles.btnText}>Register & Get OTP</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push('/(auth)/login')} style={styles.loginLink}>
              <Text style={styles.loginText}>
                Already have an account? <Text style={{ color: COLORS.primary, fontWeight: '700' }}>Login</Text>
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
  heroSection: { paddingHorizontal: 24, paddingBottom: 24 },
  back: { paddingTop: 44, paddingBottom: SPACING.sm },
  title: { fontSize: 28, fontWeight: '800', color: COLORS.text.primary, marginBottom: 6 },
  sub: { fontSize: 15, color: COLORS.text.secondary, textTransform: 'capitalize' },
  formArea: { paddingHorizontal: 24, paddingTop: 24 },
  field: { marginBottom: 18 },
  label: { fontSize: 13, color: COLORS.text.secondary, fontWeight: '600', marginBottom: 8 },
  input: {
    borderRadius: RADIUS.lg, paddingHorizontal: 14, paddingVertical: 12,
    fontSize: 15, color: COLORS.text.primary, backgroundColor: '#FFF',
    ...SHADOW.sm,
  },
  btn: { borderRadius: RADIUS.full, backgroundColor: COLORS.primary, paddingVertical: 15, alignItems: 'center', marginTop: 8, marginBottom: 16 },
  btnText: { color: '#FFF', fontWeight: '700', fontSize: 16 },
  loginLink: { alignItems: 'center', marginBottom: 24 },
  loginText: { fontSize: 14, color: COLORS.text.secondary },
});
