import { createFileRoute, Link } from "@tanstack/react-router";
import { ClipboardList, Mail, MessageSquare, NotebookPen, Search, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { AiDisclaimer } from "@/components/ai-disclaimer";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: Dashboard,
});

const tools = [
  { to: "/email", icon: Mail, title: "Smart Email Generator", desc: "Draft an email with the right tone, fast.", color: "bg-blue-500/10 text-blue-600 dark:text-blue-300" },
  { to: "/notes", icon: NotebookPen, title: "Meeting Notes Summarizer", desc: "Decisions, action items, open questions.", color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300" },
  { to: "/planner", icon: ClipboardList, title: "AI Task Planner", desc: "Break a goal into a prioritized plan.", color: "bg-amber-500/10 text-amber-600 dark:text-amber-300" },
  { to: "/research", icon: Search, title: "AI Research Assistant", desc: "Get a structured briefing on any topic.", color: "bg-violet-500/10 text-violet-600 dark:text-violet-300" },
  { to: "/chat", icon: MessageSquare, title: "AI Chatbot", desc: "Threaded conversations with your copilot.", color: "bg-rose-500/10 text-rose-600 dark:text-rose-300" },
];

function Dashboard() {
  const { user } = useAuth();
  const name = user?.email?.split("@")[0] ?? "there";

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
            <Sparkles className="h-3 w-3" /> Workspace ready
          </p>
          <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight">
            Good to see you, {name}.
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Pick a tool to start automating your day.
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((t) => (
          <Link
            key={t.to}
            to={t.to}
            className="group rounded-xl border border-border bg-card p-5 shadow-sm transition hover:border-foreground/20 hover:shadow-md"
          >
            <div className={`flex h-10 w-10 items-center justify-center rounded-md ${t.color}`}>
              <t.icon className="h-5 w-5" />
            </div>
            <h3 className="mt-4 font-semibold text-card-foreground">{t.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{t.desc}</p>
            <p className="mt-4 text-xs font-medium text-foreground/70 group-hover:text-foreground">
              Open →
            </p>
          </Link>
        ))}
      </div>

      <div className="mt-10">
        <AiDisclaimer />
      </div>
    </div>
  );
}
