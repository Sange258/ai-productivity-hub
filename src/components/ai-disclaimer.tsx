import { ShieldAlert } from "lucide-react";

export function AiDisclaimer({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex items-start gap-2 rounded-md border border-border bg-muted/50 px-3 py-2 text-xs text-muted-foreground ${className}`}
    >
      <ShieldAlert className="h-3.5 w-3.5 mt-0.5 shrink-0" />
      <p>
        AI-generated output may be inaccurate or incomplete. Review before
        sending, sharing, or acting on it. Do not paste confidential or
        regulated information you are not authorized to share.
      </p>
    </div>
  );
}
