import Colors from '@/constants/colors';
import { useApp } from '@/contexts/AppContext';
import { useRouter } from 'expo-router';
import { ArrowLeft, Flame, Target, Star } from 'lucide-react-native';
import React, { useEffect, useRef } from 'react';
import { Animated, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type SpellingPattern = {
  id: string;
  name: string;
  description: string;
  icon: string;
  wordsMastered: number;
  totalWords: number;
  color: string;
  isLocked: boolean;
};

export default function PatternsScreen() {
  const router = useRouter();
  const { stats } = useApp();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const patterns: SpellingPattern[] = [
    {
      id: '1',
      name: 'Silent E',
      description: 'Words ending with silent e',
      icon: '🔇',
      wordsMastered: 12,
      totalWords: 25,
      color: Colors.courses.blue,
      isLocked: false,
    },
    {
      id: '2',
      name: 'Double Consonants',
      description: 'Words with doubled letters',
      icon: '📝',
      wordsMastered: 8,
      totalWords: 30,
      color: Colors.courses.purple,
      isLocked: false,
    },
    {
      id: '3',
      name: 'I Before E',
      description: 'The classic rule and exceptions',
      icon: '🎯',
      wordsMastered: 5,
      totalWords: 20,
      color: Colors.courses.green,
      isLocked: false,
    },
    {
      id: '4',
      name: 'Hard/Soft C',
      description: 'C sounds like K or S',
      icon: '©️',
      wordsMastered: 0,
      totalWords: 22,
      color: Colors.courses.orange,
      isLocked: stats.totalXP < 100,
    },
    {
      id: '5',
      name: 'Hard/Soft G',
      description: 'G sounds vary by context',
      icon: '🔤',
      wordsMastered: 0,
      totalWords: 18,
      color: Colors.courses.pink,
      isLocked: stats.totalXP < 150,
    },
    {
      id: '6',
      name: '-tion/-sion Endings',
      description: 'Common word endings',
      icon: '🎪',
      wordsMastered: 0,
      totalWords: 35,
      color: Colors.courses.teal,
      isLocked: stats.totalXP < 200,
    },
    {
      id: '7',
      name: 'Vowel Teams',
      description: 'ea, ai, oa patterns',
      icon: '👥',
      wordsMastered: 0,
      totalWords: 28,
      color: Colors.courses.yellow,
      isLocked: stats.totalXP < 250,
    },
    {
      id: '8',
      name: 'R-Controlled Vowels',
      description: 'ar, er, ir, or, ur patterns',
      icon: '🎨',
      wordsMastered: 0,
      totalWords: 32,
      color: Colors.courses.red,
      isLocked: stats.totalXP < 300,
    },
  ];

  const handlePatternPress = (pattern: SpellingPattern) => {
    if (pattern.isLocked) return;
    router.push('/drill' as any);
  };

  return (
    <View style={styles.container}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={Colors.text} />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Spelling Patterns</Text>

          <View style={styles.streakContainer}>
            <Flame size={20} color={Colors.warning} fill={Colors.warning} />
            <Text style={styles.streakText}>{stats.currentStreak}</Text>
          </View>
        </View>
      </SafeAreaView>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Animated.View
          style={[
            styles.listContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {patterns.map((pattern, index) => (
            <Animated.View
              key={pattern.id}
              style={[
                {
                  opacity: fadeAnim,
                  transform: [
                    {
                      translateY: slideAnim.interpolate({
                        inputRange: [0, 30],
                        outputRange: [0, 30 + index * 10],
                      }),
                    },
                  ],
                },
              ]}
            >
              <TouchableOpacity
                style={[
                  styles.patternCard,
                  pattern.isLocked && styles.patternCardLocked,
                ]}
                onPress={() => handlePatternPress(pattern)}
                disabled={pattern.isLocked}
                activeOpacity={0.7}
              >
                <View style={styles.cardLeft}>
                  <View
                    style={[
                      styles.iconContainer,
                      { backgroundColor: pattern.isLocked ? Colors.backgroundSecondary : pattern.color + '20' },
                    ]}
                  >
                    <Text style={styles.iconEmoji}>{pattern.icon}</Text>
                  </View>
                </View>

                <View style={styles.cardRight}>
                  <Text
                    style={[
                      styles.patternName,
                      pattern.isLocked && styles.patternNameLocked,
                    ]}
                  >
                    {pattern.name}
                  </Text>

                  <Text
                    style={[
                      styles.patternDescription,
                      pattern.isLocked && styles.patternDescriptionLocked,
                    ]}
                  >
                    {pattern.description}
                  </Text>

                  <View style={styles.statsRow}>
                    <View style={styles.statItem}>
                      <Target size={16} color={pattern.isLocked ? Colors.textLight : Colors.warning} />
                      <Text
                        style={[
                          styles.statText,
                          pattern.isLocked && styles.statTextLocked,
                        ]}
                      >
                        {pattern.wordsMastered} words mastered
                      </Text>
                    </View>

                    <View style={styles.statItem}>
                      <Star size={16} color={pattern.isLocked ? Colors.textLight : Colors.warning} />
                      <Text
                        style={[
                          styles.statText,
                          pattern.isLocked && styles.statTextLocked,
                        ]}
                      >
                        {pattern.totalWords} total words
                      </Text>
                    </View>
                  </View>

                  {pattern.isLocked && (
                    <View style={styles.lockBadge}>
                      <Text style={styles.lockBadgeText}>
                        Unlock at {pattern.id === '4' ? '100' : pattern.id === '5' ? '150' : pattern.id === '6' ? '200' : pattern.id === '7' ? '250' : '300'} XP
                      </Text>
                    </View>
                  )}
                </View>

                {!pattern.isLocked && pattern.wordsMastered > 0 && (
                  <View style={styles.progressBadge}>
                    <Text style={styles.progressBadgeText}>
                      {Math.round((pattern.wordsMastered / pattern.totalWords) * 100)}%
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            </Animated.View>
          ))}
        </Animated.View>

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
    borderRadius: 20,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  streakText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  listContainer: {
    gap: 16,
  },
  patternCard: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    position: 'relative',
  },
  patternCardLocked: {
    opacity: 0.6,
  },
  cardLeft: {
    marginRight: 16,
    justifyContent: 'center',
  },
  iconContainer: {
    width: 70,
    height: 70,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconEmoji: {
    fontSize: 36,
  },
  cardRight: {
    flex: 1,
    justifyContent: 'center',
    gap: 6,
  },
  patternName: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  patternNameLocked: {
    color: Colors.textLight,
  },
  patternDescription: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  patternDescriptionLocked: {
    color: Colors.textLight,
  },
  statsRow: {
    gap: 8,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.warning,
  },
  statTextLocked: {
    color: Colors.textLight,
  },
  lockBadge: {
    marginTop: 8,
    backgroundColor: Colors.backgroundSecondary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  lockBadgeText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
  },
  progressBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: Colors.success,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  progressBadgeText: {
    fontSize: 13,
    fontWeight: '700' as const,
    color: Colors.white,
  },
});
