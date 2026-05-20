# AI Workplace Productivity Assistant

A modern, responsive web application that helps professionals automate everyday workplace tasks using AI. Built as a full-stack SaaS-style dashboard with persistent cloud-backed chat history and enterprise-grade authentication.

## Overview

The AI Workplace Productivity Assistant is a centralized workspace where professionals can draft emails, summarize meeting notes, plan projects, research topics, and chat with an AI copilot — all in one clean, fast, responsive interface. Every tool is backed by a structured AI prompt pipeline and returns editable, copy-ready outputs.

## Features

### Smart Email Generator
Draft polished workplace emails by describing what you want to communicate. Choose from tones (professional, friendly, direct, formal) and get a ready-to-send email with a subject line.

### Meeting Notes Summarizer
Paste raw meeting notes and receive a structured Markdown summary including key decisions, action items with owners, and open questions.

### AI Task Planner
Break any goal into a prioritized task plan. Specify deadlines and context to get a strategic breakdown with effort estimates, suggested due dates, and risk considerations.

### AI Research Assistant
Get structured briefings on any topic. Choose depth (brief, standard, or deep) and receive a neutral overview with key points, trade-offs, and suggested next steps.

### AI Chatbot
A threaded conversational interface with persistent chat history. Create multiple conversation threads, switch between them, and continue conversations across sessions. Powered by streaming AI responses.

### Core Platform Features
- **User Authentication** — Secure sign-up, login, and password reset via Lovable Cloud Auth.
- **Persistent Chat History** — Conversations stored in the cloud with Row Level Security; each user sees only their own threads and messages.
- **Collapsible Sidebar Navigation** — Quick access to every tool from a responsive sidebar.
- **Editable AI Outputs** — All generated content can be edited inline before copying or exporting.
- **Responsible AI Disclaimer** — Visible reminder that AI outputs should be reviewed before use.
- **Responsive Design** — Fully functional on desktop, tablet, and mobile.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | [TanStack Start](https://tanstack.com/start) (React 19 + Vite 7) |
| Styling | Tailwind CSS 4 + shadcn/ui components |
| Animation | Motion (Framer Motion) |
| Icons | Lucide React |
| AI SDK | Vercel AI SDK with Lovable AI Gateway |
| AI Model | google/gemini-3-flash-preview |
| Backend / Auth | Lovable Cloud (Supabase) |
| Database | PostgreSQL with Row Level Security |
| Server Functions | TanStack `createServerFn` (edge-ready) |
| Validation | Zod |
| Deployment | Cloudflare Workers |

## Project Structure

```
├── public/                  # Static assets
├── src/
│   ├── components/          # Reusable UI components (shadcn/ui + custom)
│   │   ├── ai-elements/   # AI chat UI primitives (conversation, message, prompt input)
│   │   ├── app-sidebar.tsx  # Dashboard navigation sidebar
│   │   ├── tool-page.tsx    # Shared layout wrapper for tool pages
│   │   └── ui/              # shadcn/ui components
│   ├── hooks/               # React hooks (auth, mobile detection)
│   ├── integrations/
│   │   ├── lovable/         # Lovable AI Gateway client
│   │   └── supabase/        # Supabase clients (browser, server, auth middleware)
│   ├── lib/
│   │   ├── ai-gateway.ts    # AI provider configuration
│   │   ├── chat.functions.ts # Chat history server functions
│   │   ├── tools.functions.ts # Email, notes, planner, research server functions
│   │   └── utils.ts         # Utility helpers
│   ├── routes/
│   │   ├── _authenticated/ # Protected dashboard + tool pages
│   │   ├── api/chat.ts      # Streaming chat API endpoint
│   │   ├── login.tsx        # Auth page
│   │   └── index.tsx        # Landing page
│   ├── router.tsx           # TanStack Router setup
│   ├── server.ts            # SSR entry wrapper
│   ├── start.ts             # TanStack Start configuration
│   └── styles.css           # Design tokens (Slate & Steel palette)
├── supabase/
│   ├── config.toml          # Supabase project configuration
│   └── migrations/          # Database migrations (threads, messages, RLS)
├── .env                     # Environment variables (auto-managed)
├── vite.config.ts
├── wrangler.jsonc
└── package.json
```

## Setup Instructions

### Prerequisites
- [Node.js](https://nodejs.org/) 20+ (or [Bun](https://bun.sh))
- A Lovable account with Lovable Cloud enabled

### 1. Clone the Project
```bash
git clone <repository-url>
cd tanstack_start_ts
```

### 2. Install Dependencies
```bash
bun install
# or
npm install
```

### 3. Configure Environment Variables
The `.env` file is auto-managed by Lovable Cloud integration and contains:

| Variable | Purpose |
|----------|---------|
| `VITE_SUPABASE_URL` | Lovable Cloud project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Client-side Supabase key |
| `VITE_SUPABASE_PROJECT_ID` | Project identifier |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-side admin key (bypasses RLS) |
| `LOVABLE_API_KEY` | Lovable AI Gateway API key |

> **Note:** Never commit `.env` to version control. It is preconfigured automatically when Lovable Cloud is enabled.

### 4. Run Database Migrations
Migrations create the `threads` and `messages` tables with Row Level Security policies. They run automatically through Lovable Cloud when you start the project.

### 5. Start the Development Server
```bash
bun dev
# or
npm run dev
```

The app will be available at `http://localhost:3000`.

### 6. Build for Production
```bash
bun run build
# or
npm run build
```

### 7. Preview Production Build
```bash
bun preview
# or
npm run preview
```

## Authentication & RLS

The application uses Lovable Cloud Auth with the following security model:

- **Authentication required** for all tool pages (`/_authenticated/*`)
- **Row Level Security (RLS)** enforced on `threads` and `messages` tables
- Users can only read/write their own data
- Server functions validate authentication via `requireSupabaseAuth` middleware
- Auth token is automatically attached to server function calls via `attachSupabaseAuth`

## Design System

The UI follows a **Slate & Steel** design direction:
- Cool gray neutrals with blue undertones
- Clean, modern enterprise aesthetic
- `Space Grotesk` for display headings
- `Inter` for body text
- Subtle borders, rounded corners, and careful whitespace

## Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| Dev | `bun dev` | Start Vite dev server with HMR |
| Build | `bun run build` | Production build (Cloudflare Workers) |
| Build (dev) | `bun run build:dev` | Development-mode build |
| Preview | `bun preview` | Preview production build locally |
| Lint | `bun run lint` | Run ESLint |
| Format | `bun run format` | Run Prettier on all files |

## License

Private / All rights reserved.
