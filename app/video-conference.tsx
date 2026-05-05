import { View, TouchableOpacity, Text, Alert, SafeAreaView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useRef, useEffect, useState } from "react";

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
  const [sessionActive, setSessionActive] = useState(true);

  const roomName = (params.roomId as string) || "RPG-DEFAULT";
  const displayName = (params.playerName as string) || "Jogador";
  const characterClass = (params.selectedClass as string) || "Guerreiro";

  useEffect(() => {
    // Log dos parâmetros recebidos
    console.log("Video Conference iniciada:", {
      roomName,
      displayName,
      characterClass,
    });
  }, [roomName, displayName, characterClass]);

  const handleLeaveConference = () => {
    Alert.alert("Sair da Sessão", "Tem certeza que deseja sair?", [
      { text: "Cancelar", onPress: () => {} },
      {
        text: "Sair",
        onPress: () => {
          setSessionActive(false);
          router.back();
        },
        style: "destructive",
      },
    ]);
  };

  if (!sessionActive) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: colors.foreground, fontSize: 18 }}>Encerrando sessão...</Text>
      </SafeAreaView>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Jitsi Meeting */}
      {roomName && displayName && (
        <JitsiMeetingComponent
          ref={jitsiRef}
          roomName={roomName}
          displayName={`${displayName} (${characterClass})`}
          onLeave={() => {
            setSessionActive(false);
            router.back();
          }}
        />
      )}

      {/* Floating Action Buttons */}
      <View
        style={{
          position: "absolute",
          bottom: 20,
          right: 20,
          gap: 10,
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
            alignItems: "center",
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
