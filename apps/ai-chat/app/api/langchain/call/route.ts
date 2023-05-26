import weaviate from 'weaviate-ts-client'
import { WeaviateClient } from 'weaviate-ts-client'
import { ConversationalRetrievalQAChain } from 'langchain/chains'
import { WeaviateStore } from 'langchain/vectorstores/weaviate'
import { OpenAIEmbeddings } from 'langchain/embeddings/openai'
import { ChatOpenAI } from 'langchain/chat_models/openai'

// Edge runtime doesn't work, gives an error in similaritySearch (XMLHttpRequest is not defined)
// export const runtime = 'edge'

// const questionGeneratorTemplate = `Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question.

// Chat History:
// {chat_history}
// Follow Up Input: {question}
// Standalone question:`

// System message example: `Be a well-behaved and well-mannered individual that is eager to provide vivid and thoughtful answers.`
// const qaTemplate = `Use the following pieces of context to answer the question at the end. If you don't know the answer, just say that you don't know, don't try to make up an answer.

// {context}

// Question: {question}
// Helpful Answer:`

export async function POST(req: Request) {
    const request = await req.json()

    if(!request.question) return new Response('No question provided', { status: 400 })
    if(!request.folderId) return new Response('No folderId provided', { status: 400 })

    const encoder = new TextEncoder()
    const stream = new TransformStream()
    const writer = stream.writable.getWriter()

    const model = new ChatOpenAI({ 
        streaming: true,
        modelName: 'gpt-3.5-turbo',
    })

    const client: WeaviateClient = (weaviate as any).client({
        scheme: process.env.WEAVIATE_SCHEME || 'http',
        host: process.env.WEAVIATE_HOST || 'localhost:8080'
    })

    const vectorStore = await WeaviateStore.fromExistingIndex(
        new OpenAIEmbeddings({}), 
        { 
            client,
            indexName: 'Documents',
            metadataKeys: ['folderId']
        },
    )

    const chain = ConversationalRetrievalQAChain.fromLLM(
        model,
        vectorStore.asRetriever(undefined, {
            where: {
                path: ['folderId'],
                operator: 'Equal',
                valueString: request.folderId
            }
        }),
        // {
        //     returnSourceDocuments: true,
        //     questionGeneratorTemplate,
        //     qaTemplate
        // }
    )

    let stuffDocumentsChainStarted = false
    let sourceDocuments: [] = []

    chain.call({ 
        question: request.question, 
        chat_history: request.history || []
    }, [{
        handleChainStart(chain, inputs) {
            if(chain.name === 'stuff_documents_chain') {
                stuffDocumentsChainStarted = true
                sourceDocuments = inputs.input_documents
            }
        },
        async handleLLMNewToken(token) {
            if(stuffDocumentsChainStarted) {
                await writer.ready
                await writer.write(encoder.encode(`${token}`))
            }
        },
        async handleLLMEnd() {
            if(stuffDocumentsChainStarted) {
                await writer.ready
                // await writer.write(encoder.encode(`${JSON.stringify(sourceDocuments)}`))
                await writer.close()
            }
        },
        async handleLLMError(e) {
            await writer.ready
            await writer.abort(e)
        }
    }])
    
    return new Response(stream.readable, {
        status: 200,
        headers: {
            'Content-Type': 'text/event-stream'
        }
    })
}
