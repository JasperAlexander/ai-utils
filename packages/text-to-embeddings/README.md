# text-to-embeddings

A utility to convert text to vector embeddings. Currently only supports OpenAI embeddings. The utility is made to be used on a Node.js server for security reasons.

## Installation

Go to the root of your project directory and run the following command.

```sh
pnpm add text-to-embeddings
```

## Usage

Use text-to-embeddings in a Node.js server. In Next.js 13, you can make a route handler with the following code.

```tsx
import { textToEmbeddings } from 'text-to-embeddings'

export const runtime = 'edge'

export async function POST(req: Request) {
  const body = await req.json()

  const embeddings = await textToEmbeddings({
    apiKey: process.env.OPENAI_API_KEY,
    user: body.user,
    text: body.text
  })

  return new Response(embeddings)
}
```

## Contributing

If you're interested in contributing, please read the [contributing docs](../../CONTRIBUTING.md) before submitting a pull request.

## License

This package is licensed under the MIT License. See [LICENSE](../../LICENSE.md) for more information.
