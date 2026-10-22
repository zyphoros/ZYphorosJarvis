# JARVIS + OSIRIS.AI — Arquitetura de Identidade Visual, Avatar Humanoide & Suíte de Cowork

Plano de evolução incremental do projeto JARVIS existente, integrando uma **nova identidade visual futurista e premium**, o **Avatar Humanoide 3D/WebGL interativo do JARVIS com rastreamento ocular do cursor em tempo real**, o **Sistema de Personalização Visual Global com Temas e Variáveis CSS**, a **plataforma geoespacial global Osiris.ai em tamanho real** (todas as camadas: tráfego aéreo ADS-B, malha naval AIS, cabos submarinos, câmeras CCTV, georriscos USGS/NASA, radar geopolítico GDELT e iluminação solar dia/noite), o **Terminal de Cowork de Programação** e o **Motor de Diretrizes Autônomas por Voz**.

---

> [!IMPORTANT]
> **Decisões Críticas de Arquitetura & Preservação do Projeto:**
> 1. **Regra de Não-Destruição**: Não criar um aplicativo paralelo do zero. Evoluir diretamente o codebase atual (`server.ts`, serviços de IA Gemini, TTS, reconhecimento de fala, PWA e controles) integrando os novos módulos sem perda de dados.
> 2. **Avatar Humanoide Interativo**: Rosto holográfico adulto digital projetado com malha facial e olhos com rastreamento das coordenadas $(x, y)$ do mouse em qualquer ponto da janela, interpolação suave, piscar aleatório natural, animação de despertar (*wake-up*), sincronização visual com o áudio (*speaking*) e estado de raciocínio (*thinking*).
> 3. **Sistema de Personalização Visual em Tempo Real**: Tokens de design CSS globais (`--jarvis-primary`, `--jarvis-secondary`, `--jarvis-accent`, `--jarvis-glow`, `--jarvis-avatar`, `--jarvis-eyes`, `--jarvis-panel`, `--jarvis-bg`), 8 temas predefinidos (Jarvis Classic, Neon Purple, Emerald AI, Arctic White, Cyber Red, Solar Gold, Ocean Blue, Custom), seletores de cor nativos + HEX, persistência em `localStorage` e modo de alto desempenho para hardware com 8 GB de RAM.
> 4. **Plataforma Osiris.ai em Tela Cheia**: Mapa global 3D/2D contínuo como área operacional de fundo, com HUD flutuante translúcido para que a navegação pelo globo permaneça 100% interativa sem bloqueio do avatar.
> 5. **Cowork e Terminal com IA**: Ambiente de execução de scripts, navegação de arquivos do workspace, pesquisa web profunda com fontes e tarefas iterativas com aprovação passo a passo.
> 6. **Motor de Auto-Diretrizes**: O usuário comanda em voz (*"a partir de agora me dê atualizações sobre o dólar"*) e o Jarvis assimila a regra, ativando observadores e widgets dinâmicos no dashboard.

---

## 1. Visão Geral & Conceito do Sistema

O sistema evolui de um protótipo temático para uma **Plataforma de Inteligência Pessoal e Desenvolvimento Operacional** com estética de centro de comando cibernético de última geração:

- **Identidade Visual**: Fundo ultra-escuro aeroespacial (`#030712` e `#070e1e`), linhas ciano/elétricas (`#00d9ff` e `#38bdf8`), acentos metálicos sutis, vidro fosco com glassmorphism moderado, tipografia limpa (`Plus Jakarta Sans` para UI e `JetBrains Mono` com `tabular-nums` para telemetria/código).
- **Presença do Avatar**: Um busto holográfico tridimensional adulto, sóbrio e atento que mantém contato visual dinâmico com o usuário através do ponteiro do mouse, reage aos comandos de voz e se ilumina conforme seu estado cognitivo.
- **Camadas Geoespaciais Osiris.ai**: Dados de satélite, radar aéreo ADS-B em tempo real, AIS de frotas mercantes, cabos de telecomunicações submarinos, câmeras públicas urbanas e sismógrafos.
- **Estação de Trabalho**: Terminal iterativo que programa e executa scripts, gerencia tarefas de desenvolvimento e sintetiza inteligência da web.

---

## 2. Experiência do Usuário & Design Visual

### A. Avatar Humanoide Interativo (Rosto 3D / WebGL)
- **Rastreamento Ocular e Cefálico**:
  - As coordenadas normalizadas da tela $(nx, ny) \in [-1, 1]$ alimentam o cálculo de rotação da cabeça (yaw e pitch limitados a $\pm 25^\circ$) e rotação independente dos globos oculares/íris (limitados a $\pm 35^\circ$).
  - Interpolação via amortecimento exponencial (*lerp*) com fator $\alpha \approx 0.08$ para movimento orgânico sem travamentos.
- **Comportamento Autônomo & Fisiológico**:
  - Pálpebras com piscar aleatório a cada 3 a 6 segundos com duração de 120ms.
  - Micro-movimentos involuntários de respiração e pequenos ajustes sacádicos de olhar quando o cursor estiver imóvel.
  - Animação de despertar ao inicializar ou receber wake-word ("Jarvis").
