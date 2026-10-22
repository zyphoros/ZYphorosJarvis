// Audio utilities for high-fidelity J.A.R.V.I.S. speech synthesis and browser fallback

export interface JarvisVoiceOption {
  id: string;
  name: string;
  label: string;
  description: string;
  gender: 'male' | 'female';
}

export const JARVIS_VOICE_OPTIONS: JarvisVoiceOption[] = [
  {
    id: 'Fenrir',
    name: 'Fenrir',
    label: 'Fenrir (JARVIS Cinema)',
    description: 'Voz profunda, calma e imponente (o tom clássico britânico de Paul Bettany)',
    gender: 'male',
  },
  {
    id: 'Charon',
    name: 'Charon',
    label: 'Charon (Conselheiro Formal)',
    description: 'Voz sóbria, estável e precisa para operações táticas',
    gender: 'male',
  },
  {
    id: 'Puck',
    name: 'Puck',
    label: 'Puck (Refinado & Ágil)',
    description: 'Voz dinâmica e articulada para interações ágeis de cowork',
    gender: 'male',
  },
  {
    id: 'Aoede',
    name: 'Aoede',
    label: 'Aoede (Sereno & Melódico)',
    description: 'Voz harmônica e calma com tom acolhedor',
    gender: 'female',
  },
];

/**
 * Strips code blocks, markdown symbols, and URLs to ensure smooth, natural speech reading
 */
export function cleanTextForSpeech(raw: string): string {
  if (!raw) return '';
  return raw
    .replace(/```[\s\S]*?```/g, 'Código listado no terminal.') // Skip code blocks
    .replace(/`([^`]+)`/g, '$1') // Remove backticks
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Convert markdown links to text
    .replace(/[*_#~>]/g, '') // Remove asterisks, headings, quote marks
    .replace(/https?:\/\/\S+/g, '') // Strip naked URLs
    .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '') // Strip emojis
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Converts a base64 audio string (RIFF WAV, MP3, or raw 16-bit PCM little-endian)
 * into a playable Blob. If raw PCM, prepends a standard 44-byte WAV header at 24000Hz mono.
 */
export function base64ToAudioBlob(base64: string, sampleRate = 24000): Blob {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  // 1. If it's already a WAV file (starts with "RIFF" and has "WAVE" at offset 8):
  if (
    len >= 12 &&
    binaryString.slice(0, 4) === 'RIFF' &&
    binaryString.slice(8, 12) === 'WAVE'
  ) {
    return new Blob([bytes], { type: 'audio/wav' });
  }

  // 2. If it's MP3 (starts with "ID3" or sync word 0xFFE0..0xFFFF):
  if (
    binaryString.slice(0, 3) === 'ID3' ||
    (bytes[0] === 0xff && (bytes[1] & 0xe0) === 0xe0)
  ) {
    return new Blob([bytes], { type: 'audio/mpeg' });
  }

  // 3. Otherwise wrap raw 16-bit mono PCM little-endian in a standard 44-byte WAV header:
  const wavHeader = new ArrayBuffer(44);
  const view = new DataView(wavHeader);

  // "RIFF"
  view.setUint32(0, 0x52494646, false);
  // Total file size minus 8
  view.setUint32(4, 36 + len, true);
  // "WAVE"
  view.setUint32(8, 0x57415645, false);
  // "fmt "
  view.setUint32(12, 0x666d7420, false);
  // Subchunk1Size (16 for PCM)
  view.setUint32(16, 16, true);
  // AudioFormat (1 = PCM)
  view.setUint16(20, 1, true);
  // NumChannels (1 = mono)
  view.setUint16(22, 1, true);
  // SampleRate (default 24000 Hz)
  view.setUint32(24, sampleRate, true);
  // ByteRate = SampleRate * NumChannels * BitsPerSample / 8
  view.setUint32(28, sampleRate * 1 * 2, true);
  // BlockAlign = NumChannels * BitsPerSample / 8
  view.setUint16(32, 2, true);
  // BitsPerSample (16)
  view.setUint16(34, 16, true);
  // "data"
  view.setUint32(36, 0x64617461, false);
  // Subchunk2Size (audio data length)
  view.setUint32(40, len, true);

  return new Blob([wavHeader, bytes], { type: 'audio/wav' });
}

/**
 * Searches the browser speech synthesis registry for the highest quality
 * Portuguese or deep British English voice to emulate JARVIS when offline.
 */
export function getBestBrowserVoice(): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return null;
  }

  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;

  // 1. Google Brazilian Portuguese (very natural pitch)
  const googlePt = voices.find(
    (v) => v.lang.includes('pt') && v.name.toLowerCase().includes('google')
  );
  if (googlePt) return googlePt;

  // 2. Microsoft natural male Portuguese voices (Antonio, Daniel, Felipe)
  const msPtMale = voices.find(
    (v) =>
      v.lang.includes('pt') &&
      (v.name.toLowerCase().includes('antonio') ||
        v.name.toLowerCase().includes('daniel') ||
        v.name.toLowerCase().includes('felipe') ||
        v.name.toLowerCase().includes('yuri'))
  );
  if (msPtMale) return msPtMale;

  // 3. Any Portuguese (pt-BR or pt-PT)
  const anyPt =
    voices.find((v) => v.lang.toLowerCase() === 'pt-br') ||
    voices.find((v) => v.lang.toLowerCase().startsWith('pt'));
  if (anyPt) return anyPt;

  // 4. Classic deep British English voice (Daniel, George, Oliver, UK)
  const britishMale = voices.find(
    (v) =>
      v.lang.includes('en') &&
      (v.name.toLowerCase().includes('george') ||
        v.name.toLowerCase().includes('daniel') ||
        v.name.toLowerCase().includes('uk male') ||
        v.name.toLowerCase().includes('oliver'))
  );
  if (britishMale) return britishMale;

  return voices[0] || null;
}
