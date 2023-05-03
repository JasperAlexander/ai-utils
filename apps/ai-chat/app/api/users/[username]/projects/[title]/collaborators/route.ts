import { mongoDBClient } from '@/utils/mongodb'

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

    const project = await projectsCollection.findOne({ 
        created_by: params.username,
        title: params.title
    })

    if(project) {
        const collaboratorsCollection = database.collection('collaborators')

        const collaborators = await collaboratorsCollection.find({
            project_title: project.title
        }).toArray()

        return new Response(JSON.stringify(collaborators))
    }
}