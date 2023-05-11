import { mongoDBClient } from '@/utils/mongodb'

export async function POST(req: Request) {
    const client = await mongoDBClient
    const database = client.db('ai-chat')
    const usersCollection = database.collection('users')

    const request = await req.json()
    
    const users = await usersCollection.find({
        $text: {
            $search: request.username
        }
    }).toArray()

    return new Response(JSON.stringify(users))
}