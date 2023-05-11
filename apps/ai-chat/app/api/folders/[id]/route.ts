import { UpdateFolderType } from '@/types'
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
    const foldersCollection = database.collection('folders')
    
    const folder: WithId<BSON.Document> | null = await foldersCollection.findOne({ 
        // @ts-ignore
        _id: params.id
    })

    return new Response(JSON.stringify(folder))
}

export async function PATCH(
    req: Request, 
    { params }: { params: { 
        id: string
    }}
) {
    const client = await mongoDBClient
    const database = client.db('ai-chat')
    const foldersCollection = database.collection('folders')

    const request = await req.json()
    
    const updates: UpdateFolderType = {}
    if(typeof request.title !== 'undefined') updates.title = request.title
    updates.updated_at = new Date().toString()

    const upserted = await foldersCollection.updateOne({
        // @ts-ignore
        _id: params.id
    }, {
        $set: updates
    })
    return new Response(JSON.stringify(upserted.upsertedId))
}
