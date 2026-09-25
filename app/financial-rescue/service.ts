import { db } from "../../lib/db";

export type RescueResult = {
  monthlyIncome: number;
  monthlyExpenses: number;
  monthlyBalance: number;
  debt: number;
  recoveryPotential: number;
  incomePotential: number;
  opportunities: Array<{
    title: string;
    category: string;
    description: string;
    estimatedValue: number;
    confidence: number;
    source: string;
    evidence: string;
  }>;
};

export async function runFinancialRescue(input: {
  income: number;
  expenses: number;
  debt: number;
  recurringCosts?: number;
}) : Promise<RescueResult> {
  const recurring = input.recurringCosts ?? Math.max(0, input.expenses * 0.18);
  const balance = input.income - input.expenses;

  const opportunities = [
    {
      title: "Revisar gastos recorrentes",
      category: "save",
      description: "Identificar assinaturas, tarifas e serviços recorrentes que podem ser reduzidos ou eliminados.",
      estimatedValue: Math.round(recurring * 0.25 * 100) / 100,
      confidence: 0.72,
      source: "financial-profile",
      evidence: "Estimativa inicial baseada nos custos recorrentes informados."
    },
    {
      title: "Plano de aumento de renda",
      category: "income",
      description: "Mapear competências e oportunidades de trabalho/serviços para criar renda adicional.",
      estimatedValue: Math.round(Math.max(0, input.income * 0.15) * 100) / 100,
      confidence: 0.48,
      source: "financial-profile",
      evidence: "Hipótese de trabalho; precisa de dados profissionais e oportunidades reais para validação."
    },
    ...(input.debt > 0 ? [{
      title: "Estratégia de redução de dívida",
      category: "debt",
      description: "Organizar dívidas por custo, vencimento e risco para priorizar ações de redução.",
      estimatedValue: Math.round(Math.min(input.debt * 0.08, Math.max(0, input.expenses * 0.15)) * 100) / 100,
      confidence: 0.55,
      source: "financial-profile",
      evidence: "Estimativa de impacto; não representa promessa de desconto ou renegociação."
    }] : [])
  ];

  return {
    monthlyIncome: input.income,
    monthlyExpenses: input.expenses,
    monthlyBalance: balance,
    debt: input.debt,
    recoveryPotential: opportunities.filter(x => x.category !== "income").reduce((s,x) => s + x.estimatedValue, 0),
    incomePotential: opportunities.filter(x => x.category === "income").reduce((s,x) => s + x.estimatedValue, 0),
    opportunities
  };
}

export async function persistRescue(result: RescueResult) {
  const agent = await db.agent.upsert({
    where: { id: "financial-rescue" },
    update: {},
    create: {
      id: "financial-rescue",
      name: "Rescue",
      role: "Financial Recovery Operations",
      systemPrompt: "Analyze authorized financial information, identify possible savings, debt actions and income opportunities. Never execute financial transactions.",
      autonomyDefault: "advise",
      allowedTools: JSON.stringify(["analyze_finances", "create_plan"]),
      status: "active"
    }
  });

  const task = await db.task.create({
    data: {
      userInput: "Financial Rescue scan",
      agentId: agent.id,
      status: "completed",
      completedAt: new Date()
    }
  });

  await Promise.all(result.opportunities.map((item) =>
    db.opportunity.create({
      data: {
        ...item,
        agentId: agent.id,
        taskId: task.id,
        status: "detected"
      }
    })
  ));

  return { taskId: task.id, agentId: agent.id };
}
