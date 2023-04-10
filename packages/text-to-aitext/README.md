# text-to-aitext

A utility to convert text to AI-generated text. Currently only supports OpenAI completions and chat completions. The utility is made to be used on a Node.js server for security reasons.

## Installation

Go to the root of your project directory and run the following command.

```sh
pnpm add text-to-aitext
```

## Usage

Use text-to-aitext in a Node.js server. In Next.js 13, you can make a route handler with the following code.

```tsx
import { NextResponse } from 'next/server'
import { textToAIText } from 'text-to-aitext'

export const config = {
  runtime: 'edge',
}

export async function POST(req: Request) {
  const body = await req.json()

  const completion = await textToAIText({
    apiKey: process.env.OPENAI_API_KEY,
    user: body.user,
    prompt: body.prompt,
    stream: true
  })

  return new Response(completion)
}
```

## Contributing

If you're interested in contributing, please read the [contributing docs](../../CONTRIBUTING.md) before submitting a pull request.

## License

This package is licensed under the MIT License. See [LICENSE](../../LICENSE.md) for more information.
