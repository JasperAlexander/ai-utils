# file-to-text

A utility to extract text out of a file. Currently supports the following file types as input and plain text as output.

- TXT
- CSV
- HTML
- CSS
- JS
- DOCX
- JSON
- PDF

## Installation

Go to the root of your project directory and run the following command.

```sh
pnpm add file-to-text
```

## Usage

```tsx
import { fileToText } from 'file-to-text'

export default function Input() {
  const [text, setText] = useState('')

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    if (!event.target.files || event.target.files.length === 0) return

    const file = event.target.files[0]
    const fileText = await fileToText(file)

    if (fileText) setText(fileText)
  }

  return (
    <div>
      <input type='file' accept='text/*, application/pdf' onChange={handleFileChange} />
      {text}
    </div>
  )
}

```

## Contributing

If you're interested in contributing, please read the [contributing docs](https://github.com/JasperAlexander/ai-utils/blob/main/CONTRIBUTING.md) before submitting a pull request.

## License

This package is licensed under the MIT License. See [LICENSE](LICENSE.md) for more information.
