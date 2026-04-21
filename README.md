# GeoLHS

Aplicação web (Next.js + Leaflet) para upload, conversão e visualização de mapas em GeoJSON.

Web app (Next.js + Leaflet) for uploading, converting and visualizing GeoJSON maps.

---

## Português (Brasil)

### Visão geral

O **GeoLHS** é uma aplicação web construída com **Next.js (App Router)** e **Leaflet** para:

- Receber uploads de arquivos de mapas (GeoJSON, KML e Shapefile em ZIP)
- Converter formatos suportados para **GeoJSON**
- Armazenar os `.geojson` resultantes em `public/uploads`
- Listar e exibir os mapas em um mapa interativo no navegador

> Observação importante: o projeto está configurado com `basePath: /geo_lhs`. Isso afeta as rotas de páginas e de API.

### Funcionalidades

- **Home**: lista todos os mapas `.geojson` disponíveis em `public/uploads` e renderiza uma prévia.
- **Detalhe do mapa**: abre `/map/[filename]` e renderiza o GeoJSON.
- **Upload**: permite enviar arquivos e converter automaticamente para GeoJSON.
- **Autenticação (UI)**: a tela de upload solicita usuário/senha e armazena um token JWT no `localStorage`.

### Formatos suportados

- `.geojson`: salvo como está (após validação básica via `JSON.parse`).
- `.kml`: convertido para GeoJSON via parser XML e lógica em `src/app/api/upload-map/kml-to-json.ts`.
	- Conversão atual cobre principalmente `Point`, `LineString` e `Polygon` (outer boundary).
- `.zip`: deve conter um Shapefile (`.shp`) e arquivos associados; é convertido para GeoJSON.

> Nota: enviar `.shp` diretamente não é suportado; o backend responde pedindo `.zip`.

### Rotas da aplicação

#### Páginas

Com `basePath: /geo_lhs`:

- `/geo_lhs/` — página inicial (lista de mapas)
- `/geo_lhs/upload` — upload e conversão
- `/geo_lhs/map/[filename]` — visualização de um mapa específico

#### API

- `GET /geo_lhs/api/get-maps`
	- Lê `public/uploads/*.geojson`, faz parse e devolve uma lista de mapas com `geoJsonData`.
- `GET /geo_lhs/api/map/[filename]`
	- Lê um arquivo específico em `public/uploads` e devolve `{ id, nome, url, geoJsonData }`.
- `POST /geo_lhs/api/upload-map`
	- Recebe `multipart/form-data` no campo `mapFiles`.
	- Converte para `.geojson` e salva em `public/uploads`.
	- Retorna `{ urls: ["/uploads/<arquivo>.geojson", ...] }`.
- `POST /geo_lhs/api/login`
	- Recebe `{ username, password }` e retorna `{ token }` se as credenciais baterem com as variáveis de ambiente.

### Variáveis de ambiente

Crie um arquivo `.env.local` (não commitado) com:

```bash
AUTH_USERNAME=seu_usuario
AUTH_PASSWORD=sua_senha

# Opcional (se ausente, usa fallback no servidor)
JWT_SECRET=uma_chave_forte_aqui
```

### Como rodar localmente

Pré-requisitos:

- Node.js 20+ recomendado
- pnpm

Comandos:

```bash
pnpm install
pnpm dev
```

A aplicação ficará disponível em:

- `http://localhost:3000/geo_lhs`

### Armazenamento e arquivos gerados

- Os arquivos convertidos são gravados em `public/uploads`.
- Os arquivos ficam acessíveis via URL pública em `/geo_lhs/uploads/<arquivo>.geojson`.

### Segurança e limitações (importante)

- O login gera um **JWT**, mas atualmente ele é usado apenas para **liberar a UI** de upload. As rotas de API não validam o token.
- `public/uploads` é um diretório no filesystem do servidor. Em ambientes serverless/ephemerais, isso pode não persistir entre deploys.
- Não há suíte de testes automatizados no repositório no momento.

---

## English

### Overview

**GeoLHS** is a web app built with **Next.js (App Router)** and **Leaflet** to:

- Upload map files (GeoJSON, KML and Shapefile inside a ZIP)
- Convert supported formats to **GeoJSON**
- Store generated `.geojson` files under `public/uploads`
- List and render maps on an interactive web map

> Important: the project is configured with `basePath: /geo_lhs`. This impacts both page routes and API routes.

### Features

- **Home**: lists all `.geojson` maps under `public/uploads` and renders a preview.
- **Map details**: opens `/map/[filename]` and renders the GeoJSON.
- **Upload**: accepts files and converts them into GeoJSON.
- **Authentication (UI)**: the upload page asks for username/password and stores a JWT in `localStorage`.

### Supported formats

- `.geojson`: stored as-is (after a basic `JSON.parse` validation).
- `.kml`: converted to GeoJSON using an XML parser and the logic in `src/app/api/upload-map/kml-to-json.ts`.
	- Current conversion mainly supports `Point`, `LineString` and `Polygon` (outer boundary).
- `.zip`: must contain a Shapefile (`.shp` + related files); converted to GeoJSON.

> Note: uploading a raw `.shp` file is not supported; the backend asks for a `.zip`.

### Application routes

#### Pages

With `basePath: /geo_lhs`:

- `/geo_lhs/` — home (map list)
- `/geo_lhs/upload` — upload and conversion
- `/geo_lhs/map/[filename]` — single map viewer

#### API

- `GET /geo_lhs/api/get-maps`
	- Reads `public/uploads/*.geojson`, parses them and returns a list including `geoJsonData`.
- `GET /geo_lhs/api/map/[filename]`
	- Reads a single file under `public/uploads` and returns `{ id, nome, url, geoJsonData }`.
- `POST /geo_lhs/api/upload-map`
	- Accepts `multipart/form-data` under the `mapFiles` field.
	- Converts files to `.geojson` and writes them to `public/uploads`.
	- Returns `{ urls: ["/uploads/<file>.geojson", ...] }`.
- `POST /geo_lhs/api/login`
	- Accepts `{ username, password }` and returns `{ token }` when credentials match the environment variables.

### Environment variables

Create a `.env.local` file (not committed) with:

```bash
AUTH_USERNAME=your_username
AUTH_PASSWORD=your_password

# Optional (if missing, the server uses a fallback)
JWT_SECRET=a_strong_secret_here
```

### Running locally

Prerequisites:

- Node.js 20+ recommended
- pnpm

Commands:

```bash
pnpm install
pnpm dev
```

The app will be available at:

- `http://localhost:3000/geo_lhs`

### Storage and generated files

- Converted files are written to `public/uploads`.
- Files are served publicly at `/geo_lhs/uploads/<file>.geojson`.

### Security and limitations (important)

- Login generates a **JWT**, but it is currently used only to **gate the upload UI**. API routes do not validate the token.
- `public/uploads` lives on the server filesystem. In serverless/ephemeral environments, it may not persist across deploys.
- There is no automated test suite in the repository at the moment.