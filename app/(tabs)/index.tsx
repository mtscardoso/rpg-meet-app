import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  Text,
  View,
  TextInput,
  Pressable,
  Alert,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import { cn } from '@/lib/utils';

const CLASSES = ['Guerreiro', 'Mago', 'Clérigo', 'Ladino', 'Paladino', 'Bardo'];

interface LobbyState {
  playerName: string;
  roomId: string;
  selectedClass: string;
  activeTab: 'create' | 'join';
}

export default function HomeScreen() {
  const router = useRouter();
  const colors = useColors();
  const [state, setState] = useState<LobbyState>({
    playerName: '',
    roomId: '',
    selectedClass: CLASSES[0],
    activeTab: 'create',
  });

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const saved = await AsyncStorage.getItem('playerPreferences');
      if (saved) {
        const prefs = JSON.parse(saved);
        setState((prev) => ({
          ...prev,
          playerName: prefs.playerName || '',
          selectedClass: prefs.selectedClass || CLASSES[0],
        }));
      }
    } catch (error) {
      console.error('Erro ao carregar preferências:', error);
    }
  };

  const savePreferences = async () => {
    try {
      await AsyncStorage.setItem(
        'playerPreferences',
        JSON.stringify({
          playerName: state.playerName,
          selectedClass: state.selectedClass,
        })
      );
    } catch (error) {
      console.error('Erro ao salvar preferências:', error);
    }
  };

  const generateRoomId = () => {
    const id = Math.random().toString(36).substring(2, 8).toUpperCase();
    setState((prev) => ({ ...prev, roomId: id }));
  };

  const validateAndNavigate = (isMaster: boolean) => {
    if (!state.playerName.trim()) {
      Alert.alert('Erro', 'Por favor, insira seu nome');
      return;
    }

    if (!isMaster && !state.roomId.trim()) {
      Alert.alert('Erro', 'Por favor, insira o ID da sala');
      return;
    }

    savePreferences();

    const sessionData = {
      playerName: state.playerName,
      roomId: isMaster ? state.roomId : state.roomId,
      selectedClass: state.selectedClass,
      isMaster: isMaster ? 'true' : 'false',
    };

    router.push({
      pathname: '/video-conference',
      params: sessionData as any,
    });
  };

  return (
    <ScreenContainer
      className="p-0"
      containerClassName="bg-black"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        className="bg-black"
      >
        {/* Header */}
        <View className="p-6 items-center gap-2 border-b" style={{ borderBottomColor: colors.primary }}>
          <Text
            className="text-4xl font-bold"
            style={{ color: colors.primary }}
          >
            ⚔️ RPG Meet
          </Text>
          <Text
            className="text-sm text-center"
            style={{ color: colors.muted }}
          >
            Videoconferência para Mestres e Jogadores
          </Text>
        </View>

        {/* Tabs */}
        <View className="flex-row gap-2 p-4 border-b" style={{ borderBottomColor: colors.border }}>
          <Pressable
            onPress={() => setState((prev) => ({ ...prev, activeTab: 'create' }))}
            className={cn(
              'flex-1 py-3 px-4 rounded-lg items-center',
              state.activeTab === 'create'
                ? 'bg-yellow-500'
                : 'bg-gray-700'
            )}
          >
            <Text
              className="font-bold text-sm"
              style={{
                color: state.activeTab === 'create' ? '#000' : colors.foreground,
              }}
            >
              👑 Criar Sessão
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setState((prev) => ({ ...prev, activeTab: 'join' }))}
            className={cn(
              'flex-1 py-3 px-4 rounded-lg items-center',
              state.activeTab === 'join'
                ? 'bg-yellow-500'
                : 'bg-gray-700'
            )}
          >
            <Text
              className="font-bold text-sm"
              style={{
                color: state.activeTab === 'join' ? '#000' : colors.foreground,
              }}
            >
              🗡️ Entrar na Sessão
            </Text>
          </Pressable>
        </View>

        {/* Content */}
        <View className="flex-1 p-6 gap-6">
          {/* Nome do Jogador */}
          <View className="gap-2">
            <Text className="text-sm font-semibold" style={{ color: colors.foreground }}>
              Seu Nome
            </Text>
            <TextInput
              placeholder="Digite seu nome"
              placeholderTextColor={colors.muted}
              value={state.playerName}
              onChangeText={(text) =>
                setState((prev) => ({ ...prev, playerName: text }))
              }
              className="p-3 rounded-lg border"
              style={{
                borderColor: colors.border,
                backgroundColor: colors.surface,
                color: colors.foreground,
              }}
            />
          </View>

          {/* Criar Sessão */}
          {state.activeTab === 'create' && (
            <View className="gap-4">
              <View
                className="p-4 rounded-lg border-l-4"
                style={{
                  backgroundColor: colors.surface,
                  borderLeftColor: colors.primary,
                }}
              >
                <Text className="text-sm" style={{ color: colors.foreground }}>
                  💡 Você será o <Text className="font-bold">Mestre</Text> desta sessão
                </Text>
              </View>

              <View className="gap-2">
                <Text className="text-sm font-semibold" style={{ color: colors.foreground }}>
                  ID da Sala
                </Text>
                <View className="flex-row gap-2">
                  <TextInput
                    placeholder="ID será gerado"
                    placeholderTextColor={colors.muted}
                    value={state.roomId}
                    editable={false}
                    className="flex-1 p-3 rounded-lg border"
                    style={{
                      borderColor: colors.border,
                      backgroundColor: colors.surface,
                      color: colors.foreground,
                    }}
                  />
                  <Pressable
                    onPress={generateRoomId}
                    className="bg-yellow-500 px-4 rounded-lg items-center justify-center"
                  >
                    <Text className="font-bold text-black text-sm">Gerar</Text>
                  </Pressable>
                </View>
              </View>

              <Pressable
                onPress={() => validateAndNavigate(true)}
                className="bg-yellow-500 py-4 rounded-lg items-center border-2"
                style={{ borderColor: '#D4AF37' }}
              >
                <Text className="font-bold text-black text-base">
                  👑 Criar Sessão como Mestre
                </Text>
              </Pressable>
            </View>
          )}

          {/* Entrar na Sessão */}
          {state.activeTab === 'join' && (
            <View className="gap-4">
              {/* ID da Sala */}
              <View className="gap-2">
                <Text className="text-sm font-semibold" style={{ color: colors.foreground }}>
                  ID da Sala
                </Text>
                <TextInput
                  placeholder="Digite o ID da sala"
                  placeholderTextColor={colors.muted}
                  value={state.roomId}
                  onChangeText={(text) =>
                    setState((prev) => ({ ...prev, roomId: text.toUpperCase() }))
                  }
                  className="p-3 rounded-lg border"
                  style={{
                    borderColor: colors.border,
                    backgroundColor: colors.surface,
                    color: colors.foreground,
                  }}
                />
              </View>

              {/* Classe */}
              <View className="gap-2">
                <Text className="text-sm font-semibold" style={{ color: colors.foreground }}>
                  Escolha sua Classe
                </Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="gap-2">
                  <View className="flex-row gap-2">
                    {CLASSES.map((cls) => (
                      <Pressable
                        key={cls}
                        onPress={() =>
                          setState((prev) => ({ ...prev, selectedClass: cls }))
                        }
                        className={cn(
                          'px-4 py-2 rounded-lg border-2',
                          state.selectedClass === cls
                            ? 'bg-yellow-500 border-yellow-600'
                            : 'bg-gray-700 border-gray-600'
                        )}
                      >
                        <Text
                          className="font-semibold text-sm"
                          style={{
                            color: state.selectedClass === cls ? '#000' : colors.foreground,
                          }}
                        >
                          {cls}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </ScrollView>
              </View>

              <Pressable
                onPress={() => validateAndNavigate(false)}
                className="bg-yellow-500 py-4 rounded-lg items-center border-2"
                style={{ borderColor: '#D4AF37' }}
              >
                <Text className="font-bold text-black text-base">
                  🗡️ Entrar na Sessão
                </Text>
              </Pressable>
            </View>
          )}

          {/* Botões Secundários */}
          <View className="gap-2 mt-4">
            <Pressable
              onPress={() => router.push('/character-sheet')}
              className="py-3 px-4 rounded-lg border-2"
              style={{
                borderColor: colors.primary,
                backgroundColor: colors.surface,
              }}
            >
              <Text className="text-center font-semibold" style={{ color: colors.foreground }}>
                📋 Minhas Fichas
              </Text>
            </Pressable>

            <Pressable
              onPress={() => router.push('/settings')}
              className="py-3 px-4 rounded-lg border-2"
              style={{
                borderColor: colors.primary,
                backgroundColor: colors.surface,
              }}
            >
              <Text className="text-center font-semibold" style={{ color: colors.foreground }}>
                ⚙️ Configurações
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
