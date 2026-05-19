import { NextResponse } from "next/server";

import { auth } from "@clerk/nextjs/server";

import { supabase } from "@/lib/supabase";

export async function POST(
  request: Request,
) {
  try {
    const { userId } =
      await auth();

    if (!userId) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        { status: 401 },
      );
    }

    const body =
      await request.json();

    const {
      title,
      description,
      resources,
      source_url,
      location,
      registration_link,
      starts_at,
      status,
      created_by,
    } = body;

    if (
      !title ||
      !location ||
      !starts_at
    ) {
      return NextResponse.json(
        {
          error:
            "Missing required fields",
        },
        { status: 400 },
      );
    }

    const { error } =
      await supabase
        .from("events")
        .insert([
          {
            title,
            description,
            location,
            registration_link,
            resources,
            source_url,
            starts_at,
            status: "reviewing",
            created_by,
          },
        ]);

    if (error) {
      return NextResponse.json(
        {
          error: error.message,
        },
        { status: 500 },
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
      { status: 500 },
    );
  }
}