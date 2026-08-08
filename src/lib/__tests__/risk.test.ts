import { describe, expect, it } from "vitest";

import { classifyRisk } from "@/lib/email-analysis";
import { demoEmails } from "@/lib/demo-emails";

describe("phishing / security risk classification", () => {
  it("marks look-alike domain + credential bait as Phishing", () => {
    expect(
      classifyRisk({
        senderEmail: "no-reply@account-verify-secure.net",
        subject: "Urgent: your mailbox will be deactivated in 24 hours",
        body: "Verify your credentials immediately or face irreversible data loss.",
      }),
    ).toBe("Phishing");
  });

  it("marks mid-thread bank detail changes as Suspicious", () => {
    expect(
      classifyRisk({
        senderEmail: "t.alvarez@meridian-supply.com",
        subject: "Invoice #4821 — payment terms changed?",
        body: "Our finance system flagged new bank details on this invoice.",
      }),
    ).toBe("Suspicious");
  });

  it("marks credential bait from a normal domain as Suspicious, not Phishing", () => {
    expect(
      classifyRisk({
        senderEmail: "it@northwind.io",
        subject: "Password reset",
        body: "Please re-validate your access before Friday.",
      }),
    ).toBe("Suspicious");
  });

  it("leaves ordinary business mail Safe", () => {
    expect(
      classifyRisk({
        senderEmail: "marcus@brightlayer.design",
        subject: "Design handoff",
        body: "v3 is live in Figma with dev notes.",
      }),
    ).toBe("Safe");
  });

  it("agrees with the demo dataset on the phishing email", () => {
    const phishing = demoEmails.find((e) => e.risk === "Phishing")!;
    expect(
      classifyRisk({
        senderEmail: phishing.senderEmail,
        subject: phishing.subject,
        body: phishing.body,
      }),
    ).toBe("Phishing");
  });
});
