import Card from '@/components/Card';
import Colors from '@/constants/colors';
import { useApp } from '@/contexts/AppContext';
import { mockProgressData } from '@/mocks/words';
import { BarChart3, TrendingUp, Target, Star } from 'lucide-react-native';
import React, { useEffect, useRef } from 'react';
import { ScrollView, StyleSheet, Text, View, Animated, Easing, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface CategoryData {
  name: string;
  lessons: number;
  color: string;
  size: number;
}

interface PatternMastery {
  name: string;
  mastery: number;
  total: number;
}

interface PatternAccuracy {
  name: string;
  accuracy: number;
  diffFromAvg: number;
  isStrong: boolean;
}

interface AccuracyDataPoint {
  date: string;
  accuracy: number;
}

const MasteryCircle = ({ pattern, index }: { pattern: PatternMastery; index: number }) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const delay = index * 100;
    
    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 400,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [index, opacityAnim, scaleAnim]);

  const progressPercentage = Math.round((pattern.mastery / pattern.total) * 100);

  return (
    <Animated.View style={[styles.masteryCircleContainer, { transform: [{ scale: scaleAnim }], opacity: opacityAnim }]}>
      <View style={styles.circleWrapper}>
        <View style={styles.circleBackground} />
        <View style={styles.circleProgressContainer}>
          <View style={styles.circleProgressRing}>
            <View
              style={[
                styles.circleProgressSegment,
                {
                  width: 68,
                  height: 68 * (progressPercentage / 100),
                  backgroundColor: Colors.success,
                  borderTopLeftRadius: 34,
                  borderTopRightRadius: 34,
                },
              ]}
            />
          </View>
        </View>
        <View style={styles.circleInner}>
          <Star size={20} color={Colors.success} fill={Colors.success} />
        </View>
      </View>
      <Text style={styles.masteryCount}>{pattern.mastery}/{pattern.total}</Text>
      <Text style={styles.masteryName}>{pattern.name}</Text>
    </Animated.View>
  );
};

