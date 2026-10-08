"use client";

import { useTheme } from "@/hooks/use-theme";
import { ClerkProvider } from "@clerk/nextjs";
import React from "react";

// Clerk's appearance takes concrete colours, so pick a palette per theme.
const palettes = {
  dark: {
    colorForeground: "#ffffff",
    colorMutedForeground: "#C9DDFF",
    colorBackground: "#1C1F2E",
    colorInput: "#252A41",
    colorInputForeground: "#ffffff",
    colorNeutral: "#ffffff",
  },
  light: {
    colorForeground: "#161925",
    colorMutedForeground: "#4A5578",
    colorBackground: "#ffffff",
    colorInput: "#E4E8F2",
    colorInputForeground: "#161925",
    colorNeutral: "#161925",
  },
};

const ThemedClerkProvider = ({ children }: { children: React.ReactNode }) => {
  const { resolved } = useTheme();

  return (
    <ClerkProvider
      afterSignOutUrl="/"
      appearance={{
        variables: { colorPrimary: "#0E78F9", ...palettes[resolved] },
        options: {
          logoImageUrl: "/icons/home-logo.svg",
          socialButtonsVariant: "iconButton",
        },
      }}
    >
      {children}
    </ClerkProvider>
  );
};

export default ThemedClerkProvider;
