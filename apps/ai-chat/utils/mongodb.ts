import { MongoClient } from 'mongodb'
import { v4 as uuidv4 } from 'uuid'

let mongodbClient: MongoClient

async function getMongoDBClient() {
    if(!mongodbClient) {
        // if (!process.env.MONGODB_URI) throw new Error('Missing environment variable MONGODB_URI')
        mongodbClient = new MongoClient(process.env.MONGODB_URI!, {
            pkFactory: { createPk: () => uuidv4() }
        })
        await mongodbClient.connect()
    }
    return mongodbClient
}

export { getMongoDBClient }