import { Device, AgendaEvent, SearchSource } from '../types/jarvis';

export interface ChatResponse {
  reply: string;
  functionCalls?: Array<{
    name: string;
    args: Record<string, any>;
  }>;
  searchGrounding?: {
    queries: string[];
    sources: SearchSource[];
  };
  isLocalSubroutine?: boolean;
}

export async function sendJarvisMessage(params: {
  message: string;
  history: Array<{ role: 'user' | 'assistant'; content: string }>;
  devices: Device[];
  agenda: AgendaEvent[];
  activeProtocol: string;
  useSearch?: boolean;
  deepReasoning?: boolean;
  image?: string | null;
}): Promise<ChatResponse> {
  try {
    const response = await fetch('/api/jarvis/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: params.message,
        history: params.history,
        systemContext: {
          devices: params.devices.map(d => ({
            id: d.id,
            name: d.name,
            status: d.status,
            room: d.room,
            value: d.value,
            color: d.color,
            meta: d.meta,
          })),
          agenda: params.agenda.map(a => ({
            id: a.id,
            title: a.title,
            date: a.date,
            time: a.time,
            priority: a.priority,
            category: a.category,
          })),
          activeProtocol: params.activeProtocol,
        },
        useSearch: params.useSearch ?? false,
        deepReasoning: params.deepReasoning ?? false,
        image: params.image ?? null,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        reply: errorData.error || 'Às suas ordens, senhor. Subsistemas locais operando com sucesso.',
        functionCalls: [],
        isLocalSubroutine: true,
      };
    }

    return await response.json();
  } catch (err: any) {
    console.warn('Conexão ao servidor local com fallback:', err);
    return {
      reply: 'Comando recebido, senhor. O ecossistema está operando em contingência local.',
      functionCalls: [],
      isLocalSubroutine: true,
    };
  }
}

export async function requestJarvisTts(text: string, voice: string = 'Fenrir'): Promise<string | null> {
  try {
    const response = await fetch('/api/jarvis/tts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        voice,
      }),
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.audioBase64 || null;
  } catch (e) {
    return null;
  }
}

export async function requestBlueprint(prompt: string): Promise<string> {
  try {
    const response = await fetch('/api/jarvis/generate-blueprint', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Falha ao sintetizar blueprint holográfico');
    }

    const data = await response.json();
    return data.imageUrl;
  } catch (err: any) {
    throw err;
  }
}
