import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Download, FileText } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Program } from '@/lib/types'
import programs from '@/data/programs.json'

interface ProgramDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function ProgramDetailPage({ params }: ProgramDetailPageProps) {
  const { id } = await params
  const programData = programs as Program[]
  const program = programData.find((p) => p.id === id)

  if (!program) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Link
          href="/"
          className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-slate-900 mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Zpět na vyhledávání
        </Link>

        <header className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            {program.nazev}
          </h1>
          <p className="text-lg text-slate-600">{program.popis}</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Termíny</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-slate-600">Od</p>
                  <p className="font-semibold">
                    {new Date(program.terminy.od).toLocaleDateString('cs-CZ')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Do</p>
                  <p className="font-semibold">
                    {new Date(program.terminy.do).toLocaleDateString('cs-CZ')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Výše dotace</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-slate-600">Minimálně</p>
                  <p className="font-semibold">
                    {program.castka.min.toLocaleString('cs-CZ')} Kč
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Maximálně</p>
                  <p className="font-semibold">
                    {program.castka.max.toLocaleString('cs-CZ')} Kč
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Dokumenty</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{program.prilohy.length}</p>
              <p className="text-sm text-slate-600">příloh k dispozici</p>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Podporované oblasti</CardTitle>
            <CardDescription>
              Oblasti, které lze financovat z tohoto programu
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {program.oblasti.map((oblast) => (
                <Badge key={oblast} variant="secondary" className="text-sm">
                  {oblast}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dokumenty programu</CardTitle>
            <CardDescription>
              Všechny dokumenty a přílohy k programu {program.nazev}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {program.prilohy.map((priloha) => (
                <div
                  key={priloha.id}
                  className="flex items-start justify-between p-4 border border-slate-200 rounded-lg hover:border-slate-300 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <FileText className="h-5 w-5 text-slate-500 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-slate-900">
                        {priloha.nazev}
                      </h3>
                      <p className="text-sm text-slate-600 mt-1">
                        {priloha.soubor}
                      </p>
                      <Badge variant="outline" className="mt-2">
                        {priloha.typ}
                      </Badge>
                    </div>
                  </div>
                  <a
                    href={`/pdfs/${priloha.soubor}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity text-sm font-medium"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Stáhnout
                  </a>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
