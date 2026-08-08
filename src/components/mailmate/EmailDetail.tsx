import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  CalendarClock,
  CheckSquare,
  Copy,
  Loader2,
  Sparkles,
  Star,
  Wand2,
} from "lucide-react";

import type { DemoEmail } from "@/lib/demo-emails";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { CategoryBadge, PriorityBadge, RiskBadge, SentimentTag } from "./badges";

interface Props {
  email: DemoEmail;
  onToggleImportant: (id: string) => void;
  onToggleTask: (emailId: string, task: string) => void;
  completedTasks: string[];
}

function Section({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: typeof Sparkles;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-border bg-card p-4 shadow-card">
      <h3 className="flex items-center gap-2 text-sm font-semibold">
        <Icon className="size-4 text-primary" />
        {title}
      </h3>
      <div className="mt-3">{children}</div>
    </section>
  );
}

export function EmailDetail({ email, onToggleImportant, onToggleTask, completedTasks }: Props) {
  const [reply, setReply] = useState("");
  const [generating, setGenerating] = useState(false);
  const [toneIndex, setToneIndex] = useState(0);

  useEffect(() => {
    setReply("");
    setToneIndex(0);
    setGenerating(false);
  }, [email.id]);

  const generate = (index = toneIndex) => {
    setGenerating(true);
    const next = email.replies[index % email.replies.length];
    window.setTimeout(() => {
      setReply(next.text);
      setGenerating(false);
      toast.success(`Demo reply generated · ${next.tone} tone`);
    }, 700);
  };

  const copyReply = async () => {
    const text = reply || email.replies[0].text;
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Reply copied to clipboard");
    } catch {
      toast.error("Clipboard unavailable in this browser");
    }
  };

  return (
    <div className="flex h-full flex-col gap-4 overflow-y-auto p-4 lg:p-6">
      <header className="rounded-xl border border-border bg-card p-5 shadow-card">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-lg font-bold leading-snug">{email.subject}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {email.sender} · {email.senderEmail} · {email.receivedAt}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <PriorityBadge priority={email.priority} />
            <CategoryBadge category={email.category} />
            <RiskBadge risk={email.risk} />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Button onClick={() => generate()} disabled={generating}>
            {generating ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Wand2 />
            )}
            Generate Reply
          </Button>
          <Button variant="outline" onClick={copyReply}>
            <Copy />
            Copy Reply
          </Button>
          <Button
            variant={email.important ? "default" : "outline"}
            onClick={() => {
              onToggleImportant(email.id);
              toast(email.important ? "Removed from important" : "Marked as important");
            }}
          >
            <Star className={cn(email.important && "fill-current")} />
            {email.important ? "Important" : "Mark Important"}
          </Button>
        </div>
      </header>

      <Section title="AI summary" icon={Sparkles}>
        <p className="text-sm leading-relaxed text-muted-foreground">{email.summary}</p>
        <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <div>
            <dt className="text-xs text-muted-foreground">Sentiment</dt>
            <dd className="mt-0.5">
              <SentimentTag sentiment={email.sentiment} />
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Category</dt>
            <dd className="mt-0.5 text-sm font-semibold">{email.category}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Risk signal</dt>
            <dd className="mt-0.5 text-sm font-semibold">{email.risk}</dd>
          </div>
        </dl>
        <p className="mt-3 rounded-lg bg-secondary p-3 text-xs text-muted-foreground">
          {email.riskNote}
        </p>
      </Section>

      <div className="grid gap-4 xl:grid-cols-2">
        <Section title="Extracted tasks" icon={CheckSquare}>
          {email.tasks.length === 0 ? (
            <p className="text-sm text-muted-foreground">No action items detected.</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {email.tasks.map((task) => {
                const done = completedTasks.includes(task);
                return (
                  <li key={task}>
                    <label className="flex cursor-pointer items-start gap-2.5 text-sm">
                      <input
                        type="checkbox"
                        checked={done}
                        onChange={() => onToggleTask(email.id, task)}
                        className="mt-0.5 size-4 accent-primary"
                      />
                      <span className={cn(done && "text-muted-foreground line-through")}>
                        {task}
                      </span>
                    </label>
                  </li>
                );
              })}
            </ul>
          )}
        </Section>

        <Section title="Deadlines" icon={CalendarClock}>
          {email.deadlines.length === 0 ? (
            <p className="text-sm text-muted-foreground">No dates detected.</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {email.deadlines.map((d) => (
                <li
                  key={d.label}
                  className="flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-2"
                >
                  <span className="text-sm">{d.label}</span>
                  <span className="shrink-0 text-xs font-semibold text-primary">{d.due}</span>
                </li>
              ))}
            </ul>
          )}
        </Section>
      </div>

      <Section title="Smart replies" icon={Wand2}>
        <div className="flex flex-wrap gap-2">
          {email.replies.map((r, i) => (
            <Button
              key={r.tone}
              size="sm"
              variant={i === toneIndex && reply ? "default" : "secondary"}
              onClick={() => {
                setToneIndex(i);
                generate(i);
              }}
            >
              {r.tone}
            </Button>
          ))}
        </div>
        <Textarea
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          rows={7}
          placeholder="Generate a reply or start writing — this is a demo composer."
          className="mt-3 resize-none"
        />
        <div className="mt-3 flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={copyReply}>
            <Copy />
            Copy Reply
          </Button>
          <Button
            size="sm"
            onClick={() => toast.success("Demo send: reply queued (no mailbox connected)")}
            disabled={!reply}
          >
            Send (demo)
          </Button>
        </div>
      </Section>

      <Section title="Original message" icon={CheckSquare}>
        <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-muted-foreground">
          {email.body}
        </pre>
      </Section>
    </div>
  );
}
