import { UpdateChatType } from '@/types'
import { mongoDBClient } from '@/utils/mongodb'
import { BSON, WithId } from 'mongodb'

export async function GET(
    req: Request, 
    { params }: { params: { 
        id: string 
    }}
) {
    const client = await mongoDBClient
    const database = client.db('ai-chat')
    const chatsCollection = database.collection('chats')
    
    const chat: WithId<BSON.Document> | null = await chatsCollection.findOne({ 
        // @ts-ignore
        _id: params.id
    })

    const res = JSON.stringify(chat)
    return new Response(res)
}

export async function PATCH(
    req: Request, 
    { params }: { params: { 
        id: string
    }}
) {
    const client = await mongoDBClient
    const database = client.db('ai-chat')
    const chatsCollection = database.collection('chats')
    
    const request = await req.json()
    
    const updates: UpdateChatType = {}
    if(request.title) updates.title = request.title
    if(request.folder_id) updates.folder_id = request.folder_id
    updates.updated_at = new Date().toString()

    const inserted = await chatsCollection.updateOne({
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
    const chatsCollection = database.collection('chats')
    
    const deleted = await chatsCollection.deleteOne({
        // @ts-ignore
        _id: params.id
    })
    return new Response(JSON.stringify(deleted.deletedCount))
}
