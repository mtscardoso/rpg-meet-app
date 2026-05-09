/**
 * Serviço de Construção de URL Jitsi Meet
 * Responsável por gerar URLs seguras e validadas para Jitsi
 */

import { logger } from './logger';

const COMPONENT = 'JitsiUrlBuilder';
const JITSI_BASE_URL = 'https://meet.jitsi.org';
const MAX_ROOM_ID_LENGTH = 50;

/**
 * Sanitizar Room ID removendo caracteres inválidos
 */
export function sanitizeRoomId(roomId: string): string {
  if (!roomId || typeof roomId !== 'string') {
    logger.warn(COMPONENT, 'Room ID inválido', { roomId });
    return 'rpg-default';
  }

  const sanitized = roomId
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, MAX_ROOM_ID_LENGTH);

  if (!sanitized) {
    logger.warn(COMPONENT, 'Room ID vazio após sanitização', { original: roomId });
    return 'rpg-default';
  }

  logger.debug(COMPONENT, 'Room ID sanitizado', { original: roomId, sanitized });
  return sanitized;
}

/**
 * Validar Room ID
 */
export function isValidRoomId(roomId: string): boolean {
  if (!roomId || typeof roomId !== 'string') return false;
  if (roomId.length === 0 || roomId.length > MAX_ROOM_ID_LENGTH) return false;
  return /^[a-z0-9-]+$/.test(roomId.toLowerCase());
}

/**
 * Construir URL do Jitsi com parâmetros
 */
export interface JitsiUrlOptions {
  roomId: string;
  displayName: string;
  startAudioMuted?: boolean;
  startVideoMuted?: boolean;
  isMaster?: boolean;
}

export function buildJitsiUrl(options: JitsiUrlOptions): string {
  const {
    roomId,
    displayName,
    startAudioMuted = false,
    startVideoMuted = false,
    isMaster = false,
  } = options;

  // Validar entrada
  if (!roomId || !displayName) {
    throw new Error('Room ID e Display Name são obrigatórios');
  }

  // Sanitizar Room ID
  const sanitizedRoomId = sanitizeRoomId(roomId);

  // Construir URL base
  const url = new URL(`${JITSI_BASE_URL}/${sanitizedRoomId}`);

  // Construir hash de configuracao
  const config: Record<string, string | boolean | number> = {
    'config.displayName': displayName,
    'config.startAudioMuted': startAudioMuted,
    'config.startVideoMuted': startVideoMuted,
    'config.disableAudioLevels': false,
    'config.enableWelcomePage': false,
    'config.prejoinPageEnabled': false,
    'config.remoteVideoMenu.disabled': false,
  };

  // Toolbar buttons separados
  const toolbarButtons = isMaster
    ? ['microphone', 'camera', 'desktop', 'fullscreen', 'hangup', 'profile', 'chat', 'settings', 'raisehand', 'videoquality', 'filmstrip', 'invite', 'feedback', 'stats', 'shortcuts', 'tileview', 'download', 'help', 'mute-everyone', 'mute-video-everyone', 'e2ee']
    : ['microphone', 'camera', 'desktop', 'fullscreen', 'hangup', 'profile', 'chat', 'settings', 'raisehand', 'videoquality', 'filmstrip', 'invite', 'feedback', 'stats', 'shortcuts', 'tileview', 'download', 'help', 'e2ee'];

  // Construir hash
  const hashParts: string[] = [];
  Object.entries(config).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    
    let encodedValue: string;
    if (typeof value === 'boolean') {
      encodedValue = value ? 'true' : 'false';
    } else {
      encodedValue = String(value);
    }

    hashParts.push(`${key}=${encodeURIComponent(encodedValue)}`);
  });

  // Adicionar toolbar buttons
  hashParts.push(`config.toolbarButtons=${encodeURIComponent(JSON.stringify(toolbarButtons))}`);

  url.hash = hashParts.join('&');

  const finalUrl = url.toString();

  logger.debug(COMPONENT, 'URL Jitsi construída', {
    roomId: sanitizedRoomId,
    displayName,
    isMaster,
    toolbarCount: toolbarButtons.length,
  });

  return finalUrl;
}

/**
 * Validar URL do Jitsi
 */
export function validateJitsiUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.hostname === 'meet.jitsi.org' && parsed.pathname.length > 1;
  } catch {
    return false;
  }
}

/**
 * Extrair Room ID da URL
 */
export function extractRoomIdFromUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    const pathname = parsed.pathname.replace(/^\/|\/$/g, '');
    return pathname || null;
  } catch {
    return null;
  }
}

/**
 * Gerar URL de compartilhamento
 */
export function generateShareableUrl(roomId: string): string {
  const sanitized = sanitizeRoomId(roomId);
  return `${JITSI_BASE_URL}/${sanitized}`;
}
