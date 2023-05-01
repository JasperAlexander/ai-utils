# text-to-chunks

A utility to split text into multiple chunks.

## Installation

Go to the root of your project directory and run the following command.

```sh
pnpm add text-to-chunks
```

## Usage

```tsx
import { textToChunks } from 'text-to-chunks'

export default function Input() {
  const [text, setText] = useState('')
  const [chunks, setChunks] = useState<string[]>([])

  function generateChunks() {
    const newChunks = textToChunks({text: text})
    setChunks(newChunks)
  }

  return (
    <div>
      <input type='text' value={text} onChange={(e) => setText(e.target.value)} />
      <button type='button' onClick={() => generateChunks()}>Generate</button>
      {chunks}
    </div>
  )
}

```

## Contributing

If you're interested in contributing, please read the [contributing docs](../../CONTRIBUTING.md) before submitting a pull request.

## License

This package is licensed under the MIT License. See [LICENSE](../../LICENSE.md) for more information.
