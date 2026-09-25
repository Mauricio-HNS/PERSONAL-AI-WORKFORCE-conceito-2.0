# Agent Runtime Architecture

The Personal AI Workforce separates reasoning from authority.

## Core rule

**LLM proposes. Runtime enforces. Tools execute. Audit records.**

An agent definition describes identity, mission, capabilities, tools, permissions, memory scope and autonomy. The runtime converts a user request into a plan, evaluates every proposed tool call against policy, routes approvals when required, executes allowed tools and verifies the result.

## Execution pipeline

```text
Owner
  ↓
Orchestrator
  ↓
Agent Runtime
  ↓
Agent Planner / LLM
  ↓
Task Plan
  ↓
Policy Engine
  ├── ALLOW → Tool Gateway → Tool → Verification → Audit
  ├── APPROVAL → Approval Service → Human → Tool Gateway
  └── DENY → Explain / Escalate
```

## Responsibilities

### Orchestrator

- Receives owner commands.
- Selects the responsible agent.
- Decomposes cross-agent missions.
- Tracks mission and task state.

### Agent Runtime

- Loads the agent contract.
- Provides scoped memory and available tools.
- Maintains execution state.
- Prevents undeclared capabilities from being invoked.

### Policy Engine

- Evaluates autonomy level.
- Checks permissions and risk.
- Enforces approval requirements.
- Applies least privilege.
- Produces an explicit policy decision.

### Approval Service

- Creates approval requests.
- Presents exact proposed actions.
- Records approve/reject decisions.
- Prevents execution without approval when required.

### Tool Gateway

- Provides a single controlled boundary for external integrations.
- Validates tool arguments.
- Applies authentication and connector scope.
- Returns structured execution results.

### Verification

- Confirms whether the requested external operation actually succeeded.
- Distinguishes planned, attempted, successful and failed states.
- Never lets the agent report success based only on intent.

### Audit

Every tool invocation produces an immutable event containing agent, task, action, policy decision, approval state, execution result and timestamp.

## Agent definition

Conceptual model:

```ts
interface AgentDefinition {
  id: string;
  name: string;
  role: string;
  mission: string;
  capabilities: string[];
  tools: string[];
  autonomy: AutonomyPolicy;
  permissions: PermissionPolicy;
  approvalPolicy: ApprovalPolicy;
  memoryScope: MemoryScope;
  escalationPolicy: EscalationPolicy;
}
```

## Security principle

Prompts are not security boundaries. A malicious, incorrect or confused model must be unable to bypass runtime policy by producing a different tool call or instruction.
