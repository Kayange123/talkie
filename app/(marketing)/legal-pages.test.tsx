import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { siteLinks } from "@/config/site.links";
import PrivacyPage from "./privacy/page";
import TermsPage from "./terms/page";

describe.each([
  ["Privacy policy", PrivacyPage],
  ["Terms of service", TermsPage],
])("%s page", (title, Page) => {
  it("has a title and a last-updated date", () => {
    render(<Page />);
    expect(screen.getByRole("heading", { level: 1, name: title })).toBeInTheDocument();
    expect(screen.getByText(/last updated/i).querySelector("time")).toHaveAttribute(
      "datetime",
      expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/)
    );
  });

  it("tells people how to get in touch", () => {
    render(<Page />);
    expect(screen.getByRole("heading", { level: 2, name: "Contact" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /open an issue on github/i })).toHaveAttribute(
      "href",
      siteLinks.newIssue
    );
  });
});

describe("Privacy policy", () => {
  it("names every service that handles user data", () => {
    render(<PrivacyPage />);
    for (const service of ["Clerk", "Stream", "Vercel"]) {
      expect(
        screen.getByRole("link", { name: new RegExp(`${service}'s privacy`, "i") })
      ).toHaveAttribute("href", expect.stringMatching(/^https:\/\//));
    }
  });

  it("warns against posting personal details in public issues", () => {
    render(<PrivacyPage />);
    expect(screen.getByText(/issues are public/i)).toBeInTheDocument();
  });
});

describe("Terms of service", () => {
  it("makes recording consent the recorder's responsibility", () => {
    render(<TermsPage />);
    expect(screen.getByText(/record people without telling them/i)).toBeInTheDocument();
  });

  it("links to the privacy policy", () => {
    render(<TermsPage />);
    expect(screen.getByRole("link", { name: /privacy policy/i })).toHaveAttribute(
      "href",
      "/privacy"
    );
  });
});
