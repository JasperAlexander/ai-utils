import 'pdfjs-dist/build/pdf.worker.entry';
/**
 * Extracts the text out of a file
 * @param file The text, DOCX, JSON or PDF file to be extracted
 * @returns The plain text of file
 */
export declare function fileToText(file: File): Promise<string | undefined>;
