import React from "react";
import { View, ViewProps, StyleSheet, Platform } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";

type Variante = "fundo" | "cartao" | "elevado" | "sutil";

interface Props extends ViewProps {
  variante?: Variante;
}

export function ThemedView({ variante = "fundo", style, ...props }: Props) {
  const { paleta } = useTheme();

  const corDeFundo =
    variante === "cartao"   ? paleta.fundoCartao :
    variante === "elevado"  ? paleta.fundoElevado :
    variante === "sutil"    ? paleta.fundoSutil :
    paleta.fundo;

  const sombra = (variante === "cartao" || variante === "elevado")
    ? estilosSombra(paleta.sombra, variante === "elevado" ? 2 : 1)
    : {};

  return (
    <View
      style={[{ backgroundColor: corDeFundo }, sombra, style]}
      {...props}
    />
  );
}

function estilosSombra(cor: string, nivel: 1 | 2) {
  return Platform.select({
    ios: {
      shadowColor: cor,
      shadowOffset: { width: 0, height: nivel === 2 ? 4 : 2 },
      shadowOpacity: nivel === 2 ? 0.10 : 0.06,
      shadowRadius: nivel === 2 ? 12 : 6,
    },
    android: {
      elevation: nivel === 2 ? 6 : 2,
    },
    default: {},
  });
}
