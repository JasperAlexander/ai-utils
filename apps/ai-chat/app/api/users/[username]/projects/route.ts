import { mongoDBClient } from '@/utils/mongodb'

export async function GET(
    req: Request,
    { params }: { params: { 
        username: string 
    }}
) {
    const client = await mongoDBClient
    const database = client.db('ai-chat')
    const projectsCollection = database.collection('projects')

    const projects = await projectsCollection.find({
        created_by: params.username
    }).toArray()

    return new Response(JSON.stringify(projects))
}