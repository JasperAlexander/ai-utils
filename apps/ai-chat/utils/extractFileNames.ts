/**
 * Extracts the file names out of a string in which file names come after file: and before ; or the end of the string
 * @param content The content with file names
 * @returns An array with the file names
 */
export function extractFileNames(content: string) {
    const parts = content.split('file: ')
    const extractedFiles = []
  
    if (parts.length === 1) return []
  
    for (let i = 1; i < parts.length; i++) {
      const endOfFilename = parts[i].indexOf(';')
      const filename = endOfFilename === -1 ? parts[i] : parts[i].substring(0, endOfFilename).trim()
      extractedFiles.push(filename)
    }
  
    return extractedFiles
}