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
    if(request.content) updates.content = request.content
    if(request.children) updates.children = request.children
    updates.updated_at = new Date().toString()

    const inserted = await messagesCollection.updateOne({
        // @ts-ignore
        _id: params.id
    }, {
        $set: updates
    })
    return new Response(JSON.stringify(inserted.upsertedId))
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
