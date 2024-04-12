import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  // publicRoutes: ["/", "/sign-in(.*)", "/sign-up", "/upcoming", "/previous"],
});

// const protectedRoutes= createRouteMatcher([
//   "/",
//   "/upcoming",
//   "/previous",
//   ""
// ])

export const config = {
  matcher: ["/((?!.+.[w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
