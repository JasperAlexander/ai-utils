import { UpdateUserType } from '@/types'
import { mongoDBClient } from '@/utils/mongodb'
import { BSON, WithId } from 'mongodb'

export async function GET(
    req: Request, 
    { params }: { params: { 
        username: string 
    }}
) {
    const client = await mongoDBClient
    const database = client.db('ai-chat')
    const usersCollection = database.collection('users')
    
    const user: WithId<BSON.Document> | null = await usersCollection.findOne({ 
        username: params.username
    })

    return new Response(JSON.stringify(user))
}

export async function PATCH(
    req: Request, 
    { params }: { params: { 
        username: string
    }}
) {
    const client = await mongoDBClient
    const database = client.db('ai-chat')
    const usersCollection = database.collection('users')

    const request = await req.json()
    
    const updates: UpdateUserType = {}
    if(request.email) updates.email = request.email
    if(request.name) updates.name = request.name
    if(request.username) updates.username = request.username
    if(request.bio) updates.bio = request.bio
    if(request.image) updates.image = request.image
    updates.updated_at = new Date().toString()

    const inserted = await usersCollection.updateOne({
        username: params.username
    }, {
        $set: updates
    })
    return new Response(JSON.stringify(inserted.upsertedId))
}
