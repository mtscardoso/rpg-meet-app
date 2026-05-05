import { ScrollView, Text, View, TouchableOpacity, Switch } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";

import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useColorScheme } from "@/hooks/use-color-scheme";

/**
 * Settings Screen - Configurações
 *
 * Tela para ajustar preferências do aplicativo
 */
export default function SettingsScreen() {
  const router = useRouter();
  const colors = useColors();
  const colorScheme = useColorScheme();
  
  const [darkMode, setDarkMode] = useState(colorScheme === "dark");
  const [notifications, setNotifications] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);
  const [haptics, setHaptics] = useState(true);

  return (
    <ScreenContainer className="p-4">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="gap-6">
          {/* Header */}
          <View className="items-center gap-2 mt-4">
            <Text className="text-4xl font-bold text-primary">Configurações</Text>
          </View>

          {/* Display Settings */}
          <View className="bg-surface rounded-lg p-4 border-2 border-border gap-4">
            <Text className="text-lg font-bold text-foreground mb-2">Exibição</Text>

            <View className="flex-row justify-between items-center">
              <View className="flex-1">
                <Text className="text-base text-foreground">Modo Escuro</Text>
                <Text className="text-sm text-muted">Tema medieval Grimdark</Text>
              </View>
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={darkMode ? colors.primary : colors.muted}
              />
            </View>
          </View>

          {/* Audio Settings */}
          <View className="bg-surface rounded-lg p-4 border-2 border-border gap-4">
            <Text className="text-lg font-bold text-foreground mb-2">Áudio</Text>

            <View className="flex-row justify-between items-center">
              <View className="flex-1">
                <Text className="text-base text-foreground">Notificações</Text>
                <Text className="text-sm text-muted">Sons de alerta</Text>
              </View>
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={notifications ? colors.primary : colors.muted}
              />
            </View>

            <View className="flex-row justify-between items-center">
              <View className="flex-1">
                <Text className="text-base text-foreground">Efeitos Sonoros</Text>
                <Text className="text-sm text-muted">Sons de ação e dados</Text>
              </View>
              <Switch
                value={soundEffects}
                onValueChange={setSoundEffects}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={soundEffects ? colors.primary : colors.muted}
              />
            </View>
          </View>

          {/* Haptics Settings */}
          <View className="bg-surface rounded-lg p-4 border-2 border-border gap-4">
            <Text className="text-lg font-bold text-foreground mb-2">Feedback Tátil</Text>

            <View className="flex-row justify-between items-center">
              <View className="flex-1">
                <Text className="text-base text-foreground">Vibração</Text>
                <Text className="text-sm text-muted">Feedback ao pressionar botões</Text>
              </View>
              <Switch
                value={haptics}
                onValueChange={setHaptics}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={haptics ? colors.primary : colors.muted}
              />
            </View>
          </View>

          {/* About */}
          <View className="bg-surface rounded-lg p-4 border-2 border-border gap-3">
            <Text className="text-lg font-bold text-foreground mb-2">Sobre</Text>

            <View className="gap-2">
              <View className="flex-row justify-between">
                <Text className="text-base text-muted">Versão</Text>
                <Text className="text-base text-foreground font-semibold">1.0.0</Text>
              </View>

              <View className="flex-row justify-between">
                <Text className="text-base text-muted">Desenvolvedor</Text>
                <Text className="text-base text-foreground font-semibold">RPG Meet</Text>
              </View>

              <TouchableOpacity
                onPress={() => {}}
                style={{
                  paddingVertical: 8,
                  borderTopWidth: 1,
                  borderTopColor: colors.border,
                  marginTop: 8,
                }}
              >
                <Text style={{ color: colors.primary, fontSize: 14, fontWeight: "600" }}>
                  Ver Termos de Serviço
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {}}
              >
                <Text style={{ color: colors.primary, fontSize: 14, fontWeight: "600" }}>
                  Política de Privacidade
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Action Buttons */}
          <View className="gap-3 mb-6">
            <TouchableOpacity
              onPress={() => router.back()}
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
                Voltar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
