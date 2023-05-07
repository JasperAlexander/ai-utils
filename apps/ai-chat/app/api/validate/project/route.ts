import { mongoDBClient } from '@/utils/mongodb'

export async function POST(
    req: Request
) {
    const client = await mongoDBClient
    const database = client.db('ai-chat')
    const projectsCollection = database.collection('projects')

    const request = await req.json()
    
    const projects = await projectsCollection.find({ 
        created_by: request.username,
        title: request.title
    }).toArray()

    if(projects.length > 0) {
        return new Response('The project title already exists on this user.', {
            status: 422
        })
    } else {
        return new Response('Project title is available')
    }
}