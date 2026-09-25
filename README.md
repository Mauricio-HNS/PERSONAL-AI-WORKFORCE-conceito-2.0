# Personal AI Workforce

A personal operating system for a digital workforce of AI agents.

## Vision

This is not a chatbot with a few shortcuts. The product is designed as a command center where a person can build, supervise and coordinate a persistent workforce of specialized AI agents.

Think of it as thousands of digital arms: each agent owns a responsibility, has explicit permissions, remembers its context, reports its work and escalates decisions that require the human.

## Core model

**Owner → Orchestrator → Agents → Tasks → Tools → Verification → Report**

Core runtime rule:

**LLM proposes → Runtime enforces → Policy authorizes → Tool executes → Verification confirms → Audit records.**

## MVP — Phase 1

The first functional slice runs entirely in Next.js + TypeScript with SQLite/Prisma and Anthropic.

- Command Center
- Natural-language command routing
- One specialized Mail & Calendar agent
- Mock email/calendar tools
- Hardcoded approval Policy Engine outside the LLM
- Human approval queue
- Audit log and readable activity feed
- Single-user runtime

No real Gmail/Outlook integration is connected yet.

## Autonomy levels

1. Observe — monitor only
2. Advise — recommend actions
3. Operate — execute allowed actions
4. Autonomous — execute within a defined contract

Sensitive actions remain behind a human approval gate.

## Architecture

```text
Owner
  ↓
Next.js Command Center
  ↓
Orchestrator
  ↓
Mail & Calendar Agent
  ↓
Action Plan
  ↓
Hard Policy Engine
  ├── ALLOW → Mock Tool → Verification → Audit
  ├── APPROVAL → Human Gate → Mock Tool → Verification → Audit
  └── DENY / ESCALATE
```

The LLM is never the security boundary. Approval rules are enforced in application code before tool execution.

## Data model

SQLite via Prisma stores:

- `Agent`
- `Task`
- `Action`
- `AuditLog`

## Local development

```bash
npm install
cp .env.example .env
npx prisma generate
npx prisma db push
npm run dev
```

Open `http://localhost:3000`.

Set `ANTHROPIC_API_KEY` to enable Anthropic classification. Without a key, the MVP uses a deterministic local fallback so the approval/audit flow can still be exercised.

## Phase 2

The following remain deliberately outside the MVP:

- Real Gmail/Outlook connectors
- Additional agents
- Authentication and multi-user workspaces
- Persistent memory service
- .NET orchestration API
- PostgreSQL
- Redis
- Realtime event infrastructure
- Voice, image and file inputs
