import type { Metadata } from "next";
import { Raleway } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { appConfig } from "@/config/app.config";
import { Toaster } from "@/components/ui/toaster";
import { themeInitScript } from "@/lib/theme";
import ThemedClerkProvider from "@/providers/themed-clerk-provider";
import "@stream-io/video-react-sdk/dist/css/styles.css";

const raleway = Raleway({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: appConfig.title,
  description: appConfig.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // themeInitScript sets data-theme on <html> before hydration.
    <html lang="en" suppressHydrationWarning>
      <ThemedClerkProvider>
        <body className={`${raleway.className} bg-dark-2 text-fg antialiased`}>
          <Script id="theme-init" strategy="beforeInteractive">
            {themeInitScript}
          </Script>
          {children}
          <Toaster />
        </body>
      </ThemedClerkProvider>
    </html>
  );
}
