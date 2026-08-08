import type { DemoEmail, Priority, Risk, Sentiment } from "./demo-emails";

export interface AnalysisInput {
  senderEmail: string;
  subject: string;
  body: string;
}

const URGENT_WORDS = [
  "urgent",
  "immediately",
  "asap",
  "deadline",
  "today",
  "tomorrow",
  "due",
  "signature needed",
  "payment",
  "invoice",
  "board",
];

const MEDIUM_WORDS = ["review", "feedback", "confirm", "schedule", "handoff", "form", "slides"];

const LOW_WORDS = ["newsletter", "unsubscribe", "weekly", "digest", "no reply required"];

const CATEGORY_RULES: { category: string; keywords: string[] }[] = [
  { category: "Security Alert", keywords: ["verify your credentials", "deactivated", "sign-in activity", "password"] },
  { category: "Billing", keywords: ["invoice", "payment terms", "bank details", "billing"] },
  { category: "Contracts", keywords: ["contract", "msa", "agreement", "renewal", "redline"] },
  { category: "Finance", keywords: ["board deck", "revenue", "churn", "pipeline"] },
  { category: "Design", keywords: ["figma", "design", "screens", "mockup"] },
  { category: "Events", keywords: ["speaker", "conference", "talk", "travel form"] },
  { category: "Newsletter", keywords: ["unsubscribe", "this week", "weekly"] },
];

const SUSPICIOUS_DOMAIN_HINTS = ["verify", "secure-", "-secure", "login", "account-"];

const TASK_PATTERNS = [
  /^\s*(?:[-*•]|\d+[.)])\s*(.+)$/,
  /\b(?:please|kindly|could you|can you|need(?:s)? (?:you )?to|make sure to)\s+(.+)$/i,
];

const DEADLINE_PATTERNS: RegExp[] = [
  /\b(?:by|before|due|on)\s+((?:next\s+)?(?:monday|tuesday|wednesday|thursday|friday|saturday|sunday)(?:\s+at\s+[\d:apm.]+)?)/gi,
  /\b(?:by|before|due|on)\s+(the\s+\d{1,2}(?:st|nd|rd|th))/gi,
  /\b(?:by|before|due|on)\s+(\d{1,2}(?::\d{2})?\s*(?:am|pm)(?:\s+[a-z]{2,4})?)/gi,
  /\b(?:by|before|due|on)\s+(today|tomorrow)\b/gi,
];

function haystack(input: AnalysisInput) {
  return `${input.subject}\n${input.body}`.toLowerCase();
}

/** Heuristic priority scoring: High / Medium / Low. */
export function detectPriority(input: AnalysisInput): Priority {
  const text = haystack(input);
  if (classifyRisk(input) === "Phishing") return "Low";

  const urgent = URGENT_WORDS.filter((w) => text.includes(w)).length;
  const medium = MEDIUM_WORDS.filter((w) => text.includes(w)).length;
  const low = LOW_WORDS.filter((w) => text.includes(w)).length;

  if (low > 0 && urgent === 0) return "Low";
  if (urgent >= 2) return "High";
  if (urgent === 1 || medium > 0) return "Medium";
  return "Low";
}

/** Extract action items from bullet lists and imperative phrasing. */
export function extractTasks(input: AnalysisInput): string[] {
  const tasks: string[] = [];
  for (const rawLine of input.body.split("\n")) {
    const line = rawLine.trim();
    if (!line) continue;
    for (const pattern of TASK_PATTERNS) {
      const match = line.match(pattern);
      const captured = match?.[1]?.trim().replace(/[.]+$/, "");
      if (captured) {
        tasks.push(captured);
        break;
      }
    }
  }
  return Array.from(new Set(tasks));
}

/** Extract date-like deadline phrases from the message body. */
export function extractDeadlines(input: AnalysisInput): string[] {
  const found: string[] = [];
  const text = `${input.subject}\n${input.body}`;
  for (const pattern of DEADLINE_PATTERNS) {
    for (const match of text.matchAll(pattern)) {
      const value = match[1]?.trim();
      if (value) found.push(value.toLowerCase());
    }
  }
  return Array.from(new Set(found));
}

/** Rule-based category assignment with an "General" fallback. */
export function categorize(input: AnalysisInput): string {
  const text = haystack(input);
  for (const rule of CATEGORY_RULES) {
    if (rule.keywords.some((k) => text.includes(k))) return rule.category;
  }
  return "General";
}

/** Phishing / suspicious / safe classification. */
export function classifyRisk(input: AnalysisInput): Risk {
  const text = haystack(input);
  const domain = input.senderEmail.split("@")[1]?.toLowerCase() ?? "";
  const lookalikeDomain = SUSPICIOUS_DOMAIN_HINTS.some((hint) => domain.includes(hint));
  const credentialBait =
    text.includes("verify your credentials") ||
    text.includes("re-validate") ||
    text.includes("deactivated") ||
    text.includes("data loss");
  const bankChange = text.includes("bank details") || text.includes("payment terms changed");

  if (lookalikeDomain && credentialBait) return "Phishing";
  if (lookalikeDomain || credentialBait) return "Suspicious";
  if (bankChange) return "Suspicious";
  return "Safe";
}

/** Coarse sentiment read used by the demo UI badges. */
export function detectSentiment(input: AnalysisInput): Sentiment {
  const text = haystack(input);
  if (/(congratulations|great|delighted|looks great|thanks so much)/.test(text)) return "Positive";
  if (/(urgent|immediately|asap|closes friday|24 hours)/.test(text)) return "Urgent";
  if (/(failure|loss|problem|issue|flagged|complaint)/.test(text)) return "Negative";
  return "Neutral";
}

export interface Analysis {
  priority: Priority;
  category: string;
  tasks: string[];
  deadlines: string[];
  risk: Risk;
  sentiment: Sentiment;
}

export function analyzeEmail(input: AnalysisInput): Analysis {
  return {
    priority: detectPriority(input),
    category: categorize(input),
    tasks: extractTasks(input),
    deadlines: extractDeadlines(input),
    risk: classifyRisk(input),
    sentiment: detectSentiment(input),
  };
}

/** Pick a smart reply for a tone index, wrapping around available replies. */
export function pickReply(email: DemoEmail, toneIndex: number) {
  if (email.replies.length === 0) return null;
  return email.replies[Math.abs(toneIndex) % email.replies.length] ?? null;
}
