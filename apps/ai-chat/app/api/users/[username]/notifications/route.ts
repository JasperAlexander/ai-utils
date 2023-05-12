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
    
    // If reference_type is project
    const notificationsCollection = database.collection('notifications')
    const notifications = await notificationsCollection.aggregate([
        { 
            $match: { 
                user_id: user!._id
            } 
        },
        {
            $lookup: {
                from: "projects",
                localField: "reference_id",
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
                as: "project_created_by"
            }
        },
        { $unwind: "$project_created_by" },
        {
            $lookup: {
                from: "users",
                localField: "created_by",
                foreignField: "_id",
                as: "notification_created_by"
            }
        },
        { $unwind: "$notification_created_by" },
        {
            $addFields: {
                "project._id": "$_id",
                "project.project_created_by": "$project_created_by.username",
                "project.project_name": "$project.name",
                "project.type": "$type",
                "project.read": "$read",
                "project.created_by": "$notification_created_by.username",
                "project.updated_at": "$updated_at"
            }
        },
        { $replaceRoot: { newRoot: "$project" } },
        { $project: { 
            _id: 1, 
            project_created_by: 1,
            project_name: 1,
            type: 1,
            read: 1,
            created_by: 1,
            updated_at: 1
        } }
    ]).sort({ updated_at: -1 }).toArray()

    return new Response(JSON.stringify(notifications))
}