import { NextResponse } from "next/server";
import { db } from "../../../lib/db";
import { approveAction } from "../../../runtime/orchestrator";

export async function GET() {
  const actions = await db.action.findMany({ where: { requiresApproval: true, approved: null }, include: { task: true }, orderBy: { id: "desc" } });
  return NextResponse.json(actions);
}

export async function POST(request: Request) {
  try {
    const { actionId, approved } = await request.json();
    if (!actionId || typeof approved !== "boolean") return NextResponse.json({ error: "actionId and approved are required" }, { status: 400 });
    return NextResponse.json(await approveAction(actionId, approved));
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unexpected error" }, { status: 400 });
  }
}
