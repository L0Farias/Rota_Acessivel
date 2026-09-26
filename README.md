# 🗺️ Rota Acessível

### Trabalho de Aplicativos Híbridos

**Aluno:** Lucas Freitas Farias
**Matrícula:** 202313179

---

## 📱 Sobre o projeto

**Rota Acessível** é um aplicativo cívico desenvolvido para permitir que qualquer pessoa denuncie **barreiras de acessibilidade** encontradas nas ruas, como:

* ♿ Rampas quebradas ou inadequadas;
* 🚶 Calçadas danificadas;
* 🔶 Ausência de piso tátil;
* 🅿️ Vagas de acessibilidade ocupadas irregularmente;
* 🚧 Outras barreiras que dificultem a mobilidade.

Cada denúncia pode ser registrada com **foto e localização exata**, formando um **mapa colaborativo** das barreiras de acessibilidade de uma região.

O objetivo é facilitar a identificação dos problemas urbanos, permitindo que as informações sejam utilizadas para auxiliar na cobrança de melhorias do poder público e também para ajudar pessoas a planejarem seus deslocamentos pela cidade.

---

## 🛠️ Tecnologias utilizadas

| Tecnologia                   | Utilização                          |
| ---------------------------- | ----------------------------------- |
| React Native 0.86 / React 19 | Base do aplicativo                  |
| Expo SDK 57                  | Build, permissões e módulos nativos |
| React Navigation             | Navegação entre telas e abas        |
| Context API                  | Tema claro/escuro e autenticação    |
| SQLite (`expo-sqlite`)       | Persistência local das denúncias    |
| AsyncStorage                 | Persistência da preferência de tema |
| `expo-camera`                | Captura de fotos das barreiras      |
| `expo-image-picker`          | Seleção de fotos da galeria         |
| `expo-media-library`         | Salvamento de fotos na galeria      |
| `expo-location`              | Geolocalização via GPS              |
| `expo-file-system`           | Leitura das imagens locais          |
| `expo-local-authentication`  | Autenticação por biometria          |
| React Native WebView         | Exibição do mapa                    |
| Leaflet 1.9.4                | Mapa interativo                     |
| OpenStreetMap                | Mapas e dados cartográficos         |
| Esri World Imagery           | Visualização via satélite           |
| Jest + Testing Library       | Testes automatizados                |

### 🗺️ Mapa sem Google Maps

O aplicativo utiliza **Leaflet + OpenStreetMap**, evitando a necessidade de uma chave da Google Maps API.

O Leaflet é incorporado diretamente ao aplicativo e executado dentro de uma `WebView`. Os mapas são carregados através dos tiles do **OpenStreetMap**, enquanto a visualização de satélite utiliza o **Esri World Imagery**.

---

## 📂 Estrutura do projeto

```text
hybrid-app/
├── App.tsx
├── app.json
├── package.json
│
├── src/
│   ├── contexts/
│   │   ├── ThemeContext.tsx
│   │   └── AuthContext.tsx
│   │
│   ├── navigation/
│   │   ├── RootNavigator.tsx
│   │   └── TabNavigator.tsx
│   │
│   ├── screens/
│   │   ├── LoginScreen.tsx
│   │   ├── DenunciasScreen.tsx
│   │   ├── ReportarScreen.tsx
│   │   ├── GaleriaScreen.tsx
│   │   ├── MapaScreen.tsx
│   │   ├── ConfigScreen.tsx
│   │   ├── leafletAssets.ts
│   │   └── mapAssets/
│   │
│   ├── components/
│   │   ├── ThemedView.tsx
│   │   ├── ThemedText.tsx
│   │   ├── ThemedButton.tsx
│   │   ├── Chip.tsx
│   │   ├── FormularioDenuncia.tsx
│   │   └── BarreiraCard.tsx
│   │
│   ├── database/
│   │   └── database.ts
│   │
│   ├── storage/
│   │   └── storage.ts
│   │
│   ├── services/
│   │   ├── location.ts
│   │   └── biometrics.ts
│   │
│   ├── utils/
│   │   └── barreiraUtils.ts
│   │
│   ├── types/
│   │   └── index.ts
│   │
│   └── __tests__/
│       ├── biometrics.test.ts
│       ├── database.test.ts
│       ├── ThemeContext.test.tsx
│       └── ThemedButton.test.tsx
│
└── jest.setup.js
```

---

## ✨ Funcionalidades

### 🔐 Autenticação

* Login utilizando biometria;
* Suporte a impressão digital e Face ID;
* Autenticação através do `expo-local-authentication`.

### 🧭 Navegação

* Navegação utilizando Bottom Tabs;
* Cinco abas principais;
* Botão central para realizar uma nova denúncia;
* Ícones diferentes para estados ativo e inativo.

