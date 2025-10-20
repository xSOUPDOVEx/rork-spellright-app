
import Colors from '@/constants/colors';
import { useApp } from '@/contexts/AppContext';
import { mockWords, Word } from '@/mocks/words';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Check, Delete, Star, X } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ConfettiCannon from 'react-native-confetti-cannon';

const KEYBOARD_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
];

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const getLetterBoxSize = (wordLength: number) => {
  const containerPadding = 56;
  const availableWidth = SCREEN_WIDTH - containerPadding;
  const maxBoxWidth = 48;
  const minBoxWidth = 22;
  const gap = 4;
  
  const totalGapWidth = (wordLength - 1) * gap;
  let boxWidth = (availableWidth - totalGapWidth) / wordLength;
  
  boxWidth = Math.max(minBoxWidth, Math.min(maxBoxWidth, boxWidth));
  
  const fontSize = boxWidth > 40 ? 22 : boxWidth > 32 ? 18 : boxWidth > 26 ? 16 : 14;
  const height = boxWidth > 40 ? 54 : boxWidth > 32 ? 46 : boxWidth > 26 ? 40 : 36;
  
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
  const [mastery, setMastery] = useState<number>(7);
  const fadeAnim = useState(new Animated.Value(1))[0];
  const xpFloatAnim = useState(new Animated.Value(0))[0];
  const xpOpacityAnim = useState(new Animated.Value(0))[0];
  const feedbackScaleAnim = useState(new Animated.Value(0))[0];
  const pulseAnim = useState(new Animated.Value(1))[0];
  const keyAnimations = useRef<{ [key: string]: Animated.Value }>({}).current;

  useEffect(() => {
    const filteredWords = settings.difficulty === 'mixed'
      ? mockWords.slice(0, 5)
      : mockWords.filter(w => w.difficulty === settings.difficulty).slice(0, 5);
    setWords(filteredWords);
  }, [settings.difficulty]);

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
  }, [currentWordIndex, pulseAnim]);

  const currentWord = words[currentWordIndex];

  const animateKeyPress = (key: string) => {
    if (!keyAnimations[key]) {
      keyAnimations[key] = new Animated.Value(1);
    }
    
    keyAnimations[key].setValue(0.94);
    Animated.timing(keyAnimations[key], {
      toValue: 1,
      duration: 50,
      useNativeDriver: true,
    }).start();
  };

  const handleKeyPress = (key: string) => {
    if (showFeedback) return;
    animateKeyPress(key);
    setUserInput(prev => prev + key.toLowerCase());
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    }
  };

  const handleBackspace = () => {
    if (showFeedback) return;
    animateKeyPress('backspace');
    setUserInput(prev => prev.slice(0, -1));
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    }
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

    if (settings.voiceEnabled && correct) {
      console.log('Voice feedback enabled - will play:', currentWord.word);
    }

    if (correct) {
      addXP(10);
      incrementWordsLearned();
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
      
      xpOpacityAnim.setValue(1);
      xpFloatAnim.setValue(0);
      Animated.parallel([
        Animated.timing(xpFloatAnim, {
          toValue: -50,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(xpOpacityAnim, {
          toValue: 0,
          delay: 500,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
      
      const newMastery = Math.min(10, mastery + 1);
      setMastery(newMastery);
    } else {
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

    feedbackScaleAnim.setValue(0);
    Animated.spring(feedbackScaleAnim, {
      toValue: 1,
      tension: 50,
      friction: 5,
      useNativeDriver: true,
    }).start();

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
  };

  const handleContinue = () => {
    if (currentWordIndex < words.length - 1) {
      setCurrentWordIndex(currentWordIndex + 1);
      setUserInput('');
      setShowFeedback(false);
    } else {
      updateStreak();
      const finalResults = results.concat([{ word: currentWord, correct: isCorrect }]);
      router.replace({
        pathname: '/results' as any,
        params: { resultsData: JSON.stringify(finalResults) },
      });
    }
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
            origin={{ x: SCREEN_WIDTH / 2, y: 150 }}
            fadeOut
          />
        )}
        <KeyboardAvoidingView 
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={0}
        >
        <View style={styles.header}>
          <View style={styles.masteryContainer}>
            <View style={styles.masteryCircle}>
              <Star size={16} color={Colors.warning} fill={Colors.warning} />
              <Text style={styles.masteryText}>{mastery}/10</Text>
            </View>
          </View>
          
          <View style={styles.nodeProgressContainer}>
            <Text style={styles.nodeProgressLabel}>Word {currentWordIndex + 1} of {words.length}</Text>
            <View style={styles.nodesRow}>
              {words.map((_, index) => {
                const result = results[index];
                const isCurrent = index === currentWordIndex;
                const isCompleted = index < currentWordIndex || (index === currentWordIndex && showFeedback);
                
                return (
                  <View key={index} style={styles.nodeWrapper}>
                    {isCurrent && !showFeedback && (
                      <Animated.View 
                        style={[
                          styles.pulseRing,
                          {
                            transform: [{ scale: pulseAnim }],
                            opacity: pulseAnim.interpolate({
                              inputRange: [1, 1.15],
                              outputRange: [0.6, 0],
                            }),
                          },
                        ]} 
                      />
                    )}
                    <View
                      style={[
                        styles.node,
                        isCompleted && result?.correct && styles.nodeCorrect,
                        isCompleted && !result?.correct && styles.nodeIncorrect,
                        isCurrent && !showFeedback && styles.nodeCurrent,
                      ]}
                    >
                      {isCompleted && result?.correct && (
                        <Check size={12} color={Colors.white} strokeWidth={3} />
                      )}
                      {isCompleted && !result?.correct && (
                        <X size={12} color={Colors.white} strokeWidth={3} />
                      )}
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        </View>

        <ScrollView 
          style={styles.scrollContent}
          contentContainerStyle={styles.scrollContentContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
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
                <Animated.View 
                  style={[
                    styles.feedbackBadge, 
                    isCorrect ? styles.correctBadge : styles.incorrectBadge,
                    {
                      transform: [{ scale: feedbackScaleAnim }],
                    },
                  ]}
                >
                  {isCorrect ? (
                    <Check size={56} color={Colors.white} strokeWidth={3} />
                  ) : (
                    <X size={56} color={Colors.white} strokeWidth={3} />
                  )}
                </Animated.View>
                
                <Text style={[styles.feedbackText, isCorrect ? styles.correctText : styles.incorrectText]}>
                  {isCorrect ? 'Perfect!' : 'Not quite!'}
                </Text>
                
                {isCorrect && (
                  <Animated.View 
                    style={[
                      styles.xpBadge,
                      {
                        transform: [{ translateY: xpFloatAnim }],
                        opacity: xpOpacityAnim,
                      },
                    ]}
                  >
                    <Text style={styles.xpText}>+10 XP</Text>
                  </Animated.View>
                )}
                
                {!isCorrect && (
                  <>
                    <View style={styles.comparisonContainer}>
                      <View style={styles.comparisonColumn}>
                        <Text style={styles.comparisonLabel}>Your answer:</Text>
                        <View style={styles.comparisonBox}>
                          <Text style={styles.incorrectAnswerText}>{userInput}</Text>
                        </View>
                      </View>
                      
                      <View style={styles.comparisonArrow}>
                        <Text style={styles.arrowText}>→</Text>
                      </View>
                      
                      <View style={styles.comparisonColumn}>
                        <Text style={styles.comparisonLabel}>Correct:</Text>
                        <View style={[styles.comparisonBox, styles.correctComparisonBox]}>
                          <Text style={styles.correctAnswerText}>{currentWord.word}</Text>
                        </View>
                      </View>
                    </View>
                    
                    <View style={styles.letterComparisonContainer}>
                      <ScrollView 
                        horizontal 
                        showsHorizontalScrollIndicator={false} 
                        contentContainerStyle={styles.letterComparisonScroll}
                        style={{ flexGrow: 0 }}
                      >
                        {currentWord.word.split('').map((letter, index) => {
                          const userLetter = userInput[index]?.toLowerCase();
                          const isCorrectLetter = userLetter === letter.toLowerCase();
                          
                          return (
                            <View key={index} style={styles.letterComparisonItem}>
                              <View style={[
                                styles.letterComparisonBox,
                                isCorrectLetter ? styles.letterCorrectBox : styles.letterIncorrectBox,
                              ]}>
                                <Text style={[
                                  styles.letterComparisonText,
                                  isCorrectLetter ? styles.letterCorrectText : styles.letterIncorrectText,
                                ]}>
                                  {letter.toUpperCase()}
                                </Text>
                              </View>
                            </View>
                          );
                        })}
                      </ScrollView>
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

          {showFeedback && (
            <View style={styles.continueButtonContainer}>
              <Pressable 
                style={[styles.floatingContinueButton, isCorrect ? styles.floatingContinueSuccess : styles.floatingContinuePrimary]}
                onPress={handleContinue}
              >
                <Text style={styles.floatingContinueText}>Continue</Text>
              </Pressable>
            </View>
          )}

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
                    <Pressable
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
                    </Pressable>
                  );
                })}
                {rowIndex === 1 && <View style={styles.spacer} />}
                {rowIndex === 2 && <View style={styles.spacer} />}
              </View>
            ))}
            <View style={styles.bottomActionsRow}>
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
                    <Pressable
                      onPress={handleBackspace}
                      disabled={backspaceDisabled}
                      style={styles.actionButtonWrapper}
                    >
                      <Animated.View
                        style={[
                          styles.duolingoButton,
                          styles.backspaceButton,
                          backspaceDisabled && styles.buttonDisabled,
                          {
                            transform: [{ scale: keyAnimations['backspace'] }],
                          },
                        ]}
                      >
                        <Delete size={24} color={Colors.text} strokeWidth={2.5} />
                      </Animated.View>
                    </Pressable>
                    <Pressable
                      onPress={handleSubmit}
                      disabled={submitDisabled}
                      style={[styles.actionButtonWrapper, styles.checkButtonWrapper]}
                    >
                      <Animated.View
                        style={[
                          styles.duolingoButton,
                          styles.checkButton,
                          submitDisabled && styles.checkButtonDisabled,
                          {
                            transform: [{ scale: keyAnimations['submit'] }],
                          },
                        ]}
                      >
                        <Text style={styles.checkButtonText}>CHECK</Text>
                      </Animated.View>
                    </Pressable>
                  </>
                );
              })()}
            </View>
          </View>
        </ScrollView>
        </KeyboardAvoidingView>
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
  masteryContainer: {
    position: 'absolute' as const,
    top: 0,
    right: 24,
    zIndex: 10,
  },
  masteryCircle: {
    backgroundColor: Colors.white,
    borderRadius: 30,
    paddingHorizontal: 12,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 2,
    borderColor: Colors.warning,
  },
  masteryText: {
    fontSize: 13,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  nodeProgressContainer: {
    alignItems: 'center',
  },
  nodeProgressLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '600' as const,
    marginBottom: 12,
  },
  nodesRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  nodeWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative' as const,
  },
  pulseRing: {
    position: 'absolute' as const,
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  node: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nodeCurrent: {
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  nodeCorrect: {
    backgroundColor: Colors.success,
  },
  nodeIncorrect: {
    backgroundColor: Colors.error,
  },
  scrollContent: {
    flex: 1,
  },
  scrollContentContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  wordContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
    minHeight: 200,
  },
  feedbackContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 24,
  },
  feedbackBadge: {
    width: 110,
    height: 110,
    borderRadius: 55,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: 'rgba(0, 0, 0, 0.2)',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 8,
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
    gap: 4,
    marginBottom: 16,
    paddingHorizontal: 12,
    flexWrap: 'nowrap',
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
    fontSize: 36,
    fontWeight: '700' as const,
    marginBottom: 20,
  },
  correctText: {
    color: Colors.success,
  },
  incorrectText: {
    color: Colors.error,
  },
  comparisonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginTop: 12,
    marginBottom: 16,
  },
  comparisonColumn: {
    alignItems: 'center',
  },
  comparisonLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 6,
    fontWeight: '600' as const,
    textTransform: 'uppercase' as const,
  },
  comparisonBox: {
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    minWidth: 100,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.error,
  },
  correctComparisonBox: {
    backgroundColor: Colors.success + '20',
    borderColor: Colors.success,
  },
  incorrectAnswerText: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: Colors.error,
  },
  correctAnswerText: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: Colors.success,
  },
  comparisonArrow: {
    marginHorizontal: 4,
  },
  arrowText: {
    fontSize: 24,
    color: Colors.textSecondary,
  },
  letterComparisonContainer: {
    marginBottom: 16,
    width: '100%',
    alignItems: 'center',
  },
  letterComparisonScroll: {
    paddingHorizontal: 24,
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  letterComparisonItem: {
    alignItems: 'center',
  },
  letterComparisonBox: {
    width: 40,
    height: 48,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  letterCorrectBox: {
    backgroundColor: Colors.success + '20',
    borderColor: Colors.success,
  },
  letterIncorrectBox: {
    backgroundColor: Colors.error + '20',
    borderColor: Colors.error,
  },
  letterComparisonText: {
    fontSize: 20,
    fontWeight: '700' as const,
  },
  letterCorrectText: {
    color: Colors.success,
  },
  letterIncorrectText: {
    color: Colors.error,
  },
  xpBadge: {
    position: 'absolute' as const,
    top: -30,
    backgroundColor: Colors.success,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    shadowColor: Colors.success,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  xpText: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.white,
  },
  tipContainer: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginTop: 12,
    maxWidth: '90%',
    borderWidth: 2,
    borderColor: Colors.warning,
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
  continueButtonContainer: {
    paddingHorizontal: 0,
    paddingVertical: 16,
    paddingBottom: 24,
  },
  floatingContinueButton: {
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 48,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'rgba(0, 0, 0, 0.3)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  floatingContinueSuccess: {
    backgroundColor: Colors.success,
  },
  floatingContinuePrimary: {
    backgroundColor: Colors.primary,
  },
  floatingContinueText: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.white,
    letterSpacing: 0.5,
  },
  keyboardContainer: {
    paddingBottom: 8,
    gap: 8,
  },
  keyboardRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    minHeight: 48,
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
  bottomActionsRow: {
    flexDirection: 'row',
    gap: 12,
    paddingTop: 16,
  },
  actionButtonWrapper: {
    flex: 1,
  },
  checkButtonWrapper: {
    flex: 1.2,
  },
  duolingoButton: {
    height: 60,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 4,
  },
  backspaceButton: {
    backgroundColor: Colors.white,
    borderColor: '#D0D5DD',
    borderWidth: 2,
    borderBottomWidth: 4,
  },
  checkButton: {
    backgroundColor: Colors.primary,
    borderColor: '#B94939',
    shadowColor: 'rgba(217, 92, 74, 0.5)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  checkButtonDisabled: {
    backgroundColor: '#E5E5E5',
    borderColor: '#CCCCCC',
    opacity: 0.6,
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  checkButtonText: {
    fontSize: 18,
    fontWeight: '800' as const,
    color: Colors.white,
    letterSpacing: 1,
    textTransform: 'uppercase' as const,
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
