# TanStack Start + Cloudflare Template

A hands-on learning template derived from the MIT-licensed OpenStory project. It keeps a production-oriented TanStack Start and Cloudflare Workers architecture so you can study, modify, and reuse the patterns in future projects.

This is intentionally a reference template, not a minimal starter. It includes the complete application source to demonstrate real application boundaries, workflows, tests, migrations, and deployment configuration. Remove product modules as you build your own app.

## Stack

- Bun package manager and task runner
- React 19, TanStack Start, TanStack Router, and TanStack Query
- Cloudflare Workers via the Vite plugin and Workerd locally
- Cloudflare D1 with Drizzle ORM
- Cloudflare R2 storage
- Cloudflare Workflows for durable asynchronous jobs
- Better Auth, Zod, Tailwind, shadcn/ui, Vitest, and Playwright

## Start here

1. Read TEMPLATE-GUIDE.md.
2. Install dependencies with bun install.
3. Run bun dev. The setup script creates local environment values, applies local D1 migrations, seeds data, then starts Workerd.
4. Study the example workflow path described in the guide.

## Everyday commands

    bun dev                 Local Workerd app with local D1, R2, and Workflows
    bun run test            Vitest unit tests
    bun test:e2e            Playwright e2e suite
    bun typecheck           TypeScript native preview checker
    bun lint                Type-aware oxlint
    bun run build           Production Vite build

## License and attribution

This template retains the original MIT License and copyright notice from OpenStory. Before publishing a derived project, replace application-specific names, deployment bindings, documentation, and assets with your own.
