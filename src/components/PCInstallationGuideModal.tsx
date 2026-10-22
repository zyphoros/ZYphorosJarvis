import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { soundEffects } from '../services/soundEffects';
import {
  Monitor,
  Download,
  Terminal,
  Cpu,
  CheckCircle2,
  Copy,
  ExternalLink,
  X,
  Layers,
  Sparkles,
  ShieldCheck,
  Check,
} from 'lucide-react';

interface PCInstallationGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PCInstallationGuideModal: React.FC<PCInstallationGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { isInstallable, isInstalled, install } = usePWAInstall();
  const [activeTab, setActiveTab] = useState<'pwa' | 'local' | 'electron'>('pwa');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    soundEffects.playConfirm();
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="hud-glass rounded-3xl p-6 md:p-8 border border-cyan-400/40 w-full max-w-3xl space-y-6 shadow-[0_0_50px_rgba(6,182,212,0.3)] animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-cyan-500/20 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-cyan-500/20 border border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              <Monitor className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-hud font-bold text-lg md:text-xl text-cyan-300 flex items-center gap-2">
                Instalação Nativa do J.A.R.V.I.S. no PC
              </h2>
              <p className="text-xs text-slate-400 font-mono-tech mt-0.5">
                Execute o Jarvis diretamente no seu computador (Windows, Mac ou Linux) sem depender de abas de navegador
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 p-1 bg-slate-900/90 rounded-xl border border-cyan-500/20 text-xs font-hud">
          <button
            onClick={() => {
              soundEffects.playHudClick();
              setActiveTab('pwa');
            }}
            className={`flex-1 py-2 px-3 rounded-lg transition-all font-semibold flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'pwa'
                ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-400/50 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Método 1: PWA Direto (Recomendado)</span>
          </button>

          <button
            onClick={() => {
              soundEffects.playHudClick();
              setActiveTab('local');
            }}
            className={`flex-1 py-2 px-3 rounded-lg transition-all font-semibold flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'local'
                ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-400/50 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Método 2: Servidor Local (Node.js)</span>
          </button>

          <button
            onClick={() => {
              soundEffects.playHudClick();
              setActiveTab('electron');
            }}
            className={`flex-1 py-2 px-3 rounded-lg transition-all font-semibold flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'electron'
                ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-400/50 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Método 3: Executável (.exe / Electron)</span>
          </button>
        </div>

        {/* Tab 1: PWA Standalone Direct Installation */}
        {activeTab === 'pwa' && (
          <div className="space-y-4 animate-in fade-in">
            <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-cyan-300 font-hud font-bold text-sm">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  Instalação com 1 Clique (PWA Desktop)
                </div>
                <p className="text-xs text-slate-300 font-sans mt-1">
                  O Chrome ou Edge instala o Jarvis como um software de área de trabalho com ícone próprio na barra de tarefas, janela limpa sem barra de URL e suporte completo a microfone e áudio.
                </p>
              </div>

              {isInstalled ? (
                <div className="px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-400 text-emerald-300 text-xs font-hud font-bold flex items-center gap-1.5 shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>JÁ INSTALADO NO SEU PC</span>
                </div>
              ) : isInstallable ? (
                <button
                  onClick={async () => {
                    soundEffects.playConfirm();
                    await install();
                  }}
                  className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-hud font-bold text-xs flex items-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.4)] cursor-pointer shrink-0 transition-transform hover:scale-105"
                >
                  <Download className="w-4 h-4" />
                  <span>Instalar no PC Agora</span>
                </button>
              ) : (
                <div className="text-xs font-mono-tech text-cyan-400/90 bg-slate-900 px-3 py-2 rounded-xl border border-cyan-500/20">
                  Clique no ícone de "Instalar" na barra de endereço do navegador (ao lado da estrela de favoritos).
                </div>
              )}
            </div>

            <div className="space-y-2.5 text-xs text-slate-300">
              <h4 className="font-hud font-bold text-slate-100 text-sm">
                Como instalar pelo navegador manualmente:
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-700/60 space-y-1">
                  <span className="font-mono-tech text-cyan-400 font-bold">1. Google Chrome</span>
                  <p className="text-[11px] text-slate-400">
                    Clique nos 3 pontinhos no canto superior direito ➔ <strong>"Salvar e compartilhar"</strong> ➔ <strong>"Instalar JARVIS..."</strong>
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-700/60 space-y-1">
                  <span className="font-mono-tech text-cyan-400 font-bold">2. Microsoft Edge</span>
                  <p className="text-[11px] text-slate-400">
                    Clique nos 3 pontinhos ➔ <strong>"Aplicativos"</strong> ➔ <strong>"Instalar este site como aplicativo"</strong>.
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-700/60 space-y-1">
                  <span className="font-mono-tech text-cyan-400 font-bold">3. No Mac / Safari</span>
                  <p className="text-[11px] text-slate-400">
                    Vá em <strong>Arquivo</strong> ➔ <strong>"Adicionar ao Dock"</strong>. O Jarvis funcionará como um app do macOS.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Run locally with Node.js */}
        {activeTab === 'local' && (
          <div className="space-y-4 animate-in fade-in text-xs">
            <p className="text-slate-300">
              Para executar o Jarvis 100% no seu hardware sem depender do AI Studio, siga o passo a passo com o <strong>Node.js</strong>:
            </p>

            <div className="space-y-3">
              {[
                {
                  step: '1. Pré-requisito: Node.js',
                  desc: 'Tenha o Node.js v20+ instalado no seu PC (baixe em nodejs.org se não possuir).',
                  code: 'node -v',
                },
                {
                  step: '2. Clone ou baixe o código fonte',
                  desc: 'Abra o terminal (Prompt de Comando ou PowerShell no Windows, Terminal no Mac/Linux):',
                  code: 'git clone https://github.com/seu-usuario/jarvis-stark.git\ncd jarvis-stark',
                },
                {
                  step: '3. Instale as dependências',
                  desc: 'Baixe todos os pacotes do projeto:',
                  code: 'npm install',
                },
                {
                  step: '4. Crie o arquivo .env com sua chave do Gemini',
                  desc: 'Crie um arquivo chamado .env na pasta raiz com sua chave gratuita da Google:',
                  code: 'GEMINI_API_KEY="SUA_CHAVE_AQUI"\nPORT=3000',
                },
                {
                  step: '5. Inicie o Jarvis',
                  desc: 'Execute o comando abaixo e abra http://localhost:3000 no navegador:',
                  code: 'npm run dev',
                },
              ].map((item, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-900/80 border border-slate-700/60 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-hud font-bold text-cyan-300">{item.step}</span>
                    <button
                      onClick={() => copyToClipboard(item.code, idx)}
                      className="text-slate-400 hover:text-cyan-300 text-[10px] font-mono-tech flex items-center gap-1 cursor-pointer"
                    >
                      {copiedIndex === idx ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedIndex === idx ? 'Copiado!' : 'Copiar'}</span>
                    </button>
                  </div>
                  <p className="text-slate-400 text-[11px]">{item.desc}</p>
                  <pre className="p-2 rounded bg-slate-950 font-mono-tech text-[11px] text-cyan-200 overflow-x-auto border border-cyan-900/40">
                    {item.code}
                  </pre>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Package as standalone .exe / Electron */}
        {activeTab === 'electron' && (
          <div className="space-y-4 animate-in fade-in text-xs">
            <p className="text-slate-300">
              Você pode transformar o Jarvis em um programa executável real (<strong>.exe</strong> no Windows ou <strong>.app</strong> no Mac) com o <strong>Nativefier</strong> ou <strong>Electron</strong>:
            </p>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-cyan-500/20 space-y-3">
              <span className="font-hud font-bold text-sm text-cyan-300 block">
                Opção Ultrarrápida: 1 Comando com Nativefier
              </span>
              <p className="text-slate-400 text-[11px]">
                Com o servidor local rodando ou com a URL do seu Jarvis, execute no terminal do Windows:
              </p>
              <div className="relative">
                <pre className="p-3 rounded-xl bg-slate-950 font-mono-tech text-[11px] text-cyan-200 overflow-x-auto border border-cyan-500/30">
                  {`npx nativefier --name "JARVIS Stark" --icon "public/icon.svg" --single-instance --tray "http://localhost:3000"`}
                </pre>
                <button
                  onClick={() => copyToClipboard(`npx nativefier --name "JARVIS Stark" --icon "public/icon.svg" --single-instance --tray "http://localhost:3000"`, 99)}
                  className="absolute top-2 right-2 p-1.5 rounded bg-slate-800 text-slate-300 hover:text-cyan-300 cursor-pointer"
                  title="Copiar comando"
                >
                  {copiedIndex === 99 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <p className="text-[11px] text-slate-400">
                Isso criará uma pasta com o arquivo <strong>JARVIS Stark.exe</strong>. Dê dois cliques e o Jarvis abrirá em tela cheia como um jogo ou programa nativo do Windows!
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-700/60 space-y-2">
              <span className="font-hud font-bold text-sm text-slate-200 block">
                Inicializar com o Windows (Auto-start)
              </span>
              <p className="text-slate-400 text-[11px]">
                Para que o Jarvis inicie automaticamente sempre que você ligar o computador:
              </p>
              <ol className="list-decimal list-inside space-y-1 text-slate-400 text-[11px]">
                <li>Pressione as teclas <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-600 font-mono">Win + R</kbd> no teclado.</li>
                <li>Digite <code className="text-cyan-300 font-mono">shell:startup</code> e aperte Enter.</li>
                <li>Cole o atalho do Jarvis dentro dessa pasta. Pronto! O Jarvis acordará sempre que seu computador for ligado.</li>
              </ol>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="pt-2 border-t border-cyan-500/20 flex items-center justify-between">
          <span className="text-[11px] font-mono-tech text-cyan-400/70 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            STARK-OS COMPLIANT • ZERO ANÚNCIOS • 100% SEU
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-hud text-xs cursor-pointer"
          >
            Fechar Guia
          </button>
        </div>
      </div>
    </div>
  );
};
