import { CalendarClock, CheckSquare, Flame, Mail } from "lucide-react";

interface Props {
  unread: number;
  urgent: number;
  tasks: number;
  deadlines: number;
}

export function StatsBar({ unread, urgent, tasks, deadlines }: Props) {
  const stats = [
    { label: "Unread emails", value: unread, icon: Mail, tone: "text-primary bg-brand-soft" },
    { label: "Urgent emails", value: urgent, icon: Flame, tone: "text-high bg-high-soft" },
    { label: "Pending tasks", value: tasks, icon: CheckSquare, tone: "text-medium bg-medium-soft" },
    {
      label: "Deadlines tracked",
      value: deadlines,
      icon: CalendarClock,
      tone: "text-low bg-low-soft",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {stats.map(({ label, value, icon: Icon, tone }) => (
        <div key={label} className="rounded-xl border border-border bg-card p-4 shadow-card">
          <div className="flex items-center gap-3">
            <span className={`flex size-9 items-center justify-center rounded-lg ${tone}`}>
              <Icon className="size-4.5" />
            </span>
            <div>
              <p className="text-2xl font-bold leading-none tabular-nums">{value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{label}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
