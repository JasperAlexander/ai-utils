import { NextResponse } from 'next/server'
import { textToAItext } from 'text-to-aitext'

// if (!process.env.OPENAI_API_KEY) throw new Error('Missing environment variable OPENAI_API_KEY')

export const config = {
  runtime: 'edge',
}

export async function POST(req: Request) {
  const body = await req.json()
  if(!body) return

  const completion = await textToAItext({
    apiUrl: body.apiUrl,
    apiKey: process.env.OPENAI_API_KEY,
    user: body.user,
    model: body.model,
    prompt: body.prompt,
    maxTokens: body.maxTokens,
    stream: body.stream
  })

  if(body.stream) {
    return new Response(completion)
  } else {
    return NextResponse.json({ completion })
  }
}
