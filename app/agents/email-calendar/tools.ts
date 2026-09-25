export const knownContacts = ["joao@example.com", "mariana@example.com"];

export type MockToolResult = { ok: boolean; message: string; data?: unknown };

export function executeMockTool(tool: string, args: Record<string, unknown>): MockToolResult {
  switch (tool) {
    case "ler_emails":
      return { ok: true, message: "3 mock emails encontrados.", data: [{ from: "joao@example.com", subject: "Reunião amanhã", unread: true }] };
    case "rascunhar_email":
      return { ok: true, message: "Rascunho criado no ambiente mock.", data: args };
    case "enviar_email":
      return { ok: true, message: "E-mail enviado no ambiente mock.", data: args };
    case "ler_agenda":
      return { ok: true, message: "Agenda mock consultada.", data: [{ id: "evt-1", title: "Reunião com cliente", participants: 5 }] };
    case "criar_evento":
      return { ok: true, message: "Evento criado no ambiente mock.", data: args };
    case "remarcar_evento":
      return { ok: true, message: "Evento remarcado no ambiente mock.", data: args };
    case "cancelar_evento":
      return { ok: true, message: "Evento cancelado no ambiente mock.", data: args };
    default:
      return { ok: false, message: `Ferramenta não permitida: ${tool}` };
  }
}
