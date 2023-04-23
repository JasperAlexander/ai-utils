import { fileToText } from 'file-to-text'

/**
 * Extracts the text out of files and puts it a format following 
 * OpenAI best practises on seperating instruction and context
 * @param files The text, DOCX, JSON or PDF files to be extracted
 * @returns The formatted plain text of the files
 */
export async function filesToText(files: File[]) {
    if (files.length === 0) return ''

    const fileTextPromises = files.map(async (file) => {
      const fileText = await fileToText(file)
      return ` file ${file.name}: """${fileText}"""`
    })
    const allFileTexts = await Promise.all(fileTextPromises)

    return allFileTexts.join('\n\n')
}