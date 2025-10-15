import Colors from '@/constants/colors';
import { useApp } from '@/contexts/AppContext';
import { useRouter } from 'expo-router';
import { ChevronLeft, ChevronRight, Crown, Lock, Star } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

type RankType = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert' | 'Master';

interface LessonNode {
  id: string;
  title: string;
  xpRequired: number;
  isCompleted: boolean;
  isLocked: boolean;
  isMilestone?: boolean;
}

export default function HomeScreen() {
  const { stats, settings, userName } = useApp();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'learn' | 'practice' | 'progress'>('learn');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const ranks: RankType[] = ['Beginner', 'Intermediate', 'Advanced', 'Expert', 'Master'];
  const currentRankIndex = Math.min(Math.floor(stats.totalXP / 500), ranks.length - 1);
  const currentRank = ranks[currentRankIndex];
  const nextRank = currentRankIndex < ranks.length - 1 ? ranks[currentRankIndex + 1] : 'Master';
  const xpInCurrentRank = stats.totalXP % 500;
  const progressPercentage = (xpInCurrentRank / 500) * 100;

  const lessonNodes: LessonNode[] = [
    { id: '1', title: 'Word Basics', xpRequired: 0, isCompleted: stats.totalXP >= 50, isLocked: false },
    { id: '2', title: 'Silent Letters', xpRequired: 50, isCompleted: stats.totalXP >= 100, isLocked: stats.totalXP < 50 },
    { id: '3', title: 'Double Consonants', xpRequired: 100, isCompleted: stats.totalXP >= 150, isLocked: stats.totalXP < 100 },
    { id: '4', title: 'Vowel Patterns', xpRequired: 150, isCompleted: stats.totalXP >= 250, isLocked: stats.totalXP < 150, isMilestone: true },
    { id: '5', title: 'Prefix & Suffix', xpRequired: 250, isCompleted: stats.totalXP >= 350, isLocked: stats.totalXP < 250 },
    { id: '6', title: 'Homophones', xpRequired: 350, isCompleted: stats.totalXP >= 450, isLocked: stats.totalXP < 350 },
    { id: '7', title: 'Advanced Words', xpRequired: 450, isCompleted: false, isLocked: stats.totalXP < 450 },
  ];

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const handleNodePress = (node: LessonNode) => {
    if (node.isLocked) return;
    
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    router.push('/drill' as any);
  };

  const handleUpgrade = () => {
    router.push('/subscription' as any);
  };

  return (
    <View style={styles.container}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <LinearGradient
          colors={[Colors.courses.purple, Colors.primary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greeting}>{greeting()}</Text>
              <Text style={styles.userName}>{userName || 'Learner'}</Text>
            </View>
            {!settings.isPremium && (
              <TouchableOpacity onPress={handleUpgrade} style={styles.premiumButton}>
                <Crown size={16} color={Colors.white} />
                <Text style={styles.premiumText}>Upgrade</Text>
              </TouchableOpacity>
            )}
          </View>
        </LinearGradient>
      </SafeAreaView>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View
          style={[
            styles.animatedContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <View style={styles.rankCard}>
            <View style={styles.rankHeader}>
              <View style={styles.rankInfo}>
                <Text style={styles.rankLabel}>Current Rank</Text>
                <Text style={styles.rankTitle}>{currentRank}</Text>
              </View>
              <View style={styles.rankInfoRight}>
                <Text style={styles.rankLabel}>Next Rank</Text>
                <Text style={styles.rankTitleLight}>{nextRank}</Text>
              </View>
            </View>

            <View style={styles.progressTrack}>
              <View style={styles.progressTrackBadge}>
                <View style={[styles.rankBadge, styles.rankBadgeActive]}>
                  <Star size={16} color={Colors.white} fill={Colors.white} />
                </View>
              </View>

              <View style={styles.progressBar}>
                <View style={[styles.progressBarFill, { width: `${progressPercentage}%` }]}>
                  <View style={styles.progressDiamond} />
                </View>
              </View>

              <View style={styles.progressTrackBadge}>
                <View style={styles.rankBadge}>
                  <Star size={16} color={Colors.textLight} />
                </View>
              </View>
            </View>

            <View style={styles.xpRow}>
              <Text style={styles.xpText}>{xpInCurrentRank} / 500 XP</Text>
            </View>

            <View style={styles.rankArrows}>
              <TouchableOpacity style={styles.arrowButton} disabled>
                <ChevronLeft size={20} color={Colors.textLight} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.arrowButton} disabled>
                <ChevronRight size={20} color={Colors.textLight} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.tabs}>
            <TouchableOpacity
              style={styles.tab}
              onPress={() => setActiveTab('learn')}
            >
              <Text style={[styles.tabText, activeTab === 'learn' && styles.tabTextActive]}>Learn</Text>
              {activeTab === 'learn' && <View style={styles.tabIndicator} />}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.tab}
              onPress={() => setActiveTab('practice')}
            >
              <Text style={[styles.tabText, activeTab === 'practice' && styles.tabTextActive]}>Practice</Text>
              {activeTab === 'practice' && <View style={styles.tabIndicator} />}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.tab}
              onPress={() => setActiveTab('progress')}
            >
              <Text style={[styles.tabText, activeTab === 'progress' && styles.tabTextActive]}>Progress</Text>
              {activeTab === 'progress' && <View style={styles.tabIndicator} />}
            </TouchableOpacity>
          </View>

          {activeTab === 'learn' && (
            <View style={styles.learnContent}>
              <LinearGradient
                colors={[Colors.courses.purple, Colors.courses.orange]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.sectionCard}
              >
                <Text style={styles.sectionLabel}>BEGINNER • SECTION 1</Text>
                <Text style={styles.sectionTitle}>Learn Basic Spelling Patterns</Text>
              </LinearGradient>

              <View style={styles.learningPath}>
                <TouchableOpacity
                  style={styles.startButton}
                  onPress={() => handleNodePress(lessonNodes[0])}
                >
                  <Text style={styles.startButtonText}>START</Text>
                </TouchableOpacity>

                {lessonNodes.map((node, index) => (
                  <View key={node.id} style={styles.nodeContainer}>
                    {index > 0 && <View style={styles.connector} />}
                    
                    <TouchableOpacity
                      style={styles.nodeWrapper}
                      onPress={() => handleNodePress(node)}
                      disabled={node.isLocked}
                    >
                      <View
                        style={[
                          styles.node,
                          node.isCompleted && styles.nodeCompleted,
                          node.isLocked && styles.nodeLocked,
                        ]}
                      >
                        {node.isCompleted ? (
                          <Star size={24} color={Colors.white} fill={Colors.white} />
                        ) : node.isLocked ? (
                          <Lock size={24} color={Colors.textLight} />
                        ) : (
                          <Text style={styles.nodeNumber}>{index + 1}</Text>
                        )}
                      </View>

                      {node.isMilestone && (
                        <View style={styles.milestoneIcon}>
                          <Text style={styles.milestoneEmoji}>🪷</Text>
                        </View>
                      )}
                    </TouchableOpacity>

                    <Text
                      style={[
                        styles.nodeTitle,
                        node.isLocked && styles.nodeTitleLocked,
                      ]}
                    >
                      {node.title}
                    </Text>
                  </View>
                ))}
              </View>

              <LinearGradient
                colors={[Colors.courses.purple, Colors.courses.orange]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.trainButton}
              >
                <TouchableOpacity
                  style={styles.trainButtonInner}
                  onPress={() => router.push('/drill' as any)}
                >
                  <Text style={styles.trainButtonText}>Train</Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>
          )}

          {activeTab === 'practice' && (
            <View style={styles.tabContent}>
              <Text style={styles.comingSoonText}>Practice content coming soon!</Text>
              <Text style={styles.comingSoonSubtext}>
                This tab will show your saved lessons and quick practice options.
              </Text>
            </View>
          )}

          {activeTab === 'progress' && (
            <View style={styles.tabContent}>
              <View style={styles.statsGrid}>
                <View style={styles.statBox}>
                  <Text style={styles.statValue}>{stats.level}</Text>
                  <Text style={styles.statLabel}>Level</Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statValue}>{stats.currentStreak}</Text>
                  <Text style={styles.statLabel}>Day Streak</Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statValue}>{stats.wordsLearned}</Text>
                  <Text style={styles.statLabel}>Words Learned</Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statValue}>{stats.accuracy}%</Text>
                  <Text style={styles.statLabel}>Accuracy</Text>
                </View>
              </View>
            </View>
          )}
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
    backgroundColor: 'transparent',
  },
  header: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    paddingTop: 12,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 16,
    color: Colors.white,
    opacity: 0.9,
    marginBottom: 4,
  },
  userName: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.white,
  },
  premiumButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 6,
  },
  premiumText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '600' as const,
  },
  content: {
    flex: 1,
  },
  animatedContainer: {
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  rankCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  rankHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  rankInfo: {
    flex: 1,
  },
  rankInfoRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  rankLabel: {
    fontSize: 12,
    color: Colors.textLight,
    marginBottom: 4,
    textTransform: 'uppercase',
    fontWeight: '600' as const,
  },
  rankTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  rankTitleLight: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.textLight,
  },
  progressTrack: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressTrackBadge: {
    width: 40,
  },
  rankBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankBadgeActive: {
    backgroundColor: Colors.primary,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 4,
    marginHorizontal: 12,
    overflow: 'visible',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 4,
    position: 'relative',
  },
  progressDiamond: {
    position: 'absolute',
    right: -6,
    top: -4,
    width: 16,
    height: 16,
    backgroundColor: Colors.primary,
    transform: [{ rotate: '45deg' }],
    borderRadius: 3,
  },
  xpRow: {
    alignItems: 'center',
    marginBottom: 16,
  },
  xpText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '600' as const,
  },
  rankArrows: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 80,
  },
  arrowButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 6,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    position: 'relative',
  },
  tabText: {
    fontSize: 15,
    color: Colors.textLight,
    fontWeight: '600' as const,
  },
  tabTextActive: {
    color: Colors.primary,
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 12,
    right: 12,
    height: 3,
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
  learnContent: {
    gap: 20,
  },
  sectionCard: {
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  sectionLabel: {
    fontSize: 12,
    color: Colors.white,
    fontWeight: '700' as const,
    marginBottom: 8,
    opacity: 0.9,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.white,
  },
  learningPath: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  startButton: {
    backgroundColor: Colors.white,
    paddingHorizontal: 48,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.primary,
    marginBottom: 24,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.primary,
  },
  nodeContainer: {
    alignItems: 'center',
    position: 'relative',
  },
  connector: {
    width: 3,
    height: 40,
    backgroundColor: Colors.border,
  },
  nodeWrapper: {
    position: 'relative',
    marginVertical: 8,
  },
  node: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: Colors.border,
  },
  nodeCompleted: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  nodeLocked: {
    backgroundColor: Colors.backgroundSecondary,
    borderColor: Colors.border,
  },
  nodeNumber: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  milestoneIcon: {
    position: 'absolute',
    right: -8,
    top: -8,
  },
  milestoneEmoji: {
    fontSize: 28,
  },
  nodeTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
    marginTop: 8,
    textAlign: 'center',
  },
  nodeTitleLocked: {
    color: Colors.textLight,
  },
  trainButton: {
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  trainButtonInner: {
    paddingVertical: 18,
    alignItems: 'center',
  },
  trainButtonText: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.white,
  },
  tabContent: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  comingSoonText: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 8,
  },
  comingSoonSubtext: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    width: '100%',
  },
  statBox: {
    width: '47%',
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: Colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '600' as const,
  },
});
