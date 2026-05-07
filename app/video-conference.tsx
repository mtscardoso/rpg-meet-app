/**
 * Tela de Videoconferência
 * Versão: 2.0 - Integração com SDK Nativo
 * 
 * Responsabilidades:
 * - Validar parâmetros de entrada com type safety
 * - Renderizar componente JitsiConferenceView
 * - Gerenciar navegação e ciclo de vida
 * - Tratamento robusto de tipos e undefined
 */

import React, { useEffect, useMemo, useCallback } from 'react';
import { View, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import type { JitsiConfig } from '@/types/jitsi';
import type { ConferenceConfig } from '@/lib/validation';
import { JitsiConferenceView } from '@/components/conference/jitsi-conference-view';
import { safeValidateConferenceConfig } from '@/lib/validation';
import { logger } from '@/services/logger';

const COMPONENT = 'VideoConferenceScreen';

// Tipos de classe válidos
type ValidCharacterClass = 'Guerreiro' | 'Mago' | 'Clérigo' | 'Ladino' | 'Paladino' | 'Bardo';
const VALID_CLASSES: ValidCharacterClass[] = ['Guerreiro', 'Mago', 'Clérigo', 'Ladino', 'Paladino', 'Bardo'];

/**
 * Validar se a classe é válida
 */
function isValidClass(value: string): value is ValidCharacterClass {
  return VALID_CLASSES.includes(value as ValidCharacterClass);
}

// Valores padrão para parâmetros
const DEFAULT_ROOM_ID = 'RPG-DEFAULT';
const DEFAULT_PLAYER_NAME = 'Jogador';
const DEFAULT_CLASS = 'Guerreiro';

/**
 * Função auxiliar para extrair string de parâmetro
 * Trata undefined, array e tipos incorretos
 */
function extractStringParam(
  param: string | string[] | undefined,
  defaultValue: string
): string {
  if (typeof param === 'string') {
    return param.trim() || defaultValue;
  }
  if (Array.isArray(param) && param.length > 0) {
    return String(param[0]).trim() || defaultValue;
  }
  return defaultValue;
}

/**
 * Função auxiliar para extrair boolean de parâmetro
 */
function extractBooleanParam(
  param: string | string[] | undefined,
  defaultValue: boolean = false
): boolean {
  const stringValue = extractStringParam(param, '');
  if (stringValue === 'true') return true;
  if (stringValue === 'false') return false;
  return defaultValue;
}

/**
 * Tela de Videoconferência
 * 
 * Renderiza a conferência Jitsi com validação robusta de tipos
 */
export default function VideoConferenceScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();

  // Extrair e validar parâmetros com type safety
  const roomId = useMemo(
    () => extractStringParam(params.roomId, DEFAULT_ROOM_ID),
    [params.roomId]
  );

  const playerName = useMemo(
    () => extractStringParam(params.playerName, DEFAULT_PLAYER_NAME),
    [params.playerName]
  );

  const selectedClass = useMemo(
    () => extractStringParam(params.selectedClass, DEFAULT_CLASS),
    [params.selectedClass]
  );

  const isMaster = useMemo(
    () => extractBooleanParam(params.isMaster, false),
    [params.isMaster]
  );

  // Construir configuração com tipos garantidos
  const config = useMemo(() => {
    return {
      serverUrl: 'https://meet.jitsi.org',
      roomName: roomId,
      displayName: playerName,
      characterClass: selectedClass as 'Guerreiro' | 'Mago' | 'Clérigo' | 'Ladino' | 'Paladino' | 'Bardo',
    };
  }, [roomId, playerName, selectedClass]);

  // Validar configuração
  const validatedConfig = useMemo(
    () => safeValidateConferenceConfig(config),
    [config, roomId, playerName, selectedClass]
  );

  // Log de inicialização
  useEffect(() => {
    logger.info(COMPONENT, 'Tela de videoconferência carregada', {
      roomId,
      playerName,
      selectedClass,
      isMaster,
      configValid: !!validatedConfig,
      timestamp: new Date().toISOString(),
    });

    return () => {
      logger.info(COMPONENT, 'Tela de videoconferência desmontada');
    };
  }, [roomId, playerName, selectedClass, isMaster, validatedConfig]);

  // Validar configuração e voltar ao Lobby se inválida
  useEffect(() => {
    if (!validatedConfig) {
      logger.error(COMPONENT, 'Configuração inválida, voltando ao Lobby', {
        config,
        validationResult: validatedConfig,
      });

      // Mostrar alerta ao usuário
      Alert.alert(
        'Erro de Configuração',
        'Parâmetros de sessão inválidos. Retornando ao Lobby.',
        [
          {
            text: 'OK',
            onPress: () => {
              router.replace('/');
            },
          },
        ]
      );
    }
  }, [validatedConfig, config, router]);

  // Callback para sair da conferência
  const handleLeaveConference = useCallback(() => {
    logger.info(COMPONENT, 'Usuário saiu da conferência', {
      roomId,
      playerName,
      duration: new Date().toISOString(),
    });
    router.replace('/');
  }, [roomId, playerName, router]);

  // Renderizar loading enquanto valida
  if (!validatedConfig) {
    return null;
  }

  // Renderizar conferência
  // validatedConfig é garantidamente não-null aqui devido ao check anterior
  return (
    <View style={{ flex: 1 }}>
      <JitsiConferenceView
        config={validatedConfig as any}
        isMaster={isMaster}
        onLeave={handleLeaveConference}
      />
    </View>
  );
}
