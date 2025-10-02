export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    // Protect all routes EXCEPT /login, /signup, and NextAuth API routes
    "/((?!login|signup|api/auth).*)",
  ],
};
