import { fileToText } from '../src'
import * as fs from 'fs'

// Mocked path2d-polyfill, because this function is giving strange errors
jest.mock('path2d-polyfill', () => ({
    polyfillPath2D: jest.fn(),
}))

function pathToFile(path: string, mimeType: string) {
    const fileContent = fs.readFileSync(path)
    const fileArrayBuffer = new Uint8Array(fileContent).buffer
    const file = new File([fileArrayBuffer], path, { type: mimeType })

    // Add functions to file to simulate the File API of a browser env
    if(mimeType.startsWith('text') || mimeType === 'application/json') {
        file.text = function(): Promise<string> { return new Promise((resolve) => resolve(fileContent.toString()))}
    } else if(mimeType === 'application/pdf' || mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        file.arrayBuffer = function(): Promise<ArrayBuffer> { return new Promise((resolve) => resolve(fileArrayBuffer))}
    }

    return file
}

describe('fileToText()', () => {
    it('should extract plain text out of a text file', async() => {
        const plainTextFile = pathToFile('tests/files/test.txt', 'text/plain')
        const fileText = await fileToText(plainTextFile)
        expect(fileText).toContain('Lorem ipsum')
    })

    it('should extract plain text out of a JSON file', async() => {
        const jsonFile = pathToFile('tests/files/test.json', 'application/json')
        const fileText = await fileToText(jsonFile)
        expect(fileText).toContain('Lorem ipsum')
    })

    it('should extract plain text out of a PDF file', async() => {
        const pdfFile = pathToFile('tests/files/test.pdf', 'application/pdf')
        const fileText = await fileToText(pdfFile)
        expect(fileText).toContain('Lorem ipsum')
    })

    it('should extract plain text out of a Word file', async() => {
        const wordFile = pathToFile('tests/files/test.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
        const fileText = await fileToText(wordFile)
        expect(fileText).toContain('Lorem ipsum')
    })
})
