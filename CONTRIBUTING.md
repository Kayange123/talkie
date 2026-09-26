# Contributing to Talkie

Thanks for helping out. Bug reports, fixes and small improvements are all welcome.

## Reporting a bug or asking for a feature

[Open an issue](https://github.com/Kayange123/talkie/issues/new). For a bug, include what you did, what you expected, and what happened instead. Screenshots help.

Please don't report security problems in a public issue. See [SECURITY.md](SECURITY.md).

## Setting up

You need Node.js 22.12 or newer, plus free [Clerk](https://clerk.com) and [Stream](https://getstream.io/video/) accounts for the API keys.

```bash
npm install
cp .env.example .env.local   # then fill in your keys
npm run dev
```

## Making a change

1. Fork the repo and create a branch from `develop` (not `main`).
2. Keep each pull request to one change. Smaller PRs get reviewed faster.
3. Before you push, make sure these pass:

   ```bash
   npm run lint
   npm run typecheck
   npm test
   ```

4. Add or update tests for behaviour you change. Tests live next to the code as `*.test.ts(x)`.
5. Open a pull request against `develop` and describe what changed and why.

## Commit messages

We use [Conventional Commits](https://www.conventionalcommits.org), for example:

```
fix(meeting-room): hide end-call button from non-hosts
feat(landing): add a public landing page
docs: update setup instructions
```

## Licence

Talkie is released under the [MIT licence](LICENSE). By contributing, you agree that your contributions are licensed under it too.
