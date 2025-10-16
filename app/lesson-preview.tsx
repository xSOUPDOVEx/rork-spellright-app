import Colors from '@/constants/colors';
import { useApp } from '@/contexts/AppContext';
import { mockWords, Word } from '@/mocks/words';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Clock, Lock, Star } from 'lucide-react-native';
import React, { useEffect, useRef } from 'react';
import { Animated, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

type LessonData = {
  id: string;
  title: string;
  description: string;
  pattern: string;
  estimatedTime: string;
  xpRequired: number;
  words: Word[];
};

const lessonDatabase: Record<string, LessonData> = {
  '1': {
    id: '1',
    title: 'Word Basics',
    description: 'Master fundamental spelling patterns with common everyday words',
    pattern: 'Basic Words',
    estimatedTime: '5 minutes',
    xpRequired: 0,
    words: mockWords.filter(w => w.difficulty === 'easy').slice(0, 8),
  },
  '2': {
    id: '2',
    title: 'Silent Letters',
    description: 'Learn to spell words with silent letters that can be tricky',
    pattern: 'Silent E',
    estimatedTime: '6 minutes',
    xpRequired: 50,
    words: mockWords.filter(w => w.word.includes('e')).slice(0, 8),
  },
  '3': {
    id: '3',
    title: 'Double Consonants',
    description: 'Practice words with doubled consonants like "happy" and "letter"',
    pattern: 'Double Letters',
    estimatedTime: '5 minutes',
    xpRequired: 100,
    words: mockWords.filter(w => w.difficulty === 'medium').slice(0, 8),
  },
  '4': {
    id: '4',
    title: 'Vowel Patterns',
    description: 'Master vowel combinations like "ea", "ai", and "oa"',
    pattern: 'Vowel Teams',
    estimatedTime: '7 minutes',
    xpRequired: 150,
    words: mockWords.filter(w => w.category === 'Verbs').slice(0, 8),
  },
  '5': {
    id: '5',
    title: 'Prefix & Suffix',
    description: 'Learn common prefixes and suffixes to expand your vocabulary',
    pattern: 'Word Parts',
    estimatedTime: '6 minutes',
    xpRequired: 250,
    words: mockWords.filter(w => w.difficulty === 'medium').slice(0, 8),
  },
  '6': {
    id: '6',
    title: 'Homophones',
    description: 'Distinguish between words that sound alike but spelled differently',
    pattern: 'Sound-Alikes',
    estimatedTime: '6 minutes',
    xpRequired: 350,
    words: mockWords.filter(w => w.difficulty === 'medium').slice(0, 8),
  },
  '7': {
    id: '7',
    title: 'Advanced Words',
    description: 'Challenge yourself with complex spelling patterns and difficult words',
    pattern: 'Expert Level',
    estimatedTime: '8 minutes',
    xpRequired: 450,
    words: mockWords.filter(w => w.difficulty === 'hard').slice(0, 8),
  },
};

export default function LessonPreviewScreen() {
  const router = useRouter();
  const { stats } = useApp();
  const params = useLocalSearchParams();
  const lessonId = params.lessonId as string || '1';
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  const lesson = lessonDatabase[lessonId];
  const isLocked = stats.totalXP < lesson.xpRequired;
  const xpNeeded = lesson.xpRequired - stats.totalXP;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleBeginLesson = () => {
    if (!isLocked) {
      router.push('/drill' as any);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return Colors.success;
      case 'medium':
        return Colors.warning;
      case 'hard':
        return Colors.error;
      default:
        return Colors.textLight;
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'Easy';
      case 'medium':
        return 'Medium';
      case 'hard':
        return 'Hard';
      default:
        return 'Unknown';
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Lesson Preview</Text>
          <View style={styles.headerRight} />
        </View>
      </SafeAreaView>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View
          style={[
            styles.animatedContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <LinearGradient
            colors={[Colors.courses.purple, Colors.courses.orange]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroCard}
          >
            <Text style={styles.lessonTitle}>{lesson.title}</Text>
            <Text style={styles.lessonDescription}>{lesson.description}</Text>
          </LinearGradient>

          {isLocked && (
            <View style={styles.lockedBanner}>
              <Lock size={20} color={Colors.warning} />
              <View style={styles.lockedTextContainer}>
                <Text style={styles.lockedTitle}>Lesson Locked</Text>
                <Text style={styles.lockedSubtitle}>
                  Complete previous lessons to unlock • Need {xpNeeded} more XP
                </Text>
              </View>
            </View>
          )}

          <View style={styles.statsCard}>
            <View style={styles.statRow}>
              <View style={styles.statItem}>
                <Clock size={20} color={Colors.primary} />
                <Text style={styles.statLabel}>Estimated time</Text>
                <Text style={styles.statValue}>{lesson.estimatedTime}</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.statItem}>
                <Text style={styles.statIcon}>📝</Text>
                <Text style={styles.statLabel}>Words in lesson</Text>
                <Text style={styles.statValue}>{lesson.words.length} words</Text>
              </View>
            </View>
            <View style={styles.patternRow}>
              <Text style={styles.patternLabel}>Pattern Focus:</Text>
              <View style={styles.patternBadge}>
                <Text style={styles.patternText}>{lesson.pattern}</Text>
              </View>
            </View>
          </View>

          <View style={styles.wordsSection}>
            <View style={styles.wordsSectionHeader}>
              <Text style={styles.wordsSectionTitle}>Words You&apos;ll Practice</Text>
              <Text style={styles.wordsSectionSubtitle}>
                {lesson.words.length} words total
              </Text>
            </View>

            {lesson.words.map((word, index) => (
              <View
                key={word.id}
                style={[
                  styles.wordCard,
                  isLocked && styles.wordCardLocked,
                ]}
              >
                <View style={styles.wordCardLeft}>
                  <View style={styles.wordNumberBadge}>
                    <Text style={styles.wordNumber}>{index + 1}</Text>
                  </View>
                  <View style={styles.wordInfo}>
                    <Text
                      style={[
                        styles.wordText,
                        isLocked && styles.wordTextLocked,
                      ]}
                    >
                      {word.word}
                    </Text>
                    {word.hint && (
                      <Text
                        style={[
                          styles.wordHint,
                          isLocked && styles.wordHintLocked,
                        ]}
                      >
                        {word.hint}
                      </Text>
                    )}
                  </View>
                </View>
                <View
                  style={[
                    styles.difficultyBadge,
                    {
                      backgroundColor: getDifficultyColor(word.difficulty) + '20',
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.difficultyText,
                      {
                        color: getDifficultyColor(word.difficulty),
                      },
                    ]}
                  >
                    {getDifficultyLabel(word.difficulty)}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          {!isLocked && (
            <View style={styles.tipsCard}>
              <View style={styles.tipsHeader}>
                <Star size={20} color={Colors.warning} fill={Colors.warning} />
                <Text style={styles.tipsTitle}>Tips for Success</Text>
              </View>
              <View style={styles.tipsList}>
                <View style={styles.tipItem}>
                  <Text style={styles.tipBullet}>•</Text>
                  <Text style={styles.tipText}>
                    Listen carefully to the pronunciation
                  </Text>
                </View>
                <View style={styles.tipItem}>
                  <Text style={styles.tipBullet}>•</Text>
                  <Text style={styles.tipText}>
                    Use the hint if you&apos;re unsure
                  </Text>
                </View>
                <View style={styles.tipItem}>
                  <Text style={styles.tipBullet}>•</Text>
                  <Text style={styles.tipText}>
                    Take your time, accuracy matters more than speed
                  </Text>
                </View>
              </View>
            </View>
          )}
        </Animated.View>

        <View style={{ height: 120 }} />
      </ScrollView>

      <SafeAreaView edges={['bottom']} style={styles.bottomSafeArea}>
        <View style={styles.bottomContainer}>
          {isLocked ? (
            <View style={styles.lockedButton}>
              <Lock size={20} color={Colors.white} />
              <Text style={styles.lockedButtonText}>Complete Previous Lessons</Text>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.beginButton}
              onPress={handleBeginLesson}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[Colors.courses.purple, Colors.courses.orange]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.beginButtonGradient}
              >
                <Text style={styles.beginButtonText}>Begin Lesson</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>
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
    backgroundColor: Colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  headerRight: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  animatedContainer: {
    padding: 20,
  },
  heroCard: {
    borderRadius: 24,
    padding: 28,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  lessonTitle: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.white,
    marginBottom: 12,
  },
  lessonDescription: {
    fontSize: 16,
    color: Colors.white,
    opacity: 0.95,
    lineHeight: 24,
  },
  lockedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.warning + '15',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.warning + '30',
  },
  lockedTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  lockedTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  lockedSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  statsCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  statRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  divider: {
    width: 1,
    backgroundColor: Colors.border,
    marginHorizontal: 16,
  },
  statIcon: {
    fontSize: 20,
  },
  statLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  patternRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  patternLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginRight: 8,
  },
  patternBadge: {
    backgroundColor: Colors.primary + '20',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
  },
  patternText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.primary,
  },
  wordsSection: {
    marginBottom: 20,
  },
  wordsSectionHeader: {
    marginBottom: 16,
  },
  wordsSectionTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  wordsSectionSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  wordCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  wordCardLocked: {
    opacity: 0.5,
  },
  wordCardLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  wordNumberBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  wordNumber: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: Colors.primary,
  },
  wordInfo: {
    flex: 1,
    gap: 4,
  },
  wordText: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  wordTextLocked: {
    color: Colors.textLight,
  },
  wordHint: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  wordHintLocked: {
    color: Colors.textLight,
  },
  difficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
  tipsCard: {
    backgroundColor: Colors.success + '10',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.success + '30',
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  tipsList: {
    gap: 12,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  tipBullet: {
    fontSize: 16,
    color: Colors.success,
    fontWeight: '700' as const,
    marginTop: 2,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  bottomSafeArea: {
    backgroundColor: Colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  bottomContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
  },
  beginButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: Colors.courses.purple,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  beginButtonGradient: {
    paddingVertical: 18,
    alignItems: 'center',
  },
  beginButtonText: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.white,
  },
  lockedButton: {
    backgroundColor: Colors.textLight,
    borderRadius: 16,
    paddingVertical: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  lockedButtonText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.white,
  },
});
