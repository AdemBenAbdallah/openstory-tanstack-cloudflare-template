# Architecture Learning Guide

## Learning order

1. src/routes/ shows file-based TanStack Router pages and HTTP endpoints.
2. src/functions/ contains TanStack Start server functions and business actions.
3. src/lib/db/ contains Drizzle schema, D1 clients, and scoped database access.
4. src/lib/workflow/ is the reusable Cloudflare Workflows foundation.
5. src/lib/workflows/ contains durable feature jobs.
6. wrangler.jsonc declares the Worker bindings and each workflow.
7. e2e/ and co-located test files show the test pyramid.

## Request-to-workflow flow

    React UI or API route
      -> validated server handler
      -> D1 write through Drizzle
      -> triggerWorkflow(path, payload)
      -> Cloudflare Workflow binding
      -> durable step.do calls
      -> D1 or R2 updates
      -> UI polls or refetches state

## Key workflow files

- src/lib/workflow/client.ts: safe workflow trigger entry point.
- src/lib/workflow/trigger-bindings.ts: maps a stable path to a typed Worker binding.
- src/lib/workflow/base-workflow.ts: shared validation, scoped DB creation, failure handling, and parent-child completion behavior.
- src/lib/workflows/: business-specific WorkflowEntrypoint subclasses.
- src/server.ts: re-exports every entrypoint so Wrangler includes it in the Worker bundle.
- wrangler.jsonc: declares every binding and class_name.

## Adding a workflow

A workflow has three required wiring points, enforced by src/lib/workflow/wiring-consistency.test.ts:

1. Add name, binding, and class_name to every workflows block in wrangler.jsonc: default, production, and test.
2. Export the workflow class from src/server.ts.
3. Add its trigger path and binding to TRIGGER_TO_BINDING.

Then run bun cf:typegen, bun typecheck, and the wiring test. This avoids runtime-only missing-binding failures.

## Testing strategy

### Unit tests with Vitest

Run bun run test, never bun test. Workflow helpers and workflow behavior are tested in the same directory as their source. Tests use vi.doMock before a dynamic import when a module needs a runtime-specific mock.

Study these tests first:

- src/lib/workflow/base-workflow.test.ts: minimal WorkflowStep mock, success, cleanup, validation failures, and transient engine aborts.
- src/lib/workflow/wiring-consistency.test.ts: configuration, exports, and trigger maps stay synchronized.
- src/lib/workflow/await-child.test.ts: durable parent-child workflow fan-in.
- src/lib/workflows test files: feature workflow steps independently from Cloudflare.

Mock Cloudflare runtime objects and third-party calls, but exercise your own workflow orchestration and failure policy.

### End-to-end tests with Playwright and Workerd

bun test:e2e runs Vite with the Cloudflare plugin against the test binding set. It uses a separate local D1 database and local Miniflare R2, so it is hermetic and needs no Cloudflare credentials. Run bun test:e2e:setup before e2e when you need to prepare its D1 schema and seed data.

## Environment safety

wrangler.jsonc has three environments:

- Default: local Miniflare bindings and a deliberately fake D1 ID.
- production: real remote bindings, used only with CLOUDFLARE_ENV=production.
- test: isolated local bindings for Playwright.

Keep D1 local by default. Never set remote true on the D1 binding. The placeholder default D1 ID ensures accidental remote requests fail rather than touching production.

## Turning this into your project

1. Replace the package and Worker names with your project name.
2. Remove product-specific routes, screens, services, AI providers, and migrations in small, tested commits.
3. Keep the workflow foundation, one simple example workflow, unit tests, the wiring test, and the test environment.
4. Update .env.example, wrangler.jsonc production IDs, R2 bucket names, and Cloudflare secrets for your account. Never copy production IDs or secrets.
5. Generate new D1 migrations from schema edits using bun db:generate; do not hand-write migration SQL.

## Important commands

    bun dev
    bun run test src/lib/workflow/base-workflow.test.ts
    bun run test
    bun test:e2e:setup
    bun test:e2e
    bun typecheck
    bun lint
    bun cf:typegen
