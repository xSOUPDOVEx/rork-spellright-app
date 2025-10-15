import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '@/constants/colors';

interface ProgressBarProps {
  progress: number;
  total: number;
  height?: number;
  showLabel?: boolean;
  color?: string;
}

export default function ProgressBar({
  progress,
  total,
  height = 12,
  showLabel = true,
  color = Colors.primary,
}: ProgressBarProps) {
  const percentage = Math.min((progress / total) * 100, 100);

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.barContainer,
          {
            backgroundColor: Colors.border,
            borderRadius: height / 2,
            height,
          },
        ]}
      >
        <View
          style={[
            styles.filledBar,
            {
              width: `${percentage}%`,
              backgroundColor: color,
              borderRadius: height / 2,
            },
          ]}
        />
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
  barContainer: {
    width: '100%',
    overflow: 'hidden',
  },
  filledBar: {
    height: '100%',
  },
  label: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
    textAlign: 'center' as const,
  },
});
