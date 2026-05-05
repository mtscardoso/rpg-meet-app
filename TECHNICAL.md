# RPG Meet - Roteiro Técnico Completo

## 1. Visão Geral do Projeto

**RPG Meet** é um aplicativo móvel de videoconferência especializado em sessões de RPG de Mesa (TTRPG), desenvolvido com React Native e Expo. O aplicativo integra a API Jitsi Meet para videoconferência, sistema de rolagem de dados em tempo real, HUD de personagem e painel do mestre com controles avançados.

### Objetivos Principais
- Proporcionar experiência de videoconferência otimizada para TTRPG
- Sincronizar dados de personagem em tempo real entre participantes
- Fornecer ferramentas exclusivas para mestres (controle de participantes, trilha sonora, whispers)
- Manter estética medieval Grimdark em toda a interface

### Stack Tecnológico
| Camada | Tecnologia | Versão |
|--------|-----------|--------|
| Frontend Mobile | React Native | 0.81.5 |
| Framework | Expo | 54.0.29 |
| Linguagem | TypeScript | 5.9 |
| Estilo | NativeWind (Tailwind) | 4.2.1 |
| Roteamento | Expo Router | 6.0.19 |
| Videoconferência | Jitsi React Native SDK | 12.1.0+ |
| Sincronização | Socket.io (recomendado) | - |
| Persistência Local | AsyncStorage | 2.2.0 |
| Animações | React Native Reanimated | 4.1.6 |
| Estado Global | Zustand ou Context API | - |

## 2. Arquitetura de Componentes

### Estrutura de Diretórios
```
rpg-meet-app/
├── app/
│   ├── _layout.tsx                 # Root layout com providers
│   ├── (tabs)/
│   │   ├── _layout.tsx            # Tab bar configuration
│   │   └── index.tsx              # Home/Lobby screen
│   ├── character-sheet.tsx         # Tela de ficha de personagem
│   ├── video-conference.tsx        # Tela principal de videoconferência
│   └── master-panel.tsx            # Painel do mestre
├── components/
│   ├── screen-container.tsx        # SafeArea wrapper
│   ├── themed-view.tsx             # View com tema
│   ├── medieval-button.tsx         # Botão temático
│   ├── medieval-card.tsx           # Card temático
│   ├── character-hud.tsx           # HUD de personagem
│   ├── dice-roller.tsx             # Sistema de dados
│   ├── master-controls.tsx         # Controles do mestre
│   └── ui/
│       └── icon-symbol.tsx         # Mapeamento de ícones
├── services/
│   ├── jitsi-service.ts            # Integração Jitsi
│   ├── socket-service.ts           # Socket.io para sincronização
│   └── character-service.ts        # Gerenciamento de fichas
├── store/
│   ├── character-store.ts          # Zustand store para personagens
│   └── game-store.ts               # Zustand store para sessão
├── hooks/
│   ├── use-colors.ts               # Hook de cores do tema
│   ├── use-character.ts            # Hook para dados de personagem
│   └── use-game-session.ts         # Hook para sessão de jogo
├── constants/
│   └── theme.ts                    # Constantes de tema
├── lib/
│   ├── utils.ts                    # Funções utilitárias
│   ├── theme-provider.tsx          # Theme context
│   └── trpc.ts                     # Cliente tRPC
├── assets/
│   └── images/
│       ├── icon.png                # Ícone da app
│       ├── splash-icon.png         # Ícone de splash
│       ├── favicon.png             # Favicon web
│       └── android-icon-*.png      # Ícones Android
├── theme.config.js                 # Paleta de cores
├── tailwind.config.js              # Configuração Tailwind
├── app.config.ts                   # Configuração Expo
├── design.md                       # Especificação de design
├── todo.md                         # Lista de tarefas
└── TECHNICAL.md                    # Este arquivo
```

### Componentes Principais

#### 1. **ScreenContainer**
- Wrapper que gerencia SafeArea e background
- Propriedades: `edges`, `className`, `containerClassName`
- Uso: Envolver todo conteúdo de tela

#### 2. **MedievalButton**
- Botão temático com bordas de ferro batido
- Variantes: `primary` (ouro), `secondary` (cinza), `danger` (vermelho)
- Tamanhos: `small`, `medium`, `large`
- Propriedades: `onPress`, `title`, `variant`, `size`, `disabled`

