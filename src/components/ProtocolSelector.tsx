import React from 'react';
import { Protocol, ProtocolType } from '../types/jarvis';
import { soundEffects } from '../services/soundEffects';
import confetti from 'canvas-confetti';
import {
  ShieldAlert,
  Sparkles,
  PartyPopper,
  FlaskConical,
  Moon,
  Sun,
  Check,
  X,
} from 'lucide-react';

interface ProtocolSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  activeProtocol: ProtocolType;
  onSelectProtocol: (protocol: ProtocolType) => void;
}

export const PROTOCOLS_LIST: Protocol[] = [
  {
    id: 'normal',
    name: 'Protocolo Padrão',
    code: 'STARK-NOMINAL-01',
    description: 'Operação residencial balanceada. Iluminação suave, climatização a 22°C e segurança perimetral ativa.',
    color: 'border-blue-500/50 bg-blue-500/10 text-blue-300',
    iconName: 'Sparkles',
  },
  {
    id: 'lockdown',
    name: 'Protocolo Lockdown',
    code: 'DEFENSE-ALERT-RED',
    description: 'Blindagem total! Todas as travas de titânio trancadas, iluminação tática vermelha e patrulha aérea de drones ativada.',
    color: 'border-red-500/60 bg-red-500/20 text-red-300 shadow-[0_0_20px_rgba(239,68,68,0.25)]',
    iconName: 'ShieldAlert',
  },
  {
    id: 'party_mode',
    name: 'Protocolo Festa Stark',
    code: 'PARTY-VIP-07',
    description: 'Modo celebração! Luzes dinâmicas multicoloridas, som surround em 80% tocando Classic Rock e bar atmosférico.',
    color: 'border-fuchsia-500/60 bg-fuchsia-500/20 text-fuchsia-300 shadow-[0_0_20px_rgba(217,70,239,0.25)]',
    iconName: 'PartyPopper',
  },
  {
    id: 'focus_lab',
    name: 'Modo Laboratório Mark VII',
    code: 'LAB-DEEP-ENG',
    description: 'Imersão em engenharia. Bancada holográfica ativa, braço DUM-E preparado, som Lo-Fi Focus e silenciamento de alertas externos.',
    color: 'border-cyan-500/60 bg-cyan-500/20 text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.25)]',
    iconName: 'FlaskConical',
  },
  {
    id: 'night_owl',
    name: 'Protocolo Noturno',
    code: 'NIGHT-RECOVERY-04',
    description: 'Descanso do senhor Stark. Iluminação reduzida para 10% âmbar suave, portas travadas e temperatura a 20°C.',
    color: 'border-amber-500/60 bg-amber-500/20 text-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.2)]',
    iconName: 'Moon',
  },
  {
    id: 'morning_briefing',
    name: 'Protocolo Bom Dia',
    code: 'SUNRISE-BRIEF-00',
    description: 'Despertar matinal. Iluminação gradual solar, ar condicionado a 23°C e acionamento de briefing falado pelo Jarvis.',
    color: 'border-emerald-500/60 bg-emerald-500/20 text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.2)]',
    iconName: 'Sun',
  },
];

export const ProtocolSelector: React.FC<ProtocolSelectorProps> = ({
  isOpen,
  onClose,
  activeProtocol,
  onSelectProtocol,
}) => {
  if (!isOpen) return null;

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'ShieldAlert':
        return ShieldAlert;
      case 'PartyPopper':
        return PartyPopper;
      case 'FlaskConical':
        return FlaskConical;
      case 'Moon':
        return Moon;
      case 'Sun':
        return Sun;
      default:
        return Sparkles;
    }
  };

  const handleChoose = (id: ProtocolType) => {
    if (id === 'lockdown') {
      soundEffects.playAlert();
    } else if (id === 'party_mode') {
      soundEffects.playConfirm();
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#06b6d4', '#ec4899', '#eab308', '#a855f7'],
        });
      } catch (e) {
        // ignore
      }
    } else {
      soundEffects.playConfirm();
    }

    onSelectProtocol(id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="hud-glass rounded-3xl p-6 md:p-8 border border-cyan-400/40 w-full max-w-2xl space-y-6 shadow-[0_0_50px_rgba(6,182,212,0.3)] animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-cyan-500/20 pb-4">
          <div>
            <h2 className="font-hud font-bold text-lg md:text-xl text-cyan-300 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              Diretrizes & Protocolos Globais do Jarvis
            </h2>
            <p className="text-xs text-slate-400 font-mono-tech mt-0.5">
              Acione reconfigurações holísticas instantâneas de iluminação, som e segurança
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Protocols Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 max-h-[60vh] overflow-y-auto pr-1">
          {PROTOCOLS_LIST.map((protocol) => {
            const Icon = getIcon(protocol.iconName);
            const isSelected = activeProtocol === protocol.id;

            return (
              <button
                key={protocol.id}
                onClick={() => handleChoose(protocol.id)}
                className={`p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? `${protocol.color} ring-2 ring-cyan-400`
                    : 'bg-slate-900/70 border-slate-700/60 hover:border-cyan-500/50 hover:bg-slate-800/60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-slate-950/70 border border-current">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="font-hud font-bold text-sm text-slate-100">
                        {protocol.name}
                      </span>
                    </div>

                    {isSelected && (
                      <span className="flex items-center gap-1 text-[10px] font-mono-tech font-bold text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500">
                        <Check className="w-3 h-3" /> ATIVO
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-300/80 leading-relaxed font-sans mb-3">
                    {protocol.description}
                  </p>
                </div>

                <div className="text-[10px] font-mono-tech text-slate-400/80 flex items-center justify-between pt-2 border-t border-slate-700/40">
                  <span>CÓDIGO: {protocol.code}</span>
                  <span className="text-cyan-400">ATIVAR AGORA →</span>
                </div>
              </button>
            );
          })}
        </div>

        <div className="text-center pt-2 text-[11px] font-mono-tech text-cyan-400/60">
          Você também pode acionar estes protocolos por voz dizendo "Jarvis, ativar Protocolo Festa" ou "Jarvis, lockdown!"
        </div>
      </div>
    </div>
  );
};
