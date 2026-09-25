import { authMiddleware } from "@clerk/nextjs";

// Every route requires sign-in; Clerk exempts its own sign-in/sign-up pages.
export default authMiddleware({});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
