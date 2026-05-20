import { type ReactNode } from "react";
import { Copy, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AiDisclaimer } from "@/components/ai-disclaimer";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";

export function ToolHeader({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
        {icon}
      </div>
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

export function ToolOutput({
  value,
  onChange,
  loading,
  empty,
  renderMarkdown = false,
}: {
  value: string;
  onChange: (v: string) => void;
  loading: boolean;
  empty: string;
  renderMarkdown?: boolean;
}) {
  return (
    <div className="rounded-xl border border-border bg-card shadow-sm">
      <div className="flex items-center justify-between border-b border-border px-4 py-2">
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          AI output {value && "(editable)"}
        </span>
        <div className="flex items-center gap-2">
          {loading && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Loader2 className="h-3 w-3 animate-spin" /> Generating
            </span>
          )}
          {value && !loading && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                navigator.clipboard.writeText(value);
                toast.success("Copied to clipboard");
              }}
            >
              <Copy className="mr-1 h-3 w-3" /> Copy
            </Button>
          )}
        </div>
      </div>
      {value ? (
        <div className="grid gap-0 lg:grid-cols-2">
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="min-h-[360px] resize-none rounded-none border-0 border-r border-border bg-transparent font-mono text-sm focus-visible:ring-0"
          />
          <div className="min-h-[360px] overflow-auto px-5 py-4 text-sm">
            {renderMarkdown ? (
              <div className="prose prose-sm dark:prose-invert max-w-none prose-headings:font-display">
                <ReactMarkdown>{value}</ReactMarkdown>
              </div>
            ) : (
              <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">{value}</pre>
            )}
          </div>
        </div>
      ) : (
        <div className="flex min-h-[240px] items-center justify-center px-6 py-12 text-center text-sm text-muted-foreground">
          {empty}
        </div>
      )}
      <div className="border-t border-border p-3">
        <AiDisclaimer />
      </div>
    </div>
  );
}
