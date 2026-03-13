# 📚 Promptbiblioteket

```
██████╗ ██████╗  ██████╗ ███╗   ███╗██████╗ ████████╗
██╔══██╗██╔══██╗██╔═══██╗████╗ ████║██╔══██╗╚══██╔══╝
██████╔╝██████╔╝██║   ██║██╔████╔██║██████╔╝   ██║
██╔═══╝ ██╔══██╗██║   ██║██║╚██╔╝██║██╔═══╝    ██║
██║     ██║  ██║╚██████╔╝██║ ╚═╝ ██║██║        ██║
╚═╝     ╚═╝  ╚═╝ ╚═════╝ ╚═╝     ╚═╝╚═╝        ╚═╝

██████╗ ██╗██████╗ ██╗     ██╗ ██████╗ ████████╗███████╗██╗  ██╗███████╗████████╗
██╔══██╗██║██╔══██╗██║     ██║██╔═══██╗╚══██╔══╝██╔════╝██║ ██╔╝██╔════╝╚══██╔══╝
██████╔╝██║██████╔╝██║     ██║██║   ██║   ██║   █████╗  █████╔╝ █████╗     ██║
██╔══██╗██║██╔══██╗██║     ██║██║   ██║   ██║   ██╔══╝  ██╔═██╗ ██╔══╝    ██║
██████╔╝██║██████╔╝███████╗██║╚██████╔╝   ██║   ███████╗██║  ██╗███████╗   ██║
╚═════╝ ╚═╝╚═════╝ ╚══════╝╚═╝ ╚═════╝   ╚═╝   ╚══════╝╚═╝  ╚═╝╚══════╝  ╚═╝
```

> Et dansk promptbibliotek til dig, der bruger AI til daglig – og gerne vil holde styr på de gode prompts.

---

## Hvad er det?

**Promptbiblioteket** er en lokal-first webapp, der lader dig samle, organisere og genbruge dine bedste AI-prompts. Alt gemmes i din browser – ingen konto, ingen server, ingen abonnement.

Kommer med 1.230 færdige danske prompts inden for kategorier som Arbejde, Skrivning, Kodning, Analyse, Kreativitet og Læring. Og du kan selvfølgelig tilføje dine egne.

---

## Features

| Feature | Beskrivelse |
|---|---|
| 📖 1.230 standardprompts | Kuraterede, danske prompts klar til brug |
| 🔍 Søgning | Substring-søgning på titel, tekst, tags og kategori |
| 🏷️ Klikbare tags | Klik et tag → filtrer med det samme |
| ⭐ Favoritter | Stjern dine yndlingsprompts, filtrer dem frem |
| ✏️ Rediger | Tilpas enhver prompt direkte i appen |
| 🔗 Deep-linking | Del en prompt via URL: `#/prompt/jobs-to-be-done` |
| 🤖 Åbn i AI | Send prompten direkte til ChatGPT, Claude eller Mistral |
| 🗃️ Local-first | Alt lever i `localStorage` – dine data, din browser |
| 🧹 Ryd & gendan | Tøm biblioteket og hent standardprompts tilbage med ét klik |

---

## Kom i gang

```bash
# Klon projektet
git clone https://github.com/boetter/promptbiblioteket.git
cd promptbiblioteket

# Installer afhængigheder
npm install

# Start dev-server
npm run dev
```

Åbn `http://localhost:5173` og du er i gang.

---

## Byg til produktion

```bash
npm run build
# Output havner i /dist – klar til statisk hosting
```

Fungerer med Netlify, Vercel, GitHub Pages og ethvert andet statisk host.

---

## Teknisk stack

```
React 19  ·  TypeScript  ·  Vite  ·  Tailwind CSS
```

- **State**: React hooks + `localStorage` (ingen backend)
- **Søgning**: Simpel substring-matching (hurtig, præcis, ingen fuzzy-nonsens)
- **Data**: 1.230 prompts i `src/data/defaultPrompts.ts`
- **URL-routing**: Hash-baseret deep-linking (`#/prompt/slug`)

---

## Projektstruktur

```
src/
├── components/
│   ├── PromptCard.tsx       # Kortet i grid-visningen
│   ├── PromptModal.tsx      # Fuld prompt-visning + edit
│   ├── AddPromptModal.tsx   # Tilføj ny prompt
│   ├── SearchBar.tsx        # Søgefelt
│   ├── TagFilter.tsx        # Kategori- og favoritfiltre
│   ├── EmptyState.tsx       # Tom-bibliotek-visning
│   └── Toast.tsx            # Notifikationer
├── data/
│   └── defaultPrompts.ts    # De 1.230 standardprompts
├── hooks/
│   ├── usePrompts.ts        # CRUD + localStorage-sync
│   └── useSearch.ts         # Søge- og filterlogik
├── lib/
│   ├── categorize.ts        # Auto-kategorisering af nye prompts
│   ├── openIn.ts            # Åbn i ChatGPT / Claude / Mistral
│   ├── slug.ts              # Titel → URL-slug (æøå-safe)
│   └── storage.ts           # localStorage-wrappers
└── types/
    └── prompt.ts            # TypeScript-interfaces og kategorier
```

---

## Tilføj dine egne prompts

Klik **"Tilføj prompt"** i headeren. Appen foreslår automatisk kategori og tags baseret på teksten.

Vil du bidrage med prompts til standardsamlingen? Åbn en PR og tilføj til `src/data/defaultPrompts.ts`.

---

## Licens

MIT – brug det som du vil.
