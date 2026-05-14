import {
  clerkMiddleware,
  createRouteMatcher,
  clerkClient,
} from "@clerk/nextjs/server";

import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/events(.*)",
  "/team(.*)",
]);

const allowedEmails = [
  "mohammedsahil3752@gmail.com",
];

export default clerkMiddleware(async (auth, req) => {
  if (!isProtectedRoute(req)) {
    return NextResponse.next();
  }

  const { userId } = await auth();

  if (!userId) {
    return NextResponse.redirect(
      new URL("/sign-in", req.url),
    );
  }

  const client = await clerkClient();

  const user = await client.users.getUser(userId);

  const email =
    user.emailAddresses[0]?.emailAddress;

  console.log("CLERK EMAIL:", email);

  if (
    !email ||
    !allowedEmails.includes(email.toLowerCase())
  ) {
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