import { View, ViewProps } from "react-native";
import { useColors } from "@/hooks/use-colors";
import { cn } from "@/lib/utils";

export interface MedievalCardProps extends ViewProps {
  children: React.ReactNode;
  variant?: "default" | "elevated" | "outline";
  className?: string;
}

/**
 * MedievalCard - Componente temático de card medieval
 * 
 * Estilos: Pergaminho com borda medieval, sombra de profundidade
 * Variantes: default (surface), elevated (com sombra), outline (apenas borda)
 */
export function MedievalCard({
  children,
  variant = "default",
  className,
  ...props
}: MedievalCardProps) {
  const colors = useColors();

  const variantStyles = {
    default: "bg-surface border-2 border-border",
    elevated: "bg-surface border-2 border-border shadow-lg",
    outline: "bg-transparent border-2 border-border",
  };

  return (
    <View
      className={cn(
        "rounded-lg p-4",
        variantStyles[variant],
        className
      )}
      style={{
        borderColor: colors.border,
        backgroundColor: variant === "outline" ? "transparent" : colors.surface,
      }}
      {...props}
    >
      {children}
    </View>
  );
}
