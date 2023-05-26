import weaviate from 'weaviate-ts-client'
import { mongoDBClient } from '@/utils/mongodb'
import { InsertOneResult } from 'mongodb'
import { WeaviateClient } from 'weaviate-ts-client'
import { WeaviateStore } from 'langchain/vectorstores/weaviate'
import { OpenAIEmbeddings } from 'langchain/embeddings/openai'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import { Document } from 'langchain/document'

export async function GET() {
    const client = await mongoDBClient
    const database = client.db('ai-chat')
    const itemsCollection = database.collection('items')

    const items = await itemsCollection.find().toArray()

    return new Response(JSON.stringify(items))
}

export async function POST(req: Request) {
    const client = await mongoDBClient
    const database = client.db('ai-chat')
    const itemsCollection = database.collection('items')

    const request = await req.json()
    
    const inserted: InsertOneResult<Document> = await itemsCollection.insertOne({
        type: request.type,
        title: request.title,
        folder_id: request.folder_id,
        created_by: request.created_by,
        updated_at: new Date(),
        created_at: new Date()
    })

    if(request.type === 'document') {
        const weaviateClient: WeaviateClient = (weaviate as any).client({
            scheme: process.env.WEAVIATE_SCHEME || 'http',
            host: process.env.WEAVIATE_HOST || 'localhost:8080'
        })

        const textSplitter = new RecursiveCharacterTextSplitter()
        const docs = await textSplitter.createDocuments([request.content])

        const formattedDocs = docs.map((doc) => {
            return new Document({
                pageContent: doc.pageContent,
                metadata: {
                    folderId: request.folder_id,
                    title: request.title
                }
            })
        })

        await WeaviateStore.fromDocuments(
            formattedDocs, 
            new OpenAIEmbeddings(), 
            { 
                client: weaviateClient,
                indexName: 'Documents',
                metadataKeys: ['folderId', 'title']
            }
        )
    }
    
    return new Response(JSON.stringify(inserted.insertedId))
}
