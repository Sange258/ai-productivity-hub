import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Mail, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { generateEmail } from "@/lib/tools.functions";
import { ToolHeader, ToolOutput } from "@/components/tool-page";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/email")({ component: EmailTool });

function EmailTool() {
  const run = useServerFn(generateEmail);
  const [recipient, setRecipient] = useState("");
  const [subject, setSubject] = useState("");
  const [tone, setTone] = useState("professional");
  const [intent, setIntent] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const onGenerate = async () => {
    if (intent.trim().length < 3) {
      toast.error("Describe what you want to communicate.");
      return;
    }
    setLoading(true);
    try {
      const res = await run({ data: { recipient, subject, tone, intent } });
      setOutput(res.text);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Generation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-10 space-y-6">
      <ToolHeader
        icon={<Mail className="h-5 w-5" />}
        title="Smart Email Generator"
        description="Draft a clear, well-toned email in seconds. You can edit the result before sending."
      />

      <div className="grid gap-4 rounded-xl border border-border bg-card p-5 shadow-sm md:grid-cols-2">
        <div className="space-y-1.5">
          <Label>Recipient</Label>
          <Input value={recipient} onChange={(e) => setRecipient(e.target.value)} placeholder="e.g. Maria, my manager" />
        </div>
        <div className="space-y-1.5">
          <Label>Subject (optional)</Label>
          <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Leave empty to auto-generate" />
        </div>
        <div className="space-y-1.5">
          <Label>Tone</Label>
          <Select value={tone} onValueChange={setTone}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {["professional", "friendly", "concise", "formal", "apologetic", "persuasive", "enthusiastic"].map((t) => (
                <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="md:col-span-2 space-y-1.5">
          <Label>What do you want to say?</Label>
          <Textarea
            rows={5}
            value={intent}
            onChange={(e) => setIntent(e.target.value)}
            placeholder="Bullet points or a rough draft — anything is fine."
          />
        </div>
        <div className="md:col-span-2">
          <Button onClick={onGenerate} disabled={loading} className="gap-2">
            <Wand2 className="h-4 w-4" /> {loading ? "Generating…" : "Generate email"}
          </Button>
        </div>
      </div>

      <ToolOutput
        value={output}
        onChange={setOutput}
        loading={loading}
        empty="Your AI-drafted email will appear here. You can edit it before copying."
      />
    </div>
  );
}
