import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  ActivityIndicator,
  Modal,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { WebView } from "react-native-webview";
import * as Location from "expo-location";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedButton } from "@/components/ThemedButton";
import { useTheme } from "@/contexts/ThemeContext";
import { listarBarreiras } from "@/database/database";
import { Barreira } from "@/types";
import { corDaSeveridade, rotuloDaSeveridade, rotuloDoStatus } from "@/utils/barreiraUtils";
import { LEAFLET_CSS, LEAFLET_JS } from "./leafletAssets";

interface PosicaoAtual {
  latitude: number;
  longitude: number;
  heading: number;
  speed: number;
}

// Pino simples — sem foto, só dados para o modal
interface PinDenuncia {
  id: number;
  lat: number;
  lng: number;
  cor: string;
  categoria: string;
  severidade: string;
  status: string;
  descricao: string;
  fotoUri: string | null;
  criadoEm: string;
}

function buildHtml(posicao: PosicaoAtual): string {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no"/>
<style>
${LEAFLET_CSS}
* { margin: 0; padding: 0; box-sizing: border-box; }
html, body, #map { width: 100%; height: 100%; background: #1a1a2e; }

.player-wrapper {
  position: relative; width: 48px; height: 48px;
  display: flex; align-items: center; justify-content: center;
}
.player-pulse {
  position: absolute; width: 48px; height: 48px; border-radius: 50%;
  background: rgba(79,70,229,0.25); animation: pulse 1.8s ease-out infinite;
}
.player-dot {
  position: relative; width: 22px; height: 22px; border-radius: 50%;
  background: #4F46E5; border: 3px solid #fff;
  box-shadow: 0 2px 10px rgba(79,70,229,0.7); z-index: 1;
}
.player-arrow {
  position: absolute; top: -8px; left: 50%; width: 0; height: 0;
  border-left: 5px solid transparent; border-right: 5px solid transparent;
  border-bottom: 11px solid #4F46E5; transform-origin: center 20px; z-index: 2;
}
@keyframes pulse {
  0%   { transform: scale(0.5); opacity: 0.9; }
  100% { transform: scale(2.2); opacity: 0; }
}

/* Pin de denúncia — círculo colorido com ! */
.pin-denuncia {
  width: 44px; height: 44px; border-radius: 50%;
  border: 3px solid #fff;
  box-shadow: 0 3px 12px rgba(0,0,0,0.45);
  display: flex; align-items: center; justify-content: center;
  font-size: 22px; font-weight: 900; color: #fff;
  cursor: pointer;
  font-family: sans-serif;
  pointer-events: auto;
  -webkit-tap-highlight-color: rgba(255,255,255,0.3);
  user-select: none;
  -webkit-user-select: none;
}

#layer-toggle {
  position: absolute; top: 12px; left: 12px; z-index: 1000;
  background: rgba(15,23,42,0.85); backdrop-filter: blur(8px);
  border: none; border-radius: 12px; padding: 8px 14px;
  color: #fff; font-family: sans-serif; font-size: 13px; font-weight: 600;
  cursor: pointer; box-shadow: 0 2px 12px rgba(0,0,0,.35);
}
#hud {
  position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%);
  background: rgba(15,23,42,0.80); backdrop-filter: blur(8px); color: #fff;
  padding: 8px 20px; border-radius: 20px; font-family: sans-serif;
  font-size: 13px; font-weight: 600; z-index: 1000;
  pointer-events: none; white-space: nowrap;
  box-shadow: 0 2px 12px rgba(0,0,0,.3);
}
</style>
</head>
<body>
<div id="map"></div>
<button id="layer-toggle">🛰️ Satélite</button>
<div id="hud">📍 Iniciando…</div>

<script>${LEAFLET_JS}</script>
<script>
var map = L.map('map', { zoomControl: false, attributionControl: false })
           .setView([${posicao.latitude}, ${posicao.longitude}], 18);
L.control.zoom({ position: 'bottomright' }).addTo(map);

var layerRua = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 20 });
var layerSat = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { maxZoom: 20 });
var layerSatLabel = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', { maxZoom: 20, opacity: 0.8 });
var isSat = false;
layerRua.addTo(map);

document.getElementById('layer-toggle').addEventListener('click', function() {
  if (isSat) {
    map.removeLayer(layerSat); map.removeLayer(layerSatLabel); layerRua.addTo(map);
    this.innerHTML = '🛰️ Satélite'; isSat = false;
  } else {
    map.removeLayer(layerRua); layerSat.addTo(map); layerSatLabel.addTo(map);
    this.innerHTML = '🗺️ Mapa'; isSat = true;
  }
});

