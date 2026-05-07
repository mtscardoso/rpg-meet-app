/**
 * Hook para Gerenciar Conferência Jitsi
 * Versão: 1.0
 */

import { useEffect, useState, useCallback } from 'react';
import type { JitsiConfig, ConferenceState, ConferenceEventListener } from '@/types/jitsi';
import { conferenceManager } from '@/services/conference-manager';
import { logger } from '@/services/logger';

const COMPONENT = 'useJitsiConference';

export function useJitsiConference(config: JitsiConfig | null) {
  const [state, setState] = useState<ConferenceState>(conferenceManager.getState());
  const [isInitialized, setIsInitialized] = useState(false);

  // Inicializar conferência
  useEffect(() => {
    if (!config) return;

    const initConference = async () => {
      try {
        logger.info(COMPONENT, 'Iniciando conferência', { roomName: config.roomName });

        // Adicionar listeners
        const listeners: ConferenceEventListener = {
          onConferenceJoined: () => {
            logger.info(COMPONENT, 'Conferência iniciada');
            setState(conferenceManager.getState());
          },
          onConferenceLeft: () => {
            logger.info(COMPONENT, 'Conferência encerrada');
            setState(conferenceManager.getState());
          },
          onConferenceFailed: (error) => {
            logger.error(COMPONENT, 'Conferência falhou', error);
            setState(conferenceManager.getState());
          },
          onParticipantJoined: (participant) => {
            logger.info(COMPONENT, 'Participante entrou', {
              displayName: participant.displayName,
            });
            setState(conferenceManager.getState());
          },
          onParticipantLeft: (participantId) => {
            logger.info(COMPONENT, 'Participante saiu', { participantId });
            setState(conferenceManager.getState());
          },
        };

        conferenceManager.addEventListener(listeners);

        // Iniciar conferência
        await conferenceManager.startConference(config);
        setIsInitialized(true);
      } catch (error) {
        logger.error(COMPONENT, 'Erro ao inicializar conferência', error);
      }
    };

    initConference();

    // Cleanup
    return () => {
      conferenceManager.cleanup();
      setIsInitialized(false);
    };
  }, [config]);

  // Atualizar estado periodicamente
  useEffect(() => {
    const interval = setInterval(() => {
      setState(conferenceManager.getState());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const endConference = useCallback(async () => {
    try {
      await conferenceManager.endConference();
      setState(conferenceManager.getState());
    } catch (error) {
      logger.error(COMPONENT, 'Erro ao encerrar conferência', error);
    }
  }, []);

  const muteParticipant = useCallback(async (participantId: string) => {
    try {
      await conferenceManager.muteParticipant(participantId);
      setState(conferenceManager.getState());
    } catch (error) {
      logger.error(COMPONENT, 'Erro ao mutar participante', error);
    }
  }, []);

  const unmuteParticipant = useCallback(async (participantId: string) => {
    try {
      await conferenceManager.unmuteParticipant(participantId);
      setState(conferenceManager.getState());
    } catch (error) {
      logger.error(COMPONENT, 'Erro ao desmutar participante', error);
    }
  }, []);

  return {
    state,
    isInitialized,
    endConference,
    muteParticipant,
    unmuteParticipant,
    participants: conferenceManager.getParticipants(),
    localParticipant: conferenceManager.getLocalParticipant(),
  };
}
