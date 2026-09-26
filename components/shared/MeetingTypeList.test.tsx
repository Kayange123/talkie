import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import MeetingTypeList from "./MeetingTypeList";

const push = vi.fn();
vi.mock("next/navigation", () => ({ useRouter: () => ({ push }) }));

vi.mock("@clerk/nextjs", () => ({ useUser: () => ({ user: { id: "user_1" } }) }));

const toast = vi.fn();
vi.mock("@/components/ui/use-toast", () => ({ useToast: () => ({ toast }) }));

const stream = vi.hoisted(() => {
  const getOrCreate = vi.fn();
  const client = {
    call: vi.fn((_type: string, id: string) => ({ id, getOrCreate })),
  };
  return { getOrCreate, client };
});

vi.mock("@stream-io/video-react-sdk", () => ({
  useStreamVideoClient: () => stream.client,
}));

// Format a Date the way a datetime-local input expects (local time).
const toLocalInput = (date: Date) =>
  new Date(date.getTime() - date.getTimezoneOffset() * 60_000)
    .toISOString()
    .slice(0, 16);

const openCard = (name: RegExp) =>
  userEvent.click(screen.getByRole("button", { name }));

describe("MeetingTypeList", () => {
  beforeEach(() => {
    push.mockReset();
    toast.mockReset();
    stream.getOrCreate.mockReset().mockResolvedValue({});
    stream.client.call.mockClear();
  });

  describe("instant meeting", () => {
    it("creates a call starting now and navigates to it", async () => {
      render(<MeetingTypeList />);
      await openCard(/new meeting/i);

      const before = Date.now();
      await userEvent.click(screen.getByRole("button", { name: /start meeting/i }));

      await waitFor(() => expect(push).toHaveBeenCalledOnce());
      const [, callId] = stream.client.call.mock.calls[0];
      expect(push).toHaveBeenCalledWith(`/meeting/${callId}`);

      const { data } = stream.getOrCreate.mock.calls[0][0];
      expect(data.custom.description).toBe("Instant meeting");
      expect(new Date(data.starts_at).getTime()).toBeGreaterThanOrEqual(
        before - 1000
      );
    });
  });

  describe("scheduled meeting", () => {
    it("saves the chosen time and shows the link instead of navigating", async () => {
      render(<MeetingTypeList />);
      await openCard(/schedule meeting/i);

      const when = new Date(Date.now() + 2 * 24 * 60 * 60_000);
      when.setSeconds(0, 0);
      await userEvent.type(
        screen.getByLabelText(/description/i),
        "Sprint planning"
      );
      fireEvent.change(screen.getByLabelText(/date and time/i), {
        target: { value: toLocalInput(when) },
      });
      await userEvent.click(screen.getByRole("button", { name: /schedule meeting/i }));

      await waitFor(() =>
        expect(
          screen.getByRole("heading", { name: /meeting scheduled/i })
        ).toBeInTheDocument()
      );
      const { data } = stream.getOrCreate.mock.calls[0][0];
      expect(data.starts_at).toBe(when.toISOString());
      expect(data.custom.description).toBe("Sprint planning");
      expect(push).not.toHaveBeenCalled();
    });

    it("rejects a time in the past without creating a call", async () => {
      render(<MeetingTypeList />);
      await openCard(/schedule meeting/i);

      fireEvent.change(screen.getByLabelText(/date and time/i), {
        target: { value: toLocalInput(new Date(Date.now() - 60 * 60_000)) },
      });
      await userEvent.click(screen.getByRole("button", { name: /schedule meeting/i }));

      expect(toast).toHaveBeenCalledWith(
        expect.objectContaining({ title: expect.stringMatching(/future/i) })
      );
      expect(stream.getOrCreate).not.toHaveBeenCalled();
    });

    it("rejects an empty date without crashing", async () => {
      render(<MeetingTypeList />);
      await openCard(/schedule meeting/i);

      fireEvent.change(screen.getByLabelText(/date and time/i), {
        target: { value: "" },
      });
      await userEvent.click(screen.getByRole("button", { name: /schedule meeting/i }));

      expect(toast).toHaveBeenCalledWith(
        expect.objectContaining({ title: "Pick a date and time" })
      );
      expect(stream.getOrCreate).not.toHaveBeenCalled();
    });

    it("doesn't jump into the meeting when no description is given", async () => {
      render(<MeetingTypeList />);
      await openCard(/schedule meeting/i);

      await userEvent.click(screen.getByRole("button", { name: /schedule meeting/i }));

      await waitFor(() =>
        expect(
          screen.getByRole("heading", { name: /meeting scheduled/i })
        ).toBeInTheDocument()
      );
      expect(stream.getOrCreate.mock.calls[0][0].data.custom.description).toBe(
        "Scheduled meeting"
      );
      expect(push).not.toHaveBeenCalled();
    });

    it("tells the user when creating the call fails", async () => {
      vi.spyOn(console, "error").mockImplementation(() => {});
      stream.getOrCreate.mockRejectedValue(new Error("boom"));
      render(<MeetingTypeList />);
      await openCard(/schedule meeting/i);

      await userEvent.click(screen.getByRole("button", { name: /schedule meeting/i }));

      await waitFor(() =>
        expect(toast).toHaveBeenCalledWith(
          expect.objectContaining({ title: "Failed to create meeting" })
        )
      );
    });
  });

  describe("join meeting", () => {
    it.each([
      ["a full invite link", "https://talkie.app/meeting/abc-123", "/meeting/abc-123"],
      ["a bare meeting id", "abc-123", "/meeting/abc-123"],
    ])("navigates when given %s", async (_label, input, path) => {
      render(<MeetingTypeList />);
      await openCard(/join meeting/i);

      await userEvent.type(screen.getByPlaceholderText(/meeting link or id/i), input);
      await userEvent.click(screen.getByRole("button", { name: /^join meeting$/i }));

      expect(push).toHaveBeenCalledWith(path);
    });

    it("refuses links to other sites", async () => {
      render(<MeetingTypeList />);
      await openCard(/join meeting/i);

      await userEvent.type(
        screen.getByPlaceholderText(/meeting link or id/i),
        "https://evil.example/phish{Enter}"
      );

      expect(push).not.toHaveBeenCalled();
      expect(toast).toHaveBeenCalledWith(
        expect.objectContaining({ variant: "destructive" })
      );
    });
  });
});
