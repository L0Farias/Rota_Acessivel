import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
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

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

export function LoginScreen({ navigation }: Props) {
  const { entrarComSenha, entrarComBiometria, temUsuarioComBiometria, carregando } =
    useAuth();
  const { paleta } = useTheme();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [carregandoSenha, setCarregandoSenha] = useState(false);
  const [carregandoBio, setCarregandoBio] = useState(false);

  // Verifica se há usuário com biometria para mostrar o botão
  const [temBiometria, setTemBiometria] = useState(false);
  useEffect(() => {
    setTemBiometria(temUsuarioComBiometria());
  }, []);

  async function lidarComLoginSenha() {
    if (!email.trim() || !senha) {
      Alert.alert("Campos obrigatórios", "Preencha e-mail e senha.");
      return;
    }
    setCarregandoSenha(true);
    try {
      const erro = await entrarComSenha(email, senha);
      if (erro) {
        Alert.alert("Não foi possível entrar", erro);
      }
      // Sucesso → RootNavigator redireciona automaticamente
    } finally {
      setCarregandoSenha(false);
    }
  }

  async function lidarComLoginBiometria() {
    setCarregandoBio(true);
    try {
      const sucesso = await entrarComBiometria();
      if (!sucesso) {
        Alert.alert(
          "Biometria não reconhecida",
          "Tente novamente ou use e-mail e senha."
        );
      }
    } finally {
      setCarregandoBio(false);
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
          {/* Hero */}
          <View style={[estilos.hero, { backgroundColor: paleta.primaria }]}>
            <View
              style={[estilos.heroCirculo, { backgroundColor: paleta.primariaDark }]}
            />
            <View
              style={[
                estilos.heroCirculoPequeno,
                { backgroundColor: paleta.primariaSutil + "44" },
              ]}
            />
            <View style={[estilos.iconeBadge, { backgroundColor: "#FFFFFF20" }]}>
              <ThemedText style={estilos.emoji}>♿</ThemedText>
            </View>
            <ThemedText style={estilos.heroTitulo}>Rota Acessível</ThemedText>
            <ThemedText style={estilos.heroSubtitulo}>
              Mapeando barreiras, construindo cidades inclusivas
            </ThemedText>
          </View>

          {/* Formulário */}
          <View style={estilos.formulario}>
            <ThemedText variante="titulo" style={estilos.tituloFormulario}>
              Entrar na conta
            </ThemedText>

            {/* E-mail */}
            <View style={estilos.campo}>
              <ThemedText
                variante="rotulo"
                style={[estilos.rotulo, { color: paleta.textoSecundario }]}
              >
                E-mail
              </ThemedText>
              <View style={[estilos.inputWrapper, estiloInput]}>
                <Ionicons
                  name="mail-outline"
                  size={18}
                  color={paleta.textoDesabilitado}
                />
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
              <ThemedText
                variante="rotulo"
                style={[estilos.rotulo, { color: paleta.textoSecundario }]}
              >
                Senha
              </ThemedText>
              <View style={[estilos.inputWrapper, estiloInput]}>
                <Ionicons
                  name="lock-closed-outline"
                  size={18}
                  color={paleta.textoDesabilitado}
                />
                <TextInput
                  style={[estilos.input, { color: paleta.texto }]}
                  placeholder="Sua senha"
                  placeholderTextColor={paleta.textoDesabilitado}
                  value={senha}
                  onChangeText={setSenha}
                  secureTextEntry={!mostrarSenha}
                  autoComplete="password"
                  returnKeyType="done"
                  onSubmitEditing={lidarComLoginSenha}
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

            {/* Botão entrar com senha */}
            <ThemedButton
              titulo="Entrar"
              carregando={carregandoSenha}
              onPress={lidarComLoginSenha}
              tamanho="lg"
              style={estilos.botaoEntrar}
            />

            {/* Divisor */}
            {temBiometria && (
              <>
                <View style={estilos.divisor}>
                  <View style={[estilos.linha, { backgroundColor: paleta.borda }]} />
                  <ThemedText
                    variante="legenda"
                    style={{ color: paleta.textoDesabilitado, paddingHorizontal: 12 }}
                  >
                    ou
                  </ThemedText>
                  <View style={[estilos.linha, { backgroundColor: paleta.borda }]} />
                </View>

                {/* Botão biometria */}
                <ThemedButton
                  titulo="Entrar com biometria"
                  variante="secundario"
                  carregando={carregandoBio}
                  onPress={lidarComLoginBiometria}
                  tamanho="lg"
                  iconeEsquerda={
                    <Ionicons
                      name="finger-print"
                      size={20}
                      color={paleta.primaria}
                    />
                  }
                />
              </>
            )}

            {/* Link cadastro */}
            <View style={estilos.rodape}>
              <ThemedText variante="corpo" style={{ color: paleta.textoSecundario }}>
                Ainda não tem conta?{" "}
              </ThemedText>
              <TouchableOpacity
                onPress={() => navigation.navigate("Cadastro")}
                accessibilityLabel="Criar nova conta"
              >
                <ThemedText
                  variante="corpo"
                  style={{ color: paleta.primaria, fontWeight: "700" }}
                >
                  Cadastre-se
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
  tela: { flex: 1 },
  scroll: { flexGrow: 1 },

  // Hero
  hero: {
    paddingTop: 64,
    paddingBottom: 40,
    paddingHorizontal: 24,
    alignItems: "center",
    overflow: "hidden",
  },
  heroCirculo: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    top: -60,
    right: -60,
    opacity: 0.4,
  },
  heroCirculoPequeno: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    bottom: -30,
    left: -20,
  },
  iconeBadge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  emoji: { fontSize: 36 },
  heroTitulo: {
    fontSize: 28,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 6,
  },
  heroSubtitulo: {
    fontSize: 13,
    color: "#FFFFFFCC",
    textAlign: "center",
  },

  // Formulário
  formulario: {
    flex: 1,
    padding: 24,
    gap: 16,
  },
  tituloFormulario: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 4,
  },
  campo: { gap: 6 },
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
  botaoEntrar: { marginTop: 4 },
  divisor: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
  },
  linha: { flex: 1, height: 1 },
  rodape: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 24,
    marginTop: 4,
  },
});
