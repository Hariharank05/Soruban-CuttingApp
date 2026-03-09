import AsyncStorage from '@react-native-async-storage/async-storage';
import type { User } from '@/types';

const USERS_KEY = '@json_users';

export async function loadUsers(): Promise<User[]> {
  try {
    const raw = await AsyncStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

async function saveUsers(users: User[]): Promise<void> {
  await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export async function upsertUser(user: User): Promise<User> {
  const users = await loadUsers();
  const idx = users.findIndex(u => u.phone === user.phone);
  if (idx >= 0) {
    users[idx] = { ...users[idx], ...user };
  } else {
    users.push(user);
  }
  await saveUsers(users);
  return idx >= 0 ? users[idx] : user;
}

export async function findUserByPhone(phone: string): Promise<User | null> {
  const users = await loadUsers();
  return users.find(u => u.phone === phone) || null;
}