function playerIconHtml(heading) {
  return '<div class="player-wrapper">' +
    '<div class="player-pulse"></div>' +
    '<div class="player-arrow" style="transform:rotate(' + (heading||0) + 'deg) translateX(-50%)"></div>' +
    '<div class="player-dot"></div>' +
  '</div>';
}

var playerMarker = L.marker([${posicao.latitude}, ${posicao.longitude}], {
  icon: L.divIcon({ html: playerIconHtml(${posicao.heading}), className: '', iconSize:[48,48], iconAnchor:[24,24] }),
  zIndexOffset: 1000
}).addTo(map);

var accuracyCircle = L.circle([${posicao.latitude}, ${posicao.longitude}], {
  radius: 8, color:'#4F46E5', fillColor:'#4F46E5', fillOpacity:0.08, weight:1.5
}).addTo(map);

var followPlayer = true;
map.on('dragstart', function() { followPlayer = false; });

var recenterBtn = L.control({ position: 'bottomright' });
recenterBtn.onAdd = function() {
  var btn = L.DomUtil.create('button');
  btn.innerHTML = '🎯';
  btn.style.cssText = 'display:block;font-size:20px;padding:7px 11px;border:none;' +
    'border-radius:10px;background:rgba(255,255,255,.9);cursor:pointer;' +
    'box-shadow:0 2px 8px rgba(0,0,0,.25);margin-top:6px';
  btn.onclick = function() { followPlayer = true; map.setView(playerMarker.getLatLng(), 18); };
  return btn;
};
recenterBtn.addTo(map);

var hud = document.getElementById('hud');
function headingToDir(h) {
  if (h == null || h < 0) return 'N';
  return ['N','NE','L','SE','S','SO','O','NO'][Math.round(h/45)%8];
}

function sendPin(id) {
  var msg = JSON.stringify({ type: 'pinClick', id: id });
  if (window.ReactNativeWebView) {
    window.ReactNativeWebView.postMessage(msg);
  } else {
    window.postMessage(msg, '*');
  }
}

