import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  ScrollView,
  Alert,
  Switch,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedButton } from "@/components/ThemedButton";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { RootStackParamList } from "@/types";

type Props = NativeStackScreenProps<RootStackParamList, "Cadastro">;

export function CadastroScreen({ navigation }: Props) {
  const { cadastrar } = useAuth();
  const { paleta } = useTheme();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [habilitarBiometria, setHabilitarBiometria] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false);
  const [carregando, setCarregando] = useState(false);

  async function lidarComCadastro() {
    if (senha !== confirmarSenha) {
      Alert.alert("Senhas diferentes", "As senhas informadas não coincidem.");
      return;
    }

    setCarregando(true);
    try {
      const erro = await cadastrar(nome, email, senha, habilitarBiometria);
      if (erro) {
        Alert.alert("Não foi possível cadastrar", erro);
      }
      // Em caso de sucesso o AuthContext já seta usuarioAtivo → RootNavigator
      // redireciona automaticamente para as Tabs.
    } finally {
      setCarregando(false);
    }
  }

  const estiloInput = {
    backgroundColor: paleta.fundoCartao,
    borderColor: paleta.borda,
    color: paleta.texto,
  };

  return (
    <ThemedView style={estilos.tela}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={estilos.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Cabeçalho */}
          <View style={[estilos.cabecalho, { backgroundColor: paleta.primaria }]}>
            <TouchableOpacity
              style={estilos.botaoVoltar}
              onPress={() => navigation.goBack()}
              accessibilityLabel="Voltar para o login"
            >
              <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
            </TouchableOpacity>

            <View style={[estilos.avatarCirculo, { backgroundColor: "#FFFFFF30" }]}>
              <Ionicons name="person-add" size={36} color="#FFFFFF" />
            </View>
            <ThemedText style={estilos.cabecalhoTitulo}>Criar conta</ThemedText>
            <ThemedText style={estilos.cabecalhoSubtitulo}>
              Preencha seus dados para começar
            </ThemedText>
          </View>

          {/* Formulário */}
          <View style={estilos.formulario}>
            {/* Nome */}
            <View style={estilos.campo}>
              <ThemedText variante="rotulo" style={[estilos.rotulo, { color: paleta.textoSecundario }]}>
                Nome completo
              </ThemedText>
              <View style={[estilos.inputWrapper, estiloInput]}>
                <Ionicons name="person-outline" size={18} color={paleta.textoDesabilitado} />
                <TextInput
                  style={[estilos.input, { color: paleta.texto }]}
                  placeholder="Seu nome"
                  placeholderTextColor={paleta.textoDesabilitado}
                  value={nome}
                  onChangeText={setNome}
                  autoCapitalize="words"
                  autoComplete="name"
                  returnKeyType="next"
                />
              </View>
            </View>

            {/* E-mail */}
            <View style={estilos.campo}>
              <ThemedText variante="rotulo" style={[estilos.rotulo, { color: paleta.textoSecundario }]}>
                E-mail
              </ThemedText>
              <View style={[estilos.inputWrapper, estiloInput]}>
                <Ionicons name="mail-outline" size={18} color={paleta.textoDesabilitado} />
                <TextInput
                  style={[estilos.input, { color: paleta.texto }]}
                  placeholder="seu@email.com"
                  placeholderTextColor={paleta.textoDesabilitado}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  returnKeyType="next"
                />
              </View>
            </View>

            {/* Senha */}
            <View style={estilos.campo}>
              <ThemedText variante="rotulo" style={[estilos.rotulo, { color: paleta.textoSecundario }]}>
                Senha
              </ThemedText>
              <View style={[estilos.inputWrapper, estiloInput]}>
                <Ionicons name="lock-closed-outline" size={18} color={paleta.textoDesabilitado} />
                <TextInput
                  style={[estilos.input, { color: paleta.texto }]}
                  placeholder="Mínimo 6 caracteres"
                  placeholderTextColor={paleta.textoDesabilitado}
                  value={senha}
                  onChangeText={setSenha}
                  secureTextEntry={!mostrarSenha}
                  autoComplete="new-password"
                  returnKeyType="next"
                />
                <TouchableOpacity
                  onPress={() => setMostrarSenha((v) => !v)}
                  accessibilityLabel={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
                >
                  <Ionicons
                    name={mostrarSenha ? "eye-off-outline" : "eye-outline"}
                    size={18}
                    color={paleta.textoDesabilitado}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Confirmar senha */}
            <View style={estilos.campo}>
              <ThemedText variante="rotulo" style={[estilos.rotulo, { color: paleta.textoSecundario }]}>
                Confirmar senha
              </ThemedText>
              <View style={[estilos.inputWrapper, estiloInput]}>
                <Ionicons name="lock-closed-outline" size={18} color={paleta.textoDesabilitado} />
                <TextInput
                  style={[estilos.input, { color: paleta.texto }]}
                  placeholder="Repita a senha"
                  placeholderTextColor={paleta.textoDesabilitado}
                  value={confirmarSenha}
                  onChangeText={setConfirmarSenha}
                  secureTextEntry={!mostrarConfirmar}
                  autoComplete="new-password"
                  returnKeyType="done"
                  onSubmitEditing={lidarComCadastro}
                />
                <TouchableOpacity
                  onPress={() => setMostrarConfirmar((v) => !v)}
                  accessibilityLabel={mostrarConfirmar ? "Ocultar senha" : "Mostrar senha"}
                >
                  <Ionicons
                    name={mostrarConfirmar ? "eye-off-outline" : "eye-outline"}
                    size={18}
                    color={paleta.textoDesabilitado}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Habilitar biometria */}
            <View
              style={[
                estilos.biometriaCard,
                { backgroundColor: paleta.fundoCartao, borderColor: paleta.borda },
              ]}
            >
              <View style={estilos.biometriaInfo}>
                <View
                  style={[
                    estilos.biometriaIconeWrapper,
                    { backgroundColor: paleta.primariaSutil },
                  ]}
                >
                  <Ionicons name="finger-print" size={22} color={paleta.primaria} />
                </View>
                <View style={{ flex: 1 }}>
                  <ThemedText variante="rotulo" style={{ fontWeight: "600" }}>
                    Usar biometria
                  </ThemedText>
                  <ThemedText
                    variante="legenda"
                    style={{ color: paleta.textoSecundario, marginTop: 2 }}
                  >
                    Habilita login por impressão digital ou Face ID neste dispositivo
                  </ThemedText>
                </View>
              </View>
              <Switch
                value={habilitarBiometria}
                onValueChange={setHabilitarBiometria}
                trackColor={{ false: paleta.borda, true: paleta.primaria }}
                thumbColor="#FFFFFF"
                accessibilityLabel="Habilitar login biométrico"
              />
            </View>

            {/* Botão cadastrar */}
            <ThemedButton
              titulo="Criar conta"
              carregando={carregando}
              onPress={lidarComCadastro}
              tamanho="lg"
              style={estilos.botaoCadastrar}
            />

            {/* Link para login */}
            <View style={estilos.rodape}>
              <ThemedText variante="corpo" style={{ color: paleta.textoSecundario }}>
                Já tem uma conta?{" "}
              </ThemedText>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <ThemedText
                  variante="corpo"
                  style={{ color: paleta.primaria, fontWeight: "700" }}
                >
                  Entrar
                </ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const estilos = StyleSheet.create({
  tela: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
  },
  cabecalho: {
    paddingTop: 56,
    paddingBottom: 36,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  botaoVoltar: {
    position: "absolute",
    top: 52,
    left: 16,
    padding: 8,
  },
  avatarCirculo: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  cabecalhoTitulo: {
    fontSize: 26,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  cabecalhoSubtitulo: {
    fontSize: 14,
    color: "#FFFFFFCC",
  },
  formulario: {
    flex: 1,
    padding: 24,
    gap: 16,
  },
  campo: {
    gap: 6,
  },
  rotulo: {
    fontSize: 13,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    padding: 0,
  },
  biometriaCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    gap: 12,
    marginTop: 4,
  },
  biometriaInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  biometriaIconeWrapper: {
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  botaoCadastrar: {
    marginTop: 8,
  },
  rodape: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 4,
    paddingBottom: 24,
  },
});
