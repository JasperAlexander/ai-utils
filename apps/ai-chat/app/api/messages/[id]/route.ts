import { getMongoDBClient } from '@/utils/mongodb'
import { BSON, WithId } from 'mongodb'

// id param should be chat_id
export async function GET(req: Request, { params }: { params: { id: string }}) {
    const client = await getMongoDBClient()

    const database = client.db('ai-chat')
    const messagesCollection = database.collection('messages')
    const messages: WithId<BSON.Document>[] = await messagesCollection.find({ 
        chat_id: params.id 
    }).toArray()

    const res = JSON.stringify(messages)
    return new Response(res)
}

// id param should be message id
export async function PATCH(
    req: Request, 
    { params }: { params: { 
        id: string
    }}
) {
    const client = await getMongoDBClient()
    const database = client.db('ai-chat')
    const messagesCollection = database.collection('messages')
    
    const request = await req.json()
    if(request.content) {
        const inserted = await messagesCollection.updateOne({
            // @ts-ignore
            _id: params.id
        }, {
            $set: { content: request.content, updated_at: new Date() }
        })
        return new Response(JSON.stringify(inserted.upsertedId))
    }
}
