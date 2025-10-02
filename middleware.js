export { default } from "next-auth/middleware";

export const config = { matcher: ["/", "/notifications", "/profile/:username", "/:username/status/:postId"] };