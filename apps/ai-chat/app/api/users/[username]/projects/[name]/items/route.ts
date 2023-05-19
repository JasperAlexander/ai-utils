import { mongoDBClient } from '@/utils/mongodb'

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

    const project = await projectsCollection.findOne({ 
        created_by: params.username,
        name: params.name
    })

    if(project) {
        const foldersCollection = database.collection('folders')

        const folders = await foldersCollection.find({ 
            part_of: project._id 
        }).toArray()

        if(folders) {
            const folderIds = folders.map((folder) => folder._id)

            const itemsCollection = database.collection('items')

            const items = await itemsCollection.find({ 
                folder_id: { $in: folderIds } 
            }).toArray()

            return new Response(JSON.stringify(items))
        }
    }
}