# slidev-theme-nll

My personal  [Slidev](https://github.com/slidevjs/slidev) theme.
It uses [Catppuccin](https://github.com/catppuccin/catppuccin)-flavoured colours and has a few custom layouts and keybindings.
Default palette is **Mocha** (dark). Pressing `d` during a presentation switches globally to **Latte** (light).

## Install

Add the theme as a local dependency in your presentation's `package.json` (it is currently not published to npm, but you can link it locally by path):

```json
{
  "dependencies": {
    "slidev-theme-nll": "file:../path/to/slidev-theme-nll"
  }
}
```

Then run `npm install` (or `pnpm install`) and reference it in your headmatter:

```yaml
---
theme: nll
---
```

## Layouts

On top of the [built-in Slidev layouts](https://sli.dev/builtin/layouts) this theme provides:

### `panels-highlight`

Full-bleed diagonal multi-panel layout. Panels can expand on click to highlight one image.

```yaml
---
layout: panels-highlight
images:
  - /image-a.png
  - /image-b.png
  - /image-c.png
offsets:        # CSS object-position per panel
  - '50% 30%'
  - '50% 50%'
  - '50% 20%'
highlighted: 2  # 1-based; panel 2 expands on click. Omit for static equal split.
---
```

| Prop            | Type       | Default                        | Description                                         |
| --------------- | ---------- | ------------------------------ | --------------------------------------------------- |
| `images`        | `string[]` | `[]`                           | Image URLs, one per panel                           |
| `offsets`       | `string[]` | `[]`                           | CSS `object-position` per panel                     |
| `highlighted`   | `number`   | `null`                         | 1-based index of panel to expand on click           |
| `expandedWidth` | `number`   | `60`                           | % of slide width given to the highlighted panel     |
| `slant`         | `number`   | `5`                            | Diagonal slant in slide-% units                     |
| `accentColor`   | `string`   | `var(--slidev-theme-primary)`  | Divider line colour                                 |

## Keybindings

This theme adds vim-style navigation on top of Slidev's defaults:

| Key | Action |
|-----|--------|
| `l` | Next animation or slide |
| `h` | Previous animation or slide |
| `j` | Next slide (skip animations) |
| `k` | Previous slide (skip animations) |

## Fonts

The theme sets **Nunito Sans** (sans-serif) and **Fira Code** (monospace) as defaults. Override in your headmatter:

```yaml
---
fonts:
  sans: Inter
  mono: JetBrains Mono
---
```

## Development

```bash
# Preview example.md with hot reload
pnpm dev

# Export the example deck to PDF
pnpm export
```

Edit `example.md` to exercise layouts, `styles/layout.css` for colours, and `setup/shortcuts.ts` for keybindings.

## Color modes

### Global toggle

Press `d` during a presentation (or click the sun/moon icon in the navigation bar) to toggle between Catppuccin **Mocha** (dark) and **Latte** (light) for the entire deck.

### Per-slide light mode

Add `class: nll-light` to any slide's frontmatter to force that slide into Catppuccin Latte, independently of the global toggle:

```yaml
---
class: nll-light
---

# This slide is always light

Even when the rest of the deck is in dark mode.
```
