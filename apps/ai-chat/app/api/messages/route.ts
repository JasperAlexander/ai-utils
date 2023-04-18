import { getMongoDBClient } from '@/utils/mongodb'
import { InsertOneResult } from 'mongodb'

export async function POST(req: Request) {
    const client = await getMongoDBClient()    
    const database = client.db('ai-chat')
    const messagesCollection = database.collection('messages')
    
    const request = await req.json()

    const inserted: InsertOneResult<Document> = await messagesCollection.insertOne({
        chat_id: request.chat_id,
        role: request.role,
        content: request.content,
        updated_at: new Date(),
        created_at: new Date()
    })
    
    return new Response(JSON.stringify(inserted.insertedId))
}