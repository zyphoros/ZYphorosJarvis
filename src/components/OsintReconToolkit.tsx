import React, { useState } from 'react';
import { useJarvisTheme } from '../theme/ThemeContext';
import {
  Shield,
  Search,
  Globe,
  Server,
  AlertTriangle,
  Lock,
  Unlock,
  Radio,
  FileText,
  Activity,
  CheckCircle,
  ExternalLink,
  Cpu,
} from 'lucide-react';

export const OsintReconToolkit: React.FC = () => {
  const { colors } = useJarvisTheme();
  const [target, setTarget] = useState('osirisai.live');
  const [queryType, setQueryType] = useState<'dns' | 'port_scan' | 'whois' | 'cve_lookup'>('dns');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>({
    success: true,
    type: 'dns',
    target: 'osirisai.live',
    records: {
      A: ['104.21.72.19', '172.67.182.204'],
      MX: [{ exchange: 'mail.osirisai.live', priority: 10 }],
      TXT: ['v=spf1 include:_spf.google.com ~all'],
      NS: ['ns1.cloudflare.com', 'ns2.cloudflare.com'],
    },
    timestamp: new Date().toISOString(),
  });

  const handleRunRecon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!target.trim() || loading) return;

    setLoading(true);
    try {
      const res = await fetch('/api/osint/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ queryType, target: target.trim() }),
      });
      if (res.ok) {
        const data = await res.json();
        setResult(data);
      }
    } catch (err: any) {
      setResult({ success: false, error: err.message || 'Falha na conexão com motor OSINT' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Top Banner */}
      <div className="bg-slate-900/80 backdrop-blur-md p-4 rounded-xl border border-cyan-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-cyan-400" />
            <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-cyan-300">
              Toolkit de Reconhecimento OSINT & Superfície de Ataque
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Inspeção profunda de domínios, endereços IP, registros DNS, sondagem de portas e busca de vulnerabilidades CVE em tempo real.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>MOTOR OSINT ATIVO</span>
        </div>
      </div>

      {/* Query Bar */}
      <form
        onSubmit={handleRunRecon}
        className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row items-center gap-3"
      >
        <div className="flex-1 w-full flex items-center bg-slate-900 border border-slate-700 rounded-lg px-3 py-2">
          <Search className="w-4 h-4 text-slate-400 mr-2" />
          <input
            type="text"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            placeholder="Alvo (ex: osirisai.live, 8.8.8.8, CVE-2024-3094)..."
            className="w-full bg-transparent border-none text-white font-mono text-xs focus:outline-none"
            required
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={queryType}
            onChange={(e) => setQueryType(e.target.value as any)}
            className="bg-slate-900 border border-slate-700 text-cyan-300 font-mono text-xs rounded-lg px-3 py-2.5 focus:outline-none focus:border-cyan-400"
          >
            <option value="dns">Registros DNS (A, MX, TXT, NS)</option>
            <option value="port_scan">Scanner de Portas (80, 443, 22...)</option>
            <option value="whois">Consulta WHOIS / RDAP</option>
            <option value="cve_lookup">Radar de Vulnerabilidades CVE</option>
          </select>

          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-colors whitespace-nowrap"
          >
            {loading ? (
              <>
                <Cpu className="w-3.5 h-3.5 animate-spin" />
                <span>Varrendo...</span>
              </>
            ) : (
              <>
                <Shield className="w-3.5 h-3.5" />
                <span>Iniciar Varredura</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Results Display */}
      {result && (
        <div className="bg-slate-900/90 backdrop-blur-md p-5 rounded-xl border border-cyan-500/40 shadow-xl font-mono text-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-sm">{result.target}</span>
              <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] uppercase font-bold">
                {result.type}
              </span>
            </div>
            <span className="text-[10px] text-slate-500">
              {result.timestamp ? new Date(result.timestamp).toLocaleString() : 'Recente'}
            </span>
          </div>

          {/* DNS Records Table */}
          {result.type === 'dns' && result.records && (
            <div className="space-y-3">
              <div>
                <span className="text-slate-400 text-[11px] block mb-1">Registros A (IPv4):</span>
                <div className="flex flex-wrap gap-2">
                  {result.records.A?.map((ip: string, i: number) => (
                    <span key={i} className="px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-emerald-400">
                      {ip}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-slate-400 text-[11px] block mb-1">Servidores de E-mail (MX):</span>
                <div className="space-y-1">
                  {result.records.MX?.map((mx: any, i: number) => (
                    <div key={i} className="p-2 rounded bg-slate-950 border border-slate-800 text-sky-300 flex justify-between">
                      <span>{mx.exchange}</span>
                      <span className="text-slate-500">Prioridade: {mx.priority}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-slate-400 text-[11px] block mb-1">Servidores DNS Autoritativos (NS):</span>
                <div className="flex flex-wrap gap-2">
                  {result.records.NS?.map((ns: string, i: number) => (
                    <span key={i} className="px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-cyan-300">
                      {ns}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-slate-400 text-[11px] block mb-1">Registros TXT / SPF:</span>
                <div className="space-y-1">
                  {result.records.TXT?.map((txt: string, i: number) => (
                    <div key={i} className="p-2 rounded bg-slate-950 border border-slate-800 text-slate-300 text-[11px]">
                      {txt}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Port Scanner Table */}
          {result.type === 'port_scan' && result.results && (
            <div className="space-y-3">
              <div className="text-emerald-400 text-xs font-semibold">{result.summary}</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {result.results.map((portInfo: any, idx: number) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg border flex items-center justify-between ${
                      portInfo.status === 'open'
                        ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
                        : 'bg-slate-950 border-slate-800 text-slate-500'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {portInfo.status === 'open' ? (
                        <Unlock className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Lock className="w-4 h-4 text-slate-600" />
                      )}
                      <span className="font-bold">Porta {portInfo.port}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-900">
                        {portInfo.status}
                      </span>
                      {portInfo.banner && (
                        <span className="text-[10px] text-slate-400 block mt-0.5">{portInfo.banner}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* WHOIS Data */}
          {result.type === 'whois' && result.data && (
            <div className="space-y-2 text-slate-300">
              <div className="grid grid-cols-2 gap-2 p-3 bg-slate-950 rounded-lg border border-slate-800">
                <div>Registrador: <span className="text-white font-bold">{result.data.registrar}</span></div>
                <div>País de Origem: <span className="text-white font-bold">{result.data.country}</span></div>
                <div>Criado em: <span className="text-cyan-300">{result.data.creationDate}</span></div>
                <div>DNSSEC: <span className="text-emerald-400">{result.data.dnssec}</span></div>
              </div>
              <div className="text-[11px] text-slate-400">
                Status: {result.data.status?.join(', ')}
              </div>
            </div>
          )}

          {/* CVE Vulnerability Table */}
          {result.type === 'cve_lookup' && result.cves && (
            <div className="space-y-2.5">
              {result.cves.map((cve: any) => (
                <div
                  key={cve.id}
                  className="p-3.5 rounded-lg bg-slate-950 border border-rose-500/30 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-rose-500" />
                      <span className="font-bold text-rose-400 text-sm">{cve.id}</span>
                      <span className="px-2 py-0.2 rounded bg-rose-500/20 text-rose-300 text-[10px] font-bold">
                        {cve.severity} (CVSS {cve.score})
                      </span>
                    </div>
                    <span className="text-emerald-400 text-[10px] font-bold">{cve.status}</span>
                  </div>
                  <p className="text-slate-300 text-[11px]">{cve.description}</p>
                  <div className="text-[10px] text-slate-500">Afeta: {cve.affected}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
