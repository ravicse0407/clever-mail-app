import { describe, expect, it } from "vitest";

import { analyzeEmail, categorize } from "@/lib/email-analysis";

describe("email categorization", () => {
  const cases: [string, string, string][] = [
    ["Contracts", "Contract renewal — signature needed", "Legal cleared the redlines on the MSA."],
    ["Billing", "Invoice #4821 — payment terms changed?", "Our finance system flagged new bank details."],
    ["Design", "Design handoff — v3 screens are in Figma", "All 14 screens are componentised."],
    ["Finance", "Q3 board deck", "I need revenue and churn slides."],
    ["Events", "Your speaker slot is confirmed", "Please submit the travel form."],
    ["Security Alert", "Mailbox deactivated", "Verify your credentials now."],
  ];

  it.each(cases)("labels %s emails", (category, subject, body) => {
    expect(categorize({ senderEmail: "someone@example.com", subject, body })).toBe(category);
  });

  it("falls back to General for unclassifiable mail", () => {
    expect(
      categorize({ senderEmail: "a@b.com", subject: "Hello", body: "Just saying hi." }),
    ).toBe("General");
  });

  it("exposes the category through the combined analysis", () => {
    const analysis = analyzeEmail({
      senderEmail: "tom@meridian-supply.com",
      subject: "Invoice #4821",
      body: "Finance flagged the bank details on this invoice.",
    });
    expect(analysis.category).toBe("Billing");
    expect(analysis.risk).toBe("Suspicious");
  });
});
