import React, { useState, useEffect } from 'react';
import { useJarvisTheme } from '../theme/ThemeContext';
import {
  Sparkles,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Clock,
  Radio,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Mic,
  DollarSign,
  Bitcoin,
  ShieldAlert,
  Terminal,
} from 'lucide-react';

export interface SystemDirective {
  id: string;
  title: string;
  targetType: 'currency' | 'crypto' | 'terminal_watcher' | 'osint' | 'news' | 'custom';
  targetQuery: string;
  intervalSeconds: number;
  actionRule: string;
  isActive: boolean;
  createdAt: string;
  lastUpdated?: string;
  currentValue?: string;
  changePct?: string;
  isPositive?: boolean;
}

interface AutoDirectivesPanelProps {
  directives: SystemDirective[];
  onAddDirective: (directive: Omit<SystemDirective, 'id' | 'createdAt'>) => void;
  onToggleDirective: (id: string) => void;
  onDeleteDirective: (id: string) => void;
  onTriggerVoiceDirective?: (voiceText: string) => void;
}

export const AutoDirectivesPanel: React.FC<AutoDirectivesPanelProps> = ({
  directives,
  onAddDirective,
  onToggleDirective,
  onDeleteDirective,
  onTriggerVoiceDirective,
}) => {
  const { colors } = useJarvisTheme();
  const [marketData, setMarketData] = useState<{
    usdBrl: any;
    eurBrl: any;
    btcBrl: any;
  } | null>(null);
  const [loadingMarket, setLoadingMarket] = useState(false);
  const [countdown, setCountdown] = useState(30);

  // New directive form state
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<SystemDirective['targetType']>('currency');
  const [newQuery, setNewQuery] = useState('USD-BRL');
  const [newInterval, setNewInterval] = useState(30);
  const [showAddForm, setShowAddForm] = useState(false);

  // Fetch live market data for directives
  const fetchMarketData = async () => {
    try {
      setLoadingMarket(true);
      const res = await fetch('/api/market/ticker');
      if (res.ok) {
        const data = await res.json();
        setMarketData(data);
      }
    } catch (e) {
      console.warn('Erro ao atualizar cotações das diretrizes:', e);
    } finally {
      setLoadingMarket(false);
      setCountdown(30);
    }
  };

  // Poll ticker every 30 seconds
  useEffect(() => {
    fetchMarketData();
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          fetchMarketData();
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleCreateDirective = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddDirective({
      title: newTitle.trim(),
      targetType: newType,
      targetQuery: newQuery,
      intervalSeconds: newInterval,
      actionRule: 'display_ticker',
      isActive: true,
    });

    setNewTitle('');
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Top Banner / Explanation */}
      <div className="bg-slate-900/80 backdrop-blur-md p-4 rounded-xl border border-cyan-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
            <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-cyan-300">
              Motor de Auto-Diretrizes e Atualização por Voz
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            JARVIS assimila comandos falados (ex: <span className="text-cyan-300 font-mono">"a partir de agora você vai me dar atualizações sobre o preço do dólar"</span>) e reconfigura o próprio sistema, acoplando watchers e widgets ao HUD em tempo real.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchMarketData()}
            disabled={loadingMarket}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-mono transition-colors border border-slate-700"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingMarket ? 'animate-spin text-cyan-400' : ''}`} />
            <span>Atualizar ({countdown}s)</span>
          </button>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Nova Diretriz</span>
          </button>
        </div>
      </div>

      {/* Dynamic Voice Directive Simulation Buttons */}
      <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
        <div className="text-xs font-mono text-slate-400 mb-2 flex items-center gap-2">
          <Mic className="w-3.5 h-3.5 text-cyan-400" />
          <span>Simulação de Comandos de Voz Autônomos (Clique para acionar):</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              if (onTriggerVoiceDirective) {
                onTriggerVoiceDirective('a partir de agora você vai me dar atualizações sobre o preço do dólar');
              }
            }}
            className="text-xs font-mono px-3 py-1.5 rounded-lg bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/30 text-cyan-200 transition-colors"
          >
            "A partir de agora me dê atualizações sobre o preço do dólar"
          </button>
          <button
            onClick={() => {
              if (onTriggerVoiceDirective) {
                onTriggerVoiceDirective('a partir de agora monitore a cotação do bitcoin');
              }
            }}
            className="text-xs font-mono px-3 py-1.5 rounded-lg bg-amber-950/60 hover:bg-amber-900/60 border border-amber-500/30 text-amber-200 transition-colors"
          >
            "A partir de agora monitore o preço do Bitcoin"
          </button>
          <button
            onClick={() => {
              if (onTriggerVoiceDirective) {
                onTriggerVoiceDirective('execute git status no terminal de cowork');
              }
            }}
            className="text-xs font-mono px-3 py-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-500/30 text-emerald-200 transition-colors"
          >
            "Execute git status no terminal integrado"
          </button>
        </div>
      </div>

      {/* Add Directive Modal / Form */}
      {showAddForm && (
        <form
          onSubmit={handleCreateDirective}
          className="bg-slate-900/90 backdrop-blur-md p-4 rounded-xl border border-cyan-500/40 space-y-4"
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-cyan-300">
              Registrar Nova Regra / Diretriz no Sistema
            </h4>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="text-slate-400 hover:text-white text-xs font-mono"
            >
              Cancelar
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-slate-400 mb-1 font-mono">Título da Diretriz:</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Ex: Monitor de Câmbio USD/BRL"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-400 font-mono"
                required
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-mono">Tipo de Alvo:</label>
              <select
                value={newType}
                onChange={(e) => {
                  const val = e.target.value as any;
                  setNewType(val);
                  if (val === 'currency') setNewQuery('USD-BRL');
                  if (val === 'crypto') setNewQuery('BTC-USD');
                }}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-400 font-mono"
              >
                <option value="currency">Moeda / Câmbio (USD/BRL, EUR/BRL)</option>
                <option value="crypto">Criptoativo (BTC, ETH)</option>
                <option value="terminal_watcher">Watcher de Terminal / Script</option>
                <option value="osint">Radar OSINT & Ameaças</option>
                <option value="custom">Diretriz Personalizada</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-mono">Símbolo / Consulta:</label>
              <input
                type="text"
                value={newQuery}
                onChange={(e) => setNewQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-400 font-mono"
                required
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-mono">Ciclo de Atualização:</label>
              <select
                value={newInterval}
                onChange={(e) => setNewInterval(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-400 font-mono"
              >
                <option value={10}>A cada 10 segundos (Alta Frequência)</option>
                <option value={30}>A cada 30 segundos (Padrão)</option>
                <option value={60}>A cada 1 minuto</option>
                <option value={300}>A cada 5 minutos</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold transition-colors font-mono"
            >
              Assimilar Diretriz ao Sistema
            </button>
          </div>
        </form>
      )}

      {/* ACTIVE LIVE HUD WIDGETS SECTION */}
      <div>
        <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
          <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
          <span>Widgets Vivos Gerados por Diretrizes no HUD:</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* USD/BRL LIVE TICKER CARD */}
          <div className="bg-gradient-to-br from-slate-900/90 to-slate-950/90 backdrop-blur-md p-4 rounded-xl border border-cyan-500/40 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400">
                  <DollarSign className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-mono text-xs font-bold text-white">DÓLAR COMERCIAL (USD/BRL)</div>
                  <div className="text-[10px] font-mono text-slate-400">Diretriz Ativa · Telemetria em tempo real</div>
                </div>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </div>

            <div className="mt-3 flex items-baseline justify-between">
              <div>
                <div className="text-2xl font-mono font-extrabold text-cyan-200">
                  R$ {marketData?.usdBrl?.bid || '5.74'}
                </div>
                <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                  Venda: R$ {marketData?.usdBrl?.ask || '5.75'}
                </div>
              </div>

              <div className="text-right font-mono">
                <div className="flex items-center gap-1 text-emerald-400 text-xs font-bold">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>+{marketData?.usdBrl?.pctChange || '0.18'}%</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  Variação diária
                </div>
              </div>
            </div>

            {/* High / Low stats */}
            <div className="mt-4 pt-3 border-t border-slate-800 grid grid-cols-2 gap-2 text-[10px] font-mono text-slate-400">
              <div>Máxima: <span className="text-slate-200 font-bold">R$ {marketData?.usdBrl?.high || '5.78'}</span></div>
              <div>Mínima: <span className="text-slate-200 font-bold">R$ {marketData?.usdBrl?.low || '5.71'}</span></div>
            </div>
          </div>

          {/* BITCOIN LIVE TICKER CARD */}
          <div className="bg-gradient-to-br from-slate-900/90 to-slate-950/90 backdrop-blur-md p-4 rounded-xl border border-amber-500/40 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400">
                  <Bitcoin className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-mono text-xs font-bold text-white">BITCOIN (BTC/BRL)</div>
                  <div className="text-[10px] font-mono text-slate-400">Cripto Radar Ativo</div>
                </div>
              </div>
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            </div>

            <div className="mt-3 flex items-baseline justify-between">
              <div>
                <div className="text-2xl font-mono font-extrabold text-amber-200">
                  {marketData?.btcBrl?.bid || 'R$ 562.450'}
                </div>
                <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                  Ativo de Referência Global
                </div>
              </div>

              <div className="text-right font-mono">
                <div className="flex items-center gap-1 text-emerald-400 text-xs font-bold">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>+{marketData?.btcBrl?.pctChange || '2.40'}%</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">24h Change</div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono text-slate-400">
              <div>Ciclo: <span className="text-amber-300">A cada 30s</span></div>
              <div className="text-emerald-400 font-bold">Mercado Aberto 24/7</div>
            </div>
          </div>

          {/* EURO / BRL CARD */}
          <div className="bg-gradient-to-br from-slate-900/90 to-slate-950/90 backdrop-blur-md p-4 rounded-xl border border-sky-500/40 relative overflow-hidden group">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-400 font-mono font-bold">
                  €
                </div>
                <div>
                  <div className="font-mono text-xs font-bold text-white">EURO (EUR/BRL)</div>
                  <div className="text-[10px] font-mono text-slate-400">Câmbio Europeu</div>
                </div>
              </div>
              <span className="w-2 h-2 rounded-full bg-sky-400" />
            </div>

            <div className="mt-3 flex items-baseline justify-between">
              <div>
                <div className="text-2xl font-mono font-extrabold text-sky-200">
                  R$ {marketData?.eurBrl?.bid || '6.22'}
                </div>
                <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                  Zona do Euro
                </div>
              </div>

              <div className="text-right font-mono">
                <div className="flex items-center gap-1 text-slate-400 text-xs font-bold">
                  <span>{marketData?.eurBrl?.pctChange || '-0.08'}%</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">Estabilidade</div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono text-slate-400">
              <div>Status: <span className="text-emerald-400 font-bold">Nominal</span></div>
              <div>Última sinc: <span className="text-slate-200">{new Date().toLocaleTimeString()}</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* DIRECTIVES RULEBOOK LIST */}
      <div>
        <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <span>Regras e Watchers Cadastrados no JARVIS ({directives.length}):</span>
        </h4>

        <div className="space-y-2">
          {directives.map((dir) => (
            <div
              key={dir.id}
              className={`p-3.5 rounded-xl border backdrop-blur-md flex items-center justify-between gap-4 transition-all ${
                dir.isActive
                  ? 'bg-slate-900/80 border-cyan-500/30'
                  : 'bg-slate-950/50 border-slate-800 opacity-60'
              }`}
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onToggleDirective(dir.id)}
                  className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors border ${
                    dir.isActive
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-400'
                      : 'border-slate-700 text-slate-600'
                  }`}
                  title={dir.isActive ? 'Pausar diretriz' : 'Ativar diretriz'}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </button>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-white">{dir.title}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {dir.targetType.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                    Alvo: <span className="text-cyan-300">{dir.targetQuery}</span> · Ciclo: <span className="text-slate-200">{dir.intervalSeconds}s</span> · Regra: <span className="text-slate-300">{dir.actionRule}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className={`text-[10px] font-mono font-bold px-2 py-1 rounded ${
                  dir.isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'
                }`}>
                  {dir.isActive ? 'VIGILÂNCIA ATIVA' : 'PAUSADO'}
                </span>

                <button
                  onClick={() => onDeleteDirective(dir.id)}
                  className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                  title="Excluir Diretriz"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
