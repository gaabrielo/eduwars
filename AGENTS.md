# AGENTS.md — Rules for AI Agents Working on This Project

> This document is the source of truth for every AI agent (planning or execution) operating in this repository through opencode. Read it in full before starting any task. If a user instruction conflicts with anything written here, the agent must surface the conflict explicitly and ask how to proceed rather than silently picking one side or the other.
>
> This project is reviewed by a human at the end of the workflow, often briefly, to save tokens. That means agents are expected to be more conservative and more self-checking than usual — mistakes that would normally get caught in a careful line-by-line review may instead ship. Treat correctness, scope discipline, and security as your responsibility, not the reviewer's safety net.

---

## 1. Project Context

This is a 2D top-down game in the spirit of Pokémon Red and other classic top-down RPGs: tile-based movement, a fixed camera perspective, NPCs, dialogue, an inventory system, and persistent player progress. The game runs inside a Next.js web application and uses Supabase as its backend for authentication and data persistence (save files, player accounts, progress).

Because the game logic (a real-time loop running at ~60fps) and the web application (React component tree, routing, server communication) are two very different execution models living in the same codebase, most bugs and architectural drift in this project come from agents blurring the line between them. A recurring theme in this document is: **keep the game engine and the web app cleanly separated, and never let one leak into the other's responsibilities.**

---

## 2. Technology Stack (fixed — do not deviate)

| Layer | Choice | Notes |
|---|---|---|
| Framework | Next.js 14.0.4 | App Router (not Pages Router) |
| Language | TypeScript | `strict` mode enabled in `tsconfig.json` |
| Styling | Tailwind CSS | No CSS Modules, no styled-components, no inline `style={{}}` except for values computed at runtime (e.g. sprite position) that genuinely cannot be expressed as a Tailwind class |
| Backend / DB | Supabase | Postgres, Auth, Row Level Security (RLS) |
| Game rendering | Native Canvas API | Custom-built engine — no Phaser, no PixiJS, no other game framework |
| Game state | Zustand | One store per domain, not a single monolithic store |

**Agents must not introduce a new library, framework, or major dependency** (a different state manager, a game engine, an ORM, a CSS-in-JS solution, a different auth provider, etc.) without first asking the human. This includes seemingly small utility libraries that duplicate something Zustand, Tailwind, or the Supabase client already does. The cost of an extra dependency in a low-review-bandwidth workflow is higher than it looks: it adds a decision the human never explicitly approved, and it's easy for a future agent to assume it was a deliberate, reviewed choice.

If a task seems to require a new dependency to be done "properly," the correct move is to implement it with what's already available and note in the task summary that a dependency would have made it cleaner, rather than installing it unilaterally.

---

## 3. Game Architecture — Strict Rules

This is the section most likely to be violated by multiple agents working independently, because each agent, in isolation, can write code that "works" while quietly duplicating or bypassing the shared architecture. Every rule below exists specifically to prevent that.

### 3.1 Single Game Loop

