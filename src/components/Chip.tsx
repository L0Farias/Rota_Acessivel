import React from "react";
import { Pressable, StyleSheet } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { ThemedText } from "./ThemedText";

interface Props {
  rotulo: string;
  selecionado: boolean;
  cor?: string;
  onPress: () => void;
}

export function Chip({ rotulo, selecionado, cor, onPress }: Props) {
  const { paleta } = useTheme();
  const corBase = cor ?? paleta.primaria;
  const corSutil = cor ? corBase + "22" : paleta.primariaSutil;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: selecionado }}
      style={({ pressed }) => [
        estilos.chip,
        {
          backgroundColor: selecionado ? corBase : corSutil,
          borderColor: selecionado ? corBase : "transparent",
          opacity: pressed ? 0.75 : 1,
          transform: [{ scale: pressed ? 0.96 : 1 }],
        },
      ]}
    >
      <ThemedText
        variante="rotulo"
        style={{
          color: selecionado ? "#FFFFFF" : corBase,
          fontWeight: "600",
        }}
      >
        {rotulo}
      </ThemedText>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  chip: {
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1.5,
    marginRight: 8,
    marginBottom: 8,
  },
});
