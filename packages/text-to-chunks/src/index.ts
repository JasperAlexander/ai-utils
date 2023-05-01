/**
 * Splits a string into multiple chunks
 * @param text The text to be split
 * @param chunkSize The maximum size of each chunk, defaults to 1.000
 * @param chunkOverlap The overlap between chunks, defaults to 200
 * @returns The chunks
 */
export function textToChunks({
  text,
  chunkSize = 1000,
  chunkOverlap = 200
} : {
  text: string
  chunkSize?: number
  chunkOverlap?: number
}) {
  const finalChunks: string[] = []
  const separators: string[] = ['\n\n', '\n', ' ', '']

  // Get appropriate separator to use
  let separator: string = separators[separators.length - 1]
  for (const seperator of separators) {
    if (seperator === '') {
      separator = seperator
      break
    }
    if (text.includes(seperator)) {
      separator = seperator
      break
    }
  }

  // Now that we have the separator, split the text
  let splits: string[]
  if (separator) {
    splits = text.split(separator)
  } else {
    splits = text.split('')
  }

  // Now go merging things, recursively splitting longer texts.
  let goodSplits: string[] = []
  for (const split of splits) {
    if (split.length < chunkSize) {
      goodSplits.push(split)
    } else {
      if (goodSplits.length) {
        const mergedText = mergeSplits(goodSplits, separator, chunkSize, chunkOverlap)
        finalChunks.push(...mergedText)
        goodSplits = []
      }
      const otherInfo = textToChunks({text: split})
      finalChunks.push(...otherInfo)
    }
  }
  if (goodSplits.length) {
    const mergedText = mergeSplits(goodSplits, separator, chunkSize, chunkOverlap)
    finalChunks.push(...mergedText)
  }
  return finalChunks
}

function joinChunks(chunks: string[], separator: string): string | null {
  const text = chunks.join(separator).trim()
  return text === '' ? null : text
}

function mergeSplits(
  splits: string[], 
  separator: string, 
  chunkSize: number,
  chunkOverlap: number
): string[] {
  const chunks: string[] = []
  const currentChunk: string[] = []
  let total = 0

  for (const d of splits) {
    const _len = d.length
    if (total + _len >= chunkSize) {
      if (total > chunkSize) {
        console.warn(
          `Created a chunk of size ${total}, +
which is longer than the specified ${chunkSize}`
        )
      }
      if (currentChunk.length > 0) {
        const chunk = joinChunks(currentChunk, separator)
        if (chunk !== null) chunks.push(chunk)

        // Keep on popping if:
        // - we have a larger chunk than in the chunk overlap
        // - or if we still have any chunks and the length is long
        while (
          total > chunkOverlap ||
          (total + _len > chunkSize && total > 0)
        ) {
          total -= currentChunk[0].length
          currentChunk.shift()
        }
      }
    }
    currentChunk.push(d)
    total += _len
  }

  const chunk = joinChunks(currentChunk, separator)
  if (chunk !== null) chunks.push(chunk)

  return chunks
}