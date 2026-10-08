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

/** Elapsed time as m:ss, or h:mm:ss from an hour on. Negative counts as 0. */
export function formatElapsed(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000))
  const hours = Math.floor(total / 3600)
  const minutes = Math.floor((total % 3600) / 60)
  const seconds = String(total % 60).padStart(2, "0")
  return hours > 0
    ? `${hours}:${String(minutes).padStart(2, "0")}:${seconds}`
    : `${minutes}:${seconds}`
}

// Same palette as the landing page's call preview. Yellow needs dark ink.
const avatarPalette = [
  "bg-orange-1 text-white",
  "bg-purple-1 text-white",
  "bg-yellow-1 text-[#161925]",
  "bg-blue-1 text-white",
]

/** A stable avatar colour for a user, so people keep their colour. */
export function avatarColor(userId: string) {
  let hash = 0
  for (const char of userId) hash = (hash * 31 + char.charCodeAt(0)) | 0
  return avatarPalette[Math.abs(hash) % avatarPalette.length]
}

/** Up to two initials from a display name, e.g. "Amina Okafor" -> "AO". */
export function initialsOf(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return "?"
  const letters = parts.length === 1 ? parts[0].slice(0, 2) : parts[0][0] + parts[parts.length - 1][0]
  return letters.toUpperCase()
}
