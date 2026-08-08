import type { DemoEmail } from "@/lib/demo-emails";
import { cn } from "@/lib/utils";
import { PriorityBadge } from "./badges";
import { MailX, Star } from "lucide-react";

interface Props {
  emails: DemoEmail[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export function EmailList({ emails, selectedId, onSelect }: Props) {
  if (emails.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 p-10 text-center">
        <MailX className="size-7 text-muted-foreground" />
        <p className="text-sm font-medium">No emails match this view</p>
        <p className="text-xs text-muted-foreground">Try another folder, filter, or search term.</p>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-border">
      {emails.map((email) => {
        const isActive = email.id === selectedId;
        return (
          <li key={email.id}>
            <button
              type="button"
              onClick={() => onSelect(email.id)}
              className={cn(
                "w-full px-4 py-3.5 text-left transition-colors",
                isActive ? "bg-brand-soft" : "hover:bg-secondary/70",
              )}
            >
              <div className="flex items-center gap-2">
                {email.unread && <span className="size-2 shrink-0 rounded-full bg-primary" />}
                <p
                  className={cn(
                    "truncate text-sm",
                    email.unread ? "font-semibold" : "font-medium text-muted-foreground",
                  )}
                >
                  {email.sender}
                </p>
                {email.important && <Star className="size-3.5 shrink-0 fill-medium text-medium" />}
                <span className="ml-auto shrink-0 text-xs text-muted-foreground">
                  {email.receivedAt}
                </span>
              </div>
              <p className="mt-1 truncate text-sm font-medium">{email.subject}</p>
              <p className="mt-0.5 truncate text-xs text-muted-foreground">{email.preview}</p>
              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                <PriorityBadge priority={email.priority} />
                <span className="text-xs text-muted-foreground">{email.category}</span>
                {email.tasks.length > 0 && (
                  <span className="text-xs text-muted-foreground">
                    · {email.tasks.length} task{email.tasks.length > 1 ? "s" : ""}
                  </span>
                )}
              </div>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
