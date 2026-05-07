/**
 * Tela de Videoconferência
 * Versão: 2.0 - Integração com SDK Nativo
 */

import React, { useEffect } from 'react';
import { View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import type { JitsiConfig } from '@/types/jitsi';
import { JitsiConferenceView } from '@/components/conference/jitsi-conference-view';
import { safeValidateConferenceConfig } from '@/lib/validation';
import { logger } from '@/services/logger';

const COMPONENT = 'VideoConferenceScreen';

/**
 * Tela de Videoconferência
 * 
 * Responsabilidades:
 * - Validar parâmetros de entrada
 * - Renderizar componente JitsiConferenceView
 * - Gerenciar navegação
 */
export default function VideoConferenceScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();

  // Extrair parâmetros
  const roomId = (params.roomId as string | undefined) || 'RPG-DEFAULT';
  const playerName = (params.playerName as string | undefined) || 'Jogador';
  const selectedClass = (params.selectedClass as string | undefined) || 'Guerreiro';
  const isMaster = (params.isMaster as string | undefined) === 'true';

  // Construir configuração
  const config: JitsiConfig = {
    serverUrl: 'https://meet.jitsi.org',
    roomName: String(roomId),
    displayName: String(playerName),
  };

  // Validar configuração
  const validatedConfig = safeValidateConferenceConfig(config);

  useEffect(() => {
    logger.info(COMPONENT, 'Tela de videoconferência carregada', {
      roomId,
      playerName,
      selectedClass,
      isMaster,
      configValid: !!validatedConfig,
    });
  }, []);

  // Se configuração inválida, voltar ao Lobby
  useEffect(() => {
    if (!validatedConfig) {
      logger.error(COMPONENT, 'Configuração inválida, voltando ao Lobby');
      router.replace('/');
    }
  }, [validatedConfig, router]);

  if (!validatedConfig) {
    return null;
  }

  return (
    <View style={{ flex: 1 }}>
      <JitsiConferenceView
        config={validatedConfig}
        isMaster={isMaster}
        onLeave={() => {
          logger.info(COMPONENT, 'Usuário saiu da conferência');
          router.replace('/');
        }}
      />
    </View>
  );
}
