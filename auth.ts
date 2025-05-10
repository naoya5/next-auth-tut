import { NextAuthConfig } from "next-auth";
import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

export const config: NextAuthConfig = {
  //認証プロバイダーを指定
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
  //APIルーティングのパスを指定
  basePath: "/api/auth",
  //認証後の操作を書く　例えばミドルウェア
  callbacks: {
    authorized({ request, auth }) {
      try {
        const { pathname } = request.nextUrl;
        //認証が必要なページ
        if (pathname === "/protected-page") return !!auth; //if exists auth, return true, otherwise return false
        return true;
      } catch (error) {
        console.log(error);
      }
    },
    //JWTトークンの更新
    jwt({ token, trigger, session }) {
      if (trigger === "update") token.name = session.user.name;
      return token;
    },
  },
};

export const { handlers, signIn, signOut, auth } = NextAuth(config);