export default function ProgressScreen() {
  const { stats } = useApp();
  const insets = useSafeAreaInsets();

  const maxXP = Math.max(...mockProgressData.map(d => d.xp));

  const patternMasteries: PatternMastery[] = [
    { name: 'Silent E', mastery: 8, total: 10 },
    { name: 'Double Consonants', mastery: 6, total: 10 },
    { name: 'I Before E', mastery: 10, total: 10 },
    { name: 'Hard/Soft C', mastery: 7, total: 10 },
    { name: 'Hard/Soft G', mastery: 5, total: 10 },
    { name: '-tion/-sion', mastery: 9, total: 10 },
  ];

  const accuracyHistory: AccuracyDataPoint[] = [
    { date: '2025-09-17', accuracy: 72 },
    { date: '2025-09-24', accuracy: 75 },
    { date: '2025-10-01', accuracy: 78 },
    { date: '2025-10-08', accuracy: 82 },
    { date: '2025-10-15', accuracy: 88 },
  ];

  const currentAccuracy = 88;
  const weeklyChange = 5;

  const patternAccuracies: PatternAccuracy[] = [
    { name: 'Silent E', accuracy: 85, diffFromAvg: 12, isStrong: true },
    { name: 'Double Consonants', accuracy: 78, diffFromAvg: 5, isStrong: true },
    { name: 'I Before E', accuracy: 92, diffFromAvg: 19, isStrong: true },
    { name: 'Hard/Soft C', accuracy: 65, diffFromAvg: -8, isStrong: false },
    { name: '-tion/-sion', accuracy: 80, diffFromAvg: 7, isStrong: true },
    { name: 'Vowel Teams', accuracy: 52, diffFromAvg: -21, isStrong: false },
    { name: 'R-Controlled', accuracy: 71, diffFromAvg: -2, isStrong: false },
    { name: 'Hard/Soft G', accuracy: 88, diffFromAvg: 15, isStrong: true },
  ];

  const categories: CategoryData[] = [
    { name: 'DESIGN', lessons: 36, color: Colors.courses.blue, size: 180 },
    { name: 'MUSIC', lessons: 7, color: Colors.courses.yellow, size: 120 },
    { name: 'ART', lessons: 14, color: Colors.courses.orange, size: 140 },
    { name: 'STYLE', lessons: 8, color: Colors.courses.purple, size: 125 },
    { name: 'BRANDING', lessons: 21, color: Colors.courses.pink, size: 155 },
    { name: 'SPORT', lessons: 12, color: Colors.courses.green, size: 135 },
  ];

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <Text style={styles.title}>Your Progress</Text>
        <Text style={styles.subtitle}>Track your learning journey</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Card style={styles.ratingCard}>
          <View style={styles.ratingHeader}>
            <View>
              <Text style={styles.ratingLabel}>CURRENT ACCURACY</Text>
              <Text style={styles.ratingValue}>{currentAccuracy}%</Text>
            </View>
            <View style={styles.ratingBadge}>
              <Text style={styles.ratingBadgeText}>+{weeklyChange}%</Text>
            </View>
          </View>

          <View style={styles.graphContainer}>
            <View style={styles.graphGrid}>
              {[100, 80, 60, 40, 20].map((line) => (
                <View key={line} style={styles.gridLine}>
                  <Text style={styles.gridLabel}>{line}</Text>
                  <View style={styles.gridDash} />
                </View>
              ))}
            </View>

            <View style={styles.graphContent}>
              {accuracyHistory.map((point, index) => {
                const nextPoint = accuracyHistory[index + 1];
                if (!nextPoint) return null;

                const x1 = (index / (accuracyHistory.length - 1)) * (SCREEN_WIDTH - 100);
                const x2 = ((index + 1) / (accuracyHistory.length - 1)) * (SCREEN_WIDTH - 100);
                const y1 = 140 - (point.accuracy / 100) * 140;
                const y2 = 140 - (nextPoint.accuracy / 100) * 140;

                const colors = ['#9B6FED', '#ED6F7F', '#F5A962'];
                const segmentColor = colors[Math.floor((index / (accuracyHistory.length - 2)) * (colors.length - 1))];

                return (
                  <View key={index} style={styles.lineSegment}>
                    <View
                      style={[
                        styles.line,
                        {
                          left: x1,
                          top: y1,
                          width: Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)),
                          transform: [
                            { rotate: `${Math.atan2(y2 - y1, x2 - x1)}rad` },
                          ],
                          backgroundColor: segmentColor,
                        },
                      ]}
                    />
                  </View>
                );
              })}

              {accuracyHistory.map((point, index) => {
                const x = (index / (accuracyHistory.length - 1)) * (SCREEN_WIDTH - 100);
                const y = 140 - (point.accuracy / 100) * 140;

                return (
                  <View
                    key={`dot-${index}`}
                    style={[
                      styles.graphDot,
                      {
                        left: x - 4,
                        top: y - 4,
                      },
                    ]}
                  />
                );
              })}
            </View>

            <View style={styles.graphXAxis}>
              {accuracyHistory.map((point, index) => {
                const date = new Date(point.date);
                const label = `${date.getMonth() + 1}/${date.getDate()}`;
                return (
                  <Text key={index} style={styles.xAxisLabel}>
                    {label}
                  </Text>
                );
              })}
            </View>
          </View>
        </Card>

        <Card style={styles.patternAccuracyCard}>
          <View style={styles.patternAccuracyHeader}>
            <Text style={styles.chartTitle}>Pattern Accuracy</Text>
            <Text style={styles.patternAccuracySubtitle}>DIFF. TO AVG. ACCURACY</Text>
          </View>

          <View style={styles.patternAccuracyList}>
            {patternAccuracies.map((pattern, index) => (
              <View key={index} style={styles.patternAccuracyItem}>
                <View style={styles.patternAccuracyLeft}>
                  <Text style={styles.patternAccuracyValue}>{pattern.accuracy}%</Text>
                  <View style={[
                    styles.patternDot,
                    { backgroundColor: pattern.isStrong ? Colors.courses.orange : Colors.backgroundSecondary }
                  ]} />
                  <Text style={styles.patternAccuracyName}>{pattern.name}</Text>
                </View>
                <Text style={[
                  styles.patternAccuracyDiff,
                  { color: pattern.diffFromAvg >= 0 ? Colors.success : Colors.error }
                ]}>
                  {pattern.diffFromAvg >= 0 ? '+' : ''}{pattern.diffFromAvg}%
                </Text>
              </View>
            ))}
          </View>
        </Card>

        <Card style={styles.masteryInfoCard}>
          <View style={styles.masteryInfoContent}>
            <View style={styles.masteryInfoIcon}>
              <Star size={24} color={Colors.white} fill={Colors.white} />
            </View>
            <View style={styles.masteryInfoText}>
              <Text style={styles.masteryInfoTitle}>Mastery shows you how confident you are with each pattern.</Text>
              <Text style={styles.masteryInfoSubtitle}>It grows over time.</Text>
            </View>
            <View style={styles.masteryInfoBadge}>
              <Text style={styles.masteryInfoBadgeText}>10/10</Text>
            </View>
          </View>
        </Card>

        <View style={styles.masterySection}>
          <View style={styles.masteryGrid}>
            {patternMasteries.map((pattern, index) => (
              <MasteryCircle key={pattern.name} pattern={pattern} index={index} />
            ))}
          </View>
          <View style={styles.lotusDecoration}>
            <Text style={styles.lotusEmoji}>🪷</Text>
          </View>
        </View>

        <View style={styles.statsGrid}>
          <Card style={styles.statCard}>
            <View style={styles.statHeader}>
              <Text style={styles.statLabel}>COMPLETED</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statValue}>{stats.wordsLearned}</Text>
              <Text style={styles.statTotal}>/ {stats.wordsLearned + 20}</Text>
            </View>
            <View style={styles.progressRing}>
              <View style={[styles.progressArc, { borderColor: Colors.courses.pink }]} />
            </View>
          </Card>

          <Card style={styles.statCard}>
            <View style={styles.statHeader}>
              <Text style={styles.statLabel}>AVERAGE SCORE</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statValue}>{stats.accuracy}</Text>
              <Text style={styles.statTotal}>%</Text>
            </View>
          </Card>
        </View>

        <Card style={styles.bubbleCard}>
          <Text style={styles.sectionTitle}>Learning Categories</Text>
          <View style={styles.bubbleContainer}>
            {categories.map((category, index) => {
              const positions = [
                { top: 20, left: '50%', marginLeft: -90 },
                { top: 10, right: 20 },
                { top: 120, left: 20 },
                { top: 180, right: 30 },
                { top: 100, right: 10 },
                { bottom: 20, left: '40%', marginLeft: -60 },
              ];
              return (
                <View
                  key={category.name}
                  style={[
                    styles.bubble,
                    {
                      width: category.size,
                      height: category.size,
                      backgroundColor: category.color,
                      ...positions[index],
                    },
                  ]}
                >
                  <Text style={styles.bubbleName}>{category.name}</Text>
                  <Text style={styles.bubbleLessons}>{category.lessons} lessons</Text>
                </View>
              );
            })}
          </View>
        </Card>

        <Card style={styles.chartCard}>
          <Text style={styles.chartTitle}>Weekly Activity</Text>
          <View style={styles.chart}>
            {mockProgressData.map((data, index) => {
              const barHeight = (data.xp / maxXP) * 120;
              return (
                <View key={index} style={styles.barContainer}>
                  <View style={styles.barWrapper}>
                    <View style={[styles.bar, { height: barHeight }]} />
                  </View>
                  <Text style={styles.barLabel}>{new Date(data.date).getDate()}</Text>
                </View>
              );
            })}
          </View>
          <Text style={styles.chartSubtitle}>Last 7 days</Text>
        </Card>

        <Card style={styles.achievementsCard}>
          <Text style={styles.sectionTitle}>Recent Achievements</Text>
          <View style={styles.achievementsList}>
            <View style={styles.achievementItem}>
              <View style={[styles.achievementIcon, { backgroundColor: Colors.courses.orange }]}>
                <Target size={20} color={Colors.white} />
              </View>
              <View style={styles.achievementInfo}>
                <Text style={styles.achievementTitle}>Streak Master</Text>
                <Text style={styles.achievementDescription}>
                  {stats.longestStreak} day longest streak
                </Text>
              </View>
            </View>

            <View style={styles.achievementItem}>
              <View style={[styles.achievementIcon, { backgroundColor: Colors.courses.blue }]}>
                <BarChart3 size={20} color={Colors.white} />
              </View>
              <View style={styles.achievementInfo}>
                <Text style={styles.achievementTitle}>Word Collector</Text>
                <Text style={styles.achievementDescription}>
                  {stats.wordsLearned} words mastered
                </Text>
              </View>
            </View>

            <View style={styles.achievementItem}>
              <View style={[styles.achievementIcon, { backgroundColor: Colors.courses.purple }]}>
                <TrendingUp size={20} color={Colors.white} />
              </View>
              <View style={styles.achievementInfo}>
                <Text style={styles.achievementTitle}>Level {stats.level}</Text>
                <Text style={styles.achievementDescription}>
                  Keep practicing to level up!
                </Text>
              </View>
            </View>
          </View>
        </Card>

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
  header: {
    paddingHorizontal: 24,
    paddingBottom: 20,
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
  masteryInfoCard: {
    marginHorizontal: 24,
    marginTop: 24,
    marginBottom: 20,
    backgroundColor: Colors.success,
  },
  masteryInfoContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  masteryInfoIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  masteryInfoText: {
    flex: 1,
  },
  masteryInfoTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.white,
    marginBottom: 2,
  },
  masteryInfoSubtitle: {
    fontSize: 12,
    color: Colors.white,
    opacity: 0.9,
  },
  masteryInfoBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  masteryInfoBadgeText: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: Colors.white,
  },
  masterySection: {
    marginHorizontal: 24,
    marginBottom: 24,
    position: 'relative',
  },
  masteryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 20,
  },
  masteryCircleContainer: {
    width: '30%',
    alignItems: 'center',
    gap: 8,
  },
  circleWrapper: {
    width: 80,
    height: 80,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleBackground: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.backgroundSecondary,
  },
  circleProgressContainer: {
    position: 'absolute',
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleProgressRing: {
    width: 68,
    height: 68,
    borderRadius: 34,
    overflow: 'hidden',
    transform: [{ rotate: '-90deg' }],
  },
  circleProgressSegment: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  circleInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  masteryCount: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  masteryName: {
    fontSize: 11,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  lotusDecoration: {
    position: 'absolute',
    bottom: -10,
    right: 10,
    opacity: 0.1,
    zIndex: -1,
  },
  lotusEmoji: {
    fontSize: 80,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 24,
    paddingTop: 24,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    position: 'relative',
  },
  statHeader: {
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '600' as const,
    letterSpacing: 0.5,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  statValue: {
    fontSize: 36,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  statTotal: {
    fontSize: 18,
    color: Colors.textLight,
    marginLeft: 4,
  },
  progressRing: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 50,
    height: 50,
  },
  progressArc: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 4,
    borderColor: Colors.courses.pink,
    borderTopColor: 'transparent',
    borderLeftColor: 'transparent',
    transform: [{ rotate: '45deg' }],
  },
  bubbleCard: {
    marginHorizontal: 24,
    marginBottom: 16,
    minHeight: 400,
  },
  bubbleContainer: {
    height: 350,
    position: 'relative',
    marginTop: 20,
  },
  bubble: {
    position: 'absolute',
    borderRadius: 1000,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'rgba(0, 0, 0, 0.15)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 6,
  },
  bubbleName: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.white,
    marginBottom: 4,
  },
  bubbleLessons: {
    fontSize: 12,
    color: Colors.white,
    opacity: 0.9,
  },
  chartCard: {
    marginHorizontal: 24,
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 20,
  },
  chart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 140,
    marginBottom: 8,
  },
  barContainer: {
    flex: 1,
    alignItems: 'center',
  },
  barWrapper: {
    flex: 1,
    justifyContent: 'flex-end',
    width: '100%',
    paddingHorizontal: 4,
  },
  bar: {
    backgroundColor: Colors.primary,
    borderRadius: 4,
    width: '100%',
  },
  accuracyBar: {
    backgroundColor: Colors.success,
  },
  barLabel: {
    fontSize: 10,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  chartSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  achievementsCard: {
    marginHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 16,
  },
  achievementsList: {
    gap: 16,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  achievementIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 2,
  },
  achievementDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  ratingCard: {
    marginHorizontal: 24,
    marginTop: 24,
    marginBottom: 16,
  },
  ratingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  ratingLabel: {
    fontSize: 11,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  ratingValue: {
    fontSize: 48,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  ratingBadge: {
    backgroundColor: Colors.success,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  ratingBadgeText: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: Colors.white,
  },
  graphContainer: {
    height: 200,
    position: 'relative',
  },
  graphGrid: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 40,
    justifyContent: 'space-between',
  },
  gridLine: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gridLabel: {
    fontSize: 10,
    color: Colors.textLight,
    width: 30,
  },
  gridDash: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.backgroundSecondary,
  },
  graphContent: {
    position: 'absolute',
    left: 40,
    right: 20,
    top: 10,
    height: 140,
  },
  lineSegment: {
    position: 'absolute',
  },
  line: {
    position: 'absolute',
    height: 3,
    borderRadius: 2,
  },
  graphDot: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  graphXAxis: {
    position: 'absolute',
    bottom: 0,
    left: 40,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 8,
  },
  xAxisLabel: {
    fontSize: 10,
    color: Colors.textSecondary,
  },
  patternAccuracyCard: {
    marginHorizontal: 24,
    marginBottom: 16,
  },
  patternAccuracyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  patternAccuracySubtitle: {
    fontSize: 10,
    fontWeight: '600' as const,
    color: Colors.textLight,
    letterSpacing: 0.5,
  },
  patternAccuracyList: {
    gap: 16,
  },
  patternAccuracyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  patternAccuracyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  patternAccuracyValue: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.courses.orange,
    width: 50,
  },
  patternDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  patternAccuracyName: {
    fontSize: 15,
    color: Colors.text,
    fontWeight: '500' as const,
  },
  patternAccuracyDiff: {
    fontSize: 15,
    fontWeight: '600' as const,
  },
});
