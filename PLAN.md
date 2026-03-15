# Ombygningsplan: Promptbiblioteket

## Overblik

Appen går fra "alle prompts pre-loaded" til "start med tom samling, tilføj fra katalog eller lav dine egne". Brugerdata gemmes i Turso med email magic link auth.

## Arkitektur

```
Browser (React SPA)
  ↕ fetch()
Netlify Functions (serverless API)
  ↕ @libsql/client
Turso Database
  ↕
Resend (email magic links)
```

## Database-schema (Turso)

```sql
-- Brugere
CREATE TABLE users (
  id TEXT PRIMARY KEY,          -- UUID
  email TEXT UNIQUE NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Magic link tokens
CREATE TABLE auth_tokens (
  token TEXT PRIMARY KEY,       -- UUID
  email TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  used INTEGER DEFAULT 0
);

-- Sessioner
CREATE TABLE sessions (
  id TEXT PRIMARY KEY,          -- UUID
  user_id TEXT NOT NULL REFERENCES users(id),
  expires_at TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Brugerens gemte prompts
CREATE TABLE user_prompts (
  id TEXT PRIMARY KEY,          -- UUID
  user_id TEXT NOT NULL REFERENCES users(id),
  title TEXT NOT NULL,
  text TEXT NOT NULL,
  tags TEXT DEFAULT '[]',       -- JSON array
  category TEXT DEFAULT 'Andet',
  is_favorite INTEGER DEFAULT 0,
  source_id TEXT,               -- NULL = custom, ellers default prompt title
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX idx_user_prompts_user ON user_prompts(user_id);
```

## API-endpoints (Netlify Functions)

```
POST /api/auth/send-link     – Send magic link email
GET  /api/auth/verify?token= – Verificér token, opret session
GET  /api/auth/me            – Hent nuværende bruger (via session cookie)
POST /api/auth/logout        – Slet session

GET    /api/prompts          – Hent brugerens prompts
POST   /api/prompts          – Tilføj prompt (custom eller fra katalog)
PUT    /api/prompts/:id      – Opdatér prompt
DELETE /api/prompts/:id      – Slet prompt
PATCH  /api/prompts/:id/favorite – Toggle favorit
```

## Auth-flow (Magic Link)

1. Bruger indtaster email
2. API genererer token, gemmer i `auth_tokens`, sender email via Resend
3. Email indeholder link: `https://site.com/auth/verify?token=xxx`
4. Bruger klikker → API verificerer token, opretter/finder user, opretter session
5. Session-ID gemmes i httpOnly cookie (30 dage)
6. Alle API-kald checker session cookie

## UI-ændringer

### Nye views/states:
1. **Landing/Login** – Email-input til magic link
2. **Tom samling** – "Velkommen! Tilføj din første prompt" med to CTAs:
   - "Skriv din egen" → AddPromptModal
   - "Udforsk kataloget" → Katalog-view
3. **Min samling** – Brugerens tilføjede prompts (nuværende grid-view)
4. **Katalog-browser** – Gennemse standard-samlingen med "Tilføj til min samling" knap
5. **Profil/logout** – Simpel bruger-menu

### Katalog-browser:
- Viser alle 1000+ default prompts som read-only
- Samme søg/filtrer som nu
- Hver prompt har en "+" knap til at tilføje til sin samling
- Prompts der allerede er tilføjet viser "✓ Tilføjet"

### Navigation:
- Tab-baseret: "Min samling" | "Katalog"
- Katalog-tab har badge med antal tilgængelige prompts

## Implementeringsrækkefølge

### Fase 1: Backend-fundament
1. Installer dependencies: `@libsql/client`, `resend`, `uuid`
2. Opret `netlify/functions/` mappe med API-endpoints
3. Opret database-tabeller i Turso
4. Implementér auth flow (send-link, verify, me, logout)

### Fase 2: Frontend auth
5. Opret AuthContext med login/logout/session-state
6. Opret LoginPage komponent
7. Tilføj session-check ved app-start

### Fase 3: API-integration
8. Opret `src/lib/api.ts` med fetch-wrappers for alle endpoints
9. Omskriv `usePrompts` hook til at bruge API i stedet for localStorage

### Fase 4: UI-ombygning
10. Ombyg App.tsx med tab-navigation (Min samling / Katalog)
11. Opret CatalogBrowser komponent (browse + tilføj)
12. Opdatér EmptyState med nye CTAs
13. Tilføj bruger-menu (email + logout)

### Fase 5: Oprydning
14. Fjern localStorage-afhængigheder
15. Test fuld flow: login → browse katalog → tilføj → rediger → slet → logout
16. Opdatér netlify.toml med functions-config

## Nye dependencies

```
@libsql/client    – Turso database client
resend            – Email sending for magic links
```

## Environment variables (Netlify)

```
TURSO_DATABASE_URL=libsql://xxx.turso.io
TURSO_AUTH_TOKEN=xxx
RESEND_API_KEY=re_xxx
SITE_URL=https://promptbiblioteket.dk (eller hvad domænet er)
```

## Email-service

Bruger **Resend** (resend.com) – gratis tier: 100 emails/dag, 3000/måned.
Simple API, god developer experience. Alternativ: kan bruge Netlify Email integration.
