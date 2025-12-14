# FOV Dotace Search

Webová aplikace pro vyhledávání v dotačním programu FOV (Fond obnovy venkova) Středočeského kraje.

## Technologie

- **Next.js 15** - React framework s App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - UI komponenty
- **pdf-parse** - Extrakce textu z PDF
- **fuse.js** - Fuzzy full-text search

## Funkce MVP

1. **Vyhledávací box** s live results (debounce 300ms)
2. **Filtr podle typu přílohy**: všechny, program, smlouva, vyhlášení, změny
3. **Výsledky vyhledávání**: úryvek textu + název dokumentu + odkaz na PDF
4. **Info karta**: základní informace o programu (termíny, částky, oblasti)
5. **Detail programu**: kompletní přehled programu a všech příloh
6. **Responzivní design**: moderní, čistý vzhled na všech zařízeních

## Struktura projektu

```
/app
  /page.tsx                    - Homepage s vyhledáváním
  /program/[id]/page.tsx       - Detail programu
  /api/search/route.ts         - API endpoint pro vyhledávání
  /api/programs/route.ts       - API endpoint pro programy
/components
  /ui/                         - shadcn/ui komponenty
/lib
  /pdf-extractor.ts            - Extrakce textu z PDF
  /search.ts                   - Vyhledávací logika (Fuse.js)
  /types.ts                    - TypeScript typy
  /utils.ts                    - Utility funkce
/data
  /programs.json               - Data programů FOV
/public
  /pdfs/                       - PDF soubory (prázdná složka)
```

## Instalace a spuštění

### 1. Instalace závislostí

```bash
npm install
```

### 2. Spuštění dev serveru

```bash
npm run dev
```

Aplikace bude dostupná na `http://localhost:3000`

### 3. Build pro produkci

```bash
npm run build
npm start
```

## Použití

### Základní vyhledávání

1. Otevřete aplikaci v prohlížeči
2. Začněte psát do vyhledávacího pole
3. Výsledky se zobrazí automaticky po 300ms
4. Klikněte na "Otevřít dokument" pro zobrazení PDF

### Filtrace výsledků

Použijte tlačítka nad vyhledávacím polem pro filtraci podle typu dokumentu:
- **Všechny** - všechny typy dokumentů
- **Program** - pouze programové dokumenty
- **Smlouva** - vzorové smlouvy
- **Vyhlášení** - vyhlášení programu
- **Změny** - dodatky a změny programu

### Detail programu

Klikněte na název programu nebo navštivte `/program/fov-2025-2028` pro:
- Kompletní informace o programu
- Seznam všech příloh
- Stažení dokumentů

## Přidání PDF souborů

1. Přidejte PDF soubory do složky `/public/pdfs/`
2. Aktualizujte metadata v `/data/programs.json`
3. Pro extrakci textu z PDF můžete použít `lib/pdf-extractor.ts`:

```typescript
import { extractTextFromPDF } from '@/lib/pdf-extractor'

const result = await extractTextFromPDF('public/pdfs/dokument.pdf')
console.log(result.text)
```

4. Přidejte extrahovaný text do pole `textContent` v `programs.json`

## Datová struktura

### Program

```typescript
{
  id: string                    // Unikátní ID programu
  nazev: string                 // Název programu
  popis: string                 // Popis programu
  terminy: {
    od: string                  // Datum začátku (ISO format)
    do: string                  // Datum konce (ISO format)
  }
  castka: {
    min: number                 // Minimální částka v Kč
    max: number                 // Maximální částka v Kč
  }
  oblasti: string[]             // Podporované oblasti
  prilohy: Priloha[]           // Seznam příloh
}
```

### Příloha

```typescript
{
  id: string                    // Unikátní ID přílohy
  nazev: string                 // Název přílohy
  typ: "program" | "smlouva" | "vyhlaseni" | "zmeny"
  soubor: string                // Název PDF souboru
  textContent?: string          // Extrahovaný text z PDF
}
```

## Vyhledávací algoritmus

Aplikace používá **Fuse.js** pro fuzzy full-text search s těmito parametry:

- **threshold**: 0.4 - citlivost vyhledávání
- **minMatchCharLength**: 3 - minimální délka vyhledávaného textu
- **ignoreLocation**: true - hledá v celém textu
- **Váhy**: content (70%), název přílohy (20%), název programu (10%)

## Další možnosti rozšíření

1. **PDF viewer** - integrace PDF.js pro zobrazení PDF přímo v aplikaci
2. **Export výsledků** - export do CSV/Excel
3. **Historie vyhledávání** - localStorage pro ukládání historie
4. **Zvýraznění textu** - highlight nalezených výrazů v PDF
5. **Pokročilé filtry** - filtr podle částky, termínu, oblasti
6. **Administrace** - rozhraní pro správu programů a nahrávání PDF
7. **OCR** - rozpoznání textu z naskenovaných PDF

## Licence

MIT
