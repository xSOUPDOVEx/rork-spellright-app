import Colors from '@/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

type ProgressBarProps = {
  progress: number;
  total: number;
  showLabel?: boolean;
  height?: number;
  testID?: string;
};

export default function ProgressBar({
  progress,
  total,
  showLabel = true,
  height = 12,
  testID,
}: ProgressBarProps) {
  const percentage = Math.min((progress / total) * 100, 100);
  const animatedWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(animatedWidth, {
      toValue: percentage,
      useNativeDriver: false,
      tension: 40,
      friction: 8,
    }).start();
  }, [percentage, animatedWidth]);

  return (
    <View style={styles.container} testID={testID}>
      <View style={[styles.track, { height }]}>
        <Animated.View
          style={[
            styles.progressContainer,
            {
              width: animatedWidth.interpolate({
                inputRange: [0, 100],
                outputRange: ['0%', '100%'],
              }),
            },
          ]}
        >
          <LinearGradient
            colors={[Colors.gradient.primary[0], Colors.gradient.primary[1]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.progress}
          />
        </Animated.View>
      </View>
      {showLabel && (
        <Text style={styles.label}>
          {progress} / {total}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  track: {
    width: '100%',
    backgroundColor: Colors.border,
    borderRadius: 100,
    overflow: 'hidden',
  },
  progressContainer: {
    height: '100%',
  },
  progress: {
    height: '100%',
    borderRadius: 100,
  },
  label: {
    marginTop: 8,
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '600' as const,
    textAlign: 'right',
  },
});
