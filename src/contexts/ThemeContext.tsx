import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useColorScheme } from "react-native";
import { ThemeName } from "@/types";
import { obterTemaSalvo, salvarTema } from "@/storage/storage";

export interface Paleta {
  // Superfícies
  fundo: string;
  fundoCartao: string;
  fundoElevado: string;
  fundoSutil: string;

  // Texto
  texto: string;
  textoSecundario: string;
  textoDesabilitado: string;

  // Marca
  primaria: string;
  primariaSutil: string;
  primariaDark: string;

  // Borda / separador
  borda: string;
  separador: string;

  // Sombra
  sombra: string;

  // Status
  sucesso: string;
  aviso: string;
  erro: string;
}

const paletaClara: Paleta = {
  fundo: "#F0F2F8",
  fundoCartao: "#FFFFFF",
  fundoElevado: "#FFFFFF",
  fundoSutil: "#EEF0F8",

  texto: "#0F172A",
  textoSecundario: "#64748B",
  textoDesabilitado: "#94A3B8",

  primaria: "#4F46E5",
  primariaSutil: "#EEF2FF",
  primariaDark: "#3730A3",

  borda: "#E2E8F0",
  separador: "#F1F5F9",

  sombra: "#1E293B",

  sucesso: "#16A34A",
  aviso: "#D97706",
  erro: "#DC2626",
};

const paletaEscura: Paleta = {
  fundo: "#0B0F1A",
  fundoCartao: "#141927",
  fundoElevado: "#1C2333",
  fundoSutil: "#1A2035",

  texto: "#F1F5F9",
  textoSecundario: "#94A3B8",
  textoDesabilitado: "#475569",

  primaria: "#818CF8",
  primariaSutil: "#1E1B4B",
  primariaDark: "#A5B4FC",

  borda: "#1E2A3D",
  separador: "#172032",

  sombra: "#000000",

  sucesso: "#4ADE80",
  aviso: "#FCD34D",
  erro: "#F87171",
};

interface ThemeContextData {
  tema: ThemeName;
  paleta: Paleta;
  alternarTema: () => void;
}

const ThemeContext = createContext<ThemeContextData | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const temaDoSistema = useColorScheme();
  const [tema, setTema] = useState<ThemeName>(
    temaDoSistema === "dark" ? "dark" : "light"
  );

  useEffect(() => {
    obterTemaSalvo().then((temaSalvo) => {
      if (temaSalvo) setTema(temaSalvo);
    });
  }, []);

  const alternarTema = () => {
    setTema((atual) => {
      const novoTema = atual === "light" ? "dark" : "light";
      salvarTema(novoTema);
      return novoTema;
    });
  };

  const paleta = tema === "light" ? paletaClara : paletaEscura;

  const valor = useMemo(
    () => ({ tema, paleta, alternarTema }),
    [tema, paleta]
  );

  return (
    <ThemeContext.Provider value={valor}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextData {
  const contexto = useContext(ThemeContext);
  if (!contexto) {
    throw new Error("useTheme deve ser usado dentro de um ThemeProvider");
  }
  return contexto;
}
