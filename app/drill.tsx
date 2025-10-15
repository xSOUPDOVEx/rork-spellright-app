
import Colors from '@/constants/colors';
import { useApp } from '@/contexts/AppContext';
import { mockWords, Word } from '@/mocks/words';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Check, Delete, X } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Platform, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ConfettiCannon from 'react-native-confetti-cannon';

const KEYBOARD_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
];

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const getLetterBoxSize = (wordLength: number) => {
  const containerPadding = 48;
  const availableWidth = SCREEN_WIDTH - containerPadding;
  const maxBoxWidth = 48;
  const minBoxWidth = 28;
  const gap = 6;
  
  const totalGapWidth = (wordLength - 1) * gap;
  let boxWidth = (availableWidth - totalGapWidth) / wordLength;
  
  boxWidth = Math.max(minBoxWidth, Math.min(maxBoxWidth, boxWidth));
  
  const fontSize = boxWidth > 40 ? 24 : boxWidth > 32 ? 20 : 18;
  const height = boxWidth > 40 ? 56 : boxWidth > 32 ? 48 : 42;
  
  return {
    width: boxWidth,
    height: height,
    fontSize: fontSize,
  };
};

export default function DrillScreen() {
  const { settings, addXP, updateStreak, incrementWordsLearned } = useApp();
  const router = useRouter();
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
  const [userInput, setUserInput] = useState<string>('');
  const [results, setResults] = useState<{ word: Word; correct: boolean }[]>([]);
  const [showFeedback, setShowFeedback] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [words, setWords] = useState<Word[]>([]);
  const [tip, setTip] = useState<string>('');
  const [showConfetti, setShowConfetti] = useState(false);
  const fadeAnim = useState(new Animated.Value(1))[0];
  const keyAnimations = useRef<{ [key: string]: Animated.Value }>({}).current;

  useEffect(() => {
    const filteredWords = settings.difficulty === 'mixed'
      ? mockWords.slice(0, 5)
      : mockWords.filter(w => w.difficulty === settings.difficulty).slice(0, 5);
    setWords(filteredWords);
  }, [settings.difficulty]);

  const currentWord = words[currentWordIndex];

  const animateKeyPress = (key: string) => {
    if (!keyAnimations[key]) {
      keyAnimations[key] = new Animated.Value(1);
    }
    
    Animated.sequence([
      Animated.timing(keyAnimations[key], {
        toValue: 0.94,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.spring(keyAnimations[key], {
        toValue: 1,
        useNativeDriver: true,
        speed: 100,
        bounciness: 4,
      }),
    ]).start();
  };

  const handleKeyPress = (key: string) => {
    if (showFeedback) return;
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    animateKeyPress(key);
    setUserInput(prev => prev + key.toLowerCase());
  };

  const handleBackspace = () => {
    if (showFeedback) return;
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    animateKeyPress('backspace');
    setUserInput(prev => prev.slice(0, -1));
  };

  const handleSubmit = () => {
    if (!currentWord || userInput.length === 0) return;
    animateKeyPress('submit');

    const correct = userInput.toLowerCase() === currentWord.word.toLowerCase();
    setIsCorrect(correct);
    setShowFeedback(true);
    setResults([...results, { word: currentWord, correct }]);

    if (Platform.OS !== 'web') {
      if (correct) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    }

    // Play pronunciation audio if voice is enabled
    if (settings.voiceEnabled && correct) {
      // TODO: Integrate ElevenLabs TTS in Cursor
      // await playWordAudio(currentWord.word);
      console.log('Voice feedback enabled - will play:', currentWord.word);
    }

    if (correct) {
      addXP(10);
      incrementWordsLearned();
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    } else {
      // TODO: Replace with actual Claude API call in Cursor
      // This will be integrated with Anthropic SDK
      // Future: const tip = await getAIFeedback(userInput, currentWord.word);
      const mockTips = [
        "Remember: I before E except after C",
        "Double letters are common in English",
        "Break the word into syllables",
        "Look for common prefixes and suffixes",
        "Sound it out slowly",
        "Think about word patterns you know",
      ];
      const randomTip = mockTips[Math.floor(Math.random() * mockTips.length)];
      setTip(randomTip);
    }

    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    setTimeout(() => {
      if (currentWordIndex < words.length - 1) {
        setCurrentWordIndex(currentWordIndex + 1);
        setUserInput('');
        setShowFeedback(false);
      } else {
        updateStreak();
        const finalResults = results.concat([{ word: currentWord, correct }]);
        router.replace({
          pathname: '/results' as any,
          params: { resultsData: JSON.stringify(finalResults) },
        });
      }
    }, 1500);
  };

  if (!currentWord) {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
          <View style={styles.loadingContainer}>
            <View style={styles.loadingCard}>
              <Text style={styles.loadingEmoji}>📚</Text>
              <Text style={styles.loadingText}>Preparing your words...</Text>
              <View style={styles.loadingBar}>
                <View style={styles.loadingBarFill} />
              </View>
            </View>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        {showConfetti && (
          <ConfettiCannon
            count={50}
            origin={{ x: SCREEN_WIDTH / 2, y: 0 }}
            fadeOut
          />
        )}
        <View style={styles.header}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${((currentWordIndex + 1) / words.length) * 100}%` },
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            {currentWordIndex + 1} / {words.length}
          </Text>
        </View>

        <View style={styles.content}>
          <Animated.View style={[styles.wordContainer, { opacity: fadeAnim }]}>
            {!showFeedback && (
              <>
                <Text style={styles.instruction}>Spell the word:</Text>
                <Text style={styles.word}>{currentWord.word}</Text>

                {currentWord.hint && (
                  <View style={styles.hintContainer}>
                    <Text style={styles.hintLabel}>💡 Hint:</Text>
                    <Text style={styles.hintText}>{currentWord.hint}</Text>
                  </View>
                )}

                <View style={styles.inputContainer}>
                  {currentWord.word.split('').map((_, index) => {
                    const wordLength = currentWord.word.length;
                    const boxSize = getLetterBoxSize(wordLength);
                    return (
                      <View key={index} style={[styles.letterBox, boxSize]}>
                        {userInput[index] ? (
                          <Text style={[styles.letterText, { fontSize: boxSize.fontSize }]}>
                            {userInput[index].toUpperCase()}
                          </Text>
                        ) : (
                          <View style={styles.underscore} />
                        )}
                      </View>
                    );
                  })}
                </View>
              </>
            )}

            {showFeedback && (
              <View style={styles.feedbackContainer}>
                <View style={[styles.feedbackBadge, isCorrect ? styles.correctBadge : styles.incorrectBadge]}>
                  {isCorrect ? (
                    <Check size={48} color={Colors.white} />
                  ) : (
                    <X size={48} color={Colors.white} />
                  )}
                </View>
                <Text style={[styles.feedbackText, isCorrect ? styles.correctText : styles.incorrectText]}>
                  {isCorrect ? 'Correct!' : 'Not quite!'}
                </Text>
                {isCorrect && (
                  <View style={styles.xpBadge}>
                    <Text style={styles.xpText}>+10 XP</Text>
                  </View>
                )}
                {!isCorrect && (
                  <>
                    <View style={styles.correctAnswer}>
                      <Text style={styles.correctAnswerLabel}>Correct spelling:</Text>
                      <Text style={styles.correctAnswerText}>{currentWord.word}</Text>
                    </View>
                    <View style={styles.tipContainer}>
                      <Text style={styles.tipLabel}>💡 Tip:</Text>
                      <Text style={styles.tipText}>{tip}</Text>
                    </View>
                  </>
                )}
              </View>
            )}
          </Animated.View>

          <View style={styles.keyboardContainer}>
            {KEYBOARD_ROWS.map((row, rowIndex) => (
              <View key={rowIndex} style={styles.keyboardRow}>
                {rowIndex === 1 && <View style={styles.spacer} />}
                {rowIndex === 2 && <View style={styles.spacer} />}
                {row.map((key) => {
                  if (!keyAnimations[key]) {
                    keyAnimations[key] = new Animated.Value(1);
                  }
                  const isDisabled = showFeedback || userInput.length === currentWord.word.length;
                  
                  return (
                    <TouchableWithoutFeedback
                      key={key}
                      onPress={() => handleKeyPress(key)}
                      disabled={isDisabled}
                    >
                      <Animated.View
                        style={[
                          styles.key,
                          isDisabled && styles.keyDisabled,
                          {
                            transform: [{ scale: keyAnimations[key] }],
                          },
                        ]}
                      >
                        <Text style={styles.keyText}>{key}</Text>
                      </Animated.View>
                    </TouchableWithoutFeedback>
                  );
                })}
                {rowIndex === 1 && <View style={styles.spacer} />}
                {rowIndex === 2 && <View style={styles.spacer} />}
              </View>
            ))}
            <View style={styles.keyboardRow}>
              {(() => {
                if (!keyAnimations['backspace']) {
                  keyAnimations['backspace'] = new Animated.Value(1);
                }
                if (!keyAnimations['submit']) {
                  keyAnimations['submit'] = new Animated.Value(1);
                }
                const backspaceDisabled = showFeedback || userInput.length === 0;
                const submitDisabled = showFeedback || userInput.length === 0;
                
                return (
                  <>
                    <TouchableWithoutFeedback
                      onPress={handleBackspace}
                      disabled={backspaceDisabled}
                    >
                      <Animated.View
                        style={[
                          styles.key,
                          styles.backspaceKey,
                          backspaceDisabled && styles.keyDisabled,
                          {
                            transform: [{ scale: keyAnimations['backspace'] }],
                          },
                        ]}
                      >
                        <Delete size={20} color={Colors.text} />
                      </Animated.View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback
                      onPress={handleSubmit}
                      disabled={submitDisabled}
                    >
                      <Animated.View
                        style={[
                          styles.key,
                          styles.submitKey,
                          submitDisabled && styles.submitKeyDisabled,
                          {
                            transform: [{ scale: keyAnimations['submit'] }],
                          },
                        ]}
                      >
                        <Text style={styles.submitKeyText}>CHECK</Text>
                      </Animated.View>
                    </TouchableWithoutFeedback>
                  </>
                );
              })()}
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 16,
  },
  progressBar: {
    height: 8,
    backgroundColor: Colors.border,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
  },
  progressText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    fontWeight: '600' as const,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  wordContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
  },
  feedbackContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  feedbackBadge: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: 'rgba(0, 0, 0, 0.15)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 6,
  },
  correctBadge: {
    backgroundColor: Colors.success,
  },
  incorrectBadge: {
    backgroundColor: Colors.error,
  },
  instruction: {
    fontSize: 18,
    color: Colors.textSecondary,
    marginBottom: 12,
  },
  word: {
    fontSize: 36,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 24,
  },
  hintContainer: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    maxWidth: '100%',
    shadowColor: 'rgba(0, 0, 0, 0.08)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
  },
  hintLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  hintText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  letterBox: {
    borderRadius: 12,
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'rgba(0, 0, 0, 0.08)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 2,
  },
  underscore: {
    width: '60%',
    height: 3,
    backgroundColor: Colors.border,
    borderRadius: 2,
  },
  letterText: {
    fontWeight: '700' as const,
    color: Colors.text,
  },
  feedbackText: {
    fontSize: 32,
    fontWeight: '700' as const,
    marginBottom: 16,
  },
  correctText: {
    color: Colors.success,
  },
  incorrectText: {
    color: Colors.error,
  },
  correctAnswer: {
    alignItems: 'center',
    marginTop: 8,
  },
  correctAnswerLabel: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  correctAnswerText: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  xpBadge: {
    backgroundColor: Colors.success,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 4,
    shadowColor: Colors.success,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  xpText: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.white,
  },
  tipContainer: {
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 16,
    padding: 16,
    marginTop: 12,
    maxWidth: '90%',
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: 'rgba(0, 0, 0, 0.08)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
  },
  tipLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  tipText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  keyboardContainer: {
    paddingBottom: 12,
    gap: 8,
  },
  keyboardRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    height: 48,
  },
  spacer: {
    width: 16,
  },
  key: {
    minWidth: 32,
    flex: 1,
    maxWidth: 42,
    height: 48,
    backgroundColor: Colors.white,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  keyDisabled: {
    opacity: 0.4,
  },
  keyText: {
    fontSize: 17,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  backspaceKey: {
    flex: 1.5,
    maxWidth: 1000,
    backgroundColor: Colors.backgroundSecondary,
  },
  submitKey: {
    flex: 3,
    maxWidth: 1000,
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  submitKeyDisabled: {
    backgroundColor: Colors.border,
    opacity: 0.5,
  },
  submitKeyText: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: Colors.white,
    letterSpacing: 0.5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  loadingCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    shadowColor: 'rgba(0, 0, 0, 0.08)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4,
    width: '100%',
    maxWidth: 320,
  },
  loadingEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 18,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 24,
    fontWeight: '600' as const,
  },
  loadingBar: {
    width: '100%',
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  loadingBarFill: {
    width: '60%',
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
});
