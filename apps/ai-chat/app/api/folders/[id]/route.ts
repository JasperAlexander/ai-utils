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
    const foldersCollection = database.collection('folders')
    
    const folder: WithId<BSON.Document> | null = await foldersCollection.findOne({ 
        // @ts-ignore
        _id: params.id
    })

    const res = JSON.stringify(folder)
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
    const foldersCollection = database.collection('folders')
    
    const request = await req.json()
    if(request.title) {
        const inserted = await foldersCollection.updateOne({
            // @ts-ignore
            _id: params.id
        }, {
            $set: { title: request.title, updated_at: new Date() }
        })
        return new Response(JSON.stringify(inserted.upsertedId))
    }
}
