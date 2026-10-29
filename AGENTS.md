<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# wonderlust

Travel landing page on Next.js 16 App Router. The page itself is still unbuilt: `src/app/page.tsx` renders an empty `div`, and the design assets live in `public/images/`.

## Commands

- npm only (`package-lock.json`). There are no tests, no formatter, and no CI config — don't invent `npm test`.
- `npm run dev` — Turbopack dev server on :3000 (also rewrites the Next.js block at the top of this file; edit around it).
- `npm run build` — production build; takes ~2 min here and runs TypeScript as part of it.
- `npm run lint` — ESLint 9 flat config (`eslint.config.mjs`).
- `npx tsc --noEmit` — only works after `.next/dev/types/` exists (`next-env.d.ts` imports generated route types), so run `npm run dev` or `build` once on a fresh checkout.

## Lint is not clean at baseline

`npm run lint` currently exits 1, unrelated to whatever you are changing:

- `src/components/ui/carousel.tsx:98` — `react-hooks/set-state-in-effect`
- `src/hooks/use-mobile.ts:14` — same rule
- `src/app/page.tsx:1` — unused `Image` warning

The first two fire on vendored shadcn code under the newer `react-hooks` rules. Leave them alone unless your task is about those files.

## UI conventions

- shadcn `base-nova` registry: `src/components/ui/*` is built on `@base-ui/react`, **not** Radix. Add components with `npx shadcn add <name>` instead of hand-writing Radix-based versions.
- `cn` comes from the `cn` package (clsx + tailwind-merge replacement): `import { cn } from "cn"`. `src/lib/utils.ts` only re-exports it. Don't add `clsx`/`tailwind-merge`.
- `cn` and `shadcn` are runtime deps (`globals.css` imports `shadcn/tailwind.css`), not just CLI tooling — don't remove them.
- Tailwind v4 has no `tailwind.config.*` or `postcss.config.*`: theme tokens belong in `src/app/globals.css` (`@theme inline`), and CSS is compiled through the `turbopack.rules` entry in `next.config.ts`.
- React Compiler is enabled (`reactCompiler: true` in `next.config.ts`).
- Routes live under `src/app` (there is no root `app/`); alias `@/*` maps to `src/*`. Next 16 route helpers such as `LayoutProps<"/">` are global — no import.

## Custom pieces

- `src/lib/highlighter.tsx` — Shiki with lazily imported languages. Register new languages in its `languages` map (plus `aliases` if needed); don't switch to the full `shiki` bundle.
- `src/hooks/use-highlighted-code.ts` — streaming highlight where completed lines are tokenized once and the last line is re-tokenized each render.
