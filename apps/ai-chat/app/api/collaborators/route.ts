import { mongoDBClient } from '@/utils/mongodb'
import { InsertOneResult } from 'mongodb'

export async function POST(req: Request) {
    const client = await mongoDBClient
    const database = client.db('ai-chat')
    const collaboratorsCollection = database.collection('collaborators')

    const request = await req.json()
    
    const insertedCollaborator: InsertOneResult<Document> = await collaboratorsCollection.insertOne({
        project_id: request.project_id,
        user_id: request.user_id,
        role: request.role,
        status: 'pending',
        created_by: request.created_by,
        updated_at: new Date(),
        created_at: new Date()
    })

    const notificationsCollection = database.collection('notifications')
    const insertedNotification: InsertOneResult<Document> = await notificationsCollection.insertOne({
        user_id: request.user_id,
        reference_type: 'project',
        reference_id: request.project_id,
        type: 'collaboration',
        read: false,
        created_by: request.created_by,
        updated_at: new Date(),
        created_at: new Date()
    })
    
    return new Response(JSON.stringify(insertedCollaborator.insertedId))
}
