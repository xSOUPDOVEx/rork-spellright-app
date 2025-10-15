import Button from '@/components/Button';
import Card from '@/components/Card';
import Colors from '@/constants/colors';
import { useApp } from '@/contexts/AppContext';
import { Word } from '@/mocks/words';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Check, TrendingUp, X } from 'lucide-react-native';
import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type ResultItem = {
  word: Word;
  correct: boolean;
};

export default function ResultsScreen() {
  const { resultsData } = useLocalSearchParams<{ resultsData: string }>();
  const { updateAccuracy, stats } = useApp();
  const router = useRouter();

  const results: ResultItem[] = resultsData ? JSON.parse(resultsData) : [];
  const correctCount = results.filter(r => r.correct).length;
  const accuracy = Math.round((correctCount / results.length) * 100);

  useEffect(() => {
    if (results.length > 0) {
      const newAccuracy = Math.round(
        (stats.accuracy * stats.wordsLearned + accuracy * results.length) /
        (stats.wordsLearned + results.length)
      );
      updateAccuracy(newAccuracy);
    }
  }, [results.length, stats.accuracy, stats.wordsLearned, accuracy, updateAccuracy]);

  const getTip = () => {
    if (accuracy === 100) {
      return "Perfect score! You're a spelling champion! 🏆";
    } else if (accuracy >= 80) {
      return "Great job! Keep practicing to maintain your accuracy. 📚";
    } else if (accuracy >= 60) {
      return "Good effort! Review the words you missed and try again. 💪";
    } else {
      return "Keep practicing! Focus on the patterns and hints provided. 🎯";
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <View style={styles.scoreCircle}>
              <Text style={styles.scoreText}>{accuracy}%</Text>
            </View>
            <Text style={styles.title}>Practice Complete!</Text>
            <Text style={styles.subtitle}>
              {correctCount} out of {results.length} correct
            </Text>
          </View>

          <Card style={styles.tipCard}>
            <View style={styles.tipHeader}>
              <TrendingUp size={24} color={Colors.primary} />
              <Text style={styles.tipTitle}>AI Tip</Text>
            </View>
            <Text style={styles.tipText}>{getTip()}</Text>
          </Card>

          <View style={styles.resultsSection}>
            <Text style={styles.sectionTitle}>Your Results</Text>
            {results.map((result, index) => (
              <Card key={index} style={styles.resultCard}>
                <View style={styles.resultHeader}>
                  <View style={styles.resultInfo}>
                    <Text style={styles.resultWord}>{result.word.word}</Text>
                    <Text style={styles.resultCategory}>{result.word.category}</Text>
                  </View>
                  <View
                    style={[
                      styles.resultBadge,
                      result.correct ? styles.correctBadge : styles.incorrectBadge,
                    ]}
                  >
                    {result.correct ? (
                      <Check size={20} color={Colors.white} />
                    ) : (
                      <X size={20} color={Colors.white} />
                    )}
                  </View>
                </View>
                {result.word.hint && (
                  <Text style={styles.resultHint}>💡 {result.word.hint}</Text>
                )}
              </Card>
            ))}
          </View>

          <View style={styles.actions}>
            <Button
              title="Practice Again"
              onPress={() => router.replace('/drill' as any)}
              testID="practice-again-button"
            />
            <Button
              title="Back to Home"
              onPress={() => router.replace('/(tabs)/home')}
              variant="outline"
              testID="back-home-button"
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    padding: 24,
    paddingTop: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 16,
  },
  scoreCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: 'rgba(0, 0, 0, 0.08)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4,
  },
  scoreText: {
    fontSize: 48,
    fontWeight: '700' as const,
    color: Colors.white,
  },
  title: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  tipCard: {
    marginBottom: 24,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  tipTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  tipText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  resultsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 16,
  },
  resultCard: {
    marginBottom: 12,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  resultInfo: {
    flex: 1,
  },
  resultWord: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 2,
  },
  resultCategory: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  resultBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  correctBadge: {
    backgroundColor: Colors.success,
  },
  incorrectBadge: {
    backgroundColor: Colors.error,
  },
  resultHint: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontStyle: 'italic' as const,
  },
  actions: {
    gap: 12,
  },
});
