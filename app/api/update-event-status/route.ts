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
      status,
      title,
      location,
      starts_at,
      registration_link,
    } = body;

    if (
      !eventId ||
      !status
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
        .update({
          status,
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

    if (
      status === "approved"
    ) {
      const webhookUrl =
        process.env
          .DISCORD_WEBHOOK_URL;

      if (webhookUrl) {
        await fetch(
          webhookUrl,
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              content: `
🚀 Mission Approved

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

✅ Status:
Approved for MIGO operations.
`,
            }),
          },
        );
      }
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