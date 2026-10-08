import React from "react";

interface LegalPageProps {
  title: string;
  /** ISO date (YYYY-MM-DD) the text last changed. */
  updated: string;
  summary: string;
  children: React.ReactNode;
}

const LegalPage = ({ title, updated, summary, children }: LegalPageProps) => {
  const updatedLabel = new Date(`${updated}T00:00:00Z`).toLocaleDateString(
    "en-GB",
    { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }
  );

  return (
    <main className="mx-auto max-w-3xl px-5 pb-24 pt-10 sm:px-8 lg:pt-16">
      <h1 className="text-[clamp(2.25rem,5vw,3.5rem)] font-extrabold leading-[1.05] tracking-[-0.03em]">
        {title}
      </h1>
      <p className="mt-4 text-sky-1/60">
        Last updated <time dateTime={updated}>{updatedLabel}</time>
      </p>
      <p className="mt-8 text-xl leading-relaxed text-sky-1/90">{summary}</p>

      <div
        className={[
          "mt-12 max-w-[68ch] leading-relaxed text-sky-1/80",
          "[&_h2]:mb-4 [&_h2]:mt-12 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:tracking-[-0.01em] [&_h2]:text-white",
          "[&_p+p]:mt-4 [&_p]:text-[1.0625rem]",
          "[&_ul]:mt-4 [&_ul]:flex [&_ul]:list-disc [&_ul]:flex-col [&_ul]:gap-2 [&_ul]:pl-5 [&_li]:pl-1 [&_ul+p]:mt-4",
          "[&_strong]:font-semibold [&_strong]:text-white",
          "[&_a]:text-white [&_a]:underline [&_a]:decoration-blue-1 [&_a]:decoration-2 [&_a]:underline-offset-4 hover:[&_a]:decoration-white",
        ].join(" ")}
      >
        {children}
      </div>
    </main>
  );
};

export default LegalPage;
