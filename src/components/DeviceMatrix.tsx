import React from 'react';
import { Device, RoomType } from '../types/jarvis';
import { soundEffects } from '../services/soundEffects';
import {
  Lightbulb,
  Thermometer,
  Shield,
  ShieldAlert,
  Plane,
  Music,
  Bot,
  Zap,
  Sliders,
  Power,
  RotateCw,
  Sun,
  Volume2,
} from 'lucide-react';

interface DeviceMatrixProps {
  devices: Device[];
  onUpdateDevice: (id: string, updates: Partial<Device>) => void;
  onExecuteVoiceCommand?: (command: string) => void;
}

export const DeviceMatrix: React.FC<DeviceMatrixProps> = ({
  devices,
  onUpdateDevice,
  onExecuteVoiceCommand,
}) => {
  const [selectedRoom, setSelectedRoom] = React.useState<RoomType | 'all'>('all');

  const rooms: Array<{ id: RoomType | 'all'; label: string }> = [
    { id: 'all', label: 'Todos os Ambientes' },
    { id: 'living', label: 'Salão Principal' },
    { id: 'lab', label: 'Laboratório Stark' },
    { id: 'security', label: 'Perímetro & Defesa' },
    { id: 'media', label: 'Mídia & Áudio' },
  ];

  const filteredDevices = selectedRoom === 'all'
    ? devices
    : devices.filter(d => d.room === selectedRoom);

  const toggleDevice = (device: Device) => {
    const nextStatus = !device.status;
    soundEffects.playToggle(nextStatus);
    onUpdateDevice(device.id, { status: nextStatus });
  };

  const setDeviceBrightness = (device: Device, value: number) => {
    onUpdateDevice(device.id, { value, status: value > 0 });
  };

  const setDeviceColor = (device: Device, color: string) => {
    soundEffects.playConfirm();
    onUpdateDevice(device.id, { color, status: true });
  };

  const setTemperature = (device: Device, delta: number) => {
    soundEffects.playHudClick();
    const current = device.value || 22;
    const next = Math.max(16, Math.min(30, current + delta));
    onUpdateDevice(device.id, { value: next });
  };

  const getDeviceIcon = (device: Device) => {
    switch (device.type) {
      case 'light':
        return Lightbulb;
      case 'thermostat':
        return Thermometer;
      case 'lock':
        return device.status ? Shield : ShieldAlert;
      case 'drone':
        return Plane;
      case 'sound':
        return Music;
      case 'robotics':
        return Bot;
      default:
        return Zap;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Room Filter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg md:text-xl font-bold font-hud text-cyan-300 flex items-center gap-2">
            <Sliders className="w-5 h-5 text-cyan-400" />
            Matriz de Dispositivos Conectados
          </h2>
          <p className="text-xs text-slate-400 font-mono-tech mt-0.5">
            Sincronização Mesh em tempo real com barramento Stark IoT
          </p>
        </div>

        {/* Room selector buttons */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-900/90 p-1.5 rounded-xl border border-cyan-500/20 text-xs">
          {rooms.map(room => (
            <button
              key={room.id}
              onClick={() => {
                soundEffects.playHudClick();
                setSelectedRoom(room.id);
              }}
              className={`px-3 py-1.5 rounded-lg transition-all font-hud font-medium cursor-pointer ${
                selectedRoom === room.id
                  ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-400/40 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              {room.label}
            </button>
          ))}
        </div>
      </div>

      {/* Devices Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredDevices.map(device => {
          const Icon = getDeviceIcon(device);
          const isActive = device.status;

          return (
            <div
              key={device.id}
              className={`hud-glass rounded-2xl p-5 border transition-all duration-300 ${
                isActive
                  ? 'border-cyan-400/40 shadow-[0_0_20px_rgba(6,182,212,0.12)]'
                  : 'border-slate-800/70 opacity-80'
              }`}
            >
              {/* Card top */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-3 rounded-xl border transition-all ${
                      isActive
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                        : 'bg-slate-900 border-slate-700/60 text-slate-500'
                    }`}
                    style={
                      device.color && isActive
                        ? { borderColor: device.color, color: device.color }
                        : {}
                    }
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-hud font-bold text-sm md:text-base text-slate-100">
                      {device.name}
                    </h3>
                    <div className="text-[11px] font-mono-tech text-cyan-400/70">
                      {device.roomLabel}
                    </div>
                  </div>
                </div>

                {/* Primary power toggle button */}
                <button
                  onClick={() => toggleDevice(device)}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                    isActive
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                      : 'bg-slate-900 border-slate-700 text-slate-500 hover:text-slate-300'
                  }`}
                  title={isActive ? 'Desativar dispositivo' : 'Ativar dispositivo'}
                >
                  <Power className="w-4 h-4" />
                </button>
              </div>

              {/* Status pill & specifics */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="font-mono-tech text-slate-400 text-[11px]">
                  ESTADO:
                </span>
                <span
                  className={`px-2 py-0.5 rounded font-hud text-[11px] font-semibold border ${
                    isActive
                      ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  {device.type === 'lock'
                    ? isActive ? 'TRAVADO & BLINDADO' : 'DESTRANCADO'
                    : device.type === 'drone'
                    ? isActive ? 'EM PATRULHA AÉREA' : 'NA DOCA DE RECARGA'
                    : isActive ? 'LIGADO / ATIVO' : 'DESLIGADO'}
                </span>
              </div>

              {/* Specific Device Controls */}
              {device.type === 'light' && (
                <div className="mt-4 space-y-3">
                  <div>
                    <div className="flex justify-between text-xs font-mono-tech text-slate-300 mb-1.5">
                      <span className="flex items-center gap-1">
                        <Sun className="w-3.5 h-3.5 text-amber-400" /> Intensidade
                      </span>
                      <span>{device.value ?? 100}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={device.value ?? 100}
                      onChange={(e) => setDeviceBrightness(device, Number(e.target.value))}
                      className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                    />
                  </div>

                  {/* Preset colors */}
                  <div>
                    <span className="text-[11px] font-mono-tech text-slate-400 block mb-1.5">
                      Assinatura de Cor Quântica:
                    </span>
                    <div className="flex items-center gap-2">
                      {[
                        { name: 'Stark Cyan', hex: '#00e5ff' },
                        { name: 'Arc Blue', hex: '#3b82f6' },
                        { name: 'Mark III Red', hex: '#ef4444' },
                        { name: 'Gold Armor', hex: '#f59e0b' },
                        { name: 'Emerald', hex: '#10b981' },
                        { name: 'Warm White', hex: '#fef08a' },
                      ].map((c) => (
                        <button
                          key={c.hex}
                          onClick={() => setDeviceColor(device, c.hex)}
                          className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 cursor-pointer ${
                            device.color === c.hex ? 'scale-110 border-white shadow-[0_0_8px_rgba(255,255,255,0.7)]' : 'border-transparent'
                          }`}
                          style={{ backgroundColor: c.hex }}
                          title={c.name}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {device.type === 'thermostat' && (
                <div className="mt-4 flex items-center justify-between bg-slate-900/60 p-3 rounded-xl border border-cyan-500/15">
                  <div>
                    <div className="text-2xl font-bold font-hud text-cyan-300">
                      {device.value ?? 22}°C
                    </div>
                    <div className="text-[11px] font-mono-tech text-slate-400">
                      Umidade: {device.meta?.humidity || 48}% • Modo Eco
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setTemperature(device, -1)}
                      className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600 text-cyan-300 font-bold flex items-center justify-center cursor-pointer transition-colors"
                      title="Diminuir temperatura"
                    >
                      -
                    </button>
                    <button
                      onClick={() => setTemperature(device, 1)}
                      className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600 text-cyan-300 font-bold flex items-center justify-center cursor-pointer transition-colors"
                      title="Aumentar temperatura"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              {device.type === 'drone' && (
                <div className="mt-4 bg-slate-900/60 p-3 rounded-xl border border-cyan-500/15 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono-tech">
                    <span className="text-slate-400">Bateria do Drone:</span>
                    <span className="text-cyan-300 font-bold">{device.meta?.battery || 92}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-cyan-400 rounded-full"
                      style={{ width: `${device.meta?.battery || 92}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-mono-tech text-slate-400">
                    <span>Altitude: 45m</span>
                    <span>Câmera Térmica: ATIVA</span>
                  </div>
                </div>
              )}

              {device.type === 'sound' && (
                <div className="mt-4 space-y-3">
                  <div className="bg-slate-900/60 p-2.5 rounded-xl border border-cyan-500/15 flex items-center gap-2">
                    <Music className="w-4 h-4 text-cyan-400 animate-pulse" />
                    <span className="text-xs font-hud text-slate-200 truncate">
                      {device.meta?.currentTrack || 'AC/DC - Back in Black (Remaster)'}
                    </span>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-mono-tech text-slate-300 mb-1">
                      <span className="flex items-center gap-1">
                        <Volume2 className="w-3.5 h-3.5 text-cyan-400" /> Volume
                      </span>
                      <span>{device.value ?? 65}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={device.value ?? 65}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        onUpdateDevice(device.id, { value: val, status: val > 0 });
                      }}
                      className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                    />
                  </div>
                </div>
              )}

              {device.type === 'robotics' && (
                <div className="mt-4 bg-slate-900/60 p-3 rounded-xl border border-cyan-500/15 flex items-center justify-between">
                  <div className="text-xs font-mono-tech text-slate-300">
                    <div>Atuador Pneumático: OK</div>
                    <div className="text-[10px] text-cyan-400/80">Extintor e Solda acoplados</div>
                  </div>
                  <button
                    onClick={() => {
                      soundEffects.playConfirm();
                      onUpdateDevice(device.id, {
                        status: !device.status,
                        meta: { mode: device.status ? 'Standby' : 'Calibrando Mark VII' },
                      });
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-cyan-500/20 border border-cyan-400 text-cyan-300 text-xs font-hud cursor-pointer hover:bg-cyan-500/30 flex items-center gap-1.5"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                    Calibrar
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Voice command suggestion chip bar */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-cyan-500/20 flex flex-wrap items-center gap-2">
        <span className="text-xs font-hud text-cyan-300 font-semibold mr-2 flex items-center gap-1.5">
          <Zap className="w-4 h-4 text-amber-400" />
          Comandos Rápidos de Voz:
        </span>
        {[
          'Jarvis, acenda as luzes do laboratório em vermelho',
          'Jarvis, ajuste a temperatura para 20 graus',
          'Jarvis, inicie patrulha com o drone',
          'Jarvis, aumente o som para 80%',
          'Jarvis, destranque as travas de segurança',
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
    </div>
  );
};
