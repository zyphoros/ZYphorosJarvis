import React, { useState, useRef, useEffect } from 'react';
import { useJarvisTheme } from '../theme/ThemeContext';
import {
  Terminal as TerminalIcon,
  Play,
  RotateCcw,
  CheckCircle2,
  Clock,
  FileCode,
  Folder,
  Search,
  Sparkles,
  ChevronRight,
  Code2,
  FileText,
  Copy,
  Check,
  Cpu,
} from 'lucide-react';

interface TerminalLog {
  id: string;
  type: 'cmd' | 'stdout' | 'stderr' | 'info';
  content: string;
  timestamp: string;
}

interface AutonomousTask {
  id: string;
  title: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  command?: string;
  result?: string;
}

const INITIAL_TASKS: AutonomousTask[] = [
  {
    id: 'task_1',
    title: 'Auditoria de integridade e verificação do TypeScript',
    status: 'completed',
    command: 'npm run lint',
    result: 'Zero erros de sintaxe ou imports ausentes.',
  },
  {
    id: 'task_2',
    title: 'Sincronização de telemetria geoespacial Osiris.ai',
    status: 'completed',
    command: 'curl -s http://localhost:3000/api/osiris/layers',
    result: 'Camadas de cabos submarinos, ADS-B e AIS naval operacionais.',
  },
  {
    id: 'task_3',
    title: 'Calibração dos watchers de câmbio USD/BRL e Cripto',
    status: 'completed',
    command: 'curl -s http://localhost:3000/api/market/ticker',
    result: 'Cotação em tempo real fixada em R$ 5,74 com amostragem de 30s.',
  },
  {
    id: 'task_4',
    title: 'Compilação de produção e otimização de bundle',
    status: 'pending',
    command: 'npm run build',
  },
];

const WORKSPACE_FILES: Record<string, string> = {
  'package.json': `{
  "name": "jarvis-osiris-cowork",
  "version": "4.2.0",
  "type": "module",
  "scripts": {
    "dev": "tsx server.ts",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "start": "node server.ts"
  },
  "dependencies": {
    "@google/genai": "^2.4.0",
    "express": "^4.21.2",
    "lucide-react": "^0.546.0",
    "react": "^19.0.1",
    "react-dom": "^19.0.1"
  }
}`,
  'server.ts': `// JARVIS + OSIRIS.AI Server Core
import express from 'express';
import dns from 'dns/promises';
import { GoogleGenAI } from '@google/genai';

const app = express();
// Endpoints: /api/jarvis/chat, /api/market/ticker, /api/terminal/run, /api/osint/query...
app.listen(3000, () => console.log('StarkOS Core ativo na porta 3000'));`,
  'metadata.json': `{
  "name": "JARVIS & Osiris Cowork Intelligence",
  "description": "Assistente autônomo com inteligência geoespacial, terminal de cowork e auto-diretrizes por voz."
}`,
};

