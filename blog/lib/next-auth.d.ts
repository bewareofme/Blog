import { DefaultSession, DefaultUser } from "next-auth"
import { DefaultJWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session extends DefaultSession {
    user?: {
      id: string
      role?: string
      googleAccessToken?: string
      githubUsername?: string
    } & DefaultSession["user"]
  }

  interface Profile {
    login?: string;
  }
    interface User {
      id: string;
      googleAccessToken?: string;
      githubUsername?: string;
    }

  interface User extends DefaultUser {
    role?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string
    role?: string
    provider?: string
    googleAccessToken?: string
    googleProfile?: any
    githubAccessToken?: string
    githubUsername?: string
  }
}

interface User {
  googleAccessToken?: string; // Also add to User if needed
}