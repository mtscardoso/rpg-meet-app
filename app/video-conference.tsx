import { ScrollView, Text, View, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";

/**
 * Video Conference Screen - Tela Principal de Sessão
 *
 * Tela onde acontece a videoconferência com Jitsi Meet integrado
 * (Placeholder para integração futura)
 */
export default function VideoConferenceScreen() {
  const router = useRouter();
  const colors = useColors();
  const params = useLocalSearchParams();

  return (
    <ScreenContainer className="p-4 justify-between">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 gap-6 justify-center items-center">
          {/* Header */}
          <View className="items-center gap-2">
            <Text className="text-3xl font-bold text-primary">Sessão Ativa</Text>
            <Text className="text-base text-muted">Sala: {params.roomId}</Text>
          </View>

          {/* Placeholder Card */}
          <View className="w-full bg-surface rounded-lg p-6 border-2 border-border gap-4 items-center">
            <Text className="text-2xl font-bold text-foreground">
              {params.characterName}
            </Text>
            <Text className="text-lg text-primary">
              {params.characterClass}
            </Text>

            <View className="w-full h-64 bg-background rounded-lg border-2 border-border items-center justify-center">
              <Text className="text-muted text-center">
                Jitsi Meet será integrado aqui{"\n"}(Videoconferência)
              </Text>
            </View>

            <Text className="text-sm text-muted text-center">
              Aguardando integração do Jitsi React Native SDK...
            </Text>
          </View>

          {/* Quick Actions */}
          <View className="w-full gap-3">
            <TouchableOpacity
              onPress={() => {}}
              style={{
                backgroundColor: colors.primary,
                paddingHorizontal: 24,
                paddingVertical: 12,
                borderRadius: 8,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: colors.background,
                  fontSize: 16,
                  fontWeight: "bold",
                }}
              >
                🎲 Rolar Dados
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {}}
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
                🔊 Trilha Sonora
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.back()}
              style={{
                backgroundColor: colors.error,
                paddingHorizontal: 24,
                paddingVertical: 12,
                borderRadius: 8,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: colors.background,
                  fontSize: 16,
                  fontWeight: "bold",
                }}
              >
                Sair da Sessão
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
