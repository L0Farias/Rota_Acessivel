import React, { useState } from "react";
import { StyleSheet, TextInput, Image, View } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";
import { ThemedButton } from "./ThemedButton";
import { Chip } from "./Chip";
import { CATEGORIAS, CategoriaBarreira, SEVERIDADES, Severidade } from "@/types";
import { corDaSeveridade, rotuloDaSeveridade } from "@/utils/barreiraUtils";

interface Props {
  fotoUri: string;
  salvando?: boolean;
  onCancelar: () => void;
  onSalvar: (dados: {
    categoria: CategoriaBarreira;
    severidade: Severidade;
    descricao: string;
  }) => void;
}

export function FormularioDenuncia({
  fotoUri,
  salvando = false,
  onCancelar,
  onSalvar,
}: Props) {
  const { paleta } = useTheme();
  const [categoria, setCategoria] = useState<CategoriaBarreira>(CATEGORIAS[0]);
  const [severidade, setSeveridade] = useState<Severidade>("media");
  const [descricao, setDescricao] = useState("");

  return (
    <ThemedView style={estilos.container}>
      {/* Foto */}
      <Image source={{ uri: fotoUri }} style={estilos.foto} resizeMode="cover" />

      {/* Tipo de barreira */}
      <View style={estilos.secao}>
        <ThemedText variante="subtitulo">Tipo de barreira</ThemedText>
        <ThemedText variante="legenda" style={{ color: paleta.textoSecundario }}>
          Selecione a categoria que melhor descreve o problema
        </ThemedText>
        <View style={[estilos.linhaChips, { marginTop: 10 }]}>
          {CATEGORIAS.map((item) => (
            <Chip
              key={item}
              rotulo={item}
              selecionado={categoria === item}
              onPress={() => setCategoria(item)}
            />
          ))}
        </View>
      </View>

      {/* Gravidade */}
      <View style={estilos.secao}>
        <ThemedText variante="subtitulo">Gravidade</ThemedText>
        <ThemedText variante="legenda" style={{ color: paleta.textoSecundario }}>
          Quão urgente é resolver esse problema?
        </ThemedText>
        <View style={[estilos.linhaChips, { marginTop: 10 }]}>
          {SEVERIDADES.map((item) => (
            <Chip
              key={item}
              rotulo={rotuloDaSeveridade(item)}
              cor={corDaSeveridade(item)}
              selecionado={severidade === item}
              onPress={() => setSeveridade(item)}
            />
          ))}
        </View>
      </View>

      {/* Descrição */}
      <View style={estilos.secao}>
        <ThemedText variante="subtitulo">Descrição</ThemedText>
        <TextInput
          placeholder="Descreva o problema (opcional)"
          placeholderTextColor={paleta.textoDesabilitado}
          value={descricao}
          onChangeText={setDescricao}
          multiline
          style={[
            estilos.input,
            {
              color: paleta.texto,
              borderColor: paleta.borda,
              backgroundColor: paleta.fundoSutil,
            },
          ]}
        />
      </View>

      {/* Botões */}
      <View style={estilos.linhaBotoes}>
        <ThemedButton
          titulo="Cancelar"
          variante="fantasma"
          onPress={onCancelar}
          style={{ flex: 1 }}
        />
        <ThemedButton
          titulo="Enviar denúncia"
          carregando={salvando}
          onPress={() => onSalvar({ categoria, severidade, descricao })}
          style={{ flex: 1 }}
        />
      </View>
    </ThemedView>
  );
}

const estilos = StyleSheet.create({
  container: { gap: 4 },
  foto: {
    width: "100%",
    height: 200,
    borderRadius: 16,
    marginBottom: 8,
  },
  secao: { gap: 4, marginBottom: 8 },
  linhaChips: { flexDirection: "row", flexWrap: "wrap" },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    minHeight: 80,
    textAlignVertical: "top",
    marginTop: 8,
    fontSize: 15,
    lineHeight: 22,
  },
  linhaBotoes: {
    flexDirection: "row",
    gap: 10,
    marginTop: 8,
  },
});
