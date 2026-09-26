import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// "/" is the public landing page; everything else needs a signed-in user.
const isPublicRoute = createRouteMatcher(["/", "/sign-in(.*)", "/sign-up(.*)"]);

// clerkMiddleware leaves routes public by default, so protect everything
// except the public routes explicitly.
export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) await auth.protect();
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
