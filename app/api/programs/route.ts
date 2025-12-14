import { NextResponse } from 'next/server'
import { Program } from '@/lib/types'
import programs from '@/data/programs.json'

export async function GET() {
  try {
    const programData = programs as Program[]
    return NextResponse.json({ programs: programData })
  } catch (error) {
    console.error('Chyba při načítání programů:', error)
    return NextResponse.json(
      { error: 'Chyba při načítání programů' },
      { status: 500 }
    )
  }
}
