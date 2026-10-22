import React, { useMemo } from 'react';
import { JarvisActivityStatus } from '../types/jarvis';
import { Mic, ShieldAlert, Cpu, Sparkles, Volume2 } from 'lucide-react';

interface ArcReactorProps {
  status: JarvisActivityStatus;
  onClick?: () => void;
  audioLevel?: number; // 0 to 1
  label?: string;
}

export const ArcReactor: React.FC<ArcReactorProps> = ({
  status,
  onClick,
  audioLevel = 0,
  label,
}) => {
  // Color configuration depending on current status
  const theme = useMemo(() => {
    switch (status) {
      case 'listening':
        return {
          coreGlow: 'from-amber-400/40 via-cyan-400/30 to-blue-600/20',
          ringBorder: 'border-cyan-400',
          ringGlow: 'rgba(6, 182, 212, 0.7)',
          accentColor: '#06b6d4',
          subText: 'ESCUTANDO FREQUÊNCIA DE VOZ...',
          icon: Mic,
          pulseSpeed: 'animate-pulse',
        };
      case 'processing':
        return {
          coreGlow: 'from-purple-500/40 via-cyan-500/30 to-indigo-600/30',
          ringBorder: 'border-purple-400',
          ringGlow: 'rgba(168, 85, 247, 0.8)',
          accentColor: '#a855f7',
          subText: 'PROCESSANDO REDE NEURAL & FERRAMENTAS...',
          icon: Cpu,
          pulseSpeed: 'animate-pulse',
        };
      case 'speaking':
        return {
          coreGlow: 'from-emerald-400/40 via-cyan-400/40 to-teal-600/30',
          ringBorder: 'border-emerald-400',
          ringGlow: 'rgba(52, 211, 153, 0.8)',
          accentColor: '#10b981',
          subText: 'J.A.R.V.I.S. VOCALIZANDO RESPOSTA...',
          icon: Volume2,
          pulseSpeed: 'animate-pulse',
        };
      case 'alert':
        return {
          coreGlow: 'from-red-600/50 via-rose-600/40 to-amber-600/30',
          ringBorder: 'border-red-500',
          ringGlow: 'rgba(239, 68, 68, 0.85)',
          accentColor: '#ef4444',
          subText: 'ALERTA TÁTICO / PROTOCOLO DE DEFESA',
          icon: ShieldAlert,
          pulseSpeed: 'animate-ping',
        };
      case 'idle':
      default:
        return {
          coreGlow: 'from-cyan-400/30 via-blue-500/20 to-sky-700/10',
          ringBorder: 'border-cyan-500/40',
          ringGlow: 'rgba(6, 182, 212, 0.5)',
          accentColor: '#06b6d4',
          subText: 'SISTEMAS OPERANDO EM 99.8% • AGUARDANDO COMANDOS',
          icon: Sparkles,
          pulseSpeed: 'animate-pulse-glow',
        };
    }
  }, [status]);

  // Audio reactive wave bars (16 bars radiating or in visualizer)
  const waveBars = useMemo(() => {
    return Array.from({ length: 14 }).map((_, i) => {
      // simulate natural oscillation with audioLevel
      const height = status === 'speaking' || status === 'listening'
        ? Math.max(12, Math.min(68, Math.sin((i + Date.now() / 200) * 0.8) * 24 + audioLevel * 50 + 20))
        : 8 + (i % 3) * 4;
      return height;
    });
  }, [status, audioLevel]);

  return (
    <div className="relative flex flex-col items-center justify-center p-4 select-none">
      {/* Outer ambient glow */}
      <div
        className="absolute w-72 h-72 md:w-88 md:h-88 rounded-full blur-3xl pointer-events-none transition-all duration-700"
        style={{
          background: `radial-gradient(circle, ${theme.ringGlow} 0%, rgba(3, 7, 18, 0) 70%)`,
          opacity: status === 'alert' ? 0.9 : status === 'speaking' || status === 'processing' ? 0.8 : 0.45,
        }}
      />

      {/* Main Reactor Body */}
      <button
        onClick={onClick}
        type="button"
        title="Clique para ativar/desativar escuta por voz do Jarvis"
        className="relative group w-52 h-52 md:w-64 md:h-64 rounded-full flex items-center justify-center cursor-pointer transition-transform duration-300 active:scale-95 focus:outline-none"
      >
        {/* Ring 1 - Outermost segmented tech ring */}
        <div
          className={`absolute inset-0 rounded-full border border-dashed ${theme.ringBorder} opacity-60 ${
            status === 'processing' ? 'animate-spin-fast' : 'animate-spin-slow'
          }`}
          style={{ borderWidth: '1.5px' }}
        />

        {/* Ring 2 - Reverse rotating geometric ticks */}
        <div
          className={`absolute inset-3 rounded-full border border-dotted border-cyan-300/40 ${
            status === 'processing' ? 'animate-spin-fast' : 'animate-spin-reverse'
          }`}
        />

        {/* Ring 3 - Solid glowing metallic channel */}
        <div className="absolute inset-6 rounded-full border-2 border-cyan-500/30 bg-slate-950/80 shadow-[inset_0_0_20px_rgba(6,182,212,0.3)] backdrop-blur-md" />

        {/* Palladium coil segments (10 coils around the ring like Iron Man Arc Reactor) */}
        <div className="absolute inset-6 rounded-full">
          {Array.from({ length: 10 }).map((_, idx) => {
            const angle = (idx * 36) * (Math.PI / 180);
            const radius = 80; // approximate placement
            const x = Math.sin(angle) * radius;
            const y = -Math.cos(angle) * radius;

            return (
              <div
                key={idx}
                className="absolute w-3.5 h-6 rounded-sm bg-gradient-to-b from-amber-200/90 via-amber-600 to-amber-900 border border-amber-300/60 shadow-[0_0_8px_rgba(245,158,11,0.6)]"
                style={{
                  top: '50%',
                  left: '50%',
                  transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) rotate(${idx * 36}deg)`,
                }}
              />
            );
          })}
        </div>

        {/* Ring 4 - Inner cyan crystal ring */}
        <div className="absolute inset-14 rounded-full border border-cyan-400/70 shadow-[0_0_15px_rgba(6,182,212,0.6),inset_0_0_10px_rgba(6,182,212,0.6)]" />

        {/* Glowing Center Core */}
        <div
          className={`relative w-24 h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-tr ${theme.coreGlow} flex flex-col items-center justify-center shadow-[0_0_35px_rgba(6,182,212,0.8),inset_0_0_20px_rgba(255,255,255,0.7)] border-2 border-white/60 transition-all duration-300`}
        >
          {/* Triangular Stark Core Pattern */}
          <div className="absolute inset-2 border border-cyan-200/50 rounded-full animate-ping opacity-30" />

          {/* Central Icon */}
          <theme.icon
            className="w-8 h-8 md:w-10 md:h-10 text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.9)] transition-all duration-300 group-hover:scale-110"
            style={{ color: status === 'alert' ? '#fecaca' : '#ffffff' }}
          />

          <span className="font-hud text-[9px] tracking-widest text-cyan-100 font-bold mt-1 drop-shadow">
            STARK-OS
          </span>
        </div>

        {/* Interactive hover tooltip ring */}
        <div className="absolute -inset-2 rounded-full border border-cyan-400/0 group-hover:border-cyan-400/40 transition-colors duration-300" />
      </button>

      {/* Real-time Equalizer Waveform */}
      <div className="flex items-center gap-1.5 mt-5 h-9">
        {waveBars.map((height, i) => (
          <div
            key={i}
            className="w-1 rounded-full transition-all duration-150"
            style={{
              height: `${height}px`,
              backgroundColor: theme.accentColor,
              boxShadow: `0 0 8px ${theme.accentColor}`,
              opacity: status === 'idle' ? 0.4 : 0.9,
            }}
          />
        ))}
      </div>

      {/* Telemetry / Status readout */}
      <div className="text-center mt-3">
        <div className="font-hud text-xs md:text-sm tracking-wider font-semibold" style={{ color: theme.accentColor }}>
          {label || theme.subText}
        </div>
        <div className="font-mono-tech text-[10px] text-cyan-300/60 mt-0.5 tracking-widest">
          MARK VII INTERFACE • NÚCLEO QUÂNTICO ATIVO
        </div>
      </div>
    </div>
  );
};
