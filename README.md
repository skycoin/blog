![skycoin blog logo](https://user-images.githubusercontent.com/26845312/32426756-27c29fd4-c282-11e7-8c9b-b0aa179a03ab.png)

# Skycoin Blog

https://skycoin.github.io/blog/

This blog uses [Hugo](https://gohugo.io/) to generate a static website from markdown files.

## Preview Locally

```sh
hugo serve
```

## Writing Posts

Posts are markdown files in `content/posts/`. Each post has TOML front matter:

```toml
+++
date = "2026-03-21"
tags = ["Guides", "Skycoin"]
title = "Your Post Title"
image = "img/skycoin-banner.png"
+++
```

- `image` controls the thumbnail on listing pages. Posts without an `image` default to the Skycoin banner. If a `-card.png` variant exists alongside the image, it is used for listing cards and social sharing previews.
- `aliases` — add old URLs here if you change a post's URL, to preserve links.
- `redirectURL` — redirect to a different URL instead of showing the post (special cases only).

### Code Blocks

Use fenced code blocks with language hints for syntax highlighting, copy buttons, and proper formatting:

- `` ```bash `` — shell commands users should copy (gets a copy button)
- `` ```toml `` / `` ```json `` — configuration files (gets a copy button)
- `` ```text `` — command output, help menus, ASCII art (no copy button)

The blog uses the [Mononoki](https://madmalik.github.io/mononoki/) font for code blocks.

## Translations

See [Hugo multilingual docs](https://gohugo.io/content-management/multilingual/).

To add a translation, change the file extension from `.md` to `.$LANG.md` (e.g., `.de.md` for German). Add new languages to `config.toml` if not already configured.

## Theme and Styling

The theme is in `themes/skycoin/`. Styles use SCSS — edit only the `.scss` files in `themes/skycoin/static/css/scss/`.

To recompile CSS after making changes:

```sh
cd themes/skycoin
npx sass static/css/scss/main.scss static/css/main.css --style=compressed
```

The compiled `main.css` must be committed — it is not built during deployment.

## Shortcodes

### inline-images

Place images side-by-side (responsive, no limit on count):

```
{{< inline-images >}}
  {{< img src="url-1" alt="" >}}
  {{< img src="url-2" alt="" >}}
{{< /inline-images >}}
```

