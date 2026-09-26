import React, { useCallback, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { BarreiraCard } from "@/components/BarreiraCard";
import { useTheme } from "@/contexts/ThemeContext";
import {
  atualizarStatusBarreira,
  inicializarBanco,
  listarBarreiras,
} from "@/database/database";
import { Barreira } from "@/types";

function StatCard({
  valor,
  rotulo,
  cor,
  fundo,
}: {
  valor: number;
  rotulo: string;
  cor: string;
  fundo: string;
}) {
  return (
    <View style={[estilos.statCard, { backgroundColor: fundo }]}>
      <ThemedText variante="titulo" style={{ color: cor, fontSize: 28 }}>
        {valor}
      </ThemedText>
      <ThemedText variante="legenda" style={{ color: cor, opacity: 0.8 }}>
        {rotulo}
      </ThemedText>
    </View>
  );
}

export function DenunciasScreen() {
  const [barreiras, setBarreiras] = useState<Barreira[]>([]);
  const { paleta } = useTheme();

  useFocusEffect(
    useCallback(() => {
      inicializarBanco();
      carregar();
    }, [])
  );

  function carregar() {
    setBarreiras(listarBarreiras());
  }

  function marcarComoResolvida(id: number) {
    atualizarStatusBarreira(id, "resolvido");
    carregar();
  }

  const pendentes = barreiras.filter((b) => b.status === "pendente").length;
  const resolvidas = barreiras.filter((b) => b.status === "resolvido").length;

  const header = (
    <View style={estilos.header}>
      {/* Stats */}
      <View style={estilos.stats}>
        <StatCard
          valor={barreiras.length}
          rotulo="Total"
          cor={paleta.primaria}
          fundo={paleta.primariaSutil}
        />
        <StatCard
          valor={pendentes}
          rotulo="Pendentes"
          cor={paleta.aviso}
          fundo={paleta.aviso + "18"}
        />
        <StatCard
          valor={resolvidas}
          rotulo="Resolvidas"
          cor={paleta.sucesso}
          fundo={paleta.sucesso + "18"}
        />
      </View>

      {barreiras.length > 0 && (
        <ThemedText
          variante="subtitulo"
          style={{ marginTop: 20, marginBottom: 4 }}
        >
          Registros
        </ThemedText>
      )}
    </View>
  );

  return (
    <ThemedView style={estilos.container}>
      <FlatList
        data={barreiras}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <BarreiraCard
            barreira={item}
            onMarcarResolvida={marcarComoResolvida}
          />
        )}
        ListHeaderComponent={header}
        contentContainerStyle={estilos.lista}
        ListEmptyComponent={
          <View
            style={[
              estilos.vazio,
              { backgroundColor: paleta.fundoSutil, borderColor: paleta.borda },
            ]}
          >
            <ThemedText style={estilos.vaziEmoji}>🗺️</ThemedText>
            <ThemedText variante="subtitulo" style={{ textAlign: "center" }}>
              Nenhuma denúncia ainda
            </ThemedText>
            <ThemedText
              variante="corpo"
              style={{ textAlign: "center", color: paleta.textoSecundario }}
            >
              Use a aba "Reportar" para registrar barreiras de acessibilidade
              no seu bairro.
            </ThemedText>
          </View>
        }
      />
    </ThemedView>
  );
}

const estilos = StyleSheet.create({
  container: { flex: 1 },
  lista: { padding: 16, paddingBottom: 40 },
  header: { marginBottom: 4 },
  stats: {
    flexDirection: "row",
    gap: 10,
  },
  statCard: {
    flex: 1,
    padding: 14,
    borderRadius: 14,
    alignItems: "center",
    gap: 2,
  },
  vazio: {
    borderRadius: 16,
    borderWidth: 1,
    borderStyle: "dashed",
    padding: 32,
    alignItems: "center",
    gap: 10,
    marginTop: 8,
  },
  vaziEmoji: {
    fontSize: 48,
    marginBottom: 4,
  },
});
