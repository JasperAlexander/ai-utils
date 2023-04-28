import { getMongoDBClient } from '@/utils/mongodb'
import { InsertOneResult } from 'mongodb'

export async function GET() {
    const client = await getMongoDBClient()
    const database = client.db('ai-chat')
    const chatsCollection = database.collection('chats')
    
    const chats = await chatsCollection.find().toArray()

    const res = JSON.stringify(chats)
    return new Response(res)
}

export async function POST(req: Request) {
    const client = await getMongoDBClient()
    const database = client.db('ai-chat')
    const chatsCollection = database.collection('chats')

    const request = await req.json()
    
    const inserted: InsertOneResult<Document> = await chatsCollection.insertOne({
        folder_id: request.folder_id,
        title: 'New chat',
        updated_at: new Date(),
        created_at: new Date()
    })
    
    return new Response(JSON.stringify(inserted.insertedId))
}
