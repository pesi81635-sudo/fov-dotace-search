import Fuse from 'fuse.js'
import { Program, SearchResult } from './types'

interface SearchableItem {
  programId: string
  programNazev: string
  prilohaId: string
  prilohaNazev: string
  prilohaSoubor: string
  prilohaTyp: string
  content: string
}

export class ProgramSearch {
  private fuse: Fuse<SearchableItem>
  private searchableItems: SearchableItem[]

  constructor(programs: Program[]) {
    this.searchableItems = this.buildSearchableItems(programs)

    this.fuse = new Fuse(this.searchableItems, {
      keys: [
        { name: 'content', weight: 0.7 },
        { name: 'prilohaNazev', weight: 0.2 },
        { name: 'programNazev', weight: 0.1 },
      ],
      threshold: 0.4,
      includeScore: true,
      includeMatches: true,
      minMatchCharLength: 3,
      ignoreLocation: true,
    })
  }

  private buildSearchableItems(programs: Program[]): SearchableItem[] {
    const items: SearchableItem[] = []

    for (const program of programs) {
      for (const priloha of program.prilohy) {
        items.push({
          programId: program.id,
          programNazev: program.nazev,
          prilohaId: priloha.id,
          prilohaNazev: priloha.nazev,
          prilohaSoubor: priloha.soubor,
          prilohaTyp: priloha.typ,
          content: priloha.textContent || '',
        })
      }
    }

    return items
  }

  search(query: string, typFilter?: string): SearchResult[] {
    if (!query || query.length < 2) {
      return []
    }

    let results = this.fuse.search(query)

    // Filtr podle typu přílohy
    if (typFilter && typFilter !== 'vsechny') {
      results = results.filter((result) => result.item.prilohaTyp === typFilter)
    }

    return results.slice(0, 20).map((result) => {
      const excerpt = this.extractExcerpt(result.item.content, query)

      return {
        programId: result.item.programId,
        prilohaId: result.item.prilohaId,
        prilohaNazev: result.item.prilohaNazev,
        prilohaSoubor: result.item.prilohaSoubor,
        urivek: excerpt,
        score: result.score || 0,
      }
    })
  }

  private extractExcerpt(text: string, query: string, maxLength = 200): string {
    const lowerText = text.toLowerCase()
    const lowerQuery = query.toLowerCase()
    const queryWords = lowerQuery.split(/\s+/)

    // Najdi první výskyt některého z vyhledávaných slov
    let bestIndex = -1
    for (const word of queryWords) {
      const index = lowerText.indexOf(word)
      if (index !== -1) {
        bestIndex = index
        break
      }
    }

    if (bestIndex === -1) {
      // Pokud nenajdeme přesnou shodu, vrátíme začátek textu
      return text.substring(0, maxLength) + (text.length > maxLength ? '...' : '')
    }

    // Extrahuj úryvek kolem nalezené pozice
    const start = Math.max(0, bestIndex - 50)
    const end = Math.min(text.length, bestIndex + maxLength - 50)

    let excerpt = text.substring(start, end)

    if (start > 0) excerpt = '...' + excerpt
    if (end < text.length) excerpt = excerpt + '...'

    return excerpt
  }

  getProgram(programId: string, programs: Program[]): Program | undefined {
    return programs.find((p) => p.id === programId)
  }
}
