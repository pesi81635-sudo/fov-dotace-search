import { NextRequest, NextResponse } from 'next/server'
import { ProgramSearch } from '@/lib/search'
import { Program } from '@/lib/types'
import programs from '@/data/programs.json'

const programData = programs as Program[]
const searchEngine = new ProgramSearch(programData)

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q') || ''
    const typ = searchParams.get('typ') || 'vsechny'

    if (!query || query.length < 2) {
      return NextResponse.json({ results: [] })
    }

    const results = searchEngine.search(query, typ)

    return NextResponse.json({ results })
  } catch (error) {
    console.error('Chyba při vyhledávání:', error)
    return NextResponse.json(
      { error: 'Chyba při vyhledávání' },
      { status: 500 }
    )
  }
}
