import { mongoDBClient } from '@/utils/mongodb'
import { InsertOneResult } from 'mongodb'

export async function GET() {
    const client = await mongoDBClient
    const database = client.db('ai-chat')
    const collaboratorsCollection = database.collection('collaborators')
    
    const collaborators = await collaboratorsCollection.find().toArray()

    return new Response(JSON.stringify(collaborators))
}

export async function POST(req: Request) {
    const client = await mongoDBClient
    const database = client.db('ai-chat')
    const collaboratorsCollection = database.collection('collaborators')

    const request = await req.json()
    
    const inserted: InsertOneResult<Document> = await collaboratorsCollection.insertOne({
        project_title: request.project_title,
        user_id: request.user_id,
        role: request.role,
        created_by: request.created_by,
        updated_at: new Date(),
        created_at: new Date()
    })
    
    return new Response(JSON.stringify(inserted.insertedId))
}
