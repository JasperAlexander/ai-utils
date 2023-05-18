/**
 * Converts text to vector embeddings, currently only supports OpenAI
 * @param apiUrl The url of the embeddings API, defaults to https://api.openai.com/v1/embeddings
 * @param apiKey The key of the API
 * @param user A unique identifier representing the user
 * @param model The model to use, defaults to text-embedding-ada-002
 * @param text The text to convert
 * @returns The AI-generated text or ReadableStream
 */
export declare function textToEmbeddings({ apiUrl, apiKey, user, model, text }: {
    apiUrl?: string;
    apiKey?: string;
    user?: string;
    model?: string;
    text: string;
}): Promise<any>;
