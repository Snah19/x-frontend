// lib/auth.ts
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import connectMongoDB from "@/lib/mongodb";
import UserModel from "@/models/user.model";
import type { NextAuthOptions, User } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {},
      async authorize(credentials): Promise<User | null> {
        if (!credentials) return null;

        const { username, password } = credentials as {
          username: string;
          password: string;
        };

        await connectMongoDB();
        const user = await UserModel.findOne({ username });

        if (!user) return null;

        const isMatched = await bcrypt.compare(password, user.password);
        if (!isMatched) return null;

        return {
          id: user._id.toString(),
          name: user.username,
          email: user.email,
        };
      },
    }),
  ],
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
};
