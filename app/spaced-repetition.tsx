import Button from '@/components/Button';
import Colors from '@/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SpacedRepetitionScreen() {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.gradient.warning[0], Colors.gradient.warning[1]]}
        style={styles.headerGradient}
      >
        <SafeAreaView edges={['top']} style={styles.header}>
          <Text style={styles.emoji}>🎴</Text>
          <Text style={styles.title}>Spaced Repetition</Text>
          <Text style={styles.subtitle}>Review with smart flashcards</Text>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.cardContainer}>
          <View style={styles.card}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Coming Soon</Text>
            </View>

            <Text style={styles.description}>
              Once you&apos;ve mastered a word, we&apos;ll bring it back at optimal intervals to ensure long-term retention. The better you do, the less often you&apos;ll see it.
            </Text>

            <View style={styles.featuresContainer}>
              <View style={styles.featureItem}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.featureText}>Smart review scheduling</Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.featureText}>Quick flashcard format</Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.featureText}>Retention tracking</Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.featureText}>Mastery milestones</Text>
              </View>
            </View>

            <View style={styles.intervalContainer}>
              <Text style={styles.intervalTitle}>Review Schedule</Text>
              <View style={styles.intervalTimeline}>
                <View style={styles.intervalItem}>
                  <View style={styles.intervalDot} />
                  <Text style={styles.intervalText}>Day 1</Text>
                </View>
                <View style={styles.intervalArrow}>
                  <Text style={styles.arrowText}>→</Text>
                </View>
                <View style={styles.intervalItem}>
                  <View style={styles.intervalDot} />
                  <Text style={styles.intervalText}>Day 3</Text>
                </View>
                <View style={styles.intervalArrow}>
                  <Text style={styles.arrowText}>→</Text>
                </View>
                <View style={styles.intervalItem}>
                  <View style={styles.intervalDot} />
                  <Text style={styles.intervalText}>Day 7</Text>
                </View>
              </View>
              <View style={styles.intervalTimeline}>
                <View style={styles.intervalItem}>
                  <View style={styles.intervalDot} />
                  <Text style={styles.intervalText}>Day 14</Text>
                </View>
                <View style={styles.intervalArrow}>
                  <Text style={styles.arrowText}>→</Text>
                </View>
                <View style={styles.intervalItem}>
                  <View style={styles.intervalDot} />
                  <Text style={styles.intervalText}>Day 30</Text>
                </View>
                <View style={styles.intervalArrow}>
                  <Text style={styles.arrowText}>→</Text>
                </View>
                <View style={styles.intervalItem}>
                  <View style={styles.intervalDot} />
                  <Text style={styles.intervalText}>Mastered</Text>
                </View>
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
    backgroundColor: Colors.success,
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
    marginBottom: 32,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  bullet: {
    fontSize: 20,
    color: Colors.warning,
    fontWeight: '700' as const,
    lineHeight: 24,
  },
  featureText: {
    flex: 1,
    fontSize: 16,
    color: Colors.textSecondary,
    lineHeight: 24,
  },
  intervalContainer: {
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 16,
    padding: 20,
    marginTop: 8,
  },
  intervalTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  intervalTimeline: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  intervalItem: {
    alignItems: 'center',
    gap: 8,
  },
  intervalDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.warning,
  },
  intervalText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
  },
  intervalArrow: {
    marginHorizontal: 8,
  },
  arrowText: {
    fontSize: 16,
    color: Colors.warning,
    fontWeight: '700' as const,
  },
  buttonContainer: {
    paddingHorizontal: 24,
    marginTop: 32,
  },
});
