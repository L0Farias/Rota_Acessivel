export type ThemeName = "light" | "dark";

export type CategoriaBarreira =
  | "Rampa quebrada"
  | "Falta de rampa"
  | "Calçada danificada"
  | "Piso tátil ausente/danificado"
  | "Vaga de acessibilidade irregular"
  | "Outro";

export type Severidade = "baixa" | "media" | "alta";

export type StatusBarreira = "pendente" | "resolvido";

export interface Barreira {
  id: number;
  categoria: CategoriaBarreira;
  descricao: string;
  severidade: Severidade;
  status: StatusBarreira;
  latitude: number | null;
  longitude: number | null;
  fotoUri: string | null;
  criadoEm: string;
}

export interface NovaBarreira {
  categoria: CategoriaBarreira;
  descricao: string;
  severidade: Severidade;
  latitude?: number | null;
  longitude?: number | null;
  fotoUri?: string | null;
}

export const CATEGORIAS: CategoriaBarreira[] = [
  "Rampa quebrada",
  "Falta de rampa",
  "Calçada danificada",
  "Piso tátil ausente/danificado",
  "Vaga de acessibilidade irregular",
  "Outro",
];

export const SEVERIDADES: Severidade[] = ["baixa", "media", "alta"];

export type RootTabParamList = {
  Denuncias: undefined;
  Reportar: undefined;
  Galeria: undefined;
  Mapa: undefined;
  Config: undefined;
};

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  senhaHash: string;
  biometriaHabilitada: number; // 0 ou 1 (SQLite não tem boolean)
  criadoEm: string;
}

export interface NovoUsuario {
  nome: string;
  email: string;
  senhaHash: string;
  biometriaHabilitada: boolean;
}

export type RootStackParamList = {
  Login: undefined;
  Cadastro: undefined;
  Tabs: undefined;
};
