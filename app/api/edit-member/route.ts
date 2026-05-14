import { NextResponse } from "next/server";

import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const email = body.email?.toLowerCase();

    const role = body.role;
    const name = body.name;
    const githubUsername =
      body.githubUsername;

    if (!email) {
      return NextResponse.json(
        {
          error: "Email is required",
        },
        {
          status: 400,
        },
      );
    }

    const { error } = await supabase
      .from("members")
      .update({
        name,
        role,
        github_username:
          githubUsername,
      })
      .eq("email", email);

    if (error) {
      return NextResponse.json(
        {
          error: error.message,
        },
        {
          status: 500,
        },
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          "Something went wrong",
      },
      {
        status: 500,
      },
    );
  }
}