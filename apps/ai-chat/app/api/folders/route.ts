import { getMongoDBClient } from '@/utils/mongodb'
import { InsertOneResult } from 'mongodb'

export async function GET() {
    const client = await getMongoDBClient()
    const database = client.db('ai-chat')
    const foldersCollection = database.collection('folders')
    
    const folders = await foldersCollection.find().toArray()
    if(!folders) return

    const res = JSON.stringify(folders)
    return new Response(res)
}

export async function POST() {
    const client = await getMongoDBClient()
    const database = client.db('ai-chat')
    const foldersCollection = database.collection('folders')
    
    const inserted: InsertOneResult<Document> = await foldersCollection.insertOne({
        title: 'New folder',
        updated_at: new Date(),
        created_at: new Date()
    })
    
    return new Response(JSON.stringify(inserted.insertedId))
}
