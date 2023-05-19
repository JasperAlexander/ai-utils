import { mongoDBClient } from '@/utils/mongodb'
import { BSON, WithId } from 'mongodb'

export async function GET(
    req: Request, 
    { params }: { params: { id: string }}
) {
    const client = await mongoDBClient

    const database = client.db('ai-chat')
    const messagesCollection = database.collection('messages')
    const messages: WithId<BSON.Document>[] = await messagesCollection.find({ 
        item_id: params.id
    }).toArray()

    return new Response(JSON.stringify(messages))
}