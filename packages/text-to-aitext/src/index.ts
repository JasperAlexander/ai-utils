import {
  createParser,
  ParsedEvent,
  ReconnectInterval,
} from 'eventsource-parser'

/**
 * Converts text to AI-generated text, currently only supports OpenAI
 * @param apiUrl The url of the completion API, defaults to https://api.openai.com/v1/completions
 * @param apiKey The key of the API
 * @param user A unique identifier representing the user
 * @param model The model to use, defaults to gpt-3.5-turbo if apiUrl includes chat, otherwise text-davinci-003
 * @param prompt The text or messages to convert
 * @param maxTokens The maximum number of tokens to generate, defaults to 128
 * @param stream Whether to stream back partial progress, defaults to false
 * @returns The AI-generated text or ReadableStream
 */
export async function textToAItext({
  apiUrl = 'https://api.openai.com/v1/completions',
  apiKey,
  user,
  model = apiUrl.includes('chat') ? 'gpt-3.5-turbo' : 'text-davinci-003',
  prompt,
  maxTokens = 128,
  stream = false,
}: {
  apiUrl?: string
  apiKey?: string
  user?: string
  model?: string
  prompt: string
  maxTokens?: number
  stream?: boolean
}) {
  if(apiUrl.includes('api.openai.com')) {
    const requestHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey ?? ''}`,
    }

    let response: Response
    if(apiUrl.includes('chat')) {
      response = await fetch(apiUrl, {
        headers: requestHeaders,
        method: 'POST',
        body: JSON.stringify({
          user,
          model,
          messages: prompt,
          max_tokens: maxTokens,
          stream
        })
      })
    } else {
      response = await fetch(apiUrl, {
        headers: requestHeaders,
        method: 'POST',
        body: JSON.stringify({
          user,
          model,
          prompt,
          max_tokens: maxTokens,
          stream
        })
      })
    }

    if(stream) {
      let counter = 0
      const encoder = new TextEncoder()
      const decoder = new TextDecoder()

      const resStream = new ReadableStream({
        async start(controller) {
          function onParse(event: ParsedEvent | ReconnectInterval) {
            if (event.type === 'event') {
              const data = event.data
              if (data === '[DONE]') {
                controller.close()
                return
              }
              try {
                const json = JSON.parse(data)
                let text = ''
                if(apiUrl.includes('chat')) {
                  text = json.choices[0].delta?.content || ''
                } else {
                  text = json.choices[0].text || ''
                }
                if (counter < 2 && (text.match(/\n/) || []).length) return
                const queue = encoder.encode(text)
                controller.enqueue(queue)
                counter++
              } catch (e) {
                controller.error(e)
              }
            }
          }
    
          const parser = createParser(onParse)
      
          for await (const chunk of response.body as any) {
            parser.feed(decoder.decode(chunk))
          }
        }
      })
      return resStream
    } else {
      const body = await response.json()

      if(!body.choices || body.choices.length === 0) return
      return body.choices[0].text
    }
  }
}