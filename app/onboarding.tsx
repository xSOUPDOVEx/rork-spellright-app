import Button from '@/components/Button';
import Colors from '@/constants/colors';
import { useApp } from '@/contexts/AppContext';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { BookOpen, Brain, Trophy } from 'lucide-react-native';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function OnboardingScreen() {
  const [name, setName] = useState<string>('');
  const [step, setStep] = useState<number>(0);
  const { setOnboarded } = useApp();
  const router = useRouter();

  const handleContinue = () => {
    if (step < 2) {
      setStep(step + 1);
    } else {
      if (name.trim()) {
        setOnboarded(name.trim());
        router.replace('/(tabs)/home');
      }
    }
  };

  const features = [
    {
      icon: Brain,
      title: 'Adaptive Learning',
      description: 'AI-powered system adapts to your skill level and learning pace',
    },
    {
      icon: BookOpen,
      title: 'Pattern Recognition',
      description: 'Learn spelling patterns and rules that stick with you forever',
    },
    {
      icon: Trophy,
      title: 'Gamified Progress',
      description: 'Earn XP, maintain streaks, and track your improvement over time',
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
                <View style={styles.header}>
                  <Text style={styles.logo}>SpellRight</Text>
                  <Text style={styles.tagline}>Master spelling through AI-powered practice</Text>
                </View>

                <View style={styles.featuresContainer}>
                  {features.map((feature, index) => {
                    const Icon = feature.icon;
                    return (
                      <View key={index} style={styles.featureCard}>
                        <View style={styles.iconContainer}>
                          <Icon color={Colors.primary} size={32} />
                        </View>
                        <View style={styles.featureText}>
                          <Text style={styles.featureTitle}>{feature.title}</Text>
                          <Text style={styles.featureDescription}>{feature.description}</Text>
                        </View>
                      </View>
                    );
                  })}
                </View>
              </View>
            )}

            {step === 1 && (
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

            {step === 2 && (
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
              title={step === 2 ? 'Get Started' : 'Continue'}
              onPress={handleContinue}
              disabled={step === 2 && !name.trim()}
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
  logo: {
    fontSize: 48,
    fontWeight: '700' as const,
    color: Colors.white,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 18,
    color: Colors.white,
    opacity: 0.9,
    textAlign: 'center',
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
  featuresContainer: {
    gap: 16,
  },
  featureCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    shadowColor: 'rgba(0, 0, 0, 0.08)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.white,
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: Colors.white,
    opacity: 0.9,
    lineHeight: 20,
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
