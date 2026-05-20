import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Search, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { research } from "@/lib/tools.functions";
import { ToolHeader, ToolOutput } from "@/components/tool-page";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/research")({ component: ResearchTool });

function ResearchTool() {
  const run = useServerFn(research);
  const [topic, setTopic] = useState("");
  const [depth, setDepth] = useState<"brief" | "standard" | "deep">("standard");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const onGenerate = async () => {
    if (topic.trim().length < 3) { toast.error("Enter a research topic."); return; }
    setLoading(true);
    try {
      const res = await run({ data: { topic, depth } });
      setOutput(res.text);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Research failed");
    } finally { setLoading(false); }
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-10 space-y-6">
      <ToolHeader
        icon={<Search className="h-5 w-5" />}
        title="AI Research Assistant"
        description="Get a structured briefing — overview, key points, trade-offs, and next steps."
      />

      <div className="grid gap-4 rounded-xl border border-border bg-card p-5 shadow-sm md:grid-cols-3">
        <div className="md:col-span-2 space-y-1.5">
          <Label>Topic or question</Label>
          <Textarea rows={3} value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g. How should a 50-person SaaS team adopt OKRs?" />
        </div>
        <div className="space-y-1.5">
          <Label>Depth</Label>
          <Select value={depth} onValueChange={(v) => setDepth(v as typeof depth)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="brief">Brief</SelectItem>
              <SelectItem value="standard">Standard</SelectItem>
              <SelectItem value="deep">Deep</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="md:col-span-3">
          <Button onClick={onGenerate} disabled={loading} className="gap-2">
            <Wand2 className="h-4 w-4" /> {loading ? "Researching…" : "Run research"}
          </Button>
        </div>
      </div>

      <ToolOutput
        value={output}
        onChange={setOutput}
        loading={loading}
        renderMarkdown
        empty="Your briefing will appear here."
      />
    </div>
  );
}
