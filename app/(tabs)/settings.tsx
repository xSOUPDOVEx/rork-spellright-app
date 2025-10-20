import Button from '@/components/Button';
import Card from '@/components/Card';
import Colors, { THEMES, ACCENT_COLORS, type ThemeType, type AccentColor } from '@/constants/colors';
import { useApp } from '@/contexts/AppContext';
import { useRouter } from 'expo-router';
import { ChevronRight, Crown, Volume2, VolumeX, Check, Smartphone } from 'lucide-react-native';
import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
  const { userName, settings, updateSettings, updateThemeSettings, themeVersion } = useApp();
  const router = useRouter();

  const styles = useMemo(() => createStyles(), [themeVersion]);

  const difficulties = [
    { value: 'easy' as const, label: 'Easy' },
    { value: 'medium' as const, label: 'Med' },
    { value: 'hard' as const, label: 'Hard' },
    { value: 'mixed' as const, label: 'Mixed' },
  ];

  const goals = [25, 50, 100, 150];

  return (
    <View style={styles.container}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
          <Text style={styles.subtitle}>Customize your experience</Text>
        </View>
      </SafeAreaView>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Card style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{userName.charAt(0).toUpperCase()}</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{userName}</Text>
              <Text style={styles.profileStatus}>
                {settings.isPremium ? '👑 Premium Member' : 'Free Account'}
              </Text>
            </View>
          </View>
          {!settings.isPremium && (
            <Button
              title="Upgrade to Premium"
              onPress={() => router.push('/subscription' as any)}
              variant="outline"
              testID="upgrade-settings-button"
            />
          )}
        </Card>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>

          <Card>
            <Text style={styles.cardTitle}>Color Theme</Text>
            <View style={styles.themeGrid}>
              {(Object.keys(THEMES) as ThemeType[]).map((themeKey) => {
                const theme = THEMES[themeKey];
                const isSelected = settings.theme === themeKey;
                return (
                  <TouchableOpacity
                    key={themeKey}
                    style={[
                      styles.themeOption,
                      { backgroundColor: theme.background },
                      isSelected && styles.themeOptionSelected,
                    ]}
                    onPress={() => {
                      updateThemeSettings(themeKey, settings.accentColor);
                    }}
                    testID={`theme-${themeKey}`}
                  >
                    <View style={[styles.themeSwatch, { backgroundColor: theme.primary }]} />
                    {isSelected && (
                      <View style={styles.checkmarkContainer}>
                        <Check size={16} color={Colors.white} strokeWidth={3} />
                      </View>
                    )}
                    <Text style={[styles.themeLabel, { color: Colors.text }]} numberOfLines={2}>{theme.name}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </Card>

          <Card style={styles.cardMargin}>
            <Text style={styles.cardTitle}>Accent Color</Text>
            <View style={styles.accentGrid}>
              {ACCENT_COLORS.map((accent) => {
                const isSelected = settings.accentColor === accent.color;
                return (
                  <TouchableOpacity
                    key={accent.color}
                    style={[
                      styles.accentOption,
                      { backgroundColor: accent.color },
                      isSelected && styles.accentOptionSelected,
                    ]}
                    onPress={() => {
                      updateThemeSettings(settings.theme, accent.color);
                    }}
                    testID={`accent-${accent.name}`}
                  >
                    {isSelected && (
                      <Check size={20} color={Colors.white} strokeWidth={3} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
            <TouchableOpacity
              style={styles.resetButton}
              onPress={() => {
                updateThemeSettings(settings.theme, null);
              }}
            >
              <Text style={styles.resetButtonText}>Reset to Theme Default</Text>
            </TouchableOpacity>
          </Card>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Practice Settings</Text>

          <Card>
            <View style={styles.settingItem}>
              <View style={styles.settingHeader}>
                {settings.voiceEnabled ? (
                  <Volume2 size={20} color={Colors.primary} />
                ) : (
                  <VolumeX size={20} color={Colors.textLight} />
                )}
                <Text style={styles.settingLabel}>Voice Feedback</Text>
              </View>
              <Switch
                value={settings.voiceEnabled}
                onValueChange={(value) => updateSettings({ voiceEnabled: value })}
                trackColor={{ false: Colors.border, true: Colors.primary }}
                thumbColor={Colors.white}
                testID="voice-toggle"
              />
            </View>
          </Card>

          <Card style={styles.cardMargin}>
            <View style={styles.settingItem}>
              <View style={styles.settingHeader}>
                <Smartphone size={20} color={Colors.primary} />
                <Text style={styles.settingLabel}>Haptic Feedback</Text>
              </View>
              <Switch
                value={settings.hapticEnabled}
                onValueChange={(value) => updateSettings({ hapticEnabled: value })}
                trackColor={{ false: Colors.border, true: Colors.primary }}
                thumbColor={Colors.white}
                testID="haptic-toggle"
              />
            </View>
          </Card>

          <Card style={styles.cardMargin}>
            <Text style={styles.cardTitle}>Difficulty Level</Text>
            <View style={styles.optionsGrid}>
              {difficulties.map((diff) => (
                <TouchableOpacity
                  key={diff.value}
                  style={[
                    styles.optionButton,
                    settings.difficulty === diff.value && styles.optionButtonActive,
                  ]}
                  onPress={() => updateSettings({ difficulty: diff.value })}
                  testID={`difficulty-${diff.value}`}
                >
                  <Text
                    style={[
                      styles.optionText,
                      settings.difficulty === diff.value && styles.optionTextActive,
                    ]}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                  >
                    {diff.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </Card>

          <Card>
            <Text style={styles.cardTitle}>Daily Goal (XP)</Text>
            <View style={styles.optionsGrid}>
              {goals.map((goal) => (
                <TouchableOpacity
                  key={goal}
                  style={[
                    styles.optionButton,
                    settings.dailyGoal === goal && styles.optionButtonActive,
                  ]}
                  onPress={() => updateSettings({ dailyGoal: goal })}
                  testID={`goal-${goal}`}
                >
                  <Text
                    style={[
                      styles.optionText,
                      settings.dailyGoal === goal && styles.optionTextActive,
                    ]}
                    numberOfLines={1}
                  >
                    {goal}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </Card>
        </View>

        {!settings.isPremium && (
          <Card style={styles.premiumCard}>
            <View style={styles.premiumHeader}>
              <Crown size={32} color={Colors.warning} />
              <Text style={styles.premiumTitle}>Go Premium</Text>
            </View>
            <Text style={styles.premiumDescription}>
              Unlock unlimited practice, advanced analytics, and personalized learning paths
            </Text>
            <Button
              title="Learn More"
              onPress={() => router.push('/subscription' as any)}
              testID="learn-more-button"
            />
          </Card>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Card>
            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuLabel}>Privacy Policy</Text>
              <ChevronRight size={20} color={Colors.textLight} />
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuLabel}>Terms of Service</Text>
              <ChevronRight size={20} color={Colors.textLight} />
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuLabel}>Help & Support</Text>
              <ChevronRight size={20} color={Colors.textLight} />
            </TouchableOpacity>
          </Card>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}



function createStyles() {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.background,
    },
    safeArea: {
      backgroundColor: Colors.white,
    },
    header: {
      paddingHorizontal: 24,
      paddingVertical: 20,
      backgroundColor: Colors.white,
      borderBottomWidth: 1,
      borderBottomColor: Colors.border,
    },
    title: {
      fontSize: 28,
      fontWeight: '700' as const,
      color: Colors.text,
      marginBottom: 4,
    },
    subtitle: {
      fontSize: 14,
      color: Colors.textSecondary,
    },
    content: {
      flex: 1,
    },
    profileCard: {
      margin: 24,
      marginBottom: 16,
    },
    profileHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
      marginBottom: 20,
    },
    avatar: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: Colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: 'rgba(0, 0, 0, 0.08)',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 1,
      shadowRadius: 12,
      elevation: 4,
    },
    avatarText: {
      fontSize: 28,
      fontWeight: '700' as const,
      color: Colors.white,
    },
    profileInfo: {
      flex: 1,
    },
    profileName: {
      fontSize: 20,
      fontWeight: '600' as const,
      color: Colors.text,
      marginBottom: 4,
    },
    profileStatus: {
      fontSize: 14,
      color: Colors.textSecondary,
    },
    section: {
      paddingHorizontal: 24,
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600' as const,
      color: Colors.text,
      marginBottom: 12,
    },
    settingItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    settingHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    settingLabel: {
      fontSize: 16,
      color: Colors.text,
    },
    cardMargin: {
      marginTop: 12,
    },
    cardTitle: {
      fontSize: 16,
      fontWeight: '600' as const,
      color: Colors.text,
      marginBottom: 16,
    },
    optionsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    optionButton: {
      flex: 1,
      minWidth: '22%',
      paddingVertical: 16,
      paddingHorizontal: 4,
      borderRadius: 12,
      backgroundColor: Colors.backgroundSecondary,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: 'rgba(0, 0, 0, 0.08)',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 1,
      shadowRadius: 6,
      elevation: 2,
    },
    optionButtonActive: {
      backgroundColor: Colors.primary,
    },
    optionText: {
      fontSize: 14,
      fontWeight: '600' as const,
      color: Colors.text,
      textAlign: 'center' as const,
      numberOfLines: 1,
    },
    optionTextActive: {
      color: Colors.white,
    },
    premiumCard: {
      marginHorizontal: 24,
      marginBottom: 24,
    },
    premiumHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      marginBottom: 12,
    },
    premiumTitle: {
      fontSize: 20,
      fontWeight: '700' as const,
      color: Colors.text,
    },
    premiumDescription: {
      fontSize: 14,
      color: Colors.textSecondary,
      marginBottom: 20,
      lineHeight: 20,
    },
    menuItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 12,
    },
    menuLabel: {
      fontSize: 16,
      color: Colors.text,
    },
    divider: {
      height: 1,
      backgroundColor: Colors.border,
    },
    themeGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
    },
    themeOption: {
      flex: 1,
      minWidth: '45%',
      aspectRatio: 1.2,
      borderRadius: 16,
      padding: 16,
      justifyContent: 'space-between',
      borderWidth: 2,
      borderColor: 'transparent',
      shadowColor: 'rgba(0, 0, 0, 0.08)',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 1,
      shadowRadius: 8,
      elevation: 3,
    },
    themeOptionSelected: {
      borderColor: Colors.primary,
      shadowColor: Colors.primary,
      shadowOpacity: 0.3,
    },
    themeSwatch: {
      width: 40,
      height: 40,
      borderRadius: 20,
      shadowColor: 'rgba(0, 0, 0, 0.15)',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 1,
      shadowRadius: 4,
      elevation: 2,
    },
    checkmarkContainer: {
      position: 'absolute',
      top: 8,
      right: 8,
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: Colors.success,
      justifyContent: 'center',
      alignItems: 'center',
    },
    themeLabel: {
      fontSize: 10,
      fontWeight: '600' as const,
      marginTop: 8,
      textAlign: 'center' as const,
      lineHeight: 13,
    },
    accentGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
      marginBottom: 16,
    },
    accentOption: {
      width: 48,
      height: 48,
      borderRadius: 24,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 3,
      borderColor: 'transparent',
      shadowColor: 'rgba(0, 0, 0, 0.15)',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 1,
      shadowRadius: 6,
      elevation: 3,
    },
    accentOptionSelected: {
      borderColor: Colors.white,
      shadowColor: 'rgba(0, 0, 0, 0.3)',
      shadowOpacity: 1,
    },
    resetButton: {
      paddingVertical: 10,
      alignItems: 'center',
    },
    resetButtonText: {
      fontSize: 14,
      fontWeight: '600' as const,
      color: Colors.primary,
    },
  });
}
