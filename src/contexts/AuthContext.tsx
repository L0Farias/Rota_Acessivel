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

interface AuthContextData {
  usuarioAtivo: Usuario | null;
  autenticado: boolean;
  carregando: boolean;
  cadastrar: (
    nome: string,
    email: string,
    senha: string,
    habilitarBiometria: boolean
  ) => Promise<string | null>;
  entrarComSenha: (email: string, senha: string) => Promise<string | null>;
  entrarComBiometria: () => Promise<boolean>;
  temUsuarioComBiometria: () => boolean;
  sair: () => void;
}

const CHAVE_ULTIMO_USUARIO = "@rotaAcessivel:ultimoUsuarioId";

function hashSenha(senha: string): string {
  let hash = 5381;
  for (let i = 0; i < senha.length; i++) {
    hash = (hash * 33) ^ senha.charCodeAt(i);
  }
  return (hash >>> 0).toString(16);
}

const AuthContext = createContext<AuthContextData | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [usuarioAtivo, setUsuarioAtivo] = useState<Usuario | null>(null);
  const [carregando, setCarregando] = useState(true);

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
        // silencioso
      } finally {
        setCarregando(false);
      }
    }

    tentarLoginAutomatico();
  }, []);

  const cadastrar = async (
    nome: string,
    email: string,
    senha: string,
    habilitarBiometria: boolean
  ): Promise<string | null> => {
    if (!nome.trim()) return "Informe seu nome.";
    if (!email.trim() || !email.includes("@")) return "Informe um e-mail válido.";
    if (senha.length < 6) return "A senha deve ter pelo menos 6 caracteres.";

    if (habilitarBiometria) {
      const suportado = await dispositivoSuportaBiometria();
      if (!suportado) {
        return "Este dispositivo não possui biometria cadastrada. Desmarque a opção e tente novamente.";
      }
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
      return null;
    } catch (e: any) {
      return "Erro ao salvar conta: " + (e?.message ?? "desconhecido");
    }
  };

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
    return null;
  };

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

  const temUsuarioComBiometria = (): boolean => {
    return buscarUsuarioComBiometria() !== null;
  };

  const sair = async () => {
    setUsuarioAtivo(null);
  };

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
