import React, { createContext, useContext, useState, useEffect } from 'react';

export interface ThemeColors {
  primary: string;       // Main cyan / brand color
  secondary: string;     // Support accent color
  accent: string;        // Interactive button / indicator color
  glow: string;          // Holographic halo & particles
  avatarFace: string;    // Humanoid avatar facial mesh & wireframe
  avatarEyes: string;    // Humanoid avatar iris & pupil glow
  text: string;          // Primary text color
  textMuted: string;     // Muted secondary text
  background: string;    // Deep space background
  panelBg: string;       // Floating HUD cards background
  panelBorder: string;   // Glassmorphic border lines
  panelOpacity: number;  // 0.2 to 0.95
  glowIntensity: number; // 0.2 to 1.5
  particleDensity: number; // 20 to 120
  highPerformanceMode: boolean; // optimize for RX 580 / 8GB RAM
}

export type PresetThemeName =
  | 'jarvis_classic'
  | 'neon_purple'
  | 'emerald_ai'
  | 'arctic_white'
  | 'cyber_red'
  | 'solar_gold'
  | 'ocean_blue'
  | 'custom';

export const THEME_PRESETS: Record<PresetThemeName, { name: string; colors: ThemeColors }> = {
  jarvis_classic: {
    name: 'Jarvis Classic',
    colors: {
      primary: '#00d9ff',
      secondary: '#38bdf8',
      accent: '#06b6d4',
      glow: '#00d9ff',
      avatarFace: '#38bdf8',
      avatarEyes: '#00f0ff',
      text: '#f1f5f9',
      textMuted: '#94a3b8',
      background: '#030712',
      panelBg: 'rgba(7, 14, 30, 0.78)',
      panelBorder: 'rgba(56, 189, 248, 0.25)',
      panelOpacity: 0.8,
      glowIntensity: 1.0,
      particleDensity: 60,
      highPerformanceMode: false,
    },
  },
  neon_purple: {
    name: 'Neon Purple (Claude / Synth)',
    colors: {
      primary: '#a855f7',
      secondary: '#c084fc',
      accent: '#ec4899',
      glow: '#a855f7',
      avatarFace: '#c084fc',
      avatarEyes: '#f472b6',
      text: '#faf5ff',
      textMuted: '#cbd5e1',
      background: '#090514',
      panelBg: 'rgba(18, 9, 36, 0.82)',
      panelBorder: 'rgba(168, 85, 247, 0.28)',
      panelOpacity: 0.82,
      glowIntensity: 1.1,
      particleDensity: 60,
      highPerformanceMode: false,
    },
  },
  emerald_ai: {
    name: 'Emerald AI (Matrix / Defense)',
    colors: {
      primary: '#10b981',
      secondary: '#34d399',
      accent: '#059669',
      glow: '#10b981',
      avatarFace: '#34d399',
      avatarEyes: '#6ee7b7',
      text: '#f0fdf4',
      textMuted: '#94a3b8',
      background: '#02120a',
      panelBg: 'rgba(3, 25, 15, 0.82)',
      panelBorder: 'rgba(16, 185, 129, 0.28)',
      panelOpacity: 0.82,
      glowIntensity: 1.0,
      particleDensity: 50,
      highPerformanceMode: false,
    },
  },
  arctic_white: {
    name: 'Arctic White (Minimal Clean)',
    colors: {
      primary: '#38bdf8',
      secondary: '#94a3b8',
      accent: '#0284c7',
      glow: '#e0f2fe',
      avatarFace: '#cbd5e1',
      avatarEyes: '#38bdf8',
      text: '#f8fafc',
      textMuted: '#94a3b8',
      background: '#050914',
      panelBg: 'rgba(15, 23, 42, 0.85)',
      panelBorder: 'rgba(226, 232, 240, 0.2)',
      panelOpacity: 0.85,
      glowIntensity: 0.8,
      particleDensity: 40,
      highPerformanceMode: false,
    },
  },
  cyber_red: {
    name: 'Cyber Red (Tactical / Defcon)',
    colors: {
      primary: '#ef4444',
      secondary: '#f87171',
      accent: '#b91c1c',
      glow: '#ef4444',
      avatarFace: '#f87171',
      avatarEyes: '#fca5a5',
      text: '#fef2f2',
      textMuted: '#cbd5e1',
      background: '#0d0404',
      panelBg: 'rgba(28, 8, 8, 0.85)',
      panelBorder: 'rgba(239, 68, 68, 0.3)',
      panelOpacity: 0.85,
      glowIntensity: 1.1,
      particleDensity: 50,
      highPerformanceMode: false,
    },
  },
  solar_gold: {
    name: 'Solar Gold (Executive Intel)',
    colors: {
      primary: '#f59e0b',
      secondary: '#fbbf24',
      accent: '#d97706',
      glow: '#f59e0b',
      avatarFace: '#fbbf24',
      avatarEyes: '#fde68a',
      text: '#fffbeb',
      textMuted: '#cbd5e1',
      background: '#0f0a02',
      panelBg: 'rgba(26, 18, 5, 0.84)',
      panelBorder: 'rgba(245, 158, 11, 0.3)',
      panelOpacity: 0.84,
      glowIntensity: 1.0,
      particleDensity: 50,
      highPerformanceMode: false,
    },
  },
  ocean_blue: {
    name: 'Ocean Blue (Naval Deep Intelligence)',
    colors: {
      primary: '#0284c7',
      secondary: '#38bdf8',
      accent: '#0369a1',
      glow: '#0ea5e9',
      avatarFace: '#38bdf8',
      avatarEyes: '#7dd3fc',
      text: '#f0f9ff',
      textMuted: '#94a3b8',
      background: '#020b18',
      panelBg: 'rgba(4, 18, 38, 0.85)',
      panelBorder: 'rgba(2, 132, 199, 0.3)',
      panelOpacity: 0.85,
      glowIntensity: 0.95,
      particleDensity: 55,
      highPerformanceMode: false,
    },
  },
  custom: {
    name: 'Personalizado',
    colors: {
      primary: '#00d9ff',
      secondary: '#38bdf8',
      accent: '#06b6d4',
      glow: '#00d9ff',
      avatarFace: '#38bdf8',
      avatarEyes: '#00f0ff',
      text: '#f1f5f9',
      textMuted: '#94a3b8',
      background: '#030712',
      panelBg: 'rgba(7, 14, 30, 0.78)',
      panelBorder: 'rgba(56, 189, 248, 0.25)',
      panelOpacity: 0.8,
      glowIntensity: 1.0,
      particleDensity: 60,
      highPerformanceMode: false,
    },
  },
};

