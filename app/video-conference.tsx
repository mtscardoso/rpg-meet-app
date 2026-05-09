import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { ScreenContainer } from '@/components/screen-container';
import { DiceRoller } from '@/components/dice-roller';
import { useColors } from '@/hooks/use-colors';
import { cn } from '@/lib/utils';

interface SessionParams {
  playerName?: string;
  roomId?: string;
  selectedClass?: string;
  isMaster?: string;
}

export default function VideoConferenceScreen() {
  const router = useRouter();
  const colors = useColors();
  const params = useLocalSearchParams() as SessionParams;
  const [isLoading, setIsLoading] = useState(false);
  const [diceHistory, setDiceHistory] = useState<number[]>([]);

  const playerName = params.playerName || 'Jogador';
  const roomId = params.roomId || 'UNKNOWN';
  const selectedClass = params.selectedClass || 'Aventureiro';
  const isMaster = params.isMaster === 'true';

  const openJitsiMeeting = async () => {
    setIsLoading(true);
    try {
      const jitsiUrl = `https://meet.jitsi.org/${roomId}`;
      await WebBrowser.openBrowserAsync(jitsiUrl);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível abrir a videoconferência');
      console.error('Erro ao abrir Jitsi:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDiceRoll = (result: number) => {
    setDiceHistory((prev) => [result, ...prev.slice(0, 9)]);
    console.log(`${playerName} rolou D20: ${result}`);
  };

  const exitSession = () => {
    Alert.alert(
      'Sair da Sessão',
      'Tem certeza que deseja sair?',
      [
        { text: 'Cancelar', onPress: () => {}, style: 'cancel' },
        {
          text: 'Sair',
          onPress: () => {
            router.push('/');
          },
          style: 'destructive',
        },
      ]
    );
  };

  return (
    <ScreenContainer className="p-0" containerClassName="bg-black">
      <ScrollView className="flex-1 bg-black">
        {/* Header */}
        <View
          className="p-4 border-b gap-2"
          style={{ borderBottomColor: colors.primary }}
        >
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <Text
                className="text-lg font-bold"
                style={{ color: colors.primary }}
              >
                {isMaster ? '👑 MESTRE' : '🗡️ JOGADOR'}
              </Text>
              <Text className="text-sm" style={{ color: colors.muted }}>
                {playerName} • {selectedClass}
              </Text>
            </View>
            <View
              className="px-3 py-1 rounded-full"
              style={{ backgroundColor: colors.surface }}
            >
              <Text className="text-xs font-mono" style={{ color: colors.primary }}>
                {roomId}
              </Text>
            </View>
          </View>
        </View>

        {/* Mestre Badge */}
        {isMaster && (
          <View
            className="mx-4 mt-4 p-4 rounded-lg border-2 border-yellow-500"
            style={{ backgroundColor: 'rgba(234, 179, 8, 0.1)' }}
          >
            <Text className="text-center font-bold text-yellow-500">
              👑 Você é o Mestre desta Sessão
            </Text>
            <Text className="text-center text-xs text-yellow-400 mt-1">
              Você tem controle total da sala
            </Text>
          </View>
        )}

        {/* Jitsi Meeting Button */}
        <View className="p-4 gap-3">
          <Pressable
            onPress={openJitsiMeeting}
            disabled={isLoading}
            className={cn(
              'py-4 rounded-lg items-center justify-center',
              isLoading ? 'opacity-60' : 'opacity-100'
            )}
            style={{ backgroundColor: colors.primary }}
          >
            {isLoading ? (
              <ActivityIndicator color={colors.background} />
            ) : (
              <Text className="font-bold text-base" style={{ color: colors.background }}>
                📹 Abrir Videoconferência
              </Text>
            )}
          </Pressable>

          <Text className="text-xs text-center" style={{ color: colors.muted }}>
            Clique para abrir a sala Jitsi no navegador
          </Text>
        </View>

        {/* Dice Roller */}
        <View className="p-4 gap-4 border-t" style={{ borderTopColor: colors.border }}>
          <Text className="text-lg font-bold" style={{ color: colors.foreground }}>
            🎲 Rolar Dados
          </Text>
          <DiceRoller onRoll={handleDiceRoll} />
        </View>

        {/* Dice History */}
        {diceHistory.length > 0 && (
          <View className="p-4 gap-2 border-t" style={{ borderTopColor: colors.border }}>
            <Text className="text-sm font-semibold" style={{ color: colors.foreground }}>
              Histórico de Rolagens
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {diceHistory.map((roll, index) => (
                <View
                  key={index}
                  className="px-3 py-2 rounded-lg"
                  style={{
                    backgroundColor: colors.surface,
                    borderLeftWidth: 3,
                    borderLeftColor:
                      roll === 20
                        ? '#22c55e'
                        : roll === 1
                          ? '#ef4444'
                          : colors.primary,
                  }}
                >
                  <Text
                    className="font-bold text-sm"
                    style={{
                      color:
                        roll === 20
                          ? '#22c55e'
                          : roll === 1
                            ? '#ef4444'
                            : colors.primary,
                    }}
                  >
                    {roll}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Mestre Controls */}
        {isMaster && (
          <View className="p-4 gap-3 border-t" style={{ borderTopColor: colors.border }}>
            <Text className="text-lg font-bold text-yellow-500">
              ⚙️ Controles do Mestre
            </Text>
            <Pressable
              className="py-3 px-4 rounded-lg border-2 border-yellow-500 items-center"
              style={{ backgroundColor: 'rgba(234, 179, 8, 0.1)' }}
            >
              <Text className="font-semibold text-yellow-500">
                🔇 Mutar Participantes
              </Text>
            </Pressable>
            <Pressable
              className="py-3 px-4 rounded-lg border-2 border-yellow-500 items-center"
              style={{ backgroundColor: 'rgba(234, 179, 8, 0.1)' }}
            >
              <Text className="font-semibold text-yellow-500">
                💬 Enviar Whisper
              </Text>
            </Pressable>
            <Pressable
              className="py-3 px-4 rounded-lg border-2 border-yellow-500 items-center"
              style={{ backgroundColor: 'rgba(234, 179, 8, 0.1)' }}
            >
              <Text className="font-semibold text-yellow-500">
                🎵 Trilha Sonora
              </Text>
            </Pressable>
          </View>
        )}

        {/* Exit Button */}
        <View className="p-4 gap-2 pb-8">
          <Pressable
            onPress={exitSession}
            className="py-3 px-4 rounded-lg items-center"
            style={{ backgroundColor: '#ef4444' }}
          >
            <Text className="font-bold text-white">
              ❌ Sair da Sessão
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
