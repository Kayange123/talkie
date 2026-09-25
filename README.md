# Talkie

Video meetings built with Next.js 14 (App Router), [Clerk](https://clerk.com) for authentication and [Stream Video](https://getstream.io/video/) for calls.

## Features

- Instant meetings, scheduled meetings and joining by link or meeting ID
- A permanent personal room per user
- Upcoming and previous meetings, plus call recordings
- Device check before joining, and grid or speaker layouts in the call

## Getting started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env.local` and fill in your keys:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` from the Clerk dashboard
   - `NEXT_PUBLIC_STREAM_API_KEY` and `STREAM_SECRET_KEY` from the Stream dashboard
   - `NEXT_PUBLIC_BASE_URL`, used as a fallback when building invite links

3. Start the dev server:

   ```bash
   npm run dev
   ```

   Then open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command             | What it does                  |
| ------------------- | ----------------------------- |
| `npm run dev`       | Start the development server  |
| `npm run build`     | Build for production          |
| `npm run lint`      | Run ESLint                    |
| `npm run typecheck` | Type-check with `tsc`         |

CI runs lint and the type check on every push and pull request to `main` and `develop`.
