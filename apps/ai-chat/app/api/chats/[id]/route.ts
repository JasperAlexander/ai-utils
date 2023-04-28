import { getMongoDBClient } from '@/utils/mongodb'
import { BSON, WithId } from 'mongodb'

export async function GET(
    req: Request, 
    { params }: { params: { 
        id: string 
    }}
) {
    const client = await getMongoDBClient()
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
    const client = await getMongoDBClient()
    const database = client.db('ai-chat')
    const chatsCollection = database.collection('chats')
    
    const request = await req.json()
    if(request.title) {
        const inserted = await chatsCollection.updateOne({
            // @ts-ignore
            _id: params.id
        }, {
            $set: { title: request.title }
        })
        return new Response(JSON.stringify(inserted.upsertedId))
    } else if(request.folder_id) {
        const inserted = await chatsCollection.updateOne({
            // @ts-ignore
            _id: params.id
        }, {
            $set: { folder_id: request.folder_id }
        })
        return new Response(JSON.stringify(inserted.upsertedId))
    } else if(request.messages) {
        const inserted = await chatsCollection.updateOne({
            // @ts-ignore
            _id: params.id
        }, {
            $set: { messages: request.messages, updated_at: new Date() }
        })
        return new Response(JSON.stringify(inserted.upsertedId))
    }
}

export async function DELETE(
    req: Request, 
    { params }: { params: { 
        id: string
    }}
) {
    const client = await getMongoDBClient()
    const database = client.db('ai-chat')
    const chatsCollection = database.collection('chats')
    
    const deleted = await chatsCollection.deleteOne({
        // @ts-ignore
        _id: params.id
    })
    return new Response(JSON.stringify(deleted.deletedCount))
}
