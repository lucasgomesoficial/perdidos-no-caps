# Contentful Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace Sanity with Contentful while preserving the published group content and the existing public UI behavior.

**Architecture:** Keep `GroupContent` as the CMS-independent boundary. A Contentful client supplies one configured `groupPage` entry to the existing group service, and the mapper converts resolved entries and assets into the current domain types. A separate local migration utility creates the Contentful model and copies the published Sanity document without exposing management credentials to the browser.

**Tech Stack:** React 19, TypeScript, Vite, Vitest, Contentful JavaScript SDK, Contentful Management SDK

**Spec:** `docs/superpowers/specs/2026-09-29-contentful-migration-design.md`

## Global Constraints

- Preserve the current visual output, skeleton, fallback, controller/view split, and `GroupContent` interface.
- Use Contentful Space `nofz0vh5p7s4` and environment `master` by default.
- Read exactly the entry configured by `VITE_CONTENTFUL_GROUP_PAGE_ENTRY_ID`.
- Put only the read-only Delivery token in a `VITE_*` variable; never persist or bundle a management token.
- Preserve the Sanity project and its content as a recovery source after removing Sanity code from the application.
- Use TDD for every behavior change and run the complete suite after each task.

## Review Focus

- Missing or malformed Contentful environment variables must return local fallback without issuing a request.
- Unresolved references in `rules` or `events` must be skipped without discarding valid siblings.
- Protocol-relative Contentful asset URLs must become HTTPS; foreign hosts and invalid dimensions must be rejected.
- A rejected or aborted Contentful request must end loading without replacing fallback content or causing a stale update.
- Re-running the migration must update stable entries and assets rather than creating duplicates.

---

### Task 1: Contentful delivery adapter

**Files:**
- Create: `src/services/contentful/client.ts`
- Modify: `src/features/group/group.service.ts`
- Modify: `src/features/group/group.mapper.ts`
- Modify: `src/features/group/group.service.test.ts`
- Modify: `src/features/group/group.mapper.test.ts`
- Modify: `package.json`
- Modify: `package-lock.json`

**Interfaces:**
- Consumes: `VITE_CONTENTFUL_SPACE_ID`, `VITE_CONTENTFUL_ENVIRONMENT`, `VITE_CONTENTFUL_DELIVERY_TOKEN`, `VITE_CONTENTFUL_GROUP_PAGE_ENTRY_ID`, and an `AbortSignal`.
- Produces: `contentfulClient`, `contentfulGroupPageEntryId`, `normalizeContent(input: unknown): GroupContent`, and `loadGroupContent(signal: AbortSignal): Promise<GroupContent>`.

- [ ] **Step 1: Add failing mapper tests for Contentful entries and assets**

Add tests asserting that `normalizeContent()` reads `entry.fields`, resolved rule/event references and `Asset.fields.file.details.image`; converts `//images.ctfassets.net/...` to HTTPS with `w=1200&fm=webp`; preserves an event when its asset is invalid; and skips unresolved reference link objects.

- [ ] **Step 2: Run mapper tests and verify the Contentful fixture fails**

Run: `npm test -- src/features/group/group.mapper.test.ts`

Expected: FAIL because the mapper still expects the Sanity asset shape and top-level fields.

- [ ] **Step 3: Implement the CMS-independent mapper changes**

Update `normalizeContent(input: unknown): GroupContent` so it accepts a resolved Contentful entry while retaining validation, trimming, social-domain restrictions, fallbacks, and the existing `GroupContent` output.

- [ ] **Step 4: Run mapper tests and verify they pass**

Run: `npm test -- src/features/group/group.mapper.test.ts`

Expected: PASS.

- [ ] **Step 5: Add failing service tests for configuration and entry lookup**

Test that missing/malformed configuration returns fallback without a request, valid configuration calls `withoutUnresolvableLinks.getEntry(configuredEntryId, {include: 2})`, and aborting the supplied signal rejects the service wait with `AbortError` before normalization.

- [ ] **Step 6: Run service tests and verify they fail for the Sanity implementation**

Run: `npm test -- src/features/group/group.service.test.ts`

Expected: FAIL because no Contentful client or Entry ID exists.

- [ ] **Step 7: Install the supported delivery SDK and implement the adapter**

Install `contentful`; create a client only for valid complete public configuration; replace the GROQ request with `withoutUnresolvableLinks.getEntry()`. Wrap the SDK promise in a focused abort helper because the JavaScript SDK has no per-call `AbortSignal`; remove the listener after resolution or rejection.

- [ ] **Step 8: Verify Task 1**

Run: `npm test`

Expected: all tests pass.

- [ ] **Step 9: Commit the delivery adapter**

```bash
git add package.json package-lock.json src/services/contentful src/features/group
git commit -m "feat: read group content from Contentful"
```

### Task 2: Idempotent model and content migration

**Files:**
- Create: `scripts/contentful/migration-core.mjs`
- Create: `scripts/contentful/migration-core.test.ts`
- Create: `scripts/contentful/migrate.mjs`
- Create: `scripts/contentful/source-content.json`
- Modify: `package.json`
- Modify: `package-lock.json`

**Interfaces:**
- Consumes: `CONTENTFUL_MANAGEMENT_TOKEN`, `CONTENTFUL_SPACE_ID`, optional `CONTENTFUL_ENVIRONMENT`, and the exported published group content.
- Produces: published Content Types `groupPage`, `groupRule`, `groupEvent`; stable published entries/assets; and the singleton group-page Entry ID printed to stdout.

