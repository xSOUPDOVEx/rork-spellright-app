import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { updateTheme, type ThemeType, type AccentColor } from '@/constants/colors';

export type SkillLevel = 'beginner' | 'intermediate' | 'advanced';

export type UserSettings = {
  voiceEnabled: boolean;
  difficulty: 'easy' | 'medium' | 'hard' | 'mixed';
  dailyGoal: number;
  isPremium: boolean;
  initialLevel: SkillLevel;
  theme: ThemeType;
  accentColor: AccentColor | null;
};

export type UserStats = {
  totalXP: number;
  currentStreak: number;
  longestStreak: number;
  wordsLearned: number;
  accuracy: number;
  level: number;
};

export type AppState = {
  isOnboarded: boolean;
  userName: string;
  settings: UserSettings;
  stats: UserStats;
  setOnboarded: (name: string, level: SkillLevel) => void;
  updateSettings: (settings: Partial<UserSettings>) => void;
  addXP: (xp: number) => void;
  updateStreak: () => void;
  incrementWordsLearned: () => void;
  updateAccuracy: (newAccuracy: number) => void;
  updateThemeSettings: (theme: ThemeType, accentColor?: AccentColor | null) => void;
};

const STORAGE_KEYS = {
  ONBOARDED: '@spellright_onboarded',
  USER_NAME: '@spellright_username',
  SETTINGS: '@spellright_settings',
  STATS: '@spellright_stats',
  LAST_PRACTICE: '@spellright_last_practice',
  THEME: '@spellright_theme',
};

const defaultSettings: UserSettings = {
  voiceEnabled: true,
  difficulty: 'mixed',
  dailyGoal: 50,
  isPremium: false,
  initialLevel: 'beginner',
  theme: 'warmParchment',
  accentColor: null,
};

const defaultStats: UserStats = {
  totalXP: 0,
  currentStreak: 0,
  longestStreak: 0,
  wordsLearned: 0,
  accuracy: 0,
  level: 1,
};

export const [AppProvider, useApp] = createContextHook(() => {
  const [isOnboarded, setIsOnboarded] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>('');
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [stats, setStats] = useState<UserStats>(defaultStats);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [onboarded, name, settingsData, statsData] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.ONBOARDED),
        AsyncStorage.getItem(STORAGE_KEYS.USER_NAME),
        AsyncStorage.getItem(STORAGE_KEYS.SETTINGS),
        AsyncStorage.getItem(STORAGE_KEYS.STATS),
      ]);

      if (onboarded) setIsOnboarded(true);
      if (name) setUserName(name);
      if (settingsData) {
        const parsed = JSON.parse(settingsData);
        setSettings(parsed);
        updateTheme(parsed.theme || 'warmParchment', parsed.accentColor || null);
      }
      if (statsData) setStats(JSON.parse(statsData));
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const setOnboarded = useCallback(async (name: string, level: SkillLevel) => {
    try {
      const updatedSettings = { ...settings, initialLevel: level };
      await AsyncStorage.multiSet([
        [STORAGE_KEYS.ONBOARDED, 'true'],
        [STORAGE_KEYS.USER_NAME, name],
        [STORAGE_KEYS.SETTINGS, JSON.stringify(updatedSettings)],
      ]);
      setIsOnboarded(true);
      setUserName(name);
      setSettings(updatedSettings);
    } catch (error) {
      console.error('Error saving onboarding:', error);
    }
  }, [settings]);

  const updateSettings = useCallback(async (newSettings: Partial<UserSettings>) => {
    try {
      const updated = { ...settings, ...newSettings };
      await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
      setSettings(updated);
    } catch (error) {
      console.error('Error updating settings:', error);
    }
  }, [settings]);

  const addXP = useCallback(async (xp: number) => {
    try {
      const newTotalXP = stats.totalXP + xp;
      const newLevel = Math.floor(newTotalXP / 100) + 1;
      const updated = { ...stats, totalXP: newTotalXP, level: newLevel };
      await AsyncStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(updated));
      setStats(updated);
    } catch (error) {
      console.error('Error adding XP:', error);
    }
  }, [stats]);

  const updateStreak = useCallback(async () => {
    try {
      const lastPractice = await AsyncStorage.getItem(STORAGE_KEYS.LAST_PRACTICE);
      const today = new Date().toDateString();
      
      if (lastPractice !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const isConsecutive = lastPractice === yesterday.toDateString();
        
        const newStreak = isConsecutive ? stats.currentStreak + 1 : 1;
        const newLongest = Math.max(newStreak, stats.longestStreak);
        
        const updated = {
          ...stats,
          currentStreak: newStreak,
          longestStreak: newLongest,
        };
        
        await AsyncStorage.multiSet([
          [STORAGE_KEYS.STATS, JSON.stringify(updated)],
          [STORAGE_KEYS.LAST_PRACTICE, today],
        ]);
        setStats(updated);
      }
    } catch (error) {
      console.error('Error updating streak:', error);
    }
  }, [stats]);

  const incrementWordsLearned = useCallback(async () => {
    try {
      const updated = { ...stats, wordsLearned: stats.wordsLearned + 1 };
      await AsyncStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(updated));
      setStats(updated);
    } catch (error) {
      console.error('Error incrementing words learned:', error);
    }
  }, [stats]);

  const updateAccuracy = useCallback(async (newAccuracy: number) => {
    try {
      const updated = { ...stats, accuracy: newAccuracy };
      await AsyncStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(updated));
      setStats(updated);
    } catch (error) {
      console.error('Error updating accuracy:', error);
    }
  }, [stats]);

  const updateThemeSettings = useCallback(async (theme: ThemeType, accentColor?: AccentColor | null) => {
    try {
      const updated = { ...settings, theme, accentColor: accentColor || null };
      await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
      setSettings(updated);
      updateTheme(theme, accentColor || null);
    } catch (error) {
      console.error('Error updating theme:', error);
    }
  }, [settings]);

  return useMemo(() => ({
    isOnboarded,
    userName,
    settings,
    stats,
    setOnboarded,
    updateSettings,
    addXP,
    updateStreak,
    incrementWordsLearned,
    updateAccuracy,
    updateThemeSettings,
  }), [isOnboarded, userName, settings, stats, setOnboarded, updateSettings, addXP, updateStreak, incrementWordsLearned, updateAccuracy, updateThemeSettings]);
});
