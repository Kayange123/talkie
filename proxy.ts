import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// The landing and legal pages are public; everything else needs sign-in.
const isPublicRoute = createRouteMatcher([
  "/",
  "/terms",
  "/privacy",
  "/sign-in(.*)",
  "/sign-up(.*)",
]);

// clerkMiddleware leaves routes public by default, so protect everything
// except the public routes explicitly.
export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) await auth.protect();
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
