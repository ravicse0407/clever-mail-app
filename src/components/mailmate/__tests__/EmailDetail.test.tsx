import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { EmailDetail } from "@/components/mailmate/EmailDetail";
import { demoEmails } from "@/lib/demo-emails";
import { pickReply } from "@/lib/email-analysis";

const email = demoEmails[0]!;

function renderDetail(overrides: Partial<React.ComponentProps<typeof EmailDetail>> = {}) {
  const props = {
    email,
    onToggleImportant: vi.fn(),
    onToggleTask: vi.fn(),
    completedTasks: [] as string[],
    ...overrides,
  };
  render(<EmailDetail {...props} />);
  return props;
}

describe("smart reply generation", () => {
  it("wraps tone selection around the available replies", () => {
    expect(pickReply(email, 0)?.tone).toBe(email.replies[0]!.tone);
    expect(pickReply(email, email.replies.length)?.tone).toBe(email.replies[0]!.tone);
    expect(pickReply({ ...email, replies: [] }, 0)).toBeNull();
  });

  it("fills the composer when Generate Reply is clicked", async () => {
    const user = userEvent.setup();
    renderDetail();

    const composer = screen.getByPlaceholderText(/demo composer/i) as HTMLTextAreaElement;
    expect(composer.value).toBe("");

    await user.click(screen.getByRole("button", { name: /generate reply/i }));

    await waitFor(
      () => expect(composer.value).toBe(email.replies[0]!.text),
      { timeout: 3000 },
    );
  });

  it("generates the reply matching the selected tone", async () => {
    const user = userEvent.setup();
    renderDetail();

    const secondTone = email.replies[1]!;
    await user.click(screen.getByRole("button", { name: secondTone.tone }));

    const composer = screen.getByPlaceholderText(/demo composer/i) as HTMLTextAreaElement;
    await waitFor(() => expect(composer.value).toBe(secondTone.text), { timeout: 3000 });
  });

  it("keeps Send disabled until a reply exists", async () => {
    const user = userEvent.setup();
    renderDetail();

    const send = screen.getByRole("button", { name: /send \(demo\)/i });
    expect(send).toBeDisabled();

    await user.click(screen.getByRole("button", { name: /generate reply/i }));
    await waitFor(() => expect(send).toBeEnabled(), { timeout: 3000 });
  });
});

describe("email detail UI behaviour", () => {
  it("renders the AI analysis for the selected email", () => {
    renderDetail();
    expect(screen.getByRole("heading", { name: email.subject })).toBeInTheDocument();
    expect(screen.getByText(email.summary)).toBeInTheDocument();
    expect(screen.getByText(email.riskNote)).toBeInTheDocument();
    for (const task of email.tasks) {
      expect(screen.getByText(task)).toBeInTheDocument();
    }
  });

  it("calls handlers for Mark Important and task toggles", async () => {
    const user = userEvent.setup();
    const props = renderDetail({ email: { ...email, important: false } });

    await user.click(screen.getByRole("button", { name: /mark important/i }));
    expect(props.onToggleImportant).toHaveBeenCalledWith(email.id);

    await user.click(screen.getAllByRole("checkbox")[0]!);
    expect(props.onToggleTask).toHaveBeenCalledWith(email.id, email.tasks[0]);
  });
});
