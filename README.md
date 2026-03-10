# Project 8 — AI Employee
**Bullock Consulting Group LLC** | Confidential

AI Employee is a custom AI sales chatbot — persona name **Aria** — embedded directly on the BCG landing page. It qualifies inbound visitors, answers questions about BCG services and pricing, handles objections, captures lead info, and books free strategy calls via Calendly. All leads are logged to Google Sheets via a Make.com webhook.

---

## Stack
| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite |
| AI Brain | Claude API — `claude-sonnet-4-6` |
| Lead Logging | Make.com Webhook → Google Sheets |
| Booking | Calendly (link trigger) |
| Hosting | Vercel / Netlify |

---

## Quick Start

### 1. Install dependencies
```bash
cd ai-employee
npm install
```

### 2. Set environment variables
```bash
cp .env.example .env
```

Fill in `.env`:
```
VITE_ANTHROPIC_API_KEY=your_claude_api_key
VITE_MAKE_WEBHOOK_URL=your_make_webhook_url
VITE_CALENDLY_URL=https://calendly.com/your-link
```

### 3. Run locally
```bash
npm run dev
```

### 4. Build for production
```bash
npm run build
```

Deploy the `dist/` folder to Vercel or Netlify. Embed via a `<script>` tag on your landing page.

---

## Project Structure
```
ai-employee/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   └── ChatWidget.jsx      # Main widget — UI, forms, Calendly card
│   ├── config/
│   │   └── constants.js        # Env vars, model config, control tags
│   ├── prompts/
│   │   └── systemPrompt.js     # Aria's full system prompt
│   ├── hooks/
│   │   └── useChat.js          # Claude API calls, conversation state
│   ├── utils/
│   │   └── helpers.js          # Tag parsing, Make.com lead logging
│   ├── styles/
│   │   └── widget.css          # Dark theme widget styles
│   └── main.jsx
├── .env.example
├── .gitignore
└── package.json
```

---

## Embedding

Add Aria to any website with a single script tag — no build step, no npm, no configuration required.

```html
<script src="https://bcg-ai-employee.vercel.app/embed.js" async></script>
```

Paste it anywhere in the `<body>` (or before `</body>`) of the target page. The script:

- Injects a transparent `420×700px` iframe fixed to the bottom-right corner
- Loads the full Aria widget from `bcg-ai-employee.vercel.app` inside the iframe
- Re-enables pointer events only on the widget so the rest of the host page remains fully interactive
- Adapts to mobile viewports (expands to full width on screens ≤ 480px)
- Is idempotent — safe to include multiple times, will only inject once

The widget is self-contained inside the iframe; it manages its own open/close state, lead capture, and Calendly CTA independently of the host page.

---

## Conversation Flow
1. **Greet** — Aria introduces herself (800ms delay on open)
2. **Qualify** — Identify business type, pain point, timeline
3. **Educate** — Surface relevant BCG service + ROI framing
4. **Objections** — Scripted handling for price/trust/timing/ChatGPT objections
5. **Lead Capture** — `<collect_lead>` tag triggers name + email form
6. **Confirm** — Personalize by first name, build warmth
7. **Calendly CTA** — `<show_calendly>` tag renders booking card
8. **Log** — Make.com webhook fires → Google Sheets

---

## Lead Data Schema (Google Sheets)
| Field | Type | Source |
|---|---|---|
| `name` | String | Lead capture form |
| `email` | String | Lead capture form |
| `timestamp` | ISO 8601 | Auto — client datetime |
| `conversation_summary` | String | Last 1,000 chars of chat |

---

## Success Metrics
| Goal | Target |
|---|---|
| Lead capture rate | > 15% of chat sessions |
| Calendly bookings | > 5 / month |
| Escalation rate | < 10% |
| Sheet accuracy | 100% — zero missed entries |

---

## BCG Services Aria Knows
- AI Consulting & Audit ($500–$1,000)
- Basic Automations ($1,500 setup / $200/mo)
- AI Chatbot — AI Employee ($2,000 / $297/mo)
- AI Voice Receptionist ($1,200 / $150/mo)
- AI Outreach & Lead Gen ($1,800 / $350/mo)
- Pro – Growth Optimization ($3,500 / $500/mo)
- MAX / Full Infrastructure ($8,500+ / custom)
- Website Development ($1,500–$2,500)

---

*This project is the single source of truth for Project 8 — AI Employee under Bullock Consulting Group LLC.*
