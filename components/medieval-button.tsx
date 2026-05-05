import { TouchableOpacity, Text, View, StyleSheet } from "react-native";
import { useColors } from "@/hooks/use-colors";
import { cn } from "@/lib/utils";

export interface MedievalButtonProps {
  onPress: () => void;
  title: string;
  variant?: "primary" | "secondary" | "danger";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  className?: string;
}

/**
 * MedievalButton - Componente temático de botão medieval
 * 
 * Estilos: Bordas de ferro batido, fundo escuro com ouro
 * Variantes: primary (ouro), secondary (cinza), danger (vermelho)
 */
export function MedievalButton({
  onPress,
  title,
  variant = "primary",
  size = "medium",
  disabled = false,
  className,
}: MedievalButtonProps) {
  const colors = useColors();

  const variantStyles = {
    primary: {
      backgroundColor: colors.primary,
      borderColor: colors.border,
    },
    secondary: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
    },
    danger: {
      backgroundColor: colors.error,
      borderColor: colors.error,
    },
  };

  const sizeStyles = {
    small: "px-4 py-2",
    medium: "px-6 py-3",
    large: "px-8 py-4",
  };

  const textSizeStyles = {
    small: "text-sm",
    medium: "text-base",
    large: "text-lg",
  };

  const buttonStyle = variantStyles[variant];
  const textColor = variant === "secondary" ? colors.foreground : colors.background;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.button,
        {
          backgroundColor: buttonStyle.backgroundColor,
          borderColor: buttonStyle.borderColor,
          opacity: disabled ? 0.5 : 1,
        },
      ]}
      activeOpacity={0.8}
    >
      <Text
        className={cn(
          "font-bold text-center",
          sizeStyles[size],
          textSizeStyles[size]
        )}
        style={{ color: textColor }}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderWidth: 2,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
});
