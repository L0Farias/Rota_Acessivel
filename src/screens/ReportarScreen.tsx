import React, { useRef, useState } from "react";
import { StyleSheet, Alert, ScrollView } from "react-native";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedButton } from "@/components/ThemedButton";
import { FormularioDenuncia } from "@/components/FormularioDenuncia";
import { inserirBarreira } from "@/database/database";
import { obterLocalizacaoAtual } from "@/services/location";

export function ReportarScreen() {
  const [permissao, solicitarPermissao] = useCameraPermissions();
  const [tipoCamera, setTipoCamera] = useState<CameraType>("back");
  const [fotoUri, setFotoUri] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  if (!permissao) {
    return <ThemedView style={estilos.container} />;
  }

  if (!permissao.granted) {
    return (
      <ThemedView style={estilos.container}>
        <ThemedText variante="corpo" style={estilos.texto}>
          Precisamos da sua permissão para usar a câmera e fotografar a
          barreira de acessibilidade.
        </ThemedText>
        <ThemedButton titulo="Conceder permissão" onPress={solicitarPermissao} />
      </ThemedView>
    );
  }

  async function tirarFoto() {
    const foto = await cameraRef.current?.takePictureAsync({ quality: 0.6 });
    if (foto) setFotoUri(foto.uri);
  }

  async function salvarDenuncia(dados: {
    categoria: any;
    severidade: any;
    descricao: string;
  }) {
    if (!fotoUri) return;
    setSalvando(true);
    try {
      // Tenta salvar na galeria silenciosamente — não crítico para a denúncia
      try {
        const MediaLibrary = await import("expo-media-library/legacy");
        await MediaLibrary.saveToLibraryAsync(fotoUri);
      } catch {
        // Expo Go não suporta expo-media-library totalmente; ignora sem crashar
      }

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
      <ScrollView contentContainerStyle={estilos.formContainer}>
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
    <ThemedView style={estilos.container}>
      <CameraView ref={cameraRef} style={estilos.camera} facing={tipoCamera} />
      <ThemedView style={estilos.linhaBotoes}>
        <ThemedButton
          titulo="Girar câmera"
          variante="secundario"
          onPress={() =>
            setTipoCamera((atual) => (atual === "back" ? "front" : "back"))
          }
        />
        <ThemedButton titulo="Fotografar barreira" onPress={tirarFoto} />
      </ThemedView>
    </ThemedView>
  );
}

const estilos = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 16 },
  texto: { textAlign: "center", marginTop: 40 },
  camera: { flex: 1, borderRadius: 12, overflow: "hidden" },
  linhaBotoes: { flexDirection: "row", justifyContent: "space-between", gap: 12 },
  formContainer: { padding: 16 },
});
