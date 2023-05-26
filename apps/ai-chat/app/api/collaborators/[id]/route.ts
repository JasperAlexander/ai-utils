import { UpdateCollaboratorType } from '@/types'
import { mongoDBClient } from '@/utils/mongodb'

export async function GET(
    req: Request, 
    { params }: { params: { 
        id: string 
    }}
) {
    const client = await mongoDBClient
    const database = client.db('ai-chat')
    const collaboratorsCollection = database.collection('collaborators')
    
    const collaborator = collaboratorsCollection.aggregate([
        { 
            $match: { 
                _id: params.id
            } 
        },
        {
            $lookup: {
                from: "users",
                localField: "user_id",
                foreignField: "_id",
                as: "invitee"
            }
        },
        { $unwind: "$invitee" },
        {
            $lookup: {
                from: "users",
                localField: "user_id",
                foreignField: "_id",
                as: "inviter"
            }
        },
        { $unwind: "$inviter" },
        {
            $addFields: {
                "collaborator._id": "$_id",
                "collaborator.username": "$invitee.username",
                "collaborator.role": "$role",
                "collaborator.status": "$status",
                "collaborator.created_by": "$inviter.username",
                "collaborator.updated_at": "$updated_at"
            }
        },
        { $replaceRoot: { newRoot: "$collaborator" } },
        { $project: { 
            _id: 1, 
            username: 1, 
            role: 1, 
            status: 1, 
            created_by: 1, 
            updated_at: 1 
        } }
    ])

    return new Response(JSON.stringify(collaborator))
}

export async function PATCH(
    req: Request, 
    { params }: { params: { 
        id: string
    }}
) {
    const client = await mongoDBClient
    const database = client.db('ai-chat')

    const collaboratorsCollection = database.collection('collaborators')

    const request = await req.json()
    
    const updates: UpdateCollaboratorType = {}
    if(typeof request.role !== 'undefined') updates.role = request.role
    if(typeof request.status !== 'undefined') updates.status = request.status
    updates.updated_at = new Date()

    const upserted = await collaboratorsCollection.updateOne({
        // @ts-ignore
        _id: params.id
    }, {
        $set: updates
    })
    return new Response(JSON.stringify(upserted.upsertedId))
}

export async function DELETE(
    req: Request, 
    { params }: { params: { 
        id: string
    }}
) {
    const client = await mongoDBClient
    const database = client.db('ai-chat')
    const collaboratorsCollection = database.collection('collaborators')
    
    const deleted = await collaboratorsCollection.deleteOne({
        // @ts-ignore
        _id: params.id
    })
    return new Response(JSON.stringify(deleted.deletedCount))
}
