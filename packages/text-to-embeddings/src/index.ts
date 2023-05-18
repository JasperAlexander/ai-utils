/**
 * Converts text to vector embeddings, currently only supports OpenAI
 * @param apiUrl The url of the embeddings API, defaults to https://api.openai.com/v1/embeddings
 * @param apiKey The key of the API
 * @param user A unique identifier representing the user
 * @param model The model to use, defaults to text-embedding-ada-002
 * @param text The text to convert
 * @returns The AI-generated text or ReadableStream
 */
export async function textToEmbeddings({
  apiUrl = 'https://api.openai.com/v1/embeddings',
  apiKey,
  user,
  model = 'text-embedding-ada-002',
  text
}: {
  apiUrl?: string
  apiKey?: string
  user?: string
  model?: string
  text: string
}) {
  if(apiUrl.includes('api.openai.com')) {
    const requestHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey ?? ''}`,
    }

    let response: Response
    response = await fetch(apiUrl, {
      headers: requestHeaders,
      method: 'POST',
      body: JSON.stringify({
        user,
        model,
        input: text,
      })
    })

    const body = await response.json()

    if(!body.data || body.data.length === 0) return
    return body.data[0].embedding
  }
}