import Card from '@/components/Card';
import LessonCard from '@/components/LessonCard';
import Colors from '@/constants/colors';
import { useApp } from '@/contexts/AppContext';
import { useRouter } from 'expo-router';
import { BookOpen, Crown, Flame, Search, Sparkles } from 'lucide-react-native';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Lesson {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  gradientColors: [string, string];
  isPremium: boolean;
  progress?: number;
  route: string;
  variant: 'style1' | 'style2' | 'style3';
}

export default function HomeScreen() {
  const { stats, settings } = useApp();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'popular' | 'my' | 'bookmarks'>('popular');



  const lessons: Lesson[] = [
    {
      id: '1',
      title: 'Daily Spelling Drill',
      subtitle: 'Practice core words',
      icon: '✏️',
      color: Colors.courses.blue,
      gradientColors: Colors.gradient.blue as [string, string],
      isPremium: false,
      progress: 65,
      route: '/drill',
      variant: 'style1',
    },
    {
      id: '2',
      title: 'Pattern Recognition',
      subtitle: 'Learn spelling patterns',
      icon: '🧩',
      color: Colors.courses.pink,
      gradientColors: Colors.gradient.pink as [string, string],
      isPremium: true,
      progress: 40,
      route: '/teaching',
      variant: 'style2',
    },
    {
      id: '3',
      title: 'Word Families',
      subtitle: 'Group similar words',
      icon: '👨‍👩‍👧‍👦',
      color: Colors.courses.orange,
      gradientColors: Colors.gradient.orange as [string, string],
      isPremium: false,
      progress: 80,
      route: '/teaching',
      variant: 'style3',
    },
    {
      id: '4',
      title: 'Memory Challenge',
      subtitle: 'Test your recall',
      icon: '🧠',
      color: Colors.courses.purple,
      gradientColors: Colors.gradient.purple as [string, string],
      isPremium: true,
      route: '/testing',
      variant: 'style1',
    },
    {
      id: '5',
      title: 'Flashcard Review',
      subtitle: 'Spaced repetition',
      icon: '🎴',
      color: Colors.courses.green,
      gradientColors: Colors.gradient.green as [string, string],
      isPremium: false,
      progress: 55,
      route: '/spaced-repetition',
      variant: 'style2',
    },
    {
      id: '6',
      title: 'Advanced Words',
      subtitle: 'Challenge yourself',
      icon: '🚀',
      color: Colors.courses.yellow,
      gradientColors: Colors.gradient.warning as [string, string],
      isPremium: true,
      route: '/drill',
      variant: 'style3',
    },
  ];

  const handleLessonPress = (lesson: Lesson) => {
    if (lesson.isPremium && !settings.isPremium) {
      router.push('/subscription' as any);
    } else {
      router.push(lesson.route as any);
    }
  };

  const handleUpgrade = () => {
    router.push('/subscription' as any);
  };

  const filteredLessons = lessons.filter(lesson =>
    lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lesson.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greeting}>Lessons</Text>
            </View>
            <View style={styles.headerIcons}>
              {!settings.isPremium && (
                <TouchableOpacity onPress={handleUpgrade} style={styles.premiumBadge} testID="premium-badge">
                  <Crown size={16} color={Colors.warning} />
                </TouchableOpacity>
              )}
              <TouchableOpacity style={styles.iconButton}>
                <Search size={20} color={Colors.text} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.searchContainer}>
            <Search size={18} color={Colors.textLight} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search lessons..."
              placeholderTextColor={Colors.textLight}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          <View style={styles.tabs}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'popular' && styles.tabActive]}
              onPress={() => setActiveTab('popular')}
            >
              <Text style={[styles.tabText, activeTab === 'popular' && styles.tabTextActive]}>Popular</Text>
              {activeTab === 'popular' && <View style={styles.tabIndicator} />}
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'my' && styles.tabActive]}
              onPress={() => setActiveTab('my')}
            >
              <Text style={[styles.tabText, activeTab === 'my' && styles.tabTextActive]}>My Lessons</Text>
              {activeTab === 'my' && <View style={styles.tabIndicator} />}
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'bookmarks' && styles.tabActive]}
              onPress={() => setActiveTab('bookmarks')}
            >
              <Text style={[styles.tabText, activeTab === 'bookmarks' && styles.tabTextActive]}>Bookmarks</Text>
              {activeTab === 'bookmarks' && <View style={styles.tabIndicator} />}
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.statsRow}>
          <Card style={styles.statCard}>
            <View style={styles.statContent}>
              <View style={styles.statIconContainer}>
                <Sparkles size={20} color={Colors.primary} />
              </View>
              <View>
                <Text style={styles.statLabel}>Level</Text>
                <Text style={styles.statValue}>{stats.level}</Text>
              </View>
            </View>
          </Card>

          <Card style={styles.statCard}>
            <View style={styles.statContent}>
              <View style={styles.statIconContainer}>
                <Flame size={20} color={Colors.warning} />
              </View>
              <View>
                <Text style={styles.statLabel}>Streak</Text>
                <Text style={styles.statValue}>{stats.currentStreak}</Text>
              </View>
            </View>
          </Card>

          <Card style={styles.statCard}>
            <View style={styles.statContent}>
              <View style={styles.statIconContainer}>
                <BookOpen size={20} color={Colors.success} />
              </View>
              <View>
                <Text style={styles.statLabel}>Words</Text>
                <Text style={styles.statValue}>{stats.wordsLearned}</Text>
              </View>
            </View>
          </Card>
        </View>

        <View style={styles.lessonsGrid}>
          {filteredLessons.map((lesson, index) => (
            <LessonCard
              key={lesson.id}
              title={lesson.title}
              subtitle={lesson.subtitle}
              icon={lesson.icon}
              color={lesson.color}
              gradientColors={lesson.gradientColors}
              isPremium={lesson.isPremium}
              isLocked={lesson.isPremium && !settings.isPremium}
              progress={lesson.progress}
              onPress={() => handleLessonPress(lesson)}
              style={index % 2 === 0 ? styles.lessonCardLeft : styles.lessonCardRight}
              variant={lesson.variant}
            />
          ))}
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
  safeArea: {
    backgroundColor: Colors.white,
  },
  header: {
    paddingHorizontal: 24,
    paddingBottom: 16,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  greeting: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  premiumBadge: {
    backgroundColor: Colors.backgroundSecondary,
    padding: 10,
    borderRadius: 12,
  },
  iconButton: {
    backgroundColor: Colors.backgroundSecondary,
    padding: 10,
    borderRadius: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
  },
  tabs: {
    flexDirection: 'row',
    gap: 24,
  },
  tab: {
    paddingVertical: 8,
    position: 'relative',
  },
  tabActive: {},
  tabText: {
    fontSize: 16,
    color: Colors.textLight,
    fontWeight: '500' as const,
  },
  tabTextActive: {
    color: Colors.text,
    fontWeight: '600' as const,
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
  content: {
    flex: 1,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 24,
    paddingTop: 20,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    padding: 12,
  },
  statContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  statIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  lessonsGrid: {
    paddingHorizontal: 24,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  lessonCardLeft: {
    width: '48%',
  },
  lessonCardRight: {
    width: '48%',
  },
});
