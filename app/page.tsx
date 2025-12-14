"use client"

import { useState, useEffect } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SearchResult, Program } from "@/lib/types"

export default function Home() {
  const [query, setQuery] = useState("")
  const [typFilter, setTypFilter] = useState("vsechny")
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [program, setProgram] = useState<Program | null>(null)

  useEffect(() => {
    async function loadProgram() {
      try {
        const response = await fetch('/api/programs')
        const data = await response.json()
        if (data.programs && data.programs.length > 0) {
          setProgram(data.programs[0])
        }
      } catch (error) {
        console.error('Chyba při načítání programu:', error)
      }
    }
    loadProgram()
  }, [])

  useEffect(() => {
    if (!query || query.length < 2) {
      setResults([])
      return
    }

    const timeoutId = setTimeout(async () => {
      setLoading(true)
      try {
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(query)}&typ=${typFilter}`
        )
        const data = await response.json()
        setResults(data.results || [])
      } catch (error) {
        console.error('Chyba při vyhledávání:', error)
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [query, typFilter])

  const typOptions = [
    { value: "vsechny", label: "Všechny" },
    { value: "program", label: "Program" },
    { value: "smlouva", label: "Smlouva" },
    { value: "vyhlaseni", label: "Vyhlášení" },
    { value: "zmeny", label: "Změny" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Vyhledávání v programu FOV
          </h1>
          <p className="text-slate-600">
            Fond obnovy venkova Středočeského kraje
          </p>
        </header>

        {program && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>{program.nazev}</CardTitle>
              <CardDescription>{program.popis}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h3 className="font-semibold text-sm text-slate-700 mb-1">
                    Termíny
                  </h3>
                  <p className="text-sm text-slate-600">
                    {new Date(program.terminy.od).toLocaleDateString('cs-CZ')} -{' '}
                    {new Date(program.terminy.do).toLocaleDateString('cs-CZ')}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-slate-700 mb-1">
                    Výše dotace
                  </h3>
                  <p className="text-sm text-slate-600">
                    {program.castka.min.toLocaleString('cs-CZ')} Kč -{' '}
                    {program.castka.max.toLocaleString('cs-CZ')} Kč
                  </p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-sm text-slate-700 mb-2">
                  Podporované oblasti
                </h3>
                <div className="flex flex-wrap gap-2">
                  {program.oblasti.map((oblast) => (
                    <Badge key={oblast} variant="secondary">
                      {oblast}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="mb-6">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Vyhledejte v dokumentech programu FOV..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 h-12 text-base"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            {typOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setTypFilter(option.value)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  typFilter === option.value
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {loading && (
          <div className="text-center py-8">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
            <p className="mt-2 text-slate-600">Vyhledávám...</p>
          </div>
        )}

        {!loading && results.length > 0 && (
          <div className="space-y-4">
            <p className="text-sm text-slate-600">
              Nalezeno {results.length} výsledků
            </p>
            {results.map((result, index) => (
              <Card key={`${result.prilohaId}-${index}`} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{result.prilohaNazev}</CardTitle>
                  <CardDescription>
                    {result.prilohaSoubor}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-700 mb-3 leading-relaxed">
                    {result.urivek}
                  </p>
                  <a
                    href={`/pdfs/${result.prilohaSoubor}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm font-medium text-primary hover:underline"
                  >
                    Otevřít dokument
                    <svg
                      className="ml-1 h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!loading && query.length >= 2 && results.length === 0 && (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-slate-600">
                Nenalezeny žádné výsledky pro "{query}"
              </p>
            </CardContent>
          </Card>
        )}

        {!query && (
          <Card>
            <CardContent className="py-8 text-center">
              <Search className="mx-auto h-12 w-12 text-slate-300 mb-3" />
              <p className="text-slate-600">
                Začněte psát pro vyhledávání v dokumentech programu FOV
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
