export interface Priloha {
  id: string
  nazev: string
  typ: "program" | "smlouva" | "vyhlaseni" | "zmeny"
  soubor: string
  textContent?: string
}

export interface Program {
  id: string
  nazev: string
  popis: string
  terminy: {
    od: string
    do: string
  }
  castka: {
    min: number
    max: number
  }
  oblasti: string[]
  prilohy: Priloha[]
}

export interface SearchResult {
  programId: string
  prilohaId: string
  prilohaNazev: string
  prilohaSoubor: string
  urivek: string
  stranka?: number
  score: number
}
