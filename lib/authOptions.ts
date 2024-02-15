import connectMongoDB from "@/lib/mongoose";
import User from "@/models/userSchema";
import {compare} from "bcrypt-ts";
import NextAuth, {NextAuthOptions} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import {NextRequest, NextResponse} from "next/server";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {},

      async authorize(credentials) {
        try {
          const {email, password}: any = credentials;
          const validatedEmail = email.toLowerCase();
          await connectMongoDB();
          const user = await User.findOne({email: validatedEmail});

          if (!user) {
            return null;
          }

          const validPassword = await compare(password, user.password);
          if (!validPassword) {
            return null;
          }

          return user;
        } catch (error) {
          return NextResponse.json(error);
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 8 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/welcome",
    signOut: "/login",
    newUser: "/welcome",
  },
};
