import { ScrollView, Text, View, TouchableOpacity, TextInput, Alert } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";

/**
 * Home Screen - Lobby do RPG Meet
 *
 * Tela inicial com dois fluxos:
 * 1. Criar Sessão - Gera um ID novo e entra na videoconferência
 * 2. Entrar na Sessão - Usa um ID existente para entrar
 */
export default function HomeScreen() {
  const router = useRouter();
  const colors = useColors();
  
  const [activeTab, setActiveTab] = useState<"create" | "join">("create");
  
  // Fluxo: Criar Sessão
  const [createPlayerName, setCreatePlayerName] = useState("");
  const [createSelectedClass, setCreateSelectedClass] = useState("Guerreiro");
  const [createIsLoading, setCreateIsLoading] = useState(false);

  // Fluxo: Entrar na Sessão
  const [joinPlayerName, setJoinPlayerName] = useState("");
  const [joinRoomId, setJoinRoomId] = useState("");
  const [joinSelectedClass, setJoinSelectedClass] = useState("Guerreiro");
  const [joinIsLoading, setJoinIsLoading] = useState(false);

  const classes = ["Guerreiro", "Mago", "Clérigo", "Ladino", "Paladino", "Bardo"];

  const generateRoomId = () => {
    return `RPG-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  };

  const handleCreateSession = async () => {
    if (!createPlayerName.trim()) {
      Alert.alert("Erro", "Por favor, insira seu nome");
      return;
    }

    setCreateIsLoading(true);
    try {
      const roomId = generateRoomId();

      // Salvar preferências localmente
      await AsyncStorage.setItem(
        "playerPreferences",
        JSON.stringify({
          playerName: createPlayerName,
          selectedClass: createSelectedClass,
          lastRoomId: roomId,
        })
      );

      // Navegar direto para videoconferência
      router.push({
        pathname: "/video-conference",
        params: {
          playerName: createPlayerName,
          roomId,
          selectedClass: createSelectedClass,
        },
      });
    } catch (error) {
      Alert.alert("Erro", "Falha ao criar sessão");
    } finally {
      setCreateIsLoading(false);
    }
  };

  const handleJoinSession = async () => {
    if (!joinPlayerName.trim()) {
      Alert.alert("Erro", "Por favor, insira seu nome");
      return;
    }
    if (!joinRoomId.trim()) {
      Alert.alert("Erro", "Por favor, insira o ID da sala");
      return;
    }

    setJoinIsLoading(true);
    try {
      // Salvar preferências localmente
      await AsyncStorage.setItem(
        "playerPreferences",
        JSON.stringify({
          playerName: joinPlayerName,
          selectedClass: joinSelectedClass,
          lastRoomId: joinRoomId,
        })
      );

      // Navegar direto para videoconferência
      router.push({
        pathname: "/video-conference",
        params: {
          playerName: joinPlayerName,
          roomId: joinRoomId,
          selectedClass: joinSelectedClass,
        },
      });
    } catch (error) {
      Alert.alert("Erro", "Falha ao entrar na sessão");
    } finally {
      setJoinIsLoading(false);
    }
  };

  return (
    <ScreenContainer className="p-6 justify-between">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 gap-6">
          {/* Hero Section */}
          <View className="items-center gap-4 mt-8">
            <Text className="text-5xl font-bold text-primary">RPG Meet</Text>
            <Text className="text-base text-muted text-center">
              Videoconferência para Mestres e Jogadores
            </Text>
          </View>

          {/* Tab Buttons */}
          <View className="flex-row gap-3">
            <TouchableOpacity
              onPress={() => setActiveTab("create")}
              style={{
                flex: 1,
                backgroundColor: activeTab === "create" ? colors.primary : colors.surface,
                paddingHorizontal: 16,
                paddingVertical: 12,
                borderRadius: 8,
                alignItems: "center",
                borderWidth: 2,
                borderColor: colors.border,
              }}
            >
              <Text
                style={{
                  color: activeTab === "create" ? colors.background : colors.foreground,
                  fontSize: 14,
                  fontWeight: "600",
                }}
              >
                Criar Sessão
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setActiveTab("join")}
              style={{
                flex: 1,
                backgroundColor: activeTab === "join" ? colors.primary : colors.surface,
                paddingHorizontal: 16,
                paddingVertical: 12,
                borderRadius: 8,
                alignItems: "center",
                borderWidth: 2,
                borderColor: colors.border,
              }}
            >
              <Text
                style={{
                  color: activeTab === "join" ? colors.background : colors.foreground,
                  fontSize: 14,
                  fontWeight: "600",
                }}
              >
                Entrar na Sessão
              </Text>
            </TouchableOpacity>
          </View>

          {/* Criar Sessão Tab */}
          {activeTab === "create" && (
            <View className="w-full bg-surface rounded-lg p-6 border-2 border-border gap-4">
              <Text className="text-2xl font-bold text-foreground">Criar Nova Sessão</Text>

              {/* Name Input */}
              <View>
                <Text className="text-sm text-muted mb-2">Seu Nome</Text>
                <TextInput
                  className="bg-background rounded px-4 py-3 border border-border text-foreground"
                  placeholder="Seu nome aqui"
                  placeholderTextColor="#9B8B7E"
                  value={createPlayerName}
                  onChangeText={setCreatePlayerName}
                  editable={!createIsLoading}
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
                      onPress={() => setCreateSelectedClass(cls)}
                      disabled={createIsLoading}
                      style={{
                        paddingHorizontal: 16,
                        paddingVertical: 8,
                        backgroundColor:
                          createSelectedClass === cls ? colors.primary : colors.background,
                        borderRadius: 6,
                        borderWidth: 1,
                        borderColor: colors.border,
                      }}
                    >
                      <Text
                        style={{
                          color:
                            createSelectedClass === cls ? colors.background : colors.foreground,
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

              {/* Info Text */}
              <View
                style={{
                  backgroundColor: colors.background,
                  borderRadius: 6,
                  padding: 12,
                  borderLeftWidth: 4,
                  borderLeftColor: colors.primary,
                }}
              >
                <Text style={{ color: colors.muted, fontSize: 12 }}>
                  💡 Um ID de sala será gerado automaticamente. Compartilhe com seus amigos!
                </Text>
              </View>

              {/* Primary Button */}
              <TouchableOpacity
                onPress={handleCreateSession}
                disabled={createIsLoading}
                style={{
                  backgroundColor: colors.primary,
                  paddingHorizontal: 24,
                  paddingVertical: 16,
                  borderRadius: 8,
                  alignItems: "center",
                  opacity: createIsLoading ? 0.6 : 1,
                }}
              >
                <Text
                  style={{
                    color: colors.background,
                    fontSize: 18,
                    fontWeight: "bold",
                  }}
                >
                  {createIsLoading ? "Criando..." : "Criar Sessão"}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Entrar na Sessão Tab */}
          {activeTab === "join" && (
            <View className="w-full bg-surface rounded-lg p-6 border-2 border-border gap-4">
              <Text className="text-2xl font-bold text-foreground">Entrar em Sessão</Text>

              {/* Name Input */}
              <View>
                <Text className="text-sm text-muted mb-2">Seu Nome</Text>
                <TextInput
                  className="bg-background rounded px-4 py-3 border border-border text-foreground"
                  placeholder="Seu nome aqui"
                  placeholderTextColor="#9B8B7E"
                  value={joinPlayerName}
                  onChangeText={setJoinPlayerName}
                  editable={!joinIsLoading}
                />
              </View>

              {/* Room ID Input */}
              <View>
                <Text className="text-sm text-muted mb-2">ID da Sala</Text>
                <TextInput
                  className="bg-background rounded px-4 py-3 border border-border text-foreground"
                  placeholder="Ex: RPG-ABC123"
                  placeholderTextColor="#9B8B7E"
                  value={joinRoomId}
                  onChangeText={setJoinRoomId}
                  editable={!joinIsLoading}
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
                      onPress={() => setJoinSelectedClass(cls)}
                      disabled={joinIsLoading}
                      style={{
                        paddingHorizontal: 16,
                        paddingVertical: 8,
                        backgroundColor:
                          joinSelectedClass === cls ? colors.primary : colors.background,
                        borderRadius: 6,
                        borderWidth: 1,
                        borderColor: colors.border,
                      }}
                    >
                      <Text
                        style={{
                          color:
                            joinSelectedClass === cls ? colors.background : colors.foreground,
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
                onPress={handleJoinSession}
                disabled={joinIsLoading}
                style={{
                  backgroundColor: colors.primary,
                  paddingHorizontal: 24,
                  paddingVertical: 16,
                  borderRadius: 8,
                  alignItems: "center",
                  opacity: joinIsLoading ? 0.6 : 1,
                }}
              >
                <Text
                  style={{
                    color: colors.background,
                    fontSize: 18,
                    fontWeight: "bold",
                  }}
                >
                  {joinIsLoading ? "Entrando..." : "Entrar na Sessão"}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Secondary Actions */}
          <View className="gap-3">
            <TouchableOpacity
              onPress={() => router.push("/character-sheet")}
              style={{
                backgroundColor: colors.surface,
                paddingHorizontal: 24,
                paddingVertical: 12,
                borderRadius: 8,
                alignItems: "center",
                borderWidth: 2,
                borderColor: colors.border,
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
              style={{
                backgroundColor: colors.surface,
                paddingHorizontal: 24,
                paddingVertical: 12,
                borderRadius: 8,
                alignItems: "center",
                borderWidth: 2,
                borderColor: colors.border,
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
