export type ThemeType = 'warmParchment' | 'oceanBlue' | 'forestGreen' | 'sunsetOrange' | 'purpleDream' | 'cherryBlossom';

export type ColorTheme = {
  name: string;
  background: string;
  backgroundSecondary: string;
  primary: string;
  primaryDark: string;
  border: string;
};

export const THEMES: Record<ThemeType, ColorTheme> = {
  warmParchment: {
    name: 'Warm Parchment',
    background: '#F7F4ED',
    backgroundSecondary: '#EDE9E0',
    primary: '#D95C4A',
    primaryDark: '#C54A38',
    border: '#E0DCD3',
  },
  oceanBlue: {
    name: 'Ocean Blue',
    background: '#E8F4F8',
    backgroundSecondary: '#D8E9EE',
    primary: '#2196F3',
    primaryDark: '#1976D2',
    border: '#D0E5EB',
  },
  forestGreen: {
    name: 'Forest Green',
    background: '#E8F5E9',
    backgroundSecondary: '#D8EBD9',
    primary: '#4CAF50',
    primaryDark: '#388E3C',
    border: '#CFE5D0',
  },
  sunsetOrange: {
    name: 'Sunset Orange',
    background: '#FFF3E0',
    backgroundSecondary: '#FFE9CD',
    primary: '#FF9800',
    primaryDark: '#F57C00',
    border: '#FFE4C4',
  },
  purpleDream: {
    name: 'Purple Dream',
    background: '#F3E5F5',
    backgroundSecondary: '#E8D4EB',
    primary: '#9C27B0',
    primaryDark: '#7B1FA2',
    border: '#E1CCEA',
  },
  cherryBlossom: {
    name: 'Cherry Blossom',
    background: '#FCE4EC',
    backgroundSecondary: '#F8D0DC',
    primary: '#E91E63',
    primaryDark: '#C2185B',
    border: '#F5C9D7',
  },
};

export type AccentColor = '#D95C4A' | '#FF9800' | '#FFC107' | '#4CAF50' | '#2196F3' | '#9C27B0' | '#E91E63';

export const ACCENT_COLORS: { name: string; color: AccentColor }[] = [
  { name: 'Red', color: '#D95C4A' },
  { name: 'Orange', color: '#FF9800' },
  { name: 'Yellow', color: '#FFC107' },
  { name: 'Green', color: '#4CAF50' },
  { name: 'Blue', color: '#2196F3' },
  { name: 'Purple', color: '#9C27B0' },
  { name: 'Pink', color: '#E91E63' },
];

let currentTheme: ThemeType = 'warmParchment';
let currentAccentColor: AccentColor | null = null;

const createColors = (theme: ThemeType, accentColor?: AccentColor | null) => {
  const themeColors = THEMES[theme];
  const primary = accentColor || themeColors.primary;
  const primaryDark = accentColor ? adjustColorBrightness(accentColor, -20) : themeColors.primaryDark;

  return {
    primary,
    primaryDark,
    secondary: '#6B7A99',
    success: '#7FD99A',
    warning: '#F5A962',
    error: '#E76F51',
    background: themeColors.background,
    backgroundSecondary: themeColors.backgroundSecondary,
    text: '#2C3E50',
    textSecondary: '#6B7A99',
    textLight: '#95A5B8',
    border: themeColors.border,
    white: '#FFFFFF',
    black: '#1A1D1D',
    
    courses: {
      blue: '#5B9FED',
      pink: '#F178B6',
      orange: '#F5A962',
      purple: '#9B6FED',
      green: '#7FD99A',
      yellow: '#F5D962',
      red: '#ED6F7F',
      teal: '#62D9D9',
    },
    
    gradient: {
      primary: [primary, adjustColorBrightness(primary, 15)],
      success: ['#7FD99A', '#9FE5B5'],
      warning: ['#F5A962', '#F7C07E'],
      secondary: ['#6B7A99', '#8B9AB5'],
      blue: ['#4A8DD9', '#5B9FED'],
      pink: ['#F178B6', '#F598CC'],
      orange: ['#F5A962', '#F7C07E'],
      purple: ['#9B6FED', '#B58FF5'],
      green: ['#7FD99A', '#9FE5B5'],
    },
  };
};

function adjustColorBrightness(color: string, percent: number): string {
  const num = parseInt(color.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = ((num >> 8) & 0x00ff) + amt;
  const B = (num & 0x0000ff) + amt;
  return (
    '#' +
    (
      0x1000000 +
      (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
      (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
      (B < 255 ? (B < 1 ? 0 : B) : 255)
    )
      .toString(16)
      .slice(1)
      .toUpperCase()
  );
}

let Colors = createColors(currentTheme, currentAccentColor);

export const updateTheme = (theme: ThemeType, accentColor?: AccentColor | null) => {
  currentTheme = theme;
  currentAccentColor = accentColor || null;
  Colors = createColors(theme, currentAccentColor);
  return Colors;
};

export const getCurrentTheme = () => currentTheme;
export const getCurrentAccentColor = () => currentAccentColor;

export default Colors;
