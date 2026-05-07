/**
 * Gerenciador de Conferência Jitsi
 * Versão: 1.0
 */

import type {
  JitsiConfig,
  Participant,
  ConferenceState,
  ConferenceEventListener,
  JitsiError,
  RetryStrategy,
} from '@/types/jitsi';
import { JitsiErrorCode } from '@/types/jitsi';
import { JITSI_CONFIG } from '@/constants/jitsi-config';
import { logger } from './logger';

const COMPONENT = 'ConferenceManager';

export class ConferenceManager {
  private state: ConferenceState = {
    conferenceId: '',
    roomName: '',
    isConnected: false,
    isConnecting: false,
    participants: [],
    localParticipant: null,
    error: null,
    startTime: null,
    duration: 0,
  };

  private listeners: ConferenceEventListener = {};
  private retryStrategy: RetryStrategy = JITSI_CONFIG.retry;
  private connectionTimeout: ReturnType<typeof setTimeout> | null = null;
  private durationInterval: ReturnType<typeof setInterval> | null = null;

  constructor() {
    logger.info(COMPONENT, 'ConferenceManager inicializado');
  }

  /**
   * Iniciar conferência
   */
  async startConference(config: JitsiConfig): Promise<void> {
    try {
      logger.info(COMPONENT, 'Iniciando conferência', { roomName: config.roomName });

      this.state.isConnecting = true;
      this.state.conferenceId = `${config.roomName}-${Date.now()}`;
      this.state.roomName = config.roomName;
      this.state.startTime = Date.now();

      // Simular conexão (em produção, usar SDK real)
      await this.simulateConnection(config);

      this.state.isConnected = true;
      this.state.isConnecting = false;
      this.state.error = null;

      logger.info(COMPONENT, 'Conferência iniciada com sucesso', {
        conferenceId: this.state.conferenceId,
      });

      this.listeners.onConferenceJoined?.();
      this.startDurationTimer();
    } catch (error) {
      this.handleError(error as Error);
      this.listeners.onConferenceFailed?.(this.state.error!);
    }
  }

  /**
   * Encerrar conferência
   */
  async endConference(): Promise<void> {
    try {
      logger.info(COMPONENT, 'Encerrando conferência');

      this.stopDurationTimer();
      this.stopConnectionTimeout();

      this.state.isConnected = false;
      this.state.participants = [];
      this.state.localParticipant = null;

      logger.info(COMPONENT, 'Conferência encerrada', {
        duration: this.state.duration,
      });

      this.listeners.onConferenceLeft?.();
    } catch (error) {
      logger.error(COMPONENT, 'Erro ao encerrar conferência', error);
    }
  }

  /**
   * Adicionar participante
   */
  addParticipant(participant: Participant): void {
    const existing = this.state.participants.find(p => p.id === participant.id);
    if (!existing) {
      this.state.participants.push(participant);
      logger.info(COMPONENT, 'Participante adicionado', {
        participantId: participant.id,
        displayName: participant.displayName,
      });
      this.listeners.onParticipantJoined?.(participant);
    }
  }

  /**
   * Remover participante
   */
  removeParticipant(participantId: string): void {
    const index = this.state.participants.findIndex(p => p.id === participantId);
    if (index !== -1) {
      const participant = this.state.participants[index];
      this.state.participants.splice(index, 1);
      logger.info(COMPONENT, 'Participante removido', {
        participantId,
        displayName: participant.displayName,
      });
      this.listeners.onParticipantLeft?.(participantId);
    }
  }

  /**
   * Mutar participante
   */
  async muteParticipant(participantId: string): Promise<void> {
    const participant = this.state.participants.find(p => p.id === participantId);
    if (participant) {
      participant.isAudioMuted = true;
      logger.info(COMPONENT, 'Participante mutado', { participantId });
      this.listeners.onAudioMutedChanged?.(participantId, true);
    }
  }

  /**
   * Desmutar participante
   */
  async unmuteParticipant(participantId: string): Promise<void> {
    const participant = this.state.participants.find(p => p.id === participantId);
    if (participant) {
      participant.isAudioMuted = false;
      logger.info(COMPONENT, 'Participante desmutado', { participantId });
      this.listeners.onAudioMutedChanged?.(participantId, false);
    }
  }

  /**
   * Adicionar listener
   */
  addEventListener(listener: ConferenceEventListener): void {
    this.listeners = { ...this.listeners, ...listener };
  }

  /**
   * Remover listener
   */
  removeEventListener(listener: Partial<ConferenceEventListener>): void {
    Object.keys(listener).forEach(key => {
      delete this.listeners[key as keyof ConferenceEventListener];
    });
  }

  /**
   * Obter estado
   */
  getState(): Readonly<ConferenceState> {
    return { ...this.state };
  }

  /**
   * Obter participantes
   */
  getParticipants(): Participant[] {
    return [...this.state.participants];
  }

  /**
   * Obter participante local
   */
  getLocalParticipant(): Participant | null {
    return this.state.localParticipant ? { ...this.state.localParticipant } : null;
  }

  /**
   * Limpar recursos
   */
  cleanup(): void {
    logger.info(COMPONENT, 'Limpando recursos');
    this.stopDurationTimer();
    this.stopConnectionTimeout();
    this.listeners = {};
  }

  // Private Methods

  private async simulateConnection(config: JitsiConfig): Promise<void> {
    return new Promise((resolve, reject) => {
      this.connectionTimeout = setTimeout(() => {
        reject(new Error('Timeout ao conectar'));
      }, JITSI_CONFIG.timeout);

      // Simular conexão bem-sucedida após 2 segundos
      setTimeout(() => {
        if (this.connectionTimeout) {
          clearTimeout(this.connectionTimeout);
          this.connectionTimeout = null;
        }
        resolve();
      }, 2000);
    });
  }

  private handleError(error: Error): void {
    logger.error(COMPONENT, 'Erro na conferência', error);

    this.state.isConnecting = false;
    this.state.isConnected = false;
    this.state.error = {
      code: JitsiErrorCode.CONFERENCE_FAILED,
      message: error.message,
      originalError: error,
    } as JitsiError;
  }

  private startDurationTimer(): void {
    this.durationInterval = setInterval(() => {
      if (this.state.startTime) {
        this.state.duration = Math.floor((Date.now() - this.state.startTime) / 1000);
      }
    }, 1000);
  }

  private stopDurationTimer(): void {
    if (this.durationInterval) {
      clearInterval(this.durationInterval);
      this.durationInterval = null;
    }
  }

  private stopConnectionTimeout(): void {
    if (this.connectionTimeout) {
      clearTimeout(this.connectionTimeout);
      this.connectionTimeout = null;
    }
  }
}

// Instância global
export const conferenceManager = new ConferenceManager();
