# Arquitetura Corrigida - Integração Jitsi Meet com SDK Nativo

**Versão:** 1.0  
**Status:** Pronto para Implementação  
**Abordagem:** SDK Nativo + Event Bridge + Socket.io para Sincronização  

---

## 1. Visão Geral da Solução

A solução corrigida utiliza **SDK Nativo `@jitsi/react-native-sdk`** com uma arquitetura robusta que permite:

- ✅ Renderização nativa da conferência dentro do app
- ✅ Acesso a eventos de conferência em tempo real
- ✅ Sincronização de dados de personagem
- ✅ Implementação de HUD, Dice Roller e Master Panel
- ✅ Suporte completo a Android, iOS e Web
- ✅ Tratamento robusto de erros e fallbacks
- ✅ Logging estruturado para debugging

---

## 2. Arquitetura de Componentes Corrigida

### 2.1 Estrutura de Diretórios Proposta

```
rpg-meet-app/
├── services/
│   ├── jitsi-service.ts              # ✅ Novo: Gerenciador Jitsi
│   ├── conference-manager.ts         # ✅ Novo: Gerenciador de conferência
│   ├── event-bridge.ts               # ✅ Novo: Bridge de eventos
│   ├── socket-service.ts             # ✅ Novo: Socket.io para sincronização
│   └── error-handler.ts              # ✅ Novo: Tratamento de erros
├── hooks/
│   ├── use-jitsi-conference.ts       # ✅ Novo: Hook para conferência
│   ├── use-conference-events.ts      # ✅ Novo: Hook para eventos
│   └── use-character-sync.ts         # ✅ Novo: Hook para sincronização
├── store/
│   ├── conference-store.ts           # ✅ Novo: Zustand store para conferência
│   └── participants-store.ts         # ✅ Novo: Zustand store para participantes
├── components/
│   ├── jitsi-conference-view.tsx     # ✅ Novo: Componente principal Jitsi
│   ├── participant-hud.tsx           # ✅ Novo: HUD de participante
│   ├── dice-roller-overlay.tsx       # ✅ Novo: Dice roller integrado
│   ├── master-controls.tsx           # ✅ Novo: Controles do mestre
│   └── conference-error-boundary.tsx # ✅ Novo: Error boundary
├── types/
│   ├── jitsi.ts                      # ✅ Novo: Tipos Jitsi
│   ├── conference.ts                 # ✅ Novo: Tipos de conferência
│   └── events.ts                     # ✅ Novo: Tipos de eventos
├── constants/
│   └── jitsi-config.ts               # ✅ Novo: Configuração Jitsi
├── app/
│   └── video-conference.tsx          # ✅ Refatorado: Usa novo componente
└── JITSI_IMPLEMENTATION.md           # ✅ Novo: Guia de implementação
```

---

## 3. Fluxo de Dados Proposto

### 3.1 Fluxo de Criação de Sessão

```
Lobby Screen
    ↓
Validação de Parâmetros (Zod)
    ↓
Inicializar JitsiService
    ↓
Configurar Event Listeners
    ↓
Iniciar Conferência (SDK Nativo)
    ↓
Conference Screen Renderiza
    ↓
Event Bridge Sincroniza Dados
    ↓
Mostrar HUD de Participantes
    ↓
Ativar Dice Roller e Master Panel
```

### 3.2 Fluxo de Sincronização em Tempo Real

```
Evento Jitsi (PARTICIPANT_JOINED)
    ↓
JitsiService Captura Evento
    ↓
Event Bridge Processa Evento
    ↓
Socket.io Envia para Backend
    ↓
Backend Sincroniza com Participantes
    ↓
Zustand Store Atualiza Estado
    ↓
UI Renderiza Mudanças
```

---

## 4. Componentes Principais Propostos

### 4.1 JitsiService (Gerenciador Central)

```typescript
interface JitsiService {
  // Inicialização
  initialize(): Promise<void>;
  
  // Conferência
  startConference(config: ConferenceConfig): Promise<void>;
  endConference(): Promise<void>;
  
  // Participantes
  getParticipants(): Participant[];
  muteParticipant(participantId: string): Promise<void>;
  
  // Eventos
  onConferenceJoined(callback: () => void): Unsubscribe;
  onParticipantJoined(callback: (participant: Participant) => void): Unsubscribe;
  onParticipantLeft(callback: (participantId: string) => void): Unsubscribe;
  
  // Limpeza
  cleanup(): Promise<void>;
}
```

### 4.2 EventBridge (Sincronização de Eventos)

```typescript
interface EventBridge {
  // Mapear eventos Jitsi para eventos de app
  mapConferenceEvent(event: JitsiEvent): AppEvent;
  
  // Sincronizar com backend
  syncEvent(event: AppEvent): Promise<void>;
  
  // Atualizar UI
  updateUI(event: AppEvent): void;
}
```

