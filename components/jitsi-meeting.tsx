import React, { useCallback, useState, useEffect } from "react";
import { View, Text, ActivityIndicator, TouchableOpacity } from "react-native";
import { WebView } from "react-native-webview";
import { useColors } from "@/hooks/use-colors";

interface JitsiMeetingComponentProps {
  roomName: string;
  displayName: string;
  onLeave: () => void;
  serverUrl?: string;
}

/**
 * JitsiMeeting Component
 *
 * Integração com Jitsi Meet via WebView
 * Renderiza a interface do Jitsi em um iframe
 */
export const JitsiMeetingComponent = React.forwardRef<
  any,
  JitsiMeetingComponentProps
>(({ roomName, displayName, onLeave, serverUrl = "https://meet.jitsi.org" }, ref) => {
  const colors = useColors();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadTimeout, setLoadTimeout] = useState(false);

  // Gerar URL do Jitsi com parâmetros
  const jitsiUrl = `${serverUrl}/${encodeURIComponent(roomName)}#config.startWithAudioMuted=false&config.startWithVideoMuted=false&config.disableAudioLevels=true&userInfo.displayName="${encodeURIComponent(displayName)}"`;

  useEffect(() => {
    // Timeout de 15 segundos para carregamento
    const timer = setTimeout(() => {
      if (isLoading) {
        setLoadTimeout(true);
        setError("Timeout ao carregar videoconferência. Verifique sua conexão.");
      }
    }, 15000);

    return () => clearTimeout(timer);
  }, [isLoading]);

  const handleLoadStart = useCallback(() => {
    console.log("WebView começou a carregar:", jitsiUrl);
    setIsLoading(true);
    setError(null);
    setLoadTimeout(false);
  }, [jitsiUrl]);

  const handleLoadEnd = useCallback(() => {
    console.log("WebView carregou com sucesso");
    setIsLoading(false);
  }, []);

  const handleError = useCallback((syntheticEvent: any) => {
    const { nativeEvent } = syntheticEvent;
    console.error("Erro no WebView:", nativeEvent);
    setError(`Erro ao carregar: ${nativeEvent.description || "Erro desconhecido"}`);
    setIsLoading(false);
  }, []);

  const handleNavigationStateChange = useCallback((newNavState: any) => {
    console.log("Navegação mudou para:", newNavState.url);
  }, []);

  const handleRetry = useCallback(() => {
    setError(null);
    setIsLoading(true);
    setLoadTimeout(false);
  }, []);

  const injectedJavaScript = `
    (function() {
      console.log('Iniciando customização do Jitsi');
      
      // Aplicar tema medieval Grimdark
      const style = document.createElement('style');
      style.textContent = \`
        :root {
          --primary-color: #D4AF37;
          --background-color: #1A1A1A;
          --surface-color: #2F2F2F;
          --text-color: #F5F5DC;
          --border-color: #6B4423;
        }
      \`;
      document.head.appendChild(style);
      console.log('Jitsi customizado');
    })();
    true;
  `;

  if (error) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.background,
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
        }}
      >
        <Text
          style={{
            color: colors.error,
            fontSize: 18,
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: 10,
          }}
        >
          ⚠️ Erro ao Carregar
        </Text>
        <Text
          style={{
            color: colors.muted,
            fontSize: 14,
            textAlign: "center",
            marginBottom: 20,
          }}
        >
          {error}
        </Text>
        <Text
          style={{
            color: colors.muted,
            fontSize: 12,
            textAlign: "center",
            marginBottom: 20,
            fontStyle: "italic",
          }}
        >
          URL: {jitsiUrl}
        </Text>
        <TouchableOpacity
          onPress={handleRetry}
          style={{
            backgroundColor: colors.primary,
            paddingHorizontal: 24,
            paddingVertical: 12,
            borderRadius: 8,
          }}
        >
          <Text
            style={{
              color: colors.background,
              fontSize: 16,
              fontWeight: "bold",
            }}
          >
            Tentar Novamente
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {isLoading && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: colors.background,
            zIndex: 1000,
          }}
        >
          <ActivityIndicator size="large" color={colors.primary} />
          <Text
            style={{
              color: colors.muted,
              marginTop: 10,
              fontSize: 14,
            }}
          >
            Carregando videoconferência...
          </Text>
          <Text
            style={{
              color: colors.muted,
              marginTop: 5,
              fontSize: 12,
              fontStyle: "italic",
            }}
          >
            Sala: {roomName}
          </Text>
        </View>
      )}

      <WebView
        ref={ref}
        source={{ uri: jitsiUrl }}
        style={{ flex: 1 }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        injectedJavaScript={injectedJavaScript}
        onLoadStart={handleLoadStart}
        onLoadEnd={handleLoadEnd}
        onError={handleError}
        onNavigationStateChange={handleNavigationStateChange}
        mediaPlaybackRequiresUserAction={false}
        allowsInlineMediaPlayback={true}
        scalesPageToFit={true}
        allowFileAccess={true}
        allowUniversalAccessFromFileURLs={true}
        mixedContentMode="always"
        userAgent="Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36"
        onMessage={(event) => {
          console.log("Mensagem do WebView:", event.nativeEvent.data);
        }}
      />
    </View>
  );
});

JitsiMeetingComponent.displayName = "JitsiMeetingComponent";
