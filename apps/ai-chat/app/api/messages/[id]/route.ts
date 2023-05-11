import { UpdateMessageType } from '@/types'
import { mongoDBClient } from '@/utils/mongodb'

export async function PATCH(
    req: Request, 
    { params }: { params: { 
        id: string
    }}
) {
    const client = await mongoDBClient
    const database = client.db('ai-chat')
    const messagesCollection = database.collection('messages')

    const request = await req.json()
    
    const updates: UpdateMessageType = {}
    if(typeof request.content !== 'undefined') updates.content = request.content
    if(typeof request.children !== 'undefined') updates.children = request.children
    updates.updated_at = new Date().toString()

    const upserted = await messagesCollection.updateOne({
        // @ts-ignore
        _id: params.id
    }, {
        $set: updates
    })
    return new Response(JSON.stringify(upserted.upsertedId))
}

export async function DELETE(
    req: Request, 
    { params }: { params: { 
        id: string
    }}
) {
    const client = await mongoDBClient
    const database = client.db('ai-chat')
    const messagesCollection = database.collection('messages')
    
    const deleted = await messagesCollection.deleteOne({
        // @ts-ignore
        _id: params.id
    })
    return new Response(JSON.stringify(deleted.deletedCount))
}