### 4.3 ConferenceStore (Zustand)

```typescript
interface ConferenceStore {
  // Estado
  conferenceId: string;
  participants: Participant[];
  isConnected: boolean;
  error: Error | null;
  
  // Ações
  setConferenceId(id: string): void;
  addParticipant(participant: Participant): void;
  removeParticipant(participantId: string): void;
  setConnected(connected: boolean): void;
  setError(error: Error | null): void;
}
```

---

## 5. Tipos TypeScript Propostos

### 5.1 Tipos Jitsi

```typescript
// types/jitsi.ts

export interface JitsiConfig {
  serverUrl: string;
  roomName: string;
  displayName: string;
  jwt?: string; // Para autenticação
  userInfo?: {
    displayName: string;
    email?: string;
    affiliation?: string;
  };
  configOverwrite?: Record<string, any>;
  interfaceConfigOverwrite?: Record<string, any>;
}

export interface Participant {
  id: string;
  displayName: string;
  isAudioMuted: boolean;
  isVideoMuted: boolean;
  isModerator: boolean;
  avatar?: string;
  character?: CharacterInfo;
}

export interface CharacterInfo {
  name: string;
  class: string;
  hp: number;
  maxHp: number;
  mana: number;
  maxMana: number;
}

export interface JitsiEvent {
  type: JitsiEventType;
  data: Record<string, any>;
  timestamp: number;
}

export enum JitsiEventType {
  CONFERENCE_JOINED = 'CONFERENCE_JOINED',
  CONFERENCE_LEFT = 'CONFERENCE_LEFT',
  PARTICIPANT_JOINED = 'PARTICIPANT_JOINED',
  PARTICIPANT_LEFT = 'PARTICIPANT_LEFT',
  AUDIO_MUTED_CHANGED = 'AUDIO_MUTED_CHANGED',
  VIDEO_MUTED_CHANGED = 'VIDEO_MUTED_CHANGED',
  DISPLAY_NAME_CHANGED = 'DISPLAY_NAME_CHANGED',
}
```

### 5.2 Tipos de Erro

```typescript
// types/errors.ts

export enum JitsiErrorCode {
  INITIALIZATION_FAILED = 'INITIALIZATION_FAILED',
  CONFERENCE_FAILED = 'CONFERENCE_FAILED',
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT = 'TIMEOUT',
  INVALID_CONFIG = 'INVALID_CONFIG',
}

export class JitsiError extends Error {
  constructor(
    public code: JitsiErrorCode,
    public message: string,
    public originalError?: Error,
  ) {
    super(message);
  }
}
```

---

## 6. Configuração Proposta

### 6.1 Configuração Jitsi

```typescript
// constants/jitsi-config.ts

export const JITSI_CONFIG = {
  // Servidor
  serverUrl: process.env.JITSI_SERVER_URL || 'https://meet.jitsi.org',
  
  // Configurações de conferência
  conference: {
    startWithAudioMuted: false,
    startWithVideoMuted: false,
    disableAudioLevels: false,
    enableWelcomePage: false,
    enableClosePage: false,
  },
  
  // Configurações de interface
  interface: {
    SHOW_JITSI_WATERMARK: false,
    SHOW_WATERMARK_FOR_GUESTS: false,
    TOOLBAR_BUTTONS: [
      'microphone',
      'camera',
      'desktop',
      'fullscreen',
      'fodeviceselection',
      'hangup',
      'profile',
      'chat',
      'recording',
      'livestreaming',
      'etherpad',
      'settings',
      'raisehand',
      'videoquality',
      'filmstrip',
      'invite',
      'feedback',
      'stats',
      'shortcuts',
      'tileview',
      'videobackgroundblur',
      'download',
      'help',
      'mute-everyone',
      'e2ee',
    ],
  },
  
  // Retry
  retry: {
    maxAttempts: 3,
    initialDelay: 1000,
    maxDelay: 10000,
    backoffMultiplier: 2,
  },
  
  // Timeout
  timeout: 30000,
};
```

### 6.2 Configuração de Permissões

```typescript
// constants/permissions-config.ts

export const PERMISSIONS_CONFIG = {
  android: {
    permissions: [
      'android.permission.CAMERA',
      'android.permission.RECORD_AUDIO',
      'android.permission.INTERNET',
      'android.permission.ACCESS_NETWORK_STATE',
      'android.permission.MODIFY_AUDIO_SETTINGS',
      'android.permission.BLUETOOTH',
      'android.permission.BLUETOOTH_ADMIN',
    ],
  },
  ios: {
    infoPlist: {
      NSCameraUsageDescription: 'Precisamos acessar sua câmera para videoconferência',
      NSMicrophoneUsageDescription: 'Precisamos acessar seu microfone para videoconferência',
      NSLocalNetworkUsageDescription: 'Permitir acesso à rede local para melhor qualidade',
      NSBonjourServices: ['_http._tcp', '_https._tcp'],
    },
  },
};
```

