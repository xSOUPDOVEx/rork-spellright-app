import Button from '@/components/Button';
import Colors from '@/constants/colors';
import { SkillLevel, useApp } from '@/contexts/AppContext';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { BookOpen, Brain, GraduationCap, Sparkles, Target, Trophy, Zap } from 'lucide-react-native';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function OnboardingScreen() {
  const [name, setName] = useState<string>('');
  const [skillLevel, setSkillLevel] = useState<SkillLevel>('beginner');
  const [step, setStep] = useState<number>(0);
  const { setOnboarded } = useApp();
  const router = useRouter();

  const handleContinue = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      if (name.trim()) {
        setOnboarded(name.trim(), skillLevel);
        router.replace('/(tabs)/home');
      }
    }
  };

  const features = [
    {
      icon: Brain,
      title: 'AI-powered practice',
    },
    {
      icon: Target,
      title: 'Pattern mastery',
    },
    {
      icon: Zap,
      title: 'Instant feedback',
    },
    {
      icon: Trophy,
      title: 'Track your progress',
    },
  ];

  const skillLevels = [
    {
      id: 'beginner' as SkillLevel,
      icon: BookOpen,
      title: 'Beginner',
      description: 'Learning basic words and patterns',
      detail: 'Start with: 3-5 letter words',
    },
    {
      id: 'intermediate' as SkillLevel,
      icon: Sparkles,
      title: 'Intermediate',
      description: 'Comfortable with common words',
      detail: 'Start with: 6-8 letter words',
    },
    {
      id: 'advanced' as SkillLevel,
      icon: GraduationCap,
      title: 'Advanced',
      description: 'Ready for challenging words',
      detail: 'Start with: Complex patterns',
    },
  ];

  return (
    <LinearGradient
      colors={[Colors.gradient.primary[0], Colors.gradient.primary[1]]}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {step === 0 && (
              <View style={styles.content}>
                <View style={styles.welcomeHeader}>
                  <View style={styles.appIconContainer}>
                    <Text style={styles.appIcon}>✏️</Text>
                  </View>
                  <Text style={styles.appName}>SpellRight</Text>
                  <Text style={styles.appTagline}>Master spelling through AI-powered practice</Text>
                  
                  <View style={styles.quickFeatures}>
                    {features.map((feature, index) => {
                      const Icon = feature.icon;
                      return (
                        <View key={index} style={styles.quickFeature}>
                          <Icon color={Colors.white} size={20} />
                          <Text style={styles.quickFeatureText}>{feature.title}</Text>
                        </View>
                      );
                    })}
                  </View>
                </View>
              </View>
            )}

            {step === 1 && (
              <View style={styles.content}>
                <View style={styles.header}>
                  <Text style={styles.title}>What&apos;s your spelling level?</Text>
                  <Text style={styles.subtitle}>
                    We&apos;ll customize your learning path
                  </Text>
                </View>

                <View style={styles.skillLevelsContainer}>
                  {skillLevels.map((level) => {
                    const Icon = level.icon;
                    const isSelected = skillLevel === level.id;
                    return (
                      <Pressable
                        key={level.id}
                        style={[styles.skillLevelCard, isSelected && styles.skillLevelCardSelected]}
                        onPress={() => setSkillLevel(level.id)}
                        testID={`skill-level-${level.id}`}
                      >
                        <View style={[styles.skillIconContainer, isSelected && styles.skillIconContainerSelected]}>
                          <Icon color={isSelected ? Colors.white : Colors.primary} size={32} />
                        </View>
                        <View style={styles.skillLevelContent}>
                          <Text style={[styles.skillLevelTitle, isSelected && styles.skillLevelTitleSelected]}>
                            {level.title}
                          </Text>
                          <Text style={[styles.skillLevelDescription, isSelected && styles.skillLevelDescriptionSelected]}>
                            {level.description}
                          </Text>
                          <Text style={[styles.skillLevelDetail, isSelected && styles.skillLevelDetailSelected]}>
                            {level.detail}
                          </Text>
                        </View>
                        {isSelected && (
                          <View style={styles.checkmark}>
                            <Text style={styles.checkmarkText}>✓</Text>
                          </View>
                        )}
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            )}

            {step === 2 && (
              <View style={styles.content}>
                <View style={styles.header}>
                  <Text style={styles.title}>How It Works</Text>
                  <Text style={styles.subtitle}>
                    SpellRight uses proven techniques to help you master spelling
                  </Text>
                </View>

                <View style={styles.stepsContainer}>
                  <View style={styles.stepCard}>
                    <View style={styles.stepNumber}>
                      <Text style={styles.stepNumberText}>1</Text>
                    </View>
                    <Text style={styles.stepTitle}>Practice Daily</Text>
                    <Text style={styles.stepDescription}>
                      Complete short spelling drills with words matched to your level
                    </Text>
                  </View>

                  <View style={styles.stepCard}>
                    <View style={styles.stepNumber}>
                      <Text style={styles.stepNumberText}>2</Text>
                    </View>
                    <Text style={styles.stepTitle}>Get Instant Feedback</Text>
                    <Text style={styles.stepDescription}>
                      Receive AI-powered tips and pattern recognition hints
                    </Text>
                  </View>

                  <View style={styles.stepCard}>
                    <View style={styles.stepNumber}>
                      <Text style={styles.stepNumberText}>3</Text>
                    </View>
                    <Text style={styles.stepTitle}>Track Progress</Text>
                    <Text style={styles.stepDescription}>
                      Watch your accuracy improve and earn XP as you learn
                    </Text>
                  </View>
                </View>
              </View>
            )}

            {step === 3 && (
              <View style={styles.content}>
                <View style={styles.header}>
                  <Text style={styles.title}>What&apos;s your name?</Text>
                  <Text style={styles.subtitle}>
                    Let&apos;s personalize your learning experience
                  </Text>
                </View>

                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your name"
                    placeholderTextColor={Colors.textLight}
                    value={name}
                    onChangeText={setName}
                    autoFocus
                    testID="name-input"
                  />
                </View>
              </View>
            )}
          </ScrollView>

          <View style={styles.footer}>
            <Button
              title={step === 3 ? 'Get Started' : 'Continue'}
              onPress={handleContinue}
              disabled={step === 3 && !name.trim()}
              testID="continue-button"
            />
            {step > 0 && (
              <Button
                title="Back"
                onPress={() => setStep(step - 1)}
                variant="outline"
                testID="back-button"
              />
            )}
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  welcomeHeader: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  appIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 28,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: 'rgba(0, 0, 0, 0.15)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 8,
  },
  appIcon: {
    fontSize: 56,
  },
  appName: {
    fontSize: 48,
    fontWeight: '700' as const,
    color: Colors.white,
    marginBottom: 8,
  },
  appTagline: {
    fontSize: 18,
    color: Colors.white,
    opacity: 0.95,
    textAlign: 'center',
    marginBottom: 48,
    paddingHorizontal: 32,
    lineHeight: 26,
  },
  quickFeatures: {
    gap: 16,
    alignItems: 'flex-start',
  },
  quickFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  quickFeatureText: {
    fontSize: 16,
    color: Colors.white,
    fontWeight: '500' as const,
  },
  title: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: Colors.white,
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: Colors.white,
    opacity: 0.9,
    textAlign: 'center',
    lineHeight: 24,
  },
  skillLevelsContainer: {
    gap: 16,
  },
  skillLevelCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: 'rgba(0, 0, 0, 0.08)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4,
  },
  skillLevelCardSelected: {
    backgroundColor: Colors.white,
    borderColor: Colors.primary,
  },
  skillIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  skillIconContainerSelected: {
    backgroundColor: Colors.primary,
  },
  skillLevelContent: {
    flex: 1,
  },
  skillLevelTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.white,
    marginBottom: 4,
  },
  skillLevelTitleSelected: {
    color: Colors.text,
  },
  skillLevelDescription: {
    fontSize: 14,
    color: Colors.white,
    opacity: 0.9,
    marginBottom: 4,
  },
  skillLevelDescriptionSelected: {
    color: Colors.textSecondary,
    opacity: 1,
  },
  skillLevelDetail: {
    fontSize: 13,
    color: Colors.white,
    opacity: 0.8,
    fontWeight: '500' as const,
  },
  skillLevelDetailSelected: {
    color: Colors.primary,
    opacity: 1,
  },
  checkmark: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    fontSize: 18,
    color: Colors.white,
    fontWeight: '700' as const,
  },
  stepsContainer: {
    gap: 20,
  },
  stepCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: 'rgba(0, 0, 0, 0.08)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4,
  },
  stepNumber: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  stepNumberText: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.primary,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: Colors.white,
    marginBottom: 8,
    textAlign: 'center',
  },
  stepDescription: {
    fontSize: 14,
    color: Colors.white,
    opacity: 0.9,
    textAlign: 'center',
    lineHeight: 20,
  },
  inputContainer: {
    marginTop: 32,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    padding: 16,
    fontSize: 18,
    color: Colors.white,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: 'rgba(0, 0, 0, 0.08)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4,
  },
  footer: {
    padding: 24,
    gap: 12,
  },
});
