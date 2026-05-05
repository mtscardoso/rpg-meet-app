import { View, TouchableOpacity, Text, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useRef, useEffect } from "react";
import { WebView } from "react-native-webview";

import { useColors } from "@/hooks/use-colors";

/**
 * Video Conference Screen - Tela Principal de Sessão
 *
 * Tela onde acontece a videoconferência com Jitsi Meet integrado via WebView
 */
export default function VideoConferenceScreen() {
  const router = useRouter();
  const colors = useColors();
  const params = useLocalSearchParams();
  const webViewRef = useRef<WebView>(null);

  const roomName = (params.roomId as string) || "RPG-DEFAULT";
  const displayName = (params.playerName as string) || "Jogador";
  const characterClass = (params.selectedClass as string) || "Guerreiro";

  // URL do Jitsi Meet - usando configuração inline
  const jitsiUrl = `https://meet.jitsi.org/${encodeURIComponent(roomName)}#config.startWithAudioMuted=false&config.startWithVideoMuted=false&userInfo.displayName="${encodeURIComponent(displayName)}"`;

  useEffect(() => {
    console.log("Video Conference iniciada:", {
      roomName,
      displayName,
      characterClass,
      jitsiUrl,
    });
  }, [roomName, displayName, characterClass, jitsiUrl]);

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

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Jitsi WebView */}
      <WebView
        ref={webViewRef}
        source={{ uri: jitsiUrl }}
        style={{ flex: 1 }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        mediaPlaybackRequiresUserAction={false}
        allowsInlineMediaPlayback={true}
        scalesPageToFit={true}
        allowFileAccess={true}
        allowUniversalAccessFromFileURLs={true}
        mixedContentMode="always"
        userAgent="Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36"
        onError={(error) => {
          console.error("WebView Error:", error.nativeEvent);
        }}
        onLoadStart={() => {
          console.log("WebView começou a carregar");
        }}
        onLoadEnd={() => {
          console.log("WebView carregou com sucesso");
        }}
      />

      {/* Floating Leave Button */}
      <View
        style={{
          position: "absolute",
          bottom: 20,
          right: 20,
          zIndex: 100,
        }}
      >
        <TouchableOpacity
          onPress={handleLeaveConference}
          style={{
            backgroundColor: colors.error,
            paddingHorizontal: 16,
            paddingVertical: 12,
            borderRadius: 8,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 4,
            elevation: 5,
          }}
        >
          <Text
            style={{
              color: colors.background,
              fontSize: 14,
              fontWeight: "bold",
            }}
          >
            Sair
          </Text>
        </TouchableOpacity>
      </View>

      {/* Session Info */}
      <View
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          backgroundColor: colors.surface,
          borderRadius: 8,
          padding: 12,
          borderWidth: 2,
          borderColor: colors.border,
          zIndex: 100,
        }}
      >
        <Text style={{ color: colors.primary, fontSize: 12, fontWeight: "bold" }}>
          Sala: {roomName}
        </Text>
        <Text style={{ color: colors.foreground, fontSize: 12 }}>
          {displayName} ({characterClass})
        </Text>
      </View>
    </View>
  );
}
