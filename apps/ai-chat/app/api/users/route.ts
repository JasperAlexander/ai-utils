import { mongoDBClient } from '@/utils/mongodb'

export async function GET() {
    const client = await mongoDBClient
    const database = client.db('ai-chat')
    const usersCollection = database.collection('users')
    
    const users = await usersCollection.find().toArray()

    return new Response(JSON.stringify(users))
}