There is exactly one game loop, driven by a single `requestAnimationFrame` chain, responsible for both updating game state and triggering rendering. This loop lives in one identifiable module (the engine's entry point).

- No agent may create a second loop, a parallel `setInterval`/`setTimeout` cycle, or a `requestAnimationFrame` call anywhere outside the designated loop module to drive game logic.
- If a new feature seems to need "its own tick" (e.g. an NPC schedule system, a day/night cycle, a cutscene timer), it must hook into the existing loop's update phase, not spin up an independent one. Two independent timing sources in a real-time game are a classic source of desync bugs (things drifting out of sync at different frame rates, especially on slower devices) and they are extremely hard to debug after the fact.

### 3.2 Update/Render Separation

Game logic and drawing logic must be kept in physically separate functions:

- **Update functions** (`update(dt: number)`) contain all state mutation: movement, collision resolution, AI decisions, timers, animation frame advancement. They receive a delta-time value and must be frame-rate independent (movement should be `velocity * dt`, never a fixed per-frame increment) so the game behaves consistently regardless of the device's refresh rate.
- **Render functions** (`render(ctx: CanvasRenderingContext2D)`) only read state and draw. They must never mutate game state, advance timers, resolve collisions, or have any other side effect. A render function should be safe to call twice in a row with no observable difference in game state.

If an agent finds itself computing something inside a render function that isn't purely derived from already-updated state (e.g. "let me just check collision here while I'm drawing"), that is a signal the logic belongs in `update`, not `render`.

### 3.3 Tile System

The map is a grid of fixed-size tiles. The tile size is defined once as a named constant (e.g. `TILE_SIZE`) in a single configuration module and imported everywhere it's needed.

- Never hardcode a tile dimension (`16`, `32`, `48`, etc.) directly in feature code. If a value like that shows up in a new file, it should be imported from the shared constant, not re-typed.
- Grid-to-pixel and pixel-to-grid conversions should go through shared helper functions, not be reimplemented ad hoc (`x * TILE_SIZE` scattered everywhere is a maintenance trap the moment `TILE_SIZE` needs to change or a camera offset is introduced).

### 3.4 Collision

All collision detection and resolution lives in a single, well-defined module (e.g. `lib/game/collision.ts`).

- No new feature — a new enemy type, a new interactive object, a new NPC behavior — should implement its own from-scratch collision check. It should call into and, if necessary, extend the existing collision module.
- If the existing collision system genuinely cannot support a new use case (e.g. circular hitboxes when only tile-based AABB collision exists today), the agent should flag this as an architectural decision for the human rather than quietly bolting on a parallel collision system that only the new feature uses.

### 3.5 Rendering Layers

Rendering happens in a fixed, explicit, documented order (for example: ground → static objects → entities → player → particle/visual effects → UI overlay). This order must be defined in one place and referenced, not re-derived per feature.

- Any agent adding a new visual layer (a weather effect, a lighting overlay, a new UI element drawn on canvas) must state explicitly where in this ordering the new layer belongs and why, rather than just nudging draw calls around until it "looks right." Rendering order bugs (an effect drawn under the player when it should be over, UI hidden behind the map) are easy to introduce silently and easy to miss in a quick review, since they may only be visible in specific game states.

### 3.6 Assets

Sprites, tilesets, and other game assets live under `/public/assets/...` with a consistent naming convention (to be kept consistent with whatever convention already exists in the repository — if none exists yet, establish one and document it rather than improvising per-file).

- Never duplicate an asset under a slightly different name "to avoid breaking something." If an asset needs to change, update its references. Duplicate, near-identical assets are a common source of visual bugs where an old, stale sprite reappears because one reference was never updated.

---

## 4. State Management (Zustand)

- **One store per domain.** Expected stores include (naming is illustrative, follow whatever already exists in the repo): `usePlayerStore` (position, facing direction, stats), `useInventoryStore` (items, equipment), `useDialogueStore` (active conversation, dialogue queue), `useGameStateStore` (current scene/map, progress flags, save state). Do not consolidate unrelated domains into a single mega-store — it makes selective subscriptions and testing harder and increases the odds of two agents editing the same file for unrelated reasons.
- **State must only be mutated through store actions.** Never reach into a store's internal state and mutate it directly from a component or a game module. All mutations should be named, intention-revealing actions (`movePlayer`, `addItem`, `advanceDialogue`), not generic setters that let callers push in arbitrary state.
- **Persistence actions must be explicit.** Any action that writes to Supabase (saving progress, syncing inventory) must be its own clearly named function (e.g. `savePlayerProgress`), called deliberately from a specific trigger point (save menu, checkpoint, autosave timer). It must never be a hidden side effect buried inside an unrelated UI setter — a reviewer skimming a diff should be able to tell, just from the action's name, that it touches the network/database.
- **Decouple 60fps game state from React re-render state.** Values that change every frame purely for rendering purposes (smoothed sub-tile position for animation, interpolated camera position, particle positions) should generally live in refs or in the engine's own internal state, not in a Zustand store that triggers React re-renders on every update. Only put values in a Zustand store if UI components actually need to reactively read them (health displayed in a HUD, items shown in an inventory panel, dialogue text shown in a text box). Putting frame-by-frame data in React state is a common and easy-to-miss source of performance degradation, since it "works" in dev and only becomes visibly janky under load or on weaker devices.

---

## 5. Supabase — Security Rules (Non-Negotiable)

This is the highest-stakes area of the codebase, because a mistake here doesn't just create a bug — it can expose or corrupt other users' data, and the mistake may not be visible just from playing the game normally. These rules apply regardless of how urgent a task seems or how much simpler it would be to bypass them temporarily "just to get something working."

1. **Never disable, remove, or weaken a Row Level Security (RLS) policy to make a blocked query succeed.** If a query is being blocked by RLS, the correct fix is almost always one of: (a) the policy is missing a legitimate case and needs to be expanded correctly, (b) the query is being made with the wrong auth context (e.g. missing the user's session), or (c) the query genuinely shouldn't be allowed and the calling code is wrong. Turning off RLS, or replacing a policy with something permissive, is never an acceptable shortcut — it must be treated as a data breach risk, not a debugging technique.
2. **Never use the `service_role` key anywhere that runs in the browser.** This includes any file marked `"use client"`, any client-side hook, any code bundled into the browser JS. The service role key bypasses RLS entirely; if it ends up in client-side code it is exposed to every user of the app. Service role usage is only acceptable in server-only code (Next.js Route Handlers, Server Actions, server-only utility modules that are never imported from a client component) — and even there, only when the task genuinely requires bypassing RLS (e.g. a trusted server-side migration script), not as a general convenience.
3. **Never expose the service role key or any other secret via a `NEXT_PUBLIC_*` environment variable.** Anything prefixed `NEXT_PUBLIC_` is shipped to the browser by Next.js. Only the anon/public key should ever use that prefix.
4. **Every new table must have RLS enabled from the moment it is created**, not added later "once it's working." A table with RLS off by default, even temporarily during development, is a common way for an oversight to survive into production.
5. **Avoid `USING (true)` / `WITH CHECK (true)` as a default or a shortcut.** These effectively disable the policy's filtering. They are only acceptable for data that is genuinely meant to be fully public (e.g. static game configuration readable by anyone), and even then the migration should include a comment explaining why the table is intentionally open.
6. **Destructive migrations require explicit sign-off before execution.** `DROP TABLE`, `TRUNCATE`, dropping or altering a column in a way that loses data, or anything similarly irreversible must be called out clearly in the task plan before it runs — not discovered after the fact in a diff.

**Mandatory checklist whenever a task touches Supabase in any way:**
- [ ] Does every new or modified table have RLS enabled?
- [ ] Does the policy check something meaningful about the requesting user (typically `auth.uid()` matched against an owner column), rather than just "is authenticated"?
- [ ] Could any client-side call, as written, return or modify another user's data due to a missing or incorrect filter?
- [ ] Is the service role key confined to server-only code, and absent from anything that ships to the browser?
- [ ] If this migration is destructive, has that been explicitly flagged?

---

## 6. Code Conventions

- **Naming:** `camelCase` for variables and functions, `PascalCase` for React components and TypeScript types/interfaces, `SCREAMING_SNAKE_CASE` for game configuration constants (`TILE_SIZE`, `PLAYER_SPEED`, `MAP_WIDTH`).
- **TypeScript strictness:** `any` should not appear in new code without a comment directly above it explaining why a more specific type isn't feasible. Prefer `unknown` plus narrowing over `any` when the type genuinely can't be known upfront.
- **File responsibility:** one component or module per responsibility. If an agent notices a file accumulating unrelated logic (a component that both renders UI and contains game update logic, a "utils" file that keeps absorbing unrelated helpers), that is a signal to propose splitting it, not to keep appending to it.
- **Suggested folder structure** (adapt to whatever already exists in the repo, but keep it consistent once established — do not introduce a second, competing structure):
  ```
  app/            → Next.js routes (App Router)
  components/     → React components (UI, HUD, menus, overlays)
  lib/game/       → the engine itself: loop, collision, tiles, sprites, input handling
  lib/supabase/   → Supabase clients, queries, and migration files
  stores/         → Zustand stores
  types/          → shared TypeScript types and interfaces
  public/assets/  → sprites, tilesets, audio
  ```
- **Comments:** written in English, consistently. Do not mix languages within the same file.
- **No dead code left behind:** if a refactor makes a function, import, or file obsolete, remove it in the same task rather than leaving it "just in case."

---

## 7. Multi-Agent Collaboration Rules

Because this project is worked on by multiple AI agents with limited human review, the discipline described here matters more than it would on a single-agent, heavily-reviewed project.

- **Plan before code.** The planning agent must list, explicitly, exactly which files will be created or modified before execution begins. The execution agent should not touch files outside that list without first stating why the scope needed to expand.
- **Stay in scope.** If an agent notices a bug, a code smell, or technical debt unrelated to the current task, it should be **reported** in the task summary, not fixed inline. Unrequested "drive-by" fixes are one of the most expensive things to review, because they hide the actual requested change inside unrelated diffs, and they are exactly the kind of change most likely to slip through a fast review unnoticed.
- **Reuse before creating.** Before writing a new function — a collision check, a formatting helper, a Supabase query, a validation routine — search the codebase for something that already does it or something close to it. Prefer extending an existing utility over writing a parallel one, even if the existing one isn't a perfect fit; propose the extension rather than duplicating.
- **Preserve existing conventions.** If two agents work on different parts of the same feature, both must follow whatever pattern is already established elsewhere in the codebase, even if one agent personally judges a different pattern to be cleaner. Introducing a second convention "because it's better" creates inconsistency that a fast human review is unlikely to catch, and inconsistency compounds every time another agent copies the newer pattern without realizing it's non-standard.
- **Never invent an API.** Do not assume a Supabase method, a Next.js 14 API, or a library function exists or behaves a certain way without verifying it — check `package.json` for the actual installed version, check the relevant type definitions, or check the code that already uses it elsewhere in the repo. If an agent is genuinely uncertain whether something exists or behaves as expected, it must state that assumption explicitly in the task summary rather than silently guessing at a function signature. A confidently-invented API call that compiles-looking but is subtly wrong is much harder for a fast reviewer to catch than an honest "I wasn't sure about X, please check."
- **Flag ambiguity instead of silently resolving it in the direction that's easiest to implement.** When a task description is ambiguous in a way that affects architecture, security, or user-visible behavior (not just cosmetic details), state the assumption made and why, so the reviewer can catch a wrong guess quickly instead of having to reverse-engineer the agent's reasoning from the diff.

---

## 8. Pre-Delivery Checklist

Every task should be self-verified against this list before being handed back for human review:

- [ ] `tsc --noEmit` passes with no errors
- [ ] No new `any` without an explanatory comment
- [ ] No new dependency was added without prior approval
- [ ] If Supabase was touched: the full checklist in Section 5 has been walked through
- [ ] If the game loop, collision system, or tile system was touched: no parallel/duplicate logic was introduced elsewhere
- [ ] No dead code, unused imports, or leftover debug `console.log` statements
- [ ] The task summary clearly states: what changed, why, which files were touched, and any assumptions made along the way — written so a reviewer can verify correctness in a skim rather than by re-deriving the logic from scratch

---

## 9. Absolute Prohibitions

These are not judgment calls — they should never happen, under any framing of "just this once" or "to unblock the task":

- Disabling RLS, weakening an RLS policy, or using the `service_role` key in client-side code.
- Exposing any secret via a `NEXT_PUBLIC_*` environment variable.
- Creating a second game loop, a second collision system, or any other parallel implementation of something that already has a canonical home in the codebase.
- Installing a new dependency without explicit approval.
- Performing a broad, unrequested refactor "while I was in there" as part of an otherwise small task.
- Silencing a type error with `@ts-ignore` or `@ts-expect-error` instead of fixing the underlying type issue.
- Running a destructive database migration without first flagging it clearly.
