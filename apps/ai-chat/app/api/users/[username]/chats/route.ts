import { mongoDBClient } from '@/utils/mongodb'

export async function GET(
    req: Request,
    { params }: { params: { 
        username: string 
    }}
) {
    const client = await mongoDBClient
    const database = client.db('ai-chat')
    const chatsCollection = database.collection('chats')

    const chats = await chatsCollection.find({
        created_by: params.username
    }).toArray()

    return new Response(JSON.stringify(chats))
}