import { mongoDBClient } from '@/utils/mongodb'

export async function GET(
    req: Request,
    { params }: { params: { 
        id: string 
    }}
) {
    const client = await mongoDBClient
    const database = client.db('ai-chat')
    const chatsCollection = database.collection('chats')

    const chats = await chatsCollection.find({
        folder_id: params.id
    }).toArray()

    return new Response(JSON.stringify(chats))
}