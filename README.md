# Personal AI Workforce

A personal operating system for a digital workforce of AI agents.

## Vision

This is not a chatbot with a few shortcuts. The product is designed as a command center where a person can build, supervise and coordinate a persistent workforce of specialized AI agents.

Think of it as thousands of digital arms: each agent owns a responsibility, has explicit permissions, remembers its context, reports its work and escalates decisions that require the human.

## Core model

**Owner → Orchestrator → Agents → Tasks → Tools → Verification → Report**

Agents have:
- Identity and role
- Mission and expectations
- Memory scope
- Tools and integrations
- Permission boundaries
- Autonomy level
- Parent/child relationships
- Audit history

### Autonomy levels

1. Observe — monitor only
2. Advise — recommend actions
3. Operate — execute allowed actions
4. Autonomous — execute within a defined contract

Sensitive actions remain behind a human approval gate.

## MVP

- Command Center
- Workforce overview
- Agent status and missions
- Natural-language command box
- Approval queue
- Live activity feed
- Dark operational UI

## Planned architecture

- Next.js + TypeScript frontend
- .NET API for domain and orchestration
- PostgreSQL for durable state
- Redis for queues, locks and realtime coordination
- Provider-agnostic LLM gateway
- Connector layer for email, calendar, banking, fitness and other tools
- Audit/event stream
- Human-in-the-loop approval service

## Product principles

- Human remains the owner and final authority.
- Least privilege by default.
- Every external action is auditable.
- Agents are replaceable; responsibilities are durable.
- Company/personal data is isolated by workspace and agent scope.
- The system must explain what it is doing and why.

## Local development

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Roadmap

- [ ] Persistent agent registry
- [ ] Agent Builder
- [ ] Task engine
- [ ] Mission planner
- [ ] Memory service
- [ ] Connector SDK
- [ ] Approval policies
- [ ] .NET orchestration API
- [ ] PostgreSQL + Redis
- [ ] Realtime event stream
- [ ] Multi-device command center
