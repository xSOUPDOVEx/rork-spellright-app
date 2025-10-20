import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Volume2, Play } from 'lucide-react-native';
import Colors from '@/constants/colors';

interface AudioPlayerProps {
  audioText: string;
  onPlay: () => void;
  variant?: 'letter' | 'word';
}

export default function AudioPlayer({ 
  audioText, 
  onPlay, 
  variant = 'word' 
}: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const waveAnims = useRef([
    new Animated.Value(0.3),
    new Animated.Value(0.5),
    new Animated.Value(0.8),
    new Animated.Value(0.5),
    new Animated.Value(0.3),
  ]).current;

  useEffect(() => {
    if (isPlaying) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();

      const waveAnimations = waveAnims.map((anim, index) =>
        Animated.loop(
          Animated.sequence([
            Animated.timing(anim, {
              toValue: 1,
              duration: 300 + index * 50,
              useNativeDriver: true,
            }),
            Animated.timing(anim, {
              toValue: 0.3,
              duration: 300 + index * 50,
              useNativeDriver: true,
            }),
          ])
        )
      );
      
      waveAnimations.forEach((wave, index) => {
        setTimeout(() => wave.start(), index * 50);
      });

      return () => {
        pulse.stop();
        waveAnimations.forEach(wave => wave.stop());
      };
    }
  }, [isPlaying]);

  const handlePress = () => {
    setIsPlaying(true);
    setHasPlayed(true);
    onPlay();
    
    setTimeout(() => {
      setIsPlaying(false);
    }, 2000);
  };

  const isLetter = variant === 'letter';

  return (
    <TouchableOpacity
      style={[
        styles.container,
        isLetter ? styles.containerSmall : styles.containerLarge,
      ]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <Animated.View
        style={[
          styles.iconContainer,
          {
            transform: [{ scale: isPlaying ? pulseAnim : 1 }],
          },
        ]}
      >
        <Volume2 
          size={isLetter ? 24 : 32} 
          color={Colors.primary} 
        />
      </Animated.View>

      <View style={styles.textContainer}>
        <Text style={[
          styles.audioText,
          isLetter && styles.audioTextSmall,
        ]}>
          {audioText}
        </Text>
        {!hasPlayed && (
          <Text style={styles.tapText}>Tap to hear</Text>
        )}
        {hasPlayed && !isPlaying && (
          <Text style={styles.tapText}>Tap to replay</Text>
        )}
      </View>

      {isPlaying && (
        <View style={styles.waveformContainer}>
          {waveAnims.map((anim, index) => (
            <Animated.View
              key={index}
              style={[
                styles.waveBar,
                {
                  height: anim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [4, 24],
                  }),
                },
              ]}
            />
          ))}
        </View>
      )}

      {!isPlaying && (
        <View style={styles.playButtonContainer}>
          <Play size={isLetter ? 16 : 20} color={Colors.primary} fill={Colors.primary} />
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: 'rgba(0, 0, 0, 0.06)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
  },
  containerSmall: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 10,
  },
  containerLarge: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    gap: 12,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    gap: 2,
  },
  audioText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  audioTextSmall: {
    fontSize: 14,
  },
  tapText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  waveformContainer: {
    flexDirection: 'row',
    gap: 3,
    alignItems: 'center',
    height: 28,
  },
  waveBar: {
    width: 3,
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
  playButtonContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
