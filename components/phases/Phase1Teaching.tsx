import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { Volume2 } from 'lucide-react-native';
import Colors from '@/constants/colors';

interface Phase1TeachingProps {
  word: string;
  currentLetterIndex: number;
  onLetterComplete: () => void;
}

export default function Phase1Teaching({ 
  word, 
  currentLetterIndex,
  onLetterComplete 
}: Phase1TeachingProps) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();

    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [currentLetterIndex]);

  const currentLetter = word[currentLetterIndex];
  const totalLetters = word.length;

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.audioButton} activeOpacity={0.7}>
        <Volume2 size={40} color={Colors.primary} />
        <Text style={styles.audioText}>Tap to hear letter</Text>
      </TouchableOpacity>

      <Animated.View style={[styles.letterDisplay, { transform: [{ scale: scaleAnim }] }]}>
        <Text style={styles.currentLetter}>{currentLetter.toUpperCase()}</Text>
      </Animated.View>

      <View style={styles.wordBuildContainer}>
        <View style={styles.letterRow}>
          {word.split('').map((letter, index) => {
            const isFilled = index < currentLetterIndex;
            const isCurrent = index === currentLetterIndex;
            const isRemaining = index > currentLetterIndex;

            return (
              <View key={index} style={styles.letterSlot}>
                {isFilled && (
                  <Text style={styles.filledLetter}>{letter.toUpperCase()}</Text>
                )}
                {isCurrent && (
                  <Animated.View style={[styles.cursorContainer, { opacity: pulseAnim }]}>
                    <View style={styles.cursor} />
                  </Animated.View>
                )}
                {isRemaining && (
                  <View style={styles.blankSlot} />
                )}
              </View>
            );
          })}
        </View>
      </View>

      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>
          Letter {currentLetterIndex + 1} of {totalLetters}
        </Text>
        <View style={styles.dotIndicators}>
          {word.split('').map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index <= currentLetterIndex && styles.dotFilled,
              ]}
            />
          ))}
        </View>
      </View>

      <View style={styles.instructionContainer}>
        <Text style={styles.instructionText}>Type the letter:</Text>
        <Text style={styles.instructionLetter}>{currentLetter.toUpperCase()}</Text>
        <Text style={styles.hintText}>Listen carefully and type what you hear</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 24,
    alignItems: 'center',
  },
  audioButton: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    gap: 8,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4,
    marginBottom: 32,
  },
  audioText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '600' as const,
  },
  letterDisplay: {
    width: 120,
    height: 120,
    backgroundColor: Colors.white,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 6,
    borderWidth: 3,
    borderColor: Colors.primary,
  },
  currentLetter: {
    fontSize: 64,
    fontWeight: '700' as const,
    color: Colors.primary,
  },
  wordBuildContainer: {
    marginBottom: 32,
  },
  letterRow: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
  },
  letterSlot: {
    width: 40,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  filledLetter: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  cursorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  cursor: {
    width: 3,
    height: 30,
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
  blankSlot: {
    width: 20,
    height: 3,
    backgroundColor: Colors.border,
    borderRadius: 2,
  },
  progressContainer: {
    alignItems: 'center',
    marginBottom: 24,
    gap: 12,
  },
  progressText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '600' as const,
  },
  dotIndicators: {
    flexDirection: 'row',
    gap: 6,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.border,
  },
  dotFilled: {
    backgroundColor: Colors.primary,
  },
  instructionContainer: {
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 24,
  },
  instructionText: {
    fontSize: 16,
    color: Colors.textSecondary,
    fontWeight: '600' as const,
  },
  instructionLetter: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: Colors.primary,
  },
  hintText: {
    fontSize: 12,
    color: Colors.textLight,
    textAlign: 'center',
  },
});
