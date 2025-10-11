import Card from '@/components/Card';
import Colors from '@/constants/colors';
import { useApp } from '@/contexts/AppContext';
import { mockProgressData } from '@/mocks/words';
import { BarChart3, TrendingUp } from 'lucide-react-native';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProgressScreen() {
  const { stats } = useApp();

  const maxXP = Math.max(...mockProgressData.map(d => d.xp));
  const maxAccuracy = 100;

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
              <BarChart3 size={24} color={Colors.primary} />
              <Text style={styles.statLabel}>Total XP</Text>
            </View>
            <Text style={styles.statValue}>{stats.totalXP}</Text>
            <Text style={styles.statChange}>+{mockProgressData[mockProgressData.length - 1].xp - mockProgressData[0].xp} this week</Text>
          </Card>

          <Card style={styles.statCard}>
            <View style={styles.statHeader}>
              <TrendingUp size={24} color={Colors.success} />
              <Text style={styles.statLabel}>Accuracy</Text>
            </View>
            <Text style={styles.statValue}>{stats.accuracy}%</Text>
            <Text style={styles.statChange}>+{mockProgressData[mockProgressData.length - 1].accuracy - mockProgressData[0].accuracy}% improvement</Text>
          </Card>
        </View>

        <Card style={styles.chartCard}>
          <Text style={styles.chartTitle}>XP Progress</Text>
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

        <Card style={styles.chartCard}>
          <Text style={styles.chartTitle}>Accuracy Trend</Text>
          <View style={styles.chart}>
            {mockProgressData.map((data, index) => {
              const barHeight = (data.accuracy / maxAccuracy) * 120;
              return (
                <View key={index} style={styles.barContainer}>
                  <View style={styles.barWrapper}>
                    <View style={[styles.bar, styles.accuracyBar, { height: barHeight }]} />
                  </View>
                  <Text style={styles.barLabel}>{new Date(data.date).getDate()}</Text>
                </View>
              );
            })}
          </View>
          <Text style={styles.chartSubtitle}>Last 7 days</Text>
        </Card>

        <Card style={styles.achievementsCard}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          <View style={styles.achievementsList}>
            <View style={styles.achievementItem}>
              <Text style={styles.achievementEmoji}>🔥</Text>
              <View style={styles.achievementInfo}>
                <Text style={styles.achievementTitle}>Streak Master</Text>
                <Text style={styles.achievementDescription}>
                  {stats.longestStreak} day longest streak
                </Text>
              </View>
            </View>

            <View style={styles.achievementItem}>
              <Text style={styles.achievementEmoji}>📚</Text>
              <View style={styles.achievementInfo}>
                <Text style={styles.achievementTitle}>Word Collector</Text>
                <Text style={styles.achievementDescription}>
                  {stats.wordsLearned} words mastered
                </Text>
              </View>
            </View>

            <View style={styles.achievementItem}>
              <Text style={styles.achievementEmoji}>⭐</Text>
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
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  statLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '600' as const,
  },
  statValue: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  statChange: {
    fontSize: 12,
    color: Colors.success,
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
  achievementEmoji: {
    fontSize: 32,
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
