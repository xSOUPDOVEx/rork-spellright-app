import Card from '@/components/Card';
import Colors from '@/constants/colors';
import { useApp } from '@/contexts/AppContext';
import { mockProgressData } from '@/mocks/words';
import { BarChart3, TrendingUp, Target } from 'lucide-react-native';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface CategoryData {
  name: string;
  lessons: number;
  color: string;
  size: number;
}

export default function ProgressScreen() {
  const { stats } = useApp();

  const maxXP = Math.max(...mockProgressData.map(d => d.xp));
  const maxAccuracy = 100;

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
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.title}>Your Progress</Text>
          <Text style={styles.subtitle}>Track your learning journey</Text>
        </View>
      </SafeAreaView>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
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
});
