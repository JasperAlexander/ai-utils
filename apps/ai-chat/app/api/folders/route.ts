import { mongoDBClient } from '@/utils/mongodb'
import { InsertOneResult } from 'mongodb'

export async function GET() {
    const client = await mongoDBClient
    const database = client.db('ai-chat')
    const foldersCollection = database.collection('folders')
    
    const folders = await foldersCollection.find().toArray()

    return new Response(JSON.stringify(folders))
}

export async function POST(req: Request) {
    const client = await mongoDBClient
    const database = client.db('ai-chat')
    const foldersCollection = database.collection('folders')

    const request = await req.json()
    
    const inserted: InsertOneResult<Document> = await foldersCollection.insertOne({
        title: 'New folder',
        part_of: request.part_of,
        created_by: request.created_by,
        updated_at: new Date(),
        created_at: new Date()
    })
    
    return new Response(JSON.stringify(inserted.insertedId))
}
