// Sound utility functions with persistent settings

const SOUND_ENABLED_KEY = 'raiku-sound-enabled';

export function isSoundEnabled(): boolean {
  if (typeof window === 'undefined') return true;
  const stored = localStorage.getItem(SOUND_ENABLED_KEY);
  return stored === null ? true : stored === 'true';
}

export function setSoundEnabled(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SOUND_ENABLED_KEY, String(enabled));
}

export function playSound(soundFile: string): void {
  if (!isSoundEnabled()) return;
  
  try {
    const audio = new Audio(soundFile);
    audio.volume = 0.5;
    audio.play().catch(err => {
      console.log('Audio play failed:', err);
    });
  } catch (err) {
    console.log('Audio error:', err);
  }
}

// Game-specific sound functions
export function playEndGameSound(score: number): void {
  if (!isSoundEnabled()) return;
  
  if (score >= 5000) {
    playSound('/sounds/great-chad.mp3');
  } else if (score >= 3000) {
    playSound('/sounds/keep-it-up.mp3');
  } else if (score >= 1000) {
    playSound('/sounds/try-harder.mp3');
  }
  if (score<= 1000) {
    playSound( 'sounds/you-are-a-farmer.mp3');
  }
  
}

export function playClickSound(): void {
  playSound('/sounds/click.mp3');
}

export function playBombSound(): void {
  playSound('/sounds/bomb.mp3');
}

let backgroundAudio: HTMLAudioElement | null = null

export function startBackgroundMusic() {
  if (!isSoundEnabled()) return

  if (!backgroundAudio) {
    backgroundAudio = new Audio("/sounds/background.mp3")
    backgroundAudio.loop = true
    backgroundAudio.volume = 0.4
  }

  backgroundAudio.currentTime = 0
  backgroundAudio.play().catch(() => {})
}

export function stopBackgroundMusic() {
  if (backgroundAudio) {
    backgroundAudio.pause()
    backgroundAudio.currentTime = 0
  }
}

