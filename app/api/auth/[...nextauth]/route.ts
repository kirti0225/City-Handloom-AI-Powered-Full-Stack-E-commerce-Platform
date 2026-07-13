import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import connectDB from '@/lib/mongodb'
import User from '@/lib/models/User'
import jwt from 'jsonwebtoken'

// Extend NextAuth types to recognize custom fields like 'id' and 'role'
declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null
      email?: string | null
      image?: string | null
      id?: string
      role?: string
    }
  }
}

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId:     process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        try {
          await connectDB()
          // Check if user exists
          let dbUser = await (User as any).findOne({ email: user.email })
          if (!dbUser) {
            // Create new user from Google
            dbUser = await (User as any).create({
              name:     user.name,
              email:    user.email,
              password: 'google-oauth-' + Math.random().toString(36),
              role:     'customer',
              avatar:   user.image,
            })
          }
          return true
        } catch {
          return false
        }
      }
      return true
    },

    async jwt({ token, user, account }) {
      // Fetch user data from DB only during the initial sign-in
      if (account?.provider === 'google' && user) {
        await connectDB()
        const dbUser = await (User as any).findOne({ email: user.email })
        if (dbUser) {
          token.id   = dbUser._id.toString()
          token.role = dbUser.role
        }
      }
      return token
    },

    async session({ session, token }) {
      if (token) {
        session.user.id   = token.id as string
        session.user.role = token.role as string
      }
      return session
    },

    async redirect({ url, baseUrl }) {
      return baseUrl + '/account'
    },
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
})

export { handler as GET, handler as POST }