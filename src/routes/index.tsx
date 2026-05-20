import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { ArrowRight, Brain, ClipboardList, Mail, MessageSquare, NotebookPen, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/")({
  beforeLoad: async () => {
    if (typeof window === "undefined") return;
    const { data } = await supabase.auth.getSession();
    if (data.session) throw redirect({ to: "/dashboard" });
  },
  component: Landing,
});

const features = [
  { icon: Mail, title: "Smart Email Generator", desc: "Draft polished emails in any tone, in seconds." },
  { icon: NotebookPen, title: "Meeting Notes Summarizer", desc: "Turn raw notes into decisions, action items, and questions." },
  { icon: ClipboardList, title: "AI Task Planner", desc: "Break goals into a prioritized, time-aware plan." },
  { icon: Search, title: "AI Research Assistant", desc: "Get structured briefings on any work topic." },
  { icon: MessageSquare, title: "AI Chatbot", desc: "Threaded conversations with your work copilot." },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Brain className="h-5 w-5" />
            </div>
            <span className="font-display text-base font-semibold">Workplace AI</span>
          </div>
          <Link to="/login">
            <Button variant="outline" size="sm">Sign in</Button>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-20">
        <section className="max-w-3xl">
          <p className="mb-4 inline-flex items-center rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
            AI Workplace Productivity Assistant
          </p>
          <h1 className="font-display text-5xl font-semibold tracking-tight text-foreground sm:text-6xl">
            Your calm, capable AI copilot for everyday work.
          </h1>
          <p className="mt-6 text-lg text-muted-foreground">
            Draft email, summarize meetings, plan projects, run research, and
            chat with an assistant that knows how professionals actually work.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/login">
              <Button size="lg" className="gap-2">
                Get started <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <a href="#features">
              <Button size="lg" variant="outline">See what it does</Button>
            </a>
          </div>
        </section>

        <section id="features" className="mt-24 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-card-foreground">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-6 text-xs text-muted-foreground">
          AI-generated content may be inaccurate. Always review before acting.
        </div>
      </footer>
    </div>
  );
}
