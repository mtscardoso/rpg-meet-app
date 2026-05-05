import React, { useCallback, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
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
>(({ roomName, displayName, onLeave, serverUrl = "https://meet.jitsi.isadora.ai" }, ref) => {
  const colors = useColors();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Gerar URL do Jitsi com parâmetros
  const jitsiUrl = `${serverUrl}/${encodeURIComponent(roomName)}?userInfo.displayName=${encodeURIComponent(displayName)}&config.startWithAudioMuted=false&config.startWithVideoMuted=false&config.disableAudioLevels=true`;

  const handleLoadStart = useCallback(() => {
    console.log("WebView começou a carregar:", jitsiUrl);
    setIsLoading(true);
    setError(null);
  }, [jitsiUrl]);

  const handleLoadEnd = useCallback(() => {
    console.log("WebView carregou com sucesso");
    setIsLoading(false);
  }, []);

  const handleError = useCallback((syntheticEvent: any) => {
    const { nativeEvent } = syntheticEvent;
    console.error("Erro no WebView:", nativeEvent);
    setError(`Erro ao carregar: ${nativeEvent.description}`);
    setIsLoading(false);
  }, []);

  const handleNavigationStateChange = useCallback((newNavState: any) => {
    console.log("Navegação mudou para:", newNavState.url);
    // Detectar quando o usuário sai da conferência
    if (newNavState.url && newNavState.url.includes("about:blank")) {
      console.log("Usuário saiu da conferência");
      onLeave();
    }
  }, [onLeave]);

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
        
        body {
          background-color: var(--background-color) !important;
          color: var(--text-color) !important;
        }
        
        .toolbox {
          background-color: var(--surface-color) !important;
          border-top: 2px solid var(--border-color) !important;
        }
        
        button {
          background-color: var(--primary-color) !important;
          color: var(--background-color) !important;
        }
        
        button:hover {
          background-color: #E5C158 !important;
        }
      \`;
      document.head.appendChild(style);
      
      console.log('Jitsi customizado com tema medieval');
      window.ReactNativeWebView.postMessage('Jitsi loaded');
    })();
    true;
  `;

  if (error) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: "center", alignItems: "center", padding: 20 }}>
        <Text style={{ color: colors.error, fontSize: 16, textAlign: "center", marginBottom: 10 }}>
          ⚠️ Erro ao carregar a videoconferência
        </Text>
        <Text style={{ color: colors.muted, fontSize: 14, textAlign: "center" }}>
          {error}
        </Text>
        <Text style={{ color: colors.muted, fontSize: 12, textAlign: "center", marginTop: 10 }}>
          URL: {jitsiUrl}
        </Text>
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
          <Text style={{ color: colors.muted, marginTop: 10 }}>
            Carregando videoconferência...
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
        userAgent="Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36"
        onMessage={(event) => {
          console.log("Mensagem do WebView:", event.nativeEvent.data);
        }}
      />
    </View>
  );
});

JitsiMeetingComponent.displayName = "JitsiMeetingComponent";
