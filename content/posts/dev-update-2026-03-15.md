+++
date = "2026-03-15"
tags = ["Development", "Skywire"]
title = "Development Update — March 15"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

### Skywire: Docker and CI Overhaul

Today's work focused on fixing the Skywire Docker build and deployment pipeline and upgrading the frontend stack.

**Docker build fixes** — the Docker build was broken by several issues: the `+dirty` version suffix appeared in image tags because the build context had uncommitted changes, the `go sum` database check for the Skywire module was failing in containers, `git` was missing from the Docker image (needed for `GOPROXY=direct`), and `ldflags` were being passed to Docker targets that don't support them. All four issues were fixed across PRs #2215–#2218.

**Angular 21.2.4** — the Skywire Manager frontend was updated to Angular 21.2.4. Alongside this, STUN server addresses were corrected and the TPD Redis pipeline was optimized for the `/metrics` endpoint (#2214).

**GitHub Actions Node.js 24** — all GitHub Actions workflows were updated to Node.js 24-compatible action versions, suppressing deprecation warnings that would become errors in June 2026 (#2219, #2220).

**End-to-end test improvements** — the E2E Docker build for pull request CI was fixed and Skywire service startup was optimized (#2218).

These changes collectively unblock the release pipeline for v1.3.37.
