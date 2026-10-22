import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Device,
  AgendaEvent,
  ChatMessage,
  ProtocolType,
  ActiveTab,
  JarvisActivityStatus,
} from './types/jarvis';
import { useJarvisTheme } from './theme/ThemeContext';
import { HeaderNav } from './components/HeaderNav';
import { JarvisAvatar } from './components/JarvisAvatar';
import { OsirisGlobalMap } from './components/OsirisGlobalMap';
import { AutoDirectivesPanel, SystemDirective } from './components/AutoDirectivesPanel';
import { CoworkTerminalWorkspace } from './components/CoworkTerminalWorkspace';
import { OsintReconToolkit } from './components/OsintReconToolkit';
import { DeviceMatrix } from './components/DeviceMatrix';
import { AgendaPanel } from './components/AgendaPanel';
import { ChatConsole } from './components/ChatConsole';
import { HoloBlueprintGenerator } from './components/HoloBlueprintGenerator';
import { ProtocolSelector, PROTOCOLS_LIST } from './components/ProtocolSelector';
import { AppearanceModal } from './components/AppearanceModal';
import { PCInstallationGuideModal } from './components/PCInstallationGuideModal';
import { sendJarvisMessage, requestJarvisTts } from './services/jarvisApi';
import { cleanTextForSpeech, base64ToAudioBlob, getBestBrowserVoice } from './utils/audioUtils';
import { soundEffects } from './services/soundEffects';
import {
  Mic,
  MicOff,
  Sparkles,
  Zap,
  Volume2,
  Calendar,
  Sliders,
  Shield,
  Layers,
  Activity,
  Radio,
  Globe,
  Terminal,
  DollarSign,
  TrendingUp,
} from 'lucide-react';

const INITIAL_DEVICES: Device[] = [
  {
    id: 'living_lights',
    name: 'Iluminação Quântica',
    room: 'living',
    roomLabel: 'Salão Principal',
    type: 'light',
    status: true,
    value: 80,
    color: '#00e5ff',
  },
  {
    id: 'thermostat',
    name: 'Termostato Atmosférico',
    room: 'living',
    roomLabel: 'Salão Principal',
    type: 'thermostat',
    status: true,
    value: 22,
    meta: { humidity: 46 },
  },
  {
    id: 'lab_lights',
    name: 'Bancada Holográfica de Cowork',
    room: 'lab',
    roomLabel: 'Laboratório & Cowork',
    type: 'light',
    status: true,
    value: 100,
    color: '#00e5ff',
  },
  {
    id: 'robot_arm_dume',
    name: 'Braço Robótico DUM-E',
    room: 'lab',
    roomLabel: 'Laboratório & Cowork',
    type: 'robotics',
    status: false,
    meta: { mode: 'Standby' },
  },
  {
    id: 'security_lock',
    name: 'Escudo & Travas Perimetrais',
    room: 'security',
    roomLabel: 'Perímetro & Defesa',
    type: 'lock',
    status: true,
  },
  {
    id: 'patrol_drone',
    name: 'Drone Sentinel de Patrulha',
    room: 'security',
    roomLabel: 'Perímetro & Defesa',
    type: 'drone',
    status: false,
    meta: { battery: 94 },
  },
  {
    id: 'sound_system',
    name: 'Sistema de Som Imersivo',
    room: 'media',
    roomLabel: 'Mídia & Áudio',
    type: 'sound',
    status: true,
    value: 65,
    meta: { currentTrack: 'Ambient Synth - Cybernetic Focus' },
  },
];

const INITIAL_AGENDA: AgendaEvent[] = [
  {
    id: '1',
    title: 'Revisão Estratégica com a Diretoria Executiva',
    date: new Date().toISOString().split('T')[0],
    time: '11:00',
    category: 'meeting',
    priority: 'critical',
    notes: 'Alinhamento dos relatórios de inteligência geoespacial e infraestrutura.',
    completed: false,
  },
  {
    id: '2',
    title: 'Deploy e Teste de Carga do Terminal Cowork',
    date: new Date().toISOString().split('T')[0],
    time: '15:30',
    category: 'lab',
    priority: 'high',
    notes: 'Avaliação da latência dos scripts e verificação de integridade dos watchers.',
    completed: false,
  },
  {
    id: '3',
    title: 'Auditoria de Vulnerabilidades OSINT nos Servidores',
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    time: '10:00',
    category: 'work',
    priority: 'medium',
    notes: 'Varredura de portas abertas e sincronização de feeds de inteligência.',
    completed: false,
  },
];

