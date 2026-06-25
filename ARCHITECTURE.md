# Architecture — Two-Agent System

This document describes how the two-agent setup (Hermes brain + OpenClaw hands) was wired together through Slack to build the Kanban board.

---

## Agent Roles

### Hermes — the Brain
- **Role**: Orchestrator, planner, memory store
- **Responsibilities**: Receive goals from the human in `#sprint-main`, decompose them into tasks, post tasks to `#agent-coder`, track progress, fire status-report skill, run scheduled cron updates
- **Model**: Ollama `rafw007/qwen35-claude-coder:4b` (local)
- **Memory**: Persistent cross-session memory — stores repo name, branch, decisions, context between restarts
- **Skill**: `skills/status-report/SKILL.md` — formats every status update as What I Did / What's Left / What Needs Your Call

### OpenClaw — the Hands
- **Role**: Coding agent, executor
- **Responsibilities**: Watch `#agent-coder` for tasks, write code, run shell commands, run migrations, scaffold files, report results back to the channel
- **Model**: Ollama `rafw007/qwen35-claude-coder:4b` (local)
- **Plugin**: `@openclaw/slack` in Socket Mode

---

## Model Routing

Both agents use the same local Ollama model (`rafw007/qwen35-claude-coder:4b`).

**Why this model?**
- Free — no API key billing, no rate limits
- Runs fully offline
- The `qwen35-claude-coder` variant is tuned for code generation and understands PHP, JS, and shell commands well

**Why the same model for both agents?**
- The planning tasks Hermes does (decompose a requirement into 4–5 concrete subtasks) are within this model's capability
- For the qualifier build, eliminating two separate model configurations reduced setup friction
- If the project scaled, Hermes would switch to a stronger planning model (e.g., Groq `openai/gpt-oss-120b`) while OpenClaw stays on the fast local model for code generation

---

## Slack Channel Scheme

| Channel | Purpose |
|---|---|
| `#sprint-main` | Human talks to Hermes here. Goals, approvals, status updates, decisions. |
| `#agent-coder` | Hermes posts tasks here. OpenClaw picks them up, works, and reports back. |
| `#agent-log` | Raw agent activity and autonomous cron run output. Audit trail. |

**The loop:**
```
Human posts goal → #sprint-main
    ↓
Hermes reads, plans, posts task → #agent-coder
    ↓
OpenClaw reads task, writes + runs code
    ↓
OpenClaw posts: What I Did / What's Left / What Needs Your Call → #agent-coder
    ↓
Human approves or corrects → #sprint-main
    ↓
Loop continues
```

No agent work happens in private DMs. Everything is visible in the channels above.

---

## Hermes Setup

```bash
# Install
iex (irm https://hermes-agent.nousresearch.com/install.ps1)   # Windows

hermes setup       # wizard: workspace path, model config
hermes model       # select Ollama as provider
hermes             # start the TUI
```

**Model config (Ollama):**
```
Provider:   ollama
Base URL:   http://localhost:11434/v1
Model:      rafw007/qwen35-claude-coder:4b
API Key:    ollama   (any string — Ollama ignores it)
```

**Memory demonstration:**
Session 1 — told Hermes:
> "Our repo is forge2-qualifier-chaman, default branch main."

Session 2 — asked Hermes (fresh start):
> "What repo are we working in?"

Hermes replied with the correct repo name and branch from persistent memory without being re-told.

**Autonomous cron run:**
Configured in Hermes to fire every 10 minutes:
> "Every 10 minutes, post a one-line progress update to #agent-log."

Screenshot of the autonomous post is in `slack-export/`.

---

## OpenClaw Setup

```bash
npm install -g openclaw@latest
openclaw onboard     # gateway, workspace, channel config
openclaw plugins install @openclaw/slack

export SLACK_APP_TOKEN=xapp-...
export SLACK_BOT_TOKEN=xoxb-...

openclaw config patch --file ./slack.socket.patch.json5
openclaw gateway
```

**Slack patch config (socket mode):**
```json5
{
  channels: {
    slack: {
      enabled: true,
      mode: "socket",
      appToken:  { source: "env", provider: "default", id: "SLACK_APP_TOKEN" },
      botToken:  { source: "env", provider: "default", id: "SLACK_BOT_TOKEN" },
    }
  }
}
```

**Gateway log confirming model:**
```
17:13:05 [gateway] agent model: ollama/rafw007/qwen35-claude-coder:4b (thinking=medium, fast=off)
```

---

## Slack App Configuration

- Created at api.slack.com/apps → From scratch
- Socket Mode enabled (App-Level Token scope: `connections:write`)
- Bot Token Scopes added: `chat:write`, `channels:history`, `channels:read`, `app_mentions:read`, `im:history`, `users:read`
- Event Subscriptions: `message.channels`, `app_mention`
- Bot invited to `#sprint-main`, `#agent-coder`, `#agent-log`

**Round-trip verification (all three passed):**
```bash
# 1. Token valid
curl -s -H "Authorization: Bearer $SLACK_BOT_TOKEN" \
  https://slack.com/api/auth.test
# → {"ok":true,...}

# 2. Can post
curl -s -X POST https://slack.com/api/chat.postMessage \
  -H "Authorization: Bearer $SLACK_BOT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"channel":"$CH","text":"round-trip test ✅"}'
# → {"ok":true,"ts":"..."}

# 3. Can read
curl -s -H "Authorization: Bearer $SLACK_BOT_TOKEN" \
  "https://slack.com/api/conversations.history?channel=$CH&limit=5"
# → JSON containing the message
```

Screenshots of these outputs are in `slack-export/`.

---

## How the Kanban App Was Built

The human posted the plan request in `#sprint-main`. Hermes broke the work into phases and assigned them one by one to OpenClaw via `#agent-coder`. OpenClaw created all files, ran migrations, and scaffolded both the Laravel backend and the React frontend.

```
Phase 1 → Backend scaffold (models, migrations, controllers, routes)
Phase 2 → React frontend (board view, list view, card view, forms)
Phase 3 → Features (tags, members, due dates, card move)
Phase 4 → Polish (Ant Design UI, visual flags, notifications)
```

Every phase ended with OpenClaw posting a What I Did / What's Left / What Needs Your Call update. The human reviewed and approved in `#sprint-main` before Hermes posted the next task.

---

## Skill: status-report

Defined in `skills/status-report/SKILL.md`.

When Hermes is asked for a status update, it automatically structures the reply into exactly three sections:
- **What I Did**
- **What's Left**
- **What Needs Your Call**

This skill was used after every phase to keep the human informed without Hermes free-forming its response format.

---

## Summary

```
Human
  │
  │  #sprint-main
  ▼
Hermes (brain)
  │  Plans, remembers, decomposes
  │  #agent-coder
  ▼
OpenClaw (hands)
  │  Writes code, runs commands, reports
  │  #agent-coder (replies)
  ▼
Hermes reads result, posts next task or asks human for decision
  │
  │  #agent-log (cron / autonomous updates)
  ▼
Human stays in the loop
```

Both agents run on `ollama/rafw007/qwen35-claude-coder:4b` (local, free, no billing).
