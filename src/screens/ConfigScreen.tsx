import React from "react";
import { StyleSheet, Switch, View, ScrollView } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedButton } from "@/components/ThemedButton";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { Ionicons } from "@expo/vector-icons";

function SecaoItem({
  icone,
  titulo,
  descricao,
  direita,
  cor,
}: {
  icone: keyof typeof Ionicons.glyphMap;
  titulo: string;
  descricao?: string;
  direita?: React.ReactNode;
  cor?: string;
}) {
  const { paleta } = useTheme();
  const corIcone = cor ?? paleta.primaria;

  return (
    <View
      style={[
        estilos.item,
        { borderBottomColor: paleta.separador },
      ]}
    >
      <View
        style={[
          estilos.itemIcone,
          { backgroundColor: corIcone + "18" },
        ]}
      >
        <Ionicons name={icone} size={20} color={corIcone} />
      </View>
      <View style={estilos.itemTexto}>
        <ThemedText variante="subtitulo" style={{ fontSize: 15 }}>
          {titulo}
        </ThemedText>
        {!!descricao && (
          <ThemedText
            variante="legenda"
            style={{ color: paleta.textoSecundario, marginTop: 1 }}
          >
            {descricao}
          </ThemedText>
        )}
      </View>
      {direita && <View style={estilos.itemDireita}>{direita}</View>}
    </View>
  );
}

function Secao({
  titulo,
  children,
}: {
  titulo: string;
  children: React.ReactNode;
}) {
  const { paleta } = useTheme();
  return (
    <View style={estilos.secao}>
      <ThemedText
        variante="rotulo"
        style={[estilos.secaoTitulo, { color: paleta.textoSecundario }]}
      >
        {titulo.toUpperCase()}
      </ThemedText>
      <View
        style={[
          estilos.secaoCard,
          { backgroundColor: paleta.fundoCartao, borderColor: paleta.borda },
        ]}
      >
        {children}
      </View>
    </View>
  );
}

export function ConfigScreen() {
  const { tema, alternarTema, paleta } = useTheme();
  const { sair } = useAuth();

  return (
    <ThemedView style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={estilos.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Perfil / Header */}
        <View
          style={[
            estilos.perfilCard,
            { backgroundColor: paleta.primaria },
          ]}
        >
          <View
            style={[
              estilos.perfilAvatar,
              { backgroundColor: "#FFFFFF30" },
            ]}
          >
            <ThemedText style={estilos.perfilEmoji}>♿</ThemedText>
          </View>
          <View>
            <ThemedText
              variante="subtitulo"
              style={{ color: "#FFFFFF", fontWeight: "700" }}
            >
              Rota Acessível
            </ThemedText>
            <ThemedText
              variante="legenda"
              style={{ color: "#FFFFFF99" }}
            >
              Mapeando barreiras, construindo inclusão
            </ThemedText>
          </View>
        </View>

        {/* Aparência */}
        <Secao titulo="Aparência">
          <SecaoItem
            icone={tema === "dark" ? "moon" : "sunny-outline"}
            titulo="Tema escuro"
            descricao={tema === "dark" ? "Ativado" : "Desativado"}
            direita={
              <Switch
                value={tema === "dark"}
                onValueChange={alternarTema}
                trackColor={{ true: paleta.primaria, false: paleta.borda }}
                thumbColor="#FFFFFF"
              />
            }
          />
        </Secao>

        {/* Sobre */}
        <Secao titulo="Sobre o app">
          <SecaoItem
            icone="information-circle-outline"
            titulo="Versão"
            descricao="1.0.0"
          />
          <SecaoItem
            icone="phone-portrait-outline"
            titulo="Armazenamento"
            descricao="Dados locais no dispositivo — nenhum servidor externo"
          />
          <SecaoItem
            icone="shield-checkmark-outline"
            titulo="Privacidade"
            descricao="Suas denúncias nunca saem do seu celular"
            cor={paleta.sucesso}
          />
        </Secao>

        {/* Missão */}
        <Secao titulo="Nossa missão">
          <View style={estilos.missao}>
            <ThemedText
              variante="corpo"
              style={{ color: paleta.textoSecundario, lineHeight: 22 }}
            >
              O Rota Acessível permite que qualquer pessoa registre barreiras
              urbanas — rampas quebradas, calçadas danificadas, falta de piso
              tátil e vagas irregulares — formando um mapa colaborativo para
              cobrar melhorias do poder público e ajudar quem precisa se
              planejar melhor.
            </ThemedText>
          </View>
        </Secao>

        {/* Sair */}
        <ThemedButton
          titulo="Sair da conta"
          variante="perigo"
          tamanho="lg"
          iconeEsquerda={
            <Ionicons name="log-out-outline" size={20} color="#fff" />
          }
          onPress={sair}
          style={estilos.botaoSair}
        />
      </ScrollView>
    </ThemedView>
  );
}

const estilos = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
    gap: 20,
  },
  perfilCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 20,
    borderRadius: 18,
  },
  perfilAvatar: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  perfilEmoji: { fontSize: 28, color: "#FFFFFF" },
  secao: { gap: 8 },
  secaoTitulo: {
    marginLeft: 4,
    letterSpacing: 0.8,
  },
  secaoCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  itemIcone: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  itemTexto: { flex: 1, gap: 1 },
  itemDireita: { marginLeft: 8 },
  missao: { padding: 16 },
  botaoSair: { borderRadius: 16 },
});
