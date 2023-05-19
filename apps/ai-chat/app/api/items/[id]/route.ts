import { UpdateItemType } from '@/types'
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
    const itemsCollection = database.collection('items')
    
    const item: WithId<BSON.Document> | null = await itemsCollection.findOne({ 
        // @ts-ignore
        _id: params.id
    })

    const res = JSON.stringify(item)
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
    const itemsCollection = database.collection('items')
    
    const request = await req.json()
    
    const updates: UpdateItemType = {}
    if(typeof request.title !== 'undefined') updates.title = request.title
    if(typeof request.folder_id !== 'undefined') updates.folder_id = request.folder_id
    updates.updated_at = new Date().toString()

    const upserted = await itemsCollection.updateOne({
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
    const itemsCollection = database.collection('items')
    
    const deleted = await itemsCollection.deleteOne({
        // @ts-ignore
        _id: params.id
    })
    return new Response(JSON.stringify(deleted.deletedCount))
}