- **Sincronização de Estados**:
  - `idle`: Respiração sutil, olhar atento ao cursor, brilho constante suave.
  - `listening`: Halo emissivo expandido, olhos focados, ondas de frequência ativas.
  - `thinking`: Rotação de partículas no núcleo neural, ligeira inclinação pensativa da cabeça.
  - `speaking`: Modulação do contorno labial e mandíbula sincronizada em tempo real com o analisador de frequência de áudio (Web Audio API / TTS).
  - `error`: Transição cromática temporária e postura de alerta.

### B. Sistema Global de Personalização & Temas
- **Painel de Configuração Visual**:
  - Seletores de cor interativos com suporte a input color nativo e edição direta de código HEX validado.
  - Configuração granular independente: Cor Primária, Secundária, Destaque, Brilho Holográfico, Cor do Rosto, Cor dos Olhos, Cor do Fundo e Opacidade dos Painéis.
- **Temas Instantâneos (1 Clique)**:
  1. *Jarvis Classic*: Ciano (#00d9ff), Azul Marinho (#030712), Prata Metálico (#94a3b8).
  2. *Neon Purple*: Violeta (#a855f7), Roxo Profundo (#3b0764), Magenta (#ec4899).
  3. *Emerald AI*: Verde Esmeralda (#10b981), Menta (#34d399), Preto Grafite (#022c22).
  4. *Arctic White*: Branco Puro (#ffffff), Azul Gelo (#e0f2fe), Cinza Titânio (#334155).
  5. *Cyber Red*: Vermelho Alerta (#ef4444), Carmesim (#991b1b), Carvão (#09090b).
  6. *Solar Gold*: Ouro Amber (#f59e0b), Dourado (#fbbf24), Bronze (#451a03).
  7. *Ocean Blue*: Azul Profundo (#0284c7), Turquesa (#06b6d4), Azul Abissal (#082f49).
  8. *Custom*: Salva as escolhas personalizadas do usuário no `localStorage`.
- **Desempenho e Acessibilidade**:
  - Chaveador *"Modo Alto Desempenho"* para máquinas com 8 GB de RAM e GPU integrada: desativa sombras complexas e reduz contagem de partículas no canvas, preservando 60 FPS contínuos e o rastreamento do mouse.
  - Conformidade com `prefers-reduced-motion` e checagem de contraste de texto.

---

## 3. Integração com a Plataforma Osiris.ai & Módulos Operacionais

### A. Mapa Global Osiris.ai em Tamanho Real
- **Arquitetura Visual**:
  - O mapa renderiza em canvas 3D com projeção esférica e Mercator ocupando 100% da viewport.
  - Os painéis de HUD (Console, Terminal, Diretrizes, Agenda) flutuam como camadas de vidro translúcido responsivo sobre o mapa, com botão de recolhimento para visualização panorâmica.
- **Camadas Geoespaciais Completas**:
  - `sdk_air`: Malha de rotas aéreas e voos civis/comerciais com altitude, velocidade, origem e destino.
  - `sdk_naval`: Corredores de navegação mercante (Suez, Panamá, Estreito de Malaca) com posições AIS de cargueiros e petroleiros.
  - `cables`: Rede de fibra óptica submarina global com landing stations continentais.
  - `day_night`: Terminador solar dinâmico indicando iluminação e sombra do planeta.
  - `cctv_network`: Rede de câmeras públicas mundiais com visualizador de streaming.
  - `geohazards`: Monitor de sismos globais (USGS) e focos térmicos (NASA FIRMS).
  - `conflict_news`: Feeds de inteligência geopolítica e alertas de incidentes globais (GDELT).

### B. Terminal de Cowork & Programação
- Console interativo de comandos (`run`, `test`, `build`, `clear`, `help`).
- Execução segura de scripts no backend Node.js (`/api/terminal/run`).
- Gerenciador de arquivos do projeto com leitura, edição e geração de código.
- Agente passo a passo para resolução autônoma de problemas técnicos.

### C. Motor de Auto-Diretrizes do Sistema
- Registro de regras assimiladas por comandos como *"A partir de agora me alerte sobre o câmbio do dólar"*.
- Acoplamento automático de observadores periódicos e cartões dinâmicos de telemetria (ex: Dólar comercial, Criptomoedas, Alertas climáticos).
- Painel para consultar, pausar, editar ou revogar diretrizes a qualquer momento.

### D. Toolkit OSINT Integrado
- Consultas reais de DNS (A, AAAA, MX, TXT, NS), WHOIS de domínios, análise de certificados SSL e pesquisa no banco de dados de vulnerabilidades CVE.

---

## 4. Diagrama de Arquitetura Técnica

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                       FULL VIEWPORT 3D CANVAS                                           │
│                 OSIRIS.AI GLOBAL INTELLIGENCE MAP (Air · Naval · Cables · CCTV · D/N)                   │
└────────────────────────────────────────────────────┬────────────────────────────────────────────────────┘
                                                     │
                   ┌─────────────────────────────────┴─────────────────────────────────┐
                   ▼                                                                   ▼
   ┌──────────────────────────────────────────────┐                   ┌───────────────────────────────────┐
   │        JARVIS FLOATING HUD INTERFACE         │                   │   INTERACTIVE TERMINAL WORKSPACE  │
   │  ┌────────────────────────────────────────┐  │                   │  ┌─────────────────────────────┐  │
   │  │   HUMANOID AVATAR (Interactive 3D Face)│  │                   │  │ Interactive Code Runner     │  │
   │  │   - Eye & Head Mouse Tracking (x, y)   │  │                   │  │ JS / TS / Python Executor   │  │
   │  │   - Natural Blinking & Mouth Sync      │  │                   │  │ Project Files Explorer      │  │
   │  │   - Emotional & Cognition States       │  │                   │  │ Step-by-Step Task Agent     │  │
   │  └────────────────────────────────────────┘  │                   │  └─────────────────────────────┘  │
   │  ┌────────────────────────────────────────┐  │                   │  ┌─────────────────────────────┐  │
   │  │   COWORK CONSOLE & VOICE CONTROLLER    │  │                   │  │ OSINT TOOLKIT (DNS/WHOIS)   │  │
   │  │   - Speech-to-Text & Gemini TTS        │  │                   │  │ CVE Radar & SSL Inspector   │  │
   │  │   - Deep Web Research Engine           │  │                   │  └─────────────────────────────┘  │
   │  └────────────────────────────────────────┘  │                   └─────────────────┬─────────────────┘
   │  ┌────────────────────────────────────────┐  │                                     │
   │  │   AUTO-DIRECTIVES & THEME ENGINE       │  │                                     │
   │  │   - CSS Theme Variables (8 Presets)    │  │                                     │
   │  │   - Dynamic Watchers (USD, Crypto)     │  │                                     │
   │  │   - High Performance Mode Switch       │  │                                     │
   │  └────────────────────────────────────────┘  │                                     │
   └──────────────────────┬───────────────────────┘                                     │
                          │                                                             │
                          └──────────────────────────────┬──────────────────────────────┘
                                                         │
                                                         ▼
                                   ┌───────────────────────────────────────────┐
                                   │        FULL-STACK EXPRESS BACKEND         │
                                   │        (server.ts on Port 3000)           │
                                   │  - /api/jarvis/chat (Gemini AI + Tools)   │
                                   │  - /api/jarvis/tts (Voice Synthesis)      │
                                   │  - /api/terminal/run (Script Execution)   │
                                   │  - /api/osint/query (Network Recon)       │
                                   │  - /api/market/ticker (Real-time Finance) │
                                   └───────────────────────────────────────────┘
```

---

## 5. Sequência Passo a Passo de Implementação

1. **Diagnóstico & Preservação**:
   - Mapear a base atual (`server.ts`, rotas de API, `src/services/`, componentes existentes e dependências).
   - Preservar os contratos funcionais de IA e voz.
2. **Tokens de Design & Sistema Global de Temas**:
   - Criar `src/theme/ThemeContext.tsx` e `src/theme/themeTokens.ts` gerenciando variáveis CSS e persistência no `localStorage`.
   - Adicionar o componente de Personalização Visual com seletores de cor HEX e os 8 temas prontos.
3. **Avatar Humanoide Interativo 3D/Canvas (`JarvisAvatar.tsx`)**:
   - Construir o componente de avatar facial com modelo geométrico translúcido, olhos com pupilas móveis que acompanham as coordenadas $(x, y)$ do mouse em toda a janela, interpolação suave, pálpebras articuladas com piscar natural, animação de despertar e modulação vocal.
4. **Integração do Mapa Global Osiris.ai em Tela Cheia (`OsirisGlobalMap.tsx`)**:
   - Renderizar o globo/mapa 3D contínuo ao fundo com todas as camadas geoespaciais ativas (tráfego aéreo ADS-B, rotas navais AIS, cabos submarinos, câmeras CCTV, georriscos e ciclo dia/noite).
5. **HUD Flutuante & Console de Cowork (`CoworkConsole.tsx` / `JarvisHUD.tsx`)**:
   - Integrar o Avatar, o chat com IA, os controles de áudio e a entrada de comandos em um painel flutuante elegante que não bloqueia o mapa.
6. **Motor de Diretrizes Autônomas por Voz (`AutoDirectivesPanel.tsx`)**:
   - Implementar a assimilação de diretrizes em linguagem natural (ex: monitorar o dólar) e exibir widgets dinâmicos configuráveis.
7. **Workspace de Terminal & OSINT (`CoworkTerminalWorkspace.tsx` e `OsintReconToolkit.tsx`)**:
   - Implementar o terminal com execução de código via backend e as ferramentas de reconhecimento de rede.
8. **Validação & Compilação**:
   - Executar compilação com `compile_applet` e verificação com `lint_applet` para assegurar build sem erros.
