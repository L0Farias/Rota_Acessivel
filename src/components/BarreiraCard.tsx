import React from "react";
import { StyleSheet, Image, View, Platform } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";
import { ThemedButton } from "./ThemedButton";
import { Barreira } from "@/types";
import {
  corDaSeveridade,
  rotuloDaSeveridade,
  rotuloDoStatus,
} from "@/utils/barreiraUtils";

interface Props {
  barreira: Barreira;
  onMarcarResolvida?: (id: number) => void;
}

const ICONE_CATEGORIA: Record<string, string> = {
  "Rampa quebrada": "🔧",
  "Falta de rampa": "🚫",
  "Calçada danificada": "⚠️",
  "Piso tátil ausente/danificado": "👁️",
  "Vaga de acessibilidade irregular": "🚗",
  "Outro": "📍",
};

export function BarreiraCard({ barreira, onMarcarResolvida }: Props) {
  const { paleta } = useTheme();
  const cor = corDaSeveridade(barreira.severidade);
  const resolvida = barreira.status === "resolvido";
  const icone = ICONE_CATEGORIA[barreira.categoria] ?? "📍";

  return (
    <View
      style={[
        estilos.cartao,
        {
          backgroundColor: paleta.fundoCartao,
          borderColor: paleta.borda,
          ...sombraCartao(paleta.sombra),
        },
      ]}
    >
      {/* Faixa colorida lateral de severidade */}
      <View style={[estilos.faixaLateral, { backgroundColor: cor }]} />

      <View style={estilos.corpo}>
        {/* Foto */}
        {barreira.fotoUri ? (
          <Image
            source={{ uri: barreira.fotoUri }}
            style={estilos.foto}
            resizeMode="cover"
          />
        ) : (
          <View
            style={[
              estilos.fotoPlaceholder,
              { backgroundColor: paleta.fundoSutil },
            ]}
          >
            <ThemedText style={estilos.fotoEmoji}>{icone}</ThemedText>
          </View>
        )}

        {/* Conteúdo */}
        <View style={estilos.info}>
          {/* Cabeçalho */}
          <View style={estilos.cabecalho}>
            <View style={estilos.categoriaRow}>
              <ThemedText style={estilos.iconeCategoria}>{icone}</ThemedText>
              <ThemedText
                variante="subtitulo"
                style={{ flex: 1 }}
                numberOfLines={1}
              >
                {barreira.categoria}
              </ThemedText>
            </View>

            {/* Badge severidade */}
            <View style={[estilos.badge, { backgroundColor: cor + "22" }]}>
              <View style={[estilos.badgeDot, { backgroundColor: cor }]} />
              <ThemedText
                variante="rotulo"
                style={{ color: cor, fontWeight: "700" }}
              >
                {rotuloDaSeveridade(barreira.severidade)}
              </ThemedText>
            </View>
          </View>

          {/* Descrição */}
          {!!barreira.descricao && (
            <ThemedText
              variante="corpo"
              numberOfLines={2}
              style={{ color: paleta.textoSecundario, marginTop: 4 }}
            >
              {barreira.descricao}
            </ThemedText>
          )}

          {/* Rodapé */}
          <View style={estilos.rodape}>
            {barreira.latitude != null && barreira.longitude != null && (
              <View style={estilos.rodapeItem}>
                <ThemedText variante="legenda">
                  📍 {barreira.latitude.toFixed(4)}, {barreira.longitude.toFixed(4)}
                </ThemedText>
              </View>
            )}
            <View style={estilos.rodapeItem}>
              <ThemedText variante="legenda">
                🕐 {new Date(barreira.criadoEm).toLocaleDateString("pt-BR")}
              </ThemedText>
            </View>

            {/* Status pill */}
            <View
              style={[
                estilos.statusPill,
                {
                  backgroundColor: resolvida
                    ? paleta.sucesso + "20"
                    : paleta.aviso + "20",
                },
              ]}
            >
              <ThemedText
                variante="legenda"
                style={{
                  color: resolvida ? paleta.sucesso : paleta.aviso,
                  fontWeight: "600",
                }}
              >
                {resolvida ? "✅ Resolvida" : "⏳ Pendente"}
              </ThemedText>
            </View>
          </View>

          {/* Botão resolver */}
          {!resolvida && onMarcarResolvida && (
            <ThemedButton
              titulo="Marcar como resolvida"
              variante="secundario"
              tamanho="sm"
              onPress={() => onMarcarResolvida(barreira.id)}
              style={{ alignSelf: "flex-start", marginTop: 10 }}
            />
          )}
        </View>
      </View>
    </View>
  );
}

function sombraCartao(cor: string) {
  return Platform.select({
    ios: {
      shadowColor: cor,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.07,
      shadowRadius: 8,
    },
    android: { elevation: 2 },
    default: {},
  });
}

const estilos = StyleSheet.create({
  cartao: {
    flexDirection: "row",
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
    overflow: "hidden",
  },
  faixaLateral: {
    width: 4,
  },
  corpo: {
    flex: 1,
  },
  foto: {
    width: "100%",
    height: 150,
  },
  fotoPlaceholder: {
    width: "100%",
    height: 80,
    alignItems: "center",
    justifyContent: "center",
  },
  fotoEmoji: {
    fontSize: 32,
  },
  info: {
    padding: 14,
    gap: 2,
  },
  cabecalho: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  categoriaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flex: 1,
  },
  iconeCategoria: {
    fontSize: 16,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  rodape: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8,
    alignItems: "center",
  },
  rodapeItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
});
