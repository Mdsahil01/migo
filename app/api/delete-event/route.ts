import { NextResponse } from "next/server";

import { requireAuthorizedMember } from "@/lib/auth/require-member";
import { supabase } from "@/lib/supabase";

export async function POST(
  request: Request,
) {
  try {
    const authResult =
      await requireAuthorizedMember();

    if (!authResult.ok) {
      return authResult.response;
    }

    const body = await request.json();
    const { eventId } = body;

    if (!eventId || typeof eventId !== "string") {
      return NextResponse.json(
        { error: "Missing eventId" },
        { status: 400 },
      );
    }

    const { data: existing, error: fetchError } =
      await supabase
        .from("events")
        .select("id, title")
        .eq("id", eventId)
        .maybeSingle();

    if (fetchError) {
      return NextResponse.json(
        { error: fetchError.message },
        { status: 500 },
      );
    }

    if (!existing) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 },
      );
    }

    const { error: deleteError } =
      await supabase
        .from("events")
        .delete()
        .eq("id", eventId);

    if (deleteError) {
      return NextResponse.json(
        { error: deleteError.message },
        { status: 500 },
      );
    }

    console.log(
      `[delete-event] removed "${existing.title}" (${eventId}) by ${authResult.data.email}`,
    );

    return NextResponse.json({
      success: true,
      deletedEventId: eventId,
    });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
