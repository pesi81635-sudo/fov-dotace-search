#!/usr/bin/env ts-node

import { extractAllPDFs } from '../lib/pdf-extractor'
import { Program } from '../lib/types'
import fs from 'fs/promises'
import path from 'path'

async function main() {
  console.log('🔍 Začínám extrakci textu z PDF souborů...\n')

  const pdfsDir = path.join(process.cwd(), 'public', 'pdfs')
  const programsFile = path.join(process.cwd(), 'data', 'programs.json')

  // Načtení programů
  const programsData = await fs.readFile(programsFile, 'utf-8')
  const programs: Program[] = JSON.parse(programsData)

  // Extrakce textu z PDF
  const extractedTexts = await extractAllPDFs(pdfsDir)

  if (extractedTexts.size === 0) {
    console.log('⚠️  Nebyly nalezeny žádné PDF soubory v public/pdfs/')
    console.log('   Přidejte PDF soubory a spusťte skript znovu.')
    return
  }

  // Aktualizace programů
  let updatedCount = 0
  for (const program of programs) {
    for (const priloha of program.prilohy) {
      const extractedText = extractedTexts.get(priloha.soubor)
      if (extractedText) {
        priloha.textContent = extractedText
        updatedCount++
        console.log(`✅ ${priloha.soubor} → ${priloha.nazev}`)
      } else {
        console.log(`⚠️  ${priloha.soubor} - soubor nenalezen`)
      }
    }
  }

  // Uložení aktualizovaných programů
  await fs.writeFile(
    programsFile,
    JSON.stringify(programs, null, 2),
    'utf-8'
  )

  console.log(`\n✨ Hotovo! Aktualizováno ${updatedCount} příloh.`)
  console.log(`📝 Soubor ${programsFile} byl aktualizován.`)
}

main().catch((error) => {
  console.error('❌ Chyba:', error)
  process.exit(1)
})
