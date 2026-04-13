# HCAIRE Blog - Progetto Web

## Descrizione
HCAIRE Blog è un sito di presentazione contenuti con architettura monorepo.
I contenuti sono memorizzati in MongoDB Atlas e serviti tramite API Express.
Il frontend è un'applicazione React con TypeScript che renderizza Markdown.

## Stack Tecnologico

### Backend
- **Framework**: Express.js (Node.js)
- **Lingua**: TypeScript
- **Database**: MongoDB Atlas (cloud)
- **Porta dev**: 3018
- **Autenticazione**: JWT (login admin semplice)

### Frontend
- **Framework**: React 18+ con TypeScript
- **Routing**: React Router v6+
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + Material-UI (MUI)
- **Markdown**: react-markdown

## Struttura Monorepo

```
hcaire-blog/
├── claude.md                 # Questo file
├── package.json             # Root workspace
├── server/
│   ├── package.json
│   ├── src/
│   │   ├── index.ts
│   │   ├── config/
│   │   │   └── db.ts        # Connessione MongoDB
│   │   ├── middleware/
│   │   │   └── auth.ts      # Middleware JWT
│   │   ├── routes/
│   │   │   ├── content.ts   # GET /api/contents, /api/contents/:id
│   │   │   ├── nav.ts       # GET /api/navigation
│   │   │   └── auth.ts      # POST /api/login, POST /api/logout
│   │   ├── controllers/
│   │   │   ├── contentController.ts
│   │   │   └── authController.ts
│   │   ├── models/
│   │   │   └── Content.ts   # Schema Mongoose
│   │   └── types/
│   │       └── index.ts
│   ├── .env.example
│   └── tsconfig.json
│
├── client/
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── index.html
│   ├── src/
│   │   ├── main.tsx
│   │   ├── App.tsx
│   │   ├── pages/
│   │   │   ├── Home.tsx
│   │   │   ├── About.tsx
│   │   │   ├── BlogPost.tsx
│   │   │   ├── AdminDashboard.tsx
│   │   │   └── NotFound.tsx
│   │   ├── components/
│   │   │   ├── Navigation.tsx
│   │   │   ├── MarkdownRenderer.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── LoginForm.tsx
│   │   ├── services/
│   │   │   ├── contentService.ts
│   │   │   ├── authService.ts
│   │   │   └── apiClient.ts
│   │   ├── hooks/
│   │   │   ├── useFetchContent.ts
│   │   │   ├── useFetchNavigation.ts
│   │   │   └── useAuth.ts
│   │   ├── types/
│   │   │   ├── content.ts
│   │   │   └── navigation.ts
│   │   ├── utils/
│   │   │   └── constants.ts
│   │   ├── styles/
│   │   │   └── tailwind.css
│   │   └── context/
│   │       └── AuthContext.tsx
│   ├── public/
│   └── .env.example
│
└── .gitignore
```

## Database MongoDB

### Connessione
- **Provider**: MongoDB Atlas (cloud)
- **Connection String**: `mongodb+srv://stfnbssl_db_user:{password}@cluster0.y3qtgdm.mongodb.net/?appName=Cluster0`
- **Password**: Gestita in `/server/.env` come variabile `MONGODB_PASSWORD`
- **Database**: `hcaire_db` (da definire)
- **Collection**: `hcaire-content`

### Schema Documento (Content)
```json
{
  "_id": ObjectId,
  "slug": "come-iniziare",
  "titolo": "Come Iniziare",
  "descrizione": "Breve descrizione per preview",
  "contenuto": "# Titolo\n\nContenuto in Markdown...",
  "autore": "stfnbssl",
  "categoria": "tutorial",
  "tags": ["markdown", "guide"],
  "isPublished": true,
  "isPinned": false,
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

### Schema Documento (Navigation)
```json
{
  "_id": ObjectId,
  "titolo": "About Us",
  "slug": "about",
  "isSpecial": true,
  "order": 2,
  "isVisible": true
}
```

## Autenticazione e Accesso

### Contenuti
- **Accesso**: Pubblico (nessuna autenticazione richiesta)
- **Endpoint**: `GET /api/contents`, `GET /api/contents/:slug`

### Admin Dashboard
- **Login**: username e password
  - Username: `admin`
  - Password: `admin`
- **Token**: JWT salvato in localStorage
- **Scadenza**: 24 ore (configurabile)
- **Endpoints protetti**:
  - `POST /api/contents` - Crea nuovo contenuto
  - `PUT /api/contents/:id` - Modifica contenuto
  - `DELETE /api/contents/:id` - Elimina contenuto
  - `POST /api/login` - Accedi
  - `POST /api/logout` - Esci

## Design e Layout

### Stile
- **Tema**: Blog minimalista e moderno
- **Colori**: Palette neutrale con accenti (definire in Tailwind)
- **Font**: Inter o Poppins (Google Fonts)
- **Responsive**: Mobile-first design

### Componenti UI
- Navbar sticky con logo e menu
- Hero section su Home
- Card-based layout per elenco articoli
- Sidebar con categorie/tags
- Footer con info
- Tema scuro/chiaro (optional)

### Librerie
- **Tailwind CSS**: Styling principale
- **Material-UI (MUI)**: Componenti avanzati (Button, Dialog, TextField, etc.)
- **react-markdown**: Rendering markdown
- **react-router-dom**: Routing

## Navigazione

### Pagine Principali
- **Home** (`/`) - Landing page con ultimi articoli
- **About** (`/about`) - Pagina chi siamo
- **Post** (`/blog/:slug`) - Singolo articolo
- **Admin** (`/admin`) - Dashboard amministrazione
- **404** - Pagina non trovata (catch-all)

### Menu Dinamico
- Caricato da MongoDB (collection: `navigation`)
- Include Home, About e link articoli principali
- Ordinabile tramite campo `order`
- Nascondiblità tramite flag `isVisible`

### Pagine Speciali
Le seguenti pagine sono "speciali" e possono essere gestite diversamente:
- **Home**: Fetch e visualizzazione ultimi 5 articoli
- **About**: Contenuto singolo memorizzato come documento speciale
- **404**: Pagina statica (no fetch da DB)

## API Endpoints

### Public
```
GET  /api/contents              # Lista articoli (con paginazione)
GET  /api/contents/:slug        # Singolo articolo
GET  /api/navigation            # Menu di navigazione
POST /api/login                 # Login admin
```

### Protected (Require JWT)
```
POST   /api/contents            # Crea articolo
PUT    /api/contents/:id        # Modifica articolo
DELETE /api/contents/:id        # Elimina articolo
POST   /api/logout              # Logout
GET    /api/admin/contents      # Admin view articoli
```

## Istruzioni per Claude Code

### Quando lavori al Backend (server/)
1. **Configurazione DB**: Setup connessione MongoDB con variabili .env
2. **Middleware Auth**: Implementare JWT auth per rotte protette
3. **Controllers**: Logica per CRUD contenuti e autenticazione
4. **Error Handling**: Risposte consistenti con status code appropriati
5. **Validation**: Validare input (es. slug unico, campi obbligatori)
6. **CORS**: Configurare CORS per permettere richieste da `http://localhost:5173` (Vite default)

