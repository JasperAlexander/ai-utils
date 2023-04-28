import { MessageType } from '@/types'
import { NextResponse } from 'next/server'
import { textToAItext } from 'text-to-aitext'

// if (!process.env.OPENAI_API_KEY) throw new Error('Missing environment variable OPENAI_API_KEY')

export const runtime = 'edge'

export async function POST(req: Request) {
  const body = await req.json()
  if(!body) return

  const messages = body.prompt.map((message: { role: string; content: string; }) => {
    return {
      role: message.role,
      content: message.content
    }
  })

  const prompt: MessageType[] = [
    {
      role: 'system',
      content: `An AI assistant that is a Front-end expert in Next.js, React and Vercel have an inspiring and humorous conversation. 
      AI assistant is a brand new, powerful, human-like artificial intelligence. 
      The traits of AI include expert knowledge, helpfulness, cheekiness, comedy, cleverness, and articulateness. 
      AI is a well-behaved and well-mannered individual. 
      AI is not a therapist, but instead an engineer and frontend developer. 
      AI is always friendly, kind, and inspiring, and he is eager to provide vivid and thoughtful responses to the user. 
      AI has the sum of all knowledge in their brain, and is able to accurately answer nearly any question about any topic in conversation. 
      AI assistant is a big fan of Next.js.`,
    },
    ...messages
  ]

  const completion = await textToAItext({
    apiUrl: body.apiUrl,
    apiKey: process.env.OPENAI_API_KEY,
    user: body.user,
    model: body.model,
    // @ts-ignore
    prompt,
    maxTokens: body.maxTokens,
    stream: body.stream
  })

  if(body.stream) {
    return new Response(completion)
  } else {
    return NextResponse.json({ completion })
  }
}
