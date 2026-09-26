import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { siteLinks } from "@/config/site.links";
import SiteFooter from "./SiteFooter";

const linkIn = (group: string, name: RegExp) =>
  within(screen.getByRole("navigation", { name: group })).getByRole("link", {
    name,
  });

describe("SiteFooter", () => {
  it("links to the legal pages", () => {
    render(<SiteFooter />);
    expect(linkIn("Legal", /terms of service/i)).toHaveAttribute("href", "/terms");
    expect(linkIn("Legal", /privacy policy/i)).toHaveAttribute("href", "/privacy");
  });

  it("links to the repo's source, contributing guide, issues and security policy", () => {
    render(<SiteFooter />);
    expect(linkIn("Open source", /source code/i)).toHaveAttribute("href", siteLinks.repo);
    expect(linkIn("Open source", /contributing/i)).toHaveAttribute(
      "href",
      siteLinks.contributing
    );
    expect(linkIn("Open source", /report an issue/i)).toHaveAttribute(
      "href",
      siteLinks.newIssue
    );
    expect(linkIn("Open source", /security/i)).toHaveAttribute("href", siteLinks.security);
  });

  it("links to sign-in and sign-up", () => {
    render(<SiteFooter />);
    expect(linkIn("Product", /sign in/i)).toHaveAttribute("href", "/sign-in");
    expect(linkIn("Product", /create an account/i)).toHaveAttribute("href", "/sign-up");
  });

  it("states the licence and the current year", () => {
    render(<SiteFooter />);
    expect(screen.getByRole("link", { name: /mit licence/i })).toHaveAttribute(
      "href",
      siteLinks.license
    );
    expect(
      screen.getByText(new RegExp(`© ${new Date().getFullYear()}`))
    ).toBeInTheDocument();
  });

  it("only links to this repository on GitHub", () => {
    render(<SiteFooter />);
    const external = screen
      .getAllByRole("link")
      .map((link) => link.getAttribute("href")!)
      .filter((href) => href.startsWith("http"));

    expect(external.length).toBeGreaterThan(0);
    for (const href of external) expect(href.startsWith(siteLinks.repo)).toBe(true);
  });
});
