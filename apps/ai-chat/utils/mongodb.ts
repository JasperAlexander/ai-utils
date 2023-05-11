import { MongoClient } from 'mongodb'
import { v4 as uuidv4 } from 'uuid'

if (!process.env.MONGODB_URI) throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')

const uri = process.env.MONGODB_URI
const options = {
    pkFactory: { createPk: () => uuidv4() }
}

let client
let mongoDBClient: Promise<MongoClient>

if (process.env.NODE_ENV === 'development') {
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise: Promise<MongoClient>
  }
  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options)
    globalWithMongo._mongoClientPromise = client.connect()

    ;(async function() {
      const client = await globalWithMongo._mongoClientPromise
      const database = client.db('ai-chat')
      const usersCollection = database.collection('users')
      await usersCollection.createIndex({ username: "text" })
    })()
  }
  mongoDBClient = globalWithMongo._mongoClientPromise
} else {
  client = new MongoClient(uri, options)
  mongoDBClient = client.connect()
  
  ;(async function() {
    const client = await mongoDBClient
    const database = client.db('ai-chat')
    const usersCollection = database.collection('users')
    await usersCollection.createIndex({ username: "text" })
  })()
}

export { mongoDBClient }