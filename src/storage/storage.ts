import AsyncStorage from "@react-native-async-storage/async-storage";

// AsyncStorage é usado aqui para dados simples de chave-valor
// (preferências do usuário), diferente do SQLite, que guarda os
// registros estruturados do app.

const CHAVE_TEMA = "@rotaAcessivel:tema";
const CHAVE_NOME_USUARIO = "@rotaAcessivel:nomeVoluntario";

export async function salvarTema(tema: "light" | "dark"): Promise<void> {
  await AsyncStorage.setItem(CHAVE_TEMA, tema);
}

export async function obterTemaSalvo(): Promise<"light" | "dark" | null> {
  const valor = await AsyncStorage.getItem(CHAVE_TEMA);
  return valor === "light" || valor === "dark" ? valor : null;
}

export async function salvarNomeUsuario(nome: string): Promise<void> {
  await AsyncStorage.setItem(CHAVE_NOME_USUARIO, nome);
}

export async function obterNomeUsuario(): Promise<string | null> {
  return AsyncStorage.getItem(CHAVE_NOME_USUARIO);
}