---

## 7. Tratamento de Erros Proposto

### 7.1 Estratégia de Retry

```typescript
interface RetryStrategy {
  maxAttempts: number;
  initialDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
}

async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  strategy: RetryStrategy,
): Promise<T> {
  let lastError: Error | null = null;
  let delay = strategy.initialDelay;

  for (let attempt = 1; attempt <= strategy.maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt < strategy.maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, delay));
        delay = Math.min(delay * strategy.backoffMultiplier, strategy.maxDelay);
      }
    }
  }

  throw lastError;
}
```

### 7.2 Fallback para Servidor Alternativo

```typescript
const JITSI_SERVERS = [
  'https://meet.jitsi.org',
  'https://jitsi.example.com', // Servidor alternativo
];

async function connectWithFallback(config: JitsiConfig): Promise<void> {
  for (const serverUrl of JITSI_SERVERS) {
    try {
      await startConference({ ...config, serverUrl });
      return;
    } catch (error) {
      console.warn(`Falha ao conectar em ${serverUrl}:`, error);
    }
  }
  
  throw new JitsiError(
    JitsiErrorCode.CONFERENCE_FAILED,
    'Falha ao conectar em todos os servidores disponíveis',
  );
}
```

---

## 8. Logging Estruturado Proposto

```typescript
// services/logger.ts

enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  component: string;
  message: string;
  data?: Record<string, any>;
  error?: Error;
}

class Logger {
  private logs: LogEntry[] = [];

  log(level: LogLevel, component: string, message: string, data?: any) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      component,
      message,
      data,
    };

    this.logs.push(entry);
    console.log(`[${entry.timestamp}] [${LogLevel[level]}] [${component}] ${message}`, data);
  }

  getLogs(): LogEntry[] {
    return this.logs;
  }

  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }
}
```

---

## 9. Validação de Parâmetros Proposta

```typescript
// lib/validation.ts

import { z } from 'zod';

export const ConferenceConfigSchema = z.object({
  roomName: z.string()
    .min(3, 'Nome da sala deve ter pelo menos 3 caracteres')
    .max(100, 'Nome da sala não pode exceder 100 caracteres')
    .regex(/^[a-zA-Z0-9-]+$/, 'Nome da sala pode conter apenas letras, números e hífens'),
  
  displayName: z.string()
    .min(1, 'Nome do jogador é obrigatório')
    .max(50, 'Nome do jogador não pode exceder 50 caracteres'),
  
  characterClass: z.enum(['Guerreiro', 'Mago', 'Clérigo', 'Ladino', 'Paladino', 'Bardo']),
  
  jwt: z.string().optional(),
});

export type ConferenceConfig = z.infer<typeof ConferenceConfigSchema>;
```

---

## 10. Checklist de Implementação

### Fase 1: Fundação
- [ ] Criar tipos TypeScript
- [ ] Criar configuração Jitsi
- [ ] Criar logger estruturado
- [ ] Criar validação com Zod

### Fase 2: Serviços
- [ ] Implementar JitsiService
- [ ] Implementar EventBridge
- [ ] Implementar ConferenceManager
- [ ] Implementar ErrorHandler

### Fase 3: State Management
- [ ] Criar ConferenceStore (Zustand)
- [ ] Criar ParticipantsStore (Zustand)
- [ ] Implementar hooks customizados

### Fase 4: Componentes
- [ ] Implementar JitsiConferenceView
- [ ] Implementar ParticipantHUD
- [ ] Implementar DiceRollerOverlay
- [ ] Implementar MasterControls
- [ ] Implementar ErrorBoundary

### Fase 5: Integração
- [ ] Integrar com video-conference.tsx
- [ ] Implementar permissões
- [ ] Implementar retry e fallback
- [ ] Testar em Android, iOS, Web

### Fase 6: Produção
- [ ] Implementar JWT
- [ ] Implementar monitoramento
- [ ] Implementar testes
- [ ] Documentar API

---

## 11. Próximos Passos

1. ✅ Revisar e aprovar arquitetura
2. ✅ Implementar tipos TypeScript
3. ✅ Implementar JitsiService
4. ✅ Implementar componentes
5. ✅ Testar em dispositivos reais
6. ✅ Otimizar performance
7. ✅ Preparar para produção

---

**Fim da Arquitetura**
