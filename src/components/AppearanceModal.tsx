import React from 'react';
import { useJarvisTheme, THEME_PRESETS, PresetThemeName, ThemeColors } from '../theme/ThemeContext';
import { soundEffects } from '../services/soundEffects';
import {
  Palette,
  Eye,
  Sparkles,
  Zap,
  Sliders,
  RotateCcw,
  X,
  Check,
  Cpu,
  Monitor,
} from 'lucide-react';

import { JARVIS_VOICE_OPTIONS } from '../utils/audioUtils';
import { Volume2, Volume1 } from 'lucide-react';

interface AppearanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentVoice?: string;
  onSelectVoice?: (voice: string) => void;
  onTestVoice?: (voice: string) => void;
}

export const AppearanceModal: React.FC<AppearanceModalProps> = ({
  isOpen,
  onClose,
  currentVoice = 'Fenrir',
  onSelectVoice,
  onTestVoice,
}) => {
  const { currentTheme, colors, setTheme, updateColor, resetToDefaults } = useJarvisTheme();

  if (!isOpen) return null;

  const handleHexChange = (key: keyof ThemeColors, hex: string) => {
    if (/^#[0-9A-Fa-f]{0,6}$/.test(hex)) {
      if (hex.length === 7) {
        soundEffects.playHudClick();
      }
      updateColor(key, hex as any);
    }
  };

  const presetList = Object.entries(THEME_PRESETS) as [PresetThemeName, typeof THEME_PRESETS[PresetThemeName]][];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div
        className="hud-glass rounded-3xl p-6 md:p-8 border w-full max-w-3xl space-y-6 shadow-2xl animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto"
        style={{
          borderColor: colors.panelBorder,
          backgroundColor: colors.panelBg,
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: colors.panelBorder }}>
          <div className="flex items-center gap-3">
            <div
              className="p-3 rounded-2xl border shadow-lg"
              style={{
                backgroundColor: `${colors.primary}20`,
                borderColor: colors.primary,
                color: colors.primary,
              }}
            >
              <Palette className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-hud font-bold text-lg md:text-xl flex items-center gap-2" style={{ color: colors.primary }}>
                Aparência & Personalização Visual do JARVIS
              </h2>
              <p className="text-xs font-mono-tech mt-0.5" style={{ color: colors.textMuted }}>
                Ajuste em tempo real as cores da interface, olhos do avatar, brilho holográfico e modo de alto desempenho
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. Presets */}
        <div className="space-y-3">
          <label className="text-xs font-hud font-bold uppercase tracking-wider block" style={{ color: colors.primary }}>
            1. Temas Predefinidos (1 Clique)
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {presetList.map(([key, preset]) => {
              const isSelected = currentTheme === key;
              return (
                <button
                  key={key}
                  onClick={() => {
                    soundEffects.playConfirm();
                    setTheme(key);
                  }}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected ? 'ring-2 ring-cyan-400 shadow-md scale-102' : 'hover:bg-slate-800/40'
                  }`}
                  style={{
                    backgroundColor: isSelected ? `${preset.colors.primary}25` : 'rgba(15, 23, 42, 0.6)',
                    borderColor: isSelected ? preset.colors.primary : 'rgba(255, 255, 255, 0.12)',
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-hud font-bold text-xs" style={{ color: preset.colors.primary }}>
                      {preset.name.split(' (')[0]}
                    </span>
                    {isSelected && <Check className="w-3.5 h-3.5" style={{ color: preset.colors.primary }} />}
                  </div>
                  {/* Color dots preview */}
                  <div className="flex items-center gap-1.5">
                    <span className="w-3.5 h-3.5 rounded-full border border-white/40 shadow-sm" style={{ backgroundColor: preset.colors.primary }} />
                    <span className="w-3.5 h-3.5 rounded-full border border-white/40 shadow-sm" style={{ backgroundColor: preset.colors.avatarEyes }} />
                    <span className="w-3.5 h-3.5 rounded-full border border-white/40 shadow-sm" style={{ backgroundColor: preset.colors.accent }} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Custom Color Pickers */}
        <div className="space-y-3 pt-2 border-t" style={{ borderColor: colors.panelBorder }}>
          <label className="text-xs font-hud font-bold uppercase tracking-wider block" style={{ color: colors.primary }}>
            2. Personalização Fina de Cores (Hex & Color Picker)
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { key: 'primary' as const, label: 'Cor Principal do Sistema', value: colors.primary, icon: Sparkles },
              { key: 'avatarEyes' as const, label: 'Cor dos Olhos do Avatar', value: colors.avatarEyes, icon: Eye },
              { key: 'avatarFace' as const, label: 'Malha Facial do Avatar', value: colors.avatarFace, icon: Cpu },
              { key: 'accent' as const, label: 'Cor de Destaque / Botões', value: colors.accent, icon: Zap },
              { key: 'glow' as const, label: 'Brilho Holográfico & Halos', value: colors.glow, icon: Sparkles },
              { key: 'background' as const, label: 'Fundo do Universo / Canvas', value: colors.background, icon: Monitor },
            ].map((item) => (
              <div
                key={item.key}
                className="p-3 rounded-xl border flex items-center justify-between gap-2.5 bg-slate-900/60"
                style={{ borderColor: colors.panelBorder }}
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <item.icon className="w-4 h-4 shrink-0" style={{ color: item.value }} />
                  <div className="truncate">
                    <div className="text-[11px] font-mono-tech text-slate-300 font-semibold truncate">
                      {item.label}
                    </div>
                    <input
                      type="text"
                      value={item.value}
                      onChange={(e) => handleHexChange(item.key, e.target.value)}
                      className="text-[10px] font-mono-tech bg-transparent text-slate-400 focus:outline-none focus:text-cyan-300 uppercase w-20"
                    />
                  </div>
                </div>

                {/* Color input swatch */}
                <div className="relative shrink-0">
                  <input
                    type="color"
                    value={item.value}
                    onChange={(e) => updateColor(item.key, e.target.value)}
                    className="w-8 h-8 rounded-lg cursor-pointer border-2 border-white/30 bg-transparent"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Advanced Sliders & Performance Mode */}
        <div className="space-y-4 pt-2 border-t" style={{ borderColor: colors.panelBorder }}>
          <label className="text-xs font-hud font-bold uppercase tracking-wider block" style={{ color: colors.primary }}>
            3. Ajustes Avançados & Desempenho
          </label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Intensity slider */}
            <div className="p-3.5 rounded-xl border bg-slate-900/50 space-y-2" style={{ borderColor: colors.panelBorder }}>
              <div className="flex items-center justify-between text-xs font-mono-tech">
                <span className="text-slate-300">Intensidade do Brilho Holográfico:</span>
                <span style={{ color: colors.primary }} className="font-bold">
                  {Math.round(colors.glowIntensity * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0.2"
                max="1.5"
                step="0.05"
                value={colors.glowIntensity}
                onChange={(e) => updateColor('glowIntensity', Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
            </div>

            {/* Panel Opacity slider */}
            <div className="p-3.5 rounded-xl border bg-slate-900/50 space-y-2" style={{ borderColor: colors.panelBorder }}>
              <div className="flex items-center justify-between text-xs font-mono-tech">
                <span className="text-slate-300">Opacidade dos Painéis HUD:</span>
                <span style={{ color: colors.primary }} className="font-bold">
                  {Math.round(colors.panelOpacity * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0.4"
                max="0.95"
                step="0.05"
                value={colors.panelOpacity}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  updateColor('panelOpacity', val);
                  updateColor('panelBg', `rgba(7, 14, 30, ${val})`);
                }}
                className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
            </div>
          </div>

          {/* High Performance Mode Switch for Windows 11 / RX 580 */}
          <div
            className="p-4 rounded-2xl border flex items-center justify-between gap-4"
            style={{
              backgroundColor: colors.highPerformanceMode ? `${colors.primary}15` : 'rgba(15, 23, 42, 0.6)',
              borderColor: colors.highPerformanceMode ? colors.primary : colors.panelBorder,
            }}
          >
            <div>
              <div className="flex items-center gap-2 text-xs font-hud font-bold" style={{ color: colors.primary }}>
                <Cpu className="w-4 h-4" />
                Modo de Alto Desempenho (Radeon RX 580 / 8 GB RAM)
              </div>
              <p className="text-[11px] font-sans text-slate-400 mt-0.5">
                Reduz sombras pesadas e contagem de partículas para garantir 60 FPS contínuos, mantendo o rastreamento ocular do mouse e todas as funções ativas.
              </p>
            </div>

            <button
              onClick={() => {
                soundEffects.playToggle(!colors.highPerformanceMode);
                updateColor('highPerformanceMode', !colors.highPerformanceMode);
              }}
              className={`px-4 py-2 rounded-xl font-hud font-bold text-xs cursor-pointer transition-all shrink-0 ${
                colors.highPerformanceMode
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'bg-slate-800 text-slate-400 border border-slate-700'
              }`}
            >
              {colors.highPerformanceMode ? 'ATIVADO (60 FPS)' : 'DESATIVADO'}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t flex items-center justify-between" style={{ borderColor: colors.panelBorder }}>
          <button
            onClick={() => {
              soundEffects.playConfirm();
              resetToDefaults();
            }}
            className="px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 font-hud text-xs flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restaurar Padrões</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl font-hud font-bold text-xs cursor-pointer shadow-lg transition-transform hover:scale-105"
            style={{
              backgroundColor: colors.primary,
              color: '#030712',
            }}
          >
            Concluir & Aplicar
          </button>
        </div>
      </div>
    </div>
  );
};
