import { mongoDBClient } from '@/utils/mongodb'

export async function GET(
    req: Request,
    { params }: { params: { 
        username: string 
    }}
) {
    const client = await mongoDBClient
    const database = client.db('ai-chat')
    const foldersCollection = database.collection('folders')

    const folders = await foldersCollection.find({
        created_by: params.username
    }).toArray()

    return new Response(JSON.stringify(folders))
}