### Quando lavori al Frontend (client/)
1. **TypeScript**: Types forti per tutti i dati da API
2. **React Router**: Setup routes con layout principale
3. **Services**: Centralizzare tutti i fetch API in `/services/`
4. **Markdown Rendering**: Usare `react-markdown` con componenti custom per styling Tailwind
5. **Error Boundaries**: Wrappare componenti per gestire errori
6. **Loading/Error States**: Mostrare spinner/error messages
7. **Context Auth**: AuthContext per gestire login state globale
8. **Env Variables**: Usare `.env` per API_URL (es. `http://localhost:3018`)

### Standard di Codice
- Componenti: Funzionali con Hooks
- Props: Sempre tipizzate con TypeScript
- Naming: PascalCase componenti, camelCase funzioni/variabili
- Files: Una componente per file
- Lazy Loading: Per componenti AdminDashboard e pagine meno comuni
- Styling: Preferire Tailwind, MUI solo per componenti complessi

### Convenzioni di Naming
- Componenti: `PascalCase.tsx` (es. `BlogPost.tsx`)
- Hooks: `use*` prefix (es. `useFetchContent.ts`)
- Services: `camelCase` (es. `contentService.ts`)
- Types: `PascalCase.ts` (es. `Content.ts`)
- Routes: kebab-case (es. `/blog-post`, `/admin-dashboard`)

## Variabili d'Ambiente

### Server (.env)
```
NODE_ENV=development
PORT=3018
MONGODB_PASSWORD=your_password
MONGODB_URL=mongodb+srv://stfnbssl_db_user:{password}@cluster0.y3qtgdm.mongodb.net/?appName=Cluster0
JWT_SECRET=your_jwt_secret_key
CORS_ORIGIN=http://localhost:5173
```

### Client (.env)
```
VITE_API_URL=http://localhost:3018/api
VITE_APP_NAME=HCAIRE Blog
```

## Comandi di Sviluppo

### Root (monorepo)
```bash
npm install                    # Installa dipendenze (server + client)
npm run dev                    # Avvia sia server che client
npm run build                  # Build sia server che client
```

### Server
```bash
cd server
npm run dev                    # Dev mode con nodemon
npm run build                  # Build TypeScript
npm run start                  # Avvia produzione
```

### Client
```bash
cd client
npm run dev                    # Dev server Vite (port 5173)
npm run build                  # Build produzione
npm run preview               # Preview build locale
```

## Note Importanti

- ✅ **Monorepo setup**: Usare workspaces di npm o yarn per gestire dipendenze comuni
- ✅ **CORS**: Configurare correttamente su Express per dev
- ✅ **JWT Storage**: LocalStorage per token (considerare localStorage vs sessionStorage)
- ✅ **API Error Handling**: Gestire errori MongoDB e errori di rete con utenti visible messages
- ✅ **Markdown Safety**: Sanitizzare HTML da markdown se necessario
- ✅ **Admin Login**: Implementare first, poi estendere a sistema più robusto
- ⚠️ **Password Admin**: Attualmente plain "admin" - in produzione usare bcrypt

## Prossimi Passi
1. Inizializzare monorepo con package.json root
2. Setup Server Express + MongoDB connection
3. Setup Client React con Vite
4. Implementare autenticazione admin
5. Creare CRUD endpoints
6. Sviluppare UI blog e admin dashboard