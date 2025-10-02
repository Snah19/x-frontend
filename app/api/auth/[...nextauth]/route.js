import connectMongoDB from "@/lib/mongodb";
import User from "@/models/user.model";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: { },
      async authorize(credentials) {
        const { username, password } = credentials;

        try {
          await connectMongoDB();
          const user = await User.findOne({ username });

          if (!user) return null;

          const isMatched = await bcrypt.compare(password, user?.password || "");

          if (!isMatched) return null;

          return { name: user.username, email: user.email };
        }
        catch (error) {
          console.log("Error:", error);
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  // pages: {
  //   signIn: "/login",
  // },
  // callbacks: {
  //   async redirect({ url, baseUrl }) {
  //     return url?.startsWith(baseUrl) ? url : baseUrl;
  //   },
  // },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };