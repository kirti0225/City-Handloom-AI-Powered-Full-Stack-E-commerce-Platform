import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import connectDB from '@/lib/mongodb'
import User from '@/lib/models/User'

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
      // Allows users to sign in via Google even if they registered with a password first
      allowDangerousEmailAccountLinking: true, 
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        try {
          const targetEmail = user.email?.toLowerCase();
          if (!targetEmail) return '/login?error=NoEmailReturned'; 

          await connectDB()
          let dbUser = await (User as any).findOne({ email: targetEmail })
          
          if (!dbUser) {
            // Create new user from Google info if they don't exist yet
            dbUser = await (User as any).create({
              name:     user.name,
              email:    targetEmail,
              password: 'google-oauth-' + Math.random().toString(36).slice(2),
              role:     'customer', // Default role
              avatar:   user.image,
            })
          }
          return true
        } catch (err: any) {
          console.error("❌ CRITICAL NEXTAUTH DATABASE ERROR:", err)
          return `/login?error=${encodeURIComponent(err.message || 'DatabaseError')}`
        }
      }
      return true
    },

    async jwt({ token, user, account }) {
      if (account?.provider === 'google' && user) {
        try {
          await connectDB()
          const dbUser = await (User as any).findOne({ email: user.email?.toLowerCase() })
          if (dbUser) {
            token.id   = dbUser._id.toString()
            token.role = dbUser.role
          }
        } catch (err) {
          console.error("❌ JWT Callback Database Error:", err)
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
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // Allows callback URLs on the same origin domain
      else if (new URL(url).origin === baseUrl) return url
      
      // Directly send the user to the account page layout upon success
      return baseUrl + '/account'
    },
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
})

export { handler as GET, handler as POST }