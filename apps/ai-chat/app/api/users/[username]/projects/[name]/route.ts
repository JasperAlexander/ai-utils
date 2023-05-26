import { UpdateProjectType } from '@/types'
import { mongoDBClient } from '@/utils/mongodb'
import { BSON, WithId } from 'mongodb'

export async function GET(
    req: Request, 
    { params }: { params: { 
        username: string
        name: string 
    }}
) {
    const client = await mongoDBClient
    const database = client.db('ai-chat')
    const projectsCollection = database.collection('projects')
    
    const project: WithId<BSON.Document> | null = await projectsCollection.findOne({ 
        created_by: params.username,
        name: params.name
    })

    return new Response(JSON.stringify(project))
}

export async function PATCH(
    req: Request, 
    { params }: { params: {
        username: string
        name: string
    }}
) {
    const client = await mongoDBClient
    const database = client.db('ai-chat')
    const projectsCollection = database.collection('projects')

    const request = await req.json()
    
    const updates: UpdateProjectType = {}
    if(typeof request.name !== 'undefined') updates.name = request.name
    if(typeof request.description !== 'undefined') updates.description = request.description
    if(typeof request.visibility !== 'undefined') updates.visibility = request.visibility
    updates.updated_at = new Date()

    const upserted = await projectsCollection.updateOne({
        created_by: params.username,
        name: params.name
    }, {
        $set: updates
    })
    return new Response(JSON.stringify(upserted.upsertedId))
}
