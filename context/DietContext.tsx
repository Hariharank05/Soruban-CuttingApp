import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { FamilyMember, VacationMode } from '@/types';

const DIET_KEY = '@cutting_diet';
const FAMILY_KEY = '@cutting_family';
const VACATION_KEY = '@cutting_vacation';

export type UserGender = 'male' | 'female' | 'other' | '';
export type UserLifestyle = 'gym' | 'student' | 'working' | 'homemaker' | '';
export type UserCategory = 'gym_male' | 'gym_female' | 'hostel_girl' | 'hostel_boy' | 'parent' | 'caretaker' | 'working_pro' | 'homemaker' | '';

interface DietContextType {
  selectedDiets: string[];
  allergies: string[];
  healthGoals: string[];
  gender: UserGender;
  lifestyle: UserLifestyle;
  userCategory: UserCategory;
  userName: string;
  userAge: string;
  familyMembers: FamilyMember[];
  vacationMode: VacationMode | null;
  profileComplete: boolean;
  setDietPreferences: (diets: string[]) => Promise<void>;
  setAllergies: (allergies: string[]) => Promise<void>;
  setHealthGoals: (goals: string[]) => Promise<void>;
  setGender: (gender: UserGender) => Promise<void>;
  setLifestyle: (lifestyle: UserLifestyle) => Promise<void>;
  setFullProfile: (data: { userName: string; userAge: string; gender: UserGender; userCategory: UserCategory; lifestyle: UserLifestyle; healthGoals: string[] }) => Promise<void>;
  resetProfile: () => Promise<void>;
  addFamilyMember: (member: Omit<FamilyMember, 'id'>) => Promise<void>;
  removeFamilyMember: (id: string) => Promise<void>;
  updateFamilyMember: (id: string, updates: Partial<FamilyMember>) => Promise<void>;
  setVacationMode: (vacation: VacationMode | null) => Promise<void>;
}

interface DietState {
  selectedDiets: string[];
  allergies: string[];
  healthGoals: string[];
  gender: UserGender;
  lifestyle: UserLifestyle;
  userCategory: UserCategory;
  userName: string;
  userAge: string;
}

const DEFAULT_DIET: DietState = { selectedDiets: [], allergies: [], healthGoals: [], gender: '', lifestyle: '', userCategory: '', userName: '', userAge: '' };

const DietContext = createContext<DietContextType>({
  selectedDiets: [], allergies: [], healthGoals: [], gender: '', lifestyle: '',
  userCategory: '', userName: '', userAge: '',
  familyMembers: [], vacationMode: null, profileComplete: false,
  setDietPreferences: async () => {}, setAllergies: async () => {}, setHealthGoals: async () => {},
  setGender: async () => {}, setLifestyle: async () => {},
  setFullProfile: async () => {}, resetProfile: async () => {},
  addFamilyMember: async () => {}, removeFamilyMember: async () => {}, updateFamilyMember: async () => {},
  setVacationMode: async () => {},
});

export function DietProvider({ children }: { children: React.ReactNode }) {
  const [diet, setDiet] = useState<DietState>(DEFAULT_DIET);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [vacationMode, setVacationModeState] = useState<VacationMode | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const [dRaw, fRaw, vRaw] = await Promise.all([
          AsyncStorage.getItem(DIET_KEY), AsyncStorage.getItem(FAMILY_KEY), AsyncStorage.getItem(VACATION_KEY),
        ]);
        if (dRaw) setDiet(JSON.parse(dRaw));
        if (fRaw) setFamilyMembers(JSON.parse(fRaw));
        if (vRaw) setVacationModeState(JSON.parse(vRaw));
      } catch {}
    })();
  }, []);

  const persistDiet = useCallback(async (d: DietState) => {
    setDiet(d);
    await AsyncStorage.setItem(DIET_KEY, JSON.stringify(d));
  }, []);

  const setDietPreferences = useCallback(async (diets: string[]) => {
    await persistDiet({ ...diet, selectedDiets: diets });
  }, [diet, persistDiet]);

  const setAllergiesFunc = useCallback(async (allergies: string[]) => {
    await persistDiet({ ...diet, allergies });
  }, [diet, persistDiet]);

  const setHealthGoals = useCallback(async (goals: string[]) => {
    await persistDiet({ ...diet, healthGoals: goals });
  }, [diet, persistDiet]);

  const setGender = useCallback(async (gender: UserGender) => {
    await persistDiet({ ...diet, gender });
  }, [diet, persistDiet]);

  const setLifestyle = useCallback(async (lifestyle: UserLifestyle) => {
    await persistDiet({ ...diet, lifestyle });
  }, [diet, persistDiet]);

  const setFullProfile = useCallback(async (data: { userName: string; userAge: string; gender: UserGender; userCategory: UserCategory; lifestyle: UserLifestyle; healthGoals: string[] }) => {
    await persistDiet({ ...diet, ...data });
  }, [diet, persistDiet]);

  const resetProfile = useCallback(async () => {
    setDiet(DEFAULT_DIET);
    await AsyncStorage.removeItem(DIET_KEY);
  }, []);

  const profileComplete = !!(diet.userCategory && diet.userName);

  const addFamilyMember = useCallback(async (member: Omit<FamilyMember, 'id'>) => {
    const newMember: FamilyMember = { ...member, id: `fm_${Date.now()}` };
    const updated = [...familyMembers, newMember];
    setFamilyMembers(updated);
    await AsyncStorage.setItem(FAMILY_KEY, JSON.stringify(updated));
  }, [familyMembers]);

  const removeFamilyMember = useCallback(async (id: string) => {
    const updated = familyMembers.filter(m => m.id !== id);
    setFamilyMembers(updated);
    await AsyncStorage.setItem(FAMILY_KEY, JSON.stringify(updated));
  }, [familyMembers]);

  const updateFamilyMember = useCallback(async (id: string, updates: Partial<FamilyMember>) => {
    const updated = familyMembers.map(m => m.id === id ? { ...m, ...updates } : m);
    setFamilyMembers(updated);
    await AsyncStorage.setItem(FAMILY_KEY, JSON.stringify(updated));
  }, [familyMembers]);

  const setVacationMode = useCallback(async (vacation: VacationMode | null) => {
    setVacationModeState(vacation);
    if (vacation) {
      await AsyncStorage.setItem(VACATION_KEY, JSON.stringify(vacation));
    } else {
      await AsyncStorage.removeItem(VACATION_KEY);
    }
  }, []);

  const value = useMemo(() => ({
    selectedDiets: diet.selectedDiets, allergies: diet.allergies, healthGoals: diet.healthGoals,
    gender: diet.gender, lifestyle: diet.lifestyle,
    userCategory: diet.userCategory, userName: diet.userName, userAge: diet.userAge,
    profileComplete,
    familyMembers, vacationMode,
    setDietPreferences, setAllergies: setAllergiesFunc, setHealthGoals,
    setGender, setLifestyle, setFullProfile, resetProfile,
    addFamilyMember, removeFamilyMember, updateFamilyMember, setVacationMode,
  }), [diet, familyMembers, vacationMode, profileComplete, setDietPreferences, setAllergiesFunc, setHealthGoals, setGender, setLifestyle, setFullProfile, resetProfile, addFamilyMember, removeFamilyMember, updateFamilyMember, setVacationMode]);

  return <DietContext.Provider value={value}>{children}</DietContext.Provider>;
}

export const useDiet = () => useContext(DietContext);
