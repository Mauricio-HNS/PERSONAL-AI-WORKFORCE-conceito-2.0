import { NextResponse } from "next/server";
import { persistRescue, runFinancialRescue } from "../../../financial-rescue/service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const income = Number(body.income);
    const expenses = Number(body.expenses);
    const debt = Number(body.debt ?? 0);
    const recurringCosts = Number(body.recurringCosts ?? 0);
    if (![income, expenses, debt].every(Number.isFinite) || income < 0 || expenses < 0 || debt < 0) {
      return NextResponse.json({ error: "Valores financeiros inválidos." }, { status: 400 });
    }
    const result = await runFinancialRescue({ income, expenses, debt, recurringCosts });
    const persisted = await persistRescue(result);
    return NextResponse.json({ ...result, ...persisted });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unexpected error" }, { status: 500 });
  }
}

export async function GET() {
  const { db } = await import("../../../../lib/db");
  const opportunities = await db.opportunity.findMany({ orderBy: { createdAt: "desc" }, take: 20 });
  return NextResponse.json(opportunities);
}
