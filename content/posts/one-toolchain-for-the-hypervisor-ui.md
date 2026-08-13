+++
date = "2026-08-12"
tags = ["Development", "Skywire"]
title = "One Toolchain for the Hypervisor UI: Strict TypeScript, Angular 22, and a Bundle That Can't Drift"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

The Skywire hypervisor's web UI — the "manager" interface where you watch your visors, transports, rewards, and the network graph — is an Angular application. It is also *embedded*: the built bundle is compiled into the visor binary and served straight off the node, so the copy in the repository and the copy shipping in `pkg/visor/static` have to stay in lockstep. Over the past week that UI got a top-to-bottom toolchain modernization, bringing it up to the same strict frontend standard the rest of the Skycoin ecosystem already runs, and wrapping it in CI guards so it can't quietly regress.

None of this changes what the UI *does*. It changes how much the compiler and the build can prove about it before it ever reaches a browser.

### Matching a standard that lives in another repository

Skycoin maintains a shared ESLint base config — a single set of correctness rules — used across its front-end projects. Skywire's manager UI lives in a *different* repository, so it can't simply import that file. The parity has to be kept by hand: the new flat `eslint.config.js` in the manager UI re-implements the same rule set, and a comment in the file says so explicitly, naming the shared config it's mirroring. That is the through-line of the whole effort — pulling one of the ecosystem's UIs onto the same modern, strict footing as the others, even across a repository boundary that prevents literally sharing the file.

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
