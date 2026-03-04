import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: 'Survey Login',
      credentials: {
        name: { label: '你的名字', type: 'text', placeholder: '輸入名字' },
        email: { label: 'Email', type: 'email', placeholder: '你的 email' },
        code: { label: '驗證碼', type: 'text', placeholder: '輸入驗證碼' },
      },
      async authorize(credentials) {
        const code = process.env.SURVEY_CODE || '2026'
        if (credentials?.code !== code) return null
        if (!credentials?.name || !credentials?.email) return null

        return {
          id: String(credentials.email),
          name: String(credentials.name),
          email: String(credentials.email),
        }
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
})
