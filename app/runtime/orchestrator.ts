import Anthropic from "@anthropic-ai/sdk";
import { db } from "../../lib/db";
import { emailCalendarSystemPrompt } from "../agents/email-calendar/system-prompt";
import { executeMockTool } from "../agents/email-calendar/tools";
import { requiresApproval } from "./policy";

const userName = process.env.WORKFORCE_USER_NAME || "Mauricio";
const orchestratorPrompt = (agents: string[]) => `Você é o Orquestrador do Personal AI Workforce de ${userName}. Seu único trabalho é interpretar o pedido do usuário e decidir qual agente deve executá-lo. Você nunca executa a ação, apenas roteia.\n\nAgentes disponíveis: ${agents.join(", ")}\n\nResponda somente JSON: {"agente":"id_do_agente ou null","resumo_da_tarefa":"...","justificativa":"..."}. Se for ambíguo ou fora de escopo, use null.`;

async function llmJson(system: string, input: string): Promise<any | null> {
  if (!process.env.ANTHROPIC_API_KEY) return null;
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const response = await client.messages.create({ model: "claude-sonnet-4-5", max_tokens: 800, system, messages: [{ role: "user", content: input }] });
  const text = response.content.find((x) => x.type === "text")?.text ?? "";
  try { return JSON.parse(text.replace(/^```json\s*/, "").replace(/\s*```$/, "")); } catch { return null; }
}

function routeFallback(input: string) { return /email|e-mail|mensagem|responda|caixa de entrada|inbox|reunião|reuniao|agenda|evento|horário|horario|compromisso|participantes/i.test(input) ? "email-calendar" : null; }
function agentFallback(input: string) {
  const lower = input.toLowerCase();
  if (/cancele|cancelar|cancela/.test(lower)) return { tool: "cancelar_evento", autonomyLevel: "operate", description: input, args: { participantCount: /5|seis|6/.test(lower) ? 5 : 3 } };
  if (/remarque|remarcar/.test(lower)) return { tool: "remarcar_evento", autonomyLevel: "advise", description: input, args: { participantCount: 3 } };
  if (/responda|responder|confirma/.test(lower)) return { tool: "enviar_email", autonomyLevel: "operate", description: input, args: { destinatario: lower.includes("joão") || lower.includes("joao") ? "joao@example.com" : "unknown@example.com" } };
  if (/email|e-mail/.test(lower)) return { tool: "ler_emails", autonomyLevel: "observe", description: input, args: {} };
  return { tool: "ler_agenda", autonomyLevel: "observe", description: input, args: {} };
}

async function audit(actionId: string | null, event: string, payload: unknown, actor = "agent") {
  await db.auditLog.create({ data: { actionId, actor, event, payload: JSON.stringify(payload) } });
}

export async function handleCommand(userInput: string) {
  const agent = await db.agent.upsert({ where: { id: "email-calendar" }, update: {}, create: { id: "email-calendar", name: "Mail", role: "Email & Calendar Operations", systemPrompt: emailCalendarSystemPrompt(userName), autonomyDefault: "operate", allowedTools: JSON.stringify(["ler_emails", "rascunhar_email", "enviar_email", "ler_agenda", "criar_evento", "remarcar_evento", "cancelar_evento"]) } });
  const task = await db.task.create({ data: { userInput, agentId: agent.id, status: "pending" } });
  await audit(null, "command_received", { taskId: task.id, userInput }, "user");

  const route = await llmJson(orchestratorPrompt([agent.id]), userInput) ?? { agente: routeFallback(userInput), resumo_da_tarefa: userInput, justificativa: "Classificação local de fallback." };
  await audit(null, "routed", route);
  if (route.agente !== agent.id) {
    await db.task.update({ where: { id: task.id }, data: { status: "failed", completedAt: new Date() } });
    await audit(null, "out_of_scope", { taskId: task.id, message: "Ainda não tenho um agente para isso." });
    return { taskId: task.id, status: "failed", message: "Ainda não tenho um agente para isso." };
  }

  await db.task.update({ where: { id: task.id }, data: { status: "running" } });
  const action = await llmJson(emailCalendarSystemPrompt(userName), userInput) ?? agentFallback(userInput);
  const policy = requiresApproval(action);
  const created = await db.action.create({ data: { taskId: task.id, agentId: agent.id, description: action.description ?? userInput, autonomyLevel: action.autonomyLevel ?? "advise", requiresApproval: policy.required, approved: policy.required ? null : true } });
  await audit(created.id, "action_planned", { ...action, policy });

  if (policy.required) {
    await db.task.update({ where: { id: task.id }, data: { status: "needs_approval" } });
    await audit(created.id, "approval_required", { reason: policy.reason });
    return { taskId: task.id, actionId: created.id, status: "needs_approval", message: policy.reason, action: action.description ?? userInput };
  }

  const result = executeMockTool(action.tool, action.args ?? {});
  await db.action.update({ where: { id: created.id }, data: { executedAt: new Date(), result: JSON.stringify(result) } });
  await audit(created.id, result.ok ? "executed" : "execution_failed", result);
  await db.task.update({ where: { id: task.id }, data: { status: result.ok ? "completed" : "failed", completedAt: new Date() } });
  return { taskId: task.id, actionId: created.id, status: result.ok ? "completed" : "failed", message: result.message };
}

export async function approveAction(actionId: string, approved: boolean) {
  const action = await db.action.findUnique({ where: { id: actionId }, include: { task: true } });
  if (!action) throw new Error("Action not found");
  if (!action.requiresApproval || action.approved !== null) throw new Error("Action is not awaiting approval");
  await audit(action.id, approved ? "approval_granted" : "approval_rejected", { actor: "user" }, "user");
  if (!approved) {
    await db.action.update({ where: { id: action.id }, data: { approved: false } });
    await db.task.update({ where: { id: action.taskId }, data: { status: "failed", completedAt: new Date() } });
    return { status: "rejected" };
  }
  const result = executeMockTool("cancelar_evento", { participantCount: 5 });
  await db.action.update({ where: { id: action.id }, data: { approved: true, executedAt: new Date(), result: JSON.stringify(result) } });
  await audit(action.id, "executed_after_approval", result);
  await db.task.update({ where: { id: action.taskId }, data: { status: result.ok ? "completed" : "failed", completedAt: new Date() } });
  return { status: result.ok ? "completed" : "failed", message: result.message };
}
