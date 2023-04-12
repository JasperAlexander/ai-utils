/**
 * Extracts the file names out of a string in which file names come after file: and before ; or the end of the string
 * @param content The content with file names
 * @returns An array with the file names
 */
export function extractFileNames(content: string) {
  const regex = /file ([^:]+): """[^"]*"""/g
  const matches = content.match(regex)
  const extractedFileNames = []

  if (!matches) return []

  for (const match of matches) {
    const fileName = match.replace(/file ([^:]+): """[^"]*"""/, '$1')
    extractedFileNames.push(fileName)
  }

  return extractedFileNames
}