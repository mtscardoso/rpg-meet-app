import { ScrollView, Text, View, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

import { ScreenContainer } from "@/components/screen-container";

/**
 * Home Screen - Lobby do RPG Meet
 *
 * Tela inicial onde o jogador pode entrar em uma sala de RPG
 * ou criar uma nova sessão.
 */
export default function HomeScreen() {
  const router = useRouter();

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
              <View className="bg-background rounded px-4 py-3 border border-border">
                <Text className="text-foreground">Seu nome aqui</Text>
              </View>
            </View>

            {/* Room ID Input */}
            <View>
              <Text className="text-sm text-muted mb-2">ID da Sala</Text>
              <View className="bg-background rounded px-4 py-3 border border-border">
                <Text className="text-foreground">Ex: DRAGON-2024</Text>
              </View>
            </View>

            {/* Class Selector */}
            <View>
              <Text className="text-sm text-muted mb-2">Classe</Text>
              <View className="bg-background rounded px-4 py-3 border border-border">
                <Text className="text-foreground">Selecione sua classe</Text>
              </View>
            </View>

            {/* Primary Button */}
            <TouchableOpacity 
              className="bg-primary px-6 py-4 rounded active:opacity-80 items-center"
              onPress={() => router.push("/(tabs)")}
            >
              <Text className="text-background font-bold text-lg">Entrar na Sessão</Text>
            </TouchableOpacity>
          </View>

          {/* Secondary Actions */}
          <View className="gap-3">
            <TouchableOpacity 
              className="bg-surface px-6 py-3 rounded border-2 border-border active:opacity-80 items-center"
              onPress={() => {}}
            >
              <Text className="text-foreground font-semibold">Minhas Fichas</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              className="bg-surface px-6 py-3 rounded border-2 border-border active:opacity-80 items-center"
              onPress={() => {}}
            >
              <Text className="text-foreground font-semibold">Configurações</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
