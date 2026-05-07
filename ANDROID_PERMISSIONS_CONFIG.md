# Configuração de Permissões Android para Jitsi Meet

## Permissões Necessárias

As seguintes permissões devem ser adicionadas ao `app.config.ts` para suportar videoconferência:

```typescript
// app.config.ts - seção android.permissions

android: {
  permissions: [
    // Câmera
    'android.permission.CAMERA',
    // Microfone
    'android.permission.RECORD_AUDIO',
    // Acesso à internet
    'android.permission.INTERNET',
    // Acesso à rede
    'android.permission.ACCESS_NETWORK_STATE',
    // Acesso ao estado do WiFi
    'android.permission.ACCESS_WIFI_STATE',
    // Mudança de estado de rede
    'android.permission.CHANGE_NETWORK_STATE',
    // Mudança de estado de WiFi
    'android.permission.CHANGE_WIFI_STATE',
    // Notificações push
    'android.permission.POST_NOTIFICATIONS',
    // Acesso ao calendário (opcional)
    'android.permission.READ_CALENDAR',
    'android.permission.WRITE_CALENDAR',
    // Acesso aos contatos (opcional)
    'android.permission.READ_CONTACTS',
  ],
}
```

## Configuração em app.config.ts

```typescript
const config: ExpoConfig = {
  // ... outras configurações
  android: {
    // ... outras configurações
    permissions: [
      'android.permission.CAMERA',
      'android.permission.RECORD_AUDIO',
      'android.permission.INTERNET',
      'android.permission.ACCESS_NETWORK_STATE',
      'android.permission.ACCESS_WIFI_STATE',
      'android.permission.CHANGE_NETWORK_STATE',
      'android.permission.CHANGE_WIFI_STATE',
      'android.permission.POST_NOTIFICATIONS',
    ],
    // Configurações de features necessárias
    usesFeature: [
      {
        name: 'android.hardware.camera',
        required: false,
      },
      {
        name: 'android.hardware.microphone',
        required: false,
      },
    ],
  },
};
```

## Permissões em Tempo de Execução (Runtime Permissions)

Para Android 6.0+ (API 23+), as permissões devem ser solicitadas em tempo de execução.

### Usando expo-permissions

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

## Checklist de Permissões

- [ ] `CAMERA` - Acesso à câmera
- [ ] `RECORD_AUDIO` - Acesso ao microfone
- [ ] `INTERNET` - Acesso à internet
- [ ] `ACCESS_NETWORK_STATE` - Verificar estado da rede
- [ ] `ACCESS_WIFI_STATE` - Verificar estado do WiFi
- [ ] `CHANGE_NETWORK_STATE` - Mudar configurações de rede
- [ ] `CHANGE_WIFI_STATE` - Mudar configurações de WiFi
- [ ] `POST_NOTIFICATIONS` - Enviar notificações push
- [ ] Permissões em tempo de execução implementadas
- [ ] Tratamento de negação de permissões
- [ ] Fallback para funcionalidades sem permissão

## Testes de Permissões

```typescript
import { logger } from '@/services/logger';

async function validateAndroidPermissions() {
  const requiredPermissions = [
    'android.permission.CAMERA',
    'android.permission.RECORD_AUDIO',
    'android.permission.INTERNET',
  ];

  logger.info('PermissionValidator', 'Validando permissões', {
    requiredPermissions,
  });

  // Implementar validação real com expo-permissions
  // ...
}
```

## Referências

- [Expo Permissions Documentation](https://docs.expo.dev/versions/latest/sdk/permissions/)
- [Android Permissions Overview](https://developer.android.com/guide/topics/permissions/overview)
- [Jitsi Meet Android SDK](https://github.com/jitsi/jitsi-meet/tree/master/android)
