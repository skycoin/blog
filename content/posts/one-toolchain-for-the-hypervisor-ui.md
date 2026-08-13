+++
date = "2026-08-12"
tags = ["Development", "Skywire", "Skycoin"]
title = "One Toolchain, Two Repositories: A Cross-Repo Front-End Modernization"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

Over the past two weeks, every Angular front-end in the Skycoin and Skywire ecosystem was pulled onto one strict, modern build toolchain — the desktop wallet, the web wallet, the block explorer, and the Skywire hypervisor's "manager" UI. It happened across two separate repositories, in the same window, converging on a single shared standard. This is the story of that convergence, because the interesting part isn't any one upgrade — it's that four independently-maintained UIs ended up governed by the same rules on purpose.

None of this changes what any of these UIs *do*. It changes how much the compiler and the build can prove about them before they ever reach a browser.

### One standard, defined once

The spine of the effort is a **shared ESLint base config**. Rather than let four front-ends drift into four subtly different notions of "correct," Skycoin's repository now defines one `eslint.base.config.js` — a single correctness rule set — and its three front-ends (desktop wallet, web wallet, explorer) all extend it. Alongside it, `tsconfig` strictness was aligned so the same TypeScript guarantees hold everywhere.

Skywire's manager UI is the fourth front-end — and it lives in a *different* repository, so it can't simply import that file. The parity has to be kept by hand: the manager UI's new flat `eslint.config.js` re-implements the same rule set, and a comment in the file says so explicitly, naming the shared Skycoin config it's mirroring. Lint policy now originates in one place and is deliberately shared between the two repositories, a boundary and all.

### The modernization, in both repos

The rule-sharing rode on top of a full toolchain upgrade that landed on both sides within days of each other:

- **Angular 21 → 22**, with `@ngx-translate` moved to its v18 API and a matching TypeScript bump — thousands of lockfile lines across every project.
- **Strict TypeScript, in stages.** `strict`, `strictTemplates`, `noImplicitOverride`, `noImplicitReturns`, `noFallthroughCasesInSwitch`, and finally `strictNullChecks` — each turned on across the wallets, the explorer, and the manager UI, with the resulting "this might be null" fallout fixed honestly rather than suppressed.
- **A new build tool.** The old webpack-based Angular builder was swapped for `@angular/build`, the esbuild/Vite "application" builder, in the desktop wallet, the web wallet, the explorer, and the manager UI alike. It emits a different, content-hashed bundle layout (`chunk-*.js`, `main-*.js`, fonts under `media/`).
- **Explicit change detection, ahead of the framework.** Angular 22 makes certain change-detection behavior implicit; every project declared **OnPush** explicitly *first* — desktop wallet, web wallet, explorer, and manager UI — so the upgrade couldn't silently shift rendering semantics, with lint scripts and tests now guarding that the marks stay in place.
- **CI that builds everything.** Skycoin's CI now builds, lints, and tests every Angular front-end (and runs the explorer's e2e suite against a pinned blockchain database); Dependabot is stopped from proposing TypeScript majors that would break the pinned Angular.

The modernization that rides along with it is substantial:

- **Angular 21 → 22**, with `@ngx-translate/core` 17 → 18 and a matching TypeScript bump — a lockfile change of several thousand lines.
- **Strict TypeScript, in stages.** First `strict`, `strictTemplates`, `noImplicitOverride`, `noImplicitReturns`, `noFallthroughCasesInSwitch`; then, as its own step, the big one — `strictNullChecks`. Turning that on forces every "this might be null" the old code glossed over to be handled honestly, and the fallout was fixed across the services, the VPN feature, and the node components rather than suppressed.
- **A new build tool.** The old webpack-based Angular builder was swapped for `@angular/build`, the esbuild/Vite "application" builder. The bundle it emits has a different, content-hashed layout (`chunk-*.js`, `main-*.js`, `polyfills-*.js`, fonts relocated under `media/`).
- **Explicit change detection, ahead of the framework.** Angular 22 makes certain change-detection behavior implicit; the components were updated to declare it explicitly *first*, so the upgrade didn't silently shift rendering semantics — and a lint script now enforces that the marks stay in place.
- **A flat ESLint config** (ESLint 9, `typescript-eslint` 8) replacing the legacy `.eslintrc`.

### Guarding the bundle

Two of the changes aren't about the framework at all — they're about making the embedded-bundle problem impossible to get wrong.

The first is a **stale-bundle check**. Because the built UI is committed into the repo and compiled into the binary, it is possible to edit a component's source, forget to rebuild, and ship a binary whose served UI doesn't match its own source. A new `check-ui` make target — run in CI — builds the UI fresh and fails if the committed `pkg/visor/static` differs by so much as a byte. Source and shipped bundle can no longer drift apart unnoticed.

The second is a **browser smoke check**. After a builder swap this large, "it compiled" is not the same as "it runs." A CI script now serves the freshly built bundle and loads it in a real headless browser, asserting that the page throws no errors, logs no console errors, and resolves its translations — catching a bundle that compiles cleanly but dies on load, which is exactly the failure mode an esbuild migration can introduce.

### Does it work?

It does. On the current build, the embedded hypervisor UI loads on the new Angular-22 / esbuild bundle with **zero runtime exceptions and zero console errors**: the visor list renders in full — labels, per-type transport counts (squicr / stcpr / sudph / webrtc, in and out), DMSG server counts, versions, services, and the reward-eligibility column — the navigation across every tab is intact, and translations resolve. The strictest TypeScript settings the project has ever run under, a brand-new build pipeline, and a major framework version, and the operator-facing surface comes up looking exactly as it did before — which, for a migration this deep, is precisely the outcome you want. The interesting part happened entirely at build time.
