import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  Image, StatusBar, ScrollView, Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { COLORS, SPACING, RADIUS, SHADOW } from '@/src/utils/theme';
import { useAuth } from '@/context/AuthContext';

export default function EditProfileScreen() {
  const router = useRouter();
  const { user, updateUser } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [phone] = useState(user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');
  const [address, setAddress] = useState(user?.address || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [saving, setSaving] = useState(false);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please allow access to your photo library to set a profile picture.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled && result.assets[0]) {
      setAvatar(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please allow access to your camera to take a profile picture.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled && result.assets[0]) {
      setAvatar(result.assets[0].uri);
    }
  };

  const showImageOptions = () => {
    Alert.alert('Profile Photo', 'Choose an option', [
      { text: 'Take Photo', onPress: takePhoto },
      { text: 'Choose from Gallery', onPress: pickImage },
      ...(avatar ? [{ text: 'Remove Photo', style: 'destructive' as const, onPress: () => setAvatar('') }] : []),
      { text: 'Cancel', style: 'cancel' as const },
    ]);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Required', 'Please enter your name.');
      return;
    }
    setSaving(true);
    try {
      await updateUser({
        name: name.trim(),
        email: email.trim(),
        address: address.trim(),
        avatar,
      });
      Alert.alert('Success', 'Profile updated successfully.', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch {
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Icon name="arrow-left" size={24} color={COLORS.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {/* Avatar */}
          <View style={styles.avatarSection}>
            <TouchableOpacity onPress={showImageOptions} activeOpacity={0.8}>
              <View style={styles.avatarWrap}>
                {avatar ? (
                  <Image source={{ uri: avatar }} style={styles.avatarImage} />
                ) : (
                  <View style={styles.avatarPlaceholder}>
                    <Icon name="account" size={48} color={COLORS.primary} />
                  </View>
                )}
                <View style={styles.cameraBadge}>
                  <Icon name="camera" size={14} color="#FFF" />
                </View>
              </View>
            </TouchableOpacity>
            <Text style={styles.avatarHint}>Tap to change photo</Text>
          </View>

          {/* Form */}
          <View style={styles.formCard}>
            <View style={styles.field}>
              <Text style={styles.label}>Full Name</Text>
              <View style={styles.inputRow}>
                <Icon name="account-outline" size={20} color={COLORS.text.muted} />
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter your name"
                  placeholderTextColor={COLORS.text.muted}
                />
              </View>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Phone Number</Text>
              <View style={[styles.inputRow, styles.inputDisabled]}>
                <Icon name="phone-outline" size={20} color={COLORS.text.muted} />
                <Text style={styles.disabledText}>+91 {phone}</Text>
                <Icon name="lock-outline" size={14} color={COLORS.text.muted} />
              </View>
              <Text style={styles.hint}>Phone number cannot be changed</Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Email Address</Text>
              <View style={styles.inputRow}>
                <Icon name="email-outline" size={20} color={COLORS.text.muted} />
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter your email"
                  placeholderTextColor={COLORS.text.muted}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Delivery Address</Text>
              <View style={[styles.inputRow, { alignItems: 'flex-start', paddingVertical: 12 }]}>
                <Icon name="map-marker-outline" size={20} color={COLORS.text.muted} style={{ marginTop: 2 }} />
                <TextInput
                  style={[styles.input, { minHeight: 60, textAlignVertical: 'top' }]}
                  value={address}
                  onChangeText={setAddress}
                  placeholder="Enter your delivery address"
                  placeholderTextColor={COLORS.text.muted}
                  multiline
                  numberOfLines={3}
                />
              </View>
            </View>
          </View>

          {/* Save Button */}
          <TouchableOpacity
            style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
            onPress={handleSave}
            disabled={saving}
            activeOpacity={0.85}
          >
            <Icon name="check" size={18} color="#FFF" />
            <Text style={styles.saveBtnText}>{saving ? 'Saving...' : 'Save Changes'}</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: SPACING.base, paddingVertical: SPACING.md,
    backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: COLORS.text.primary },
  scroll: { padding: SPACING.base, paddingBottom: 40 },
  avatarSection: { alignItems: 'center', marginBottom: SPACING.xl },
  avatarWrap: { position: 'relative' },
  avatarImage: { width: 100, height: 100, borderRadius: 50, borderWidth: 3, borderColor: COLORS.primary },
  avatarPlaceholder: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: COLORS.backgroundSoft, justifyContent: 'center', alignItems: 'center',
    borderWidth: 3, borderColor: COLORS.primary, borderStyle: 'dashed',
  },
  cameraBadge: {
    position: 'absolute', bottom: 2, right: 2,
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: '#FFF',
  },
  avatarHint: { fontSize: 12, color: COLORS.text.muted, marginTop: 8 },
  formCard: {
    backgroundColor: '#FFF', borderRadius: RADIUS.lg,
    padding: SPACING.base, ...SHADOW.sm,
  },
  field: { marginBottom: SPACING.lg },
  label: { fontSize: 13, fontWeight: '700', color: COLORS.text.primary, marginBottom: 8 },
  inputRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: COLORS.background, borderRadius: RADIUS.md,
    paddingHorizontal: 14, paddingVertical: 10,
    borderWidth: 1, borderColor: COLORS.border,
  },
  input: { flex: 1, fontSize: 15, color: COLORS.text.primary },
  inputDisabled: { backgroundColor: '#F1F5F9' },
  disabledText: { flex: 1, fontSize: 15, color: COLORS.text.secondary },
  hint: { fontSize: 11, color: COLORS.text.muted, marginTop: 4, marginLeft: 4 },
  saveBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: COLORS.primary, borderRadius: RADIUS.full,
    paddingVertical: 14, marginTop: SPACING.xl,
  },
  saveBtnDisabled: { opacity: 0.6 },
  saveBtnText: { fontSize: 15, fontWeight: '700', color: '#FFF' },
});