#### 3. **MedievalCard**
- Card temático com estilo de pergaminho
- Variantes: `default`, `elevated`, `outline`
- Propriedades: `children`, `variant`, `className`

#### 4. **CharacterHUD**
- Overlay de informações de personagem sobre miniatura de vídeo
- Exibe: Nome, Classe, HP (barra), Mana (barra)
- Atualização: Sincronizada via Socket.io
- Props: `character`, `isActive`, `onPress`

#### 5. **DiceRoller**
- Seletor de dados (D4, D6, D8, D10, D12, D20)
- Animação de rolagem (1-2 segundos)
- Resultado em overlay grande
- Broadcast automático via Socket.io
- Props: `onRoll`, `disabled`

#### 6. **MasterControls**
- Painel flutuante com controles do mestre
- Funcionalidades: Mutar participante, enviar whisper, trilha sonora
- Visibilidade: Apenas para usuário com role = "master"
- Props: `participants`, `onMute`, `onWhisper`, `onAudioControl`

## 3. Fluxo de Dados e Estado

### State Management

**Opção Recomendada: Zustand + AsyncStorage**

#### Character Store
```typescript
interface Character {
  id: string;
  name: string;
  class: string;
  hp: number;
  maxHp: number;
  mana: number;
  maxMana: number;
  attributes: {
    str: number;
    dex: number;
    con: number;
    int: number;
    wis: number;
    cha: number;
  };
  skills: Skill[];
  equipment: Equipment[];
}

// Zustand store
const useCharacterStore = create((set) => ({
  character: null,
  setCharacter: (character: Character) => set({ character }),
  updateHP: (hp: number) => set((state) => ({
    character: { ...state.character, hp }
  })),
  // ... outros métodos
}));
```

#### Game Store
```typescript
interface GameSession {
  roomId: string;
  participants: Participant[];
  diceHistory: DiceRoll[];
  masterId: string;
  isActive: boolean;
}

const useGameStore = create((set) => ({
  session: null,
  setSession: (session: GameSession) => set({ session }),
  addParticipant: (participant: Participant) => set((state) => ({
    session: {
      ...state.session,
      participants: [...state.session.participants, participant]
    }
  })),
  // ... outros métodos
}));
```

### Sincronização em Tempo Real

#### Socket.io Events
```typescript
// Cliente emite
socket.emit('dice:roll', { playerId, diceType, result });
socket.emit('character:update', { playerId, character });
socket.emit('whisper:send', { fromId, toId, message });
socket.emit('audio:control', { action, value });

// Cliente escuta
socket.on('dice:rolled', (data) => { /* atualizar UI */ });
socket.on('character:updated', (data) => { /* sincronizar HUD */ });
socket.on('whisper:received', (data) => { /* mostrar notificação */ });
socket.on('participant:joined', (data) => { /* atualizar lista */ });
socket.on('participant:left', (data) => { /* remover da lista */ });
```

#### Persistência Local
```typescript
// Salvar ficha localmente
await AsyncStorage.setItem('character', JSON.stringify(character));

// Carregar ficha
const saved = await AsyncStorage.getItem('character');
const character = saved ? JSON.parse(saved) : null;
```

## 4. Integração Jitsi Meet

### Configuração Inicial

#### Instalação
```bash
npm install @jitsi/react-native-sdk
npm install @jitsi/react-native-sdk --force  # Se houver conflitos
node node_modules/@jitsi/react-native-sdk/update_dependencies.js
npm install
```

#### Configuração Android
```xml
<!-- AndroidManifest.xml -->
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.RECORD_AUDIO" />
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
<uses-permission android:name="android.permission.BLUETOOTH" />
<uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
<uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
<uses-permission android:name="android.permission.FOREGROUND_SERVICE_MEDIA_PROJECTION" />
```

#### Configuração iOS
```xml
<!-- Info.plist -->
<key>NSCameraUsageDescription</key>
<string>Câmera necessária para videoconferência</string>
<key>NSMicrophoneUsageDescription</key>
<string>Microfone necessário para áudio</string>
<key>UIViewControllerBasedStatusBarAppearance</key>
<false/>
<key>UIBackgroundModes</key>
<array>
  <string>voip</string>
</array>
```

