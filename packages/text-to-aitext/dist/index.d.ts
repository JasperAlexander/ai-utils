/**
 * Converts text to AI-generated text, currently only supports OpenAI
 * @param apiUrl The url of the completion API, defaults to https://api.openai.com/v1/completions
 * @param apiKey The key of the API
 * @param user A unique identifier representing the user
 * @param model The model to use, defaults to gpt-3.5-turbo for chat, otherwise text-davinci-003
 * @param prompt The text or messages to convert
 * @param maxTokens The maximum number of tokens to generate, defaults to 128
 * @param stream Whether to stream back partial progress, defaults to false
 * @returns The AI-generated text or ReadableStream
 */
export declare function textToAItext({ apiUrl, apiKey, user, model, prompt, maxTokens, stream, }: {
    apiUrl?: string;
    apiKey?: string;
    user?: string;
    model?: string;
    prompt: string;
    maxTokens?: number;
    stream?: boolean;
}): Promise<any>;
