import { Audio } from 'expo-av';

export type SoundType = 'tap' | 'success' | 'error' | 'levelup' | 'achievement';

type SoundCache = {
  [key in SoundType]?: Audio.Sound;
};

const soundCache: SoundCache = {};

export const loadSounds = async () => {
  try {
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
    });

    console.log('🔊 Sound manager initialized (audio files will be added later)');
  } catch (error) {
    console.error('Error loading sounds:', error);
  }
};

export const playSound = async (type: SoundType, soundEnabled: boolean) => {
  if (!soundEnabled) return;

  console.log('🔊 Playing sound:', type);

  try {
    if (soundCache[type]) {
      await soundCache[type]!.replayAsync();
    }
  } catch (error) {
    console.error(`Error playing sound ${type}:`, error);
  }
};

export const unloadSounds = async () => {
  try {
    for (const sound of Object.values(soundCache)) {
      if (sound) {
        await sound.unloadAsync();
      }
    }
    console.log('🔊 Sounds unloaded');
  } catch (error) {
    console.error('Error unloading sounds:', error);
  }
};