### Uso do Componente JitsiMeeting

```typescript
import { JitsiMeeting } from '@jitsi/react-native-sdk';

export function VideoConference() {
  const handleConferenceJoined = () => {
    console.log('Entrou na conferência');
  };

  const handleConferenceLeft = () => {
    console.log('Saiu da conferência');
  };

  return (
    <JitsiMeeting
      room="rpg-session-001"
      serverURL="https://meet.jit.si"
      userInfo={{
        displayName: "Jogador 1",
        email: "player@example.com",
        avatarUrl: "https://example.com/avatar.jpg"
      }}
      config={{
        hideConferenceTimer: false,
        subject: "Sessão RPG - Campanha Dragon",
        customToolbarButtons: [
          {
            icon: "https://example.com/dice-icon.png",
            id: "dice-roller",
            text: "Rolar Dados"
          }
        ]
      }}
      flags={{
        'call-integration.enabled': true,
        'fullscreen.enabled': true,
        'invite.enabled': true
      }}
      eventListeners={{
        onConferenceJoined: handleConferenceJoined,
        onConferenceLeft: handleConferenceLeft,
        onParticipantJoined: (participant) => {
          console.log('Participante entrou:', participant);
        },
        onAudioMutedChanged: (isMuted) => {
          console.log('Áudio:', isMuted ? 'Mutado' : 'Ativo');
        }
      }}
      style={{ height: '100%', width: '100%' }}
    />
  );
}
```

## 5. Sistema de Rolagem de Dados

### Componente DiceRoller

```typescript
interface DiceRoll {
  playerId: string;
  playerName: string;
  diceType: 'D4' | 'D6' | 'D8' | 'D10' | 'D12' | 'D20';
  result: number;
  timestamp: Date;
}

export function DiceRoller({ onRoll }) {
  const [isRolling, setIsRolling] = useState(false);
  const [lastResult, setLastResult] = useState<DiceRoll | null>(null);

  const rollDice = (diceType: string) => {
    setIsRolling(true);
    
    // Simular rolagem (1-2 segundos)
    const duration = 1000 + Math.random() * 1000;
    
    setTimeout(() => {
      const diceMap = {
        'D4': 4, 'D6': 6, 'D8': 8,
        'D10': 10, 'D12': 12, 'D20': 20
      };
      
      const result = Math.floor(Math.random() * diceMap[diceType]) + 1;
      const roll: DiceRoll = {
        playerId: currentUser.id,
        playerName: currentUser.name,
        diceType,
        result,
        timestamp: new Date()
      };
      
      setLastResult(roll);
      setIsRolling(false);
      
      // Broadcast via Socket.io
      socket.emit('dice:roll', roll);
      onRoll?.(roll);
    }, duration);
  };

  return (
    <View className="flex-row gap-2">
      {['D4', 'D6', 'D8', 'D10', 'D12', 'D20'].map((dice) => (
        <MedievalButton
          key={dice}
          title={dice}
          size="small"
          onPress={() => rollDice(dice)}
          disabled={isRolling}
        />
      ))}
      
      {lastResult && (
        <View className="absolute inset-0 items-center justify-center">
          <Text className="text-6xl font-bold text-primary">
            {lastResult.result}
          </Text>
        </View>
      )}
    </View>
  );
}
```

## 6. Painel do Mestre

### Funcionalidades Principais

#### Controle de Participantes
```typescript
interface MasterControl {
  muteParticipant(participantId: string): void;
  unmuteParticipant(participantId: string): void;
  removeParticipant(participantId: string): void;
  sendWhisper(participantId: string, message: string): void;
}
```

#### Trilha Sonora
```typescript
interface AudioControl {
  playTrack(trackUrl: string): void;
  pauseTrack(): void;
  setVolume(volume: number): void;
  playEffect(effectName: string): void;
}
```

#### Anotações
```typescript
interface MasterNotes {
  content: string;
  lastUpdated: Date;
  save(): Promise<void>;
  load(): Promise<string>;
}
```

## 7. Estética e Tema Visual

