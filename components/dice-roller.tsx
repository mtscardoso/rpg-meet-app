import React, { useState, useRef } from 'react';
import { View, Text, Pressable, Animated, StyleSheet } from 'react-native';
import { useColors } from '@/hooks/use-colors';
import { cn } from '@/lib/utils';

interface DiceRollerProps {
  onRoll?: (result: number) => void;
  disabled?: boolean;
}

export function DiceRoller({ onRoll, disabled = false }: DiceRollerProps) {
  const colors = useColors();
  const [isRolling, setIsRolling] = useState(false);
  const [lastResult, setLastResult] = useState<number | null>(null);
  const rotationAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const rollDice = () => {
    if (isRolling || disabled) return;

    setIsRolling(true);
    rotationAnim.setValue(0);
    scaleAnim.setValue(1);

    // Animação de rotação
    Animated.sequence([
      Animated.parallel([
        Animated.timing(rotationAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.2,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ]),
      ]),
    ]).start(() => {
      const result = Math.floor(Math.random() * 20) + 1;
      setLastResult(result);
      setIsRolling(false);
      onRoll?.(result);
    });
  };

  const rotation = rotationAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '720deg'],
  });

  return (
    <View className="items-center gap-4">
      <Pressable
        onPress={rollDice}
        disabled={isRolling || disabled}
        className={cn(
          'rounded-lg p-4 items-center justify-center',
          isRolling || disabled ? 'opacity-60' : 'opacity-100'
        )}
        style={{
          backgroundColor: colors.primary,
          width: 120,
          height: 120,
        }}
      >
        <Animated.View
          style={{
            transform: [
              { rotate: rotation },
              { scale: scaleAnim },
            ],
          }}
        >
          <Text className="text-4xl font-bold" style={{ color: colors.background }}>
            🎲
          </Text>
        </Animated.View>
      </Pressable>

      {lastResult !== null && !isRolling && (
        <View
          className="rounded-lg p-4 items-center justify-center"
          style={{
            backgroundColor: colors.surface,
            borderWidth: 2,
            borderColor: colors.primary,
          }}
        >
          <Text className="text-sm" style={{ color: colors.muted }}>
            Resultado
          </Text>
          <Text
            className="text-5xl font-bold"
            style={{ color: colors.primary }}
          >
            {lastResult}
          </Text>
        </View>
      )}

      <Text
        className="text-sm text-center"
        style={{ color: colors.muted }}
      >
        {isRolling ? 'Rolando...' : 'Toque para rolar D20'}
      </Text>
    </View>
  );
}
