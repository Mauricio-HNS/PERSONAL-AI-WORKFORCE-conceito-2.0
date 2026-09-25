# Personal AI Workforce — Financial Rescue

A personal financial recovery operating system powered by specialized AI agents.

## Product

**Financial Rescue** is the first vertical of the Personal AI Workforce. Its mission is to help a person move from financial pressure toward positive cash flow, debt control and increased income.

The system follows:

**Understand → Detect → Calculate → Plan → Ask → Execute → Verify → Measure**

The AI does not move money or make irreversible financial decisions on its own.

## Current MVP

- Financial Rescue Center dashboard
- Monthly income, expenses, debt and recurring-cost intake
- Financial health calculation
- AI-style recovery opportunity engine
- Savings opportunities
- Income-growth opportunities
- Debt-reduction planning candidates
- Opportunity persistence with Prisma/SQLite
- Confidence and estimated-value tracking
- Explicit human authorization boundary

## Product direction

The core metric is not the number of AI tasks completed. It is measurable financial progress:

- Monthly balance
- Potential savings identified
- Additional income opportunities identified
- Debt reduction opportunities
- Verified value recovered/generated

## Architecture

```text
Owner
  ↓
Financial Rescue Center
  ↓
Rescue Orchestrator
  ↓
Specialized Financial Agents
  ├── Expense Recovery
  ├── Income Hunter
  └── Debt Strategy
  ↓
Policy / Human Approval
  ↓
Authorized Tools
  ↓
Verification
  ↓
Financial ROI Ledger
```

The existing Personal AI Workforce kernel remains the foundation: agents, tasks, actions, policy gates and auditability.

## Safety boundary

The MVP generates estimates and action candidates. It does not transfer money, sign contracts, contact creditors, or make regulated financial decisions without explicit user authorization and the appropriate professional/service integration.

## Local development

```bash
npm install
cp .env.example .env
npx prisma generate
npx prisma db push
npm run dev
```

Open `http://localhost:3000`.

## Roadmap

### Phase 1 — Rescue Kernel
Financial profile, opportunity detection, recovery plan and value tracking.

### Phase 2 — Authorized Connectors
Bank/account data, bills, subscriptions, employment data and other user-authorized sources.

### Phase 3 — Execution Workforce
Specialized agents prepare and execute approved actions through explicit tool permissions.

### Phase 4 — Recovery Loop
The system verifies outcomes, updates the financial model and continuously searches for the next improvement.

### Phase 5 — Personal Financial Operating System
Goals, missions, recurring monitoring, scenario planning and a long-term financial recovery ledger.
