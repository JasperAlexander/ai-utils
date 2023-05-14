import { mongoDBClient } from '@/utils/mongodb'
import { InsertOneResult } from 'mongodb'

export async function GET() {
    const client = await mongoDBClient
    const database = client.db('ai-chat')
    const starsCollection = database.collection('stars')
    
    const stars = await starsCollection.find().toArray()

    return new Response(JSON.stringify(stars))
}

export async function POST(req: Request) {
    const client = await mongoDBClient
    const database = client.db('ai-chat')
    const starsCollection = database.collection('stars')

    const request = await req.json()
    
    const inserted: InsertOneResult<Document> = await starsCollection.insertOne({
        project_id: request.project_id,
        created_by: request.created_by,
        created_at: new Date()
    })
    
    return new Response(JSON.stringify(inserted.insertedId))
}
