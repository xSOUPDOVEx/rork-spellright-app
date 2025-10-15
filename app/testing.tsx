import Button from '@/components/Button';
import Colors from '@/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TestingScreen() {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.gradient.secondary[0], Colors.gradient.secondary[1]]}
        style={styles.headerGradient}
      >
        <SafeAreaView edges={['top']} style={styles.header}>
          <Text style={styles.emoji}>✍️</Text>
          <Text style={styles.title}>Testing Phase</Text>
          <Text style={styles.subtitle}>Practice what you learned</Text>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.cardContainer}>
          <View style={styles.card}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Coming Soon</Text>
            </View>

            <Text style={styles.description}>
              Test your knowledge by spelling words from memory. If you make mistakes, you&apos;ll get immediate correction and a chance to try again.
            </Text>

            <View style={styles.featuresContainer}>
              <View style={styles.featureItem}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.featureText}>Spell from memory</Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.featureText}>Immediate feedback</Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.featureText}>Correction opportunities</Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.featureText}>Progress to mastery</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <Button title="Back to Home" onPress={handleBack} testID="back-button" />
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerGradient: {
    paddingBottom: 32,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    alignItems: 'center',
  },
  emoji: {
    fontSize: 80,
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: Colors.white,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: Colors.white,
    opacity: 0.9,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    marginTop: -16,
  },
  cardContainer: {
    paddingHorizontal: 24,
    marginTop: 24,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 24,
    shadowColor: 'rgba(0, 0, 0, 0.08)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4,
  },
  badge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  badgeText: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: Colors.white,
  },
  description: {
    fontSize: 16,
    color: Colors.text,
    lineHeight: 24,
    marginBottom: 24,
  },
  featuresContainer: {
    gap: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  bullet: {
    fontSize: 20,
    color: Colors.primary,
    fontWeight: '700' as const,
    lineHeight: 24,
  },
  featureText: {
    flex: 1,
    fontSize: 16,
    color: Colors.textSecondary,
    lineHeight: 24,
  },
  buttonContainer: {
    paddingHorizontal: 24,
    marginTop: 32,
  },
});
