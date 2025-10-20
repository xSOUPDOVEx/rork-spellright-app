import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Volume2, Lightbulb, CheckCircle } from 'lucide-react-native';
import Colors from '@/constants/colors';

interface Phase2_12RecallProps {
  word: string;
  userInput: string;
  onLetterInput: (letter: string) => void;
  hint: string;
}

export default function Phase2_12Recall({
  word,
  userInput,
  hint,
}: Phase2_12RecallProps) {
  const pulseAnim = useRef(new Animated.Value(1)).current;

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

  const isComplete = userInput.length === word.length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Volume2 size={32} color={Colors.success} />
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerText}>Great! Now spell it one more time</Text>
          <Text style={styles.headerSubtext}>✨ You can do this!</Text>
        </View>
      </View>

      <View style={styles.hintCard}>
        <Lightbulb size={20} color={Colors.warning} fill={Colors.warning} />
        <Text style={styles.hintText}>{hint}</Text>
      </View>

      <View style={styles.statusBadge}>
        <CheckCircle size={16} color={Colors.success} />
        <Text style={styles.statusText}>Final check</Text>
      </View>

      <View style={styles.letterSlotsContainer}>
        {word.split('').map((letter, index) => {
          const isFilled = index < userInput.length;
          const isCurrent = index === userInput.length;
          const userLetter = userInput[index];

          return (
            <View
              key={index}
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
          );
        })}
      </View>

      {isComplete && (
        <View style={styles.completeMessage}>
          <CheckCircle size={24} color={Colors.success} />
          <Text style={styles.completeText}>Almost there!</Text>
        </View>
      )}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 24,
    shadowColor: 'rgba(0, 0, 0, 0.08)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 2,
    borderColor: Colors.success + '40',
  },
  headerTextContainer: {
    flex: 1,
    gap: 4,
  },
  headerText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  headerSubtext: {
    fontSize: 14,
    color: Colors.textSecondary,
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
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.success + '20',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: Colors.success,
  },
  letterSlotsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 24,
    marginTop: 16,
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
    borderColor: Colors.success,
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
    backgroundColor: Colors.success,
    borderRadius: 2,
  },
  blankUnderscore: {
    width: 28,
    height: 3,
    backgroundColor: Colors.border,
    borderRadius: 2,
  },
  completeMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
  },
  completeText: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.success,
  },
});
