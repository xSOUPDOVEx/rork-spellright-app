export type Word = {
  id: string;
  word: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  hint?: string;
  phonetics?: string;
};

export const mockWords: Word[] = [
  {
    id: '1',
    word: 'apple',
    difficulty: 'easy',
    category: 'Food',
    hint: 'A red or green fruit',
    phonetics: '/ˈæp.əl/',
  },
  {
    id: '2',
    word: 'banana',
    difficulty: 'easy',
    category: 'Food',
    hint: 'A yellow curved fruit',
    phonetics: '/bəˈnæn.ə/',
  },
  {
    id: '3',
    word: 'elephant',
    difficulty: 'easy',
    category: 'Animals',
    hint: 'A large animal with a trunk',
    phonetics: '/ˈel.ɪ.fənt/',
  },
  {
    id: '4',
    word: 'beautiful',
    difficulty: 'medium',
    category: 'Adjectives',
    hint: 'Pleasing to the eye',
    phonetics: '/ˈbjuː.tɪ.fəl/',
  },
  {
    id: '5',
    word: 'necessary',
    difficulty: 'medium',
    category: 'Adjectives',
    hint: 'Required or essential',
    phonetics: '/ˈnes.ə.ser.i/',
  },
  {
    id: '6',
    word: 'restaurant',
    difficulty: 'medium',
    category: 'Places',
    hint: 'A place where you eat meals',
    phonetics: '/ˈres.tər.ɑːnt/',
  },
  {
    id: '7',
    word: 'Wednesday',
    difficulty: 'medium',
    category: 'Days',
    hint: 'The middle day of the week',
    phonetics: '/ˈwenz.deɪ/',
  },
  {
    id: '8',
    word: 'accommodate',
    difficulty: 'hard',
    category: 'Verbs',
    hint: 'To provide lodging or make room for',
    phonetics: '/əˈkɒm.ə.deɪt/',
  },
  {
    id: '9',
    word: 'conscience',
    difficulty: 'hard',
    category: 'Abstract',
    hint: 'Your inner sense of right and wrong',
    phonetics: '/ˈkɒn.ʃəns/',
  },
  {
    id: '10',
    word: 'rhythm',
    difficulty: 'hard',
    category: 'Music',
    hint: 'A pattern of beats in music',
    phonetics: '/ˈrɪð.əm/',
  },
  {
    id: '11',
    word: 'definitely',
    difficulty: 'hard',
    category: 'Adverbs',
    hint: 'Without doubt or certainly',
    phonetics: '/ˈdef.ɪ.nət.li/',
  },
  {
    id: '12',
    word: 'separate',
    difficulty: 'medium',
    category: 'Verbs',
    hint: 'To divide or keep apart',
    phonetics: '/ˈsep.ər.eɪt/',
  },
];

export const mockProgressData = [
  {
    date: '2025-10-07',
    xp: 50,
    accuracy: 75,
  },
  {
    date: '2025-10-08',
    xp: 80,
    accuracy: 78,
  },
  {
    date: '2025-10-09',
    xp: 120,
    accuracy: 82,
  },
  {
    date: '2025-10-10',
    xp: 150,
    accuracy: 85,
  },
  {
    date: '2025-10-11',
    xp: 180,
    accuracy: 88,
  },
  {
    date: '2025-10-12',
    xp: 220,
    accuracy: 90,
  },
  {
    date: '2025-10-13',
    xp: 250,
    accuracy: 92,
  },
];
