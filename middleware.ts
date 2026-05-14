import {
  clerkMiddleware,
  createRouteMatcher,
  clerkClient,
} from "@clerk/nextjs/server";

import { NextResponse } from "next/server";

import { supabase } from "./lib/supabase";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/events(.*)",
  "/team(.*)",
]);

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

  if (!email) {
    return NextResponse.redirect(
      new URL("/unauthorized", req.url),
    );
  }

  const { data: member } = await supabase
    .from("members")
    .select("*")
    .eq("email", email.toLowerCase())
    .single();

  if (!member) {
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