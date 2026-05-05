import { View, TouchableOpacity, Text, Alert, ActivityIndicator, SafeAreaView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useRef, useEffect, useState } from "react";
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
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

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

  const handleLoadEnd = () => {
    console.log("WebView carregou com sucesso");
    setIsLoading(false);
  };

  const handleError = (error: any) => {
    console.error("WebView Error:", error.nativeEvent);
    setHasError(true);
    setIsLoading(false);
  };

  const handleLoadStart = () => {
    console.log("WebView começou a carregar");
    setIsLoading(true);
    setHasError(false);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        {/* Jitsi WebView */}
        <WebView
          ref={webViewRef}
          source={{ uri: jitsiUrl }}
          style={{ flex: 1, backgroundColor: colors.background }}
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
          onError={handleError}
          onLoadStart={handleLoadStart}
          onLoadEnd={handleLoadEnd}
          renderLoading={() => (
            <View
              style={{
                flex: 1,
                backgroundColor: colors.background,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={{ color: colors.muted, marginTop: 16, fontSize: 14 }}>
                Carregando Jitsi Meet...
              </Text>
              <Text style={{ color: colors.muted, marginTop: 8, fontSize: 12 }}>
                Sala: {roomName}
              </Text>
            </View>
          )}
        />

        {/* Loading Overlay */}
        {isLoading && (
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: colors.background,
              justifyContent: "center",
              alignItems: "center",
              zIndex: 999,
            }}
          >
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={{ color: colors.muted, marginTop: 16, fontSize: 14 }}>
              Conectando à videoconferência...
            </Text>
            <Text style={{ color: colors.muted, marginTop: 8, fontSize: 12 }}>
              {roomName}
            </Text>
          </View>
        )}

        {/* Error Overlay */}
        {hasError && (
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: colors.background,
              justifyContent: "center",
              alignItems: "center",
              zIndex: 999,
              padding: 20,
            }}
          >
            <Text style={{ color: colors.error, fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
              ⚠️ Erro ao Carregar
            </Text>
            <Text style={{ color: colors.muted, fontSize: 14, textAlign: "center", marginBottom: 20 }}>
              Não foi possível carregar a videoconferência. Verifique sua conexão com a internet.
            </Text>
            <TouchableOpacity
              onPress={() => {
                setHasError(false);
                setIsLoading(true);
                webViewRef.current?.reload();
              }}
              style={{
                backgroundColor: colors.primary,
                paddingHorizontal: 24,
                paddingVertical: 12,
                borderRadius: 8,
              }}
            >
              <Text style={{ color: colors.background, fontSize: 16, fontWeight: "bold" }}>
                Tentar Novamente
              </Text>
            </TouchableOpacity>
          </View>
        )}

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
    </SafeAreaView>
  );
}