### Paleta de Cores Medieval Grimdark
| Elemento | Cor | Hex | Uso |
|----------|-----|-----|-----|
| Fundo Principal | Preto Profundo | #1A1A1A | Background geral |
| Superfícies | Cinza Carvão | #2F2F2F | Cards, panels |
| Texto Primário | Branco Osso | #F5F5DC | Texto principal |
| Texto Secundário | Ouro Envelhecido | #D4AF37 | Destaques, títulos |
| Destaque | Vermelho Carmesim | #8B0000 | Alertas, erros |
| Sucesso | Verde Floresta | #228B22 | Confirmações |
| Borda | Marrom Couro | #6B4423 | Bordas, separadores |

### Tipografia
- **Títulos**: Cinzel, Crimson Text (serif gótica)
- **Corpo**: Inter, Roboto (legível em mobile)
- **Acentos**: Fontes rúnicas para símbolos

### Componentes Temáticos
- **Botões**: Bordas 2px, fundo escuro, texto ouro
- **Cards**: Pergaminho com borda medieval
- **Barras**: Efeito de madeira/metal
- **Ícones**: Símbolos medievais (espada, escudo, poção)

### Animações (Discretas)
- Fade-in: 250ms
- Slide: 300ms
- Rotação de dados: 1-2s
- Glow em interações: 150ms

## 8. Fluxos de Usuário

### Fluxo 1: Jogador Entrando em Sessão
1. **Splash** → Logo + "Começar"
2. **Lobby** → Nome, ID da sala, Classe
3. **Character Sheet** → Editar ou usar padrão
4. **Video Conference** → Jitsi + HUD + Dados
5. **Participação** → Rolar dados, chat, etc.

### Fluxo 2: Mestre Criando Sessão
1. **Splash** → Logo + "Começar"
2. **Lobby** → Gerar Nova Sala (ID único)
3. **Character Sheet** → Opcional (Mestre)
4. **Video Conference** → Aguarda jogadores
5. **Master Panel** → Controles avançados

### Fluxo 3: Rolagem de Dados
1. Jogador toca em "Rolar Dados"
2. Seleciona tipo (D4-D20)
3. Animação de rolagem (1-2s)
4. Resultado exibido em overlay
5. Broadcast automático para todos

## 9. Dependências Principais

```json
{
  "dependencies": {
    "@jitsi/react-native-sdk": "^12.1.0",
    "socket.io-client": "^4.5.0",
    "zustand": "^4.3.0",
    "@react-native-async-storage/async-storage": "^2.2.0",
    "react-native-reanimated": "~4.1.6",
    "nativewind": "^4.2.1",
    "expo-router": "~6.0.19",
    "expo": "~54.0.29"
  }
}
```

## 10. Próximos Passos

### Fase 1: Estrutura Base ✓
- [x] Tema medieval Grimdark
- [x] Componentes temáticos (Button, Card)
- [x] Navegação Expo Router
- [ ] Tela de Lobby completa

### Fase 2: Ficha de Personagem
- [ ] Tela Character Sheet
- [ ] Formulário de edição
- [ ] Persistência local

### Fase 3: Integração Jitsi
- [ ] Instalação e configuração
- [ ] Componente JitsiMeeting
- [ ] Listeners de eventos

### Fase 4: HUD e Dados
- [ ] Componente CharacterHUD
- [ ] DiceRoller com animações
- [ ] Socket.io para broadcast

### Fase 5: Painel do Mestre
- [ ] Tela Master Panel
- [ ] Controles de participantes
- [ ] Trilha sonora

### Fase 6: Assets Visuais
- [ ] Logo medieval
- [ ] Ícones temáticos
- [ ] Texturas de pergaminho

### Fase 7: Testes e Polimento
- [ ] Testes end-to-end
- [ ] Otimização de performance
- [ ] Correção de bugs

## 11. Recursos Adicionais

- **Documentação Jitsi**: https://jitsi.github.io/handbook/docs/dev-guide/dev-guide-react-native-sdk/
- **Expo Router**: https://expo.dev/router
- **NativeWind**: https://www.nativewind.dev/
- **Zustand**: https://github.com/pmndrs/zustand
- **Socket.io**: https://socket.io/

## 12. Contato e Suporte

Para dúvidas sobre a arquitetura ou implementação, consulte a documentação de cada tecnologia ou abra uma issue no repositório do projeto.