export const CoworkTerminalWorkspace: React.FC = () => {
  const { colors } = useJarvisTheme();
  const [logs, setLogs] = useState<TerminalLog[]>([
    {
      id: '1',
      type: 'info',
      content: '[JARVIS TERMINAL COWORK v4.2] Ambiente de desenvolvimento e terminal autônomo inicializado.',
      timestamp: new Date().toLocaleTimeString(),
    },
    {
      id: '2',
      type: 'info',
      content: 'Workspace: /app/applet · Node.js: v22.14.0 · TypeScript: v7.0.2',
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const [commandInput, setCommandInput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [tasks, setTasks] = useState<AutonomousTask[]>(INITIAL_TASKS);
  const [activeFile, setActiveFile] = useState<string>('package.json');
  const [copied, setCopied] = useState(false);
  const terminalEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll terminal
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  // Execute terminal command
  const runCommand = async (cmdToRun: string) => {
    const trimmed = cmdToRun.trim();
    if (!trimmed || isRunning) return;

    setIsRunning(true);
    const newCmdLog: TerminalLog = {
      id: String(Date.now()),
      type: 'cmd',
      content: `$ ${trimmed}`,
      timestamp: new Date().toLocaleTimeString(),
    };
    setLogs((prev) => [...prev, newCmdLog]);

    try {
      const res = await fetch('/api/terminal/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: trimmed }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.stdout) {
          setLogs((prev) => [
            ...prev,
            {
              id: String(Date.now() + 1),
              type: 'stdout',
              content: data.stdout,
              timestamp: new Date().toLocaleTimeString(),
            },
          ]);
        }
        if (data.stderr) {
          setLogs((prev) => [
            ...prev,
            {
              id: String(Date.now() + 2),
              type: 'stderr',
              content: data.stderr,
              timestamp: new Date().toLocaleTimeString(),
            },
          ]);
        }
      } else {
        setLogs((prev) => [
          ...prev,
          {
            id: String(Date.now() + 3),
            type: 'stderr',
            content: `Erro HTTP ${res.status} ao executar comando.`,
            timestamp: new Date().toLocaleTimeString(),
          },
        ]);
      }
    } catch (e: any) {
      setLogs((prev) => [
        ...prev,
        {
          id: String(Date.now() + 4),
          type: 'stderr',
          content: `Falha de rede: ${e.message}`,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    } finally {
      setIsRunning(false);
      setCommandInput('');
    }
  };

  // Run next autonomous task step
  const runNextTask = async () => {
    const pendingTaskIndex = tasks.findIndex((t) => t.status === 'pending');
    if (pendingTaskIndex === -1) return;

    const task = tasks[pendingTaskIndex];
    setTasks((prev) =>
      prev.map((t, i) => (i === pendingTaskIndex ? { ...t, status: 'running' } : t))
    );

    if (task.command) {
      await runCommand(task.command);
    }

    setTasks((prev) =>
      prev.map((t, i) =>
        i === pendingTaskIndex
          ? { ...t, status: 'completed', result: 'Executado com êxito pelo JARVIS Cowork.' }
          : t
      )
    );
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(WORKSPACE_FILES[activeFile] || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 font-sans">
      {/* LEFT COLUMN: INTERACTIVE TERMINAL & AUTOPROMPT AGENT (8 cols) */}
      <div className="lg:col-span-8 space-y-4">
        {/* TERMINAL CONSOLE */}
        <div className="bg-slate-950 rounded-xl border border-cyan-500/30 overflow-hidden shadow-2xl flex flex-col h-[460px]">
          {/* Terminal Title Bar */}
          <div className="bg-slate-900/90 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
              </div>
              <span className="font-mono text-xs text-slate-300 font-bold ml-2 flex items-center gap-1.5">
                <TerminalIcon className="w-3.5 h-3.5 text-cyan-400" />
                JARVIS COWORK TERMINAL // BASH @ WORKSPACE
              </span>
            </div>

            {/* Quick Command Pills */}
            <div className="hidden sm:flex items-center gap-1.5">
              {['git status', 'npm test', 'npm run build', 'ls -la'].map((cmd) => (
                <button
                  key={cmd}
                  onClick={() => runCommand(cmd)}
                  disabled={isRunning}
                  className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[11px] font-mono text-cyan-300 transition-colors border border-slate-700"
                >
                  {cmd}
                </button>
              ))}
            </div>
          </div>

          {/* Terminal Output Area */}
          <div className="flex-1 p-4 overflow-y-auto font-mono text-xs space-y-2 select-text">
            {logs.map((log) => (
              <div key={log.id} className="leading-relaxed">
                {log.type === 'cmd' && (
                  <div className="text-cyan-300 font-bold flex items-center gap-2">
                    <span className="text-emerald-400">jarvis@workspace:~$</span>
                    <span>{log.content.replace(/^\$\s*/, '')}</span>
                  </div>
                )}
                {log.type === 'stdout' && (
                  <pre className="text-slate-300 whitespace-pre-wrap pl-4 border-l border-slate-800">
                    {log.content}
                  </pre>
                )}
                {log.type === 'stderr' && (
                  <pre className="text-rose-400 whitespace-pre-wrap pl-4 border-l border-rose-900/50">
                    {log.content}
                  </pre>
                )}
                {log.type === 'info' && (
                  <div className="text-slate-500 italic flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-cyan-400" />
                    <span>{log.content}</span>
                  </div>
                )}
              </div>
            ))}
            {isRunning && (
              <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs animate-pulse">
                <Cpu className="w-3.5 h-3.5 animate-spin" />
                <span>JARVIS executando instrução no sistema...</span>
              </div>
            )}
            <div ref={terminalEndRef} />
          </div>

          {/* Terminal Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              runCommand(commandInput);
            }}
            className="p-2.5 bg-slate-900/80 border-t border-slate-800 flex items-center gap-2"
          >
            <span className="font-mono text-xs font-bold text-emerald-400 pl-2">
              jarvis@workspace:~$
            </span>
            <input
              type="text"
              value={commandInput}
              onChange={(e) => setCommandInput(e.target.value)}
              placeholder="Digite um comando (ex: git status, node -v, npm test)..."
              disabled={isRunning}
              className="flex-1 bg-transparent border-none text-white font-mono text-xs focus:outline-none"
            />
            <button
              type="submit"
              disabled={isRunning || !commandInput.trim()}
              className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-white rounded text-xs font-mono font-semibold flex items-center gap-1 transition-colors"
            >
              <Play className="w-3 h-3" />
              <span>Executar</span>
            </button>
          </form>
        </div>

        {/* AUTONOMOUS TASK AUTOPROMPT BREAKDOWN */}
        <div className="bg-slate-900/80 backdrop-blur-md p-4 rounded-xl border border-cyan-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-cyan-300">
                Agente Autônomo de Tarefas (Devin / Cowork)
              </h4>
            </div>

            <button
              onClick={runNextTask}
              disabled={isRunning || tasks.every((t) => t.status === 'completed')}
              className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-white rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-colors"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Executar Próxima Etapa</span>
            </button>
          </div>

          <div className="space-y-2">
            {tasks.map((task, idx) => (
              <div
                key={task.id}
                className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center justify-between gap-3 text-xs font-mono"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-300">
                    {idx + 1}
                  </span>
                  <div>
                    <div className="text-white font-semibold">{task.title}</div>
                    {task.command && (
                      <div className="text-[11px] text-cyan-400/80 font-mono mt-0.5">
                        $ {task.command}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {task.status === 'completed' && (
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      CONCLUÍDO
                    </span>
                  )}
                  {task.status === 'running' && (
                    <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 text-[10px] font-bold animate-pulse flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      EXECUTANDO...
                    </span>
                  )}
                  {task.status === 'pending' && (
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px]">
                      PENDENTE
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: WORKSPACE FILE EXPLORER & CODE INSPECTOR (4 cols) */}
      <div className="lg:col-span-4 space-y-4">
        <div className="bg-slate-950 rounded-xl border border-cyan-500/30 overflow-hidden shadow-xl flex flex-col h-[600px]">
          {/* File Explorer Header */}
          <div className="bg-slate-900/90 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Folder className="w-3.5 h-3.5 text-cyan-400" />
              ARQUIVOS DO WORKSPACE
            </span>
            <button
              onClick={handleCopyCode}
              className="text-slate-400 hover:text-white p-1 rounded transition-colors"
              title="Copiar código"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* File Tab Selectors */}
          <div className="flex border-b border-slate-800 bg-slate-900/50 p-1 gap-1">
            {Object.keys(WORKSPACE_FILES).map((fileName) => (
              <button
                key={fileName}
                onClick={() => setActiveFile(fileName)}
                className={`px-2.5 py-1 rounded text-xs font-mono transition-colors flex items-center gap-1.5 ${
                  activeFile === fileName
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <FileCode className="w-3 h-3" />
                <span>{fileName}</span>
              </button>
            ))}
          </div>

          {/* Code Inspector Content */}
          <div className="flex-1 p-3 overflow-y-auto bg-slate-950 font-mono text-[11px] text-slate-300">
            <pre className="whitespace-pre-wrap leading-relaxed select-text">
              {WORKSPACE_FILES[activeFile]}
            </pre>
          </div>

          {/* Bottom Workspace Status */}
          <div className="p-2.5 bg-slate-900/80 border-t border-slate-800 text-[10px] font-mono text-slate-400 flex items-center justify-between">
            <span>RAM Alocada: 184 MB</span>
            <span className="text-emerald-400 font-bold">Workspace Sincronizado</span>
          </div>
        </div>
      </div>
    </div>
  );
};
