import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

    if (!webhookUrl) {
      return NextResponse.json(
        { error: "Missing webhook URL" },
        { status: 500 }
      );
    }

    const message = {
      content: `
🚀 MISSION APPROVED

🎯 Event: ${body.title}

📅 Date: ${body.date}

📍 Location: ${body.location}

⭐ Relevance: ${body.relevance}/4

🔗 Register: ${body.link}
      `,
    };

    await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to send Discord message" },
      { status: 500 }
    );
  }
}