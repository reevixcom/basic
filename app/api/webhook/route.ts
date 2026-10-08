import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (
    mode === "subscribe" &&
    token === process.env.WHATSAPP_VERIFY_TOKEN
  ) {
    return new Response(challenge);
  }

  return new Response("Forbidden", {
    status: 403,
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  console.log("WhatsApp Webhook:");
  console.log(JSON.stringify(body, null, 2));

  return Response.json({
    success: true,
  });
}