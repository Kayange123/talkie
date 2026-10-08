import { appConfig } from "@/config/app.config";
import { siteLinks } from "@/config/site.links";
import Link from "next/link";
import Logo from "./Logo";

type FooterLink = { label: string; href: string };

// Grouped by what a visitor is looking for; the headings name the groups.
const groups: { title: string; links: FooterLink[] }[] = [
  {
    title: "Product",
    links: [
      { label: "Sign in", href: "/sign-in" },
      { label: "Create an account", href: "/sign-up" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms of service", href: "/terms" },
      { label: "Privacy policy", href: "/privacy" },
    ],
  },
  {
    title: "Open source",
    links: [
      { label: "Source code", href: siteLinks.repo },
      { label: "Contributing", href: siteLinks.contributing },
      { label: "Report an issue", href: siteLinks.newIssue },
      { label: "Security", href: siteLinks.security },
    ],
  },
];

const isExternal = (href: string) => href.startsWith("http");

const SiteFooter = () => {
  return (
    <footer className="border-t border-white/[0.06]">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-x-6 gap-y-10 px-5 py-14 sm:px-8 md:grid-cols-[1.3fr_repeat(3,1fr)] md:gap-8">
        <div className="col-span-2 md:col-span-1">
          <Logo />
          <p className="mt-4 max-w-[30ch] leading-relaxed text-sky-1/70">
            Video meetings for small teams. Start a call, send one link,
            get back to work.
          </p>
        </div>

        {groups.map(({ title, links }) => (
          <nav key={title} aria-label={title}>
            <h2 className="text-sm font-bold text-white">{title}</h2>
            <ul className="mt-4 flex flex-col gap-3">
              {links.map(({ label, href }) => (
                <li key={label}>
                  {isExternal(href) ? (
                    <a
                      href={href}
                      className="text-sky-1/70 transition-colors hover:text-white"
                    >
                      {label}
                    </a>
                  ) : (
                    <Link
                      href={href}
                      className="text-sky-1/70 transition-colors hover:text-white"
                    >
                      {label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="border-t border-white/[0.06]">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-5 py-6 text-sm text-sky-1/55 sm:px-8">
          <p>
            &copy; {new Date().getFullYear()} {appConfig.title}
          </p>
          <p>
            Released under the{" "}
            <a href={siteLinks.license} className="underline-offset-4 hover:text-white hover:underline">
              MIT licence
            </a>
            .
          </p>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
