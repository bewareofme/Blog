import {authOptions} from '@/lib/auth'
import NextAuth from "next-auth"
// import { auth } from "@/auth";



const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
export const{auth} =NextAuth(authOptions)