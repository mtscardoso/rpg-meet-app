# Configuração de Permissões iOS para Jitsi Meet

## Info.plist - Descrições de Permissões

As seguintes chaves devem ser adicionadas ao `Info.plist` para solicitar permissões:

```xml
<!-- Câmera -->
<key>NSCameraUsageDescription</key>
<string>Precisamos acessar sua câmera para participar da videoconferência de RPG.</string>

<!-- Microfone -->
<key>NSMicrophoneUsageDescription</key>
<string>Precisamos acessar seu microfone para que você possa falar durante a sessão.</string>

<!-- Calendário (opcional) -->
<key>NSCalendarsUsageDescription</key>
<string>Permitir acessar seu calendário para agendar sessões de RPG.</string>

<!-- Contatos (opcional) -->
<key>NSContactsUsageDescription</key>
<string>Permitir acessar seus contatos para convidar amigos.</string>
```

## Configuração em app.config.ts

```typescript
const config: ExpoConfig = {
  // ... outras configurações
  ios: {
    // ... outras configurações
    infoPlist: {
      NSCameraUsageDescription:
        'Precisamos acessar sua câmera para participar da videoconferência de RPG.',
      NSMicrophoneUsageDescription:
        'Precisamos acessar seu microfone para que você possa falar durante a sessão.',
      NSCalendarsUsageDescription:
        'Permitir acessar seu calendário para agendar sessões de RPG.',
      NSContactsUsageDescription:
        'Permitir acessar seus contatos para convidar amigos.',
      // Outras configurações necessárias
      ITSAppUsesNonExemptEncryption: false,
    },
  },
};
```

## Permissões em Tempo de Execução (iOS 10+)

```typescript
import * as Permissions from 'expo-permissions';

async function requestCameraAndMicrophonePermissions() {
  try {
    const { status: cameraStatus } = await Permissions.askAsync(
      Permissions.CAMERA
    );
    const { status: microphoneStatus } = await Permissions.askAsync(
      Permissions.AUDIO
    );

    if (cameraStatus !== 'granted' || microphoneStatus !== 'granted') {
      Alert.alert(
        'Permissões Necessárias',
        'Câmera e microfone são necessários para a videoconferência'
      );
      return false;
    }
    return true;
  } catch (error) {
    logger.error('RequestPermissions', 'Erro ao solicitar permissões', error);
    return false;
  }
}
```

## Configurações de Capacidades

iOS requer configurações adicionais de capacidades:

```typescript
// app.config.ts
ios: {
  entitlements: {
    'com.apple.developer.networking.multicast': true,
  },
}
```

## Checklist de Permissões iOS

- [ ] `NSCameraUsageDescription` adicionado
- [ ] `NSMicrophoneUsageDescription` adicionado
- [ ] `NSCalendarsUsageDescription` adicionado (opcional)
- [ ] `NSContactsUsageDescription` adicionado (opcional)
- [ ] `ITSAppUsesNonExemptEncryption` configurado
- [ ] Permissões em tempo de execução implementadas
- [ ] Tratamento de negação de permissões
- [ ] Fallback para funcionalidades sem permissão
- [ ] Testado em dispositivo real iOS

## Testes de Permissões

```typescript
import { logger } from '@/services/logger';

async function validateIOSPermissions() {
  const requiredPermissions = [
    'NSCameraUsageDescription',
    'NSMicrophoneUsageDescription',
  ];

  logger.info('PermissionValidator', 'Validando permissões iOS', {
    requiredPermissions,
  });

  // Implementar validação real com expo-permissions
  // ...
}
```

## Referências

- [Expo Permissions Documentation](https://docs.expo.dev/versions/latest/sdk/permissions/)
- [iOS Privacy Permissions](https://developer.apple.com/documentation/bundleresources/privacy_manifest_files)
- [Jitsi Meet iOS SDK](https://github.com/jitsi/jitsi-meet/tree/master/ios)
