import React, { useState, useEffect } from 'react';
import { ActiveTab, ProtocolType, JarvisActivityStatus } from '../types/jarvis';
import { useJarvisTheme } from '../theme/ThemeContext';
import {
  Globe,
  Terminal,
  Radio,
  Shield,
  Home,
  Calendar,
  Layers,
  Palette,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Activity,
  Cpu,
  Monitor,
} from 'lucide-react';

interface HeaderNavProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  isListening: boolean;
  onToggleListening: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  activeProtocol: ProtocolType;
  onOpenProtocolModal: () => void;
  onOpenInstallModal: () => void;
  onOpenAppearanceModal: () => void;
  status: JarvisActivityStatus;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  activeTab,
  onTabChange,
  isListening,
  onToggleListening,
  isMuted,
  onToggleMute,
  activeProtocol,
  onOpenProtocolModal,
  onOpenInstallModal,
  onOpenAppearanceModal,
  status,
}) => {
  const { colors, currentTheme } = useJarvisTheme();
  const [time, setTime] = useState('');
  const [dateStr, setDateStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
      setDateStr(
        now.toLocaleDateString('pt-BR', {
          weekday: 'short',
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }).toUpperCase()
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const getProtocolBadge = () => {
    switch (activeProtocol) {
      case 'lockdown':
        return {
          label: 'LOCKDOWN ATIVO',
          bg: 'bg-red-500/20 text-red-400 border-red-500/50',
          dot: 'bg-red-500 animate-ping',
        };
      case 'party_mode':
        return {
          label: 'MODO FESTA',
          bg: 'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/50',
          dot: 'bg-fuchsia-400',
        };
      case 'focus_lab':
        return {
          label: 'MODO FOCO / LAB',
          bg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50',
          dot: 'bg-cyan-400',
        };
      case 'night_owl':
        return {
          label: 'MODO NOTURNO',
          bg: 'bg-amber-500/20 text-amber-300 border-amber-500/50',
          dot: 'bg-amber-400',
        };
      default:
        return {
          label: 'SISTEMA NOMINAL',
          bg: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
          dot: 'bg-cyan-400',
        };
    }
  };

  const badge = getProtocolBadge();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-cyan-500/20 bg-slate-950/85 backdrop-blur-xl">
      {/* Top micro telemetry bar */}
      <div className="hidden lg:flex items-center justify-between px-6 py-1 bg-slate-950/90 border-b border-cyan-900/30 text-[11px] font-mono text-cyan-400/70">
        <div className="flex items-center gap-5">
          <span className="flex items-center gap-1.5 text-cyan-300 font-bold">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            JARVIS // OSIRIS.AI COWORK SUITE
          </span>
          <span className="text-slate-600">·</span>
          <span className="flex items-center gap-1 text-slate-400">
            <Cpu className="w-3 h-3 text-cyan-400" /> NÚCLEO AUTÔNOMO: 99.8%
          </span>
          <span className="text-slate-600">·</span>
          <span className="flex items-center gap-1 text-slate-400">
            <Activity className="w-3 h-3 text-emerald-400" /> LATÊNCIA: 18ms
          </span>
          <span className="text-slate-600">·</span>
          <span className="text-slate-400">
            TEMA: <span className="text-cyan-300 uppercase">{currentTheme.replace('_', ' ')}</span>
          </span>
        </div>

        <div className="flex items-center gap-4 text-cyan-300/80 font-mono">
          <span>{dateStr}</span>
          <span className="text-cyan-400 font-bold tracking-wider">{time}</span>
        </div>
      </div>

      {/* Main navigation bar */}
      <div className="px-4 lg:px-6 py-2.5 flex items-center justify-between gap-2">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/30 border border-cyan-400/40 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            <div className="w-3.5 h-3.5 rounded-full border border-cyan-300 animate-ping opacity-50 absolute" />
            <span className="font-mono text-base font-bold text-cyan-300">J</span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm md:text-base font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-200 to-blue-400">
                J.A.R.V.I.S.
              </span>
              <span className="hidden sm:inline-block text-[10px] px-1.5 py-0.2 rounded bg-cyan-950 border border-cyan-700/50 text-cyan-300 font-mono">
                OSIRIS
              </span>
            </div>
            <p className="hidden sm:block text-[10px] text-slate-400 font-mono tracking-wider">
              COWORK & INTELLIGENCE
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-cyan-500/20 text-xs">
          {/* Osiris 3D Globe */}
          <button
            onClick={() => onTabChange('osiris')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all font-mono font-medium ${
              activeTab === 'osiris'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Globo Osiris.ai</span>
            <span className="md:hidden">Osiris</span>
          </button>

          {/* Cowork Terminal */}
          <button
            onClick={() => onTabChange('cowork')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all font-mono font-medium ${
              activeTab === 'cowork'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Terminal Cowork</span>
            <span className="md:hidden">Terminal</span>
          </button>

          {/* Voice Auto-Directives */}
          <button
            onClick={() => onTabChange('directives')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all font-mono font-medium ${
              activeTab === 'directives'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Auto-Diretrizes</span>
            <span className="md:hidden">Diretrizes</span>
          </button>

          {/* OSINT Recon */}
          <button
            onClick={() => onTabChange('osint')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all font-mono font-medium ${
              activeTab === 'osint'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Radar OSINT</span>
            <span className="md:hidden">OSINT</span>
          </button>

          {/* Smart Home Devices */}
          <button
            onClick={() => onTabChange('devices')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all font-mono font-medium ${
              activeTab === 'devices'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Dispositivos</span>
          </button>

          {/* Agenda */}
          <button
            onClick={() => onTabChange('agenda')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all font-mono font-medium ${
              activeTab === 'agenda'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Agenda</span>
          </button>

          {/* Blueprints */}
          <button
            onClick={() => onTabChange('blueprints')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all font-mono font-medium ${
              activeTab === 'blueprints'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">CAD</span>
          </button>
        </nav>

        {/* Quick action controls */}
        <div className="flex items-center gap-2">
          {/* Visual Customization & Appearance Modal Trigger */}
          <button
            onClick={onOpenAppearanceModal}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-purple-500/40 bg-purple-500/10 hover:bg-purple-500/25 text-purple-300 text-xs font-mono transition-all cursor-pointer"
            title="Personalização Visual Completa (Temas, Cores e Desempenho)"
          >
            <Palette className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden xl:inline font-bold">Aparência</span>
          </button>

          {/* Install on PC button */}
          <button
            onClick={onOpenInstallModal}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-cyan-500/40 bg-cyan-500/10 hover:bg-cyan-500/25 text-cyan-300 text-xs font-mono transition-all cursor-pointer"
            title="Como instalar o Jarvis como aplicativo nativo no seu computador"
          >
            <Monitor className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline font-bold">Instalar no PC</span>
          </button>

          {/* Protocol selector trigger */}
          <button
            onClick={onOpenProtocolModal}
            className={`hidden sm:flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-xs font-mono transition-all cursor-pointer ${badge.bg}`}
            title="Alterar protocolo de operação"
          >
            <span className={`w-2 h-2 rounded-full ${badge.dot}`} />
            <span className="font-semibold">{badge.label}</span>
          </button>

          {/* Voice Mic Toggle */}
          <button
            onClick={onToggleListening}
            className={`relative p-2 rounded-lg border transition-all cursor-pointer ${
              isListening
                ? 'bg-cyan-500/30 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.5)] animate-pulse'
                : 'bg-slate-900 border-slate-700/60 text-slate-400 hover:text-cyan-300 hover:border-cyan-500/40'
            }`}
            title={isListening ? 'Ouvindo comandos de voz (Clique para parar)' : 'Falar com o Jarvis'}
          >
            {isListening ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
          </button>

          {/* Mute Audio SFX & Voice Toggle */}
          <button
            onClick={onToggleMute}
            className={`p-2 rounded-lg border transition-all cursor-pointer ${
              isMuted
                ? 'bg-red-500/20 border-red-500/40 text-red-400'
                : 'bg-slate-900 border-slate-700/60 text-slate-400 hover:text-cyan-300 hover:border-cyan-500/40'
            }`}
            title={isMuted ? 'Áudio desativado' : 'Áudio e efeitos sonoros ativos'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
