import React, { useState, useEffect } from 'react';
import { soundEffects } from '../services/soundEffects';
import {
  Radar,
  Video,
  Eye,
  Shield,
  Plane,
  Crosshair,
  AlertOctagon,
  RefreshCw,
  Zap,
} from 'lucide-react';

interface TacticalRadarProps {
  onSpeak?: (text: string) => void;
}

export const TacticalRadar: React.FC<TacticalRadarProps> = ({ onSpeak }) => {
  const [filterMode, setFilterMode] = useState<'normal' | 'thermal' | 'night'>('thermal');
  const [isScanning, setIsScanning] = useState(false);
  const [threatCount, setThreatCount] = useState(0);
  const [droneAltitude, setDroneAltitude] = useState(48);
  const [droneBattery, setDroneBattery] = useState(94);

  useEffect(() => {
    const interval = setInterval(() => {
      setDroneAltitude(prev => Math.floor(45 + Math.random() * 6));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const triggerScan = () => {
    setIsScanning(true);
    soundEffects.playJarvisWake();

    setTimeout(() => {
      soundEffects.playConfirm();
      setIsScanning(false);
      setThreatCount(0);
      onSpeak?.('Varredura tática perimetral concluída, senhor. Espaço aéreo limpo num raio de 15 quilômetros. Zero anomalias detectadas.');
    }, 2400);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg md:text-xl font-bold font-hud text-cyan-300 flex items-center gap-2">
            <Radar className="w-5 h-5 text-cyan-400" />
            Radar Tático Perimetral & Feed dos Drones Sentinel
          </h2>
          <p className="text-xs text-slate-400 font-mono-tech mt-0.5">
            Varredura 360° em tempo real com telemetria óptica e infravermelho
          </p>
        </div>

        <button
          onClick={triggerScan}
          disabled={isScanning}
          className={`px-4 py-2 rounded-xl font-hud font-bold text-xs md:text-sm flex items-center gap-2 transition-all cursor-pointer ${
            isScanning
              ? 'bg-slate-900 border border-slate-700 text-slate-500'
              : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.4)]'
          }`}
        >
          <RefreshCw className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
          <span>{isScanning ? 'Escanear Espaço Aéreo...' : 'Varredura Perimetral 360°'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Rotating Circular Radar Sweep HUD */}
        <div className="lg:col-span-6 hud-glass rounded-3xl p-6 border border-cyan-500/30 flex flex-col items-center justify-center relative overflow-hidden min-h-[380px]">
          {/* Radar background grid rings */}
          <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full border-2 border-cyan-500/30 flex items-center justify-center bg-slate-950/90 shadow-[inset_0_0_30px_rgba(6,182,212,0.2)]">
            {/* Concentric distance rings */}
            <div className="absolute inset-8 rounded-full border border-cyan-500/20" />
            <div className="absolute inset-16 rounded-full border border-cyan-500/20" />
            <div className="absolute inset-24 rounded-full border border-cyan-500/20" />

            {/* Crosshair axis lines */}
            <div className="absolute w-full h-[1px] bg-cyan-500/30" />
            <div className="absolute h-full w-[1px] bg-cyan-500/30" />

            {/* 360-degree rotating radar beam */}
            <div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                background: 'conic-gradient(from 0deg at 50% 50%, rgba(6, 182, 212, 0.4) 0deg, rgba(6, 182, 212, 0) 60deg, transparent 360deg)',
                animation: 'radar-sweep 4s linear infinite',
              }}
            />

            {/* Center: Complex HQ Base */}
            <div className="absolute w-4 h-4 rounded-full bg-cyan-400 shadow-[0_0_10px_#00e5ff] flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-white" />
            </div>

            {/* Target 1: Sentinel Drone (Green/Cyan blip) */}
            <div className="absolute top-16 right-20 flex items-center gap-1.5 animate-pulse">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981]" />
              <span className="font-mono-tech text-[9px] text-emerald-300">SENTINEL-1</span>
            </div>

            {/* Target 2: Mark VII Suit dock */}
            <div className="absolute bottom-20 left-16 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-300 shadow-[0_0_8px_#38bdf8]" />
              <span className="font-mono-tech text-[9px] text-cyan-300">MARK-VII (DOCA)</span>
            </div>

            {/* Compass labels */}
            <span className="absolute top-2 text-[10px] font-mono-tech text-cyan-400/70 font-bold">N (000°)</span>
            <span className="absolute bottom-2 text-[10px] font-mono-tech text-cyan-400/70 font-bold">S (180°)</span>
            <span className="absolute right-2 text-[10px] font-mono-tech text-cyan-400/70 font-bold">L (090°)</span>
            <span className="absolute left-2 text-[10px] font-mono-tech text-cyan-400/70 font-bold">O (270°)</span>
          </div>

          <div className="mt-4 flex items-center justify-between w-full text-xs font-mono-tech text-slate-400 px-4">
            <span>ALCANCE DO SENSOR: 15 KM</span>
            <span className="text-emerald-400 font-bold">AMEAÇAS: {threatCount}</span>
          </div>
        </div>

        {/* Right Column: Live Drone Camera Stream */}
        <div className="lg:col-span-6 hud-glass rounded-3xl p-5 border border-cyan-500/30 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
              <span className="font-hud font-bold text-sm text-slate-100 flex items-center gap-1.5">
                <Video className="w-4 h-4 text-cyan-400" />
                STREAM AO VIVO: DRONE SENTINEL-01
              </span>
            </div>

            {/* Camera Filter Selector */}
            <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-700 text-xs font-mono-tech">
              <button
                onClick={() => setFilterMode('thermal')}
                className={`px-2 py-0.5 rounded cursor-pointer ${
                  filterMode === 'thermal' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'text-slate-400'
                }`}
              >
                Térmico
              </button>
              <button
                onClick={() => setFilterMode('night')}
                className={`px-2 py-0.5 rounded cursor-pointer ${
                  filterMode === 'night' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'text-slate-400'
                }`}
              >
                Visão Noturna
              </button>
              <button
                onClick={() => setFilterMode('normal')}
                className={`px-2 py-0.5 rounded cursor-pointer ${
                  filterMode === 'normal' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400'
                }`}
              >
                Óptico
              </button>
            </div>
          </div>

          {/* Camera Viewport */}
          <div
            className={`relative h-60 rounded-2xl overflow-hidden border border-cyan-500/40 flex flex-col items-center justify-center select-none ${
              filterMode === 'thermal'
                ? 'bg-gradient-to-tr from-purple-950 via-rose-950 to-amber-950'
                : filterMode === 'night'
                ? 'bg-gradient-to-tr from-green-950 via-emerald-950 to-slate-950'
                : 'bg-gradient-to-tr from-slate-950 via-blue-950 to-slate-900'
            }`}
          >
            {/* Scanlines effect */}
            <div className="absolute inset-0 cyber-grid opacity-30 pointer-events-none" />

            {/* Crosshair target overlay */}
            <div className="relative z-10 flex flex-col items-center">
              <Crosshair className="w-16 h-16 text-cyan-400/80 animate-pulse" />
              <span className="font-mono-tech text-[10px] text-cyan-300 tracking-widest mt-1">
                ALVO FIXADO: PERÍMETRO SUL
              </span>
            </div>

            {/* Top camera data overlay */}
            <div className="absolute top-2 left-3 right-3 flex items-center justify-between text-[10px] font-mono-tech text-white/80">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" /> REC 1080P
              </span>
              <span>ALT: {droneAltitude}m • VEL: 24 km/h</span>
              <span>BAT: {droneBattery}%</span>
            </div>

            {/* Bottom camera coordinates */}
            <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[10px] font-mono-tech text-white/70">
              <span>LAT: -23.5505° S / LONG: -46.6333° W</span>
              <span className="text-cyan-300">ZOOM: 2.4X DIGITAL</span>
            </div>
          </div>

          {/* Tactical drone actions */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-hud">
            <button
              onClick={() => {
                soundEffects.playConfirm();
                setDroneBattery(100);
                onSpeak?.('Recarga rápida ativada via indução magnética.');
              }}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-center cursor-pointer transition-colors"
            >
              Recarga Rápida
            </button>
            <button
              onClick={() => {
                soundEffects.playAlert();
                onSpeak?.('Sirene de advertência perimetral disparada em 120 decibéis.');
              }}
              className="p-2.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-300 text-center cursor-pointer transition-colors"
            >
              Sirene Perimetral
            </button>
            <button
              onClick={() => {
                soundEffects.playConfirm();
                onSpeak?.('Câmera com tracking facial e veicular ativada com sucesso.');
              }}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-center cursor-pointer transition-colors"
            >
              Rastreio Automático
            </button>
            <button
              onClick={() => {
                soundEffects.playConfirm();
                onSpeak?.('Drone retornando à doca na cobertura do complexo.');
              }}
              className="p-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400 text-cyan-300 text-center cursor-pointer transition-colors"
            >
              Retornar à Doca
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
