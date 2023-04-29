import { mongoDBClient } from '@/utils/mongodb'
import { InsertOneResult } from 'mongodb'

export async function GET() {
    const client = await mongoDBClient
    const database = client.db('ai-chat')
    const chatsCollection = database.collection('chats')

    const chats = await chatsCollection.find().toArray()

    return new Response(JSON.stringify(chats))
}

export async function POST(req: Request) {
    const client = await mongoDBClient
    const database = client.db('ai-chat')
    const chatsCollection = database.collection('chats')

    const request = await req.json()
    
    const inserted: InsertOneResult<Document> = await chatsCollection.insertOne({
        title: 'New chat',
        folder_id: request.folder_id,
        created_by: request.created_by,
        updated_at: new Date(),
        created_at: new Date()
    })
    
    return new Response(JSON.stringify(inserted.insertedId))
}
