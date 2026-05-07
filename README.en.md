<div align="center">
<img width="1200" height="475" alt="DeskTab Banner" src="https://github.com/user-attachments/assets/3d723454-9d81-465a-92e1-7ecd6814219a" />
</div>

# DeskTab

[中文](./README.md) · **English** · [日本語](./README.ja.md)

A Mac-style new tab page extension for Chrome. Every new tab greets you with a frosted-glass search bar and draggable site shortcuts. Supports dark/light themes, custom wallpapers, and a customizable logo. All preferences are persisted locally via `localStorage`.

## Features

- **Google-style search bar** — Enter sends you to Google; the proportions closely match Google's native homepage.
- **Shortcut grid** — Comes preloaded with common sites (Gmail, YouTube, ChatGPT, Claude, etc.); add, edit, or remove freely.
- **Drag to reorder** — Powered by dnd-kit; press and hold for ~200ms to start dragging.
- **Long-press for edit/delete** — Hold any tile for ~600ms and a delete button appears at the top-left, an edit button at the top-right — no need to enter Customize mode.
- **Customize mode** — The Customize button at the bottom opens a control panel for icon scale, logo text, logo color style, and wallpaper upload/removal.
- **Dark / light theme** — One-click toggle; theme and all settings persist locally.
- **Icon customization** — Image icons (auto-fetched favicon or custom URL), text icons, solid or gradient backgrounds, plus multiple fonts and image scaling options.
- **Scroll support** — When shortcuts overflow one screen the grid scrolls vertically, while the search bar and bottom controls stay fixed.

## Install in Chrome

DeskTab is a Manifest V3 extension and must be built locally and loaded in developer mode.

```bash
git clone https://github.com/Shinichi-Goo/DeskTab.git
cd DeskTab
npm install
npm run build
```

Then in your browser:

1. Open `chrome://extensions`
2. Toggle on **Developer mode** (top right)
3. Click **Load unpacked**
4. Select the `dist/` directory inside the project

Every new tab will now show DeskTab. After making code changes, run `npm run build` again and click the refresh icon on the extension card to reload.

> Works in any Chromium-based browser: Edge, Brave, Arc, Vivaldi, etc.

## Local development

```bash
npm install
npm run dev
```

Vite starts a dev server at `http://localhost:3000`. You can open it as a regular tab to debug the UI — this does not override your new tab page.

Available scripts:

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server (HMR) |
| `npm run build` | Production build to `dist/` (used for the extension) |
| `npm run preview` | Preview the production build |
| `npm run lint` | TypeScript type-check |
| `npm run clean` | Delete `dist/` |

## Project structure

```
src/
├── App.tsx                    Main layout, state, Customize panel
├── main.tsx                   React entry point
├── index.css                  Tailwind v4 + theme CSS variables
├── types.ts                   Shortcut type definitions
├── components/
│   ├── SearchBar.tsx          Top logo and search bar
│   ├── ShortcutGrid.tsx       dnd-kit sortable grid
│   ├── ShortcutItem.tsx       Individual shortcut card (with long-press)
│   └── ShortcutModal.tsx      Add / edit shortcut dialog
└── lib/utils.ts               cn() class-name merge helper
public/
└── manifest.json              Chrome extension manifest (MV3)
```

## Data storage

All data lives in the browser via `localStorage`, under keys prefixed with `chrome-`:

- `chrome-shortcuts` — list of shortcuts
- `chrome-bg` — custom wallpaper (Base64)
- `chrome-icon-scale` — icon scale
- `chrome-logo-text` / `chrome-logo-style` / `chrome-logo-font` — logo settings
- `theme` — dark/light

Nothing is ever sent to a server.

## Tech stack

- **React 19** + **TypeScript**
- **Vite 6** (build tooling)
- **Tailwind CSS v4** (styling)
- **dnd-kit** (drag and drop)
- **lucide-react** (icons)
- **Chrome Extension Manifest V3**

## License

MIT