- [ ] **Step 1: Export the current published Sanity document**

Query document ID `groupPage`, resolve its event image URL and dimensions, remove Sanity metadata, and save only public page fields to `scripts/contentful/source-content.json`. Verify the export contains the current rules and events before continuing.

- [ ] **Step 2: Add failing tests for stable migration identifiers and model definitions**

Test deterministic IDs for the singleton, rules, events and assets; required field definitions; reference validations; list order preservation; and rejection of a missing management token.

- [ ] **Step 3: Run migration-core tests and verify they fail**

Run: `npm test -- scripts/contentful/migration-core.test.ts`

Expected: FAIL because the migration core does not exist.

- [ ] **Step 4: Implement pure migration definitions**

Export pure functions that build the three Content Type definitions, deterministic resource IDs, localized field payloads and ordered Link arrays from `source-content.json`.

- [ ] **Step 5: Run migration-core tests and verify they pass**

Run: `npm test -- scripts/contentful/migration-core.test.ts`

Expected: PASS.

- [ ] **Step 6: Install the management SDK and implement the executor**

Install `contentful-management` as a development dependency. Implement create-or-update and publish operations for Content Types, assets and entries. Read the management token only from the process environment, never log it, and print the singleton Entry ID plus the exact frontend variable name when complete.

- [ ] **Step 7: Authenticate and run the migration against Space `nofz0vh5p7s4`**

Run with `CONTENTFUL_MANAGEMENT_TOKEN` supplied outside versioned files and `CONTENTFUL_SPACE_ID=nofz0vh5p7s4`. Confirm all three Content Types and the singleton entry are published in `master`.

- [ ] **Step 8: Re-run the migration to prove idempotency**

Expected: the same IDs are updated, counts do not increase, and the command succeeds.

- [ ] **Step 9: Commit migration tooling without credentials**

```bash
git add package.json package-lock.json scripts/contentful
git commit -m "feat: migrate group content to Contentful"
```

### Task 3: Remove Sanity and update project configuration

**Files:**
- Modify: `.env.example`
- Modify: `.env.local` without staging it
- Modify: `README.md`
- Modify: `tsconfig.json`
- Modify: `package.json`
- Modify: `package-lock.json`
- Delete: `src/services/sanity/client.ts`
- Delete: `sanity.config.ts`
- Delete: `sanity.cli.ts`
- Delete: `sanity/schemaTypes/event.ts`
- Delete: `sanity/schemaTypes/groupPage.ts`
- Delete: `sanity/schemaTypes/rule.ts`
- Delete: `migrations/rules-to-objects.ts`
- Delete: `migrations/rules-to-objects.test.ts`

**Interfaces:**
- Consumes: the published Contentful singleton Entry ID from Task 2.
- Produces: documented local and Vercel configuration with no runtime or build dependency on Sanity.

- [ ] **Step 1: Add Contentful variables locally and to the example file**

Set Space ID `nofz0vh5p7s4`, environment `master`, Delivery token, and singleton Entry ID in `.env.local`; include empty safe examples in `.env.example`.

- [ ] **Step 2: Remove Sanity files, scripts, packages and TypeScript includes**

Uninstall `sanity` and `@sanity/client`; remove `studio` scripts and Sanity-only package overrides; delete the listed files; retain no management credential.

- [ ] **Step 3: Rewrite the README around Contentful**

Document content publishing, editor invitations, environment variables, the model/migration command, fallback behavior, Vercel variables, and the rule that only published entries appear on the site.

- [ ] **Step 4: Verify no application or documentation reference depends on Sanity**

Run: `rg -n "sanity|SANITY" . --glob '!node_modules' --glob '!dist' --glob '!scripts/contentful/source-content.json' --glob '!docs/superpowers/**'`

Expected: no matches.

- [ ] **Step 5: Run the full local checks**

Run: `npm test && npm run build`

Expected: all tests pass and the production site builds.

- [ ] **Step 6: Commit removal and documentation**

```bash
git add .env.example README.md tsconfig.json package.json package-lock.json src sanity.config.ts sanity.cli.ts sanity migrations
git commit -m "chore: remove Sanity integration"
```

### Task 4: Live delivery validation

**Files:**
- Modify only if validation exposes a tested integration defect.

**Interfaces:**
- Consumes: published Contentful content and configured Vercel environment variables.
- Produces: a verified local and deployed site using Contentful.

- [ ] **Step 1: Start the Vite application with Contentful configuration**

Run: `npm run dev`

Expected: the published name, rules, event and event image load; skeleton disappears; console has no failed Contentful request.

- [ ] **Step 2: Exercise the fallback intentionally**

Temporarily use an invalid Entry ID locally, reload, and confirm the page remains usable with local fallback and without an endless skeleton. Restore the valid ID.

- [ ] **Step 3: Configure the same four public variables in Vercel and deploy**

Use the existing Vercel project. Do not add the management token. Wait for the deployment to finish successfully.

- [ ] **Step 4: Validate the production site and editorial flow**

Open the deployed site, then make and publish a harmless Contentful text edit, reload after CDN propagation, and verify the new value appears. Restore the approved text if the check changed visible copy.

- [ ] **Step 5: Run final automated verification**

Run: `npm test && npm run build`

Expected: all tests and build pass with no Sanity dependency.

- [ ] **Step 6: Commit any test-backed correction found during validation**

If no correction was required, leave the tree clean apart from any pre-existing user changes.
