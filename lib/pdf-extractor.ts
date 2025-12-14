import fs from 'fs/promises'
import path from 'path'
// @ts-ignore - pdf-parse nemá TypeScript typy
import pdfParse from 'pdf-parse'

export interface PDFExtractionResult {
  text: string
  numPages: number
  info?: Record<string, unknown>
}

export async function extractTextFromPDF(
  pdfPath: string
): Promise<PDFExtractionResult> {
  try {
    const dataBuffer = await fs.readFile(pdfPath)
    const data = await pdfParse(dataBuffer)

    return {
      text: data.text,
      numPages: data.numpages,
      info: data.info,
    }
  } catch (error) {
    console.error(`Chyba při extrakci PDF ${pdfPath}:`, error)
    throw error
  }
}

export async function extractAllPDFs(pdfsDir: string): Promise<Map<string, string>> {
  const extractedTexts = new Map<string, string>()

  try {
    const files = await fs.readdir(pdfsDir)
    const pdfFiles = files.filter((file) => file.toLowerCase().endsWith('.pdf'))

    for (const file of pdfFiles) {
      const filePath = path.join(pdfsDir, file)
      try {
        const result = await extractTextFromPDF(filePath)
        extractedTexts.set(file, result.text)
        console.log(`Extrahováno: ${file} (${result.numPages} stránek)`)
      } catch (error) {
        console.error(`Chyba při zpracování ${file}:`, error)
      }
    }
  } catch (error) {
    console.error('Chyba při čtení adresáře:', error)
  }

  return extractedTexts
}
