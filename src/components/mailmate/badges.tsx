import type { Priority, Risk, Sentiment } from "@/lib/demo-emails";
import { cn } from "@/lib/utils";
import { ShieldAlert, ShieldCheck, ShieldX } from "lucide-react";

const priorityClasses: Record<Priority, string> = {
  High: "bg-high-soft text-high border-high/20",
  Medium: "bg-medium-soft text-medium border-medium/25",
  Low: "bg-low-soft text-low border-low/20",
};

export function PriorityBadge({ priority, className }: { priority: Priority; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        priorityClasses[priority],
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {priority}
    </span>
  );
}

const riskMeta: Record<Risk, { className: string; Icon: typeof ShieldCheck }> = {
  Safe: { className: "bg-low-soft text-low border-low/20", Icon: ShieldCheck },
  Suspicious: { className: "bg-medium-soft text-medium border-medium/25", Icon: ShieldAlert },
  Phishing: { className: "bg-high-soft text-high border-high/20", Icon: ShieldX },
};

export function RiskBadge({ risk, className }: { risk: Risk; className?: string }) {
  const { className: tone, Icon } = riskMeta[risk];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        tone,
        className,
      )}
    >
      <Icon className="size-3.5" />
      {risk}
    </span>
  );
}

export function CategoryBadge({ category }: { category: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-border bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
      {category}
    </span>
  );
}

const sentimentTone: Record<Sentiment, string> = {
  Positive: "text-low",
  Neutral: "text-muted-foreground",
  Negative: "text-high",
  Urgent: "text-medium",
};

export function SentimentTag({ sentiment }: { sentiment: Sentiment }) {
  return (
    <span className={cn("text-sm font-semibold", sentimentTone[sentiment])}>{sentiment}</span>
  );
}