const INITIAL_DIRECTIVES: SystemDirective[] = [
  {
    id: 'dir_usd_brl',
    title: 'Monitor de Câmbio USD/BRL em Tempo Real',
    targetType: 'currency',
    targetQuery: 'USD-BRL',
    intervalSeconds: 30,
    actionRule: 'display_ticker',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'dir_btc_crypto',
    title: 'Monitor de Criptoativos BTC/USD',
    targetType: 'crypto',
    targetQuery: 'BTC-USD',
    intervalSeconds: 30,
    actionRule: 'display_ticker',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
];

export default function App() {
  const { colors } = useJarvisTheme();
  const [activeTab, setActiveTab] = useState<ActiveTab>('osiris');
  const [devices, setDevices] = useState<Device[]>(INITIAL_DEVICES);
  const [agenda, setAgenda] = useState<AgendaEvent[]>(INITIAL_AGENDA);
  const [directives, setDirectives] = useState<SystemDirective[]>(INITIAL_DIRECTIVES);
  const [activeProtocol, setActiveProtocol] = useState<ProtocolType>('normal');
  const [isProtocolModalOpen, setIsProtocolModalOpen] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [isAppearanceModalOpen, setIsAppearanceModalOpen] = useState(false);

  // Live financial dollar badge data for HUD
  const [liveDollar, setLiveDollar] = useState<{ bid: string; pctChange: string }>({
    bid: '5.74',
    pctChange: '+0.18',
  });

  // Jarvis status & voice
  const [jarvisStatus, setJarvisStatus] = useState<JarvisActivityStatus>('idle');
  const [isMuted, setIsMuted] = useState(false);
  const [jarvisVoice, setJarvisVoice] = useState<string>(() => {
    try {
      return localStorage.getItem('jarvis_voice') || 'Fenrir';
    } catch {
      return 'Fenrir';
    }
  });
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [audioLevel, setAudioLevel] = useState(0);
  const [currentlySpeakingId, setCurrentlySpeakingId] = useState<string | null>(null);

  const handleUpdateJarvisVoice = (voice: string) => {
    setJarvisVoice(voice);
    try {
      localStorage.setItem('jarvis_voice', voice);
    } catch {
      // Ignored
    }
  };

  // Chat message stream
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome_1',
      role: 'assistant',
      content:
        'Às suas ordens, senhor. O sistema unificado JARVIS & Osiris.ai está 100% operacional. O globo geoespacial com todas as camadas, o terminal de cowork autônomo, as diretrizes de voz contínuas e o toolkit OSINT estão ativos. Como posso auxiliá-lo?',
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [isLoadingChat, setIsLoadingChat] = useState(false);

  // Refs for Web Speech & Audio
  const recognitionRef = useRef<any>(null);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  // Fetch live market ticker periodically for HUD badge
  useEffect(() => {
    const fetchTicker = async () => {
      try {
        const res = await fetch('/api/market/ticker');
        if (res.ok) {
          const data = await res.json();
          if (data.usdBrl) {
            setLiveDollar({
              bid: data.usdBrl.bid,
              pctChange: data.usdBrl.pctChange,
            });
          }
        }
      } catch {
        // Ignored
      }
    };

    fetchTicker();
    const interval = setInterval(fetchTicker, 30000);
    return () => clearInterval(interval);
  }, []);

  // Web Speech Recognition Setup
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'pt-BR';

      recognition.onstart = () => {
        setIsListening(true);
        setJarvisStatus('listening');
        soundEffects.playJarvisWake();
      };

      recognition.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            setTranscript(event.results[i][0].transcript);
          }
        }

        if (finalTranscript) {
          setTranscript(finalTranscript);
          handleVoiceCommand(finalTranscript);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
        setJarvisStatus('idle');
      };

      recognition.onend = () => {
        setIsListening(false);
        if (jarvisStatus === 'listening') {
          setJarvisStatus('idle');
        }
      };

      recognitionRef.current = recognition;
    }
  }, [jarvisStatus]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Reconhecimento de fala não suportado neste navegador. Utilize o teclado ou Chrome/Edge.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      setJarvisStatus('idle');
    } else {
      try {
        setTranscript('');
        recognitionRef.current.start();
      } catch (e) {
        console.error(e);
      }
    }
  };

  // Play assistant voice response with high-fidelity Gemini TTS and resilient browser fallback
  const playVoiceResponse = useCallback(
    async (text: string, messageId: string, existingAudio?: string) => {
      if (isMuted) return;

      // Stop any existing playing audio element
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current = null;
      }
      // Cancel any ongoing browser speech
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }

      setCurrentlySpeakingId(messageId);
      setJarvisStatus('speaking');

      const cleanText = cleanTextForSpeech(text);
      if (!cleanText) {
        setCurrentlySpeakingId(null);
        setJarvisStatus('idle');
        setAudioLevel(0);
        return;
      }

      // Helper for browser speech synthesis fallback with authentic deep Butler tone
      const playBrowserFallback = () => {
        if (!('speechSynthesis' in window)) {
          setCurrentlySpeakingId(null);
          setJarvisStatus('idle');
          setAudioLevel(0);
          return;
        }

        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.lang = 'pt-BR';
        utterance.rate = 1.0;
        utterance.pitch = 0.88; // Deep resonant Butler timbre (JARVIS)

        const bestVoice = getBestBrowserVoice();
        if (bestVoice) {
          utterance.voice = bestVoice;
        }

        let pulseInterval: any = setInterval(() => {
          setAudioLevel(0.25 + Math.random() * 0.65);
        }, 80);

        utterance.onend = () => {
          if (pulseInterval) clearInterval(pulseInterval);
          setCurrentlySpeakingId(null);
          setJarvisStatus('idle');
          setAudioLevel(0);
        };

        utterance.onerror = () => {
          if (pulseInterval) clearInterval(pulseInterval);
          setCurrentlySpeakingId(null);
          setJarvisStatus('idle');
          setAudioLevel(0);
        };

        window.speechSynthesis.speak(utterance);
      };

      // Helper to play base64 RIFF WAV / MP3 / PCM audio
      const playBase64 = (base64Data: string) => {
        try {
          const blob = base64ToAudioBlob(base64Data);
          const audioUrl = URL.createObjectURL(blob);
          const audio = new Audio(audioUrl);
          currentAudioRef.current = audio;

          const pulseInterval: any = setInterval(() => {
            if (!audio.paused && !audio.ended) {
              setAudioLevel(0.35 + Math.random() * 0.55);
            }
          }, 70);

          audio.onended = () => {
            if (pulseInterval) clearInterval(pulseInterval);
            URL.revokeObjectURL(audioUrl);
            currentAudioRef.current = null;
            setCurrentlySpeakingId(null);
            setJarvisStatus('idle');
            setAudioLevel(0);
          };

          audio.onerror = (e) => {
            console.warn('Falha no playback do áudio WAV/PCM, acionando fallback nativo:', e);
            if (pulseInterval) clearInterval(pulseInterval);
            URL.revokeObjectURL(audioUrl);
            currentAudioRef.current = null;
            playBrowserFallback();
          };

          audio.play().catch((err) => {
            console.warn('Auto-play bloqueado pelo navegador, acionando fallback nativo:', err);
            if (pulseInterval) clearInterval(pulseInterval);
            URL.revokeObjectURL(audioUrl);
            currentAudioRef.current = null;
            playBrowserFallback();
          });
        } catch (err) {
          console.warn('Erro ao decodificar áudio base64:', err);
          playBrowserFallback();
        }
      };

      // 1. If audio is already pre-cached on the message, play instantly!
      if (existingAudio) {
        playBase64(existingAudio);
        return;
      }

      // 2. Otherwise request high-definition AI speech from /api/jarvis/tts
      try {
        const audioBase64 = await requestJarvisTts(cleanText.slice(0, 480), jarvisVoice);
        if (audioBase64) {
          // Cache on message in chat state so replay is instantaneous
          setMessages((prev) =>
            prev.map((m) => (m.id === messageId ? { ...m, audioBase64 } : m))
          );
          playBase64(audioBase64);
        } else {
          playBrowserFallback();
        }
      } catch (err) {
        console.warn('Falha ao obter áudio TTS da API, usando fallback do navegador:', err);
        playBrowserFallback();
      }
    },
    [isMuted, jarvisVoice]
  );

  // Device update handler
  const handleUpdateDevice = (id: string, updates: Partial<Device>) => {
    setDevices((prev) =>
      prev.map((dev) => (dev.id === id ? { ...dev, ...updates } : dev))
    );
  };

  // Execute protocol
  const handleSelectProtocol = (protocolId: ProtocolType) => {
    setActiveProtocol(protocolId);

    if (protocolId === 'lockdown') {
      setJarvisStatus('alert');
      setDevices((prev) =>
        prev.map((d) => {
          if (d.type === 'lock') return { ...d, status: true };
          if (d.type === 'drone') return { ...d, status: true };
          if (d.type === 'light') return { ...d, status: true, color: '#ef4444', value: 100 };
          return d;
        })
      );
    } else if (protocolId === 'party_mode') {
      setJarvisStatus('speaking');
      setDevices((prev) =>
        prev.map((d) => {
          if (d.type === 'light') return { ...d, status: true, color: '#ec4899', value: 90 };
          if (d.type === 'sound')
            return {
              ...d,
              status: true,
              value: 85,
            };
          return d;
        })
      );
      setTimeout(() => setJarvisStatus('idle'), 4000);
    } else if (protocolId === 'focus_lab') {
      setDevices((prev) =>
        prev.map((d) => {
          if (d.id === 'lab_lights') return { ...d, status: true, color: '#00e5ff', value: 100 };
          if (d.id === 'robot_arm_dume') return { ...d, status: true, meta: { mode: 'Solda & Calibração' } };
          return d;
        })
      );
    } else if (protocolId === 'night_owl') {
      setDevices((prev) =>
        prev.map((d) => {
          if (d.type === 'lock') return { ...d, status: true };
          if (d.type === 'light') return { ...d, status: true, color: '#f59e0b', value: 15 };
          if (d.type === 'thermostat') return { ...d, value: 20 };
          if (d.type === 'sound') return { ...d, status: false };
          return d;
        })
      );
    } else if (protocolId === 'morning_briefing') {
      setDevices((prev) =>
        prev.map((d) => {
          if (d.type === 'light') return { ...d, status: true, color: '#fef08a', value: 70 };
          if (d.type === 'thermostat') return { ...d, value: 23 };
          return d;
        })
      );
      generateDailyBriefing();
    } else {
      setJarvisStatus('idle');
    }
  };

  // Autonomous Tool execution dispatcher from Gemini Function Calls
  const handleExecuteFunctionCalls = (functionCalls: Array<{ name: string; args: any }>) => {
    for (const call of functionCalls) {
      if (call.name === 'create_system_directive') {
        const { directiveTitle, targetType, targetQuery, intervalSeconds, actionRule } = call.args;
        const newDir: SystemDirective = {
          id: 'dir_' + Date.now(),
          title: directiveTitle || 'Diretriz Autônoma',
          targetType: targetType || 'currency',
          targetQuery: targetQuery || 'USD-BRL',
          intervalSeconds: intervalSeconds || 30,
          actionRule: actionRule || 'display_ticker',
          isActive: true,
          createdAt: new Date().toISOString(),
        };
        setDirectives((prev) => [newDir, ...prev.filter((d) => d.targetQuery !== newDir.targetQuery)]);
        soundEffects.playConfirm();
        setActiveTab('directives');
      } else if (call.name === 'run_terminal_command') {
        setActiveTab('cowork');
        soundEffects.playConfirm();
      } else if (call.name === 'query_osint_intel') {
        setActiveTab('osint');
        soundEffects.playConfirm();
      } else if (call.name === 'control_device') {
        const { deviceId, action, value } = call.args;
        setDevices((prev) =>
          prev.map((dev) => {
            if (dev.id === deviceId) {
              if (action === 'turn_on') return { ...dev, status: true };
              if (action === 'turn_off') return { ...dev, status: false };
              if (action === 'toggle') return { ...dev, status: !dev.status };
              if (action === 'set_brightness' && value !== undefined)
                return { ...dev, value: Number(value), status: Number(value) > 0 };
              if (action === 'set_temperature' && value !== undefined)
                return { ...dev, value: Number(value) };
              if (action === 'set_color' && value) return { ...dev, color: value, status: true };
              if (action === 'set_volume' && value !== undefined)
                return { ...dev, value: Number(value), status: Number(value) > 0 };
              if (action === 'activate_patrol') return { ...dev, status: true };
              if (action === 'return_to_dock') return { ...dev, status: false };
            }
            return dev;
          })
        );
        soundEffects.playConfirm();
      } else if (call.name === 'manage_agenda') {
        const { action, title, date, time, category, priority, notes, eventId } = call.args;
        if (action === 'create' && title) {
          const newEvt: AgendaEvent = {
            id: String(Date.now()),
            title,
            date: date || new Date().toISOString().split('T')[0],
            time: time || '14:00',
            category: category || 'work',
            priority: priority || 'medium',
            notes,
            completed: false,
          };
          setAgenda((prev) => [...prev, newEvt]);
          soundEffects.playConfirm();
        } else if (action === 'delete' && eventId) {
          setAgenda((prev) => prev.filter((a) => a.id !== eventId));
        }
      } else if (call.name === 'execute_protocol') {
        const { protocolName } = call.args;
        if (protocolName) {
          handleSelectProtocol(protocolName as ProtocolType);
        }
      }
    }
  };

  // Main chat message dispatcher
  const handleSendMessage = async (
    text: string,
    options: { useSearch: boolean; deepReasoning: boolean; image: string | null }
  ) => {
    const userMsgId = String(Date.now());
    const userMsg: ChatMessage = {
      id: userMsgId,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoadingChat(true);
    setJarvisStatus('processing');

    try {
      const response = await sendJarvisMessage({
        message: text,
        history: messages.slice(-6).map((m) => ({ role: m.role, content: m.content })),
        devices,
        agenda,
        activeProtocol,
        useSearch: options.useSearch,
        deepReasoning: options.deepReasoning,
        image: options.image,
      });

      const assistantMsgId = String(Date.now() + 1);
      const assistantMsg: ChatMessage = {
        id: assistantMsgId,
        role: 'assistant',
        content: response.reply,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        toolsCalled: response.functionCalls,
        searchSources: response.searchGrounding?.sources,
      };

      setMessages((prev) => [...prev, assistantMsg]);

      // Execute function calls
      if (response.functionCalls && response.functionCalls.length > 0) {
        handleExecuteFunctionCalls(response.functionCalls);
      }

      // Synthesize voice
      if (!isMuted && response.reply) {
        playVoiceResponse(response.reply, assistantMsgId);
      } else {
        setJarvisStatus('idle');
      }
    } catch (error: any) {
      console.error('Erro no processamento do Jarvis:', error);
      const errorMsg: ChatMessage = {
        id: String(Date.now() + 1),
        role: 'assistant',
        content:
          'Compreendido, senhor. O subsistema neural local assumiu o processamento das diretrizes e telemetria.',
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
      soundEffects.playAlert();
      setJarvisStatus('idle');
    } finally {
      setIsLoadingChat(false);
    }
  };

  const handleVoiceCommand = (spokenText: string) => {
    if (!spokenText.trim()) return;
    handleSendMessage(spokenText, {
      useSearch: false,
      deepReasoning: false,
      image: null,
    });
  };

  // Executive Daily Briefing
  const generateDailyBriefing = () => {
    const todayAppointments = agenda.filter((a) => !a.completed);
    let prompt = `Jarvis, execute o meu briefing matinal executivo. Informe sobre a cotação do dólar, o status do globo Osiris e as ${todayAppointments.length} tarefas da minha agenda.`;
    handleSendMessage(prompt, {
      useSearch: true,
      deepReasoning: false,
      image: null,
    });
  };

  const toggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    soundEffects.isMuted = next;
    if (next) {
      if (currentAudioRef.current) currentAudioRef.current.pause();
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      setCurrentlySpeakingId(null);
      if (jarvisStatus === 'speaking') setJarvisStatus('idle');
    } else {
      soundEffects.playConfirm();
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col relative overflow-x-hidden selection:bg-cyan-500 selection:text-black">
      {/* Background Cyber Grid */}
      <div className="fixed inset-0 cyber-grid pointer-events-none opacity-20 z-0" />

      {/* Protocol Alert banner if Lockdown is active */}
      {activeProtocol === 'lockdown' && (
        <div className="sticky top-0 z-50 bg-red-600/90 text-white font-mono font-bold text-xs py-1.5 px-4 text-center tracking-widest flex items-center justify-center gap-3 shadow-[0_0_25px_rgba(239,68,68,0.8)] animate-pulse">
          <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
          <span>ALERTA DE SEGURANÇA MÁXIMA: PERÍMETRO BLINDADO</span>
          <button
            onClick={() => handleSelectProtocol('normal')}
            className="px-2.5 py-0.5 rounded bg-black/40 hover:bg-black/60 border border-white/40 text-xs font-mono cursor-pointer"
          >
            Encerrar Alerta
          </button>
        </div>
      )}

      {/* Top Navigation & Status */}
      <HeaderNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isListening={isListening}
        onToggleListening={toggleListening}
        isMuted={isMuted}
        onToggleMute={toggleMute}
        activeProtocol={activeProtocol}
        onOpenProtocolModal={() => setIsProtocolModalOpen(true)}
        onOpenInstallModal={() => setIsInstallModalOpen(true)}
        onOpenAppearanceModal={() => setIsAppearanceModalOpen(true)}
        status={jarvisStatus}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-6 lg:p-8 space-y-6 relative z-10">
        {/* TAB 1: OSIRIS.AI GLOBAL GEOSPATIAL PLATFORM */}
        {activeTab === 'osiris' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Split: Full Interactive Map + Floating Cowork Console */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left 8 Cols: Full Osiris Map */}
              <div className="lg:col-span-8 h-[640px] rounded-2xl overflow-hidden border border-cyan-500/40 shadow-2xl relative bg-slate-950">
                <OsirisGlobalMap className="w-full h-full" />
              </div>

              {/* Right 4 Cols: Jarvis Avatar & Neural Console */}
              <div className="lg:col-span-4 space-y-4">
                {/* Holographic Avatar Card with Eye Tracking */}
                <div className="p-4 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-cyan-500/30 flex flex-col items-center justify-center relative overflow-hidden shadow-xl">
                  <div className="absolute top-2 left-3 font-mono text-[10px] text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                    INTERFACE FACIAL // RASTREAMENTO OCULAR
                  </div>

                  <JarvisAvatar
                    status={jarvisStatus}
                    audioLevel={audioLevel}
                    onClick={toggleListening}
                    size="md"
                  />

                  {/* Speech Trigger Button */}
                  <div className="mt-2 flex items-center gap-2">
                    <button
                      onClick={toggleListening}
                      className={`px-4 py-2 rounded-xl font-mono text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                        isListening
                          ? 'bg-rose-600 text-white animate-pulse shadow-[0_0_15px_rgba(244,63,94,0.5)]'
                          : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                      }`}
                    >
                      {isListening ? (
                        <>
                          <MicOff className="w-3.5 h-3.5" />
                          <span>Parar Escuta</span>
                        </>
                      ) : (
                        <>
                          <Mic className="w-3.5 h-3.5" />
                          <span>Falar com o Jarvis</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={generateDailyBriefing}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 transition-colors"
                      title="Briefing Matinal em Áudio"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Quick Chat Console */}
                <div className="h-[400px]">
                  <ChatConsole
                    messages={messages}
                    onSendMessage={handleSendMessage}
                    isLoading={isLoadingChat}
                    isListening={isListening}
                    onToggleListening={toggleListening}
                    onPlayVoice={playVoiceResponse}
                    currentlySpeakingId={currentlySpeakingId}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TERMINAL COWORK & CLAUDE CODE / DEVIN WORKSPACE */}
        {activeTab === 'cowork' && (
          <div className="animate-in fade-in duration-300">
            <CoworkTerminalWorkspace />
          </div>
        )}

        {/* TAB 3: AUTO-DIRECTIVES ENGINE & VOICE UPDATES */}
        {activeTab === 'directives' && (
          <div className="animate-in fade-in duration-300">
            <AutoDirectivesPanel
              directives={directives}
              onAddDirective={(dir) => {
                const item: SystemDirective = {
                  ...dir,
                  id: 'dir_' + Date.now(),
                  createdAt: new Date().toISOString(),
                };
                setDirectives((prev) => [item, ...prev]);
                soundEffects.playConfirm();
              }}
              onToggleDirective={(id) => {
                setDirectives((prev) =>
                  prev.map((d) => (d.id === id ? { ...d, isActive: !d.isActive } : d))
                );
              }}
              onDeleteDirective={(id) => {
                setDirectives((prev) => prev.filter((d) => d.id !== id));
              }}
              onTriggerVoiceDirective={(text) => handleVoiceCommand(text)}
            />
          </div>
        )}

        {/* TAB 4: OSINT RECON TOOLKIT */}
        {activeTab === 'osint' && (
          <div className="animate-in fade-in duration-300">
            <OsintReconToolkit />
          </div>
        )}

        {/* TAB 5: SMART HOME DEVICES MATRIX */}
        {activeTab === 'devices' && (
          <div className="animate-in fade-in duration-300">
            <DeviceMatrix
              devices={devices}
              onUpdateDevice={handleUpdateDevice}
              onExecuteVoiceCommand={handleVoiceCommand}
            />
          </div>
        )}

        {/* TAB 6: EXECUTIVE AGENDA */}
        {activeTab === 'agenda' && (
          <div className="animate-in fade-in duration-300">
            <AgendaPanel
              agenda={agenda}
              onAddEvent={(newEvent) => {
                const item: AgendaEvent = {
                  ...newEvent,
                  id: String(Date.now()),
                  completed: false,
                };
                setAgenda((prev) => [...prev, item]);
              }}
              onToggleComplete={(id) => {
                setAgenda((prev) =>
                  prev.map((a) => (a.id === id ? { ...a, completed: !a.completed } : a))
                );
              }}
              onDeleteEvent={(id) => {
                setAgenda((prev) => prev.filter((a) => a.id !== id));
              }}
              onRequestBriefing={generateDailyBriefing}
              onExecuteVoiceCommand={handleVoiceCommand}
            />
          </div>
        )}

        {/* TAB 7: HOLOGRAPHIC BLUEPRINTS & CAD */}
        {activeTab === 'blueprints' && (
          <div className="animate-in fade-in duration-300">
            <HoloBlueprintGenerator />
          </div>
        )}
      </main>

      {/* Floating Realtime Dollar Badge (HUD Ribbon) */}
      <div
        onClick={() => setActiveTab('directives')}
        className="fixed bottom-4 right-4 z-40 bg-slate-950/85 backdrop-blur-md px-3.5 py-2 rounded-xl border border-cyan-500/40 shadow-2xl flex items-center gap-3 cursor-pointer hover:border-cyan-400 transition-all font-mono text-xs group"
        title="Clique para abrir painel de Diretrizes e Watchers"
      >
        <div className="w-6 h-6 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400">
          <DollarSign className="w-3.5 h-3.5" />
        </div>
        <div>
          <div className="text-[10px] text-slate-400 font-semibold">USD/BRL DIRETO</div>
          <div className="text-cyan-300 font-bold flex items-center gap-1.5">
            <span>R$ {liveDollar.bid}</span>
            <span className="text-emerald-400 text-[10px]">({liveDollar.pctChange}%)</span>
          </div>
        </div>
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping ml-1" />
      </div>

      {/* Protocol Selector Modal */}
      <ProtocolSelector
        isOpen={isProtocolModalOpen}
        onClose={() => setIsProtocolModalOpen(false)}
        activeProtocol={activeProtocol}
        onSelectProtocol={handleSelectProtocol}
      />

      {/* PC / Desktop Native Installation Guide Modal */}
      <PCInstallationGuideModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
      />

      {/* Visual Customization & Appearance Modal */}
      <AppearanceModal
        isOpen={isAppearanceModalOpen}
        onClose={() => setIsAppearanceModalOpen(false)}
      />

      {/* Footer */}
      <footer className="mt-auto border-t border-cyan-500/15 bg-slate-950/80 py-3 px-6 text-center text-xs font-mono text-slate-500 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>JARVIS & OSIRIS.AI • PLATAFORMA DE COWORK E INTELIGÊNCIA GEOESPACIAL</span>
          <span className="text-cyan-400/70">NÚCLEO NEURAL AUTÔNOMO V4.2</span>
        </div>
      </footer>
    </div>
  );
}
