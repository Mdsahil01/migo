import { auth, clerkClient } from "@clerk/nextjs/server";

import { NextResponse } from "next/server";

import { supabase } from "@/lib/supabase";

type AuthorizedMember = {
  userId: string;
  email: string;
  member: {
    email: string;
    name?: string | null;
    role?: string | null;
  };
};

type RequireMemberResult =
  | { ok: true; data: AuthorizedMember }
  | { ok: false; response: NextResponse };

export async function requireAuthorizedMember(): Promise<RequireMemberResult> {
  const { userId } = await auth();

  if (!userId) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      ),
    };
  }

  const client = await clerkClient();
  const user =
    await client.users.getUser(userId);

  const email =
    user.emailAddresses[0]?.emailAddress?.toLowerCase();

  if (!email) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      ),
    };
  }

  const { data: member, error } =
    await supabase
      .from("members")
      .select("email, name, role")
      .eq("email", email)
      .single();

  if (error || !member) {
    return {
      ok: false,
      response: NextResponse.json(
        {
          error:
            "Forbidden — MIGO team membership required",
        },
        { status: 403 },
      ),
    };
  }

  return {
    ok: true,
    data: {
      userId,
      email,
      member,
    },
  };
}
