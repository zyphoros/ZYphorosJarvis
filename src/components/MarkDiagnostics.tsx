import React, { useState, useEffect } from 'react';
import { soundEffects } from '../services/soundEffects';
import confetti from 'canvas-confetti';
import {
  Activity,
  Heart,
  Cpu,
  Flame,
  Shield,
  Gauge,
  RotateCw,
  Sparkles,
  Zap,
  Wind,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

interface MarkDiagnosticsProps {
  onSpeak?: (text: string) => void;
}

export const MarkDiagnostics: React.FC<MarkDiagnosticsProps> = ({ onSpeak }) => {
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [heartRate, setHeartRate] = useState(72);
  const [repulsorOutput, setRepulsorOutput] = useState(88);
  const [armorIntegrity, setArmorIntegrity] = useState(100);
  const [plasmaTemp, setPlasmaTemp] = useState(640); // Kelvin / Celsius
  const [arcFlow, setArcFlow] = useState(99.8);
  const [testResult, setTestResult] = useState<string | null>(null);

  // Live heart rate ECG simulator
  useEffect(() => {
    const interval = setInterval(() => {
      setHeartRate(prev => Math.floor(70 + Math.random() * 8));
      setPlasmaTemp(prev => Math.floor(638 + Math.random() * 6));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const runFullDiagnostics = () => {
    setIsCalibrating(true);
    setTestResult(null);
    soundEffects.playJarvisWake();

    setTimeout(() => {
      soundEffects.playConfirm();
      setRepulsorOutput(100);
      setArmorIntegrity(100);
      setArcFlow(100);
      setIsCalibrating(false);
      setTestResult('TODOS OS SUBSISTEMAS CALIBRADOS COM SUCESSO');

      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#00e5ff', '#3b82f6', '#f59e0b'],
        });
      } catch (e) {}

      onSpeak?.('Diagnóstico concluído com louvor, senhor. A armadura Mark VII e o reator Arc estão operando em potência máxima.');
    }, 2800);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg md:text-xl font-bold font-hud text-cyan-300 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-cyan-400" />
            Telemetria da Armadura Mark VII & Biometria Vital
          </h2>
          <p className="text-xs text-slate-400 font-mono-tech mt-0.5">
            Monitoramento de tensores de titânio, bocais de repulsão e sinais vitais do usuário
          </p>
        </div>

        <button
          onClick={runFullDiagnostics}
          disabled={isCalibrating}
          className={`px-4 py-2 rounded-xl font-hud font-bold text-xs md:text-sm flex items-center gap-2 transition-all cursor-pointer ${
            isCalibrating
              ? 'bg-slate-900 border border-slate-700 text-slate-500'
              : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.4)]'
          }`}
        >
          {isCalibrating ? (
            <>
              <RotateCw className="w-4 h-4 animate-spin text-cyan-400" />
              <span>Calibrando Tensores...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Calibrar Mark VII</span>
            </>
          )}
        </button>
      </div>

      {testResult && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 font-hud text-xs flex items-center justify-between shadow-[0_0_20px_rgba(16,185,129,0.2)] animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{testResult} • EMPUXO NOMINAL 100% GARANTIDO</span>
          </div>
          <span className="font-mono-tech text-[10px]">TENSÃO: 3.2 GW</span>
        </div>
      )}

      {/* Grid of Diagnostics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Arc Reactor Flow */}
        <div className="hud-glass rounded-2xl p-5 border border-cyan-500/30 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono-tech">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-cyan-400" /> Fluxo do Reator Arc
            </span>
            <span className="text-cyan-300 font-bold">{arcFlow}%</span>
          </div>
          <div className="text-2xl font-bold font-hud text-cyan-300">
            {arcFlow}% <span className="text-xs font-mono-tech text-slate-400">GW</span>
          </div>
          <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
            <div
              className="h-full bg-cyan-400 rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(6,182,212,0.8)]"
              style={{ width: `${arcFlow}%` }}
            />
          </div>
          <div className="text-[10px] font-mono-tech text-slate-400 flex justify-between">
            <span>Bobinas de Paládio: OK</span>
            <span className="text-emerald-400">Supercondutor</span>
          </div>
        </div>

        {/* Metric 2: Repulsor Jet Thrust */}
        <div className="hud-glass rounded-2xl p-5 border border-cyan-500/30 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono-tech">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-amber-400" /> Repulsores de Palma & Voo
            </span>
            <span className="text-amber-300 font-bold">{repulsorOutput}%</span>
          </div>
          <div className="text-2xl font-bold font-hud text-amber-300">
            {repulsorOutput}% <span className="text-xs font-mono-tech text-slate-400">Potência</span>
          </div>
          <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-400 rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]"
              style={{ width: `${repulsorOutput}%` }}
            />
          </div>
          <div className="text-[10px] font-mono-tech text-slate-400 flex justify-between">
            <span>Temperatura do Bocal: {plasmaTemp}°C</span>
            <span className="text-amber-300">Pronto p/ Voo</span>
          </div>
        </div>

        {/* Metric 3: Titanium Armor Plating */}
        <div className="hud-glass rounded-2xl p-5 border border-cyan-500/30 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono-tech">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-blue-400" /> Blindagem de Titânio
            </span>
            <span className="text-blue-300 font-bold">{armorIntegrity}%</span>
          </div>
          <div className="text-2xl font-bold font-hud text-blue-300">
            {armorIntegrity}% <span className="text-xs font-mono-tech text-slate-400">Integridade</span>
          </div>
          <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-400 rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"
              style={{ width: `${armorIntegrity}%` }}
            />
          </div>
          <div className="text-[10px] font-mono-tech text-slate-400 flex justify-between">
            <span>Exoesqueleto Ouro/Titânio</span>
            <span className="text-blue-400">Sem Fissuras</span>
          </div>
        </div>

        {/* Metric 4: Biometrics - Heart Rate & Vitals */}
        <div className="hud-glass rounded-2xl p-5 border border-cyan-500/30 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono-tech">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-rose-500 animate-pulse" /> Sinais Vitais (Senhor)
            </span>
            <span className="text-rose-400 font-bold">{heartRate} BPM</span>
          </div>
          <div className="text-2xl font-bold font-hud text-rose-400 flex items-baseline gap-2">
            {heartRate} <span className="text-xs font-mono-tech text-slate-400">BPM</span>
            <span className="text-[11px] font-mono-tech text-emerald-400 ml-auto">SpO2: 99%</span>
          </div>

          {/* Oscillating ECG Wave Bar */}
          <div className="h-6 flex items-center gap-0.5 overflow-hidden bg-slate-950/60 p-1 rounded-lg border border-rose-500/20">
            {Array.from({ length: 24 }).map((_, i) => (
              <div
                key={i}
                className="w-1 bg-rose-500 rounded-full transition-all duration-200"
                style={{
                  height: `${i % 4 === 0 ? 18 : i % 2 === 0 ? 8 : 4}px`,
                  opacity: i % 4 === 0 ? 1 : 0.4,
                }}
              />
            ))}
          </div>

          <div className="text-[10px] font-mono-tech text-slate-400 flex justify-between">
            <span>Estresse Neural: 12%</span>
            <span className="text-emerald-400">Condição Excelente</span>
          </div>
        </div>
      </div>

      {/* Interactive Armor Subsystem Checklist */}
      <div className="hud-glass rounded-2xl p-6 border border-cyan-500/30 space-y-4">
        <h3 className="font-hud font-bold text-slate-100 text-sm md:text-base flex items-center gap-2">
          <Gauge className="w-4 h-4 text-cyan-400" />
          Checagem de Subsistemas de Combate & Navegação
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs font-mono-tech">
          {[
            { label: 'Matriz de Sensores Ópticos HUD', status: 'ONLINE', latency: '4ms' },
            { label: 'Estabilizadores Giroscópicos', status: 'ONLINE', latency: '2ms' },
            { label: 'Canhões de Plasma Repulsor', status: 'CARREGADO', latency: '0ms' },
            { label: 'Ejetor de Flare Anti-Míssil', status: 'STANDBY', latency: '12 unidades' },
            { label: 'Refrigeração Criogênica', status: 'CIRCULANDO', latency: '-18°C' },
            { label: 'Enlace Neural com Satélite Stark', status: 'SINCRONIZADO', latency: '18ms' },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-slate-900/60 border border-slate-700/60 flex items-center justify-between"
            >
              <div className="space-y-0.5">
                <span className="text-slate-200 font-semibold">{item.label}</span>
                <div className="text-[10px] text-slate-400">{item.latency}</div>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
