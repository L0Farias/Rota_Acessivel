import React, { useState } from "react";
import { StyleSheet, ScrollView, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedButton } from "@/components/ThemedButton";
import { FormularioDenuncia } from "@/components/FormularioDenuncia";
import { inserirBarreira } from "@/database/database";
import { obterLocalizacaoAtual } from "@/services/location";

export function GaleriaScreen() {
  const [fotoUri, setFotoUri] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);

  async function escolherDaGaleria() {
    const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissao.granted) return;

    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.6,
    });

    if (!resultado.canceled) {
      setFotoUri(resultado.assets[0].uri);
    }
  }

  async function salvarDenuncia(dados: {
    categoria: any;
    severidade: any;
    descricao: string;
  }) {
    if (!fotoUri) return;
    setSalvando(true);
    try {
      const coordenadas = await obterLocalizacaoAtual();
      inserirBarreira({
        categoria: dados.categoria,
        severidade: dados.severidade,
        descricao: dados.descricao,
        latitude: coordenadas?.latitude ?? null,
        longitude: coordenadas?.longitude ?? null,
        fotoUri,
      });
      Alert.alert("Denúncia enviada!", "Obrigado por ajudar a mapear o bairro.");
      setFotoUri(null);
    } finally {
      setSalvando(false);
    }
  }

  if (fotoUri) {
    return (
      <ScrollView contentContainerStyle={estilos.container}>
        <FormularioDenuncia
          fotoUri={fotoUri}
          salvando={salvando}
          onCancelar={() => setFotoUri(null)}
          onSalvar={salvarDenuncia}
        />
      </ScrollView>
    );
  }

  return (
    <ThemedView style={[estilos.container, estilos.centralizado]}>
      <ThemedText variante="titulo" style={{ textAlign: "center" }}>
        Já tem uma foto da barreira?
      </ThemedText>
      <ThemedText variante="corpo" style={{ textAlign: "center", marginBottom: 12 }}>
        Escolha uma imagem da sua galeria para denunciar sem precisar
        fotografar agora.
      </ThemedText>
      <ThemedButton titulo="Escolher da galeria" onPress={escolherDaGaleria} />
    </ThemedView>
  );
}

const estilos = StyleSheet.create({
  container: { flexGrow: 1, padding: 16, gap: 12 },
  centralizado: { justifyContent: "center" },
});
