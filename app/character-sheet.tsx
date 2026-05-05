import { ScrollView, Text, View, TouchableOpacity, TextInput, Alert } from "react-native";
import { useState, useEffect } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";

/**
 * Character Sheet Screen - Ficha de Personagem
 *
 * Tela para visualizar e editar a ficha do personagem antes de entrar na sessão
 */
export default function CharacterSheetScreen() {
  const router = useRouter();
  const colors = useColors();
  const params = useLocalSearchParams();

  const [characterName, setCharacterName] = useState(params.playerName as string || "");
  const [characterClass, setCharacterClass] = useState(params.selectedClass as string || "Guerreiro");
  const [hp, setHp] = useState("20");
  const [maxHp, setMaxHp] = useState("20");
  const [mana, setMana] = useState("15");
  const [maxMana, setMaxMana] = useState("15");
  const [isLoading, setIsLoading] = useState(false);

  // Atributos
  const [attributes, setAttributes] = useState({
    str: "10",
    dex: "10",
    con: "10",
    int: "10",
    wis: "10",
    cha: "10",
  });

  useEffect(() => {
    loadCharacter();
  }, []);

  const loadCharacter = async () => {
    try {
      const saved = await AsyncStorage.getItem("currentCharacter");
      if (saved) {
        const character = JSON.parse(saved);
        setCharacterName(character.name || characterName);
        setCharacterClass(character.class || characterClass);
        setHp(character.hp?.toString() || "20");
        setMaxHp(character.maxHp?.toString() || "20");
        setMana(character.mana?.toString() || "15");
        setMaxMana(character.maxMana?.toString() || "15");
        setAttributes(character.attributes || attributes);
      }
    } catch (error) {
      console.error("Erro ao carregar personagem:", error);
    }
  };

  const saveCharacter = async () => {
    if (!characterName.trim()) {
      Alert.alert("Erro", "Por favor, insira o nome do personagem");
      return;
    }

    setIsLoading(true);
    try {
      const character = {
        name: characterName,
        class: characterClass,
        hp: parseInt(hp) || 20,
        maxHp: parseInt(maxHp) || 20,
        mana: parseInt(mana) || 15,
        maxMana: parseInt(maxMana) || 15,
        attributes: {
          str: parseInt(attributes.str) || 10,
          dex: parseInt(attributes.dex) || 10,
          con: parseInt(attributes.con) || 10,
          int: parseInt(attributes.int) || 10,
          wis: parseInt(attributes.wis) || 10,
          cha: parseInt(attributes.cha) || 10,
        },
      };

      await AsyncStorage.setItem("currentCharacter", JSON.stringify(character));
      
      // Navegar para video conference
      router.push({
        pathname: "/(tabs)",
        params: {
          roomId: params.roomId,
          characterName: character.name,
          characterClass: character.class,
        },
      });
    } catch (error) {
      Alert.alert("Erro", "Falha ao salvar personagem");
    } finally {
      setIsLoading(false);
    }
  };

  const updateAttribute = (attr: keyof typeof attributes, value: string) => {
    setAttributes({
      ...attributes,
      [attr]: value,
    });
  };

  return (
    <ScreenContainer className="p-4">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="gap-6">
          {/* Header */}
          <View className="items-center gap-2 mt-4">
            <Text className="text-4xl font-bold text-primary">Ficha do Personagem</Text>
            <Text className="text-sm text-muted">Sessão: {params.roomId}</Text>
          </View>

          {/* Main Info Card */}
          <View className="bg-surface rounded-lg p-4 border-2 border-border gap-4">
            {/* Name */}
            <View>
              <Text className="text-sm text-muted mb-2">Nome do Personagem</Text>
              <TextInput
                className="bg-background rounded px-4 py-3 border border-border text-foreground"
                placeholder="Nome do personagem"
                placeholderTextColor="#9B8B7E"
                value={characterName}
                onChangeText={setCharacterName}
                editable={!isLoading}
              />
            </View>

            {/* Class */}
            <View>
              <Text className="text-sm text-muted mb-2">Classe</Text>
              <View
                style={{
                  backgroundColor: colors.background,
                  borderRadius: 6,
                  borderWidth: 1,
                  borderColor: colors.border,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                }}
              >
                <Text style={{ color: colors.foreground, fontSize: 16 }}>
                  {characterClass}
                </Text>
              </View>
            </View>

            {/* HP and Mana */}
            <View className="flex-row gap-4">
              <View className="flex-1">
                <Text className="text-sm text-muted mb-2">HP</Text>
                <View className="flex-row gap-2">
                  <TextInput
                    className="flex-1 bg-background rounded px-3 py-2 border border-border text-foreground text-center"
                    placeholder="20"
                    placeholderTextColor="#9B8B7E"
                    value={hp}
                    onChangeText={setHp}
                    keyboardType="numeric"
                    editable={!isLoading}
                  />
                  <Text style={{ color: colors.muted, paddingVertical: 8 }}>/</Text>
                  <TextInput
                    className="flex-1 bg-background rounded px-3 py-2 border border-border text-foreground text-center"
                    placeholder="20"
                    placeholderTextColor="#9B8B7E"
                    value={maxHp}
                    onChangeText={setMaxHp}
                    keyboardType="numeric"
                    editable={!isLoading}
                  />
                </View>
              </View>

              <View className="flex-1">
                <Text className="text-sm text-muted mb-2">Mana</Text>
                <View className="flex-row gap-2">
                  <TextInput
                    className="flex-1 bg-background rounded px-3 py-2 border border-border text-foreground text-center"
                    placeholder="15"
                    placeholderTextColor="#9B8B7E"
                    value={mana}
                    onChangeText={setMana}
                    keyboardType="numeric"
                    editable={!isLoading}
                  />
                  <Text style={{ color: colors.muted, paddingVertical: 8 }}>/</Text>
                  <TextInput
                    className="flex-1 bg-background rounded px-3 py-2 border border-border text-foreground text-center"
                    placeholder="15"
                    placeholderTextColor="#9B8B7E"
                    value={maxMana}
                    onChangeText={setMaxMana}
                    keyboardType="numeric"
                    editable={!isLoading}
                  />
                </View>
              </View>
            </View>
          </View>

          {/* Attributes */}
          <View className="bg-surface rounded-lg p-4 border-2 border-border gap-3">
            <Text className="text-lg font-bold text-foreground mb-2">Atributos</Text>

            {/* Row 1 */}
            <View className="flex-row gap-2">
              {["str", "dex", "con"].map((attr) => (
                <View key={attr} className="flex-1">
                  <Text className="text-xs text-muted mb-1 text-center uppercase">
                    {attr}
                  </Text>
                  <TextInput
                    className="bg-background rounded px-2 py-2 border border-border text-foreground text-center"
                    placeholder="10"
                    placeholderTextColor="#9B8B7E"
                    value={attributes[attr as keyof typeof attributes]}
                    onChangeText={(val) =>
                      updateAttribute(attr as keyof typeof attributes, val)
                    }
                    keyboardType="numeric"
                    editable={!isLoading}
                  />
                </View>
              ))}
            </View>

            {/* Row 2 */}
            <View className="flex-row gap-2">
              {["int", "wis", "cha"].map((attr) => (
                <View key={attr} className="flex-1">
                  <Text className="text-xs text-muted mb-1 text-center uppercase">
                    {attr}
                  </Text>
                  <TextInput
                    className="bg-background rounded px-2 py-2 border border-border text-foreground text-center"
                    placeholder="10"
                    placeholderTextColor="#9B8B7E"
                    value={attributes[attr as keyof typeof attributes]}
                    onChangeText={(val) =>
                      updateAttribute(attr as keyof typeof attributes, val)
                    }
                    keyboardType="numeric"
                    editable={!isLoading}
                  />
                </View>
              ))}
            </View>
          </View>

          {/* Action Buttons */}
          <View className="gap-3 mb-6">
            <TouchableOpacity
              onPress={saveCharacter}
              disabled={isLoading}
              style={{
                backgroundColor: colors.primary,
                paddingHorizontal: 24,
                paddingVertical: 16,
                borderRadius: 8,
                alignItems: "center",
                opacity: isLoading ? 0.6 : 1,
              }}
            >
              <Text
                style={{
                  color: colors.background,
                  fontSize: 18,
                  fontWeight: "bold",
                }}
              >
                {isLoading ? "Carregando..." : "Entrar na Sessão"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.back()}
              disabled={isLoading}
              style={{
                backgroundColor: colors.surface,
                paddingHorizontal: 24,
                paddingVertical: 12,
                borderRadius: 8,
                alignItems: "center",
                borderWidth: 2,
                borderColor: colors.border,
                opacity: isLoading ? 0.6 : 1,
              }}
            >
              <Text
                style={{
                  color: colors.foreground,
                  fontSize: 16,
                  fontWeight: "600",
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
