import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Volume2, Lightbulb, Check, X } from 'lucide-react-native';
import Colors from '@/constants/colors';

interface Phase3FlashcardProps {
  word: string;
  testPosition: number;
  userInput: string;
  onLetterInput: (letter: string) => void;
  hint: string;
  pileStats: {
    toDo: number;
    unsure: number;
    correct: number;
  };
  showCorrection: boolean;
  correctionLetter: string;
  isCorrect?: boolean;
}

export default function Phase3Flashcard({
  word,
  testPosition,
  userInput,
  hint,
  pileStats,
  showCorrection,
  correctionLetter,
  isCorrect = true,
}: Phase3FlashcardProps) {
  const cardScale = useRef(new Animated.Value(1)).current;
  const feedbackAnim = useRef(new Animated.Value(0)).current;
  const cardSlideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(cardScale, {
      toValue: 1,
      tension: 60,
      friction: 8,
      useNativeDriver: true,
    }).start();
  }, [word, testPosition]);

  useEffect(() => {
    if (showCorrection) {
      feedbackAnim.setValue(0);
      Animated.spring(feedbackAnim, {
        toValue: 1,
        tension: 70,
        friction: 7,
        useNativeDriver: true,
      }).start();

      cardSlideAnim.setValue(0);
      Animated.timing(cardSlideAnim, {
        toValue: isCorrect ? 1 : -1,
        duration: 500,
        delay: 800,
        useNativeDriver: true,
      }).start();
    }
  }, [showCorrection, isCorrect]);

  const totalCards = pileStats.toDo + pileStats.unsure + pileStats.correct;
  const currentCard = pileStats.correct + 1;

  return (
    <View style={styles.container}>
      <View style={styles.pileStats}>
        <View style={[styles.pileBadge, styles.todoBadge]}>
          <Text style={styles.pileBadgeText}>TO DO: {pileStats.toDo}</Text>
        </View>
        <View style={[styles.pileBadge, styles.unsureBadge]}>
          <Text style={styles.pileBadgeText}>UNSURE: {pileStats.unsure}</Text>
        </View>
        <View style={[styles.pileBadge, styles.correctBadge]}>
          <Check size={14} color={Colors.white} strokeWidth={3} />
          <Text style={styles.pileBadgeText}>CORRECT: {pileStats.correct}</Text>
        </View>
      </View>

      <Animated.View
        style={[
          styles.flashcard,
          {
            transform: [
              { scale: cardScale },
              {
                translateX: cardSlideAnim.interpolate({
                  inputRange: [-1, 0, 1],
                  outputRange: [-400, 0, 400],
                }),
              },
              {
                rotate: cardSlideAnim.interpolate({
                  inputRange: [-1, 0, 1],
                  outputRange: ['-15deg', '0deg', '15deg'],
                }),
              },
            ],
          },
        ]}
      >
        <View style={styles.audioSection}>
          <Volume2 size={28} color={Colors.primary} />
        </View>

        <View style={styles.hintCard}>
          <Lightbulb size={18} color={Colors.warning} fill={Colors.warning} />
          <Text style={styles.hintText}>{hint}</Text>
        </View>

        <View style={styles.wordDisplay}>
          {word.split('').map((letter, index) => {
            const isBlank = index === testPosition;
            
            return (
              <View key={index} style={styles.letterWrapper}>
                {isBlank ? (
                  <View style={[styles.letterBox, styles.blankBox]}>
                    {userInput ? (
                      <Text style={styles.letterText}>{userInput.toUpperCase()}</Text>
                    ) : (
                      <View style={styles.underscore} />
                    )}
                  </View>
                ) : (
                  <View style={styles.letterBox}>
                    <Text style={styles.letterText}>{letter.toUpperCase()}</Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>

        {showCorrection && (
          <Animated.View
            style={[
              styles.feedbackOverlay,
              {
                transform: [{ scale: feedbackAnim }],
                opacity: feedbackAnim,
              },
            ]}
          >
            <View style={[
              styles.feedbackBadge,
              isCorrect ? styles.correctFeedback : styles.incorrectFeedback,
            ]}>
              {isCorrect ? (
                <Check size={32} color={Colors.white} strokeWidth={3} />
              ) : (
                <X size={32} color={Colors.white} strokeWidth={3} />
              )}
            </View>
            <Text style={[
              styles.feedbackText,
              isCorrect ? styles.correctText : styles.incorrectText,
            ]}>
              {isCorrect ? 'Correct!' : `It's ${correctionLetter.toUpperCase()}`}
            </Text>
          </Animated.View>
        )}
      </Animated.View>

      <View style={styles.progressInfo}>
        <Text style={styles.progressText}>
          Card {currentCard} of {totalCards}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 24,
    gap: 20,
  },
  pileStats: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 24,
    flexWrap: 'wrap',
  },
  pileBadge: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  todoBadge: {
    backgroundColor: Colors.border,
  },
  unsureBadge: {
    backgroundColor: Colors.warning,
  },
  correctBadge: {
    backgroundColor: Colors.success,
  },
  pileBadgeText: {
    fontSize: 12,
    fontWeight: '700' as const,
    color: Colors.white,
  },
  flashcard: {
    backgroundColor: Colors.white,
    borderRadius: 24,
    padding: 32,
    marginHorizontal: 24,
    gap: 24,
    shadowColor: 'rgba(0, 0, 0, 0.15)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 24,
    elevation: 8,
    minHeight: 350,
  },
  audioSection: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  hintCard: {
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  hintText: {
    flex: 1,
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
  },
  wordDisplay: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginTop: 16,
  },
  letterWrapper: {
    alignItems: 'center',
  },
  letterBox: {
    width: 42,
    height: 52,
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.border,
  },
  blankBox: {
    backgroundColor: Colors.white,
    borderColor: Colors.primary,
    borderWidth: 3,
    width: 48,
    height: 58,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  letterText: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  underscore: {
    width: 24,
    height: 3,
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
  feedbackOverlay: {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: [{ translateX: -60 }, { translateY: -60 }],
    alignItems: 'center',
    gap: 12,
  },
  feedbackBadge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'rgba(0, 0, 0, 0.2)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 6,
  },
  correctFeedback: {
    backgroundColor: Colors.success,
  },
  incorrectFeedback: {
    backgroundColor: Colors.error,
  },
  feedbackText: {
    fontSize: 20,
    fontWeight: '700' as const,
  },
  correctText: {
    color: Colors.success,
  },
  incorrectText: {
    color: Colors.error,
  },
  progressInfo: {
    alignItems: 'center',
    paddingTop: 8,
  },
  progressText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '600' as const,
  },
});
