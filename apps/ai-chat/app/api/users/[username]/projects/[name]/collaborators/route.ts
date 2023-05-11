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
    
    const collaboratorsCollection = database.collection('collaborators')
    const collaborators = await collaboratorsCollection.aggregate([
        { 
            $match: { 
                project_id: project!._id
            } 
        },
        {
            $lookup: {
                from: "users",
                localField: "user_id",
                foreignField: "_id",
                as: "user"
            }
        },
        { $unwind: "$user" },
        {
            $addFields: {
                "user.role": "$role",
                "user.status": "$status",
                "user.updated_at": "$updated_at"
            }
        },
        { $replaceRoot: { newRoot: "$user" } },
        { $project: { _id: 1, username: 1, role: 1, status: 1, updated_at: 1 } }
    ]).toArray()

    return new Response(JSON.stringify(collaborators))
}