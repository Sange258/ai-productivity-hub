import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { NotebookPen, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { summarizeNotes } from "@/lib/tools.functions";
import { ToolHeader, ToolOutput } from "@/components/tool-page";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/notes")({ component: NotesTool });

function NotesTool() {
  const run = useServerFn(summarizeNotes);
  const [notes, setNotes] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const onGenerate = async () => {
    if (notes.trim().length < 10) { toast.error("Paste your meeting notes first."); return; }
    setLoading(true);
    try {
      const res = await run({ data: { notes } });
      setOutput(res.text);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Summarization failed");
    } finally { setLoading(false); }
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-10 space-y-6">
      <ToolHeader
        icon={<NotebookPen className="h-5 w-5" />}
        title="Meeting Notes Summarizer"
        description="Paste raw notes or a transcript. Get a clean summary, decisions, action items, and open questions."
      />

      <div className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-3">
        <Label>Meeting notes or transcript</Label>
        <Textarea
          rows={10}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Paste the raw notes here…"
          className="font-mono text-sm"
        />
        <Button onClick={onGenerate} disabled={loading} className="gap-2">
          <Wand2 className="h-4 w-4" /> {loading ? "Summarizing…" : "Summarize"}
        </Button>
      </div>

      <ToolOutput
        value={output}
        onChange={setOutput}
        loading={loading}
        renderMarkdown
        empty="Your structured summary will appear here."
      />
    </div>
  );
}
