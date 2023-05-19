import { mongoDBClient } from '@/utils/mongodb'

export async function GET(
    req: Request,
    { params }: { params: { 
        id: string 
    }}
) {
    const client = await mongoDBClient
    const database = client.db('ai-chat')
    const itemsCollection = database.collection('items')

    const items = await itemsCollection.find({
        folder_id: params.id
    }).toArray()

    return new Response(JSON.stringify(items))
}