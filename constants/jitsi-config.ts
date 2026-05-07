/**
 * Configuração Jitsi Meet
 * Versão: 1.0
 */

import type { RetryStrategy } from '@/types/jitsi';

export const JITSI_CONFIG = {
  // Servidor Jitsi
  serverUrl: process.env.JITSI_SERVER_URL || 'https://meet.jitsi.org',
  
  // Servidores alternativos para fallback
  alternativeServers: [
    'https://jitsi.example.com',
    'https://meet.jitsi.org',
  ],

  // Configurações de conferência
  conference: {
    startWithAudioMuted: false,
    startWithVideoMuted: false,
    disableAudioLevels: false,
    enableWelcomePage: false,
    enableClosePage: false,
    prejoinPageEnabled: false,
    requireDisplayName: true,
    enableLobbyChat: true,
    enableNoAudioOrVideoNotification: true,
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
    DEFAULT_BACKGROUND: '#1A1A1A',
    MOBILE_APP_PROMO: false,
  },

  // Retry strategy
  retry: {
    maxAttempts: 3,
    initialDelay: 1000,
    maxDelay: 10000,
    backoffMultiplier: 2,
  } as RetryStrategy,

  // Timeout
  timeout: 30000,

  // Logging
  logging: {
    enabled: true,
    level: 'INFO',
    exportOnError: true,
  },
};

// Configuração de permissões
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
      'android.permission.BLUETOOTH_CONNECT',
      'android.permission.BLUETOOTH_SCAN',
    ],
    minSdkVersion: 24,
    buildArchs: ['armeabi-v7a', 'arm64-v8a'],
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
