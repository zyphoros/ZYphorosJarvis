import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types/jarvis';
import { soundEffects } from '../services/soundEffects';
import {
  Send,
  Mic,
  MicOff,
  Image as ImageIcon,
  Globe,
  Sparkles,
  Volume2,
  VolumeX,
  ExternalLink,
  Bot,
  User,
  Wrench,
  Search,
  CheckCircle,
  X,
  BrainCircuit,
} from 'lucide-react';

interface ChatConsoleProps {
  messages: ChatMessage[];
  onSendMessage: (message: string, options: { useSearch: boolean; deepReasoning: boolean; image: string | null }) => void;
  isLoading: boolean;
  isListening: boolean;
  onToggleListening: () => void;
  onPlayVoice: (text: string, messageId: string, existingAudio?: string) => void;
  currentlySpeakingId: string | null;
}

export const ChatConsole: React.FC<ChatConsoleProps> = ({
  messages,
  onSendMessage,
  isLoading,
  isListening,
  onToggleListening,
  onPlayVoice,
  currentlySpeakingId,
}) => {
  const [inputText, setInputText] = useState('');
  const [useSearch, setUseSearch] = useState(false);
  const [deepReasoning, setDeepReasoning] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if ((!inputText.trim() && !selectedImage) || isLoading) return;

    soundEffects.playHudClick();
    onSendMessage(inputText.trim(), {
      useSearch,
      deepReasoning,
      image: selectedImage,
    });

    setInputText('');
    setSelectedImage(null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result as string);
      soundEffects.playConfirm();
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col h-[520px] md:h-[620px] hud-glass rounded-2xl border border-cyan-500/30 overflow-hidden shadow-[0_0_30px_rgba(6,182,212,0.15)]">
      {/* Console Header */}
      <div className="px-4 py-3 bg-slate-950/80 border-b border-cyan-500/20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="font-hud font-bold text-sm text-cyan-300 tracking-wider">
            TERMINAL NEURAL DE COMUNICAÇÃO JARVIS
          </span>
        </div>

        {/* Intelligence Filters / Modes */}
        <div className="flex items-center gap-2 text-xs">
          <button
            type="button"
            onClick={() => {
              soundEffects.playHudClick();
              setUseSearch(!useSearch);
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-all cursor-pointer font-hud ${
              useSearch
                ? 'bg-sky-500/20 border-sky-400 text-sky-300 shadow-[0_0_10px_rgba(14,165,233,0.3)]'
                : 'bg-slate-900 border-slate-700/60 text-slate-400 hover:text-slate-200'
            }`}
            title="Ativar pesquisa web no Google em tempo real"
          >
            <Globe className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Google Search</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundEffects.playHudClick();
              setDeepReasoning(!deepReasoning);
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-all cursor-pointer font-hud ${
              deepReasoning
                ? 'bg-purple-500/20 border-purple-400 text-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.3)]'
                : 'bg-slate-900 border-slate-700/60 text-slate-400 hover:text-slate-200'
            }`}
            title="Ativar modo de raciocínio lógico e analítico profundo para física, matemática e código"
          >
            <BrainCircuit className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Raciocínio Profundo</span>
          </button>
        </div>
      </div>

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          const isSpeaking = currentlySpeakingId === msg.id;

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar Icon */}
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${
                  isUser
                    ? 'bg-blue-600/30 border-blue-400/50 text-blue-300'
                    : 'bg-cyan-500/20 border-cyan-400/60 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Box */}
              <div
                className={`max-w-[85%] rounded-2xl p-4 border text-sm leading-relaxed ${
                  isUser
                    ? 'bg-blue-950/40 border-blue-500/30 text-slate-100 rounded-tr-none'
                    : 'bg-slate-950/70 border-cyan-500/30 text-slate-200 rounded-tl-none shadow-[0_0_15px_rgba(6,182,212,0.06)]'
                }`}
              >
                {/* Text Content */}
                <div className="whitespace-pre-wrap font-sans selection:bg-cyan-500/30">
                  {msg.content}
                </div>

                {/* Function / Tools Execution Badge */}
                {msg.toolsCalled && msg.toolsCalled.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-cyan-500/20 space-y-1.5">
                    <span className="text-[10px] font-mono-tech text-cyan-400 uppercase tracking-wider flex items-center gap-1">
                      <Wrench className="w-3 h-3 text-cyan-400" />
                      Comandos Executados pelo Jarvis:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.toolsCalled.map((tool, idx) => (
                        <div
                          key={idx}
                          className="px-2 py-0.5 rounded bg-cyan-950/70 border border-cyan-600/40 text-[11px] font-mono-tech text-cyan-300 flex items-center gap-1.5"
                        >
                          <CheckCircle className="w-3 h-3 text-emerald-400" />
                          <span>
                            {tool.name} ({Object.entries(tool.args).map(([k, v]) => `${k}: ${v}`).join(', ')})
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Web Search Sources */}
                {msg.searchSources && msg.searchSources.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-cyan-500/20">
                    <span className="text-[10px] font-mono-tech text-sky-400 uppercase tracking-wider flex items-center gap-1 mb-1">
                      <Search className="w-3 h-3" />
                      Fontes de Inteligência Web:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.searchSources.slice(0, 3).map((source, idx) => (
                        <a
                          key={idx}
                          href={source.uri}
                          target="_blank"
                          rel="noreferrer"
                          className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-sky-400 text-[10px] font-mono-tech text-sky-300 flex items-center gap-1 transition-colors"
                        >
                          <span className="truncate max-w-[150px]">{source.title}</span>
                          <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Voice & Meta Footer */}
                <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono-tech text-slate-500">
                  <span>{msg.timestamp}</span>

                  {!isUser && (
                    <button
                      onClick={() => onPlayVoice(msg.content, msg.id, msg.audioBase64)}
                      className={`flex items-center gap-1 px-2 py-0.5 rounded border transition-all cursor-pointer ${
                        isSpeaking
                          ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 animate-pulse'
                          : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-cyan-300 hover:border-cyan-500/40'
                      }`}
                      title="Ouvir resposta falada pelo Jarvis"
                    >
                      <Volume2 className="w-3 h-3" />
                      <span>{isSpeaking ? 'Falando...' : 'Ouvir Voz'}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-400/60 text-cyan-300 flex items-center justify-center animate-spin">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="hud-glass rounded-2xl px-4 py-3 border border-cyan-500/30 text-xs font-mono-tech text-cyan-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>J.A.R.V.I.S. computando resposta quântica...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Image Preview if selected */}
      {selectedImage && (
        <div className="px-4 py-2 bg-slate-900/90 border-t border-cyan-500/20 flex items-center gap-3">
          <div className="relative">
            <img
              src={selectedImage}
              alt="Anexo para inspeção do Jarvis"
              className="w-14 h-14 rounded-lg object-cover border border-cyan-400/50"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center text-[10px] cursor-pointer"
            >
              ✕
            </button>
          </div>
          <div className="text-xs font-mono-tech text-cyan-300">
            <div>Arquivo anexado para análise multimodal</div>
            <div className="text-[10px] text-slate-400">Jarvis irá inspecionar a imagem</div>
          </div>
        </div>
      )}

      {/* Input bar */}
      <form
        onSubmit={handleSend}
        className="p-3 bg-slate-950/95 border-t border-cyan-500/20 flex items-center gap-2"
      >
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageUpload}
          className="hidden"
        />

        {/* Image Attachment Button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="p-2.5 rounded-xl bg-slate-900 border border-slate-700/60 text-slate-400 hover:text-cyan-300 hover:border-cyan-400/40 transition-colors cursor-pointer"
          title="Anexar imagem, esquema ou foto para análise do Jarvis"
        >
          <ImageIcon className="w-4 h-4" />
        </button>

        {/* Voice Dictation Button */}
        <button
          type="button"
          onClick={onToggleListening}
          className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
            isListening
              ? 'bg-cyan-500/30 border-cyan-400 text-cyan-300 animate-pulse shadow-[0_0_15px_rgba(6,182,212,0.4)]'
              : 'bg-slate-900 border-slate-700/60 text-slate-400 hover:text-cyan-300 hover:border-cyan-400/40'
          }`}
          title={isListening ? 'Parar gravação' : 'Falar comando por voz'}
        >
          {isListening ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
        </button>

        {/* Message Input Field */}
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={
            isListening
              ? 'Escutando sua voz...'
              : 'Pergunte algo complexo ou comande seus dispositivos...'
          }
          className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900/90 border border-cyan-500/30 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-sans text-sm shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]"
        />

        {/* Send Button */}
        <button
          type="submit"
          disabled={isLoading || (!inputText.trim() && !selectedImage)}
          className={`p-2.5 rounded-xl font-hud font-bold transition-all cursor-pointer ${
            isLoading || (!inputText.trim() && !selectedImage)
              ? 'bg-slate-900 border border-slate-800 text-slate-600 cursor-not-allowed'
              : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 border border-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
          }`}
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
