import { ScrollView, Text, View, TouchableOpacity, TextInput, Alert } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";

/**
 * Home Screen - Lobby do RPG Meet
 *
 * Tela inicial onde o jogador pode entrar em uma sala de RPG
 * ou criar uma nova sessão.
 */
export default function HomeScreen() {
  const router = useRouter();
  const colors = useColors();
  
  const [playerName, setPlayerName] = useState("");
  const [roomId, setRoomId] = useState("");
  const [selectedClass, setSelectedClass] = useState("Guerreiro");
  const [isLoading, setIsLoading] = useState(false);

  const classes = ["Guerreiro", "Mago", "Clérigo", "Ladino", "Paladino", "Bardo"];

  const generateRoomId = () => {
    const id = `RPG-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    setRoomId(id);
  };

  const handleEnterSession = async () => {
    if (!playerName.trim()) {
      Alert.alert("Erro", "Por favor, insira seu nome");
      return;
    }
    if (!roomId.trim()) {
      Alert.alert("Erro", "Por favor, insira ou gere um ID de sala");
      return;
    }

    setIsLoading(true);
    try {
      // Salvar preferências localmente
      await AsyncStorage.setItem(
        "playerPreferences",
        JSON.stringify({
          playerName,
          selectedClass,
          lastRoomId: roomId,
        })
      );

      // Navegar direto para videoconferência
      router.push({
        pathname: "/video-conference",
        params: {
          playerName,
          roomId,
          selectedClass,
        },
      });
    } catch (error) {
      Alert.alert("Erro", "Falha ao salvar preferências");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScreenContainer className="p-6 justify-between">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 gap-8">
          {/* Hero Section */}
          <View className="items-center gap-4 mt-8">
            <Text className="text-5xl font-bold text-primary">RPG Meet</Text>
            <Text className="text-base text-muted text-center">
              Videoconferência para Mestres e Jogadores
            </Text>
          </View>

          {/* Main Card - Lobby */}
          <View className="w-full bg-surface rounded-lg p-6 border-2 border-border gap-4">
            <Text className="text-2xl font-bold text-foreground">Entrar em Sessão</Text>
            
            {/* Name Input */}
            <View>
              <Text className="text-sm text-muted mb-2">Nome do Jogador</Text>
              <TextInput
                className="bg-background rounded px-4 py-3 border border-border text-foreground"
                placeholder="Seu nome aqui"
                placeholderTextColor="#9B8B7E"
                value={playerName}
                onChangeText={setPlayerName}
                editable={!isLoading}
              />
            </View>

            {/* Room ID Input */}
            <View>
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-sm text-muted">ID da Sala</Text>
                <TouchableOpacity
                  onPress={generateRoomId}
                  disabled={isLoading}
                  style={{
                    paddingHorizontal: 12,
                    paddingVertical: 4,
                    backgroundColor: colors.surface,
                    borderRadius: 4,
                    borderWidth: 1,
                    borderColor: colors.border,
                  }}
                >
                  <Text className="text-xs text-primary font-semibold">Gerar</Text>
                </TouchableOpacity>
              </View>
              <TextInput
                className="bg-background rounded px-4 py-3 border border-border text-foreground"
                placeholder="Ex: DRAGON-2024"
                placeholderTextColor="#9B8B7E"
                value={roomId}
                onChangeText={setRoomId}
                editable={!isLoading}
              />
            </View>

            {/* Class Selector */}
            <View>
              <Text className="text-sm text-muted mb-2">Classe</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="gap-2"
              >
                {classes.map((cls) => (
                  <TouchableOpacity
                    key={cls}
                    onPress={() => setSelectedClass(cls)}
                    disabled={isLoading}
                    style={{
                      paddingHorizontal: 16,
                      paddingVertical: 8,
                      backgroundColor:
                        selectedClass === cls ? colors.primary : colors.background,
                      borderRadius: 6,
                      borderWidth: 1,
                      borderColor: colors.border,
                    }}
                  >
                    <Text
                      style={{
                        color: selectedClass === cls ? colors.background : colors.foreground,
                        fontSize: 14,
                        fontWeight: "600",
                      }}
                    >
                      {cls}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Primary Button */}
            <TouchableOpacity
              onPress={handleEnterSession}
              disabled={isLoading}
              style={{
                backgroundColor: colors.primary,
                paddingHorizontal: 24,
                paddingVertical: 16,
                borderRadius: 8,
                alignItems: "center",
                opacity: isLoading ? 0.6 : 1,
              }}
            >
              <Text
                style={{
                  color: colors.background,
                  fontSize: 18,
                  fontWeight: "bold",
                }}
              >
                {isLoading ? "Carregando..." : "Entrar na Sessão"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Secondary Actions */}
          <View className="gap-3">
            <TouchableOpacity
              onPress={() => router.push("/character-sheet")}
              disabled={isLoading}
              style={{
                backgroundColor: colors.surface,
                paddingHorizontal: 24,
                paddingVertical: 12,
                borderRadius: 8,
                alignItems: "center",
                borderWidth: 2,
                borderColor: colors.border,
                opacity: isLoading ? 0.6 : 1,
              }}
            >
              <Text
                style={{
                  color: colors.foreground,
                  fontSize: 16,
                  fontWeight: "600",
                }}
              >
                Minhas Fichas
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push("/settings")}
              disabled={isLoading}
              style={{
                backgroundColor: colors.surface,
                paddingHorizontal: 24,
                paddingVertical: 12,
                borderRadius: 8,
                alignItems: "center",
                borderWidth: 2,
                borderColor: colors.border,
                opacity: isLoading ? 0.6 : 1,
              }}
            >
              <Text
                style={{
                  color: colors.foreground,
                  fontSize: 16,
                  fontWeight: "600",
                }}
              >
                Configurações
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
