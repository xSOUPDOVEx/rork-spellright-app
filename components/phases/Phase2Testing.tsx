import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Volume2, Lightbulb } from 'lucide-react-native';
import Colors from '@/constants/colors';

interface Phase2TestingProps {
  word: string;
  userInput: string;
  showCorrection: boolean;
  correctionLetter: string;
  onLetterInput: (letter: string) => void;
  hint: string;
}

export default function Phase2Testing({
  word,
  userInput,
  showCorrection,
  correctionLetter,
  hint,
}: Phase2TestingProps) {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const correctionAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
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
  }, []);

  useEffect(() => {
    if (showCorrection) {
      correctionAnim.setValue(0);
      Animated.spring(correctionAnim, {
        toValue: 1,
        tension: 80,
        friction: 6,
        useNativeDriver: true,
      }).start(() => {
        setTimeout(() => {
          Animated.timing(correctionAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }).start();
        }, 1500);
      });
    }
  }, [showCorrection]);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.audioButton} activeOpacity={0.7}>
        <Volume2 size={36} color={Colors.primary} />
        <Text style={styles.audioText}>Listen and spell the word</Text>
      </TouchableOpacity>

      <View style={styles.hintCard}>
        <Lightbulb size={20} color={Colors.warning} fill={Colors.warning} />
        <Text style={styles.hintText}>{hint}</Text>
      </View>

      <View style={styles.letterSlotsContainer}>
        {word.split('').map((letter, index) => {
          const isFilled = index < userInput.length;
          const isCurrent = index === userInput.length;
          const userLetter = userInput[index];

          return (
            <View key={index} style={styles.slotWrapper}>
              <View
                style={[
                  styles.letterSlot,
                  isCurrent && styles.currentSlot,
                ]}
              >
                {isFilled ? (
                  <Text style={styles.slotLetter}>{userLetter?.toUpperCase()}</Text>
                ) : isCurrent ? (
                  <Animated.View style={[styles.cursorContainer, { opacity: pulseAnim }]}>
                    <View style={styles.cursor} />
                  </Animated.View>
                ) : (
                  <View style={styles.blankUnderscore} />
                )}
              </View>

              {showCorrection && isCurrent && (
                <Animated.View
                  style={[
                    styles.correctionPopup,
                    {
                      transform: [{ scale: correctionAnim }],
                      opacity: correctionAnim,
                    },
                  ]}
                >
                  <Text style={styles.correctionText}>Should be:</Text>
                  <Text style={styles.correctionLetter}>{correctionLetter.toUpperCase()}</Text>
                </Animated.View>
              )}
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
    gap: 24,
  },
  audioButton: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 32,
    alignItems: 'center',
    gap: 8,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4,
    flexDirection: 'row',
  },
  audioText: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: '700' as const,
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
  letterSlotsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 24,
    marginTop: 16,
  },
  slotWrapper: {
    position: 'relative' as const,
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
  },
  slotLetter: {
    fontSize: 26,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  cursorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  cursor: {
    width: 3,
    height: 35,
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
  blankUnderscore: {
    width: 28,
    height: 3,
    backgroundColor: Colors.border,
    borderRadius: 2,
  },
  correctionPopup: {
    position: 'absolute' as const,
    top: -80,
    left: '50%',
    transform: [{ translateX: -50 }],
    backgroundColor: Colors.error,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    shadowColor: Colors.error,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
    minWidth: 100,
  },
  correctionText: {
    fontSize: 11,
    color: Colors.white,
    fontWeight: '600' as const,
    opacity: 0.9,
  },
  correctionLetter: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.white,
  },
});
