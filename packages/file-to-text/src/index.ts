// @ts-ignore
import * as pdfjsLib from 'pdfjs-dist/build/pdf'
import 'pdfjs-dist/build/pdf.worker.entry'
import * as jszip from 'jszip'

/**
 * Extracts the text out of a file
 * @param file The text, DOCX, JSON or PDF file to be extracted
 * @returns The plain text of file
 */
export async function fileToText(file: File) {
  if(file.type.startsWith('text') || file.type === 'application/json') {
    return await file.text()
  } else if(file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    const zip = await jszip.loadAsync(file)
    const document = await zip.file('word/document.xml')?.async('string')
    if(!document) return
    
    const regex = /(<w:p[^>]*>.*?<\/w:p>)/gs
    let match: RegExpExecArray | null
    let plainText = ''

    while((match = regex.exec(document))) {
      // Add a space after the paragraph if it contains a header
      const paragraph = match[1]
      if (paragraph.includes('<w:hdr')) {
        plainText += paragraph + ' '
      } else {
        // Extract the plain text content from the paragraph
        const innerRegex = /<w:t[^>]*>(.*?)<\/w:t>/gs
        let innerMatch: RegExpExecArray | null
        while ((innerMatch = innerRegex.exec(paragraph))) {
          plainText += innerMatch[1]
        }
        plainText += ' '
      }
    }

    // Remove double spaces
    return plainText.replace(/\s{2,}/g, ' ')
  } else if(file.type === 'application/pdf') {
    const arrayBuffer = await file.arrayBuffer()
    const pdf = await pdfjsLib.getDocument(arrayBuffer).promise
    const numPages = pdf.numPages

    let plainText = ''

    for (let pageNo = 1; pageNo <= numPages; pageNo++) {
      const page = await pdf.getPage(pageNo)
      const content = await page.getTextContent()
      
      plainText += content.items.map((item: { str: string }) => item.str + ' ').join('')
    }

    return plainText
  }
}