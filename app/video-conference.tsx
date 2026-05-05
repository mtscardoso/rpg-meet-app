import { View, TouchableOpacity, Text, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useRef, useEffect } from "react";

import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { JitsiMeetingComponent } from "@/components/jitsi-meeting";

/**
 * Video Conference Screen - Tela Principal de Sessão
 *
 * Tela onde acontece a videoconferência com Jitsi Meet integrado
 */
export default function VideoConferenceScreen() {
  const router = useRouter();
  const colors = useColors();
  const params = useLocalSearchParams();
  const jitsiRef = useRef(null);

  const roomName = (params.roomId as string) || "RPG-DEFAULT";
  const displayName = (params.playerName as string) || "Jogador";

  useEffect(() => {
    // Log dos parâmetros recebidos
    console.log("Video Conference iniciada:", {
      roomName,
      displayName,
      characterClass: params.selectedClass,
    });
  }, [roomName, displayName, params.selectedClass]);

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
      {/* Jitsi Meeting */}
      <JitsiMeetingComponent
        ref={jitsiRef}
        roomName={roomName}
        displayName={displayName}
        onLeave={() => router.back()}
      />

      {/* Floating Action Buttons */}
      <View
        style={{
          position: "absolute",
          bottom: 20,
          right: 20,
          gap: 10,
        }}
      >
        <TouchableOpacity
          onPress={handleLeaveConference}
          style={{
            backgroundColor: colors.error,
            paddingHorizontal: 16,
            paddingVertical: 12,
            borderRadius: 8,
            alignItems: "center",
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
    </View>
  );
}