function onMessage(e) {
  try {
    var data = JSON.parse(e.data);

    if (data.type === 'position') {
      var ll = L.latLng(data.lat, data.lng);
      playerMarker.setLatLng(ll);
      playerMarker.setIcon(L.divIcon({ html: playerIconHtml(data.heading), className: '', iconSize:[48,48], iconAnchor:[24,24] }));
      accuracyCircle.setLatLng(ll).setRadius(Math.max(data.accuracy||5, 5));
      if (followPlayer) map.setView(ll, map.getZoom(), { animate:true, duration:0.5 });
      hud.textContent = '🧭 ' + headingToDir(data.heading) + '  •  🚶 ' + (data.speed*3.6).toFixed(1) + ' km/h';
    }

    if (data.type === 'pins') {
      data.pins.forEach(function(p) {
        (function(pin) {
          var icon = L.divIcon({
            html: '<div class="pin-denuncia" style="background:' + pin.cor + '" onclick="sendPin(' + pin.id + ')">!</div>',
            className: '',
            iconSize: [44, 44],
            iconAnchor: [22, 22],
          });
          L.marker([pin.lat, pin.lng], { icon: icon }).addTo(map);
        })(p);
      });
    }

  } catch(err) {}
}
window.addEventListener('message', onMessage);
document.addEventListener('message', onMessage);
</script>
</body>
</html>`;
}

export function MapaScreen() {
  const { paleta } = useTheme();
  const webViewRef = useRef<WebView>(null);
  const [posicaoInicial, setPosicaoInicial] = useState<PosicaoAtual | null>(null);
  const [pins, setPins] = useState<PinDenuncia[]>([]);
  const pinsRef = useRef<PinDenuncia[]>([]); // ref para acesso no closure da WebView
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(false);
  const webViewReady = useRef(false);
  const pinsQueue = useRef<PinDenuncia[] | null>(null);

  // Modal de detalhe
  const [pinSelecionado, setPinSelecionado] = useState<PinDenuncia | null>(null);

  useEffect(() => {
    let subscription: Location.LocationSubscription | null = null;

    async function iniciar() {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") { setErro(true); return; }

      const pos = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setPosicaoInicial({
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
        heading: pos.coords.heading ?? 0,
        speed: pos.coords.speed ?? 0,
      });

      // Carrega as denúncias como dados simples — sem conversão de imagem
      const pinsCarregados: PinDenuncia[] = listarBarreiras()
        .filter((b) => b.latitude != null && b.longitude != null)
        .map((b) => ({
          id: b.id,
          lat: b.latitude as number,
          lng: b.longitude as number,
          cor: corDaSeveridade(b.severidade),
          categoria: b.categoria,
          severidade: rotuloDaSeveridade(b.severidade),
          status: b.status,
          descricao: b.descricao ?? "",
          fotoUri: b.fotoUri ?? null,
          criadoEm: b.criadoEm,
        }));

      setPins(pinsCarregados);
      pinsRef.current = pinsCarregados;

      // Envia para a WebView se já estiver pronta, senão enfileira
      const msg = JSON.stringify({ type: "pins", pins: pinsCarregados });
      if (webViewReady.current) {
        webViewRef.current?.postMessage(msg);
      } else {
        pinsQueue.current = pinsCarregados;
      }

      subscription = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.BestForNavigation, timeInterval: 500, distanceInterval: 1 },
        (loc) => {
          webViewRef.current?.postMessage(JSON.stringify({
            type: "position",
            lat: loc.coords.latitude,
            lng: loc.coords.longitude,
            heading: loc.coords.heading ?? 0,
            speed: loc.coords.speed ?? 0,
            accuracy: loc.coords.accuracy ?? 5,
          }));
        }
      );
    }

    iniciar().catch(() => setErro(true));
    return () => { subscription?.remove(); };
  }, []);

  // Recebe cliques nos pins da WebView
  function handleWebViewMessage(event: { nativeEvent: { data: string } }) {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === "pinClick") {
        // Usa pinsRef para sempre ter o valor mais atual (não o closure antigo)
        const pin = pinsRef.current.find((p) => p.id === data.id);
        if (pin) setPinSelecionado(pin);
      }
    } catch {}
  }

  if (erro) {
    return (
      <ThemedView style={estilos.centro}>
        <ThemedText style={{ fontSize: 40, marginBottom: 12 }}>📍</ThemedText>
        <ThemedText variante="subtitulo" style={{ textAlign: "center" }}>
          Localização indisponível
        </ThemedText>
        <ThemedText variante="corpo" style={{ textAlign: "center", color: paleta.textoSecundario, marginTop: 8 }}>
          Permita o acesso à localização nas configurações do dispositivo.
        </ThemedText>
      </ThemedView>
    );
  }

  if (!posicaoInicial) {
    return (
      <ThemedView style={estilos.centro}>
        <ActivityIndicator size="large" color={paleta.primaria} />
        <ThemedText variante="corpo" style={{ marginTop: 14, color: paleta.textoSecundario }}>
          Obtendo sua localização…
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={estilos.wrapper}>
      {carregando && (
        <ThemedView style={estilos.overlay}>
          <ActivityIndicator size="large" color={paleta.primaria} />
          <ThemedText variante="corpo" style={{ marginTop: 14, color: paleta.textoSecundario }}>
            Carregando mapa…
          </ThemedText>
        </ThemedView>
      )}

      <WebView
        ref={webViewRef}
        source={{ html: buildHtml(posicaoInicial) }}
        style={estilos.mapa}
        originWhitelist={["*"]}
        javaScriptEnabled
        domStorageEnabled
        mixedContentMode="always"
        onMessage={handleWebViewMessage}
        injectedJavaScript={`
          // Garante que ReactNativeWebView existe antes de qualquer clique
          if (!window.ReactNativeWebView) {
            window.ReactNativeWebView = {
              postMessage: function(msg) {
                window.dispatchEvent(new MessageEvent('message', { data: msg }));
              }
            };
          }
          true;
        `}
        onLoad={() => {
          setCarregando(false);
          webViewReady.current = true;
          if (pinsQueue.current) {
            webViewRef.current?.postMessage(
              JSON.stringify({ type: "pins", pins: pinsQueue.current })
            );
            pinsQueue.current = null;
          }
        }}
        onError={() => setCarregando(false)}
      />

      {/* Modal de detalhe da denúncia */}
      <Modal
        visible={pinSelecionado !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setPinSelecionado(null)}
      >
        <TouchableOpacity
          style={estilos.modalOverlay}
          activeOpacity={1}
          onPress={() => setPinSelecionado(null)}
        >
          <TouchableOpacity activeOpacity={1} onPress={() => {}}>
            <View style={[estilos.modalCard, { backgroundColor: paleta.fundoCartao }]}>
              {/* Faixa colorida no topo */}
              {pinSelecionado && (
                <View style={[estilos.modalFaixa, { backgroundColor: pinSelecionado.cor }]} />
              )}

              <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
                {/* Foto */}
                {pinSelecionado?.fotoUri ? (
                  <Image
                    source={{ uri: pinSelecionado.fotoUri }}
                    style={estilos.modalFoto}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={[estilos.modalFotoPlaceholder, { backgroundColor: pinSelecionado?.cor + "22" }]}>
                    <ThemedText style={{ fontSize: 48 }}>📷</ThemedText>
                    <ThemedText variante="legenda" style={{ color: paleta.textoSecundario }}>
                      Sem foto
                    </ThemedText>
                  </View>
                )}

                <View style={estilos.modalConteudo}>
                  {/* Categoria */}
                  <ThemedText variante="titulo">{pinSelecionado?.categoria}</ThemedText>

                  {/* Badges */}
                  <View style={estilos.modalBadges}>
                    <View style={[estilos.badge, { backgroundColor: (pinSelecionado?.cor ?? "#000") + "22" }]}>
                      <View style={[estilos.badgeDot, { backgroundColor: pinSelecionado?.cor }]} />
                      <ThemedText variante="rotulo" style={{ color: pinSelecionado?.cor }}>
                        {pinSelecionado?.severidade}
                      </ThemedText>
                    </View>
                    <View style={[
                      estilos.badge,
                      { backgroundColor: pinSelecionado?.status === "resolvido"
                          ? paleta.sucesso + "22"
                          : paleta.aviso + "22" }
                    ]}>
                      <ThemedText variante="rotulo" style={{
                        color: pinSelecionado?.status === "resolvido" ? paleta.sucesso : paleta.aviso
                      }}>
                        {pinSelecionado?.status === "resolvido" ? "✅ Resolvida" : "⏳ Pendente"}
                      </ThemedText>
                    </View>
                  </View>

                  {/* Descrição */}
                  {!!pinSelecionado?.descricao && (
                    <View style={[estilos.modalSecao, { borderTopColor: paleta.separador }]}>
                      <ThemedText variante="rotulo" style={{ color: paleta.textoSecundario, marginBottom: 4 }}>
                        DESCRIÇÃO
                      </ThemedText>
                      <ThemedText variante="corpo">{pinSelecionado.descricao}</ThemedText>
                    </View>
                  )}

                  {/* Localização */}
                  <View style={[estilos.modalSecao, { borderTopColor: paleta.separador }]}>
                    <ThemedText variante="rotulo" style={{ color: paleta.textoSecundario, marginBottom: 4 }}>
                      LOCALIZAÇÃO
                    </ThemedText>
                    <ThemedText variante="corpo" style={{ color: paleta.textoSecundario }}>
                      📍 {pinSelecionado?.lat.toFixed(5)}, {pinSelecionado?.lng.toFixed(5)}
                    </ThemedText>
                  </View>

                  {/* Data */}
                  <View style={[estilos.modalSecao, { borderTopColor: paleta.separador }]}>
                    <ThemedText variante="rotulo" style={{ color: paleta.textoSecundario, marginBottom: 4 }}>
                      REGISTRADA EM
                    </ThemedText>
                    <ThemedText variante="corpo" style={{ color: paleta.textoSecundario }}>
                      🕐 {pinSelecionado
                        ? new Date(pinSelecionado.criadoEm).toLocaleString("pt-BR")
                        : ""}
                    </ThemedText>
                  </View>
                </View>
              </ScrollView>

              <View style={[estilos.modalRodape, { borderTopColor: paleta.separador }]}>
                <ThemedButton
                  titulo="Fechar"
                  variante="secundario"
                  onPress={() => setPinSelecionado(null)}
                  style={{ flex: 1 }}
                />
              </View>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </ThemedView>
  );
}

const estilos = StyleSheet.create({
  wrapper: { flex: 1 },
  mapa: { flex: 1 },
  centro: { flex: 1, justifyContent: "center", alignItems: "center", padding: 32, gap: 4 },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "flex-end",
  },
  modalCard: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: "hidden",
    maxHeight: "85%",
  },
  modalFaixa: {
    height: 5,
  },
  modalFoto: {
    width: "100%",
    height: 200,
  },
  modalFotoPlaceholder: {
    width: "100%",
    height: 120,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  modalConteudo: {
    padding: 20,
    gap: 4,
  },
  modalBadges: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
    flexWrap: "wrap",
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  badgeDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  modalSecao: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  modalRodape: {
    padding: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});
