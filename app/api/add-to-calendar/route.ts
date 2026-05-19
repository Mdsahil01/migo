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
      eventId,
      title,
      location,
      starts_at,
      registration_link,
      resources,
    } = body;

    if (!eventId) {
      return NextResponse.json(
        {
          error:
            "Missing event ID",
        },
        { status: 400 },
      );
    }

    const { error } =
      await supabase
        .from("events")
        .update({
          calendar_added: true,
        })
        .eq("id", eventId);

    if (error) {
      return NextResponse.json(
        {
          error: error.message,
        },
        { status: 500 },
      );
    }

    const webhookUrl =
      process.env
        .DISCORD_RESOURCES_WEBHOOK_URL;

    if (webhookUrl) {
      await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          content: `
📅 Mission Added To Calendar

🎯 Mission:
${title}

📍 Location:
${location}

📅 Date:
${new Date(
  starts_at,
).toLocaleString()}

🔗 Registration:
${
  registration_link ||
  "Not provided"
}

📚 Resources:
${
  resources ||
  "No resources added yet"
}

✅ Mission synced for MIGO coordination.
`,
        }),
      });
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