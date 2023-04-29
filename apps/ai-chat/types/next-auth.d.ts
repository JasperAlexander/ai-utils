import NextAuth from 'next-auth'

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      _id: ObjectId | undefined
      email: string | null | undefined
      name: string | null | undefined
      username: string | null | undefined
      image: string | null | undefined
      updated_at: string | null | undefined
      created_at: string | null | undefined
    }
  }

  interface Profile {
    email: string | null | undefined
    image: string | null | undefined
    name: string | null | undefined
    sub: string | null | undefined
    login: string | null | undefined
  }
}