### 📸 Denúncias

O usuário pode:

* Fotografar uma barreira utilizando a câmera;
* Selecionar uma imagem existente da galeria;
* Informar a categoria da barreira;
* Definir o nível de gravidade;
* Adicionar uma descrição;
* Registrar automaticamente a localização;
* Armazenar a denúncia localmente utilizando SQLite.

O formulário possui **6 categorias de barreiras** e níveis de gravidade **baixa, média e alta**.

### 📋 Lista de denúncias

A tela de denúncias apresenta:

* Quantidade total de denúncias;
* Quantidade de denúncias pendentes;
* Quantidade de denúncias resolvidas;
* Cards identificados por nível de gravidade;
* Categoria da barreira;
* Status da denúncia;
* Foto da ocorrência;
* Botão para marcar uma denúncia como resolvida.

### 🗺️ Mapa colaborativo

O mapa permite visualizar as denúncias registradas e acompanhar a localização do usuário.

Principais recursos:

* Leaflet 1.9.4;
* OpenStreetMap;
* Visualização via satélite;
* GPS em tempo real;
* Indicador da direção do usuário;
* Velocidade em km/h;
* Botão para recentralizar o mapa;
* Pins das denúncias;
* Fotos das barreiras nos marcadores;
* Popup com informações da denúncia;
* Alternância entre mapa tradicional e satélite.

### 🌙 Tema

O aplicativo possui suporte a:

* ☀️ Tema claro;
* 🌙 Tema escuro;
* Persistência da preferência do usuário;
* Detecção do tema do sistema;
* Alteração instantânea através da tela de configurações.

### 🧪 Testes

O projeto utiliza **Jest + Testing Library** para testar:

* Componentes;
* Contextos;
* Autenticação biométrica;
* Banco de dados;
* Botões e componentes da interface.

---

## 🚀 Como executar o projeto

### 1. Clone o repositório

```bash
git clone URL_DO_SEU_REPOSITORIO
```

Entre na pasta:

```bash
cd hybrid-app
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Inicie o Expo

```bash
npx expo start
```

### 4. Execute os testes

```bash
npm test
```

Para testar em um dispositivo físico, utilize o **Expo Go** e escaneie o QR Code apresentado pelo Expo.

> O projeto requer uma versão do Expo Go compatível com o **Expo SDK 57**.

---

## ⚙️ Observações técnicas

### Expo Media Library

No Expo SDK 57, o `expo-media-library` utiliza uma nova arquitetura que apresenta limitações no Expo Go. Por isso, o projeto utiliza a API legada através de:

```typescript
expo-media-library/legacy
```

A operação de salvamento é protegida por `try/catch`, permitindo que a denúncia continue sendo registrada no SQLite mesmo quando a cópia da imagem para a galeria não estiver disponível.

### 🗺️ Sistema de mapas

O projeto não depende do Google Maps.

A implementação utiliza:

```text
React Native
      ↓
   WebView
      ↓
   Leaflet
      ↓
OpenStreetMap / Esri
```

O Leaflet é incorporado diretamente ao projeto, sem utilização de CDN externa. Os tiles do mapa são carregados pela internet a partir dos servidores do OpenStreetMap e Esri.

### 📷 Fotos no mapa

As imagens das denúncias são lidas do armazenamento local através do `expo-file-system` e convertidas para Base64.

Isso permite que as fotos sejam incorporadas diretamente ao HTML utilizado pelo mapa dentro da WebView.

---

## 🎓 Informações acadêmicas

**Projeto:** Rota Acessível
**Disciplina:** Aplicativos Híbridos
**Aluno:** Lucas Freitas Farias
**Matrícula:** 202313179

---

## 📌 Roteiro de apresentação

1. Apresentar a tela de **Login** e demonstrar a autenticação biométrica.
2. Acessar **Reportar** e realizar uma nova denúncia utilizando a câmera.
3. Demonstrar o formulário de categoria, gravidade e descrição.
4. Mostrar a denúncia registrada na tela de **Denúncias**.
5. Marcar uma denúncia como resolvida e demonstrar a atualização dos indicadores.
6. Acessar o **Mapa** e demonstrar GPS, direção, velocidade e pins.
7. Alternar entre mapa tradicional e visualização de satélite.
8. Abrir um pin e mostrar as informações e foto da denúncia.
9. Acessar **Configurações** e alternar entre os temas claro e escuro.
10. Executar `npm test` para demonstrar os testes automatizados.

---

## 👨‍💻 Autor

**Lucas Freitas Farias**
**Matrícula:** 202313179

Projeto acadêmico — Aplicativos Híbridos.
