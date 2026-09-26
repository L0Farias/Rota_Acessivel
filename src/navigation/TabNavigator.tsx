import React from "react";
import { View, StyleSheet, Platform } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { DenunciasScreen } from "@/screens/DenunciasScreen";
import { ReportarScreen } from "@/screens/ReportarScreen";
import { GaleriaScreen } from "@/screens/GaleriaScreen";
import { MapaScreen } from "@/screens/MapaScreen";
import { ConfigScreen } from "@/screens/ConfigScreen";
import { useTheme } from "@/contexts/ThemeContext";
import { ThemedText } from "@/components/ThemedText";
import { RootTabParamList } from "@/types";

const Tab = createBottomTabNavigator<RootTabParamList>();

type IconeConfig = {
  ativo: keyof typeof Ionicons.glyphMap;
  inativo: keyof typeof Ionicons.glyphMap;
};

const ICONES: Record<keyof RootTabParamList, IconeConfig> = {
  Denuncias: { ativo: "list",          inativo: "list-outline" },
  Reportar:  { ativo: "camera",        inativo: "camera-outline" },
  Galeria:   { ativo: "images",        inativo: "images-outline" },
  Mapa:      { ativo: "map",           inativo: "map-outline" },
  Config:    { ativo: "settings",      inativo: "settings-outline" },
};

export function TabNavigator() {
  const { paleta } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle: {
          backgroundColor: paleta.fundoCartao,
          borderBottomWidth: 1,
          borderBottomColor: paleta.separador,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTitleStyle: {
          fontWeight: "700",
          fontSize: 18,
          color: paleta.texto,
        },
        headerTintColor: paleta.texto,
        tabBarStyle: {
          backgroundColor: paleta.fundoCartao,
          borderTopWidth: 1,
          borderTopColor: paleta.separador,
          height: Platform.OS === "ios" ? 88 : 68,
          paddingBottom: Platform.OS === "ios" ? 24 : 10,
          paddingTop: 10,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarActiveTintColor: paleta.primaria,
        tabBarInactiveTintColor: paleta.textoDesabilitado,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
          marginTop: -2,
        },
        tabBarIcon: ({ focused, color, size }) => {
          const nomeRota = route.name as keyof RootTabParamList;
          const nomeIcone = focused
            ? ICONES[nomeRota].ativo
            : ICONES[nomeRota].inativo;

          if (nomeRota === "Reportar") {
            return (
              <View style={[estilos.botaoCentral, { backgroundColor: paleta.primaria }]}>
                <Ionicons name="camera" size={22} color="#FFFFFF" />
              </View>
            );
          }

          return <Ionicons name={nomeIcone} size={size} color={color} />;
        },
        tabBarLabel: ({ focused, color, children }) => {
          const nomeRota = route.name as keyof RootTabParamList;
          if (nomeRota === "Reportar") {
            return (
              <ThemedText
                variante="legenda"
                style={{ color, fontWeight: "600", fontSize: 11, marginTop: 6 }}
              >
                {children}
              </ThemedText>
            );
          }
          return (
            <ThemedText
              variante="legenda"
              style={{ color, fontWeight: "600", fontSize: 11 }}
            >
              {children}
            </ThemedText>
          );
        },
      })}
    >
      <Tab.Screen
        name="Denuncias"
        component={DenunciasScreen}
        options={{ title: "Denúncias" }}
      />
      <Tab.Screen
        name="Reportar"
        component={ReportarScreen}
        options={{ title: "Reportar", tabBarLabel: "Reportar" }}
      />
      <Tab.Screen name="Galeria" component={GaleriaScreen} />
      <Tab.Screen name="Mapa" component={MapaScreen} />
      <Tab.Screen
        name="Config"
        component={ConfigScreen}
        options={{ title: "Ajustes" }}
      />
    </Tab.Navigator>
  );
}

const estilos = StyleSheet.create({
  botaoCentral: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    marginTop: -18,
    shadowColor: "#4F46E5",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
});