interface ThemeContextType {
  currentTheme: PresetThemeName;
  colors: ThemeColors;
  setTheme: (themeName: PresetThemeName) => void;
  updateColor: <K extends keyof ThemeColors>(key: K, value: ThemeColors[K]) => void;
  resetToDefaults: () => void;
}

const STORAGE_KEY = 'jarvis_custom_theme_v2';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<PresetThemeName>('jarvis_classic');
  const [colors, setColors] = useState<ThemeColors>(THEME_PRESETS.jarvis_classic.colors);

  // Load from localStorage on initialization
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.theme && THEME_PRESETS[parsed.theme as PresetThemeName]) {
          setCurrentTheme(parsed.theme);
        }
        if (parsed.colors) {
          setColors({ ...THEME_PRESETS.jarvis_classic.colors, ...parsed.colors });
        }
      }
    } catch (e) {
      console.warn('Erro ao carregar tema do localStorage:', e);
    }
  }, []);

  // Sync CSS variables to root element in real-time
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--jarvis-primary', colors.primary);
    root.style.setProperty('--jarvis-secondary', colors.secondary);
    root.style.setProperty('--jarvis-accent', colors.accent);
    root.style.setProperty('--jarvis-glow', colors.glow);
    root.style.setProperty('--jarvis-avatar', colors.avatarFace);
    root.style.setProperty('--jarvis-eyes', colors.avatarEyes);
    root.style.setProperty('--jarvis-text', colors.text);
    root.style.setProperty('--jarvis-text-muted', colors.textMuted);
    root.style.setProperty('--jarvis-background', colors.background);
    root.style.setProperty('--jarvis-panel', colors.panelBg);
    root.style.setProperty('--jarvis-panel-border', colors.panelBorder);
    root.style.setProperty('--jarvis-glow-intensity', String(colors.glowIntensity));

    // Save to localStorage
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          theme: currentTheme,
          colors,
        })
      );
    } catch (e) {
      // ignore
    }
  }, [colors, currentTheme]);

  const setTheme = (themeName: PresetThemeName) => {
    setCurrentTheme(themeName);
    setColors(THEME_PRESETS[themeName].colors);
  };

  const updateColor = <K extends keyof ThemeColors>(key: K, value: ThemeColors[K]) => {
    setCurrentTheme('custom');
    setColors(prev => ({ ...prev, [key]: value }));
  };

  const resetToDefaults = () => {
    setTheme('jarvis_classic');
  };

  return (
    <ThemeContext.Provider
      value={{
        currentTheme,
        colors,
        setTheme,
        updateColor,
        resetToDefaults,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useJarvisTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useJarvisTheme deve ser usado dentro de um ThemeProvider');
  }
  return context;
};
