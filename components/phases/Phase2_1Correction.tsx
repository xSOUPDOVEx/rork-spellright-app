import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Volume2, Lightbulb } from 'lucide-react-native';
import Colors from '@/constants/colors';

interface Phase2_1CorrectionProps {
  word: string;
  mistakePositions: number[];
  currentPosition: number;
  filledLetters: string;
  showHover: boolean;
  hoverLetter: string;
  onLetterInput: (letter: string) => void;
  hint: string;
}

export default function Phase2_1Correction({
  word,
  mistakePositions,
  currentPosition,
  filledLetters,
  showHover,
  hoverLetter,
  hint,
}: Phase2_1CorrectionProps) {
  const slideAnims = useRef<Animated.Value[]>([]).current;
  const hoverAnim = useRef(new Animated.Value(0)).current;
  const hoverPulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (slideAnims.length === 0) {
      for (let i = 0; i < word.length; i++) {
        slideAnims.push(new Animated.Value(0));
      }
    }
  }, [word.length]);

  useEffect(() => {
    if (showHover) {
      hoverAnim.setValue(0);
      Animated.spring(hoverAnim, {
        toValue: 1,
        tension: 60,
        friction: 7,
        useNativeDriver: true,
      }).start();

      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(hoverPulseAnim, {
            toValue: 1.08,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(hoverPulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    } else {
      Animated.timing(hoverAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [showHover]);

  useEffect(() => {
    filledLetters.split('').forEach((_, index) => {
      if (slideAnims[index]) {
        Animated.spring(slideAnims[index], {
          toValue: 1,
          tension: 70,
          friction: 8,
          delay: index * 100,
          useNativeDriver: true,
        }).start();
      }
    });
  }, [filledLetters]);

  const currentMistakeNumber = mistakePositions.indexOf(currentPosition) + 1;
  const totalMistakes = mistakePositions.length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Volume2 size={32} color={Colors.primary} />
        <Text style={styles.headerText}>Let's practice the tricky parts</Text>
      </View>

      <View style={styles.hintCard}>
        <Lightbulb size={20} color={Colors.warning} fill={Colors.warning} />
        <Text style={styles.hintText}>{hint}</Text>
      </View>

      <View style={styles.progressInfo}>
        <Text style={styles.progressText}>
          Correcting mistake {currentMistakeNumber} of {totalMistakes}
        </Text>
        <View style={styles.mistakeCounter}>
          {mistakePositions.map((_, index) => (
            <View
              key={index}
              style={[
                styles.mistakeDot,
                index < currentMistakeNumber && styles.mistakeDotFilled,
              ]}
            />
          ))}
        </View>
      </View>

      <View style={styles.letterSlotsContainer}>
        {word.split('').map((letter, index) => {
          const isFilled = index < filledLetters.length;
          const isCurrent = index === currentPosition;
          const isGray = index > filledLetters.length;
          const filledLetter = filledLetters[index];

          return (
            <View key={index} style={styles.slotWrapper}>
              {showHover && isCurrent && (
                <Animated.View
                  style={[
                    styles.hoverContainer,
                    {
                      transform: [
                        { scale: hoverPulseAnim },
                        { translateY: hoverAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [20, 0],
                        })},
                      ],
                      opacity: hoverAnim,
                    },
                  ]}
                >
                  <View style={styles.hoverBubble}>
                    <Text style={styles.hoverLetter}>{hoverLetter.toUpperCase()}</Text>
                  </View>
                  <View style={styles.hoverArrow} />
                </Animated.View>
              )}

              <Animated.View
                style={[
                  styles.letterSlot,
                  isCurrent && styles.currentSlot,
                  isGray && styles.graySlot,
                  isFilled && slideAnims[index] && {
                    transform: [
                      {
                        translateX: slideAnims[index]?.interpolate({
                          inputRange: [0, 1],
                          outputRange: [-30, 0],
                        }),
                      },
                    ],
                    opacity: slideAnims[index],
                  },
                ]}
              >
                {isFilled ? (
                  <Text style={styles.slotLetter}>{filledLetter?.toUpperCase()}</Text>
                ) : (
                  <View style={styles.blankUnderscore} />
                )}
              </Animated.View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 24,
    alignItems: 'center',
    gap: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 24,
    shadowColor: 'rgba(0, 0, 0, 0.08)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
  },
  headerText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.text,
    flex: 1,
  },
  hintCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: 'rgba(0, 0, 0, 0.08)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
  },
  hintText: {
    flex: 1,
    fontSize: 15,
    color: Colors.text,
    lineHeight: 21,
  },
  progressInfo: {
    alignItems: 'center',
    gap: 8,
  },
  progressText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '600' as const,
  },
  mistakeCounter: {
    flexDirection: 'row',
    gap: 6,
  },
  mistakeDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.border,
  },
  mistakeDotFilled: {
    backgroundColor: Colors.warning,
  },
  letterSlotsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 24,
    marginTop: 24,
  },
  slotWrapper: {
    position: 'relative' as const,
    alignItems: 'center',
  },
  letterSlot: {
    width: 48,
    height: 60,
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'rgba(0, 0, 0, 0.06)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 2,
  },
  currentSlot: {
    borderColor: Colors.primary,
    borderWidth: 3,
    shadowColor: Colors.primary,
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  graySlot: {
    backgroundColor: Colors.backgroundSecondary,
    borderColor: Colors.border,
  },
  slotLetter: {
    fontSize: 26,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  blankUnderscore: {
    width: 28,
    height: 3,
    backgroundColor: Colors.border,
    borderRadius: 2,
  },
  hoverContainer: {
    position: 'absolute' as const,
    top: -80,
    alignItems: 'center',
    zIndex: 10,
  },
  hoverBubble: {
    backgroundColor: `rgba(127, 217, 154, 0.2)`,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 20,
    shadowColor: Colors.success,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 2,
    borderColor: Colors.success,
  },
  hoverLetter: {
    fontSize: 48,
    fontWeight: '700' as const,
    color: Colors.success,
  },
  hoverArrow: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 12,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: Colors.success,
    marginTop: -2,
  },
});
