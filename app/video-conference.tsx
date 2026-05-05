import { View, TouchableOpacity, Text, Alert, ScrollView, Dimensions } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import * as WebBrowser from "expo-web-browser";

import { useColors } from "@/hooks/use-colors";

/**
 * Video Conference Screen - Tela Principal de Sessão
 *
 * Abre a videoconferência Jitsi Meet em um navegador nativo
 * Exibe informações da sessão enquanto o navegador está aberto
 */
export default function VideoConferenceScreen() {
  const router = useRouter();
  const colors = useColors();
  const params = useLocalSearchParams();
  const [isJitsiOpen, setIsJitsiOpen] = useState(false);

  const roomName = (params.roomId as string) || "RPG-DEFAULT";
  const displayName = (params.playerName as string) || "Jogador";
  const characterClass = (params.selectedClass as string) || "Guerreiro";

  // URL do Jitsi Meet
  const jitsiUrl = `https://meet.jitsi.org/${encodeURIComponent(roomName)}#config.startWithAudioMuted=false&config.startWithVideoMuted=false&userInfo.displayName="${encodeURIComponent(displayName)}"`;

  useEffect(() => {
    console.log("Video Conference iniciada:", {
      roomName,
      displayName,
      characterClass,
      jitsiUrl,
    });

    // Abrir Jitsi automaticamente
    openJitsiMeeting();
  }, []);

  const openJitsiMeeting = async () => {
    try {
      console.log("Abrindo Jitsi Meet em navegador nativo...");
      setIsJitsiOpen(true);

      const result = await WebBrowser.openBrowserAsync(jitsiUrl);

      console.log("Resultado do navegador:", result);

      if (result.type === "dismiss" || result.type === "cancel") {
        console.log("Usuário fechou o navegador");
        setIsJitsiOpen(false);
      }
    } catch (error) {
      console.error("Erro ao abrir Jitsi:", error);
      Alert.alert(
        "Erro",
        "Não foi possível abrir a videoconferência. Verifique sua conexão com a internet."
      );
      setIsJitsiOpen(false);
    }
  };

  const handleRetry = () => {
    openJitsiMeeting();
  };

  const handleLeaveConference = () => {
    Alert.alert("Sair da Sessão", "Tem certeza que deseja sair?", [
      { text: "Cancelar", onPress: () => {} },
      {
        text: "Sair",
        onPress: () => {
          router.back();
        },
        style: "destructive",
      },
    ]);
  };

  const screenWidth = Dimensions.get("window").width;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Main Content */}
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
        }}
      >
        <View style={{ alignItems: "center", gap: 20 }}>
          {/* Icon */}
          <Text style={{ fontSize: 64 }}>🎥</Text>

          {/* Title */}
          <Text
            style={{
              fontSize: 24,
              fontWeight: "bold",
              color: colors.primary,
              textAlign: "center",
            }}
          >
            Videoconferência Jitsi Meet
          </Text>

          {/* Status */}
          <View
            style={{
              backgroundColor: colors.surface,
              borderRadius: 8,
              padding: 16,
              borderWidth: 2,
              borderColor: colors.border,
              width: "100%",
            }}
          >
            <Text style={{ color: colors.muted, fontSize: 12, marginBottom: 8 }}>
              Status da Sessão
            </Text>

            <View style={{ gap: 12 }}>
              <View>
                <Text style={{ color: colors.muted, fontSize: 11 }}>Sala</Text>
                <Text
                  style={{
                    color: colors.primary,
                    fontSize: 16,
                    fontWeight: "bold",
                  }}
                >
                  {roomName}
                </Text>
              </View>

              <View>
                <Text style={{ color: colors.muted, fontSize: 11 }}>Jogador</Text>
                <Text
                  style={{
                    color: colors.foreground,
                    fontSize: 14,
                    fontWeight: "bold",
                  }}
                >
                  {displayName}
                </Text>
              </View>

              <View>
                <Text style={{ color: colors.muted, fontSize: 11 }}>Classe</Text>
                <Text
                  style={{
                    color: colors.foreground,
                    fontSize: 14,
                    fontWeight: "bold",
                  }}
                >
                  {characterClass}
                </Text>
              </View>
            </View>
          </View>

          {/* Info Box */}
          <View
            style={{
              backgroundColor: colors.background,
              borderRadius: 8,
              padding: 16,
              borderLeftWidth: 4,
              borderLeftColor: colors.primary,
              width: "100%",
            }}
          >
            <Text
              style={{
                color: colors.muted,
                fontSize: 13,
                lineHeight: 20,
              }}
            >
              {isJitsiOpen
                ? "📱 A videoconferência Jitsi Meet foi aberta em um navegador. Retorne aqui quando terminar."
                : "📱 Clique em 'Abrir Jitsi' para iniciar a videoconferência com seus amigos."}
            </Text>
          </View>

          {/* Action Buttons */}
          <View style={{ gap: 12, width: "100%" }}>
            <TouchableOpacity
              onPress={openJitsiMeeting}
              style={{
                backgroundColor: colors.primary,
                paddingHorizontal: 24,
                paddingVertical: 16,
                borderRadius: 8,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: colors.background,
                  fontSize: 18,
                  fontWeight: "bold",
                }}
              >
                {isJitsiOpen ? "Abrir Novamente" : "Abrir Jitsi"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleLeaveConference}
              style={{
                backgroundColor: colors.error,
                paddingHorizontal: 24,
                paddingVertical: 16,
                borderRadius: 8,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: colors.background,
                  fontSize: 18,
                  fontWeight: "bold",
                }}
              >
                Sair da Sessão
              </Text>
            </TouchableOpacity>
          </View>

          {/* URL Info */}
          <View
            style={{
              backgroundColor: colors.surface,
              borderRadius: 8,
              padding: 12,
              borderWidth: 1,
              borderColor: colors.border,
              width: "100%",
            }}
          >
            <Text style={{ color: colors.muted, fontSize: 10, marginBottom: 8 }}>
              URL da Sala (compartilhe com amigos):
            </Text>
            <Text
              style={{
                color: colors.primary,
                fontSize: 11,
                fontFamily: "monospace",
                textAlign: "center",
              }}
            >
              {jitsiUrl.split("#")[0]}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
