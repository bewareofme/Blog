import { MongoDBAdapter } from "@next-auth/mongodb-adapter"
import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"
import clientPromise from "@/lib/mongodb"
import {connectDB} from '@/lib/mongodb'
import CredentialsProvider from 'next-auth/providers/credentials';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import NextAuth from "next-auth"

export const authOptions: NextAuthOptions = {
    adapter: MongoDBAdapter(clientPromise),
    providers: [
      CredentialsProvider({
        id: 'credentials',
        name: 'Credentials',
        credentials: {
          email: { label: "Email", type: "email" },
          password: { label: "Password", type: "password" }
        },
        async authorize(credentials) {
          await connectDB();
          console.log('passing here')
          try {
            const user = await User.findOne({ email: credentials?.email });
            
            if (!user) {
              throw new Error('No user found with this email');
            }
            
            if (!credentials?.password) {
              throw new Error('Please enter your password');
            }
            
            const isValid = await bcrypt.compare(
              credentials.password,
              user.password
            );
            
            if (!isValid) {
              throw new Error('Invalid password');
            }
            
            return {
              id: user._id.toString(),
              name: user.Name,
              email: user.email
            };
          } catch (error: any) {
            throw new Error(error.message);
          }
        }
      }),
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      }),
      GitHubProvider({
        clientId: process.env.GITHUB_CLIENT_ID!,
        clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      })
    ],
    session: {
      strategy: "jwt"
    },
    pages:{
      signIn:'/'
    },
    callbacks: {
      async session({ session, token }) {
        if (session.user) {
          session.user.id = token.sub!
          if (token.provider === "google") {
            session.user.googleAccessToken = token.googleAccessToken
          }
          if (token.provider === "github") {
            session.user.githubUsername = token.githubUsername
          }
        }
        return session
      },
      async jwt({ token, account, profile }) {
        if (account) {
          token.provider = account.provider
          if (account.provider === "google") {
            token.googleAccessToken = account.access_token
          }
          if (account.provider === "github") {
            token.githubUsername = profile?.login
          }
        }
        return token
      }
    },
    secret: process.env.NEXTAUTH_SECRET
  }