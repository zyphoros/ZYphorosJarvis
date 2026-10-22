import React, { useState } from 'react';
import { requestBlueprint } from '../services/jarvisApi';
import { soundEffects } from '../services/soundEffects';
import {
  Layers,
  Sparkles,
  Download,
  RotateCw,
  Compass,
  Cpu,
  Zap,
} from 'lucide-react';

export const HoloBlueprintGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [blueprintUrl, setBlueprintUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const presets = [
    'Armadura Mark VII de Titânio e Ouro com propulsores repulsores',
    'Reator Arc Miniaturizado de Fusão Limpa com anel de paládio',
    'Drone Sentinel de Patrulha com sensores térmicos e aerodinâmica stealth',
    'Bancada Holográfica de Simulação Quântica dos Laboratórios Stark',
  ];

  const handleGenerate = async (targetPrompt?: string) => {
    const textToUse = targetPrompt || prompt;
    if (!textToUse.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    soundEffects.playJarvisWake();

    try {
      const url = await requestBlueprint(textToUse);
      setBlueprintUrl(url);
      soundEffects.playConfirm();
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Falha ao projetar o holograma. Tente novamente.');
      soundEffects.playAlert();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg md:text-xl font-bold font-hud text-cyan-300 flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-400" />
            Projetor de Blueprints Holográficos
          </h2>
          <p className="text-xs text-slate-400 font-mono-tech mt-0.5">
            Renderização técnica vetorial em tempo real sintetizada pela IA
          </p>
        </div>
      </div>

      {/* Generator Card */}
      <div className="hud-glass rounded-2xl p-6 border border-cyan-500/30 space-y-5">
        <div>
          <label className="block text-xs font-mono-tech text-cyan-300 mb-2">
            Descreva o conceito tecnológico para projeção esquemática:
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ex: Novo propulsor iônico para a armadura Mark 85..."
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-cyan-500/30 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono-tech text-xs md:text-sm"
            />
            <button
              onClick={() => handleGenerate()}
              disabled={isLoading || !prompt.trim()}
              className={`px-5 py-2.5 rounded-xl font-hud font-bold text-xs md:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                isLoading || !prompt.trim()
                  ? 'bg-slate-900 border border-slate-800 text-slate-600'
                  : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
              }`}
            >
              {isLoading ? (
                <>
                  <RotateCw className="w-4 h-4 animate-spin" />
                  <span>Renderizando...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Projetar Holograma</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Quick concept presets */}
        <div>
          <span className="text-[11px] font-mono-tech text-slate-400 block mb-2">
            Projetos Rápidos da Stark Industries:
          </span>
          <div className="flex flex-wrap gap-2">
            {presets.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setPrompt(preset);
                  handleGenerate(preset);
                }}
                disabled={isLoading}
                className="text-[11px] font-mono-tech px-3 py-1.5 rounded-lg bg-slate-900/80 hover:bg-cyan-950/60 border border-cyan-500/20 text-slate-300 hover:text-cyan-300 hover:border-cyan-400/50 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Zap className="w-3 h-3 text-cyan-400" />
                {preset}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs font-mono-tech text-red-300">
            {error}
          </div>
        )}

        {/* Holographic Projection Display */}
        <div className="relative min-h-[340px] rounded-2xl border-2 border-dashed border-cyan-500/30 bg-slate-950/90 overflow-hidden flex flex-col items-center justify-center p-4">
          {/* Subtle Grid Background */}
          <div className="absolute inset-0 cyber-grid opacity-30 pointer-events-none" />

          {/* Technical HUD crosshairs */}
          <div className="absolute top-3 left-3 text-[10px] font-mono-tech text-cyan-400/50">
            HUD CAD // MARK VII SCHEMATIC
          </div>
          <div className="absolute top-3 right-3 text-[10px] font-mono-tech text-cyan-400/50">
            ESCALA 1:1 • VETORIAL
          </div>
          <div className="absolute bottom-3 left-3 text-[10px] font-mono-tech text-cyan-400/50">
            RESOLUÇÃO ÓPTICA QUÂNTICA
          </div>

          {isLoading ? (
            <div className="text-center z-10 space-y-4">
              <div className="w-16 h-16 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin mx-auto shadow-[0_0_20px_rgba(6,182,212,0.6)]" />
              <div className="font-hud font-bold text-cyan-300 text-sm tracking-wider animate-pulse">
                SINTETIZANDO ESTRUTURA HOLOGRÁFICA...
              </div>
              <div className="font-mono-tech text-[11px] text-cyan-400/60">
                Calculando tensores moleculares e malhas poligonais
              </div>
            </div>
          ) : blueprintUrl ? (
            <div className="relative z-10 w-full flex flex-col items-center">
              <div className="relative max-w-2xl w-full rounded-xl overflow-hidden border border-cyan-400/60 shadow-[0_0_30px_rgba(6,182,212,0.3)]">
                <img
                  src={blueprintUrl}
                  alt="Esquema Holográfico Projetado pelo Jarvis"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />
              </div>

              <div className="mt-4 flex items-center gap-3">
                <a
                  href={blueprintUrl}
                  download="stark_blueprint.png"
                  className="px-4 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400 text-cyan-300 font-hud text-xs flex items-center gap-2 transition-all cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                >
                  <Download className="w-4 h-4" />
                  <span>Exportar Esquema PNG</span>
                </a>
              </div>
            </div>
          ) : (
            <div className="text-center z-10 space-y-3 max-w-sm">
              <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                <Compass className="w-8 h-8" />
              </div>
              <h3 className="font-hud text-slate-200 text-base font-bold">
                Mesa Holográfica Pronta
              </h3>
              <p className="text-xs text-slate-400 font-mono-tech">
                Digite uma instrução ou selecione um dos esquemas acima para ver a IA do Jarvis
                projetar o esquema tridimensional.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
