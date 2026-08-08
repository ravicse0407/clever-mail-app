import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Menu, Search, Sparkles } from "lucide-react";

import { demoEmails, type DemoEmail, type Priority } from "@/lib/demo-emails";
import { MailSidebar, folders, type FolderKey } from "@/components/mailmate/MailSidebar";
import { EmailList } from "@/components/mailmate/EmailList";
import { EmailDetail } from "@/components/mailmate/EmailDetail";
import { StatsBar } from "@/components/mailmate/StatsBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const title = "AI MailMate — AI Email Assistant Dashboard";
const description =
  "AI MailMate turns a noisy inbox into summaries, priorities, extracted tasks, deadlines, phishing risk and smart replies. Interactive demo with mock email data.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: Dashboard,
});

const priorityFilters: (Priority | "All")[] = ["All", "High", "Medium", "Low"];

function matchesFolder(email: DemoEmail, folder: FolderKey) {
  switch (folder) {
    case "high":
      return email.priority === "High";
    case "tasks":
      return email.tasks.length > 0;
    case "deadlines":
      return email.deadlines.length > 0;
    case "suspicious":
      return email.risk !== "Safe";
    default:
      return true;
  }
}

function Dashboard() {
  const [emails, setEmails] = useState<DemoEmail[]>(demoEmails);
  const [folder, setFolder] = useState<FolderKey>("inbox");
  const [query, setQuery] = useState("");
  const [priority, setPriority] = useState<Priority | "All">("All");
  const [selectedId, setSelectedId] = useState(demoEmails[0]!.id);
  const [completed, setCompleted] = useState<Record<string, string[]>>({});
  const [navOpen, setNavOpen] = useState(false);

  const counts = useMemo(
    () =>
      folders.reduce(
        (acc, f) => {
          acc[f.key] = emails.filter((e) => matchesFolder(e, f.key)).length;
          return acc;
        },
        {} as Record<FolderKey, number>,
      ),
    [emails],
  );

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return emails.filter((e) => {
      if (!matchesFolder(e, folder)) return false;
      if (priority !== "All" && e.priority !== priority) return false;
      if (!q) return true;
      return [e.sender, e.senderEmail, e.subject, e.preview, e.category, e.summary]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [emails, folder, priority, query]);

  const selected = visible.find((e) => e.id === selectedId) ?? visible[0] ?? null;

  const totalTasks = emails.reduce((n, e) => n + e.tasks.length, 0);
  const doneTasks = Object.values(completed).reduce((n, t) => n + t.length, 0);

  const selectEmail = (id: string) => {
    setSelectedId(id);
    setEmails((prev) => prev.map((e) => (e.id === id ? { ...e, unread: false } : e)));
    setNavOpen(false);
  };

  const toggleImportant = (id: string) =>
    setEmails((prev) => prev.map((e) => (e.id === id ? { ...e, important: !e.important } : e)));

  const toggleTask = (emailId: string, task: string) =>
    setCompleted((prev) => {
      const current = prev[emailId] ?? [];
      return {
        ...prev,
        [emailId]: current.includes(task)
          ? current.filter((t) => t !== task)
          : [...current, task],
      };
    });

  const sidebar = (
    <MailSidebar
      active={folder}
      counts={counts}
      onSelect={(key) => {
        setFolder(key);
        setNavOpen(false);
      }}
    />
  );

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-64 shrink-0 border-r border-sidebar-border bg-sidebar lg:block">
        {sidebar}
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="border-b border-border bg-card/80 backdrop-blur">
          <div className="flex items-center gap-3 px-4 py-3 lg:px-6">
            <Sheet open={navOpen} onOpenChange={setNavOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
                  <Menu />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 bg-sidebar p-0">
                {sidebar}
              </SheetContent>
            </Sheet>

            <div className="min-w-0 flex-1">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search demo emails, senders, summaries…"
                  className="pl-9"
                  aria-label="Search emails"
                />
              </div>
            </div>

            <div className="hidden items-center gap-1 rounded-lg border border-border bg-secondary p-1 sm:flex">
              {priorityFilters.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={cn(
                    "rounded-md px-2.5 py-1 text-xs font-semibold transition-colors",
                    priority === p
                      ? "bg-card text-foreground shadow-card"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </header>

        <main className="flex-1">
          <section className="border-b border-border bg-gradient-brand px-4 py-8 text-primary-foreground lg:px-6">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-foreground/15 px-3 py-1 text-xs font-semibold">
              <Sparkles className="size-3.5" /> Hackathon demo · mock data
            </span>
            <h1 className="mt-3 max-w-2xl text-2xl font-bold tracking-tight sm:text-3xl">
              AI MailMate reads your inbox so you only act on what matters
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-primary-foreground/80">
              Every message is auto-summarised and scored for priority, category, tasks, deadlines,
              phishing risk and sentiment — with one-click smart replies. No Gmail connection
              required.
            </p>
          </section>

          <div className="px-4 py-5 lg:px-6">
            <StatsBar
              unread={emails.filter((e) => e.unread).length}
              urgent={emails.filter((e) => e.priority === "High").length}
              tasks={totalTasks - doneTasks}
              deadlines={emails.reduce((n, e) => n + e.deadlines.length, 0)}
            />
          </div>

          <div className="grid gap-0 border-t border-border xl:grid-cols-[380px_1fr]">
            <div className="border-b border-border xl:border-b-0 xl:border-r">
              <div className="flex items-center justify-between px-4 py-3">
                <h2 className="text-sm font-semibold">
                  {folders.find((f) => f.key === folder)?.label}
                </h2>
                <span className="text-xs text-muted-foreground">{visible.length} messages</span>
              </div>
              <div className="max-h-[70vh] overflow-y-auto border-t border-border">
                <EmailList
                  emails={visible}
                  selectedId={selected?.id ?? ""}
                  onSelect={selectEmail}
                />
              </div>
            </div>

            <div className="min-w-0">
              {selected ? (
                <EmailDetail
                  email={selected}
                  onToggleImportant={toggleImportant}
                  onToggleTask={toggleTask}
                  completedTasks={completed[selected.id] ?? []}
                />
              ) : (
                <div className="p-10 text-center text-sm text-muted-foreground">
                  Select an email to see its AI analysis.
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
