import { describe, expect, it } from "vitest";

import { extractDeadlines, extractTasks } from "@/lib/email-analysis";

const base = { senderEmail: "aisha.rahman@vertexcap.com", subject: "Q3 board deck" };

describe("task extraction", () => {
  it("extracts numbered list items", () => {
    const tasks = extractTasks({
      ...base,
      body: "Two open questions:\n1. Decide the empty states\n2. Decide the mobile nav",
    });
    expect(tasks).toEqual(["Decide the empty states", "Decide the mobile nav"]);
  });

  it("extracts imperative 'please' requests", () => {
    const tasks = extractTasks({
      ...base,
      body: "Please complete the travel and dietary form",
    });
    expect(tasks).toContain("complete the travel and dietary form");
  });

  it("de-duplicates repeated asks and returns [] when there is nothing to do", () => {
    expect(
      extractTasks({ ...base, body: "- Send slides\n- Send slides" }),
    ).toEqual(["Send slides"]);
    expect(extractTasks({ ...base, body: "Sharing this week's newsletter." })).toEqual([]);
  });
});

describe("deadline extraction", () => {
  it("finds weekday deadlines", () => {
    expect(extractDeadlines({ ...base, body: "Slides are due Tuesday please." })).toContain(
      "tuesday",
    );
  });

  it("finds ordinal date deadlines", () => {
    expect(
      extractDeadlines({ ...base, body: "Complete the form by the 20th so we can book." }),
    ).toContain("the 20th");
  });

  it("finds relative deadlines and returns [] when none exist", () => {
    expect(extractDeadlines({ ...base, body: "I need this by tomorrow." })).toContain("tomorrow");
    expect(extractDeadlines({ ...base, body: "Just an FYI, nothing needed." })).toEqual([]);
  });
});
