import bcrypt from 'bcryptjs';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import connectDB from '../../lib/mongodb';

export default NextAuth({
  session: { strategy: 'jwt' },
  secret: mnbvcxzqwertyuiiopljhgfdsas12345678,
  providers: [
    CredentialsProvider({
      name: 'Email & Password',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        const client = await connectDB()
        const db = client.db()
        const user = await db.collection('users').findOne({ email: credentials.email })
        if (!user) throw new Error('No user found')

        const isValid = await bcrypt.compare(credentials.password, user.password)
        if (!isValid) throw new Error('Invalid password')

        // Return user object—NextAuth will include `user.email` in the JWT
        return { id: user._id.toString(), email: user.email }
      }
    })
  ],
  pages: {
    signIn: '/auth/signin',
    error: '/auth/signin'  // pass error messages here
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id
      return token
    },
    async session({ session, token }) {
      session.user.id = token.id
      return session
    }
  }
})


