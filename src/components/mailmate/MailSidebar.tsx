import { cn } from "@/lib/utils";
import { AlertTriangle, CalendarClock, CheckSquare, Flame, Inbox, Sparkles } from "lucide-react";

export type FolderKey = "inbox" | "high" | "tasks" | "deadlines" | "suspicious";

export const folders: { key: FolderKey; label: string; icon: typeof Inbox }[] = [
  { key: "inbox", label: "Inbox", icon: Inbox },
  { key: "high", label: "High Priority", icon: Flame },
  { key: "tasks", label: "Tasks", icon: CheckSquare },
  { key: "deadlines", label: "Deadlines", icon: CalendarClock },
  { key: "suspicious", label: "Suspicious", icon: AlertTriangle },
];

interface Props {
  active: FolderKey;
  counts: Record<FolderKey, number>;
  onSelect: (key: FolderKey) => void;
}

export function MailSidebar({ active, counts, onSelect }: Props) {
  return (
    <nav className="flex h-full flex-col gap-6 p-4" aria-label="Mail folders">
      <div className="flex items-center gap-3 px-2 pt-1">
        <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-brand shadow-float">
          <Sparkles className="size-5 text-primary-foreground" />
        </div>
        <div className="leading-tight">
          <p className="text-sm font-bold tracking-tight">AI MailMate</p>
          <p className="text-xs text-muted-foreground">Email Assistant</p>
        </div>
      </div>

      <ul className="flex flex-col gap-1">
        {folders.map(({ key, label, icon: Icon }) => {
          const isActive = key === active;
          return (
            <li key={key}>
              <button
                type="button"
                onClick={() => onSelect(key)}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                )}
              >
                <Icon className="size-4 shrink-0" />
                <span className="flex-1 text-left">{label}</span>
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums",
                    isActive ? "bg-primary text-primary-foreground" : "bg-secondary",
                  )}
                >
                  {counts[key]}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="mt-auto rounded-xl border border-border bg-brand-soft p-3">
        <p className="text-xs font-semibold text-accent-foreground">Demo mode</p>
        <p className="mt-1 text-xs text-muted-foreground">
          All emails and AI output are mock data. No mailbox is connected.
        </p>
      </div>
    </nav>
  );
}
