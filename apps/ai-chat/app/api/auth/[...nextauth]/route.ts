import { mongoDBClient } from "@/utils/mongodb"
import NextAuth, { NextAuthOptions } from "next-auth"
import GithubProvider from "next-auth/providers/github"

export const authOptions: NextAuthOptions = {
    providers: [
        GithubProvider({
            clientId: process.env.NEXTAUTH_GITHUB_ID!,
            clientSecret: process.env.NEXTAUTH_GITHUB_SECRET!,
        }),
    ],
    
    pages: {
        signIn: '/login'
    },

    session: {
        strategy: 'jwt'
    },

    callbacks: {
        async signIn({ user, profile }) {
            const client = await mongoDBClient
            await client.connect()
            const db = client.db('ai-chat')
            const usersCollection = db.collection('users')
        
            // Check if user with same username already exists
            // let checkUserUsername = await usersCollection.findOne({
            //     username: profile!.login
            // })

            // let username
            // if(checkUserUsername) {
            //     let newUsername
            //     do {
            //         newUsername = `${profile!.login}${Math.floor(Math.random() * 1000)}`
            //         checkUserUsername = await usersCollection.findOne({ username: newUsername })
            //     } while (checkUserUsername)

            //     username = newUsername
            // }
        
            // Check if user with same email adress already exists
            const checkUserEmail = await usersCollection.findOne({
                email: user.email,
            })

            if (checkUserEmail) {
                return true
            } else {
                await usersCollection.insertOne({
                    email: user.email,
                    name: user.name,
                    username: profile!.login,
                    bio: '',
                    image: user.image !== null ? user.image : 'https://abs.twimg.com/sticky/default_profile_images/default_profile_200x200.png',
                    updated_at: new Date(),
                    created_at: new Date(),
                })
                return true
            }
        },
        
        async session({ session }) { 
            if (!session || !session.user) return session
        
            const client = await mongoDBClient
            const db = client.db('ai-chat')
            const collection = db.collection('users')
        
            const userData = await collection.findOne({
                email: session.user.email,
            })
        
            session.user._id = userData?._id
            session.user.username = userData?.username
            session.user.image = userData?.image
        
            return session
        },
    },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }