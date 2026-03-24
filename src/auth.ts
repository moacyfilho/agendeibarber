import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        // Num app real, usaríamos bcrypt para checar passwordHash
        // Para este MVP/PROTÓTIPO, vamos permitir login com email de barbeiro ou owner cadastrado
        const user = await prisma.user.findFirst({
          where: { 
            email: credentials?.email as string,
            role: { in: ["OWNER", "BARBER"] }
          },
          include: { tenant: true }
        })

        if (!user) return null

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          tenantId: user.tenantId,
          tenantSlug: user.tenant.slug
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role
        token.tenantId = (user as any).tenantId
        token.tenantSlug = (user as any).tenantSlug
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).tenantId = token.tenantId;
        (session.user as any).tenantSlug = token.tenantSlug;
      }
      return session
    },
  },
  pages: {
    signIn: "/auth/login",
  },
})
