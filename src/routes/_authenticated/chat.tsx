import { createFileRoute, Outlet, useNavigate, useParams, Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { MessageSquare, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { listThreads, createThread, deleteThread } from "@/lib/chat.functions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/chat")({
  component: ChatLayout,
});

type Thread = { id: string; title: string; created_at: string; updated_at: string };

function ChatLayout() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const list = useServerFn(listThreads);
  const create = useServerFn(createThread);
  const del = useServerFn(deleteThread);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    try {
      const rows = await list();
      setThreads(rows as Thread[]);
      return rows as Thread[];
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load conversations");
      return [];
    }
  };

  useEffect(() => {
    (async () => {
      const rows = await refresh();
      setLoading(false);
      if (pathname === "/chat" && rows.length === 0) {
        const t = await create({ data: {} });
        await refresh();
        navigate({ to: "/chat/$threadId", params: { threadId: t.id } });
      } else if (pathname === "/chat" && rows.length > 0) {
        navigate({ to: "/chat/$threadId", params: { threadId: rows[0].id } });
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onNew = async () => {
    const t = await create({ data: {} });
    await refresh();
    navigate({ to: "/chat/$threadId", params: { threadId: t.id } });
  };

  const onDelete = async (id: string) => {
    await del({ data: { threadId: id } });
    const rest = await refresh();
    if (pathname.includes(id)) {
      if (rest.length > 0) navigate({ to: "/chat/$threadId", params: { threadId: rest[0].id } });
      else {
        const t = await create({ data: {} });
        await refresh();
        navigate({ to: "/chat/$threadId", params: { threadId: t.id } });
      }
    }
  };

  return (
    <div className="flex h-[calc(100vh-3.5rem)] w-full">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-muted/30 md:flex">
        <div className="flex items-center justify-between border-b border-border px-3 py-3">
          <div className="flex items-center gap-1.5 text-sm font-semibold">
            <MessageSquare className="h-4 w-4" /> Conversations
          </div>
          <Button size="icon" variant="ghost" className="h-7 w-7" onClick={onNew} title="New chat">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-0.5">
            {loading && <div className="px-3 py-2 text-xs text-muted-foreground">Loading…</div>}
            {!loading && threads.length === 0 && (
              <div className="px-3 py-2 text-xs text-muted-foreground">No conversations yet</div>
            )}
            {threads.map((t) => {
              const active = pathname === `/chat/${t.id}`;
              return (
                <div
                  key={t.id}
                  className={cn(
                    "group flex items-center gap-1 rounded-md px-2 py-1.5 text-sm",
                    active ? "bg-secondary text-secondary-foreground" : "hover:bg-secondary/60",
                  )}
                >
                  <Link
                    to="/chat/$threadId"
                    params={{ threadId: t.id }}
                    className="flex-1 truncate"
                  >
                    {t.title || "New conversation"}
                  </Link>
                  <button
                    type="button"
                    onClick={() => onDelete(t.id)}
                    className="opacity-0 transition group-hover:opacity-100 text-muted-foreground hover:text-destructive"
                    title="Delete"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </aside>

      <div className="flex flex-1 flex-col min-w-0">
        <Outlet />
      </div>
    </div>
  );
}

// expose helper for child route to refresh sidebar after rename
export function useChatThreadsParam() {
  return useParams({ strict: false });
}
