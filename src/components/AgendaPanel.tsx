import React, { useState } from 'react';
import { AgendaEvent } from '../types/jarvis';
import { soundEffects } from '../services/soundEffects';
import {
  Calendar,
  Clock,
  Plus,
  Trash2,
  CheckCircle2,
  Circle,
  AlertCircle,
  Briefcase,
  FlaskConical,
  User,
  Volume2,
  Sparkles,
} from 'lucide-react';

interface AgendaPanelProps {
  agenda: AgendaEvent[];
  onAddEvent: (event: Omit<AgendaEvent, 'id' | 'completed'>) => void;
  onToggleComplete: (id: string) => void;
  onDeleteEvent: (id: string) => void;
  onRequestBriefing: () => void;
  onExecuteVoiceCommand?: (command: string) => void;
}

export const AgendaPanel: React.FC<AgendaPanelProps> = ({
  agenda,
  onAddEvent,
  onToggleComplete,
  onDeleteEvent,
  onRequestBriefing,
  onExecuteVoiceCommand,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [newTime, setNewTime] = useState('14:00');
  const [newCategory, setNewCategory] = useState<AgendaEvent['category']>('work');
  const [newPriority, setNewPriority] = useState<AgendaEvent['priority']>('medium');
  const [newNotes, setNewNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    soundEffects.playConfirm();
    onAddEvent({
      title: newTitle.trim(),
      date: newDate,
      time: newTime,
      category: newCategory,
      priority: newPriority,
      notes: newNotes.trim() || undefined,
    });

    setNewTitle('');
    setNewNotes('');
    setShowAddModal(false);
  };

  const getPriorityStyle = (priority: AgendaEvent['priority']) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-500/20 text-red-300 border-red-500/40';
      case 'high':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'medium':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
      case 'low':
      default:
        return 'bg-slate-700/40 text-slate-300 border-slate-600/40';
    }
  };

  const getCategoryIcon = (category: AgendaEvent['category']) => {
    switch (category) {
      case 'lab':
        return FlaskConical;
      case 'meeting':
      case 'work':
        return Briefcase;
      case 'personal':
        return User;
      case 'urgent':
      default:
        return AlertCircle;
    }
  };

  // Sort by date and time
  const sortedAgenda = [...agenda].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    return `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`);
  });

  return (
    <div className="space-y-6">
      {/* Top Banner and Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg md:text-xl font-bold font-hud text-cyan-300 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-cyan-400" />
            Cronograma & Gestão de Agenda Stark
          </h2>
          <p className="text-xs text-slate-400 font-mono-tech mt-0.5">
            Otimizado por IA com triagem de prioridades e briefings executivos
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Briefing generator button */}
          <button
            onClick={() => {
              soundEffects.playJarvisWake();
              onRequestBriefing();
            }}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-600/30 to-blue-600/30 hover:from-cyan-600/40 hover:to-blue-600/40 border border-cyan-400/50 text-cyan-200 text-xs md:text-sm font-hud font-semibold flex items-center gap-2 shadow-[0_0_15px_rgba(6,182,212,0.25)] transition-all cursor-pointer"
            title="Solicitar briefing matinal completo falado pelo Jarvis"
          >
            <Volume2 className="w-4 h-4 text-cyan-300" />
            <span>Briefing de Voz</span>
          </button>

          {/* Add appointment button */}
          <button
            onClick={() => {
              soundEffects.playHudClick();
              setShowAddModal(true);
            }}
            className="px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs md:text-sm font-hud font-bold flex items-center gap-1.5 shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Compromisso</span>
          </button>
        </div>
      </div>

      {/* Agenda Items List */}
      <div className="space-y-3">
        {sortedAgenda.length === 0 ? (
          <div className="hud-glass rounded-2xl p-8 text-center border border-cyan-500/20">
            <Sparkles className="w-10 h-10 text-cyan-400/50 mx-auto mb-3" />
            <h3 className="font-hud text-slate-300 text-base">Agenda Livre de Compromissos</h3>
            <p className="text-xs text-slate-400 font-mono-tech mt-1">
              Diga "Jarvis, agende uma reunião..." ou clique em "Novo Compromisso".
            </p>
          </div>
        ) : (
          sortedAgenda.map((item) => {
            const CatIcon = getCategoryIcon(item.category);

            return (
              <div
                key={item.id}
                className={`hud-glass rounded-xl p-4 border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                  item.completed
                    ? 'border-slate-800/80 bg-slate-950/40 opacity-60'
                    : 'border-cyan-500/30 hover:border-cyan-400/60'
                }`}
              >
                <div className="flex items-start sm:items-center gap-3 w-full sm:w-auto">
                  {/* Completion check button */}
                  <button
                    onClick={() => {
                      soundEffects.playConfirm();
                      onToggleComplete(item.id);
                    }}
                    className="mt-0.5 sm:mt-0 text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
                    title={item.completed ? 'Marcar como pendente' : 'Concluir compromisso'}
                  >
                    {item.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-500 hover:text-cyan-400" />
                    )}
                  </button>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`font-hud font-bold text-sm md:text-base ${
                          item.completed ? 'line-through text-slate-400' : 'text-slate-100'
                        }`}
                      >
                        {item.title}
                      </span>

                      {/* Category tag */}
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono-tech uppercase bg-slate-800 text-slate-300 border border-slate-700">
                        <CatIcon className="w-3 h-3 text-cyan-400" />
                        {item.category}
                      </span>

                      {/* Priority tag */}
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-hud font-semibold uppercase border ${getPriorityStyle(
                          item.priority
                        )}`}
                      >
                        {item.priority}
                      </span>
                    </div>

                    {item.notes && (
                      <p className="text-xs text-slate-400 font-mono-tech">{item.notes}</p>
                    )}
                  </div>
                </div>

                {/* Date, Time and Delete */}
                <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                  <div className="flex items-center gap-3 text-xs font-mono-tech text-cyan-300/80">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                      {item.date}
                    </span>
                    <span className="flex items-center gap-1 font-bold text-cyan-300">
                      <Clock className="w-3.5 h-3.5 text-cyan-400" />
                      {item.time}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      soundEffects.playToggle(false);
                      onDeleteEvent(item.id);
                    }}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                    title="Excluir compromisso"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Voice Assistant Shortcut Chips */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-cyan-500/20 flex flex-wrap items-center gap-2">
        <span className="text-xs font-hud text-cyan-300 font-semibold mr-2 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          Comandos de Agenda por Voz:
        </span>
        {[
          'Jarvis, agende reunião com a Pepper amanhã às 15:00',
          'Jarvis, adicione teste de propulsão hoje às 19:30',
          'Jarvis, me dê um resumo da minha agenda',
          'Jarvis, limpe compromissos concluídos',
        ].map((cmd, idx) => (
          <button
            key={idx}
            onClick={() => onExecuteVoiceCommand?.(cmd)}
            className="text-[11px] font-mono-tech px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-cyan-950/80 border border-cyan-500/20 text-slate-300 hover:text-cyan-300 hover:border-cyan-400/50 transition-all cursor-pointer"
          >
            "{cmd}"
          </button>
        ))}
      </div>

      {/* Add Event Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="hud-glass rounded-2xl p-6 border border-cyan-400/40 w-full max-w-md space-y-4 shadow-[0_0_40px_rgba(6,182,212,0.25)] animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
              <h3 className="font-hud font-bold text-cyan-300 text-base flex items-center gap-2">
                <Calendar className="w-4 h-4 text-cyan-400" />
                Registrar Novo Compromisso
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-200 cursor-pointer text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-mono-tech text-slate-300 mb-1">
                  Título do Evento / Reunião
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Reunião do Conselho Stark..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-cyan-500/30 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono-tech"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono-tech text-slate-300 mb-1">Data</label>
                  <input
                    type="date"
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-cyan-500/30 text-slate-100 focus:outline-none focus:border-cyan-400 font-mono-tech"
                  />
                </div>
                <div>
                  <label className="block font-mono-tech text-slate-300 mb-1">Horário</label>
                  <input
                    type="time"
                    required
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-cyan-500/30 text-slate-100 focus:outline-none focus:border-cyan-400 font-mono-tech"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono-tech text-slate-300 mb-1">Categoria</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-cyan-500/30 text-slate-100 focus:outline-none focus:border-cyan-400 font-mono-tech"
                  >
                    <option value="work">Trabalho / Stark Ind.</option>
                    <option value="meeting">Reunião</option>
                    <option value="lab">Laboratório Mark VII</option>
                    <option value="personal">Pessoal</option>
                    <option value="urgent">Urgente</option>
                  </select>
                </div>
                <div>
                  <label className="block font-mono-tech text-slate-300 mb-1">Prioridade</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-cyan-500/30 text-slate-100 focus:outline-none focus:border-cyan-400 font-mono-tech"
                  >
                    <option value="low">Baixa</option>
                    <option value="medium">Média</option>
                    <option value="high">Alta</option>
                    <option value="critical">Crítica</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-mono-tech text-slate-300 mb-1">
                  Anotações Adicionais
                </label>
                <textarea
                  rows={2}
                  placeholder="Detalhes ou metas da reunião..."
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-cyan-500/30 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono-tech resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 font-hud cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-hud font-bold shadow-[0_0_12px_rgba(6,182,212,0.4)] cursor-pointer"
                >
                  Agendar Evento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
