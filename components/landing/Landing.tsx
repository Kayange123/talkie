import CallPreview from "./CallPreview";
import { Button } from "@/components/ui/button";
import { appConfig } from "@/config/app.config";
import { Video } from "lucide-react";
import Link from "next/link";

// The life of a meeting, in order. The numbering on the page reflects that.
const steps: { title: string; body: string }[] = [
  {
    title: "Start now, or schedule it",
    body: "Open a meeting instantly, or pick a date and time. Scheduled meetings wait under Upcoming until it's time.",
  },
  {
    title: "Send one link",
    body: "Everyone joins from the same link. Your personal room has a link that never changes, which suits recurring check-ins.",
  },
  {
    title: "Check your camera and mic",
    body: "See yourself and pick your devices before you go in. Join muted if you're somewhere noisy.",
  },
  {
    title: "Meet",
    body: "Switch between grid and speaker view. When you're done, end the meeting for everyone in one click.",
  },
  {
    title: "Catch up later",
    body: "Recordings stay with the meeting, so anyone who missed it can watch it back.",
  },
];

const Logo = () => (
  <span className="flex items-center gap-2.5">
    <span className="flex-center size-9 rounded-xl bg-blue-1">
      <Video className="size-5 text-white" />
    </span>
    <span className="text-xl font-extrabold tracking-tight text-white">
      {appConfig.title}
    </span>
  </span>
);

const Landing = () => {
  return (
    <div className="min-h-screen bg-dark-2 text-white">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
        <Link href="/" aria-label={`${appConfig.title} home`}>
          <Logo />
        </Link>
        <nav className="flex items-center gap-2 sm:gap-3">
          <Button asChild className="bg-transparent text-sky-2 hover:bg-dark-3">
            <Link href="/sign-in">Sign in</Link>
          </Button>
          <Button asChild className="rounded-lg bg-blue-1 max-sm:hidden">
            <Link href="/sign-up">Start a meeting</Link>
          </Button>
        </nav>
      </header>

      <main>
        <section className="mx-auto grid max-w-6xl items-center gap-12 px-5 pb-20 pt-10 sm:px-8 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:pb-28 lg:pt-16">
          <div>
            <h1 className="max-w-[13ch] text-balance text-[clamp(2.6rem,6.2vw,4.9rem)] font-extrabold leading-[1.02] tracking-[-0.035em]">
              Get your team on a call in one click.
            </h1>
            <p className="mt-6 max-w-[42ch] text-lg leading-relaxed text-sky-1/85 sm:text-xl">
              Talkie runs in the browser. Start a meeting, send the link, and
              everyone&apos;s in. Nothing to install, no dial-in codes.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Button asChild size="lg" className="rounded-xl bg-blue-1 px-7 text-base font-semibold">
                <Link href="/sign-up">Start a meeting</Link>
              </Button>
              <Button
                asChild
                size="lg"
                className="rounded-xl bg-dark-3 px-7 text-base font-semibold"
              >
                <Link href="/sign-in">Sign in</Link>
              </Button>
            </div>
          </div>

          <CallPreview />
        </section>

        <section
          aria-labelledby="how-it-works"
          className="border-t border-white/[0.06] bg-dark-1/40"
        >
          <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[1fr_1.4fr] lg:gap-16 lg:py-28">
            <div className="lg:sticky lg:top-12 lg:self-start">
              <h2
                id="how-it-works"
                className="text-[clamp(2rem,4vw,3rem)] font-extrabold leading-[1.08] tracking-[-0.03em]"
              >
                How a meeting goes
              </h2>
              <p className="mt-4 max-w-[36ch] text-lg leading-relaxed text-sky-1/80">
                From the first link to the recording, in five steps. Nobody on
                your team needs a tutorial.
              </p>
            </div>

            <ol className="relative">
              {steps.map(({ title, body }, i) => (
                <li
                  key={title}
                  className="relative grid grid-cols-[3rem_1fr] gap-x-5 pb-12 last:pb-0 sm:grid-cols-[3.5rem_1fr] sm:gap-x-7"
                >
                  {i < steps.length - 1 && (
                    <span
                      aria-hidden
                      className="absolute left-6 top-14 h-[calc(100%-3.5rem)] w-px bg-dark-3 sm:left-7 sm:top-16 sm:h-[calc(100%-4rem)]"
                    />
                  )}
                  <span
                    aria-hidden
                    className="flex-center size-12 rounded-full bg-dark-3 text-lg font-bold text-sky-1 sm:size-14 sm:text-xl"
                  >
                    {i + 1}
                  </span>
                  <div className="pt-1.5 sm:pt-2.5">
                    <h3 className="text-xl font-bold sm:text-2xl">{title}</h3>
                    <p className="mt-2 max-w-[52ch] text-[1.0625rem] leading-relaxed text-sky-1/85">
                      {body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-20 text-center sm:px-8 lg:py-28">
          <h2 className="mx-auto max-w-[18ch] text-[clamp(2rem,4.5vw,3.4rem)] font-extrabold leading-[1.06] tracking-[-0.03em]">
            Your next meeting is one link away.
          </h2>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="rounded-xl bg-blue-1 px-7 text-base font-semibold">
              <Link href="/sign-up">Create an account</Link>
            </Button>
            <Button asChild size="lg" className="rounded-xl bg-dark-3 px-7 text-base font-semibold">
              <Link href="/sign-in">Sign in</Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/[0.06]">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-8 text-sm text-sky-1/60 sm:px-8">
          <Logo />
          <p>&copy; {new Date().getFullYear()} {appConfig.title}</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
