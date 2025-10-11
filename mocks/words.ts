export type Word = {
  id: string;
  word: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  hint?: string;
};

export const mockWords: Word[] = [
  { id: '1', word: 'necessary', difficulty: 'medium', category: 'Common', hint: 'One collar, two sleeves' },
  { id: '2', word: 'accommodate', difficulty: 'hard', category: 'Common', hint: 'Two c\'s, two m\'s' },
  { id: '3', word: 'separate', difficulty: 'medium', category: 'Common', hint: 'There\'s a rat in separate' },
  { id: '4', word: 'definitely', difficulty: 'medium', category: 'Common', hint: 'Finite is in definitely' },
  { id: '5', word: 'occurrence', difficulty: 'hard', category: 'Common', hint: 'Two c\'s, two r\'s' },
  { id: '6', word: 'receive', difficulty: 'medium', category: 'Common', hint: 'I before E except after C' },
  { id: '7', word: 'believe', difficulty: 'easy', category: 'Common', hint: 'Never believe a lie' },
  { id: '8', word: 'achieve', difficulty: 'easy', category: 'Common', hint: 'I before E' },
  { id: '9', word: 'conscience', difficulty: 'hard', category: 'Common', hint: 'Science with a con' },
  { id: '10', word: 'embarrass', difficulty: 'medium', category: 'Common', hint: 'Two r\'s, two s\'s' },
  { id: '11', word: 'rhythm', difficulty: 'hard', category: 'Tricky', hint: 'Rhythm Helps Your Two Hips Move' },
  { id: '12', word: 'beautiful', difficulty: 'easy', category: 'Common', hint: 'Big Elephants Are Ugly' },
  { id: '13', word: 'tomorrow', difficulty: 'easy', category: 'Common', hint: 'One M, two R\'s' },
  { id: '14', word: 'beginning', difficulty: 'medium', category: 'Common', hint: 'Double N in the middle' },
  { id: '15', word: 'restaurant', difficulty: 'medium', category: 'Common', hint: 'Rest at a restaurant' },
];

export type ProgressData = {
  date: string;
  xp: number;
  accuracy: number;
};

export const mockProgressData: ProgressData[] = [
  { date: '2025-10-05', xp: 120, accuracy: 85 },
  { date: '2025-10-06', xp: 150, accuracy: 88 },
  { date: '2025-10-07', xp: 180, accuracy: 92 },
  { date: '2025-10-08', xp: 200, accuracy: 90 },
  { date: '2025-10-09', xp: 250, accuracy: 95 },
  { date: '2025-10-10', xp: 280, accuracy: 93 },
  { date: '2025-10-11', xp: 320, accuracy: 96 },
];
