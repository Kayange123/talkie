import LegalPage from "@/components/landing/LegalPage";
import { appConfig } from "@/config/app.config";
import { siteLinks } from "@/config/site.links";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: `Terms of service | ${appConfig.title}`,
  description: `The rules for using ${appConfig.title}.`,
};

const TermsPage = () => {
  return (
    <LegalPage
      title="Terms of service"
      updated="2026-09-26"
      summary="By creating an account or joining a meeting on Talkie, you agree to these terms. They're written to be read, so please do."
    >
      <h2>Your account</h2>
      <p>
        You&apos;re responsible for your account and what happens in it. Give
        accurate details when you sign up, keep your sign-in secure, and tell
        us if you think someone else has access to it. You must be at least 16
        to use Talkie.
      </p>

      <h2>Using Talkie</h2>
      <p>Don&apos;t use Talkie to:</p>
      <ul>
        <li>break the law or help anyone else break it;</li>
        <li>harass, threaten or abuse other people;</li>
        <li>share content you don&apos;t have the right to share;</li>
        <li>
          record people without telling them. Many places require everyone in
          a call to agree before it&apos;s recorded, and it&apos;s up to you to
          get that agreement;
        </li>
        <li>
          attack, overload or try to get around the security of the service.
        </li>
      </ul>
      <p>
        We may suspend or close accounts that break these rules.
      </p>

      <h2>Your content</h2>
      <p>
        What you say and share in meetings, and any recordings, belong to you
        and the other participants. You let us store and transmit that content
        only as needed to run Talkie. How we handle personal data is covered in
        the <Link href="/privacy">privacy policy</Link>.
      </p>

      <h2>The service</h2>
      <p>
        Talkie is provided as is, without any warranty. We work to keep it
        running, but calls can drop, features can change, and the service may
        be unavailable or discontinued. Don&apos;t rely on it as your only way
        to hold a critical meeting.
      </p>

      <h2>Liability</h2>
      <p>
        To the extent the law allows, we aren&apos;t liable for any indirect or
        consequential losses from using Talkie, or for losses caused by other
        people in your meetings.
      </p>

      <h2>Open source</h2>
      <p>
        Talkie&apos;s source code is available under the{" "}
        <a href={siteLinks.license}>MIT licence</a>. These terms cover using
        the hosted service; the licence covers using the code.
      </p>

      <h2>Changes to these terms</h2>
      <p>
        If these terms change, we&apos;ll update the date at the top of this
        page. Continuing to use Talkie after a change means you accept the new
        terms.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about these terms?{" "}
        <a href={siteLinks.newIssue}>Open an issue on GitHub</a>.
      </p>
    </LegalPage>
  );
};

export default TermsPage;
