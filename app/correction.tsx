import Button from '@/components/Button';
import Colors from '@/constants/colors';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CorrectionScreen() {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerBackground}>
        <SafeAreaView edges={['top']} style={styles.header}>
          <Text style={styles.emoji}>🔄</Text>
          <Text style={styles.title}>Correction Phase</Text>
          <Text style={styles.subtitle}>Let&apos;s fix that and try again</Text>
        </SafeAreaView>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.cardContainer}>
          <View style={styles.card}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Coming Soon</Text>
            </View>

            <Text style={styles.description}>
              When you misspell a word, we&apos;ll show you exactly what went wrong, display the correct spelling, then give you a chance to try again immediately.
            </Text>

            <View style={styles.featuresContainer}>
              <View style={styles.featureItem}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.featureText}>See your mistakes highlighted</Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.featureText}>Learn the correct spelling</Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.featureText}>Re-test immediately</Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.featureText}>Multiple attempts allowed</Text>
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
  headerBackground: {
    backgroundColor: Colors.error,
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
    backgroundColor: Colors.error,
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
    color: Colors.error,
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
