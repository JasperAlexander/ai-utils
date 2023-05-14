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
    
    const starsCollection = database.collection('stars')
    const projectsOfStars = await starsCollection.aggregate([
        { 
            $match: { 
                project_id: project!._id
            } 
        },
        {
            $lookup: {
                from: "users",
                localField: "created_by",
                foreignField: "_id",
                as: "user"
            }
        },
        { $unwind: "$user" },
        {
            $addFields: {
                "user._id": "$_id",
                "user.username": "$user.username",
                "user.created_at": "$created_at"
            }
        },
        { $replaceRoot: { newRoot: "$user" } },
        { $project: { 
            _id: 1, 
            username: 1, 
            created_at: 1
        } }
    ]).toArray()

    return new Response(JSON.stringify(projectsOfStars))
}