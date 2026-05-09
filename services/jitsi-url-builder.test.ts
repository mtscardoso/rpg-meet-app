import { describe, it, expect } from 'vitest';
import {
  sanitizeRoomId,
  isValidRoomId,
  buildJitsiUrl,
  validateJitsiUrl,
  extractRoomIdFromUrl,
  generateShareableUrl,
} from './jitsi-url-builder';

describe('Jitsi URL Builder', () => {
  describe('sanitizeRoomId', () => {
    it('deve converter para minúsculas', () => {
      expect(sanitizeRoomId('RPG-SESSION')).toBe('rpg-session');
    });

    it('deve remover caracteres especiais', () => {
      expect(sanitizeRoomId('RPG@#$%SESSION!!!')).toBe('rpgsession');
    });

    it('deve remover espaços', () => {
      expect(sanitizeRoomId('RPG SESSION')).toBe('rpgsession');
    });

    it('deve remover hífens duplicados', () => {
      expect(sanitizeRoomId('RPG---SESSION')).toBe('rpg-session');
    });

    it('deve remover hífens nas extremidades', () => {
      expect(sanitizeRoomId('-RPG-SESSION-')).toBe('rpg-session');
    });

    it('deve respeitar comprimento máximo', () => {
      const longId = 'a'.repeat(100);
      expect(sanitizeRoomId(longId).length).toBeLessThanOrEqual(50);
    });

    it('deve retornar default para entrada inválida', () => {
      expect(sanitizeRoomId('')).toBe('rpg-default');
      expect(sanitizeRoomId('   ')).toBe('rpg-default');
      expect(sanitizeRoomId('!!!')).toBe('rpg-default');
    });

    it('deve retornar default para null/undefined', () => {
      expect(sanitizeRoomId(null as any)).toBe('rpg-default');
      expect(sanitizeRoomId(undefined as any)).toBe('rpg-default');
    });

    it('deve preservar números', () => {
      expect(sanitizeRoomId('RPG-2024-SESSION-001')).toBe('rpg-2024-session-001');
    });

    it('deve fazer trim de espaços', () => {
      expect(sanitizeRoomId('  RPG-SESSION  ')).toBe('rpg-session');
    });
  });

  describe('isValidRoomId', () => {
    it('deve aceitar IDs válidos', () => {
      expect(isValidRoomId('rpg-session')).toBe(true);
      expect(isValidRoomId('rpg-session-001')).toBe(true);
      expect(isValidRoomId('session')).toBe(true);
    });

    it('deve rejeitar IDs vazios', () => {
      expect(isValidRoomId('')).toBe(false);
      expect(isValidRoomId('   ')).toBe(false);
    });

    it('deve rejeitar IDs muito longos', () => {
      const longId = 'a'.repeat(51);
      expect(isValidRoomId(longId)).toBe(false);
    });

    it('deve rejeitar IDs com caracteres especiais', () => {
      expect(isValidRoomId('rpg@session')).toBe(false);
      expect(isValidRoomId('rpg#session')).toBe(false);
      expect(isValidRoomId('rpg session')).toBe(false);
    });

    it('deve rejeitar null/undefined', () => {
      expect(isValidRoomId(null as any)).toBe(false);
      expect(isValidRoomId(undefined as any)).toBe(false);
    });
  });

  describe('buildJitsiUrl', () => {
    it('deve construir URL básica', () => {
      const url = buildJitsiUrl({
        roomId: 'test-room',
        displayName: 'John Doe',
      });

      expect(url).toContain('https://meet.jitsi.org/test-room');
      expect(url).toContain('config.displayName=John%20Doe');
    });

    it('deve incluir parâmetros de áudio/vídeo', () => {
      const url = buildJitsiUrl({
        roomId: 'test-room',
        displayName: 'John Doe',
        startAudioMuted: true,
        startVideoMuted: false,
      });

      expect(url).toContain('config.startAudioMuted=true');
      expect(url).toContain('config.startVideoMuted=false');
    });

    it('deve incluir toolbar buttons para mestre', () => {
      const url = buildJitsiUrl({
        roomId: 'test-room',
        displayName: 'Master',
        isMaster: true,
      });

      expect(url).toContain('config.toolbarButtons');
      expect(url).toContain('mute-everyone');
      expect(url).toContain('mute-video-everyone');
    });

    it('deve excluir toolbar buttons de mestre para jogadores', () => {
      const url = buildJitsiUrl({
        roomId: 'test-room',
        displayName: 'Player',
        isMaster: false,
      });

      expect(url).toContain('config.toolbarButtons');
      expect(url).not.toContain('mute-everyone');
    });

    it('deve sanitizar room ID automaticamente', () => {
      const url = buildJitsiUrl({
        roomId: 'TEST@#$ROOM!!!',
        displayName: 'John',
      });

      expect(url).toContain('/testroom');
    });

    it('deve lançar erro para room ID vazio', () => {
      expect(() => {
        buildJitsiUrl({
          roomId: '',
          displayName: 'John',
        });
      }).toThrow();
    });

    it('deve lançar erro para displayName vazio', () => {
      expect(() => {
        buildJitsiUrl({
          roomId: 'test-room',
          displayName: '',
        });
      }).toThrow();
    });

    it('deve codificar caracteres especiais no displayName', () => {
      const url = buildJitsiUrl({
        roomId: 'test-room',
        displayName: 'João & Maria',
      });

      expect(url).toContain('Jo%C3%A3o');
      expect(url).toContain('%26');
    });
  });

  describe('validateJitsiUrl', () => {
    it('deve validar URLs válidas', () => {
      expect(validateJitsiUrl('https://meet.jitsi.org/test-room')).toBe(true);
      expect(validateJitsiUrl('https://meet.jitsi.org/test-room#config.displayName=John')).toBe(true);
    });

    it('deve rejeitar URLs inválidas', () => {
      expect(validateJitsiUrl('https://example.com/test-room')).toBe(false);
      expect(validateJitsiUrl('https://meet.jitsi.org/')).toBe(false);
      expect(validateJitsiUrl('invalid-url')).toBe(false);
    });
  });

  describe('extractRoomIdFromUrl', () => {
    it('deve extrair room ID da URL', () => {
      expect(extractRoomIdFromUrl('https://meet.jitsi.org/test-room')).toBe('test-room');
      expect(extractRoomIdFromUrl('https://meet.jitsi.org/test-room#config.displayName=John')).toBe('test-room');
    });

    it('deve retornar null para URLs inválidas', () => {
      expect(extractRoomIdFromUrl('https://meet.jitsi.org/')).toBeNull();
      expect(extractRoomIdFromUrl('invalid-url')).toBeNull();
    });
  });

  describe('generateShareableUrl', () => {
    it('deve gerar URL compartilhável', () => {
      const url = generateShareableUrl('test-room');
      expect(url).toBe('https://meet.jitsi.org/test-room');
    });

    it('deve sanitizar room ID', () => {
      const url = generateShareableUrl('TEST@#$ROOM!!!');
      expect(url).toBe('https://meet.jitsi.org/testroom');
    });
  });
});
