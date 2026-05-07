# Guia de Implementação - Integração Jitsi Meet

**Versão:** 1.0  
**Status:** Pronto para Implementação  

---

## 1. Visão Geral

Este guia fornece instruções passo a passo para implementar a integração Jitsi Meet corrigida no projeto RPG Meet, seguindo a arquitetura proposta em `JITSI_SOLUTION_ARCHITECTURE.md`.

---

## 2. Pré-requisitos

- Node.js 18+
- pnpm 9.12.0
- Expo SDK 54
- React Native 0.81.5
- TypeScript 5.9

---

## 3. Passos de Implementação

### Fase 1: Preparação (30 minutos)

#### 1.1 Criar Estrutura de Diretórios

```bash
# Criar diretórios necessários
mkdir -p types
mkdir -p services
mkdir -p hooks
mkdir -p components/conference
mkdir -p constants
mkdir -p lib

# Arquivos já criados:
# - types/jitsi.ts
# - constants/jitsi-config.ts
# - services/logger.ts
# - services/conference-manager.ts
# - hooks/use-jitsi-conference.ts
# - lib/validation.ts
```

#### 1.2 Verificar Dependências

```bash
# Verificar se @jitsi/react-native-sdk está instalado
npm list @jitsi/react-native-sdk

# Se não estiver, instalar:
pnpm add @jitsi/react-native-sdk@^12.1.0

# Verificar outras dependências
pnpm list zod expo-permissions expo-av
```

### Fase 2: Configuração (45 minutos)

#### 2.1 Atualizar app.config.ts

```typescript
// app.config.ts

const config: ExpoConfig = {
  // ... configuração existente

  android: {
    // ... configuração existente
    permissions: [
      'POST_NOTIFICATIONS',
      // Adicionar permissões Jitsi
      'android.permission.CAMERA',
      'android.permission.RECORD_AUDIO',
      'android.permission.INTERNET',
      'android.permission.ACCESS_NETWORK_STATE',
      'android.permission.MODIFY_AUDIO_SETTINGS',
      'android.permission.BLUETOOTH',
      'android.permission.BLUETOOTH_ADMIN',
      'android.permission.BLUETOOTH_CONNECT',
      'android.permission.BLUETOOTH_SCAN',
    ],
  },

  ios: {
    // ... configuração existente
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
      // Adicionar chaves Jitsi
      NSCameraUsageDescription: 'Precisamos acessar sua câmera para videoconferência',
      NSMicrophoneUsageDescription: 'Precisamos acessar seu microfone para videoconferência',
      NSLocalNetworkUsageDescription: 'Permitir acesso à rede local para melhor qualidade',
      NSBonjourServices: ['_http._tcp', '_https._tcp'],
    },
  },

  plugins: [
    // ... plugins existentes
    [
      'expo-build-properties',
      {
        android: {
          buildArchs: ['armeabi-v7a', 'arm64-v8a'],
          minSdkVersion: 24,
        },
      },
    ],
  ],
};
```

#### 2.2 Configurar Variáveis de Ambiente

```bash
# .env
JITSI_SERVER_URL=https://meet.jitsi.org
SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
```

#### 2.3 Inicializar Áudio (app/_layout.tsx)

```typescript
// app/_layout.tsx

import { Audio } from 'expo-av';

export default function RootLayout() {
  useEffect(() => {
    // Configurar modo de áudio
    Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      staysActiveInBackground: true,
    }).catch(error => {
      console.error('Erro ao configurar áudio:', error);
    });
  }, []);

  // ... resto do código
}
```

### Fase 3: Implementação de Componentes (2 horas)

#### 3.1 Criar Componente JitsiConferenceView

```typescript
// components/conference/jitsi-conference-view.tsx

import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import type { JitsiConfig } from '@/types/jitsi';
import { useJitsiConference } from '@/hooks/use-jitsi-conference';
import { useColors } from '@/hooks/use-colors';
import { logger } from '@/services/logger';

interface JitsiConferenceViewProps {
  config: JitsiConfig;
  onLeave?: () => void;
}

export function JitsiConferenceView({ config, onLeave }: JitsiConferenceViewProps) {
  const colors = useColors();
  const router = useRouter();
  const { state, isInitialized, endConference, participants } = useJitsiConference(config);

  useEffect(() => {
    logger.info('JitsiConferenceView', 'Conferência inicializada', {
      roomName: config.roomName,
      participants: participants.length,
    });
  }, [isInitialized]);

  const handleLeave = async () => {
    try {
      await endConference();
      onLeave?.();
      router.push('/');
    } catch (error) {
      logger.error('JitsiConferenceView', 'Erro ao sair', error);
    }
  };

  if (!isInitialized) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ marginTop: 10, color: colors.muted }}>Conectando...</Text>
      </View>
    );
  }

  if (state.error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background, padding: 20 }}>
        <Text style={{ color: colors.error, fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
          Erro na Conferência
        </Text>
        <Text style={{ color: colors.muted, textAlign: 'center', marginBottom: 20 }}>
          {state.error.message}
        </Text>
        <TouchableOpacity
          onPress={handleLeave}
          style={{ backgroundColor: colors.primary, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 }}
        >
          <Text style={{ color: colors.background, fontWeight: 'bold' }}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Renderizar Jitsi aqui */}
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: colors.foreground, fontSize: 18, marginBottom: 10 }}>
          Sala: {config.roomName}
        </Text>
        <Text style={{ color: colors.muted, marginBottom: 20 }}>
          Participantes: {participants.length}
        </Text>
      </View>

      {/* Botão Sair */}
      <View style={{ padding: 16 }}>
        <TouchableOpacity
          onPress={handleLeave}
          style={{ backgroundColor: colors.error, paddingVertical: 12, borderRadius: 8, alignItems: 'center' }}
        >
          <Text style={{ color: colors.background, fontWeight: 'bold', fontSize: 16 }}>
            Sair da Sessão
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
```

