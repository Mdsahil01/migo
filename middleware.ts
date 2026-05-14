import {
    clerkMiddleware,
    createRouteMatcher,
  } from "@clerk/nextjs/server";
  
  import { NextResponse } from "next/server";
  
  const isProtectedRoute = createRouteMatcher([
    "/dashboard(.*)",
    "/events(.*)",
    "/team(.*)",
  ]);
  
  const allowedEmails = [
    "mohammedsahil3752@gmail.com",
    "ayeshr17@gmail.com",
    "adityagunge412@gmail.com",
    "hamsinisuvarna462@gmail.com",
  ];
  
  export default clerkMiddleware(async (auth, req) => {
    if (!isProtectedRoute(req)) {
      return NextResponse.next();
    }
  
    const { userId, sessionClaims } = await auth();
  
    if (!userId) {
      return NextResponse.redirect(
        new URL("/sign-in", req.url),
      );
    }
  
    const email =
      sessionClaims?.email as string | undefined;
  
    if (!email || !allowedEmails.includes(email)) {
      return NextResponse.redirect(
        new URL("/unauthorized", req.url),
      );
    }
  
    return NextResponse.next();
  });
  
  export const config = {
    matcher: [
      "/((?!_next|.*\\..*).*)",
      "/(api|trpc)(.*)",
    ],
  };