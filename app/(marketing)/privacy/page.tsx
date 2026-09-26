import LegalPage from "@/components/landing/LegalPage";
import { appConfig } from "@/config/app.config";
import { siteLinks } from "@/config/site.links";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Privacy policy | ${appConfig.title}`,
  description: `What ${appConfig.title} collects, why, and who it's shared with.`,
};

// Keep this in step with what the app actually does. If a new service
// starts receiving user data, it belongs in "Who handles your data".
const PrivacyPage = () => {
  return (
    <LegalPage
      title="Privacy policy"
      updated="2026-09-26"
      summary="Talkie collects what it needs to sign you in and run your meetings, and nothing else. There are no ads, no tracking and no selling of data."
    >
      <h2>What we collect</h2>
      <ul>
        <li>
          <strong>Your account:</strong> your name, email address, username
          and profile picture, as you give them when you sign up.
        </li>
        <li>
          <strong>Your meetings:</strong> each meeting&apos;s description,
          start time, who created it and who was invited.
        </li>
        <li>
          <strong>Your calls:</strong> audio, video and screen shares are sent
          through our video provider so others in the call can see and hear
          you. They aren&apos;t stored unless the meeting is recorded.
        </li>
        <li>
          <strong>Recordings:</strong> when a meeting is recorded, the
          recording is stored so it can be watched later.
        </li>
        <li>
          <strong>Technical logs:</strong> our hosting provider keeps standard
          request logs, such as IP addresses and browser type, to run and
          secure the service.
        </li>
      </ul>

      <h2>How we use it</h2>
      <p>
        Only to provide Talkie: signing you in, showing your upcoming and
        previous meetings, connecting your calls, and letting you play back
        recordings. We don&apos;t use your data for advertising, and we
        don&apos;t sell it or share it with anyone except the services below.
      </p>

      <h2>Who handles your data</h2>
      <p>Talkie relies on three services, each with its own privacy policy:</p>
      <ul>
        <li>
          <strong>Clerk</strong> manages accounts and sign-in. Read{" "}
          <a href="https://clerk.com/legal/privacy">Clerk&apos;s privacy policy</a>.
        </li>
        <li>
          <strong>Stream</strong> carries calls and stores meeting details and
          recordings. Read{" "}
          <a href="https://getstream.io/legal/privacy/">Stream&apos;s privacy policy</a>.
        </li>
        <li>
          <strong>Vercel</strong> hosts the website. Read{" "}
          <a href="https://vercel.com/legal/privacy-notice">Vercel&apos;s privacy notice</a>.
        </li>
      </ul>
      <p>These services may process data outside your country.</p>

      <h2>Who can see what</h2>
      <ul>
        <li>People in a call see your name, picture, video and audio.</li>
        <li>
          Anyone with a meeting&apos;s link can join it, so share links only
          with people you mean to invite.
        </li>
        <li>
          Recordings are listed for the people who created or were invited to
          the meeting. Anyone with a recording&apos;s link can watch it while
          the link is valid.
        </li>
      </ul>

      <h2>Cookies</h2>
      <p>
        Talkie only uses the cookies needed to keep you signed in. There are no
        analytics or advertising cookies.
      </p>

      <h2>How long we keep it</h2>
      <p>
        Your account and meetings are kept until your account is deleted.
        Recordings are kept until they&apos;re deleted. To delete your account
        or a recording, or to get a copy of your data, see{" "}
        <a href="#contact">Contact</a> below.
      </p>

      <h2>Your rights</h2>
      <p>
        Depending on where you live, you may have the right to access, correct,
        delete or export your personal data, or to object to how it&apos;s used.
        We&apos;ll help with any of these.
      </p>

      <h2>Children</h2>
      <p>Talkie isn&apos;t meant for anyone under 16.</p>

      <h2>Changes</h2>
      <p>
        If this policy changes, we&apos;ll update the date at the top of this
        page. The full history is public in the{" "}
        <a href={siteLinks.repo}>source code</a>.
      </p>

      <h2 id="contact">Contact</h2>
      <p>
        For questions or requests about your data,{" "}
        <a href={siteLinks.newIssue}>open an issue on GitHub</a>. Issues are
        public, so please don&apos;t include personal details. Say what you
        need, and we&apos;ll follow up.
      </p>
    </LegalPage>
  );
};

export default PrivacyPage;