#### 3.2 Atualizar video-conference.tsx

```typescript
// app/video-conference.tsx

import { View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import type { JitsiConfig } from '@/types/jitsi';
import { JitsiConferenceView } from '@/components/conference/jitsi-conference-view';
import { validateConferenceConfig } from '@/lib/validation';
import { logger } from '@/services/logger';

export default function VideoConferenceScreen() {
  const params = useLocalSearchParams();

  // Validar parâmetros
  const config: JitsiConfig = {
    serverUrl: 'https://meet.jitsi.org',
    roomName: (params.roomId as string) || 'RPG-DEFAULT',
    displayName: (params.playerName as string) || 'Jogador',
  };

  try {
    validateConferenceConfig(config);
  } catch (error) {
    logger.error('VideoConferenceScreen', 'Configuração inválida', error);
    return null;
  }

  return (
    <View style={{ flex: 1 }}>
      <JitsiConferenceView config={config} />
    </View>
  );
}
```

### Fase 4: Testes (1 hora)

#### 4.1 Testar em Desenvolvimento

```bash
# Iniciar servidor de desenvolvimento
pnpm dev

# Testar em Web
# Abrir http://localhost:8081

# Testar em Android
pnpm android

# Testar em iOS
pnpm ios
```

#### 4.2 Testar Permissões

```typescript
// test-permissions.ts

import * as Permissions from 'expo-permissions';

async function testPermissions() {
  const camera = await Permissions.askAsync(Permissions.CAMERA);
  const audio = await Permissions.askAsync(Permissions.AUDIO);

  console.log('Camera:', camera.status);
  console.log('Audio:', audio.status);

  return camera.status === 'granted' && audio.status === 'granted';
}
```

#### 4.3 Testar Conferência

```typescript
// test-conference.ts

import { conferenceManager } from '@/services/conference-manager';

async function testConference() {
  const config = {
    serverUrl: 'https://meet.jitsi.org',
    roomName: 'test-room',
    displayName: 'Test User',
  };

  try {
    await conferenceManager.startConference(config);
    console.log('✓ Conferência iniciada');

    // Aguardar 5 segundos
    await new Promise(resolve => setTimeout(resolve, 5000));

    await conferenceManager.endConference();
    console.log('✓ Conferência encerrada');
  } catch (error) {
    console.error('✗ Erro:', error);
  }
}
```

### Fase 5: Integração com App (1 hora)

#### 5.1 Atualizar Lobby

```typescript
// app/(tabs)/index.tsx

// Adicionar navegação para videoconferência com validação
const handleCreateSession = async () => {
  try {
    // Validar dados
    const config = validateConferenceConfig({
      roomName: roomId,
      displayName: playerName,
      characterClass: selectedClass,
    });

    // Navegar para videoconferência
    router.push({
      pathname: '/video-conference',
      params: {
        roomId: config.roomName,
        playerName: config.displayName,
        selectedClass: config.characterClass,
      },
    });
  } catch (error) {
    Alert.alert('Erro', 'Dados inválidos');
  }
};
```

#### 5.2 Adicionar Logging

```typescript
// Adicionar logging em pontos críticos
useEffect(() => {
  logger.info('VideoConferenceScreen', 'Tela carregada', {
    roomId: params.roomId,
    playerName: params.playerName,
  });
}, []);
```

### Fase 6: Produção (2 horas)

#### 6.1 Build para Android

```bash
# Build APK
eas build --platform android --profile preview

# Build AAB (para Play Store)
eas build --platform android --profile production
```

#### 6.2 Build para iOS

```bash
# Build para TestFlight
eas build --platform ios --profile preview

# Build para App Store
eas build --platform ios --profile production
```

#### 6.3 Deploy

```bash
# Publicar no Expo
eas submit --platform android
eas submit --platform ios
```

---

## 4. Troubleshooting

### Problema: "Module not found: @jitsi/react-native-sdk"

**Solução:**
```bash
pnpm add @jitsi/react-native-sdk@^12.1.0
pnpm install
```

### Problema: "Permissões não funcionam"

**Solução:**
```bash
# Limpar cache
pnpm install --force

# Reconstruir
eas build --platform android --profile preview --clear-cache
```

### Problema: "Conferência não conecta"

**Solução:**
```typescript
// Verificar conectividade
import * as Network from 'expo-network';

const state = await Network.getNetworkStateAsync();
if (!state.isConnected) {
  logger.error('Network', 'Sem conexão');
}
```

---

## 5. Próximos Passos

1. ✅ Implementar componentes
2. ✅ Testar em dispositivos reais
3. ✅ Otimizar performance
4. ✅ Implementar HUD de personagem
5. ✅ Implementar Dice Roller
6. ✅ Implementar Master Panel
7. ✅ Preparar para produção

---

**Fim do Guia de Implementação**
