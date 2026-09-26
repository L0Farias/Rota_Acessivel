import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  criarUsuario,
  buscarUsuarioPorEmail,
  buscarUsuarioPorId,
  atualizarBiometriaUsuario,
  buscarUsuarioComBiometria,
} from "@/database/database";
import { autenticarComBiometria, dispositivoSuportaBiometria } from "@/services/biometrics";
import { Usuario } from "@/types";

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

interface AuthContextData {
  /** Usuário atualmente logado (null = não autenticado). */
  usuarioAtivo: Usuario | null;
  autenticado: boolean;
  carregando: boolean;
  /** Registra novo usuário; retorna mensagem de erro ou null em caso de sucesso. */
  cadastrar: (
    nome: string,
    email: string,
    senha: string,
    habilitarBiometria: boolean
  ) => Promise<string | null>;
  /** Login com e-mail e senha; retorna mensagem de erro ou null em caso de sucesso. */
  entrarComSenha: (email: string, senha: string) => Promise<string | null>;
  /** Login biométrico; retorna true se bem-sucedido. */
  entrarComBiometria: () => Promise<boolean>;
  /** Verifica se há algum usuário com biometria cadastrada no banco. */
  temUsuarioComBiometria: () => boolean;
  sair: () => void;
}

// ---------------------------------------------------------------------------
// Constantes
// ---------------------------------------------------------------------------

const CHAVE_ULTIMO_USUARIO = "@rotaAcessivel:ultimoUsuarioId";

// ---------------------------------------------------------------------------
// Hash simples (djb2) — suficiente para armazenamento local offline.
// NÃO use em sistemas com conexão a servidores ou dados sensíveis reais.
// ---------------------------------------------------------------------------
function hashSenha(senha: string): string {
  let hash = 5381;
  for (let i = 0; i < senha.length; i++) {
    hash = (hash * 33) ^ senha.charCodeAt(i);
  }
  return (hash >>> 0).toString(16);
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const AuthContext = createContext<AuthContextData | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [usuarioAtivo, setUsuarioAtivo] = useState<Usuario | null>(null);
  const [carregando, setCarregando] = useState(true);

  // Na inicialização, tenta restaurar sessão via biometria se houver usuário
  // com biometria habilitada e o dispositivo suportar.
  useEffect(() => {
    async function tentarLoginAutomatico() {
      try {
        const idSalvo = await AsyncStorage.getItem(CHAVE_ULTIMO_USUARIO);
        if (!idSalvo) return;

        const usuario = buscarUsuarioPorId(Number(idSalvo));
        if (!usuario || !usuario.biometriaHabilitada) return;

        const suportado = await dispositivoSuportaBiometria();
        if (!suportado) return;

        const sucesso = await autenticarComBiometria();
        if (sucesso) {
          setUsuarioAtivo(usuario);
        }
      } catch {
        // Falha silenciosa — usuário vai fazer login manual
      } finally {
        setCarregando(false);
      }
    }

    tentarLoginAutomatico();
  }, []);

  // ------------------------------------------------------------------

  const cadastrar = async (
    nome: string,
    email: string,
    senha: string,
    habilitarBiometria: boolean
  ): Promise<string | null> => {
    if (!nome.trim()) return "Informe seu nome.";
    if (!email.trim() || !email.includes("@")) return "Informe um e-mail válido.";
    if (senha.length < 6) return "A senha deve ter pelo menos 6 caracteres.";

    // Verifica se biometria é suportada quando o usuário quer habilitá-la
    if (habilitarBiometria) {
      const suportado = await dispositivoSuportaBiometria();
      if (!suportado) {
        return "Este dispositivo não possui biometria cadastrada. Desmarque a opção e tente novamente.";
      }
      // Pede confirmação biométrica já no cadastro
      const confirmada = await autenticarComBiometria();
      if (!confirmada) {
        return "Biometria não confirmada. Tente novamente ou desmarque a opção.";
      }
    }

    const emailExistente = buscarUsuarioPorEmail(email);
    if (emailExistente) return "Este e-mail já está cadastrado.";

    try {
      const id = criarUsuario({
        nome: nome.trim(),
        email,
        senhaHash: hashSenha(senha),
        biometriaHabilitada: habilitarBiometria,
      });

      const novoUsuario = buscarUsuarioPorId(id);
      if (!novoUsuario) return "Erro ao criar conta. Tente novamente.";

      await AsyncStorage.setItem(CHAVE_ULTIMO_USUARIO, String(id));
      setUsuarioAtivo(novoUsuario);
      return null; // sucesso
    } catch (e: any) {
      return "Erro ao salvar conta: " + (e?.message ?? "desconhecido");
    }
  };

  // ------------------------------------------------------------------

  const entrarComSenha = async (
    email: string,
    senha: string
  ): Promise<string | null> => {
    if (!email.trim()) return "Informe o e-mail.";
    if (!senha) return "Informe a senha.";

    const usuario = buscarUsuarioPorEmail(email);
    if (!usuario) return "E-mail não encontrado.";

    if (usuario.senhaHash !== hashSenha(senha)) return "Senha incorreta.";

    await AsyncStorage.setItem(CHAVE_ULTIMO_USUARIO, String(usuario.id));
    setUsuarioAtivo(usuario);
    return null; // sucesso
  };

  // ------------------------------------------------------------------

  const entrarComBiometria = async (): Promise<boolean> => {
    const usuario = buscarUsuarioComBiometria();
    if (!usuario) return false;

    const sucesso = await autenticarComBiometria();
    if (sucesso) {
      await AsyncStorage.setItem(CHAVE_ULTIMO_USUARIO, String(usuario.id));
      setUsuarioAtivo(usuario);
    }
    return sucesso;
  };

  // ------------------------------------------------------------------

  const temUsuarioComBiometria = (): boolean => {
    return buscarUsuarioComBiometria() !== null;
  };

  // ------------------------------------------------------------------

  const sair = async () => {
    setUsuarioAtivo(null);
    // Mantém o id salvo para que o app possa oferecer biometria no próximo
    // acesso sem precisar digitar e-mail novamente.
  };

  // ------------------------------------------------------------------

  const valor = useMemo(
    () => ({
      usuarioAtivo,
      autenticado: usuarioAtivo !== null,
      carregando,
      cadastrar,
      entrarComSenha,
      entrarComBiometria,
      temUsuarioComBiometria,
      sair,
    }),
    [usuarioAtivo, carregando]
  );

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextData {
  const contexto = useContext(AuthContext);
  if (!contexto) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return contexto;
}
