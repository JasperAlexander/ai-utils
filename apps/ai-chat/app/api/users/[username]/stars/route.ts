import { mongoDBClient } from '@/utils/mongodb'

export async function GET(
    req: Request,
    { params }: { params: { 
        username: string
    }}
) {
    const client = await mongoDBClient
    const database = client.db('ai-chat')

    const userCollection = database.collection('users')
    const user = await userCollection.findOne({
        username: params.username
    })
    
    const starsCollection = database.collection('stars')
    const usersOfStars = await starsCollection.aggregate([
        { 
            $match: { 
                created_by: user!._id
            } 
        },
        {
            $lookup: {
                from: "projects",
                localField: "project_id",
                foreignField: "_id",
                as: "project"
            }
        },
        { $unwind: "$project" },
        {
            $lookup: {
                from: "users",
                localField: "project.created_by",
                foreignField: "username",
                as: "project_creator"
            }
        },
        { $unwind: "$project_creator" },
        {
            $lookup: {
                from: "users",
                localField: "created_by",
                foreignField: "_id",
                as: "creator"
            }
        },
        { $unwind: "$creator" },
        {
            $addFields: {
                "project._id": "$project._id",
                "project.name": "$project.name",
                "project.description": "$project.description",
                "project.created_by": "$creator.username",
                "project.created_at": "$created_at"
            }
        },
        { $replaceRoot: { newRoot: "$project" } },
        { $project: { 
            _id: 1, 
            name: 1,
            description: 1,
            created_by: 1, 
            created_at: 1
        } }
    ]).sort({ updated_at: -1 }).toArray()

    return new Response(JSON.stringify(usersOfStars))
}