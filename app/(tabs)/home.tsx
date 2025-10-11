import Button from '@/components/Button';
import Card from '@/components/Card';
import ProgressBar from '@/components/ProgressBar';
import Colors from '@/constants/colors';
import { useApp } from '@/contexts/AppContext';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Crown, Flame, Play, Sparkles } from 'lucide-react-native';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const { userName, stats, settings } = useApp();
  const router = useRouter();

  const xpForNextLevel = stats.level * 100;
  const xpProgress = stats.totalXP % 100;

  const handleStartPractice = () => {
    router.push('/drill' as any);
  };

  const handleUpgrade = () => {
    router.push('/subscription' as any);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.gradient.primary[0], Colors.gradient.primary[1]]}
        style={styles.headerGradient}
      >
        <SafeAreaView edges={['top']} style={styles.header}>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.greeting}>Hello, {userName}!</Text>
              <Text style={styles.subtitle}>Ready to practice?</Text>
            </View>
            {!settings.isPremium && (
              <TouchableOpacity onPress={handleUpgrade} style={styles.premiumBadge} testID="premium-badge">
                <Crown size={20} color={Colors.warning} />
                <Text style={styles.premiumText}>Go Premium</Text>
              </TouchableOpacity>
            )}
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.statsContainer}>
          <Card style={styles.levelCard}>
            <View style={styles.levelHeader}>
              <View style={styles.levelBadge}>
                <Sparkles size={24} color={Colors.primary} />
              </View>
              <View style={styles.levelInfo}>
                <Text style={styles.levelLabel}>Level {stats.level}</Text>
                <Text style={styles.xpText}>{xpProgress} / {xpForNextLevel} XP</Text>
              </View>
            </View>
            <ProgressBar progress={xpProgress} total={xpForNextLevel} showLabel={false} height={8} />
          </Card>

          <View style={styles.statsRow}>
            <Card style={styles.statCard}>
              <View style={styles.statIcon}>
                <Flame size={24} color={Colors.warning} />
              </View>
              <Text style={styles.statValue}>{stats.currentStreak}</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </Card>

            <Card style={styles.statCard}>
              <View style={styles.statIcon}>
                <Text style={styles.statEmoji}>📚</Text>
              </View>
              <Text style={styles.statValue}>{stats.wordsLearned}</Text>
              <Text style={styles.statLabel}>Words Learned</Text>
            </Card>

            <Card style={styles.statCard}>
              <View style={styles.statIcon}>
                <Text style={styles.statEmoji}>🎯</Text>
              </View>
              <Text style={styles.statValue}>{stats.accuracy}%</Text>
              <Text style={styles.statLabel}>Accuracy</Text>
            </Card>
          </View>
        </View>

        <View style={styles.practiceSection}>
          <Text style={styles.sectionTitle}>Daily Practice</Text>
          <Card style={styles.practiceCard}>
            <View style={styles.practiceContent}>
              <View style={styles.practiceIcon}>
                <Play size={32} color={Colors.white} fill={Colors.white} />
              </View>
              <View style={styles.practiceInfo}>
                <Text style={styles.practiceTitle}>Start Spelling Drill</Text>
                <Text style={styles.practiceDescription}>
                  Practice {settings.difficulty === 'mixed' ? 'mixed difficulty' : settings.difficulty} words
                </Text>
              </View>
            </View>
            <Button title="Start Practice" onPress={handleStartPractice} testID="start-practice-button" />
          </Card>

          <Card style={styles.goalCard}>
            <View style={styles.goalHeader}>
              <Text style={styles.goalTitle}>Daily Goal</Text>
              <Text style={styles.goalValue}>{stats.totalXP % settings.dailyGoal} / {settings.dailyGoal} XP</Text>
            </View>
            <ProgressBar 
              progress={stats.totalXP % settings.dailyGoal} 
              total={settings.dailyGoal} 
              showLabel={false}
              height={8}
            />
            <Text style={styles.goalDescription}>
              {stats.totalXP % settings.dailyGoal >= settings.dailyGoal 
                ? '🎉 Goal completed! Keep going!' 
                : `${settings.dailyGoal - (stats.totalXP % settings.dailyGoal)} XP to reach your daily goal`}
            </Text>
          </Card>
        </View>

        {!settings.isPremium && (
          <Card style={styles.upgradeCard}>
            <LinearGradient
              colors={[Colors.gradient.warning[0], Colors.gradient.warning[1]]}
              style={styles.upgradeGradient}
            >
              <Crown size={32} color={Colors.white} />
              <Text style={styles.upgradeTitle}>Unlock Premium</Text>
              <Text style={styles.upgradeDescription}>
                Get unlimited practice, advanced analytics, and personalized learning paths
              </Text>
              <Button 
                title="Upgrade Now" 
                onPress={handleUpgrade} 
                variant="secondary"
                testID="upgrade-button"
              />
            </LinearGradient>
          </Card>
        )}

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
    paddingBottom: 24,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.white,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.white,
    opacity: 0.9,
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: 'rgba(0, 0, 0, 0.08)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 2,
  },
  premiumText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '600' as const,
  },
  content: {
    flex: 1,
    marginTop: -16,
  },
  statsContainer: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  levelCard: {
    marginBottom: 16,
  },
  levelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  levelBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'rgba(0, 0, 0, 0.08)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 2,
  },
  levelInfo: {
    flex: 1,
  },
  levelLabel: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 2,
  },
  xpText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: 'rgba(0, 0, 0, 0.08)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 2,
  },
  statEmoji: {
    fontSize: 20,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  practiceSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 16,
  },
  practiceCard: {
    marginBottom: 16,
  },
  practiceContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 20,
  },
  practiceIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'rgba(0, 0, 0, 0.08)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4,
  },
  practiceInfo: {
    flex: 1,
  },
  practiceTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  practiceDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  goalCard: {},
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  goalValue: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.primary,
  },
  goalDescription: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 8,
  },
  upgradeCard: {
    marginHorizontal: 24,
    padding: 0,
    overflow: 'hidden',
  },
  upgradeGradient: {
    padding: 24,
    alignItems: 'center',
  },
  upgradeTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.white,
    marginTop: 12,
    marginBottom: 8,
  },
  upgradeDescription: {
    fontSize: 14,
    color: Colors.white,
    textAlign: 'center',
    marginBottom: 20,
    opacity: 0.9,
  },
});
