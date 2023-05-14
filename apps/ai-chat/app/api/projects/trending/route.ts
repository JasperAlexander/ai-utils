import { mongoDBClient } from '@/utils/mongodb'
import { InsertOneResult } from 'mongodb'

export async function GET() {
    const client = await mongoDBClient
    const database = client.db('ai-chat')

    const starsCollection = database.collection('stars')
    
    const fromDate = new Date()
    fromDate.setDate(fromDate.getDate() - 7)

    const trendingProjects = await starsCollection.aggregate([
        { 
            $match: { 
                created_at: { $gte: fromDate }
            } 
        },
        {
            $group: {
                _id: '$project_id',
                count: { $sum: 1 }
            }
        },
        {
            $sort: { count: -1 }
        },
        {
            $lookup: {
                from: "projects",
                localField: "_id",
                foreignField: "_id",
                as: "project"
            }
        },
        { $unwind: "$project" },
        {
            $match: {
                'project.visibility': { $ne: 'private' },
            },
        },
        {
            $lookup: {
              from: 'users',
              localField: 'project.created_by',
              foreignField: 'username',
              as: 'user',
            },
        },
        {
            $unwind: '$user',
        },
        {
            $addFields: {
                "project._id": "$project._id",
                "project.name": "$project.name",
                "project.description": "$project.description",
                "project.visibility": "$project.visibility",
                "project.stars": "$stars",
                "project.created_by": "$user.username",
                "project.updated_at": "$project.updated_at",
                "project.created_at": "$project.created_at"
            }
        },
        { $replaceRoot: { newRoot: "$project" } },
        { $project: { 
            _id: 1, 
            name: 1, 
            description: 1, 
            visibility: 1, 
            stars: 1,
            created_by: 1,
            updated_at: 1,
            created_at: 1
        } }
    ]).toArray()

    return new Response(JSON.stringify(trendingProjects))
}

// Building fails if you remove this POST handler because route becomes static, not sure why
export async function POST(req: Request) {
    const client = await mongoDBClient
    const database = client.db('ai-chat')
    const projectsCollection = database.collection('projects')

    const request = await req.json()
    
    const inserted: InsertOneResult<Document> = await projectsCollection.insertOne({
        name: request.name,
        description: request.description,
        visibility: request.visibility,
        created_by: request.created_by,
        updated_at: new Date(),
        created_at: new Date()
    })
    
    return new Response(JSON.stringify(inserted.insertedId))
}