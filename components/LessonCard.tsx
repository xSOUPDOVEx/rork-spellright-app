import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle, StyleProp } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Crown, Lock } from 'lucide-react-native';
import Colors from '@/constants/colors';
import PolygonBackground from './PolygonBackground';

interface LessonCardProps {
  title: string;
  subtitle?: string;
  icon?: string;
  color: string;
  gradientColors: [string, string];
  isPremium?: boolean;
  isLocked?: boolean;
  progress?: number;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  variant?: 'style1' | 'style2' | 'style3';
}

export default function LessonCard({
  title,
  subtitle,
  icon,
  color,
  gradientColors,
  isPremium = false,
  isLocked = false,
  progress,
  onPress,
  style,
  variant = 'style1',
}: LessonCardProps) {
  return (
    <TouchableOpacity 
      style={[styles.container, style]} 
      onPress={onPress}
      activeOpacity={0.8}
      disabled={isLocked}
    >
      <LinearGradient
        colors={gradientColors}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <PolygonBackground color={color} variant={variant} />
        
        <View style={styles.content}>
          {isPremium && (
            <View style={styles.premiumBadge}>
              <Crown size={12} color={Colors.white} />
            </View>
          )}
          
          {isLocked && (
            <View style={styles.lockOverlay}>
              <View style={styles.lockIcon}>
                <Lock size={24} color={Colors.white} />
              </View>
            </View>
          )}
          
          {icon && <Text style={styles.icon}>{icon}</Text>}
          
          <View style={styles.textContainer}>
            <Text style={styles.title} numberOfLines={2}>{title}</Text>
            {subtitle && <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text>}
          </View>
          
          {progress !== undefined && (
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${progress}%` }]} />
              </View>
              <Text style={styles.progressText}>{progress}%</Text>
            </View>
          )}
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: 'rgba(0, 0, 0, 0.15)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 6,
  },
  gradient: {
    padding: 20,
    minHeight: 160,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  premiumBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 12,
    padding: 6,
  },
  lockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  lockIcon: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 30,
    padding: 16,
  },
  icon: {
    fontSize: 40,
    marginBottom: 8,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  title: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: Colors.white,
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.white,
    opacity: 0.9,
  },
  progressContainer: {
    marginTop: 12,
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.white,
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: Colors.white,
    fontWeight: '600' as const,
    opacity: 0.9,
  },
});
