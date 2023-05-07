import { mongoDBClient } from '@/utils/mongodb'
import { InsertOneResult } from 'mongodb'

export async function GET() {
    const client = await mongoDBClient
    const database = client.db('ai-chat')
    const usersCollection = database.collection('users')
    
    const users = await usersCollection.find().toArray()

    return new Response(JSON.stringify(users))
}

// Building fails if you remove this POST handler because route becomes static, not sure why
export async function POST(req: Request) {
    const client = await mongoDBClient
    const database = client.db('ai-chat')
    const usersCollection = database.collection('users')

    const request = await req.json()
    
    const inserted: InsertOneResult<Document> = await usersCollection.insertOne({
        email: request.email,
        name: request.name,
        username: request.username,
        bio: request.bio,
        image: request.image,
        updated_at: new Date(),
        created_at: new Date()
    })
    
    return new Response(JSON.stringify(inserted.insertedId))
}
