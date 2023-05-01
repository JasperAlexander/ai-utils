/**
 * Splits a string into multiple chunks
 * @param text The text to be split
 * @param chunkSize The maximum size of each chunk, defaults to 1.000
 * @param chunkOverlap The overlap between chunks, defaults to 200
 * @returns The chunks
 */
export declare function textToChunks({ text, chunkSize, chunkOverlap }: {
    text: string;
    chunkSize?: number;
    chunkOverlap?: number;
}): string[];
