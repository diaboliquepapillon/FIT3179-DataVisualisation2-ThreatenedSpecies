import { useEffect, useState, useCallback, useRef } from 'react';

interface SoundEffects {
  playBirdChirp: () => void;
  playForestAmbience: () => void;
  playOceanWaves: () => void;
  playAchievement: () => void;
  stopAll: () => void;
  isMuted: boolean;
  toggleMute: () => void;
}

export const useSoundEffects = (): SoundEffects => {
  const [isMuted, setIsMuted] = useState(() => {
    const saved = localStorage.getItem('soundsMuted');
    return saved === 'true';
  });

  const sounds = useRef<Record<string, HTMLAudioElement>>({});
  const lastPlayedRef = useRef<Record<string, number>>({});
  const throttleMs = 2000; // Minimum time between same sound plays

  useEffect(() => {
    // Initialize audio elements
    const baseUrl = import.meta.env.BASE_URL;
    
    sounds.current = {
      birdChirp: new Audio(`${baseUrl}sounds/bird-chirp.mp3`),
      forestAmbience: new Audio(`${baseUrl}sounds/forest-ambience.mp3`),
      oceanWaves: new Audio(`${baseUrl}sounds/ocean-waves.mp3`),
      achievement: new Audio(`${baseUrl}sounds/achievement.mp3`),
    };

    // Set volume and preload
    Object.values(sounds.current).forEach((audio) => {
      audio.volume = 0.3;
      audio.preload = 'auto';
    });

    // Set ambient sounds to loop
    if (sounds.current.forestAmbience) sounds.current.forestAmbience.loop = true;
    if (sounds.current.oceanWaves) sounds.current.oceanWaves.loop = true;

    return () => {
      // Cleanup
      Object.values(sounds.current).forEach((audio) => {
        audio.pause();
        audio.src = '';
      });
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('soundsMuted', String(isMuted));
  }, [isMuted]);

  const playSound = useCallback((soundKey: string) => {
    if (isMuted || !sounds.current[soundKey]) return;

    const now = Date.now();
    const lastPlayed = lastPlayedRef.current[soundKey] || 0;

    // Throttle to prevent spam
    if (now - lastPlayed < throttleMs) return;

    lastPlayedRef.current[soundKey] = now;

    const audio = sounds.current[soundKey];
    audio.currentTime = 0;
    audio.play().catch((error) => {
      // Silently fail if audio can't play (e.g., user hasn't interacted yet)
      console.debug('Audio play failed:', error);
    });
  }, [isMuted]);

  const playBirdChirp = useCallback(() => playSound('birdChirp'), [playSound]);
  const playForestAmbience = useCallback(() => playSound('forestAmbience'), [playSound]);
  const playOceanWaves = useCallback(() => playSound('oceanWaves'), [playSound]);
  const playAchievement = useCallback(() => playSound('achievement'), [playSound]);

  const stopAll = useCallback(() => {
    Object.values(sounds.current).forEach((audio) => {
      audio.pause();
      audio.currentTime = 0;
    });
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
    if (!isMuted) {
      stopAll();
    }
  }, [isMuted, stopAll]);

  return {
    playBirdChirp,
    playForestAmbience,
    playOceanWaves,
    playAchievement,
    stopAll,
    isMuted,
    toggleMute,
  };
};

