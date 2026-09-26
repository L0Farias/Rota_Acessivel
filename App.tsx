import React, { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { RootNavigator } from "@/navigation/RootNavigator";
import { inicializarBanco } from "@/database/database";

// App.tsx é só o "casca": inicializa o banco, monta os Providers (tema e
// autenticação) e entrega o controle para o RootNavigator.
export default function App() {
  useEffect(() => {
    // Garante que as tabelas (barreiras e usuarios) existam antes de qualquer
    // operação de leitura ou escrita no banco.
    inicializarBanco();
  }, []);

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <StatusBar style="auto" />
          <RootNavigator />
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
