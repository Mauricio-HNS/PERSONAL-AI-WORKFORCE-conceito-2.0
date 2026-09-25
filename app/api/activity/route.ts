import { NextResponse } from "next/server";
import { db } from "../../../lib/db";

export async function GET() {
  const logs = await db.auditLog.findMany({ orderBy: { timestamp: "desc" }, take: 50, include: { action: true } });
  return NextResponse.json(logs.map((log) => ({ id: log.id, event: log.event, actor: log.actor, timestamp: log.timestamp, description: log.event.replaceAll("_", " "), payload: log.payload })));
}
