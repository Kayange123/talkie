import { Button } from "@/components/ui/button";
import { appConfig } from "@/config/app.config";
import Link from "next/link";
import Logo from "./Logo";

const SiteHeader = () => {
  return (
    <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
      <Link href="/" aria-label={`${appConfig.title} home`}>
        <Logo />
      </Link>
      <nav aria-label="Account" className="flex items-center gap-2 sm:gap-3">
        <Button asChild className="bg-transparent text-sky-2 hover:bg-dark-3">
          <Link href="/sign-in">Sign in</Link>
        </Button>
        <Button asChild className="rounded-lg bg-blue-1 max-sm:hidden">
          <Link href="/sign-up">Start a meeting</Link>
        </Button>
      </nav>
    </header>
  );
};

export default SiteHeader;
