import { UpdateNotificationType } from '@/types'
import { mongoDBClient } from '@/utils/mongodb'

export async function PATCH(
    req: Request, 
    { params }: { params: { 
        id: string
    }}
) {
    const client = await mongoDBClient
    const database = client.db('ai-chat')
    const notificationsCollection = database.collection('notifications')

    const request = await req.json()
    
    const updates: UpdateNotificationType = {}
    if(typeof request.reference_type !== 'undefined') updates.reference_type = request.reference_type
    if(typeof request.reference_id !== 'undefined') updates.reference_id = request.reference_id
    if(typeof request.type !== 'undefined') updates.type = request.type
    if(typeof request.read !== 'undefined') updates.read = request.read
    updates.updated_at = new Date()

    const upserted = await notificationsCollection.updateOne({
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
    const notificationsCollection = database.collection('notifications')
    
    const deleted = await notificationsCollection.deleteOne({
        // @ts-ignore
        _id: params.id
    })
    return new Response(JSON.stringify(deleted.deletedCount))
}
