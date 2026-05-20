import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { ClipboardList, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { planTasks } from "@/lib/tools.functions";
import { ToolHeader, ToolOutput } from "@/components/tool-page";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/planner")({ component: PlannerTool });

function PlannerTool() {
  const run = useServerFn(planTasks);
  const [goal, setGoal] = useState("");
  const [deadline, setDeadline] = useState("");
  const [context, setContext] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const onGenerate = async () => {
    if (goal.trim().length < 5) { toast.error("Describe your goal."); return; }
    setLoading(true);
    try {
      const res = await run({ data: { goal, deadline, context } });
      setOutput(res.text);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Planning failed");
    } finally { setLoading(false); }
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-10 space-y-6">
      <ToolHeader
        icon={<ClipboardList className="h-5 w-5" />}
        title="AI Task Planner"
        description="Turn a fuzzy goal into a prioritized, time-aware action plan."
      />

      <div className="grid gap-4 rounded-xl border border-border bg-card p-5 shadow-sm md:grid-cols-2">
        <div className="md:col-span-2 space-y-1.5">
          <Label>Goal</Label>
          <Textarea rows={3} value={goal} onChange={(e) => setGoal(e.target.value)} placeholder="e.g. Launch the new pricing page" />
        </div>
        <div className="space-y-1.5">
          <Label>Deadline (optional)</Label>
          <Input value={deadline} onChange={(e) => setDeadline(e.target.value)} placeholder="e.g. in 3 weeks" />
        </div>
        <div className="md:col-span-2 space-y-1.5">
          <Label>Context (optional)</Label>
          <Textarea rows={3} value={context} onChange={(e) => setContext(e.target.value)} placeholder="Team, constraints, dependencies…" />
        </div>
        <div className="md:col-span-2">
          <Button onClick={onGenerate} disabled={loading} className="gap-2">
            <Wand2 className="h-4 w-4" /> {loading ? "Planning…" : "Generate plan"}
          </Button>
        </div>
      </div>

      <ToolOutput
        value={output}
        onChange={setOutput}
        loading={loading}
        renderMarkdown
        empty="Your prioritized plan will appear here."
      />
    </div>
  );
}
