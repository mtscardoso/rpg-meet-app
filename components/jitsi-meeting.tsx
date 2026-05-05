import React, { useCallback } from "react";
import { View } from "react-native";
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

  // Gerar URL do Jitsi com parâmetros
  const jitsiUrl = `${serverUrl}/${roomName}?userInfo.displayName=${encodeURIComponent(displayName)}&config.startWithAudioMuted=false&config.startWithVideoMuted=false`;

  const handleNavigationStateChange = useCallback((newNavState: any) => {
    // Detectar quando o usuário sai da conferência
    if (newNavState.url && newNavState.url.includes("about:blank")) {
      onLeave();
    }
  }, [onLeave]);

  const injectedJavaScript = `
    (function() {
      // Customizar a interface do Jitsi
      window.JitsiMeetExternalAPI = window.JitsiMeetExternalAPI || {};
      
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
    })();
    true;
  `;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <WebView
        ref={ref}
        source={{ uri: jitsiUrl }}
        style={{ flex: 1 }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        injectedJavaScript={injectedJavaScript}
        onNavigationStateChange={handleNavigationStateChange}
        mediaPlaybackRequiresUserAction={false}
        allowsInlineMediaPlayback={true}
        scalesPageToFit={true}
        // Permitir acesso a câmera e microfone
        userAgent="Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36"
      />
    </View>
  );
});

JitsiMeetingComponent.displayName = "JitsiMeetingComponent";
