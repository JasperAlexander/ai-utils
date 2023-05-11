import { mongoDBClient } from '@/utils/mongodb'
import { InsertOneResult } from 'mongodb'

export async function GET() {
    const client = await mongoDBClient
    const database = client.db('ai-chat')
    const projectsCollection = database.collection('projects')
    
    const projects = await projectsCollection.find().toArray()

    return new Response(JSON.stringify(projects))
}

export async function POST(req: Request) {
    const client = await mongoDBClient
    const database = client.db('ai-chat')
    const projectsCollection = database.collection('projects')

    const request = await req.json()
    
    const inserted: InsertOneResult<Document> = await projectsCollection.insertOne({
        name: request.name,
        description: request.description,
        visibility: request.visibility,
        created_by: request.created_by,
        updated_at: new Date(),
        created_at: new Date()
    })
    
    return new Response(JSON.stringify(inserted.insertedId))
}
