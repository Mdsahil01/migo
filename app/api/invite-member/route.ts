import { NextResponse } from "next/server";

import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const email = body.email?.toLowerCase();
    const role = body.role || "Member";
    const name = body.name || "New Member";

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

    const { data: existingMember } =
      await supabase
        .from("members")
        .select("*")
        .eq("email", email)
        .single();

    if (existingMember) {
      return NextResponse.json(
        {
          error:
            "Member already exists",
        },
        {
          status: 409,
        },
      );
    }

    const { data, error } =
      await supabase
        .from("members")
        .insert([
          {
            email,
            role,
            name,
          },
        ])
        .select()
        .single();

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
      member: data,
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