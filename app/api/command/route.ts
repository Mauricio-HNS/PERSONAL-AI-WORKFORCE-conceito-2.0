import { NextResponse } from "next/server";
import { handleCommand } from "../../../runtime/orchestrator";

export async function POST(request: Request) {
  try {
    const { input } = await request.json();
    if (!input || typeof input !== "string") return NextResponse.json({ error: "input is required" }, { status: 400 });
    return NextResponse.json(await handleCommand(input));
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unexpected error" }, { status: 500 });
  }
}
