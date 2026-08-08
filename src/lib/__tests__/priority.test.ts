import { describe, expect, it } from "vitest";

import { detectPriority } from "@/lib/email-analysis";
import { demoEmails } from "@/lib/demo-emails";

describe("email priority detection", () => {
  it("flags contract/payment urgency as High", () => {
    expect(
      detectPriority({
        senderEmail: "priya.nair@northwind.io",
        subject: "Contract renewal — signature needed before Friday",
        body: "We need your signature today, the deadline is Friday 5pm.",
      }),
    ).toBe("High");
  });

  it("treats review/feedback requests as Medium", () => {
    expect(
      detectPriority({
        senderEmail: "marcus@brightlayer.design",
        subject: "Design handoff — v3 screens are in Figma",
        body: "Please review the screens and share feedback.",
      }),
    ).toBe("Medium");
  });

  it("treats newsletters as Low", () => {
    expect(
      detectPriority({
        senderEmail: "lena@openstack-weekly.com",
        subject: "This week in platform engineering",
        body: "Five links worth your Tuesday. Unsubscribe anytime at the footer.",
      }),
    ).toBe("Low");
  });

  it("never escalates phishing bait to High", () => {
    expect(
      detectPriority({
        senderEmail: "no-reply@account-verify-secure.net",
        subject: "Urgent: your mailbox will be deactivated in 24 hours",
        body: "Verify your credentials immediately to avoid data loss.",
      }),
    ).toBe("Low");
  });

  it("only ever returns one of the three levels", () => {
    for (const email of demoEmails) {
      expect(["High", "Medium", "Low"]).toContain(
        detectPriority({
          senderEmail: email.senderEmail,
          subject: email.subject,
          body: email.body,
        }),
      );
    }
  });
});
