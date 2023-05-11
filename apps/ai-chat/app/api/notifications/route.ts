import { mongoDBClient } from '@/utils/mongodb'
import { InsertOneResult } from 'mongodb'

export async function POST(req: Request) {
    const client = await mongoDBClient  
    const database = client.db('ai-chat')
    const notificationsCollection = database.collection('notifications')
    
    const request = await req.json()

    const inserted: InsertOneResult<Document> = await notificationsCollection.insertOne({
        user_id: request.user_id,
        reference_type: request.reference_type,
        reference_id: request.reference_id,
        type: request.type,
        read: false,
        created_by: request.created_by,
        updated_at: new Date(),
        created_at: new Date()
    })
    
    return new Response(JSON.stringify(inserted.insertedId))
}
