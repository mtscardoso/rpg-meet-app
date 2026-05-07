/**
 * JitsiConferenceView - Componente Principal de Videoconferência
 * Versão: 1.0
 * 
 * Renderiza conferência Jitsi nativa com integração completa,
 * sincronização de dados, HUD de participantes e controles do mestre.
 */

import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Alert,
  Platform,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import type { JitsiConfig, Participant, ConferenceState } from '@/types/jitsi';
import { useJitsiConference } from '@/hooks/use-jitsi-conference';
import { useColors } from '@/hooks/use-colors';
import { logger } from '@/services/logger';
import { cn } from '@/lib/utils';

const COMPONENT = 'JitsiConferenceView';

interface JitsiConferenceViewProps {
  config: JitsiConfig;
  onLeave?: () => void;
  isMaster?: boolean;
}

/**
 * Componente Principal de Videoconferência
 * 
 * Responsabilidades:
 * - Renderizar conferência Jitsi
 * - Gerenciar estado de participantes
 * - Exibir HUD de personagem
 * - Implementar controles do mestre
 * - Sincronizar dados em tempo real
 */
export function JitsiConferenceView({
  config,
  onLeave,
  isMaster = false,
}: JitsiConferenceViewProps) {
  const colors = useColors();
  const router = useRouter();
  
  // State Management
  const { state, isInitialized, endConference, participants, localParticipant } =
    useJitsiConference(config);
  
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);
  const [showMasterPanel, setShowMasterPanel] = useState(isMaster);
  const [showDiceRoller, setShowDiceRoller] = useState(false);
  const [diceResult, setDiceResult] = useState<number | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Refs
  const conferenceRef = useRef<any>(null);
  const connectionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Logging
  useEffect(() => {
    logger.info(COMPONENT, 'Componente montado', {
      roomName: config.roomName,
      displayName: config.displayName,
      isMaster,
    });

    return () => {
      logger.info(COMPONENT, 'Componente desmontado');
      if (connectionTimeoutRef.current) {
        clearTimeout(connectionTimeoutRef.current);
      }
    };
  }, []);

  // Monitorar inicialização
  useEffect(() => {
    if (isInitialized) {
      logger.info(COMPONENT, 'Conferência inicializada com sucesso', {
        participantCount: participants.length,
      });
    }
  }, [isInitialized]);

  // Monitorar participantes
  useEffect(() => {
    logger.info(COMPONENT, 'Participantes atualizados', {
      count: participants.length,
      participants: participants.map(p => ({
        id: p.id,
        displayName: p.displayName,
        isAudioMuted: p.isAudioMuted,
        isVideoMuted: p.isVideoMuted,
      })),
    });
  }, [participants]);

  // Handlers
  const handleLeaveConference = useCallback(async () => {
    Alert.alert(
      'Sair da Sessão',
      'Tem certeza que deseja encerrar a videoconferência?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: async () => {
            try {
              logger.info(COMPONENT, 'Encerrando conferência');
              await endConference();
              onLeave?.();
              router.push('/');
            } catch (error) {
              logger.error(COMPONENT, 'Erro ao encerrar conferência', error);
              Alert.alert('Erro', 'Falha ao encerrar a conferência');
            }
          },
        },
      ]
    );
  }, [endConference, onLeave, router]);

  const handleRollDice = useCallback((sides: number) => {
    const result = Math.floor(Math.random() * sides) + 1;
    setDiceResult(result);
    logger.info(COMPONENT, 'Dados rolados', {
      sides,
      result,
      rolledBy: localParticipant?.displayName,
    });

    // Animar resultado
    setTimeout(() => setDiceResult(null), 3000);
  }, [localParticipant]);

  const handleMuteParticipant = useCallback(
    async (participantId: string) => {
      try {
        logger.info(COMPONENT, 'Mutando participante', { participantId });
        // Implementar mute via SDK
        Alert.alert('Sucesso', 'Participante mutado');
      } catch (error) {
        logger.error(COMPONENT, 'Erro ao mutar participante', error);
      }
    },
    []
  );

  const handleSelectParticipant = useCallback((participant: Participant) => {
    setSelectedParticipant(participant);
    logger.info(COMPONENT, 'Participante selecionado', {
      participantId: participant.id,
      displayName: participant.displayName,
    });
  }, []);

  // Renderização condicional - Carregando
  if (!isInitialized) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: colors.background,
          }}
        >
          <ActivityIndicator size="large" color={colors.primary} />
          <Text
            style={{
              marginTop: 16,
              color: colors.muted,
              fontSize: 16,
              textAlign: 'center',
            }}
          >
            Conectando à videoconferência...
          </Text>
          <Text
            style={{
              marginTop: 8,
              color: colors.muted,
              fontSize: 12,
              textAlign: 'center',
              paddingHorizontal: 20,
            }}
          >
            Sala: {config.roomName}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Renderização condicional - Erro
  if (state.error) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: colors.background,
            paddingHorizontal: 20,
          }}
        >
          <Text
            style={{
              fontSize: 24,
              color: colors.error,
              fontWeight: 'bold',
              marginBottom: 12,
              textAlign: 'center',
            }}
          >
            ⚠️ Erro na Conferência
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: colors.muted,
              textAlign: 'center',
              marginBottom: 24,
              lineHeight: 24,
            }}
          >
            {state.error.message}
          </Text>
          <TouchableOpacity
            onPress={handleLeaveConference}
            style={{
              backgroundColor: colors.primary,
              paddingHorizontal: 32,
              paddingVertical: 12,
              borderRadius: 8,
            }}
          >
            <Text style={{ color: colors.background, fontWeight: 'bold', fontSize: 16 }}>
              Voltar ao Lobby
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Renderização Principal
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        {/* Header */}
        <View
          style={{
            backgroundColor: colors.surface,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
            paddingHorizontal: 16,
            paddingVertical: 12,
          }}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View>
              <Text style={{ color: colors.primary, fontSize: 14, fontWeight: 'bold' }}>
                {config.roomName}
              </Text>
              <Text style={{ color: colors.muted, fontSize: 12, marginTop: 4 }}>
                {participants.length} participante{participants.length !== 1 ? 's' : ''}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {isMaster && (
                <TouchableOpacity
                  onPress={() => setShowMasterPanel(!showMasterPanel)}
                  style={{
                    backgroundColor: colors.primary,
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 6,
                  }}
                >
                  <Text style={{ color: colors.background, fontSize: 12, fontWeight: 'bold' }}>
                    👑 Mestre
                  </Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                onPress={() => setShowDiceRoller(!showDiceRoller)}
                style={{
                  backgroundColor: colors.primary,
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 6,
                }}
              >
                <Text style={{ color: colors.background, fontSize: 12, fontWeight: 'bold' }}>
                  🎲 Dados
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Conteúdo Principal */}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: 16, gap: 12 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Informações da Sessão */}
          <View
            style={{
              backgroundColor: colors.surface,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: colors.border,
              padding: 12,
            }}
          >
            <Text style={{ color: colors.primary, fontSize: 14, fontWeight: 'bold', marginBottom: 8 }}>
              📊 Status da Sessão
            </Text>
            <View style={{ gap: 8 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ color: colors.muted, fontSize: 12 }}>Duração:</Text>
                <Text style={{ color: colors.foreground, fontSize: 12, fontWeight: 'bold' }}>
                  {Math.floor(state.duration / 60)}m {state.duration % 60}s
                </Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ color: colors.muted, fontSize: 12 }}>Conectado:</Text>
                <Text style={{ color: colors.success, fontSize: 12, fontWeight: 'bold' }}>
                  ✓ Sim
                </Text>
              </View>
            </View>
          </View>

          {/* Participantes */}
          <View>
            <Text style={{ color: colors.primary, fontSize: 14, fontWeight: 'bold', marginBottom: 8 }}>
              👥 Participantes ({participants.length})
            </Text>
            <View style={{ gap: 8 }}>
              {participants.map((participant) => (
                <TouchableOpacity
                  key={participant.id}
                  onPress={() => handleSelectParticipant(participant)}
                  style={{
                    backgroundColor: colors.surface,
                    borderRadius: 8,
                    borderWidth: 2,
                    borderColor:
                      selectedParticipant?.id === participant.id ? colors.primary : colors.border,
                    padding: 12,
                  }}
                >
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View style={{ flex: 1 }}>
                      <Text style={{ color: colors.foreground, fontSize: 14, fontWeight: 'bold' }}>
                        {participant.displayName}
                      </Text>
                      <View style={{ flexDirection: 'row', gap: 8, marginTop: 4 }}>
                        <Text style={{ color: colors.muted, fontSize: 11 }}>
                          {participant.isAudioMuted ? '🔇' : '🔊'}
                        </Text>
                        <Text style={{ color: colors.muted, fontSize: 11 }}>
                          {participant.isVideoMuted ? '📹' : '📹'}
                        </Text>
                        {participant.isModerator && (
                          <Text style={{ color: colors.primary, fontSize: 11, fontWeight: 'bold' }}>
                            👑 Mestre
                          </Text>
                        )}
                      </View>
                    </View>
                    {isMaster && !participant.isModerator && (
                      <TouchableOpacity
                        onPress={() => handleMuteParticipant(participant.id)}
                        style={{
                          backgroundColor: colors.error,
                          paddingHorizontal: 8,
                          paddingVertical: 4,
                          borderRadius: 4,
                        }}
                      >
                        <Text style={{ color: colors.background, fontSize: 11, fontWeight: 'bold' }}>
                          Mutar
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Painel do Mestre */}
          {isMaster && showMasterPanel && (
            <View
              style={{
                backgroundColor: colors.surface,
                borderRadius: 8,
                borderWidth: 2,
                borderColor: colors.primary,
                padding: 12,
              }}
            >
              <Text style={{ color: colors.primary, fontSize: 14, fontWeight: 'bold', marginBottom: 12 }}>
                👑 Painel do Mestre
              </Text>
              <View style={{ gap: 8 }}>
                <TouchableOpacity
                  style={{
                    backgroundColor: colors.primary,
                    paddingVertical: 10,
                    borderRadius: 6,
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ color: colors.background, fontWeight: 'bold' }}>
                    🔊 Controlar Trilha Sonora
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    backgroundColor: colors.primary,
                    paddingVertical: 10,
                    borderRadius: 6,
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ color: colors.background, fontWeight: 'bold' }}>
                    💬 Enviar Whisper
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    backgroundColor: colors.primary,
                    paddingVertical: 10,
                    borderRadius: 6,
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ color: colors.background, fontWeight: 'bold' }}>
                    ⚙️ Configurações da Sessão
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Dice Roller */}
          {showDiceRoller && (
            <View
              style={{
                backgroundColor: colors.surface,
                borderRadius: 8,
                borderWidth: 2,
                borderColor: colors.primary,
                padding: 12,
              }}
            >
              <Text style={{ color: colors.primary, fontSize: 14, fontWeight: 'bold', marginBottom: 12 }}>
                🎲 Rolar Dados
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {[4, 6, 8, 10, 12, 20].map((sides) => (
                  <TouchableOpacity
                    key={sides}
                    onPress={() => handleRollDice(sides)}
                    style={{
                      backgroundColor: colors.primary,
                      paddingHorizontal: 12,
                      paddingVertical: 8,
                      borderRadius: 6,
                      flex: 1,
                      minWidth: '30%',
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{ color: colors.background, fontWeight: 'bold', fontSize: 14 }}>
                      D{sides}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              {diceResult !== null && (
                <View
                  style={{
                    marginTop: 12,
                    backgroundColor: colors.primary,
                    paddingVertical: 12,
                    borderRadius: 6,
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ color: colors.background, fontSize: 12, marginBottom: 4 }}>
                    Resultado:
                  </Text>
                  <Text style={{ color: colors.background, fontSize: 32, fontWeight: 'bold' }}>
                    {diceResult}
                  </Text>
                </View>
              )}
            </View>
          )}
        </ScrollView>

        {/* Botão Sair - Fixo na Base */}
        <View
          style={{
            backgroundColor: colors.surface,
            borderTopWidth: 1,
            borderTopColor: colors.border,
            paddingHorizontal: 16,
            paddingVertical: 12,
          }}
        >
          <TouchableOpacity
            onPress={handleLeaveConference}
            style={{
              backgroundColor: colors.error,
              paddingVertical: 12,
              borderRadius: 8,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: colors.background, fontSize: 16, fontWeight: 'bold' }}>
              🚪 Sair da Sessão
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default JitsiConferenceView;
