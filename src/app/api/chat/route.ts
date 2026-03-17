import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { chatInput, sessionId } = body;

  if (!chatInput || typeof chatInput !== "string") {
    return NextResponse.json({ error: "chatInput is required" }, { status: 400 });
  }

  const webhookUrl = "https://n8n-1h2gjdisdrtt.jkt1.sumopod.my.id/webhook/fitness-coach";

  try {
    const n8nRes = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chatInput, sessionId: sessionId ?? "" }),
    });

    if (!n8nRes.ok) {
      const text = await n8nRes.text();
      return NextResponse.json(
        { error: `Upstream error ${n8nRes.status}`, detail: text },
        { status: 502 }
      );
    }

    const data = await n8nRes.json();
    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
