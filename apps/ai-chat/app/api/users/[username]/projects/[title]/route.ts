import { UpdateProjectType } from '@/types'
import { mongoDBClient } from '@/utils/mongodb'
import { BSON, WithId } from 'mongodb'

export async function GET(
    req: Request, 
    { params }: { params: { 
        username: string
        title: string 
    }}
) {
    const client = await mongoDBClient
    const database = client.db('ai-chat')
    const projectsCollection = database.collection('projects')
    
    const project: WithId<BSON.Document> | null = await projectsCollection.findOne({ 
        created_by: params.username,
        title: params.title
    })

    return new Response(JSON.stringify(project))
}

export async function PATCH(
    req: Request, 
    { params }: { params: {
        username: string
        title: string
    }}
) {
    const client = await mongoDBClient
    const database = client.db('ai-chat')
    const projectsCollection = database.collection('projects')

    const request = await req.json()
    
    const updates: UpdateProjectType = {}
    if(request.title) updates.title = request.title
    if(request.description) updates.description = request.description
    if(request.visibility) updates.visibility = request.visibility
    updates.updated_at = new Date().toString()

    const inserted = await projectsCollection.updateOne({
        created_by: params.username,
        title: params.title
    }, {
        $set: updates
    })
    return new Response(JSON.stringify(inserted.upsertedId))
}
