export type Priority = "High" | "Medium" | "Low";
export type Risk = "Safe" | "Suspicious" | "Phishing";
export type Sentiment = "Positive" | "Neutral" | "Negative" | "Urgent";

export interface DemoEmail {
  id: string;
  sender: string;
  senderEmail: string;
  subject: string;
  preview: string;
  body: string;
  receivedAt: string;
  unread: boolean;
  important: boolean;
  priority: Priority;
  category: string;
  summary: string;
  tasks: string[];
  deadlines: { label: string; due: string }[];
  risk: Risk;
  riskNote: string;
  sentiment: Sentiment;
  replies: { tone: string; text: string }[];
}

export const demoEmails: DemoEmail[] = [
  {
    id: "1",
    sender: "Priya Nair",
    senderEmail: "priya.nair@northwind.io",
    subject: "Contract renewal — signature needed before Friday",
    preview: "Legal cleared the redlines. We just need your signature on page 12…",
    body: `Hi,

Legal has cleared the redlines on the Northwind master services agreement. The only outstanding item is your signature on page 12 and the updated billing contact on Schedule B.

Our procurement window closes Friday at 5pm IST — if we miss it the renewal slips a full quarter.

Could you also confirm whether the support tier stays at Platinum?

Thanks,
Priya`,
    receivedAt: "9:12 AM",
    unread: true,
    important: true,
    priority: "High",
    category: "Contracts",
    summary:
      "Northwind's renewal contract is fully redlined and only needs your signature on page 12 plus an updated billing contact. Procurement closes Friday 5pm IST; missing it delays renewal by a quarter. Priya also asks to confirm the Platinum support tier.",
    tasks: [
      "Sign page 12 of the Northwind MSA",
      "Update billing contact on Schedule B",
      "Confirm Platinum support tier",
    ],
    deadlines: [{ label: "Signature + procurement window", due: "Friday, 5:00 PM IST" }],
    risk: "Safe",
    riskNote: "Known domain, prior thread history, no suspicious links.",
    sentiment: "Urgent",
    replies: [
      {
        tone: "Confirm",
        text: "Hi Priya,\n\nThanks for pushing this through legal. I'll sign page 12 and send the updated Schedule B billing contact today so we're well inside the Friday window. Confirming we'd like to stay on the Platinum support tier.\n\nBest,",
      },
      {
        tone: "Need a day",
        text: "Hi Priya,\n\nGot it — I'm reviewing page 12 now and will have the signature back to you by Thursday morning, ahead of the procurement cutoff. Platinum tier is confirmed on our side.\n\nBest,",
      },
    ],
  },
  {
    id: "2",
    sender: "Secure Account Team",
    senderEmail: "no-reply@account-verify-secure.net",
    subject: "Urgent: your mailbox will be deactivated in 24 hours",
    preview: "Verify your credentials immediately to avoid permanent loss of access…",
    body: `Dear User,

Our system has detected unusual sign-in activity on your account. Your mailbox will be permanently deactivated within 24 hours unless you verify your credentials.

Click here to re-validate: http://account-verify-secure.net/login

Failure to comply will result in irreversible data loss.

Account Security Department`,
    receivedAt: "8:47 AM",
    unread: true,
    important: false,
    priority: "Low",
    category: "Security Alert",
    summary:
      "Claims your mailbox will be deactivated in 24 hours and pushes you to a credential form on an unrelated domain. Classic urgency-plus-credential-harvest pattern — do not click.",
    tasks: ["Report to IT security", "Do not click the verification link"],
    deadlines: [],
    risk: "Phishing",
    riskNote:
      "Look-alike sender domain, unauthenticated SPF/DKIM, artificial 24-hour deadline, credential form on non-corporate host.",
    sentiment: "Negative",
    replies: [
      {
        tone: "Report internally",
        text: "Hi Security team,\n\nForwarding a phishing attempt received this morning from account-verify-secure.net. It impersonates our mail provider and links to a credential form. No links were clicked. Please blocklist the domain.\n\nThanks,",
      },
    ],
  },
  {
    id: "3",
    sender: "Marcus Webb",
    senderEmail: "marcus@brightlayer.design",
    subject: "Design handoff — v3 screens are in Figma",
    preview: "All 14 screens are componentised. Dev notes are on the right panel…",
    body: `Hey,

v3 is live in Figma. All 14 screens are componentised, tokens are named to match your Tailwind setup, and dev notes sit in the right-hand panel of each frame.

Two open questions:
1. Do you want the empty states illustrated or typographic?
2. Should the mobile nav collapse to a bottom bar?

I can lock the file Monday if there's no further feedback.`,
    receivedAt: "Yesterday",
    unread: true,
    important: false,
    priority: "Medium",
    category: "Design",
    summary:
      "Design v3 is delivered in Figma with componentised screens and dev notes. Marcus needs decisions on empty-state style and mobile nav pattern, and plans to lock the file Monday.",
    tasks: [
      "Decide illustrated vs typographic empty states",
      "Decide on mobile bottom-bar navigation",
      "Review v3 Figma before file lock",
    ],
    deadlines: [{ label: "Feedback before file lock", due: "Monday" }],
    risk: "Safe",
    riskNote: "Verified sender, ongoing project thread.",
    sentiment: "Positive",
    replies: [
      {
        tone: "Decisive",
        text: "Hi Marcus,\n\nv3 looks great. Let's go typographic on empty states to keep the build light, and yes to the bottom bar on mobile. I'll finish my pass by Sunday evening so you can lock Monday.\n\nThanks,",
      },
      {
        tone: "Ask for a call",
        text: "Hi Marcus,\n\nThanks for the handoff. Can we take 15 minutes tomorrow on the empty states and mobile nav? I'd rather decide together before you lock the file Monday.\n\nBest,",
      },
    ],
  },
  {
    id: "4",
    sender: "Aisha Rahman",
    senderEmail: "aisha.rahman@vertexcap.com",
    subject: "Q3 board deck — numbers due Tuesday",
    preview: "I need the revenue and churn slides from your side by Tuesday noon…",
    body: `Hi,

Board meets Thursday. I need your revenue, churn and pipeline slides by Tuesday noon so I can build the narrative around them.

Please use the template in the shared drive and keep it to three slides. If the churn number is still moving, send me the range and I'll footnote it.

Aisha`,
    receivedAt: "Yesterday",
    unread: false,
    important: true,
    priority: "High",
    category: "Finance",
    summary:
      "Aisha needs your revenue, churn and pipeline slides by Tuesday noon for Thursday's board meeting. Three slides max, using the shared-drive template; a churn range is acceptable if the number isn't final.",
    tasks: [
      "Build revenue, churn and pipeline slides (3 max)",
      "Use shared-drive board template",
      "Send churn range if final number pending",
    ],
    deadlines: [
      { label: "Slides to Aisha", due: "Tuesday, 12:00 PM" },
      { label: "Board meeting", due: "Thursday" },
    ],
    risk: "Safe",
    riskNote: "Internal domain, DMARC pass.",
    sentiment: "Neutral",
    replies: [
      {
        tone: "Commit",
        text: "Hi Aisha,\n\nUnderstood — three slides on revenue, churn and pipeline in your template, with you by Tuesday noon. Churn is still settling, so I'll include a range with a footnote.\n\nBest,",
      },
    ],
  },
  {
    id: "5",
    sender: "Devcon Asia",
    senderEmail: "tickets@devconasia.events",
    subject: "Your speaker slot is confirmed — travel form pending",
    preview: "Congratulations! Please submit your travel and dietary form by the 20th…",
    body: `Congratulations — your talk "Shipping AI features that survive production" has been accepted for the main track.

Please complete the travel and dietary form by the 20th so we can book your flights. Slides are due one week before the event.

We'll share the green room schedule closer to the date.`,
    receivedAt: "2 days ago",
    unread: false,
    important: false,
    priority: "Medium",
    category: "Events",
    summary:
      "Your main-track talk was accepted. Travel and dietary form is due by the 20th for flight booking, and slides are due one week before the event.",
    tasks: ["Submit travel and dietary form", "Prepare conference slides"],
    deadlines: [
      { label: "Travel form", due: "20th of this month" },
      { label: "Slides", due: "One week before event" },
    ],
    risk: "Safe",
    riskNote: "Expected sender, matches prior application thread.",
    sentiment: "Positive",
    replies: [
      {
        tone: "Accept",
        text: "Hi team,\n\nDelighted to be on the main track. I'll submit the travel and dietary form well before the 20th and have slides across a week ahead of the event.\n\nThanks,",
      },
    ],
  },
  {
    id: "6",
    sender: "Tom Alvarez",
    senderEmail: "t.alvarez@meridian-supply.com",
    subject: "Invoice #4821 — payment terms changed?",
    preview: "Our finance system flagged new bank details on this invoice…",
    body: `Hi,

Finance flagged invoice #4821 because the bank details differ from what we have on file. Before we release payment I need written confirmation from your side, ideally over a call.

Could you confirm whether the account change is legitimate? Payment is scheduled for the 15th.

Tom`,
    receivedAt: "3 days ago",
    unread: true,
    important: false,
    priority: "High",
    category: "Billing",
    summary:
      "Invoice #4821 lists bank details that don't match Meridian's records. Tom wants written and verbal confirmation before releasing payment, currently scheduled for the 15th. Treat as a possible invoice-fraud vector.",
    tasks: [
      "Verify bank details against internal records",
      "Call Tom on a known number to confirm",
      "Respond in writing before the 15th",
    ],
    deadlines: [{ label: "Scheduled payment", due: "The 15th" }],
    risk: "Suspicious",
    riskNote:
      "Bank-detail change mid-thread is a common invoice-fraud pattern. Verify out-of-band before any payment.",
    sentiment: "Neutral",
    replies: [
      {
        tone: "Verify first",
        text: "Hi Tom,\n\nThanks for catching this — we have not authorised a change of bank details. Please hold payment on #4821. I'm calling you on the number we have on file to verify, and I'm looping in our finance lead.\n\nBest,",
      },
    ],
  },
  {
    id: "7",
    sender: "Lena Fischer",
    senderEmail: "lena@openstack-weekly.com",
    subject: "This week in platform engineering",
    preview: "Five links worth your Tuesday: eBPF at scale, Postgres 18 notes…",
    body: `This week: eBPF observability at scale, the Postgres 18 release notes worth reading, a postmortem on a 9-hour DNS outage, and two hiring threads.

Unsubscribe anytime at the footer.`,
    receivedAt: "4 days ago",
    unread: false,
    important: false,
    priority: "Low",
    category: "Newsletter",
    summary:
      "Weekly platform-engineering roundup: eBPF observability, Postgres 18 notes, a DNS outage postmortem, and hiring threads. No action required.",
    tasks: [],
    deadlines: [],
    risk: "Safe",
    riskNote: "Subscribed newsletter, valid list-unsubscribe header.",
    sentiment: "Neutral",
    replies: [
      {
        tone: "No reply needed",
        text: "No reply required — archive or read later.",
      },
    ],
  },
];
