import React from "react";
import {
  Pressable,
  StyleSheet,
  ActivityIndicator,
  PressableProps,
  Platform,
  View,
} from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { ThemedText } from "./ThemedText";

type Variante = "primario" | "secundario" | "perigo" | "fantasma";
type Tamanho = "sm" | "md" | "lg";

interface Props extends PressableProps {
  titulo: string;
  carregando?: boolean;
  variante?: Variante;
  tamanho?: Tamanho;
  iconeEsquerda?: React.ReactNode;
}

export function ThemedButton({
  titulo,
  carregando = false,
  variante = "primario",
  tamanho = "md",
  iconeEsquerda,
  disabled,
  style,
  ...props
}: Props) {
  const { paleta } = useTheme();

  const corFundo =
    variante === "primario"   ? paleta.primaria :
    variante === "perigo"     ? paleta.erro :
    variante === "secundario" ? paleta.primariaSutil :
    "transparent";

  const corTexto =
    variante === "secundario" ? paleta.primaria :
    variante === "fantasma"   ? paleta.textoSecundario :
    "#FFFFFF";

  const sombra =
    variante === "primario" && !disabled
      ? Platform.select({
          ios: {
            shadowColor: paleta.primariaDark,
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.25,
            shadowRadius: 8,
          },
          android: { elevation: 4 },
          default: {},
        })
      : {};

  const paddingH = tamanho === "sm" ? 14 : tamanho === "lg" ? 28 : 20;
  const paddingV = tamanho === "sm" ? 8  : tamanho === "lg" ? 16 : 12;
  const radius   = tamanho === "sm" ? 8  : tamanho === "lg" ? 16 : 12;
  const fontSize = tamanho === "sm" ? 13 : tamanho === "lg" ? 17 : 15;

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled || carregando}
      style={({ pressed }) => [
        estilos.base,
        {
          backgroundColor: corFundo,
          borderWidth: variante === "fantasma" ? 1.5 : 0,
          borderColor: paleta.borda,
          borderRadius: radius,
          paddingHorizontal: paddingH,
          paddingVertical: paddingV,
          opacity: pressed ? 0.82 : disabled ? 0.45 : 1,
          transform: [{ scale: pressed ? 0.985 : 1 }],
        },
        sombra,
        typeof style === "function" ? undefined : style,
      ]}
      {...props}
    >
      {carregando ? (
        <ActivityIndicator color={corTexto} size="small" />
      ) : (
        <View style={estilos.conteudo}>
          {iconeEsquerda && (
            <View style={estilos.icone}>{iconeEsquerda}</View>
          )}
          <ThemedText
            style={{ color: corTexto, fontWeight: "600", fontSize }}
          >
            {titulo}
          </ThemedText>
        </View>
      )}
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  base: {
    alignItems: "center",
    justifyContent: "center",
  },
  conteudo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  icone: { marginRight: 2 },
});
