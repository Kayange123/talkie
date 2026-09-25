import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getBaseUrl() {
  if (typeof window !== "undefined") return window.location.origin
  return (process.env.NEXT_PUBLIC_BASE_URL ?? "").trim().replace(/\/$/, "")
}

export function getMeetingLink(id: string, personal = false) {
  return `${getBaseUrl()}/meeting/${id}${personal ? "?personal=true" : ""}`
}

/**
 * Accepts a full invite link ("https://host/meeting/abc?personal=true")
 * or a bare meeting ID and returns the in-app path, or null if invalid.
 */
export function parseMeetingInput(input: string) {
  const value = input.trim()
  if (!value) return null

  const match = value.match(/\/meeting\/([^/?#\s]+)(\?[^#\s]*)?/)
  if (match) return `/meeting/${match[1]}${match[2] ?? ""}`

  if (/^[\w-]+$/.test(value)) return `/meeting/${value}`
  return null
}
