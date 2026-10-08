// Copies Stream's background-blur model files into public/ so they are
// served from our own domain instead of unpkg.com. Runs on postinstall.
import { cp, rm, stat } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const source = join(root, "node_modules/@stream-io/video-filters-web/mediapipe");
const target = join(root, "public/vendor/video-filters/mediapipe");

try {
  await stat(source);
} catch {
  console.warn("[copy-filter-assets] @stream-io/video-filters-web not installed; skipping.");
  process.exit(0);
}

await rm(target, { recursive: true, force: true });
await cp(source, target, { recursive: true });
console.log("[copy-filter-assets] Copied background blur assets to public/vendor/video-filters.");
