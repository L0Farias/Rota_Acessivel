import React from "react";
import { Text, TextProps, StyleSheet } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";

type Variante =
  | "display"   // 32px bold — hero titles
  | "titulo"    // 22px bold — section headers
  | "subtitulo" // 17px semibold — card headers
  | "corpo"     // 15px regular — body text
  | "rotulo"    // 13px semibold — labels, badges
  | "legenda";  // 12px regular — timestamps, hints

interface Props extends TextProps {
  variante?: Variante;
}

export function ThemedText({ variante = "corpo", style, ...props }: Props) {
  const { paleta } = useTheme();

  const cor =
    variante === "legenda" || variante === "rotulo"
      ? paleta.textoSecundario
      : paleta.texto;

  return (
    <Text
      style={[estilos[variante], { color: cor }, style]}
      {...props}
    />
  );
}

const estilos = StyleSheet.create({
  display:   { fontSize: 32, fontWeight: "800", letterSpacing: -0.5, lineHeight: 38 },
  titulo:    { fontSize: 22, fontWeight: "700", letterSpacing: -0.3, lineHeight: 28 },
  subtitulo: { fontSize: 17, fontWeight: "600", letterSpacing: -0.1, lineHeight: 24 },
  corpo:     { fontSize: 15, fontWeight: "400", lineHeight: 22 },
  rotulo:    { fontSize: 13, fontWeight: "600", letterSpacing: 0.2, lineHeight: 18 },
  legenda:   { fontSize: 12, fontWeight: "400", lineHeight: 17 },
});
