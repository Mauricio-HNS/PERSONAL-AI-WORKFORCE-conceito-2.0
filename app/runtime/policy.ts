import { knownContacts } from "../agents/email-calendar/tools";

export type ActionInput = {
  tool: string;
  autonomyLevel: "observe" | "advise" | "operate" | "autonomous";
  args?: Record<string, unknown>;
};

const operateAllowlist = new Set(["ler_emails", "rascunhar_email", "ler_agenda", "criar_evento"]);

export function requiresApproval(action: ActionInput): { required: boolean; reason: string } {
  const args = action.args ?? {};
  const recipient = String(args.destinatario ?? args.recipient ?? "").trim().toLowerCase();
  if (action.tool === "enviar_email" && recipient && !knownContacts.includes(recipient)) {
    return { required: true, reason: "Destinatário fora da lista de contatos conhecidos." };
  }

  const participants = Number(args.participantCount ?? args.participantsCount ?? args.participantes ?? 0);
  if (["cancelar_evento", "remarcar_evento"].includes(action.tool) && participants > 2) {
    return { required: true, reason: "Cancelamento/remarcação de evento com mais de 2 participantes." };
  }

  if ((action.autonomyLevel === "operate" || action.autonomyLevel === "autonomous") && !operateAllowlist.has(action.tool)) {
    return { required: true, reason: "Ação fora da allowlist de operações automáticas." };
  }

  return { required: false, reason: "Ação permitida pela política do MVP." };
}
